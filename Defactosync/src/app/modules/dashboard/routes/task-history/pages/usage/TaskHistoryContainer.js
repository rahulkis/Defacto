import React from "react";
import { connect } from "react-redux";
import SearchBox from "components/SearchBox";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Button from "@material-ui/core/Button";
import Widget from "components/Widget/index";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import Select from "react-select";
import TaskUsage from "./TaskUsage";

import {
  APPS_LIST_URL,
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  ECHO_URLS,
} from "constants/AppConst";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import { fetchAllPockets, fetchAllEchos } from "actions/index";

function TabContainer({ children, dir }) {
  return (
    <div dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class TaskHistoryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      appsList: [],
      taskEchoes: [],
      searchQuery: "",
      isLoading: false,
      selectedAppOption: null,
      selectedFolderOption: null,
      selectedEchoOption: null,
      applyDateRangeFilter: false,
      startDate: moment(),
      endDate: moment(),
    };
  }

  componentDidMount() {
    const { fetchAllPockets, fetchAllEchos } = this.props;
    fetchAllPockets();
    fetchAllEchos();
    this.getAllApps();
    this.getTaskEchos();
  }

  getAllApps = () => {
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
            });
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  getTaskEchos = () => {
    this.setState({ isLoading: true });
    try {
      httpClient
        .post(ECHO_URLS.GET_ON_STATE_ECHOS)
        .then((res) => {
          if (res.data.statusCode === 200) {
            this.setState({
              taskEchoes: res.data.data,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({ isLoading: false });
      showErrorToaster(error);
    }
  };

  handleAppChange = (selectedAppOption) => {
    this.setState({ selectedAppOption });
  };

  customFilterApps(option, searchText) {
    if (option.data.appName.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  handleFolderChange = (selectedFolderOption) => {
    this.setState({ selectedFolderOption });
  };

  handleEchoChange = (selectedEchoOption) => {
    this.setState({ selectedEchoOption });
  };

  handleDateRange = (event, picker) => {
    this.setState({
      applyDateRangeFilter: true,
      startDate: moment(picker.startDate),
      endDate: moment(picker.endDate),
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  handleClearFilter = () => {
    this.setState({
      selectedAppOption: null,
      selectedFolderOption: null,
      selectedEchoOption: null,
      applyDateRangeFilter: false,
      endDate: null,
      startDate: null,
      searchQuery: "",
    });
  };

  searchEcho = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  render() {
    const { theme, allPockets, allEchos } = this.props;
    const {
      appsList,
      searchQuery,
      selectedAppOption,
      selectedFolderOption,
      selectedEchoOption,
      startDate,
      endDate,
      taskEchoes,
      isLoading,
      applyDateRangeFilter,
    } = this.state;

    let pockets = [{ label: "All Echos", value: 0 }];
    allPockets.forEach((ele) => {
      pockets.push({ label: ele.title, value: ele.id });
    });

    let echos = [];
    allEchos.forEach((ele) => {
      echos.push({ label: ele.title, value: ele.id });
    });

    let filteredEcho = [...taskEchoes];

    //Date Range filter
    if (filteredEcho && filteredEcho.length && applyDateRangeFilter) {
      filteredEcho = filteredEcho.filter(
        (echo) =>
          echo.lastLiveAt <= endDate.unix() &&
          echo.lastLiveAt >= startDate.unix()
      );
    }

    //app filter
    if (filteredEcho && filteredEcho.length && selectedAppOption) {
      filteredEcho = filteredEcho.filter((echo) =>
        echo.nodes.find(
          (node) => node.selectedCLI === selectedAppOption.cliName
        )
      );
    }

    //folder filter
    if (
      filteredEcho &&
      filteredEcho.length &&
      selectedFolderOption &&
      selectedFolderOption.value !== 0
    ) {
      filteredEcho = filteredEcho.filter((echo) =>
        echo.pocketIds.includes(selectedFolderOption.value)
      );
    }

    //echo filter
    if (filteredEcho && filteredEcho.length && selectedEchoOption) {
      filteredEcho = filteredEcho.filter(
        (echo) => echo.id === selectedEchoOption.value
      );
    }

    if (searchQuery.replace(/\s/g, "").length) {
      filteredEcho = filteredEcho.filter((echo) => {
        return (
          echo.title.toLowerCase().search(searchQuery.toLowerCase()) !== -1
        );
      });
    }

    return (
      <div>
        <div className="row mb-md-3">
          <div className="col-xl-12">
            <div className="jr-card" style={{ marginBottom: "0px" }}>
              <div className="jr-card-header d-flex align-items-center">
                <h3 className="mb-0 font-weight-bold">Echo History</h3>
                <div className="ml-auto">
                  <span>
                    <SearchBox
                      className="border border-primary"
                      placeholder="Search Echo "
                      onChange={this.searchEcho}
                      value={this.state.searchQuery}
                    />
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <h4>Date Range</h4>
                  {startDate && endDate && (
                    <DateRangePicker
                      onApply={this.handleDateRange}
                      initialSettings={{
                        startDate: startDate,
                        endDate: endDate,
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        style={{ lineHeight: "1.8" }}
                      />
                    </DateRangePicker>
                  )}
                  {!startDate && !endDate && (
                    <DateRangePicker onApply={this.handleDateRange}>
                      <input
                        type="text"
                        className="form-control"
                        style={{ lineHeight: "1.8" }}
                      />
                    </DateRangePicker>
                  )}
                </div>
                <div className="col-md-4">
                  <h4>Folder</h4>
                  <Select
                    value={selectedFolderOption}
                    width="220px"
                    onChange={this.handleFolderChange}
                    options={pockets}
                    isSearchable={true}
                    isClearable={true}
                    placeholder={
                      <div>
                        <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                        &nbsp;All folders
                      </div>
                    }
                  />
                </div>
                <div className="col-md-4">
                  <h4>Apps</h4>
                  <Select
                    value={selectedAppOption}
                    onChange={this.handleAppChange}
                    filterOption={this.customFilterApps}
                    isSearchable={true}
                    options={appsList}
                    isClearable={true}
                    placeholder={
                      <div>
                        <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                        &nbsp; All apps
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-4">
                  <h4>Echos</h4>
                  <Select
                    value={selectedEchoOption}
                    onChange={this.handleEchoChange}
                    options={echos}
                    isSearchable={true}
                    isClearable={true}
                    placeholder={
                      <div>
                        <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                        &nbsp;All echos
                      </div>
                    }
                  />
                </div>
                {/* <div className="col-md-1">
                  <CachedIcon fontSize="large" style={{ marginTop: "30px" }} />
                </div> */}
                <div className="col-md-2">
                  <Button
                    style={{ padding: "9px 25px", marginTop: "30px" }}
                    className="btn  btn-sm"
                    variant="contained"
                    color="primary"
                    onClick={this.handleClearFilter}
                  >
                    CLEAR ALL FILTERS
                  </Button>
                </div>
              </div>
            </div>

            <Widget className="jr-card-full jr-card-tabs-right jr-card-profile">
              <div className="jr-tabs-classic">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="on"
                >
                  <Tab className="tabs" label="Task Usage" />
                  {/* <Tab className="tabs" label="Echo runs" /> */}
                </Tabs>
                <div className="jr-tabs-content jr-task-list">
                  <div className="row">
                    <div className="col-md-12">
                      <SwipeableViews
                        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                        index={this.state.value}
                        onChangeIndex={this.handleChangeIndex}
                      >
                        <TabContainer
                          dir={theme.direction}
                          style={{ padding: "0px" }}
                        >
                          {this.state.value === 0 && !isLoading && (
                            <TaskUsage taskEchoes={filteredEcho} />
                          )}
                        </TabContainer>
                        {/* <TabContainer dir={theme.direction}>
                          {this.state.value === 1 && <EchoRun />}
                        </TabContainer> */}
                      </SwipeableViews>
                    </div>
                  </div>
                </div>
              </div>
              {isLoading && (
                <div id="profileLoader" className="loader-view">
                  <CircularProgress />
                </div>
              )}
            </Widget>
          </div>
        </div>
      </div>
    );
  }
}

TaskHistoryContainer.propTypes = {
  theme: PropTypes.object.isRequired,
};
const mapStateToProps = ({ pockets, echo }) => {
  const { allPockets, selectedPocket } = pockets;
  const { allEchos } = echo;
  return { allPockets, selectedPocket, allEchos };
};
export default withStyles(null, { withTheme: true })(
  connect(mapStateToProps, { fetchAllPockets, fetchAllEchos })(
    TaskHistoryContainer
  )
);
