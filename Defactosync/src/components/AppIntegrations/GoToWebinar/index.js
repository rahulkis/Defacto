import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  GOTOWEBINAR_AUTH_URLS,
} from "constants/IntegrationConstant";
import { GOTOWEBINAR_WEBHOOK_URLS, WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

class GoToWebinar extends Component {
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
      document.getElementById("gotowebinarDivId").click();
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
        APIUrl: "https://api.getgo.com/oauth/v2/token",
        headerValue: {
          Authorization: authenticateUser(
            GOTOWEBINAR_AUTH_URLS.CLIENT_ID,
            GOTOWEBINAR_AUTH_URLS.CLIENT_SECRET
          ),
        },
        bodyInfo: {
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
                this.addAuthAccnt(result.data, cliType, apiName);
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

  addAuthAccnt = (res, cliType, apiName) => {
    res = JSON.parse(res.res);
    let formModel = {
      email: res.email,
      userName: res.firstName + res.lastName,
      memberId: res.account_key,
      cliType: cliType,
      apiName: apiName,
      token: res.refresh_token,
      keyType: "refreshToken",
      tokenInfo: res,
      endPoint: "https://api.getgo.com/G2W/rest/v2/",
      connectionName: apiName + " " + res.email,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
      webhookToken: "",
      clientId:GOTOWEBINAR_AUTH_URLS.CLIENT_ID,
      clientSecret:GOTOWEBINAR_AUTH_URLS.CLIENT_SECRET
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          // Redirection to connection CLI
          if (resInfo.data.statusCode === 200) {
           // this.props.OnLoading();            
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.props.OnSuccess(cliType);
            } else {
              
              let id = resInfo.data.data.message;
              //checkid the same connection count
              this.checkConnectionInfo(
                id,
                res.account_key,
                cliType,
                res.access_token
              );

           
            }
          }
          //this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.props.OnLoading();
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // check connection info
  checkConnectionInfo = (id, memberId, cliType, token) => {
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
              this.addWebHook(token, memberId, id,cliType);
            } else {
              this.updateConnectionInfo(id, data.webhookId, cliType);
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
  addWebHook = (token, memberId, connectionId,cliType) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: GOTOWEBINAR_AUTH_URLS.CREATE_SECRET_KEY,
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then(async (result) => {
          if (result.status === 200) {
            //const parsedResponse = result.data.res;
            // this.updateConnectionInfo(
            //   id,
            //   parsedResponse.id.toString(),
            //   parsedResponse.value
            // );
            this.AddWebhookFnc(memberId, token,connectionId,cliType);
          }
        });
    } catch (err) {
      console.log("addWebHook");
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  //update connection
  updateConnectionInfo = (id, webhookId,cliType) => {
    let bodyData = {
      id: id,
      webhookId: webhookId,
      webhookToken: "",
    };

    try {
      httpClient
        .post(WEBHOOK_URLS.UPDATE_CONNECTION_INFO, bodyData)
        .then((result) => {
          if (result.status === 200) {
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

  // Add WebHookFunction
  AddWebhookFnc = async (memberId, token,connectionId,cliType) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: GOTOWEBINAR_AUTH_URLS.WEBHOOK,
      bodyInfo: [
        {
          callbackUrl: GOTOWEBINAR_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            memberId
          ),
          eventName: "webinar.created",
          eventVersion: "1.0.0",
          product: "g2w",
        },
        {
          callbackUrl: GOTOWEBINAR_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            memberId
          ),
          eventName: "registrant.added",
          eventVersion: "1.0.0",
          product: "g2w",
        },
        {
          callbackUrl: GOTOWEBINAR_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            memberId
          ),
          eventName: "webinar.changed",
          eventVersion: "1.0.0",
          product: "g2w",
        },
        {
          callbackUrl: GOTOWEBINAR_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace(
            "{commonInfo}",
            memberId
          ),
          eventName: "registrant.joined",
          eventVersion: "1.0.0",
          product: "g2w",
        },
      ],
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            let updateArrayObj = [];
            let suscribeArrayObj = [];
            const parsedResponse = result.data.res._embedded.webhooks          
            this.updateConnectionInfo(
              connectionId,
              (parsedResponse.map(x=>x.webhookKey)).join(),
              cliType
            );
            console.log("parsedResponse", parsedResponse);
            parsedResponse.map((webhook) => {
              let updateObj = {
                callbackUrl: webhook.callbackUrl,
                webhookKey: webhook.webhookKey,
                state: "ACTIVE",
              };
              updateArrayObj.push(updateObj);
              let suscribeObj = {
                callbackUrl: webhook.callbackUrl,
                webhookKey: webhook.webhookKey,
                userSubscriptionState: "ACTIVE",
              };
              suscribeArrayObj.push(suscribeObj);
            });
            console.log("updateArrayObj", updateArrayObj);
            console.log("suscribeArrayObj", suscribeArrayObj);
            this.updateWebhook(updateArrayObj, token);
            this.createSubscription(suscribeArrayObj, token);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // update WebHook
  updateWebhook = async (body, token) => {
    let formdata = {
      methodType: "PUT",
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      apiUrl: GOTOWEBINAR_AUTH_URLS.WEBHOOK,
      bodyInfo: body,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.PUT_API, formdata)
        .then((result) => {
          if (result.status === 200) {
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // create subscription
  createSubscription = async (body, token) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${token}`,
      },
      APIUrl: GOTOWEBINAR_AUTH_URLS.CREATE_SUBSCRIPTION,
      bodyInfo: body,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
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
            url={GOTOWEBINAR_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              GOTOWEBINAR_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="gotowebinarDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default GoToWebinar;
