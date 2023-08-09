import React from "react";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "../../../../../util/IntlMessages";

import SelectApps from './components/selectApps';

class Main extends React.Component {
  constructor(prop) {
    super();
    this.state = {};
  }
  componentDidMount(){
    document.title = 'FormSync - Admin Dashboard';
  }

  render() {
    return (
      <div className="dashboard animated slideInUpTiny animation-duration-3">
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="sidebar.dashboard" />}
        />
        <SelectApps/>
      </div>
    );
  }
}

export default Main;
