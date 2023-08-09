import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  AUTH_INTEGRATION,
  Mailerlite_AUTH_URLS,
} from "constants/IntegrationConstant";

class MalerliteSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      groupList:[],
      webformList:[],
      boolTypeListOptions: [ 
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      errorFound: false,
    };
  }

  componentWillMount=async()=> {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "group_id") &&
        this.state.groupList.length === 0
      )
        await this.getGroupList(connectionData);
        if (
          fields.find((field) => field.key === "webform_id") &&
          this.state.webformList.length === 0
        )
          await this.getWebFormList(connectionData);
        
    }

  }

  componentWillReceiveProps=async()=> {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "group_id") &&
        this.state.groupList.length === 0
      )
        await this.getGroupList(connectionData);

        if (
          fields.find((field) => field.key === "webform_id") &&
          this.state.webformList.length === 0
        )
          await this.getWebFormList(connectionData);
    }
  }



  // get groups
  getGroupList= async (connection) => { 
      let formdata = {
        headerValue: {
          "X-MailerLite-ApiKey": connection.token,
          Accept: "application/json",
        },
        APIUrl: Mailerlite_AUTH_URLS.GET_GROUPS,
      };
      try {
        await httpClient
          .post(AUTH_INTEGRATION.GET_API, formdata)
          .then((result) => {           
            const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const groupData = parsedResponse.map((group) => {
              return {
                ...group,
                value: group.id,
                label: group.name,
              };
            });
            this.setState({
              groupList: groupData,
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

  // get webforms
  getWebFormList= async (connection) => { 
    let formdata = {
      headerValue: {
        "X-MailerLite-ApiKey": connection.token,
        Accept: "application/json",
      },
      APIUrl: Mailerlite_AUTH_URLS.GET_WEBFORMS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {         
          const parsedResponse = JSON.parse(result.data.res);
        if (result.status === 200) {
          const formData = parsedResponse.map((form) => {
            return {
              ...form,
              value: form.id,
              label: form.name,
            };
          });
          this.setState({
            webformList: formData,
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



  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  };

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

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const { isLoading ,groupList,webformList} = this.state;
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
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
                      options={groupList}
                      value={
                        savedFields[field.key]
                          ? groupList.find(
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
              {field.key === "webform_id" && (
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
                      options={webformList}
                      value={
                        savedFields[field.key]
                          ? webformList.find(
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

              {field.key === "automation_id" && (
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
                    //   options={folderlist}
                    //   value={
                    //     savedFields[field.key]
                    //       ? folderlist.find(
                    //           (val) =>
                    //             val.value === savedFields[field.key].value
                    //         )
                    //       : ""
                    //   }
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
                {!isRefreshinFields && <span>Refresh fields</span>}
                {isRefreshinFields && <span>Refreshing fields...</span>}
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

const mapStateToProps = ({ echo }) => {
  const { loader, selectedEcho } = echo;
  return { loader, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
})(MalerliteSetup);
