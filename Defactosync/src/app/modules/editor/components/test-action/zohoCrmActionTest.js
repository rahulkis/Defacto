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
  ZOHOCRM_WEBHOOK_URLS,
} from "constants/AppConst";

class ZohoCrmActionTest extends React.Component {
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
          .post(ZOHOCRM_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
          .then((res) => {
            if (res.data.statusCode === 200) {


              let response = res.data.data.responseInfo.body;
              if (item.selectedNode.selectedEventName === "create_module") {
                response = JSON.parse(response);
              }
              this.setState({
                actionTestInfo: response ? response : { message: "Record not found" },
                isTested: true,
              });


              // let response = res.data.data.responseInfo.body;
              // this.setState({
              //   actionTestInfo: response,
              //   isTested: true,
              // });
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
        emptyFields:
          item.selectedNode.selectedEvent.value === "create_module" ||
            item.selectedNode.selectedEvent.value === "update_module"
            ? []
            : fields1.concat(fields2),
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
      let apiUrl =
        item.connectionData.endPoint + item.selectedNode.selectedEvent.apiUrl;
      if (item.selectedNode.selectedEventName === "add_tag") {
        apiUrl = apiUrl
          .replace("{module_api_name}", bodyInfo.Module)
          .replace("{record_id}", bodyInfo.id)
          .replace("{tags}", bodyInfo.tag);
      }
      if (item.selectedNode.selectedEventName === "find_module") {
        apiUrl = apiUrl
          .replace("{module}", bodyInfo.Module)
          .replace("{field}", bodyInfo.field_name)
          .replace("{value}", bodyInfo.value);
      }
      if (item.selectedNode.selectedEventName === "convert_lead") {
        apiUrl = apiUrl.replace("{record_id}", bodyInfo.record_id);
        bodyInfo = {
          data: [
            {
              notify_lead_owner:
                bodyInfo.notify_lead_owner === "true" ? true : false,
              notify_new_entity_owner:
                bodyInfo.notify_new_entity_owner === "true" ? true : false,
              Accounts: bodyInfo.Accounts ? bodyInfo.Accounts : "",
              Contacts: bodyInfo.Contacts ? bodyInfo.Contacts : "",
              assign_to: bodyInfo.assign_to ? bodyInfo.assign_to : "",
              overwrite: bodyInfo.overwrite === "true" ? true : false,
            },
          ],
        };
        cleanObject(bodyInfo.data[0]);
      }
      if (item.selectedNode.selectedEventName === "update_module") {
        apiUrl = apiUrl.replace("{module_api_name}", bodyInfo.Module);
        bodyInfo = {
          data: [
            {
              id: bodyInfo.id,
              Annual_Revenue: bodyInfo.Annual_Revenue,
              City: bodyInfo.City,
              Company: bodyInfo.Company,
              Country: bodyInfo.Country,
              Designation: bodyInfo.Designation,
              Email: bodyInfo.Email,
              Email_Opt_Out: bodyInfo.Email_Opt_Out
                ? bodyInfo.Email_Opt_Out === "true"
                  ? true
                  : false
                : false,
              Fax: bodyInfo.Fax,
              First_Name: bodyInfo.First_Name,
              Industry: bodyInfo.Industry,
              Last_Name: bodyInfo.Last_Name,
              Lead_Source: bodyInfo.Lead_Source,
              Lead_Status: bodyInfo.Lead_Status,
              Mobile: bodyInfo.Mobile,
              Module: bodyInfo.Module,
              No_of_Employees: bodyInfo.No_of_Employees,
              Owner: bodyInfo.Owner,
              Phone: bodyInfo.Phone,
              Rating: bodyInfo.Rating,
              Record_Image: bodyInfo.Record_Image,
              Salutation: bodyInfo.Salutation,
              Secondary_Email: bodyInfo.Secondary_Email,
              Skype_ID: bodyInfo.Skype_ID,
              State: bodyInfo.State,
              Twitter: bodyInfo.Twitter,
              Website: bodyInfo.Website,
              Zip_Code: bodyInfo.Zip_Code,
              Account_Name: bodyInfo.Account_Name,
              Assistant: bodyInfo.Assistant,
              Asst_Phone: bodyInfo.Asst_Phone,
              Date_of_Birth: bodyInfo.Date_of_Birth,
              Department: bodyInfo.Department,
              Home_Phone: bodyInfo.Home_Phone,
              Mailing_Street: bodyInfo.Mailing_Street,
              Other_City: bodyInfo.Other_City,
              Other_Country: bodyInfo.Other_Country,
              Other_Phone: bodyInfo.Other_Phone,
              Other_State: bodyInfo.Other_State,
              Other_Street: bodyInfo.Other_Street,
              Other_Zip: bodyInfo.Other_Zip,
              Reporting_To: bodyInfo.Reporting_To,
              Account_Number: bodyInfo.Account_Number,
              Account_Site: bodyInfo.Account_Site,
              Account_Type: bodyInfo.Account_Type,
              Billing_City: bodyInfo.Billing_City,
              Billing_Code: bodyInfo.Billing_Code,
              Billing_State: bodyInfo.Billing_State,
              Billing_Street: bodyInfo.Billing_Street,
              Ownership: bodyInfo.Ownership,
              Parent_Account: bodyInfo.Parent_Account,
              SIC_Code: bodyInfo.SIC_Code,
              Shipping_Code: bodyInfo.Shipping_Code,
              Shipping_Country: bodyInfo.Shipping_Country,
              Shipping_Street: bodyInfo.Shipping_Street,
              Ticker_Symbol: bodyInfo.Ticker_Symbol,
              Stage: bodyInfo.Stage,
              Sales_Cycle_Duration: bodyInfo.Sales_Cycle_Duration,
              Probability: bodyInfo.Probability,
              Campaign_Source: bodyInfo.Campaign_Source,
              Contact_Name: bodyInfo.Contact_Name,
              Deal_Name: bodyInfo.Deal_Name,
              Expected_Revenue: bodyInfo.Expected_Revenue,
              Next_Step: bodyInfo.Next_Step,
              Overall_Sales_Duration: bodyInfo.Overall_Sales_Duration,
              Actual_Cost: bodyInfo.Actual_Cost,
              Budgeted_Cost: bodyInfo.Budgeted_Cost,
              Campaign_Name: bodyInfo.Campaign_Name,
              End_Date: bodyInfo.End_Date,
              Expected_Response: bodyInfo.Expected_Response,
              Parent_Campaign: bodyInfo.Parent_Campaign,
              Start_Date: bodyInfo.Start_Date,
              Status: bodyInfo.Status,
              All_day: bodyInfo.All_day,
              Check_In_Address: bodyInfo.Check_In_Address,
              Check_In_By: bodyInfo.Check_In_By,
              Check_In_City: bodyInfo.Check_In_City,
              Check_In_State: bodyInfo.Check_In_State,
              Check_In_Status: bodyInfo.Check_In_Status,
              Check_In_Sub_Locality: bodyInfo.Check_In_Sub_Locality,
              End_DateTime: bodyInfo.End_DateTime,
              Event_Title: bodyInfo.Event_Title,
              Longitude: bodyInfo.Longitude,
              Latitude: bodyInfo.Latitude,
              Recurring_Activity: bodyInfo.Recurring_Activity,
              Type: bodyInfo.Type,
              Venue: bodyInfo.Venue,
              What_Id: bodyInfo.What_Id,
              Who_Id: bodyInfo.Who_Id,
              ZIP_Code: bodyInfo.ZIP_Code,
              Closed_Time: bodyInfo.Closed_Time,
              Due_Date: bodyInfo.Due_Date,
              Priority: bodyInfo.Priority,
              Remind_At: bodyInfo.Remind_At,
              Send_Notification_Email: bodyInfo.Send_Notification_Email,
              Subject: bodyInfo.Subject,
              Note_Content: bodyInfo.Note_Content,
              Parent_Id: bodyInfo.Parent_Id,
              CTI_Entry: bodyInfo.CTI_Entry,
              Call_Duration_in_seconds: bodyInfo.Call_Duration_in_seconds,
              Call_Purpose: bodyInfo.Call_Purpose,
              Call_Result: bodyInfo.Call_Result,
              Call_Start_Time: bodyInfo.Call_Start_Time,
              Call_Status: bodyInfo.Call_Status,
              Call_Type: bodyInfo.Call_Type,
              se_module: bodyInfo.Parent_Module,
            },
          ],
          trigger: [bodyInfo.trigger],
        };

        cleanObject(bodyInfo.data[0]);

      }
      if (item.selectedNode.selectedEventName === "create_module") {

        apiUrl = apiUrl.replace("{module_api_name}", bodyInfo.Module);
        bodyInfo = {
          data: [
            {
              Annual_Revenue: bodyInfo.Annual_Revenue,
              City: bodyInfo.City,
              Company: bodyInfo.Company,
              Country: bodyInfo.Country,
              Designation: bodyInfo.Designation,
              Email: bodyInfo.Email,
              Email_Opt_Out: bodyInfo.Email_Opt_Out
                ? bodyInfo.Email_Opt_Out === "true"
                  ? true
                  : false
                : false,
              Fax: bodyInfo.Fax,
              First_Name: bodyInfo.First_Name,
              Industry: bodyInfo.Industry,
              Last_Name: bodyInfo.Last_Name,
              Lead_Source: bodyInfo.Lead_Source,
              Lead_Status: bodyInfo.Lead_Status,
              Mobile: bodyInfo.Mobile,
              Module: bodyInfo.Module,
              No_of_Employees: bodyInfo.No_of_Employees,
              Owner: bodyInfo.Owner,
              Phone: bodyInfo.Phone,
              Rating: bodyInfo.Rating,
              Record_Image: bodyInfo.Record_Image,
              Salutation: bodyInfo.Salutation,
              Secondary_Email: bodyInfo.Secondary_Email,
              Skype_ID: bodyInfo.Skype_ID,
              State: bodyInfo.State,
              Twitter: bodyInfo.Twitter,
              Website: bodyInfo.Website,
              Zip_Code: bodyInfo.Zip_Code,
              Account_Name: bodyInfo.Account_Name,
              Assistant: bodyInfo.Assistant,
              Asst_Phone: bodyInfo.Asst_Phone,
              Date_of_Birth: bodyInfo.Date_of_Birth,
              Department: bodyInfo.Department,
              Home_Phone: bodyInfo.Home_Phone,
              Mailing_Street: bodyInfo.Mailing_Street,
              Other_City: bodyInfo.Other_City,
              Other_Country: bodyInfo.Other_Country,
              Other_Phone: bodyInfo.Other_Phone,
              Other_State: bodyInfo.Other_State,
              Other_Street: bodyInfo.Other_Street,
              Other_Zip: bodyInfo.Other_Zip,
              Reporting_To: bodyInfo.Reporting_To,
              Account_Number: bodyInfo.Account_Number,
              Account_Site: bodyInfo.Account_Site,
              Account_Type: bodyInfo.Account_Type,
              Billing_City: bodyInfo.Billing_City,
              Billing_Code: bodyInfo.Billing_Code,
              Billing_State: bodyInfo.Billing_State,
              Billing_Street: bodyInfo.Billing_Street,
              Ownership: bodyInfo.Ownership,
              Parent_Account: bodyInfo.Parent_Account,
              SIC_Code: bodyInfo.SIC_Code,
              Shipping_Code: bodyInfo.Shipping_Code,
              Shipping_Country: bodyInfo.Shipping_Country,
              Shipping_Street: bodyInfo.Shipping_Street,
              Ticker_Symbol: bodyInfo.Ticker_Symbol,
              Stage: bodyInfo.Stage,
              Sales_Cycle_Duration: bodyInfo.Sales_Cycle_Duration,
              Probability: bodyInfo.Probability,
              Campaign_Source: bodyInfo.Campaign_Source,
              Contact_Name: bodyInfo.Contact_Name,
              Deal_Name: bodyInfo.Deal_Name,
              Expected_Revenue: bodyInfo.Expected_Revenue,
              Next_Step: bodyInfo.Next_Step,
              Overall_Sales_Duration: bodyInfo.Overall_Sales_Duration,
              Actual_Cost: bodyInfo.Actual_Cost,
              Budgeted_Cost: bodyInfo.Budgeted_Cost,
              Campaign_Name: bodyInfo.Campaign_Name,
              End_Date: bodyInfo.End_Date,
              Expected_Response: bodyInfo.Expected_Response,
              Parent_Campaign: bodyInfo.Parent_Campaign,
              Start_Date: bodyInfo.Start_Date,
              Status: bodyInfo.Status,
              All_day: bodyInfo.All_day,
              Check_In_Address: bodyInfo.Check_In_Address,
              Check_In_By: bodyInfo.Check_In_By,
              Check_In_City: bodyInfo.Check_In_City,
              Check_In_State: bodyInfo.Check_In_State,
              Check_In_Status: bodyInfo.Check_In_Status,
              Check_In_Sub_Locality: bodyInfo.Check_In_Sub_Locality,
              End_DateTime: bodyInfo.End_DateTime,
              Event_Title: bodyInfo.Event_Title,
              Longitude: bodyInfo.Longitude,
              Latitude: bodyInfo.Latitude,
              Recurring_Activity: bodyInfo.Recurring_Activity,
              Type: bodyInfo.Type,
              Venue: bodyInfo.Venue,
              What_Id: bodyInfo.What_Id,
              Who_Id: bodyInfo.Who_Id,
              ZIP_Code: bodyInfo.ZIP_Code,
              Closed_Time: bodyInfo.Closed_Time,
              Due_Date: bodyInfo.Due_Date,
              Priority: bodyInfo.Priority,
              Remind_At: bodyInfo.Remind_At,
              Send_Notification_Email: bodyInfo.Send_Notification_Email,
              Subject: bodyInfo.Subject,
              Note_Content: bodyInfo.Note_Content,
              Parent_Id: bodyInfo.Parent_Id,
              CTI_Entry: bodyInfo.CTI_Entry,
              Call_Duration_in_seconds: bodyInfo.Call_Duration_in_seconds,
              Call_Purpose: bodyInfo.Call_Purpose,
              Call_Result: bodyInfo.Call_Result,
              Call_Start_Time: bodyInfo.Call_Start_Time,
              Call_Status: bodyInfo.Call_Status,
              Call_Type: bodyInfo.Call_Type,
              se_module: bodyInfo.Parent_Module,
            },
          ],
          trigger: [bodyInfo.trigger],
        };
        cleanObject(bodyInfo.data[0]);
      }
      if (item.selectedNode.selectedEventName === "add_attachment") {
        apiUrl = apiUrl
          .replace("{module_api_name}", bodyInfo.Module)
          .replace("{record_id}", bodyInfo.id);
        bodyInfo = {
          attachmentUrl: bodyInfo.attachment_file,
        };
        cleanObject(bodyInfo);
      }
      if (item.selectedNode.selectedEventName === "update_related_module") {
        apiUrl = apiUrl
          .replace("{module_api_name}", bodyInfo.Update_Module)
          .replace("{record_id}", bodyInfo.id)
          .replace("{related_list_api_name}", bodyInfo.Related_Module)
          .replace("{related_record_id}", bodyInfo.Related_id);
        bodyInfo = {
          data: [
            {
              id: bodyInfo.Related_id,
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
          .post(ZOHOCRM_WEBHOOK_URLS.GET_TEST_ACTION_REQUEST, body)
          .then((res) => {

            if (res.data.statusCode === 200) {
              if (!res.data.responseBody.errorMessage) {
                let response = res.data.responseBody;
                if (item.selectedNode.selectedEventName === "create_module") {
                  response = JSON.parse(res.data.responseBody);
                }
                if (response) {
                  this.setState({
                    actionTestInfo: response,
                    isTested: true,
                  });
                  this.props.onConnectionTested();
                } else {
                  this.setState({
                    actionTestInfo: { message: "Record not found" },
                    isTested: true,
                  });
                  this.props.onConnectionTested();
                }
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
                <div className="col-md-6"></div>
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
})(ZohoCrmActionTest);
