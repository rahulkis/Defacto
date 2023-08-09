import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isIOS, isMobile } from 'react-device-detect';

import asyncComponent from '../../../util/asyncComponent';
import { COLLAPSED_DRAWER, FIXED_DRAWER } from 'constants/ActionTypes';
import { fetchAllApps } from 'actions/index';


class Editor extends React.Component {

  componentWillMount() {
    this.props.fetchAllApps()
  }

  render() {
    const { match, drawerType } = this.props;
    const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'fixed-drawer' : drawerType.includes(COLLAPSED_DRAWER) ? 'collapsible-drawer' : 'mini-drawer';

    //set default height and overflow for iOS mobile Safari 10+ support.
    if (isIOS && isMobile) {
      document.body.classList.add('ios-mobile-view-height');
    } else if (document.body.classList.contains('ios-mobile-view-height')) {
      document.body.classList.remove('ios-mobile-view-height');
    }

    return (
      <div className={`app-container ${drawerStyle}`}>
        <div className="app-main-container">
          <main className="app-main-content-wrapper">
            <div className="app-main-content">
              <div className="app-wrapper echo-editor">
                <Switch>              
                  <Redirect exact from={`${match.url}`} to={`${match.url}/setup`} />
                  <Route path={`${match.url}/setup/:echoId`} component={asyncComponent(() => import('./routes/setup'))} />                 
                  <Route path={`${match.url}/new-echo`} component={asyncComponent(() => import('./routes/new-echo'))} />                 
                  <Route component={asyncComponent(() => import('app/modules/extraPages/routes/404'))} />
                </Switch>
              </div>
            </div>
            {/* <Footer /> */}
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, apps }) => {
  const { drawerType, navigationStyle, horizontalNavPosition } = settings;
  return { drawerType, navigationStyle, horizontalNavPosition };
};
export default withRouter(connect(mapStateToProps, {
  fetchAllApps
})(Editor));
