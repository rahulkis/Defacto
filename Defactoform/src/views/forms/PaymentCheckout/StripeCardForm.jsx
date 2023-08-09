import React, { Component } from "react";
import "../../../assets/custom/PaymentCheckout.css";
import { CardElement, injectStripe } from "react-stripe-elements";

// You can customize your Elements to give it the look and feel of your site.
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: "18px",
        color: "#3f5ef4",
        letterSpacing: "0.025em",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#c23d4b",
      },
    },
  };
};

class _CardForm extends Component {
  state = {
    translatedData: {},
    errorMessage: "",
  };

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
  }

  handleChange = ({ error }) => {
    if (error) {
      // this.setState({ errorMessage: error.message });
      if (
        error.code === "invalid_number" ||
        error.code === "incomplete_number"
      ) {
        this.setState({
          errorMessage: this.props.translationInfo
            ? this.props.translationInfo.cardnumbernotvalids || error.message
            : error.message,
        });
      } else if (
        error.code === "incomplete_expiry" ||
        error.code === "invalid_expiry_year_past"
      ) {
        this.setState({
          errorMessage: this.props.translationInfo
            ? this.props.translationInfo.expirationdatenotvalid || error.message
            : error.message,
        });
      } else if (error.code === "incomplete_cvc") {
        this.setState({
          errorMessage: this.props.translationInfo
            ? this.props.translationInfo.PleaseCVV || error.message
            : error.message,
        });
      } else if (error.code === "incomplete_zip") {
        this.setState({
          errorMessage: this.props.translationInfo
            ? this.props.translationInfo.postalcodenotvalid || error.message
            : error.message,
        });
      } else {
        this.setState({ errorMessage: error.message });
      }
      this.props.handleChange(error, null);
    } else {
      this.setState({ errorMessage: "" });
      this.props.handleChange(null, this.props.stripe);
    }
  };

  handleReady = () => {
    console.log("[ready]");
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    if (this.props.stripe) {
      this.props.stripe.createToken().then(this.props.handleResult);
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  render() {
    return (
      <div className="CardDemo" style={{ margin: "5px 0px" }}>
        <div
          onSubmit={this.handleSubmit.bind(this)}
          style={{
            boxShadow: "none !important",
            borderBottom: "0.5px solid #ddd",
            padding: "10px 8px 0px",
            marginBottom: "5px",
          }}
        >
          <label style={{ width: "100%", marginBottom: "0px" }}>
            {this.props.stripe ? (
              <CardElement
                onReady={this.handleReady}
                onChange={this.handleChange}
                {...createOptions()}
              />
            ) : (
              <div>Stripe elements loading..</div>
            )}
          </label>
          {/* <button disabled={!this.props.stripe}>Pay</button> */}
        </div>
        <div
          className="error"
          role="alert"
          style={{ color: "#c23d4b", height: "20px", textAlign: "left" }}
        >
          {this.state.errorMessage}
        </div>
      </div>
    );
  }
}

export const StripeCardForm = injectStripe(_CardForm);
