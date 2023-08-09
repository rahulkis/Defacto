import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";

import {
  ACTIVECAMPAIGN_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class ActiveCampaignSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      fieldsList: [],
      accountList: [],
      subscriberList: [],
      dealList: [],
      eventList: [],
      pipeLineList: [],
      stageList: [],
      ownerList: [],
      contactList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      statusOptions: [
        { value: "0", label: "Open" },
        { value: "1", label: "Won" },
        { value: "2", label: "Lost" },
      ],
    };
  }

  componentWillMount = async () => {   
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "id") &&
        this.state.accountList.length === 0
      ) {
        await this.getAccountList(connectionData);
      }
      if (
        fields.find((field) => field.key === "dealid") &&
        this.state.dealList.length === 0
      ) {
        await this.getDealsList(connectionData);
      }
      if (
        fields.find((field) => field.key === "list_id") &&
        this.state.subscriberList.length === 0
      ) {
        await this.getList(connectionData);
      }
      if (
        fields.find((field) => field.key === "event_name") &&
        this.state.eventList.length === 0
      ) {
        await this.getEventList(connectionData);
      }

      if (
        fields.find((field) => field.key === "pipeline") &&
        this.state.pipeLineList.length === 0
      ) {
        await this.getPipelineList(connectionData);
      }
      if (
        fields.find((field) => field.key === "stage") &&
        this.state.stageList.length === 0
      ) {
        await this.getStageList(connectionData);
      }

      if (
        fields.find(
          (field) => field.key === "owner" || field.key === "userid"
        ) &&
        this.state.ownerList.length === 0
      ) {
        await this.getOwnersList(connectionData);
      }

      if (
        fields.find((field) => field.key === "id" && field.label === "Deal") &&
        this.state.dealList.length === 0
      ) {
        await this.getDealsList(connectionData);
      }

      if (
        fields.find(
          (field) => field.key === "id" && field.label === "Contact ID"
        ) &&
        this.state.contactList.length === 0
      ) {
        await this.getContactsist(connectionData);
      }
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "id") &&
        this.state.accountList.length === 0
      ) {      
        await this.getAccountList(connectionData);
      }
      if (
        fields.find((field) => field.key === "dealid") &&
        this.state.dealList.length === 0
      ) {
        await this.getDealsList(connectionData);
      }
      if (
        fields.find((field) => field.key === "list_id") &&
        this.state.subscriberList.length === 0
      ) {
        await this.getList(connectionData);
      }
      if (
        fields.find((field) => field.key === "event_name") &&
        this.state.eventList.length === 0
      ) {
        await this.getEventList(connectionData);
      }
      if (
        fields.find((field) => field.key === "pipeline") &&
        this.state.pipeLineList.length === 0
      ) {
        await this.getPipelineList(connectionData);
      }
      if (
        fields.find((field) => field.key === "stage") &&
        this.state.stageList.length === 0
      ) {
        await this.getStageList(connectionData);
      }
      if (
        fields.find(
          (field) => field.key === "owner" || field.key === "userid"
        ) &&
        this.state.ownerList.length === 0
      ) {
        await this.getOwnersList(connectionData);
      }
      if (
        fields.find((field) => field.key === "id" && field.label === "Deal") &&
        this.state.dealList.length === 0
      ) {
        await this.getDealsList(connectionData);
      }
      if (
        fields.find(
          (field) => field.key === "id" && field.label === "Contact ID"
        ) &&
        this.state.contactList.length === 0
      ) {
        await this.getContactsist(connectionData);
      }
    }
  };

  handleChangeSelectValue(value, key) {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  }

  handlelRefreshFields() {
    this.props.onRefreshFields();
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

  getAccountList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_ACCOUNTS_LIST,
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const accountListData = parsedResponse.accounts.map((account) => {
              return {
                ...account,
                value: account.id,
                label: account.name,
              };
            });
            this.setState({
              accountList: accountListData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getDealsList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_DEALS_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const dealsListData = parsedResponse.deals.map((deal) => {
              return {
                ...deal,
                value: deal.id,
                label: deal.title,
              };
            });
            this.setState({
              dealList: dealsListData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl: connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const listsData = parsedResponse.lists.map((list) => {
              return {
                ...list,
                value: list.id,
                label: list.name,
              };
            });
            this.setState({
              subscriberList: listsData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getEventList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_EVENTS_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);        
          if (result.status === 200) {
            const eventsData = parsedResponse.eventTrackingEvents.map(
              (event) => {
                return {
                  ...event,
                  value: event.name,
                  label: event.name,
                };
              }
            );
            this.setState({
              eventList: eventsData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getPipelineList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_PIPELINE_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {          
          const parsedResponse = JSON.parse(result.data.res);         
          if (result.status === 200) {
            const pipeLineData = parsedResponse.dealGroups.map((dealGroup) => {
              return {
                ...dealGroup,
                value: dealGroup.id,
                label: dealGroup.title,
              };
            });

            this.setState({
              pipeLineList: pipeLineData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getStageList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_STAGES_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {         
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const stageData = parsedResponse.dealStages.map((dealStage) => {
              return {
                ...dealStage,
                value: dealStage.id,
                label: dealStage.title,
              };
            });

            this.setState({
              stageList: stageData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getOwnersList = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_OWNERS_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {        
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const userData = parsedResponse.users.map((user) => {
              return {
                ...user,
                value: user.id,
                label: user.email,
              };
            });

            this.setState({
              ownerList: userData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  getContactsist = async (connectionData) => {
    this.setState({ isLoading: true });
    let formdata = {
      headerValue: {
        "Api-Token": connectionData.token,
        Accept: "application/json",
      },
      APIUrl:
        connectionData.endPoint + ACTIVECAMPAIGN_AUTH_URLS.GET_CONTACTS_LIST,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {        
          const parsedResponse = JSON.parse(result.data.res);       
          if (result.status === 200) {
            const contactData = parsedResponse.contacts.map((contact) => {
              return {
                ...contact,
                value: contact.id,
                label: contact.firstName,
              };
            });

            this.setState({
              contactList: contactData,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;

    const {
      accountList,
      dealList,
      subscriberList,
      boolTypeListOptions,
      statusOptions,
      eventList,
      pipeLineList,
      stageList,
      ownerList,
      contactList,
    } = this.state;

    console.log("fields..........", fields);
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              <div className="row">
                {field.key !== "id" &&
                  field.label !== "Deal" &&
                  field.key !== "status" &&
                  field.key !== "userid" &&
                  field.key !== "owner" &&
                  field.key !== "list_id" &&
                  field.key !== "event_name" &&
                  field.key !== "stage" &&
                  field.key !== "pipeline" &&
                  field.type !== "boolean" &&
                  field.key !== "dealid" && (
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
                          savedFields[field.key]
                            ? savedFields[field.key].value
                            : ""
                        }
                        onBlur={(e) =>
                          this.handleChangeSelectValue(
                            e.target.value,
                            field.key
                          )
                        }
                      />
                      <span
                        className="text-light custome-fields-help-text"
                        dangerouslySetInnerHTML={{
                          __html: field.help_text_html,
                        }}
                      ></span>
                    </div>
                  )}

                {field.key === "dealid" && (
                  <div className="col-md-12 my-2">
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
                      options={dealList}
                      value={
                        savedFields[field.key]
                          ? dealList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}

                {field.key === "id" &&
                  field.label !== "Deal" &&
                  field.label !== "Contact ID" && (
                    <div className="col-md-12 my-2">
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
                        options={accountList}
                        value={
                          savedFields[field.key]
                            ? accountList.find(
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
                        dangerouslySetInnerHTML={{
                          __html: field.help_text_html,
                        }}
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
                )}

                {field.key === "list_id" && (
                  <div className="col-md-12 my-2">
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
                      options={subscriberList}
                      value={
                        savedFields[field.key]
                          ? subscriberList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}
                {field.key === "event_name" && (
                  <div className="col-md-12 my-2">
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
                      options={eventList}
                      value={
                        savedFields[field.key]
                          ? eventList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}
                {field.key === "pipeline" && (
                  <div className="col-md-12 my-2">
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
                      options={pipeLineList}
                      value={
                        savedFields[field.key]
                          ? pipeLineList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}

                {field.key === "stage" && (
                  <div className="col-md-12 my-2">
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
                      options={stageList}
                      value={
                        savedFields[field.key]
                          ? stageList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}
                {(field.key === "owner" || field.key === "userid") && (
                  <div className="col-md-12 my-2">
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
                      options={ownerList}
                      value={
                        savedFields[field.key]
                          ? ownerList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}

                {field.key === "id" && field.label === "Deal" && (
                  <div className="col-md-12 my-2">
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
                      options={dealList}
                      value={
                        savedFields[field.key]
                          ? dealList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}

                {field.key === "id" && field.label === "Contact ID" && (
                  <div className="col-md-12 my-2">
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
                      options={contactList}
                      value={
                        savedFields[field.key]
                          ? contactList.find(
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
                      dangerouslySetInnerHTML={{
                        __html: field.help_text_html,
                      }}
                    ></span>
                  </div>
                )}
              </div>
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
                {!isRefreshinFields && <span>Refresh fields</span>}
                {isRefreshinFields && <span>Refreshing fields...</span>}
              </Button>
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { loader, selectedEcho } = echo;
  return { loader, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
})(ActiveCampaignSetup);
