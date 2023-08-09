import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import timezones from "jsonData/timezone";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster} from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  GOTOWEBINAR_AUTH_URLS,
} from "constants/IntegrationConstant";

var jsonBig = require("json-bigint");
class GoToWebinarSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      webinarList: [],
      registrantList: [],
      recordingList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      experienceTypeOptions: [
        { value: "CLASSIC", label: "Classic" },
        { value: "BROADCAST", label: "Webcast" },
        { value: "SIMULIVE", label: "Simulated Live" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "webinar_key") {
            await this.getRegistrants(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "webinar_key") &&
        this.state.webinarList.length === 0
      )
        await this.getWebinars(connectionData);
      if (
        fields.find((field) => field.key === "recordingAssetKey") &&
        this.state.recordingList.length === 0
      )
        await this.getRecordingAssets(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "webinar_key") {
            await this.getRegistrants(connectionData, fld.value);
          }
        });
      }

      if (
        fields.find((field) => field.key === "webinar_key") &&
        this.state.webinarList.length === 0
      )
        await this.getWebinars(connectionData);

      if (
        fields.find((field) => field.key === "recordingAssetKey") &&
        this.state.recordingList.length === 0
      )
        await this.getRecordingAssets(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);

    const { connectionData } = this.props;
    if (connectionData) {
      if (key === "webinar_key") {
        await this.getRegistrants(connectionData, value);
      }
    }
  };

  // get webinars
  getWebinars = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOTOWEBINAR_AUTH_URLS.GET_WEBINARS.replace(
        "{accountKey}",
        connection.memberId
      )
        .replace("{fromTime}", GOTOWEBINAR_AUTH_URLS.START_DATE)
        .replace("{toTime}", GOTOWEBINAR_AUTH_URLS.END_DATE),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {        
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if(parsedResponse._embedded.webinars.length>0){
              const webinarData = parsedResponse._embedded.webinars.map(
                (webinar) => {
                  return {
                    value: webinar.webinarKey,
                    label: webinar.subject,
                  };
                }
              );
              this.setState({
                webinarList: webinarData,
                isLoading: false,
              });
            }else{
              this.setState({
                webinarList: [],
                isLoading: false,
              });
            }
           
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get registrants
  getRegistrants = async (connection, webinarKey) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOTOWEBINAR_AUTH_URLS.GET_REGISTRANTS.replace(
        "{organizerKey}",
        connection.tokenInfo.organizer_key
      ).replace("{webinarKey}", webinarKey),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = jsonBig.parse(result.data.res);
            const registrantData = parsedResponse.map((registrant) => {
              return {
                value: registrant.registrantKey.toString(),
                label: registrant.firstName,
              };
            });
            this.setState({
              registrantList: registrantData,
              isLoading: false,
            });
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get recordings
  getRecordingAssets = async (connection) => {  
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOTOWEBINAR_AUTH_URLS.GET_RECORDINGS,
      bodyInfo: {
        accountKey: connection.memberId,
      },
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => { 
          if (result.status === 200) {          
            if(result.data.res.status!==403 && result.data.res.page.totalElements>0){
              const parsedResponse = result.data.res;
              if(parsedResponse._embedded.recordingAssets.length>0 ){
                const recordingData = parsedResponse._embedded.recordingAssets.map(
                  (record) => {
                    return {
                      value: record.recordingAssetKey,
                      label: record.name,
                    };
                  }
                );
                this.setState({
                  recordingList: recordingData,
                  isLoading: false,
                });
              }else{
                this.setState({
                  recordingList: [],
                  isLoading: false,
                });
              }
              
            }else{
              this.setState({
                recordingList: [],
                isLoading: false,
              });
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      boolTypeListOptions,
      webinarList,
      experienceTypeOptions,
      registrantList,
      recordingList,
    } = this.state;

    let optionsList = [];
    timezones.map((timezone) => {
      let obj = { value: timezone, label: timezone };
      optionsList.push(obj);
    });

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });

    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "webinar_key" && (
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
                    options={webinarList}
                    value={
                      savedFields[field.key]
                        ? webinarList.find(
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

              {field.key === "registrant_key" && (
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
                    options={registrantList}
                    value={
                      savedFields[field.key]
                        ? registrantList.find(
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

              {field.key === "timeZone" && (
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
                    options={optionsList}
                    value={
                      savedFields[field.key]
                        ? optionsList.find(
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

              {(field.key === "start_time" ||
                field.key === "firstName" ||
                field.key === "source" ||
                field.key === "lastName" ||
                field.key === "end_time" ||
                field.key === "subject" ||
                field.key === "email") && (
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

              {field.type === "boolean" && (
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

              {field.key === "description" && (
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

              {field.key === "experienceType" && (
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
                    options={experienceTypeOptions}
                    value={
                      savedFields[field.key]
                        ? experienceTypeOptions.find(
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

              {field.key === "recordingAssetKey" && (
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
                    options={recordingList}
                    value={
                      savedFields[field.key]
                        ? recordingList.find(
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

export default GoToWebinarSetup;
