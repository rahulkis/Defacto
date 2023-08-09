import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, arrayToObj } from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  DROPBOX_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";

class DropBoxSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      fieldsList: [],
      folderlist: [],
      boolTypeListOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      errorFound: false,
    };
  }

  componentWillMount() {
    console.log("componentWillMount", this.props);
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "directory") &&
        this.state.folderlist.length === 0
      )
        this.folderList(connectionData);
    }
  }

  componentWillReceiveProps() {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "directory") &&
        this.state.folderlist.length === 0
      )
        this.folderList(connectionData);
    }
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
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
        include_has_explicit_shared_members: true,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        limit: 2000,
      },
    };   
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
                  return { ...item, value: item.path_display, label: item.name };
                });               
                this.setState({ folderlist: folderResult});
              }
            }
            this.setState({isLoading: false});
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

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const { isLoading, boolTypeListOptions, folderlist } = this.state;
    console.log("folderlist", folderlist);

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
                      options={folderlist}
                      value={
                        savedFields[field.key]
                          ? folderlist.find(
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
})(DropBoxSetup);
