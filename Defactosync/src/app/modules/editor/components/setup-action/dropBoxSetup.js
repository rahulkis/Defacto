import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster, arrayToObj } from "appUtility/commonFunction";
import {
  DROPBOX_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";

class DropBoxSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      folderList: [],
      fileList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      successOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      visibilityOptions: [
        { value: "public", label: "Public" },
        { value: "team_only", label: "Team Only" },
        { value: "password", label: "Password" },
      ],
    };
  }

  componentWillMount() {
    console.log("componentWillMount", this.props);
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "directory") &&
        this.state.folderList.length === 0
      )
        this.folderList(connectionData);
      if (
        fields.find((field) => field.key === "file_path") &&
        this.state.fileList.length === 0
      )
        this.fileList(connectionData);
    }
  }

  componentWillReceiveProps() {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "directory") &&
        this.state.folderList.length === 0
      )
        this.folderList(connectionData);
      if (
        fields.find((field) => field.key === "file_path") &&
        this.state.fileList.length === 0
      )
        this.fileList(connectionData);
    }
  }

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue(value, key) {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
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

  folderList = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        "Content-Type": "application/json",
      },
      APIUrl: DROPBOX_AUTH_URLS.GET_FOLDER_AND_FILE_LIST,
      bodyInfo: {
        path: "",
        recursive: true,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        limit: 2000,
      },
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {         
          if (result.status === 200) {
            let folderResult;            
            if (result.data.res.entries.length > 0) {
              let tagCol = ".tag";
              folderResult = result.data.res.entries.filter(
                (p) => p[tagCol] === "folder"
              );

              if (folderResult.length > 0) {
                folderResult = arrayToObj(folderResult, function(item) {
                  return {
                    ...item,
                    value: item.path_display,
                    label: item.name,
                  };
                });
                this.setState({ folderList: folderResult, isLoading: false });
              }
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  fileList = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connectionData.tokenInfo.access_token}`,
        "Content-Type": "application/json",
      },
      APIUrl: DROPBOX_AUTH_URLS.GET_FOLDER_AND_FILE_LIST,
      bodyInfo: {
        path: "",
        recursive: true,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        limit: 2000,
      },
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.POST_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            let fileResult;
            if (result.data.res.entries.length > 0) {
              let tagCol = ".tag";
              fileResult = result.data.res.entries.filter(
                (p) => p[tagCol] === "file"
              );            
              if (fileResult.length > 0) {
                fileResult = arrayToObj(fileResult, function(item) {
                  return {
                    ...item,
                    value: item.path_display,
                    label: item.name,
                  };
                });
                this.setState({ fileList: fileResult, isLoading: false });
              }
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
      boolTypeListOptions,
      folderList,
      isLoading,
      fileList,
      successOptions,
      visibilityOptions,
    } = this.state;
    console.log(fields);

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });  
    
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {(field.key === "name" || field.key === "path") && (
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

              {field.key === "file" && (
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

              {field.key === "file_path" && (
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
                    options={fileList}
                    value={
                      savedFields[field.key]
                        ? fileList.find(
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

              {field.key === "directory" && (
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
                    options={folderList}
                    value={
                      savedFields[field.key]
                        ? folderList.find(
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

              {field.key === "settings__requested_visibility" && (
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

              {field.key === "include_deleted" && (
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

              {field.key === "include_file_contents" && (
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

              {field.key === "_echo_search_success_on_miss" && (
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
                    options={successOptions}
                    value={
                      savedFields[field.key]
                        ? successOptions.find(
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

export default DropBoxSetup;
