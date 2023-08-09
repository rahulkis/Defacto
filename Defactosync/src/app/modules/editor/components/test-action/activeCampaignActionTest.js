import React from "react";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import ReactJson from "react-json-view";
import { showErrorToaster,cleanObject } from "appUtility/commonFunction";
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
  ACTIVECAMPAIGN_WEBHOOK_URLS,
} from "constants/AppConst";

class ActiveCampaignActionTest extends React.Component {
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
          commonInfo: item.selectedNode.commonInfo.toLowerCase(),
          typeOf: item.selectedNode.typeOf,
        };
        this.props.loaderOnSelectEvent(true);
        httpClient
          .post(ACTIVECAMPAIGN_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {             
              let jsonResponse = res.data.data.responseInfo.body;
              if (
                item.selectedNode.selectedEventName !== "find_deal" &&
                item.selectedNode.selectedEventName !== "find_contact" &&
                item.selectedNode.selectedEventName !== "find_account" &&
                item.selectedNode.selectedEventName !== "create_tracked_event" &&
                item.selectedNode.selectedEventName !== "update_account" 
              ) {
                jsonResponse = JSON.parse(jsonResponse);
              }

              this.setState({
                actionTestInfo: jsonResponse,
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
    let apiUrl = "";
    let headerValue = {
      "Api-Token": item.connectionData.token,
      "Access-Control-Allow-Origin": "*",
    };
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
      let url =
        item.connectionData.endPoint + item.selectedNode.selectedEvent.apiUrl;
      if (item.selectedNode.selectedEventName === "update_account") {
        apiUrl = `${url}${bodyInfo.id}`;
      } else if (item.selectedNode.selectedEventName === "add_note_to_deal") {
        apiUrl = `${url}${bodyInfo.dealid}/notes`;
      } else if (item.selectedNode.selectedEventName === "find_account") {
        apiUrl = `${url}${bodyInfo.name}`;
      } else if (item.selectedNode.selectedEventName === "find_contact") {
        apiUrl = `${url}${bodyInfo.email}`;
      } else if (item.selectedNode.selectedEventName === "find_deal") {
        apiUrl = `${url}${bodyInfo.title}`;
      } else {
        apiUrl = url;
      }

      if (
        item.selectedNode.selectedEventName === "create_account" ||
        item.selectedNode.selectedEventName === "update_account"
      ) {       

        let selectedBody = bodyInfo;       
        bodyInfo = {
          account: {
            "name": selectedBody.name,
            "accountUrl": selectedBody.accountUrl
          }
        };
        cleanObject(bodyInfo.account)
      
      }
      

      if (item.selectedNode.selectedEventName === "add_note_to_deal") {
        let selectedBody = bodyInfo;
        bodyInfo = {
          note: selectedBody,
        };
      }

      if (item.selectedNode.selectedEventName === "create/update_contact") {
        let selectedBody = bodyInfo;
        bodyInfo = {
          contact: selectedBody,
        };
      }

      if (item.selectedNode.selectedEventName === "create_deal") {
        let selectedBody = bodyInfo;
        bodyInfo = {
          deal: selectedBody,
        };
        cleanObject(bodyInfo.deal);
      }

      if (item.selectedNode.selectedEventName === "update_deal") {
        apiUrl = `${url}${bodyInfo.id}`;
        let selectedBody = bodyInfo;
        bodyInfo = {
          deal: selectedBody,
        };
      }
      if (item.selectedNode.selectedEventName === "add_contact_note") {
        bodyInfo = {
          note: {
            note: bodyInfo.note,
            relid: bodyInfo.id,
            reltype: "Subscriber",
          },
        };
      }

      if (item.selectedNode.selectedEventName === "create_tracked_event") {
        apiUrl = item.selectedNode.selectedEvent.apiUrl;
        headerValue = {
          "Api-Token": item.connectionData.token,
          "Content-Type": "application/x-www-form-urlencoded",
        };

        bodyInfo = {
          event: bodyInfo.event_name,
          key: bodyInfo.event_key,
          actid: bodyInfo.event_actid,
          eventdata: bodyInfo.event_value,
          visit: `{email:${bodyInfo.event_contact_email}}`,
        };
      }

      const body = {
        headerValue: headerValue,
        methodType: item.selectedNode.selectedEvent.apiType,
        apiUrl: apiUrl,
        commonInfo: item.selectedNode.commonInfo.toLowerCase(),
        nodeId: item.selectedNode.id,
        cliType: item.selectedNode.selectedCLI,
        eventType: item.selectedNode.selectedEventName,
        bodyInfo: bodyInfo,
      };     
      this.props.loaderOnSelectEvent(true);  
      try {
        httpClient
          .post(ACTIVECAMPAIGN_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
          .then((res) => {           
            if (res.data.statusCode === 200) {
              if (!res.data.responseBody.errorMessage) {
                let jsonResponse = res.data.responseBody;
                if (
                  item.selectedNode.selectedEventName !== "find_deal" &&
                  item.selectedNode.selectedEventName !== "find_contact" &&
                  item.selectedNode.selectedEventName !== "find_account" &&
                  item.selectedNode.selectedEventName !== "create_tracked_event" &&
                  item.selectedNode.selectedEventName !== "update_account" 
                ) {
                  jsonResponse = JSON.parse(jsonResponse);
                }
                this.setState({
                  actionTestInfo: jsonResponse,
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
            this.props.loaderOnSelectEvent(false);
            showErrorToaster(err);
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
                    <div className="d-flex">
                      <h4 style={{ textTransform: "capitalize" }}>
                        {info.key}
                      </h4>
                      <p>:{info.value}</p>
                    </div>
                  ))}

                {emptyFields.length > 0 &&
                  emptyFields.map((info) => (
                    <div className="d-flex">
                      <h4>{info.label}</h4>
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
                  Test was successfull!
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
})(ActiveCampaignActionTest);
