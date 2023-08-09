import React from "react";
import { Route, Switch } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import routes from "routes.js";
import InterComIcon from "../../components/Common/InterComIcon";
import classNames from "classnames";
import Footer from "components/Footer/Footer.jsx";
// reactstrap components
import { Collapse, NavbarBrand, Navbar, Nav, Container } from "reactstrap";
let ps;

class Template extends React.Component {
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
    this.togglePreviewMode = this.togglePreviewMode.bind(this);
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel);
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    window.addEventListener("scroll", this.showNavbarButton);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
    window.removeEventListener("scroll", this.showNavbarButton);
  }
  componentDidUpdate(e) {
    if (e.location.pathname !== e.history.location.pathname) {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      this.refs.mainPanel.scrollTop > 50
    ) {
      this.setState({ opacity: 1 });
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      this.refs.mainPanel.scrollTop <= 50
    ) {
      this.setState({ opacity: 0 });
    }
  };
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/Template") {
        if (prop.path === "/TemplateView" || prop.path === "/TemplateList") {
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
  getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.pathname.indexOf(
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleMiniClick = () => {
    let notifyMessage = "Sidebar mini ";
    if (document.body.classList.contains("sidebar-mini")) {
      this.setState({ sidebarMini: false });
      notifyMessage += "deactivated...";
    } else {
      this.setState({ sidebarMini: true });
      notifyMessage += "activated...";
    }
    let options = {};
    options = {
      place: "tr",
      message: notifyMessage,
      type: "primary",
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    this.refs.notificationAlert.notificationAlert(options);
    document.body.classList.toggle("sidebar-mini");
  };

  togglePreviewMode() {
    if (this.state.splitPreviewMode) {
      this.setState({
        splitPreviewMode: false,
      });
    } else {
      this.setState({
        splitPreviewMode: true,
      });
    }
  }
  toggleSidebar = () => {
    this.setState({
      sidebarOpened: !this.state.sidebarOpened,
    });
    document.documentElement.classList.toggle("nav-open");
  };
  backToDashboard = () => {
    window.open("../Dashboard", "_self");
  };
  ViewTemplateList = () => {
    localStorage.removeItem("templateId");
    window.open("../Template/TemplateList", "_self");
  };
  render() {
    return (
      <div className="wrapper">
           <InterComIcon/>
        <div className="rna-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <div
          className="navbar-minimize-fixed"
          style={{ opacity: this.state.opacity }}
        >
          <button
            className="minimize-sidebar btn btn-link btn-just-icon"
            onClick={this.handleMiniClick}
          >
            <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
            <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
          </button>
        </div>

        <div
          className="main-panel"
          ref="mainPanel"
          data={this.state.activeColor}
        >
          <Navbar
            className={classNames("navbar-absolute", {
              [this.state.color]:
                this.props.location.pathname.indexOf("full-screen-map") === -1,
            })}
            expand="lg"
          >
            <Container fluid>
              <div className="navbar-wrapper">
                <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
                  Defacto Template View
                </NavbarBrand>
              </div>

              <Collapse navbar isOpen={this.state.collapseOpen}>
                <Nav className="ml-auto" navbar>
                  <li>
                    <a
                      href="#pablo"
                      onClick={this.ViewTemplateList}
                      className=""
                      tabIndex="-1"
                    >
                      <span>Templates</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pablo"
                      onClick={this.backToDashboard}
                      className=""
                      tabIndex="-1"
                    >
                      <span>Back To Dashboard</span>
                    </a>
                  </li>
                </Nav>
                {/* <Nav className="ml-auto" navbar>
                     
                <li className="separator d-lg-none" />
              </Nav> */}
              </Collapse>
            </Container>
          </Navbar>
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
export default Template;
