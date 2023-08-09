import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
    AUTH_INTEGRATION,
    XERO_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class Xero extends Component {
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
            document.getElementById("XeroDivId").click();
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
                APIUrl: XERO_AUTH_URLS.ACCESS_TOKEN_URL,
                headerValue: {
                    Authorization:
                        "Basic " +
                        btoa(XERO_AUTH_URLS.CLIENT_ID + ":" + XERO_AUTH_URLS.SECERT_KEY),
                },
                bodyInfo: {
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: `${window.location.origin.toString()}/app/dashboard/`
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
                                        this.get_Connection(res, cliType, apiName);
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

    get_Connection = async (res, cliType, apiName) => {
        let formdata = {
            APIUrl: XERO_AUTH_URLS.CONNECTION_URL,
            headerValue: {
                Authorization: "Bearer " + res.access_token,
                Accept: "application/json"
            },
        };
        try{
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)   
                .then((result) => {
                    if (result.status === 200) {
                        if (result.data.statusCode === 200) {
                            let results = JSON.parse(result.data.res);
                            if (results.length) {
                                this.get_accountInfo(results[0], res, cliType, apiName);
                            } else {
                                ToastsStore.error("Something went wrong");
                                this.props.OnLoading();
                            }
                        }
                    }
                });
        } catch(err) {
            this.props.OnLoading();
            showErrorToaster(err);
        }
    }

    get_accountInfo = async (connection, res, cliType, apiName) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + res.access_token,
                Accept: "application/json",
                "xero-tenant-id": connection.tenantId
            },
            APIUrl: XERO_AUTH_URLS.GET_USER_INFO
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        if (result.data.statusCode === 200) {
                            if (Object.keys(result.data).length > 0) {
                                let results = JSON.parse(result.data.res);
                                if (result.data.res !== "") {
                                    this.addAuthAccnt(connection, results, res, cliType, apiName);
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

    addAuthAccnt = (connection, res, tokenInfo, cliType, apiName) => {
        let formModel = {
            email: res.Users[0].EmailAddress,
            userName: `${res.Users[0].FirstName} ${res.Users[0].LastName}`,
            cliType: cliType,
            memberId: connection.tenantId,
            token: tokenInfo.refresh_token,
            keyType: "refreshToken",
            tokenInfo: tokenInfo,
            profileInfo: res,
            apiName: apiName,
            endPoint: XERO_AUTH_URLS.BASE_URL,
            connectionName: apiName + " " + res.Users[0].EmailAddress,
            isReconnectId: this.state.isReconnectId,
            clientId: XERO_AUTH_URLS.CLIENT_ID,
            clientSecret: XERO_AUTH_URLS.SECERT_KEY,
            webhookId: "",
        };

        try {
            httpClient
                .post(AUTH_INTEGRATION.ADD_API, formModel)
                .then(async (resInfo) => {
                    if (resInfo.data.statusCode === 200) {
                        if (this.state.isReconnectId) {
                            ToastsStore.success(resInfo.data.data.message);
                            this.setState({ isLoading: false });
                            this.props.OnSuccess(cliType);
                        } else {
                            this.setState({ isLoading: false });
                            this.props.OnSuccess(cliType);
                            ToastsStore.success("Data saved successfully");
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

    

    render() {
        return (
            <>
                {this.props.onOpen && (

                    <OauthPopup
                        onClose={this.props.onClose}
                        url={XERO_AUTH_URLS.Auth_URL.replace(
                            "{CLIENT_ID}",
                            XERO_AUTH_URLS.CLIENT_ID
                        ).replace(
                            "{REDIRECT_URI}",
                            encodeURIComponent(`${window.location.origin.toString()}/app/dashboard/`)
                        ).replace(
                            "{SCOPES}",
                            encodeURIComponent(XERO_AUTH_URLS.SCOPES)
                        )}
                        onCode={this.onCode}
                    >
                        <div id="XeroDivId"></div>
                    </OauthPopup>
                )}
            </>
        );
    }
}

export default Xero;
