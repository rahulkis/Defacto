import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  ZOHOCRM_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import { ZOHOCRM_WEBHOOK_URLS, WEBHOOK_URLS } from "constants/AppConst";
const UUID = require("uuid-int");

class ZohoCRM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      isReconnectId: props.isReconnectId,
    };
  }
  componentDidMount() {
    if (this.props.onOpen) {
      document.getElementById("ZohoCRMDivId").click();
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
      // this.props.closeDialog();
    } catch (error) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(error);
    }
  };

  getAccessToken = async (code, cliType, apiName) => {  
  
    if (code) {
   
      let formModel = {
        APIUrl: "https://accounts.zoho.com/oauth/v2/token",
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: ZOHOCRM_AUTH_URLS.CLIENT_ID,
          client_secret: ZOHOCRM_AUTH_URLS.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: `${window.location.origin.toString()}/app/dashboard`,
        },
      };
     
      await httpClient
        .post(AUTH_INTEGRATION.URL_ENCODED_ACCESS_TOKEN, formModel)
        .then((result) => {         
          if (result !== null) {
            if (result.status === 200) {
              if (result.data !== undefined) {
                if (result.data.statusCode === 200) {
                  let res = JSON.parse(result.data.res);
                  if (!res.error) {
                    this.get_accountInfo(res, cliType, apiName);
                  }
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
      APIUrl: "https://www.zohoapis.com/crm/v2/users?type=CurrentUser",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {            
            if (result.data.statusCode === 200) {
              if(result.data.res!==""){
                result.data = JSON.parse(result.data.res);
                if (result.data.users.length) {
                  this.addAuthAccnt(result.data.users[0], res, cliType, apiName);
                }
              }else{
                ToastsStore.error("Please connect by production account");
                this.props.OnLoading();
              }
            }
          }
        });
    } catch (err) {     
      this.props.OnLoading();    
      showErrorToaster(err);
    }
  };

  addAuthAccnt = (res, tokenInfo, cliType, apiName) => { 
    let formModel = {
      email: res.email,
      userName: res.full_name,
      cliType: cliType,
      memberId: res.id,
      token: tokenInfo.refresh_token,
      keyType: "refreshToken",
      tokenInfo: tokenInfo,
      profileInfo: res,
      apiName: apiName,
      endPoint: ZOHOCRM_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.email,
      isReconnectId: this.state.isReconnectId,
      clientId: ZOHOCRM_AUTH_URLS.CLIENT_ID,
      clientSecret: ZOHOCRM_AUTH_URLS.CLIENT_SECRET,
      webhookId: "",
    };

    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {        
          if (resInfo.data.statusCode === 200) {
            let connectionId = "";
            if (this.state.isReconnectId) {
              connectionId = this.state.isReconnectId;
              await this.checkConnectionInfo(
                res.id,
                cliType,
                tokenInfo.access_token
              );
              ToastsStore.success(resInfo.data.data.message);
            } else {
              connectionId = resInfo.data.data.message;
              ToastsStore.success("Data saved successfully");
            }
            this.addWatch(tokenInfo.access_token, res.id, connectionId,cliType);
           
          }
    
        }).catch((err) => {      
          if(err.response.status){
            showErrorToaster (err.response.data.data);
          } 
          this.props.OnSuccess(cliType);           
        });
    } catch (err) {     
      showErrorToaster(err);
    }
    
  };

  // add watch
  addWatch = async (token, id, connectionId,cliType) => {
    const generator = UUID(0);
    const uuid = generator.uuid();
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: ZOHOCRM_AUTH_URLS.BASE_URL + ZOHOCRM_AUTH_URLS.ADD_WATCH,
      bodyInfo: {
        watch: [
          {
            channel_id: uuid,
            events: ZOHOCRM_WEBHOOK_URLS.EVENTS,
            notify_url: ZOHOCRM_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
              "{commonInfo}",
              id
            ),
          },
        ],
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          console.log("watch added", result);
          this.updateConnectionInfo(connectionId, uuid,cliType);
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // stop watch
  stopWatch = async (token, id) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.DELETE_WATCH.replace("{channel_id}", id),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.DELETE_API, formdata)
        .then((result) => {
          console.log("watch stopped", result);
        });
    } catch (err) {
     // this.props.OnLoading();
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
  checkConnectionInfo = async (memberId, cliType, token) => {
    let bodyData = {
      memberId: memberId,
      cliType: cliType,
    };
    try {
      await httpClient
        .post(WEBHOOK_URLS.GET_CONNECTION_INFO, bodyData)
        .then((result) => {
          if (result.status === 200) {
            if (result.data.data.webhookId !== "") {
              this.stopWatch(token, result.data.data.webhookId);
            }
          }
        });
    } catch (err) {
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
            url={ZOHOCRM_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              ZOHOCRM_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="ZohoCRMDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default ZohoCRM;
