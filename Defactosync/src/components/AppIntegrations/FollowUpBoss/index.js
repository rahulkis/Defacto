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
    WEBHOOK_URLS, FOLLOWUPBOSS_WEBHOOK_URLS
} from "constants/AppConst";
import {
    AUTH_INTEGRATION,
    FOLLOWUPBOSS_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class FollowUpBoss extends Component {
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
                "Authorization": "Basic " + btoa(api_key),
                Accept: "application/json",
            },
            APIUrl: FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.USER_INFO
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
        let formModel = {
            email: res.email,
            userName: res.name,
            cliType: cliType,
            apiName: apiName,
            memberId: res.account,
            token: btoa(api_key),
            keyType: "apiKey",
            tokenInfo: res,
            endPoint: FOLLOWUPBOSS_AUTH_URLS.BASE_URL,
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
                        this.props.OnLoading();
                        ToastsStore.success(resInfo.data.data.message);
                        this.props.OnSuccess(cliType);
                      }
                      this.setState({ isLoading: false });
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
                                Allow FormSync to access your <br /> Follow Up Boss Account?
                            </h1>
                        </div>
                        <div className="d-flex justify-content-center col-6 m-auto">
                            <div className="row">
                                <div className="form-group col-12">
                                    <label>
                                        <strong>API v2 api_key</strong>&nbsp;
                                        <small className="required-color">(required)</small>
                                    </label>
                                    <p className="integration-p-label">
                                        You can find your API key by going to <a href="https://app.followupboss.com/2/api">https://app.followupboss.com/2/api</a>
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

export default FollowUpBoss;
