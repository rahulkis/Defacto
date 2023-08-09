import React from 'react';
import { connect } from 'react-redux';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import { hideMessage, showAuthLoader, userSignIn } from 'actions/Auth';
import { AUTH_URLS } from '../constants/AppConst';
import { httpClient } from '../appUtility/Api';
import moment from 'moment';
import { ENCRYPTION_KEYS } from '../constants/AppConst';
import { Link } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';

import CryptoJS from 'crypto-js';

class VerifyUserEmail extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      code: '',
      tokenExpired: false,
      emailVerified: false,
      errorMessage: '',
    };
  }

  componentWillMount() {

    this.setState({
      isLoading: true,
    });

    if (this.props.match.params && this.props.match.params.verificationCode) {
      const vCode = this.props.match.params.verificationCode;
      this.setState({
        code: vCode,
      });
      this.verifyEmail(vCode);
    } else {
      this.props.history.push('/');
    }
  }

  verifyEmail = (data) => {
    let encryptedData = CryptoJS.enc.Hex.parse(data);
    let bytes = encryptedData.toString(CryptoJS.enc.Base64);
    bytes = CryptoJS.AES.decrypt(bytes, ENCRYPTION_KEYS.CRYPTOJS_SECRETKEY);
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    if (moment().isAfter(decryptedData.expireAt)) {
      this.setState({
        tokenExpired: true,
        isLoading: false,
      });
    } else {
      this.updateUserVarification(decryptedData);
    }
  };

  updateUserVarification(userData) {
    httpClient
      .post(AUTH_URLS.VERIFY_EMAIL, {
        emailaddress: userData.email,
        type: 'signup',
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          ToastsStore.success(res.data.data.message);
          this.setState({
            emailVerified: true,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          this.setState({
            errorMessage: error.response.data.data.message,
          });
        } else {
          this.setState({
            errorMessage: 'Something went wrong!',
          });
        }
        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    const styles = {
      appLogoContent: {
        backgroundColor: '#3f51b5',
        padding: '35px 35px 20px',
        width: '100%',
        order: '1',
      },
      appLoginContent: {
        padding: '35px 35px 20px',
        width: '100%',
        order: '2',
      },
    };
    const { emailVerified, tokenExpired, isLoading } = this.state;
    const { showMessage, alertMessage } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="d-flex align-items-center justify-content-center" style={styles.appLogoContent}>
            <Link className="logo-lg" to="/" title="FormSync">
              {/* <img src={require("assets/images/logo.png")} alt="jambo" title="jambo"/> */}
              <h1 className="app-name">FormSync</h1>
            </Link>
          </div>
          <div style={styles.appLoginContent}>
            <div className="p-4 text-center">
              {isLoading && (
                <div className="mb-4 pb-4">
                  <h1>Verifying User Email</h1>
                </div>
              )}

              {emailVerified && !isLoading && (
                <div className="mb-4 pb-4">
                  <div className="app-login-form">
                    <h1>Email verified successfully.</h1>
                  </div>
                </div>
              )}
              {tokenExpired && !isLoading && (
                <div className="mb-4 pb-4">
                  <div className="app-login-form">
                    <h1>This link has been expired.</h1>
                  </div>
                </div>
              )}
              {!tokenExpired && !emailVerified && !isLoading && this.state.errorMessage !== '' && (
                <div className="mb-4 pb-4">
                  <div className="app-login-form">
                    <h1>{this.state.errorMessage}</h1>
                  </div>
                </div>
              )}
              {!isLoading && <Link to="/signin">back to Login</Link>}
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="loader-view">
            <CircularProgress size="70px" />
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
})(VerifyUserEmail);
