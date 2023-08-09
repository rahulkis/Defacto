import React, { Component } from "react";
import "../../../assets/custom/PaymentCheckout.css";
import { STRIPE_PAYMENTS, PAYMENT_ACCOUNT_URLS } from "../../../util/constants";
import moment from "moment";
import { PostData } from "../../../stores/requests";
import { StripeProvider, Elements } from "react-stripe-elements";
import { StripeCardForm } from "./StripeCardForm";

class StripeCheckoutModal extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      stripe: null,
      countdown: 3,
      data: props.data,
      translatedData: {},
      summaryElements: [],
      totalPriceValue: null,
      isFormLoaded: false,
      selectedCurrency: null,
      currencySymbol: null,
      totalProcessingAmount: 0,
      isProcessing: false,
      clientToken: null,
      currentUserId: "",
      cardTokenDetails: null,
    };
  }

  componentWillMount() {
    this.getElementsWithAmount(this.props.formJSON);
    this.setValuesInState(this.props);
  }

  componentDidMount() {
    // componentDidMount only runs in a browser environment.
    // In addition to loading asynchronously, this code is safe to server-side render.

    // Remove our existing Stripe script to keep the DOM clean.
    const stripeScript = document.getElementById("stripe-script");
    if (stripeScript) {
      stripeScript.remove();
    }
    // You can inject a script tag manually like this,

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

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.translationInfo &&
      Object.keys(nextProps.translationInfo).length &&
      Object.keys(nextProps.translationInfo).length !==
        Object.keys(this.state.translatedData).length
    ) {
      this.setState({
        translatedData: nextProps.translationInfo,
      });
    }
    this.getElementsWithAmount(nextProps.formJSON);
    this.setValuesInState(nextProps);
  }

  setValuesInState(propsData) {
    if (propsData.paymentConfigration) {
      const currencyData = JSON.parse(propsData.paymentConfigration.Currency);
      this.setState({
        selectedCurrency: currencyData.value,
        currencySymbol: currencyData.symbol,
        totalProcessingAmount:
          Number(propsData.processingFeeAmount) +
          Number(propsData.processingFeePercentage),
      });
    }
    if (propsData.totalPriceValue) {
      this.setState({
        totalPriceValue: Number(this.props.totalPriceValue),
      });
    }
  }

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

  startPaymentRequest = async () => {
    this.setState({
      isProcessing: true,
    });
    if (this.state.cardTokenDetails) {
      const RequestBody = {
        secretKey: STRIPE_PAYMENTS.CLIENT_SECRET,
        bodyInfo: {
          amount: this.state.totalPriceValue * 100,
          currency: "usd",
          description: "Payment by Stripe",
          source: this.state.cardTokenDetails.id,
          destination: this.props.paymentMethod.MerchantId,
        },
      };

      try {
        PostData(STRIPE_PAYMENTS.PAYMENT_REQUEST_URL, RequestBody).then(
          (result) => {
            if (result.paid && result.status === "succeeded") {
              this.savePaymentSuccessDetails(result);
            } else {
              this.setState({
                isProcessing: false,
              });
              if (result.message && result.message.raw) {
                alert(
                  result.message.raw.message ||
                    "Something went wrong with Stripe. Please try again"
                );
              } else {
                alert("Something went wrong with Stripe. Please try again");
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
        this.setState({
          isProcessing: true,
        });
        alert("Somthing went wrong. Please Try again!");
      }
    }
  };

  getElementsWithAmount(formJSON) {
    let summaryEls = [];
    formJSON.map((data, i) => {
      if (data.control === "price") {
        const controlLabel = data.title;
        const controlPrice =
          Number(data.priceValue) > -1 ? Number(data.priceValue) : 10;
        summaryEls.push({
          label: controlLabel,
          price: controlPrice,
          count: 1,
          productPrice: controlPrice,
        });
      }
      if (data.control === "products") {
        const selectedProducts = data.productList.filter(
          (prod) => prod.isSelected === true
        );
        if (selectedProducts.length > 0) {
          selectedProducts.map((prod, i) => {
            const controlLabel = prod.Name;
            const controlPrice = Number(prod.Price);
            const productCount = prod.productCount
              ? Number(prod.productCount)
              : 1;
            const productPrice = controlPrice * productCount;
            summaryEls.push({
              label: controlLabel,
              price: controlPrice,
              count: productCount,
              productPrice: productPrice,
            });
            return productPrice;
          });
        }
      }
      this.setState({
        summaryElements: summaryEls,
      });
      return summaryEls;
    });
  }

  handleCancelButton = () => {
    this.props.closeModal(false);
  };

  savePaymentSuccessDetails(response) {
    const request_body = {
      FormId: this.props.formId,
      PaymentId: response.id,
      AmountMoney: {
        amount: response.amount / 100,
        currency: response.currency.toUpperCase(),
      },
      PaymentStatus: response.status.toUpperCase(),
      PaymentType: "STRIPE",
      SourceType: response.payment_method_details.type.toUpperCase(),
      PayerDetails: response.payment_method_details.card,
      LocationId: "",
      OrderId: response.transfer,
      ReceiptNumber: "",
      ReceiptUrl: response.receipt_url,
      CreatedAt: moment(response.created).format("X"),
      CreatedBy: "1",
    };

    try {
      PostData(PAYMENT_ACCOUNT_URLS.SAVE_PAYMENT_INFO_URL, request_body).then(
        (result) => {
          this.props.onPaymentSuccess();
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        isProcessing: false,
      });
      alert("Something went wrong, please try again.");
      // this.setState({ isLoader: false });
    }
  }

  render() {
    return (
      <div className="CheckoutV2 CheckoutV2--open">
        <div
          className="BtnV2 BtnV2--raised BtnV2--sm"
          tabIndex="-1"
          style={{
            position: "absolute",
            left: "18px",
            top: "18px",
            zIndex: 1000,
          }}
          onClick={() => this.handleCancelButton()}
        >
          <span>{this.props.translationInfo.Cancel || "Cancel"}</span>
        </div>
        <div className="CheckoutV2__checkout">
          <div
            className="Checkout Checkout--square Checkout--modal Checkout"
            style={{ width: "50%" }}
          >
            <div className="PaymentSummary">
              <div className="PaymentSummary__summary">
                <table className="PaymentSummary__lines">
                  <tbody>
                    {this.state.summaryElements.map((item, index) => {
                      return (
                        <tr
                          className="OrderLine OrderLine--price"
                          key={"orderElment" + index}
                        >
                          <td className="OrderLine__label" colSpan="1">
                            {item.label || "NA"}
                          </td>
                          <td className="OrderLine__quantity">
                            {this.state.currencySymbol}
                            {item.price} <small>✕</small>
                            {item.count}
                          </td>
                          <td className="OrderLine__total">
                            <span className="OrderLine__linetotal">
                              {this.state.currencySymbol}
                              {item.productPrice}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {this.props.paymentConfigration.TaxPercentage !== "" && (
                      <tr className="OrderLine OrderLine--fees">
                        <td className="OrderLine__label" colSpan="2">
                          {this.props.translationInfo.Tax || "Tax"}
                        </td>
                        <td className="OrderLine__total">
                          <span className="OrderLine__linetotal">
                            {this.state.currencySymbol}
                            {Number(this.props.taxAmount)}
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr className="OrderLine OrderLine--fees">
                      <td className="OrderLine__label" colSpan="2">
                        {this.props.translationInfo.ProcessingFee ||
                          "Processing Fee"}
                      </td>
                      <td className="OrderLine__total">
                        <span className="OrderLine__linetotal">
                          {this.state.currencySymbol}
                          {this.state.totalProcessingAmount}
                        </span>
                      </td>
                    </tr>
                    <tr className="OrderLine OrderLine--total">
                      <td className="OrderLine__label" colSpan="2">
                        {this.props.translationInfo.Total || "Total"}
                      </td>
                      <td className="OrderLine__total">
                        <span className="OrderLine__linetotal">
                          {this.state.currencySymbol}
                          {this.props.totalPriceValue}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              id="form-container"
              style={{
                height: "max-content",
                display: "flex",
                flexDirection: "column",
                transform: "scale(1)",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <img
                  alt="..."
                  src={require("assets/img/powered_by_stripe.png")}
                  style={{ width: "115px", height: "30px" }}
                />
              </div>
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

              <div
                id="sq-creditcard"
                className="btn-raised btn-primary"
                onClick={this.startPaymentRequest}
                disabled={!this.state.cardTokenDetails}
                style={{
                  pointerEvents:
                    this.state.isProcessing || !this.state.cardTokenDetails
                      ? "none"
                      : "auto",
                }}
              >
                {this.state.isProcessing ? "Submitting..." : "Submit"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StripeCheckoutModal;
