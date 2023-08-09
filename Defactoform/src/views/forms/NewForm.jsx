import React from "react";
import { savePageType, saveEditorData } from "../../actions";
import { store } from "../../index";
import { PostData, GetData } from "../../stores/requests";
import {
  TEMPLATE_URLS,
  AFTER_SUBMISSION_DATA,
  SUCCESS_N_REDIRECTS_PAGE_URLS,
} from "../../util/constants";
import "../../assets/custom/newForm.css";
import Template from "../templates/Template";
import ReactModal from "react-modal";

class NewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", showModal: false, templateData: [] };
    this.btnScratchClick = this.btnScratchClick.bind(this);
    localStorage.removeItem("FormId");
    localStorage.removeItem("formJSON");
    localStorage.removeItem("CurrentFormId");
    localStorage.removeItem("previousClicked");
    store.dispatch(savePageType("add"));
    store.dispatch(saveEditorData(""));
  }
  handleCloseModal = () => {
    this.setState({ showModal: false });
  };
  componentWillMount() {
    store.dispatch(savePageType("add"));
    localStorage.setItem("formPageType", "add");
  }
  makeid(length) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  btnScratchClick = () => {
    this.FormId = this.makeid(6);
    localStorage.setItem("CurrentFormId", this.FormId);
    localStorage.setItem("FormId", this.FormId);
    let expiredAccoutDetail = localStorage.getItem("accountStatus");
    if (expiredAccoutDetail != null) {
      if (expiredAccoutDetail === "true") {
        this.props.history.push("/preview/accountExpired");
      } else {
        this.props.history.push({
          pathname: "CreateForm",
        });
      }
    } else {
      this.props.history.push({
        pathname: "CreateForm",
      });
    }
    this.saveDefaultPage(this.FormId);
  };

  btnUseTemplateClick = () => {
    GetData(TEMPLATE_URLS.GET_TEMPLATES).then((result) => {
      if (result != null) {
        this.setState({ templateData: result.Items });
        this.setState({ showModal: true });
      }
    });
  };
  onclick = () => {
    localStorage.removeItem("CurrentFormId");
    this.props.history.push({
      pathname: "/dashboard",
    });
  };
  handleChange = (event) => {
    this.setState({ value: event.target.value });
    localStorage.setItem("formName", event.target.value);
  };

  saveDefaultPage = (FormId) => {
    let pageID = new Date().valueOf();
    let defaultPage = {
      PageID: pageID.toString(),
      FormId: FormId,
      PageTitle: AFTER_SUBMISSION_DATA.SUBMISSION_TITLE,
      Description: AFTER_SUBMISSION_DATA.SUBMISSION_DESCRIPTION,
      IncludeSubmitAnother: AFTER_SUBMISSION_DATA.INCLUDE_SUBMIT_ANOTHER,
      RedirectEnable: AFTER_SUBMISSION_DATA.REDIRECT_ENABLE,
      SuccessPageNRedirects: AFTER_SUBMISSION_DATA.SUCCESS_PAGE_N_REDIRECTS,
    };
    PostData(
      SUCCESS_N_REDIRECTS_PAGE_URLS.POST_DEFAULT_PAGE_URL,
      defaultPage
    ).then((result) => {
      localStorage.setItem("DefaultPageID", pageID);
    });
  };

  render() {
    // document.title = this.state.value;

    return (
      <div className="content">
        <div className="newform_inner">
          <div className="dashboard_button">
            <button onClick={this.onclick}>Back to Dashboard</button>
          </div>
          <div className="form_button col-md-4">
            <div className="col-md-12 form_heading">
              What is your new form called?
            </div>
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.value}
            />
            <button onClick={this.btnScratchClick}>Start from scratch</button>
            OR
            <button onClick={this.btnUseTemplateClick}>Use Template</button>
          </div>
        </div>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose"
          onRequestClose={this.handleCloseModal}
          className="Success-Page-Modal"
        >
          <Template
            templateSlider={false}
            templateData={this.state.templateData}
            {...this.props}
          />
        </ReactModal>
      </div>
    );
  }
}

export default NewForm;
