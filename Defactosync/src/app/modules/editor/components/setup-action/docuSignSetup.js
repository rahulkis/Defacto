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
  DocuSign_AUTH_URLS
} from "constants/IntegrationConstant";

class DocuSignSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      tamplateList: [],
      recipientroleList: [],
      errorFound: false,
      selectedTemplateId: '',
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "templateid") &&
        this.state.tamplateList.length === 0
      )
      await this.getTamplateList(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "templateid") &&
        this.state.tamplateList.length === 0
      )
      await this.getTamplateList(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    const { connectionData } = this.props;
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
    if(key === "templateid") {
      this.setState({selectedTemplateId: value});
      this.getRecipientroleList(connectionData, value);
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

  getTamplateList = async (connection) => {
    const { selectedNode, connectionData } = this.props;
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl:
        DocuSign_AUTH_URLS.DOCUSIGN_BASE_URL + DocuSign_AUTH_URLS.GET_TEMPLATE.replace("{AccountID}", connection.memberId)
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {        
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.errorCode) {
              if (parsedResponse.envelopeTemplates && parsedResponse.envelopeTemplates.length > 0 ) {
                const savedFields = {};
                selectedNode.fields.forEach((fld) => {
                  savedFields[fld.key] = { ...fld };
                });
                const tamplateListData = parsedResponse.envelopeTemplates.map((item) => {
                  if(Object.keys(savedFields).length > 0 && savedFields.templateid.value === item.templateId) {
                    this.getRecipientroleList(connectionData, item.templateId)
                  }
                  return {
                    value: item.templateId,
                    label: item.name,
                  };
                });
                this.setState({
                  tamplateList: tamplateListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  tamplateList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                tamplateList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getRecipientroleList = async (connection, templateId) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl:
        DocuSign_AUTH_URLS.DOCUSIGN_BASE_URL + DocuSign_AUTH_URLS.GET_RECIPIENT.replace("{AccountID}", connection.memberId).
        replace("{templateId}", templateId),
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.errorCode) {
              if (parsedResponse.agents.length > 0) {
                const recipientroleListData = parsedResponse.agents.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.carbonCopies.length > 0) {
                const recipientroleListData = parsedResponse.carbonCopies.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.certifiedDeliveries.length > 0) {
                const recipientroleListData = parsedResponse.certifiedDeliveries.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.editors.length > 0) {
                const recipientroleListData = parsedResponse.editors.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.inPersonSigners.length > 0) {
                const recipientroleListData = parsedResponse.inPersonSigners.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.intermediaries.length > 0) {
                const recipientroleListData = parsedResponse.intermediaries.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.notaries.length > 0) {
                const recipientroleListData = parsedResponse.notaries.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.seals.length > 0) {
                const recipientroleListData = parsedResponse.seals.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.signers.length > 0) {
                const recipientroleListData = parsedResponse.signers.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              else if(parsedResponse.witnesses.length > 0) {
                const recipientroleListData = parsedResponse.witnesses.map((role) => {
                  return {
                    value: role.recipientId,
                    label: role.roleName,
                  };
                });
                this.setState({
                  recipientroleList: recipientroleListData,
                  isLoading: false,
                });
              }
              } else {
                this.setState({
                    recipientroleList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                recipientroleList: [],
                isLoading: false,
              });
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
      tamplateList,
      recipientroleList,
    } = this.state;
    console.log(tamplateList, "tamplateList")
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });

    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              
              {(field.key === "templateid") && (
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
                    options={tamplateList}
                    value={
                      savedFields[field.key]
                        ? tamplateList.find(
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


            {(field.key === "emailsubject" || 
            field.key === "emailblurb" || 
            field.key === "recipientemail" ||
            field.key === "recipientname"
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

             {field.key === "recipientrole" && (
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
                    options={recipientroleList}
                    value={
                      savedFields[field.key]
                        ? recipientroleList.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.label, field.key)
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

export default DocuSignSetup;
