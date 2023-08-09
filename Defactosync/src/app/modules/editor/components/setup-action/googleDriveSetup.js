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
  GOOGLE_DRIVE_AUTH_URLS,
} from "constants/IntegrationConstant";

class GoogleDriveSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      folders: [],
      files: [],
      folderChanged:false,
      driveOptions: [{ value: "mydrive", label: "My Google Drive" }],
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      fileTypes: [
        { value: "image/", label: "Images(any format)" },
        { value: "video/", label: "Videos(any format)" },
        { value: "audio/", label: "Audio files(any format)" },
        { value: "text/", label: "Documents and text files(any format)" },
        { value: "application/pdf", label: "PDFs" },
        { value: "application/vnd.google-apps.document", label: "Google Docs" },
        {
          value: "application/vnd.google-apps.drawing",
          label: "Google Drawing",
        },
        {
          value: "application/vnd.google-apps.fusiontable",
          label: "Google Fusion Tables",
        },
        {
          value: "application/vnd.google-apps.presentation",
          label: "Google Sheets",
        },
      ],

      sharingOptions: [
        { value: "org_link_edit", label: "Anyone at your organization with the link can edit"},
        { value: "org_link_view", label: "Anyone at your organization with the link can view"},
        { value: "org_link_comment", label: "Anyone at your organization with the link can edit comment"},
        { value: "org_discoverable", label: "Anyone at your organization can find and view"}        
      ],
      errorFound: false,
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;  
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "folder") {
            await this.getFilesByFolder(connectionData, fld.value);
          }
        });
      } 
      if (
        fields.find((field) => field.key === "folder") &&
        this.state.folders.length === 0
      )
        await this.getFolders(connectionData);
     
        if (
          fields.find(
            (field) => (field.key === "file" && field.type === "unicode") || (field.key === "file_id")
          ) &&
          this.state.files.length === 0
        )      
        await this.getFiles(connectionData,"file");

        if (
          fields.find(
            (field) => (field.key === "old_file")
          ) &&
          this.state.files.length === 0 && !this.state.folderChanged
        )      
        await this.getFiles(connectionData,"old_file");
    }
  };

  componentWillReceiveProps = async () => {   
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "folder") {
            await this.getFilesByFolder(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "folder") &&
        this.state.folders.length === 0
      )
        await this.getFolders(connectionData);

      if (
        fields.find(
          (field) => (field.key === "file" && field.type === "unicode") || (field.key === "file_id")
        ) &&
        this.state.files.length === 0
      )      
        await this.getFiles(connectionData);


        if (
          fields.find(
            (field) => (field.key === "old_file")
          ) &&
          this.state.files.length === 0 && !this.state.folderChanged
        )      
          await this.getFiles(connectionData);
    }
  };

  // get folders
  getFolders = async (connection) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOOGLE_DRIVE_AUTH_URLS.GET_FOLDERS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.items.length) {
                const folderData = parsedResponse.items
                  .filter(
                    (x) =>
                    x.parents.length&&x.parents[0].isRoot === true && x.labels.trashed === false
                  )
                  .map((folder) => {
                    return {
                      value: folder.id,
                      label: folder.title,
                    };
                  });
                this.setState({
                  folders: folderData,
                  isLoading: false,
                });
              } else {
                this.setState({
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
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get files
  getFiles = async (connection) => {
    this.setState({
      isLoading: true,
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOOGLE_DRIVE_AUTH_URLS.GET_FILES,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {        
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {          
              if (parsedResponse.items.length) {             
                const fileData = parsedResponse.items
                  .filter((x) => x.labels.trashed === false)
                  .map((file) => {
                    let parent=file.parents.length && file.parents[0].isRoot===false?file.parents[0].id:""
                    return {
                      value:  file.id + '##' + parent,
                      label: file.title,
                    };
                  });
                this.setState({
                  files: fileData,
                  isLoading: false,
                });
              } else {
                this.setState({
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
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get files by folder
  getFilesByFolder = async (connection, folder) => {
    this.setState({
      isLoading: true,
      folderChanged:true
    });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOOGLE_DRIVE_AUTH_URLS.GET_FILES,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {           
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.items.length) {               
                const fileData = parsedResponse.items
                  .filter(
                    (x) =>
                      x.labels.trashed === false && (x.parents.length && x.parents[0].id === folder)
                  )
                  .map((file) => {
                    return {
                      value: file.id ,
                      label: file.title,
                    };
                  });
                this.setState({
                  files: fileData,
                  isLoading: false                 
                });
               
              } else {
                this.setState({
                  files:[],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                files:[],
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

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    const { connectionData } = this.props;
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
    if (connectionData) {
      if (key === "folder") {
        await this.getFilesByFolder(connectionData, value);
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      boolTypeListOptions,
      driveOptions,
      folders,
      fileTypes,
      files,
      sharingOptions
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
              {field.key === "folder" && (
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
                    options={folders}
                    value={
                      savedFields[field.key]
                        ? folders.find(
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

              {field.key === "old_file" && (
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
                    options={files}
                    value={
                      savedFields[field.key]
                        ? files.find(
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

              {field.key === "drive" && (
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
                    options={driveOptions}
                    value={
                      savedFields[field.key]
                        ? driveOptions.find(
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


{field.key === "permission" && (
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
                    options={sharingOptions}
                    value={
                      savedFields[field.key]
                        ? sharingOptions.find(
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

              {field.key === "file_types" && (
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
                    options={fileTypes}
                    value={
                      savedFields[field.key]
                        ? fileTypes.find(
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
              {((field.key === "file" && field.type === "unicode")|| (field.key === "file_id")) && (
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
                    options={files}
                    value={
                      savedFields[field.key]
                        ? files.find(
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

              {field.key === "file" && field.type === "text" && (
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

              {(field.key === "title" || field.key === "domain" ||
                field.key === "new_extension" || 
                field.key === "new_name") && (
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

              {field.key === "file" && field.type === "file" && (
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

export default GoogleDriveSetup;
