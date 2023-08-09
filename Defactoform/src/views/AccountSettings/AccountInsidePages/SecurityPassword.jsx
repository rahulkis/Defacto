import React from "react";
import "../../../assets/custom/AccountSettings.css";
import { UpdateData } from "../../../stores/requests";

import { USER_RELATED_URLS } from "../../../util/constants";

class SecurityPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      showRButtons: false,
      error: "",
      Submitting: false,
    };
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
    }
  }
  componentWillMount() {
    let check2FaEnabled = localStorage.getItem("2faActivate");
    if (check2FaEnabled === "true") {
      this.setState({ showRButtons: true });
    } else {
      this.setState({ showRButtons: false });
    }
  }
  resetPassword = (e) => {
    this.setState({ password: e.target.value });
  };
  validationHandler = () => {
    let passwordError = "";
    if (this.state.password === "" || this.state.password === undefined) {
      passwordError = "CANNOT BE EMPTY";
    }
    if (
      this.state.password !== undefined &&
      this.state.password.length > 0 &&
      this.state.password.length < 6
    ) {
      passwordError = "TOO SHORT";
    }
    if (passwordError) {
      this.setState({ error: passwordError });
      return false;
    }
    this.setState({ error: "" });
    return true;
  };
  updatePasswordHandler = () => {
    let self = this;
    self.setState({ Submitting: true });
    console.log(this.state.Submitting, this.state.password);
    let isValid = this.validationHandler();
    if (isValid) {
      let formModel = {
        userId: this.loginUserId,
        password: this.state.password,
      };

      try {
        UpdateData(USER_RELATED_URLS.PASSWORD_UPDATE, formModel).then(
          (result) => {
            if (result.statusCode === 200) {
              this.setState({ password: "", Submitting: false });
              console.log(this.state.Submitting, this.state.password);
            }
          }
        );
      } catch (err) {
        alert("some error");
      }
    } else {
      this.setState({ Submitting: false });
    }
  };
  twoFactorHandler = () => {
    window.open("/preview/2fa", "_blank");
    localStorage.setItem("reset2FA", false);
  };
  reset2Fa = (e) => {
    window.open("/preview/2fa", "_blank");
    localStorage.setItem("reset2FA", true);
  };
  removeFactorHandler = () => {
    let formModel = {
      IsStepEnabled: false,
      StepAuthSecretKey: "",
      UserId: this.loginUserId,
      UpdateAt: Date.now(),
    };
    try {
      UpdateData(USER_RELATED_URLS.TWO_FACTOR_AUTHENTICATION, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            this.setState({ showRButtons: false });
            localStorage.setItem("2faActivate", false);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div>
        <div padded="0" className="Paper Paper--double-padded">
          <div>
            <div>
              <h2 className="PaperType--h2">Security &amp; Password</h2>
              <h4>Change your password</h4>
              <div
                data-key="new_password"
                style={{ margin: "0 " }}
                className="LiveField Paperform__Question Paperform__Question--new_password  LiveField--password LiveField--multiline     LiveField--required "
              >
                <div className="LiveField__container">
                  <div className="LiveField__header">
                    <div>
                      <div className="DraftEditor-root">
                        <div className="DraftEditor-editorContainer">
                          <div
                            aria-describedby="placeholder-new_password_title"
                            className="public-DraftEditor-content"
                          >
                            <div data-contents="true">
                              <div
                                className=""
                                data-block="true"
                                data-editor="new_password_title"
                                data-offset-key="initial-0-0"
                              >
                                <div
                                  data-offset-key="initial-0-0"
                                  className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                >
                                  <span data-offset-key="initial-0-0">
                                    <span data-text="true">New password</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="LiveField__answer">
                    <input
                      placeholder=""
                      data="[object Object]"
                      name="New password"
                      autoComplete="on"
                      className="LiveField__input"
                      type="password"
                      defaultValue={this.state.password}
                      onChange={this.resetPassword}
                    />
                  </div>
                </div>
                {this.state.error && (
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      backgroundColor: "rgb(255, 163, 163)",
                      color: "white",
                    }}
                  >
                    <span className="help-block">{this.state.error}</span>
                  </div>
                )}
              </div>
              {this.state.Submitting ? (
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  tabIndex="-1"
                  style={{ marginTop: "18px", fontFamily: "inherit" }}
                >
                  <span>Saving..</span>
                </div>
              ) : (
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  tabIndex="-1"
                  style={{ marginTop: "18px", fontFamily: "inherit" }}
                  onClick={(e) => this.updatePasswordHandler()}
                >
                  <span>Update password</span>
                </div>
              )}
              <h4 style={{ marginTop: "36px" }}>2 Factor Authentication</h4>
              <div
                data-key="setup2fa"
                style={{ margin: "0 " }}
                className="LiveField Paperform__Question Paperform__Question--setup2fa  LiveField--custom LiveField--multiline      "
              >
                <div className="LiveField__container">
                  <div className="LiveField__header">
                    <div>
                      <div className="DraftEditor-root">
                        <div className="DraftEditor-editorContainer">
                          <div
                            aria-describedby="placeholder-setup2fa_title"
                            className="public-DraftEditor-content"
                          >
                            <div data-contents="true">
                              <div
                                className=""
                                data-block="true"
                                data-editor="setup2fa_title"
                                data-offset-key="initial-0-0"
                              >
                                <div
                                  data-offset-key="initial-0-0"
                                  className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                >
                                  <span data-offset-key="initial-0-0">
                                    <span data-text="true">
                                      Setup 2 Factor Authentication
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="LiveField__description">
                    <div>
                      <div className="DraftEditor-root">
                        <div className="DraftEditor-editorContainer">
                          <div
                            aria-describedby="placeholder-setup2fa_description"
                            className="public-DraftEditor-content"
                          >
                            <div data-contents="true">
                              <div
                                className=""
                                data-block="true"
                                data-editor="setup2fa_description"
                                data-offset-key="initial-0-0"
                              >
                                <div
                                  data-offset-key="initial-0-0"
                                  className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                >
                                  <span data-offset-key="initial-0-0">
                                    <span data-text="true">
                                      Two factor authentication helps to keep
                                      your account secure.
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="LiveField__answer">
                    {!this.state.showRButtons && (
                      <div
                        className="BtnV2 BtnV2--raised BtnV2--primary"
                        tabIndex="-1"
                        style={{ fontFamily: "inherit" }}
                        onClick={(e) => this.twoFactorHandler()}
                      >
                        <span>Setup 2FA</span>
                      </div>
                    )}
                    {this.state.showRButtons && (
                      <div
                        className="BtnV2 BtnV2--raised BtnV2--primary"
                        tabIndex="-1"
                        style={{ marginLeft: "5px", fontFamily: "inherit" }}
                        onClick={(e) => this.reset2Fa()}
                      >
                        <span>Reset 2FA</span>
                      </div>
                    )}
                    {this.state.showRButtons && (
                      <div
                        className="BtnV2 BtnV2--raised BtnV2--primary"
                        tabIndex="-1"
                        style={{ marginLeft: "5px", fontFamily: "inherit" }}
                        onClick={(e) => this.removeFactorHandler()}
                      >
                        <span>Remove 2FA</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="LiveField__error" />
              </div>
              <div
                className="BtnV2 BtnV2--raised BtnV2--primary"
                tabIndex="-1"
                style={{ marginTop: "18px", fontFamily: "inherit" }}
              >
                <span>Update 2 factor authentication requirement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SecurityPassword;
