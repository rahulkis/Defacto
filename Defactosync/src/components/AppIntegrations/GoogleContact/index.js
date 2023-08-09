import React, { Component } from "react";
import OauthPopup from "util/auth-popup";
import { AUTH_INTEGRATION, GOOGLE_CONTACT_AUTH_URLS,GOOGLE_CREDENTIALS } from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from 'appUtility/commonFunction';

class GoogleContact extends Component {
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
    document.getElementById("GoogleContactDivId").click();
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
        APIUrl: GOOGLE_CONTACT_AUTH_URLS.ACCESS_TOKEN_URL,
        headerValue:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        bodyInfo: {
          client_id: GOOGLE_CREDENTIALS.CLIENT_ID,
          client_secret: GOOGLE_CREDENTIALS.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri:`${window.location.origin.toString()}/app/dashboard`,
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
      APIUrl: GOOGLE_CONTACT_AUTH_URLS.USER_INFO,
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
      email: res.email,
      userName: res.name,
      cliType: cliType,
      memberId: res.id,
      token: tokenInfo.refresh_token,
      keyType:"refreshToken",
      tokenInfo:tokenInfo,
      apiName:apiName,
      endPoint:GOOGLE_CONTACT_AUTH_URLS.BASE_URL,
      connectionName:apiName + " " + res.email,
      isReconnectId:this.state.isReconnectId,
      clientId: GOOGLE_CREDENTIALS.CLIENT_ID,
      clientSecret: GOOGLE_CREDENTIALS.CLIENT_SECRET,
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
          url={GOOGLE_CONTACT_AUTH_URLS.AUTH_URL.replace(
            "{CLIENT_ID}",
            GOOGLE_CREDENTIALS.CLIENT_ID
          ).replace(
            "{REDIRECT_URI}",
            `${window.location.origin.toString()}/app/dashboard`
          )}
          onCode={this.onCode}
        >
          <div id="GoogleContactDivId"></div>
        </OauthPopup>  )}  
      </>
    );
  }
}

export default GoogleContact;
