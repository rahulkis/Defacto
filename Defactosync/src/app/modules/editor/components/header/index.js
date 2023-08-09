import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import SettingsIcon from "@material-ui/icons/Settings";
import EditIcon from "@material-ui/icons/Edit";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import IntlMessages from "util/IntlMessages";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions/index";
import Switch from "@material-ui/core/Switch";
import { ECHO_URLS } from "constants/AppConst";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: undefined,
      searchBox: false,
      searchText: "",
      mailNotification: false,
      userInfo: false,
      isLoading:false,
      langSwitcher: false,
      appNotification: false,
      echoState: false,
      editEchoTitle: false,
    };
  }

 
  handleStateChange = () => (event, checked) => {
    const echoData = this.props.selectedEcho;
    let toggleValue = "off";
    if (checked) {
      toggleValue = "on";
    }

    try {
      let body = {
        id: echoData.id,
        state: toggleValue,
      };

      this.setState({isLoading:true})

      httpClient
        .post(ECHO_URLS.UPDATE_ECHO_STATE, body)
        .then((res) => {         
          if (res.data.statusCode === 200) {
            this.props.updateEchoData({
              ...echoData,
              state: toggleValue,
            });
            this.setState({isLoading:false})
          }
        })
        .catch((err) => {         
          this.setState({isLoading:false})
          showErrorToaster(err);
        });
    } catch (error) {    
      this.setState({isLoading:false})
      showErrorToaster(error);
    }
  };

  updateSearchText(evt) {
    this.setState({
      searchText: evt.target.value,
    });
  }

  handleNameChange(event) {
    const echoData = this.props.selectedEcho;
    this.props.updateEchoData({ ...echoData, title: event.target.value });
    this.setState({
      editEchoTitle: false,
    });
  }

  render() {
    const { selectedEcho } = this.props;
    const { editEchoTitle,isLoading } = this.state;
    return (
      <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center px-2 py-3 position-fixed">
        <div className="d-flex w-100">
          <Link className="mr-2" to="/app/echos/">
            <NavigateBeforeIcon />
            <SettingsIcon />
          </Link>
          {!editEchoTitle && (
            <h2
              className="title mb-3 mb-sm-0 d-flex"
              onClick={() => this.setState({ editEchoTitle: true })}
            >
              <EditIcon className="text-light" />
              {selectedEcho ? selectedEcho.title : "Echo Title"}
            </h2>
          )}
          {editEchoTitle && (
            <h2 className="title mb-3 mb-sm-0 d-flex" style={{ width: "80%" }}>
              <EditIcon className="text-light" />
              <input
                id="standard-basic"
                variant="filled"
                style={{ width: "100%" }}
                defaultValue={selectedEcho ? selectedEcho.title : "No name"}
                onBlur={(event) => this.handleNameChange(event)}
              />
            </h2>
          )}
        </div>

        {isLoading && (
            <div className="mr-3 ">
              <CircularProgress />
            </div>
          )}

        <div>
          <IntlMessages id="editor.pages.toggleState" />     
          <Switch
            classes={{
              checked: "text-primary",
              bar: "bg-primary",
            }}
            checked={
              selectedEcho
                ? selectedEcho.state === "on"
                  ? true
                  : false
                : false
            }
            onChange={this.handleStateChange()}
            aria-label="echoState"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { loader, selectedEcho } = echo;
  return { loader, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
})(Header);
