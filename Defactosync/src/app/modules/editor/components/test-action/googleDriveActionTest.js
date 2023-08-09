import React from "react";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import ReactJson from "react-json-view";
import { showErrorToaster } from "appUtility/commonFunction";

import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
  loaderOnSelectEvent,
} from "actions/index";
import {
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  GOOGLEDRIVE_WEBHOOK_URLS,
} from "constants/AppConst";

class GoogleDriveActionTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      searchBox: false,
      searchText: "",
      mailNotification: false,
      userInfo: false,
      langSwitcher: false,
      appNotification: false,
      echoState: false,
      editEchoTitle: false,
      isTested: false,
      actionTestInfo: [],
      isTestInfo: false,
      emptyFields: [],
      isError: false,
      filledFields: [],
    };
  }

  componentDidMount() {
    const item = this.props;
    if (item.selectedNode.isConnectionTested) {
      try {
        const body = {
          eventType: item.selectedNode.selectedEvent.value,
          cliType: item.selectedNode.selectedCLI,
          nodeId: item.selectedNode.id,
          commonInfo: item.selectedNode.commonInfo,
          typeOf: item.selectedNode.typeOf,
          googleDriveFolderId: "",
        };
        this.props.loaderOnSelectEvent(true);
        httpClient
          .post(GOOGLEDRIVE_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              this.setState({
                actionTestInfo: res.data.data.responseInfo.body,
                isTested: true,
              });
            } else {
              this.setState({
                isTestInfo: false,
                isTested: false,
              });
            }
            this.props.loaderOnSelectEvent(false);
          })
          .catch((err) => {
            this.props.loaderOnSelectEvent(false);
            showErrorToaster(err);
          });
      } catch (error) {
        this.props.loaderOnSelectEvent(false);
        showErrorToaster(error);
      }
    } else {
      const fields1 = item.fields.filter(
        this.comparer(item.selectedNode.fields)
      );
      const fields2 = item.selectedNode.fields.filter(
        this.comparer(item.fields)
      );
      this.setState({
        emptyFields: fields1.concat(fields2),
        filledFields: item.selectedNode.fields,
      });
    }
  }

  comparer = (otherArray) => {
    return function(current) {
      return (
        otherArray.filter(function(other) {
          return other.key === current.key;
        }).length === 0
      );
    };
  };

  checkRole = (permission) => {
    switch (permission) {
      case "org_link_edit":
        return "writer";
      case "org_link_view":
        return "reader";
      case "org_link_comment":
        return "commenter";
      //case "org_discoverable":
      default:
        return "reader";
      
    }
  };

  handleTestAction = () => {
    const item = this.props;
    if (
      item &&
      item.connectionData.token &&
      item.selectedNode.selectedEvent.apiType !== ""
    ) {
      let bodyInfo = {};
      for (var i = 0; i < item.selectedNode.fields.length; i++) {
        bodyInfo[item.selectedNode.fields[i].key] =
          item.selectedNode.fields[i].value;
      }
      let apiUrl =
        item.connectionData.endPoint + item.selectedNode.selectedEvent.apiUrl;
      let contentType = "application/json";
      let file = "";
      let imageUrl = true;

      if (item.selectedNode.selectedEventName === "find_file") {      
        let query = "";
        if (bodyInfo.folder && bodyInfo.file_types) {
          query = `parents in '${bodyInfo.folder}' and name:'${bodyInfo.title}' and mimeType contains '${bodyInfo.file_types}'`;
        } else if (!bodyInfo.folder && bodyInfo.file_types) {
          query = `name:'${bodyInfo.title}' and mimeType contains '${bodyInfo.file_types}'`;
        } else if (bodyInfo.folder && !bodyInfo.file_types) {
          query = `name:'${bodyInfo.title}' and parents in '${bodyInfo.folder}'`;
        } else {
          query = `name:'${bodyInfo.title}'`;
        }
        apiUrl = apiUrl.replace("{query}", query);
      }
      if (item.selectedNode.selectedEventName === "find_folder") {      
        let query = "";
        if (bodyInfo.folder) {
          query = `parents in '${bodyInfo.folder}' and name:'${bodyInfo.title}'`;
        } else {
          query = `name:'${bodyInfo.title}'`;
        }
        apiUrl = apiUrl.replace("{query}", query);
      }
      if (item.selectedNode.selectedEventName === "create_file") {
        contentType = "multipart/form-data;boundary=287032381131322";
        if (bodyInfo.folder) {
          bodyInfo = `--287032381131322\r\nContent-Type: application/json\r\n\r\n{"name":"${bodyInfo.title}","parents":["${bodyInfo.folder}"],"mimeType":"text/plain"}\r\n--287032381131322\r\nContent-Type: mime/type\r\n\r\n${bodyInfo.file}\r\n--287032381131322--`;
        } else {
          bodyInfo = `--287032381131322\r\nContent-Type: application/json\r\n\r\n{"name":"${bodyInfo.title}","mimeType":"text/plain"}\r\n--287032381131322\r\nContent-Type: mime/type\r\n\r\n${bodyInfo.file}\r\n--287032381131322--`;
        }
      }
      if (item.selectedNode.selectedEventName === "create_folder") {       
        let info = {};
        if (bodyInfo.folder) {
          info = {
            name: bodyInfo.title,
            parents: [bodyInfo.folder],
            mimeType: "application/vnd.google-apps.folder",
          };
        } else {
          info = {
            name: bodyInfo.title,
            mimeType: "application/vnd.google-apps.folder",
          };
        }
        bodyInfo = info;
      }
      if (item.selectedNode.selectedEventName === "copy_file") {    
        let fileInfo = bodyInfo.file.split("##");
        apiUrl = apiUrl.replace("fileId", fileInfo[0]);
        if (bodyInfo.new_name) {
          bodyInfo = {
            parents: [bodyInfo.folder],
            name: bodyInfo.new_name,
          };
        } else {
          bodyInfo = {
            parents: [bodyInfo.folder],
          };
        }
      }
      if (item.selectedNode.selectedEventName === "upload_file") {
        file = bodyInfo.file ? bodyInfo.file : "";
        contentType = "multipart/related;boundary=287032381131322";
        let name = `${bodyInfo.new_name}.${bodyInfo.new_extension}`;
        if (bodyInfo.folder) {
          bodyInfo = `--287032381131322\r\nContent-Type: application/json; charset=utf-8\r\nContent-Disposition: form-data; name="metadata"\r\n\r\n{"name":"${name}","parents":["${bodyInfo.folder}"],"mimeType":"image/png"}\r\n--287032381131322\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: form-data; name="file"\r\n\r\n`;
        } else {
          bodyInfo = `--287032381131322\r\nContent-Type: application/json; charset=utf-8\r\nContent-Disposition: form-data; name="metadata"\r\n\r\n{"name":"${name}","mimeType":"image/png"}\r\n--287032381131322\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: form-data; name="file"\r\n\r\n`;
        }
      }

      if (item.selectedNode.selectedEventName === "replace_file") {
        file = bodyInfo.file ? bodyInfo.file : "";
        contentType = "multipart/related;boundary=287032381131322";
        let name = `${bodyInfo.new_name}.${bodyInfo.new_extension}`;  
        apiUrl = apiUrl.replace("fileId",bodyInfo.old_file.split('##')[0]);

        if (bodyInfo.folder) {
          bodyInfo = `--287032381131322\r\nContent-Type: application/json; charset=utf-8\r\nContent-Disposition: form-data; name="metadata"\r\n\r\n{"name":"${name}","addParents":"${bodyInfo.folder}","mimeType":"image/png"}\r\n--287032381131322\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: form-data; name="file"\r\n\r\n`;
        } else {
          bodyInfo = `--287032381131322\r\nContent-Type: application/json; charset=utf-8\r\nContent-Disposition: form-data; name="metadata"\r\n\r\n{"name":"${name}","mimeType":"image/png"}\r\n--287032381131322\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: form-data; name="file"\r\n\r\n`;
        }
      }

      if (item.selectedNode.selectedEventName === "add_sharing_preference") {
        let fileInfo = bodyInfo.file_id.split("##");
        apiUrl = apiUrl.replace("fileId", fileInfo[0]);   
        let role = this.checkRole(bodyInfo.permission);    
        if (bodyInfo.domain) {
          bodyInfo = {
            type: "anyone",
            role: role,
            domain: bodyInfo.domain,
          };
        } else if (
          bodyInfo.permission === "org_discoverable" &&
          bodyInfo.domain
        ) {
          bodyInfo = {
            type: "anyone",
            role: role,
            domain: bodyInfo.domain,
            allowFileDiscovery: true,
          };
        } else if (
          bodyInfo.permission === "org_discoverable" &&
          !bodyInfo.domain
        ) {
          bodyInfo = {
            type: "anyone",
            role: role,
            allowFileDiscovery: true,
          };
        } else {
          bodyInfo = {
            type: "anyone",
            role: role,
          };
        }    
      }

      if (item.selectedNode.selectedEventName === "move_file") {
        let fileInfo = bodyInfo.file.split("##");
        if (fileInfo[1] !== "") {
          apiUrl = apiUrl
            .replace("{fileId}", fileInfo[0])
            .replace("{addParent}", bodyInfo.folder)
            .replace("{removeParent}", fileInfo[1]);
        } else {
          apiUrl = apiUrl
            .replace("{fileId}", fileInfo[0])
            .replace("{addParent}", bodyInfo.folder)
            .replace("&removeParents={removeParent}", "");
        }
      }

      if (file !== "") {
        imageUrl = file.match(/\.(jpeg|jpg|gif|png)$/) != null;
      }

      if (imageUrl) {
        const body = {
          headerValue: {
            Authorization: `Bearer ${item.connectionData.tokenInfo.access_token}`,
            "Content-Type": contentType,
          },
          methodType: item.selectedNode.selectedEvent.apiType,
          apiUrl: apiUrl,
          commonInfo: item.selectedNode.commonInfo,
          nodeId: item.selectedNode.id,
          attachmentURL: file,
          cliType: item.selectedNode.selectedCLI,
          eventType: item.selectedNode.selectedEventName,
          bodyInfo: bodyInfo,
        };     
        this.props.loaderOnSelectEvent(true);
        try {
          httpClient
            .post(GOOGLEDRIVE_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
            .then((res) => {
              if (res.data.statusCode === 200) {
                if (!res.data.responseBody.errorMessage) {
                  this.setState({
                    actionTestInfo:
                      res.data.responseBody !== ""
                        ? res.data.responseBody
                        : { message: "success" },
                    isTested: true,
                  });
                  this.props.onConnectionTested();
                } else {
                  ToastsStore.error(res.data.responseBody.errorMessage);
                }
                this.props.loaderOnSelectEvent(false);
              }
            })
            .catch((err) => {
              if (err.response) {
                if (err.response.data) {
                  if (err.response.data.statusCode === 400) {
                    this.setState({
                      actionTestInfo: err.response.data.responseBody,
                      isTested: true,
                      isError: true,
                    });
                  }
                }
              } else {
                showErrorToaster(err);
              }
              this.props.loaderOnSelectEvent(false);
            });
        } catch (error) {
          this.props.loaderOnSelectEvent(false);
          showErrorToaster(error);
        }
      } else {
        this.setState({
          isTestInfo: true,
          isTested: false,
        });
        ToastsStore.error("Attached Url is not valid Image!");
      }
    } else {
      this.setState({
        isTestInfo: true,
        isTested: false,
      });
    }
  };

  generateQuery = (obj) => {
    let query = "";
    for (const [key, value] of Object.entries(obj)) {
      query += `${key}:${value} AND `;
    }
    return query;
  };

  render() {
    const {
      selectedNode,
      nodesList,
      allApps,
      showEventLoader,
      activeStep,
    } = this.props;
    const {
      actionTestInfo,
      isTested,
      isTestInfo,
      filledFields,
      emptyFields,
      isError,
    } = this.state;
    const nodeItem = nodesList.find((node) => node.id === selectedNode.id);

    let selectedCLI = allApps.find(
      (app) => app.cliName === nodeItem.selectedCLI
    );
    return (
      <>
        {!nodeItem.isConnectionTested && !isTested && !isTestInfo && (
          <>
            <div className="d-flex mb-4">
              <img
                className="header-app-icon"
                src={
                  APP_IMAGE_URL +
                  IMAGE_FOLDER.APP_IMAGES +
                  selectedCLI.imageName
                }
                alt="syncImage"
                style={{
                  height: "60px",
                  width: "60px",
                }}
              />
              <div alt="syncImage" className="mt-2">
                <ArrowForwardIcon
                  color="primary"
                  style={{
                    fontSize: "45px",
                  }}
                />
              </div>
              <div alt="syncImage">
                <SettingsIcon
                  color="primary"
                  style={{
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    height: "60px",
                    width: "60px",
                  }}
                />
              </div>
              <div className="ml-3">
                <div className="pt-2" style={{ fontSize: "22px" }}>
                  {nodeItem.title}
                </div>
                <div> This is what will be created:</div>
              </div>
            </div>

            <div className="text-center">
              <div className="test-trigger-content">
                {filledFields.length > 0 &&
                  filledFields.map((info) => (
                    <div key={info.key} className="d-flex">
                      <h4 style={{ textTransform: "capitalize" }}>
                        {info.key}
                      </h4>
                      <p>:{info.value}</p>
                    </div>
                  ))}

                {emptyFields.length > 0 &&
                  emptyFields.map((info) => (
                    <div className="d-flex">
                      <h4>{info.label ? info.label : info.key}</h4>
                      <p>:{info.value}</p>
                    </div>
                  ))}
              </div>

              <div className="row">
                <div className="col-md-6">
                  {/* <Button variant="contained" color="primary" disabled={true}>
                    Test & Review
                  </Button> */}
                </div>
                <div className="col-md-6">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !nodesList[
                        nodesList.findIndex(
                          (node) => node.id === selectedNode.id
                        ) - 1
                      ].isConnectionTested
                    }
                    onClick={this.handleTestAction}
                  >
                    Test & Continue
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        {isTestInfo && (
          <div className="mt-4 test-trigger-content">
            <h4>No Information available!</h4>
          </div>
        )}

        {isTested && (
          <>
            <div className="d-flex mb-4">
              <img
                className="header-app-icon"
                src={
                  APP_IMAGE_URL +
                  IMAGE_FOLDER.APP_IMAGES +
                  selectedCLI.imageName
                }
                alt="syncImage"
                style={{
                  height: "60px",
                  width: "60px",
                }}
              />
              <div alt="syncImage" className="mt-2">
                <ArrowForwardIcon
                  color="primary"
                  style={{
                    fontSize: "45px",
                  }}
                />
              </div>
              <div alt="syncImage">
                <SettingsIcon
                  color="primary"
                  style={{
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    height: "60px",
                    width: "60px",
                  }}
                />
              </div>
              <div className="ml-3">
                <div className="pt-2" style={{ fontSize: "22px" }}>
                  {!isError
                    ? "Test was successfull!"
                    : "Test was not successfull!"}
                </div>
                <div>
                  {" "}
                  We’ll use this as a sample for setting up the rest of your
                  Echo.
                </div>
              </div>
            </div>

            <div
              className="mt-4 test-trigger-content"
              style={{ maxHeight: "500px", overflow: "auto" }}
            >
              <ReactJson
                src={actionTestInfo}
                displayDataTypes={false}
                enableClipboard={false}
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              />
            </div>
          </>
        )}

        <div className="mt-3">
          {showEventLoader && (
            <div className=" m-3">
              <LinearProgress color="primary" />
            </div>
          )}
          <div>
            <Button
              disabled={activeStep === 0}
              onClick={this.props.handleBack}
              className="jr-btn"
            >
              Back
            </Button>
            <Button
              disabled={!isTested}
              variant="contained"
              color="primary"
              onClick={this.props.handleNext}
              className="jr-btn"
            >
              {activeStep === 3 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ echo, apps }) => {
  const { loader, selectedEcho, nodesList, showEventLoader } = echo;
  const { allApps } = apps;
  return { loader, selectedEcho, allApps, nodesList, showEventLoader };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
  loaderOnSelectEvent,
})(GoogleDriveActionTest);
