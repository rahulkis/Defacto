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
  CONVERTKIT_WEBHOOK_URLS,
  WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  CONVERTKIT_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ConvertKit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      btnDisabled: true,
      isReconnectId: props.isReconnectId,
      apiKey: "",
    };
  }

  get_accountInfo = async (apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: "https://api.convertkit.com/v3/account?api_secret=" + apiKey,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (!result.data.res.includes("error")) {
              this.addAuthAccnt(result.data, apiKey, cliType, apiName);
            } else {
              this.setState({ isLoading: false });
              ToastsStore.error("API Key not valid.");
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

  addAuthAccnt = (res, apiKey, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.primary_email_address,
      userName: res.name,
      cliType: cliType,
      apiName: apiName,
      memberId: res.primary_email_address,
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: res,
      endPoint: CONVERTKIT_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.primary_email_address,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          // Redirection to connection CLI
          if (resInfo.data.statusCode === 200) {
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.props.OnSuccess(cliType);
            } else {
              let connectionId = resInfo.data.data.message;
              let webhookKeys = [];

              await this.checkConnectionInfo(
                res.primary_email_address,
                cliType,
                apiKey,
                connectionId,
                webhookKeys
              );
              if (webhookKeys.length > 0) {
                await this.updateConnectionInfo(
                  connectionId,
                  webhookKeys.join(),
                  cliType
                );
              } else {
                this.props.OnSuccess(cliType);
              }
            }
          }
          this.setState({ isLoading: false });
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  handleInputChange = (value) => {
    if (value.replace(/\s/g, "").length) {
      this.setState({ apiKey: value.trim(), btnDisabled: false });
    } else {
      this.setState({ btnDisabled: true });
    }

    // this.setState({ [name]: value });

    // setTimeout(() => {
    //   if (this.state.apiKey) {
    //     this.setState({ btnDisabled: false });
    //   } else {
    //     this.setState({ btnDisabled: true });
    //   }
    // }, 100);
  };
  
  handleRequestSubmit = () => {
    let _self = this;
    this.get_accountInfo(
      _self.state.apiKey,
      _self.state.selectedCLI,
      _self.state.selectedAPI
    );
  };

  // check connection info
  checkConnectionInfo = async (
    memberId,
    cliType,
    apiKey,
    connectionId,
    webhookKeys
  ) => {
    let bodyData = {
      memberId: memberId,
      cliType: cliType,
    };
    try {
      await httpClient
        .post(WEBHOOK_URLS.GET_CONNECTION_INFO, bodyData)
        .then(async (result) => {
          if (result.status === 200) {
            if (result.data.data.webhookId === "") {
              await this.addWebhook(memberId, apiKey, webhookKeys);
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

  addWebhook = async (memberId, apiKey, webhookKeys) => {
    const events = CONVERTKIT_WEBHOOK_URLS.EVENTS;
    await Promise.all(
      events.map(async (event, i, arr) => {
        let formdata = {
          APIUrl:
            CONVERTKIT_AUTH_URLS.BASE_URL + CONVERTKIT_AUTH_URLS.CREATE_WEBHOOK,
          bodyInfo: {
            api_secret: apiKey,
            target_url: CONVERTKIT_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
              "{commonInfo}",
              memberId
            ),
            event: { name: event },
          },
        };
        try {
          await httpClient
            .post(AUTH_INTEGRATION.POST_API, formdata)
            .then((result) => {
              if (result.status === 200) {
                if (result.data.res.rule) {
                  webhookKeys.push(result.data.res.rule.id);
                }
                if (result.data.res.error) {
                  if (arr.length - 1 === i) {
                    ToastsStore.error(result.data.res.message);
                  }
                }
              }
            });
        } catch (err) {
          ToastsStore.error("something went wrong while adding webhook");
          console.log("error", "adding  webhook");
        }
      })
    );
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
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
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
                Save
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
                Allow FormSync to access your <br /> ConvertKit Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong> API Secret</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    You can find the API Secret on your{" "}
                    <a
                      href="https://app.convertkit.com/account/edit"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Account page
                    </a>{" "}
                    in ConvertKit.
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
            <div id="ConvertKitLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default ConvertKit;
