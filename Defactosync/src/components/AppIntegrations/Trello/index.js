import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  TRELLOAUTH_URLS,
} from "constants/IntegrationConstant";
import { TRELLO_WEBHOOK_URLS, WEBHOOK_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class Trello extends Component {
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
      document.getElementById("TrelloDivId").click();
    }
  }
  onCode = async (code, params) => {
    this.setState({ isLoading: true });
    try {
      this.props.OnLoading();
      await this.get_accountInfo(
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

  get_accountInfo = async (token, cliType, apiName) => {
    if (token) {
      let url = TRELLOAUTH_URLS.GET_MEMBER_DETAIL.replace(
        "{yourAPIKey}",
        TRELLOAUTH_URLS.API_KEY
      ).replace("{yourAPIToken}", token);
      try {
        await httpClient.get(url).then((result) => {
          if (result.status === 200) {
            this.addAuthAccnt(result.data, token, cliType, apiName);
          }
        });
      } catch (err) {
        this.props.OnLoading();
        this.setState({
          isLoadingFields: false,
        });
        showErrorToaster(err);
      }
    } else {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster("error");
    }
  };

  addAuthAccnt = (res, token, cliType, apiName) => {
    let formModel = {
      email: res.fullName + "(@" + res.username + ")",
      userName: res.username,
      cliType: cliType,
      memberId: res.id,
      token: token,
      keyType: "apiToken",
      tokenInfo: {},
      apiName: apiName,
      endPoint: TRELLOAUTH_URLS.BASE_URL,
      appKeyId: TRELLOAUTH_URLS.API_KEY,
      connectionName: apiName + " " + res.fullName + "(@" + res.username + ")",
      isReconnectId: this.state.isReconnectId,
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
              this.setState({ isLoading: false });
            } else {
              let id = resInfo.data.data.message;
              // //checkid the same connection count
              // let webhookToken = "";
              // let webhookId = "";
              await this.checkConnectionInfo(res.id, cliType, id, token);
              // if (
              //   connectionInfo.webhookId === "" &&
              //   connectionInfo.webhookToken === ""
              // ) {
              //   let webhookInfo = await this.addWebHook(
              //     token,
              //     cliType,
              //     TRELLOAUTH_URLS.API_KEY,
              //     res.id
              //   );
              //   webhookId = webhookInfo;
              //   webhookToken = token;
              // } else {
              //   webhookId = connectionInfo.webhookId;
              //   webhookToken = connectionInfo.webhookToken;
              // }
              // await this.updateConnectionInfo(id, webhookId, webhookToken,cliType);
            }
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // Create Webhooks
  addWebHook = async (token, cliType, appKeyId, idModel, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.CREATE_WEBHOOK.replace(
        "{yourAPIKey}",
        appKeyId
      ).replace("{yourAPIToken}", token),
      bodyInfo: {
        callbackURL: TRELLO_WEBHOOK_URLS.POST_WEBHOOK_REQUEST,
        idModel: idModel,
        description: cliType + "_" + appKeyId,
      },
    };
    console.log("formdata123", formdata);
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {    
            console.log("result add", result.data.res.id);
            this.updateConnectionInfo(id, result.data.res.id, cliType);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // check connection info
  checkConnectionInfo = async (memberId, cliType, id, token) => {
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
                token,
                cliType,
                TRELLOAUTH_URLS.API_KEY,
                memberId,
                id
              );
            } else {            
              this.updateConnectionInfo(
                id,
                result.data.data.webhookId,
                cliType
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
            url={TRELLOAUTH_URLS.AUTH_URL.replace(
              "{APP_NAME}",
              TRELLOAUTH_URLS.APP_NAME
            )
              .replace("{API_KEY}", TRELLOAUTH_URLS.API_KEY)
              .replace(
                "{REDIRECT_URI}",
                `${window.location.origin.toString()}/app/dashboard`
              )}
            onCode={this.onCode}
          >
            <div id="TrelloDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default Trello;
