import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  SLACK_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";

class SlackSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      fieldsList: [],
      channelsList: [],
      usersList: [],
      reactionsList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      sortByListOptions: [
        { value: "match strength", label: "Match Strength (score)" },
        { value: "message date time", label: "Message Date Time (timestamp)" },
      ],
      sortDirectionListOptions: [
        {
          value: "decsending",
          label: "Decsending (newest or best match first)",
        },
        {
          value: "ascending",
          label: "Ascending (oldest or worst match first)",
        },
      ],
    };
  }

  componentWillMount() { 
    const { connectionData, fields } = this.props;

    if (connectionData) {
      if (fields.find((field) => field.key === "channel")  && this.state.channelsList.length === 0)
        this.getChannelList(connectionData);
      if (
        fields.find(
          (field) =>
            field.key === "users" ||
            field.key === "user" ||
            field.label === "To Username"
        ) &&  this.state.usersList.length === 0
      )
        this.getUsersList(connectionData);     
    }
  }

  componentWillReceiveProps() {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (fields.find((field) => field.key === "channel") && this.state.channelsList.length === 0)
        this.getChannelList(connectionData);
      if (
        fields.find(
          (field) =>
            field.key === "users" ||
            field.key === "user" ||
            field.label === "To Username"
        ) &&  this.state.usersList.length === 0
      )
        this.getUsersList(connectionData);     
    }
  }

  getChannelList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.token,
        Accept: "application/json",
      },
      APIUrl: SLACK_AUTH_URLS.GET_CHANNELS_LIST_URL,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);    
          if (result.status === 200 && parsedResponse.ok) {
            const channelsData = parsedResponse.channels.map((channel) => {
              return {
                ...channel,
                value: channel.id,
                label: channel.name,
              };
            });
            this.setState({
              channelsList: channelsData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getUsersList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.token,
        Accept: "application/json",
      },
      APIUrl: SLACK_AUTH_URLS.GET_USERS_LIST_URL,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);        
          if (result.status === 200 && parsedResponse.ok) {
            const usersData = parsedResponse.members.map((member) => {
              return {
                ...member,
                value: member.id,
                label: member.name,
              };
            });
            this.setState({
              usersList: usersData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  handleChangeSelectValue(value, key) {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  }

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  getFieldLabel(field) {
    if (field.label) {
      return field.label;
    } else {
      const splitKeys = field.key.split("_");
      let label = "";
      splitKeys.forEach((key, index) => {
        if (index === 0) {
          label = key;
        } else {
          label = label + " " + key;
        }
      });
      return label;
    }
  }

  render() {
    const {    
      selectedNode,
      fields,
      isRefreshinFields,
    } = this.props;

    const {      
      channelsList,
      usersList,
      boolTypeListOptions,   
      sortByListOptions,
      sortDirectionListOptions,
    } = this.state;

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              <div className="row">
                {field.key === "channel" && field.label !== "To Username" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={channelsList}
                      isSearchable={true}
                      value={
                        savedFields["channel"]
                          ? channelsList.find(
                              (channel) =>
                                channel.value === savedFields["channel"].value
                            )
                          : ""
                      }
                      onChange={(value) =>
                        this.handleChangeSelectValue(value.id, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}
                {field.key === "text" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <TextField                      
                      multiline
                      fullWidth
                      rows="3"                      
                      defaultValue={
                        savedFields[field.key]
                          ? savedFields[field.key].value
                          : ""
                      }
                      onBlur={(e) =>
                        this.handleChangeSelectValue(e.target.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {(field.key === "users" ||
                  field.key === "user" ||
                  field.label === "To Username") && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={usersList}
                      isSearchable={true}
                      value={
                        savedFields[field.key]
                          ? usersList.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(value) =>
                        this.handleChangeSelectValue(value.id, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}

                {field.key === "thread_ts" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      //options={usersList}
                      isSearchable={true}
                      // value={selectedCLI}
                      onChange={(value) =>
                        this.handleChangeSelectValue(value.id, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {field.key === "sort_by" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={sortByListOptions}
                      isSearchable={true}
                      value={
                        savedFields[field.key]
                          ? sortByListOptions.find(
                              (val) => val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(value) =>
                        this.handleChangeSelectValue(value.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}
                {field.key === "sort_dir" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={sortDirectionListOptions}
                      isSearchable={true}
                      value={
                        savedFields[field.key]
                          ? sortDirectionListOptions.find(
                              (val) => val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(value) =>
                        this.handleChangeSelectValue(value.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {(field.type === "boolean" || field.type === "bool") && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={boolTypeListOptions}
                      // filterOption={customFilterApps}
                      value={
                        savedFields[field.key]
                          ? boolTypeListOptions.find(
                              (val) => val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {(field.type === "unicode" ||
                  field.type === "datetime" ||
                  field.type === "file") &&
                  field.key !== "channel" &&
                  field.key !== "users" &&
                  field.key !== "user" &&
                  field.label !== "To Username" &&
                  field.key !== "sort_by" &&
                  field.key !== "sort_dir" &&
                  field.key !== "thread_ts" && (
                    <div className="col-md-12 my-2">
                      <div className="d-flex justify-content-between">
                        <label className="text-capitalize">
                          {this.getFieldLabel(field)}{" "}
                        </label>
                        {field.required && (
                          <span className="text-danger ml-1">(required)</span>
                        )}
                      </div>
                      <Input
                        className="w-100"
                        // options={boolTypeListOptions}
                        defaultValue={
                          savedFields[field.key]
                            ? savedFields[field.key].value
                            : ""
                        }
                        onBlur={(e) =>
                          this.handleChangeSelectValue(
                            e.target.value,
                            field.key
                          )
                        }
                      />
                      <span
                        className="text-light custome-fields-help-text"
                        dangerouslySetInnerHTML={{
                          __html: field.help_text_html,
                        }}
                      ></span>
                    </div>
                  )}
              </div>
            </>
          ))}
          {fields.length && (
            <>
              <Button
                variant="contained"
                color="primary"
                className="jr-btn jr-btn-sm my-2"
                onClick={(e) => this.handlelRefreshFields()}
              >
                <RefreshIcon className="mr-1" />
                {!isRefreshinFields && <span>Refresh fields</span>}
                {isRefreshinFields && <span>Refreshing fields...</span>}
              </Button>
            </>
          )}
        </div>
      </>
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
})(SlackSetup);
