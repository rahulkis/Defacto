import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  DROPBOX_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";

class Dropbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCode: false,
      isLoading: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      isReconnectId: props.isReconnectId,
    };
  }
  componentDidMount() {
    if (this.props.onOpen) {
      document.getElementById("DropboxDivId").click();
    }
  }
  onCode = async (code, params) => {
    this.setState({ isLoading: true });
    try {
      if (!this.state.isCode) {
        this.setState({ isCode: true });
        this.props.OnLoading();
        console.log("code", code);
        await this.getAccessToken(
          code,
          this.state.selectedCLI,
          this.state.selectedAPI
        );
      }
      //this.props.onClose();
    } catch (error) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(error);
    }
  };

  getAccessToken = (code, cliType, apiName) => {
    if (code) {
      console.log("hg");
      let formModel = {
        APIUrl: "https://api.dropboxapi.com/oauth2/token",
        headerValue: {
          Authorization: authenticateUser(
            DROPBOX_AUTH_URLS.CLIENT_ID,
            DROPBOX_AUTH_URLS.CLIENT_SECRET
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
        "content-type":"application/json",
        Authorization: "Bearer " + res.access_token,
        Accept: "application/json",
      },
      APIUrl: "https://api.dropboxapi.com/2/users/get_account",
      bodyInfo: {
        account_id: res.account_id,
      },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
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
    let formModel = {
      email: res.res.email,
      userName: res.res.name.display_name,
      clientId: DROPBOX_AUTH_URLS.CLIENT_ID,
      clientSecret: DROPBOX_AUTH_URLS.CLIENT_SECRET,
      cliType: cliType,
      apiName: apiName,
      memberId: res.res.account_id,
      token: tokenInfo.refresh_token,
      keyType: "refresh_token",
      tokenInfo: tokenInfo,
      endPoint: DROPBOX_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " +  res.res.email,
      isReconnectId: this.state.isReconnectId,
    };
    try {
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then((res) => {
        // Redirection to connection CLI
        if (res.data.statusCode === 200) {
            this.setState({isCode:false});
          this.props.OnLoading();
          ToastsStore.success(res.data.data.message);
          this.props.OnSuccess(cliType);
        }
        this.setState({ isLoading: false });
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
            url={DROPBOX_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              DROPBOX_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="DropboxDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default Dropbox;
