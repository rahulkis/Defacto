import React from "react";
import { Route, Switch } from "react-router-dom";

import routes from "routes.js";

import { GetData } from "../../stores/requests";


import InterComIcon from "../../components/Common/InterComIcon";

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColor: "blue",
      sidebarMini: true,
      opacity: 0,
      sidebarOpened: false,
      splitPreviewMode: false,
    };
    //this.togglePreviewMode = this.togglePreviewMode.bind(this);
  }

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/Submission") {
        if (prop.path === "/Submisssion") {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => (
                <prop.component
                  {...props}
                  splitPreviewMode={this.state.splitPreviewMode}
                />
              )}
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

  editForm = (e, formid) => {
    sessionStorage.removeItem("Submission");
    e.preventDefault();
    if (formid != null) {
      localStorage.setItem("EditForm", true);
      localStorage.setItem("FormId", formid);
      localStorage.setItem("CurrentFormId", formid);

      GetData(
        "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/form/" +
          formid
      ).then((result) => {
        if (result != null) {
          localStorage.setItem("EditorState", result.Item.EditorState);
          localStorage.setItem(
            "EditFormData",
            JSON.stringify(result.Item.Content)
          );
          localStorage.setItem("FormData", JSON.stringify(result.Item));
          localStorage.setItem("formName", result.Item.FormName);
          window.open("../user/EditForm", "_blank");
        }
      });
    }
  };
  partialSubmission = (e, partialSubmission) => {
    sessionStorage.removeItem("Submission");
    sessionStorage.removeItem("AddClass");
    if (!partialSubmission) {
      sessionStorage.setItem("AddClass", true);
      sessionStorage.setItem("Submission", true);
    } else {
      sessionStorage.setItem("AddClass", false);
      sessionStorage.setItem("Submission", false);
    }
  };

  render() {
    return (
      <div className="SubmissionsV2 page-with-sidebar ">
        <InterComIcon/>
        <span>
          <div className="Sidebar" style={{ top: 0 }}>
            <div className="Sidebar__header">
              <img
                alt="..."
                src="/images/logo-v2/Logo--gradient-horizontal.png"
              />
            </div>
            <div className="Sidebar__headercontent">
              <div style={{ display: "flex", marginTop: "0.5rem" }}>
                <a
                  target="_self"
                  href="/dashboard"
                  className="BtnV2 BtnV2--primary"
                  tabindex="-1"
                >
                  <span>Go to dashboard</span>
                </a>
                <a
                  target="_self"
                  href="#pablo"
                  onClick={(e) =>
                    this.editForm(e, sessionStorage.getItem("Submissionformid"))
                  }
                  className="BtnV2 BtnV2--secondary"
                  tabindex="-1"
                  style={{ marginLeft: "2%" }}
                >
                  <span>Editor</span>
                </a>
              </div>
            </div>
            <div className="Sidebar__links">
              <a
                className={
                  "Sidebar__link " +
                  (sessionStorage.getItem("AddClass") === "true"
                    ? "Sidebar__link--active"
                    : sessionStorage.getItem("AddClass") === null
                    ? "Sidebar__link--active"
                    : "")
                }
                href="/Submission/Submission"
                onClick={(e) => this.partialSubmission(e, false)}
              >
                Submissions
              </a>

              <a
                className={
                  "Sidebar__link " +
                  (sessionStorage.getItem("AddClass") === "false"
                    ? "Sidebar__link--active"
                    : "")
                }
                href="/Submission/Submission"
                onClick={(e) => this.partialSubmission(e, true)}
              >
                Partial Submissions
              </a>
            </div>
            <div className="Sidebar__sidecontent" />
            <div className="Sidebar__footer" />
          </div>
        </span>
        <Switch>{this.getRoutes(routes)}</Switch>
      </div>
    );
  }
}

export default Submission;
