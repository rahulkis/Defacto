import React from "react";

import { GetData, PostData } from "../../stores/requests";
import {
  AFTER_SUBMISSION_DATA,
  SUCCESS_N_REDIRECTS_PAGE_URLS,
  TEMPLATE_URLS,
} from "../../util/constants";

import Loader from "../../components/Common/Loader";
class TemplateView extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {
      formJSON: [],
      random: 0,
      templateName: "",
      templateId: null,
      isLoader: true,
    };
  }

  async componentWillMount() {
    if (localStorage.templateId) {
      GetData(
        TEMPLATE_URLS.GET_TEMPLATE_BY_TEMPID + localStorage.templateId
      ).then((result) => {
        if (result != null) {
          localStorage.setItem("formJSON", result.Item.Content);
          this.setState({
            formJSON: JSON.parse(result.Item.Content),
            random: this.state.random + 1,
            templateName: result.Item.TemplateName,
            templateId: localStorage.templateId,
            isLoader: false,
            ScrollingHeight: "200px",
          });
        } else {
          this.setState({ isLoader: false });
        }
      });
    } else {
      this.setState({ isLoader: false });
    }
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

  saveDefaultPage = (e, templateId) => {
    e.preventDefault();
    let formId = this.makeid(6);
    localStorage.setItem("CurrentFormId", formId);
    if (templateId > 0) localStorage.setItem("templateId", templateId);
    this.defaultPage(formId);
    window.open("../user/CreateForm", "_blank");
  };
  defaultPage = (formId) => {
    let pageID = new Date().valueOf();
    let defaultPage = {
      PageID: pageID.toString(),
      FormId: formId,
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

  componentDidMount() {
    if (this.iframeRef.current != null)
      this.iframeRef.current.addEventListener("load", this.setIframeHeight);
  }
  componentDidUpdate() {
    if (this.iframeRef.current != null)
      this.iframeRef.current.addEventListener("load", this.setIframeHeight);
  }

  setIframeHeight = () => {
    this.setState({
      scrollinHeight:
        this.iframeRef.current.contentWindow.document.body.scrollHeight + "px",
    });
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      // <div className="content">

      <div style={{ width: "100%", marginTop: ".5rem" }}>
        <h1>Templates-{this.state.templateName}</h1>
        <div style={{ marginTop: "1rem" }}>
          <a
            href="#pablo"
            onClick={(event) =>
              this.saveDefaultPage(event, this.state.templateId)
            }
            className="BtnV2 BtnV2--secondary"
            tabIndex="-1"
          >
            <span>Use Template</span>
          </a>
        </div>

        <div className="template-module--embed">
          <iframe
            title="myFrame"
            ref={this.iframeRef}
            id="iframePreview"
            key={this.random}
            className="template-view-min-height"
            width="100%"
            height={this.state.scrollinHeight}
            scrolling="no"
            src="/preview/PreviewForm"
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <a
            href="#pablo"
            onClick={(event) =>
              this.saveDefaultPage(event, this.state.templateId)
            }
            className="BtnV2 BtnV2--secondary"
            tabIndex="-1"
          >
            <span>Use Template</span>
          </a>
        </div>
      </div>
    );
  }
}
export default TemplateView;
