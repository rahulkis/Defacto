import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  FRESHDESK_AUTH_URLS,
} from "constants/IntegrationConstant";

class FreshDeskSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      categories: [],
      forums: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      lockOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      visibilityOptions: [
        { value: 1, label: "All" },
        { value: 2, label: "Logged In Users" },
        { value: 3, label: "Agents" },
        { value: 4, label: "Select Companies" },
      ],
      forumTypeOptions: [
        { value: 1, label: "Questions" },
        { value: 2, label: "Ideas" },
        { value: 3, label: "Problems" },
        { value: 4, label: "Annoucements" },
      ],
      ticketTypeOptions: [
        { value: "Question", label: "Question" },
        { value: "Incident", label: "Incident" },
        { value: "Problem", label: "Problem" },
        { value: "Feature Request", label: "Feature Request" },
        { value: "Refunds and Returns", label: "Refunds and Returns" },
        { value: "Bulk orders", label: "Bulk orders" },
        { value: "Refunds", label: "Refunds" },
      ],
      priorityOptions: [
        { value: 1, label: "Low" },
        { value: 2, label: "Medium" },
        { value: 3, label: "High" },
        { value: 4, label: "Urgent" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "forum_category_id") {
            await this.getForums(connectionData, fld.value);
          }
        });
      }

      if (
        fields.find((field) => field.key === "forum_category_id") &&
        this.state.categories.length === 0
      )
        await this.getForumCategories(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "forum_category_id") {
            await this.getForums(connectionData, fld.value);
          }
        });
      }

      if (
        fields.find((field) => field.key === "forum_category_id") &&
        this.state.categories.length === 0
      )
        await this.getForumCategories(connectionData);
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
      if (key === "forum_category_id") {
        await this.getForums(connectionData, value);
      }
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

  getForumCategories = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.token, "X"),
        "Content-Type": "application/json",
      },
      APIUrl:
        connectionData.endPoint + FRESHDESK_AUTH_URLS.GET_FORUM_CATEGORIES,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.length) {
                const categoryData = parsedResponse.map((category) => {
                  return {
                    value: category.id,
                    label: category.name,
                  };
                });
                this.setState({
                  categories: categoryData,
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getForums = async (connectionData, id) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.token, "X"),
        "Content-Type": "application/json",
      },
      APIUrl:
        connectionData.endPoint +
        FRESHDESK_AUTH_URLS.GET_FORUM_BY_ID.replace("{id}", id),
    };
    //  this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {        
            const parsedResponse = JSON.parse(result.data.res);       
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.length > 0) {
                const forumData = parsedResponse.map((forum) => {
                  return {
                    value: forum.id,
                    label: forum.name,
                  };
                });
                this.setState({
                  forums: forumData,
                  //isLoading: false,
                });
              } else {
                this.setState({
                  forums: [],
                });
              }
            } else {
              this.setState({
                forums: [],
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
      boolTypeListOptions,
      lockOptions,
      visibilityOptions,
      forumTypeOptions,
      categories,
      priorityOptions,
      forums,
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
              {(field.key === "ticket_id" ||
                field.key === "topic__body_html" ||
                field.key === "email" ||
                field.key === "id" ||
                field.key === "forum_category__name" ||
                field.key === "topic__title" ||
                field.key === "forum__name" ||
                field.key === "topic__body_html " ||
                field.key === "helpdesk_ticket__subject" ||
                field.key === "cc_emails" ||
                field.key === "user__email" ||
                field.key === "helpdesk_ticket__email" ||
                field.key === "user__phone" ||
                field.key === "user__job_title" ||
                field.key === "user__tags" ||
                field.key === "user__name" ||
                field.key === "customer__name" ||
                field.key === "customer__description" ||
                field.key === "customer__note" ||
                field.key === "customer__domains" ||
                field.key === "helpdesk_note__body") && (
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

              {(field.key === "user__address" ||
                field.key === "forum_category__description" ||
                field.key === "forum__description" ||
                field.key === "helpdesk_ticket__description" ||
                field.key === "user__description") && (
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

              {field.key === "forum__forum_visibility" && (
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
                    options={visibilityOptions}
                    value={
                      savedFields[field.key]
                        ? visibilityOptions.find(
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
              {field.key === "forum__forum_type" && (
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
                    options={forumTypeOptions}
                    value={
                      savedFields[field.key]
                        ? forumTypeOptions.find(
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

              {field.key === "helpdesk_ticket__type" && (
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
                    // options={submitters}
                    // value={
                    //   savedFields[field.key]
                    //     ? submitters.find(
                    //         (val) => val.value === savedFields[field.key].value
                    //       )
                    //     : ""
                    // }
                    // onChange={(e) =>
                    //   this.handleChangeSelectValue(e.value, field.key)
                    // }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}

              {field.key === "helpdesk_ticket__priority" && (
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
                    options={priorityOptions}
                    value={
                      savedFields[field.key]
                        ? priorityOptions.find(
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

              {field.key === "forum_id" && (
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
                    options={forums}
                    value={
                      savedFields[field.key]
                        ? forums.find(
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
              {(field.key === "topic__sticky" ||
                field.key === "topic__locked") && (
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
                    options={lockOptions}
                    value={
                      savedFields[field.key]
                        ? lockOptions.find(
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

              {field.key === "forum_category_id" && (
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
                    options={categories}
                    value={
                      savedFields[field.key]
                        ? categories.find(
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

              {field.type === "bool" && (
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

export default FreshDeskSetup;
