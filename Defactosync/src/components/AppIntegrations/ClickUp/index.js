import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import { AUTH_INTEGRATION, CLICKUP_AUTH_URLS } from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from 'appUtility/commonFunction';
import {
  WEBHOOK_URLS, CLICKUP_WEBHOOK_URLS
} from "constants/AppConst";

class ClickUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      isReconnectId: props.isReconnectId
    };
  }
  componentDidMount() {
    if (this.props.onOpen) {
      document.getElementById("clickUpDivId").click();
    }
  }
  onCode = async (code, params) => {
    this.setState({ isLoading: true });
    try {
      this.props.OnLoading();
      await this.getAccessToken(code, this.state.selectedCLI, this.state.selectedAPI);
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
        APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.ACCESS_TOKEN_URL.replace("{CLIENT_ID}", CLICKUP_AUTH_URLS.CLIENT_ID).
          replace("{CLIENT_SECRET}", CLICKUP_AUTH_URLS.CLIENT_SECRET).replace("{CODE}", code),
        headerValue: {
          'content-type': 'application/json'
        }
      };
      httpClient
        .post(AUTH_INTEGRATION.URL_ENCODED_ACCESS_TOKEN, formModel)
        .then((result) => {
          if (result !== null) {
            if (result.status === 200) {
              if (result.data !== undefined) {
                result = JSON.parse(result.data.res);
                if (result.access_token !== undefined) {
                  this.get_accountInfo(result, cliType, apiName)
                }
                else {
                  this.props.OnLoading();
                  this.setState({ isLoading: false });
                  showErrorToaster("error");
                }
              }
            }
          }
        });
    }
    else {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster("error");
    }
  };

  get_accountInfo = async (res, cliType, apiName) => {
    let formdata = {
      headerValue: {
        Authorization: res.access_token,
        Accept: "application/json"
      },
      APIUrl: CLICKUP_AUTH_URLS.BASE_URL + "user",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata).then((result) => {
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
    res = JSON.parse(res.res);
    let formModel = {
      email: res.user.email,
      userName: res.user.username,
      cliType: cliType,
      memberId: res.user.id,
      token: tokenInfo.access_token,
      keyType: "accessToken",
      tokenInfo: tokenInfo,
      apiName: apiName,
      endPoint: "https://api.clickup.com/api/v2/",
      connectionName: apiName + " " + res.user.email,
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
      clientId: CLICKUP_AUTH_URLS.CLIENT_ID,
      clientSecret: CLICKUP_AUTH_URLS.CLIENT_SECRET,
    };
    try {
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          // Redirection to connection CLI
          if (resInfo.data.statusCode === 200) {
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.setState({ isLoading: false });
              this.props.OnSuccess(cliType);
            } else {
              let connectionId = resInfo.data.data.message;
              await this.checkConnectionInfo(
                res.user.id,
                cliType,
                tokenInfo.access_token,
                connectionId
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


  // check connection info
  checkConnectionInfo = async (
    memberId,
    cliType,
    token,
    connectionId
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
              this.getTeams(token, connectionId, cliType, memberId);
              // this.addSentSMSWebhook(email, apiKey, connectionId, cliType);
            } else {
              this.updateConnectionInfo(
                connectionId,
                result.data.data.webhookId,
                cliType
              );
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  //get teams
  getTeams = async (token, connectionId, cliType, memberId) => {
    let formdata = {
      headerValue: {
        Authorization: token,
        Accept: "application/json"
      },
      APIUrl: "https://api.clickup.com/api/v2/team",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
          if (result.status === 200) {
            let teams = JSON.parse(result.data.res).teams;
            let webhookId = [];
            if (teams.length) {
              console.log("beforeloop");
              await Promise.all(
                teams.map((team) =>
                  this.addWebhook(token, team.id, webhookId, memberId)
                )
              )
              this.updateConnectionInfo(
                connectionId,
                webhookId.toString(),
                cliType
              );

            } else {
              this.setState({ isLoading: false });
              ToastsStore.error("webhook cannot be created for this connection")
            }
          } else {
            this.setState({ isLoading: false });
            ToastsStore.error("webhook cannot be created for this connection")
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  //add  webhook
  addWebhook = async (token, id, webhookId, memberId) => {
    let formdata = {
      headerValue: {
        Authorization: token,
        Accept: "application/json"
      },
      APIUrl: `https://api.clickup.com/api/v2/team/${id}/webhook`,
      bodyInfo: {
        "endpoint": CLICKUP_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace("{commonInfo}", memberId),
        "events": [
          "taskCreated",
          "taskUpdated",
          "listCreated",
          "folderCreated"
        ]
      }
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata).then((result) => {
          if (result.status === 200) {
            console.log("adding webhook", result);
            webhookId.push(result.data.res.id)
          } else {
            this.setState({ isLoading: false });
            ToastsStore.error("webhook cannot be created for this connection")
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  //update connection
  updateConnectionInfo = async (id, webhookId, cliType) => {
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
            url={CLICKUP_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              CLICKUP_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="clickUpDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default ClickUp;
