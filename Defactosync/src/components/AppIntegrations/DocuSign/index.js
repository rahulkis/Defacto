import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
    AUTH_INTEGRATION,
    DocuSign_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import { WEBHOOK_URLS, DOCUSIGN_WEBHOOK_URLS } from "constants/AppConst";

class DocuSign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedCLI: props.selectedCLI,
            selectedAPI: props.selectedAPI,
            isReconnectId: props.isReconnectId,
        };
    }
    componentDidMount() {
        if (this.props.onOpen) {
            document.getElementById("DocuSignDivId").click();
        }
    }
    onCode = async (code, params) => {

        this.setState({ isLoading: true });
        try {
            this.props.OnLoading();

            await this.getAccessToken(
                code,
                this.state.selectedCLI,
                this.state.selectedAPI
            );
        } catch (error) {
            this.props.OnLoading();
            this.setState({ isLoading: false });
            showErrorToaster(error);
        }
    };

    getAccessToken = async (code, cliType, apiName) => {
        if (code) {
            let formModel = {
                APIUrl: DocuSign_AUTH_URLS.ACCESS_TOKEN_URL,
                headerValue: {
                    Authorization:
                        "Basic " +
                        btoa(DocuSign_AUTH_URLS.CLIENT_ID + ":" + DocuSign_AUTH_URLS.SECERT_KEY),
                },
                bodyInfo: {
                    code: code,
                    grant_type: "authorization_code",
                },
            }

            await httpClient
                .post(AUTH_INTEGRATION.URL_ENCODED_ACCESS_TOKEN, formModel)
                .then((result) => {
                    if (result !== null) {
                        if (result.status === 200) {
                            if (result.data !== undefined) {
                                if (result.data.statusCode === 200) {
                                    let res = JSON.parse(result.data.res);
                                    if (!res.error) {
                                        this.get_accountInfo(res, cliType, apiName);
                                    }
                                }
                            }
                        }
                    }
                });
        } else {
            this.props.OnLoading();
            this.setState({ isLoading: false });
            showErrorToaster("error");
        }
    };

    get_accountInfo = async (res, cliType, apiName) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + res.access_token,
                Accept: "application/json",
            },
            APIUrl: DocuSign_AUTH_URLS.GET_USER_INFO
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        if (result.data.statusCode === 200) {
                            if (result.data.res !== "") {
                                result.data = JSON.parse(result.data.res);
                                if (result.data.accounts.length) {
                                    this.addAuthAccnt(result.data, res, cliType, apiName);
                                }
                            } else {
                                ToastsStore.error("Something went wrong");
                                this.props.OnLoading();
                            }
                        }
                    }
                });
        } catch (err) {
            this.props.OnLoading();
            showErrorToaster(err);
        }
    };

    addAuthAccnt = (res, tokenInfo, cliType, apiName) => {
        let formModel = {
            email: res.email,
            userName: res.name,
            cliType: cliType,
            memberId: res.accounts[0].account_id,
            token: tokenInfo.refresh_token,
            keyType: "refreshToken",
            tokenInfo: tokenInfo,
            profileInfo: res,
            apiName: apiName,
            endPoint: DocuSign_AUTH_URLS.DOCUSIGN_BASE_URL,
            connectionName: apiName + " " + res.email,
            isReconnectId: this.state.isReconnectId,
            clientId: DocuSign_AUTH_URLS.CLIENT_ID,
            clientSecret: DocuSign_AUTH_URLS.SECERT_KEY,
            webhookId: "",
        };

        try {
            httpClient
                .post(AUTH_INTEGRATION.ADD_API, formModel)
                .then(async (resInfo) => {
                    if (resInfo.data.statusCode === 200) {
                        let connectionId = "";
                        if (this.state.isReconnectId) {
                            ToastsStore.success(resInfo.data.data.message);
                            this.setState({ isLoading: false });
                            this.props.OnSuccess(cliType);
                        } else {
                            connectionId = resInfo.data.data.message;
                            await this.checkConnectionInfo(
                                res.accounts[0].account_id,
                                cliType,
                                tokenInfo.access_token,
                                connectionId
                            );
                        }
                    }

                }).catch((err) => {
                    if (err.response.status) {
                        showErrorToaster(err.response.data.data);
                    }
                    this.props.OnSuccess(cliType);
                });
        } catch (err) {
            showErrorToaster(err);
        }

    };

    // add webhook
    addWebHook = async (apiKey, cliType, commonInfo, connectionId) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + apiKey,
            },
            APIUrl: DocuSign_AUTH_URLS.CREATE_WEBHOOK.replace("{AccountID}", commonInfo),
            bodyInfo: {
                configurationType: "custom",
                urlToPublishTo: DOCUSIGN_WEBHOOK_URLS.POST_WEBHOOK_REQUEST,
                name: "form-sync",
                allowEnvelopePublish: "true",
                enableLog: "true",
                requiresAcknowledgement: "true",
                signMessageWithX509Certificate: "false",
                deliveryMode: "SIM",
                events: ["envelope-sent", "envelope-delivered", "envelope-voided", "envelope-resent", "envelope-completed"],
                eventData: {
                    "version": "restv2.1",
                    "format": "json",
                    "includeData": ["recipients"]
                },
                allUsers: "true"
            },
        };

        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        this.updateConnectionInfo(
                            connectionId,
                            result.data.res.connectId,
                            cliType
                        );
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };



    //update connection
    updateConnectionInfo = async (id, webhookId, cliType) => {
        let bodyData = {
            id: id,
            webhookId: webhookId,
            webhookToken: "",
        };
        try {
            await httpClient
                .post(WEBHOOK_URLS.UPDATE_CONNECTION_INFO, bodyData)
                .then((result) => {
                    if (result.status === 200) {
                        // console.log("connection updated", result);
                        ToastsStore.success("Data saved successfully");
                        this.setState({ isLoading: false });
                        this.props.OnSuccess(cliType);
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    // check connection info
    checkConnectionInfo = async (memberId, cliType, apiKey, connectionId) => {
        let bodyData = {
            memberId: memberId,
            cliType: cliType,
        };
        try {
            await httpClient
                .post(WEBHOOK_URLS.GET_CONNECTION_INFO, bodyData)
                .then((result) => {
                    if (result.status === 200) {
                        if (result.data.data.webhookId === "") {
                            this.addWebHook(apiKey, cliType, memberId, connectionId);
                        } else {
                            this.updateConnectionInfo(
                                connectionId,
                                result.data.data.webhookId,
                                cliType
                            );
                        }
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    render() {
        return (
            <>
                {this.props.onOpen && (

                    <OauthPopup
                        onClose={this.props.onClose}
                        url={DocuSign_AUTH_URLS.BASE_URL.replace(
                            "{CLIENT_ID}",
                            DocuSign_AUTH_URLS.CLIENT_ID
                        ).replace(
                            "{REDIRECT_URI}",
                            `${window.location.origin.toString()}/app/dashboard`
                        )}
                        onCode={this.onCode}
                    >
                        <div id="DocuSignDivId"></div>
                    </OauthPopup>
                )}
            </>
        );
    }
}

export default DocuSign;
