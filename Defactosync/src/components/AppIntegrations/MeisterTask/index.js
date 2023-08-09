import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import { AUTH_INTEGRATION, MEISTER_TASK_AUTH_URLS } from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from 'appUtility/commonFunction';

class MeisterTask extends Component {
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
    document.getElementById("meisterTaskDivId").click();
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
      let formModel = {
        APIUrl: MEISTER_TASK_AUTH_URLS.BASE_URL + "oauth2/token",
        headerValue:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        bodyInfo: {
          client_id: MEISTER_TASK_AUTH_URLS.CLIENT_ID,
          client_secret: MEISTER_TASK_AUTH_URLS.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri:
           // "https://main.d3qdbno7z0xuqc.amplifyapp.com/app/dashboard"
            `${window.location.origin.toString()}/user/IntegrationNwebhooks`,
        },
      };
      httpClient
        .post(AUTH_INTEGRATION.URL_ENCODED_ACCESS_TOKEN, formModel)
        .then((result) => {
          if (result !== null) {
            if (result.status === 200) {
              if(result.data !== undefined)
              {
                result = JSON.parse(result.data.res);
                if (result.access_token !== undefined) {
                this.get_accountInfo(result,cliType,apiName)
                }
                else
                {
                  this.props.OnLoading();
                  this.setState({ isLoading: false });
                  showErrorToaster("error");
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
      APIUrl:MEISTER_TASK_AUTH_URLS.BASE_URL  + "api/v2/users/me",
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

  addAuthAccnt = (res,tokenInfo,cliType,apiName) => {
    res = JSON.parse(res.res);
    let formModel = {      
      email: res.email,
      userName: res.name,
      cliType: cliType,
      memberId: res.id,
      token: tokenInfo.access_token,
      keyType:"accessToken",
      tokenInfo:tokenInfo,
      apiName:apiName,
      endPoint:"",
      connectionName:apiName + " " + res.email,
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
          url={MEISTER_TASK_AUTH_URLS.AUTH_URL.replace(
            "{CLIENT_ID}",
            MEISTER_TASK_AUTH_URLS.CLIENT_ID
          ).replace(
            "{REDIRECT_URI}",
            `${window.location.origin.toString()}/app/dashboard`
            //"https://main.d3qdbno7z0xuqc.amplifyapp.com/app/dashboard"
          )}
          onCode={this.onCode}
        >
          <div id="meisterTaskDivId"></div>
        </OauthPopup>       
        )}
      </>
    );
  }
}

export default MeisterTask;
