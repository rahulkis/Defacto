import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  GETRESPONSE_AUTH_URLS,
} from "constants/IntegrationConstant";

class GetResponseSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      campaignList: [],
      contacts: [],
      tags: [],
      fromFields: [],
      errorFound: false,
      flags: [
        { value: "openrate", label: "openrate" },
        { value: "clicktrack", label: "clicktrack" },
        { value: "google_analytics", label: "google_analytics" },
      ],
      types: [
        { value: "broadcast", label: "broadcast" },
        { value: "draft", label: "draft" },
      ],
      boolOptions: [
        { value: true, label: "True" },
        { value: false, label: "False" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "campaign_id") &&
        this.state.campaignList.length === 0
      )
        await this.getCampaignList(connectionData);
      if (
        fields.find((field) => field.key === "contact_id") &&
        this.state.contacts.length === 0
      )
        await this.getContactList(connectionData);
      if (
        fields.find((field) => field.key === "tags") &&
        this.state.tags.length === 0
      )
        await this.getTags(connectionData);

      if (
        fields.find((field) => field.key === "fromField__fromFieldId") &&
        this.state.fromFields.length === 0
      )
        await this.getFromFields(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "campaign_id") &&
        this.state.campaignList.length === 0
      )
        await this.getCampaignList(connectionData);
      if (
        fields.find((field) => field.key === "contact_id") &&
        this.state.contacts.length === 0
      )
        await this.getContactList(connectionData);
      if (
        fields.find((field) => field.key === "tags") &&
        this.state.tags.length === 0
      )
        await this.getTags(connectionData);
      if (
        fields.find((field) => field.key === "fromField__fromFieldId") &&
        this.state.fromFields.length === 0
      )
        await this.getFromFields(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
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

  getCampaignList = async (connection) => {
    let formdata = {
      headerValue: {
        "X-Auth-Token": `api-key ${connection.token}`,
      },
      APIUrl:
        GETRESPONSE_AUTH_URLS.BASE_URL +
        GETRESPONSE_AUTH_URLS.GET_CAMPAIGN_LIST,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.length > 0) {
                const campaignListData = parsedResponse.map((tag) => {
                  return {
                    value: tag.campaignId,
                    label: tag.name,
                  };
                });
                this.setState({
                  campaignList: campaignListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  campaignList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                campaignList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getContactList = async (connection) => {
    let formdata = {
      headerValue: {
        "X-Auth-Token": `api-key ${connection.token}`,
      },
      APIUrl:
        GETRESPONSE_AUTH_URLS.BASE_URL + GETRESPONSE_AUTH_URLS.GET_CONTACT_LIST,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.length > 0) {
                const contactListData = parsedResponse.map((contact) => {
                  return {
                    value: contact.contactId,
                    label: contact.email,
                  };
                });
                this.setState({
                  contacts: contactListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  contacts: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                contacts: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getTags = async (connection) => {
    let formdata = {
      headerValue: {
        "X-Auth-Token": `api-key ${connection.token}`,
      },
      APIUrl: GETRESPONSE_AUTH_URLS.BASE_URL + GETRESPONSE_AUTH_URLS.GET_TAGS,
    };
    this.setState({ isLoading: true });
    console.log("formdata", formdata);
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
          
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.length > 0) {
                const tagListData = parsedResponse.map((tag) => {
                  return {
                    value: tag.tagId,
                    label: tag.name,
                  };
                });
                this.setState({
                  tags: tagListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  tags: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                tags: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getFromFields = async (connection) => {
    let formdata = {
      headerValue: {
        "X-Auth-Token": `api-key ${connection.token}`,
      },
      APIUrl:
        GETRESPONSE_AUTH_URLS.BASE_URL + GETRESPONSE_AUTH_URLS.GET_FROM_FIELDS,
    };
    this.setState({ isLoading: true });
    console.log("formdata", formdata);
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
     
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.length > 0) {
                const fromFieldListData = parsedResponse.map((field) => {
                  return {
                    value: field.fromFieldId,
                    label: field.email,
                  };
                });

                console.log("fromFieldListData",fromFieldListData)
                this.setState({
                  fromFields: fromFieldListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  fromFields: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                fromFields: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      campaignList,
      contacts,
      tags,
      flags,
      types,
      boolOptions,
      fromFields,
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
              {(field.key === "email" ||
                field.key === "sendOn" ||
                field.key === "subject" ||
                field.key === "email" ||
                field.key === "subject" ||
                field.key === "name" ||
                field.key === "dayOfCycle" ||
                field.key === "ipAddress" ||
               // field.key === "birthdate" ||
               // field.key === "city" ||
               //  field.key === "comment" ||
                field.key === "company" ||
                field.key === "country" 
                //field.key === "fax" ||
               // field.key === "gender" ||
               // field.key === "home_phone" ||
               //field.key === "http_referer" ||
               // field.key === "mobile_phone" ||
               // field.key === "phone" ||
               // field.key === "postal_code" ||
               // field.key === "ref" ||
               // field.key === "state" ||
               // field.key === "street" ||
               // field.key === "url" ||
               // field.key === "work_phone"
               ) && (
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

              {(field.key === "campaign_id" ||
                field.key === "sendSettings__excludedCampaigns" ||
                field.key === "sendSettings__selectedCampaigns") && (
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
                    options={campaignList}
                    value={
                      savedFields[field.key]
                        ? campaignList.find(
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

              {field.key === "tags" && (
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
                    options={tags}
                    value={
                      savedFields[field.key]
                        ? tags.find(
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
              {field.key === "fromField__fromFieldId" && (
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
                    options={fromFields}
                    value={
                      savedFields[field.key]
                        ? fromFields.find(
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

              {(field.key === "content__html" ||
                field.key === "content__plain") && (
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

              {field.key === "flags" && (
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
                    options={flags}
                    value={
                      savedFields[field.key]
                        ? flags.find(
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

              {field.key === "type" && (
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
                    options={types}
                    value={
                      savedFields[field.key]
                        ? types.find(
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

              {(field.key === "sendSettings__timeTravel" ||
                field.key === "sendSettings_perfectTiming") && (
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
                    options={boolOptions}
                    value={
                      savedFields[field.key]
                        ? boolOptions.find(
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
              {field.key === "contact_id" && (
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
                    options={contacts}
                    value={
                      savedFields[field.key]
                        ? contacts.find(
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

export default GetResponseSetup;
