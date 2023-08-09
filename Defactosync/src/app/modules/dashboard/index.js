import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import {connect} from 'react-redux';
import Header from 'components/Header/index';
import Sidebar from 'containers/SideNav/index';
import Footer from 'components/Footer';
import {
  ABOVE_THE_HEADER,
  BELOW_THE_HEADER,
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION,
} from 'constants/ActionTypes';
// import ColorOption from 'containers/Customizer/ColorOption';
import {isIOS, isMobile} from 'react-device-detect';
import asyncComponent from '../../../util/asyncComponent';
import TopNav from 'components/TopNav';


class Dashboard extends React.Component {
  
  render() {
    const {
      match,
      drawerType,
      navigationStyle,
      horizontalNavPosition,
    } = this.props;
    const drawerStyle = drawerType.includes(FIXED_DRAWER)
      ? "fixed-drawer"
      : drawerType.includes(COLLAPSED_DRAWER)
      ? "collapsible-drawer"
      : "mini-drawer";

    //set default height and overflow for iOS mobile Safari 10+ support.
    if (isIOS && isMobile) {
      document.body.classList.add("ios-mobile-view-height");
    } else if (document.body.classList.contains("ios-mobile-view-height")) {
      document.body.classList.remove("ios-mobile-view-height");
    }

    return (
      <div className={`app-container ${drawerStyle}`}>
        {/* <Tour/> */}

        <Sidebar />
        <div className="app-main-container">
          <div
            className={`app-header ${
              navigationStyle === HORIZONTAL_NAVIGATION
                ? "app-header-horizontal"
                : ""
            }`}
          >
            {navigationStyle === HORIZONTAL_NAVIGATION &&
              horizontalNavPosition === ABOVE_THE_HEADER && (
                <TopNav styleName="app-top-header" />
              )}
            <Header />
            {navigationStyle === HORIZONTAL_NAVIGATION &&
              horizontalNavPosition === BELOW_THE_HEADER && <TopNav />}
          </div>

          <main className="app-main-content-wrapper">
            <div className="app-main-content">
              <div className="app-wrapper">
                <Switch>
                  {/* <Redirect exact from={`${match.url}`} to={`${match.url}/dashboard`}/> */}
                  <Route
                    path={`${match.url}/dashboard`}
                    component={asyncComponent(() => import("./routes/main"))}
                  />
                  <Route
                    path={`${match.url}/echos`}
                    component={asyncComponent(() => import("./routes/echos"))}
                  />
                  <Route
                    path={`${match.url}/connections`}
                    component={asyncComponent(() => import("./routes/my-apps"))}
                  />
                  <Route
                    path={`${match.url}/history`}
                    component={asyncComponent(() => import("./routes/task-history"))}
                  />

                  <Route
                    path={`${match.url}/profile`}
                    component={asyncComponent(() => import("./routes/profile/index"))}
                  />
                   <Route
                    path={`${match.url}/profile-changepassword`}
                    component={asyncComponent(() => import("./routes/profile/changePassword"))}
                  />
                  <Route
                    component={asyncComponent(() =>
                      import("app/modules/extraPages/routes/404")
                    )}
                  />
                </Switch>
              </div>
            </div>
            <Footer />
          </main>
        </div>
        {/* <ColorOption/> */}
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { drawerType, navigationStyle, horizontalNavPosition } = settings;
  return { drawerType, navigationStyle, horizontalNavPosition };
};
export default withRouter(connect(mapStateToProps)(Dashboard));
