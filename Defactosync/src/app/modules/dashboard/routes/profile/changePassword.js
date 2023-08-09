import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";
import { Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as Yup from "yup";
import { httpClient } from "../../../../../appUtility/Api";
import { ToastsStore } from "react-toasts";
import "../../../../../assets/customs/profile.css";
import { PROFILE_URLS, REGEX_VALID } from "../../../../../constants/AppConst";

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Password Required"),
  newPassword: Yup.string()
    .required("Password Required")
    .matches(
      REGEX_VALID.PASSWORD,
      "Password should be min 6 letter which includes atleast 1 number and 1 special character"
    ),
  confirmPassword: Yup.string()
    .required("Password Required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      btnDisabled: false,
      showCurrentPassword: false,
      showNewPassword: false,
      shownConfirmPassword: false,
    };
  }

  handleResetPassword = (values) => {
    this.setState({ isLoading: true });
    try {
      let userId = this.props.authUser.id;

      let body = {
        id: userId,
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      httpClient
        .post(PROFILE_URLS.UPDATE_PROFILE_PASSWORD, body)
        .then((res) => {
          if (res.data.statusCode === 200) {
            ToastsStore.success("Password updated");
            this.props.history.push("/app/profile");
          } else {
            ToastsStore.error("Something went wrong");
          }
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          ToastsStore.error(err.response.data.data.message);
        });
    } catch (error) {
      this.setState({ isLoading: false });
      ToastsStore.error(error);
    }
  };

  handleClickShowPassword = () => {
    this.setState((prevState) => ({
      showCurrentPassword: !prevState.showCurrentPassword,
    }));
  };

  handleMouseDownPassword = (event) => {
    this.setState((prevState) => ({
      showCurrentPassword: !prevState.showCurrentPassword,
    }));
  };

  handleMouseDownNewPassword = (event) => {
    this.setState((prevState) => ({
      showNewPassword: !prevState.showNewPassword,
    }));
  };

  handleClickShowNewPassword = () => {
    this.setState((prevState) => ({
      showNewPassword: !prevState.showNewPassword,
    }));
  };

  handleMouseDownConfirmPassword = (event) => {
    this.setState((prevState) => ({
      shownConfirmPassword: !prevState.shownConfirmPassword,
    }));
  };

  handleClickShowConfirmPassword = () => {
    this.setState((prevState) => ({
      shownConfirmPassword: !prevState.shownConfirmPassword,
    }));
  };

  render() {
    const {
      isLoading,
      showCurrentPassword,
      showNewPassword,
      shownConfirmPassword,
    } = this.state;
    return (
      <div className="dashboard animated slideInUpTiny animation-duration-3">
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="sidebar.profile" />}
        />

        <div className="card">
          <div className="card-header">
            <h1>Password </h1>
          </div>

          <div className="card-body">
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                this.handleResetPassword(values);
              }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <fieldset>
                    <div className="form-group">
                      {/* <label className="requiredFields">
                        Verify Current Password
                      </label> */}
                      <TextField
                        type={showCurrentPassword ? "text" : "password"}
                        className="form-control"
                        required
                        label="Verify Current Password"
                        onChange={handleChange}
                        value={values.currentPassword}
                        name="currentPassword"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={this.handleClickShowPassword}
                                onMouseDown={this.handleMouseDownPassword}
                              >
                                {showCurrentPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <p className="error"> {errors.currentPassword}</p>
                    </div>

                    {isLoading && (
                      <div id="profileLoader" className="loader-view">
                        <CircularProgress />
                      </div>
                    )}
                  

                    <div className="form-group">
                      {/* <label className="requiredFields">New Password</label> */}
                      <TextField
                        label="New Password"
                        required
                        type={showNewPassword ? "text" : "password"}
                        className="form-control"
                        onChange={handleChange}
                        value={values.newPassword}
                        name="newPassword"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={this.handleClickShowNewPassword}
                                onMouseDown={this.handleMouseDownNewPassword}
                              >
                                {showNewPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <p className="error"> {errors.newPassword}</p>
                    </div>

                    <div className="form-group">
                      {/* <label className="requiredFields">
                        Confirm New Password
                      </label> */}
                      <TextField
                        label="Confirm New Password"
                        required
                        type={shownConfirmPassword ? "text" : "password"}
                        className="form-control"
                        onChange={handleChange}
                        value={values.confirmPassword}
                        name="confirmPassword"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={this.handleClickShowConfirmPassword}
                                onMouseDown={
                                  this.handleMouseDownConfirmPassword
                                }
                              >
                                {shownConfirmPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <p className="error">{errors.confirmPassword}</p>
                    </div>
                    <Link to="/app/profile">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isLoading}
                      >
                        Back
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg float-right"
                      disabled={isLoading}
                    >
                      Save changes
                    </button>
                  </fieldset>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser } = auth;
  return { authUser };
};

export default connect(mapStateToProps)(ChangePassword);
