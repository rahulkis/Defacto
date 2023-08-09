import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import ThemeParent from "../../views/Theme/ThemeParent";
import "../../assets/custom/AdminNavbar.css";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  UncontrolledTooltip,
} from "reactstrap";

import ReactModal from "react-modal";
ReactModal.setAppElement("#root");
class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
      redirect: false,
      showModal: false,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white",
      });
    } else {
      this.setState({
        color: "navbar-transparent",
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent",
      });
    } else {
      this.setState({
        color: "bg-white",
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch,
    });
  };

  btnDashboardClick = () => {
    if (sessionStorage.getItem("alignClass") !== undefined) {
      sessionStorage.removeItem("alignClass");
    }
    this.props.history.push({
      pathname: "/dashboard",
    });
  };
  logOut = (e) => {
    e.preventDefault();
    this.setState({ redirect: true });
    sessionStorage.removeItem("userData");
  };
  openReactModal = (e) => {
    this.setState({ showModal: true });
  };
  handleCloseModal(val) {
    if (val !== undefined) {
      this.setState({ showModal: val });
    }
  }
  render() {
    // const pageType = store.getState().savePageType.pageType;
    if (this.state.redirect && !sessionStorage.getItem("userData")) {
      return <Redirect to={"/auth/login"} />;
    }
    return (
      <>
        <Navbar
          className={classNames("navbar-absolute", {
            [this.state.color]:
              this.props.location.pathname.indexOf("full-screen-map") === -1,
          })}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div className="navbar-minimize d-inline">
                <Button
                  className="minimize-sidebar btn-just-icon"
                  color="link"
                  id="tooltip209599"
                  onClick={this.props.handleMiniClick}
                >
                  <i className="tim-icons icon-align-center visible-on-sidebar-regular" />
                  <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini" />
                </Button>
                <UncontrolledTooltip
                  delay={0}
                  target="tooltip209599"
                  placement="right"
                >
                  Sidebar toggle
                </UncontrolledTooltip>
              </div>
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened,
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <div className="dashboard-btn">
                <button
                  className="btn-round btn btn-default"
                  type="button"
                  onClick={this.btnDashboardClick}
                >
                  Dashboard
                </button>
              </div>

              {/* <Link  to={{
              pathname: 'ConfigureEmail',
             
            }}>After Submission</Link> */}
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.toggleCollapse}
            />
            <Collapse navbar isOpen={this.state.collapseOpen}>
              {this.props.history.location.pathname
                .toLowerCase()
                .indexOf("user/newform") <= 0 && (
                <div className="col-md-8 tabbable boxed parentTabs">
                  <ul className="pl-5 nav nav-tabs">
                    <li className="active-tabs active-detail">
                      <Link
                        to={{
                          pathname:
                            localStorage.formPageType === "edit"
                              ? "EditForm"
                              : "CreateForm",
                          state: {
                            fromNotifications: true,
                          },
                        }}
                      >
                        <i className="fa fa-edit tabs-icon" /> Design
                      </Link>
                      {/* <a href="#set1" className="nav-link p-0">
                      <i className="fa fa-pencil tabs-icon"></i> Design
                    </a> */}
                    </li>
                    <li className="active-tabs configure-tabs">
                      <a href="#set2" className="nav-link p-0">
                        <i className="fa fa-cog tabs-icon" /> Configure
                      </a>
                      <div className="configure-text configure-display">
                        <ul className="p-0">
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "ConfigureDetail",
                              }}
                            >
                              Details
                              <div className="hover-detail-text">
                                Manage form title, description and general
                                information.
                              </div>
                            </Link>
                          </li>
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "ConfigurePayment",
                              }}
                            >
                              Payments
                              <div className="hover-detail-text">
                                Manage payment gateways, coupons and dynamic
                                pricing.
                              </div>
                            </Link>
                            {/* Payments
                          <div className="hover-detail-text">
                            Manage payment gateways, coupons and dynamic
                            pricing.
                          </div> */}
                          </li>
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "Analytics",
                              }}
                            >
                              Analytics
                              <div className="hover-detail-text">
                                Connect Google Analytics, Facebook Pixel and
                                third party scripts.
                              </div>
                            </Link>
                          </li>
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "FormBehaviour",
                              }}
                            >
                              Form Behaviour
                              <div className="hover-detail-text">
                                Control form behaviour, including scoring and
                                disabling submissions.
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="active-tabs submission-tabs">
                      <a href="#media" className="nav-link p-0">
                        <i className="fa fa-envelope tabs-icon" /> After
                        Submission
                      </a>
                      <div className="configure-text After-submission-display">
                        <ul className="p-0">
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "ConfigureEmail",
                              }}
                            >
                              Emails
                              <div className="hover-detail-text">
                                Send emails when the form is submitted.
                              </div>
                            </Link>
                            {/* Emails
                          <div className="hover-detail-text">
                            Send emails when the form is submitted.
                          </div> */}
                          </li>
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "SuccessRedirectPage",
                              }}
                            >
                              {"Success Pages & Redirects"}
                              <div className="hover-detail-text">
                                Control what submitters see after they have
                                submitted the form.
                              </div>
                            </Link>
                          </li>
                          <li className="detail-list">
                            <Link to={{ pathname: "custompdf" }}>
                              {"Custom PDFs"}
                              <div className="hover-detail-text">
                                Make custom PDFs that can be included in emails
                                and integrations.
                              </div>
                            </Link>
                          </li>
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "IntegrationNwebhooks",
                              }}
                            >
                              {"Integrations & Webhooks"}
                              <div className="hover-detail-text">
                                Send the submitted data to other apps or your
                                own services.
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="active-tabs share-tabs">
                      <a href="#media1" className="nav-link p-0">
                        <i className="fa fa-share-alt tabs-icon" /> Share
                      </a>
                      <div className="configure-text share-display">
                        <ul className="p-0">
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "Social",
                              }}
                            >
                              Social & URL
                              <div className="hover-detail-text">
                                Share your form by URL on social or other means.
                              </div>
                            </Link>
                            {/* {"Social & URL"}
                            <div className="hover-detail-text">
                              Share your form by URL on social or other means.
                            </div> */}
                          </li>
                          <li className="detail-list">
                            <Link
                              to={{
                                pathname: "Embed",
                              }}
                            >
                              Embed
                              <div className="hover-detail-text">
                                Embed your form on your website with a code
                                snippet.
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                  <div className="tab-content heading-navbar">
                    <div id="set1">
                      <div className="tabbable d-none">
                        <ul className="nav nav-tabs">
                          {/* <li className="active sub-tabs">
                            <a href="#sub11" className="nav-link"></a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#sub12" className="nav-link"></a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#sub13" className="nav-link"></a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#sub14" className="nav-link"></a>
                          </li> */}
                        </ul>
                        <div className="tab-content">
                          <div className="tab-pane fade active in" id="sub11">
                            <p>pop all content</p>
                          </div>
                          <div className="tab-pane fade" id="sub12">
                            <p>unique all content</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="set2">
                      <div className="tabbable">
                        <ul className="nav nav-tabs submenu-all-tabs">
                          <li className="active sub-tabs">
                            <a href="#sub21" className="nav-link">
                              Details
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#sub22" className="nav-link">
                              Payments
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#sub23" className="nav-link">
                              Analytics
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#sub24" className="nav-link">
                              Form Behaviour
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div className="tab-pane fade active in" id="sub21">
                            <p>pop brand content</p>
                          </div>
                          <div className="tab-pane fade" id="sub22">
                            <p>unique brand content</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="media">
                      <div className="tabbable">
                        <ul className="nav nav-tabs submenu-all-tabs">
                          <li className="active sub-tabs">
                            <a href="#mediapop" className="nav-link">
                              Emails
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#mediauni" className="nav-link">
                              Success Pages & Redirects
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#media-pop" className="nav-link">
                              Custom PDFs
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#media-uni" className="nav-link">
                              {"Integrations & Redirects"}
                            </a>
                          </li>{" "}
                        </ul>
                        <div className="tab-content">
                          <div
                            className="tab-pane fade active in"
                            id="mediapop"
                          >
                            <p>pop media content</p>
                          </div>
                          <div className="tab-pane fade" id="mediauni">
                            <p>unique media content</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="media1">
                      <div className="tabbable">
                        <ul className="nav nav-tabs submenu-all-tabs">
                          <li className="active sub-tabs">
                            <a href="#mediapop1" className="nav-link">
                              {"Social & URL"}
                            </a>
                          </li>
                          <li className="sub-tabs">
                            <a href="#mediauni1" className="nav-link">
                              Embed
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div
                            className="tab-pane fade active in"
                            id="mediapop1"
                          >
                            <p>pop media content</p>
                          </div>
                          <div className="tab-pane fade" id="mediauni1">
                            <p>unique media content</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Nav className="ml-auto" navbar>
                <button
                  className="toggle-view-btn btn-round btn btn-default"
                  type="button"
                  id="split-form"
                  onClick={this.props.togglePreviewMode}
                >
                  Toggle View
                </button>
                {/* <button
                  className="toggle-view-btn btn-round btn btn-default"
                  type="button"
                  id="split-form"
                 // onClick={this.props.togglePreviewMode}
                >
                 Save Form
                </button> */}
                {/* <InputGroup className="search-bar" tag="li">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={this.toggleModalSearch}
                  >
                    <i className="tim-icons icon-zoom-split" />
                    <span className="d-lg-none d-md-block">Search</span>
                  </Button>
                </InputGroup> */}
                <div
                  data-label="Theme"
                  title="Theme"
                  className="EditorTopBar__iconbtn EditorTopBar__theme"
                  onClick={this.openReactModal}
                >
                  <svg
                    fill="currentColor"
                    preserveAspectRatio="xMidYMid meet"
                    height="1em"
                    width="1em"
                    viewBox="0 0 40 40"
                    className="theme-svg-icon1"
                  >
                    <g>
                      <path d="m20 32.7v-24.2l-7 7.1c-1.9 1.8-3 4.4-3 7.1 0 5.3 4.6 10 10 10z m9.5-19.5c5.2 5.2 5.2 13.6 0 18.8-2.6 2.6-6.1 3.9-9.5 3.9s-6.9-1.3-9.5-3.9c-5.2-5.2-5.2-13.6 0-18.8l9.5-9.4z" />
                    </g>
                  </svg>
                  <svg width="0" height="0" className="theme-svg-icon2">
                    <linearGradient
                      id="lgrad"
                      x1="100%"
                      y1="100%"
                      x2="0%"
                      y2="0%"
                    >
                      <stop offset="0%" className="theme-stop-icon1" />
                      <stop offset="100%" className="theme-stop-icon2" />
                    </linearGradient>
                  </svg>
                </div>
                <UncontrolledDropdown nav>
                  <span title="Preview">
                    <i className="fa fa-eye preview-icon" aria-hidden="true" />
                  </span>

                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Mike John responded to your email
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        You have 5 more tasks
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Your friend Michael is in town
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Another notification
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Another one
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="photo">
                      <img alt="..." src={require("assets/img/mike.jpg")} />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none" onClick={(e) => this.logOut(e)}>
                      Log out
                    </p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">Profile</DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">Settings</DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={(e) => this.logOut(e)}
                      >
                        Log out
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
        <div className="Theme-settings">
          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="onRequestClose"
            className="Product-Modal"
            onRequestClose={this.handleCloseModal}
          >
            <ThemeParent closeModal={this.handleCloseModal} />
          </ReactModal>
        </div>
      </>
    );
  }
}

export default AdminNavbar;
