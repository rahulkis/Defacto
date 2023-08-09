import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import { AUTH_INTEGRATION, ASANAUTH_URLS } from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from 'appUtility/commonFunction';

class Asana extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedCLI:props.selectedCLI,
      selectedAPI:props.selectedAPI,
      isReconnectId:props.isReconnectId     
    };
  }
  componentDidMount() {
    if (this.props.onOpen) {
    document.getElementById("asanaDivId").click();
    }
  }
  onCode = async (code, params) => {
    this.setState({ isLoading: true });
    try {
      this.props.OnLoading();
      await this.getAccessToken(code,this.state.selectedCLI,this.state.selectedAPI);
      //this.props.closeDialog();
    } catch (error) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(error);
    }
  };

  getAccessToken = async (code,cliType,apiName) => {
    if (code) {
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", ASANAUTH_URLS.CLIENT_ID);
      bodyFormData.append("client_secret", ASANAUTH_URLS.CLIENT_SECRET);
      bodyFormData.append("code", decodeURIComponent(code));
      bodyFormData.append(
        "redirect_uri",
        `${window.location.origin.toString()}/app/dashboard`
      );
      bodyFormData.append("grant_type", "authorization_code");

      httpClient
        .post(ASANAUTH_URLS.ACCESS_TOKEN_URL, bodyFormData)
        .then((result) => {
          if (result !== null) {
            if (result.status === 200) {
              if(result.data !== undefined)
              {
                  this.addAuthAccnt(result.data,cliType,apiName)
              }
            }
          }
        });
    }
    else
    {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster("error");
    }
  };

  addAuthAccnt = (res,cliType,apiName) => {
    let formModel = {      
      email: res.data.email,
      userName: res.data.name,
      memberId: res.data.id,
      cliType: cliType,
      apiName:apiName,
      token: res.refresh_token,
      keyType:"refreshToken",
      tokenInfo:res,
      endPoint:"",
      connectionName:apiName + " " + res.data.email,
      isReconnectId:this.state.isReconnectId
    };
    try {
      httpClient.post(AUTH_INTEGRATION.ADD_API, formModel)
      .then(async (res) => {
          // Redirection to connection CLI
          if (res.data.statusCode === 200) {
            this.props.OnLoading();
            ToastsStore.success(res.data.data.message);
            this.props.OnSuccess(cliType);
          }
          this.setState({ isLoading: false });          
        }
      ).catch((err) => {
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
  render() {
    return (
      <>
          {this.props.onOpen && (
          <OauthPopup
          onClose={this.props.onClose}
          url={ASANAUTH_URLS.AUTH_URL.replace(
            "{CLIENT_ID}",
            ASANAUTH_URLS.CLIENT_ID
          ).replace(
            "{REDIRECT_URI}",
            `${window.location.origin.toString()}/app/dashboard`
          )}
          onCode={this.onCode}
        >
          <div id="asanaDivId"></div>
        </OauthPopup>        
        )}
      </>
    );
  }
}

export default Asana;
