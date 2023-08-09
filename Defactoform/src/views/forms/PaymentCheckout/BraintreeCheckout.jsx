import React from "react";
import "../../../assets/custom/PaymentCheckout.css";
import {
  BRAINTREE_PAYMENTS,
  PAYMENT_ACCOUNT_URLS,
} from "../../../util/constants";
import moment from "moment";
import { PostData } from "../../../stores/requests";
import DropIn from "braintree-web-drop-in-react";

class BraintreeCheckout extends React.Component {
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
      clientToken: null,
      currentUserId: "",
    };
  }

  componentWillMount() {
    this.getElementsWithAmount(this.props.formJSON);
    this.setValuesInState(this.props);
    this.getNewAccesToken(this.props);
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
    if (propsData.totalPriceValue) {
      this.setState({
        totalPriceValue: Number(this.props.totalPriceValue),
      });
    }
  }

  getNewAccesToken = (propsData) => {
    if (propsData.paymentMethod) {
      const requestBody = {
        environment: propsData.paymentMethod.PaymentMode,
        merchantId: propsData.paymentMethod.MerchantId,
        publicKey: propsData.paymentMethod.PublicKey,
        privateKey: propsData.paymentMethod.PrivateKey,
      };

      try {
        PostData(BRAINTREE_PAYMENTS.GET_ACCESS_TOKEN, requestBody).then(
          (result) => {
            if (result.clientToken) {
              this.setState({
                clientToken: result.clientToken,
              });
            } else {
              alert(
                "Something went wrong. Please check you payment configuration or try again."
              );
            }
          }
        );
      } catch (err) {
        console.log(err);
        alert("Somthing went wrong. Please Try again!");
      }
    }
  };

  requestCardNonce = async (data) => {
    this.setState({
      isProcessing: true,
    });
    try {
      const { nonce } = await this.instance.requestPaymentMethod();
      if (nonce) {
        this.submitPaymentRequest(nonce);
      } else {
        this.setState({
          isProcessing: false,
        });
        alert("Somthing went wrong. Please Try again!");
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isProcessing: false,
      });
    }
  };

  submitPaymentRequest(nonce) {
    const requestBody = {
      environment: this.props.paymentMethod.PaymentMode,
      merchantId: this.props.paymentMethod.MerchantId,
      publicKey: this.props.paymentMethod.PublicKey,
      privateKey: this.props.paymentMethod.PrivateKey,
      bodyInfo: {
        amount: this.props.totalPriceValue,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
    };
    try {
      PostData(BRAINTREE_PAYMENTS.PAYMENT_REQUEST_URL, requestBody).then(
        (result) => {
          if (result.success) {
            this.savePaymentSuccessDetails(result.transaction);
          } else {
            this.setState({
              isProcessing: false,
            });
            alert("Somthing went wrong.Please Try again!");
          }
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        isProcessing: false,
      });
      alert("Somthing went wrong.Please Try again!");
    }
  }

  savePaymentSuccessDetails(transactionInfo) {
    const requestBody = {
      FormId: this.props.formId,
      PaymentId: transactionInfo.id,
      AmountMoney: {
        amount: transactionInfo.amount,
        currency: this.state.currencySymbol,
      },
      PaymentStatus: transactionInfo.processorResponseText,
      PaymentType: "BRAINTREE",
      SourceType: transactionInfo.paymentInstrumentType.toUpperCase(),
      PayerDetails: transactionInfo.creditCard,
      LocationId: "",
      OrderId: transactionInfo.globalId,
      ReceiptNumber: "",
      ReceiptUrl: "",
      CreatedAt: moment(transactionInfo.updatedAt).format("X"),
      CreatedBy: "1",
    };
    try {
      PostData(PAYMENT_ACCOUNT_URLS.SAVE_PAYMENT_INFO_URL, requestBody).then(
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
    if (!this.state.clientToken) {
      return (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <h1>Loading...</h1>
        </div>
      );
    } else {
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
                <DropIn
                  options={{ authorization: this.state.clientToken }}
                  onInstance={(instance) => (this.instance = instance)}
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
                <div
                  id="sq-creditcard"
                  className="btn-raised btn-primary"
                  onClick={() => this.requestCardNonce(this)}
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
}
export default BraintreeCheckout;
