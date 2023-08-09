import React from "react";
import Footer from "components/Footer/Footer.jsx";

import { Route, Switch } from "react-router-dom";
import InterComIcon from "../../components/Common/InterComIcon";
import routes from "routes.js";
import "../../assets/custom/FormHelp.css";
// reactstrap components

class ArticleLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColor: "blue",
      sidebarMini: true,
      opacity: 0,
      sidebarOpened: false,
      splitPreviewMode: false,
      color: "navbar-transparent",
    };
  }
  backToDashboard = () => {
    window.open("../Dashboard", "_blank");
  };
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/articles") {
        if (prop.path === "/HowToUseWebHooks") {
          return (
            <Route
              path={prop.layout + prop.path}
              component={prop.component}
              key={key}
            />
          );
        }
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <div className="wrapper">
        <InterComIcon/>
        <div className="">
          <div className="header">
            <div className="container header__container o__ltr" dir="ltr">
              <div className="help-content">
                <div className="row mo o__centered o__reversed header__meta_wrapper">
                  <div className="col-md-10 mo__body header__site_name">
                    <div className="header__logo">
                      <a href="#pablo">
                        <h3>Defactoform</h3>
                      </a>
                    </div>
                  </div>
                  <div className="mo__aside">
                    <div className="header__links">
                      <a
                        href="#pablo"
                        target="_blank"
                        rel="noopener"
                        onClick={(e) => this.backToDashboard()}
                        className="header__home__url"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Group 65</title>
                          <g
                            stroke="#FFF"
                            fill="none"
                            fill-rule="evenodd"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M11.5 6.73v6.77H.5v-11h7.615M4.5 9.5l7-7M13.5 5.5v-5h-5" />
                          </g>
                        </svg>
                        <span>Go to Defactoform</span>
                      </a>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search for articles..."
                  className="FieldConfiguration-input webhook-text-search"
                />
                <i className="fa fa-search search-icon-align" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="help-content educate_content"
          ref="mainPanel"
          data={this.state.activeColor}
        >
          <Switch>{this.getRoutes(routes)}</Switch>
          {// we don't want the Footer to be rendered on full screen maps page
          this.props.location.pathname.indexOf("full-screen-map") !==
          -1 ? null : (
            <Footer fluid />
          )}
        </div>
      </div>
    );
  }
}
export default ArticleLayout;
