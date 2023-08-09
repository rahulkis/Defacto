import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import EchosList from "./components/echosList";
import AddFolder from "./components/addFolder";
import Snackbar from "@material-ui/core/Snackbar";
import CustomScrollbars from "util/CustomScrollbars";
import IntlMessages from "util/IntlMessages";
import Button from "@material-ui/core/Button";
import { httpClient } from "../../../../../../../appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Menubar from "./components/menuBar";
import {
  ECHO_URLS,
  POCKETS_URLS,
} from "../../../../../../../constants/AppConst";
import Divider from "@material-ui/core/Divider";
import { ToastsStore } from "react-toasts";
import DeleteIcon from "@material-ui/icons/Delete";
import { showErrorToaster } from "appUtility/commonFunction";
import FolderIcon from "@material-ui/icons/Folder";
import AddIcon from "@material-ui/icons/Add";
import { connect } from "react-redux";
import {
  fetchAllPockets,
  updateSelectedPocket,
  fetchAllEchos,
  updateCheckedEchos,
  updateEchoData,
  updateSelectedEchoList,
} from "actions/index";
import AlertDialog from "components/Dialogs/AlertDialog";

class List extends Component {
  constructor() {
    super();
    this.state = {
      noContentFoundMessage: "No Result found",
      alertMessage: "",
      showMessage: false,
      drawerState: false,
      allEchos: [],
      echosList: [],
      selectedEchos: 0,
      addFolderState: false,
      renameEchoModal: false,
      selectedPocketId: "",
      allPocketsSelected: true,
      trashPocketSelected: false,
      searchQuery: "",
      activePocket: "active",
      checkAllEchos: false,
      trashEchoModal: false,
      pocketName: "All Echos",
      isAllChecked: false,
    };
  }

  componentDidMount() {
    document.title = "FormSync - EchoList";
    const { fetchAllPockets, fetchAllEchos } = this.props;
    fetchAllPockets();
    fetchAllEchos();
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, trashPocketSelected } = this.state;
    const {
      selectedPocket,
      allEchos,
      updateSelectedEchoList
    } = this.props;
    let updatedList = [...allEchos];

    if (
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.trashPocketSelected !== this.state.trashPocketSelected ||
      prevProps.selectedPocket !== this.props.selectedPocket
    ) {
      if (trashPocketSelected) {
        updatedList = updatedList.filter((echo) => {
          return echo.isTrashed === true;
        });
      } else {
        updatedList = updatedList.filter((echo) => {
          return echo.isTrashed === false;
        });
      }
      if (selectedPocket) {
        updatedList = updatedList.filter((echo) => {
          if (echo.pocketIds.length) {
            return echo.pocketIds[0] === selectedPocket.id;
          }
        });
      }
      if (searchQuery && searchQuery.search("[\\[\\]?*+|{}\\\\()@.\n\r]") === -1) {
        updatedList = updatedList.filter((echo) => {
          return (
            echo.title.toLowerCase().search(searchQuery.toLowerCase()) !== -1
          );
        });
      }

      updatedList.sort(function (a, b) {
        return b.updatedAt - a.updatedAt;
      });
      updateSelectedEchoList(updatedList);
    }
  }

  SideBar = (pockets, trashPocketSelected, allEchos) => {
    const { selectedPocket } = this.props;
    return (
      <div className="module-side echo-list-sidebar-wrapper">
        <div className="module-side-header">
          <div className="module-logo">
            <span className="echo-sidebar-title">
              <IntlMessages id="sidebar.echos" />
            </span>
          </div>
        </div>
        <div className="module-side-content">
          <CustomScrollbars
            className="module-side-scroll scrollbar"
            style={{
              height:
                this.props.width >= 1200
                  ? "calc(100vh - 200px)"
                  : "calc(100vh - 231px)",
            }}
          >
            <div className="module-add-task" style={{ padding: "24px 50px" }}>
              <Button
                className="btn  btn-sm"
                variant="contained"
                color="primary"
                aria-label="add"
                onClick={(e) => this.onAddFolder(null)}
              >
                <AddIcon />
                <span>
                  <IntlMessages id="echos.allNewPocket" />
                </span>
              </Button>
            </div>
            <div className="module-side-nav" style={{ padding: "0px 10px" }}>
              <ul className="module-nav">
                <li className="nav-item">
                  <span
                    className={`jr-link ${selectedPocket === ""
                        ? trashPocketSelected
                          ? ""
                          : "active"
                        : ""
                      }`}
                  >
                    <FolderIcon style={{ padding: "2px 0px" }} />
                    <span
                      className="ml-2"
                      onClick={(e) => this.handleAllEchosFilter()}
                    >
                      <IntlMessages id="echos.allEchos" /> (
                      {allEchos.filter((echo) => echo.isTrashed === false)
                        .length || 0}
                      )
                    </span>
                  </span>
                </li>

                {pockets.map((pocket) => (
                  <Tooltip title={pocket.title}>
                    <li key={pocket.id} className="nav-item">
                      <span
                        className={`jr-link ${pocket.id === selectedPocket.id ? "active" : ""
                          }`}
                      >
                        <FolderIcon style={{ padding: "2px 0px" }} />
                        <span
                          className="ml-2 pocket-name"
                          onClick={(e) =>
                            this.handlePocketFilter(pocket, allEchos)
                          }
                        >
                          {pocket.title}
                        </span>

                        <span style={{ padding: "0px 5px" }}>
                          (
                          {allEchos.filter(
                            (echo) =>
                              echo.isTrashed === false &&
                              echo.pocketIds[0] === pocket.id
                          ).length || 0}
                          ){" "}
                        </span>

                        <Menubar
                          pocket={pocket}
                          onAddFolder={this.onAddFolder}
                          onDeleteFolder={this.onDeleteFolder}
                        />
                      </span>
                    </li>
                  </Tooltip>
                ))}
                <Divider className="mb-3" />
                <li className="nav-item">
                  <span
                    className={`jr-link ${trashPocketSelected ? "active" : ""}`}
                    style={{ paddingLeft: "26px" }}
                  >
                    <DeleteIcon />
                    <span
                      className="ml-2"
                      onClick={(e) => this.handleTrashFilter()}
                    >
                      <IntlMessages id="echos.trash" /> (
                      {allEchos.filter((echo) => echo.isTrashed === true)
                        .length || 0}
                      )
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </CustomScrollbars>
        </div>
      </div>
    );
  };

  handlePocketFilter = (pocket) => {
    let echoes = this.props.selectedEchosList;
    echoes.forEach((echo) => (echo.isChecked = false));
    this.props.updateSelectedPocket(pocket);
    this.props.updateCheckedEchos([]);
    this.setState({
      trashPocketSelected: false,
      isAllChecked: false,
    });
  };

  handleMultipleTrash = () => {
    const { selectedEchosList } = this.props;
    const checkedEchos = selectedEchosList.filter((echo) => {
      return echo.isChecked === true;
    });
    if (checkedEchos.length) {
      this.setState({ trashEchoModal: true });
    } else {
      ToastsStore.error("Please select atleast one echo");
    }
  };

  onEchoTrashClose = () => {
    this.setState({ trashEchoModal: false });
  };

  onEchoTrashConfirm = (data) => {
    this.setState({ isAllChecked: false });
    try {
      const { selectedEchosList } = this.props;
      const checkedEchos = selectedEchosList
        .filter((echo) => {
          return echo.isChecked === true;
        })
        .map((trashEchos) => {
          return trashEchos.id;
        });

      if (checkedEchos.length) {
        let body = {
          ids: checkedEchos,
          isTrashed: true,
        };

        httpClient
          .post(ECHO_URLS.TRASH_MULTIPLE_ECHO_BY_IDS, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              this.props.fetchAllEchos();
              ToastsStore.success("Echos moved to Trash");
            }
          })
          .catch((err) => {
            showErrorToaster(err);
          });
      } else {
        ToastsStore.error("Please select atleast one echo");
      }
    } catch (error) {
      showErrorToaster(error);
    }
  };

  handleAllEchosFilter = () => {
    let echoes = this.props.selectedEchosList;
    echoes.forEach((echo) => (echo.isChecked = false));
    this.props.updateSelectedPocket("");
    this.props.updateCheckedEchos([]);
    this.setState({
      trashPocketSelected: false,
      isAllChecked: false,
    });
  };

  handleTrashFilter = () => {
    let echoes = this.props.selectedEchosList;
    echoes.forEach((echo) => (echo.isChecked = false));

    this.props.updateSelectedPocket("");
    this.props.updateCheckedEchos([]);
    this.setState({
      trashPocketSelected: true,
      isAllChecked: false,
    });
  };

  onDeleteFolder = (pocket) => {
    try {
      httpClient
        .delete(POCKETS_URLS.DELETE_POCKET_BY_ID + pocket.id)
        .then((res) => {
          if (res.data.statusCode === 200) {
            this.props.fetchAllPockets();
            this.props.updateSelectedPocket("");
            ToastsStore.success("Pocket Deleted");
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  onAddFolder = (option) => {
    if (option) {
      this.props.updateSelectedPocket(option);
    } else {
      this.props.updateSelectedPocket("");
    }

    this.setState({ addFolderState: true });
  };

  onFolderClose = () => {
    this.setState({ addFolderState: false });
    this.props.updateSelectedPocket("");
  };

  onSaveFolder = (data) => {
    const { selectedPocket } = this.props;

    try {
      let body;
      if (selectedPocket) {
        body = {
          id: selectedPocket.id,
          createdBy: selectedPocket.createdBy,
          createdAt: selectedPocket.createdAt,
          userId: selectedPocket.userId,
          title: data.title,
          description: data.description ? data.description : "",
          echoes: selectedPocket.echoes ? selectedPocket.echoes : [],
          method: "update",
        };
      } else {
        body = {
          title: data.title,
          description: data.description ? data.description : "",
          method: "create",
          echoes: [],
        };
      }

      httpClient
        .post(POCKETS_URLS.ADD_UPDATE_POCKET, body)
        .then((res) => {
          if (res.data.statusCode === 200) {
            this.props.fetchAllPockets();
            ToastsStore.success("Pocket Updated");
            this.props.updateSelectedPocket("");
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  handleRequestClose = () => {
    this.setState({
      showMessage: false,
    });
  };

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState,
    });
  }

  handleAllEchosSelect = (event) => {
    let echoes = this.props.selectedEchosList;
    echoes.forEach((echo) => (echo.isChecked = event.target.checked));
    this.setState({ isAllChecked: event.target.checked });
  };

  handleCheckState = (event, echoId) => {
    let echoes = this.props.selectedEchosList;
    echoes.forEach((echo) => {
      if (echo.id === echoId) echo.isChecked = event.target.checked;
    });
    let checker = (arr) => arr.every((x) => x.isChecked === true);
    this.setState({ isAllChecked: checker(echoes) });
  };

  searchEcho = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  render() {
    const {
      addFolderState,
      alertMessage,
      showMessage,
      searchQuery,
      noContentFoundMessage,
      trashPocketSelected,
      trashEchoModal,
    } = this.state;
    const {
      allPockets,
      fetchAllEchos,
      updateEchoData,
      selectedPocket,
      allEchos,
      loader,
      selectedEchosList
    } = this.props;

    let updatedList = [...selectedEchosList];

    if (trashPocketSelected) {
      updatedList = updatedList.filter((echo) => {
        return echo.isTrashed === true;
      });
    } else {
      updatedList = updatedList.filter((echo) => {
        return echo.isTrashed === false;
      });
    }

    if (selectedPocket) {
      updatedList = updatedList.filter((echo) => {
        if (echo.pocketIds.length) {
          return echo.pocketIds[0] === selectedPocket.id;
        }
      });
    }
    if (searchQuery && searchQuery.search("[\\[\\]?*+|{}\\\\()@.\n\r]") === -1) {
      updatedList = updatedList.filter((echo) => {
        return (
          echo.title.toLowerCase().search(searchQuery.toLowerCase()) !== -1
        );
      });
    }

    updatedList.sort(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });

    return (
      <div className="app-wrapper echos-list-page">
        <div className="app-module animated slideInUpTiny animation-duration-3">
          <div className="d-block d-xl-none">
            <Drawer
              open={this.state.drawerState}
              onClose={this.onToggleDrawer.bind(this)}
            >
              {this.SideBar(allPockets, trashPocketSelected, allEchos)}
            </Drawer>
          </div>
          <div className="app-module-sidenav d-none d-xl-flex">
            {this.SideBar(allPockets, trashPocketSelected, allEchos)}
          </div>

          <div className="module-box echo-list-content-wrapper">
            <div className="module-box-header">
              <IconButton
                className="drawer-btn d-block d-xl-none"
                aria-label="Menu"
                onClick={this.onToggleDrawer.bind(this)}
              >
                <i className="zmdi zmdi-menu" />
              </IconButton>
              <div className="module-box-header-inner">
                <div className="search-bar right-side-icon bg-transparent d-none d-sm-block">
                  <div className="form-group">
                    <input
                      className="form-control border-0"
                      type="search"
                      placeholder="Filter Echos..."
                      onChange={this.searchEcho}
                    />
                    <button className="search-icon">
                      <i className="zmdi zmdi-search zmdi-hc-lg" />
                    </button>
                  </div>
                </div>
                {!trashPocketSelected && (
                  <Link to="/editor/new-echo">
                    <Button
                      className="jr-btn btn-sm float-right"
                      variant="contained"
                      color="primary"
                    >
                      <IntlMessages id="echos.createEcho" />
                    </Button>
                  </Link>
                )}
                <div className="d-inline-block d-sm-none"></div>
              </div>
            </div>
            <div className="module-box-content">
              <div className="module-box-topbar">
                {!trashPocketSelected && (
                  <>
                    <Checkbox
                      color="primary"
                      checked={this.state.isAllChecked}
                      value="checkedall"
                      onChange={this.handleAllEchosSelect}
                    />

                    <IconButton
                      className="icon-btn"
                      onClick={this.handleMultipleTrash}
                    >
                      <i className="zmdi zmdi-delete" />
                    </IconButton>
                  </>
                )}

                <span className="m-4 font-weight-bold">
                  {selectedPocket === ""
                    ? trashPocketSelected
                      ? "Trash"
                      : "All Echos"
                    : selectedPocket.title}
                </span>
              </div>
              {loader && (
                <div className="echos-list-loader">
                  <CircularProgress />
                </div>
              )}
              <CustomScrollbars
                className="module-list-scroll scrollbar"
                style={{
                  height:
                    this.props.width >= 1200
                      ? "calc(100vh - 265px)"
                      : "calc(100vh - 245px)",
                }}
              >
                {!updatedList.length && !loader ? (
                  <div className="h-100 d-flex align-items-center justify-content-center">
                    {noContentFoundMessage}
                  </div>
                ) : (
                  <EchosList
                    trashPocketSelected={trashPocketSelected}
                    echosList={updatedList}
                    handleCheckState={this.handleCheckState}
                    allPockets={allPockets}
                    updateEchoData={updateEchoData}
                    fetchAllEchos={fetchAllEchos}
                    updateCheckedEchos={updateCheckedEchos}
                  />
                )}
              </CustomScrollbars>
            </div>
          </div>
        </div>

        <AddFolder
          open={addFolderState}
          folder={{
            title: selectedPocket ? selectedPocket.title : "",
            description: selectedPocket ? selectedPocket.description : "",
          }}
          onSaveFolder={this.onSaveFolder}
          onFolderClose={this.onFolderClose}
        />
        <AlertDialog
          data={""}
          title={"Really want to move Echo to Trash?"}
          open={trashEchoModal}
          close={this.onEchoTrashClose}
          confirm={this.onEchoTrashConfirm}
        />

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={showMessage}
          autoHideDuration={3000}
          onClose={this.handleRequestClose}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{alertMessage}</span>}
        />
      </div>
    );
  }
}
const mapStateToProps = ({ pockets, echo }) => {
  const { allPockets, selectedPocket } = pockets;
  const { allEchos, loader, checkedEchos, selectedEchosList } = echo;
  return {
    allPockets,
    selectedPocket,
    allEchos,
    loader,
    checkedEchos,
    selectedEchosList,
  };
};

export default connect(mapStateToProps, {
  fetchAllPockets,
  updateSelectedPocket,
  fetchAllEchos,
  updateCheckedEchos,
  updateSelectedEchoList,
  updateEchoData,
})(List);
