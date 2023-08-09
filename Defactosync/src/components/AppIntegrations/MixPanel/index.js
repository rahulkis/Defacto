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
  IMAGE_FOLDER 
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  MIXPANEL_AUTH_URLS,
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MixPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      btnDisabled: true,
      isReconnectId: props.isReconnectId,
      apiUrl: "",
      apiKey: "",
    };
  }

  get_accountInfo = async (apiKey, cliType, apiName) => {
    try {
      this.setState({ isLoading: true });
      this.addAuthAccnt(apiKey, cliType, apiName);
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = async (apiKey, cliType, apiName) => {   
    let formModel = {
      cliType: cliType,
      apiName: "MixPanel",
      memberId: apiKey,
      token: apiKey,
      keyType: "apiKey",
      endPoint: MIXPANEL_AUTH_URLS.BASE_URL,
      connectionName: "Mixpanel Project Name",
      isReconnectId: this.state.isReconnectId,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.ADD_API, formModel)
        .then(async (resInfo) => {
          if (resInfo.data.statusCode === 200) {
            this.props.OnLoading();
            ToastsStore.success(resInfo.data.data.message);
            this.props.OnSuccess(cliType);
          }
          this.setState({ isLoading: false });
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  handleInputChange = (value) => {
    if (value.replace(/\s/g, "").length) {
      this.setState({ apiKey: value.trim(), btnDisabled: false });
    } else {
      this.setState({ btnDisabled: true });
    }
  };

  handleRequestSubmit = () => {
    let _self = this;
    this.get_accountInfo(
      _self.state.apiKey,
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
                //variant="SendInBlueWindow"
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
                Allow FormSync to access your <br /> MixPanel Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                <label>
                    <strong> Project Token</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Copy your Project Token of specific project from your MixPanel Account and paste.
                    Please enter valid project token to get changes in your account.
                  </p>
                  <input
                    className="form-control"
                    name="apiKey"
                    onChange={(e) => this.handleInputChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading && (
            <div id="MixPanel" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default MixPanel;
