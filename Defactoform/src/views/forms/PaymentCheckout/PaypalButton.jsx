import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import { PAYPAL_PAYMENTS } from "../../../util/constants";

class PaypalButton extends React.Component {
  constructor(props) {
    super(props);
    window.React = React;
    window.ReactDOM = ReactDOM;
    this.state = {
      showButton: false,
      commit: true, // Show a 'Pay Now' button
    };
  }
  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
  }
  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (!this.state.show) {
      if (isScriptLoaded && !this.props.isScriptLoaded) {
        if (isScriptLoadSucceed) {
          this.setState({ showButton: true });
        } else {
          console.log("Cannot load Paypal script!");
          this.props.onError();
        }
      }
    }
  }

  render() {
    const payment = () =>
      window.paypal.rest.payment.create(this.props.env, this.props.client, {
        transactions: [
          {
            amount: { total: this.props.total, currency: this.props.currency },
          },
        ],
      });

    const onAuthorize = (data, actions) =>
      actions.payment.execute().then((resp) => {
        const payment = Object.assign({}, this.props.payment);
        payment.paid = true;
        payment.cancelled = false;
        payment.payerID = data.payerID;
        payment.paymentID = data.paymentID;
        payment.paymentToken = data.paymentToken;
        payment.payerInfo = resp.payer.payer_info;
        payment.returnUrl = data.returnUrl;
        payment.createdTime = resp.create_time;
        payment.transactions = resp.transactions[0].amount;
        payment.relatedResource = resp.transactions[0].related_resources;
        this.props.onSuccess(payment);
      });

    let ppbtn = "";
    if (this.state.showButton) {
      ppbtn = React.createElement(window.paypal.Button.react, {
        env: this.props.env,
        client: this.props.client,
        style: this.props.style,
        payment: payment,
        commit: true,
        onAuthorize: onAuthorize,
        onCancel: this.props.onCancel,
      });
    }
    return React.createElement("div", null, ppbtn);
  }
}

PaypalButton.defaultProps = {
  env: PAYPAL_PAYMENTS.MODE,
  onSuccess: (payment) => {
    console.log("The payment was succeeded!", payment);
  },
  onCancel: (data) => {
    console.log("The payment was cancelled!", data);
  },
  onError: (err) => {
    console.log("Error loading Paypal script!", err);
  },
};

export default scriptLoader(PAYPAL_PAYMENTS.BUTTON_SCRIPT_URL)(PaypalButton);
