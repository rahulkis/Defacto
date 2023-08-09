import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  KEAP_AUTH_URLS,
} from "constants/IntegrationConstant";
import { WEBHOOK_URLS, KEAP_WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class KeapInfusionsoft extends Component {
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
      document.getElementById("KeapInfusionsoftDivId").click();
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
        APIUrl: KEAP_AUTH_URLS.BASE_URL + "token",
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: KEAP_AUTH_URLS.CLIENT_ID,
          client_secret: KEAP_AUTH_URLS.CLIENT_SECRET,
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
      APIUrl: KEAP_AUTH_URLS.BASE_URL + "crm/rest/v1/oauth/connect/userinfo",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {          
          if (result.status === 200) {
            if (result.data.statusCode === 200) {
              result.data = JSON.parse(result.data.res);
              this.addAuthAccnt(result.data, res, cliType, apiName);
            }
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
    let formModel = {
      email: res.email,
      userName: res.given_name + " " + res.family_name,
      cliType: cliType,
      memberId: res.global_user_id,
      token: tokenInfo.refresh_token,
      keyType: "refreshToken",
      tokenInfo: tokenInfo,
      apiName: apiName,
      //endPoint: tokenInfo.scope.split("|")[1],
      endPoint: KEAP_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.email,
      isReconnectId: this.state.isReconnectId,
      clientId: KEAP_AUTH_URLS.CLIENT_ID,
      clientSecret: KEAP_AUTH_URLS.CLIENT_SECRET,
      webhookId: "",
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          if (resInfo.data.statusCode === 200) {       
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.props.OnSuccess(cliType);
            } else {
              ToastsStore.success("Data saved successfully");
              let id = resInfo.data.data.message;
              let webhookKeys = [];             
              await this.addWebHook(
                tokenInfo.access_token,
                res.global_user_id,
                webhookKeys
              );
              if (webhookKeys.length > 0) {
                await this.updateConnectionInfo(id, webhookKeys.join(), cliType);
              }else{
                this.props.OnSuccess(cliType);
              }            
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
      //this.props.OnLoading();
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

  // Create Webhooks
  addWebHook = async (token, memberId, webhookKeys) => {
    const events = KEAP_WEBHOOK_URLS.EVENTS;
    await Promise.all(
      events.map(async (event) => {
        let formdata = {
          headerValue: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
          APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.CREATE_WEBHOOK,
          bodyInfo: {
            hookUrl: KEAP_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
              "{commonInfo}",
              memberId
            ),
            eventKey: event,
          },
        };
        try {
          await httpClient
            .post(AUTH_INTEGRATION.POST_API, formdata)
            .then((result) => {
              webhookKeys.push(result.data.res.key);
              console.log("webhook added", result);
              //if status of webhook is not verified
              if (result.data.res.status !== "Verified") {
                this.verifyWebHook(token, result.data.res.key);
              }
            });
        } catch (err) {
          showErrorToaster(err);
        }
      })
    );
  };

  // Verify Webhook
  verifyWebHook = async (token, id) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      APIUrl:
        KEAP_AUTH_URLS.BASE_URL +
        KEAP_AUTH_URLS.VERIFY_WEBHOOK.replace("{webhookId}", id),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {    
          console.log("webhook verified", result);
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  render() {
    return (
      <>
        {this.props.onOpen && (
          <OauthPopup
            onClose={this.props.onClose}
            url={KEAP_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              KEAP_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="KeapInfusionsoftDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default KeapInfusionsoft;
