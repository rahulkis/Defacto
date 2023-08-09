import React from "react";
import { SendEmail } from "../../util/commonFunction";
import { PostData } from "../../stores/requests";
import CryptoJS from "crypto-js";
import { ENCRYPTION_KEYS, USER_RELATED_URLS } from "../../util/constants";
import { renderEmail } from "react-html-email";
import Loader from "../../components/Common/Loader";
import InterComIcon from "../../components/Common/InterComIcon";
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

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      userId: "",
      userEmail: "",
      error: "",
      isLoader: false,
    };
  }

  emailHandler = (e) => {
    this.setState({ email: e.target.value });
  };
  handleSubmit = () => {
    this.setState({ isLoader: true });

    let formModel = {
      email: this.state.email,
    };
    try {
      PostData(USER_RELATED_URLS.CHECK_USER_EXIST, formModel).then((result) => {
        if (result.Items.length > 0) {
          let userID = result && result.Items[0].UserId;
          let userEmail = result.Items[0].Email;
          this.setState({
            userId: userID,
            userEmail: userEmail,
            error: "We have emailed your password reset link.",
          });
          this.sendEmail();
        } else {
          this.setState({
            error: "We can't find a user with that email address.",
          });
        }
        this.setState({ isLoader: false });
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
    }
  };
  sendEmail = async () => {
    let subject = "Reset Password Notification ";
    await SendEmail(
      this.state.email,
      subject,
      this.emailHTML(this.state.userId, this.state.userEmail)
    );
  };
  emailHTML = (val, val1) => {
    let data = {
      id: val,
      email: val1,
    };
    let encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEYS.SECRETKEY
    ).toString();
    encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
    encryptedData = encryptedData.toString(CryptoJS.enc.Hex);

    return renderEmail(
      <div>
        Dear DefactoForm user,
        <p>
          You are receiving this email because we received a password reset
          request for your account
        </p>
        <a
          href={
            window.location.origin.toString() +
            "/preview/ResetPassword/" +
            encryptedData
          }
        >
          Reset Password
        </a>
        <p>Sincerely,</p>
        <p>DefactoForm Team.</p>
      </div>
    );
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <>
    <InterComIcon/>
        <div className="content">
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
                        onChange={(e) => this.emailHandler(e, "email")}
                      />
                    </InputGroup>
                    <div>
                      <span class="help-block">
                        <strong>{this.state.error}</strong>
                      </span>
                    </div>
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
                      Send password Reset Link
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
