import React from "react";
import { Redirect } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowRightTwoToneIcon from "@material-ui/icons/ArrowRightTwoTone";
import InfoIcon from "@material-ui/icons/Info";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import GroupIcon from "@material-ui/icons/Group";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import ReplayOutlinedIcon from "@material-ui/icons/ReplayOutlined";
import FolderIcon from "@material-ui/icons/Folder";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import RenameEcho from "./renameEcho";
import MoveEcho from "./moveEcho";
import { ToastsStore } from "react-toasts";
import AlertDialog from "../../../../../../../../components/Dialogs/AlertDialog";
import { httpClient } from "../../../../../../../../appUtility/Api";
import {
  ECHO_URLS,
  APP_IMAGE_URL,
  IMAGE_FOLDER,
} from "../../../../../../../../constants/AppConst";
import { showErrorToaster, sortArrayWithKey } from "appUtility/commonFunction";
class EchosCell extends React.Component {
  constructor(props) {  
    super(props);
    this.state = {
      anchorEl: undefined,
      menuState: false,
      renameEchoModal: false,
      moveEchoModal: false,
      trashEchoModal: false,
      checkEcho: false,
      echoOption: props.echo.state === "on" ? true : false,
      isEdit: false,
      taskHistory: false,
    };
  }

  onEchoOptionSelect = (event) => {
    this.setState({ menuState: true, anchorEl: event.currentTarget });
  };
  handleRequestClose = () => {
    this.setState({ menuState: false });
  };

  onRenameEcho = () => {
    this.setState({ menuState: false, renameEchoModal: true });
  };

  onMoveEcho = () => {
    this.setState({ menuState: false, moveEchoModal: true });
  };

  onTrashEcho = (echo) => {
    this.setState({ menuState: false });
    if (echo.isTrashed) {
      ToastsStore.error("Echo is already in Trash!");
    } else if (echo.state === "on") {
      ToastsStore.error("Turn off state first!");
    } else {
      this.setState({ trashEchoModal: true });
    }
  };

  onEchoClose = () => {
    this.setState({ renameEchoModal: false });
  };

  onEchoMoveClose = () => {
    this.setState({ moveEchoModal: false });
  };

  onEchoTrashClose = () => {
    this.setState({ trashEchoModal: false });
  };

  onCopyEcho = (echo) => {
    this.setState({ menuState: false });
    try {
      httpClient
        .post(ECHO_URLS.COPY_ECHO, echo)
        .then((res) => {
          if (res.data.statusCode === 200) {
            this.props.fetchAllEchos();
            ToastsStore.success("Echo Copied Successfully");
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  onSaveEchoName = (data) => {
    this.props.updateEchoData({ ...data.echo, title: data.title });
  };

  onSaveMoveEcho = async (data) => {   
    this.props.updateEchoData({
      ...data.echo,
      pocketIds: [data.pocket.value],
      isTrashed: false,
    });
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
            this.props.fetchAllEchos();
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

  handleEchoSelect = (e, id) => {
    let arr = this.props.checkedEchos;
    let checked = e.target.checked;

    if (checked) {
      arr.push(id);
      this.props.updateCheckedEchos(arr);
    } else {
      let index = arr.indexOf(id);
      if (index > -1) {
        arr.splice(index, 1);
      }
      this.props.updateCheckedEchos(arr);
    }

    this.setState({ checkEcho: true });
    this.props.handleCheckState();
  };

  handleStateChange = () => (event, checked) => {
    const echoData = this.props.echo;
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
            this.setState({
              echoOption: checked,
            });
            this.props.fetchAllEchos();
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  renderConnectionIcons(nodesList) {
    const sortedNodes = nodesList
      ? sortArrayWithKey(nodesList, "sortIndex")
      : [];
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {sortedNodes.length > 0 && (
          <>
            <img
              className="echo-connection-icon"
              height="30"
              width="30"
              src={`${APP_IMAGE_URL}${
                IMAGE_FOLDER.APP_IMAGES
              }${sortedNodes[0].selectedCLI.toLowerCase()}.png`}
              alt="syncImage"
            ></img>
            <ArrowRightTwoToneIcon />
            {sortedNodes.length > 2 && (
              <div className="echo-connection-icon">
                {sortedNodes.length - 2}
              </div>
            )}
            {sortedNodes.length === 1 && (
              <SettingsIcon className="echo-connection-icon" />
            )}
            {sortedNodes.length > 2 && <ArrowRightTwoToneIcon />}
            {sortedNodes.length >= 2 && (
              <img
                height="30"
                width="30"
                className="echo-connection-icon"
                src={`${APP_IMAGE_URL}${IMAGE_FOLDER.APP_IMAGES}${sortedNodes[
                  sortedNodes.length - 1
                ].selectedCLI.toLowerCase()}.png`}
                alt="syncImage"
              ></img>
            )}
          </>
        )}
        {sortedNodes.length === 0 && (
          <>
            <SettingsIcon className="echo-connection-icon" />
            <ArrowRightTwoToneIcon />{" "}
            <SettingsIcon className="echo-connection-icon" />
          </>
        )}
      </div>
    );
  }

  render() {
    const {
      echo,
      allPockets,
      trashPocketSelected,
      handleCheckState  
    } = this.props;

    const nodesList = echo.nodes;
    const {
      menuState,
      anchorEl,
      renameEchoModal,
      moveEchoModal,
      trashEchoModal,
    } = this.state;
    const { id, title } = echo;

    const options = [
      {
        name: "Edit",
        icon: <EditIcon />,
      },
      {
        name: "Rename",
        icon: <ArtTrackIcon />,
      },
      {
        name: "Share Echo",
        icon: <GroupIcon />,
      },
      {
        name: "Move to Pocket",
        icon: <FolderIcon />,
      },
      {
        name: "Task History",
        icon: <ReplayOutlinedIcon />,
      },
      {
        name: "Copy",
        icon: <FileCopyOutlinedIcon />,
      },

      {
        name: "Trash",
        icon: <DeleteIcon />,
      },
    ];

    const trashOptions = [
      {
        name: "Move to Pocket",
        icon: <FolderIcon />,
      },
      {
        name: "Task History",
        icon: <ReplayOutlinedIcon />,
      },
    ];
    if (this.state.isEdit) {
      return <Redirect to={`/editor/setup/${echo.id}`} />;
    }
    if (this.state.taskHistory) {
      return <Redirect to={`/app/history/usage`} />;
    }
    return (
      <div className="echo-row-item">
        <div className="contact-item">
          {!trashPocketSelected && (
            <Checkbox
              color="primary"
              // checked={
              //   checkedEchos.findIndex((ec) => echo.id === ec) > -1 ? true : false
              // }
             
              checked={echo.isChecked=== true ? true:false}
              onChange={(e)=>handleCheckState(e,echo.id)}
            />
          )}

          {this.renderConnectionIcons(nodesList)}
          <div
            className="col con-inf-mw-100"
            style={{ cursor: "pointer" }}
            onClick={() => this.setState({ isEdit: true })}
          >
            <p className="mb-0">
              <span className="text-truncate contact-name text-dark ">
                {title}
              </span>
            </p>
          </div>
          <div>
            {echo.isTrashed ? (
              <Switch
                disabled={true}
                classes={{
                  checked: "text-primary",
                  bar: "bg-primary",
                }}
              />
            ) : (
              <Switch
                classes={{
                  checked: "text-primary",
                  bar: "bg-primary",
                }}
                checked={echo.state === "on" ? true : false}
                onChange={this.handleStateChange()}
              />
            )}
          </div>
          <Tooltip title="View Echo Details" placement="bottom">
            <Link to={"/app/echos/" + id}>
              <InfoIcon />
            </Link>
          </Tooltip>
          <div className="col-auto px-1 actions d-none d-sm-flex">
            <IconButton
              className="icon-btn p-2"
              onClick={this.onEchoOptionSelect}
            >
              <i className="zmdi zmdi-more-vert" />
            </IconButton>

            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={menuState}
              onClose={this.handleRequestClose}
              MenuListProps={{
                style: {
                  width: 170,
                },
              }}
            >
              {echo.isTrashed
                ? trashOptions.map((option) => (
                    <MenuItem
                      key={option.name}
                      onClick={(e) => {
                        if (option.name === "Move to Pocket") {
                          this.onMoveEcho();
                        }
                      }}
                    >
                      {option.icon}
                      {option.name === "Task History" ? (
                        <Link to={"/app/history/usage"}>
                          <span className="ml-2">{option.name}</span>
                        </Link>
                      ) : (
                        <span className="ml-2">{option.name}</span>
                      )}
                    </MenuItem>
                  ))
                : options.map((option) => (
                    <MenuItem
                      key={option.name}
                      onClick={(e) => {
                        if (option.name === "Rename") {
                          this.onRenameEcho();
                        }
                        if (option.name === "Move to Pocket") {
                          this.onMoveEcho();
                        }
                        if (option.name === "Trash") {
                          this.onTrashEcho(echo);
                        }
                        if (option.name === "Copy") {
                          this.onCopyEcho(echo);
                        }
                        if (option.name === "Edit") {
                          this.setState({ isEdit: true });
                        }
                        if (option.name === "Task History") {
                          this.setState({ taskHistory: true });
                        }
                      }}
                    >
                      {option.icon}                     
                      <div className="ml-2">{option.name}</div>
                    </MenuItem>
                  ))}
            </Menu>
          </div>
        </div>
        <RenameEcho
          echo={echo}
          open={renameEchoModal}
          onEchoClose={this.onEchoClose}
          onSaveEchoName={this.onSaveEchoName}
        />

        <MoveEcho
          echo={echo}
          open={moveEchoModal}
          onEchoMoveClose={this.onEchoMoveClose}
          onSaveMoveEcho={this.onSaveMoveEcho}
          allpockets={allPockets}
        />

        <AlertDialog
          title={"Really want to move Echo to Trash?"}
          data={echo}
          open={trashEchoModal}
          close={this.onEchoTrashClose}
          confirm={this.onEchoTrashConfirm}
        />
      </div>
    );
  }
}


export default EchosCell;
