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
  GOOGLE_CALENDER_WEBHOOK_URLS,
} from "constants/AppConst";
import {
  AUTH_INTEGRATION,
  GOOGLE_CALENDAR_AUTH_URLS,
} from "constants/IntegrationConstant";

class GoogleCalenderActionTest extends React.Component {
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
          .post(GOOGLE_CALENDER_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
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

  handleTestAction = async () => {
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

      if (item.selectedNode.selectedEventName === "create_calendar") {
        if (bodyInfo.description) {
          bodyInfo = {
            summary: bodyInfo.summary,
            description: bodyInfo.description,
          };
        } else {
          bodyInfo = {
            summary: bodyInfo.summary,
          };
        }
      }

      if (item.selectedNode.selectedEventName === "delete_event") {
        apiUrl = apiUrl
          .replace("calendarId", bodyInfo.calendarid)
          .replace("eventId", bodyInfo.eventid);

        if (bodyInfo.send_notifications) {
          apiUrl =
            bodyInfo.send_notifications === "false"
              ? apiUrl
                  .replace("calendarId", bodyInfo.calendarid)
                  .replace("eventId", bodyInfo.eventid) + "?sendUpdates=none"
              : apiUrl
                  .replace("calendarId", bodyInfo.calendarid)
                  .replace("eventId", bodyInfo.eventid) + "?sendUpdates=all";
        }
      }
      if (item.selectedNode.selectedEventName === "quick_add_event") {
        apiUrl =
          apiUrl.replace("calendarId", bodyInfo.calendarid) +
          "?text=" +
          bodyInfo.text;
      }

      if (item.selectedNode.selectedEventName === "update_event") {
        apiUrl = apiUrl
          .replace("calendarId", bodyInfo.calendarid)
          .replace("eventId", bodyInfo.eventid);

        let attendeesInfo = [];
        let attendeesObj = [];

        //get existing attendees
        let attendees = await this.getEvent(
          item.connectionData.tokenInfo.access_token,
          bodyInfo.calendarid,
          bodyInfo.eventid
        );
        if (attendees !== "") {
          attendeesInfo = attendees.split();
        }
        if (bodyInfo.attendees) {
          attendeesInfo.push(bodyInfo.attendees);
        }

        if (attendeesInfo.length) {
          attendeesInfo.map((att) => {
            let obj = {
              email: att,
            };
            attendeesObj.push(obj);
          });
        }

        let recurrence = [];
        if (
          bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:FREQ=${bodyInfo.recurrence_frequency};UNTIL=${bodyInfo.recurrence_until};INTERVAL=${bodyInfo.recurrence_count}`,
          ];
        } else if (
          bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          !bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:FREQ=${bodyInfo.recurrence_frequency};UNTIL=${bodyInfo.recurrence_until}`,
          ];
        } else if (
          !bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:UNTIL=${bodyInfo.recurrence_until};INTERVAL=${bodyInfo.recurrence_count}`,
          ];
        } else if (
          bodyInfo.recurrence_frequency &&
          !bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:FREQ=${bodyInfo.recurrence_frequency};INTERVAL=${bodyInfo.recurrence_count}`,
          ];
        } else if (
          bodyInfo.recurrence_frequency &&
          !bodyInfo.recurrence_until &&
          !bodyInfo.recurrence_count
        ) {
          recurrence = [`RRULE:FREQ=${bodyInfo.recurrence_frequency}`];
        } else if (
          !bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          !bodyInfo.recurrence_count
        ) {
          recurrence = [`RRULE:UNTIL=${bodyInfo.recurrence_until}`];
        } else if (
          !bodyInfo.recurrence_frequency &&
          !bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [`RRULE:INTERVAL=${bodyInfo.recurrence_count}`];
        }
        bodyInfo = {
          summary: bodyInfo.summary ? bodyInfo.summary : "",
          description: bodyInfo.description ? bodyInfo.description : "",
          location: bodyInfo.location ? bodyInfo.location : "",
          colorId: bodyInfo.colorId ? bodyInfo.colorId : "",
          attendees: attendeesObj.length ? attendeesObj : "",
          visibility: bodyInfo.visibility ? bodyInfo.visibility : "",
          transparency: bodyInfo.transparency ? bodyInfo.transparency : "",
          end: {
            dateTime: bodyInfo.end__dateTime,
            timeZone: bodyInfo.timezone,
          },
          start: {
            dateTime: bodyInfo.start__dateTime,
            timeZone: bodyInfo.timezone,
          },
          reminders: {
            overrides: [
              {
                method: bodyInfo.reminders_methods
                  ? bodyInfo.reminders_methods
                  : "",
                minutes: bodyInfo.reminders_minutes
                  ? Number(bodyInfo.reminders_minutes)
                  : 0,
              },
            ],
            useDefault: bodyInfo.reminders__useDefault
              ? bodyInfo.reminders__useDefault === "true"
                ? true
                : false
              : false,
          },
          recurrence: recurrence.length ? recurrence : "",
        };

        if (
          bodyInfo.reminders.overrides[0].method === "" &&
          bodyInfo.reminders.overrides[0].minutes === 0
        ) {
          delete bodyInfo.reminders.overrides;
        } else if (
          bodyInfo.reminders.overrides[0].method === "" &&
          bodyInfo.reminders.overrides[0].minutes !== 0
        ) {
          delete bodyInfo.reminders.overrides[0].method;
        } else if (
          bodyInfo.reminders.overrides[0].minutes === 0 &&
          bodyInfo.reminders.overrides[0].method !== ""
        ) {
          delete bodyInfo.reminders.overrides[0].minutes;
        }

        bodyInfo = cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "find_event") {
        apiUrl = apiUrl
          .replace("calendarId", bodyInfo.calendarid)
          .replace("{query}", bodyInfo.search_term);

        if (bodyInfo.start_time) {
          apiUrl =
            apiUrl + "&timeMin=" + encodeURIComponent(bodyInfo.start_time);
        }

        if (bodyInfo.end_time) {
          apiUrl = apiUrl + "&timeMax=" + encodeURIComponent(bodyInfo.end_time);
        }
      }

      if (item.selectedNode.selectedEventName === "add_attendees_to_event") {
        apiUrl = apiUrl
          .replace("calendarId", bodyInfo.calendarid)
          .replace("eventId", bodyInfo.eventid);
        let attendeesInfo = [];
        let attendeesObj = [];

        //get existing attendees
        let attendees = await this.getEvent(
          item.connectionData.tokenInfo.access_token,
          bodyInfo.calendarid,
          bodyInfo.eventid
        );
        if (attendees !== "") {
          attendeesInfo = attendees.split();
        }
        if (bodyInfo.attendees) {
          attendeesInfo.push(bodyInfo.attendees);
        }

        if (attendeesInfo.length) {
          attendeesInfo.map((att) => {
            let obj = {
              email: att,
            };
            attendeesObj.push(obj);
          });
        }

        if (attendeesObj.length) {
          bodyInfo = {
            attendees: attendeesObj,
          };
        }
      }

      if (item.selectedNode.selectedEventName === "create_detailed_event") {
        apiUrl = apiUrl.replace("calendarId", bodyInfo.calendarid);

        let recurrence = [];
        if (
          bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:FREQ=${bodyInfo.recurrence_frequency};UNTIL=${bodyInfo.recurrence_until};INTERVAL=${bodyInfo.recurrence_count}`,
          ];
        } else if (
          bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          !bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:FREQ=${bodyInfo.recurrence_frequency};UNTIL=${bodyInfo.recurrence_until}`,
          ];
        } else if (
          !bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:UNTIL=${bodyInfo.recurrence_until};INTERVAL=${bodyInfo.recurrence_count}`,
          ];
        } else if (
          bodyInfo.recurrence_frequency &&
          !bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [
            `RRULE:FREQ=${bodyInfo.recurrence_frequency};INTERVAL=${bodyInfo.recurrence_count}`,
          ];
        } else if (
          bodyInfo.recurrence_frequency &&
          !bodyInfo.recurrence_until &&
          !bodyInfo.recurrence_count
        ) {
          recurrence = [`RRULE:FREQ=${bodyInfo.recurrence_frequency}`];
        } else if (
          !bodyInfo.recurrence_frequency &&
          bodyInfo.recurrence_until &&
          !bodyInfo.recurrence_count
        ) {
          recurrence = [`RRULE:UNTIL=${bodyInfo.recurrence_until}`];
        } else if (
          !bodyInfo.recurrence_frequency &&
          !bodyInfo.recurrence_until &&
          bodyInfo.recurrence_count
        ) {
          recurrence = [`RRULE:INTERVAL=${bodyInfo.recurrence_count}`];
        }

        bodyInfo = {
          summary: bodyInfo.summary ? bodyInfo.summary : "",
          description: bodyInfo.description ? bodyInfo.description : "",
          location: bodyInfo.location ? bodyInfo.location : "",
          colorId: bodyInfo.colorId ? bodyInfo.colorId : "",
          attendees: bodyInfo.attendees ? [{ email: bodyInfo.attendees }] : "",
          visibility: bodyInfo.visibility ? bodyInfo.visibility : "",
          transparency: bodyInfo.transparency ? bodyInfo.transparency : "",
          guestsCanModify: bodyInfo.transparency
            ? bodyInfo.transparency === "true"
              ? true
              : false
            : false,
          end: {
            dateTime: bodyInfo.end__dateTime,
            timeZone: bodyInfo.timezone,
          },
          start: {
            dateTime: bodyInfo.start__dateTime,
            timeZone: bodyInfo.timezone,
          },
          reminders: {
            overrides: [
              {
                method: bodyInfo.reminders_methods
                  ? bodyInfo.reminders_methods
                  : "",
                minutes: bodyInfo.reminders_minutes
                  ? Number(bodyInfo.reminders_minutes)
                  : 0,
              },
            ],
            useDefault: bodyInfo.reminders__useDefault
              ? bodyInfo.reminders__useDefault === "true"
                ? true
                : false
              : false,
          },
          recurrence: recurrence.length ? recurrence : "",
        };

        if (
          bodyInfo.reminders.overrides[0].method === "" &&
          bodyInfo.reminders.overrides[0].minutes === 0
        ) {
          delete bodyInfo.reminders.overrides;
        } else if (
          bodyInfo.reminders.overrides[0].method === "" &&
          bodyInfo.reminders.overrides[0].minutes !== 0
        ) {
          delete bodyInfo.reminders.overrides[0].method;
        } else if (
          bodyInfo.reminders.overrides[0].minutes === 0 &&
          bodyInfo.reminders.overrides[0].method !== ""
        ) {
          delete bodyInfo.reminders.overrides[0].minutes;
        }
        bodyInfo = cleanObject(bodyInfo);
      }
      const body = {
        headerValue: {
          Authorization: `Bearer ${item.connectionData.tokenInfo.access_token}`,
          "Content-Type": contentType,
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
          .post(GOOGLE_CALENDER_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
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

  // get event
  getEvent = async (token, calendarId, eventId) => {
    return new Promise(async function(resolve, reject) {
      let formdata = {
        headerValue: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        APIUrl: GOOGLE_CALENDAR_AUTH_URLS.GET_EVENT.replace(
          "{calendarId}",
          calendarId
        ).replace("{eventId}", eventId),
      };
      try {
        await httpClient
          .post(AUTH_INTEGRATION.GET_API, formdata)
          .then((result) => {
            if (result.status === 200) {
              let attendees = "";
              const parsedResponse = JSON.parse(result.data.res);
              if (result.status === 200 && !parsedResponse.error) {
                if (parsedResponse.attendees) {
                  attendees = parsedResponse.attendees
                    .map((x) => x.email)
                    .join();
                }
              }
              resolve(attendees);
            }
          });
      } catch (err) {
        showErrorToaster(err);
        reject(err);
      }
    });
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
})(GoogleCalenderActionTest);
