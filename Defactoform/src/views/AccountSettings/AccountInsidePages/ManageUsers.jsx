import React from "react";
import "../../../assets/custom/AccountSettings.css";
import { PostData } from "../../../stores/requests";
import {
  ACCOUNT_SETTINGS,
  STRIPE_PAYMENTS,
  BIILING_URLS,
} from "../../../util/constants";
import moment from "moment";
import Loader from "../../../components/Common/Loader";

class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPlansList: null,
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
      stripeCustomerId: null,
      currentPlanName: null,
    };

    var jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
    }
  }
  accountActiveHandler = () => {
    localStorage.setItem("activate", "agencyTab");

    window.open("../AccountSettings/Account", "_self");
  };

  async componentWillMount() {
    await this.getBillingPlans();
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
  }

  getBillingPlans = () => {
    if (this.state.requestCount < 2) {
      const RequestBody = {
        secretKey: STRIPE_PAYMENTS.CLIENT_SECRET,
      };
      this.setState({
        requestCount: this.state.requestCount + 1,
      });
      try {
        PostData(BIILING_URLS.GET_PLANS_LIST_API, RequestBody).then(
          (result) => {
            if (result.statusCode === 200) {
              if (result.res.Products && result.res.Products.data.length) {
                const planData = result.res.Products.data.find(
                  (prod) => (prod.name = "Agency")
                );

                this.setState({
                  allPlansList: result.res.Products.data,
                });

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
                  // selectedPriceId: monthlyPlan.priceDetails.id,
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

    const RequestBody = {
      CustomerId: custId,
      PlanStatus: true,
    };
    try {
      PostData(ACCOUNT_SETTINGS.GET_BILLINGINFO, RequestBody).then((result) => {
        if (result.statusCode === 200) {
          var resultedItem = result.data;
          resultedItem = JSON.parse(resultedItem);
          this.BindDataIntoState(resultedItem);
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

  BindDataIntoState(resultInfo) {
    if (resultInfo.Items.length > 0) {
      var info = resultInfo.Items[0];
      this.setState({
        ischangePlan: false,
        subscriptionDetails: info,
        billingId: info.BillingId,
        currentPlanName: info.PlanName,
      });
    }
  }

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    return (
      <div className="ManageUsers-Section">
        <div
          className="Paper Paper--double-padded"
          style={{ margin: "0px auto", maxwidth: "1366px" }}
        >
          <div>
            <div>
              <h2 className="PaperType--h2">Account Users</h2>
              <p>
                Only users on the Agency Plan can add more users to their
                account.
              </p>

              {this.state.subscriptionDetails &&
                !this.state.ischangePlan &&
                this.state.yearlyAgencyPlan && this.state.monthlyAgencyPlan && (
                  <div className="Paper Paper--double-padded">
                    <h3>Your current plan Details:</h3>

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
                    <div
                      className="submit btn-submit-billing"
                      style={{ width: "30%" }}
                    />
                  </div>
                )}
              {this.state.currentPlanName !== "Agency" &&
                this.state.allPlansList && (
                  <div
                    className="submit"
                    style={{ width: "20%", paddingLeft: "0px" }}
                    onClick={(e) => this.accountActiveHandler()}
                  >
                    <button className="BtnV2 BtnV2--disabled BtnV2--primary acctSubmit-btn-alignment">
                      Upgrade now
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageUsers;
