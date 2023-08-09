import React from "react";
import "../../../assets/custom/PaymentCheckout.css";
import { SQUARE_PAYMENTS, PAYMENT_ACCOUNT_URLS } from "../../../util/constants";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { PostData, PostDataCorsWithBody } from "../../../stores/requests";

class SquareCheckout extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      data: props.data,
      translatedData: {},
      summaryElements: [],
      totalPriceValue: null,
      isFormLoaded: false,
      selectedCurrency: null,
      currencySymbol: null,
      totalProcessingAmount: 0,
      isProcessing: false,
    };
    this.paymentForm = null;
  }

  componentWillMount() {
    this.getElementsWithAmount(this.props.formJSON);
    this.setValuesInState(this.props);
  }

  componentDidMount() {
    const self = this;
    this.paymentForm = new window.SqPaymentForm({
      // Initialize the payment form elements

      //TODO: Replace with your sandbox application ID
      // applicationId: SQUARE_PAYMENTS.CLIENT_ID,
      applicationId: SQUARE_PAYMENTS.CLIENT_ID,
      inputClass: "sq-input",
      autoBuild: false,
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [
        {
          fontSize: "16px",
          fontFamily: "sans-serif",
          fontWeight: "300",
          backgroundColor: "#FFF",
          padding: "9px 0",
          color: "#4d7cea",
        },
      ],
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: "sq-card-number",
      },
      cvv: {
        elementId: "sq-cvv",
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: self.props.translationInfo.MMY || "MM/YY",
      },
      postalCode: {
        elementId: "sq-postal-code",
      },
      // SqPaymentForm callback functions
      callbacks: {
        /*
         * callback function: cardNonceResponseReceived
         * Triggered when: SqPaymentForm completes a card nonce request
         */
        cardNonceResponseReceived: function(errors, nonce, cardData) {
          if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error("Encountered errors:");
            errors.forEach(function(error) {
              console.error("  " + error.message);
            });
            let errorString = `Encountered errors  \n`;
            errors.forEach(function(error) {
              errorString += "" + error.message + "\n"; // concate errors list
              console.error("  " + error.message);
            });
            self.setState({
              isProcessing: false,
            });
            alert(errorString);
            return;
          } else {
            self.getNewAccesToken(nonce);
          }
        },
      },
    });
    this.paymentForm.build();
  }

  stopProcessing() {
    this.setState();
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
  }

  requestCardNonce = async () => {
    this.setState({
      isProcessing: true,
    });
    await this.paymentForm.requestCardNonce();
  };

  getNewAccesToken = async (cardNonce) => {
    const refreshToken = this.props.paymentMethod.RefereshToken;
    const request_body = {
      client_secret: SQUARE_PAYMENTS.CLIENT_SECRET,
      client_id: SQUARE_PAYMENTS.CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    try {
      PostDataCorsWithBody(SQUARE_PAYMENTS.TOKENAUTH_URL, request_body).then(
        (result) => {
          console.log(result);
          if (result && result.access_token) {
            this.createSqaurePayment(cardNonce, result.access_token);
          } else {
            this.setState({
              isProcessing: false,
            });
            alert("Something went wrong, please try again.");
          }
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
  };

  createSqaurePayment = async (nonce, accessToken) => {
    console.log(nonce, accessToken);
    let locationData = {};
    if (this.props.paymentMethod.Locations) {
      locationData = JSON.parse(this.props.paymentMethod.Locations);
    }
    const idempotencyKey = uuidv4();

    const request_body = {
      HostName: SQUARE_PAYMENTS.HOSTNAME,
      APIName: "/v2/payments",
      // headerValue:
      //   "Bearer EAAAEEsY2OsUI7hXjgAYys-wkJXH0Mz9XbW-zMQ1rChpb03Ozc92TC8NHzTmFzDH",
      headerValue: "Bearer " + accessToken,
      bodyInfo: {
        amount_money: {
          amount: this.props.totalPriceValue * 100,
          currency: locationData.currency || "USD",
        },
        idempotency_key: idempotencyKey,
        source_id: nonce,
      },
    };

    try {
      PostData(SQUARE_PAYMENTS.PAYMENT_REQUEST_URL, request_body).then(
        (result) => {
          console.log(result);
          if (result.payment && result.payment.status === "COMPLETED") {
            this.savePaymentSuccessDetails(result.payment);
          } else {
            this.setState({
              isProcessing: false,
            });
            alert("Something went wrong, please try again.");
          }
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
  };

  savePaymentSuccessDetails(paymentInfo) {
    console.log(paymentInfo);

    const request_body = {
      FormId: this.props.formId,
      PaymentId: paymentInfo.id,
      AmountMoney: {
        amount: paymentInfo.amount_money.amount / 100,
        currency: paymentInfo.amount_money.currency,
      },
      PaymentStatus: paymentInfo.status,
      PaymentType: "SQUARE",
      SourceType: "CARD",
      PayerDetails: paymentInfo.card_details.card,
      LocationId: paymentInfo.location_id,
      OrderId: paymentInfo.order_id,
      ReceiptNumber: paymentInfo.receipt_number,
      ReceiptUrl: paymentInfo.receipt_url,
      CreatedAt: moment(paymentInfo.created_at).format("X"),
      CreatedBy: "1",
    };

    try {
      PostData(PAYMENT_ACCOUNT_URLS.SAVE_PAYMENT_INFO_URL, request_body).then(
        (result) => {
          console.log(result);
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
          <div className="Checkout Checkout--square Checkout--modal Checkout">
            <div>
              <img
                alt="..."
                src={require("assets/img/square.jpg")}
                style={{ width: "150px", height: "54px" }}
              />
            </div>
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
              <div className="LiveField">
                <label>
                  {this.props.translationInfo.CarNumber || "Card Number"}
                </label>
                <div id="sq-card-number" />
              </div>
              <div className="third LiveField">
                <label>{this.props.translationInfo.CVC || "CVV"}</label>
                <div id="sq-cvv" />
              </div>
              <div className="third LiveField">
                <label>
                  {this.props.translationInfo.ExpirationDate || "Expiration"}
                </label>
                <div id="sq-expiration-date" />
              </div>
              <div className="third LiveField">
                <label>
                  {this.props.translationInfo.Postalode || "Postal Code"}
                </label>
                <div id="sq-postal-code" />
              </div>

              <div
                id="sq-creditcard"
                className="btn-raised btn-primary"
                onClick={this.requestCardNonce}
                style={{
                  pointerEvents: this.state.isProcessing ? "none" : "auto",
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
export default SquareCheckout;
