import React from "react";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import ReactJson from "react-json-view";
import {
  showErrorToaster,
  cleanObject, authenticateUser
} from "appUtility/commonFunction";

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
  CLICKSEND_WEBHOOK_URLS,
} from "constants/AppConst";

class ClickSendActionTest extends React.Component {
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
        };
        this.props.loaderOnSelectEvent(true);
        httpClient
          .post(CLICKSEND_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              let response = res.data.data.responseInfo;
              this.setState({
                actionTestInfo: response,
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
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other.key === current.key;
        }).length === 0
      );
    };
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
      let file = "";
      let Url = true;
      let apiUrl =
        item.connectionData.endPoint + item.selectedNode.selectedEvent.apiUrl;
      let methodType = item.selectedNode.selectedEvent.apiType;

      if (item.selectedNode.selectedEventName === "create_contact_list") {
        bodyInfo = {
          "list_name": bodyInfo.list_name
        }
      }

      if (item.selectedNode.selectedEventName === "delete_contact_list") {
        apiUrl = apiUrl.replace("{list_id}", bodyInfo.contact_list_id);
      }

      if (item.selectedNode.selectedEventName === "delete_contact") {
        apiUrl = apiUrl.replace("{list_id}", bodyInfo.list_id).replace("{contact_id}", bodyInfo.contact_id);
      }

      if (item.selectedNode.selectedEventName === "search_contact_lists") {
        apiUrl = apiUrl.replace("{name}", bodyInfo.list_name);
      }

      if (item.selectedNode.selectedEventName === "create_contact") {
        apiUrl = apiUrl.replace("{list_id}", bodyInfo.list_id);
        bodyInfo = {
          "custom_1": bodyInfo.custom_1,
          "custom_3": bodyInfo.custom_3,
          "address_postal_code": bodyInfo.address_postal_code,
          "custom_2": bodyInfo.custom_2,
          "address_country": bodyInfo.address_country,
          "custom_4": bodyInfo.custom_4,
          "address_state": bodyInfo.address_state,
          "last_name": bodyInfo.last_name,
          "organization_name": bodyInfo.organization_name,
          "fax_number": bodyInfo.fax_number,
          "address_city": bodyInfo.address_city,
          "address_line_1": bodyInfo.address_line_1,
          "phone_number": bodyInfo.phone_number,
          "address_line_2": bodyInfo.address_line_2,
          "first_name": bodyInfo.first_name,
          "email": bodyInfo.email
        }
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "send_fax") {
        bodyInfo = {
          "file_url": bodyInfo.file_url,
          "messages": [
            {
              "to": bodyInfo.to,
              "from": bodyInfo.from,
              "custom_string": bodyInfo.custom_string
            }
          ]
        }
        cleanObject(bodyInfo.messages[0]);
      }

      if (item.selectedNode.selectedEventName === "send_postcard") {
        file = bodyInfo.file_urls;
        bodyInfo = {
          file_urls: bodyInfo.file_urls,
          uploadType: "postcard",
          address_name: bodyInfo.address_name,
          address_line_1: bodyInfo.address_line_1,
          address_line_2: bodyInfo.address_line_2,
          address_city: bodyInfo.address_city,
          address_state: bodyInfo.address_state,
          address_postal_code: bodyInfo.address_postal_code,
          address_country: bodyInfo.address_country,
          return_address_id: bodyInfo.return_address_id,
          custom_string: bodyInfo.custom_string,
        };
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "send_sms") {
        bodyInfo = {
          "messages": [
            {
              "source": "javascript",
              "body": bodyInfo.body,
              "to": bodyInfo.to,
              "schedule": bodyInfo.schedule,
              "from": bodyInfo.from,
              "custom_string": bodyInfo.custom_string,
              "contact_id": bodyInfo.contact_id
            }
          ]
        }
        cleanObject(bodyInfo.messages[0]);
      }

      if (item.selectedNode.selectedEventName === "send_mms") {
        file = bodyInfo.media_file;
        bodyInfo = {
          "file_urls": bodyInfo.media_file,
          "uploadType": "mms",
          "source": "javascript",
          "subject": bodyInfo.subject,
          "from": bodyInfo.from,
          "body": bodyInfo.body,
          "to": bodyInfo.to,
          "schedule": bodyInfo.schedule,
          "custom_string": bodyInfo.custom_string,
        };
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "send_voice") {
        bodyInfo = {
          "messages": [
            {
              "source": "javascript",
              "body": bodyInfo.body,
              "to": bodyInfo.to,
              "lang": bodyInfo.lang,
              "voice": bodyInfo.voice,
              "schedule": bodyInfo.schedule,
              "custom_string": bodyInfo.custom_string,
              "from": bodyInfo.from
            }
          ]
        }
        cleanObject(bodyInfo.messages[0]);
      }

      if (item.selectedNode.selectedEventName === "send_letter") {
        file = bodyInfo.file_url;
        bodyInfo = {
          "file_urls": bodyInfo.file_url,
          "template_used": bodyInfo.template_used,
          "colour": bodyInfo.colour,
          "duplex": bodyInfo.duplex,
          "uploadType": "post",
          "priority_post": bodyInfo.priority_post,
          "address_name": bodyInfo.address_name,
          "address_line_1": bodyInfo.address_line_1,
          "address_line_2": bodyInfo.address_line_2,
          "address_city": bodyInfo.address_city,
          "address_state": bodyInfo.address_state,
          "address_postal_code": bodyInfo.address_postal_code,
          "address_country": bodyInfo.address_country,
          "return_address_id": bodyInfo.return_address_id,
          "custom_string": bodyInfo.custom_string,
          "schedule": bodyInfo.schedule
        }
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "send_sms_to_contact_list") {
        bodyInfo = {
          "messages": [
            {
              "source": "javascript",
              "body": bodyInfo.body,
              "schedule": bodyInfo.schedule,
              "from": bodyInfo.from,
              "custom_string": bodyInfo.custom_string,
              "list_id": bodyInfo.list_id
            }
          ]
        }
        cleanObject(bodyInfo.messages[0]);
      }

      if (item.selectedNode.selectedEventName === "search_contact_by_phone") {
        apiUrl = apiUrl.replace("{list_id}", bodyInfo.list_id).replace("{fax_number}", bodyInfo.phone_number);
      }

      if (item.selectedNode.selectedEventName === "search_contact_by_email") {
        apiUrl = apiUrl.replace("{list_id}", bodyInfo.list_id).replace("{email}", bodyInfo.email_address);
      }

      if (file !== "") {
        if (item.selectedNode.selectedEventName === "send_mms") {
          Url = file.match(/\.(jpeg|jpg|gif|png|bmp)$/) != null;
        }
        if (item.selectedNode.selectedEventName === "send_postcard" || item.selectedNode.selectedEventName === "send_letter") {
          Url = file.match(/\.(pdf)$/) != null;
        }
      }
      if (Url) {
        const body = {
          headerValue: {
            Authorization: authenticateUser(item.connectionData.email, item.connectionData.token),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          methodType: methodType,
          apiUrl: apiUrl,
          commonInfo: item.selectedNode.commonInfo,
          nodeId: item.selectedNode.id,
          cliType: item.selectedNode.selectedCLI,
          eventType: item.selectedNode.selectedEventName,
          bodyInfo: bodyInfo,
        };

        this.props.loaderOnSelectEvent(true);
        try {
          httpClient
            .post(CLICKSEND_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
            .then((res) => {
              if (res.data.statusCode === 200) {
                if (!res.data.responseBody.errorMessage) {
                  let response = res.data;

                  this.setState({
                    actionTestInfo: response,
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
      }
      else {
        this.setState({
          isTestInfo: true,
          isTested: false,
        });
        ToastsStore.error("Attached Url is not valid!");
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
})(ClickSendActionTest);
