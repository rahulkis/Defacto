import React from "react";
import ContainerHeader from "components/ContainerHeader";
import TaskHistoryContainer from "./TaskHistoryContainer";

class Usage extends React.Component {
  constructor(prop) {
    super();
    this.state = {};
  }
  componentDidMount(){
    document.title = 'FormSync - Usage';
  }
  render() {
    return (
      <div className="apps-detail">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          <ContainerHeader match={this.props.match} title={"Usage"} />
          <TaskHistoryContainer />
        </div>
      </div>
    );
  }
}

export default Usage;
