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
  MAILSHAKE_WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  MAILSHAKE_AUTH_URLS,
} from "constants/IntegrationConstant";
import { WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MailShake extends Component {
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
      userEmail: "",
    };
  }

  get_accountInfo = async (userEmail, apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(apiKey, ""),
      },
      APIUrl:
        MAILSHAKE_AUTH_URLS.BASE_URL + "team/list-members?search=" + userEmail,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            let parsedJson = JSON.parse(result.data.res);
            if (!parsedJson.error) {
              if (parsedJson.results.length) {
                this.addAuthAccnt(parsedJson.results, apiKey, cliType, apiName);
              } else {
                this.setState({ isLoading: false });
                ToastsStore.error(
                  "No record found. Please check your email address."
                );
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

  addAuthAccnt = (parsedJson, apiKey, cliType, apiName) => {
    parsedJson = parsedJson[0];
    let formModel = {
      email: parsedJson.emailAddress,
      userName: parsedJson.fullName,
      cliType: cliType,
      apiName: apiName,
      memberId: parsedJson.id,
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: parsedJson,
      endPoint: MAILSHAKE_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + parsedJson.emailAddress,
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
              ToastsStore.success("Data saved successfully");
              let targetUrl = MAILSHAKE_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
                "{commonInfo}",
                parsedJson.id
              );
              console.log("targeturl", targetUrl);
              let id = resInfo.data.data.message;
              //checkid the same connection count
              let connectionInfo = await this.checkConnectionInfo(
                parsedJson.id,
                cliType
              );
              if (connectionInfo.webhookId === "") {
                this.addWebHook(apiKey, targetUrl);
              }
              await this.updateConnectionInfo(id, targetUrl, cliType);
            }
          }
          this.setState({ isLoading: false });
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
        this.state.apiKey.replace(/\s/g, "").length &&
        this.state.userEmail.replace(/\s/g, "").length
      ) {
        this.setState({ btnDisabled: false });
      } else {
        this.setState({ btnDisabled: true });
      }
    }, 100);
  };

  handleRequestSubmit = () => {
    let _self = this;
    this.get_accountInfo(
      _self.state.userEmail,
      _self.state.apiKey,
      _self.state.selectedCLI,
      _self.state.selectedAPI
    );
  };

  // check connection info
  checkConnectionInfo = async (memberId, cliType) => {
    let data = {};
    let bodyData = {
      memberId: memberId,
      cliType: cliType,
    };
    try {
      await httpClient
        .post(WEBHOOK_URLS.GET_CONNECTION_INFO, bodyData)
        .then((result) => {
          if (result.status === 200) {
            data = result.data.data;
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
    return data;
  };

  // Create Webhooks
  addWebHook = async (apiKey, targetUrl) => {
    const events = MAILSHAKE_WEBHOOK_URLS.EVENTS;
    events.map(async (event) => {
      let formdata = {
        headerValue: {
          Authorization: authenticateUser(apiKey, ""),
        },
        APIUrl:
          MAILSHAKE_AUTH_URLS.BASE_URL + MAILSHAKE_AUTH_URLS.CREATE_WEBHOOK,
        bodyInfo: {
          targetUrl: targetUrl,
          event: event,
        },
      };
      try {
        await httpClient
          .post(AUTH_INTEGRATION.POST_API, formdata)
          .then((result) => {
            console.log("webhook added", result);
          });
      } catch (err) {
        this.props.OnLoading();
        this.setState({ isLoading: false });
        showErrorToaster(err);
      }
    });
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
              {/* <Button onClick={this.handleRequestSubmit} disabled={btnDisabled}> */}
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
                Allow FormSync to access your <br /> MailShake Account?
              </h1>
            </div>

            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong>User Email</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Should be the same email you use to login your MailShake
                    account.
                  </p>
                  <input
                    className="form-control"
                    name="userEmail"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "userEmail")
                    }
                  />
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>API Key</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    You can get your MailerShake API key at{" "}
                    <code>https://api-docs.mailshake.com </code>.
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
            <div id="MailShakeLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default MailShake;
