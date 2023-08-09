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
import { WEBHOOK_URLS } from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  ZENDESK_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Zendesk extends Component {
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
      agentEmail: "",
    };
  }

  get_accountInfo = async (apiUrl, apiKey, agentEmail, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(agentEmail + "/token", apiKey),
        Accept: "application/json",
      },
      APIUrl:
        ZENDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl) +
        ZENDESK_AUTH_URLS.GET_USER_ME,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {      
          if (result.status === 200) {
            if (!JSON.parse(result.data.res).hasOwnProperty("error")) {            
              if (JSON.parse(result.data.res).user.id !== null) {            
                this.addAuthAccnt(
                  result.data,
                  apiUrl,
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
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = async (res, apiUrl, apiKey, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.user.email,
      userName: res.user.name,
      cliType: cliType,
      apiName: apiName,
      memberId: res.user.id,
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: res.user,
      endPoint: ZENDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl),
      connectionName: apiName + " " + res.user.email,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then((resInfo) => {
          // Redirection to connection CLI
          if (resInfo.data.statusCode === 200) {
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.setState({ isLoading: false });
            } else {             
              let id = resInfo.data.data.message;
              let commonInfo = res.user.id;
              this.checkConnectionInfo(
                id,
                commonInfo,
                cliType,
                apiUrl,
                apiKey,
                res.user.email
              );
              //this.addTarget(apiUrl, apiKey, res.user.email, commonInfo);
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // add Target
  addTarget = async (apiUrl, apiKey, email, memberId, connectionId,cliType) => {
    let authorizationKey = "Basic " + btoa(email + "/token:" + apiKey);
    let formdata = {
      headerValue: {
        Authorization: authorizationKey,
        Accept: "application/json",
      },
      APIUrl:
        ZENDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl) +
        ZENDESK_AUTH_URLS.CREATE_TARGET,
      bodyInfo: {
        target: {
          type: "http_target",
          target_url: ZENDESK_AUTH_URLS.CREATE_WEBHOOK.replace(
            "{commonInfo}",
            memberId
          ),
          title: "formSync",
          method: "Post",
          content_type: "application/json",
        },
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then(async (result) => {
          if (result.status === 200) {            
            if (!result.data.res.hasOwnProperty("error")) {
              let targerId = result.data.res.target.id;
              let triggerId = [];
              await Promise.all(
                ZENDESK_AUTH_URLS.TRIGGER.map(async (trigger) => {
                  await this.addTrigger(
                    apiUrl,
                    apiKey,
                    email,
                    targerId,
                    trigger,
                    triggerId
                  );
                })
              );

              this.updateConnectionInfo(connectionId, triggerId.join(),cliType);
            } else {
              ToastsStore.error(
                "ExceededTrialAccountTargetLimitError,webhook can't be setup"
              );
            }
          }
        });
    } catch (err) {
      //this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // add trigger
  addTrigger = async (apiUrl, apiKey, email, targerId, trigger, triggerId) => {
    let bodyInfo = JSON.stringify({
      event: `${trigger}_ticket`,
      action: "public",
      event_time: "{{ticket.updated_at_with_timestamp}}",
      comment: {
        author: "{{ticket.latest_comment.author.name}}",
        body: "{{ticket.latest_comment}}",
        created_at: "{{ticket.created_at_with_timestamp}}",
        id: "{{ticket.id}}",
        public: "True",
        url: "{{ticket.latest_comment.url}}",
        ticket_url: "{{ticket.url}}",
        ticket_title: "{{ticket.title}}",
        ticket_external_id: "{{ticket.external_id}}",
      },
    });
    let formdata = {
      headerValue: {
        Authorization: "Basic " + btoa(email + "/token:" + apiKey),
        Accept: "application/json",
      },
      APIUrl:
        ZENDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl) +
        ZENDESK_AUTH_URLS.CREATE_TRIGGER,
      bodyInfo: {
        trigger: {
          actions: [
            {
              field: "notification_target",
              value: [`${targerId}`, `${bodyInfo}`],
            },
          ],
          conditions: {
            all: [
              {
                field: "update_type",
                operator: "is",
                value: `${trigger}`,
              },
            ],
            any: [],
          },
          // category_id: "2825157",
          title: `${trigger} Ticket`,
        },
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            console.log("trigger added", result);
            if (result.data.res.trigger) {
              triggerId.push(result.data.res.trigger.id);
            }
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // check connection info
  checkConnectionInfo = (id, memberId, cliType, apiUrl, apiKey, email) => {
    let data = {};
    let bodyData = {
      memberId: memberId,
      cliType: cliType,
    };
    try {
      httpClient
        .post(WEBHOOK_URLS.GET_CONNECTION_INFO, bodyData)
        .then((result) => {
          if (result.status === 200) {
            data = result.data.data;
            if (data.webhookId === "") {
              this.addTarget(apiUrl, apiKey, email, memberId, id,cliType);
            } else {
              this.updateConnectionInfo(id, data.webhookId,cliType);
            }
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
    return data;
  };

  //update connection
  updateConnectionInfo = (id, targetId,cliType) => {
    let bodyData = {
      id: id,
      webhookId: targetId,
      webhookToken: "",
    };
    try {
      httpClient
        .post(WEBHOOK_URLS.UPDATE_CONNECTION_INFO, bodyData)
        .then((result) => {
          if (result.status === 200) {
            ToastsStore.success("Data saved successfully");
            this.setState({ isLoading: false });
            this.props.OnSuccess(cliType);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  handleInputChange = (value, name) => {
    this.setState({ [name]: value });

    setTimeout(() => {
      if (
        this.state.apiUrl.replace(/\s/g, "").length &&
        this.state.apiKey.replace(/\s/g, "").length &&
        this.state.agentEmail.replace(/\s/g, "").length
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
      _self.state.apiUrl,
      _self.state.apiKey,
      _self.state.agentEmail,
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
                //variant="ActiveCampaignWindow"
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
                Allow FormSync to access your <br /> Zendesk Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong> Account</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    https://
                    <input
                      className="form-control"
                      name="apiUrl"
                      style={{ width: "50%" }}
                      onChange={(e) =>
                        this.handleInputChange(e.target.value, "apiUrl")
                      }
                    />
                    {".zendesk.com/"}
                  </div>
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>Agent Email</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Should be the same email you use to login to administer your
                    Zendesk account.
                  </p>
                  <input
                    className="form-control"
                    name="apiKey"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "agentEmail")
                    }
                  />
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>API Token</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Found in Admin &gt; Channels &gt; API.
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
            <div id="GmailLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default Zendesk;
