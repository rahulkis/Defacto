import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AppsIcon from "@material-ui/icons/Apps";
import OfflineBoltIcon from "@material-ui/icons/OfflineBolt";
import WatchLaterIcon from "@material-ui/icons/WatchLater";

import IntlMessages from "util/IntlMessages";
import CustomScrollbars from "util/CustomScrollbars";

class SidenavContent extends Component {
  // componentDidMount() {
  //   const { history } = this.props;
  //   const that = this;
  //   const pathname = `${history.location.pathname}`; // get current path

  //   const menuLi = document.getElementsByClassName("menu");
  //   for (let i = 0; i < menuLi.length; i++) {
  //     menuLi[i].onclick = function(event) {
  //       for (let j = 0; j < menuLi.length; j++) {
  //         const parentLi = that.closest(this, "li");
  //         if (
  //           menuLi[j] !== this &&
  //           (parentLi === null || !parentLi.classList.contains("open"))
  //         ) {
  //           menuLi[j].classList.remove("open");
  //         }
  //       }
  //       this.classList.toggle("open");
  //     };
  //   }

  //   const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
  //   try {
  //     const activeNav = this.closest(activeLi, "ul"); // select closest ul
  //     if (activeNav.classList.contains("sub-menu")) {
  //       this.closest(activeNav, "li").classList.add("open");
  //     } else {
  //       this.closest(activeLi, "li").classList.add("open");
  //     }
  //   } catch (error) {}
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { history } = nextProps;
  //   const pathname = `${history.location.pathname}`; // get current path

  //   const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
  //   try {
  //     const activeNav = this.closest(activeLi, "ul"); // select closest ul
  //     if (activeNav.classList.contains("sub-menu")) {
  //       this.closest(activeNav, "li").classList.add("open");
  //     } else {
  //       this.closest(activeLi, "li").classList.add("open");
  //     }
  //   } catch (error) {}
  // }

  // closest(el, selector) {
  //   try {
  //     let matchesFn;
  //     // find vendor prefix
  //     [
  //       "matches",
  //       "webkitMatchesSelector",
  //       "mozMatchesSelector",
  //       "msMatchesSelector",
  //       "oMatchesSelector",
  //     ].some(function(fn) {
  //       if (typeof document.body[fn] == "function") {
  //         matchesFn = fn;
  //         return true;
  //       }
  //       return false;
  //     });

  //     let parent;

  //     // traverse parents
  //     while (el) {
  //       parent = el.parentElement;
  //       if (parent && parent[matchesFn](selector)) {
  //         return parent;
  //       }
  //       el = parent;
  //     }
  //   } catch (e) {}

  //   return null;
  // }
  activeStyle = {
    background: "#1d1d1d",
    color: "white",
    padding: "18px",
  };
  render() {
    return (
      <CustomScrollbars className=" scrollbar">
        <ul className="nav-menu pt-3">

          <li className="no-arrow">
            <Button>
              <NavLink to="/app/dashboard/" activeStyle={this.activeStyle}>
                <DashboardIcon className="mr-2" />
                <span className="nav-text">
                  <IntlMessages id="sidebar.dashboard" />
                </span>
              </NavLink>
            </Button>
          </li>
          <li className="no-arrow">
            <Button>
              <NavLink to="/app/echos/" activeStyle={this.activeStyle}>
                <OfflineBoltIcon className="mr-2" />
                <span className="nav-text">
                  <IntlMessages id="sidebar.echos" />
                </span>
              </NavLink>
            </Button>
          </li>
          <li className="no-arrow">
            <Button>
              <NavLink to="/app/connections/" activeStyle={this.activeStyle}>
                <AppsIcon className="mr-2" />
                <span className="nav-text">
                  <IntlMessages id="sidebar.myApps" />
                </span>
              </NavLink>
            </Button>
          </li>
          <li className="no-arrow">
            <Button>
              <NavLink to="/app/history/" activeStyle={this.activeStyle}>
                <WatchLaterIcon className="mr-2" />
                <span className="nav-text">
                  <IntlMessages id="sidebar.taskHistory" />
                </span>
              </NavLink>
            </Button>
          </li>
        </ul>
      </CustomScrollbars>
    );
  }
}

export default withRouter(SidenavContent);
