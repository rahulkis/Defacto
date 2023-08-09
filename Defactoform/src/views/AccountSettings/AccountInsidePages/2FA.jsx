import React from "react";
import speakeasy from "speakeasy";
import QRCode from "react-qr-code";
import { UpdateData } from "../../../stores/requests";
import { USER_RELATED_URLS } from "../../../util/constants";
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

export default class TwoFactorAuthentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gmail: "",
      secretKey: "",
      secretURL: "",
      token: "",
      authenticateKey: "",
      resetState: false,
      error: "",
    };
  }
  userDetail = () => {
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData !== null) {
      // return "DefactoForm" + "(" + JsonData.Email + ")";

      return `DefactoForm(${JsonData.Email})`;
    }
  };

  componentWillMount() {
    this.userDetail();
    this.handleGenerateSecret();
    let checkReset = localStorage.getItem("reset2FA");
    if (checkReset === "true") {
      this.setState({ resetState: true });
    } else {
      this.setState({ resetState: false });
    }
  }
  handleGenerateSecret = async () => {
    let secret = speakeasy.generateSecret();
    let res = secret.otpauth_url.replace("SecretKey", this.userDetail());
    this.setState({
      secretKey: secret.ascii,
      secretURL: res,
      authenticateKey: secret.base32,
    });
  };
  handlerChange = (e) => {
    this.setState({ token: e.target.value });
  };
  confirmHandler() {
    let verified = speakeasy.totp.verify({
      secret: this.state.secretKey,
      encoding: "ascii",
      token: this.state.token,
    });
    if (verified === true) {
      let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
      let FormModel = {
        IsStepEnabled: true,
        StepAuthSecretKey: this.state.secretKey,
        UserId: JsonData.UserId,
        UpdateAt: Date.now(),
      };
      try {
        UpdateData(USER_RELATED_URLS.TWO_FACTOR_AUTHENTICATION, FormModel).then(
          (result) => {
            if (result.statusCode === 200) {
              this.props.history.push("../dashboard");
              localStorage.setItem("2faActivate", true);
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({ error: "Code is incorrect, please try again." });
      localStorage.setItem("2faActivate", false);
    }
  }
  render() {
    const title = {
      width: "56%",
      position: "absolute",
      top: "10px",
      padding: "15px 50px 15px 9px",
      textAlign: "left",
      color: "#fff",
      fontSize: "3em",
      fontWeight: "500",
    };
    return (
      <>
        <div className="content" style={{ paddingTop: "20px" }}>
          <Container>
            <Col className="ml-auto mr-auto" lg="8" md="6">
              <Form className="form">
                <Card
                  className="card-login card-white"
                  style={{ textAlign: "center" }}
                >
                  <CardHeader style={{ width: "67%", textAlign: "left" }}>
                    <img
                      alt="..."
                      src={require("assets/img/card-primary.png")}
                    />
                    {!this.state.resetState && (
                      <CardTitle tag="h1" style={title}>
                        {" "}
                        Setup 2Factor Authentication
                      </CardTitle>
                    )}
                    {this.state.resetState && (
                      <CardTitle tag="h1" style={title}>
                        {" "}
                        Reset 2Factor Authentication
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardBody style={{ marginTop: "-35px", minHeight: "auto" }}>
                    {this.state.resetState && (
                      <div>
                        <p style={{ fontSize: "20px" }}>
                          Any existing authenticator codes will not work after
                          this has been reset.
                        </p>
                      </div>
                    )}
                    <p>
                      Download the Google Authenticator app on{" "}
                      <a
                        style={{ textDecoration: " underline" }}
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                      >
                        Android{" "}
                      </a>{" "}
                      or{" "}
                      <a
                        style={{ textDecoration: " underline" }}
                        href="https://itunes.apple.com/au/app/google-authenticator/id388497605?mt=8"
                      >
                        iOS{" "}
                      </a>{" "}
                      and scan the QR Code or type the full key to add Two
                      Factor Authentication to your Paperform account.{" "}
                    </p>
                    <div
                      style={{
                        backgroundColor: "white",
                        width: "fit-content",
                        margin: "auto",
                        padding: "30px",
                      }}
                    >
                      <QRCode value={this.state.secretURL} />
                    </div>
                    Or : {this.state.authenticateKey}
                  </CardBody>
                  <CardFooter>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <input
                        placeholder="Code from Authenticator"
                        type="text"
                        className="form-control"
                        value={this.state.token}
                        onChange={this.handlerChange}
                      />
                    </InputGroup>
                    {this.state.error && (
                      <p
                        style={{ marginTop: "10px", color: "red" }}
                        className="text-center"
                      >
                        <small>{this.state.error}</small>.
                      </p>
                    )}
                    <Button
                      block
                      className="mb-3"
                      color="primary"
                      href="#pablo"
                      onClick={(e) => this.confirmHandler()}
                      size="lg"
                    >
                      Confirm
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </>
    );
  }
}
