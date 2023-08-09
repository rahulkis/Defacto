import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  FOLLOWUPBOSS_AUTH_URLS,
} from "constants/IntegrationConstant";
import { TextField } from "@material-ui/core";

class FollowUpBossSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      peoplesList: [],
      groupsList: [],
      pondLeadsList: [],
      usersList: [],
      stagesList: [],
      pipelinesList: [],
      errorFound: false,
      isHtmlsList: [
        { value: true, label: "True" },
        { value: false, label: "False" },
      ],
      typesList: [
        { value: "Spouse", label: "Spouse" },
        { value: "Brother", label: "Brother" },
        { value: "Partner", label: "Partner" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "people" || field.key === "person") &&
        this.state.peoplesList.length === 0
      )
        await this.getPeoples(connectionData);
      if (
        fields.find((field) => field.key === "group") &&
        this.state.groupsList.length === 0
      )
        await this.getGroups(connectionData);
      if (
        fields.find((field) => field.key === "pond_lead") &&
        this.state.pondLeadsList.length === 0
      )
        await this.getPondLeads(connectionData);
      if (
        fields.find((field) => field.key === "user" || field.key === "team_member") &&
        this.state.usersList.length === 0
      )
        await this.getUsers(connectionData);
      if (
        fields.find((field) => field.key === "pipeline") &&
        this.state.pipelinesList.length === 0
      )
        await this.getPipelines(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "people" || field.key === "person") &&
        this.state.peoplesList.length === 0
      )
        await this.getPeoples(connectionData);
      if (
        fields.find((field) => field.key === "group") &&
        this.state.groupsList.length === 0
      )
        await this.getGroups(connectionData);
      if (
        fields.find((field) => field.key === "pond_lead") &&
        this.state.pondLeadsList.length === 0
      )
        await this.getPondLeads(connectionData);
      if (
        fields.find((field) => field.key === "user" || field.key === "team_member") &&
        this.state.usersList.length === 0
      )
        await this.getUsers(connectionData);
      if (
        fields.find((field) => field.key === "pipeline") &&
        this.state.pipelinesList.length === 0
      )
        await this.getPipelines(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    const { connectionData } = this.props;
    this.props.onRefreshFields();
    if(key === "pipeline") {
      await this.getPipelineStages(connectionData, value);
   }
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

  getPeoples = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Basic " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.GET_PEOPLES
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.people.length > 0) {
                const peoplesData = parsedResponse.people.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  peoplesList: peoplesData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  peoplesList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                peoplesList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getGroups = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Basic " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.GET_GROUPS
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.groups.length > 0) {
                const groupsData = parsedResponse.groups.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  groupsList: groupsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  groupsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                groupsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getUsers = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Basic " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.GET_USERS
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.users.length > 0) {
                const UsersData = parsedResponse.users.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  usersList: UsersData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  usersList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                usersList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getPondLeads = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Basic " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.GET_USERS
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.users.length > 0) {
                const pondLeadsData = parsedResponse.users.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  pondLeadsList: pondLeadsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  pondLeadsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                pondLeadsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };


  getPipelineStages = async (connection, id) => {
    let formdata = {
      headerValue: {
        Authorization: "Basic " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.GET_PIPELINE_STAGES + id
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.stages.length > 0) {
                const stagesData = parsedResponse.stages.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  stagesList: stagesData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  stagesList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                stagesList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };


  getPipelines = async (connection) => {
    const { selectedNode, connectionData } = this.props;
    let formdata = {
      headerValue: {
        Authorization: "Basic " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      FOLLOWUPBOSS_AUTH_URLS.BASE_URL + FOLLOWUPBOSS_AUTH_URLS.GET_PIPELINES
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              const savedFields = {};
                selectedNode.fields.forEach((fld) => {
                  savedFields[fld.key] = { ...fld };
                });
              if (parsedResponse.pipelines.length > 0) {
                const pipelinesData = parsedResponse.pipelines.map((item) => {
                  if(Object.keys(savedFields).length > 0 && savedFields.pipeline.value === item.id) {
                    this.getPipelineStages(connectionData, item.id);
               }
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  pipelinesList: pipelinesData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  pipelinesList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                pipelinesList: [],
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
      peoplesList,
      groupsList,
      usersList,
      pondLeadsList,
      pipelinesList,
      isHtmlsList,
      stagesList,
      typesList
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
              {(field.key === "title" || field.key === "location" ||
               field.key === "first_name" || field.key === "last_name" || field.key === "email" || field.key === "phone" ||
               field.key === "name" || field.key === "subject" || field.key === "price" || field.key === "commission" ||
               field.key === "projected_close_date" || field.key === "start" || field.key === "end" 
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


              {(field.key === "description" || field.key === "body") && (
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

              {(field.key === "people" || field.key === "person") && (
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
                    options={peoplesList}
                    value={
                      savedFields[field.key]
                        ? peoplesList.find(
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

             
            {field.key === "group" && (
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
                    options={groupsList}
                    value={
                      savedFields[field.key]
                        ? groupsList.find(
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

              {field.key === "pond_lead" && (
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
                    options={pondLeadsList}
                    value={
                      savedFields[field.key]
                        ? pondLeadsList.find(
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

              {(field.key === "user" || field.key === "team_member") && (
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
                    value={
                      savedFields[field.key]
                        ? usersList.find(
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

            {field.key === "is_html" && (
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
                    options={isHtmlsList}
                    value={
                      savedFields[field.key]
                        ? isHtmlsList.find(
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

             {field.key === "stage" && (
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
                    options={stagesList}
                    value={
                      savedFields[field.key]
                        ? stagesList.find(
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

              {field.key === "pipeline" && (
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
                    options={pipelinesList}
                    value={
                      savedFields[field.key]
                        ? pipelinesList.find(
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
                    options={typesList}
                    value={
                      savedFields[field.key]
                        ? typesList.find(
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

export default FollowUpBossSetup;
