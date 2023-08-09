import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import {
    APP_IMAGE_URL,
    IMAGE_FOLDER,
    WEBHOOK_URLS,
    PANDADOC_WEBHOOK_URLS
} from "constants/AppConst";
import {
    AUTH_INTEGRATION,
    PANDADOC_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class PandaDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRedirect: false,
            selectedCLI: props.selectedCLI,
            selectedAPI: props.selectedAPI,
            btnDisabled: true,
            isReconnectId: props.isReconnectId,
            api_key: "",
        };
    }

    get_accountInfo = async (api_key, cliType, apiName) => {
        this.setState({ isLoading: true });
        let formdata = {
            headerValue: {
                "Authorization": "API-key " + api_key,
                Accept: "application/json",
                "Content-type": "application/json"
            },
            APIUrl: PANDADOC_AUTH_URLS.BASE_URL + PANDADOC_AUTH_URLS.USER_INFO
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        let res = JSON.parse(result.data.res);
                        if (result.data.res !== "") {
                            this.addAuthAccnt(res, api_key, cliType, apiName);
                        } else {
                            ToastsStore.error("Please Enter Correct API Key");
                            this.props.OnLoading();
                        }
                    } else {
                        this.setState({ isLoading: false });
                        showErrorToaster("error");
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            ToastsStore.error("invalid credentials");
        }
    };

    addAuthAccnt = async (res, api_key, cliType, apiName) => {
        let response = res && res.results[0];
        let formModel = {
            email: response.email,
            userName: `${response.first_name} ${response.last_name}`,
            cliType: cliType,
            apiName: apiName,
            memberId: response.id,
            token: api_key,
            keyType: "API Key",
            tokenInfo: response,
            endPoint: PANDADOC_AUTH_URLS.BASE_URL,
            connectionName: apiName + " " + response.company + " " + response.email,
            isReconnectId: this.state.isReconnectId,
            webhookId: "",
        };

        console.log(formModel, "formModel")

        try {
            await httpClient
                .post(AUTH_INTEGRATION.ADD_API, formModel)
                .then(async (resInfo) => {
                    // Redirection to connection CLI
                    if (resInfo.data.statusCode === 200) {
                        if (this.state.isReconnectId) {
                            ToastsStore.success(resInfo.data.data.message);
                            this.setState({ isLoading: false });
                        } else {
                            let connectionId = resInfo.data.data.message;
                            await this.checkConnectionInfo(
                                response.id,
                                cliType,
                                api_key,
                                connectionId,
                            );
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    // Create Webhooks
    addWebHook = async (memberId, api_key, cliType, connectionId) => {
        let formdata = {
            headerValue: {
                "Authorization": "API-key " + api_key,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            APIUrl: PANDADOC_AUTH_URLS.BASE_URL + PANDADOC_AUTH_URLS.CREATE_WEBHOOK,

            bodyInfo: {
                name: "FormSync",
                url: PANDADOC_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace("{commonInfo}", memberId),
                // url: "https://webhook.site/4e80dc75-c4b5-4fa1-bc2a-6b96478e2194",
                active: true,
                payload: ["fields","products","metadata","tokens","pricing"],
                triggers: [
                    "document_deleted",
                    "document_updated",
                ]
                
            },
        };

        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        this.updateConnectionInfo(
                            connectionId,
                            result.data.res.uuid,
                            cliType
                        );
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    // check connection info
    checkConnectionInfo = async (
        memberId,
        cliType,
        api_key,
        connectionId,
    ) => {
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
                            this.addWebHook(memberId, api_key, cliType, connectionId);
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
                        console.log("connection updated", result);
                        ToastsStore.success("Data saved successfully");
                        this.props.OnSuccess(cliType);
                        this.setState({ isLoading: false });
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };


    handleInputChange = (value, name) => {
        this.setState({ [name]: value });

        setTimeout(() => {
            if (
                this.state.api_key.replace(/\s/g, "").length) {
                this.setState({ btnDisabled: false });
            } else {
                this.setState({ btnDisabled: true });
            }
        }, 100);
    };
    handleRequestSubmit = () => {
        let _self = this;
        this.get_accountInfo(
            _self.state.api_key.trim(),
            _self.state.selectedCLI,
            _self.state.selectedAPI
        );
    };
    render() {
        const { onOpen, onClose } = this.props;
        const { isLoading, selectedCLI, btnDisabled } = this.state;
        return (
            <>
                <Dialog
                    fullScreen
                    open={onOpen}
                    onClose={onClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className="position-relative">
                        <Toolbar>
                            <IconButton onClick={onClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                variant="ActiveCampaignWindow"
                                color="inherit"
                                style={{
                                    flex: 1,
                                }}
                            >
                                Connect an Account | FormSync
                            </Typography>
                            <Button
                                style={{ color: btnDisabled ? "" : "white" }}
                                onClick={this.handleRequestSubmit}
                                disabled={btnDisabled}
                            >
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <div>
                        <div className="d-flex justify-content-center mt-5">
                            <img
                                height="64"
                                width="64"
                                src={
                                    APP_IMAGE_URL +
                                    IMAGE_FOLDER.APP_IMAGES +
                                    selectedCLI.toLowerCase() +
                                    ".png"
                                }
                                alt="syncImage"
                            />
                        </div>
                        <div className="d-flex justify-content-center mt-1">
                            <h1 className="integration-Oauth-Header">
                                Allow FormSync to access your <br /> PandaDoc Account?
                            </h1>
                        </div>
                        <div className="d-flex justify-content-center col-6 m-auto">
                            <div className="row">
                                <div className="form-group col-12">
                                    <label>
                                        <strong>API Key</strong>&nbsp;
                                        <small className="required-color">(required)</small>
                                    </label>
                                    <p className="integration-p-label"> <br />
                                        <h5>You can Generate API Key using the following steps.</h5>
                                        1. Create an account. <br />
                                        2. Click on Settings button and Click on Integrations option.<br />
                                        3. Go to end of the page Click on API and Click on (Generate sandbox key).
                                    </p>
                                    <input
                                        className="form-control"
                                        name="api_key"
                                        onChange={(e) =>
                                            this.handleInputChange(e.target.value, "api_key")
                                        }
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                    {isLoading && (
                        <div id="GmailLoader" className="loader-view">
                            <CircularProgress />
                        </div>
                    )}
                </Dialog>
            </>
        );
    }
}

export default PandaDoc;
