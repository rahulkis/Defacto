import React from "react";
import Select from "react-select";
import "../../../assets/custom/AccountSettings.css";
import { PostData } from "../../../stores/requests";
import {
  ACCOUNT_SETTINGS,
  STRIPE_PAYMENTS,
  BIILING_URLS,
} from "../../../util/constants";
import Loader from "../../../components/Common/Loader";
import { DraftJS } from "megadraft";
import { StripeCardForm } from "../../forms/PaymentCheckout/StripeCardForm";
import { StripeProvider, Elements } from "react-stripe-elements";

var countries = require("../../../JsonData/countries.json");
var statelst = require("../../../JsonData/States.json");

class AgencyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: false,
      colorTwo: "#4D7CEA",
      cardName: "",
      authorizationChecked: undefined,
      default_Country: "",
      default_State: "",
      cardError: false,
      billingId: "",
      subscribeAgreeMsg: false,
      stripe: null,
      cardTokenDetails: null,
      allBillingPlans: [],
      monthlyAgencyPlan: null,
      yearlyAgencyPlan: null,
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
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.dropdownHandler = this.dropdownHandler.bind(this);

    var jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
    }
    this.AllStates = statelst;
  }

  componentWillMount = async () => {
    this.getBillingPlans();

    var userData = localStorage.getItem("loginUserInfo");
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
                const planData = result.res.Products.data.find(
                  (prod) => (prod.name = "Agency")
                );
                const monthlyPrice = result.res.Prices.data.find(
                  (price) =>
                    price.recurring.interval === "month" &&
                    price.product === planData.id
                );
                const yearlyPrices = result.res.Prices.data.find(
                  (price) =>
                    price.recurring.interval === "year" &&
                    price.product === planData.id
                );

                const monthlyPlan = { ...planData, priceDetails: monthlyPrice };
                const yearlyPlan = { ...planData, priceDetails: yearlyPrices };

                this.setState({
                  selectedPriceId: monthlyPlan.priceDetails.id,
                  selectedPlanId: monthlyPlan.id,
                  selectedPlanName: monthlyPlan.name,
                  monthlyAgencyPlan: monthlyPlan,
                  yearlyAgencyPlan: yearlyPlan,
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

  billingDetails = async (custId) => {
    this.setState({ isLoader: true });

    const requestBody = {
      CustomerId: custId,
      PlanStatus: true,
    };
    try {
      PostData(ACCOUNT_SETTINGS.GET_BILLINGINFO, requestBody).then((result) => {
        if (result.statusCode === 200) {
          var resultedItem = result.data;
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

  bindDataIntoState(resultInfo) {
    if (resultInfo.Items.length > 0) {
      var info = resultInfo.Items[0];
      this.setState({
        ischangePlan: false,
        subscriptionDetails: info,
        billingId: info.BillingId,
      });

      if (info.Country === "AU" || info.Country === "US") {
        statelst = this.AllStates.filter(
          (cur) => cur.CountryId === info.Country
        );
      }
    }
  }

  changePlanHandler = (selectedKey, type) => {
    this.setState({ [selectedKey]: type });
    if (type === "Monthly") {
      this.setState({
        selectedPriceId: this.state.monthlyAgencyPlan.priceDetails.id,
        selectedPlanId: this.state.monthlyAgencyPlan.id,
        selectedPlanName: this.state.monthlyAgencyPlan.name,
      });
    } else {
      this.setState({
        selectedPriceId: this.state.yearlyAgencyPlan.priceDetails.id,
        selectedPlanId: this.state.yearlyAgencyPlan.id,
        selectedPlanName: this.state.yearlyAgencyPlan.name,
      });
    }
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

  handleSubmit = (e) => {
    if (this.state.authorizationChecked === false) {
      this.setState({ subscribeAgreeMsg: true });
      return;
    } else {
      this.setState({ subscribeAgreeMsg: false });
      // return;
    }
    // this.setState({ isLoader: true });
    const requestBody = {
      secretKey: STRIPE_PAYMENTS.CLIENT_SECRET,
      priceId: this.state.selectedPriceId,
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

  onChangeHandler(error, stripeObj) {
    if (error) {
      this.setState({ cardTokenDetails: null });
    } else {
      stripeObj.createToken().then((response) => {
        if (response.error) {
          this.setState({ cardTokenDetails: null });
        }
        if (response.token) {
          this.setState({ cardTokenDetails: response.token });
        }
      });
    }
  }

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
            };
            localStorage.setItem("loginUserInfo", JSON.stringify(newUserData));
          }
          alert(
            "Your have successfully upgraded to " +
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

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    var _self = this;
    setTimeout(function() {
      var ee = document.getElementsByClassName("sc-ifAKCX");
      if (ee.length > 0) {
        _self.setState({ cardError: true });
      } else {
        _self.setState({ cardError: false });
      }
    }, 100);

    return (
      <div>
        <div className="AccountSection-div billing-details">
          <h2
            className="PaperType--h2"
            style={{ margintop: "-3px", marginbottom: "18px" }}
          >
            Upgrade to Agency
          </h2>
          <p>
            Upgrade to Paperform Agency below, don't worry, you can downgrade at
            any time.
          </p>
        </div>
        {this.state.yearlyAgencyPlan && (
          <div className="LiveField" style={{ width: "100%" }}>
            <div className="LiveField__container">
              <div className="LiveField__header">
                <span>How would you like to be billed?</span>
              </div>
              <div className="LiveField__answer">
                <div className="Choices">
                  <label
                    onClick={(e) =>
                      this.changePlanHandler("selectedBillingType", "Monthly")
                    }
                    className="btn-raised  Choices__choice--1 choice-theme choice-input"
                    style={{
                      background:
                        this.state.selectedBillingType === "Monthly"
                          ? `${this.state.colorTwo}`
                          : "",
                      width: "50%",
                    }}
                  >
                    <input
                      type="radio"
                      value="Monthly"
                      className="input-radio"
                      name="ChoiceQuestion"
                      defaultChecked={
                        this.state.selectedBillingType === "Monthly"
                          ? true
                          : false
                      }
                    />
                    $
                    {this.state.monthlyAgencyPlan.priceDetails.unit_amount /
                      100}{" "}
                    / Month
                  </label>
                  <label
                    onClick={(e) =>
                      this.changePlanHandler("selectedBillingType", "Yearly")
                    }
                    className="btn-raised  Choices__choice--1 choice-theme choice-input"
                    style={{
                      background:
                        this.state.selectedBillingType === "Yearly"
                          ? `${this.state.colorTwo}`
                          : "",
                      width: "50%",
                    }}
                  >
                    <input
                      type="radio"
                      value="Yearly"
                      className="input-radio"
                      name="ChoiceQuestion"
                      defaultChecked={
                        this.state.selectedBillingType === "Yearly"
                          ? true
                          : false
                      }
                    />
                    $
                    {this.state.yearlyAgencyPlan.priceDetails.unit_amount / 100}{" "}
                    / Year
                  </label>
                </div>
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
                          this.handleChange(true, "AuthorizationChecked")
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
                          this.handleChange(false, "AuthorizationChecked")
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
                class="__unstyled Checkout__error"
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
                  this.state.isSubmitting && (
                    <button
                      className="toggle-view-btn  btn-raised btn-round btn btn-default"
                      disabled="disabled"
                    >
                      <i className="fa fa-lock" /> Submitting...
                    </button>
                  )}
                {this.state.cardTokenDetails &&
                  this.state.default_Country &&
                  this.state.currentUserEmail &&
                  !this.state.isSubmitting && (
                    <button
                      className="toggle-view-btn  btn-raised btn-round btn btn-default"
                      onClick={(e) => this.handleSubmit(e)}
                    >
                      <i className="fa fa-lock" /> Upgrade to Agency
                    </button>
                  )}
                {(!this.state.cardTokenDetails ||
                  this.state.currentUserEmail === "" ||
                  this.state.default_Country === "") && (
                  <button
                    className="toggle-view-btn  btn-raised btn-round btn btn-default"
                    disabled="disabled"
                  >
                    <i className="fa fa-lock" /> Upgrade to Agency
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default AgencyView;
