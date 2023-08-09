import React from "react";
export default class Task extends React.Component {
    constructor(prop) {
      super();
    }
    render() {
      return (
        <div className="usage-task">
          <h4>Tasks Count</h4>
          <p>No task found</p>
        </div>
      );
    }
  }
  