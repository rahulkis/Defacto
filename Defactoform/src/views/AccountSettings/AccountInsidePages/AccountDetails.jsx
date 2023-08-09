import React from "react";
import "../../../assets/custom/AccountSettings.css";
import Select from "react-select";
import { GetData, UpdateData } from "../../../stores/requests";
import { ACCOUNT_SETTINGS } from "../../../util/constants";
import Loader from "../../../components/Common/Loader";

let currency = require("../../../JsonData/Curreny.json");
let countries = require("../../../JsonData/countries.json");
let timezonelst = require("../../../JsonData/TimeZones.json");
let dateFormatlst = require("../../../JsonData/DateFormat.json");
let statelst = require("../../../JsonData/States.json");
class AccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribedNewsPaper: false,
      brandingForms: false,
      userName: "",
      userEmail: "",
      default_Currency: "",
      default_Country: "",
      default_State: "",
      default_TimeZone: "",
      default_DateFormat: "",
      businessName: "",
      businessWebsite: "",
      nameValidation: "",
      emailValidation: "",
      isLoader: false,
      btnSubmitText: "Submit",
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.dropdownHandler = this.dropdownHandler.bind(this);
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
    this.AllStates = statelst;
  }

  componentWillMount = async () => {
    await this.Account_Details();
  };
  Account_Details = async () => {
    this.setState({ isLoader: true });

    try {
      const URL = ACCOUNT_SETTINGS.GETACCOUNT_SETTINGS + this.loginUserId;
      GetData(URL).then((result) => {
        if (result.statusCode === 200) {
          let resultedItem = result.data;
          resultedItem = JSON.parse(resultedItem);
          this.BindDataIntoState(resultedItem);
          this.setState({ isLoader: false });
        }
      });
    } catch (err) {
      this.setState({ isLoader: false });
    }
  };

  BindDataIntoState(resultInfo) {
    if (resultInfo.Items.length > 0) {
      let info = resultInfo.Items[0];
      this.setState({
        subscribedNewsPaper: info.SubscribedNewsPaper,
        brandingForms:
          info.FormBranding === undefined ? false : info.FormBranding,
        userName: info.Name,
        userEmail: info.Email,
        default_Currency: info.Currency === undefined ? "" : info.Currency,
        default_Country: info.Country === undefined ? "" : info.Country,
        default_State: info.State === null ? "" : info.State,
        default_TimeZone: info.TimeZoneId === undefined ? "" : info.TimeZoneId,
        default_DateFormat:
          info.DateFormat === undefined ? "" : info.DateFormat,
        businessName: info.BusinessName === undefined ? "" : info.BusinessName,
        businessWebsite:
          info.BusinessWebsite === undefined ? "" : info.BusinessWebsite,
      });

      if (info.Country === "AU" || info.Country === "US") {
        statelst = this.AllStates.filter(
          (cur) => cur.CountryId === info.Country
        );
      }
    }
  }

  handleChange = (e, key) => {
    this.setState({ [key]: e });
  };
  inputHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "userEmail" && event.target.value === "") {
      this.setState({ emailValidation: "" });
    } else if (event.target.name === "userName") {
      this.setState({ nameValidation: "" });
    } else if (this.state.userEmail.indexOf("@") !== -1) {
      this.setState({ emailValidation: "" });
    }
  };
  dropdownHandler = (key, event) => {
    this.setState({ [key]: event.value });

    if (key === "default_Country") {
      statelst = this.AllStates.filter((cur) => cur.CountryId === event.value);
    }
  };

  handleSubmit = (e) => {
    this.setState({ isLoader: true });
    let isValid = true;
    if (this.state.userName === "") {
      isValid = false;
      this.setState({ nameValidation: "THIS QUESTION IS REQUIRED" });
    } else if (this.state.userEmail === "") {
      isValid = false;
      this.setState({ emailValidation: "THIS QUESTION IS REQUIRED" });
    } else if (this.state.userEmail !== "") {
      if (!(this.state.userEmail.indexOf("@") !== -1)) {
        isValid = false;
        this.setState({ emailValidation: "Email is not valid." });
      }
    }
    if (!isValid) {
      this.setState({ isLoader: false });
      return;
    }

    let formModel = {
      UserId: this.loginUserId,
      UserEmail: this.state.userEmail,
      UserName: this.state.userName,
      SubscribedNewsPaper: this.state.subscribedNewsPaper,
      BusinessName: this.state.businessName,
      BusinessWebsite: this.state.businessWebsite,
      Country: this.state.default_Country,
      State: this.state.default_State,
      Currency: this.state.default_Currency,
      DateFormat: this.state.default_DateFormat,
      FormBranding: this.state.brandingForms,
      TimeZoneId: this.state.default_TimeZone,
      UpdateAt: Date.now(),
    };
    try {
      UpdateData(ACCOUNT_SETTINGS.UPDATE_ACCOUNTDETAILS, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            this.setState({ isLoader: false });
          }
        }
      );
    } catch (err) {
      alert("Something went wrong, please try again.");
      this.setState({ isLoader: false });
    }
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div>
        <div className="AccountSection-div">Account Details</div>
        <div className="LiveField" style={{ width: "100%" }}>
          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Name</span>
              </div>
              <div className="LiveField__answer">
                <input
                  placeholder=""
                  data="[object Object]"
                  name="userName"
                  className="LiveField__input"
                  type="text"
                  onChange={this.inputHandler}
                  defaultValue={this.state.userName}
                />
              </div>
              {this.state.nameValidation !== "" && (
                <div className="LiveField__error AccountSection-validation">
                  {this.state.nameValidation}
                </div>
              )}
            </div>
          </div>
          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Email</span>
              </div>
              <div className="LiveField__answer">
                <input
                  placeholder=""
                  data="[object Object]"
                  name="userEmail"
                  className="LiveField__input"
                  type="text"
                  onChange={this.inputHandler}
                  defaultValue={this.state.userEmail}
                />
              </div>
              {this.state.emailValidation !== "" && (
                <div className="LiveField__error AccountSection-validation">
                  {this.state.emailValidation}
                </div>
              )}
            </div>
          </div>

          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Subscribed to newsletter</span>
              </div>
              <div className="LiveField__answer">
                <div className="ProductConfiguration__DefaultBlock">
                  <div className="YesNo">
                    <label
                      value="Yes"
                      onClick={(e) =>
                        this.handleChange(true, "subscribedNewsPaper")
                      }
                      className={
                        this.state.subscribedNewsPaper === true
                          ? "btn-raised btn-primary"
                          : "btn-raised btn-default"
                      }
                    >
                      yes
                    </label>
                    <label
                      value="No"
                      onClick={(e) =>
                        this.handleChange(false, "subscribedNewsPaper")
                      }
                      className={
                        this.state.subscribedNewsPaper === false
                          ? "btn-raised btn-primary"
                          : "btn-raised btn-default"
                      }
                    >
                      no
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Currency</span>
                <br />
                <h5>
                  {" "}
                  payments made via your forms will be taken in this currency
                </h5>
              </div>
              <div className="LiveField__answer">
                <Select
                  name="default_Currency"
                  value={currency.find(
                    (cur) => cur.value === this.state.default_Currency
                  )}
                  onChange={(e) => this.dropdownHandler("default_Currency", e)}
                  id="currencyId"
                  options={currency}
                />
              </div>
            </div>
          </div>

          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Country</span>
              </div>
              <div className="LiveField__answer">
                <Select
                  name="default_Country"
                  options={countries}
                  value={countries.find(
                    (cur) => cur.value === this.state.default_Country
                  )}
                  onChange={(e) => this.dropdownHandler("default_Country", e)}
                  id="countryId"
                />
              </div>
            </div>
          </div>

          {(this.state.default_Country === "AU" ||
            this.state.default_Country === "US") && (
            <div className="LiveField__container">
              <div>
                <div className="LiveField__header">
                  <span>State</span>
                </div>
                <div className="LiveField__answer">
                  <Select
                    name="default_State"
                    options={statelst}
                    value={statelst.find(
                      (cur) => cur.value === this.state.default_State
                    )}
                    onChange={(e) => this.dropdownHandler("default_State", e)}
                    id="stateId"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>TimeZone</span>
                <br />
                <h5>
                  {" "}
                  The timezone is used to display your local time across
                  reporting, exports and integrations.
                </h5>
              </div>
              <div className="LiveField__answer">
                <Select
                  name="default_TimeZone"
                  options={timezonelst}
                  onChange={(e) => this.dropdownHandler("default_TimeZone", e)}
                  value={timezonelst.find(
                    (cur) => cur.value === this.state.default_TimeZone
                  )}
                  id="timezoneId"
                />
              </div>
            </div>
          </div>

          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>DateFormat</span>
                <br />
                <h5>
                  {" "}
                  The format determines how dates are displayed in reports,
                  exports and integrations.
                </h5>
              </div>
              <div className="LiveField__answer">
                <Select
                  name="default_DateFormat"
                  options={dateFormatlst}
                  value={dateFormatlst.find(
                    (cur) => cur.value === this.state.default_DateFormat
                  )}
                  id="dateFormatId"
                  onChange={(e) =>
                    this.dropdownHandler("default_DateFormat", e)
                  }
                />
              </div>
            </div>
          </div>
          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Business Name</span>
              </div>
              <div className="LiveField__answer">
                <input
                  placeholder=""
                  data="[object Object]"
                  name="businessName"
                  className="LiveField__input"
                  type="text"
                  onChange={this.inputHandler}
                  defaultValue={this.state.businessName}
                />
              </div>
            </div>
          </div>
          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Business Website</span>
              </div>
              <div className="LiveField__answer">
                <input
                  placeholder=""
                  data="[object Object]"
                  name="businessWebsite"
                  className="LiveField__input"
                  type="text"
                  onChange={this.inputHandler}
                  defaultValue={this.state.businessWebsite}
                />
              </div>
            </div>
          </div>

          <div className="LiveField__container">
            <div>
              <div className="LiveField__header">
                <span>Disable Defactoform branding on forms</span>
              </div>
              <div className="LiveField__answer">
                <div className="ProductConfiguration__DefaultBlock">
                  <div className="YesNo">
                    <label
                      value="Yes"
                      onClick={(e) => this.handleChange(true, "brandingForms")}
                      className={
                        this.state.brandingForms === true
                          ? "btn-raised btn-primary"
                          : "btn-raised btn-default"
                      }
                    >
                      yes
                    </label>
                    <label
                      value="No"
                      onClick={(e) => this.handleChange(false, "brandingForms")}
                      className={
                        this.state.brandingForms === false
                          ? "btn-raised btn-primary"
                          : "btn-raised btn-default"
                      }
                    >
                      no
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="BtnV2 BtnV2--disabled BtnV2--primary acctSubmit-btn-alignment"
          tabIndex="-1"
          onClick={(e) => this.handleSubmit(e)}
        >
          <span>{this.state.btnSubmitText}</span>
        </div>
      </div>
    );
  }
}

export default AccountDetails;
