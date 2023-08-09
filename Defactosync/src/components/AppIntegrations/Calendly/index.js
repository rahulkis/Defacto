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
    IMAGE_FOLDER, WEBHOOK_URLS, CALENDLY_WEBHOOK_URLS
} from "constants/AppConst";
import {
    AUTH_INTEGRATION,
    Calendly_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class Calendly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRedirect: false,
            selectedCLI: props.selectedCLI,
            selectedAPI: props.selectedAPI,
            btnDisabled: true,
            isReconnectId: props.isReconnectId,
            apiUrl: "",
            apiKey: "",
        };
    }

    get_accountInfo = async (apiKey, cliType, apiName) => {
        this.setState({ isLoading: true });
        let formdata = {
            headerValue: {
                "X-TOKEN": apiKey,
                Accept: "application/json",
            },
            APIUrl: Calendly_AUTH_URLS.BASE_URL + Calendly_AUTH_URLS.GET_ACCOUNT,
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {

                    if (result.status === 200) {

                        const message = JSON.parse(result.data.res).message;

                        if (message) {
                            ToastsStore.error("Invalid values");
                            this.setState({ isLoading: false });
                        } else {
                            this.addAuthAccnt(result.data, apiKey, cliType, apiName);
                        }
                    } else {
                        this.setState({ isLoading: false });
                        showErrorToaster("error");
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    addAuthAccnt = async (res, apiKey, cliType, apiName) => {

        res = JSON.parse(res.res);

        let formModel = {
            email: res.data.attributes.email,
            userName: res.data.attributes.name,
            cliType: cliType,
            apiName: apiName,
            memberId: res.data.id,
            token: apiKey,
            keyType: "apiKey",
            tokenInfo: res,
            endPoint: Calendly_AUTH_URLS.BASE_URL,
            connectionName: apiName + " " + res.data.attributes.email,
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
                                res.data.id,
                                cliType,
                                apiKey,
                                connectionId
                            );
                        }
                        //this.props.OnSuccess(cliType);
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };


    // Create Webhooks
    addWebHook = async (apiKey, cliType, commonInfo, connectionId) => {
        let formdata = {
            headerValue: {
                "X-TOKEN": apiKey,
                Accept: "application/json",
            },
            APIUrl:
                Calendly_AUTH_URLS.BASE_URL + Calendly_AUTH_URLS.CREATE_WEBHOOK,
            bodyInfo: {
                events: CALENDLY_WEBHOOK_URLS.EVENTS,
                url: CALENDLY_WEBHOOK_URLS.POST_WEBHOOK_REQUEST
            }
        };

        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    console.log("result", result);
                    if (result.status === 200) {
                        this.updateConnectionInfo(
                            connectionId,
                            result.data.res.id,
                            cliType
                        );
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
                        this.setState({ isLoading: false });
                        this.props.OnSuccess(cliType);
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    handleInputChange = (value) => {
        if (value.replace(/\s/g, "").length) {
            this.setState({ apiKey: value.trim(), btnDisabled: false });
        } else {
            this.setState({ btnDisabled: true });
        }
    };

    handleRequestSubmit = () => {
        let _self = this;
        this.get_accountInfo(
            _self.state.apiKey,
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
                                //variant="SendInBlueWindow"
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
                                Allow FormSync to access your <br /> Calendly Account?
                            </h1>
                        </div>
                        <div className="d-flex justify-content-center col-6 m-auto">
                            <div className="row">
                                <div className="form-group col-12">
                                    <label>
                                        <strong>API Key</strong>&nbsp;
                                        <small className="required-color">(required)</small>
                                    </label>
                                    <p className="integration-p-label">
                                        You can find your API Key by navigating to the  Integration page.
                                    </p>
                                    <input
                                        className="form-control"
                                        name="apiKey"
                                        onChange={(e) => this.handleInputChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {isLoading && (
                        <div id="Calendly" className="loader-view">
                            <CircularProgress />
                        </div>
                    )}   
                </Dialog>
            </>
        );
    }
}

export default Calendly;
