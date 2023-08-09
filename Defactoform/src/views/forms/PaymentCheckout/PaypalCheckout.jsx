import React from "react";
import "../../../assets/custom/PaymentCheckout.css";
import { PAYPAL_PAYMENTS, PAYMENT_ACCOUNT_URLS } from "../../../util/constants";
import moment from "moment";
import { PostData } from "../../../stores/requests";
import PaypalButton from "./PaypalButton";

class PaypalCheckout extends React.Component {
  constructor(props) {
    super(props);
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
      paypalClientId: null,
      paymentMode: "sandbox",
    };
    this.paymentForm = null;
  }

  componentWillMount() {
    this.getElementsWithAmount(this.props.formJSON);
    this.setValuesInState(this.props);
  }

  componentDidMount() {}

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
    if (propsData.paymentMethod) {
      this.setState({
        paypalClientId: propsData.paymentMethod.PublicKey,
        paymentMode:
          propsData.paymentMethod.PaymentMode === "Test" ||
          propsData.paymentMethod.PaymentMode === "sandbox"
            ? "sandbox"
            : "production",
      });
    }
    if (propsData.totalPriceValue) {
      this.setState({
        totalPriceValue: Number(this.props.totalPriceValue),
      });
    }
  }

  savePaymentSuccessDetails(response) {
    const request_body = {
      FormId: this.props.formId,
      PaymentId: response.paymentID,
      AmountMoney: {
        amount: response.transactions.total,
        currency: response.transactions.currency,
      },
      PaymentStatus: response.relatedResource[0].sale.state.toUpperCase(),
      PaymentType: "PAYPAL BUSINESS",
      SourceType: response.relatedResource[0].sale.payment_mode.toUpperCase(),
      PayerDetails: response.payerInfo,
      LocationId: "",
      OrderId: response.relatedResource[0].sale.id,
      ReceiptNumber: "",
      ReceiptUrl: response.returnUrl,
      CreatedAt: moment(response.createdTime).format("X"),
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

  getElementsWithAmount(formJSON) {
    const self = this;
    let summaryEls = [];
    formJSON.map(function(data, i) {
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
          selectedProducts.map(function(prod, i) {
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
      self.setState({
        summaryElements: summaryEls,
      });
      return summaryEls;
    });
  }

  handleCancelButton = () => {
    this.props.closeModal(false);
  };

  render() {
    const onSuccess = (payment) => {
      console.log("The payment was succeeded!", payment);
      this.savePaymentSuccessDetails(payment);
    };

    const onCancel = (data) => {
      console.log("The payment was cancelled!", data);
    };

    const onError = (err) => {
      console.log("Error!", err);
      alert("Something went wrong. Please try again");
    };

    const client = {
      sandbox: this.state.paypalClientId,
      production: this.state.paymentMode,
    };

    const style = {
      size: "responsive",
      shape: "rect",
      color: "gold",
    };

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
              <PaypalButton
                env={PAYPAL_PAYMENTS.MODE}
                client={client}
                currency={this.state.selectedCurrency}
                total={this.state.totalPriceValue}
                // total={this.state.totalPriceValue}
                style={style}
                onError={onError}
                onSuccess={onSuccess}
                onCancel={onCancel}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PaypalCheckout;
