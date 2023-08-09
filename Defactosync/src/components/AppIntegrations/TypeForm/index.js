import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
    AUTH_INTEGRATION,
    TYPEFORM_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class TypeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedCLI: props.selectedCLI,
            selectedAPI: props.selectedAPI,
            isReconnectId: props.isReconnectId
        };
    }
    componentDidMount() {
        if (this.props.onOpen) {
            document.getElementById("TypeFormDivId").click();
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
            //this.props.onClose();
        } catch (error) {
            this.props.OnLoading();
            this.setState({ isLoading: false });
            showErrorToaster(error);
        }
    };

    getAccessToken = async (code, cliType, apiName) => {
        if (code) {          
            let formModel = {
                APIUrl: "https://api.typeform.com/oauth/token",
                headerValue: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                bodyInfo: {
                    client_id: TYPEFORM_AUTH_URLS.CLIENT_ID,
                    client_secret: TYPEFORM_AUTH_URLS.CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: `${window.location.origin.toString()}/app/dashboard`
                },
            };
            await httpClient
                .post(AUTH_INTEGRATION.URL_ENCODED_ACCESS_TOKEN, formModel)
                .then((result) => {                 
                    if (result !== null) {
                        if (result.status === 200) {
                            if (result.data) {
                                result = JSON.parse(result.data.res);
                                if (result.access_token) {
                                    this.get_accountInfo(result, cliType, apiName);
                                } else {
                                    this.props.OnLoading();
                                    this.setState({ isLoading: false });
                                    showErrorToaster("error");
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
            APIUrl: "https://api.typeform.com/me",
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.data.statusCode === 200) {
                        this.addAuthAccnt(result.data, res, cliType, apiName);
                    }
                });
        } catch (err) {
            this.props.OnLoading();
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    addAuthAccnt = (res, tokenInfo, cliType, apiName) => {
        res = JSON.parse(res.res);
        let formModel = {
            email: res.email,
            userName: res.alias,
            clientId: TYPEFORM_AUTH_URLS.CLIENT_ID,
            clientSecret: TYPEFORM_AUTH_URLS.CLIENT_SECRET,
            cliType: cliType,
            apiName: apiName,
            memberId: res.user_id,
            token: tokenInfo.access_token,
            keyType: "token",
            tokenInfo: tokenInfo,
            endPoint: TYPEFORM_AUTH_URLS.BASE_URL,
            connectionName: apiName + " " + res.email,
            isReconnectId: this.state.isReconnectId
        };
        try {
            httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then(async (resInfo) => {
                if (resInfo.data.statusCode === 200) {
                    this.props.OnLoading();
                    ToastsStore.success(resInfo.data.data.message);
                    this.props.OnSuccess(cliType);
                }
                this.setState({ isLoading: false });
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
                        url={TYPEFORM_AUTH_URLS.AUTH_URL.replace(
                            "{CLIENT_ID}",
                            TYPEFORM_AUTH_URLS.CLIENT_ID
                        ).replace(
                            "{REDIRECT_URI}",
                            `${window.location.origin.toString()}/app/dashboard`
                        )}
                        onCode={this.onCode}
                    >
                        <div id="TypeFormDivId"></div>
                    </OauthPopup>
                )}
            </>
        );
    }
}

export default TypeForm;
