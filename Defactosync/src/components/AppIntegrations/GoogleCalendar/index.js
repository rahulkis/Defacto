import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  GOOGLE_CALENDAR_AUTH_URLS,
  GOOGLE_CREDENTIALS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import { v4 as uuidv4 } from "uuid";
import { WEBHOOK_URLS } from "constants/AppConst";

class GoogleCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      isReconnectId: props.isReconnectId,
      webhookId: props.connectionInfo ? props.connectionInfo.webhookId : "",
      webhookToken: props.connectionInfo
        ? props.connectionInfo.webhookToken
        : "",
    };
    
  }
  componentDidMount() {
    if (this.props.onOpen) {
      document.getElementById("GoogleCalendarDivId").click();
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
      //this.props.closeDialog();
    } catch (error) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(error);
    }
  };

  getAccessToken = async (code, cliType, apiName) => {
    if (code) {
      let formModel = {
        APIUrl: "https://oauth2.googleapis.com/token",
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: GOOGLE_CREDENTIALS.CLIENT_ID,
          client_secret: GOOGLE_CREDENTIALS.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: `${window.location.origin.toString()}/app/dashboard`,
        },
      };
      httpClient
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
      APIUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {         
            this.addAuthAccnt(result.data, res, cliType, apiName);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({
        isLoadingFields: false,
      });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = (res, tokenInfo, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.email,
      userName: res.name,
      cliType: cliType,
      memberId: res.id,
      token: tokenInfo.refresh_token,
      keyType: "refreshToken",
      tokenInfo: tokenInfo,
      apiName: apiName,
      endPoint: "https://www.googleapis.com/calendar/v3/",
      connectionName: apiName + " " + res.email,
      isReconnectId: this.state.isReconnectId,
      clientId: GOOGLE_CREDENTIALS.CLIENT_ID,
      clientSecret: GOOGLE_CREDENTIALS.CLIENT_SECRET,
      webhookId: "",
      webhookToken: ""
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {   
          if (resInfo.data.statusCode === 200) {     
            this.props.OnLoading();
            let connectionId = "";
            let webhookIdData = [];
            let webhookTokenData = [];

            if (this.state.isReconnectId) {
              connectionId = this.state.isReconnectId;
            
              if (this.state.webhookId !== "") {
                let webhookResourceId = this.state.webhookToken.split(",");
                let ids = this.state.webhookId.split(",");
               
                ids.forEach((value, i)=> {
                  this.stopWatch(
                    tokenInfo.access_token, 
                    webhookResourceId[i],
                    ids[i],
                  );
                });
              }
              ToastsStore.success(resInfo.data.data.message);
            } else {
              connectionId = resInfo.data.data.message;
              ToastsStore.success("Data saved successfully");
            }    
         console.log("getCalenders")  
            await this.getCalenders(
              tokenInfo.access_token,
              res.id,
              webhookIdData,
              webhookTokenData
            );
            console.log("updateConnectionInfo")  
            await this.updateConnectionInfo(
              connectionId,
              webhookIdData,
              webhookTokenData,cliType
            );
            
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

  // stop watch
  stopWatch = async (token, resourceId, id) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: GOOGLE_CALENDAR_AUTH_URLS.STOP_WATCH,
      bodyInfo: {
        resourceId: resourceId,
        id: id,
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          console.log("watch stopped", result);
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  // add watch
  addWatch = async (
    token,
    memberId,
    calendarId,
    webhookIdData,
    webhookTokenData
  ) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: GOOGLE_CALENDAR_AUTH_URLS.ADD_WATCH.replace(
        "{calendarId}",
        calendarId
      ),
      bodyInfo: {
        id: uuidv4(),
        type: "web_hook",
        address: GOOGLE_CALENDAR_AUTH_URLS.CREATE_WEBHOOK.replace(
          "{commonInfo}",
          memberId
        ),
        params: {
          ttl: "3599",
        },
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            console.log("watch added", result);
            if (result.data.res.id) {
              webhookIdData.push(result.data.res.id);
              webhookTokenData.push(result.data.res.resourceId);
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  // get calenders
  getCalenders = async (token, memberId, webhookIdData, webhookTokenData) => {
    console.log("getCalendersinside")  
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      APIUrl: GOOGLE_CALENDAR_AUTH_URLS.Get_Calender_List,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then(async (result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            console.log("parsedResponse",parsedResponse)
            if (result.status === 200 && !parsedResponse.error) {              
              await Promise.all(
                parsedResponse.items.map(async (item) => {
                  await this.addWatch(
                    token,
                    memberId,
                    item.id,
                    webhookIdData,
                    webhookTokenData
                  );
                })
              );
            }else{
              ToastsStore.error("Delete and Recreate connection with desired permission while creating.");
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  //update connection
  updateConnectionInfo = async (id, webhookId, webhookToken,cliType) => {
    console.log("updateConnectionInfoinside")  
    let bodyData = {
      id: id,
      webhookId: webhookId.length?webhookId.join():"",
      webhookToken: webhookToken.length?webhookToken.join():""
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
    return (
      <>
        {this.props.onOpen && (
          <OauthPopup
            onClose={this.props.onClose}
            url={GOOGLE_CALENDAR_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              GOOGLE_CREDENTIALS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="GoogleCalendarDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default GoogleCalendar;
