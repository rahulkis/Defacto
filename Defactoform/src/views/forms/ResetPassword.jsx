import React, { Component } from "react";
import Loader from "../../components/Common/Loader";
import { UpdateData } from "../../stores/requests";
import CryptoJS from "crypto-js";
import { ENCRYPTION_KEYS, USER_RELATED_URLS } from "../../util/constants";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";

class ResetPassword extends Component {
  state = {
    isLoader: false,
    confirm: false,
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    userId: "",
  };

  componentWillMount() {
    const data = this.props.match.params.userData;

    let encryptedData = CryptoJS.enc.Hex.parse(data);
    let bytes = encryptedData.toString(CryptoJS.enc.Base64);

    bytes = CryptoJS.AES.decrypt(bytes, ENCRYPTION_KEYS.SECRETKEY);
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.setState({ email: decryptedData.email, userId: decryptedData.id });
  }
  passwordHandler = (e) => {
    this.setState({ password: e.target.value });
  };
  confirmPasswordHandler = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };
  validationHandler = (e) => {
    let passwordError = "";
    if (this.state.password === "" || this.state.password === undefined) {
      passwordError = "The password field is required";
    }
    if (
      this.state.password !== undefined &&
      this.state.password.length > 0 &&
      this.state.password.length < 8
    ) {
      passwordError = "The password must be atleast 8 characters";
    }
    if (passwordError) {
      this.setState({ error: passwordError });
      return false;
    }
    this.setState({ error: "" });
    return true;
  };
  handleSubmit = () => {
    let valid = this.validationHandler();
    if (valid) {
      if (this.state.password === this.state.confirmPassword) {
        this.setState({ isLoader: true });

        let FormModel = {
          userId: this.state.userId,
          password: this.state.password,
        };

        try {
          UpdateData(USER_RELATED_URLS.PASSWORD_UPDATE, FormModel).then(
            (result) => {
              if (result.statusCode === 200)
                this.setState({ confirm: true, isLoader: false });
            }
          );
        } catch (err) {
          alert("some error");
        }
      } else {
        this.setState({ error: "the password confirmation does not match" });
      }
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    return (
      <>
        <div className="content">
          {!this.state.confirm && (
            <Container>
              <Col className="ml-auto mr-auto" lg="4" md="6">
                <Form className="form">
                  <Card className="card-login card-white">
                    <CardHeader>
                      <img
                        alt="..."
                        src={require("assets/img/card-primary.png")}
                      />
                      <CardTitle tag="h1">Reset Password</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <input
                          placeholder="Email"
                          type="text"
                          className="form-control"
                          value={this.state.email}
                        />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-lock-circle" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <input
                          placeholder="Password"
                          className="form-control"
                          type="password"
                          value={this.state.password}
                          onChange={(e) => this.passwordHandler(e, "password")}
                        />
                      </InputGroup>
                      {this.state.error && (
                        <div style={{ color: "red", marginBottom: "12px" }}>
                          <span>{this.state.error}</span>
                        </div>
                      )}
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-lock-circle" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <input
                          placeholder="Confirm Password"
                          className="form-control"
                          type="password"
                          value={this.state.confirmPassword}
                          onChange={(e) =>
                            this.confirmPasswordHandler(e, "confirmPassword")
                          }
                        />
                      </InputGroup>
                    </CardBody>
                    <CardFooter>
                      <Button
                        block
                        className="mb-3"
                        color="primary"
                        href="#pablo"
                        onClick={(e) => this.handleSubmit(e)}
                        size="lg"
                      >
                        Reset Password
                      </Button>
                    </CardFooter>
                  </Card>
                </Form>
              </Col>
            </Container>
          )}

          {this.state.confirm && (
            <div data-contents="true">
              <h1
                class="text-center"
                data-block="true"
                data-editor="68f1e"
                data-offset-key="ag6qs-0-0"
              >
                <div
                  data-offset-key="ag6qs-0-0"
                  class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                >
                  <span data-offset-key="ag6qs-0-0">
                    <span data-text="true">
                      Your password updated successfully{" "}
                    </span>
                  </span>
                </div>
              </h1>
              <div
                class="text-center"
                data-block="true"
                data-editor="68f1e"
                data-offset-key="tysw2-0-0"
              >
                <div
                  data-offset-key="tysw2-0-0"
                  class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                >
                  <span data-offset-key="tysw2-0-0">
                    <span data-text="true">
                      Please go to login page and login again.
                    </span>
                  </span>
                  <div>
                    <Button
                      className="mb-3"
                      color="primary"
                      href="/auth/Login"
                      size="s"
                    >
                      Back to login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ResetPassword;
