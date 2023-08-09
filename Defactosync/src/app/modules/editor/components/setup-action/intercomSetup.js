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
  INTERCOM_AUTH_URLS,
} from "constants/IntegrationConstant";

class Intercom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      tags: [],
      leads: [],
      users: [],
      contacts:[],
      companyTags: [],
      companies: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      userSearchModeOptions: [
        { value: "email", label: "Email" },
        { value: "id", label: "ID" },
        { value: "user_id", label: "User ID" },
      ],
      companySearchModeOptions: [
        { value: "name", label: "Name" },
        { value: "company_id", label: "Company ID" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.label === "Tag Name") &&
        this.state.tags.length === 0
      )
        this.getTags(connectionData);
      if (
        fields.find((field) => field.key === "company") &&
        this.state.companies.length === 0
      )
        this.getCompanies(connectionData);

      if (
        fields.find((field) => field.key === "lead") &&
        this.state.leads.length === 0
      )
        this.getLeads(connectionData);

      if (
        fields.find((field) => field.key === "users") &&
        this.state.users.length === 0
      )
        this.getUsers(connectionData);

        if (
          fields.find((field) => field.key === "usersemail") &&
          this.state.contacts.length === 0
        )
          this.getContacts(connectionData);

      if (
        fields.find((field) => field.key === "companytagname") &&
        this.state.companyTags.length === 0
      )
        this.getCompanyTags(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.label === "Tag Name") &&
        this.state.tags.length === 0
      )
        this.getTags(connectionData);
      if (
        fields.find((field) => field.key === "company") &&
        this.state.companies.length === 0
      )
        this.getCompanies(connectionData);

      if (
        fields.find((field) => field.key === "lead") &&
        this.state.leads.length === 0
      )
        this.getLeads(connectionData);

      if (
        fields.find((field) => field.key === "users") &&
        this.state.users.length === 0
      )
        this.getUsers(connectionData);
        if (
          fields.find((field) => field.key === "usersemail") &&
          this.state.contacts.length === 0
        )
          this.getContacts(connectionData);
      if (
        fields.find((field) => field.key === "companytagname") &&
        this.state.companyTags.length === 0
      )
        this.getCompanyTags(connectionData);
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

  getTags = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + INTERCOM_AUTH_URLS.GET_TAGS,
    };
    this.setState({
      isLoading: true,
    });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const tagsData = parsedResponse.data.map((tag) => {
                  return {
                    value: tag.id,
                    label: tag.name,
                  };
                });
                this.setState({
                  tags: tagsData,
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

  getCompanyTags = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + INTERCOM_AUTH_URLS.GET_TAGS,
    };
    this.setState({
      isLoading: true,
    });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const tagsData = parsedResponse.data.map((tag) => {
                  return {
                    value: tag.name,
                    label: tag.name,
                  };
                });
                this.setState({
                  companyTags: tagsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  companyTags: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                companyTags: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getCompanies = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + INTERCOM_AUTH_URLS.GET_COMPANIES,
    };
    this.setState({
      isLoading: true,
    });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const companiesData = parsedResponse.data.map((company) => {
                  return {
                    value: company.company_id,
                    label: company.name,
                  };
                });
                this.setState({
                  companies: companiesData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  companies: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                companies: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getLeads = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + INTERCOM_AUTH_URLS.GET_CONTACTS,
    };
    this.setState({
      isLoading: true,
    });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const leadsData = parsedResponse.data
                  .filter((x) => x.role === "lead")
                  .map((lead) => {
                    return {
                      value: lead.id,
                      label: lead.name,
                    };
                  });
                this.setState({
                  leads: leadsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  leads: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                leads: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getUsers = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + INTERCOM_AUTH_URLS.GET_CONTACTS,
    };
    this.setState({
      isLoading: true,
    });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const usersData = parsedResponse.data
                  .filter((x) => x.role === "user")
                  .map((user) => {
                    return {
                      value: user.id,
                      label: user.name,
                    };
                  });
                this.setState({
                  users: usersData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  users: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                users: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  

  getContacts = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl: INTERCOM_AUTH_URLS.BASE_URL + INTERCOM_AUTH_URLS.GET_CONTACTS,
    };
    this.setState({
      isLoading: true,
    });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const contactsData = parsedResponse.data
                .filter((x) => x.role === "user")                
                  .map((contact) => {
                    return {
                      value: contact.id,
                      label: contact.email,
                    };
                  });
                this.setState({
                  contacts: contactsData,
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      boolTypeListOptions,
      userSearchModeOptions,
      tags,
      leads,
      users,
      companies,
      companyTags,
      contacts,
      companySearchModeOptions,
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
                field.key === "id" ||
                field.key === "phone" ||
                field.key === "user_id" ||
                field.key === "last_seen_ip" ||
                field.key === "remote_created_at" ||
                field.label === "Full Name" ||
                field.key === "monthly_spend" ||
                field.key === "plan" ||
                field.key === "event_name" ||
                field.key === "search_value") && (
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
              {field.key === "search_mode" && (
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
                    options={userSearchModeOptions}
                    value={
                      savedFields[field.key]
                        ? userSearchModeOptions.find(
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
              {field.key === "search_mode_company" && (
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
                    options={companySearchModeOptions}
                    value={
                      savedFields[field.key]
                        ? companySearchModeOptions.find(
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

              {field.key === "company" && (
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
                    options={companies}
                    value={
                      savedFields[field.key]
                        ? companies.find(
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

              {field.key === "companytagname" && (
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
                    options={companyTags}
                    value={
                      savedFields[field.key]
                        ? companyTags.find(
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
              {field.label === "Tag Name" && field.key !== "companytagname" && (
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
              {field.key === "lead" && (
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
                    options={leads}
                    value={
                      savedFields[field.key]
                        ? leads.find(
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

              {field.key === "users" && (
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
                    options={users}
                    value={
                      savedFields[field.key]
                        ? users.find(
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

{field.key === "usersemail" && (
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

export default Intercom;
