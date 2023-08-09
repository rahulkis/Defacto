import React from "react";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import ReactJson from "react-json-view";
import { showErrorToaster, cleanObject } from "appUtility/commonFunction";

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
  MAILCHIMP_WEBHOOK_URLS,
} from "constants/AppConst";

class MailChimpActionTest extends React.Component {
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
          .post(MAILCHIMP_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              this.setState({
                actionTestInfo:
                  res.data.data.responseInfo.body !== ""
                    ? res.data.data.responseInfo.body
                    : { message: "success" },
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
      if (item.selectedNode.selectedEventName === "add_note_to_subscriber") {
        apiUrl = apiUrl
          .replace("{list_id}", bodyInfo.list_id)
          .replace("{subscriber_hash}", bodyInfo.email.toLowerCase());
        bodyInfo = {
          note: bodyInfo.note,
        };
      }

      if (item.selectedNode.selectedEventName === "find_a_subscriber") {
        if (bodyInfo.list) {
          apiUrl = apiUrl
            .replace("{list_id}", bodyInfo.list)
            .replace("{query}", bodyInfo.query);
        } else {
          apiUrl = apiUrl
            .replace("list_id={list_id}&", "")
            .replace("{query}", bodyInfo.query);
        }
      }
      if (item.selectedNode.selectedEventName === "find_a_campaign") {
        apiUrl = apiUrl.replace("{query}", bodyInfo.query);
      }

      if (item.selectedNode.selectedEventName === "create_custom_event") {
        apiUrl = apiUrl
          .replace("{list_id}", bodyInfo.list_id)
          .replace("{subscriber_hash}", bodyInfo.email.toLowerCase());
        bodyInfo = {
          name: bodyInfo.name,
        };
      }

      if (item.selectedNode.selectedEventName === "send_campaign") {
        apiUrl = apiUrl.replace("{campaign_id}", bodyInfo.campaign_id);
      }

      if (item.selectedNode.selectedEventName === "create_campaign") {
        bodyInfo = {
          type: "regular",
          recipients: {
            list_id: bodyInfo.list_id,
            segment_opts: {
              saved_segment_id: bodyInfo.segment_id ? bodyInfo.segment_id : 0,
            },
          },
          settings: {
            subject_line: bodyInfo.subject_line ? bodyInfo.subject_line : "",
            preview_text: bodyInfo.preview_text ? bodyInfo.preview_text : "",
            title: bodyInfo.title ? bodyInfo.title : "",
            from_name: bodyInfo.from_name ? bodyInfo.from_name : "",
            reply_to: bodyInfo.reply_to ? bodyInfo.reply_to : "",
            to_name: bodyInfo.to_name ? bodyInfo.to_name : "",
            template_id: bodyInfo.template_id ? bodyInfo.template_id : 0,
          },
        };
      }

      if (
        item.selectedNode.selectedEventName === "add_subscriber_to_tag" ||
        item.selectedNode.selectedEventName === "remove_subscriber_from_tag"
      ) {
        apiUrl = apiUrl
          .replace("{list_id}", bodyInfo.list_id)
          .replace("{subscriber_hash}", bodyInfo.email.toLowerCase());
        bodyInfo = {
          tags: [
            {
              name: bodyInfo.segment_id,
              status:
                item.selectedNode.selectedEventName === "add_subscriber_to_tag"
                  ? "active"
                  : "inactive",
            },
          ],
          is_syncing: true,
        };
      }

      if (item.selectedNode.selectedEventName === "add_subscriber") {
        apiUrl = apiUrl.replace("{list_id}", bodyInfo.list_id);
        bodyInfo = {
          email_address: bodyInfo.email,
          status: "subscribed",
          merge_fields: {
            FNAME: bodyInfo.merges__FNAME ? bodyInfo.merges__FNAME : "",
            LNAME: bodyInfo.merges__LNAME ? bodyInfo.merges__LNAME : "",
            ADDRESS: {
              addr1: bodyInfo.merges__ADDRESS__addr1
                ? bodyInfo.merges__ADDRESS__addr1
                : "",
              addr2: bodyInfo.merges__ADDRESS__addr2
                ? bodyInfo.merges__ADDRESS__addr2
                : "",
              city: bodyInfo.merges__ADDRESS__city
                ? bodyInfo.merges__ADDRESS__city
                : "",
              state: bodyInfo.merges__ADDRESS__state
                ? bodyInfo.merges__ADDRESS__state
                : "",
              zip: bodyInfo.merges__ADDRESS__zip
                ? bodyInfo.merges__ADDRESS__zip
                : "",
              country: bodyInfo.merges__ADDRESS__country
                ? bodyInfo.merges__ADDRESS__country
                : "",
            },
            PHONE: bodyInfo.merges__PHONE ? bodyInfo.merges__PHONE : "",
            BIRTHDAY: bodyInfo.merges__BIRTHDAY
              ? bodyInfo.merges__BIRTHDAY
              : "",
          },
          language: bodyInfo.language ? bodyInfo.language : "",
          tags: bodyInfo.tags ? [bodyInfo.tags] : [],
        };
      }

      if (item.selectedNode.selectedEventName === "update_subscriber") {
        apiUrl = apiUrl
          .replace("{list_id}", bodyInfo.list_id)
          .replace("{subscriber_hash}", bodyInfo.email.toLowerCase());
        bodyInfo = {
          email_address: bodyInfo.email,
          status: "subscribed",
          merge_fields: {
            FNAME: bodyInfo.merges__FNAME ? bodyInfo.merges__FNAME : "",
            LNAME: bodyInfo.merges__LNAME ? bodyInfo.merges__LNAME : "",
            ADDRESS: {
              addr1: bodyInfo.merges__ADDRESS__addr1
                ? bodyInfo.merges__ADDRESS__addr1
                : "",
              addr2: bodyInfo.merges__ADDRESS__addr2
                ? bodyInfo.merges__ADDRESS__addr2
                : "",
              city: bodyInfo.merges__ADDRESS__city
                ? bodyInfo.merges__ADDRESS__city
                : "",
              state: bodyInfo.merges__ADDRESS__state
                ? bodyInfo.merges__ADDRESS__state
                : "",
              zip: bodyInfo.merges__ADDRESS__zip
                ? bodyInfo.merges__ADDRESS__zip
                : "",
              country: bodyInfo.merges__ADDRESS__country
                ? bodyInfo.merges__ADDRESS__country
                : "",
            },
            PHONE: bodyInfo.merges__PHONE ? bodyInfo.merges__PHONE : "",
            BIRTHDAY: bodyInfo.merges__BIRTHDAY
              ? bodyInfo.merges__BIRTHDAY
              : "",
          },
          language: bodyInfo.language ? bodyInfo.language : "",
        };

        cleanObject(bodyInfo);
        cleanObject(bodyInfo.merge_fields);
        cleanObject(bodyInfo.merge_fields.ADDRESS);
      }
      
      if (item.selectedNode.selectedEventName === "unsubscribe_email") {
        apiUrl = apiUrl
          .replace("{list_id}", bodyInfo.list_id)
          .replace("{subscriber_hash}", bodyInfo.email.toLowerCase());
        bodyInfo = {
          status: "unsubscribed",
        };
      }
      const body = {
        headerValue: {
          Authorization: `Bearer ${item.connectionData.token}`,
        },
        methodType: item.selectedNode.selectedEvent.apiType,
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
          .post(MAILCHIMP_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
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
})(MailChimpActionTest);
