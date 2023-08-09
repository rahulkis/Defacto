import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster} from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  ZENDESK_AUTH_URLS,
} from "constants/IntegrationConstant";

class ZenDeskSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      tickets: [],
      groups: [],
      brands: [],
      users: [],
      assignees: [],
      agreements: [],
      ticketForms: [],
      organizations: [],
      collaborators: [],
      submitters: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      commentFormatOptions: [
        { value: "HTML", label: "HTML" },
        { value: "Plain Text", label: "Plain Text" },
      ],
      statusOptions: [
        { value: "new", label: "New" },
        { value: "open", label: "Open" },
        { value: "pending", label: "Pending" },
        { value: "hold", label: "Hold" },
        { value: "solved", label: "Solved" },
        { value: "closed", label: "Closed" },
      ],
      typeOptions: [
        { value: "problem", label: "Problem" },
        { value: "incident", label: "Incident" },
        { value: "question", label: "Question" },
        { value: "task", label: "Task" },
      ],
      priorityOptions: [
        { value: "urgent", label: "Urgent" },
        { value: "high", label: "High" },
        { value: "normal", label: "Normal" },
        { value: "low", label: "Low" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "ticket") &&
        this.state.tickets.length === 0
      )
        await this.getTickets(connectionData);

      if (
        fields.find((field) => field.key === "sharing_agreement_ids") &&
        this.state.agreements.length === 0
      )
        await this.getSharingAgreements(connectionData);

      if (
        fields.find((field) => field.key === "brand_id") &&
        this.state.brands.length === 0
      )
        await this.getBrands(connectionData);

      if (
        fields.find((field) => field.key === "group_id") &&
        this.state.groups.length === 0
      )
        await this.getGroups(connectionData);

      if (
        fields.find((field) => field.key === "ticket_form_id") &&
        this.state.ticketForms.length === 0
      )
        await this.getTicketForms(connectionData);

      if (
        fields.find((field) => (field.key === "organization_id" || field.key === "organization")) &&
        this.state.organizations.length === 0
      )
        await this.getOrganizations(connectionData);
      if (
        fields.find((field) => field.key === "user") &&
        this.state.users.length === 0
      )
        await this.getUsers(connectionData);

      if (
        fields.find((field) => field.key === "assignee_id") &&
        this.state.assignees.length === 0
      )
        await this.getAssignee(connectionData);

      if (
        fields.find((field) => field.key === "collaborator_ids") &&
        this.state.collaborators.length === 0
      )
        await this.getCollaborators(connectionData);

      if (
        fields.find((field) => field.key === "submitter_id") &&
        this.state.submitters.length === 0
      )
        await this.getSubmitter(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "ticket") &&
        this.state.tickets.length === 0
      )
        await this.getTickets(connectionData);

      if (
        fields.find((field) => field.key === "sharing_agreement_ids") &&
        this.state.agreements.length === 0
      )
        await this.getSharingAgreements(connectionData);

      if (
        fields.find((field) => field.key === "brand_id") &&
        this.state.brands.length === 0
      )
        await this.getBrands(connectionData);

      if (
        fields.find((field) => field.key === "group_id") &&
        this.state.groups.length === 0
      )
        await this.getGroups(connectionData);

      if (
        fields.find((field) => field.key === "ticket_form_id") &&
        this.state.ticketForms.length === 0
      )
        await this.getTicketForms(connectionData);
      if (
        fields.find((field) => (field.key === "organization_id" || field.key === "organization")) &&
        this.state.organizations.length === 0
      )
        await this.getOrganizations(connectionData);
      if (
        fields.find((field) => field.key === "user") &&
        this.state.users.length === 0
      )
        await this.getUsers(connectionData);

      if (
        fields.find((field) => field.key === "assignee_id") &&
        this.state.assignees.length === 0
      )
        await this.getAssignee(connectionData);

      if (
        fields.find((field) => field.key === "collaborator_ids") &&
        this.state.collaborators.length === 0
      )
        await this.getCollaborators(connectionData);

      if (
        fields.find((field) => field.key === "submitter_id") &&
        this.state.submitters.length === 0
      )
        await this.getSubmitter(connectionData);
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

  // get Tickets
  getTickets = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " + btoa(connectionData.email + "/token:" + connectionData.token),          
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_TICKETS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const ticketData = parsedResponse.tickets.map((ticket) => {
                return {
                  value: ticket.id,
                  label: ticket.subject,
                };
              });
              this.setState({
                tickets: ticketData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  // get groups
  getGroups = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_GROUPS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const groupData = parsedResponse.groups.map((group) => {
                return {
                  value: group.id,
                  label: group.name,
                };
              });
              this.setState({
                groups: groupData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  // get brands
  getBrands = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_BRANDS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);

            if (result.status === 200 && !parsedResponse.error) {
              const brandData = parsedResponse.brands.map((brand) => {
                return {
                  value: brand.id,
                  label: brand.name,
                };
              });
              this.setState({
                brands: brandData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  // get sharing agreements
  getSharingAgreements = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_SHARING_AGREEMENT,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const agreementData = parsedResponse.sharing_agreements.map(
                (agreement) => {
                  return {
                    value: agreement.id,
                    label: agreement.name,
                  };
                }
              );
              this.setState({
                agreements: agreementData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  // get ticket forms
  getTicketForms = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_TICKET_FORM,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const formData = parsedResponse.ticket_forms.map((form) => {
                return {
                  value: form.id,
                  label: form.name,
                };
              });
              this.setState({
                ticketForms: formData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  // get organizations
  getOrganizations = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_ORGANIZATIONS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const orgData = parsedResponse.organizations.map((org) => {
                return {
                  value: org.id,
                  label: org.name,
                };
              });
              this.setState({
                organizations: orgData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  // get users
  getUsers = async (connectionData) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ZENDESK_AUTH_URLS.GET_USERS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const userData = parsedResponse.users.map((user) => {
                return {
                  value: user.id,
                  label: user.name + " " + user.role,
                };
              });
              this.setState({
                users: userData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  //get assignee
  getAssignee = async (connectionData) => {   
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint +
        ZENDESK_AUTH_URLS.GET_USERS_BY_SEARCH.replace(
          "{query}",
          "role:agent role:admin"
        ),
    };   
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const userData = parsedResponse.results.map((user) => {
                return {
                  value: user.id,
                  label: user.name + " " + user.role,
                };
              });
              this.setState({
                assignees: userData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  //get collaborators
  getCollaborators = async (connectionData) => {   
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint +
        ZENDESK_AUTH_URLS.GET_USERS_BY_SEARCH.replace(
          "{query}",
          "role:agent role:admin"
        ),
    };
   
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const userData = parsedResponse.results.map((user) => {
                return {
                  value: user.id,
                  label: user.name,
                };
              });
              this.setState({
                collaborators: userData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  //get submitters
  getSubmitter = async (connectionData) => {    
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        Authorization:
          "Basic " +
          btoa(connectionData.email + "/token:" + connectionData.token),
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint +
        ZENDESK_AUTH_URLS.GET_USERS_BY_SEARCH.replace("{query}", "role:agent"),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const userData = parsedResponse.results.map((user) => {
                return {
                  value: user.id,
                  label: user.name,
                };
              });
              this.setState({
                submitters: userData,
                isLoading: false,
              });
            } else {
              this.setState({
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      tickets,
      boolTypeListOptions,
      groups,
      commentFormatOptions,
      statusOptions,
      typeOptions,
      priorityOptions,
      brands,
      users,
      submitters,
      ticketForms,
      agreements,
      organizations,
      collaborators,
      assignees,
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
              {(field.key === "query" ||
                field.key === "domain_names" ||
                field.key === "due_at" ||
                field.key === "subject" ||
                field.key === "tags" ||
                field.key === "role" ||
                field.key === "phone" ||
                field.key === "external_id" ||
                field.key === "name" ||
                field.key === "file" ||
                field.key === "email" ||
                field.key === "collaborators") && (
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
              {field.key === "assignee_id" && (
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
                    options={assignees}
                    value={
                      savedFields[field.key]
                        ? assignees.find(
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
              {field.key === "collaborator_ids" && (
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
                    options={collaborators}
                    value={
                      savedFields[field.key]
                        ? collaborators.find(
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

              {field.key === "comment_format" && (
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
                    options={commentFormatOptions}
                    value={
                      savedFields[field.key]
                        ? commentFormatOptions.find(
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

              {field.key === "ticket" && (
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
                    options={tickets}
                    value={
                      savedFields[field.key]
                        ? tickets.find(
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

              {field.key === "status" && (
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
                    options={statusOptions}
                    value={
                      savedFields[field.key]
                        ? statusOptions.find(
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

              {field.key === "priority" && (
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

              {(field.key === "shared_tickets" ||
                field.key === "shared_comments") && (
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

              {field.key === "submitter_id" && (
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
                    options={submitters}
                    value={
                      savedFields[field.key]
                        ? submitters.find(
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

              {field.key === "ticket_form_id" && (
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
                    options={ticketForms}
                    value={
                      savedFields[field.key]
                        ? ticketForms.find(
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

              {field.key === "sharing_agreement_ids" && (
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
                    options={agreements}
                    value={
                      savedFields[field.key]
                        ? agreements.find(
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

              {field.key === "brand_id" && (
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
                    options={brands}
                    value={
                      savedFields[field.key]
                        ? brands.find(
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
                    options={typeOptions}
                    value={
                      savedFields[field.key]
                        ? typeOptions.find(
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

              {field.key === "group_id" && (
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
                    options={groups}
                    value={
                      savedFields[field.key]
                        ? groups.find(
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
              {(field.key === "organization_id" || field.key === "organization") && (
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
                    options={organizations}
                    value={
                      savedFields[field.key]
                        ? organizations.find(
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
              {field.key === "first_comment" && (
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

              {(field.key === "comment" ||
                field.key === "details" ||
                field.key === "notes") && (
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
                    rows="4"
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

              {field.key === "user" && (
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

export default ZenDeskSetup;
