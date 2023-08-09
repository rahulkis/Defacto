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
  GOOGLE_DRIVE_AUTH_URLS,
} from "constants/IntegrationConstant";

class GoogleDriveSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      errorFound: false,
      folders: [],
      includeDeleteOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      driveOptions: [
        { value: "mydrive", label: "My Google Drive" }
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {

      if (
        fields.find((field) => field.key === "folder") &&
        this.state.folders.length === 0
      )
        await this.getFolders(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {

      if (
        fields.find((field) => field.key === "folder") &&
        this.state.folders.length === 0
      )
        await this.getFolders(connectionData);
    }
  };

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }


  // get folders
  getFolders = async (connection) => {
    this.setState({
      isLoading: true
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
                const folderData = parsedResponse.items.filter(x => (x.parents.length && x.parents[0].isRoot === true && x.labels.trashed === false)).map((folder) => {
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
    const { isLoading, folders, includeDeleteOptions, driveOptions } = this.state;
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
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
                    options={includeDeleteOptions}
                    value={
                      savedFields[field.key]
                        ? includeDeleteOptions.find(
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
})(GoogleDriveSetup);
