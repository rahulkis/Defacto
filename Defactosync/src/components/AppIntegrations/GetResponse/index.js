import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { APP_IMAGE_URL, IMAGE_FOLDER ,WEBHOOK_URLS,GETRESPONSE_WEBHOOK_URLS} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  GETRESPONSE_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class GetResponse extends Component {
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
        "X-Auth-Token": `api-key ${apiKey}`,
      },
      APIUrl: "https://api.getresponse.com/v3/accounts",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const error = JSON.parse(result.data.res).hasOwnProperty(
              "httpStatus"
            );
            if (error) {
              ToastsStore.error("Invalid values");
              this.setState({ isLoading: false });
            } else {
              this.addAuthAccnt(
                JSON.parse(result.data.res),
                apiKey,
                cliType,
                apiName
              );
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
    console.log("res", res.email);
    let formModel = {
      email: res.email,
      userName: res.firstName,
      cliType: cliType,
      apiName: apiName,
      memberId: res.accountId,
      token: apiKey,
      keyType: "apikey",
      tokenInfo: res,
      endPoint: GETRESPONSE_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.email,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          if (resInfo.data.statusCode === 200) {
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.setState({ isLoading: false });
            } else {
              let connectionId = resInfo.data.data.message;
              await this.checkConnectionInfo(
                res.accountId,
                cliType,
                apiKey,
                connectionId
              );
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  handleInputChange = (value, name) => {
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

  // Create Webhooks
  addWebHook = async (apiKey, cliType, commonInfo, connectionId) => {
    let formdata = {
      headerValue: {
        "X-Auth-Token": `api-key ${apiKey}`,
      },
      APIUrl:
        GETRESPONSE_AUTH_URLS.BASE_URL + GETRESPONSE_AUTH_URLS.CREATE_WEBHOOK,
      bodyInfo: {
        url: GETRESPONSE_WEBHOOK_URLS.POST_WEBHOOK_REQUEST,
        actions: {
          open: true,
          click: true,
          goal: true,
          subscribe: true,
          unsubscribe: true,
          survey: true,
        },
      },
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          console.log("result", result);
          if (result.status === 200) {
            this.updateConnectionInfo(
              connectionId,
              "added",
              cliType
            );
          }
        });
    } catch (err) {
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
                // variant="SendInBlueWindow"
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
                Allow FormSync to access your <br /> GetResponse Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong>API Key </strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Where do I find the API key? You can find it under Menu -
                    Integrations & API - API. This key should be kept as secret
                    as your password - don’t share it with anybody.
                  </p>
                  <input
                    className="form-control"
                    onChange={(e) => this.handleInputChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading && (
            <div id="GetResponse" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default GetResponse;
