import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  HELP_SCOUT_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";

class HelpScoutSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      fieldsList: [],
      mailboxList: [],
      userList: [],
      errorFound: false,
      statusOptions: [
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" },
        { value: "closed", label: "Closed" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "mailbox") {
            await this.getUsers(connectionData, fld.value);
          }
        });
      }

      if (
        fields.find((field) => field.key === "mailbox") &&
        this.state.mailboxList.length === 0
      )
        await this.getMailboxes(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "mailbox") {
            await this.getUsers(connectionData, fld.value);
          }
        });
      }

      if (
        fields.find((field) => field.key === "mailbox") &&
        this.state.mailboxList.length === 0
      )
        await this.getMailboxes(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  // get mailbox list
  getMailboxes = async (connectionData) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl: HELP_SCOUT_AUTH_URLS.GET_MAILBOX_LIST,
    };
    try {
      this.setState({ isLoading: true });
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200) {
              const mailboxData = parsedResponse._embedded.mailboxes.map(
                (mailbox) => {
                  return {
                    ...mailbox,
                    value: mailbox.id,
                    label: mailbox.name,
                  };
                }
              );
              this.setState({
                mailboxList: mailboxData,
                isLoading: false,
              });
            } else {
              this.setState({ isLoading: false });
              showErrorToaster(parsedResponse.error);
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get users list
  getUsers = async (connectionData, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl: HELP_SCOUT_AUTH_URLS.GET_USERS_BY_MAILBOX.replace(
        "{mailbox}",
        id
      ),
    };
    try {
      this.setState({ isLoading: true });
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200) {
              const userData = parsedResponse._embedded.users.map((user) => {
                return {
                  ...user,
                  value: user.id,
                  label: user.firstName,
                };
              });
              this.setState({
                userList: userData,
                isLoading: false,
              });
            } else {
              this.setState({ isLoading: false });
              showErrorToaster(parsedResponse.error);
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

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

  handleChangeSelectValue = async (value, key) => {
    const { connectionData, selectedNode } = this.props;
    //clear related fields on change
    if (key === "mailbox") {
      selectedNode.fields = selectedNode.fields.filter(
        (x) => x.key !== "assigned_user"
      );
    }
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);

    if (connectionData) {
      if (key === "mailbox") {
        await this.getUsers(connectionData, value);
      }
    }
  };

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const { mailboxList, userList } = this.state;

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "mailbox" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      options={mailboxList}
                      value={
                        savedFields[field.key]
                          ? mailboxList.find(
                              (val) =>
                                val.value === savedFields[field.key].value
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
                </div>
              )}
              {field.key === "assigned_user" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      options={userList}
                      value={
                        savedFields[field.key]
                          ? userList.find(
                              (val) =>
                                val.value === savedFields[field.key].value
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
                </div>
              )}
              {/* {field.key === "tag" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      fullWidth
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
                </div>
              )}
              {field.key === "status" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      options={statusOptions}
                      value={
                        savedFields[field.key]
                          ? statusOptions.find(
                              (val) =>
                                val.value === savedFields[field.key].value
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
                </div>
              )} */}
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
                {!isRefreshingFields && <span>Refresh fields</span>}
                {isRefreshingFields && <span>Refreshing fields...</span>}
              </Button>
            </>
          )}
        </div>
      </>
    );
  }
}
export default HelpScoutSetup;
