import React from "react";

import ReactModal from "react-modal";
import "../../../src/assets/custom/question_control.css";
import {
  GetData,
  PostData,
  PostDataCorsWithBody,
  DeleteForm,
  PostDataWithHeaderWithoutJson,
} from "../../stores/requests";
import {
  STRIPE_PAYMENTS,
  PAYMENT_ACCOUNT_URLS,
  SQUARE_PAYMENTS,
  PAYPAL_PAYMENTS,
  BRAINTREE_PAYMENTS,
} from "../../util/constants";
import { DraftJS } from "megadraft";
import {
  getAccountDetailByToken_Square,
  getAccountDetailByToken_Stripe,
} from "../../API/IntegrationAPI";
import _ from "lodash";

ReactModal.setAppElement("#root");
class PaymentIntegrations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ViewData: "",
      showModal: false,
      merchantValue: "",
      publicKeyValue: "",
      privateKeyValue: "",
      showPaypalModal: false,
      selectedPaymentMode: "sandbox",
      BusinessName: "KIS",
      paymentAccountList: [],
      AccountType: "BRAINTREE",
      isAccountExist: false,
      isInvalid: false,
      defaultCurrencyValue: "USD",
      currentUserId: null,
      redirectURI: "",
      isAccountLimitReached: false,
    };
    this.setStripeAccount = this.setStripeAccount.bind(this);
    this.MerchantChange = this.MerchantChange.bind(this);
    this.PublicKeyChange = this.PublicKeyChange.bind(this);
    this.privateKeyChange = this.privateKeyChange.bind(this);
    this.handleBraintreeLogin = this.handleBraintreeLogin.bind(this);
    this.handlePaypalLogin = this.handlePaypalLogin.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.Login = this.Login.bind(this);
    this.connectSquare = this.connectSquare.bind(this);
    //  this.handlePaymentModeChange=this.handlePaymentModeChange.bind(this);
  }
  validatePaymentForm = () => {
    let validate = true;
    if (this.state.publicKeyValue === "") {
      validate = false;
    }
    if (this.state.privateKeyValue === "") {
      validate = false;
    }
    if (this.state.merchantValue === "") {
      validate = false;
    }
    return validate;
  };
  getBraintreeMerchantDetails = () => {
    const paymntAccnt = _.filter(
      this.state.paymentAccountList,
      (paymtAccnt) =>
        paymtAccnt.PublicKey === this.state.PublicKey ||
        paymtAccnt.PrivateKey === this.state.privateKeyValue ||
        paymtAccnt.MerchantId === this.state.merchantValue
    );
    if (paymntAccnt.length > 0) {
      this.setState({ isAccountExist: true });
      return false;
    }

    if (this.validatePaymentForm()) {
      const RequestBody = {
        environment: this.state.selectedPaymentMode,
        merchantId: this.state.merchantValue,
        publicKey: this.state.publicKeyValue,
        privateKey: this.state.privateKeyValue,
      };

      try {
        PostData(BRAINTREE_PAYMENTS.GET_MERCHANT_DETAIL_URL, RequestBody).then(
          (result) => {
            console.log(result);
            if (result && result.length > 0) {
              if (result[0].status === "active") {
                this.SaveBraintreeDetails(result[0]);
              } else {
                alert("This Merchant is not active!!");
              }
            } else {
              alert("Somthing went wrong. Please Try with correct information");
            }
          }
        );
      } catch (err) {
        console.log(err);
        alert("Somthing went wrong.Please Try again!");
      }
    } else {
      this.setState({ isPaymntFormSubmitted: true });
    }
  };
  SaveBraintreeDetails = async (merchantData) => {
    console.log(merchantData);

    let FormModel = {
      PaymentAccountId: DraftJS.genKey(),
      AccountType: this.state.AccountType,
      PaymentMode: this.state.selectedPaymentMode,
      MerchantId: this.state.merchantValue,
      PublicKey: this.state.publicKeyValue,
      PrivateKey: this.state.privateKeyValue,
      BusinessName: merchantData.id,
      Label: merchantData.id,
      UserId: this.state.currentUserId,
      CreatedAt: Date.now(),
      RefereshToken: " ",
    };
    // this.setState({ selectedAccntID: FormModel.ID });
    try {
      await PostData(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, FormModel).then(
        (result) => {
          this.getPaymentAccountList(this.state.currentUserId);
        }
      );
    } catch (err) {
      console.log(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, err);
      alert("Somthing went wrong. Please Try again");
    }
    this.setState({
      isPaymntFormSubmitted: false,
      showModal: false,
      isAccountExist: false,
    });
  };

  saveSquareDetail = async (refereshToken, accessToken, merchantid) => {
    let lists = await getAccountDetailByToken_Square(accessToken);

    let FormModel = {
      PaymentAccountId: DraftJS.genKey(),
      AccountType: "SQUARE",
      PaymentMode: SQUARE_PAYMENTS.PAYMENT_MODE,
      MerchantId: merchantid,
      PublicKey: " ",
      PrivateKey: " ",
      BusinessName: lists.locationName,
      Label: lists.locationName,
      UserId: this.state.currentUserId,
      Locations: lists.locations,
      RefereshToken: refereshToken,
      CreatedAt: Date.now(),
    };
    try {
      PostData(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, FormModel).then(
        (result) => {
          this.getPaymentAccountList(this.state.currentUserId);
        }
      );
    } catch (err) {
      console.log(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, err);
      alert("Something went wrong. Please try again later");
    }
  };
  getPaymentAccountList = (userId) => {
    const currentUserId = userId || this.state.currentUserId;
    GetData(
      PAYMENT_ACCOUNT_URLS.GET_PAYMENT_ACCOUNT_BY_USER + currentUserId
    ).then((result) => {
      if (
        result != null &&
        result.data.Items !== undefined &&
        result.data.Items.length > 0
      ) {
        console.log(result);
        this.setState({
          isPaymentList: true,
          paymentAccountList: result.data.Items,
        });

        if (result.data.Items.length < 3) {
          this.setState({
            isAccountLimitReached: false,
          });
        } else {
          this.setState({
            isAccountLimitReached: true,
          });
        }
      } else {
        this.setState({ paymentAccountList: [] });
        this.setState({
          isAccountLimitReached: false,
        });
      }
    });
  };

  saveStripeDetail = async (
    refereshToken,
    accessToken,
    stripeId,
    modeSection,
    publishable_key
  ) => {
    let lists = await getAccountDetailByToken_Stripe(accessToken, stripeId);
    const userData = JSON.parse(lists.UserInfo);
    let FormModel = {
      PaymentAccountId: DraftJS.genKey(),
      AccountType: "STRIPE",
      PaymentMode: modeSection === true ? "Live" : "SandBox",
      MerchantId: stripeId,
      PublicKey: publishable_key,
      PrivateKey: " ",
      BusinessName:
        userData.business_profile.name ||
        userData.email + " (Stripe)" ||
        "Form Builder",
      Label:
        userData.business_profile.name ||
        userData.email + " (Stripe)" ||
        "Form Builder",
      UserId: this.state.currentUserId,
      Locations: lists.UserInfo,
      RefereshToken: refereshToken,
      CreatedAt: Date.now(),
    };
    try {
      PostData(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, FormModel).then(
        (result) => {
          this.getPaymentAccountList(this.state.currentUserId);
        }
      );
    } catch (err) {
      console.log(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, err);
      alert("Something went wrong. Please try again later");
    }
  };
  componentDidMount() {
    const userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const uData = JSON.parse(userData);
      this.setState({
        currentUserId: uData.UserId,
      });
    }

    if (this.getUrlVars()["code"] !== undefined)
      console.log("Updatecode", this.getUrlVars()["code"]);
    if (localStorage.getItem("PaymentType") === "STRIPE") {
      this.getStripeAccessToken(this.getUrlVars()["code"]);
    } else if (localStorage.getItem("PaymentType") === "SQUARE") {
      this.getSquareAccessToken(this.getUrlVars()["code"]);
    }

    this.setState({
      redirectURI: `${window.location.origin.toString()}/user/PaymentIntegrations`,
    });
  }
  getUrlVars = () => {
    let vars = [],
      hash;
    let hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = decodeURI(hash[1]);
    }
    return vars;
  };

  // Get Stripe Access Token
  getStripeAccessToken = (code) => {
    if (code !== "") {
      localStorage.removeItem("PaymentType");
      const bodyFormData = {
        client_secret: STRIPE_PAYMENTS.CLIENT_SECRET,
        code: code,
        grant_type: STRIPE_PAYMENTS.GRANT_TYPE,
      };
      PostDataCorsWithBody(STRIPE_PAYMENTS.ACCESSTOKEN_URL, bodyFormData).then(
        (result) => {
          if (result != null) {
            if (result.error !== "invalid_request") {
              this.saveStripeDetail(
                result.refresh_token,
                result.access_token,
                result.stripe_user_id,
                result.livemode,
                result.stripe_publishable_key
              );
              // console.log("STRIPE", result);
            }
          }
        }
      );
    }
  };
  getSquareAccessToken = (code) => {
    localStorage.removeItem("PaymentType");
    if (code !== "") {
      // bodyFormData.append("grant_type", "authorization_code");
      const bodyFormData1 = {
        client_id: SQUARE_PAYMENTS.CLIENT_ID,
        client_secret: SQUARE_PAYMENTS.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
      };

      PostDataCorsWithBody(SQUARE_PAYMENTS.TOKENAUTH_URL, bodyFormData1)
        .then((result) => {
          if (result != null) {
            if (
              (result.refresh_token, result.access_token, result.merchant_id)
            ) {
              this.saveSquareDetail(
                result.refresh_token,
                result.access_token,
                result.merchant_id
              );
            }
            console.log("SQUARE", result);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong. Please try again later");
        });
    }
  };

  getPayPalAccessToken = (clientId, clientSecret) => {
    localStorage.removeItem("PaymentType");
    if (clientId !== "" && clientSecret !== "") {
      const headersData = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: this.authenticateUser(clientId, clientSecret),
      };

      let bodyFormData = ["grant_type=client_credentials"];

      PostDataWithHeaderWithoutJson(
        PAYPAL_PAYMENTS.GET_ACCESS_TOKEN_URL,
        headersData,
        bodyFormData
      ).then((result) => {
        if (result != null) {
          this.SavePayPalDetail(result.access_token, result.app_id);
          console.log("PayPal", result);
        }
      });
    }
  };
  authenticateUser = (user, password) => {
    let token = user + ":" + password;

    // Should i be encoding this value????? does it matter???
    // Base64 Encoding -> btoa
    let hash = btoa(token);

    return "Basic " + hash;
  };
  ClickToPayPal = () => {
    this.getPayPalAccessToken(
      this.state.publicKeyValue,
      this.state.privateKeyValue
    );
  };

  SavePayPalDetail = (acess_token, app_id) => {
    const paymntAccnt = _.filter(
      this.state.paymentAccountList,
      (paymtAccnt) =>
        paymtAccnt.PublicKey === this.state.PublicKey ||
        paymtAccnt.PrivateKey === this.state.privateKeyValue
    );
    if (paymntAccnt.length > 0) {
      this.setState({ isAccountExist: true });
      return false;
    }

    if (this.validatePaymentForm()) {
      let FormModel = {
        PaymentAccountId: DraftJS.genKey(),
        AccountType: "PAYPAL BUSINESS",
        PaymentMode: this.state.selectedPaymentMode,
        MerchantId: app_id,
        PublicKey: this.state.publicKeyValue,
        PrivateKey: this.state.privateKeyValue,
        BusinessName: this.state.merchantValue,
        Label: this.state.merchantValue,
        UserId: this.state.currentUserId,
        CreatedAt: Date.now(),
        RefereshToken: acess_token,
      };
      try {
        PostData(PAYMENT_ACCOUNT_URLS.ADD_PAYMENT_ACCOUNT, FormModel).then(
          (result) => {
            this.getPaymentAccountList(this.state.currentUserId);
            this.setState({ showPaypalModal: false });
          }
        );
      } catch (err) {}
      this.setState({
        isPaymntFormSubmitted: false,
        showModal: false,
        isAccountExist: false,
      });
      this.setState({ showPaypalModal: false });
    } else {
      this.setState({ isPaymntFormSubmitted: true });
      this.setState({ showPaypalModal: false });
    }
  };

  setStripeAccount = (event) => {
    localStorage.setItem("PaymentType", "STRIPE");
    window.open(
      STRIPE_PAYMENTS.STRIPE_AUTH_URL +
        "/authorize?response_type=code&client_id=" +
        STRIPE_PAYMENTS.CLIENT_ID +
        "&scope=read_write&redirect_uri=" +
        this.state.redirectURI,
      "_blank"
    );
  };

  connectSquare = (event) => {
    localStorage.setItem("PaymentType", "SQUARE");

    window.open(
      "https://" +
        SQUARE_PAYMENTS.HOSTNAME +
        "/oauth2/authorize?client_id=" +
        SQUARE_PAYMENTS.CLIENT_ID +
        "&scope=MERCHANT_PROFILE_READ+PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS+PAYMENTS_WRITE+PAYMENTS_READ",
      "_blank"
    );
  };
  handleBraintreeLogin = (event) => {
    this.setState({
      showModal: true,
    });
  };
  handlePaypalLogin = (event) => {
    this.setState({
      showPaypalModal: true,
    });
  };
  MerchantChange = (event) => {
    if (event.target !== undefined) {
      this.setState({ merchantValue: event.target.value });
    }
  };
  handlePaymentModeChange = (event, value) => {
    this.setState({ selectedPaymentMode: value });
  };
  PublicKeyChange = (event) => {
    if (event.target !== undefined) {
      this.setState({ publicKeyValue: event.target.value });
    }
  };
  privateKeyChange = (event) => {
    if (event.target !== undefined) {
      this.setState({ privateKeyValue: event.target.value });
    }
  };

  deletePaymentAccount = (e, id) => {
    let result = window.confirm(
      "Are you sure you want to delete this Account?"
    );
    if (result) {
      DeleteForm(PAYMENT_ACCOUNT_URLS.REMOVE_PAYMENT_ACCOUNT + id).then(
        (result) => {
          if (result != null) {
            if (result.statusCode === 200) {
              this.getPaymentAccountList(this.state.currentUserId);
              //window.alert("Selected Submission deleted successfully.");
            } else {
              // deleteSuccess = false;
              window.alert("There is an error in deleting the Submission.");
            }
          }
        }
      );
    }
  };

  handleCloseModal() {
    this.setState({
      showModal: false,
      showPaypalModal: false,
      isPaymntFormSubmitted: false,
      isAccountExist: false,
    });
  }
  Login = (event) => {};
  componentWillMount() {
    const userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const uData = JSON.parse(userData);
      this.setState({
        currentUserId: uData.UserId,
      });
      this.getPaymentAccountList(uData.UserId);
    }
  }
  DefaultCurrencyChange = (event) => {
    if (event.target !== undefined) {
      this.setState({ defaultCurrencyValue: event.target.value });
    }
  };
  render() {
    return (
      <div>
        <div>
          <form
            name="ViewForm"
            className="full-preview-page preview_page_style"
          >
            {/* <a href="#" onClick={this.setPayment.bind(this)}>Manage all Payment Accounts</a> */}
            <div>
              <h1>Payment Accounts</h1>
              <div>
                You can connect up to three live payment accounts on the
                Paperform Pro Plan, to add more Upgrade to
                <a className="primary" href="#pablo">
                  {" "}
                  Defacto Agency{" "}
                </a>
              </div>
              <div style={{ marginBottom: "18px", marginTop: "18px" }}>
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  style={{ fontFamily: "inherit", fontSize: "14px" }}
                  onClick={this.setStripeAccount.bind(this)}
                >
                  <span>Connect Stripe</span>
                </div>
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  style={{
                    marginLeft: "15px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                  onClick={this.handleBraintreeLogin}
                >
                  <span>Connect Braintree</span>
                </div>
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  style={{
                    marginLeft: "15px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                  onClick={this.handlePaypalLogin}
                >
                  <span>Connect Paypal Business</span>
                </div>
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  style={{
                    marginLeft: "15px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                  onClick={this.connectSquare}
                >
                  <span>Connect Square</span>
                </div>
              </div>
            </div>
            <div className="row">
              <table className="table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Business</th>
                    <th>Service</th>
                    <th>LiveMode</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.paymentAccountList.length === 0 && (
                    <tr>
                      <td colSpan="5">No Data found</td>
                    </tr>
                  )}
                  {this.state.paymentAccountList.map((track, key) => (
                    <tr key={"configuredAccount" + track.PaymentAccountId}>
                      <td style={{ wordWrap: "break-word" }}>{track.Label}</td>
                      <td style={{ wordWrap: "break-word" }}>
                        {track.BusinessName}
                      </td>
                      <td>{track.AccountType}</td>
                      <td>
                        {track.PaymentMode === "Test" ||
                        track.PaymentMode === "SandBox" ||
                        track.PaymentMode === "Sandbox" ||
                        track.PaymentMode === "sandbox"
                          ? "No"
                          : "Yes"}
                      </td>
                      <td>
                        <button
                          className="btn btn-default"
                          onClick={(e) =>
                            this.deletePaymentAccount(e, track.PaymentAccountId)
                          }
                        >
                          delete{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>
        {/* // </div> */}
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose"
          onRequestClose={this.handleCloseModal}
        >
          <button onClick={this.handleCloseModal}> Close </button>
          <div>
            <h2>Add a Braintree Account</h2>
            <div>
              <p className="visibleParagraph">
                We support PayPal via Braintree. See the{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://articles.braintreepayments.com/guides/paypal/setup-guide"
                >
                  Braintree setup guide
                </a>{" "}
                for more information on how to connect PayPal and Braintree.
              </p>
            </div>
            <div>
              <p className="visibleParagraph">
                Enter the connection details of your Braintree account below.
                See{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://articles.braintreepayments.com/control-panel/important-gateway-credentials"
                >
                  Braintree instructions
                </a>{" "}
                for more information.
              </p>
            </div>
            <div>
              <label>Merchant Id</label>
              <input type="text" onChange={(e) => this.MerchantChange(e)} />
              {this.state.isPaymntFormSubmitted &&
                this.state.merchantValue === "" && (
                  <div className="form-error"> This field is required. </div>
                )}
            </div>
            <div />
            <div>
              <label>Public Key</label>
            </div>
            <div>
              <input type="text" onChange={(e) => this.PublicKeyChange(e)} />
              {this.state.isPaymntFormSubmitted &&
                this.state.publicKeyValue === "" && (
                  <div className="form-error"> This field is required. </div>
                )}
            </div>
            <div>
              <label>Private Key</label>
            </div>
            <div>
              <input type="text" onChange={(e) => this.privateKeyChange(e)} />
              {this.state.isPaymntFormSubmitted &&
                this.state.privateKeyValue === "" && (
                  <div className="form-error"> This field is required. </div>
                )}
            </div>
            <div>
              <label>Live Mode Select No if this a sandbox account</label>
            </div>
            <div className="ProductConfiguration__DefaultBlock">
              <div className="YesNo">
                <label
                  value="Live"
                  onClick={(e) => this.handlePaymentModeChange(e, "production")}
                  className={
                    this.state.selectedPaymentMode === "production"
                      ? "btn-raised btn-primary"
                      : "btn-raised btn-default"
                  }
                >
                  yes
                </label>

                {/* <input
          type={"radio"}
          name="yes"
          value="yes"
          id={this.props.id}
          checked={this.state.selectedOption === "yes"}
        /> */}
                <label
                  value="sandbox"
                  onClick={(e) => this.handlePaymentModeChange(e, "sandbox")}
                  className={
                    this.state.selectedPaymentMode === "sandbox"
                      ? "btn-raised btn-primary"
                      : "btn-raised btn-default"
                  }
                >
                  Yo
                </label>
              </div>
            </div>
            {this.state.isAccountExist === true && (
              <div className="form-error"> Account already exist. </div>
            )}
            {this.state.isInvalid === true && (
              <div className="form-error"> Invalid Credential. </div>
            )}
            <div>
              {/* onClick={this.Login} */}
              <button
                className="btn btn-toggle-view-btn btn-round btn btn-default"
                onClick={() => this.getBraintreeMerchantDetails()}
              >
                <span>Connect Account</span>
              </button>
            </div>
            {/* <div>
                            <input type="button"> Login  </input> */}
            {/* // onClick={e=> this.Login(e)}> LogIn </input> */}
            {/* </div> */}
          </div>
        </ReactModal>
        <ReactModal
          isOpen={this.state.showPaypalModal}
          contentLabel="onRequestClose"
          onRequestClose={this.handleCloseModal}
        >
          <button onClick={this.handleCloseModal}> Close </button>
          <div>
            <h2>Add a PayPal Account</h2>
            <div>
              <p className="visibleParagraph">
                {" "}
                We support PayPal for Business. You'll need a few details from
                your PayPal account to get started.
              </p>
            </div>
            <div>
              <p className="visibleParagraph">
                Not sure what all these questions are?
                <a
                  rel="noopener noreferrer"
                  href="https://help.paperform.co/payments/how-to-connect-a-paypal-business-account"
                  target="_blank"
                >
                  {" "}
                  Read full instructions here
                </a>
              </p>
            </div>
            <div>
              <label>PayPal Account Email</label>
              <input type="text" onChange={(e) => this.MerchantChange(e)} />
            </div>
            <div />
            <div>
              <label>Client ID</label>
            </div>
            <div>
              <input type="text" onChange={(e) => this.PublicKeyChange(e)} />
            </div>
            <div>
              <label>Client Secret</label>
            </div>
            <div>
              <input type="text" onChange={(e) => this.privateKeyChange(e)} />
            </div>
            <div>
              <label>Default Currency</label>
            </div>
            <div>
              <input
                type="text"
                placeholder="USD"
                onChange={(e) => this.DefaultCurrencyChange(e)}
              />
            </div>
            <div>
              <label>Are these Sandbox details?</label>
            </div>
            <div className="ProductConfiguration__DefaultBlock">
              <div className="YesNo">
                <label
                  value="sandbox"
                  onClick={(e) => this.handlePaymentModeChange(e, "sandbox")}
                  className={
                    this.state.selectedPaymentMode === "sandbox"
                      ? "btn-raised btn-primary"
                      : "btn-raised btn-default"
                  }
                >
                  yes
                </label>
                <label
                  value="Live"
                  onClick={(e) => this.handlePaymentModeChange(e, "Live")}
                  className={
                    this.state.selectedPaymentMode === "Live"
                      ? "btn-raised btn-primary"
                      : "btn-raised btn-default"
                  }
                >
                  no
                </label>
              </div>
            </div>
          </div>
          {this.state.isAccountExist === true && (
            <div className="form-error"> Account already exist. </div>
          )}
          {this.state.isInvalid === true && (
            <div className="form-error"> Invalid Credential. </div>
          )}
          <div>
            <button
              className="btn btn-toggle-view-btn btn-round btn btn-default"
              onClick={() => this.ClickToPayPal()}
            >
              <span>Connect Account</span>
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}
export default PaymentIntegrations;
