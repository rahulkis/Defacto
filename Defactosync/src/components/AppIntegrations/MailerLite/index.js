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
  MAILERLITE_WEBHOOK_URLS,
  WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  Mailerlite_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MailerLite extends Component {
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
        "X-MailerLite-ApiKey": apiKey,
        Accept: "application/json",
      },
      APIUrl: "https://api.mailerlite.com/api/v2/me",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (!JSON.parse(result.data.res).hasOwnProperty("error")) {
              this.addAuthAccnt(result.data, apiKey, cliType, apiName);
            } else {
              this.setState({ isLoading: false });
              ToastsStore.error("Invalid Credentials");
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
    if (res.error) {
      this.setState({ isLoading: false });
      ToastsStore.error(res.error.message);
    } else {
      let formModel = {
        email: res.account.email,
        userName: res.account.name,
        cliType: cliType,
        apiName: apiName,
        memberId: res.account.id,
        token: apiKey,
        keyType: "apiKey",
        tokenInfo: res.account,
        endPoint: Mailerlite_AUTH_URLS.BASE_URL,
        connectionName: apiName + " " + res.account.email,
        isReconnectId: this.state.isReconnectId,
        webhookId: "",
      };
      try {
        httpClient
          .post(AUTH_INTEGRATION.ADD_API, formModel)
          .then(async (resInfo) => {
            if (resInfo.data.statusCode === 200) {
              if (this.state.isReconnectId) {
                ToastsStore.success(resInfo.data.data.message);
                this.props.OnSuccess(cliType);
              } else {
                // ToastsStore.success("Data saved successfully");
                let connectionId = resInfo.data.data.message;
                let webhookKeys = [];
                await this.checkConnectionInfo(
                  res.account.id,
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
              //this.props.OnSuccess(cliType);
            }
            this.setState({ isLoading: false });
          });
      } catch (err) {
        this.setState({ isLoading: false });
        showErrorToaster(err);
      }
    }
  };

  handleInputChange = (value, name) => {
    if (value.replace(/\s/g, "").length) {
      this.setState({ [name]: value.trim(), btnDisabled: false });
    } else {
      this.setState({ btnDisabled: true });
    }

    //this.setState({ [name]: value });

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

  // Create Webhooks
  addWebHook = async (apiKey, webhookKeys) => {
    const events = MAILERLITE_WEBHOOK_URLS.EVENTS;
    await Promise.all(
      events.map(async (event) => {
        let formdata = {
          headerValue: {
            "X-MailerLite-ApiKey": apiKey,
            Accept: "application/json",
          },
          APIUrl: Mailerlite_AUTH_URLS.CREATE_WEBHOOK,
          bodyInfo: {
            url: MAILERLITE_WEBHOOK_URLS.POST_WEBHOOK_REQUEST,
            event: event,
          },
        };
        try {
          await httpClient
            .post(AUTH_INTEGRATION.POST_API, formdata)
            .then((result) => {
              webhookKeys.push(result.data.res.id);
              console.log("webhook added", result);
            });
        } catch (err) {
          this.props.OnLoading();
          this.setState({ isLoading: false });
          showErrorToaster(err);
        }
      })
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
              await this.addWebHook(apiKey, webhookKeys, connectionId);
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
                variant="MailerLiteWindow"
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
                Allow FormSync to access your <br /> Mailerlite Account?
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
                    To find your API key login to your MailerLite account and go
                    to Integrations. Click on{" "}
                    <a
                      href="https://app.mailerlite.com/integrations/api"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Developer API
                    </a>{" "}
                    and you will find the API key there.
                  </p>
                  <input
                    className="form-control"
                    name="apiKey"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "apiKey")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading && (
            <div id="MailerLiteLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default MailerLite;
