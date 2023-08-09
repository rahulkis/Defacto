import React from "react";
import speakeasy from "speakeasy";
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
export default class TwoFactorVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      error: "",
    };
  }
  changeHandler = (e) => {
    this.setState({ input: e.target.value });
  };
  confirmHandler = () => {
    let userData = JSON.parse(localStorage.getItem("loginUserInfo"));
    let secretKey = userData.StepAuthSecretKey;
    if (secretKey !== "") {
      let verified = speakeasy.totp.verify({
        secret: secretKey,
        encoding: "ascii",
        token: this.state.input,
      });
      if (verified === true) {
        this.props.history.push("../dasboard");
      } else {
        this.setState({ error: "That code did not work, please try again." });
      }
    }
  };
  render() {
    const title = {
      width: "60%",
      position: "absolute",
      top: "10px",
      padding: "15px 0px 15px 5px",
      textAlign: "left",
      color: "#fff",
      fontSize: "2.6em",
      fontWeight: "900",
    };
    return (
      <>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" lg="6" md="6">
              <Form className="form">
                <Card
                  className="card-login card-white"
                  style={{ textAlign: "center" }}
                >
                  <CardHeader style={{ width: "76%", textAlign: "left" }}>
                    <img
                      alt="..."
                      src={require("assets/img/card-primary.png")}
                    />

                    <CardTitle tag="h1" style={title}>
                      {" "}
                      Authenticator Code
                    </CardTitle>
                  </CardHeader>
                  <CardBody style={{ minHeight: "0" }}>
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
                        value={this.state.input}
                        onChange={this.changeHandler}
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
                  </CardBody>
                  <CardFooter style={{ marginTop: "-31px" }}>
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
                    <div>
                      <p>
                        Lost your code? <a href="#pablo">contact support.</a>
                      </p>
                    </div>
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
