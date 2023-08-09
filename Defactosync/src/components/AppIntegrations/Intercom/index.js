import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import {
  AUTH_INTEGRATION,
  INTERCOM_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class Intercom extends Component {
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
      document.getElementById("IntercomDivId").click();
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
        APIUrl: INTERCOM_AUTH_URLS.BASE_URL + "auth/eagle/token",
        headerValue: {
          "content-type": "application/x-www-form-urlencoded",
        },
        bodyInfo: {
          client_id: INTERCOM_AUTH_URLS.CLIENT_ID,
          client_secret: INTERCOM_AUTH_URLS.CLIENT_SECRET,
          code: decodeURIComponent(code)
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
                  else
                  {
                    this.props.OnLoading();
                    this.setState({ isLoading: false });
                    showErrorToaster("SomeThings went wrong. Pleas try again after sometime.");
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
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + "me",
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
      userName: res.name,
      cliType: cliType,
      memberId: res.app.id_code,
      token: tokenInfo.token,
      keyType: "accessToken",
      tokenInfo: tokenInfo,
      apiName: apiName,
      endPoint: INTERCOM_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.email,
      isReconnectId: this.state.isReconnectId,
      clientId: INTERCOM_AUTH_URLS.CLIENT_ID,
      clientSecret: INTERCOM_AUTH_URLS.CLIENT_SECRET,
      webhookId: "",
      profileInfo:res
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          if (resInfo.data.statusCode === 200) {       
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
            } else {
              ToastsStore.success("Data saved successfully");
              
            }

            this.props.OnSuccess(cliType);
          }
          this.setState({ isLoading: false });
        });
    } catch (err) {
      //this.props.OnLoading();
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
            url={INTERCOM_AUTH_URLS.AUTH_URL.replace(
              "{CLIENT_ID}",
              INTERCOM_AUTH_URLS.CLIENT_ID
            ).replace(
              "{REDIRECT_URI}",
              `${window.location.origin.toString()}/app/dashboard`
            )}
            onCode={this.onCode}
          >
            <div id="IntercomDivId"></div>
          </OauthPopup>
        )}
      </>
    );
  }
}

export default Intercom;
