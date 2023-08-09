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
  TELEGRAM_WEBHOOK_URLS,
  WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  TELEGRAM_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Telegram extends Component {
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
      APIUrl:
        TELEGRAM_AUTH_URLS.BASE_URL.replace("{token}", apiKey) +
        TELEGRAM_AUTH_URLS.GET_CURRENT_USER,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const message = JSON.parse(result.data.res).ok;
            if (!message) {
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
      email: res.result.username,
      userName: res.result.username,
      cliType: cliType,
      apiName: apiName,
      memberId: (res.result.id).toString(),
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: res,
      endPoint: TELEGRAM_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.result.username,
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
                (res.result.id).toString(),
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
      APIUrl:
        TELEGRAM_AUTH_URLS.BASE_URL.replace("{token}", apiKey) +
        TELEGRAM_AUTH_URLS.CREATE_WEBHOOK.replace(
          "{url}",
          TELEGRAM_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            commonInfo
          )
        ),
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
      
          console.log("resultwebhok", result);
          if (result.status === 200) {
            this.updateConnectionInfo(connectionId, "added", cliType);
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
              this.updateConnectionInfo(connectionId, "added", cliType);
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
                variant="SendInBlueWindow"
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
                Allow FormSync to access your <br /> Telegram Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong> Bot Token</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <div className="integration-p-label">
                    <p>
                      Copy your Bot token of the particular bot of your Telegram
                      account to paste it below.Don't have a Bot token? Add a
                      new bot at '@BotFather' channel{" "}
                    </p>

                    <strong>Follow these steps:</strong>
                    <p>
                      1.search @BotFather and type '/start' command. 2 select
                      '/newbot' command and make a new bot. 3 select '/mybots'
                      command to get get info about your bot and click on
                      ApiToken to get that.
                    </p>
                  </div>
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
            <div id="Telegram" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default Telegram;
