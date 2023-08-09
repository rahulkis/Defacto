import React from "react";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import DateTimePicker from "react-datetime-picker";
import { GetData, PostData } from "../../stores/requests";
import "../../../src/assets/custom/question_control.css";
import {
  CONFIGURE_PAYMENTS_URLS,
  PAYMENT_ACCOUNT_URLS,
} from "../../util/constants";
import { store } from "../../index";
import { fetchPaymentConfigInfo } from "../../actions";

import currencyData from "../../JsonData/Curreny.json";
class ConfigurePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewData: "",
      isCoupons: false,
      isCustomPriceRules: false,
      couponList: [],
      addRulesList: [],
      taxPercentage: 0,
      processingFeePercentage: 0,
      processingFeeAmount: 0,
      selectedCurrency: {},
      paymentAccountList: [],
      currencyList: [],
      selectedAccountType: "",
      squareLocation: [],
      selectedLocationId: "",
      selectedCheckOut: "",
      checkOutType: "POS",
      selectedPosMethod: [
        { value: "Credit Card", label: "Credit Card" },
        { value: "Cash ", label: "Cash" },
      ],
      posPaymentMethods: [
        { value: "Credit Card", label: "Credit Card" },
        { value: "Cash ", label: "Cash" },
        { value: "Square Gift card", label: "Square Gift card" },
        { value: "Other", label: "Other" },
      ],
      checkoutTypes: [
        {
          value: "POS",
          label: "Point of Sales",
        },
        {
          value: "WP",
          label: "Web Payment",
        },
      ],
      selectedAccountId: "#",
      selectedPaymentAccount: {},
    };
    this.rulesCount = 0;
    this.questionJson = JSON.parse(localStorage.getItem("formJSON"));
    this.FormId = localStorage.CurrentFormId;
  }
  setPayment = (event) => {
    window.open("../user/PaymentIntegrations", "_blank");
  };
  onSwitchChange = (field) => (event) => {
    this.setState({ [field]: event.target.checked });
  };

  getPaymentAccountList = (userId) => {
    const currentUserId = userId || this.state.currentUserId;
    GetData(
      PAYMENT_ACCOUNT_URLS.GET_PAYMENT_ACCOUNT_BY_USER + currentUserId
    ).then((result) => {
      if (
        result != null &&
        result.data.Items !== undefined &&
        result.data.Items.length > 0
      ) {
        this.setState({
          isPaymentList: true,
          paymentAccountList: result.data.Items,
        });
      } else {
        this.setState({ paymentAccountList: [] });
      }
    });
  };
  onChangeAccount = (e) => {
    let selectedAccnt = this.state.paymentAccountList.find(
      (payment) => payment.PaymentAccountId === e.target.value
    );
    console.log(selectedAccnt);
    if (selectedAccnt) {
      var currencyList = [];
      if (selectedAccnt.AccountType === "Square") {
        if (selectedAccnt.Locations) {
          let squareLoc = JSON.parse(selectedAccnt.Locations);
          var drpLoc = [];
          for (let i = 0; i < squareLoc.length; i++) {
            drpLoc.push({ value: squareLoc[i].id, label: squareLoc[i].name });
            currencyList.push({
              value: squareLoc[i].currency,
              label: squareLoc[i].currency,
            });
          }
        }
        this.setState({
          selectedAccountId: e.target.value,
          selectedAccountType: selectedAccnt.AccountType,
          squareLocation: drpLoc || [],
          currencyList: currencyList,
        });
        //this.setState({selectedLocationId:{value:squareLoc[0].id,label:squareLoc[0].name}});
      } else {
        this.setState({
          selectedAccountId: e.target.value,
          selectedAccountType: selectedAccnt.AccountType,
          selectedCurrency: this.state.currencyList[4],
        });
      }
    } else {
      this.setState({
        selectedAccountId: e.target.value,
        selectedAccountType: {},
        currencyList: currencyList,
        selectedCurrency: this.state.currencyList[4],
      });
    }
  };
  componentWillMount() {
    this.setState({ currencyList: currencyData });

    const userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const uData = JSON.parse(userData);
      this.setState({
        currentUserId: uData.UserId,
      });
      this.getPaymentAccountList(uData.UserId);
    }

    GetData(
      CONFIGURE_PAYMENTS_URLS.GET_PAYMENT_CONFIGURATION_URL + this.FormId
    ).then((result) => {
      if (Object.keys(result.data).length > 0) {
        let resultantItem = result.data.Item;
        const paymentInfo = JSON.parse(resultantItem.PaymentAccount);
        this.setState({
          selectedCurrency: JSON.parse(resultantItem.Currency),
          taxPercentage: resultantItem.TaxPercentage,
          isCustomPriceRules: resultantItem.IsCustomPriceRules,
          isCoupons: resultantItem.IsCoupons,
          processingFeePercentage: resultantItem.ProcessingFeePercentage,
          processingFeeAmount: resultantItem.ProcessingFeeAmount,
          couponList: resultantItem.Coupons,
          addRulesList: resultantItem.Rules,
          selectedPaymentAccount: paymentInfo,
          selectedAccountId: paymentInfo.PaymentAccountId,
        });
      }
    });
  }

  componentDidMount() {
    const userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const uData = JSON.parse(userData);
      this.setState({
        currentUserId: uData.UserId,
      });
    }
  }
  savePaymentConfiguration = () => {
    const currency = this.state.selectedCurrency.value;
    const accntType = this.state.selectedAccountType;

    let paymAccnt = {};

    if (accntType === "Square") {
      let locId =
        this.state.selectedLocationId === "" && accntType === "Square"
          ? this.state.squareLocation[0]
          : "";
      paymAccnt = {
        PaymentAccountId: this.state.selectedAccountId,
        Currency: currency,
        AccountType: accntType,
        LocationId: locId,
        PossMethods: JSON.stringify(this.state.selectedPosMethod),
        checkOutType: this.state.checkOutType,
      };
    } else {
      paymAccnt = {
        PaymentAccountId: this.state.selectedAccountId,
        Currency: currency,
        AccountType: accntType,
        LocationId: "",
        PossMethods: JSON.stringify([]),
        checkOutType: "",
      };
    }
    let configurePaymentObj = {
      FormId: this.FormId,
      PaymentAccount: JSON.stringify(paymAccnt),
      Currency: JSON.stringify(this.state.selectedCurrency),
      TaxPercentage: this.state.taxPercentage,
      IsCoupons: this.state.isCoupons,
      IsCustomPriceRules: this.state.isCustomPriceRules,
      ProcessingFeePercentage: this.state.processingFeePercentage,
      ProcessingFeeAmount: this.state.processingFeeAmount,
      Coupons: this.state.couponList,
      Rules: this.state.addRulesList,
    };
    store.dispatch(fetchPaymentConfigInfo(configurePaymentObj));
    let URL = CONFIGURE_PAYMENTS_URLS.POST_PAYMENT_CONFIGURATION_URL;
    PostData(URL, configurePaymentObj).then((result) => {});
  };
  componentWillUnmount() {
    this.savePaymentConfiguration();
  }
  addCoupon = () => {
    let couponList = this.state.couponList;
    let coupon = {
      CouponCode: null,
      CouponType: "Discount Price",
      Amount: 5,
      Percentage: 0,
      ExpiresAfter: null,
      Enabled: true,
    };
    couponList.push(coupon);
    this.setState({ couponList: couponList });
  };
  removeCoupon = (index) => {
    let couponList = this.state.couponList;
    couponList.splice(index, 1);
    this.setState({
      couponList: couponList,
    });
  };
  handleChange = (event, index, fieldName) => {
    let couponList = this.state.couponList;
    couponList[index][fieldName] = event.target.value;
    this.setState({ couponList: couponList });
  };
  handleEnableDisable = (index, state) => {
    let couponList = this.state.couponList;
    if (state === true) {
      couponList[index]["Enabled"] = false;
    } else {
      couponList[index]["Enabled"] = true;
    }
    this.setState({ couponList: couponList });
  };
  addRule = () => {
    let obj = {
      id: this.rulesCount,
      value: "rule" + this.rulesCount,
      questionKey: null,
      questCondition: "isnot",
      answerVal: null,
      priceCondition: null,
      priceVal: null,
    };
    let addRulesList = this.state.addRulesList;
    addRulesList.push(obj);
    this.setState({ addRulesList: addRulesList });
    this.rulesCount++;
  };
  removeRule = (index) => {
    let addRulesList = this.state.addRulesList;
    addRulesList.splice(index, 1);
    this.setState({
      addRulesList: addRulesList,
    });
  };
  handleQuestion = (e, ruleIndex) => {
    let addRulesList = this.state.addRulesList;
    addRulesList[ruleIndex].selectedQuestion = e.target.value;
    let questionVal = e.target.value;
    let newArr = questionVal.split("_");
    addRulesList[ruleIndex].selectedQuestion = questionVal;
    addRulesList[ruleIndex].questionKey = newArr[1];
    this.setState({
      addRulesList: addRulesList,
    });
  };
  moveRule = (moveStatus, index) => {
    let addRulesList = this.state.addRulesList.slice(0);
    let currentRule = addRulesList[index];
    if (moveStatus === "up" && index !== 0) {
      let upperRule = addRulesList[index - 1];
      addRulesList[index - 1] = currentRule;
      addRulesList[index] = upperRule;
    } else if (moveStatus === "down" && index !== addRulesList.length - 1) {
      let belowRule = addRulesList[index + 1];
      addRulesList[index + 1] = currentRule;
      addRulesList[index] = belowRule;
    }
    this.setState({
      addRulesList: addRulesList,
    });
  };
  copyRule = (index) => {
    let addRulesList = this.state.addRulesList.slice(0);
    let copiedRule = Object.assign({}, addRulesList[index]);
    addRulesList.splice(index + 1, 0, copiedRule);
    let newRule = addRulesList[index + 1];
    newRule.id = index + 1;
    this.setState({
      addRulesList: addRulesList,
    });
  };
  onRuleChange = (e, index, field) => {
    let addRulesList = this.state.addRulesList.slice(0);
    addRulesList[index][field] = e.target.value;
    this.setState({
      addRulesList: addRulesList,
    });
  };
  onChangePosMethod = (e) => {
    this.setState({ selectedPosMethod: e });
  };
  setInputState = (e, stateName) => {
    this.setState({
      [stateName]: e.target.value,
    });
  };
  selectedPayment = (e) => {};
  selectAccount = (e) => {
    this.setState({ selectedAccountId: e.target.value });
  };
  selectCurrency = (value) => {
    this.setState({ selectedCurrency: value });
  };
  onChangeSquareLocation = (value) => {
    this.setState({ selectedLocationId: value });
  };
  onDateChange = (expiryDate) => {
    this.setState({ expiryDate });
  };
  onChangeCheckOut = (val) => {
    this.setState({ selectedCheckout: val, checkOutType: val.value });
  };
  render() {
    return (
      <div>
        <form className="full-preview-page preview_page_style configurepayment">
          <div className="col-md-12">
            <div className="row">
              <div className="Editor-page Editor-page-wrapper">
                <div className="content-page">
                  <div className="Paper-double">
                    <div className="col-md-6 heading-right">
                      <h2 className="Paper-Type">Configure Payments</h2>
                    </div>
                    <div className="manage-button">
                      <a
                        href="#pablo"
                        onClick={this.setPayment.bind(this)}
                        className="manage-account"
                      >
                        <span> Manage All Payment Account</span>
                      </a>
                    </div>
                    <div className="Field-Configuration">
                      <select
                        className="select-option"
                        onChange={this.onChangeAccount}
                        value={this.state.selectedAccountId || ""}
                      >
                        <option value="">No Account(Don't take payment)</option>
                        {this.state.paymentAccountList.map((track, key) => (
                          <option
                            value={track.PaymentAccountId}
                            key={"accountsListopt" + track.PaymentAccountId}
                          >
                            {track.Label}({track.AccountType}-
                            {track.PaymentMode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="Configuration-label mb-1">Currency </div>
                    <Select
                      options={this.state.currencyList}
                      value={this.state.selectedCurrency}
                      // value ={this.state.selectedCurrency}
                      onChange={(value) => this.selectCurrency(value)}
                    />
                    <div className="Field-Configuration-Field">
                      <div className="FieldConfiguration__label">
                        Payment tax percentage{" "}
                      </div>
                    </div>
                    <div className="description-Inline">
                      <svg
                        fill="currentColor"
                        preserveAspectRatio="xMidYMid meet"
                        height="1em"
                        width="1em"
                        viewBox="0 0 40 40"
                        style={{ verticalAlign: "middle" }}
                      >
                        <g>
                          <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                        </g>
                      </svg>
                      <span className="FieldConfigurationField__descriptioninlineinner">
                        {" "}
                        When set, the tax percentage is automatically added onto
                        all payments, before any processing fees. This does not
                        apply to subscriptions.
                      </span>
                    </div>
                    <div className="Field-value">
                      <input
                        className="input-number"
                        type="number"
                        minvalue="0"
                        maxvalue="100"
                        placeholder="0"
                        value={this.state.taxPercentage}
                        onChange={(e) => this.setInputState(e, "taxPercentage")}
                      />
                    </div>
                    {this.state.selectedAccountType === "Square" && (
                      <span>
                        <div className="FieldConfigurationField">
                          <div className="FieldConfiguration__label" />
                          <span>Square Location</span>
                          <div className="FieldConfiguration__value">
                            <Select
                              options={this.state.squareLocation}
                              defaultValue={this.state.squareLocation[0] || ""}
                              // value ={this.state.selectedLocationId}
                              onChange={(value) =>
                                this.onChangeSquareLocation(value)
                              }
                            />

                            {/* //onChange={(e)=>this.setState({selectedLocationId:e.target.value})} */}
                          </div>
                        </div>
                        <div className="FieldConfigurationField">
                          <div className="FieldConfiguration__label" />
                          <span>Square checkout type</span>
                          <div className="FieldConfiguration__value">
                            <Select
                              options={this.state.checkoutTypes}
                              defaultValue={this.state.checkoutTypes[0]}
                              value={this.state.selectedCheckout}
                              onChange={(value) => this.onChangeCheckOut(value)}
                            />
                          </div>
                        </div>
                        {this.state.checkOutType === "POS" && (
                          <div className="FieldConfigurationField">
                            <div className="FieldConfiguration__label" />
                            <span>Allowed POS Payment Methods</span>
                            <div className="FieldConfiguration__value">
                              <Select
                                options={this.state.posPaymentMethods}
                                value={this.state.selectedPosMethod}
                                isClearable={true}
                                isMulti={true}
                                onChange={(e) => this.onChangePosMethod(e)}
                              />
                            </div>
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="paper-double mt-4">
                    <h2 className="Paper-type">Coupons</h2>
                    <Switch
                      checked={this.state.isCoupons}
                      value="isCoupons"
                      onChange={this.onSwitchChange("isCoupons")}
                      color="primary"
                    />
                    {this.state.isCoupons && (
                      <div>
                        <div className="input-paragraph">
                          <p>
                            <small>
                              Coupons can be used to discount the price of a
                              form by a fixed amount or a percentage. For Stripe
                              subscriptions we also support using Stripe's
                              coupons, just set up the coupon in Stripe and add
                              it below (make sure to set the type to
                              "Stripe").Read more
                            </small>
                          </p>
                        </div>
                        <div
                          id="console-event"
                          className="ResultsTable-wrapper Results-noscroll"
                        >
                          <table className="Results-Table">
                            <thead>
                              <tr>
                                <th
                                  className="table-detail"
                                  style={{ width: "20%" }}
                                >
                                  Coupon Code
                                </th>
                                <th
                                  className="table-detail"
                                  style={{ width: "15%" }}
                                >
                                  Coupon Type
                                </th>
                                <th
                                  className="table-detail"
                                  style={{ width: "15%" }}
                                >
                                  Amount
                                </th>
                                <th
                                  className="table-detail"
                                  style={{ width: "15%" }}
                                >
                                  Percentage
                                </th>
                                <th
                                  className="table-detail"
                                  style={{ width: "15%" }}
                                >
                                  Expires After
                                </th>
                                <th
                                  className="table-detail"
                                  style={{ width: "10%" }}
                                >
                                  Enabled
                                </th>
                                <th
                                  className="table-detail"
                                  style={{ width: "10%" }}
                                >
                                  Delete
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.couponList.map(
                                function(couponData, i) {
                                  return (
                                    <tr key={i}>
                                      <td>
                                        <input
                                          className="header-label code-input"
                                          wrapperclassname="Field-headerlabel"
                                          placeholder="Enter Code"
                                          value={
                                            couponData.CouponCode
                                              ? couponData.CouponCode
                                              : ""
                                          }
                                          onChange={(e) =>
                                            this.handleChange(
                                              e,
                                              i,
                                              "CouponCode"
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="ResultsTable-btntd">
                                        <div className="BtnV2--raised BtnV2--primary">
                                          <span>{couponData.CouponType}</span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="number-value">
                                          <input
                                            className="input-number"
                                            type="number"
                                            minvalue="0"
                                            maxvalue="100"
                                            placeholder="0"
                                            value={
                                              couponData.Amount
                                                ? couponData.Amount
                                                : ""
                                            }
                                            disabled={!couponData.Enabled}
                                            onChange={(e) =>
                                              this.handleChange(e, i, "Amount")
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="number-value">
                                          <input
                                            className="input-number"
                                            type="number"
                                            minvalue="0"
                                            maxvalue="100"
                                            placeholder="0"
                                            value={
                                              couponData.Percentage
                                                ? couponData.Percentage
                                                : ""
                                            }
                                            disabled={!couponData.Enabled}
                                            onChange={(e) =>
                                              this.handleChange(
                                                e,
                                                i,
                                                "Percentage"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className="ResultsTable-btntd button-table">
                                        <DateTimePicker
                                          onChange={(date) =>
                                            this.onDateChange(date)
                                          }
                                          value={this.state.opendt}
                                        />
                                        {/* <input
                                          type="date"
                                          className="input-date"
                                          placeholder="YYYY-MM-DD"
                                          onChange={(e)=>this.onDateChange(e)}
                                        /> */}
                                      </td>
                                      <td
                                        className="ResultsTable-btntd"
                                        onClick={() =>
                                          this.handleEnableDisable(
                                            i,
                                            couponData.Enabled
                                          )
                                        }
                                      >
                                        <div className="BtnV2--raised BtnV2--secondary">
                                          <span>
                                            {couponData.Enabled
                                              ? "Enabled"
                                              : "Disabled"}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="ResultsTable-delete">
                                        <div
                                          className="BtnV2--raised BtnV2--warning"
                                          onClick={() => this.removeCoupon(i)}
                                        >
                                          <span>
                                            <i
                                              className="fa fa-times text-danger"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }.bind(this)
                              )}
                            </tbody>
                          </table>
                          <div className="Add-coupan-button">
                            <button
                              type="button"
                              className="btn btn-Add btn-lg btn-block"
                              onClick={() => this.addCoupon()}
                            >
                              Add Coupon+
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="paper-double mt-4">
                    <div>
                      <h2 className="Paper-type">Custom Pricing Rules</h2>
                      <Switch
                        checked={this.state.isCustomPriceRules}
                        onChange={this.onSwitchChange("isCustomPriceRules")}
                        value="isCustomPriceRules"
                        color="primary"
                      />
                    </div>
                    {this.state.isCustomPriceRules && (
                      <div>
                        <div className="input-paragraph">
                          <p>
                            <small>
                              The final price of a form can be modified by
                              defining a set of actions that are applied to the
                              overall price when questions are answered in a
                              specific way. The rules are applied in the order
                              they are listed below.
                            </small>
                          </p>
                        </div>
                        <div
                          id="console-event"
                          className="ResultsTable-wrapper  Results-noscroll dis-play-none"
                        >
                          <h5>Processing Fee(%)</h5>
                          <h6>
                            Add a percentage on top of the total of the price
                            (e.g. 2.7 for a 2.7% processing fee)
                          </h6>
                          <div className="text-value">
                            <input
                              className="input-number"
                              type="number"
                              value={this.state.processingFeePercentage}
                              minvalue="0"
                              maxvalue="100"
                              placeholder="0"
                              onChange={(e) =>
                                this.setInputState(e, "processingFeePercentage")
                              }
                            />
                          </div>

                          <h5>Processing Fee(Fixed Amount)</h5>
                          <h6>
                            Add a fixed amount on top of the total of the price
                            (e.g. 0.30 for a 30c processing fee)
                          </h6>
                          <div className="text-value">
                            <input
                              className="input-number"
                              type="number"
                              minvalue="0"
                              maxvalue="100"
                              value={this.state.processingFeeAmount}
                              placeholder="0"
                              onChange={(e) =>
                                this.setInputState(e, "processingFeeAmount")
                              }
                            />
                          </div>

                          <div className="ScoreRules">
                            <div className="ScoreRules__rule">
                              <table className="table-data">
                                <tbody>
                                  {this.state.addRulesList.map(
                                    (rule, ruleIndex) => (
                                      <tr middle="xs" key={ruleIndex}>
                                        <td className="ScoreRules__when">
                                          <span>When</span>
                                        </td>
                                        <td>
                                          <select
                                            className="select-option"
                                            onChange={(e) =>
                                              this.handleQuestion(e, ruleIndex)
                                            }
                                          >
                                            {this.questionJson.map(
                                              (data, i) => (
                                                <option
                                                  key={i}
                                                  selected={
                                                    data.key ===
                                                    this.state.addRulesList[
                                                      ruleIndex
                                                    ].questionKey
                                                  }
                                                  hidden={
                                                    data.control ===
                                                    "simpletext"
                                                      ? true
                                                      : false
                                                  }
                                                  value={
                                                    data.title + "_" + data.key
                                                  }
                                                >
                                                  {data.title !== ""
                                                    ? data.title
                                                    : "Untitled"}
                                                </option>
                                              )
                                            )}
                                            <option value="_price">
                                              Price
                                            </option>
                                          </select>
                                        </td>
                                        {this.state.addRulesList[ruleIndex]
                                          .selectedQuestion && (
                                          <td>
                                            <select
                                              className="select-option"
                                              onChange={(e) =>
                                                this.onRuleChange(
                                                  e,
                                                  ruleIndex,
                                                  "questCondition"
                                                )
                                              }
                                            >
                                              <option
                                                value="isnot"
                                                selected={
                                                  this.state.addRulesList[
                                                    ruleIndex
                                                  ].questCondition === "isnot"
                                                }
                                              >
                                                isn't
                                              </option>
                                              <option
                                                value="isAnswered"
                                                selected={
                                                  this.state.addRulesList[
                                                    ruleIndex
                                                  ].questCondition ===
                                                  "isAnswered"
                                                }
                                              >
                                                is answered
                                              </option>
                                              <option
                                                value="isnotAnswered"
                                                selected={
                                                  this.state.addRulesList[
                                                    ruleIndex
                                                  ].questCondition ===
                                                  "isnotAnswered"
                                                }
                                              >
                                                isn't answered
                                              </option>
                                              <option
                                                value="contains"
                                                selected={
                                                  this.state.addRulesList[
                                                    ruleIndex
                                                  ].questCondition ===
                                                  "contains"
                                                }
                                              >
                                                contains
                                              </option>
                                              <option
                                                value="doesnotContain"
                                                selected={
                                                  this.state.addRulesList[
                                                    ruleIndex
                                                  ].questCondition ===
                                                  "doesnotContain"
                                                }
                                              >
                                                doesn't contain
                                              </option>
                                            </select>
                                          </td>
                                        )}
                                        {this.state.addRulesList[ruleIndex]
                                          .selectedQuestion && (
                                          <td>
                                            <input
                                              className="FieldConfiguration-input"
                                              placeholder="answer.."
                                              value={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].answerVal
                                                  ? this.state.addRulesList[
                                                      ruleIndex
                                                    ].answerVal
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                this.onRuleChange(
                                                  e,
                                                  ruleIndex,
                                                  "answerVal"
                                                )
                                              }
                                            />
                                          </td>
                                        )}

                                        <td className="ScoreRules__when">
                                          <span>Then</span>
                                        </td>
                                        <td style={{ width: "10%" }}>
                                          <select
                                            className="select-option"
                                            onChange={(e) =>
                                              this.onRuleChange(
                                                e,
                                                ruleIndex,
                                                "priceCondition"
                                              )
                                            }
                                          >
                                            <option
                                              selected={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].priceCondition === "+"
                                              }
                                              value="+"
                                            >
                                              +
                                            </option>
                                            <option
                                              selected={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].priceCondition === "-"
                                              }
                                              value="-"
                                            >
                                              -
                                            </option>
                                            <option
                                              selected={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].priceCondition === "x"
                                              }
                                              value="x"
                                            >
                                              x
                                            </option>
                                            <option
                                              selected={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].priceCondition === "/"
                                              }
                                              value="/"
                                            >
                                              /
                                            </option>
                                            <option
                                              selected={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].priceCondition === "="
                                              }
                                              value="="
                                            >
                                              =
                                            </option>
                                          </select>
                                        </td>
                                        <td className="ScoreRules__when">
                                          <span> &nbsp; </span>
                                        </td>
                                        <td style={{ width: "10%" }}>
                                          <div className="text-value">
                                            <input
                                              className="input-number input-margin"
                                              type="number"
                                              minvalue="0"
                                              maxvalue="100"
                                              placeholder="0"
                                              value={
                                                this.state.addRulesList[
                                                  ruleIndex
                                                ].priceVal || 0
                                              }
                                              onChange={(e) =>
                                                this.onRuleChange(
                                                  e,
                                                  ruleIndex,
                                                  "priceVal"
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <div
                                            className="icons-arrow"
                                            onClick={() => this.removeRule()}
                                          >
                                            <i
                                              className="fa fa-times arrow-times"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <div
                                            className="icons-arrow"
                                            onClick={() =>
                                              this.copyRule(ruleIndex)
                                            }
                                          >
                                            <i
                                              className="fa fa-clone clone-arrow"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <div
                                            className="icons-arrow"
                                            onClick={() =>
                                              this.moveRule("down", ruleIndex)
                                            }
                                          >
                                            <i
                                              className="fa fa-chevron-down down-icon"
                                              aria-hidden="true"
                                            />
                                          </div>
                                          <div
                                            className="icons-arrow"
                                            onClick={() =>
                                              this.moveRule("up", ruleIndex)
                                            }
                                          >
                                            <i
                                              className="fa fa-chevron-up up-icon"
                                              aria-hidden="true"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-Add btn-lg Add-another-button"
                            onClick={() => this.addRule()}
                          >
                            {this.state.addRulesList.length > 1
                              ? "Add another rule"
                              : "Add rule"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default ConfigurePayment;
