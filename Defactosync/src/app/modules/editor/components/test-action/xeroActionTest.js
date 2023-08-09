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
  XERO_WEBHOOK_URLS
} from "constants/AppConst";


class XeroActionTest extends React.Component {
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
          .post(XERO_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
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
      const replaceKey = this.ReplaceOfKeyWithDot(item.selectedNode.fields);
          for (var i = 0; i < replaceKey.length; i++) {
            bodyInfo[replaceKey[i].key] = replaceKey[i].value;
          }
      let apiUrl = item.connectionData.endPoint;
      let createBodyInfo = {};
      if (item.selectedNode.selectedEventName === "create_update_contact") {
        apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
        let arrayName = this.ReplaceOfKeyWithUnder(item.selectedNode.fields);
      for (var i = 0; i < arrayName.length; i++) {
        createBodyInfo[arrayName[i].key] = arrayName[i].value;
      }
        createBodyInfo = {
          Contacts: [
            {
              Name: createBodyInfo.contact_name,
              FirstName: createBodyInfo.primary_person_first_name || "",
              LastName: createBodyInfo.primary_person_last_name || "",
              EmailAddress: createBodyInfo.primary_person_email || "",
              Addresses: [
                {
                  AddressType: createBodyInfo.address_type_of || "",
                  City: createBodyInfo.address_city_town || "",
                  Region: createBodyInfo.address_state_region || "",
                  PostalCode: createBodyInfo.address_postal_zip_code || "",
                  Country: createBodyInfo.address_country || "",
                  AttentionTo: createBodyInfo.address_attention || "",
                  AddressLine1: createBodyInfo.address_line_1 || "",
                  AddressLine2: createBodyInfo.address_line_2 || ""
                }
              ],
              Phones: [
                {
                  PhoneType: "FAX",
                  PhoneNumber: createBodyInfo.fax_number || "",
                  PhoneAreaCode: createBodyInfo.fax_area_code  || "",
                  PhoneCountryCode: createBodyInfo.fax_country_code  || ""
                },
                {
                  PhoneType: "DDI",
                  PhoneNumber: createBodyInfo.direct_dial_number || "",
                  PhoneAreaCode: createBodyInfo.direct_dial_area_code  || "",
                  PhoneCountryCode: createBodyInfo.direct_dial_country_code  || ""
                },
                {
                  PhoneType: "MOBILE",
                  PhoneNumber: createBodyInfo.mobile_number || "",
                  PhoneAreaCode: createBodyInfo.mobile_area_code  || "",
                  PhoneCountryCode: createBodyInfo.mobile_country_code  || ""
                },
                {
                  PhoneType: "DEFAULT",
                  PhoneNumber: createBodyInfo.phone_number || "",
                  PhoneAreaCode: createBodyInfo.phone_area_code  || "",
                  PhoneCountryCode: createBodyInfo.phone_country_code  || ""
                }
              ],
              TaxNumber: createBodyInfo.tax_number || "",
              AccountNumber: createBodyInfo.bank_account_number || ""
            }
          ]

        };
        cleanObject(createBodyInfo.Contacts[0]);
      };
      
      if (item.selectedNode.selectedEventName === "create_new_quote_draft") {
          apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
          
          bodyInfo = {
            Contact: {
              ContactID: bodyInfo.contact
            },
            Date: bodyInfo.date,
            ExpiryDate: bodyInfo.expiry,
            QuoteNumber: bodyInfo.quote_number,
            Reference: bodyInfo.reference,
            Title: bodyInfo.title,
            Summary: bodyInfo.summary,
            CurrencyCode: bodyInfo.currency,
            LineAmountTypes: bodyInfo.amounts_are,
            LineItems: [
              {
                ItemCode: bodyInfo.item_code,
                Description: bodyInfo.description,
                Quantity: bodyInfo.quantity_1_0 || 1,
                UnitAmount: bodyInfo.unit_price_1_0 || 1,
                LineAmount: bodyInfo.discount___1_0,
                AccountCode: bodyInfo.account,
                TaxType: bodyInfo.item_tax_rate
              }
            ],
            Terms: bodyInfo.terms
          };
          cleanObject(bodyInfo);
      };

      if (item.selectedNode.selectedEventName === "create_purchase_order") {
        apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
        bodyInfo = {
          Contact: {
            ContactID: bodyInfo.contact_supplier
          },
            Date: bodyInfo.date || new Date().toISOString().slice(0, 10),
            DeliveryDate: bodyInfo.delivery_date,
            Reference: bodyInfo.reference,
            BrandingThemeID: bodyInfo.theme,
            LineAmountTypes: bodyInfo.tax_type,
            CurrencyCode: bodyInfo.currency,
            LineItems: [
              {
                ItemCode: bodyInfo.item_code,
                Description: bodyInfo.description,
                UnitAmount: bodyInfo.unit_price_1_0 || 1,
                TaxType: bodyInfo.item_tax_rate,
                AccountCode: bodyInfo.account,
                Quantity: bodyInfo.quantity_1_0,
                DiscountRate: bodyInfo.discount___1_0
              }
            ],
            DeliveryAddress: bodyInfo.delivery_address,
            AttentionTo: bodyInfo.attention,
            Telephone: bodyInfo.telephone,
            DeliveryInstructions: bodyInfo.delivery_instructions,
            Status: bodyInfo.purchase_order_status || "DRAFT"
          }
        cleanObject(bodyInfo);
    };
      if (item.selectedNode.selectedEventName === "create_credit_note") {
        apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
        bodyInfo = {
            Type: bodyInfo.Type,
            Contact: {
              ContactID: bodyInfo.contact
            },
            Date: bodyInfo.date || new Date().toISOString().slice(0, 10),
            CurrencyCode: bodyInfo.currency,
            LineAmountTypes: bodyInfo.tax_type,
            LineItems: [
              {
                ItemCode: bodyInfo.item_code,
                Description: bodyInfo.description,
                AccountCode: bodyInfo.account,
                Quantity: bodyInfo.quantity_1_0,
                UnitAmount: bodyInfo.unit_price_1_0 || 1,
                TaxType: bodyInfo.item_tax_rate,
              }
            ],
            Status: bodyInfo.credit_note_status
        }
        cleanObject(bodyInfo);
      };
      if (item.selectedNode.selectedEventName === "create_items") {
        apiUrl = apiUrl + item.selectedNode.selectedEvent.apiUrl;
          bodyInfo = {
            Code: bodyInfo.code,
            Name: bodyInfo.name,
            Description: bodyInfo.description,
            PurchaseDetails: {
              UnitPrice: bodyInfo.unit_price_1_0 || 1,
              AccountCode: bodyInfo.account,
              TaxType: bodyInfo.items_tax_type
            }
          }
          cleanObject(bodyInfo);
      };

      const body = {
        headerValue: {  
          Authorization: "Bearer " + item.connectionData.tokenInfo.access_token,
          "Content-Type": "application/json",
          Accept: "application/json",
          "xero-tenant-id": item.connectionData.memberId
        },
        methodType: item.selectedNode.selectedEvent.apiType,
        apiUrl: apiUrl,
        commonInfo: item.selectedNode.commonInfo,
        nodeId: item.selectedNode.id,
        cliType: item.selectedNode.selectedCLI,
        eventType: item.selectedNode.selectedEventName,
        bodyInfo: (Object.keys(createBodyInfo).length > 0) ? createBodyInfo :  bodyInfo,
      };
      this.props.loaderOnSelectEvent(true);
      try {
        httpClient
          .post(XERO_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              if (!res.data.responseBody.errorMessage) {
                let response = res.data.responseBody;
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

  ReplaceOfKeyWithUnder(fields) {
    let results = []
    fields.map(ele => {
      if(ele.key.includes(" ")) {
        results.push({
          key: ele.key.replace(" - ", "_").replace("/", "_"),
          value: ele.value
        })
      }else if(!ele.key.includes(" ")) {
        results.push({
          key: ele.key,
          value: ele.value
        })
      }
    });
    return results;
  }

  ReplaceOfKeyWithDot(fields) {
    let results = []
    fields.map(ele => {
      if(ele.key.includes(".")) {
        results.push({
          key: ele.key.replace(".", "_").replace("%", "_"),
          value: ele.value
        })
      }else if(!ele.key.includes(".")) {
        results.push({
          key: ele.key,
          value: ele.value
        })
      }
    });
    return results;
  }


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
})(XeroActionTest);
