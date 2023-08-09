import React from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import LaunchOutlinedIcon from "@material-ui/icons/LaunchOutlined";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";
import { updateEchoData, updateSelectedPocket } from "actions/index";
import { CLITYPENAME } from "constants/CliTypes";
import Apps from "components/AppIntegrations/Apps";

class Header extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      selectedApp: "",
      selectedCLI: "",
      selectedAPI: "",
      openModal: false,
      isLoading: false,
      isRedirect: false,
    };
  }

  handleRequestClose = () => {
    this.setState({
      selectedApp: "",
      selectedCLI: "",
    });
    if (this.state.openModal) {
      this.setState({ openModal: false });
    }

    //this.props.closedialog();
  };

  handleSuccessRedirection = (cliType) => {
    this.setState({ isRedirect: true, selectedCLI: cliType });
  };

  handleIsLoadingRequest = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  async handleAddConnection(value) {
    console.log(value, "value app id");
    this.setState({
      openModal: true,
      selectedAPI: CLITYPENAME[value],
      selectedApp: value
        .replace("CLI", "")
        .replace(/ /g, "")
        .toLowerCase(),
      selectedCLI: value,
    });
  }

  render() {
    const { cliType } = this.props;
    const {
      selectedApp,
      selectedCLI,
      selectedAPI,
      isLoading,
      isRedirect,
    } = this.state;
    if (isRedirect && selectedCLI) {
      return <Redirect to={"/app/connections/cli/" + selectedCLI} />;
    }

    return (
      <div className="apps-detail-header">
        <div className="jr-profile-banner mt-3 mr-3 ml-3">
          <div className="row">
            <Link to="/app/connections/list" className="pl-4" >
              <Button              
                className="jr-btn btn-sm float-right"
                variant="contained"
                color="primary"
              >
                <KeyboardBackspaceIcon className="mr-1" />
                <span>Back</span>
              </Button>
            </Link>
          </div>
          <div className="row p-4">
            <div className="col-md-10 row">
              <div className="col-md-1 nodes-icons-container">
                <div className="nodes-icons">
                  <div className="nodes-icons-image">
                    <img
                      height="20"
                      width="20"
                      src={
                        APP_IMAGE_URL +
                        IMAGE_FOLDER.APP_IMAGES +
                        cliType.toLowerCase() +
                        ".png"
                      }
                      alt="cli"
                    ></img>
                  </div>
                </div>
              </div>
              <div className="col-md-11">
                <div className="icon-title">
                  {CLITYPENAME[cliType]}{" "}
                  <span className="pointer text-primary">
                    <LaunchOutlinedIcon />
                  </span>{" "}
                </div>
                {/* <div>Team Chat</div> */}
              </div>
            </div>
            <div className="col-md-2 row">
              {/* <div className="col-md-6">
                <SurroundSoundOutlinedIcon style={{ margin: " 10px" }} />
              </div> */}
              <div className="col-md-6">
                {" "}
                <Button
                  className="btn  btn-sm"
                  style={{ padding: "12px 10px", borderRadius: "10px" }}
                  variant="contained"
                  color="primary"
                  onClick={() => this.handleAddConnection(cliType)}
                >
                  Add connections
                </Button>
              </div>
            </div>
          </div>
        </div>
        {selectedApp && (
          <Apps
            selectedApp={selectedApp}
            selectedCLI={selectedCLI}
            selectedAPI={selectedAPI}
            onOpen={this.state.openModal}
            onClose={this.handleRequestClose}
            OnSuccess={(e) => this.handleSuccessRedirection(e)}
            OnLoading={this.handleIsLoadingRequest}
            isReconnect={""}
          />
        )}

        {isLoading && (
          <div id="LoaderId" className="loader-view loader-settings">
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser } = auth;
  return { authUser };
};

export default connect(mapStateToProps, {
  updateEchoData,
  updateSelectedPocket,
})(Header);
