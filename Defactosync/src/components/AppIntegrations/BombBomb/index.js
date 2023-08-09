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
    WEBHOOK_URLS, BOMBBOMB_WEBHOOK_URLS
} from "constants/AppConst";
import {
    AUTH_INTEGRATION,
    BOMBBOMB_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class BombBomb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRedirect: false,
            selectedCLI: props.selectedCLI,
            selectedAPI: props.selectedAPI,
            btnDisabled: true,
            isReconnectId: props.isReconnectId,
            token: "",
        };
    }

    get_accountInfo = async (token, cliType, apiName) => {
        this.setState({ isLoading: true });
        let formdata = {
            headerValue: {
                "Authorization": "Bearer " + token,
                Accept: "application/json",
            },
            APIUrl: BOMBBOMB_AUTH_URLS.BASE_URL + BOMBBOMB_AUTH_URLS.USER_INFO
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        let res = JSON.parse(result.data.res);
                        if (result.data.res !== "") {
                            this.addAuthAccnt(res, token, cliType, apiName);
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

    addAuthAccnt = async (res, token, cliType, apiName) => {
        let formModel = {
            email: res.email,
            userName: `${res.firstName} ${res.lastName}`,
            cliType: cliType,
            apiName: apiName,
            memberId: res.email,
            token: token,
            keyType: "access_token",
            tokenInfo: res,
            endPoint: BOMBBOMB_AUTH_URLS.BASE_URL,
            connectionName: apiName + " " + res.email,
            isReconnectId: this.state.isReconnectId,
            webhookId: "",
        };

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
                                res.email,
                                cliType,
                                token,
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
    addWebHook = async (memberId, token, cliType, connectionId) => {
        let formdata = {
            headerValue: {
                "Authorization": "Bearer " + token,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            APIUrl: BOMBBOMB_AUTH_URLS.BASE_URL + BOMBBOMB_AUTH_URLS.CREATE_WEBHOOK,

            bodyInfo: {
                hookUrl: BOMBBOMB_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace("{commonInfo}", memberId),
            },
        };

        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        this.updateConnectionInfo(
                            connectionId,
                            result.data.res.hookId,
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
        token,
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
                            this.addWebHook(memberId, token, cliType, connectionId);
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
                this.state.token.replace(/\s/g, "").length) {
                this.setState({ btnDisabled: false });
            } else {
                this.setState({ btnDisabled: true });
            }
        }, 100);
    };
    handleRequestSubmit = () => {
        let _self = this;
        this.get_accountInfo(
            _self.state.token.trim(),
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
                                Allow FormSync to access your <br /> BombBomb Account?
                            </h1>
                        </div>
                        <div className="d-flex justify-content-center col-6 m-auto">
                            <div className="row">
                                <div className="form-group col-12">
                                    <label>
                                        <strong>Access Token</strong>&nbsp;
                                        <small className="required-color">(required)</small>
                                    </label>
                                    <p className="integration-p-label"> <br />
                                        <h5>You can Generate Access Token using the following steps.</h5>
                                        1. Create an account. <br />
                                        2. Click on this link <a href="https://developer.bombbomb.com/api#location=Add-a-contact-to-an-automation" target="_blank">BombBomb</a> <br />
                                        3. Click on Authenticate button and select scopes like (all:manage) <br />
                                    </p>
                                    <input
                                        className="form-control"
                                        name="token"
                                        onChange={(e) =>
                                            this.handleInputChange(e.target.value, "token")
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

export default BombBomb;
