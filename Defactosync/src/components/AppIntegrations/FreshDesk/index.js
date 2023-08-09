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
  FRESHDESK_AUTH_URLS,
} from "constants/IntegrationConstant";
import { WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FreshDesk extends Component {
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

  get_accountInfo = async (apiUrl, apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(apiKey, "X"),
      },
      APIUrl: "https://" + apiUrl + ".freshdesk.com/api/v2/agents/me",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (
              result.data.res.replace(/\s/g, "").length &&
              !JSON.parse(result.data.res).code
            ) {
              this.addAuthAccnt(result.data, apiUrl, apiKey, cliType, apiName);
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

  addAuthAccnt = (res, apiUrl, apiKey, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.contact.email,
      userName: res.contact.name,
      cliType: cliType,
      apiName: apiName,
      memberId: res.id,
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: res.contact,
      endPoint: FRESHDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl),
      connectionName: apiName + " " + res.contact.email,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
    };
    try {
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then((resInfo) => {
        // Redirection to connection CLI
        if (resInfo.data.statusCode === 200) {
          if (this.state.isReconnectId) {
            ToastsStore.success(resInfo.data.data.message);
            //this.props.OnSuccess(cliType);
            this.setState({ isLoading: false });
          } else {
            // ToastsStore.success("Data saved successfully");
            let id = resInfo.data.data.message;
            this.checkConnectionInfo(
              id,
              res.id,
              cliType,
              apiUrl,
              apiKey,
              res.contact.email
            );
          }
        }
        //this.setState({ isLoading: false });
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
        this.state.apiUrl.replace(/\s/g, "").length &&
        this.state.apiKey.replace(/\s/g, "").length
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
      _self.state.selectedCLI,
      _self.state.selectedAPI
    );
  };

  // check connection info
  checkConnectionInfo = (
    connectionId,
    memberId,
    cliType,
    apiUrl,
    apiKey,
    email
  ) => {
    let data = {};
    let bodyData = {
      memberId: memberId,
      cliType: cliType,
    };
    try {
      httpClient
        .post(WEBHOOK_URLS.GET_CONNECTION_INFO, bodyData)
        .then(async (result) => {
          if (result.status === 200) {
            let ids = [];
            data = result.data.data;
            if (data.webhookId === "") {
              ids.push(await this.createTicket(apiUrl, apiKey, memberId));
              ids.push(await this.updateTicket(apiUrl, apiKey, memberId));
              ids.push(await this.updateTicketNotes(apiUrl, apiKey, memberId));

              this.updateConnectionInfo(connectionId, ids.join(), cliType);
            } else {
              this.updateConnectionInfo(connectionId, data.webhookId, cliType);
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
  updateConnectionInfo = (id, targetId, cliType) => {
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
            //this.props.OnSuccess(cliType);
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

  // create ticket
  createTicket = async (apiUrl, apiKey, memberId) => {
    return new Promise(async function(resolve, reject) {
      let formdata = {
        headerValue: {
          Authorization: authenticateUser(apiKey, "X"),
        },
        APIUrl:
          FRESHDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl) +
          FRESHDESK_AUTH_URLS.CREATE_TICKET,
        bodyInfo: {
          name: "FormSyncTicketCreate",

          active: true,
          conditions: [
            {
              name: "condition_set_1",
              match_type: "any",
              properties: [
                {
                  field_name: "created_at",
                  resource_type: "ticket",
                  operator: "during",
                  value: "business_hours",
                },
                {
                  field_name: "created_at",
                  resource_type: "ticket",
                  operator: "during",
                  value: "non_business_hours",
                },
                {
                  field_name: "created_at",
                  resource_type: "ticket",
                  operator: "during",
                  value: "holidays",
                },
              ],
            },
          ],
          actions: [
            {
              request_type: "POST",
              url: FRESHDESK_AUTH_URLS.CREATE_WEBHOOK.replace(
                "{commonInfo}",
                memberId
              ),
              field_name: "trigger_webhook",
              content_type: "JSON",
              content_layout: "2",
              content: {
                event: "Create_ticket",
                event_time: "{{ticket.modified_on}}",
                ticket_Id: "{{ticket.id}}",
                description: "{{ticket.description}}",
                subject: "{{ticket.subject}}",
                status: "{{ticket.status}}",
                ticket_type: "{{ticket.ticket_type}}",
                triggered_event: "{{triggered_event}}",
                contact_id: "{{ticket.requester.id}}",
                contact_name: "{{ticket.requester.name}}",
                contact_email: "{{ticket.requester.email}}",
                contact_mobile: "{{ticket.requester.mobile}}",
                contact_phone: "{{ticket.requester.phone}}",
                contact_address: "{{ticket.requester.address}}",
                contact_jobTitle: "{{ticket.requester.job_title}}",
              },
            },
          ],
        },
      };
      console.log("formDta", formdata);
      try {
        await httpClient
          .post(AUTH_INTEGRATION.POST_API, formdata)
          .then((result) => {
            if (result.status === 200) {
              console.log("ticket create trigger added");
              resolve(result.data.res.id);
            }
          });
      } catch (err) {
        this.props.OnLoading();
        this.setState({ isLoading: false });
        showErrorToaster(err);
        reject(err);
      }
    });
  };

  // update ticket
  updateTicket = async (apiUrl, apiKey, memberId) => {
    return new Promise(async function(resolve, reject) {
      let formdata = {
        headerValue: {
          Authorization: authenticateUser(apiKey, "X"),
        },
        APIUrl:
          FRESHDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl) +
          FRESHDESK_AUTH_URLS.UPDATE_TICKET,
        bodyInfo: {
          name: "FormSyncTicketUpdate",

          active: true,
          conditions: [
            {
              name: "condition_set_1",
              match_type: "any",
              properties: [
                {
                  field_name: "updated_at",
                  resource_type: "ticket",
                  operator: "during",
                  value: "business_hours",
                },
                {
                  field_name: "updated_at",
                  resource_type: "ticket",
                  operator: "during",
                  value: "non_business_hours",
                },
                {
                  field_name: "updated_at",
                  resource_type: "ticket",
                  operator: "during",
                  value: "holidays",
                },
              ],
            },
          ],
          performer: {
            type: 3,
          },
          events: [
            {
              field_name: "ticket_action",
              value: "update",
            },
          ],
          actions: [
            {
              request_type: "POST",
              url: FRESHDESK_AUTH_URLS.CREATE_WEBHOOK.replace(
                "{commonInfo}",
                memberId
              ),
              field_name: "trigger_webhook",
              content_type: "JSON",
              content_layout: "2",
              content: {
                event: "Update_ticket",
                event_time: "{{ticket.modified_on}}",
                ticket_Id: "{{ticket.id}}",
                description: "{{ticket.description}}",
                subject: "{{ticket.subject}}",
                status: "{{ticket.status}}",
                ticket_type: "{{ticket.ticket_type}}",
                triggered_event: "{{triggered_event}}",
                public_comment: "{{ticket.latest_public_comment}}",
                private_comment: "{{ticket.latest_private_comment}}",
                contact_id: "{{ticket.requester.id}}",
                contact_name: "{{ticket.requester.name}}",
                contact_email: "{{ticket.requester.email}}",
                contact_mobile: "{{ticket.requester.mobile}}",
                contact_phone: "{{ticket.requester.phone}}",
                contact_address: "{{ticket.requester.address}}",
                contact_jobTitle: "{{ticket.requester.job_title}}",
              },
            },
          ],
        },
      };
      try {
        await httpClient
          .post(AUTH_INTEGRATION.POST_API, formdata)
          .then((result) => {
            if (result.status === 200) {
              console.log("ticket update trigger added");
              resolve(result.data.res.id);
            }
          });
      } catch (err) {
        this.props.OnLoading();
        this.setState({ isLoading: false });
        showErrorToaster(err);
        reject(err);
      }
    });
  };

  // update ticket Notes
  updateTicketNotes = async (apiUrl, apiKey, memberId) => {
    return new Promise(async function(resolve, reject) {
      let formdata = {
        headerValue: {
          Authorization: authenticateUser(apiKey, "X"),
        },
        APIUrl:
          FRESHDESK_AUTH_URLS.BASE_URL.replace("{subdomain}", apiUrl) +
          FRESHDESK_AUTH_URLS.UPDATE_TICKET,
        bodyInfo: {
          name: "FormSyncTicketNote",

          active: true,
          performer: {
            type: 3,
          },
          events: [
            {
              field_name: "note_type",
              value: "--",
            },
          ],

          actions: [
            {
              request_type: "POST",
              url: FRESHDESK_AUTH_URLS.CREATE_WEBHOOK.replace(
                "{commonInfo}",
                memberId
              ),
              field_name: "trigger_webhook",
              content_type: "JSON",
              content_layout: "2",
              content: {
                event: "Create_Note",
                event_time: "{{ticket.modified_on}}",
                ticket_Id: "{{ticket.id}}",
                status: "{{ticket.status}}",
                ticket_type: "{{ticket.ticket_type}}",
                triggered_event: "{{triggered_event}}",
                private_comment: "{{ticket.latest_private_comment}}",
              },
            },
          ],
        },
      };
      try {
        await httpClient
          .post(AUTH_INTEGRATION.POST_API, formdata)
          .then((result) => {
            if (result.status === 200) {
              console.log("ticket notes trigger added");
              resolve(result.data.res.id);
            }
          });
      } catch (err) {
        this.props.OnLoading();
        this.setState({ isLoading: false });
        showErrorToaster(err);
        reject(err);
      }
    });
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
                Allow FormSync to access your <br /> Freshdesk Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong> Subdomain</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    This is your registered domain name at freskdesk.com.
                  </p>
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
                    {".freshdesk.com"}
                  </div>
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>API Key</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Log in to https://your-helpdesk-url.freshdesk.com Click on
                    your Profile Picture on the top right and select "Profile
                    Settings" In the sidebar, you will find the API Key
                    Copy-paste this key.
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
            <div id="FreshDeskLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default FreshDesk;
