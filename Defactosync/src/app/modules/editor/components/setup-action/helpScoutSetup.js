import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  HELP_SCOUT_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";

const countriesData = require("./../../../../../jsonData/countries.json");

class HelpScoutSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      fieldsList: [],
      userList: [],
      mailboxList: [],
      conversationList: [],
      customerList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      successOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      statusOptions: [
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" },
        { value: "closed", label: "Closed" },
      ],
      threadTypes: [
        { value: "reply", label: "Reply" },
        { value: "draft", label: "Draft" },
        { value: "customer", label: "Customer" },
        { value: "phone", label: "Phone" },
        { value: "chat", label: "Chat" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "id") &&
        this.state.conversationList.length === 0
      )
        await this.getConversations(connectionData);
      if (
        fields.find(
          (field) => field.key === "user" || field.key === "assignTo"
        ) &&
        this.state.userList.length === 0
      )
        await this.getUsers(connectionData, "user");

      if (
        fields.find((field) => field.key === "customer__id") &&
        this.state.customerList.length === 0
      )
        await this.getCustomers(connectionData);

      if (
        fields.find((field) => field.key === "user_email") &&
        this.state.userList.length === 0
      )
        await this.getUsers(connectionData, "user_email");

      if (
        fields.find(
          (field) => field.key === "mailbox" || field.key === "mailboxId"
        ) &&
        this.state.mailboxList.length === 0
      )
        await this.getMailboxes(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "id") &&
        this.state.conversationList.length === 0
      )
        await this.getConversations(connectionData);

      if (
        fields.find(
          (field) => field.key === "user" || field.key === "assignTo"
        ) &&
        this.state.userList.length === 0
      )
        await this.getUsers(connectionData, "user");

      if (
        fields.find((field) => field.key === "customer__id") &&
        this.state.customerList.length === 0
      )
        await this.getCustomers(connectionData);

      if (
        fields.find((field) => field.key === "user_email") &&
        this.state.userList.length === 0
      )
        await this.getUsers(connectionData, "user_email");
      if (
        fields.find(
          (field) => field.key === "mailbox" || field.key === "mailboxId"
        ) &&
        this.state.mailboxList.length === 0
      )
        await this.getMailboxes(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue(value, key) {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
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
  getUsers = async (connectionData, event) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl: HELP_SCOUT_AUTH_URLS.GET_USERS,
    };
    try {
      this.setState({ isLoading: true });
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200) {
              let userData = [];
              if (event === "user") {
                userData = parsedResponse._embedded.users.map((user) => {
                  return {
                    ...user,
                    value: user.id,
                    label: user.firstName,
                  };
                });
              } else {
                userData = parsedResponse._embedded.users.map((user) => {
                  return {
                    ...user,
                    value: user.id,
                    label: user.email,
                  };
                });
              }

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

  // get users list
  getConversations = async (connectionData) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl: HELP_SCOUT_AUTH_URLS.GET_CONVERSATIONS,
    };
    try {
      this.setState({ isLoading: true });
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200) {
              const conversationData = parsedResponse._embedded.conversations.map(
                (conversation) => {
                  return {
                    ...conversation,
                    value: conversation.id,
                    label: conversation.id,
                  };
                }
              );
              this.setState({
                conversationList: conversationData,
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

  // get customers list
  getCustomers = async (connectionData) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl: HELP_SCOUT_AUTH_URLS.GET_CUSTOMERS,
    };
    try {
      this.setState({ isLoading: true });
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200) {
              const customerData = parsedResponse._embedded.customers.map(
                (customer) => {
                  return {
                    ...customer,
                    value: customer.id,
                    label: customer.id,
                  };
                }
              );
              this.setState({
                customerList: customerData,
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      userList,
      conversationList,
      boolTypeListOptions,
      customerList,
      successOptions,
      statusOptions,
      threadTypes,
      mailboxList,
    } = this.state;
    console.log(fields);

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "id" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={conversationList}
                      value={
                        savedFields[field.key]
                          ? conversationList.find(
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
              {field.key === "text" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
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
                </div>
              )}
              {field.key === "user" && (
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
              {field.key === "subject" && (
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
              {(field.key === "mailboxId" || field.key === "mailbox") && (
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
              {field.key === "customer__id" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={customerList}
                      value={
                        savedFields[field.key]
                          ? customerList.find(
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
              {field.key === "thread__user" && (
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
              {field.key === "thread__type" && (
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
                      options={threadTypes}
                      value={
                        savedFields[field.key]
                          ? threadTypes.find(
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
              )}
              {field.key === "assignTo" && (
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
              {(field.key === "customer_label" || field.key === "address") && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3  ">
                    <div className="alert alert-primary">
                      {" "}
                      {field.help_text}
                    </div>
                    {/* <span
                      className="alert alert-primary"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span> */}
                  </div>
                </div>
              )}
              {(field.key === "imported" || field.key === "draft") && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={boolTypeListOptions}
                      value={
                        savedFields[field.key]
                          ? boolTypeListOptions.find(
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
              {field.key === "autoReply" && (
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
                      options={boolTypeListOptions}
                      value={
                        savedFields[field.key]
                          ? boolTypeListOptions.find(
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
              {field.key === "_echo_search_success_on_miss" && (
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
                      options={successOptions}
                      value={
                        savedFields[field.key]
                          ? successOptions.find(
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
              {field.key === "address__country" && (
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
                      options={countriesData}
                      value={
                        savedFields[field.key]
                          ? countriesData.find(
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
              {field.key === "customer__email" && (
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
              {field.key === "tags" && (
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
              {(field.key === "thread__cc" || field.key === "query") && (
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
              {(field.key === "firstName" || field.key === "name") && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
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
              {field.key === "lastName" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
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

              {field.key === "user_email" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
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

              {field.key === "email" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
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
              {field.key === "website" && (
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
              {field.key === "date_range_start" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
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
              {field.key === "date_range_end" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
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
              {field.key === "background" && (
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
                      multiline
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
                </div>
              )}
              {field.key === "address__lines" && (
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
                      multiline
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
                </div>
              )}
              {field.key === "organization" && (
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
              {field.key === "address__city" && (
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
              {field.key === "address__state" && (
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
              {field.key === "address__postalCode" && (
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
              {field.key === "location" && (
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
              {field.key === "jobTitle" && (
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
              {field.key === "thread__bcc" && (
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
              {field.key === "thread__text" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
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
                </div>
              )}

              {/* {field.key === "phone" && (
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

              {field.key === "socialProfile" && (
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

              {field.key === "chat" && (
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
