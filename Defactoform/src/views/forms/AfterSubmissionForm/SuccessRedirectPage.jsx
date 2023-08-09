import React from "react";
import { DraftJS } from "megadraft";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import { editorStateFromRaw } from "megadraft";
import { convertToRaw } from "draft-js";
import image from "../../../MegaEditor/plugins/image";
import video from "../../../MegaEditor/plugins/video";
import MegadraftEditor from "../../../MegaEditor/components/MegadraftEditor";
import actions from "megadraft/lib/actions/default";
import {
  PostData,
  GetData,
  DeleteForm,
  UpdateData,
} from "../../../stores/requests";
import {
  AFTER_SUBMISSION_DATA,
  SUCCESS_N_REDIRECTS_PAGE_URLS,
} from "../../../util/constants";

const Block = {
  UNSTYLED: "unstyled",
  PARAGRAPH: "unstyled",
  OL: "ordered-list-item",
  UL: "unordered-list-item",
  H1: "header-one",
  H2: "header-two",
  H3: "header-three",
  H4: "header-four",
  H5: "header-five",
  H6: "header-six",
  CENTER: "center",
  CODE: "code-block",
  BLOCKQUOTE: "blockquote",
  PULLQUOTE: "pullquote",
  ATOMIC: "atomic",
  BLOCKQUOTE_CAPTION: "block-quote-caption",
  CAPTION: "caption",
  TODO: "todo",
  IMAGE: "atomic:image",
  BREAK: "atomic:break",
  LeftAlign: "leftAlign",
  RightAlign: "rightAlign",
  CenterAlign: "centerAlign",
};
function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === "leftAlign") {
    localStorage.setItem("alignClass", "text-left");
    return "text-left";
  } else if (type === "rightAlign") {
    localStorage.setItem("alignClass", "text-right");
    return "text-right";
  } else if (type === "centerAlign") {
    localStorage.setItem("alignClass", "text-center");
    return "text-center";
  }
  if (localStorage.getItem("alignClass") !== undefined) {
    return localStorage.getItem("alignClass");
  } else {
    return "text-center";
  }
}
class HeaderOneIcon extends React.Component {
  render() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M11.58,19.86H9.69v-6.57H2.53v6.57H0.65V5.64h1.88v6.11h7.17V5.64h1.88V19.86z M20.38,19.86h-1.82V7.82l-3.64,1.34V7.52l5.18-1.94h0.28V19.86z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
class RightIndentIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}

class LeftIndentIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}

class CenterIndentIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}
ReactModal.setAppElement("#root");
export default class SuccessRedirectPage extends React.Component {
  constructor(props) {
    super(props);
    const myContent = {
      entityMap: {},
      blocks: [
        {
          key: "ag6qs",
          text: AFTER_SUBMISSION_DATA.SUBMISSION_TITLE,
          type: "header-one",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: AFTER_SUBMISSION_DATA.SUBMISSION_TITLE.length,
              style: "center",
            },
          ],
          entityRanges: [],
          data: {},
        },
        {
          key: "tysw2",
          text: AFTER_SUBMISSION_DATA.SUBMISSION_DESCRIPTION,
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: AFTER_SUBMISSION_DATA.SUBMISSION_DESCRIPTION.length,
              style: "RIGHT",
            },
          ],
          entityRanges: [],
          data: {},
        },
      ],
    };
    this.editorState = editorStateFromRaw(myContent);
    this.state = {
      title: AFTER_SUBMISSION_DATA.SUBMISSION_TITLE,
      description: AFTER_SUBMISSION_DATA.SUBMISSION_DESCRIPTION,
      includeSubmitAnother: false,
      redirectUrl: "",
      isRedirectEnable: false,
      successPageNRedirects: false,
      submitPageArray: [],
      showModal: false,
      pageHasCondition: false,
      pageName: "Submission Success",
      pageRules: [],
      pageRedirectUrl: "",
      redirectToAnotherUrl: true,
      redirectTime: "",
      submissionScreenDesign: this.editorState,
      editorState: this.editorState,
    };
    this.pageRuleCount = 0;
    this.formJSON = [];
    this.currentFormId = localStorage.CurrentFormId;
  }
  componentDidMount() {
    this.getDefaultPage();
    this.getPages();
  }
  onChange = (editorState) => {
    this.setState({ editorState });
  };
  addDefaultPage = () => {
    let pageID = DraftJS.genKey();
    let defaultPage = {
      PageID: pageID,
      FormId: this.currentFormId,
      PageTitle: this.state.title,
      Description: this.state.description,
      IncludeSubmitAnother: this.state.includeSubmitAnother,
      RedirectEnable: this.state.isRedirectEnable,
      SuccessPageNRedirects: this.state.successPageNRedirects,
    };
    PostData(
      SUCCESS_N_REDIRECTS_PAGE_URLS.POST_DEFAULT_PAGE_URL,
      defaultPage
    ).then((result) => {
      localStorage.setItem("DefaultPageID", pageID);
    });
  };
  updateDefaultPage = (pageID) => {
    let defaultPage = {
      PageID: pageID,
      FormId: this.currentFormId,
      PageTitle: this.state.title,
      Description: this.state.description,
      IncludeSubmitAnother: this.state.includeSubmitAnother,
      RedirectEnable: this.state.isRedirectEnable,
      SuccessPageNRedirects: this.state.successPageNRedirects,
    };
    UpdateData(
      SUCCESS_N_REDIRECTS_PAGE_URLS.POST_DEFAULT_PAGE_URL,
      defaultPage
    ).then((result) => {
      localStorage.setItem("DefaultPageID", pageID);
    });
  };
  componentWillUnmount = () => {
    const URL =
      SUCCESS_N_REDIRECTS_PAGE_URLS.GET_DEFAULT_PAGE_URL + this.currentFormId;
    GetData(URL).then((result) => {
      if (result.data.Items.length === 0) {
        this.addDefaultPage();
      } else {
        this.pageId = result.data.Items[0].PageID;
        this.updateDefaultPage(this.pageId);
      }
    });
  };

  getDefaultPage = () => {
    const URL =
      SUCCESS_N_REDIRECTS_PAGE_URLS.GET_DEFAULT_PAGE_URL + this.currentFormId;
    GetData(URL).then((result) => {
      let resultant = result.data.Items;
      if (resultant.length > 0) {
        this.setState({
          title: resultant[0].PageTitle,
          description: resultant[0].Description,
          includeSubmitAnother: resultant[0].IncludeSubmitAnother,
          isRedirectEnable: resultant[0].RedirectEnable,
          successPageNRedirects: resultant[0].SuccessPageNRedirects,
        });
      }
    });
  };
  getPages = () => {
    const URL =
      SUCCESS_N_REDIRECTS_PAGE_URLS.GET_ALL_SUCCESS_PAGES_URL +
      this.currentFormId;
    GetData(URL).then((result) => {
      if (result !== null) {
        this.setState({ submitPageArray: result.data.Items });
      }
    });
  };
  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };
  onSwitchChange = (field) => (event) => {
    this.setState({ [field]: event.target.checked });
  };
  addPage = () => {
    localStorage.removeItem("alignClass");
    this.setState({
      pageName: "",
      pageRules: "",
      redirectToAnotherUrl: false,
      pageRedirectUrl: "",
      redirectTime: "",
      pageHasCondition: false,
      submissionScreenDesign: this.editorState,
    });
    localStorage.setItem("pageType", "add");
    this.pageRuleCount = 0;
    let newPage = {
      pageName: "",
      pageRules: "",
      PageHasCondition: false,
      pageRedirectUrl: "",
      redirectToAnotherUrl: false,
      submissionScreenDesign: this.editorState,
    };
    let submitPageArray = this.state.submitPageArray;
    submitPageArray.push(newPage);
    this.formJSON = JSON.parse(localStorage.getItem("formJSON"));
    this.setState({ submitPageArray: submitPageArray, showModal: true });
  };
  deletePage = (i, pageid) => {
    let submitPageArray = this.state.submitPageArray;
    submitPageArray.splice(i, 1);
    DeleteForm(
      SUCCESS_N_REDIRECTS_PAGE_URLS.DELETE_PAGE_BY_ID_URL + pageid
    ).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          //success;
        } else {
          //failure;
        }
        this.getPages();
      }
    });
    this.setState({ submitPageArray: submitPageArray });
  };
  handleCloseModal = () => {
    if (localStorage.pageType === "edit") {
      this.updatePage();
    } else {
      this.savePage();
    }
    this.setState({ showModal: false });
    localStorage.removeItem("pageType");
  };
  moveRule = (moveStatus, index) => {
    let submitPageArray = this.state.submitPageArray.slice(0);
    let currentRule = submitPageArray[index];
    if (moveStatus === "up" && index !== 0) {
      let upperRule = submitPageArray[index - 1];
      submitPageArray[index - 1] = currentRule;
      submitPageArray[index] = upperRule;
    } else if (moveStatus === "down" && index !== submitPageArray.length - 1) {
      let belowRule = submitPageArray[index + 1];
      submitPageArray[index + 1] = currentRule;
      submitPageArray[index] = belowRule;
    }
    this.setState({
      submitPageArray: submitPageArray,
    });
  };
  pageFieldChange = (e, index, field) => {
    let submitPageArray = this.state.submitPageArray.slice(0);
    if (field === "pageHasCondition") {
      submitPageArray[index][field] = e.target.checked;
    } else {
      submitPageArray[index][field] = e.target.value;
    }
    this.setState({
      submitPageArray: submitPageArray,
    });
  };
  savePage = () => {
    let rawValue = convertToRaw(this.state.editorState.getCurrentContent());
    let editorStateRawData = JSON.stringify(rawValue);
    let newPage = {
      PageID: DraftJS.genKey(),
      FormId: this.currentFormId,
      PageHasCondition: this.state.pageHasCondition,
      PageName: this.state.pageName ? this.state.pageName : null,
      PageRules: this.state.pageHasCondition
        ? JSON.stringify(this.state.pageRules)
        : [],
      PageRulesCount: this.state.pageRules.length,
      RedirectToAnotherUrl: this.state.redirectToAnotherUrl
        ? this.state.redirectToAnotherUrl
        : false,
      PageRedirectUrl: this.state.pageRedirectUrl
        ? this.state.pageRedirectUrl
        : null,
      RedirectTime: this.state.redirectTime ? this.state.redirectTime : null,
      SubmissionScreenDesign: editorStateRawData,
    };
    PostData(SUCCESS_N_REDIRECTS_PAGE_URLS.ADD_DYNAMIC_PAGE_URL, newPage).then(
      (result) => {
        if (result.statusCode === 200) {
          this.getPages();
        } else {
          window.alert("Error In Saving Information");
        }
      }
    );
  };
  updatePage = () => {
    let rawValue = convertToRaw(this.state.editorState.getCurrentContent());
    let editorStateRawData = JSON.stringify(rawValue);
    let newPage = {
      PageID: localStorage.pageID,
      FormId: this.currentFormId,
      PageHasCondition: this.state.pageHasCondition,
      PageName: this.state.pageName ? this.state.pageName : null,
      PageRules: this.state.pageHasCondition
        ? JSON.stringify(this.state.pageRules)
        : [],
      PageRulesCount: this.state.pageRules.length,
      PageRedirectUrl: this.state.pageRedirectUrl
        ? this.state.pageRedirectUrl
        : null,
      RedirectToAnotherUrl: this.state.redirectToAnotherUrl
        ? this.state.redirectToAnotherUrl
        : false,
      RedirectTime: this.state.redirectTime ? this.state.redirectTime : null,
      SubmissionScreenDesign: editorStateRawData,
    };
    UpdateData(
      SUCCESS_N_REDIRECTS_PAGE_URLS.UPDATE_DYNAMIC_PAGE_URL,
      newPage
    ).then((result) => {
      if (result.statusCode === 200) {
        this.getPages();
      } else {
        window.alert("Error In Updating Information");
      }
    });
    localStorage.removeItem("pageType");
    localStorage.removeItem("pageID");
    localStorage.removeItem("alignClass");
  };
  editPage = (pageID) => {
    localStorage.setItem("pageType", "edit");
    localStorage.setItem("pageID", pageID);
    this.formJSON = JSON.parse(localStorage.getItem("formJSON"));

    const URL = SUCCESS_N_REDIRECTS_PAGE_URLS.GET_DYNAMIC__URL + pageID;
    GetData(URL).then((result) => {
      if (result !== null) {
        this.setState({
          PageID: pageID,
          FormId: this.currentFormId,
          pageHasCondition: result.data.Item.PageHasCondition,
          pageRules: result.data.Item.PageHasCondition
            ? JSON.parse(result.data.Item.PageRules)
            : [],
          pageName:
            result.data.Item.PageName !== null ||
            result.data.Item.PageName !== undefined
              ? result.data.Item.PageName
              : "",
          pageRedirectUrl: result.data.Item.PageRedirectUrl
            ? result.data.Item.PageRedirectUrl
            : "",
          redirectToAnotherUrl: result.data.Item.RedirectToAnotherUrl
            ? result.data.Item.RedirectToAnotherUrl
            : false,
          redirectTime: result.data.Item.RedirectTime
            ? result.data.Item.RedirectTime
            : "",
          editorState: result.data.Item.SubmissionScreenDesign
            ? editorStateFromRaw(
                JSON.parse(result.data.Item.SubmissionScreenDesign)
              )
            : this.state.editorState,
          showModal: true,
        });
      }
    });
  };
  addPageCondition = () => {
    let pageRules = this.state.pageRules;
    let pageRulesLen = this.state.pageRules.length;
    if (this.state.pageRules.length > 0) {
      // this.state.pageRules[pageRulesLen - 1].isShowAndOr = true;
      //-----------------------------------------------------------------------------------//
      let newPageRules = this.state.pageRules;
      let updatePageRules = {
        ...newPageRules[pageRulesLen - 1],
        isShowAndOr: true,
      };
      newPageRules = updatePageRules;
      this.setState({ pageRules: newPageRules });
      //---------------------------------------------------------------------------------------//
    }
    let obj = {
      id: this.pageRuleCount,
      value: "condition" + this.pageRuleCount,
      questionKey: "",
      questCondition: "is",
      questionType: "",
      controlType: "",
      answerVal: "",
      isShowAndOr: false,
      selectedOperator: "",
      isAndOr: "",
    };
    pageRules.push(obj);
    this.setState({ pageRules: pageRules });
    this.pageRuleCount++;
  };
  handleQuestChange = (e, index) => {
    let pageRules = this.state.pageRules;
    let questionVal = e.target.value;
    let newArr = questionVal.split("_");
    pageRules[index].selectedQuestion = newArr[0];
    pageRules[index].questionKey = newArr[1];
    this.formJSON.filter((obj) => {
      if (obj.key === newArr[1]) {
        pageRules[index].controlType = obj.control;
        pageRules[index].controlData = obj;
      }
      return obj;
    });
    this.setState({
      pageRules: pageRules,
    });
  };
  onQuestCondChange = (e, index, field) => {
    let pageRules = this.state.pageRules.slice(0);
    pageRules[index][field] = e.target.value;
    this.setState({
      pageRules: pageRules,
    });
  };
  handleSelectAnsChange = (e, index, data, field) => {
    let pageRules = this.state.pageRules.slice(0);
    pageRules[index][field] = data[e.target.value];
    this.setState({
      pageRules: pageRules,
    });
  };
  isAndHandler = (val, index, op) => {
    let pageRules = this.state.pageRules;
    pageRules[index]["isAndOr"] = op;
    this.setState({
      pageRules: pageRules,
    });
  };
  removeEmailCond = (index) => {
    let pageRules = this.state.pageRules;
    if (pageRules.length - 1 === index) {
      if (index !== 0) {
        pageRules[index - 1].isShowAndOr = false;
        pageRules[index - 1].isAndOr = "";
      }
    }
    pageRules.splice(index, 1);
    this.setState({
      pageRules: pageRules,
    });
  };
  setredirectToAnotherUrl = () => {
    this.setState({ redirectToAnotherUrl: !this.state.redirectToAnotherUrl });
  };
  copyPage = (data) => {
    this.setState({
      pageName: data.PageName + " (Copy)",
      pageRules: data.PageRules,
      PageHasCondition: data.PageHasCondition,
      pageRedirectUrl: data.PageRedirectUrl ? data.PageRedirectUrl : "",
      redirectTime: data.RedirectTime ? data.RedirectTime : "",
      redirectToAnotherUrl: data.RedirectToAnotherUrl,
      submissionScreenDesign: data.SubmissionScreenDesign
        ? editorStateFromRaw(JSON.parse(data.SubmissionScreenDesign))
        : this.state.editorState,
      showModal: true,
    });
  };
  render() {
    const customActions = actions.concat([
      { type: "block", label: "H1", style: Block.H1, icon: HeaderOneIcon },
      {
        type: "block",
        label: "LeftAlign",
        style: Block.LeftAlign,
        icon: LeftIndentIcon,
      },
      {
        type: "block",
        label: "CenterAlign",
        style: Block.CenterAlign,
        icon: CenterIndentIcon,
      },
      {
        type: "block",
        label: "RightAlign",
        style: Block.RightAlign,
        icon: RightIndentIcon,
      },
    ]);
    return (
      <div>
        <div className="default-margin">
          <form name="ViewForm" className="background-top-block">
            <div className="">
              <div className="defacto-form">
                <h2 className="defacto-header">Default Success Page</h2>

                <p>Configure what people see when they submit the form.</p>
                <div className="google-text">Title</div>
                <input
                  className="Field-show-input"
                  onChange={(e) => this.handleInputChange(e, "title")}
                  value={this.state.title}
                />
                <div className="area-field">
                  <div className="facebook-text">Description</div>
                </div>
                <input
                  className="Field-show-input"
                  onChange={(e) => this.handleInputChange(e, "description")}
                  value={this.state.description}
                />
                <div className="area-field">
                  <div className="google-text">
                    Include "Submit Another" button
                  </div>
                  <div className="FieldConfiguration__value">
                    <Switch
                      checked={this.state.includeSubmitAnother}
                      value="includeSubmitAnother"
                      color="primary"
                      onChange={this.onSwitchChange("includeSubmitAnother")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form name="ViewForm" className="background-page">
            <div className="Enable-redirect-page">
              <div>
                <h2 className="defacto-header">
                  Enable Redirect on Submission
                </h2>
                <span className="col-md-1 mt-lg-n2">
                  <Switch
                    checked={this.state.isRedirectEnable}
                    value="isRedirectEnable"
                    color="primary"
                    onChange={this.onSwitchChange("isRedirectEnable")}
                  />
                </span>
              </div>
              {this.state.isRedirectEnable && (
                <div>
                  <div className="redirect-text">
                    Redirect to URL
                    <div className="Field-configuration-i">
                      <svg
                        fill="currentColor"
                        preserveAspectRatio="xMidYMid meet"
                        height="1em"
                        width="1em"
                        viewBox="0 0 40 40"
                        style={{ verticalAlign: "middle" }}
                      >
                        <g>
                          <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                        </g>
                      </svg>
                      <div className="Field-Configuration-description show-field">
                        <div className="field-captcha-verification">
                          When enabled, submitters are verified as human using .
                          The Invisible reCAPTCHA means that most submitters
                          will not have to do anything extra to verify they are
                          human
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    className="Add-Mail-input mt-1"
                    onChange={(e) => this.handleInputChange(e, "redirectUrl")}
                    value={this.state.redirectUrl}
                  />
                </div>
              )}
            </div>
          </form>
          <form name="ViewForm" className="background-page">
            <div>
              <div className="defacto-form">
                <div>
                  <h2 className="defacto-header">
                    {"Dynamic Success Pages & Redirects"}
                  </h2>
                  <span className="col-md-1 mt-lg-n2">
                    <Switch
                      checked={this.state.successPageNRedirects}
                      value="successPageNRedirects"
                      color="primary"
                      onChange={this.onSwitchChange("successPageNRedirects")}
                    />
                  </span>
                </div>
                {this.state.successPageNRedirects && (
                  <div>
                    <div className="dynamic-text">
                      Create and display success pages using logic. Personalize
                      with answer piping, redirects, links, and media. Dynamic
                      success pages can have their own redirects.
                    </div>
                    <div className="Mail-Table" style={{ overflow: "visible" }}>
                      <table className="MailTable">
                        <thead>
                          <tr>
                            <th>Page Name</th>
                            <th>Page Rule</th>
                            <th>Order</th>
                            <th style={{ width: "100px" }}>Edit</th>
                            <th style={{ width: "100px" }}>Copy</th>
                            <th style={{ width: "100px" }}>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.submitPageArray.map((value, key) => (
                            <tr key={key}>
                              <td>{value.PageName}</td>
                              <td>
                                {value.PageHasCondition &&
                                value.PageRulesCount > 0
                                  ? value.PageRulesCount
                                  : "always"}
                              </td>
                              <td>
                                <div className="social-icons-arrow">
                                  <span
                                    onClick={() => this.moveRule("up", key)}
                                  >
                                    {" "}
                                    <i
                                      className="fa fa-chevron-up social-up-icon"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </div>
                                <div className="icons-arrow-social">
                                  <span
                                    onClick={() => this.moveRule("down", key)}
                                  >
                                    <i
                                      className="fa fa-chevron-down social-down-icon"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </div>
                              </td>

                              <td className="mail-delete-button">
                                <div
                                  className="btn-add-mail"
                                  tabIndex="-1"
                                  onClick={() => this.editPage(value.PageID)}
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
                                  onClick={() => this.copyPage(value)}
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
                                    this.deletePage(key, value.PageID)
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
                      <div className="Add-coupan-button">
                        <button
                          type="button"
                          className="btn btn-Add btn-lg btn-block"
                          onClick={() => this.addPage()}
                        >
                          Add Page+
                        </button>
                        <ReactModal
                          isOpen={this.state.showModal}
                          contentLabel="onRequestClose"
                          onRequestClose={this.handleCloseModal}
                          className="Success-Page-Modal"
                        >
                          <div className="header-config">
                            <h2>{this.state.pageName}</h2>
                            <button onClick={this.handleCloseModal}>
                              Back to editor
                            </button>
                          </div>
                          <div>
                            <div className="col-md-12 mt-3">
                              <label>Page Name</label>
                            </div>
                            <div className="col-md-12">
                              <input
                                className="Field-show-input"
                                value={this.state.pageName}
                                onChange={(e) =>
                                  this.handleInputChange(e, "pageName")
                                }
                                // onChange={e =>
                                //   this.pageFieldChange(e,(successPageNRedirectsLen -1), "pageName")
                                // }
                              />
                            </div>
                          </div>
                          <div className="col-md-12 mt-3">
                            <label>
                              Page has conditions when it should be used:{" "}
                              {this.state.PageHasCondition ? "On" : "Off"}
                            </label>
                          </div>
                          <div className="col-md-12">
                            <span className="info-decr">
                              <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                              />{" "}
                              Question is always visible
                            </span>
                          </div>
                          <div className="col-md-12">
                            <Switch
                              checked={this.state.pageHasCondition}
                              onChange={this.onSwitchChange("pageHasCondition")}
                              value="pageHasCondition"
                              color="primary"
                            />
                          </div>
                          {this.state.pageHasCondition === true && (
                            <div className="configure-email Toggle-View-Bar margin_bottom">
                              {this.state.pageRules.length > 0 &&
                                this.state.pageRules.map((val, index) => (
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
                                                    data.control ===
                                                    "simpletext"
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
                                                    data.control ===
                                                    "simpletext"
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
                                              <option value="isnot">
                                                isn't
                                              </option>
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
                                                this.state.pageRules[index]
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
                                              this.isAndHandler(
                                                val,
                                                index,
                                                "and"
                                              )
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
                                              this.isAndHandler(
                                                val,
                                                index,
                                                "or"
                                              )
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
                              {this.state.pageRules.length > 0 ? (
                                <div
                                  className="text-center"
                                  onClick={() => this.addPageCondition()}
                                >
                                  <div className="BtnV2 BtnV2--primary">
                                    <span>Add another condition</span>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="text-center"
                                  onClick={() => this.addPageCondition()}
                                >
                                  <div className="BtnV2 BtnV2--primary">
                                    <span>Add condition</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <div className="col-md-12 mt-3">
                              <label>Redirect to another URL</label>
                            </div>
                            <div className="col-md-12">
                              <button
                                className={"left-button"}
                                onClick={this.setredirectToAnotherUrl}
                              >
                                {this.state.redirectToAnotherUrl
                                  ? "Enable"
                                  : "Disable"}
                              </button>
                            </div>
                          </div>
                          {!this.state.redirectToAnotherUrl && (
                            <div>
                              <div>
                                <div className="col-md-12 marginTop45">
                                  <label>Redirect URL</label>
                                </div>
                                <div className="col-md-12">
                                  <input
                                    className="Add-Mail-input mt-1"
                                    value={this.state.pageRedirectUrl}
                                    onChange={(e) =>
                                      this.handleInputChange(
                                        e,
                                        "pageRedirectUrl"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="col-md-12 mt-3">
                                  <label>
                                    Redirect after this many seconds
                                  </label>
                                </div>
                                <div className="col-md-12">
                                  <input
                                    className="Add-Mail-input mt-1"
                                    value={this.state.redirectTime}
                                    onChange={(e) =>
                                      this.handleInputChange(e, "redirectTime")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="col-md-12 marginTop45">
                              <label>Submission Screen Design</label>
                            </div>
                            <div className="col-md-12">
                              <MegadraftEditor
                                editorState={this.state.editorState}
                                actions={customActions}
                                onChange={this.onChange}
                                blockStyleFn={myBlockStyleFn}
                                plugins={[image, video]}
                              />
                            </div>
                          </div>
                        </ReactModal>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
