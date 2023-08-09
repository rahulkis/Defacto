import React, { Component } from "react";
import { connect } from "react-redux";
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
  WEBHOOK_URLS,
  CLICKSEND_WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  CLICKSEND_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";
import { fetchAllConnections} from "actions/index";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ClickSend extends Component {
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
      userName: "",
    };
  }

  get_accountInfo = async (userName, apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(userName, apiKey),
      },
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "account",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            let parsedJson = JSON.parse(result.data.res);
            if (!parsedJson.error) {
              if (parsedJson.http_code === 200) {
                this.addAuthAccnt(parsedJson.data, apiKey, cliType, apiName);
              } else {
                this.setState({ isLoading: false });
                ToastsStore.error("No record found.");
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
    let formModel = {
      email: parsedJson.user_email,
      userName: parsedJson.user_first_name + " " + parsedJson.user_last_name,
      cliType: cliType,
      apiName: apiName,
      memberId: parsedJson.user_id,
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: parsedJson,
      endPoint: CLICKSEND_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + parsedJson.user_email,
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
              this.setState({ isLoading: false });
              this.props.OnSuccess(cliType);
            } else {
              let connectionId = resInfo.data.data.message;
              await this.checkConnectionInfo(
                parsedJson.user_id,
                cliType,
                parsedJson.user_email,
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

  handleInputChange = (value, name) => {
    this.setState({ [name]: value.trim() });

    setTimeout(() => {
      if (
        this.state.apiKey.replace(/\s/g, "").length &&
        this.state.userName.replace(/\s/g, "").length
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
      _self.state.userName,
      _self.state.apiKey,
      _self.state.selectedCLI,
      _self.state.selectedAPI
    );
  };

  addSentSMSWebhook = async (userName, apiKey, connectionId, cliType) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(userName, apiKey),
      },
      APIUrl:
        CLICKSEND_AUTH_URLS.BASE_URL + CLICKSEND_AUTH_URLS.SMS_SENT_WEBHOOK,
      bodyInfo: {
        action_address: CLICKSEND_WEBHOOK_URLS.POST_WEBHOOK_REQUEST,
        rule_name: "SENT_SMS_WEBHOOK",
        match_type: 2,
        action: "URL",
        enabled: 1,
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            console.log("addSentSMSWebhook", result);
            this.updateConnectionInfo(
              connectionId,
              result.data.res.data.receipt_rule_id,
              cliType
            );
          }
        });
    } catch (err) {
      console.log("error", "adding send sms webhook");
    }
  };

  // check connection info
  checkConnectionInfo = async (
    memberId,
    cliType,
    email,
    apiKey,
    connectionId
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
              this.addSentSMSWebhook(email, apiKey, connectionId, cliType);
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
                Allow FormSync to access your <br /> ClickSend Account?
              </h1>
            </div>

            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong>Username</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    You can find your username on the
                    <a
                      href="https://dashboard.clicksend.com/account/subaccounts"
                      target="_blank"  rel="noopener noreferrer"
                    >
                      &nbsp;Subaccounts
                    </a>{" "}
                    page on the
                    <a
                      href="https://dashboard.clicksend.com/account/subaccounts"
                      target="_blank"  rel="noopener noreferrer"
                    >
                      &nbsp;ClickSend dashboard
                    </a>
                    .
                  </p>
                  <input
                    className="form-control"
                    name="userName"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "userName")
                    }
                  />
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>API Key</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    You can find your username on the
                    <a
                      href="https://dashboard.clicksend.com/account/subaccounts"
                      target="_blank"  rel="noopener noreferrer"
                    >
                      &nbsp;Subaccounts
                    </a>{" "}
                    page on the
                    <a
                      href="https://dashboard.clicksend.com/account/subaccounts"
                      target="_blank"  rel="noopener noreferrer"
                    >
                      &nbsp;ClickSend dashboard
                    </a>
                    .
                  </p>
                  <input
                    className="form-control"
                    name="apiKey"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "apiKey")
                    }
                  />
                </div>
                <div className="form-group col-12">
                  
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

//export default ClickSend;
export default connect(null, {
  fetchAllConnections,
})(ClickSend);
