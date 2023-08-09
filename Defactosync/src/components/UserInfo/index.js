import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { userSignOut } from "actions/Auth";
import IntlMessages from "util/IntlMessages";
import { AWS_BUCKET } from "constants/AppConst";

class UserInfo extends React.Component {
  state = {
    anchorEl: null,
    open: false,
  };

  addDefaultSrc(e) {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/150x150";
  }

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleProfileRequest = () => {
    // this.props.history.push('/app/profile');
  };

  render() {
    const { authUser } = this.props;  
    return (
      <div className="user-profile d-flex flex-row align-items-center">
        <Avatar
          alt="..."
          src={AWS_BUCKET.USERIMAGESURL + authUser.imageName}
          onError={this.addDefaultSrc}
          className="user-avatar"
        />
        <div className="user-detail">
          <h4 className="user-name" onClick={this.handleClick}>
            {authUser.fullName}
            <i className="zmdi zmdi-caret-down zmdi-hc-fw align-middle" />
          </h4>
        </div>
        <Menu
          className="user-info"
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
          PaperProps={{
            style: {
              minWidth: 120,
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              this.handleRequestClose();
            }}
          >
            <i className="zmdi zmdi-settings zmdi-hc-fw mr-2" />
            <Link to="/app/profile">
              {" "}
              <IntlMessages id="popup.setting" />
            </Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleRequestClose();
              this.props.userSignOut();
            }}
          >
            <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-2" />
            <IntlMessages id="popup.logout" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { locale } = settings;
  const { authUser } = auth;
  return { locale, authUser };
};
export default connect(mapStateToProps, { userSignOut })(UserInfo);
