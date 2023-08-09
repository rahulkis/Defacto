import React from "react";
import "../../../assets/custom/AccountSettings.css";
import { GetData } from "../../../stores/requests";
import { USER_RELATED_URLS } from "../../../util/constants";
import Loader from "../../../components/Common/Loader";
import { SendEmail } from "../../../util/commonFunction";
import { renderEmail } from "react-html-email";

class ReferralView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referralUrl: window.location.origin + "/preview/invite/",
      referredUserCount: null,
      isLoading: false,
      showEmailDiv: false,
      userName: "",
      userEmail: "",
      emailMsgName: "{{name}}",
      isLoader: false,
      userMsg:
        "You should check out FormBuilder! I think you'd really like it. Use the link below to get off 10% forever.",
    };

    this.inputHandler = this.inputHandler.bind(this);
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
      this.loginUserName = jsonData.Name;
    }
  }

  componentWillMount() {
    this.getReferredUsers();
  }

  getReferredUsers = () => {
    this.setState({
      isLoading: true,
    });
    try {
      const URL = USER_RELATED_URLS.GET_REFERRED_USERS + this.loginUserId;
      GetData(URL).then((result) => {
        console.log(result);
        if (result.statusCode === 200) {
          if (result.data.Count > 0) {
            this.setState({
              isLoading: false,
              referredUserCount: result.data.Count,
            });
          } else {
            this.setState({
              referredUserCount: null,
              isLoading: false,
            });
          }
        } else {
          this.setState({
            isLoading: false,
            referredUserCount: null,
          });
        }
      });
    } catch (err) {
      this.setState({
        isLoading: false,
      });
      console.log(err);
    }
  };
  showEmailHandle = (e) => {
    this.setState({ showEmailDiv: e });
  };
  inputHandler = (event, name) => {
    this.setState({ [name]: event.target.value });
    if (event.target.name === "userName") {
      this.setState({ emailMsgName: event.target.value });
      if (event.target.value === "") {
        this.setState({ emailMsgName: "{{name}}" });
      }
    }
  };
  handleSubmit = (e) => {
    this.setState({ isLoader: true });
    var isValid = true;
    if (this.state.userName === "") {
      isValid = false;
      alert("Please enter firstName");
    } else if (this.state.userEmail === "") {
      isValid = false;
      alert("Please enter email address");
    } else if (this.state.userEmail !== "") {
      if (!(this.state.userEmail.indexOf("@") !== -1)) {
        isValid = false;
        alert("Please enter valid email address");
      }
    }
    if (!isValid) {
      this.setState({ isLoader: false });
      return;
    }

    this.sendEmail();
    this.setState({ isLoader: false, showEmailDiv: false });
    this.setState({ userName: "", userEmail: "", emailMsgName: "{{name}}" });
  };
  emailHTML = (val, referralLink, userMsg) => {
    return renderEmail(
      <div>
        Dear {val} ,<p>{userMsg}</p>
        <a href={referralLink}>Claim your 10% off!</a>
        <p>Sincerely,</p>
        <p>FormBuilder Team.</p>
      </div>
    );
  };
  sendEmail = async () => {
    let subject =
      this.loginUserName + " just gave you 10% off FormBuilder for life!";
    let referralLink = this.state.referralUrl + this.loginUserId;
    await SendEmail(
      this.state.userEmail,
      subject,
      this.emailHTML(this.state.userName, referralLink, this.state.userMsg)
    );
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div>
        <div className="Referral Account-Referal">
          <h1 className="PaperType--h1">
            <i className="fa fa-gift gift-card" aria-hidden="true" />
            Give 10% get 10%
          </h1>
          <p>
            <small>
              Send your friends 10% off Paperform! For every one that becomes a
              full user*, we'll knock 10% off your bill and theirs for as long
              as they're around. If 10 friends sign up, your account is{" "}
              <i style={{ color: "rgb(51, 51, 51)" }}>free</i>.
            </small>
          </p>
          {this.state.showEmailDiv === false && (
            <span>
              <h2 className="PaperType--h2">Share your unique invite code</h2>
              <input
                className="LiveField__input Referral__code"
                value={this.state.referralUrl + this.loginUserId}
              />
              <button
                className="btn-raised EmailButton"
                onClick={(e) => this.showEmailHandle(true)}
              >
                Share via Email
                <i
                  className="fa fa-envelope emailIcon"
                  aria-hidden="true"
                  style={{
                    fontSize: "18px",
                    position: "absolute",
                    right: "12px",
                    top: "8px",
                  }}
                />
              </button>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={
                  "https://www.facebook.com/sharer/sharer.php?u=" +
                  this.state.referralUrl +
                  this.loginUserId
                }
                className="btn-raised btn--facebook"
              >
                Share on Facebook
              </a>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={
                  "https://twitter.com/intent/tweet?text=Easily create forms as beautiful as you&url=" +
                  this.state.referralUrl +
                  this.loginUserId
                }
                className="btn-raised  btn--twitter"
              >
                Share on Twitter
              </a>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={
                  "https://www.linkedin.com/shareArticle?mini=true&url=" +
                  this.state.referralUrl +
                  this.loginUserId +
                  "&title=Easily create forms as beautiful as you&summary=sum&source=master.d1i3h6ck09x8p5.amplifyapp.com"
                }
                className="btn-raised btn--linkedin"
              >
                Share on LinkedIn
              </a>
              {!this.state.referredUserCount && !this.state.isLoading && (
                <div style={{ marginTop: "15px" }}>
                  None of your friends have signed up yet{" "}
                  <span role="img" aria-label="sheep">
                    😥
                  </span>
                </div>
              )}
              {this.state.referredUserCount > 0 && !this.state.isLoading && (
                <div style={{ marginTop: "15px" }}>
                  {this.state.referredUserCount + " "} of your friends have
                  signed up{" "}
                  <span role="img" aria-label="sheep">
                    😃
                  </span>
                </div>
              )}
            </span>
          )}
          {this.state.showEmailDiv && (
            <div className="referral-Email-div">
              <div>
                <button
                  className="btn-raised btn-default"
                  onClick={(e) => this.showEmailHandle(false)}
                  style={{ float: "left", width: "100px" }}
                >
                  Back
                </button>
              </div>
              <div style={{ clear: "both" }}>
                <div style={{ width: "100%" }}>
                  <div className="referral-firstName-parent-div">
                    <div className="LiveField" style={{ width: "100%" }}>
                      <div className="LiveField__container">
                        <div>
                          <div className="LiveField__header">
                            <span>FirstName</span>
                          </div>
                          <div className="LiveField__answer">
                            <input
                              placeholder=""
                              data="[object Object]"
                              name="userName"
                              className="LiveField__input"
                              type="text"
                              onChange={(e) => this.inputHandler(e, "userName")}
                              defaultValue={this.state.userName}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="referral-firstName-parent-div">
                    <div className="LiveField" style={{ width: "100%" }}>
                      <div className="LiveField__container">
                        <div>
                          <div className="LiveField__header">
                            <span>Email Address</span>
                          </div>
                          <div className="LiveField__answer">
                            <input
                              placeholder=""
                              data="[object Object]"
                              name="userEmail"
                              className="LiveField__input"
                              type="text"
                              onChange={(e) =>
                                this.inputHandler(e, "userEmail")
                              }
                              defaultValue={this.state.userEmail}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: "15px" }} />
                  <div
                    className="referral-firstName-parent-div"
                    style={{ width: "100%" }}
                  >
                    <div className="LiveField" style={{ width: "100%" }}>
                      <div className="LiveField__container">
                        <div>
                          <div className="LiveField__header">
                            <span>Message - customize as you like</span>
                          </div>
                          <div className="LiveField__answer">
                            <textarea
                              placeholder=""
                              data="[object Object]"
                              name="Message - customize as you like"
                              type="text"
                              className="LiveField__input"
                              style={{ height: "102.994px" }}
                              value={
                                "Hey " +
                                this.state.emailMsgName +
                                ", You should check out FormBuilder! I think you'd really like it. Use the link below to get off 10% forever."
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="toggle-view-btn  btn-raised btn-round btn btn-default"
                onClick={(e) => this.handleSubmit(e)}
                style={{ width: "100%" }}
              >
                Invite <i className="fa fa-envelope referral-mail-icon" />
              </button>
            </div>
          )}

          <small className="referral-instructions">
            Referral discounts exclude additional user pricing on agency plans.
            * A "full user" is a user that has an active paid subscription with
            FormBuilder. This does not include third party subscriptions or
            lifetime deals.
          </small>
        </div>
      </div>
    );
  }
}

export default ReferralView;
