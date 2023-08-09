import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
// import Select from '@material-ui/core/Select';
import Select from "react-select";

import { showErrorToaster } from 'appUtility/commonFunction';


import { updateEchoData } from "actions/index";
import timezones from "../../../../../jsonData/timezone";
import { POCKETS_URLS } from "../../../../../constants/AppConst";
import { httpClient } from "../../../../../appUtility/Api";

class SettingsPanel extends React.Component {
  closeCustomizer = () => {
    this.setState({ drawerStatus: false, pocketsList: [] });
  };

  constructor() {
    super();
    this.state = {
      drawerStatus: false,
      timezonesList: [],
      pocketsList: [],
    };
  }

  componentWillMount() {
    this.getPocketsList();
    const timezonesList = timezones.map((zone) => {
      return { label: zone, id: zone };
    });
    this.setState({
      timezonesList: timezonesList,
    });
  }

  componentDidMount() {
    document.body.classList.add(this.props.themeColor);
  }

  getPocketsList() {
    try {
      httpClient
        .get(POCKETS_URLS.GET_ALL_POCKETS)
        .then((res) => {
          if (res.status === 200) {
            const pockets = res.data.data.map((pocket) => {
              return {
                ...pocket,
                label: pocket.title,
                value: pocket.id,
              };
            });
            this.setState({
              pocketsList: pockets,
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  handleTitleChange(value) {
    const echoData = this.props.selectedEcho;
    this.props.updateEchoData({ ...echoData, title: value });
  }

  handleDescriptionChange(value) {
    const echoData = this.props.selectedEcho;
    this.props.updateEchoData({ ...echoData, description: value });
  }

  handlePocketChange(value) {
    const echoData = this.props.selectedEcho;
    this.props.updateEchoData({ ...echoData, pocketIds: [value.id] });
  }

  handleTimezoneChange(value) {
    const echoData = this.props.selectedEcho;
    this.props.updateEchoData({ ...echoData, timezone: value.id });
  }

  render() {
    const { selectedEcho } = this.props;
    const { pocketsList, timezonesList } = this.state;

    const selectedPocketId = selectedEcho.pocketIds.length ? pocketsList.find(pkt => pkt.id === selectedEcho.pocketIds[0]) : '';
    const selectedTimezone = selectedEcho.timezone ? timezonesList.find(tz => tz.id === selectedEcho.timezone) : ''; 

    return (
      <div className="echo-editor-setting-container">
        <div className="app-login-form">
          <form method="post" action="/">
            <FormControl className="w-100 mb-3">
              <TextField
                type="textarea"
                label="Name"
                onChange={(event) => this.handleTitleChange(event.target.value)}
                fullWidth
                defaultValue={selectedEcho ? selectedEcho.title : ''}
                margin="normal"
                className="mt-1 mb-3"
              />
            </FormControl>
            <FormControl className="w-100 mb-3">
              <label className="mb-1">Add To Pocket</label>
              <Select
                options={pocketsList}
                isSearchable={true}
                value={selectedPocketId}
                placeholder={
                  <div>
                    <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                    &nbsp;Select a pocket
                  </div>
                }
                onChange={(value) => this.handlePocketChange(value)}
              />
            </FormControl>
            <FormControl className="w-100 mb-3">
              <TextField
                type="text"
                onChange={(event) =>
                  this.handleDescriptionChange(event.target.value)
                }
                label="Description"
                fullWidth
                multiline
                defaultValue={selectedEcho ? selectedEcho.description : ''}
                margin="normal"
                rows="4"
                className="mt-1 mb-3"
              />
            </FormControl>
            <FormControl className="w-100 mb-3">
              <label className="mb-1">Timezone</label>
              <Select
                options={timezonesList}
                isSearchable={true}
                value={selectedTimezone}
                placeholder={
                  <div>
                    <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                    &nbsp;Select a timezone
                  </div>
                }
                onChange={(value) => this.handleTimezoneChange(value)}
              />
            </FormControl>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, echo }) => {
  const { themeColor } = settings;
  const { selectedEcho } = echo;
  return { themeColor, selectedEcho };
};

export default withRouter(
  connect(mapStateToProps, { updateEchoData })(SettingsPanel)
);
