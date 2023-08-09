import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import asyncComponent from "../../../../../util/asyncComponent";

const Echos = ({ match }) => (
  <div className="app-wrapper my-apps-module">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}list`} />
      <Route
        path={`${match.url}/list`}
        component={asyncComponent(() => import("./pages/list"))}
      />   
       <Route
        path={`${match.url}/:echoId`}
        component={asyncComponent(() => import("./pages/detail"))}
      />   
      <Route
        component={asyncComponent(() =>
          import("app/modules/extraPages/routes/404")
        )}
      />
    </Switch>
  </div>
);

export default Echos;
