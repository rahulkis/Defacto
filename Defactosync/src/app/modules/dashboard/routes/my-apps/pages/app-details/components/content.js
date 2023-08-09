import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Widget from "components/Widget/index";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Connection from "./connection";
import Echo from "./echo";

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

class Content extends React.Component {
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
    const { theme ,cliType} = this.props;    
    return (
      <Widget styleName="jr-card-full jr-card-tabs-right jr-card-profile">
        <div className="jr-tabs-classic">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
          >
            <Tab className="tabs" label="Connections" />
            <Tab className="tabs" label="Echos" />
          </Tabs>
          <div className="jr-tabs-content jr-task-list">
            <div className="row">
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={this.state.value}
                onChangeIndex={this.handleChangeIndex}
              >
                <TabContainer dir={theme.direction}>
                  {this.state.value === 0 && <Connection cliType={cliType} handleChangeIndex={this.handleChangeIndex}/>}
                </TabContainer>
                <TabContainer dir={theme.direction}>
                {this.state.value === 1 && <Echo cliType={cliType}/>}
                </TabContainer>
              </SwipeableViews>
            </div>
          </div>
        </div>
      </Widget>
    );
  }
}
Content.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withStyles(null, { withTheme: true })(Content);
