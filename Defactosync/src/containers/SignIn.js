import React from "react";
import { Link } from "react-router-dom";
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
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import { hideMessage, showAuthLoader, userSignIn } from "actions/Auth";
import { httpClient } from "../appUtility/Api";
import { AUTH_URLS } from "../constants/AppConst";
import { showErrorToaster } from "appUtility/commonFunction";

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email:"admin@gmail.com",
      password:"admin@12345",
      isLoading: false,
      showPassword: false,
    };
  }

  componentDidMount(){
    document.title = 'FormSync - SignIn';
  }

  componentDidUpdate() {
    if (this.props.authUser !== null) {
      this.props.history.push("/");
    }
  }

  handleUserSignIn = async (email, password) => {  
    this.setState({
      isLoading: true,
    });
    try {
      httpClient
        .post(AUTH_URLS.USER_SIGNIN, {
          emailAddress: email,
          password: password,
        })
        .then((res) => {
          console.log(res);
          this.setState({
            isLoading: false,
          });
          const userData = res.data.data;
          this.props.userSignIn({ userData });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
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

  render() {
    const { email, isLoading, password, showPassword } = this.state;
    console.log("email", email);
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
            <div className="app-login-header mb-4">
              <h1>
                <IntlMessages id="appModule.signin" />
              </h1>
            </div>

            <div className="app-login-form">
              <form>
                <fieldset>
                  <TextField
                    required
                    label={<IntlMessages id="appModule.email" />}
                    fullWidth
                    onChange={(event) =>
                      this.setState({ email: event.target.value })
                    }
                    value={email}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    type={showPassword ? "text" : "password"}
                    required
                    label={<IntlMessages id="appModule.password" />}
                    fullWidth
                    onChange={(event) =>
                      this.setState({ password: event.target.value })
                    }
                    value={password}
                    margin="normal"
                    className="mt-1 my-sm-3"
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
                      onClick={() => {
                        this.props.showAuthLoader();
                        this.handleUserSignIn(email, password);
                      }}
                      disabled={                       
                        !email.replace(/\s/g, "").length ||                     
                        !password.replace(/\s/g, "").length
                      }
                      variant="contained"
                      color="primary"
                    >
                      <IntlMessages id="appModule.signIn" />
                    </Button>

                    <Link to="/signup">
                      <IntlMessages id="signIn.signUp" />
                    </Link>
                    <Link to="/forgot-password">
                      <IntlMessages id="signIn.forgotPassword" />
                    </Link>
                  </div>
                </fieldset>
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
  userSignIn,
  hideMessage,
  showAuthLoader,
})(SignIn);
