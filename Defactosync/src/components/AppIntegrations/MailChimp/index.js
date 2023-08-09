import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  MAILCHIMP_AUTH_URLS,
} from "constants/IntegrationConstant";
import { MAILCHIMP_WEBHOOK_URLS, WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class MailChimp extends Component {
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
      document.getElementById("MailChimpDivId").click();
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
        APIUrl: "https://login.mailchimp.com/oauth2/token",
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: MAILCHIMP_AUTH_URLS.CLIENT_ID,
          client_secret: MAILCHIMP_AUTH_URLS.CLIENT_SECRET,
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
      APIUrl: "https://login.mailchimp.com/oauth2/metadata",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then(async (result) => {
          if (result.status === 200) {
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
    try {
      res = JSON.parse(res.res);
      let formModel = {
        email: res.login.email,
        userName: res.login.login_name,
        cliType: cliType,
        apiName: apiName,
        memberId: res.login.login_id,
        token: tokenInfo.access_token,
        keyType: "accessToken",
        tokenInfo: res,
        endPoint: res.api_endpoint,
        connectionName: apiName + " " + res.login.email,
        isReconnectId: this.state.isReconnectId,
        webhookId: "",
        webhookToken:""
      };      
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then((resInfo) => {
        // Redirection to connection CLI
        if (resInfo.data.statusCode === 200) {
          if (this.state.isReconnectId) {
            ToastsStore.success(resInfo.data.data.message);
            this.props.OnSuccess(cliType);
          } else {
           
            let id = resInfo.data.data.message;
            //checkid the same connection count
            this.checkConnectionInfo(
              id,
              res.login.login_id,
              cliType,
              tokenInfo,
              res.api_endpoint
            );
          }
        }
        this.setState({ isLoading: false });
      });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // Create Webhooks
  addWebHook = (token, memberId, id, cliType,endPoint) => {
    let audiences = [];
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: endPoint+MAILCHIMP_AUTH_URLS.GET_AUDENCIES,
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then(async (result) => {
          if (result.status === 200) {       
            let webhooks=[];
            const objArray = JSON.parse(result.data.res);
            audiences = objArray.lists.map((a) => a.id);
             let joinAudience = audiences.join();          
             await this.AddWebhookFnc(audiences, memberId, token,
              webhooks,endPoint);            
             this.updateConnectionInfo(id,webhooks.join(),joinAudience,cliType);      
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // Add WebHookFunction
  AddWebhookFnc = async(audiences, memberId, token,webhooks,endPoint) => {
    await Promise.all(
    audiences.map(async (audience) => {
      let formdata = {
        headerValue: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        APIUrl: endPoint+MAILCHIMP_AUTH_URLS.CREATE_WEBHOOK.replace(
          "{listId}",
          audience
        ),
        bodyInfo: {
          url: MAILCHIMP_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            memberId
          ),
          events: {
            subscribe: true,
            unsubscribe: true,
            profile: true,
            cleaned: true,
            upemail: true,
            campaign: true,
          },
          sources: { user: true, admin: true, api: true },
        },
      };

      try {
        await httpClient
          .post(AUTH_INTEGRATION.POST_API, formdata)
          .then((result) => {
            if (result.status === 200) {       
              webhooks.push(result.data.res.id) 
            }
            
          });
      } catch (err) {
        this.props.OnLoading();
        this.setState({ isLoading: false });
        showErrorToaster(err);
      }
    }));
  };

  // check connection info
  checkConnectionInfo = (id, memberId, cliType, tokenInfo,endPoint) => {
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
              this.addWebHook(
                tokenInfo.access_token,
                memberId,
                id,
                cliType,endPoint
              );
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

  //update connection
  updateConnectionInfo = (id, webhookIds,ListIds,cliType) => {
    let bodyData = {
      id: id,
      webhookId: webhookIds,
      webhookToken:ListIds,
    };
    try {
      httpClient
        .post(WEBHOOK_URLS.UPDATE_CONNECTION_INFO, bodyData)
        .then((result) => {
           if (result.status === 200) {
            ToastsStore.success("Data saved successfully");
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
            url={MAILCHIMP_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              MAILCHIMP_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="MailChimpDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default MailChimp;
