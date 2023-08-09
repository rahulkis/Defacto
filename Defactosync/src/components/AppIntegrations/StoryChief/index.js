import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  StoryChief_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class StoryChief extends Component {
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
      document.getElementById("StoryChiefDivId").click();
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
        APIUrl: StoryChief_AUTH_URLS.ACCESS_TOKEN_URL,
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: StoryChief_AUTH_URLS.CLIENT_ID,
          client_secret: StoryChief_AUTH_URLS.CLIENT_SECRET,
          
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
    console.log(res, "res");
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + res.access_token,
        Accept: "application/json",
      },
      APIUrl: StoryChief_AUTH_URLS.BASE_URL + StoryChief_AUTH_URLS.USER_INFO,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            if (result.data.statusCode === 200) {
              if (result.data.res !== "") {
                result.data = JSON.parse(result.data.res);
                if (result.data.data) {
                  this.addAuthAccnt(result.data.data, res, cliType, apiName);
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
      email: res.email,
      userName: res.firstname,
      cliType: cliType,
      memberId: res.id,
      token: tokenInfo.refresh_token,
      keyType: "refreshToken",
      tokenInfo: tokenInfo,
      apiName: apiName,
      workSpaceId: `${res.firstname ? res.firstname : "fname"} ${res.lastname ? res.lastname : "lname"} @ ${res.account.data.name ? res.account.data.name : ""}`,
      endPoint: StoryChief_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + `${res.firstname ? res.firstname : "fname"} ${res.lastname ? res.lastname : "lname"} @ ${res.account.data.name ? res.account.data.name : ""}`,
      isReconnectId: this.state.isReconnectId,
      clientId: StoryChief_AUTH_URLS.CLIENT_ID,
      clientSecret: StoryChief_AUTH_URLS.CLIENT_SECRET,
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
            url={StoryChief_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              StoryChief_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="StoryChiefDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default StoryChief;
