import React from "react";

import "../../../../src/assets/custom/question_control.css";

class ConfigurePayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goBack = (event) => {
    window.open("../user/PaymentIntegrations");
  };

  componentWillMount() {
    let currentURL = window.location.href;
    if (currentURL != null) {
    } else {
    }
  }

  render() {
    return (
      <div>
        <div>
          <form
            name="ViewForm"
            className="full-preview-page preview_page_style"
          >
            <h1>Configure Payment</h1>
            <br />
            Payment account used on this form
            <br />
            <select>
              <option>No Account</option>
            </select>
            <br />
            Currency
            <br />
            <select>
              <option>United States Dollar</option>
              <option>INR</option>
              <option>No Account</option>
            </select>
            <br />
            Payment tax percentage
            <br />
            <input type="number" />
            <br />
            Coupons
            <checkbox />
            <br />
            Custom Pricing Rules
            <checkbox />
            <br />
          </form>
        </div>
      </div>
    );
  }
}
export default ConfigurePayments;
