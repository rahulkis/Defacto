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
    AUTH_INTEGRATION,
    PIPEDRIVE_AUTH_URLS,
    SWELL_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
    APP_IMAGE_URL,
    IMAGE_FOLDER,
    SWELL_WEBHOOK_URLS,
    WEBHOOK_URLS,
} from "constants/AppConst";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class PipeDrive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRedirect: false,
            selectedCLI: props.selectedCLI,
            selectedAPI: props.selectedAPI,
            btnDisabled: true,
            isReconnectId: props.isReconnectId,
            apiToken: "",
        };
    }
    get_accountInfo = async (apiToken, cliType, apiName) => {
        this.setState({ isLoading: true });
        let formdata = {
            headerValue: {
                "Api-Token": apiToken,
                Accept: "application/json",
            },
            APIUrl: PIPEDRIVE_AUTH_URLS.BASE_URL.replace("{API}", "api") + PIPEDRIVE_AUTH_URLS.USER_INFO.replace("{APITOKEN}", apiToken),
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        let res = JSON.parse(result.data.res);
                        if (Object.keys(res.data).length) {
                            this.addAuthAccnt(res.data, apiToken, cliType, apiName);
                        } else {
                            ToastsStore.error("Please connect by production account");
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

    addAuthAccnt = async (res, apiToken, cliType, apiName) => {
        let formModel = {
            email: res.email,
            userName: res.name,
            cliType: cliType,
            apiName: apiName,
            memberId: `${res.name ? res.name : "fname"}@${res.company_name ? res.company_name : "CompanyName"
                }`,
            token: apiToken,
            keyType: "apiToken",
            tokenInfo: res,
            endPoint: PIPEDRIVE_AUTH_URLS.BASE_URL.replace("{API}", res.company_domain),
            workSpaceId: `${res.name ? res.name : "fname"}@${res.company_name ? res.company_name : "CompanyName"
                }`,
            connectionName:
                apiName +
                " " +
                `${res.name ? res.name : "fname"}@${res.company_name ? res.company_name : "CompanyName"
                }`,
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
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };


    handleInputChange = (value, name) => {
        this.setState({ [name]: value });

        setTimeout(() => {
            if (
                this.state.apiToken.replace(/\s/g, "").length) {
                this.setState({ btnDisabled: false });
            } else {
                this.setState({ btnDisabled: true });
            }
        }, 100);
    };
    handleRequestSubmit = () => {
        let _self = this;
        this.get_accountInfo(
            _self.state.apiToken.trim(),
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
                                Allow FormSync to access your <br /> Pipedrive Account?
                            </h1>
                        </div>
                        <div className="d-flex justify-content-center col-6 m-auto">
                            <div className="row">
                                <div className="form-group col-12">
                                    <label>
                                        <strong>API Token</strong>&nbsp;
                                        <small className="required-color">(required)</small>
                                    </label>
                                    <p className="integration-p-label">
                                        This can be found in Personal preferences settings of your Pipedrive account. Click on
                                        "Profile" at the top of the page and then navigate to Personal preferences. The right will display a menu
                                        and click on API at the top.
                                    </p>
                                    <input
                                        className="form-control"
                                        name="apiToken"
                                        onChange={(e) =>
                                            this.handleInputChange(e.target.value, "apiToken")
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

export default PipeDrive;