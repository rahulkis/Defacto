import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  DRIP_AUTH_URLS,
} from "constants/IntegrationConstant";
import { DRIP_WEBHOOK_URLS, WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Drip extends Component {
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
        Authorization: authenticateUser(apiKey, "X"),
      },
      APIUrl: "https://api.getdrip.com/v2/accounts",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (result.data.res.replace(/\s/g, "").length) {
              result.data = JSON.parse(result.data.res);
              if (result.data.accounts.length) {
                this.addAuthAccnt(
                  result.data.accounts[0],
                  apiKey,
                  cliType,
                  apiName
                );
              } else {
                this.setState({ isLoading: false });
                ToastsStore.error("Invalid Credentials");
              }
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

  addAuthAccnt = (res, tokenInfo, cliType, apiName) => {
    let formModel = {
      email: res.primary_email,
      userName: res.name,
      cliType: cliType,
      memberId: res.id,
      token: tokenInfo,
      keyType: "apikey",
      tokenInfo: res,
      apiName: apiName,
      endPoint: DRIP_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.primary_email,
      isReconnectId: this.state.isReconnectId,
      clientId: DRIP_AUTH_URLS.CLIENT_ID,
      clientSecret: DRIP_AUTH_URLS.CLIENT_SECRET,
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
              let connectionId = resInfo.data.data.message;
              await this.checkConnectionInfo(
                res.id,
                cliType,
                tokenInfo,
                connectionId
              );
              ToastsStore.success("Data saved successfully");
            }
          }
          this.setState({ isLoading: false });
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // add webhook
  addWebhook = async (token, id, connectionId, cliType) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(token, "X"),
      },
      APIUrl:
        DRIP_AUTH_URLS.BASE_URL +
        DRIP_AUTH_URLS.ADD_WEBHOOK.replace("{account}", id),
      bodyInfo: {
        webhooks: [
          {
            post_url: DRIP_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
              "{commonInfo}",
              id
            ),
            events: DRIP_WEBHOOK_URLS.EVENTS,
          },
        ],
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          console.log("watch added", result);
          this.updateConnectionInfo(
            connectionId,
            result.data.res.webhooks[0].id,
            cliType
          );
        });
    } catch (err) {
      this.props.OnLoading();
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
            this.props.OnSuccess(cliType);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // check connection info
  checkConnectionInfo = async (memberId, cliType, token, connectionId) => {
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
              this.addWebhook(token, memberId, connectionId, cliType);
              //this.deleteWebhook(token, result.data.data.webhookId, memberId);
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
                Allow FormSync to access your <br /> Drip Account?
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
                    To find your API token login to your Drip account and go to
                    https://www.getdrip.com/user/edit. Your API key will be near
                    the bottom under 'API Token'.
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
            <div id="DripLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default Drip;
