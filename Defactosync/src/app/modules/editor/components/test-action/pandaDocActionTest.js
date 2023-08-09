import React from "react";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import ReactJson from "react-json-view";
import { showErrorToaster, cleanObject} from "appUtility/commonFunction";

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
  PANDADOC_WEBHOOK_URLS
} from "constants/AppConst";


class PandaDocActionTest extends React.Component {
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
          .post(PANDADOC_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              let response = item.selectedNode.selectedEventName === "create_update_contact"
              || item.selectedNode.selectedEventName === "create_document_folder"
              || item.selectedNode.selectedEventName === "create_template_folder"
              || item.selectedNode.selectedEventName === "document_move_folder"
              || item.selectedNode.selectedEventName === "create_document"
              ? JSON.parse(res.data.data.responseInfo.body) : res.data.data.responseInfo.body;
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
          item.connectionData.endPoint;
        if (item.selectedNode.selectedEventName === "create_document") {
          apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
          bodyInfo = {
            name: bodyInfo.document_name,
            template_uuid: bodyInfo.template,
            folder_uuid: bodyInfo.folder,
            recipients: [
              {
                email: bodyInfo.sender_email,
                first_name: bodyInfo.sender_first_name,
                last_name: bodyInfo.sender_last_name,
                company: bodyInfo.sender_company,
                phone: bodyInfo.sender_phone,
                role: "Sender"
              },
              {
                email: bodyInfo.client_email,
                first_name: bodyInfo.client_first_name,
                last_name: bodyInfo.client_last_name,
                company: bodyInfo.client_company,
                phone: bodyInfo.client_phone,
                role: "Client"
              }
            ],
            pricing_tables: [
              {
                name: bodyInfo.pricing_table_name,
                data_merge:false,
                options: {
                  currency: bodyInfo.pricing_table_currency || "USD",
                },
                sections: [
                  {
                    title: "Sample Section",
                    default: true,
                    rows: [
                      {
                        options: {
                          optional: true,
                          optional_selected: true,
                          qty_editable: true
                      },
                      data: {
                        name: bodyInfo.product_name,
                        description: bodyInfo.product_description,
                        price: bodyInfo.product_price,
                        qty: bodyInfo.product_quantity,
                        Discount: {
                          value: bodyInfo.product_discount,
                          type: "percent"
                      }
                    },
                      }
                    ]
                  }
                ]
              }
            ]
          };
          cleanObject(bodyInfo);
        };
  
        if (item.selectedNode.selectedEventName === "create_update_contact") {
          apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
          bodyInfo = {
            email: bodyInfo.email,
            first_name: bodyInfo.first_name,
            last_name: bodyInfo.last_name,
            company: bodyInfo.company,
            job_title: bodyInfo.job_title,
            phone: bodyInfo.phone,
            street_address: bodyInfo.street_address,
            city: bodyInfo.city,
            postal_code: bodyInfo.postal_code,
            state: bodyInfo.state
          };
          cleanObject(bodyInfo);
        };

        if (item.selectedNode.selectedEventName === "create_template_folder") {
            apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
            bodyInfo = {
              name: bodyInfo.name
            };
          };

        if (item.selectedNode.selectedEventName === "create_document_folder") {
        apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
        bodyInfo = {
          name: bodyInfo.name
        };
        };

  
        const body = {
          headerValue: {  
            Authorization: "API-key " + item.connectionData.token,
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
            .post(PANDADOC_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
            .then((res) => {
              if (res.data.statusCode === 200) {
                if (!res.data.responseBody.errorMessage) {
                  let response = item.selectedNode.selectedEventName === "create_update_contact"
                  || item.selectedNode.selectedEventName === "create_template_folder"
                  || item.selectedNode.selectedEventName === "create_document_folder"
                  || item.selectedNode.selectedEventName === "document_move_folder"
                  || item.selectedNode.selectedEventName === "create_document"
                  ? JSON.parse(res.data.responseBody) : res.data.responseBody;
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
})(PandaDocActionTest);
