import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";
import {
  AUTH_INTEGRATION  
} from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster,authenticateUser } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class CustomerIO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      btnDisabled: true,
      isReconnectId: props.isReconnectId,
      siteId: "",
      apiKey: "",
    };
  }

  get_accountInfo = async (siteId,apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
        headerValue: {
            "Authorization": authenticateUser(siteId, apiKey),
          },
      APIUrl: "https://track.customer.io/api/v1/accounts/region",
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {         
          if (result.status === 200) {
            const error = JSON.parse(result.data.res).hasOwnProperty("meta");
            if (error) {
              ToastsStore.error("Invalid values");
              this.setState({ isLoading: false });
            } else {
              this.addAuthAccnt(JSON.parse(result.data.res),siteId,apiKey, cliType, apiName);
            }
          } else {
            this.setState({ isLoading: false });
            showErrorToaster("error");
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  addAuthAccnt = async (response,siteId,apiKey, cliType, apiName) => {     
    let formModel = {
      cliType: cliType,
      apiName: "Customer.io",
      memberId: apiKey,
      token: apiKey,
      keyType: "apiKey",
      endPoint: response.url,
      siteId:siteId,
      tokenInfo:response,
      connectionName: `Customer.io Site ID: ${siteId}`,
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

  handleInputChange = (value, name) => {
      console.log("kk",value, name)
    this.setState({ [name]: value });

    setTimeout(() => {
      if (
        this.state.siteId.replace(/\s/g, "").length &&
        this.state.apiKey.replace(/\s/g, "").length
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
      _self.state.siteId,
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
               // variant="SendInBlueWindow"
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
                Allow FormSync to access your <br /> Customer.io Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong> Site ID </strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    To find your Site ID, log in to Customer.io, then{" "}
                    <a
                      href="https://fly.customer.io/settings/api_credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      click here
                    </a>
                    .
                  </p>
                  <input
                    className="form-control"
                    name="siteId"
                    onChange={(e) => this.handleInputChange(e.target.value,"siteId")}
                  />
                </div>

                <div className="form-group col-12">
                  <label>
                    <strong>Tracking API Key </strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    To find your Tracking API Key, log in to Customer.io, then{" "}
                    <a
                      href="https://fly.customer.io/settings/api_credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      click here
                    </a>
                    .
                  </p>
                  <input
                    className="form-control"
                    name="apiKey"
                    onChange={(e) => this.handleInputChange(e.target.value,"apiKey")}
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading && (
            <div id="Customerio" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default CustomerIO;
