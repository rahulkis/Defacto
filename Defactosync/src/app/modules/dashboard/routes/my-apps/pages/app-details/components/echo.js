import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import CircularProgress from "@material-ui/core/CircularProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowRightTwoToneIcon from "@material-ui/icons/ArrowRightTwoTone";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import Button from "@material-ui/core/Button";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import {
  CONNECTIONS_URLS,
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  ECHO_URLS,
  APPS_LIST_URL,
} from "constants/AppConst";
import { httpClient } from "appUtility/Api";
import { updateSelectedConnection } from "actions/index";
import { showErrorToaster } from "appUtility/commonFunction";

const selectOptions = [
  { value: "Alphabetical A-Z", label: "Alphabetical A-Z" },
  { value: "Alphabetical Z-A", label: "Alphabetical Z-A" },
];

const statusOptions = [
  { value: "All", label: "All" },
  { value: "On", label: "On" },
  { value: "Off", label: "Off" },
];

class Echo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      appsList: [],
      allEchos: [],
      isLoading: true,
      showFilters: false,
      selectedSortOption: null,
      selectedStatusOption: null,
      selectedConnection: null,
      selectedAppOption: null,
      applyDateRangeFilter: false,
      startDate: moment(),
      endDate: moment(),
    };
  }

  componentDidMount() {
    const { selectedConnection } = this.props;
    this.getAppList();
    if (selectedConnection === "") {
      this.getAppConnectionsList();
    } else {
      this.getConnectionEchoes(selectedConnection);
    }
  }

  getAppList = () => {
    try {
      httpClient
        .get(APPS_LIST_URL)
        .then((res) => {
          if (res.status === 200) {
            const data = [...res.data.data];
            let appsArray = [];
            for (let app of data) {
              const appData = {
                ...app,
                label: (
                  <div>
                    <img
                      height="30"
                      width="30"
                      src={
                        APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + app.imageName
                      }
                      alt="syncImage"
                    ></img>
                    &nbsp;{app.appName}
                  </div>
                ),
                value: app.id,
              };
              appsArray.push(appData);
            }
            this.setState({
              appsList: appsArray,
              //isLoading: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  };

  getAppConnectionsList = async () => {
    const { cliType } = this.props;

    try {
      await httpClient
        .get(CONNECTIONS_URLS.GET_ECHOES_BY_CLI + cliType)
        .then(async (res) => {
          if (res.status === 200) {
            let data = res.data.data;
            data = data.filter(x => x.echoInfo.isTrashed === false)
            this.setState({
              allEchos: data,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          showErrorToaster(err);
          this.setState({
            isLoading: false,
          });
        });
    } catch (error) {
      showErrorToaster(error);
      this.setState({
        isLoading: false,
      });
    }
  };

  getConnectionEchoes = (selectedConnection) => {
    try {
      let body = {
        connectionId: selectedConnection.id,
        cliType: selectedConnection.cliType,
      };
      httpClient
        .post(ECHO_URLS.GET_ECHOES_BY_CLITYPE_AND_CONNECTIONID, body)
        .then((res) => {
          if (res.status === 200) {
            let data = res.data.data;
            data = data.filter(x => x.echoInfo.isTrashed === false)
            this.props.updateSelectedConnection("");
            this.setState({
              allEchos: data,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          showErrorToaster(err);
          this.setState({
            isLoading: false,
          });
        });
    } catch (error) {
      showErrorToaster(error);
      this.setState({
        isLoading: false,
      });
    }
  };

  //Add your search logic here.
  customFilterApps(option, searchText) {
    if (option.data.appName.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  handleDateRange = (event, picker) => {
    this.setState({
      applyDateRangeFilter: true,
      startDate: moment(picker.startDate),
      endDate: moment(picker.endDate),
    });
  };

  handleSortChange = (selectedSortOption) => {
    this.setState({ selectedSortOption });
  };

  handleConnectionChange = (selectedConnection) => {
    this.setState({ selectedConnection });
  };

  handleStatusChange = (selectedStatusOption) => {
    this.setState({ selectedStatusOption });
  };

  handleAppChange = (selectedAppOption) => {
    this.setState({ selectedAppOption });
  };

  handleFilter = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  handleClearFilter = () => {
    this.setState({
      selectedStatusOption: null,
      selectedConnection: null,
      selectedAppOption: null,
      applyDateRangeFilter: false,
      endDate: null,
      startDate: null,
    });
  };

  renderConnectionIcons(nodesList) {
    const sortedNodes = nodesList;
    // ? sortArrayWithKey(nodesList, "sortIndex")
    // : [];
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {sortedNodes.length > 0 && (
          <>
            <img
              className="echo-connection-icon"
              height="30"
              width="30"
              src={`${APP_IMAGE_URL}${IMAGE_FOLDER.APP_IMAGES
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
      appsList,
      isLoading,
      showFilters,
      selectedSortOption,
      selectedStatusOption,
      selectedConnection,
      selectedAppOption,
      applyDateRangeFilter,
      startDate,
      endDate,
      allEchos,
    } = this.state;
    const { cliType, connectionsList } = this.props;
    //sorting filter
    if (allEchos && allEchos.length && selectedSortOption) {
      if (selectedSortOption.value === "Alphabetical Z-A") {
        allEchos.sort((a, b) =>
          a.echoInfo.title.toLowerCase() < b.echoInfo.title.toLowerCase()
            ? 1
            : -1
        );
      } else {
        allEchos.sort((a, b) =>
          a.echoInfo.title.toLowerCase() > b.echoInfo.title.toLowerCase()
            ? 1
            : -1
        );
      }
    }

    let connectionNameList = [{ value: "All", label: "All" }];
    connectionsList.map((connection) => {
      if (!connection.connectionName.includes("#")) {
        let obj = {
          value: connection,
          label: connection.connectionName,
        };
        connectionNameList.push(obj);
      } else {
        return;
      }
    });

    let filteredEcho = [...allEchos];
    //status filter
    if (allEchos && allEchos.length && selectedStatusOption) {
      if (selectedStatusOption.value === "All") {
        // filteredEcho = filteredEcho;
      } else if (selectedStatusOption.value === "On") {
        filteredEcho = filteredEcho.filter((option) => {
          return option.echoInfo.state === "on";
        });
      } else {
        filteredEcho = filteredEcho.filter((option) => {
          return option.echoInfo.state === "off";
        });
      }
    }
    //app filter
    if (allEchos && allEchos.length && selectedAppOption) {
      filteredEcho = filteredEcho.filter((echo) =>
        echo.nodes.find(
          (node) => node.selectedCLI === selectedAppOption.cliName
        )
      );
    }

    //connection filter
    if (allEchos && allEchos.length && selectedConnection) {
      if (selectedConnection.label !== "All") {
        filteredEcho = filteredEcho.filter((echo) =>
          echo.nodes.find(
            (node) => node.meta.label === selectedConnection.label
          )
        );
      }
    }

    //Date Range filter
    if (allEchos && allEchos.length && applyDateRangeFilter) {
      filteredEcho = filteredEcho.filter(
        (echo) =>
          echo.echoInfo.updatedAt <= endDate.unix() &&
          echo.echoInfo.updatedAt >= startDate.unix()
      );
    }

    return (
      <div className="apps-detail-body">
        <div className="row">
          <div className="col-md-6">
            <div className="heading mb-2">
              All Echos using {cliType.replace("CLI", "")} (
              {filteredEcho && filteredEcho.length ? filteredEcho.length : 0})
            </div>
            <p className="mb-4">
              Echo Task counts are from the current billing period.
            </p>
          </div>
          <div className="col-md-3">
            {" "}
            <Select
              onChange={this.handleSortChange}
              value={selectedSortOption}
              options={selectOptions}
              placeholder="sort by:"
            />
          </div>
          <div className="col-md-3">
            {" "}
            <Button
              className="btn  btn-sm"
              variant="contained"
              color="primary"
              onClick={this.handleFilter}
            >
              <FilterListOutlinedIcon /> Filter
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="row mt-4 mb-4">
            <div className="col-md-3">
              <div>CONNECTION</div>
              <div>
                <Select
                  value={selectedConnection}
                  options={connectionNameList}
                  onChange={this.handleConnectionChange}
                  placeholder={"All"}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div>LAST CHANGED</div>

              {startDate && endDate && (
                <DateRangePicker
                  onApply={this.handleDateRange}
                  initialSettings={{ startDate: startDate, endDate: endDate }}
                >
                  <input type="text" className="form-control" style={{ lineHeight: "1.8" }} />
                </DateRangePicker>
              )}
              {!startDate && !endDate && (
                <DateRangePicker onApply={this.handleDateRange}>
                  <input type="text" className="form-control" style={{ lineHeight: "1.8" }} />
                </DateRangePicker>
              )}
            </div>
            <div className="col-md-2">
              <div>ECHO STATUS</div>
              <div>
                <Select
                  value={selectedStatusOption}
                  onChange={this.handleStatusChange}
                  options={statusOptions}
                  placeholder={"All"}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div>APPS USED</div>
              <div>
                <Select
                  value={selectedAppOption}
                  options={appsList}
                  isSearchable={true}
                  placeholder={
                    <div>
                      <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                      &nbsp;All Apps
                    </div>
                  }
                  filterOption={this.customFilterApps}
                  onChange={this.handleAppChange}
                />
              </div>
            </div>
            <div className="col-md-2">
              <Button
                style={{ padding: "9px 25px", marginTop: "21px" }}
                className="btn  btn-sm"
                variant="contained"
                color="primary"
                onClick={this.handleClearFilter}
              >
                CLEAR ALL
              </Button>
            </div>
          </div>
        )}

        {!isLoading && (
          <div>
            {filteredEcho && filteredEcho.length ? (
              <div>
                <div>
                  {filteredEcho.map((echo) => (
                    <div key={echo.echoInfo.id} className="card ">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-2" style={{ padding: "15px" }}>
                            {" "}
                            {this.renderConnectionIcons(echo.nodes)}
                          </div>
                          <div className="col-md-6">
                            <h3 className="mb-0 pl-4">{echo.echoInfo.title}</h3>
                            <Button>{echo.echoInfo.state.toUpperCase()}</Button>
                            <span>Last Changed</span>{" "}
                            {moment(
                              moment.unix(echo.echoInfo.updatedAt).format("LLL")
                            ).fromNow()}
                          </div>

                          <div className="col-md-2">
                            <div className="ml-2" style={{ fontWeight: "800" }}>
                              {echo.echoInfo.tasks}
                            </div>
                            <h5>Tasks</h5>
                          </div>

                          <div
                            className="col-md-2"
                            style={{ padding: "12px 70px" }}
                          >
                            <Link to={"/app/echos/" + echo.echoInfo.id}>
                              <MoreHorizOutlinedIcon />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="card"
                  style={{ height: "64px", paddingTop: "11px" }}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">No Echoes Found</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ echo, connections }) => {
  const { selectedConnection, connectionsList } = connections;
  //const { allEchos } = echo;
  return { selectedConnection, connectionsList };
};

export default connect(mapStateToProps, {
  updateSelectedConnection,
})(Echo);
