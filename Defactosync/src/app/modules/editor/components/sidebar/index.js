import React from "react";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import InfoIcon from "@material-ui/icons/Info";
import ErrorIcon from "@material-ui/icons/Error";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ErrorsPanel from "./ErrorsPanel";
import SettingsPanel from "./SettingsPanel";

import { changeDirection, setDarkTheme, setThemeColor } from "actions/index";

class EditorSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { drawerStatus: false, selectedPanel: "" };
  }

  toggleCustomizer = (panel) => {
    console.log(panel);
    this.setState({
      drawerStatus: !this.state.drawerStatus,
      selectedPanel: panel,
    });
  };

  closeCustomizer = () => {
    this.setState({ drawerStatus: false });
  };

  handeleTaskLog = (id) => {
   // let queryString = "echoId=" + id;
    this.props.history.push(`/app/history/${id}`);
  };

  handeleTaskDetail=(id)=>{
    this.props.history.push(`/app/echos/${id}`);
  }

  componentDidMount() {
    document.body.classList.add(this.props.themeColor);
  }

  render() {
    const { selectedPanel } = this.state;
    const { selectedEcho, echoNodeError } = this.props;

    return (
      <div className="theme-option d-flex flex-column">
        <IconButton onClick={() => this.toggleCustomizer("settings")}>
          <Tooltip title="Settings" placement="left-start">
            <SettingsApplicationsIcon className="text-white" />
          </Tooltip>
        </IconButton>
        {echoNodeError.length <= 0 ? (
          <IconButton onClick={this.toggleCustomizer.bind(this, "errors")}>
            <Tooltip title="Errors" placement="left-start">
              <ErrorIcon className="text-white " />
            </Tooltip>
          </IconButton>
        ) : (
          <IconButton
            className="bg-danger"
            onClick={this.toggleCustomizer.bind(this, "errors")}
          >
            <Tooltip title="Errors" placement="left-start">
              <ErrorIcon className="text-white " />
            </Tooltip>
          </IconButton>
        )}

        <IconButton onClick={() => this.handeleTaskLog(selectedEcho.id)}>
          <Tooltip title="Task history" placement="left-start">
            <WatchLaterIcon className="text-white" />
          </Tooltip>
        </IconButton>

        <IconButton onClick={() => this.handeleTaskDetail(selectedEcho.id)}>
          <Tooltip title="Echo Details" placement="left-start">
            <InfoIcon className="text-white" />
          </Tooltip>
        </IconButton>
        <Drawer
          className="app-sidebar-content right-sidebar"
          anchor="right"
          open={this.state.drawerStatus}
          onClose={this.closeCustomizer.bind(this)}
        >
          <div className="color-theme">
            <div className="color-theme-header">
              {selectedPanel === "settings" && (
                <h3 className="color-theme-title mr-1">Settings</h3>
              )}
              {selectedPanel === "errors" && (
                <h3 className="color-theme-title mr-1">Errors</h3>
              )}
              <IconButton className="icon-btn" onClick={this.closeCustomizer}>
                <i className="zmdi zmdi-close text-white" />
              </IconButton>
            </div>
            <div className="color-theme-body">
              {selectedPanel === "settings" && (
                <div>
                  <SettingsPanel />
                </div>
              )}
              {selectedPanel === "errors" && (
                <div>
                  <ErrorsPanel onClose={this.closeCustomizer} />
                </div>
              )}
              <div className="mt-3"></div>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, echo, nodeError }) => {
  const { themeColor, darkTheme, isDirectionRTL } = settings;
  const { selectedEcho } = echo;
  const { echoNodeError } = nodeError;
  return { themeColor, darkTheme, isDirectionRTL, selectedEcho, echoNodeError };
};

export default withRouter(
  connect(mapStateToProps, { setThemeColor, setDarkTheme, changeDirection })(
    EditorSidebar
  )
);
