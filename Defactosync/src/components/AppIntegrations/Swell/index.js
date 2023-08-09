import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import {
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  SWELL_WEBHOOK_URLS,
  WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  SWELL_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Swell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      btnDisabled: true,
      isReconnectId: props.isReconnectId,
      storeId: "",
      secretKey: "",
    };
  }

  get_accountInfo = async (storeId, secretKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": secretKey,
        Accept: "application/json",
      },
      APIUrl: SWELL_AUTH_URLS.USER_INFO.replace("client_id", storeId).replace(
        "client_key",
        secretKey
      ),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            let res = JSON.parse(result.data.res);
            let findData = res.results.find(
              (ele) => ele.client_id == storeId && ele.invite_key === undefined
            );
            if (findData.length !== 0) {              
              this.addAuthAccnt(findData, storeId, secretKey, cliType, apiName);
            } else {
              ToastsStore.error("Please connect by production account");
              this.props.OnLoading();
            }
          } else {
            this.setState({ isLoading: false });
            showErrorToaster("error");
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      ToastsStore.error("invalid credentials");
    }
  };

  addAuthAccnt = async (res, storeId, secretKey, cliType, apiName) => { 
    let formModel = {
      email: res.email,
      userName: res.name,
      cliType: cliType,
      apiName: apiName,
      memberId:`${res.name ? res.name : "fname"}@${
        res.client_id ? res.client_id : "StoreName"
      }`,
      token: secretKey,
      keyType: "secretKey",
      tokenInfo: res,
      endPoint: SWELL_AUTH_URLS.Auth_URL,
      workSpaceId: `${res.name ? res.name : "fname"}@${
        res.client_id ? res.client_id : "StoreName"
      }`,
      connectionName:
        apiName +
        " " +
        `${res.name ? res.name : "fname"}@${
          res.client_id ? res.client_id : "StoreName"
        }`,      
      isReconnectId: this.state.isReconnectId,
      webhookId: "",
    };
    
    try {
      await httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          // Redirection to connection CLI
          if (resInfo.data.statusCode === 200) {
            if (this.state.isReconnectId) {
              ToastsStore.success(resInfo.data.data.message);
              this.setState({ isLoading: false });
            } else {
              let connectionId = resInfo.data.data.message;
              await this.checkConnectionInfo(
                `${res.name ? res.name : "fname"}@${
                  res.client_id ? res.client_id : "StoreName"
                }`,
                cliType,
                res.email,
                secretKey,
                connectionId,
                storeId
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

  // Create Webhooks
  addWebHook = async (memberId,storeId, secretKey, cliType, email, connectionId) => {
    let formdata = {
      headerValue: {
        "Api-Token": secretKey,
        Accept: "application/json",
      },
      APIUrl: SWELL_AUTH_URLS.CREATE_WEBHOOK.replace("client_id", storeId)
        .replace("client_key", secretKey),
       
      bodyInfo: {
        alias: cliType + "_" + email,
        enabled: true,
        description: null,
        url: SWELL_WEBHOOK_URLS.POST_WEBHOOK_REQUEST.replace("{commonInfo}", memberId),
        events: SWELL_WEBHOOK_URLS.EVENT_LIST,
      },
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            console.log(result.data.res, "result.data.res");
            this.updateConnectionInfo(
              connectionId,
              result.data.res.id,
              cliType
            );
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  // check connection info
  checkConnectionInfo = async (
    memberId,
    cliType,
    email,
    secretKey,
    connectionId,
    storeId
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
              this.addWebHook(memberId, storeId, secretKey, cliType, email, connectionId);
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
      showErrorToaster(err);
    }
  };

  handleInputChange = (value, name) => {
    this.setState({ [name]: value });

    setTimeout(() => {
      if (
        this.state.storeId.replace(/\s/g, "").length &&
        this.state.secretKey.replace(/\s/g, "").length
      ) {
        this.setState({ btnDisabled: false });
      } else {
        this.setState({ btnDisabled: true });
      }
    }, 100);
  };
  handleRequestSubmit = () => {
    let _self = this;
    this.get_accountInfo(
      _self.state.storeId.trim(),
      _self.state.secretKey.trim(),
      _self.state.selectedCLI,
      _self.state.selectedAPI
    );
  };
  render() {
    const { onOpen, onClose } = this.props;
    const { isLoading, selectedCLI, btnDisabled } = this.state;

    return (
      <>
        <Dialog
          fullScreen
          open={onOpen}
          onClose={onClose}
          TransitionComponent={Transition}
        >
          <AppBar className="position-relative">
            <Toolbar>
              <IconButton onClick={onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography
                variant="ActiveCampaignWindow"
                color="inherit"
                style={{
                  flex: 1,
                }}
              >
                Connect an Account | FormSync
              </Typography>
              <Button
                style={{ color: btnDisabled ? "" : "white" }}
                onClick={this.handleRequestSubmit}
                disabled={btnDisabled}
              >
                save
              </Button>
            </Toolbar>
          </AppBar>
          <div>
            <div className="d-flex justify-content-center mt-5">
              <img
                height="64"
                width="64"
                src={
                  APP_IMAGE_URL +
                  IMAGE_FOLDER.APP_IMAGES +
                  selectedCLI.toLowerCase() +
                  ".png"
                }
                alt="syncImage"
              />
            </div>
            <div className="d-flex justify-content-center mt-1">
              <h1 className="integration-Oauth-Header">
                Allow FormSync to access your <br /> Swell Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong>Store ID</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Login to your Swell account; click "Developer" in your API
                    Keys menu
                    <br />
                    <code>https://platform.swellcx.com/settings#/</code>.
                  </p>
                  <input
                    className="form-control"
                    name="storeId"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "storeId")
                    }
                  />
                </div>
                <div className="form-group col-12">
                  <label>
                    <strong>Secret keys</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    The unique Secret keys for your Swell user.
                  </p>
                  <input
                    className="form-control"
                    name="secretKey"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "secretKey")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading && (
            <div id="GmailLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default Swell;
