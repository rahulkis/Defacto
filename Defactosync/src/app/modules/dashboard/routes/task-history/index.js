import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import asyncComponent from "../../../../../util/asyncComponent";

const TaskHistory = ({ match }) => (
  <div className="app-wrapper my-apps-module">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}usage`} />
      <Route
        path={`${match.url}/usage`}
        component={asyncComponent(() => import("./pages/usage"))}
      />
      <Route
        path={`${match.url}/:echoId`}
        component={asyncComponent(() => import("./pages/echo-run"))}
      />
      
      <Route
        component={asyncComponent(() =>
          import("app/modules/extraPages/routes/404")
        )}
      />
    </Switch>
  </div>
);

export default TaskHistory;
