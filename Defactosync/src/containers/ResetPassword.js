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
import { ToastsStore } from "react-toasts";
import { hideMessage, showAuthLoader } from "actions/Auth";
import { ENCRYPTION_KEYS, REGEX_VALID } from "constants/AppConst";
import { UpdatePassword } from "appUtility/commonFunction";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .required("Password Required")
    .matches(REGEX_VALID.PASSWORD),
  confirmPassword: Yup.string()
    .required("Password Required")
    .matches(REGEX_VALID.PASSWORD)
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

class ResetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      isLoading: false,
      isUpdated: false,
    };
  }

  componentDidUpdate() {
    if (this.props.authUser !== null) {
      this.props.history.push("/");
    }
  }

  componentWillMount() {
    const data = this.props.location.pathname.split("/")[2];
    if (data) {
      try {
        let encryptedData = CryptoJS.enc.Hex.parse(data);
        let bytes = encryptedData.toString(CryptoJS.enc.Base64);
        bytes = CryptoJS.AES.decrypt(bytes, ENCRYPTION_KEYS.CRYPTOJS_SECRETKEY);
        let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        let today = new Date();
        let dif = -(new Date(decryptedData.time) - today);
        let minutes = Math.round(dif / 1000 / 60);
        this.setState({ email: decryptedData.email });
        if (minutes > 30) {
          this.props.history.push("/error-invalidurl");
        }
      } catch (error) {
        this.props.history.push("/error-invalidurl");
      }
    } else {
      this.props.history.push("/error-invalidurl");
    }
  }

  handleResetPassword = async (password) => {
    this.setState({
      isLoading: true,
    });
    try {
      let updated = await UpdatePassword(this.state.email, password);
      this.setState({
        isLoading: false,
      });
      if (updated) {
        ToastsStore.success("Password updated");
        this.props.history.push("/signin");
      } else {
        ToastsStore.error("something went wrong.Please try again!");
      }
    } catch (error) {
      ToastsStore.error(error);
    }
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
                <IntlMessages id="appModule.resetPassword" />
              </h1>
            </div>

            <div className="app-login-form">
              <Formik
                initialValues={{ newPassword: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  this.handleResetPassword(values.newPassword);
                }}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <form onSubmit={handleSubmit}>
                    <fieldset>
                      <TextField
                        label={<IntlMessages id="appModule.newPassword" />}
                        fullWidth
                        onChange={handleChange}
                        defaultValue={values.newPassword}
                        type="password"
                        name="newPassword"
                        margin="normal"
                        className="mt-1 my-sm-3"
                      />
                      <p className="error">{errors.newPassword}</p>

                      <TextField
                        label={<IntlMessages id="appModule.confirmPassword" />}
                        fullWidth
                        onChange={handleChange}
                        defaultValue={values.confirmPassword}
                        name="confirmPassword"
                        type="password"
                        margin="normal"
                        className="mt-1 my-sm-3"
                      />
                      <p className="error"> {errors.confirmPassword}</p>

                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          <IntlMessages id="appModule.submit" />
                        </Button>
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
})(ResetPassword);
