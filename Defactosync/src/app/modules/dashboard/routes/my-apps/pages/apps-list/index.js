import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import ContainerHeader from "components/ContainerHeader";
import SearchBox from "components/SearchBox";
import NewConnectionDialog from "./components/newConnectionDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import AppsList from "./components/appsList";
import IntlMessages from "../../../../../../../util/IntlMessages";
import { CONNECTIONS_URLS } from "constants/AppConst";
import { showErrorToaster, compareValues } from "appUtility/commonFunction";
import { httpClient } from "appUtility/Api";

class AppsContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      searchBox: "",
      open: false,
      countList: [],
    };
  }

  componentWillMount() {
    document.title = 'FormSync - MyApps';
    try {
      this.setState({
        isLoading: true,
      });
      httpClient
        .get(CONNECTIONS_URLS.GET_ALL_CONNECTION)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              countList: res.data.data.sort(compareValues("apiName")),
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  }

  onSearchBoxSelect = () => {
    this.setState({
      searchBox: !this.state.searchBox,
    });
  };

  updateSearchText = (evt) => {
    this.setState({
      searchText: evt.target.value,
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { countList, isLoading, searchText } = this.state;

    let updatedList = [...countList];
    if (searchText && searchText.search("[\\[\\]?*+|{}\\\\()@.\n\r]") === -1) {
      updatedList = countList.filter((echo) => {
        return echo.apiName.toLowerCase().match(searchText.toLowerCase());
      });
    }
    return (
      <div className="dashboard animated slideInUpTiny animation-duration-3 apps-list-page">
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="sidebar.myApps" />}
        />
        {/* Content Section */}
        <Card className="shadow border-0">
          <CardHeader>
            <div className="d-flex justify-content-between">
              <SearchBox
                className=""
                placeholder="Search apps"
                onChange={this.updateSearchText.bind(this)}
                value={this.state.searchText}
              />
              <Button
                variant="contained"
                className="btn btn-lg btn-primary"
                color="primary"
                onClick={() => this.setState({ open: true })}
              >
                Add Connection
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {isLoading && (
              <div id="appsListLoader" className="loader-view">
                <CircularProgress />
              </div>
            )}

            {!isLoading && <AppsList countList={updatedList} />}
          </CardBody>
        </Card>
        <NewConnectionDialog
          open={this.state.open}
          closedialog={this.handleRequestClose.bind(this)}
        />
      </div>
    );
  }
}
NewConnectionDialog.propTypes = {
  countList: PropTypes.any,
};

export default AppsContainer;
