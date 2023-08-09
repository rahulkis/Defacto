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
  ACTIVECAMPAIGN_WEBHOOK_URLS,
  WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  ACTIVECAMPAIGN_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ActiveCampaign extends Component {
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
        "Api-Token": apiKey,
        Accept: "application/json",
      },
      APIUrl: apiUrl + ACTIVECAMPAIGN_AUTH_URLS.GET_USER_ME,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {            
            this.addAuthAccnt(result.data, apiUrl, apiKey, cliType, apiName);
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

  addAuthAccnt = async (res, apiUrl, apiKey, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.user.email,
      userName: res.user.firstName,
      cliType: cliType,
      apiName: apiName,
      memberId: (apiName + " " + res.user.email).replace(/\s+/g, "").toLowerCase(),
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: res.user,
      endPoint: apiUrl,
      connectionName: apiName + " " + res.user.email,
      isReconnectId: this.state.isReconnectId,
      webhookId:""
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
               (apiName + " " + res.user.email).replace(/\s+/g, "").toLowerCase(),
                cliType,
                res.user.email,
                apiKey,
                connectionId,
                apiUrl
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
  addWebHook = async (apiUrl, apiKey, cliType, email, commonInfo,connectionId) => {
    let formdata = {
      headerValue: {
        "Api-Token": apiKey,
        Accept: "application/json",
      },
      APIUrl: apiUrl + ACTIVECAMPAIGN_AUTH_URLS.CREATE_WEBHOOK,
      bodyInfo: {
        webhook: {
          name: cliType + "_" + email,
          url:
            ACTIVECAMPAIGN_WEBHOOK_URLS.POST_WEBHOOK_REQUEST +
            "?commonInfo=" +
            commonInfo.replace(/\s+/g, "").toLowerCase(),
          events: ACTIVECAMPAIGN_WEBHOOK_URLS.EVENT_LIST,
          sources: ACTIVECAMPAIGN_WEBHOOK_URLS.SOURCE_LIST,
        },
      },
    };
  
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {     
          console.log("result",result)
          if (result.status === 200) {           
            this.updateConnectionInfo(
              connectionId,
              result.data.res.webhook.id,cliType
            );
          }
        });
    } catch (err) {      
      showErrorToaster(err);
    }
  };

   // check connection info
   checkConnectionInfo = async (
    memberId,
    cliType,
    email,
    apiKey,
    connectionId,
    apiUrl
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
              this.addWebHook(
                apiUrl,
                apiKey,
                cliType,
               email,
               memberId,connectionId
              );
            } else {
              this.updateConnectionInfo(
                connectionId,
                result.data.data.webhookId,cliType
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
   updateConnectionInfo = async (id, webhookId,cliType) => {
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
      showErrorToaster(err);
    }
  };


  handleInputChange = (value, name) => {
    this.setState({ [name]: value });

    setTimeout(() => {
      if (this.state.apiUrl.replace(/\s/g, "").length && this.state.apiKey.replace(/\s/g, "").length) {
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
                Allow FormSync to access your <br /> ActiveCampaign Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong> API Url</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Login to your ActiveCampaign account; click "My Settings" in
                    your account menu, then click the "Developer" tab. Ex.:{" "}
                    <code>https://account.api-us1.com</code>.
                  </p>
                  <input
                    className="form-control"
                    name="apiUrl"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "apiUrl")
                    }
                  />
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>API Key</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    The unique API Key for your ActiveCampaign user.
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

export default ActiveCampaign;
