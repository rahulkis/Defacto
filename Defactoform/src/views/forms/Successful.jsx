import React from "react";

import "../../../src/assets/custom/question_control.css";

class Successful extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewData: "" };
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
            <h1>
              {" "}
              Congratulations your account is associated with stripe
              successfully.{" "}
            </h1>
            <a href="#pablo" onClick={this.goBack.bind(this)}>
              {" "}
              Set More Payment Accounts{" "}
            </a>
          </form>
        </div>
      </div>
    );
  }
}
export default Successful;
