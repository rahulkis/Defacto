import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  HELP_SCOUT_AUTH_URLS,
} from "constants/IntegrationConstant";
import { HELPSCOUT_WEBHOOK_URLS ,WEBHOOK_URLS} from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import { v4 as uuidv4 } from 'uuid';
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class HelpScout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      isReconnectId:props.isReconnectId
    };
  }
  componentDidMount() {
    if (this.props.onOpen) {
      document.getElementById("HelpScoutDivId").click();
    }
  }
  onCode = async (code, params) => {  
    this.setState({ isLoading: true });
    try {      
      this.props.OnLoading();
      await this.getAccessToken(
        code,
        this.state.selectedCLI,
        this.state.selectedAPI
      );
      //this.props.onClose();
    } catch (error) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(error);
    }
  };

  getAccessToken = async (code, cliType, apiName) => {
    if (code) {
      let formModel = {
        APIUrl: " https://api.helpscout.net/v2/oauth2/token",
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: HELP_SCOUT_AUTH_URLS.CLIENT_ID,
          client_secret: HELP_SCOUT_AUTH_URLS.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
        },
      };
      await httpClient
        .post(AUTH_INTEGRATION.URL_ENCODED_ACCESS_TOKEN, formModel)
        .then((result) => {
          if (result !== null) {
            if (result.status === 200) {
              if (result.data !== undefined) {
                result = JSON.parse(result.data.res);
                if (result.access_token !== undefined) {
                  this.get_accountInfo(result, cliType, apiName);
                } else {
                  this.props.OnLoading();
                  this.setState({ isLoading: false });
                  showErrorToaster("error");
                }
              }
            }
          }
        });
    } else {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster("error");
    }
  };

  get_accountInfo = async (res, cliType, apiName) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + res.access_token,
        Accept: "application/json",
      },
      APIUrl: "https://api.helpscout.net/v2/users/me",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.data.statusCode === 200) {          
            this.addAuthAccnt(result.data, res, cliType, apiName);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = (res, tokenInfo, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.email,
      userName: res.firstName + " " + res.lastName,
      clientId: HELP_SCOUT_AUTH_URLS.CLIENT_ID,
      clientSecret: HELP_SCOUT_AUTH_URLS.CLIENT_SECRET,
      cliType: cliType,
      apiName: apiName,
      memberId: res.id,
      token: tokenInfo.refresh_token,
      keyType: "refreshToken",
      tokenInfo: tokenInfo,
      endPoint: "https://api.helpscout.net",
      connectionName: apiName + " " + res.email,
      isReconnectId:this.state.isReconnectId,
      webhookId: ""
    };
    try {
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then(async (resInfo) => {       
        // Redirection to connection CLI
        if (resInfo.data.statusCode === 200) {
          //this.props.OnLoading();

          if (this.state.isReconnectId) {
            ToastsStore.success(resInfo.data.data.message);
            this.props.OnSuccess(cliType);
          } else {      
            ToastsStore.success("Data saved successfully");
            let id = resInfo.data.data.message;              
            //checkid the same connection count
            let webhookId = "";
            let connectionInfo = await this.checkConnectionInfo(
              res.id,
              cliType
            );             
            if (
              connectionInfo.webhookId === "" 
            ) {               
              let webhookInfo = await this.addWebHook(
                tokenInfo.access_token,
                res.id,
                cliType               
              );
              webhookId = webhookInfo;
            } else {               
              webhookId = connectionInfo.webhookId;
            }              
            await this.updateConnectionInfo(id, webhookId,cliType);
          }         
         
        }
        this.setState({ isLoading: false });
      }).catch((err) => {      
        if(err.response.status){
          showErrorToaster (err.response.data.data);
        } 
        this.props.OnSuccess(cliType);           
      });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };


// Create Webhooks
addWebHook = async (token, memberId,cliType) => {
  let webhookId="";
  let formdata = {
    headerValue: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    APIUrl: HELP_SCOUT_AUTH_URLS.CREATE_WEBHOOK,
    bodyInfo: {
        url : HELPSCOUT_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace("{commonInfo}",memberId),
        events : [ "convo.assigned","convo.created","convo.tags","customer.created"],
        secret : uuidv4(),
        payloadVersion : "V2",
        label: "Defactosync webhook"
    },
    cliType:cliType,
    eventType:"createwebhook"
  };
  try {    
    await httpClient
      .post(AUTH_INTEGRATION.POST_API, formdata)
      .then((result) => {
        if (result.status === 200) {
          webhookId=result.data.res;
        }
      });
  } catch (err) {
    this.props.OnLoading();
    this.setState({ isLoading: false });
    showErrorToaster(err);
  }
  return webhookId;
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
    return (
      <>
        {this.props.onOpen && (
          <OauthPopup
            onClose={this.props.onClose}
            url={HELP_SCOUT_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              HELP_SCOUT_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="HelpScoutDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default HelpScout;
