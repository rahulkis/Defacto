import React from "react";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import { DraftJS } from "megadraft";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../../src/assets/custom/question_control.css";
import {
  PostData,
  GetData,
  DeleteForm,
  UpdateData,
} from "../../../stores/requests";
import { EMAIL_URLS, FORM_URLS } from "../../../util/constants";
import { saveState } from "../../../actions/index";
import { store } from "../../../index";

class ConfigureEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendEmailOnSubmission: true,
      showAddEmail: false,
      showEmailLogic: false,
      addedEmailList: [],
      editorHtml: "",
      To: "",
      Subject: "",
      fromAddress: "",
      FromName: "",
      replyToAddress: "",
      CC: "",
      BCC: "",
      EmailContentType: [
        { id: 1, value: "Custom Message", label: "Custom Message" },
        { id: 2, value: "Submission Summary", label: "Submission Summary" },
        { id: 3, value: "Receipt", label: "Receipt" },
      ],
      selectedEmailContentType: {
        id: 1,
        value: "Custom Message",
        label: "Custom Message",
      },
      yesNoArr: [
        { id: 1, value: "Yes", label: "Yes" },
        { id: 2, value: "No", label: "No" },
      ],
      attachCustomPdfArr: [
        { id: 1, value: "Default Summary", label: "Default Summary" },
      ],
      includeSubmissionSummary: {},
      includeReceipt: {},
      isAddEmail: true,
      emailConditions: [],
    };
    this.emailConditionCount = 0;
    this.formJSON = [];
    this.getEmail = this.getEmail.bind(this);
    this.currentFormId = localStorage.CurrentFormId;
  }
  componentDidMount() {
    if (store.getState().StoreState.length > 0) {
      this.setState({ showAddEmail: store.getState().StoreState[0].val });
    }
    this.getEmail();
  }
  componentWillUnmount() {
    let formObj = {
      FormId: this.currentFormId,
      FormName: localStorage.formName,
      SendEmailOnSubmission: this.state.sendEmailOnSubmission,
      FromPage: "Emails",
      UpdatedAt: Date.now().toString(),
    };
    try {
      UpdateData(FORM_URLS.UPDATE_FORM_URL, formObj).then((result) => {});
    } catch (err) {
      console.log(FORM_URLS.UPDATE_FORM_URL, err);
    }
  }
  async getEmail() {
    const URL = EMAIL_URLS.GET_EMAILS_URL + this.currentFormId;
    GetData(URL).then((result) => {
      if (result != null) {
        this.setState({ addedEmailList: result.data.Items });
      }
    });
  }
  onSwitchChange = (field) => (event) => {
    this.setState({ [field]: event.target.checked });
  };
  showEmailPage = (e) => {
    e.preventDefault();
    this.setState({
      showAddEmail: true,
      isAddEmail: true,
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      fromAddress: "",
      fromName: "",
      replyToAddress: "",
      selectedEmailContentType: {
        id: 1,
        value: "Custom Message",
        label: "Custom Message",
      },
      editorHtml: "",
      editorText: "",
    });
    store.dispatch(saveState("showAddEmail", true));
  };
  cancelAddEmail = () => {
    store.dispatch(saveState("showAddEmail", false));
    this.setState({ showAddEmail: false });
  };
  addEmail = (e) => {
    e.preventDefault();
    this.emailConditionCount = 0;
    if (!this.state.subject && !this.state.to) {
      alert("Please answer all required questions");
      return false;
    }
    let addedEmailList = this.state.addedEmailList;

    let newEmailObj = {
      FormId: this.currentFormId,
      EmailID: DraftJS.genKey(),
      EmailTo: this.state.to,
      Subject: this.state.subject,
      CC: this.state.cc ? this.state.cc : null,
      BCC: this.state.bcc ? this.state.bcc : null,
      FromAddress: this.state.fromAddress ? this.state.fromAddress : null,
      FromName: this.state.fromName ? this.state.fromName : null,
      ReplyToAddress: this.state.replyToAddress
        ? this.state.replyToAddress
        : null,
      ContentOfEmail: this.state.selectedEmailContentType,
      IsEmailLogic: this.state.showEmailLogic,
      EmailConditions: JSON.stringify(this.state.emailConditions),
    };

    if (this.state.selectedEmailContentType.id === 1) {
      newEmailObj.IncludeSubmissionSummary = this.state.includeSubmissionSummary
        ? this.state.includeSubmissionSummary
        : {};
      newEmailObj.IncludeReceipt = this.state.includeReceipt
        ? this.state.includeReceipt
        : {};
      newEmailObj.CustomMessageHTML = this.state.editorHtml
        ? this.state.editorHtml
        : "<p></p>";
      newEmailObj.CustomMessageText = this.state.editorText
        ? this.state.editorText
        : null;
    }
    addedEmailList.push(newEmailObj);
    PostData(EMAIL_URLS.POST_EMAIL_URL, newEmailObj);
    this.setState({ addedEmailList: addedEmailList, showAddEmail: false });
    store.dispatch(saveState("showAddEmail", false));
  };
  handleInputChange = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
  };
  handleSwitchChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
    this.formJSON = JSON.parse(localStorage.getItem("formJSON"));
  };
  handleEmailContentType = (selectedType) => {
    this.setState({ selectedEmailContentType: selectedType });
  };
  handleSelectChange = (selectedType, fieldName) => {
    this.setState({ [fieldName]: selectedType });
  };

  handleChange = (content, delta, source, editor) => {
    this.setState({
      editorHtml: editor.getHTML(),
      editorText: editor.getText(),
    });
  };
  deleteEmail = (id) => {
    DeleteForm(EMAIL_URLS.DELETE_EMAIL + id).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          window.alert("Selected Email deleted successfully.");
        } else {
          window.alert("There is an error in deleting the form.");
        }
        this.getEmail();
      }
    });
  };
  copyMail = (data) => {
    this.setState({
      showAddEmail: true,
      isAddEmail: true,
      to: data.EmailTo,
      subject: data.Subject,
      cc: data.CC,
      bcc: data.BCC,
      fromAddress: data.FromAddress,
      fromName: data.FromName,
      replyToAddress: data.ReplyToAddress,
      selectedEmailContentType: data.ContentOfEmail,
    });
    if (data.ContentOfEmail.id === 1) {
      this.setState({
        editorHtml: data.CustomMessageHTML,
        editorText: data.CustomMessageText,
        includeReceipt: data.IncludeReceipt,
        includeSubmissionSummary: data.IncludeSubmissionSummary,
      });
    }
    store.dispatch(saveState("showAddEmail", true));
  };
  editMail = (data) => {
    this.setState({
      showAddEmail: true,
      isAddEmail: false,
      to: data.EmailTo,
      subject: data.Subject,
      mailId: data.EmailID,
      cc: data.CC,
      bcc: data.BCC,
      fromAddress: data.FromAddress,
      fromName: data.FromName,
      replyToAddress: data.ReplyToAddress,
      selectedEmailContentType: data.ContentOfEmail,
    });
    if (data.ContentOfEmail.id === 1) {
      this.setState({
        editorHtml: data.CustomMessageHTML,
        editorText: data.CustomMessageText,
        includeReceipt: data.IncludeReceipt,
        includeSubmissionSummary: data.IncludeSubmissionSummary,
      });
    }
    store.dispatch(saveState("showAddEmail", true));
  };
  updateEmail = (e) => {
    e.preventDefault();

    let newEmailObj = {
      FormId: this.currentFormId,
      EmailID: this.state.mailId,
      To: this.state.to,
      Subject: this.state.subject,
      CC: this.state.cc ? this.state.cc : null,
      BCC: this.state.bcc ? this.state.bcc : null,
      FromAddress: this.state.fromAddress ? this.state.fromAddress : null,
      FromName: this.state.fromName ? this.state.fromName : null,
      ReplyToAddress: this.state.replyToAddress
        ? this.state.replyToAddress
        : null,
      ContentOfEmail: this.state.selectedEmailContentType,
      IsEmailLogic: this.state.showEmailLogic,
      EmailConditions: JSON.stringify(this.state.emailConditions),
    };
    if (this.state.selectedEmailContentType.id === 1) {
      newEmailObj.IncludeSubmissionSummary = this.state.includeSubmissionSummary
        ? this.state.includeSubmissionSummary
        : {};
      newEmailObj.IncludeReceipt = this.state.includeReceipt
        ? this.state.includeReceipt
        : {};
      newEmailObj.CustomMessageHTML = this.state.editorHtml
        ? this.state.editorHtml
        : "<p></p>";
      newEmailObj.CustomMessageText = this.state.editorText
        ? this.state.editorText
        : null;
    }
    UpdateData(EMAIL_URLS.UPDATE_EMAIL, newEmailObj).then((result) => {
      this.getEmail();
    });
    this.setState({ showAddEmail: false });
  };
  addEmailCondition = () => {
    let emailConditions = this.state.emailConditions;
    let emailConditionsLen = this.state.emailConditions.length;
    if (this.state.emailConditions.length > 0) {
      emailConditions[emailConditionsLen - 1].isShowAndOr = true;
    }
    let obj = {
      id: this.emailConditionCount,
      value: "condition" + this.emailConditionCount,
      questionKey: "",
      questCondition: "is",
      questionType: "",
      controlType: "",
      answerVal: "",
      isShowAndOr: false,
      selectedOperator: "",
      isAndOr: "",
    };
    emailConditions.push(obj);
    this.setState({ emailConditions: emailConditions });
    this.emailConditionCount++;
  };
  handleQuestChange = (e, index) => {
    let emailConditions = this.state.emailConditions;
    let questionVal = e.target.value;
    let newArr = questionVal.split("_");
    emailConditions[index].selectedQuestion = newArr[0];
    emailConditions[index].questionKey = newArr[1];
    this.formJSON.filter(function(obj) {
      if (obj.key === newArr[1]) {
        emailConditions[index].controlType = obj.control;
        emailConditions[index].controlData = obj;
      }
      return obj;
    });
    this.setState({
      emailConditions: emailConditions,
    });
  };
  onQuestCondChange = (e, index, field) => {
    let emailConditions = this.state.emailConditions.slice(0);
    emailConditions[index][field] = e.target.value;
    this.setState({
      emailConditions: emailConditions,
    });
  };
  handleSelectAnsChange = (e, index, data, field) => {
    let emailConditions = this.state.emailConditions.slice(0);
    emailConditions[index][field] = data[e.target.value];
    this.setState({
      emailConditions: emailConditions,
    });
  };
  isAndHandler = (val, index, op) => {
    let emailConditions = this.state.emailConditions;
    emailConditions[index]["isAndOr"] = op;
    this.setState({
      emailConditions: emailConditions,
    });
  };
  removeEmailCond = (index) => {
    let emailConditions = this.state.emailConditions;
    if (emailConditions.length - 1 === index) {
      if (index !== 0) {
        emailConditions[index - 1].isShowAndOr = false;
        emailConditions[index - 1].isAndOr = "";
      }
    }
    emailConditions.splice(index, 1);
    this.setState({
      emailConditions: emailConditions,
    });
  };

  render() {
    return (
      <div>
        {!this.state.showAddEmail ? (
          <form
            name="ViewForm"
            className="full-preview-page preview_page_style"
          >
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="">
                    <h2 className="Paper-Type">Configure Emails</h2>
                    <p className="p-0 font-14">
                      Configure what emails are sent when the form is submitted.
                    </p>
                    <div className="FieldConfigurationField mt-4">
                      <span className="font-16-black">
                        Send me an email summary on submission
                      </span>
                      <div className="FieldConfiguration__value">
                        <Switch
                          checked={this.state.sendEmailOnSubmission}
                          onChange={this.onSwitchChange(
                            "sendEmailOnSubmission"
                          )}
                          value="sendEmailOnSubmission"
                          color="primary"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="FieldConfiguration__label">
                        Custom Emails
                      </div>
                      <div className="Mail-Table">
                        <table className="MailTable">
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>To</th>
                              <th>Message</th>
                              <th style={{ width: "100px" }}>Edit</th>
                              <th style={{ width: "100px" }}>Copy</th>
                              <th style={{ width: "100px" }}>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.addedEmailList.map((value, key) => (
                              <tr key={key}>
                                <td>{value.Subject}</td>
                                <td>{value.EmailTo}</td>
                                <td>{value.CustomMessageText}</td>
                                <td className="mail-delete-button">
                                  <div
                                    className="btn-add-mail"
                                    tabIndex="-1"
                                    onClick={() => this.editMail(value)}
                                  >
                                    <span>
                                      <i
                                        className="fa fa-edit Email-icon"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </div>
                                </td>
                                <td className="mail-delete-button">
                                  <div
                                    className="btn-add-mail"
                                    tabIndex="-1"
                                    onClick={() => this.copyMail(value)}
                                  >
                                    <span>
                                      <i
                                        className="fa fa-copy Email-icon"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </div>
                                </td>
                                <td className="mail-delete-button">
                                  <div
                                    className="btn-add-mail"
                                    tabIndex="-1"
                                    onClick={() =>
                                      this.deleteEmail(value.EmailID)
                                    }
                                  >
                                    <span>
                                      <i
                                        className="fa fa-times Email-dlt-icon"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {this.state.addedEmailList.length === 0 && (
                          <div className="custom-email mb-4 mt-4">
                            <h5 className="text-center">No Custom Email</h5>
                          </div>
                        )}
                        <div className="Add-coupan-button">
                          <button
                            type="button"
                            className="btn btn-Add btn-lg btn-block"
                            onClick={(e) => this.showEmailPage(e)}
                          >
                            Add Email+
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form name="ViewForm" className="add-email-page">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="Add-new-email mt-4">
                    <div className="mail-heading">
                      <h2>
                        {this.state.isAddEmail ? "Add Emails" : "Edit Email"}
                      </h2>
                      <div className="mail-padding">
                        <div className="row">
                          <div className="col-md-6 d-flex">
                            <label className="margin-label">To*</label>
                            <input
                              className="Add-Mail-input"
                              onChange={(e) => this.handleInputChange(e, "to")}
                              value={this.state.to}
                            />
                          </div>
                          <div className="col-md-6 d-flex">
                            <label className="margin-label">Subject*</label>
                            <input
                              className="Add-Mail-input"
                              onChange={(e) =>
                                this.handleInputChange(e, "subject")
                              }
                              value={this.state.subject}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 d-flex">
                            <label className="margin-label">CC</label>
                            <input
                              className="Add-Mail-input"
                              onChange={(e) => this.handleInputChange(e, "cc")}
                              value={this.state.cc}
                            />
                          </div>
                          <div className="col-md-6 d-flex">
                            <label className="margin-label">BCC</label>
                            <input
                              className="Add-Mail-input"
                              onChange={(e) => this.handleInputChange(e, "bcc")}
                              value={this.state.bcc}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 d-flex">
                            <label className="margin-label w-30">
                              From Address
                            </label>
                            <input
                              className="Add-Mail-input"
                              value={this.state.fromAddress}
                              onChange={(e) =>
                                this.handleInputChange(e, "fromAddress")
                              }
                            />
                          </div>
                          <div className="col-md-6 d-flex">
                            <label className="margin-label w-25">
                              From Name
                            </label>
                            <input
                              className="Add-Mail-input"
                              value={this.state.fromName}
                              onChange={(e) =>
                                this.handleInputChange(e, "fromName")
                              }
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 d-flex">
                            <label className="margin-label w-50">
                              Reply To Address
                            </label>
                            <input
                              className="Add-Mail-input"
                              value={this.state.replyToAddress}
                              onChange={(e) =>
                                this.handleInputChange(e, "replyToAddress")
                              }
                            />
                          </div>
                          <div className="col-md-6 d-flex">
                            <label className="margin-label">
                              Content of email
                            </label>
                            <Select
                              className="select-list"
                              value={this.state.selectedEmailContentType}
                              options={this.state.EmailContentType}
                              onChange={this.handleEmailContentType}
                            />
                          </div>
                        </div>
                        {this.state.selectedEmailContentType.id === 1 && (
                          <div className="row">
                            <div className="col-md-6 d-flex">
                              <label className="margin-label w-100">
                                Include submission summary in the email
                              </label>
                              <Select
                                className="select-list-mail"
                                options={this.state.yesNoArr}
                                onChange={(e) =>
                                  this.handleSelectChange(
                                    e,
                                    "includeSubmissionSummary"
                                  )
                                }
                              />
                            </div>
                            <div className="col-md-6 d-flex">
                              <label className="margin-label w-50">
                                Include receipt in the email
                              </label>
                              <Select
                                className="select-list-mail"
                                options={this.state.yesNoArr}
                                onChange={(e) =>
                                  this.handleSelectChange(e, "includeReceipt")
                                }
                              />
                            </div>
                            <div className="col-md-12">
                              <ReactQuill
                                onChange={this.handleChange}
                                value={this.state.editorHtml}
                              />
                              <input type="file" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="attach-custom d-flex">
                        <label className="margin-label w-25">
                          Attach Custom PDFs
                        </label>
                        <Select
                          className="select-attach"
                          options={this.state.attachCustomPdfArr}
                        />
                      </div>
                      <div className="col-md-12 mt-3 p-0">
                        <label className="Email-Logic">Email logic: Off</label>
                      </div>
                      <div className="col-md-12 p-0">
                        <span className="info-decr">
                          <i className="fa fa-info-circle" aria-hidden="true" />
                          <span className="ml-2 info-decr">
                            Send this email only when conditions are met
                          </span>
                        </span>
                      </div>
                      <div className="col-md-12">
                        <Switch
                          checked={this.state.showEmailLogic}
                          onChange={this.handleSwitchChange("showEmailLogic")}
                          value="showEmailLogic"
                          color="primary"
                        />
                        {this.state.showEmailLogic === true && (
                          <div className="configure-email Toggle-View-Bar margin_bottom">
                            {this.state.emailConditions.length > 0 &&
                              this.state.emailConditions.map((val, index) => (
                                <div key={index}>
                                  <div>
                                    <div className="col-md-12 d-inline-block">
                                      {!val.selectedQuestion && (
                                        <div className="col-md-11 d-inline-block">
                                          <select
                                            defaultValue={"DEFAULT"}
                                            onChange={(e) =>
                                              this.handleQuestChange(e, index)
                                            }
                                          >
                                            <option
                                              value={"DEFAULT"}
                                              disabled
                                              hidden={true}
                                            >
                                              Choose Question
                                            </option>
                                            {this.formJSON.map((data, i) => (
                                              <option
                                                key={i}
                                                name={data.control}
                                                hidden={
                                                  data.control === "simpletext"
                                                }
                                                value={
                                                  data.title !== ""
                                                    ? data.title +
                                                      "_" +
                                                      data.key
                                                    : "Untitled" +
                                                      "_" +
                                                      data.key
                                                }
                                              >
                                                {data.title !== ""
                                                  ? data.title
                                                  : "Untitled"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}
                                      {val.selectedQuestion && (
                                        <div className="col-md-6 d-inline-block">
                                          <select
                                            defaultValue={"DEFAULT"}
                                            onChange={(e) =>
                                              this.handleQuestChange(e, index)
                                            }
                                          >
                                            <option
                                              value={"DEFAULT"}
                                              disabled
                                              hidden={true}
                                            >
                                              Choose Question
                                            </option>
                                            {this.formJSON.map((data, i) => (
                                              <option
                                                key={i}
                                                name={data.control}
                                                hidden={
                                                  data.control === "simpletext"
                                                }
                                                value={
                                                  data.title !== ""
                                                    ? data.title +
                                                      "_" +
                                                      data.key
                                                    : "Untitled" +
                                                      "_" +
                                                      data.key
                                                }
                                              >
                                                {data.title !== ""
                                                  ? data.title
                                                  : "Untitled"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}
                                      {val.selectedQuestion && (
                                        <div className="col-md-2 d-inline-block _3pHqiVubpMLEJl33qP-THz Dropdown-root Dropdown-control Dropdown-placeholder Dropdown-arrow">
                                          <select
                                            className="Dropdown-root"
                                            onChange={(e) =>
                                              this.onQuestCondChange(
                                                e,
                                                index,
                                                "questCondition"
                                              )
                                            }
                                          >
                                            <option value="is">is</option>
                                            <option value="isnot">isn't</option>
                                            <option value="isAnswered">
                                              is answered
                                            </option>
                                            <option value="isnotanswered">
                                              isn't answered
                                            </option>
                                            <option value="contains">
                                              contains
                                            </option>
                                            <option value="doesnotcontain">
                                              doesn't contain
                                            </option>
                                          </select>
                                        </div>
                                      )}
                                      {((val.selectedQuestion &&
                                        val.controlType === "") ||
                                        val.controlType === "email" ||
                                        val.controlType === "url" ||
                                        val.controlType === "number" ||
                                        val.controlType === "phonenumber" ||
                                        val.controlType === "address" ||
                                        val.controlType === "country" ||
                                        val.controlType === "date" ||
                                        val.controlType === "time" ||
                                        val.controlType === "imageupload" ||
                                        val.controlType === "fileupload" ||
                                        val.controlType === "signature" ||
                                        val.controlType === "hidden") && (
                                        <div className="col-md-2 answer-block d-inline-block">
                                          <input
                                            className="FieldConfiguration-input"
                                            placeholder="answer..."
                                            value={
                                              this.state.emailConditions[index]
                                                .answerVal
                                            }
                                            onChange={(e) =>
                                              this.onQuestCondChange(
                                                e,
                                                index,
                                                "answerVal"
                                              )
                                            }
                                          />
                                        </div>
                                      )}
                                      {val.selectedQuestion &&
                                        val.controlType === "scale" && (
                                          <div className="col-md-3 d-inline-block _3pHqiVubpMLEJl33qP-THz Dropdown-root Dropdown-control Dropdown-placeholder Dropdown-arrow">
                                            <select
                                              defaultValue={"DEFAULT"}
                                              onChange={(e) =>
                                                this.onQuestCondChange(
                                                  e,
                                                  index,
                                                  "answerVal"
                                                )
                                              }
                                            >
                                              <option
                                                value={"DEFAULT"}
                                                disabled
                                                hidden={true}
                                              >
                                                Choose answer
                                              </option>
                                              {val.controlData.scaleOptions.map(
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        )}
                                      {val.selectedQuestion &&
                                        val.controlType === "dropdown" && (
                                          <div className="col-md-3 d-inline-block _3pHqiVubpMLEJl33qP-THz Dropdown-root Dropdown-control Dropdown-placeholder Dropdown-arrow">
                                            <select
                                              defaultValue={"DEFAULT"}
                                              onChange={(e) =>
                                                this.handleSelectAnsChange(
                                                  e,
                                                  index,
                                                  val.controlData
                                                    .dropdownOptionArray,
                                                  "answerVal"
                                                )
                                              }
                                            >
                                              <option
                                                value={"DEFAULT"}
                                                disabled
                                                hidden={true}
                                              >
                                                Choose answer
                                              </option>
                                              {val.controlData.dropdownOptionArray.map(
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t.label}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        )}
                                      {val.selectedQuestion &&
                                        val.controlType ===
                                          "multiplechoice" && (
                                          <div className="col-md-3 d-inline-block _3pHqiVubpMLEJl33qP-THz Dropdown-root Dropdown-control Dropdown-placeholder Dropdown-arrow">
                                            <select
                                              defaultValue={"DEFAULT"}
                                              onChange={(e) =>
                                                this.handleSelectAnsChange(
                                                  e,
                                                  index,
                                                  val.controlData
                                                    .MultiChoiceOptions,
                                                  "answerVal"
                                                )
                                              }
                                            >
                                              <option
                                                value={"DEFAULT"}
                                                disabled
                                                hidden={true}
                                              >
                                                Choose answer
                                              </option>
                                              {val.controlData.MultiChoiceOptions.map(
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t.label}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        )}
                                      {val.selectedQuestion &&
                                        val.controlType === "yesno" && (
                                          <div className="col-md-3 d-inline-block _3pHqiVubpMLEJl33qP-THz Dropdown-root Dropdown-control Dropdown-placeholder Dropdown-arrow">
                                            <select
                                              defaultValue={"DEFAULT"}
                                              onChange={(e) =>
                                                this.onQuestCondChange(
                                                  e,
                                                  index,
                                                  "answerVal"
                                                )
                                              }
                                            >
                                              <option
                                                value={"DEFAULT"}
                                                disabled
                                                hidden={true}
                                              >
                                                Choose answer
                                              </option>
                                              <option value={"yes"}>
                                                {"Yes"}
                                              </option>
                                              <option value={"no"}>
                                                {"No"}
                                              </option>
                                            </select>
                                          </div>
                                        )}
                                      {val.selectedQuestion &&
                                        val.controlType === "products" && (
                                          <div className="col-md-3 d-inline-block _3pHqiVubpMLEJl33qP-THz Dropdown-root Dropdown-control Dropdown-placeholder Dropdown-arrow">
                                            <select
                                              defaultValue={"DEFAULT"}
                                              onChange={(e) =>
                                                this.handleSelectAnsChange(
                                                  e,
                                                  index,
                                                  val.controlData.productList,
                                                  "answerVal"
                                                )
                                              }
                                            >
                                              <option
                                                value={"DEFAULT"}
                                                disabled
                                                hidden={true}
                                              >
                                                Choose answer
                                              </option>
                                              {val.controlData.productList.map(
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t.SKU}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        )}
                                      <div
                                        className="col-md-1 d-inline-block Toggle-View-Bar-Close"
                                        onClick={() =>
                                          this.removeEmailCond(index)
                                        }
                                      >
                                        <i
                                          className="fa fa-times"
                                          style={{ fontSize: "20px" }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {val.isShowAndOr === true && (
                                    <div
                                      className="ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL"
                                      style={{ textAlign: "center" }}
                                    >
                                      <div className="AdoKE9nnvZr4_zfgdeh5N">
                                        <div
                                          id={"isAnd"}
                                          className={
                                            val.isAndOr === "and"
                                              ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                              : "BtnV2 BtnV2--sm BtnV2--primary"
                                          }
                                          onClick={() =>
                                            this.isAndHandler(val, index, "and")
                                          }
                                          style={{
                                            margin: "10px 5px 10px 10px",
                                          }}
                                        >
                                          <span>And</span>
                                        </div>
                                        <div
                                          id={"isOr"}
                                          className={
                                            val.isAndOr === "or"
                                              ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                              : "BtnV2 BtnV2--sm BtnV2--primary"
                                          }
                                          onClick={() =>
                                            this.isAndHandler(val, index, "or")
                                          }
                                          style={{
                                            margin: "10px 10px 10px 5px",
                                          }}
                                        >
                                          <span>Or</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            {this.state.emailConditions.length > 0 ? (
                              <div
                                className="text-center"
                                onClick={() => this.addEmailCondition()}
                              >
                                <div className="BtnV2 BtnV2--primary">
                                  <span>Add another condition</span>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="text-center"
                                onClick={() => this.addEmailCondition()}
                              >
                                <div className="BtnV2 BtnV2--primary">
                                  <span>Add condition</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="outline-button mt-4">
                      {this.state.isAddEmail ? (
                        <button
                          className="btn-outline"
                          onClick={(e) => this.addEmail(e)}
                        >
                          Add Email
                        </button>
                      ) : (
                        <button
                          className="btn-outline"
                          onClick={(e) => this.updateEmail(e)}
                        >
                          Update Email
                        </button>
                      )}
                      <button
                        className="btn-shadow ml-2"
                        onClick={() => this.cancelAddEmail()}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default ConfigureEmail;
