import React from "react";
import TemplateCategory from "../templateCategories/TemplateCategory";
import TemplateImageListView from "../templates/TemplateImageListView";
import TemplateView from "../templates/TemplateView";
import { GetData } from "../../stores/requests";
import { TEMPLATE_URLS } from "../../util/constants";
import "../../assets/custom/FormBuilder.css";
import "../../assets/custom/template.css";
import "draft-js-focus-plugin/lib/plugin.css";
import "../../assets/custom/question_control.css";
import "../../assets/custom/sidebar.css";

class TemplateList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      templateList: [],
      tempTemplateList: [],
      categoryList: [],
      isLoader: false,
      showAllTemplate: false,
      catName: "ALL Templates",
      searchText: "",
      catId: 0,
      showTempBySearch: false,
      templateCount: 0,
    };
    GetData(TEMPLATE_URLS.GET_TEMPLATES).then((result) => {
      if (result != null) {
        this.setState({
          templateList: result.Items,
          tempTemplateList: result.Items,
          isLoader: false,
        });
      } else {
        this.setState({ isLoader: false });
      }
    });
  }
  showTemplatesByCategory = (Id, catName) => {
    localStorage.removeItem("templateId");
    this.setState({
      catId: Id,
      showAllTemplate: true,
      catName: catName,
      showTempBySearch: false,
      searchText: "",
    });
  };

  showTemplatesByCat = (e, Id, catName) => {
    e.preventDefault();
    localStorage.removeItem("templateId");
    this.setState({
      catId: Id,
      showAllTemplate: true,
      catName: catName,
      showTempBySearch: false,
      searchText: "",
    });
  };

  showTemplateView = (Id) => {
    localStorage.setItem("templateId", Id);
    this.setState({
      showAllTemplate: true,
      showTempBySearch: false,
      searchText: "",
    });
  };
  showTemplatesbyName = (templateName) => {
    localStorage.removeItem("templateId");
    let temp = this.state.templateList.filter(
      (i) =>
        templateName === "" ||
        i.TemplateName.toLowerCase().indexOf(templateName) > -1
    );

    this.setState({
      catId: 0,
      showTempBySearch: true,
      searchText: templateName,
      showAllTemplate: true,
      templateCount: temp.length,
    });
  };

  componentWillMount() {
    GetData(TEMPLATE_URLS.GET_TEMPLATE_CATEGORY).then((result) => {
      if (result != null) {
        this.setState({
          categoryList: result.Items,
        });
      }
    });
  }
  componentDidUpdate() {}
  getAllTemplates = (e) => {
    e.preventDefault();
    localStorage.removeItem("templateId");
    this.setState({ showAllTemplate: true, showTempBySearch: false });
  };

  render() {
    return (
      <div className="content">
        <div>
          {((!this.state.showAllTemplate && !localStorage.templateId) ||
            this.state.showTempBySearch) && (
            <div className="templates-module--hero">
              <h1>Form Templates For Every Need</h1>
              <h3>
                A collection of beautiful online form templates, ready to be
                made your own with Defactoform.
              </h3>
            </div>
          )}

          {this.state.showAllTemplate &&
            !this.state.showTempBySearch &&
            !localStorage.templateId && (
              <div className="templates-module--hero">
                <h1>Templates — {this.state.catName}</h1>
                <h3>Every single form template in one place.</h3>
              </div>
            )}

          <div className="max-width templates-module--pageWrapper">
            <TemplateCategory
              categoryList={this.state.categoryList}
              showTempBySearch={this.state.showTempBySearch}
              showTemplatesByCategory={this.showTemplatesByCategory}
              showTemplatesbyName={this.showTemplatesbyName}
            />
            {!localStorage.templateId && (
              <div className="templates-module--templates">
                {!this.state.showAllTemplate && (
                  <span>
                    <h2 class="templates-module--templateGroupFeaturedTitle">
                      Featured Templates{" "}
                      <a
                        href="/category/all"
                        onClick={(e) => this.getAllTemplates(e)}
                      >
                        View more...
                      </a>
                    </h2>

                    <div className="templates-module--templateGridFeatured">
                      <div class="templates-module--templateGridFeaturedInner">
                        {this.state.templateList
                          .filter((data) => data.Featured === true)
                          .map((temp, key) => (
                            <a
                              href="#pablo"
                              className="templates-module--featuredTemplate"
                              onClick={(e) =>
                                this.showTemplateView(temp.TemplateId)
                              }
                            >
                              <div>{temp.TemplateName}</div>
                            </a>
                          ))}
                        ;
                      </div>
                    </div>
                  </span>
                )}
                {!this.state.showAllTemplate && (
                  <div>
                    {this.state.categoryList.map((cat1, key) => (
                      <div>
                        <h3 className="templates-module--templateGroupTitle">
                          {cat1.CategoryName}{" "}
                          <a
                            href="/category/all"
                            onClick={(e) =>
                              this.showTemplatesByCat(
                                e,
                                cat1.CatId,
                                cat1.CategoryName
                              )
                            }
                          >
                            View more...
                          </a>
                        </h3>

                        <div className="templates-module--templateGrid">
                          {this.state.templateList
                            .filter((data) => data.CategoryId === cat1.CatId)
                            .map(
                              (temp, key) =>
                                key < 3 && (
                                  <TemplateImageListView
                                    templateData={temp}
                                    showTemplateView={this.showTemplateView}
                                  />
                                )
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {this.state.showAllTemplate && (
                  <div>
                    {this.state.showTempBySearch && (
                      <h2 className="templates-module--templateGroupFeaturedTitle--1f_vh">
                        {this.state.templateCount} Templates Found
                        <a
                          aria-current="page"
                          className=""
                          onClick={(e) => this.getAllTemplates(e)}
                          href="/templates"
                          style={{
                            fontSize: "1.5rem",
                            position: "relative",
                            top: "0.25rem",
                          }}
                        >
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </a>
                      </h2>
                    )}
                    <div className="templates-module--templateGrid">
                      {this.state.templateList
                        .filter(
                          (item) =>
                            (this.state.catId === 0 ||
                              item.CategoryId === this.state.catId) &&
                            (!this.state.showTempBySearch ||
                              (this.state.searchText.trim() === "" ||
                              item.TemplateName.toLowerCase().indexOf(
                                  this.state.searchText
                                ) > -1))
                        )
                        .map((temp, key) => (
                          <TemplateImageListView
                            templateData={temp}
                            showTemplateView={this.showTemplateView}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {localStorage.templateId && <TemplateView />}
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateList;
