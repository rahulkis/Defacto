/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { INVITE_REFERRAL } from "../../util/constants";
import Loader from "../../components/Common/Loader";
import { GetData } from "../../stores/requests";
import { Redirect } from "react-router-dom";
import "../../../src/assets/custom/Invite.css";
import { Helmet } from "react-helmet";
import { DraftJS } from "megadraft";
import { PostData } from "../../stores/requests";
import { SendEmail } from "../../util/commonFunction";
import { renderEmail } from "react-html-email";
import CryptoJS from "crypto-js";
import { ENCRYPTION_KEYS, USER_RELATED_URLS } from "../../util/constants";

//reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";

class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      isChecked: false,
      IsChecked: false,
      nameError: "",
      emailError: "",
      passwordError: "",
      agreeError: "",
      userName: "",
      isLoader: false,
      isSubmitting: false,
    };

    var userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.loginUserId = parsedData.UserId;
    }
    const url = window.location.href;
    this.referralId = url.substring(url.lastIndexOf("/") + 1);
  }
  componentWillMount = async () => {
    let pageURL = window.location.href;
    let lastURLSegment = pageURL.substr(pageURL.lastIndexOf("/") + 1);
    await this.GetUser_Name(lastURLSegment);
  };

  GetUser_Name = async (Id) => {
    try {
      this.setState({ isLoader: true });
      const URL = INVITE_REFERRAL.GET_USER_NAME + Id;
      GetData(URL).then((result) => {
        if (result.statusCode === 200) {
          let resultedItem = result.data;
          resultedItem = JSON.parse(resultedItem);
          if (resultedItem.Count > 0) {
            this.setState({
              isUserFound: true,
              userName: resultedItem.Items[0].Name,
            });
          } else {
            this.setState({
              isUserFound: false,
            });
          }
          this.setState({ isLoader: false });
        }
      });
    } catch (err) {
      this.setState({ isLoader: false });
    }
  };

  inputHandler = (event) => {
    if (event.target.checked) {
      this.setState({ isChecked: true });
    } else {
      this.setState({ isChecked: false });
    }

    this.setState({ [event.target.name]: event.target.value });
  };
  agreeHandler = (event) => {
    if (event.target.checked) {
      this.setState({ IsChecked: true });
    } else {
      this.setState({ IsChecked: false });
    }
  };

  validationHandler = () => {
    let nameError = "";
    let emailError = "";
    let passwordError = "";
    let agreeError = "";
    if (this.state.Email !== undefined && this.state.Email !== "") {
      const isValidEmail = new RegExp(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
      ).test(this.state.Email);
      if (!isValidEmail) {
        emailError = "INVALID EMAIL";
      }
    }
    if (this.state.Email === "" || this.state.Email === undefined) {
      emailError = "THIS FIELD IS REQUIED";
    }

    if (this.state.Name === "" || this.state.Name === undefined) {
      nameError = "THIS FIELD IS REQUIED";
    }
    if (this.state.Password === "" || this.state.Password === undefined) {
      passwordError = "THIS FIELD IS REQUIED";
    }
    if (
      this.state.Password !== undefined &&
      this.state.Password.length < 6 &&
      this.state.Password.length > 0
    ) {
      passwordError = "THE PASSWORD MUST BE ATLEAST 6 CHARACTERS";
    }
    if (!this.state.IsChecked) {
      agreeError = "THIS FIELD IS REQUIED";
    }
    if (emailError || nameError || passwordError || agreeError) {
      this.setState({ emailError, nameError, passwordError, agreeError });
      return false;
    }
    this.setState({
      emailError: "",
      nameError: "",
      passwordError: "",
      agreeError: "",
    });
    return true;
  };

  emailHTML = (val) => {
    var encryptedData = CryptoJS.AES.encrypt(
      val,
      ENCRYPTION_KEYS.SECRETKEY
    ).toString();
    return renderEmail(
      <div>
        Dear DefactoForm user,
        <p>please click on the below link to confirm the email</p>
        <a
          href={
            window.location.origin.toString() +
            "/preview/VerifyUser/" +
            encryptedData
          }
        >
          verify
        </a>
        <p>Sincerely,</p>
        <p>DefactoForm Team.</p>
      </div>
    );
  };
  sendEmail = async () => {
    var subject = "Please confirm your Email for DefactoForm.";
    await SendEmail(
      this.state.Email,
      subject,
      this.emailHTML(this.state.UserID)
    );
  };

  onSubmit = () => {
    const isValid = this.validationHandler();
    if (isValid) {
      this.setState({
        isSubmitting: true,
      });
      let formModel = {
        email: this.state.Email,
      };
      try {
        PostData(USER_RELATED_URLS.CHECK_USER_EXIST, formModel).then(
          (result) => {
            if (result.Items && result.Count === 0) {
              let _pKey = DraftJS.genKey();
              let FormModel = {
                UserId: _pKey,
                CreatedAt: Date.now(),
                CreatedBy: _pKey,
                Email: this.state.Email,
                IsActive: true,
                IsVerified: false,
                Name: this.state.Name,
                Password: this.state.Password,
                SubscribedNewsPaper: this.state.isChecked,
                UserPlan: "default",
                UserRole: "customer",
                IsStepEnabled: false,
                StepAuthSecretKey: "",
                ReferralBy: this.referralId,
              };
              let UserID = FormModel.UserId;
              this.setState({ UserID: UserID });
              try {
                PostData(USER_RELATED_URLS.ADD_USER_INFO, FormModel).then(
                  (result) => {
                    if (result.statusCode === 200) {
                      var responseJson = {
                        email: this.state.Email,
                        password: this.state.Password,
                      };
                      sessionStorage.setItem(
                        "userData",
                        JSON.stringify(responseJson)
                      );
                      localStorage.setItem(
                        "loginUserInfo",
                        JSON.stringify(FormModel)
                      );
                      this.setState({ redirect: true });
                      this.sendEmail();
                    }
                  }
                );
              } catch (err) {
                this.setState({
                  isSubmitting: false,
                });
                alert("Something went wrong, please try again.");
              }
            } else {
              this.setState({
                isSubmitting: false,
              });
              this.setState({ emailError: "email already exist " });
            }
          }
        );
      } catch (err) {
        this.setState({
          isSubmitting: true,
        });
        alert("Something went wrong, please try again.");
      }
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    if (this.state.redirect && sessionStorage.getItem("userData")) {
      return <Redirect to={"/dashboard"} />;
    }

    // document.querySelector('meta[name="description"]').setAttribute("content", this.state.userName);
    // document.querySelector('meta[name="image"]').setAttribute("content", "https://paperform.co/images/invite2.jpg");
    //document.querySelector('meta[name="title"]').setAttribute("content", "Test");

    return (
      <div className="invite">
        <Helmet>
          <title>
            {this.state.userName} has given you 10% off FormBuilder forever
          </title>
        </Helmet>
        <div className="invite__overlay" />
        {!this.state.isLoader && !this.state.isUserFound && (
          <div style={{ width: "75%" }}>
            <Card className="card-register card-white">
              <CardHeader style={{ padding: "20px 0 0 0" }}>
                <CardTitle
                  tag="h4"
                  style={{
                    fontSize: "2.5em",
                    color: "#32251e",
                    textTransform: "capitalize",
                  }}
                >
                  Invalid Invite code.
                </CardTitle>
              </CardHeader>
              <CardBody />
              <CardFooter>
                <Button className="btn-round" href="/" size="lg">
                  Go to homepage
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        {this.state.isUserFound && (
          <div className="invitepage__pageinner">
            <div>
              <a href="/" style={{ fontSize: "40px", color: "#fff" }}>
                FormBuilder
              </a>

              <h1 className="H1headerStyle">
                {this.state.userName} has given you 10% off FormBuilder forever
              </h1>
              <h2 className="H2headerStyle">
                Claim your gift by registering for a trial, and when you
                complete your account setup, you'll get 10% off any plan
                forever.
                <small className="smallstyle">
                  Discount excludes additional user pricing on agency plans.
                </small>
              </h2>
              <a
                href="javascript:void(0);"
                className="watch-video btn-raised btn-default"
              >
                <i
                  className="fa fa-play-circle"
                  style={{ verticalAlign: "bottom" }}
                />{" "}
                Watch demo
              </a>
            </div>

            <div>
              {this.loginUserId !== this.referralId && (
                <Card className="card-register card-white">
                  <CardHeader>
                    <CardImg
                      alt="..."
                      src={require("assets/img/card-primary.png")}
                      style={{ top: "-5%" }}
                    />
                    <CardTitle
                      tag="h4"
                      style={{
                        textAlign: "left",
                        marginLeft: "0px",
                        fontSize: "4.5em",
                      }}
                    >
                      Register
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="form">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-single-02" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Full Name"
                          type="text"
                          name="Name"
                          id="tooltip209599"
                          onChange={this.inputHandler}
                          value={this.state.Name || ""}
                        />
                      </InputGroup>
                      <div
                        style={{
                          color: "red",
                          marginBottom: "14px",
                          textAlign: "left",
                        }}
                      >
                        {this.state.nameError}
                      </div>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email"
                          type="email"
                          name="Email"
                          onChange={this.inputHandler}
                          value={this.state.Email || ""}
                        />
                      </InputGroup>
                      <div
                        style={{
                          color: "red",
                          marginBottom: "14px",
                          textAlign: "left",
                        }}
                      >
                        {this.state.emailError}
                      </div>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-lock-circle" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Password"
                          type="Password"
                          name="Password"
                          onChange={this.inputHandler}
                          value={this.state.Password || ""}
                        />
                      </InputGroup>
                      <div
                        style={{
                          color: "red",
                          marginBottom: "14px",
                          textAlign: "left",
                        }}
                      >
                        {this.state.passwordError}
                      </div>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agree"
                            onChange={this.agreeHandler}
                            value={this.state.IsChecked}
                          />
                          <span className="form-check-sign" />I agree to the{" "}
                          <a
                            href="javascript:void(0)"
                            onClick={(e) => e.preventDefault()}
                          >
                            terms and conditions
                          </a>
                          .
                          <div
                            style={{
                              color: "red",
                              marginBottom: "14px",
                              textAlign: "left",
                            }}
                          >
                            {this.state.agreeError}
                          </div>
                        </Label>
                      </FormGroup>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="newspaper"
                            onChange={this.inputHandler}
                            value={this.state.isChecked}
                          />
                          <span className="form-check-sign" />I consent to
                          receiving the Paperform newsletter and marketing
                          emails.
                        </Label>
                      </FormGroup>
                    </div>
                  </CardBody>
                  <CardFooter>
                    {!this.state.isSubmitting && (
                      <Button
                        className="btn-round"
                        color="primary"
                        onClick={(e) => this.onSubmit()}
                        size="lg"
                      >
                        Get Started
                      </Button>
                    )}
                    {this.state.isSubmitting && (
                      <Button className="btn-round" color="primary" size="lg">
                        Submitting...
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}
              {this.loginUserId === this.referralId && (
                <div className="invite__form">
                  <strong className="smallstyle">
                    Sorry, invites can't be accepted by existing users.
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="homepage__popup">
          <div className="homepage__close">✕</div>
          <iframe
            title="myFrame"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/pkZE0M-fr4o?showinfo=0&amp;rel=0"
            frameBorder="0"
            allowFullScreen=""
          />
        </div>
      </div>
    );
  }
}

export default Invite;
