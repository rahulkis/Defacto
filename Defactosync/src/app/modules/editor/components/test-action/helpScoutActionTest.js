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
import {
  showErrorToaster,
  cleanObject,
  removeParam,
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
  HELPSCOUT_WEBHOOK_URLS,
} from "constants/AppConst";

class HelpScoutActionTest extends React.Component {
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
          .post(HELPSCOUT_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
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
      if (item.selectedNode.selectedEventName === "add_note") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.id);
      }
      if (
        item.selectedNode.selectedEventName === "find_user" ||
        item.selectedNode.selectedEventName === "find_customer"
      ) {
        apiUrl = apiUrl.replace("{email}", bodyInfo.email);
      }
      if (item.selectedNode.selectedEventName === "get_day_report") {
        let start =
          moment()
            .toISOString()
            .substring(0, 10) + "T00:00:00Z";
        let end =
          moment()
            .toISOString()
            .substring(0, 10) + "T23:59:59Z";
        apiUrl = apiUrl
          .replace("{userId}", bodyInfo.user_email)
          .replace("{start}", start)
          .replace("{end}", end);
      }

      if (item.selectedNode.selectedEventName === "get_week_report") {
        let currentDate = moment();
        let weekStart =
          currentDate
            .clone()
            .startOf("isoWeek")
            .toISOString()
            .substring(0, 10) + "T00:00:00Z";
        let weekEnd =
          currentDate
            .clone()
            .endOf("isoWeek")
            .toISOString()
            .substring(0, 10) + "T23:59:59Z";

        apiUrl = apiUrl
          .replace("{userId}", bodyInfo.user_email)
          .replace("{start}", weekStart)
          .replace("{end}", weekEnd);
      }
      if (item.selectedNode.selectedEventName === "get_custom_report") {
        apiUrl = apiUrl
          .replace("{userId}", bodyInfo.user_email)
          .replace("{start}", bodyInfo.date_range_start)
          .replace("{end}", bodyInfo.date_range_end);
      }

      if (item.selectedNode.selectedEventName === "send_reply") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.id);
        let customer = {
          id: bodyInfo.customer__id,
        };
        delete bodyInfo.customer__id;
        delete bodyInfo.id;

        bodyInfo = {
          customer: customer,
          ...bodyInfo,
        };
      }
      if (item.selectedNode.selectedEventName === "create_conversation") {
        let customer = {
          id: bodyInfo.customer__id,
        };

        let tags = bodyInfo.tags !== undefined ? new Array(bodyInfo.tags) : [];
        let threads = [
          {
            bcc: [bodyInfo.thread__bcc],
            cc: [bodyInfo.thread__cc],
            text: bodyInfo.thread__text,
            type:
              bodyInfo.thread__type === "draft"
                ? "reply"
                : bodyInfo.thread__type,
            draft: bodyInfo.thread__type === "draft" ? true : false,
            customer: customer,
          },
        ];

        delete bodyInfo.customer__id;
        delete bodyInfo.customer__email;
        delete bodyInfo.thread__bcc;
        delete bodyInfo.thread__cc;
        delete bodyInfo.thread__text;
        delete bodyInfo.thread__type;
        delete bodyInfo.thread__user;
        delete bodyInfo.thread__user;
        delete bodyInfo.tags;

        bodyInfo = {
          customer: customer,
          tags: tags,
          type: "email",
          threads: threads,
          ...bodyInfo,
        };
      }
 
      if (item.selectedNode.selectedEventName === "create_customer") {
        let address = {
          city: bodyInfo.address__city ? bodyInfo.address__city : "",
          state: bodyInfo.address__state ? bodyInfo.address__state : "",
          postalCode: bodyInfo.address__postalCode
            ? bodyInfo.address__postalCode
            : "",
          country: bodyInfo.address__country ? bodyInfo.address__country : "",
          lines: bodyInfo.address__lines
            ? new Array(bodyInfo.address__lines)
            : [],
        };
        // cleanObject(address);
        let websites = [];
        let emails = [];
        if (bodyInfo.email) {
          emails.push({
            type: "work",
            value: bodyInfo.email,
          });
        }

        if (bodyInfo.website) {
          websites.push({
            value: bodyInfo.website,
          });
        }
        delete bodyInfo.address__city;
        delete bodyInfo.address__state;
        delete bodyInfo.address__postalCode;
        delete bodyInfo.address__country;
        delete bodyInfo.address__lines;
        delete bodyInfo.email;
        delete bodyInfo.website;

        bodyInfo = {
          address: address,
          emails: emails,
          websites: websites,
          ...bodyInfo,
        };
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "find_conversation") {
        //generate query format
        let queryObj = {
          tag: bodyInfo.tags ? bodyInfo.tags : "",
          email: bodyInfo.email ? bodyInfo.email : "",
          subject: bodyInfo.subject ? bodyInfo.subject : "",
        };
        cleanObject(queryObj);
        let query = this.generateQuery(queryObj);
        let lastIndex = query.lastIndexOf("AND");
        query = query.substring(0, lastIndex);
        apiUrl = apiUrl
          .replace("{status}", bodyInfo.status ? bodyInfo.status : "")
          .replace("{user}", bodyInfo.user ? bodyInfo.user : "")
          .replace("{query}", query ? query.trim() : "")
          .replace("{mailbox}", bodyInfo.mailbox ? bodyInfo.mailbox : "");
        apiUrl = removeParam(apiUrl);
      }

      const body = {
        headerValue: {
          Authorization: `Bearer ${item.connectionData.tokenInfo.access_token}`,
          "Content-Type": "application/json",
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
          .post(HELPSCOUT_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              if (!res.data.responseBody.errorMessage) {
                this.setState({
                  actionTestInfo: res.data.responseBody,
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
})(HelpScoutActionTest);
