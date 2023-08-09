/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Redirect } from "react-router-dom";
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
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

class Register extends React.Component {
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
      userID: "",
      referralBy: "",
    };
  }
  componentDidMount() {
    // document.body.classList.toggle("register-page");
  }

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
    if (this.state.Email) {
      const isValidEmail = new RegExp(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
      ).test(this.state.Email);
      if (!isValidEmail) {
        emailError = "INVALID EMAIL";
      }
    }
    if (!this.state.Email) {
      emailError = "THIS FIELD IS REQUIED";
    }

    if (!this.state.Name) {
      nameError = "THIS FIELD IS REQUIED";
    }
    if (!this.state.Password) {
      passwordError = "THIS FIELD IS REQUIED";
    }
    if (
      this.state.Password &&
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
    let encryptedData = CryptoJS.AES.encrypt(
      val,
      ENCRYPTION_KEYS.SECRETKEY
    ).toString();
    return renderEmail(
      <div>
        Dear FormBuilder user,
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
    let subject = "Please confirm your Email for FormBuilder.";
    await SendEmail(
      this.state.Email,
      subject,
      this.emailHTML(this.state.userID)
    );
  };

  onSubmit = () => {
    const isValid = this.validationHandler();
    if (isValid) {
      let formModel = {
        email: this.state.Email,
      };
      try {
        PostData(USER_RELATED_URLS.CHECK_USER_EXIST, formModel).then(
          (result) => {
            if (result.Items.length <= 0) {
              let _pKey = DraftJS.genKey();
              let formModel1 = {
                UserId: _pKey,
                CreatedAt: Date.now(),
                CreatedBy: _pKey,
                Email: this.state.Email,
                IsActive: true,
                IsVerified: false,
                Name: this.state.Name,
                Password: this.state.Password,
                SubscribedNewsPaper: this.state.isChecked,
                UserPlan: "Trial",
                UserRole: "customer",
                IsStepEnabled: false,
                StepAuthSecretKey: "",
                ReferralBy: this.state.referralBy,
              };
              let userID = formModel1.UserId;
              this.setState({ userID: userID });
              try {
                PostData(USER_RELATED_URLS.ADD_USER_INFO, formModel1).then(
                  (result) => {
                    if (result.statusCode === 200) {
                      let responseJson = {
                        email: this.state.Email,
                        password: this.state.Password,
                      };
                      sessionStorage.setItem(
                        "userData",
                        JSON.stringify(responseJson)
                      );
                      localStorage.setItem(
                        "loginUserInfo",
                        JSON.stringify(formModel1)
                      );
                      this.setState({ redirect: true });
                      this.sendEmail();
                    }
                  }
                );
              } catch (err) {
                alert("Something went wrong, please try again.");
              }
            } else {
              this.setState({ emailError: "email already exist " });
            }
          }
        );
      } catch (err) {
        alert("Something went wrong, please try again.");
      }
    }
  };

  componentWillUnmount() {
    // document.body.classList.toggle("register-page");
  }
  render() {
    if (this.state.redirect && sessionStorage.getItem("userData")) {
      return <Redirect to={"../dashboard"} />;
    }

    return (
      <>
        <div />
        <div className="content">
          <Container>
            <Row>
              <Col className="ml-auto" md="5">
                <div className="info-area info-horizontal mt-5">
                  <div className="icon icon-warning">
                    <i className="tim-icons icon-wifi" />
                  </div>
                  <div className="description">
                    <h3 className="info-title">Marketing</h3>
                    <p className="description">
                      We've created the marketing campaign of the website. It
                      was a very interesting collaboration.
                    </p>
                  </div>
                </div>
                <div className="info-area info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-triangle-right-17" />
                  </div>
                  <div className="description">
                    <h3 className="info-title">Fully Coded in HTML5</h3>
                    <p className="description">
                      We've developed the website with HTML5 and CSS3. The
                      client has access to the code using GitHub.
                    </p>
                  </div>
                </div>
                <div className="info-area info-horizontal">
                  <div className="icon icon-info">
                    <i className="tim-icons icon-trophy" />
                  </div>
                  <div className="description">
                    <h3 className="info-title">Built Audience</h3>
                    <p className="description">
                      There is also a Fully Customizable CMS Admin Dashboard for
                      this product.
                    </p>
                  </div>
                </div>
              </Col>
              <Col className="mr-auto" md="7">
                <Card className="card-register card-white">
                  <CardHeader>
                    <CardImg
                      alt="..."
                      src={require("assets/img/card-primary.png")}
                    />
                    <CardTitle tag="h4">Register</CardTitle>
                  </CardHeader>
                  <CardBody style={{ minHeight: "auto !important" }}>
                    <Form className="form">
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
                          defaultValue={this.state.Name}
                        />
                      </InputGroup>
                      <div style={{ color: "red", marginBottom: "14px" }}>
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
                          defaultValue={this.state.Email}
                        />
                      </InputGroup>
                      <div style={{ color: "red", marginBottom: "14px" }}>
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
                          defaultValue={this.state.Password}
                        />
                      </InputGroup>
                      <div style={{ color: "red", marginBottom: "14px" }}>
                        {this.state.passwordError}
                      </div>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="agree"
                            onChange={this.agreeHandler}
                            defaultValue={this.state.IsChecked}
                          />
                          <span className="form-check-sign" />I agree to the{" "}
                          <a
                            href="javascript;"
                            onClick={(e) => e.preventDefault()}
                          >
                            terms and conditions
                          </a>
                          .
                          <div style={{ color: "red", marginBottom: "14px" }}>
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
                            defaultValue={this.state.isChecked}
                          />
                          <span className="form-check-sign" />I consent to
                          receiving the Paperform newsletter and marketing
                          emails.
                        </Label>
                      </FormGroup>
                    </Form>
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="btn-round"
                      color="primary"
                      href="#pablo"
                      onClick={(e) => this.onSubmit()}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Register;
