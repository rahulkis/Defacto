import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Switch from "@material-ui/core/Switch";
import FolderIcon from "@material-ui/icons/Folder";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowRightTwoToneIcon from "@material-ui/icons/ArrowRightTwoTone";
import Button from "@material-ui/core/Button";
import { ToastsStore } from "react-toasts";
import AlertDialog from "components/Dialogs/AlertDialog";
import { httpClient } from "appUtility/Api";
import { ECHO_URLS } from "constants/AppConst";
import { showErrorToaster } from "appUtility/commonFunction";
import RenameEcho from "../../list/components/renameEcho";
import MoveEcho from "../../list/components/moveEcho";
import { updateEchoData, updateSelectedPocket } from "actions/index";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";

class Header extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      expand: false,
      trashEchoModal: false,
      renameEchoModal: false,
      moveEchoModal: false,
      collapseBtn: "View Steps",
      rediectByPocket: false,
      echoOption: prop.selectedEcho.state === "on" ? true : false,
    };
  }

  handleStateChange = () => (event, checked) => {    
    const echoData = this.props.selectedEcho;
    if (echoData.isTrashed) {
      ToastsStore.error("Echo is in Trash!");
    }else{  
    let toggleValue = "off";
    if (checked) {
      toggleValue = "on";
    }

    try {
      let body = {
        id: echoData.id,
        state: toggleValue,
      };

      httpClient
        .post(ECHO_URLS.UPDATE_ECHO_STATE, body)
        .then((res) => {
          if (res.data.statusCode === 200) {
            this.props.updateEchoData({
              ...echoData,
              state: toggleValue,
            });
            this.setState({
              echoOption: checked,
            });
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }}
  };

  handleExpand = () => {
    this.setState({ expand: true, collapseBtn: "Collapse Steps" });
  };

  handleExpandClose = () => {
    this.setState({ expand: false, collapseBtn: "View Steps" });
  };
  onEchoTrashClose = () => {
    this.setState({ trashEchoModal: false });
  };

  onMoveEcho = () => {
    this.setState({ moveEchoModal: true });
  };

  onEchoMoveClose = () => {
    this.setState({ moveEchoModal: false });
  };

  onEchoTrashConfirm = (echo) => {
    try {
      let body = {
        id: echo.id,
        isTrashed: true,
      };

      httpClient
        .post(ECHO_URLS.TRASH_ECHO_BY_ID, body)
        .then((res) => {
          if (res.data.statusCode === 200) {
            this.props.updateEchoData({ ...echo, isTrashed: true });
            ToastsStore.success("Echo moved to Trash");
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  onTrashEcho = (echo) => {
    if (echo.isTrashed) {
      ToastsStore.error("Echo is already in Trash!");
    } else {
      this.setState({ trashEchoModal: true });
    }
  };

  onRenameEcho = () => {
    this.setState({ renameEchoModal: true });
  };

  onEchoRenameClose = () => {
    this.setState({ renameEchoModal: false });
  };

  onSaveEchoName = (data) => {
    this.props.updateEchoData({ ...data.echo, title: data.title });
  };

  onSaveMoveEcho = (data) => {
    this.props.updateEchoData({
      ...data.echo,
      pocketIds: [data.pocket.value],
      isTrashed: false,
    });
  };

  handlePocket = (pocket) => {
    this.props.updateSelectedPocket(pocket[0]);
    this.setState({ redirectByPocket: true });
  };

  render() {
    const {
      expand,
      trashEchoModal,
      collapseBtn,
      renameEchoModal,
      moveEchoModal,
      redirectByPocket,
      echoOption,
    } = this.state;
    const { selectedEcho, authUser, allPockets, nodesList } = this.props;
    let pocketName = "";
    let selectedPocket = "";
    if (allPockets && selectedEcho) {
      if (!selectedEcho.isTrashed) {
        selectedPocket = allPockets.filter((pocket) => {
          return pocket.id === selectedEcho.pocketIds[0];
        });
        if (selectedPocket.length) {
          pocketName = selectedPocket[0].title;
        }
      }
    }
    const sortedNodes = nodesList;
    const sortedNodesLength = sortedNodes.length;

    if (redirectByPocket) {
      return <Redirect to="/app/echos/list" />;
    }

    return (
      <div className="echos-detail-page-header">
        <div className="jr-profile-banner">
          <div className="jr-profile-container">
            <div className="jr-profile-banner-top">
              <div className="jr-profile-banner-top-left">
                {sortedNodes.length > 2 && !expand && (
                  <div className="jr-profile-banner-avatar">
                    <div className="jr-profile-banner-avatar-icon">
                      <span className="nodes-icons">
                        <img
                          height="30"
                          width="30"
                          src={
                            APP_IMAGE_URL +
                            IMAGE_FOLDER.APP_IMAGES +
                            sortedNodes[0].selectedCLI.toLowerCase() +
                            ".png"
                          }
                          alt="cli"
                        ></img>
                      </span>
                      <ArrowRightTwoToneIcon />
                      <span className=" nodes-icons text-primary">
                        {nodesList.length ? "+" + (nodesList.length - 2) : "0"}
                      </span>
                      <ArrowRightTwoToneIcon />
                      <span className="nodes-icons">
                        <img
                          height="30"
                          width="30"
                          src={
                            APP_IMAGE_URL +
                            IMAGE_FOLDER.APP_IMAGES +
                            sortedNodes[
                              sortedNodes.length - 1
                            ].selectedCLI.toLowerCase() +
                            ".png"
                          }
                          alt="cli"
                        ></img>
                      </span>
                      <Button
                        className="btn  btn-sm mt-4"
                        style={{ padding: "10px 47px" }}
                        variant="contained"
                        color="primary"
                        onClick={this.handleExpand}
                      >
                        {collapseBtn}
                      </Button>
                    </div>
                  </div>
                )}

                {sortedNodes.length > 1 && sortedNodes.length <= 2 && (
                  <div className="jr-profile-banner-avatar">
                    <div className="jr-profile-banner-avatar-icon-double">
                      <span className="nodes-icons">
                        <img
                          height="30"
                          width="30"
                          src={
                            APP_IMAGE_URL +
                            IMAGE_FOLDER.APP_IMAGES +
                            sortedNodes[0].selectedCLI.toLowerCase() +
                            ".png"
                          }
                          alt="cli"
                        ></img>
                      </span>
                      <ArrowRightTwoToneIcon />
                      <span className="nodes-icons">
                        <img
                          height="30"
                          width="30"
                          src={
                            APP_IMAGE_URL +
                            IMAGE_FOLDER.APP_IMAGES +
                            sortedNodes[
                              sortedNodes.length - 1
                            ].selectedCLI.toLowerCase() +
                            ".png"
                          }
                          alt="cli"
                        ></img>
                      </span>
                    </div>
                  </div>
                )}

                {sortedNodes.length === 1 && (
                  <div className="jr-profile-banner-avatar">
                    <div className="jr-profile-banner-avatar-icon-single">
                      <span className=" nodes-icons">
                        <img
                          height="30"
                          width="30"
                          src={
                            APP_IMAGE_URL +
                            IMAGE_FOLDER.APP_IMAGES +
                            sortedNodes[0].selectedCLI.toLowerCase() +
                            ".png"
                          }
                          alt="cli"
                        ></img>
                      </span>
                    </div>
                  </div>
                )}

                {sortedNodes.length === 0 && (
                  <div className="jr-profile-banner-avatar">
                    <div className="jr-profile-banner-avatar-icon-empty">
                      <SettingsIcon />
                      <ArrowRightTwoToneIcon /> <SettingsIcon />
                    </div>
                  </div>
                )}

                {sortedNodes.length > 1 && expand && (
                  <div className="jr-profile-banner-avatar-multiple">
                    <div className="jr-profile-banner-avatar-icon">
                      {sortedNodes.map((node, i) => (
                        <span key={node.id}>
                          <span className="nodes-icons">
                            <img
                              height="30"
                              width="30"
                              src={
                                APP_IMAGE_URL +
                                IMAGE_FOLDER.APP_IMAGES +
                                node.selectedCLI.toLowerCase() +
                                ".png"
                              }
                              alt="cli"
                            ></img>
                          </span>
                          {sortedNodesLength === i + 1 ? (
                            ""
                          ) : (
                            <ArrowRightTwoToneIcon />
                          )}
                        </span>
                      ))}

                      <Button
                        className="btn  btn-sm ml-4"
                        variant="contained"
                        color="primary"
                        style={{ padding: "10px 47px" }}
                        onClick={this.handleExpandClose}
                      >
                        {collapseBtn}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="jr-profile-banner-avatar-info ml-2 mt-4">
                  <h2 className="mb-2 jr-mb-sm-3 jr-fs-xxl jr-font-weight-light">
                    {selectedEcho
                      ? selectedEcho.title
                        ? selectedEcho.title
                        : "Echo undefined"
                      : "Echo undefined"}
                    <span className="ml-2">
                      <EditIcon
                        onClick={this.onRenameEcho}
                        className="pointer"
                      />
                    </span>

                    <span className="ml-2">
                      <Switch
                        classes={{
                          checked: "text-success",
                          bar: "bg-success",
                        }}
                        checked={echoOption}
                        onChange={this.handleStateChange()}
                      />
                    </span>
                  </h2>
                  <p className="mb-0">
                    Owned by{" "}
                    <span className="jr-fs-lg">{authUser.fullName}</span>
                    {pocketName ? (
                      <span>
                        {" "}
                        in{" "}
                        <span
                          className="pointer pocket"
                          onClick={() => this.handlePocket(selectedPocket)}
                        >
                          <FolderIcon className="icon" />
                          {pocketName}{" "}
                        </span>
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>
              <div className="jr-profile-banner-top-right">
                <ul className="jr-follower-list">
                  <li onClick={this.onMoveEcho} className="pointer">
                    <span className="jr-follower-title jr-fs-lg jr-font-weight-medium">
                      <FolderIcon />
                    </span>
                    <span className="jr-fs-sm">Move to folder</span>
                  </li>

                  <li className="pointer">
                    <span className="jr-follower-title jr-fs-lg jr-font-weight-medium">
                      <GroupIcon />
                    </span>
                    <span className="jr-fs-sm">Share with others</span>
                  </li>
                  <li
                    onClick={() => this.onTrashEcho(selectedEcho)}
                    className="pointer"
                  >
                    <span className="jr-follower-title jr-fs-lg jr-font-weight-medium">
                      <DeleteIcon />
                    </span>
                    <span className="jr-fs-sm">Move to trash</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="jr-profile-banner-bottom">
              <span className="jr-profile-setting">
                <i className="zmdi zmdi-settings mr-2" />
                <span className="d-inline-flex align-middle ml-1 jr-ml-sm-0">
                  <Link
                    to={"/editor/setup/" + selectedEcho.id}
                    className="text-white"
                  >
                    Open in editor
                  </Link>
                </span>
              </span>
            </div>

            <AlertDialog
              title={"Really want to move Echo to Trash?"}
              data={selectedEcho}
              open={trashEchoModal}
              close={this.onEchoTrashClose}
              confirm={this.onEchoTrashConfirm}
            />

            <RenameEcho
              echo={selectedEcho}
              open={renameEchoModal}
              onEchoClose={this.onEchoRenameClose}
              onSaveEchoName={this.onSaveEchoName}
            />

            <MoveEcho
              echo={selectedEcho}
              open={moveEchoModal}
              onEchoMoveClose={this.onEchoMoveClose}
              onSaveMoveEcho={this.onSaveMoveEcho}
              allpockets={allPockets}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, pockets, echo }) => {
  const { selectedEcho, nodesList } = echo;
  const { authUser } = auth;
  const { allPockets } = pockets;
  return { authUser, allPockets, nodesList, selectedEcho };
};

export default connect(mapStateToProps, {
  updateEchoData,
  updateSelectedPocket,
})(Header);
