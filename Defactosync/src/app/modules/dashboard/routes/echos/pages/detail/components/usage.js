import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Widget from "components/Widget/index";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Status from "./status";
import Task from "./task";

const optionsList = [
  { value: "Current Billing Period", label: "Current Billing Period" },
  { value: "Last 30 days", label: "Last 30 days" },
];

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

class Usage extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  render() {
    const { theme } = this.props;   
    return (
      <div className="echos-detail-page-usage">
        <Widget styleName="jr-card-full jr-card-tabs-right jr-card-profile">
          <div className="jr-tabs-classic">
            <div className="row">
              <div className="col-md-8">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="on"
                >
                  <Tab className="tabs" label="Statuses" />
                  <Tab className="tabs" label="Tasks" />
                </Tabs>
              </div>
              <div className="col-md-4 mt-1">
                {" "}
                <Select
                multiple={true}
                  options={optionsList}
                  multi={true}
                  // onChange={(value) =>
                  //   this.handleActionChange(value, selectedEcho)
                  // }
                />
              </div>
            </div>

            <div className="jr-tabs-content jr-task-list">
              <div className="row">
                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={this.state.value}
                  onChangeIndex={this.handleChangeIndex}
                >
                  <TabContainer dir={theme.direction}>
                    <Status />
                  </TabContainer>
                  <TabContainer dir={theme.direction}>
                    <Task />
                  </TabContainer>
                </SwipeableViews>
              </div>
            </div>
          </div>
        </Widget>
      </div>
    );
  }
}
Usage.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withStyles(null, { withTheme: true })(Usage);
