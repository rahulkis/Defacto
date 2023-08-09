import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  MAILCHIMP_AUTH_URLS,
} from "constants/IntegrationConstant";

class MailChimpSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      audienceList: [],
      campaignList: [],
      templateList: [],
      segmentList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      updateOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      groupOptions: [
        { value: "true", label: "Replace All" },
        { value: "false", label: "Add Only" },
        { value: "matching", label: "Replace Matching" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "list_id") {
            await this.getSegmentsList(
              connectionData,
              fld.value,
              selectedNode.selectedEventName
            );
          }
        });
      }

      if (
        fields.find(
          (field) => field.key === "list_id" || field.key === "list"
        ) &&
        this.state.audienceList.length === 0
      )
        await this.getList(connectionData);

      if (
        fields.find((field) => field.key === "campaign_id") &&
        this.state.campaignList.length === 0
      )
        await this.getCampaignList(connectionData);

      if (
        fields.find((field) => field.key === "template_id") &&
        this.state.templateList.length === 0
      )
        await this.getTemplatesList(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "list_id") {
            await this.getSegmentsList(
              connectionData,
              fld.value,
              selectedNode.selectedEventName
            );
          }
        });
      }

      if (
        fields.find(
          (field) => field.key === "list_id" || field.key === "list"
        ) &&
        this.state.audienceList.length === 0
      )
        await this.getList(connectionData);

      if (
        fields.find((field) => field.key === "campaign_id") &&
        this.state.campaignList.length === 0
      )
        await this.getCampaignList(connectionData);

      if (
        fields.find((field) => field.key === "template_id") &&
        this.state.templateList.length === 0
      )
        await this.getTemplatesList(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);

    const { connectionData, selectedNode } = this.props;
    if (connectionData) {
      if (key === "list_id") {
        await this.getSegmentsList(
          connectionData,
          value,
          selectedNode.selectedEventName
        );
      }
    }
  };

  // get list
  getList = async (connection) => { 
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.token}`,
      },
      APIUrl: connection.endPoint+MAILCHIMP_AUTH_URLS.GET_AUDENCIES,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {          
            const parsedResponse = JSON.parse(result.data.res);           
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.lists) {
                const listData = parsedResponse.lists.map((list) => {
                  return {
                    ...list,
                    value: list.id,
                    label: list.name,
                  };
                });
                this.setState({
                  audienceList: listData,
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                isLoading: false,
              });
              showErrorToaster(parsedResponse.error);
            }
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get list
  getCampaignList = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.token}`,
      },
      APIUrl: connection.endPoint+MAILCHIMP_AUTH_URLS.GET_CAMPAIGNS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const campaignData = parsedResponse.campaigns.map((list) => {
              return {
                ...list,
                value: list.id,
                label: list.settings.title,
              };
            });
            this.setState({
              campaignList: campaignData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get Templates list
  getTemplatesList = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.token}`,
      },
      APIUrl: connection.endPoint+MAILCHIMP_AUTH_URLS.GET_TEMPLATES,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const templateData = parsedResponse.templates.map((list) => {
              return {
                ...list,
                value: list.id,
                label: list.name,
              };
            });
            this.setState({
              templateList: templateData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get segments list
  getSegmentsList = async (connection, listId, event) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.token}`,
      },
      APIUrl: connection.endPoint+MAILCHIMP_AUTH_URLS.GET_SEGMENTS.replace("{listId}", listId),
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          let segmentData = [];
          if (result.status === 200) {
            if (event === "create_campaign") {
              segmentData = parsedResponse.segments.map((segment) => {
                return {
                  value: segment.id,
                  label: segment.name,
                };
              });
            } else {
              segmentData = parsedResponse.segments.filter(
                (x) => x.type === "static"
              );
              segmentData = segmentData.map((segment) => {
                return {
                  value: segment.name,
                  label: segment.name,
                };
              });
            }

            this.setState({
              segmentList: segmentData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      //this.props.OnLoading();
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
      audienceList,
      isLoading,
      boolTypeListOptions,
      campaignList,
      templateList,
      segmentList,
      groupOptions,
      updateOptions,
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
              {(field.key === "list_id" || field.key === "list") && (
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
                    options={audienceList}
                    value={
                      savedFields[field.key]
                        ? audienceList.find(
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

              {field.key === "campaign_id" && (
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

              {(field.key === "segment_id" || field.key === "tags") && (
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
                    options={segmentList}
                    value={
                      savedFields[field.key]
                        ? segmentList.find(
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

              {field.key === "groups" && (
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
                    // options={segmentList}
                    // value={
                    //   savedFields[field.key]
                    //     ? segmentList.find(
                    //         (val) => val.value === savedFields[field.key].value
                    //       )
                    //     : ""
                    // }
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
              {field.key === "template_id" && (
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
                    options={templateList}
                    value={
                      savedFields[field.key]
                        ? templateList.find(
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

              {field.key === "replace_interests" && (
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
                    options={groupOptions}
                    value={
                      savedFields[field.key]
                        ? groupOptions.find(
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

              {(field.key === "email" ||
                field.key === "language" ||
                field.key === "merges__FNAME" ||
                field.key === "merges__LNAME" ||
                field.key === "merges__ADDRESS__addr1" ||
                field.key === "merges__ADDRESS__addr2" ||
                field.key === "merges__ADDRESS__state" ||
                field.key === "merges__ADDRESS__zip" ||
                field.key === "merges__ADDRESS__country" ||
                field.key === "merges__ADDRESS__city" ||
                field.key === "merges__BIRTHDAY" ||
                field.key === "merges__PHONE" ||
                field.key === "to_name" ||
                field.key === "query" ||
                field.key === "from_name" ||
                field.key === "reply_to" ||
                field.key === "title" ||
                field.key === "subject_line" ||
                field.key === "preview_text" ||
                field.key === "name") && (
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

              {field.key === "note" && (
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

              {field.type === "boolean" && field.key !== "update_existing" && (
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

              {field.key === "update_existing" && (
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
                    options={updateOptions}
                    value={
                      savedFields[field.key]
                        ? updateOptions.find(
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

export default MailChimpSetup;
