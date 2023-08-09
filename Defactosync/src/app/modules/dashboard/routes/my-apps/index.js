


import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../../../util/asyncComponent';


const MyApps = ({match}) => (
  <div className="app-wrapper my-apps-module">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}list`}/>
      <Route path={`${match.url}/list`} component={asyncComponent(() => import('./pages/apps-list'))}/>
      <Route path={`${match.url}/cli/:connectionType`} component={asyncComponent(() => import('./pages/app-details'))}/>
      <Route component={asyncComponent(() => import('app/modules/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default MyApps;