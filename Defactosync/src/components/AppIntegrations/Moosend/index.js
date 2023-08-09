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
import { AUTH_INTEGRATION } from "constants/IntegrationConstant";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Moosend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRedirect: false,
      selectedCLI: props.selectedCLI,
      selectedAPI: props.selectedAPI,
      btnDisabled: true,
      isReconnectId: props.isReconnectId,
      apiKey: "",
    };
  }

  get_accountInfo = async (apiKey, cliType, apiName) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Content-type": "application/json",
      },
      APIUrl:
        "https://api.moosend.com/v3/senders/find_all.json?apikey=" + apiKey,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            this.addAuthAccnt(result.data, apiKey, cliType, apiName);
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

  addAuthAccnt = (res, apiKey, cliType, apiName) => {
    res = JSON.parse(res.res);
    if (res.Error) {
      this.setState({ isLoading: false });
      ToastsStore.error(res.Error);
    } else {
      if (res.Context.length) {
        let formModel = {
          email: res.Context[0].Email,
          userName: res.Context[0].Name,
          cliType: cliType,
          apiName: apiName,
          memberId: res.Context[0].ID,
          token: apiKey,
          keyType: "apiKey",
          tokenInfo: res.Context,
          endPoint: "",
          connectionName: apiName + " " + res.Context[0].Email,
          isReconnectId: this.state.isReconnectId,
        };
        try {
            httpClient.post(AUTH_INTEGRATION.ADD_API, formModel).then((res) => {
              // Redirection to connection CLI
              if (res.data.statusCode === 200) {
                ToastsStore.success(res.data.data.message);
                this.props.OnSuccess(cliType);
              }
              this.setState({ isLoading: false });
            });
        } catch (err) {
          this.setState({ isLoading: false });
          showErrorToaster(err);
        }
      } else {
        this.setState({ isLoading: false });
        ToastsStore.error("Sender is rejected");
      }
    }
  };

  handleInputChange = (value, name) => {
    this.setState({ [name]: value });

    setTimeout(() => {
      if (this.state.apiKey) {
        this.setState({ btnDisabled: false });
      } else {
        this.setState({ btnDisabled: true });
      }
    }, 100);
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
                variant="MoosendWindow"
                color="inherit"
                style={{
                  flex: 1,
                }}
              >
                Connect an Account | FormSync
              </Typography>
              <Button onClick={this.handleRequestSubmit} disabled={btnDisabled}>
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
                Allow FormSync to access your <br /> Moosend Account?
              </h1>
            </div>
            <div className="d-flex justify-content-center col-6 m-auto">
              <div className="row">
                <div className="form-group col-12">
                  <label>
                    <strong>API Key</strong>&nbsp;
                    <small className="required-color">(required)</small>
                  </label>
                  <p className="integration-p-label">
                    Find your Moosend Api Key in the account screen of your
                    Moosend dashboard.
                  </p>
                  <input
                    className="form-control"
                    name="apiKey"
                    onChange={(e) =>
                      this.handleInputChange(e.target.value, "apiKey")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {isLoading && (
            <div id="MoosendLoader" className="loader-view">
              <CircularProgress />
            </div>
          )}
        </Dialog>
      </>
    );
  }
}

export default Moosend;
