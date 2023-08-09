import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import { AUTH_INTEGRATION, SLACK_AUTH_URLS } from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from 'appUtility/commonFunction';

class Slack extends Component {
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
    document.getElementById("SlackDivId").click();
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
      bodyFormData.append("client_id", SLACK_AUTH_URLS.CLIENT_ID);
      bodyFormData.append("client_secret", SLACK_AUTH_URLS.CLIENT_SECRET);
      bodyFormData.append("code", code); 
      bodyFormData.append("redirect_uri", `${window.location.origin.toString()}/app/dashboard`);
      bodyFormData.append("grant_type", "authorization_code");

      await httpClient
        .post(SLACK_AUTH_URLS.ACCESS_TOKEN_URL, bodyFormData)
        .then((result) => {
          if (result !== null) {
            if (result.status === 200) {
              if(result.data !== undefined)
              {
                  if(result.data.ok)
                  {
                    this.get_accountInfo(result.data,cliType,apiName)
                  }
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

  get_accountInfo = async (res,cliType,apiName) => {  
    let formdata = {
      headerValue:{
      Authorization: "Bearer " + res.access_token,
      Accept: "application/json"
        },
      APIUrl:SLACK_AUTH_URLS.BASE_URL  + "/users.profile.get",
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
      this.setState({
        isLoadingFields: false,
      });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = (res,tokenInfo,cliType,apiName) => {
    res = JSON.parse(res.res);
    let formModel = {      
      email: res.profile.email,
      userName: res.profile.real_name,
      cliType: cliType,
      memberId: tokenInfo.user_id,
      token: tokenInfo.access_token,
      keyType:"accessToken",
      tokenInfo:tokenInfo,
      apiName:apiName,
      endPoint:"",
      connectionName:apiName + " " + res.profile.email,
      isReconnectId:this.state.isReconnectId
    };
    try {
      httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel).then(
        (res) => {
          if (res.data.statusCode === 200) {
            this.props.OnLoading();
            ToastsStore.success(res.data.data.message);
            this.props.OnSuccess(cliType);
          }
          this.setState({ isLoading: false });
        }
      );
    }catch (err) {
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
          url={SLACK_AUTH_URLS.AUTH_URL.replace(
            "{CLIENT_ID}",
            SLACK_AUTH_URLS.CLIENT_ID
          ).replace(
            "{REDIRECT_URI}",
            `${window.location.origin.toString()}/app/dashboard`
          )}
          onCode={this.onCode}
        >
          <div id="SlackDivId"></div>
        </OauthPopup>
        )}
      </>
    );
  }
}

export default Slack;
