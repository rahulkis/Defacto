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
  TRELLO_WEBHOOK_URLS,
} from "constants/AppConst";
import { TRELLOAUTH_URLS } from "constants/IntegrationConstant";

class TrelloActionTest extends React.Component {
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
          boardId: "",
          listId: "",
          cardId: "",
          labelId: "",
        };      
        this.props.loaderOnSelectEvent(true);
        httpClient
          .post(TRELLO_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
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

  renameKey = (object, key, newKey) => {
    const clonedObj = this.clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  };
  clone = (obj) => Object.assign({}, obj);

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
        item.connectionData.endPoint +
        item.selectedNode.selectedEvent.apiUrl
          .replace("{key}", TRELLOAUTH_URLS.API_KEY)
          .replace("{token}", item.connectionData.token);

      if (item.selectedNode.selectedEventName === "create_board") {
        apiUrl = apiUrl.replace("{name}", bodyInfo.name);
        bodyInfo = this.renameKey(
          bodyInfo,
          "organization_id",
          "idOrganization"
        );
      }
      if (item.selectedNode.selectedEventName === "create_list") {
        apiUrl = apiUrl
          .replace("{name}", bodyInfo.name)
          .replace("{idBoard}", bodyInfo.board);
      }
      if (item.selectedNode.selectedEventName === "copy_board") {
        apiUrl = apiUrl
          .replace("{name}", bodyInfo.name)
          .replace("{idBoardSource}", bodyInfo.board);
        bodyInfo = this.renameKey(
          bodyInfo,
          "organization_id",
          "idOrganization"
        );
      }
      if (item.selectedNode.selectedEventName === "create_label") {
        apiUrl = apiUrl
          .replace("{name}", bodyInfo.name)
          .replace("{idBoard}", bodyInfo.board)
          .replace("{color}", bodyInfo.color);
      }
      if (item.selectedNode.selectedEventName === "create_comment") {
        apiUrl = apiUrl
          .replace("{id}", bodyInfo.card)
          .replace("{text}", bodyInfo.text);
      }
      if (item.selectedNode.selectedEventName === "remove_label_from_card") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.label);
      }
      if (
        item.selectedNode.selectedEventName === "create_checklist_item_in_card"
      ) {
        apiUrl = apiUrl
          .replace("{id}", bodyInfo.checklist)
          .replace("{name}", bodyInfo.name);
      }
      if (item.selectedNode.selectedEventName === "add_label_to_card") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.card);
        bodyInfo = this.renameKey(bodyInfo, "label", "value");
      }

      if (
        item.selectedNode.selectedEventName ===
        "complete_checklist_item_in_card"
      ) {
        apiUrl = apiUrl
          .replace("{id}", bodyInfo.card)
          .replace("{idCheckItem}", bodyInfo.checklist_item)
          .replace("{state}", "complete");
      }
      if (item.selectedNode.selectedEventName === "delete_checklist_in_card") {
        apiUrl = apiUrl
          .replace("{id}", bodyInfo.card)
          .replace("{idChecklist}", bodyInfo.checklist);
      }
      if (item.selectedNode.selectedEventName === "close_board") {
        apiUrl = apiUrl
          .replace("{id}", bodyInfo.board)
          .replace("{closed}", true);
      }
      if (item.selectedNode.selectedEventName === "add_attachment_to_card") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.card);
      }

      if (item.selectedNode.selectedEventName === "archive_card") {
        apiUrl = apiUrl
          .replace("{id}", bodyInfo.card)
          .replace("{closed}", true);
      }
      if (item.selectedNode.selectedEventName === "create_card") {
        apiUrl = apiUrl.replace("{idList}", bodyInfo.list);
        bodyInfo = this.renameKey(bodyInfo, "label", "idLabels");
        bodyInfo = this.renameKey(bodyInfo, "member", "idMembers");
        bodyInfo = this.renameKey(bodyInfo, "file", "fileSource");
        bodyInfo = this.renameKey(bodyInfo, "url", "urlSource");
        bodyInfo = this.renameKey(bodyInfo, "url", "urlSource");
        bodyInfo = this.renameKey(bodyInfo, "card_pos", "pos");
      }

      if (item.selectedNode.selectedEventName === "update_card") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.card);
      }
      if (item.selectedNode.selectedEventName === "add_members_to_card") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.card);
        bodyInfo = this.renameKey(bodyInfo, "member", "value");
      }
      if (item.selectedNode.selectedEventName === "add_checklist_to_card") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.card);
        bodyInfo = this.renameKey(bodyInfo, "checklist_name", "name");
        bodyInfo = this.renameKey(bodyInfo, "checklist_pos", "pos");
        bodyInfo = this.renameKey(bodyInfo, "checklist_items", "items");
        bodyInfo = this.renameKey(
          bodyInfo,
          "checklist_copy",
          "idChecklistSource"
        );
      }

      if (item.selectedNode.selectedEventName === "move_card_to_list") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.card);
        bodyInfo = this.renameKey(bodyInfo, "to_list", "idList");
        bodyInfo = this.renameKey(bodyInfo, "to_board", "idBoard");
      }
      if (
        item.selectedNode.selectedEventName === "find_board" ||
        item.selectedNode.selectedEventName === "find_card"
      ) {
        apiUrl = apiUrl.replace("{name}", bodyInfo.name);
      }
      if (item.selectedNode.selectedEventName === "find_member") {
        apiUrl = apiUrl.replace("{name}", bodyInfo.member_name);
      }
      if (
        item.selectedNode.selectedEventName === "find_label_on_board" ||
        item.selectedNode.selectedEventName === "find_list_on_board"
      ) {
        apiUrl = apiUrl.replace("{id}", bodyInfo.board);
      }
      if (item.selectedNode.selectedEventName === "find_checklist_item") {
        apiUrl = apiUrl.replace("{id}", bodyInfo.checklist);
        bodyInfo = this.renameKey(bodyInfo, "search_name", "name");
      }
      if (item.selectedNode.selectedEventName === "find_checklist") {
        if (bodyInfo.hasOwnProperty("card")) {
          apiUrl = apiUrl
            .replace("{type}", "card")
            .replace("{id}", bodyInfo.card);
        } else {
          apiUrl = apiUrl
            .replace("{type}", "boards")
            .replace("{id}", bodyInfo.board);
        }
        bodyInfo = this.renameKey(bodyInfo, "search_name", "name");
      }

      const body = {
        headerValue: {
          Authorization: `Bearer ${item.connectionData.token}`,
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
          .post(TRELLO_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
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
})(TrelloActionTest);
