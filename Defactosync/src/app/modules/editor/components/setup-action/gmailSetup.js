import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  GMAIL_AUTH_URLS,
} from "constants/IntegrationConstant";

class GmailSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      labels: [],
      messages: [],
      emails: [],
      threads:[],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      bodyType: [
        { value: "plain", label: "Plain" },
        { value: "html", label: "Html" },
      ]
     
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    console.log("connectionData", connectionData);
    if (connectionData) {
      if (
        fields.find(
          (field) => field.key === "label_ids" || field.key === "new_label_ids"
        ) &&
        this.state.labels.length === 0
      )
        await this.getLabels(connectionData);
      if (
        fields.find((field) => field.key === "message_id") &&
        this.state.messages.length === 0
      )
        await this.getMessages(connectionData);

        if (
          fields.find((field) => field.key === "thread_id") &&
          this.state.threads.length === 0
        )
          await this.getThreads(connectionData);
      if (
        fields.find((field) => field.key === "from") &&
        this.state.emails.length === 0
      ) {
        const emailData = {
          value: connectionData.email,
          label: connectionData.email,
        };

        this.setState({ emails: [emailData] });
      }
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find(
          (field) => field.key === "label_ids" || field.key === "new_label_ids"
        ) &&
        this.state.labels.length === 0
      )
        await this.getLabels(connectionData);

      if (
        fields.find((field) => field.key === "message_id") &&
        this.state.messages.length === 0
      )
        await this.getMessages(connectionData);
        if (
          fields.find((field) => field.key === "thread_id") &&
          this.state.threads.length === 0
        )
          await this.getThreads(connectionData);

        

      if (
        fields.find((field) => field.key === "from") &&
        this.state.emails.length === 0
      ) {
        const emailData = {
          value: connectionData.email,
          label: connectionData.email,
        };
        this.setState({ emails: [emailData] });
      }
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  };

  // get labels
  getLabels = async (connection) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GMAIL_AUTH_URLS.GET_LABELS,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const labelData = parsedResponse.labels.map((label) => {
                return {
                  value: label.id,
                  label: label.name,
                };
              });
              this.setState({
                labels: labelData,
                isLoading: false,
              });
            } else {
              this.setState({
                isLoading: false,
              });
              ToastsStore.error("Token expired!.Please reconnect connection.");
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get Messages
  getMessages = async (connection) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: `${GMAIL_AUTH_URLS.GET_MESSAGES}?maxResults=20`,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              parsedResponse.messages.map(async (message) => {
                await this.getMessage(connection, message.id);
              });

              this.setState({
                isLoading: false,
              });
            } else {
              this.setState({
                isLoading: false,
              });
              ToastsStore.error("Token expired!.Please reconnect connection.");
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get Message
  getMessage = async (connection, id) => {
    let obj = {};
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: `${GMAIL_AUTH_URLS.GET_MESSAGES}/${id}`,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              obj.label = parsedResponse.payload.headers.find(
                (x) => x.name === "Subject"
              ).value;
              obj.value = id;
              this.setState((prevState) => ({
                messages: [...prevState.messages, obj],
              }));
            } else {
              this.setState({
                isLoading: false,
              });
            }
          }
        });
      //return obj;
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get threads
  getThreads = async (connection) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: `${GMAIL_AUTH_URLS.GET_THREADS}?maxResults=20`,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              parsedResponse.threads.map(async (thread) => {
                await this.getThread(connection, thread.id);
              });

              this.setState({
                isLoading: false,
              });
            } else {
              this.setState({
                isLoading: false,
              });
              ToastsStore.error("Token expired!.Please reconnect connection.");
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get thread
  getThread = async (connection, id) => {
    let obj = {};
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: `${GMAIL_AUTH_URLS.GET_THREADS}/${id}`,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);           
            if (result.status === 200 && !parsedResponse.error) {
              obj.label = parsedResponse.messages[0].payload.headers.find(
                (x) => x.name === "Subject"
              ).value;
              obj.value = id;
              this.setState((prevState) => ({
                threads: [...prevState.threads, obj],
              }));
            } else {
              this.setState({
                isLoading: false,
              });
            }
          }
        });
      //return obj;
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      boolTypeListOptions,
      labels,
      messages,
      bodyType,
      emails,
      threads
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
              {(field.key === "label_ids" || field.key === "new_label_ids") && (
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
                    options={labels}
                    value={
                      savedFields[field.key]
                        ? labels.find(
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
              
              {field.key === "thread_id" && (
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
                    options={threads}
                    value={
                      savedFields[field.key]
                        ? threads.find(
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

              {field.key === "from" && (
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
                    options={emails}
                    value={
                      savedFields[field.key]
                        ? emails.find(
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

              {field.key === "message_id" && (
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
                    options={messages}
                    value={
                      savedFields[field.key]
                        ? messages.find(
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

              {field.key === "body_type" && (
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
                    options={bodyType}
                    value={
                      savedFields[field.key]
                        ? bodyType.find(
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

              {field.key === "body" && (
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
                      savedFields[field.key] ? savedFields[field.key].value : ""
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

              {(field.key === "EmailAddress" ||
                field.key === "file" ||
                field.key === "Name" || field.key === "query" ||
                field.key === "name" ||
                field.key === "to" ||
                field.key === "from_name" ||
                field.key === "reply_to" ||
                field.key === "subject" ||
                field.key === "cc" ||
                field.key === "bcc") && (
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
                    defaultValue={
                      savedFields[field.key] ? savedFields[field.key].value : ""
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

              {(field.type === "bool" || field.type === "boolean") && (
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
          {isLoading && (
            <div className="loader-settings m-5">
              <CircularProgress />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default GmailSetup;
