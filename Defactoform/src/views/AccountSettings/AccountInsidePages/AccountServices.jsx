import React from "react";
import "../../../assets/custom/AccountSettings.css";
import PaymentIntegrations from "../../forms/PaymentIntegrations";

class AccountServices extends React.Component {
  render() {
    return (
      <div className="account-service">
        <PaymentIntegrations />
      </div>
    );
  }
}

export default AccountServices;
