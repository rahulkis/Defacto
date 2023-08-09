import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { Redirect } from "react-router-dom";
import { calculateTime } from "../../util/commonFunction";
// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
} from "reactstrap";

class DashboardNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
      redirect: false,
      buttonText: "Go To HotJar",
      IsDashBoardOpen: true,
      showPopup: false,
    };
  }
  componentWillMount() {
    this.checkAccountValidity();
    if (window.location.href.indexOf("AccountSettings") !== -1) {
      this.setState({ IsDashBoardOpen: false });
    }
  }

  checkAccountValidity = (e) => {
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      let checkIsAdmin = jsonData.UserRole;
      let checkTime = jsonData.CreatedAt;
      let expireDated = new Date(checkTime);
      let dateFuture = expireDated.setDate(expireDated.getDate() + 15);
      let today = new Date();
      if (today < expireDated) {
        let resulte = calculateTime(dateFuture);
        this.setState({ leftTime: resulte });
        if (checkIsAdmin !== "SuperAdmin") {
          this.setState({ showPopup: true });
        }
        localStorage.setItem("accountStatus", false);
      } else {
        this.setState({ showPopup: false });
        if (checkIsAdmin !== "SuperAdmin") {
          localStorage.setItem("accountStatus", true);
        } else {
          localStorage.setItem("accountStatus", false);
        }
      }
    }
  };

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

  clickCreateForm = () => {
    if (sessionStorage.getItem("alignClass") !== undefined) {
      sessionStorage.removeItem("alignClass");
    }
    this.props.history.push({
      pathname: "/user/NewForm",
    });
  };
  clickHotJar = () => {
    if (
      window.location.href.indexOf("trackForm") !== -1 ||
      window.location.href.indexOf("AccountSettings") !== -1
    ) {
      window.open("../dashboard", "_self");
    } else {
      this.props.history.push({
        pathname: "/trackForm",
      });
    }
  };
  logOut = (e) => {
    e.preventDefault();
    this.setState({ redirect: true });
    sessionStorage.removeItem("userData");
    localStorage.removeItem("2faActivate");
    localStorage.removeItem("loginUserInfo");
  };
  GoToSettings = (e) => {
    window.open("/AccountSettings/Account", "_self");
  };
  GoToReferral = (e) => {
    localStorage.setItem("activate", "referal");
    window.open("/AccountSettings/Account", "_self");
  };
  render() {
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
              <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
                Form Builder
              </NavbarBrand>
            </div>

            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                {this.state.IsDashBoardOpen && (
                  <>
                    {this.state.showPopup && (
                      <div style={{ float: "right", marginTop: "15px" }}>
                        <small>
                          {" "}
                          You have {this.state.leftTime} left on your
                          <strong>
                            <a
                              className="a"
                              href="#pablo"
                              style={{ marginLeft: "5px" }}
                            >
                              Pro Trial
                            </a>
                          </strong>
                        </small>
                      </div>
                    )}
                    {window.location.href.indexOf("trackForm") === -1 ? (
                      <button
                        className="toggle-view-btn btn-round btn btn-default"
                        type="button"
                        id="hotjar"
                        onClick={this.clickHotJar}
                      >
                        Go To HotJar
                      </button>
                    ) : (
                      <button
                        className="toggle-view-btn btn-round btn btn-default"
                        type="button"
                        id="hotjar"
                        onClick={this.clickHotJar}
                      >
                        Dashboard{" "}
                      </button>
                    )}
                  </>
                )}
                {!this.state.IsDashBoardOpen && (
                  <>
                    <button
                      className="toggle-view-btn btn-round btn btn-default"
                      type="button"
                      id="hotjar"
                      onClick={this.clickHotJar}
                    >
                      Dashboard{" "}
                    </button>
                  </>
                )}

                {this.state.IsDashBoardOpen && (
                  <button
                    className="toggle-view-btn btn-round btn btn-default"
                    type="button"
                    id="split-form"
                    onClick={this.clickCreateForm}
                  >
                    Create Form
                  </button>
                )}

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
                      <DropdownItem
                        className="nav-item"
                        onClick={(e) => this.GoToReferral(e)}
                      >
                        Get 10% Off Forever
                      </DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem
                        className="nav-item"
                        onClick={(e) => this.GoToSettings(e)}
                      >
                        Account Settings
                      </DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <p className="d-lg-none" onClick={(e) => this.logOut(e)}>
                      Log out
                    </p>
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
        />
      </>
    );
  }
}

export default DashboardNavbar;
