import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  updateNodesList,
  onChangeNodeApp
} from "actions/index";
import {
  AUTH_INTEGRATION,
  ZOHOCRM_AUTH_URLS,
} from "constants/IntegrationConstant";

class ZohoCrmSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      ids: [],
      relatedIds: [],
      moduleFields: [],
      layoutList: [],
      relatedList: [],
      usersList: [],
      leadsIds: [],
      dynamicFields: [],
      isShowDynamic: false,
      errorFound: false,
      forEnableFields: false,
      selectedModule: "",
      moduleType: "",
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      triggerOptions: [
        { value: "workflow", label: "Workflow" },
        { value: "approval", label: "Approval" },
        { value: "blueprint", label: "Blueprint" },
      ],
      modulesOptions: [
        { value: "Leads", label: "Leads" },
        { value: "Contacts", label: "Contacts" },
        { value: "Accounts", label: "Accounts" },
        { value: "Deals", label: "Deals" },
        { value: "Campaigns", label: "Campaigns" },
        { value: "Events", label: "Meetings" },
        { value: "Tasks", label: "Tasks" },
        { value: "Notes", label: "Notes" },
        { value: "Calls", label: "Calls" },
      ],
      updateModulesOptions: [
        { value: "Leads", label: "Leads" },
        { value: "Contacts", label: "Contacts" },
        { value: "Accounts", label: "Accounts" },
        { value: "Deals", label: "Deals" },
        { value: "Campaigns", label: "Campaigns" },
      ],
    };
  }

  componentWillMount = async () => {

    const { connectionData, selectedNode, fields } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "add_tag"
          ) {
            await this.getIds(connectionData, fld.value);
          }

          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "add_tag"
          ) {
            await this.getIds(connectionData, fld.value);
          }
          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "find_module"
          ) {
            await this.getFields(connectionData, fld.value);
          }
          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "update_module"
          ) {

            await this.getIds(connectionData, fld.value);
            await this.getLayouts(connectionData, fld.value);
            await this.getDynamicFields(connectionData, fld.value);
            await this.getAllUsers(connectionData);
          } else if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "create_module"
          ) {
            await this.getLayouts(connectionData, fld.value);
            await this.getDynamicFields(connectionData, fld.value);
            await this.getAllUsers(connectionData);
            // this.setState({
            //   isShowDynamic: false,
            // });
          } else if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "add_attachment"
          ) {
            await this.getIds(connectionData, fld.value);
          } else if (
            fld.key === "Update_Module" &&
            selectedNode.selectedEventName === "update_related_module"
          ) {
            await this.getIds(connectionData, fld.value);
            await this.getRelatedList(connectionData, fld.value);
          } else if (
            fld.key === "Related_Module" &&
            selectedNode.selectedEventName === "update_related_module"
          ) {
            await this.getRelatedIds(connectionData, fld.value);
          } else if (
            fld.key === "Update_Module" &&
            selectedNode.selectedEventName === "create_update_module"
          ) {
            await this.getLayouts(connectionData, fld.value);
          } else if (
            fld.key === "Layout" &&
            (selectedNode.selectedEventName === "create_module" ||
              selectedNode.selectedEventName === "update_module")
          ) {
            this.setState({
              isShowDynamic: true,
            });
          } else if (
            fld.key === "Parent_Module" &&
            (selectedNode.selectedEventName === "create_module" ||
              selectedNode.selectedEventName === "update_module")
          ) {
            await this.getIds(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "record_id") &&
        this.state.leadsIds.length === 0
      )
        this.getLeadIds(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, selectedNode, fields } = this.props;

    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "add_tag"
          ) {
            await this.getIds(connectionData, fld.value);
          }

          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "add_tag"
          ) {
            await this.getIds(connectionData, fld.value);
          }
          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "find_module"
          ) {
            await this.getFields(connectionData, fld.value);
          }
          if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "update_module"
          ) {

            await this.getIds(connectionData, fld.value);
            await this.getLayouts(connectionData, fld.value);
            await this.getDynamicFields(connectionData, fld.value);
            await this.getAllUsers(connectionData);
          } else if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "create_module"
          ) {
            await this.getLayouts(connectionData, fld.value);
            await this.getDynamicFields(connectionData, fld.value);
            await this.getAllUsers(connectionData);
            // this.setState({
            //   isShowDynamic: false,
            // });
          } else if (
            fld.key === "Module" &&
            selectedNode.selectedEventName === "add_attachment"
          ) {
            await this.getIds(connectionData, fld.value);
          } else if (
            fld.key === "Update_Module" &&
            selectedNode.selectedEventName === "update_related_module"
          ) {
            await this.getIds(connectionData, fld.value);
            await this.getRelatedList(connectionData, fld.value);
          } else if (
            fld.key === "Related_Module" &&
            selectedNode.selectedEventName === "update_related_module"
          ) {
            await this.getRelatedIds(connectionData, fld.value);
          } else if (
            fld.key === "Update_Module" &&
            selectedNode.selectedEventName === "create_update_module"
          ) {
            await this.getLayouts(connectionData, fld.value);
          } else if (
            fld.key === "Layout" &&
            (selectedNode.selectedEventName === "create_module" ||
              selectedNode.selectedEventName === "update_module")
          ) {
            this.setState({
              isShowDynamic: true,
            });
          } else if (
            fld.key === "Parent_Module" &&
            (selectedNode.selectedEventName === "create_module" ||
              selectedNode.selectedEventName === "update_module")
          ) {
            await this.getIds(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "record_id") &&
        this.state.leadsIds.length === 0
      )
        this.getLeadIds(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {

    const { connectionData, selectedNode, nodesList } = this.props;
    if (
      (key === "Module" &&
        (selectedNode.selectedEventName === "update_module" || selectedNode.selectedEventName === "create_module"))
    ) {
      const nodeIndex = nodesList.findIndex((node) => node.id === selectedNode.id);
      const newNodeObj = {
        ...selectedNode,
        fields: []
      };
      nodesList[nodeIndex] = newNodeObj;
      await this.updateFields(nodesList, newNodeObj);
      this.setState({
        isShowDynamic: false,
      });
    }
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
    if (connectionData) {
      if (key === "Module" && selectedNode.selectedEventName === "add_tag") {
        await this.getIds(connectionData, value);
      }
      if (
        key === "Module" &&
        selectedNode.selectedEventName === "find_module"
      ) {
        await this.getFields(connectionData, value);
      }
      if (
        key === "Module" &&
        selectedNode.selectedEventName === "update_module"
      ) {
        await this.getIds(connectionData, value);
        await this.getLayouts(connectionData, value);
        await this.getDynamicFields(connectionData, value);
        await this.getAllUsers(connectionData);
      } else if (
        key === "Module" &&
        selectedNode.selectedEventName === "create_module"
      ) {
        await this.getLayouts(connectionData, value);
        await this.getDynamicFields(connectionData, value);
        await this.getAllUsers(connectionData);
        // this.setState({
        //   isShowDynamic: false,
        // });
      } else if (
        key === "Module" &&
        selectedNode.selectedEventName === "add_attachment"
      ) {
        await this.getIds(connectionData, value);
      } else if (
        key === "Update_Module" &&
        selectedNode.selectedEventName === "update_related_module"
      ) {
        await this.getIds(connectionData, value);
        await this.getRelatedList(connectionData, value);
      } else if (
        key === "Related_Module" &&
        selectedNode.selectedEventName === "update_related_module"
      ) {
        await this.getRelatedIds(connectionData, value);
      } else if (
        key === "Update_Module" &&
        selectedNode.selectedEventName === "create_update_module"
      ) {
        await this.getLayouts(connectionData, value);
      } else if (
        key === "Layout" &&
        (selectedNode.selectedEventName === "create_module" ||
          selectedNode.selectedEventName === "update_module")
      ) {
        this.setState({
          isShowDynamic: true,
        });
      } else if (
        key === "Parent_Module" &&
        (selectedNode.selectedEventName === "create_module" ||
          selectedNode.selectedEventName === "update_module")
      ) {
        await this.getIds(connectionData, value);
      }
    }
  };

  getFields = async (connectionData, moduleName) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.GET_FIELDS.replace("{moduleType}", moduleName),
    };
    //this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.fields.length > 0) {
                const fieldsData = parsedResponse.fields.map((res) => {
                  return {
                    value: res.api_name,
                    label: res.field_label,
                  };
                });
                this.setState({
                  fieldsList: fieldsData,
                  // isLoading: false,
                });
              } else {
                this.setState({
                  fieldsList: [],
                  //  isLoading: false,
                });
              }
            } else {
              this.setState({
                fieldsList: [],
                //isLoading: false,
              });
            }
          }
        });
    } catch (err) {
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

  getRelatedIds = async (connectionData, moduleType) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.GET_IDS.replace("{moduleType}", moduleType),
    };
    //this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const relatedIdData = parsedResponse.data.map((res) => {
                  return {
                    value: res.id,
                    label:
                      moduleType === "Deals"
                        ? res.Deal_Name
                        : moduleType === "Campaigns"
                          ? res.Campaign_Name
                          : moduleType === "Accounts"
                            ? res.Account_Name
                            : moduleType === "Tasks" || moduleType === "Calls"
                              ? res.Subject
                              : moduleType === "Events"
                                ? res.Event_Title
                                : moduleType === "Notes"
                                  ? res.Note_Title
                                    ? res.Note_Title
                                    : res.Note_Content
                                  : res.Full_Name,
                  };
                });
                this.setState({
                  relatedIds: relatedIdData,
                  // isLoading: false,
                });
              } else {
                this.setState({
                  relatedIds: [],
                  //  isLoading: false,
                });
              }
            } else {
              this.setState({
                relatedIds: [],
                //isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getIds = async (connectionData, moduleType) => {

    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.GET_IDS.replace("{moduleType}", moduleType),
    };
    //this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const idData = parsedResponse.data.map((res) => {
                  return {
                    value: res.id,
                    label:
                      moduleType === "Deals"
                        ? res.Deal_Name
                        : moduleType === "Campaigns"
                          ? res.Campaign_Name
                          : moduleType === "Accounts"
                            ? res.Account_Name
                            : moduleType === "Tasks" || moduleType === "Calls"
                              ? res.Subject
                              : moduleType === "Events"
                                ? res.Event_Title
                                : moduleType === "Notes"
                                  ? res.Note_Title
                                    ? res.Note_Title
                                    : res.Note_Content
                                  : res.Full_Name,
                  };
                });
                this.setState({
                  ids: idData,
                  // isLoading: false,
                });
              } else {
                this.setState({
                  ids: [],
                  //  isLoading: false,
                });
              }
            } else {
              this.setState({
                ids: [],
                //isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getRelatedList = async (connectionData, moduleType) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.RELATED_LIST.replace("{module_api_name}", moduleType),
    };
    //this.setState({ isLoading: true });
    try {
      const { updateModulesOptions } = this.state;
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.related_lists.length > 0) {
                const relatedData = parsedResponse.related_lists.map((res) => {
                  return {
                    value: res.api_name,
                    label: res.display_label,
                  };
                });
                this.setState({
                  relatedList: updateModulesOptions.filter((a1) =>
                    relatedData.some((a2) => a1.value === a2.value)
                  ),
                });
              } else {
                this.setState({
                  relatedList: [],
                });
              }
            } else {
              this.setState({
                relatedList: [],
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getLayouts = async (connectionData, moduleType) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.GET_LAYOUTS.replace("{module_api_name}", moduleType),
    };
    //this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.layouts.length > 0) {
                const layoutData = parsedResponse.layouts.map((res) => {
                  return {
                    value: res.id,
                    label: res.name,
                  };
                });
                this.setState({
                  layoutList: layoutData,
                });
              } else {
                this.setState({
                  layoutList: [],
                });
              }
            } else {
              this.setState({
                layoutList: [],
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getAllUsers = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl: ZOHOCRM_AUTH_URLS.BASE_URL + ZOHOCRM_AUTH_URLS.GET_ALL_USERS,
    };
    //this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.users.length > 0) {
                const usersData = parsedResponse.users.map((res) => {
                  return {
                    value: res.id,
                    label: res.first_name + " " + res.last_name,
                  };
                });
                this.setState({
                  usersList: usersData,
                });
              } else {
                this.setState({
                  usersList: [],
                });
              }
            } else {
              this.setState({
                usersList: [],
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getLeadIds = async (connectionData) => {
    
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.GET_IDS.replace("{moduleType}", "Leads"),
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.length > 0) {
                const idData = parsedResponse.data.map((res) => {
                  return {
                    value: res.id,
                    label: res.Full_Name,
                  };
                });
                this.setState({
                  leadsIds: idData,
                  isLoading: false
                });
              } else {
                this.setState({
                  leadsIds: [],
                  isLoading: false
                });
              }
            } else {
              this.setState({
                leadsIds: [],
                isLoading: false
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getDynamicFields = async (connectionData, module) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
      },
      APIUrl:
        ZOHOCRM_AUTH_URLS.BASE_URL +
        ZOHOCRM_AUTH_URLS.GET_FIELDS.replace("{moduleType}", module),
    };
    //this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.fields.length > 0) {
                const dynamicFields = parsedResponse.fields.map((res) => {
                  const picklist = res.pick_list_values.map((pickList) => {
                    return {
                      value: pickList.actual_value,
                      label: pickList.display_value,
                    };
                  });
                  return {
                    id: res.api_name,
                    label: res.display_label,
                    json_type: res.json_type,
                    type: res.data_type,
                    options: picklist,
                    visible: res.visible,
                    required: res.system_mandatory
                  };
                });

                this.setState({
                  dynamicFields: dynamicFields.filter(
                    (x) =>
                      x.visible === true &&
                      x.label !== "Created By" &&
                      x.label !== "Modified By" &&
                      x.label !== "Created Time" &&
                      x.label !== "Modified Time" &&
                      x.label !== "Last Activity Time" &&
                      x.label !== "Unsubscribed Mode" &&
                      x.label !== "Unsubscribed Time" &&
                      x.label !== "Full Name"
                  ),
                  moduleType: module,
                });
                if (module === "Notes") {
                  const parentModule = {
                    required: true,
                    id: "Parent_Module",
                    label: "Parent Module",
                    visible: true,
                    options: this.state.modulesOptions,
                  };
                  this.state.dynamicFields.push(parentModule);
                }
              } else {
                this.setState({
                  dynamicFields: [],
                });
              }
            } else {
              this.setState({
                dynamicFields: [],
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };


  // update fields
  updateFields = async (nodesList, newNodeObj) => {

    let _self = this.props
    return new Promise(async function (resolve, reject) {

      _self.updateNodesList(nodesList);
      _self.onChangeNodeApp(newNodeObj);
      resolve(true);

    });
  };

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      modulesOptions,
      updateModulesOptions,
      triggerOptions,
      ids,
      moduleType,
      leadsIds,
      relatedIds,
      layoutList,
      boolTypeListOptions,
      relatedList,
      fieldsList,
      dynamicFields,
      isShowDynamic,
      usersList,
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
              {field.key === "Module" && (
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
                    options={modulesOptions}
                    value={
                      savedFields[field.key]
                        ? modulesOptions.find(
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

              {field.key === "Update_Module" && (
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
                    options={updateModulesOptions}
                    value={
                      savedFields[field.key]
                        ? updateModulesOptions.find(
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

              {field.key === "field_name" && (
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
                    options={fieldsList}
                    value={
                      savedFields[field.key]
                        ? fieldsList.find(
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
              {(field.key === "value" ||
                field.key === "tag" ||
                field.key === "Accounts" ||
                field.key === "Contacts" ||
                field.key === "file_name" ||
                field.key === "attachment_file" ||
                field.key === "assign_to") && (
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

              {field.key === "Layout" && (
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
                    options={layoutList}
                    value={
                      savedFields[field.key]
                        ? layoutList.find(
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

              {field.key === "id" && (
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
                    options={ids}
                    value={
                      savedFields[field.key]
                        ? ids.find(
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

              {field.key === "trigger" && (
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
                    options={triggerOptions}
                    value={
                      savedFields[field.key]
                        ? triggerOptions.find(
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
              {/* {field.key === "tag" && (
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
                    // options={modulesOptions}
                    // value={
                    //   savedFields[field.key]
                    //     ? modulesOptions.find(
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
              )} */}
              {field.key === "record_id" && (
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
                    options={leadsIds}
                    value={
                      savedFields[field.key]
                        ? leadsIds.find(
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
              {field.key === "notify_lead_owner" && (
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
              {field.key === "notify_new_entity_owner" && (
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
              {field.key === "overwrite" && (
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
              {field.key === "Related_Module" && (
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
                    options={relatedList}
                    value={
                      savedFields[field.key]
                        ? relatedList.find(
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
              {field.key === "Related_id" && (
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
                    options={relatedIds}
                    value={
                      savedFields[field.key]
                        ? relatedIds.find(
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

              {field.key === "duplicate_check_fields" && (
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
                  // options={modulesOptions}
                  // value={
                  //   savedFields[field.key]
                  //     ? modulesOptions.find(
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
            </>
          ))}
          {isShowDynamic &&
            dynamicFields.map((field, index) => {
              return (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    {moduleType === "Events" &&
                      field.label !== "What Id" &&
                      field.label !== "Check In Time" &&
                      field.label !== "Check In By" &&
                      field.label !== "Check In Comment" &&
                      field.label !== "Check In Sub Locality" &&
                      field.label !== "Check In City" &&
                      field.label !== "Check In State" &&
                      field.label !== "Check In Country" &&
                      field.label !== "Latitude" &&
                      field.label !== "Longitude" &&
                      field.label !== "ZIP Code" &&
                      field.label !== "Check In Address" &&
                      field.label !== "Check In Status" && (
                        <label className="text-capitalize">
                          {this.getFieldLabel(field)}
                        </label>
                      )}
                    {moduleType === "Deals" &&
                      field.label !== "Expected Revenue" &&
                      field.label !== "Lead Conversion Time" &&
                      field.label !== "Sales Cycle Duration" &&
                      field.label !== "Overall Sales Duration" && (
                        <label className="text-capitalize">
                          {this.getFieldLabel(field)}
                        </label>
                      )}
                    {moduleType && moduleType === "Leads" && (
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                    )}
                    {moduleType && moduleType === "Contacts" && (
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                    )}
                    {moduleType && moduleType === "Accounts" && (
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                    )}
                    {moduleType &&
                      moduleType === "Campaigns" &&
                      field.label !== "Expected Revenue" && (
                        <label className="text-capitalize">
                          {this.getFieldLabel(field)}
                        </label>
                      )}
                    {moduleType && moduleType === "Notes" && (
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                    )}
                    {/* {moduleType && moduleType === "Leads" || moduleType === "Contacts" || moduleType === "Accounts" || moduleType === "Campaigns" || moduleType === "Notes" && (
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                    )} */}

                    {moduleType === "Tasks" && field.label !== "What Id" && (
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                    )}
                    {moduleType === "Calls" &&
                      field.label !== "What Id" &&
                      field.label !== "Call Status" &&
                      field.label !== "CTI Entry" && (
                        // {moduleType == "Calls" && field.label !== "What Id" && field.label !== "Call Status" && field.label !== "CTI Entry" && field.label !== 'Call Owner' && (
                        <label className="text-capitalize">
                          {this.getFieldLabel(field)}
                        </label>
                      )}
                    {selectedNode.selectedEventName === 'create_module' && field.required &&
                      <span className="ml-1">(required)</span>
                    }
                    {/* {field.required && <span className="ml-1">(required)</span>} */}
                  </div>
                  {field && field.id === "Owner" && (
                    <Select
                      className="w-100"
                      options={usersList}
                      value={
                        savedFields[field.id]
                          ? usersList.find(
                            (val) => val.value === savedFields[field.id].value
                          )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.id)
                      }
                    />
                  )}
                  {field.options.length === 0 &&
                    field.label !== "Email Opt Out" &&
                    field.id !== "Owner" &&
                    field.label !== "What Id" &&
                    field.label !== "Check In Time" &&
                    field.label !== "Check In By" &&
                    field.label !== "Check In Comment" &&
                    field.label !== "Check In Sub Locality" &&
                    field.label !== "Check In City" &&
                    field.label !== "Check In State" &&
                    field.label !== "Check In Country" &&
                    field.label !== "Latitude" &&
                    field.label !== "Longitude" &&
                    field.label !== "ZIP Code" &&
                    field.label !== "Check In Address" &&
                    field.label !== "Check In Status" &&
                    field.label !== "Expected Revenue" &&
                    field.label !== "Lead Conversion Time" &&
                    field.label !== "Sales Cycle Duration" &&
                    field.label !== "Overall Sales Duration" &&
                    field.label !== "Call Status" &&
                    field.label !== "CTI Entry" &&
                    field.label !== "Parent Id" &&
                    field.label !== "Who Id" && (
                      <Input
                        type={field.type}
                        className="w-100"
                        defaultValue={
                          savedFields[field.id]
                            ? savedFields[field.id].value
                            : ""
                        }
                        onBlur={(e) =>
                          this.handleChangeSelectValue(e.target.value, field.id)
                        }
                      />
                    )}
                  {field && field.label === "Email Opt Out" && (
                    <Select
                      className="w-100"
                      options={boolTypeListOptions}
                      value={
                        savedFields[field.id]
                          ? boolTypeListOptions.find(
                            (val) => val.value === savedFields[field.id].value
                          )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.id)
                      }
                    />
                  )}

                  {field.options.length > 0 && (
                    <Select
                      className="w-100"
                      options={field.options}
                      value={
                        savedFields[field.id]
                          ? field.options.find(
                            (val) => val.value === savedFields[field.id].value
                          )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.id)
                      }
                    />
                  )}

                  {field && field.label === "Parent Id" && (
                    <Select
                      className="w-100"
                      options={ids}
                      value={
                        savedFields[field.id]
                          ? ids.find(
                            (val) => val.value === savedFields[field.id].value
                          )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.id)
                      }
                    />
                  )}
                  {field && field.label === "Who Id" && (
                    <Select
                      className="w-100"
                      options={ids}
                      value={
                        savedFields[field.id]
                          ? ids.find(
                            (val) => val.value === savedFields[field.id].value
                          )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.id)
                      }
                    />
                  )}
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              );
            })}
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

//export default ZohoCrmSetup;
const mapStateToProps = ({ echo }) => {
  const { nodesList } = echo;
  return { nodesList };
};

export default connect(mapStateToProps, {
  updateNodesList,
  onChangeNodeApp
})(ZohoCrmSetup);

