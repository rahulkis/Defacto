import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Formik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { renderEmail } from "react-html-email";
import { httpClient } from "../appUtility/Api";
import { SendEmail } from "../appUtility/commonFunction";
import { ToastsStore } from "react-toasts";
import { hideMessage, showAuthLoader } from "actions/Auth";
import { ENCRYPTION_KEYS, AUTH_URLS, EMAIL_SENDER } from "constants/AppConst";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email Required")
    .email("Enter valid email"),
});

class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
  }
  componentDidMount(){
    document.title = 'FormSync - ForgotPassword';
  }
  componentDidUpdate() {
    if (this.props.authUser !== null) {
      this.props.history.push("/");
    }
  }

  handleForgotPassword = async (email) => {
    this.setState({
      isLoading: true,
    });
    try {
      httpClient
        .get(AUTH_URLS.CHECK_EMAIL_EXIST + email)
        .then((res) => {
          this.setState({
            isLoading: false,
          });
          if (res.data) {
            this.sendEmail(email);
            ToastsStore.success("email sent to the user");
            this.props.history.push("/signin");
          } else {
            ToastsStore.error("User does not exist!");
          }
        })
        .catch((err) => {
          ToastsStore.error(err);
        });
    } catch (error) {
      ToastsStore.error(error);
    }
  };

  sendEmail = async (email) => {
    let subject = "Reset Password Notification";
    await SendEmail(EMAIL_SENDER, subject, this.emailHTML(email));
  };

  emailHTML = (val) => {
    let data = {
      time: new Date(),
      email: val,
    };
    let encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEYS.CRYPTOJS_SECRETKEY
    ).toString();
    encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
    encryptedData = encryptedData.toString(CryptoJS.enc.Hex);

    return renderEmail(
      <div>
        Dear DefactoSync user,
        <p>
          You are receiving this email because we received a password reset
          request for your account
        </p>
        <a
          href={
            window.location.origin.toString() +
            "/Reset-Password/" +
            encryptedData
          }
        >
          Reset Password
        </a>
        <p>Sincerely,</p>
        <p>DefactoSync Team.</p>
      </div>
    );
  };

  render() {
    const { isLoading } = this.state;
    const { showMessage, alertMessage } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-logo-content d-flex align-items-center justify-content-center">
            <Link className="logo-lg" to="/" title="FormSync">
              <h1 className="app-name">FormSync</h1>
            </Link>
          </div>

          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1>
                <IntlMessages id="appModule.recoverPassword" />
              </h1>
            </div>

            <div className="app-login-form">
              <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  this.handleForgotPassword(values.email);
                }}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <form onSubmit={handleSubmit}>
                    <fieldset>
                      <TextField
                        label={<IntlMessages id="appModule.email" />}
                        fullWidth
                        required
                        onChange={handleChange}
                        defaultValue={values.email}
                        name="email"
                        margin="normal"
                        className="mt-1 my-sm-3"
                      />
                      <p className="error">{errors.email}</p>
                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          <IntlMessages id="appModule.submit" />
                        </Button>

                        <Link to="/signup">
                          <IntlMessages id="signIn.signUp" />
                        </Link>
                      </div>
                    </fieldset>
                  </form>
                )}
              </Formik>
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
  hideMessage,
  showAuthLoader,
})(ForgotPassword);
