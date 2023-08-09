import React from "react";
import Select from "react-select";
import { Row, Col } from "reactstrap";
import "../../src/assets/custom/FormBuilder.css";
import {
  FORM_BEHAVIOUR_URLS,
  ORDER_BY_OPTIONS,
  CONFIGURATION,
  FORM_URLS,
  TEMPLATE_URLS,
  ENCRYPTION_KEYS,
  USER_RELATED_URLS,
  AWS_BUCKET
} from "../util/constants";
import { GetData, DeleteForm, PostData, UpdateData } from "../stores/requests";
import { Redirect } from "react-router-dom";
import Template from "../views/templates/Template";
import Loader from "../components/Common/Loader";
import TagsMultiInput from "../views/forms/TagsInput";
import { store } from "../index";
import { SendEmail } from "../util/commonFunction";
import { renderEmail } from "react-html-email";
import CryptoJS from "crypto-js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      formData: [],
      InitialButtons: true,
      IsSubmissionFormData: true,
      templateData: [],
      configuringSpace: false,
      isLoader: true,
      showTemplate: true,
      spaceName: "My Forms",
      id: 1,
      searchFilterData: [],
      staticFilterValue: 1,
      reSendEmail: false,
      showPopUp: false,
      showPopup: false,
      leftTime: "",
      redirect: "",
    };

    //localStorage.clear();
    this.userId = "XYZ34"; //bydefault
    this.getForms = this.getForms.bind(this);
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  setBgChartData = (name) => {
    this.setState({
      bigChartData: name,
    });
  };
  getLoginData = () => {
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      if (!jsonData.IsVerified) {
        this.setState({ showPopUp: true });
      }
    } //
  };

  componentWillUpdate() {
    this.checkAccountExpired();
  }

  checkAccountExpired = () => {
    let accountExpired = JSON.parse(localStorage.getItem("accountStatus"));
    return accountExpired;
  };

  getConfiguration = () => {
    try {
      GetData(CONFIGURATION.CONFIGURATION_URL + "XYZ34").then((result) => {
        if (result != null) {
          let configurationData = result.data.Items[0];
          if (result.data.Count > 0) {
            this.setState({
              spaceName: configurationData.SpaceName,
              showTemplate: configurationData.ShowTemplate,
              id: configurationData.Id,
            });
            this.userId = configurationData.UserId;
          }
        }
      });
    } catch (err) {
      console.log("get configuration ", CONFIGURATION.CONFIGURATION_URL, err);
    }
  };
  async componentWillMount() {
    this.getLoginData();
    sessionStorage.removeItem("Submission");
    sessionStorage.removeItem("AddClass");
    localStorage.removeItem("templateId");

    GetData(FORM_URLS.GET_ALL_FORMS + this.loginUserId).then((result) => {
      if (result != null) {
        debugger;
        if(result.Items.length > 0)
        {
        let formsList =result.Items.sort(this.descending_sort);
        this.setState({ formData: formsList });
        this.setState({ searchFilterData: formsList });
        }
      }
    });

    GetData(TEMPLATE_URLS.GET_TEMPLATES).then((result) => {
      if (result != null) {
        this.setState({ templateData: result.Items, isLoader: false });
      } else {
        this.setState({ isLoader: false });
      }
    });

    if (store.getState().fetchthemeInfo.themeInfo !== undefined) {
      const RESET_ACTION = {
        type: "RESET",
      };

      store.dispatch(RESET_ACTION);
      console.log("clear");
    }
  }
  viewForm = (event, formid, submissionCount) => {
    localStorage.removeItem("formRequireCaptcha");
    event.preventDefault();
    if (formid != null) {
      this.viewFormSubmissionData(formid, submissionCount);
    }
  };

  viewExecutionData = (formid) => {
    GetData(FORM_URLS.GET_FORM_BY_ID_URL + formid).then((result) => {
      if (result != null) {
        localStorage.setItem("formData", result.Item.Content);
        if (this.checkAccountExpired()) {
          this.props.history.push("/preview/accountExpired");
        } else {
          window.open("../preview/ViewForm", "_blank");
        }
      }
    });
  };

  viewFormSubmissionData = (formid, submissionCount) => {
    GetData(FORM_BEHAVIOUR_URLS.GET_FORM_BEHAVIOUR_URL + formid).then(
      (data) => {
        if (data != null && data.data.Items.length > 0) {
          let currentDate = new Date();
          if (data.statusCode === 200) {
            if (
              data.data.Items[0].DisableSubmission ||
              (data.data.Items[0].DisableAfterMaxOfSubmission &&
                data.data.Items[0].MaxSubmission <= submissionCount) ||
              (data.data.Items[0].SubmissionCloseDateTime != null &&
                new Date(data.data.Items[0].SubmissionCloseDateTime) <=
                  new Date(currentDate.toISOString())) ||
              (data.data.Items[0].SubmissionOpenDateTime != null &&
                new Date(data.data.Items[0].SubmissionOpenDateTime) >
                  new Date(currentDate.toISOString()))
            ) {
              if (data.data.Items[0].CustomCloseSubmissionPage) {
                localStorage.setItem("CustomCloseSubmissionPage", true);
                localStorage.setItem(
                  "SubmissionPageData",
                  data.data.Items[0].SubmissionPageData
                );
              }
              window.open("../preview/SubmissionClosed", "_blank");
            } else {
              if (data.data.Items[0].RequireCaptcha) {
                localStorage.setItem("formRequireCaptcha", true);
              } else {
                localStorage.removeItem("formRequireCaptcha");
              }
              this.viewExecutionData(formid);
            }
          }
        } else {
          localStorage.removeItem("formRequireCaptcha");
          this.viewExecutionData(formid);
        }
      }
    );
  };

  viewSubmission = (event, formid, formName) => {
    event.preventDefault();
    sessionStorage.setItem("Submissionformid", formid);
    sessionStorage.setItem("formName", formName);
    window.open("../Submission/Submission", "_self");
  };

  getForms() {
    GetData(FORM_URLS.GET_ALL_FORMS + this.loginUserId).then((result) => {
      if (result != null) {
        if(result.Items.length > 0)
        {
        let formsList =result.Items.sort(this.descending_sort);
        this.setState({ formData: formsList });
        this.setState({ searchFilterData: formsList });
        }
      }
    })
  }
  
  toggleButtons = (e, formId, state) => {
    e.preventDefault();
    this.setState({ ["toggle" + formId]: state });
  };

  deleteForm = (e, formid) => {
    e.preventDefault();
    if (formid != null) {
      DeleteForm(FORM_URLS.GET_FORM_BY_ID_URL + formid).then((result) => {
        if (result != null) {
          if (result.statusCode === 200) {
          } else {
            window.alert("There is an error in deleting the form.");
          }
          this.getForms();
        }
      });
    }
  };
  editForm = (e, formid) => {
    e.preventDefault();
    if (formid != null) {
      localStorage.setItem("grpCounter", 0);
      localStorage.setItem("EditForm", true);
      localStorage.setItem("FormId", formid);
      localStorage.setItem("CurrentFormId", formid);
      if (this.checkAccountExpired()) {
        this.props.history.push("/preview/accountExpired");
      } else {
        window.open("../user/EditForm", "_blank");
      }
    }
  };
  searchForm = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      let searchedTxt = e.target.value;
      if (searchedTxt) {
        GetData(FORM_URLS.SEARCH_FORM_URL + searchedTxt).then((data) => {
          if (data != null) {
            if (data.statusCode === 200) {
              this.setState({ formData: data.data.Items });
            }
          }
        });
      } else {
        this.getForms();
      }
    }
  };
  filterData = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      let searchedTxt = e.target.value;
      if (searchedTxt) {
        let result = this.state.searchFilterData.filter(
          (p) =>
            (this.isEligible(p.FormName) &&
              p.FormName.toLowerCase().includes(searchedTxt.toLowerCase())) ||
            (this.isEligible(p.Tags) &&
              this.lowerCase(p.Tags).includes(searchedTxt.toLowerCase()))
        );
        this.setState({ formData: result, staticFilterValue: 2 });
      } else {
        this.setState({
          formData: this.state.searchFilterData,
          staticFilterValue: 1,
        });
      }
    }
  };
  isEligible(value) {
    if (value !== false || value !== null || value !== 0 || value !== "") {
      return value;
    }
  }
  lowerCase(value) {
    value = value.map(function(val) {
      return val.toLowerCase();
    });
    return value;
  }
  duplicateForm = (e, formid) => {
    e.preventDefault();
    localStorage.setItem("grpCounter", 0);
    localStorage.setItem("EditForm", false);
    localStorage.setItem("FormId", formid);
    localStorage.setItem("CurrentFormId", formid);
    if (this.checkAccountExpired()) {
      this.props.history.push("/preview/accountExpired");
    } else {
      window.open("../user/EditForm", "_blank");
    }
  };
  calculateTime = (date_future) => {
    let updatedTime = "";
    let date_now = Date.parse(new Date());
    //get total seconds between the times
    let delta = Math.abs(date_future - date_now) / 1000;
    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    // let seconds = delta % 60; // in theory the modulus is not required
    if (days > 0) {
      updatedTime = days + " days";
    } else if (hours > 0) {
      updatedTime = hours + (hours === 1 ? " hour" : " hours");
    } else if (minutes > 0) {
      updatedTime = minutes + " minutes";
    } else {
      updatedTime = "few seconds";
    }
    return updatedTime;
  };
  orderByResult = (e) => {
    let formData = this.state.formData;
    if (e.id === 1) {
      formData.sort(this.ascending_sort);
      this.setState({ formData: formData, staticFilterValue: 1 });
    } else if (e.id === 2) {
      formData.sort(this.descending_sort);
      this.setState({ formData: formData, staticFilterValue: 2 });
    } else {
      this.getForms();
    }
  };
  descending_sort = (a, b) => {
    return Number(b.UpdatedAt) - Number(a.UpdatedAt); //descending
  };
  ascending_sort = (a, b) => {
    return Number(a.UpdatedAt) - Number(b.UpdatedAt); //ascending
  };
  configuringSpace = () => {
    this.setState({ configuringSpace: true });
  };
  updateConfiguration = () => {
    this.setState({ configuringSpace: false });
    let configuration = {
      Id: this.state.id,
      UserId: this.userId,
      SpaceName: this.state.spaceName,
      ShowTemplate: this.state.showTemplate,
      CreatedAt: Date.now(),
      UpdatedAt: Date.now(),
    };
    if (this.userId) {
      try {
        UpdateData(CONFIGURATION.CONFIGURATION_URL, configuration).then(
          (result) => {}
        );
      } catch (err) {
        console.log(CONFIGURATION.CONFIGURATION_URL, err);
      }
    } else {
      try {
        PostData(CONFIGURATION.CONFIGURATION_URL, configuration).then(
          (result) => {}
        );
      } catch (err) {
        console.log(CONFIGURATION.CONFIGURATION_URL, err);
      }
    }
  };
  toggleTemplate = () => {
    this.setState({ showTemplate: !this.state.showTemplate });
  };
  handleNameChange = (e) => {
    this.setState({ spaceName: e.target.value });
  };
  emailHTML = (val) => {
    let encryptedData = CryptoJS.AES.encrypt(
      val,
      ENCRYPTION_KEYS.SECRETKEY
    ).toString();
    return renderEmail(
      <div>
        Dear DefactoForm user,
        <p>please click on the below link to confirm the email</p>
        <a
          href={
            window.location.origin.toString() +
            "/preview/VerifyUser/" +
            encryptedData
          }
        >
          verify
        </a>
        <p>Sincerely,</p>
        <p>DefactoForm Team.</p>
      </div>
    );
  };
  reSendEmail = () => {
    let userData = sessionStorage.getItem("userData");
    let resultItems = JSON.parse(userData);
    try {
      PostData(USER_RELATED_URLS.USER_LOGIN, resultItems).then((result) => {
        let userData = JSON.parse(result.data);
        let userID = userData.Items[0].UserId;
        let userEmail = userData.Items[0].Email;
        if (userID && userEmail) {
          let subject = "Please confirm your Email for DefactoForm.";
          SendEmail(userEmail, subject, this.emailHTML(userID));
        }
        this.setState({ reSendEmail: true });
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
    }
  };
  accountActiveHandler = () => {
    localStorage.setItem("activate", "activateMyAccount");

    window.open("../AccountSettings/Account", "_self");
  };
  render() {
    if (!sessionStorage.getItem("userData")) {
      return <Redirect to={"../Welcome"} />;
    }

    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <>
        {
          <div className="content">
            <Row>
              <Col md="8" className="main-form-div">
                <Row>
                  <Col md="6">
                    <h1>
                      {this.state.configuringSpace ? (
                        <input
                          autoFocus={true}
                          type="text"
                          value={this.state.spaceName}
                          onChange={(e) => this.handleNameChange(e)}
                        />
                      ) : (
                        this.state.spaceName
                      )}
                    </h1>
                  </Col>
                </Row>
                {this.checkAccountExpired() && (
                  <div
                    className="Paper Paper--clickable Paper--double-padded mb1"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <h3
                        className="PaperType--h2"
                        style={{ fontSize: "20px" }}
                      >
                        <strong>
                          Your account has expired,{" "}
                          <a
                            href="#pablo"
                            style={{ marginRight: "5px" }}
                            onClick={(e) => this.accountActiveHandler()}
                          >
                            complete your account setup now
                          </a>
                          for your forms to keep working.
                        </strong>
                      </h3>
                    </div>
                  </div>
                )}
                {this.state.showPopUp && (
                  <div class="Paper Paper--padded mb1">
                    <div>
                      <span>
                        You need to verify your email address before your forms
                        can be submitted.
                        {this.state.reSendEmail ? (
                          <div
                            class="BtnV2 BtnV2--raised BtnV2--primary disabled BtnV2--solid"
                            tabindex="-1"
                            style={{
                              position: "relative",
                              marginBottom: 10,
                              marginLeft: 10,
                            }}
                          >
                            <span>Sent</span>
                          </div>
                        ) : (
                          <div
                            class="BtnV2 BtnV2--raised BtnV2--primary BtnV2--solid"
                            tabindex="-1"
                            style={{
                              position: "relative",
                              marginBottom: 10,
                              marginLeft: 10,
                              fontSize: "14px",
                              padding: " 15px",
                            }}
                            onClick={(e) => this.reSendEmail()}
                          >
                            <span>Resend verification email</span>
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {this.state.showTemplate && (
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    <Template
                      templateData={this.state.templateData}
                      expiredAccount={this.checkAccountExpired()}
                      {...this.props}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <div />
            <div />
            <Row>
              <Col md="8" className="main-form-div">
                <Row>
                  <Col className="mb-8" md="12">
                    <form className="row p-3 preview_page_style">
                      <div className="col-md-3">
                        <input
                          type="text"
                          placeholder="Search.."
                          className="search-box"
                          // onKeyDown={e => this.searchForm(e)}
                          onKeyDown={(e) => this.filterData(e)}
                        />
                      </div>
                      <span className="font-15-black ml-2 mt-2">Order by:</span>
                      <span className="col-md-3">
                        <Select
                          onChange={this.orderByResult}
                          options={ORDER_BY_OPTIONS}
                        />
                      </span>
                      <div className="col-md-2 d-flex">
                        {this.state.configuringSpace && (
                          <div className="d-flex">
                            <div
                              className="BtnV2 p-3"
                              tabIndex="-1"
                              onClick={() => this.toggleTemplate()}
                            >
                              <span>
                                {this.state.showTemplate
                                  ? "Hide Templates"
                                  : "Show templates"}
                              </span>
                            </div>
                            <div
                              className="BtnV2 BtnV2--solid ml-4"
                              tabIndex="-1"
                              onClick={() => this.updateConfiguration()}
                            >
                              <span>Done</span>
                            </div>
                          </div>
                        )}
                        {!this.state.configuringSpace && (
                          <i
                            className="fas fa-cog congifure-space"
                            onClick={() => this.configuringSpace()}
                          />
                        )}
                      </div>
                    </form>
                  </Col>
                  <div className="container titledform">
                    <Col md="12" className="p-0">
                      <form className="preview_page_style">
                        <div>
                          {this.state.formData.map((form, key) => (
                            <div className="container titledform" key={key}>
                              <div className="row">
                                <div className="col-md-2">
                                  <img
                                    alt=""
                                    src={
                                      form.CoverImage
                                        ? AWS_BUCKET.IMAGEURL + form.CoverImage
                                        : require("assets/img/blueBackground.jpeg")
                                    }
                                  />
                                </div>
                                <div className="col-md-10 content-div">
                                  <div className="col-md-12">
                                    <div className="row">
                                      <div className="col-md-3 title">
                                        {form.FormName &&
                                        form.FormName !== "null"
                                          ? form.FormName
                                          : "Untitled"}
                                      </div>
                                      {!this.state["toggle" + form.FormId] ? (
                                        <div className="col-md-9">
                                          <a
                                            href="#pablo"
                                            className="Btnv2 BtnV2--secondary"
                                            onClick={(event) =>
                                              this.viewForm(
                                                event,
                                                form.FormId,
                                                form.SubmissionCount
                                              )
                                            }
                                            formid={form.FormId}
                                          >
                                            View
                                          </a>
                                          <a
                                            href="#pablo"
                                            onClick={(event) =>
                                              this.viewSubmission(
                                                event,
                                                form.FormId,
                                                form.FormName &&
                                                  form.FormName !== "null"
                                                  ? form.FormName
                                                  : "Untitled"
                                              )
                                            }
                                          >
                                            {form.SubmissionCount} Submission
                                          </a>
                                          <a
                                            href="#pablo"
                                            onClick={(e) =>
                                              this.editForm(e, form.FormId)
                                            }
                                          >
                                            Edit
                                          </a>
                                          <a
                                            href="#pablo"
                                            className="Btnv2 BtnV2--primary"
                                            onClick={(e) =>
                                              this.toggleButtons(
                                                e,
                                                form.FormId,
                                                true
                                              )
                                            }
                                          >
                                            More...
                                          </a>
                                        </div>
                                      ) : (
                                        <div className="col-md-9">
                                          <a
                                            href="#pablo"
                                            className="Btnv2 BtnV2--secondary"
                                            formid={form.FormId}
                                            onClick={(e) =>
                                              this.duplicateForm(e, form.FormId)
                                            }
                                          >
                                            Duplicate
                                          </a>
                                          <a href="#pablo">Move to..</a>
                                          <a
                                            href="#pablo"
                                            className="delete-btn"
                                            onClick={(e) =>
                                              this.deleteForm(e, form.FormId)
                                            }
                                          >
                                            Delete
                                          </a>
                                          <a
                                            href="#pablo"
                                            className="Btnv2 BtnV2--primary"
                                            onClick={(e) =>
                                              this.toggleButtons(
                                                e,
                                                form.FormId,
                                                false
                                              )
                                            }
                                          >
                                            Back
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="col-md-6">
                                        {this.state.staticFilterValue === 1 && (
                                          <TagsMultiInput
                                            FormId={form.FormId}
                                            Tags={form.Tags}
                                            StaticFilterValue={
                                              this.state.staticFilterValue
                                            }
                                          />
                                        )}
                                        {this.state.staticFilterValue === 2 && (
                                          <TagsMultiInput
                                            FormId={form.FormId}
                                            Tags={form.Tags}
                                            StaticFilterValue={
                                              this.state.staticFilterValue
                                            }
                                          />
                                        )}
                                      </div>
                                      <div className="col-md-12">
                                        <div className="text">
                                          Last updated{" "}
                                          {this.calculateTime(form.UpdatedAt)}{" "}
                                          ago
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </form>
                    </Col>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
        }
      </>
    );
  }
}
export default Dashboard;
