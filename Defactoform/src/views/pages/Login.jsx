import React from "react";
import { Redirect } from "react-router-dom";
import { PostData } from "../../stores/requests";
import { USER_RELATED_URLS } from "../../util/constants";
// reactstrap components
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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirect: "",
    };
  }

  componentDidMount() {
    // document.body.classList.toggle("login-page");
  }
  componentWillUnmount() {
    // document.body.classList.toggle("login-page");
  }
  login = (e) => {
    e.preventDefault();
    let FormModel = {
      email: this.state.email,
      password: this.state.password,
    };
    try {
      PostData(USER_RELATED_URLS.USER_LOGIN, FormModel).then((result) => {
        if (result.statusCode === 200) {
          let resultedItem = result.data;
          resultedItem = JSON.parse(resultedItem);
          if (
            resultedItem.Items[0] !== undefined &&
            resultedItem.Items[0].Email === this.state.email &&
            resultedItem.Items[0].Password === this.state.password
          ) {
            let responseJson = {
              email: this.state.email,
              password: this.state.password,
            };
            sessionStorage.setItem("userData", JSON.stringify(responseJson));
            localStorage.setItem(
              "loginUserInfo",
              JSON.stringify(resultedItem.Items[0])
            );
            if (resultedItem.Items[0].IsStepEnabled === true) {
              localStorage.setItem("2faActivate", true);
              this.props.history.push("/preview/2faVerification");
            } else {
              this.setState({ redirect: "../dashboard" });
              localStorage.setItem("2faActivate", false);
            }
          }
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
    }
  };
  handleChange = (e, stateName) => {
    this.setState({ [stateName]: e.target.value });
  };
  registerHandler = (e) => {
    window.open("./register", "_self");
  };

  forgotPasswordHandler = () => {
    window.open("./reset", "_self");
  };

  render() {
    if (this.state.redirect && sessionStorage.getItem("userData")) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
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
                    <CardTitle tag="h1">Log in</CardTitle>
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
                        onChange={(e) => this.handleChange(e, "email")}
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
                        onChange={(e) => this.handleChange(e, "password")}
                      />
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button
                      block
                      className="mb-3"
                      color="primary"
                      href="#pablo"
                      onClick={(e) => this.login(e)}
                      size="lg"
                    >
                      Get Started
                    </Button>
                    <div className="pull-left">
                      <h6>
                        <a
                          className="link footer-link"
                          href="#pablo"
                          onClick={(e) => this.registerHandler()}
                        >
                          Create Account
                        </a>
                      </h6>
                    </div>
                    <div className="pull-right">
                      <h6>
                        <a
                          className="link footer-link"
                          href="#pablo"
                          onClick={(e) => this.forgotPasswordHandler()}
                        >
                          Forgot password
                        </a>
                      </h6>
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

export default Login;
