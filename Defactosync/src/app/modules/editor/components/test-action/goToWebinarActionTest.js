import React from "react";
import moment from "moment";
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
  GOTOWEBINAR_WEBHOOK_URLS,
} from "constants/AppConst";
var jsonBig = require("json-bigint");
class GoToWebinarActionTest extends React.Component {
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
          .post(GOTOWEBINAR_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              let bodyInfo = res.data.data.responseInfo.body;
              if (
                item.selectedNode.selectedEventName === "create_webinar" ||
                item.selectedNode.selectedEventName === "create_registrant"
              ) {
                let resObj = jsonBig.parse(res.data.data.responseInfo.body);
                if (
                  item.selectedNode.selectedEventName === "create_registrant"
                ) {
                  resObj.registrantKey = resObj.registrantKey.toString();
                  bodyInfo = {
                    asset: resObj.asset,
                    joinUrl: resObj.joinUrl,
                    registrantKey: resObj.registrantKey,
                    status: resObj.status,
                  };
                } else {
                  resObj.webinarKey = resObj.webinarKey.toString();
                  bodyInfo = {
                    webinarKey: resObj.webinarKey,
                  };
                }
              }

              this.setState({
                actionTestInfo:
                  bodyInfo !== "" ? bodyInfo : { message: "success" },
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

      if (item.selectedNode.selectedEventName === "remove_resgistrant") {
        apiUrl = apiUrl
          .replace(
            "{organizerKey}",
            item.connectionData.tokenInfo.organizer_key
          )
          .replace("{webinarKey}", bodyInfo.webinar_key)
          .replace("{registrantKey}", bodyInfo.registrant_key);
      }
      if (item.selectedNode.selectedEventName === "create_registrant") {
        apiUrl = apiUrl
          .replace(
            "{organizerKey}",
            item.connectionData.tokenInfo.organizer_key
          )
          .replace("{webinarKey}", bodyInfo.webinar_key);

        bodyInfo = {
          firstName: bodyInfo.firstName,
          lastName: bodyInfo.lastName,
          email: bodyInfo.email,
          source: bodyInfo.source ? bodyInfo.source : "",
        };
      }
      if (item.selectedNode.selectedEventName === "create_webinar") {
        apiUrl = apiUrl.replace(
          "{organizerKey}",
          item.connectionData.tokenInfo.organizer_key
        );
        bodyInfo = {
          subject: bodyInfo.subject,
          description: bodyInfo.description ? bodyInfo.description : "",
          times: [
            {
              startTime: bodyInfo.start_time,
              endTime: bodyInfo.end_time,
            },
          ],
          timeZone: bodyInfo.timeZone ? bodyInfo.timeZone : "",
          type: "single_session",
          experienceType: bodyInfo.experienceType
            ? bodyInfo.experienceType
            : "CLASSIC",
          recordingAssetKey: bodyInfo.recordingAssetKey
            ? bodyInfo.recordingAssetKey
            : "",
        };

        if (bodyInfo.experienceType !== "SIMULIVE") {
          delete bodyInfo.recordingAssetKey;
        }
      }
      if (item.selectedNode.selectedEventName === "find_resgistrant") {
        apiUrl = apiUrl
          .replace(
            "{organizerKey}",
            item.connectionData.tokenInfo.organizer_key
          )
          .replace("{webinarKey}", bodyInfo.webinar_key)
          .replace("{email}", bodyInfo.email);
      }

      if (item.selectedNode.selectedEventName === "find_webinar") {       
        let year = moment(bodyInfo.start_time).get("year");
        try {
          apiUrl = apiUrl
            .replace("{accountKey}", item.selectedNode.commonInfo)
            .replace("{fromTime}", bodyInfo.start_time)
            .replace(
              "{toTime}",
              moment(bodyInfo.start_time)
                .set("year", year + 1)
                .toISOString()
                .replace(".000Z", "Z")
            );
          bodyInfo = {
            subject: bodyInfo.subject ? bodyInfo.subject : "",
          };
        } catch (err) {
          apiUrl = "";
        }
      }
      const body = {
        headerValue: {
          Authorization: `Bearer ${item.connectionData.tokenInfo.access_token}`,
        },
        methodType: item.selectedNode.selectedEvent.apiType,
        apiUrl: apiUrl,
        commonInfo: item.selectedNode.commonInfo,
        nodeId: item.selectedNode.id,
        cliType: item.selectedNode.selectedCLI,
        eventType: item.selectedNode.selectedEventName,
        bodyInfo: bodyInfo,
      };
      if (apiUrl) {
        this.props.loaderOnSelectEvent(true);
        try {
          httpClient
            .post(GOTOWEBINAR_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
            .then((res) => {
              if (res.data.statusCode === 200) {
                let bodyInfo = res.data.responseBody;
                if (!res.data.responseBody.errorMessage) {
                  if (
                    item.selectedNode.selectedEventName === "create_webinar" ||
                    item.selectedNode.selectedEventName === "create_registrant"
                  ) {
                    let resObj = jsonBig.parse(res.data.responseBody);
                    if (
                      item.selectedNode.selectedEventName ===
                      "create_registrant"
                    ) {
                      resObj.registrantKey = resObj.registrantKey.toString();
                      bodyInfo = {
                        asset: resObj.asset,
                        joinUrl: resObj.joinUrl,
                        registrantKey: resObj.registrantKey,
                        status: resObj.status,
                      };
                    } else {
                      resObj.webinarKey = resObj.webinarKey.toString();
                      bodyInfo = {
                        webinarKey: resObj.webinarKey,
                      };
                    }

                    console.log("...tst", bodyInfo);
                  }
                  this.setState({
                    actionTestInfo:
                      bodyInfo !== "" ? bodyInfo : { message: "success" },
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
        ToastsStore.error("Time not is proper format");
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
})(GoToWebinarActionTest);
