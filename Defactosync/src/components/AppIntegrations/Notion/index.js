import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  NOTION_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class Notion extends Component {
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
      document.getElementById("NotionDivId").click();
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
        APIUrl: NOTION_AUTH_URLS.ACCESS_TOKEN_URL,
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
                        "Basic " +
                        btoa(NOTION_AUTH_URLS.CLIENT_ID + ":" + NOTION_AUTH_URLS.CLIENT_SECRET),
        },
        bodyInfo: {  
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
        "Notion-Version": "2022-02-22"
      },
      APIUrl: NOTION_AUTH_URLS.BASE_URL + NOTION_AUTH_URLS.USER_INFO,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (result.data.statusCode === 200) {
              if (result.data.res !== "") {
                result.data = JSON.parse(result.data.res);
                if (result.data) {
                  this.addAuthAccnt(result.data, res, cliType, apiName);
                }
              } else {
                ToastsStore.error("Error"); 
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
      email: res.bot.owner.user.person.email,
      userName: res.bot.owner.user.name,
      cliType: cliType,
      memberId: res.bot.owner.user.id,
      token: tokenInfo.access_token,
      keyType: "accessToken",
      tokenInfo: tokenInfo,
      apiName: apiName,
      endPoint: NOTION_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + `${res.name} | ${res.bot.owner.user.name} <${res.bot.owner.user.person.email}>`,
      isReconnectId: this.state.isReconnectId,
      clientId: NOTION_AUTH_URLS.CLIENT_ID,
      clientSecret: NOTION_AUTH_URLS.CLIENT_SECRET,
      webhookId: "",
    };

    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          if (resInfo.data.statusCode === 200) {
            this.props.OnLoading();
            ToastsStore.success(resInfo.data.data.message);
            this.props.OnSuccess(cliType);
          }
          this.setState({ isLoading: false });
        }).catch((err) => {
          if (err.response.status) {
            showErrorToaster(err.response.data.data);
          }
          this.props.OnSuccess(cliType);
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
            url={NOTION_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              NOTION_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="NotionDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default Notion;
