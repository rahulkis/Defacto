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
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  MONDAY_AUTH_URLS
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Monday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      btnDisabled: true,
      isReconnectId: props.isReconnectId,
      token: "",
    };
  }

  get_accountInfo = async (token, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Authorization": token,
        Accept: "application/json",
      },
      APIUrl: MONDAY_AUTH_URLS.BASE_URL + "/v2" + MONDAY_AUTH_URLS.GET_USER_INFO
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            let res = JSON.parse(result.data.res);
            if (result.data.res !== "") {             
              this.addAuthAccnt(res.data.users[0], token, cliType, apiName);
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

  addAuthAccnt = async (res, token, cliType, apiName) => { 
    let formModel = {
      email: res.email,
      userName: res.account.name,
      cliType: cliType,
      apiName: apiName,
      memberId: res.account.id,
      token: token,
      keyType: "Token",
      tokenInfo: res,
      endPoint: MONDAY_AUTH_URLS.BASE_URL,
      connectionName: apiName + " " + res.email,      
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
                this.props.OnSuccess(cliType);
            } else {
                this.setState({ isLoading: false });
                this.props.OnSuccess(cliType);
                ToastsStore.success("Data saved successfully");
            }
        }
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

  
  handleInputChange = (value, name) => {
    this.setState({ [name]: value });

    setTimeout(() => {
      if (
        this.state.token.replace(/\s/g, "").length) {
        this.setState({ btnDisabled: false });
      } else {
        this.setState({ btnDisabled: true });
      }
    }, 100);
  };
  handleRequestSubmit = () => {
    let _self = this;
    this.get_accountInfo(
      _self.state.token.trim(),
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
                Allow FormSync to access your <br /> monday.com Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong>API v2 Token</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                  The API key can be found by clicking on your profile picture, opening the Developers section.
                  <br/> Then, click on Developers in the header menu and select My Access Tokens to get your personal API token.
                  </p>
                  <input
                    className="form-control"
                    name="token"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "token")
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

export default Monday;
