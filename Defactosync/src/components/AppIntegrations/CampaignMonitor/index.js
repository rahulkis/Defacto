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
  CAMPAIGN_MONITOR_WEBHOOK_URLS,
  WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  CAMPAIGN_MONITOR_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class CampaignMonitor extends Component {
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

  get_clientInfo = async (apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(apiKey, "X"),
      },
      APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.BASE_URL + "/clients.json",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {  
              if(JSON.parse(result.data.res).length){
                let clientId = JSON.parse(result.data.res)[0].ClientID;
                this.get_accountInfo(apiKey, cliType, apiName, clientId);
              }else{
                ToastsStore.error("Invalid ApiKey Value");
                this.setState({ isLoading: false });
              }            
           
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  get_accountInfo = async (apiKey, cliType, apiName, clientId) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(apiKey, "X"),
      },
      APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.BASE_URL + "/admins.json",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (result.data.res.length) {
              this.addAuthAccnt(
                result.data,
                clientId,
                apiKey,
                cliType,
                apiName
              );
            }
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = (res, clientId, apiKey, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res[0].EmailAddress,
      userName: res[0].Name,
      cliType: cliType,
      apiName: apiName,
      memberId: clientId,
      token: apiKey,
      keyType: "apiKey",
      tokenInfo: res,
      endPoint: "https://api.createsend.com/api/v3.2/",
      connectionName: apiName + " " + res[0].EmailAddress,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
      webhookToken:""
    };
    try {
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then((resInfo) => {
        
        // Redirection to connection CLI
        if (resInfo.data.statusCode === 200) {
          if (this.state.isReconnectId) {
            ToastsStore.success(resInfo.data.data.message);
            this.setState({ isLoading: false });
            this.props.OnSuccess(cliType);           
          } else {
            let id = resInfo.data.data.message;
            //checkid the same connection count
            this.checkConnectionInfo(id, clientId, cliType, apiKey);
            
          }
          //this.props.OnLoading();
         
        }
        //this.setState({ isLoading: false });
      });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };
  handleInputChange = (value, name) => {

    if (value.replace(/\s/g, "").length) {
      this.setState({ [name]: value.trim(), btnDisabled: false });
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
    this.get_clientInfo(
      _self.state.apiKey,
      _self.state.selectedCLI,
      _self.state.selectedAPI
    );
  };

  // check connection info
  checkConnectionInfo = (id, memberId, cliType, apikey) => {
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
              this.addWebHook(apikey, memberId, id,cliType);
            } else {
              this.updateConnectionInfo(id, data.webhookId,data.webhookToken,cliType);
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

  // Create Webhooks
  addWebHook = (apiKey, memberId, id,cliType) => {
    let clientList = [];
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(apiKey, "X"),
      },
      APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.GET_CLIENT_LIST.replace(
        "{clientid}",
        memberId
      ),
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then(async (result) => {
          if (result.status === 200) {     
            const objArray = JSON.parse(result.data.res);
            clientList = objArray.map((a) => a.ListID);
            let joinClientList = clientList.join();
           
            this.AddWebhookFnc(clientList, memberId, apiKey,id, joinClientList,cliType);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // Add WebHookFunction
  AddWebhookFnc = (clientLists, memberId, apiKey,connectionId,listId,cliType) => {
    clientLists.map(async (list) => {
      let formdata = {
        headerValue: {
          Authorization: authenticateUser(apiKey, "X"),
        },
        APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.CREATE_WEBHOOK.replace(
          "{listId}",
          list
        ),
        bodyInfo: {
          Url: CAMPAIGN_MONITOR_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            memberId
          ),
          Events: CAMPAIGN_MONITOR_WEBHOOK_URLS.EVENTS,
          PayloadFormat: "json",
        },
      };

      try {
        await httpClient
          .post(AUTH_INTEGRATION.POST_API, formdata)
          .then((result) => {           
            if (result.status === 200) {
              //this.getwebhooks(clientLists,apiKey);
              this.updateConnectionInfo(connectionId, result.data.res,listId,cliType);
            }
          });
      } catch (err) {
        this.props.OnLoading();
        this.setState({ isLoading: false });
        showErrorToaster(err);
      }
    });
  };


   // Add WebHookFunction
   getwebhooks = (clientLists, apiKey) => {
    clientLists.map(async (list) => {
      let formdata = {
        headerValue: {
          Authorization: authenticateUser(apiKey, "X"),
        },
        APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.CREATE_WEBHOOK.replace(
          "{listId}",
          list
        )       
      };

      try {
        await httpClient
          .post(AUTH_INTEGRATION.GET_API, formdata)
          .then((result) => {   
            if (result.status === 200) {
             
            }
          });
      } catch (err) {
        
      }
    });
  };

  //update connection
  updateConnectionInfo = (id,webhookId, listId,cliType) => {
 
    let bodyData = {
      id: id,
      webhookId: webhookId,
      webhookToken:listId,
    }
    try {
      httpClient
        .post(WEBHOOK_URLS.UPDATE_CONNECTION_INFO, bodyData)
        .then((result) => {         
          if (result.status === 200) {      
            this.props.OnSuccess(cliType);
            this.setState({ isLoading: false });
            ToastsStore.success("Data saved successfully");
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
                //variant="CampaignMonitorWindow"
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
                Allow FormSync to access your <br /> Campaign Monitor Account?
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
                    You can find your API Key on your Account Settings screen.
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
            <div id="CampaignMonitorLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default CampaignMonitor;
