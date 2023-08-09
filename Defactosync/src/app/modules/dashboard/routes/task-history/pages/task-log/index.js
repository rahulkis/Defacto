import React from "react";
import ContainerHeader from "components/ContainerHeader";
import queryString from "query-string";

class TaskLog extends React.Component {
  constructor(prop) {
    super();
    this.state = {};
  }

  render() {
    const parsed = queryString.parse(window.location.search);
    console.log("echoId from query string", parsed);
    return (
      <div className="dashboard animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={this.props.match} title={"Task Log"} />
      </div>
    );
  }
}

export default TaskLog;
