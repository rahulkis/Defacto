import React from "react";
import Select from "react-select";
import "../../../assets/custom/AccountSettings.css";
import { PostData } from "../../../stores/requests";
import moment from "moment";

import {
  ACCOUNT_SETTINGS,
  STRIPE_PAYMENTS,
  BIILING_URLS,
} from "../../../util/constants";
import Loader from "../../../components/Common/Loader";
import { DraftJS } from "megadraft";
import { StripeCardForm } from "../../forms/PaymentCheckout/StripeCardForm";
import { StripeProvider, Elements } from "react-stripe-elements";

let countries = require("../../../JsonData/countries.json");
let statelst = require("../../../JsonData/States.json");
class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: false,
      colorTwo: "#4D7CEA",
      cardName: "",
      authorizationChecked: false,
      default_Country: "",
      default_State: "",
      cardError: false,
      billingId: "",
      subscribeAgreeMsg: false,
      stripe: null,
      cardTokenDetails: null,
      allBillingPlans: [],
      monthlyBillingPlans: [],
      yearlyBillingPlans: [],
      selectedBillingType: "Monthly",
      selectedPriceId: "",
      selectedPlanId: "",
      currentUserEmail: "",
      selectedPlanName: "",
      requestCount: 0,
      isSubmitting: false,
      subscriptionDetails: null,
      ischangePlan: true,
      stripeCustomerId: null,
      currentPlanName: null,
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.dropdownHandler = this.dropdownHandler.bind(this);
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
      this.isRefferalBy = jsonData.ReferralBy ? true : false;
    }
    this.AllStates = statelst;
  }

  componentWillMount = async () => {
    this.getBillingPlans();

    let userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.CustomerId) {
        this.setState({
          stripeCustomerId: parsedData.CustomerId,
        });
        this.billingDetails(parsedData.CustomerId);
      }
      this.setState({
        currentUserEmail: parsedData.Email,
        cardName: parsedData.Name,
      });
    }
  };
  componentDidMount() {
    const stripeJs = document.createElement("script");
    stripeJs.id = "stripe-script";
    stripeJs.src = "https://js.stripe.com/v3/";
    stripeJs.async = true;
    stripeJs.onload = () => {
      const countdown = setInterval(() => {
        this.setState({ countdown: this.state.countdown - 1 });
      }, 1000);
      // The setTimeout lets us pretend that Stripe.js took a long time to load
      // Take it out of your production code!
      setTimeout(() => {
        clearInterval(countdown);
        this.setState({
          stripe: window.Stripe(STRIPE_PAYMENTS.PUBLISHABLE_KEY),
        });
      }, 3000);
    };
    document.body && document.body.appendChild(stripeJs);
  }

  billingDetails = async (custId) => {
    this.setState({ isLoader: true });

    const requestBody = {
      CustomerId: custId,
      PlanStatus: true,
    };
    try {
      PostData(ACCOUNT_SETTINGS.GET_BILLINGINFO, requestBody).then((result) => {
        if (result.statusCode === 200) {
          let resultedItem = result.data;
          resultedItem = JSON.parse(resultedItem);
          this.bindDataIntoState(resultedItem);
          this.setState({
            isLoader: false,
          });
        } else {
          this.setState({
            isLoader: false,
            ischangePlan: true,
          });
        }
      });
    } catch (err) {
      this.setState({
        ischangePlan: true,
        isLoader: true,
      });
    }
  };

  getBillingPlans = () => {
    if (this.state.requestCount < 2) {
      const requestBody = {
        secretKey: STRIPE_PAYMENTS.CLIENT_SECRET,
      };
      this.setState({
        requestCount: this.state.requestCount + 1,
      });
      try {
        PostData(BIILING_URLS.GET_PLANS_LIST_API, requestBody).then(
          (result) => {
            if (result.statusCode === 200) {
              if (result.res.Products && result.res.Products.data.length) {
                const monthlyPrices = result.res.Prices.data.filter(
                  (price) => price.recurring.interval === "month"
                );
                const yearlyPrices = result.res.Prices.data.filter(
                  (price) => price.recurring.interval === "year"
                );
                let monthlyPlansList = [];
                result.res.Products.data.map((prod) => {
                  const monthlyPlan = monthlyPrices.find(
                    (mPlan) => mPlan.product === prod.id
                  );
                  if (monthlyPlan) {
                    let product = { ...prod, priceDetails: monthlyPlan };
                    monthlyPlansList.push(product);
                    return product;
                  } else {
                    return prod;
                  }
                });
                let yearlyPlansList = [];
                result.res.Products.data.map((prod) => {
                  const yearlyPlan = yearlyPrices.find(
                    (yPlan) => yPlan.product === prod.id
                  );
                  if (yearlyPlan) {
                    let product = { ...prod, priceDetails: yearlyPlan };
                    yearlyPlansList.push(product);
                    return product;
                  } else {
                    return prod;
                  }
                });
                if (monthlyPlansList.length > 0) {
                  monthlyPlansList = monthlyPlansList.sort(
                    (a, b) =>
                      a.priceDetails.unit_amount - b.priceDetails.unit_amount
                  );
                }

                if (yearlyPlansList.length > 0) {
                  yearlyPlansList = yearlyPlansList.sort(
                    (a, b) =>
                      a.priceDetails.unit_amount - b.priceDetails.unit_amount
                  );
                }

                this.setState({
                  selectedPriceId: monthlyPlansList[0].priceDetails.id,
                  selectedPlanId: monthlyPlansList[0].id,
                  selectedPlanName: monthlyPlansList[0].name,
                  monthlyBillingPlans: monthlyPlansList,
                  yearlyBillingPlans: yearlyPlansList,
                });
              } else {
                if (this.state.requestCount < 2) {
                  this.getBillingPlans();
                } else {
                  this.setState({
                    isLoader: false,
                  });
                  if (result.res && result.res.raw && result.res.raw.message) {
                    alert(result.res.raw.message);
                  } else {
                    alert("Something went wrong. Please Try again");
                  }
                }
              }
            } else {
              if (this.state.requestCount < 2) {
                this.getBillingPlans();
              } else {
                if (result.res && result.res.raw && result.res.raw.message) {
                  alert(result.res.raw.message);
                } else {
                  alert("Something went wrong. Please Try again");
                }
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
        this.setState({
          isLoader: false,
        });
        alert("Somthing went wrong.Please Try again!");
      }
    }
  };
  bindDataIntoState(resultInfo) {
    if (resultInfo.Items.length > 0) {
      let info = resultInfo.Items[0];
      this.setState({
        ischangePlan: false,
        subscriptionDetails: info,
        billingId: info.BillingId,
        currentPlanName: info.PlanName,
      });

      if (info.Country === "AU" || info.Country === "US") {
        statelst = this.AllStates.filter(
          (cur) => cur.CountryId === info.Country
        );
      }
    }
  }
  changeBilingTypeHandler = (selectedKey, type) => {
    this.setState({ [selectedKey]: type });
    if (type === "Monthly") {
      this.setState({
        selectedPriceId: this.state.monthlyBillingPlans[0].priceDetails.id,
        selectedPlanId: this.state.monthlyBillingPlans[0].id,
        selectedPlanName: this.state.monthlyBillingPlans[0].name,
      });
    } else {
      this.setState({
        selectedPriceId: this.state.yearlyBillingPlans[0].priceDetails.id,
        selectedPlanId: this.state.yearlyBillingPlans[0].id,
        selectedPlanName: this.state.yearlyBillingPlans[0].name,
      });
    }
  };

  changePlanHandler = (plan) => {
    this.setState({
      selectedPriceId: plan.priceDetails.id,
      selectedPlanId: plan.id,
      selectedPlanName: plan.name,
    });
  };
  changeHandler = (selectedKey, compName) => {
    this.setState({ [selectedKey]: compName });
  };
  handleChange = (e, key) => {
    this.setState({ [key]: e });
  };
  inputHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  dropdownHandler = (key, event) => {
    this.setState({ [key]: event.value });

    if (key === "default_Country") {
      statelst = this.AllStates.filter((cur) => cur.CountryId === event.value);
    }
  };

  onChangeHandler(error, stripeObj) {
    if (error) {
      this.setState({ cardTokenDetails: null });
    } else {
      stripeObj.createToken().then((response) => {
        if (response.error) {
          this.setState({ cardTokenDetails: null });
        }
        if (response.token) {
          console.log(response.token);
          this.setState({ cardTokenDetails: response.token });
        }
      });
    }
  }

  handleSubmit = (e) => {
    if (this.state.authorizationChecked === false) {
      this.setState({ subscribeAgreeMsg: true });
      return;
    } else {
      this.setState({ subscribeAgreeMsg: false });
      // return;
    }

    // this.setState({ isLoader: true });
    const coupenCode =
      this.state.selectedPlanName !== "Agency" && this.isRefferalBy
        ? STRIPE_PAYMENTS.COUPON_CODE
        : "";
    const requestBody = {
      secretKey: STRIPE_PAYMENTS.CLIENT_SECRET,
      priceId: this.state.selectedPriceId,
      CustomerId: this.state.stripeCustomerId,
      coupon: coupenCode,
      bodyInfo: {
        source: this.state.cardTokenDetails.id,
        email: this.state.currentUserEmail,
      },
    };

    this.setState({
      isSubmitting: true,
    });
    try {
      PostData(BIILING_URLS.CREATE_CUSTOMER_SUBSCRIPTION_API, requestBody).then(
        (result) => {
          if (result.statusCode === 200) {
            const responseData = result.res;
            this.saveSubScriptionDetails(responseData);
          } else {
            if (result.res && result.res.raw && result.res.raw.message) {
              alert(result.res.raw.message);
            } else {
              alert("Something went wrong. Please Try again");
            }
            this.setState({
              isSubmitting: false,
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        isSubmitting: false,
      });
      alert("Somthing went wrong.Please Try again!");
    }
  };

  saveSubScriptionDetails = (response) => {
    const requestBody = {
      CustomerId: response.customer,
      BillingId: DraftJS.genKey(),
      UserId: this.loginUserId,
      PlanId: response.plan.product,
      PlanName: this.state.selectedPlanName,
      PlanStatus: response.status === "active" ? true : false,
      PlanPriceId: response.plan.id,
      PlanPrice: response.plan.amount / 100,
      PlanPeriod: response.plan.interval,
      SubscriptionId: response.id,
      SubscriptionStartDate: response.current_period_start,
      SubscriptionEndDate: response.current_period_end,
      CardDetails: this.state.cardTokenDetails.card,
      Country: this.state.default_Country,
      State: this.state.default_State,
      CreatedBy: this.loginUserId,
      CreatedAt: response.created,
    };
    // return;
    try {
      PostData(BIILING_URLS.SAVE_BILLING_INFO, requestBody).then((result) => {
        if (result.statusCode === 200) {
          const userData = localStorage.getItem("loginUserInfo");
          if (userData) {
            const parsedData = JSON.parse(userData);

            const newUserData = {
              ...parsedData,
              CustomerId: response.customer,
              UserPlan: this.state.selectedPlanName,
            };
            localStorage.setItem("loginUserInfo", JSON.stringify(newUserData));
          }
          alert(
            "Your have successfully subscribed " +
              this.state.selectedPlanName +
              " plan"
          );
          window.location.reload();
        } else {
          if (result.res && result.res.raw && result.res.raw.message) {
            alert(result.res.raw.message);
          } else {
            alert("Something went wrong. Please Try again");
          }
          this.setState({
            isSubmitting: false,
          });
        }
      });
    } catch (err) {
      console.log(err);
      this.setState({
        isSubmitting: false,
      });
      alert("Somthing went wrong.Please Try again!");
    }
  };

  changeCurrentPlan() {
    this.setState({
      ischangePlan: true,
    });
  }

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    let _self = this;
    setTimeout(function() {
      let ee = document.getElementsByClassName("stripe-Error");
      if (ee.length > 0) {
        _self.setState({ cardError: true });
      } else {
        _self.setState({ cardError: false });
      }
    }, 100);
    return (
      <div>
        {this.state.subscriptionDetails && !this.state.ischangePlan && (
          <div>
            <h3>Your Subscribed plan Details:</h3>

            <p>
              <strong>Plan:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {this.state.currentPlanName}
              </span>
            </p>
            <p>
              <strong>Plan Period: </strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {this.state.subscriptionDetails.PlanPeriod}
              </span>
            </p>
            <p>
              <strong>Plan Start Date: </strong>
              {"  "}
              <span>
                {moment(
                  this.state.subscriptionDetails.SubscriptionStartDate,
                  "X"
                ).format("lll")}
              </span>
            </p>
            <p>
              <strong>Plan End Date: </strong>
              {"  "}
              <span>
                {moment(
                  this.state.subscriptionDetails.SubscriptionEndDate,
                  "X"
                ).format("lll")}
              </span>
            </p>
            <div className="submit btn-submit-billing" style={{ width: "30%" }}>
              <button
                className="toggle-view-btn  btn-raised btn-round btn btn-default"
                onClick={(e) => this.changeCurrentPlan(e)}
              >
                Upgrade/Downgrad Plan
              </button>
            </div>
          </div>
        )}
        {this.state.ischangePlan && (
          <div>
            <div
              className="AccountSection-div billing-details"
              style={{ textAlign: "center" }}
            >
              <h2
                className="PaperType--h2"
                style={{ margintop: "-3px", marginbottom: "18px" }}
              >
                Complete Your Account
              </h2>
              <p>
                Nearly There! To finish setting up your account, you just need
                to add a payment method. You can cancel your account any time.
              </p>
              <p>
                You can compare the available plans on the{" "}
                <a href="/auth/pricing" target="_blank" className="a">
                  Pricing page
                </a>
                .
              </p>
            </div>

            <div className="LiveField  LiveField--choices LiveField--multiline">
              <div className="LiveField__container">
                <div className="LiveField__header">
                  <span>How often would you like to be billed?</span>
                </div>
                <div className="LiveField__description">
                  <span>
                    Get 2 months free every year when billed annually.
                  </span>
                </div>

                <div className="LiveField__answer">
                  <div className="Choices">
                    <label
                      onClick={(e) =>
                        this.changeBilingTypeHandler(
                          "selectedBillingType",
                          "Monthly"
                        )
                      }
                      className="btn-raised  Choices__choice--1 choice-theme choice-input"
                      style={{
                        background:
                          this.state.selectedBillingType === "Monthly"
                            ? `${this.state.colorTwo}`
                            : "",
                      }}
                    >
                      <input
                        type="radio"
                        value="Monthly"
                        className="input-radio"
                        name="ChoiceQuestion"
                        defaultChecked={
                          this.state.selectedBillingType === "Monthly"
                        }
                      />
                      Monthly
                    </label>
                    <label
                      onClick={(e) =>
                        this.changeBilingTypeHandler(
                          "selectedBillingType",
                          "Yearly"
                        )
                      }
                      className="btn-raised  Choices__choice--1 choice-theme choice-input"
                      style={{
                        background:
                          this.state.selectedBillingType === "Yearly"
                            ? `${this.state.colorTwo}`
                            : "",
                      }}
                    >
                      <input
                        type="radio"
                        value="Yearly"
                        className="input-radio"
                        name="ChoiceQuestion"
                        defaultChecked={
                          this.state.selectedBillingType === "Yearly"
                        }
                      />
                      Yearly
                    </label>
                  </div>
                </div>
              </div>

              <div className="LiveField__container">
                <div className="LiveField__header">
                  <span>Choose Plan</span>
                </div>
                <div className="LiveField__answer">
                  {this.state.selectedBillingType === "Monthly" && (
                    <div className="Choices">
                      {this.state.monthlyBillingPlans.length &&
                        this.state.monthlyBillingPlans.map((plan, i) => (
                          <label
                            key={"plan-" + plan.id}
                            onClick={(e) => this.changePlanHandler(plan)}
                            className="btn-raised  Choices__choice--1 choice-theme choice-input"
                            style={{
                              background:
                                this.state.selectedPriceId ===
                                plan.priceDetails.id
                                  ? `${this.state.colorTwo}`
                                  : "",
                            }}
                          >
                            <input
                              type="radio"
                              value={plan.name}
                              className="input-radio"
                              name="ChoiceQuestion"
                              defaultChecked={
                                this.state.selectedPriceId ===
                                plan.priceDetails.id
                                  ? true
                                  : false
                              }
                            />
                            {plan.name} - ${plan.priceDetails.unit_amount / 100}{" "}
                            / Month
                          </label>
                        ))}
                    </div>
                  )}

                  {this.state.selectedBillingType === "Yearly" && (
                    <div className="Choices">
                      {this.state.yearlyBillingPlans.length &&
                        this.state.yearlyBillingPlans.map((plan, i) => (
                          <label
                            key={"plan-" + plan.id}
                            onClick={(e) => this.changePlanHandler(plan)}
                            className="btn-raised  Choices__choice--1 choice-theme choice-input"
                            style={{
                              background:
                                this.state.selectedPriceId ===
                                plan.priceDetails.id
                                  ? `${this.state.colorTwo}`
                                  : "",
                            }}
                          >
                            <input
                              type="radio"
                              value={plan.name}
                              className="input-radio"
                              name="ChoiceQuestion"
                              defaultChecked={
                                this.state.selectedPriceId ===
                                plan.priceDetails.id
                                  ? true
                                  : false
                              }
                            />
                            {plan.name} - ${plan.priceDetails.unit_amount / 100}{" "}
                            / Year
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="LiveField__container">
                <div>
                  <div className="LiveField__header">
                    <span>Name</span>
                  </div>
                  <div className="LiveField__answer">
                    <input
                      placeholder=""
                      data="[object Object]"
                      name="cardName"
                      className="LiveField__input"
                      type="text"
                      onChange={this.inputHandler}
                      defaultValue={this.state.cardName}
                    />
                  </div>
                </div>
              </div>
              <div className="LiveField__container">
                <div>
                  <div className="LiveField__header">
                    <span>Card</span>
                  </div>
                  <div className="LiveField__answer">
                    <StripeProvider stripe={this.state.stripe}>
                      <Elements>
                        <StripeCardForm
                          handleChange={(err, strpObj) =>
                            this.onChangeHandler(err, strpObj)
                          }
                          handleResult={this.handleResult}
                          translationInfo={this.props.translationInfo}
                        />
                      </Elements>
                    </StripeProvider>
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
                      name="countryId"
                      options={countries}
                      value={countries.find(
                        (cur) => cur.value === this.state.default_Country
                      )}
                      onChange={(e) =>
                        this.dropdownHandler("default_Country", e)
                      }
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
                        onChange={(e) =>
                          this.dropdownHandler("default_State", e)
                        }
                        id="stateId"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="LiveField__container">
                <div>
                  <div className="LiveField__header">
                    <span className="billing-auth-text">
                      I authorise Defactoform to send instructions to the
                      financial institution that issued my card to take payments
                      from my card account in accordance with the terms of my
                      agreement with you.
                    </span>
                  </div>
                  <div className="LiveField__answer">
                    <div className="ProductConfiguration__DefaultBlock">
                      <div className="YesNo">
                        <label
                          value="Yes"
                          onClick={(e) =>
                            this.handleChange(true, "authorizationChecked")
                          }
                          className={
                            this.state.authorizationChecked === true
                              ? "btn-raised btn-primary"
                              : "btn-raised btn-default"
                          }
                        >
                          yes
                        </label>
                        <label
                          value="No"
                          onClick={(e) =>
                            this.handleChange(false, "authorizationChecked")
                          }
                          className={
                            this.state.authorizationChecked === false
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
              {this.state.subscribeAgreeMsg && (
                <p
                  className="__unstyled Checkout__error"
                  style={{ textAlign: "center" }}
                >
                  You need to agree to the conditions to subscribe.
                </p>
              )}
              <div className="flex" />
              <div style={{ paddingbottom: "10px" }}>
                <div className="submit btn-submit-billing">
                  {this.state.cardTokenDetails &&
                    this.state.default_Country &&
                    this.state.currentUserEmail &&
                    !this.state.isSubmitting && (
                      <button
                        className="toggle-view-btn  btn-raised btn-round btn btn-default"
                        onClick={(e) => this.handleSubmit(e)}
                      >
                        <i className="fa fa-lock" /> Complete Account
                      </button>
                    )}
                  {this.state.cardTokenDetails &&
                    this.state.default_Country &&
                    this.state.currentUserEmail &&
                    this.state.isSubmitting && (
                      <button
                        className="toggle-view-btn  btn-raised btn-round btn btn-default"
                        disabled="disabled"
                      >
                        <i className="fa fa-lock" /> Submitting...
                      </button>
                    )}
                  {(!this.state.cardTokenDetails ||
                    this.state.currentUserEmail === "" ||
                    this.state.default_Country === "") && (
                    <button
                      className="toggle-view-btn btn-raised btn-round btn btn-default"
                      disabled="disabled"
                    >
                      <i className="fa fa-lock" /> Complete Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Billing;
