import React from "react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import Auxiliary from "../../../../../../../appUtility/Auxiliary";
import ContainerHeader from "components/ContainerHeader";
import Header from "./components/header";
import Content from "./components/content";

class AppDetails extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      value: 0,
      isLoading: false,
      cliType:null
    };
  }

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    console.log(query);
    console.log(this.props.match);
    if (this.props.match.params && this.props.match.params.connectionType) {
      const appType = this.props.match.params.connectionType;
      console.log(appType);
      this.setState({cliType:appType})      
    } else {
      this.props.history.push("/");
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  render() {
    const { isLoading,cliType } = this.state;   
    return (
      <div className="apps-detail">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
      
                <ContainerHeader match={this.props.match} title={"App Details"} />
        </div>

        {!isLoading && (
          <Auxiliary>
            <Header cliType={cliType}/>
            <div className="jr-profile-content">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                  <Content cliType={cliType}/>
                </div>
              </div>
            </div>
          </Auxiliary>
        )}
        {isLoading && (
          <div id="profileLoader" className="loader-view">
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

AppDetails.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withStyles(null, { withTheme: true })(AppDetails);
