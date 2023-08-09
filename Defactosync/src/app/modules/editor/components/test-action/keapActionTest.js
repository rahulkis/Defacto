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
  KEAP_WEBHOOK_URLS,
} from "constants/AppConst";

class KeapActionTest extends React.Component {
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
          .post(KEAP_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              let response = res.data.data.responseInfo.body;
              if (
                item.selectedNode.selectedEventName === "create_company" ||
                item.selectedNode.selectedEventName === "create_task" ||
                item.selectedNode.selectedEventName === "create_note" ||
                item.selectedNode.selectedEventName === "create_invoice" ||
                item.selectedNode.selectedEventName === "invoice_product"
              ) {
                response = JSON.parse(response);
              }
              if (
                item.selectedNode.selectedEventName === "create_update_contact"
              ) {
                if (!response.last_updated) {
                  response = JSON.parse(response);
                }
              }
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
        item.connectionData.endPoint + item.selectedNode.selectedEvent.apiUrl;

      if (item.selectedNode.selectedEventName === "find_contact") {
        if (bodyInfo.field === "email") {
          apiUrl = `${apiUrl}?email=${bodyInfo.value}`;
        } else {
          apiUrl = `${apiUrl}/${bodyInfo.value}`;
        }
      }

      if (item.selectedNode.selectedEventName === "find_company") {
        apiUrl = apiUrl.replace("{company_name}", bodyInfo.company_name);
      }
      if (item.selectedNode.selectedEventName === "create_company") {
        bodyInfo = {
          company_name: bodyInfo.company_name,
        };
      }
      if (item.selectedNode.selectedEventName === "create_task") {
        bodyInfo = {
          contact: {
            id: bodyInfo.contact_id,
          },
          description: bodyInfo.description ? bodyInfo.description : "",
          due_date: bodyInfo.due_date,
          title: bodyInfo.title,
          user_id: bodyInfo.user_id ? bodyInfo.user_id : "",
        };
        cleanObject(bodyInfo);
      }
      if (item.selectedNode.selectedEventName === "create_note") {
        bodyInfo = {
          body: bodyInfo.body,
          contact_id: bodyInfo.contact_id,
          title: bodyInfo.title ? bodyInfo.title : "",
          type: bodyInfo.type ? bodyInfo.type : "",
          user_id: bodyInfo.user_id ? bodyInfo.user_id : "",
        };
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "tag_contact") {
        apiUrl = apiUrl.replace("{tagId}", bodyInfo.tagIds);
        bodyInfo = {
          ids: [bodyInfo.contactId],
        };
      }

      if (item.selectedNode.selectedEventName === "create_invoice") {
        bodyInfo = {
          contact_id: bodyInfo.contact_id,
          order_date: bodyInfo.order_date,
          order_title: bodyInfo.title,
          order_items: [
            {
              price: bodyInfo.price_override ? bodyInfo.price_override : "",
              product_id: bodyInfo.product,
              quantity: bodyInfo.product_quantity,
            },
          ],
        };
        cleanObject(bodyInfo.order_items[0]);
      }

      if (item.selectedNode.selectedEventName === "invoice_product") {
        apiUrl = apiUrl.replace("{orderId}", bodyInfo.invoice_id);
        bodyInfo = {
          price: bodyInfo.price_override ? bodyInfo.price_override : "",
          product_id: bodyInfo.product,
          quantity: bodyInfo.product_quantity,
        };
        cleanObject(bodyInfo);
      }

      if (item.selectedNode.selectedEventName === "create_update_contact") {
        bodyInfo = {
          email_addresses: [
            {
              email: bodyInfo.email1,
              field: "EMAIL1",
            },
            {
              email: bodyInfo.email2 ? bodyInfo.email2 : "",
              field: "EMAIL2",
            },
            {
              email: bodyInfo.email3 ? bodyInfo.email3 : "",
              field: "EMAIL3",
            },
          ],
          duplicate_option: bodyInfo.duplicate_option,
          email_opted_in: bodyInfo.optIn
            ? bodyInfo.optIn === "true"
              ? true
              : false
            : "",
          addresses: [
            {
              line1: bodyInfo.billing_address__line1
                ? bodyInfo.billing_address__line1
                : "",
              line2: bodyInfo.billing_address__line2
                ? bodyInfo.billing_address__line2
                : "",
              locality: bodyInfo.billing_address__locality
                ? bodyInfo.billing_address__locality
                : "",
              region: bodyInfo.billing_address__region
                ? bodyInfo.billing_address__region
                : "",
              field: "BILLING",
              zip_code: bodyInfo.billing_address__zip_code
                ? bodyInfo.billing_address__zip_code
                : "",
              country_code: bodyInfo.billing_address__country_code
                ? bodyInfo.billing_address__country_code
                : "",
            },
            {
              line1: bodyInfo.shipping_address__line1
                ? bodyInfo.shipping_address__line1
                : "",
              line2: bodyInfo.shipping_address__line2
                ? bodyInfo.shipping_address__line2
                : "",
              locality: bodyInfo.shipping_address__locality
                ? bodyInfo.shipping_address__locality
                : "",
              region: bodyInfo.shipping_address__region
                ? bodyInfo.shipping_address__region
                : "",
              field: "SHIPPING",
              zip_code: bodyInfo.shipping_address__zip_code
                ? bodyInfo.shipping_address__zip_code
                : "",
              country_code: bodyInfo.shipping_address__country_code
                ? bodyInfo.shipping_address__country_code
                : "",
            },
            {
              line1: bodyInfo.other_address__line1
                ? bodyInfo.other_address__line1
                : "",
              line2: bodyInfo.other_address__line2
                ? bodyInfo.other_address__line2
                : "",
              locality: bodyInfo.other_address__locality
                ? bodyInfo.other_address__locality
                : "",
              region: bodyInfo.other_address__region
                ? bodyInfo.other_address__region
                : "",
              field: "OTHER",
              zip_code: bodyInfo.other_address__zip_code
                ? bodyInfo.other_address__zip_code
                : "",
              country_code: bodyInfo.other_address__country_code
                ? bodyInfo.other_address__country_code
                : "",
            },
          ],
          job_title: bodyInfo.job_title ? bodyInfo.job_title : "",
          middle_name: bodyInfo.middle_name ? bodyInfo.middle_name : "",
          given_name: bodyInfo.given_name ? bodyInfo.given_name : "",

          phone_numbers: [
            {
              number: bodyInfo.phone__number__1
                ? bodyInfo.phone__number__1
                : "",
              field: "PHONE1",
              type: bodyInfo.phone__phoneType__1
                ? bodyInfo.phone__phoneType__1
                : "",
            },
            {
              number: bodyInfo.phone__number__2
                ? bodyInfo.phone__number__2
                : "",
              field: "PHONE2",
              type: bodyInfo.phone__phoneType__2
                ? bodyInfo.phone__phoneType__2
                : "",
            },
            {
              number: bodyInfo.phone__number__3
                ? bodyInfo.phone__number__3
                : "",
              field: "PHONE3",
              type: bodyInfo.phone__phoneType__3
                ? bodyInfo.phone__phoneType__3
                : "",
            },
            {
              number: bodyInfo.phone__number__4
                ? bodyInfo.phone__number__4
                : "",
              field: "PHONE4",
              type: bodyInfo.phone__phoneType__4
                ? bodyInfo.phone__phoneType__4
                : "",
            },
            {
              number: bodyInfo.phone__number__5
                ? bodyInfo.phone__number__5
                : "",
              field: "PHONE5",
              type: bodyInfo.phone__phoneType__5
                ? bodyInfo.phone__phoneType__5
                : "",
            },
          ],
          company: {
            id: bodyInfo.company ? bodyInfo.company : "",
          },
          prefix: bodyInfo.prefix ? bodyInfo.prefix : "",
          suffix: bodyInfo.suffix ? bodyInfo.suffix : "",
          anniversary: bodyInfo.anniversary ? bodyInfo.anniversary : "",
          birthday: bodyInfo.birthday ? bodyInfo.birthday : "", //"2021-05-19T02:32:25.593Z",
          spouse_name: bodyInfo.spouse_name ? bodyInfo.spouse_name : "",
          family_name: bodyInfo.family_name ? bodyInfo.family_name : "",
          website: bodyInfo.website ? bodyInfo.website : "",
          social_accounts: [
            {
              name: bodyInfo.facebook__name ? bodyInfo.facebook__name : "",
              type: "Facebook",
            },
            {
              name: bodyInfo.twitter__name ? bodyInfo.twitter__name : "",
              type: "Twitter",
            },
            {
              name: bodyInfo.linkedin__name ? bodyInfo.linkedin__name : "",
              type: "LinkedIn",
            },
          ],
        };

        cleanObject(bodyInfo);
      }
      const body = {
        headerValue: {
          Authorization: "Bearer " + item.connectionData.tokenInfo.access_token,
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
          .post(KEAP_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              if (!res.data.responseBody.errorMessage) {
                let response = res.data.responseBody;
                if (
                  item.selectedNode.selectedEventName === "create_company" ||
                  item.selectedNode.selectedEventName === "create_task" ||
                  item.selectedNode.selectedEventName === "create_note" ||
                  item.selectedNode.selectedEventName === "create_invoice" ||
                  item.selectedNode.selectedEventName === "invoice_product"
                ) {
                  response = JSON.parse(response);
                }
                if (
                  item.selectedNode.selectedEventName ===
                  "create_update_contact"
                ) {
                  if (!response.last_updated) {
                    response = JSON.parse(response);
                  }
                }

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
                    actionTestInfo: err.response.data.responseBody
                      ? err.response.data.responseBody
                      : { message: "Invalid value" },
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
})(KeapActionTest);
