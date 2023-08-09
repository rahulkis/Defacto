import React from "react";

import { GetData, PostData } from "../../stores/requests";
import {
  AFTER_SUBMISSION_DATA,
  SUCCESS_N_REDIRECTS_PAGE_URLS,
  TEMPLATE_URLS,
} from "../../util/constants";
import "../../assets/custom/FormBuilder.css";
import "../../assets/custom/template.css";
import Slider from "react-slick";
import "draft-js-focus-plugin/lib/plugin.css";
import "../../assets/custom/question_control.css";
import "../../assets/custom/sidebar.css";

const ImageUrl = "/templateImage/";
class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formJSON: [],
      splitView: false,
      random: 0,
      templateData: [],
      searchText: "",
      categories: [],
      selectedCategory: "",
      redirect: false,
    };
  }

  async componentWillMount() {
    this.setState({
      templateData: this.props.templateData,
    });
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

    localStorage.removeItem("formJSON");
    localStorage.removeItem("CurrentFormId");
    localStorage.removeItem("previousClicked");
    localStorage.setItem("CurrentFormId", formId);
    let accountExpired = localStorage.getItem("accountStatus");
    if (templateId > 0) localStorage.setItem("templateId", templateId);
    this.defaultPage(formId);
    if (this.props.expiredAccount || accountExpired === "true") {
      this.props.history.push("/preview/accountExpired");
    } else {
      window.open("../user/CreateForm", "_blank");
    }
  };
  templatePreview = (tempId) => {
    if (tempId != null) {
      this.setState({ splitView: true });
      GetData(TEMPLATE_URLS.GET_TEMPLATE_BY_TEMPID + tempId).then((result) => {
        if (result != null) {
          localStorage.setItem("formJSON", result.Item.Content);
          this.setState({
            formJSON: JSON.parse(result.Item.Content),
            splitView: true,
            random: this.state.random + 1,
          });
        } else {
          this.setState({ isLoader: false });
        }
      });
    }
  };

  search = (event) => {
    this.setState({ searchText: event.target.value });
    let found = this.props.templateData.filter(
      (element) =>
        element.TemplateName.toLowerCase().indexOf(event.target.value) > -1 &&
        (this.state.selectedCategory === "" ||
          element.CategoryId === this.state.selectedCategory)
    );
    this.setState({ templateData: found, searchText: event.target.value });
  };

  onCategoryChange = (event) => {
    let found = this.props.templateData.filter(
      (element) =>
        element.TemplateName.toLowerCase().indexOf(this.state.searchText) >
          -1 &&
        (event.target.value === "" || element.CategoryId === event.target.value)
    );
    this.setState({
      templateData: found,
      selectedCategory: event.target.value,
    });
  };
  viewTemplate = (event, tempId) => {
    event.preventDefault();
    localStorage.setItem("templateId", tempId);
    if (this.props.expiredAccount) {
      this.props.history.push("/preview/accountExpired");
    } else {
      window.open("../Template/TemplateList", "_blank");
    }
  };
  viewTemplateList = (event) => {
    event.preventDefault();
    localStorage.removeItem("templateId");
    if (this.props.expiredAccount) {
      this.props.history.push("/preview/accountExpired");
    } else {
      window.open("../Template/TemplateList", "_blank");
    }
  };
  backToDashboard = () => {
    localStorage.removeItem("CurrentFormId");
    localStorage.removeItem("templateId");
    window.open("../Dashboard", "_self");
  };
  componentDidMount() {
    GetData(TEMPLATE_URLS.GET_TEMPLATE_CATEGORY).then((result) => {
      if (result != null) {
        let categoriesFromApi = result.Items.map((team) => {
          return { value: team.CatId, display: team.CategoryName };
        });
        this.setState({
          categories: [{ value: "", display: "Select Category" }].concat(
            categoriesFromApi
          ),
        });
      }
    });
  }
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
  render() {
    let settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    if (this.props.templateData.length === 0) {
      return <div />;
    }
    if (!this.props.templateSlider) {
      return (
        <div className="CreateForm">
          <div className="CreateForm__templatelist">
            <div
              className="dashboard_button"
              tabIndex="-1"
              style={{ position: "absolute", right: 54, top: 54, zIndex: 10 }}
            >
              <button onClick={this.backToDashboard}>Back to Dashboard</button>
            </div>
            <span>
              <input
                ref={this.divRef}
                className="Search__input"
                placeholder="Search..."
                style={{ width: 170 }}
                value={this.state.searchText}
                onChange={(e) => this.search(e)}
              />
              <select
                value={this.state.selectedCategory}
                onChange={(e) => this.onCategoryChange(e)}
              >
                {this.state.categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.display}
                  </option>
                ))}
              </select>
            </span>

            <div className="CreateForm__templatelist--list">
              {this.state.templateData.map((form, key) => (
                <div
                  key={form.TemplateId}
                  className="CreateForm__template "
                  onClick={(id) => this.templatePreview(form.TemplateId)}
                  style={{
                    backgroundImage: `linear-gradient(134deg, rgb(161, 130, 255) 0%, rgb(2, 86, 94) 100%)`,
                  }}
                >
                  <div className="CreateForm__titlebox">
                    <div className="CreateForm__templatetitle">
                      {form.TemplateName}
                    </div>
                  </div>
                  <div className="CreateForm__actions">
                    <div
                      className="BtnV2 BtnV2--raised BtnV2--sm BtnV2--secondary BtnV2--solid"
                      tabIndex="-1"
                    >
                      <a
                        href="#pablo"
                        onClick={(event) =>
                          this.saveDefaultPage(event, form.TemplateId)
                        }
                        className=""
                        tabIndex="-1"
                      >
                        <span>Use</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="CreateForm__templatepreview">
            {!this.state.splitView && (
              <h2 className="PaperType--h2">Choose a template to preview</h2>
            )}
            {this.state.splitView && (
              <iframe
                title="myFrame"
                key={this.state.random}
                className="template-preview"
                width="100%"
                height="100%"
                src="/preview/PreviewForm/temp"
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <>
        {
          <div className="Dashboard__templatelistcontainerinner">
            <Slider {...settings}>
              <div>
                <div className="Dashboard__template Dashboard__template--blank">
                  <a
                    href="#pablo"
                    target="_self"
                    className="BtnV2 BtnV2--secondary"
                    tabIndex="-1"
                    onClick={(event) => this.saveDefaultPage(event, 0)}
                  >
                    <span>Create Blank Form</span>
                  </a>
                </div>
              </div>
              {this.props.templateData.map((form, key) => (
                <div key={form.TemplateId}>
                  <div
                    className="Dashboard__template"
                    style={{
                      backgroundImage: `url(${ImageUrl + form.TemplateImage})`,
                    }}
                  >
                    <a
                      href="#pablo"
                      target="_self"
                      onClick={(e) => this.viewTemplate(e, form.TemplateId)}
                      className="BtnV2 BtnV2--secondary show-hide"
                      tabIndex="-1"
                    >
                      <span>View</span>
                    </a>
                    <a
                      href="#pablo"
                      onClick={(event) =>
                        this.saveDefaultPage(event, form.TemplateId)
                      }
                      className="BtnV2 BtnV2--secondary BtnV2--solid show-hide"
                      tabIndex="-1"
                    >
                      <span>Use Template</span>
                    </a>
                  </div>
                </div>
              ))}
              <div>
                <div className="Dashboard__template Dashboard__template--blank">
                  <a
                    onClick={(e) => this.viewTemplateList(e)}
                    target="_self"
                    className="BtnV2 BtnV2--secondary"
                    tabIndex="-1"
                    href="#pablo"
                  >
                    <span>View More..</span>
                  </a>
                </div>
              </div>
            </Slider>
          </div>
        }
      </>
    );
  }
}
Template.defaultProps = {
  templateData: [],
  templateSlider: true,
};
export default Template;
