import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import combineReducers from "./Reducers/reducer";

import { Router, Route, Switch } from "react-router-dom";
import ArticleLayout from "layouts/Articles/ArticleLayout";
import AuthLayout from "layouts/Auth/Auth.jsx";
import AdminLayout from "layouts/Admin/Admin.jsx";
import RTLLayout from "layouts/RTL/RTL.jsx";
import PreviewLayout from "layouts/Preview/Preview.jsx";
import UserLayout from "layouts/User/User.jsx";
import DashboardLayout from "layouts/Dashboard/Dashboard.jsx";
import SubmissionLayout from "layouts/Submission/Submission.jsx";
import Template from "layouts/Template/Template.jsx";

import Welcome from "./views/Welcome.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "assets/css/nucleo-icons.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.0.0";
import "assets/demo/demo.css";
import "react-notification-alert/dist/animate.css";
import "../node_modules/megadraft/dist/css/megadraft.css";
import "../src/assets/custom/loader.css"

const hist = createBrowserHistory({forceRefresh:true});
export const store = createStore(combineReducers);
ReactDOM.render(
  
  <Provider store={store}>
   <Router history={hist}>
    <Switch>
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/rtl" render={props => <RTLLayout {...props} />} />
      <Route path="/preview"  name="preview"  render={props => <PreviewLayout {...props} />} />
      <Route path="/user" render={props => <UserLayout {...props} />} />
      <Route path="/EditForm"  name="EditForm"  render={props => <PreviewLayout {...props} />} />
      <Route path="/Template"  name="TemplateView"  render={props => <Template {...props} />} />
      <Route path="/Submission"  name="Submission"  render={props => <SubmissionLayout {...props} />} />
      <Route path="/SubmissionClosed"  name="SubmissionClosed"  render={props => <PreviewLayout {...props} />} />
      <Route path="/Template"  name="TemplateList"  render={props => <PreviewLayout {...props} />} />
      <Route path="/user"  name="projectDetail"render={props=>  <UserLayout {...props}/>}/>
      <Route path="/articles"  name="articles"  render={props => <ArticleLayout {...props} />} />
      <Route path="/trackForm"  name="trackForm" render={props=>  <DashboardLayout {...props}/>}/>
      <Route path="/AccountSettings"  name="AccountSettings" render={props=>  <DashboardLayout {...props}/>}/>
      <Route
        path="/dashboard"
        render={props => <DashboardLayout {...props} />}
      />
       <Route
        path="/projectDetail"
        render={props => <DashboardLayout {...props} />}
      />
      <Route path="/" render={props => <Welcome {...props} />} />
      {/* <Route name="ideas" path="/:testvalue" handler={CreateIdeaView} /> */}
      {/* <Redirect from="/" to="/auth/login" /> */}
    </Switch>
  </Router>
  </Provider>,
  document.getElementById("root")
);
