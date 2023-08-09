import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import moment from "moment";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import timezones from "jsonData/timezone";
import { updateEchoData } from "actions/index";
import ConnectedApp from "./connectedApp";

class OverView extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      expandDescription: false,
      expandTimezone: false,
      timezone: null,
    };
  }

  handleDescription = () => {
    this.setState((prevState) => ({
      expandDescription: !prevState.expandDescription,
    }));
  };

  handleActionChange = (value, echo) => {
    this.setState({
      expandTimezone: false,
    });
    this.props.updateEchoData({ ...echo, timezone: value.label });
  };

  saveDescription = (e, echo) => {
    let desc = e.target.value;
    this.setState({
      expandDescription: false,
    });
    this.props.updateEchoData({ ...echo, description: desc });
  };

  handleTimezone = () => {
    this.setState((prevState) => ({
      expandTimezone: !prevState.expandTimezone,
    }));
  };

  render() {
    const { selectedEcho } = this.props;
    const { expandDescription, expandTimezone } = this.state;
    let optionsList = [];
    timezones.map((timezone) => {
      let obj = { value: timezone, label: timezone };
      optionsList.push(obj);
    });

    return (
      <div className="echos-detail-page-overview">
        <p className="echos-detail-page-overview-heading">Echos Details</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 ">
                <div>
                  <label className="mr-2 echos-detail-page-overview-label">
                    Description
                  </label>
                  <EditIcon
                    className="echos-detail-page-overview-icon"
                    onClick={this.handleDescription}
                  />
                </div>
                {expandDescription ? (
                  <div>
                    <TextField
                      required
                      multiline
                      rows="3"
                      fullWidth
                      placeholder="Enter Description"
                      onBlur={(event) =>
                        this.saveDescription(event, selectedEcho)
                      }
                      defaultValue={selectedEcho.description}
                      margin="none"
                    />
                  </div>
                ) : (
                  <div>
                    <p>
                      {selectedEcho.description
                        ? selectedEcho.description
                        : "No Description"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <label className="echos-detail-page-overview-label mr-2">
                  Timezone
                </label>
                <EditIcon
                  className="echos-detail-page-overview-icon"
                  onClick={this.handleTimezone}
                />
                {expandTimezone ? (
                  <div>
                    <Select
                      options={optionsList}
                      onChange={(value) =>
                        this.handleActionChange(value, selectedEcho)
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <p>
                      {selectedEcho.timezone
                        ? selectedEcho.timezone
                        : "No Timezone Selected"}
                    </p>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="echos-detail-page-overview-label">
                  Last Modified
                </label>
                <p>
                  {selectedEcho
                    ? moment.unix(selectedEcho.updatedAt).format("LLL")
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
         <ConnectedApp /> 
      </div>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { selectedEcho } = echo;
  return { selectedEcho };
};

export default connect(mapStateToProps, {
  updateEchoData,
})(OverView);
