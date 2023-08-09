import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import { hideMessage, showAuthLoader, userSignUp } from "actions/Auth";
import { httpClient } from "../appUtility/Api";
import { AUTH_URLS, REGEX_VALID } from "../constants/AppConst";

import CryptoJS from "crypto-js";
import { renderEmail } from "react-html-email";
import moment from "moment";
import { ToastsStore } from "react-toasts";

import {
  ENCRYPTION_KEYS,
  VERIFICATION_CODE_EXPIRE_TIME,
} from "../constants/AppConst";

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      fullName: "",
      email: "",
      password: "",
      isLoading: false,
      showPassword: false,
    };
  }
  componentDidMount() {
    document.title = "FormSync - SignUp";
  }

  componentDidUpdate() {
    if (this.props.authUser !== null) {
      this.props.history.push("/");
    }
  }

  handleUserSignUp = async (
    fullName,
    email,
    password,
    emailTemplate,
    verificationCode
  ) => {
    this.setState({
      isLoading: true,
    });
    try {
      const checkEmail = await this.checkEmailExistOrNot(email);
      if (!checkEmail.data) {
        const signUpResponse = await this.createUserWithEmailPasswordRequest(
          fullName,
          email,
          password,
          "user"
        );
        if (signUpResponse.status === 200) {
          ToastsStore.success("Successfully Registered");
          const userData = signUpResponse.data.data;
          this.props.userSignUp({
            userData,
            password,
            emailTemplate,
            verificationCode,
          });
          this.setState({
            isLoading: false,
          });
        }
      } else {
        this.setState({
          isLoading: false,
        });
        ToastsStore.error("Email already exist");
      }
    } catch (error) {
      if (error.response) {
        ToastsStore.error(error.response.data.data.message);
        this.setState({
          isLoading: false,
        });
      } else {
        ToastsStore.error("Something Wwent wrong");
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  checkEmailExistOrNot = async (email) => {
    return await httpClient
      .get(AUTH_URLS.CHECK_EMAIL_EXIST + email)
      .then((res) => res)
      .catch((error) => error);
  };

  handleClickShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleMouseDownPassword = (event) => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  createUserWithEmailPasswordRequest = async (
    fullName,
    email,
    password,
    role
  ) => {
    return await httpClient.post(AUTH_URLS.USER_SIGNUP, {
      fullName: fullName,
      email: email,
      password: password,
      role: role,
    });
  };

  validateEmail = (email) => {
    const check = REGEX_VALID.EMAIL;
    return check.test(email);
  };

  validatePassword = (password) => {
    const check = REGEX_VALID.PASSWORD;
    return check.test(password);
  };

  getVerficationCode() {
    let data = {
      email: this.state.email,
      expireAt: moment()
        .add(VERIFICATION_CODE_EXPIRE_TIME, "minutes")
        .toDate(),
    };
    let encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEYS.CRYPTOJS_SECRETKEY
    ).toString();
    encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
    encryptedData = encryptedData.toString(CryptoJS.enc.Hex);
    return encryptedData;
  }

  verificationEmailHTML = (code) => {
    return renderEmail(
      <div>
        Dear FormSync user,
        <p>You have sucessfully registered with us.</p>
        <p>Please click on the link below to verify you email address</p>
        <a
          href={window.location.origin.toString() + "/verifyUserEmail/" + code}
        >
          Verify Email
        </a>
        <p style={{ marginBottom: "50px" }}>Please ignor if this is not you.</p>
        <p>Sincerely,</p>
        <p>FormSync Team.</p>
      </div>
    );
  };

  render() {
    const { fullName, email, password, isLoading, showPassword } = this.state;
    const verificationCode = this.getVerficationCode();
    const emailTemplate = this.verificationEmailHTML(verificationCode);
    const { showMessage, alertMessage } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-logo-content d-flex align-items-center justify-content-center">
            <Link className="logo-lg" to="/" title="FormSync">
              {/* <img src={require("assets/images/logo.png")} alt="jambo" title="jambo"/> */}
              <h1 className="app-name">FormSync</h1>
            </Link>
          </div>

          <div className="app-login-content">
            <div className="app-login-header">
              <h1>Sign Up</h1>
            </div>

            <div className="mb-4">
              <h2>
                <IntlMessages id="appModule.createAccount" />
              </h2>
            </div>

            <div className="app-login-form">
              <form method="post" action="/">
                <TextField
                  type="text"
                  label="Name"
                  required
                  onChange={(event) =>
                    this.setState({ fullName: event.target.value })
                  }
                  fullWidth
                  defaultValue={fullName}
                  margin="normal"
                  className="mt-0 mb-2 "
                />

                <TextField
                  type="email"
                  required
                  onChange={(event) =>
                    this.setState({ email: event.target.value })
                  }
                  label={<IntlMessages id="appModule.email" />}
                  fullWidth
                  defaultValue={email}
                  margin="normal"
                  className="mt-0 mb-2 "
                />

                <TextField
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={(event) =>
                    this.setState({ password: event.target.value })
                  }
                  label={<IntlMessages id="appModule.password" />}
                  fullWidth
                  defaultValue={password}
                  margin="normal"
                  className="mt-0 mb-4"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <Button
                    disabled={
                      !fullName.replace(/\s/g, "").length ||
                      !email ||
                      !password ||
                      isLoading
                    }
                    variant="contained"
                    onClick={() => {
                      if (
                        this.validateEmail(email) &&
                        this.validatePassword(password)
                      ) {
                        this.handleUserSignUp(
                          fullName.trim(),
                          email.trim(),
                          password,
                          emailTemplate,
                          verificationCode
                        );
                      } else if (!this.validateEmail(email)) {
                        ToastsStore.error("Please enter valid email address");
                      } else {
                        ToastsStore.error(
                          "Password should be min 6 letter which includes atleast 1 number and 1 special character"
                        );
                      }
                    }}
                    color="primary"
                  >
                    <IntlMessages id="appModule.regsiter" />
                  </Button>
                  <Link to="/signin">
                    <IntlMessages id="signUp.alreadyMember" />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        {showMessage && NotificationManager.error(alertMessage)}
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser };
};

export default connect(mapStateToProps, {
  userSignUp,
  hideMessage,
  showAuthLoader,
})(SignUp);
