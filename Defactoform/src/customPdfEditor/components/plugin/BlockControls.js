import React, { Component } from "react";

export default class BlockControls extends Component {
  constructor() {
    super();
    this.copyBlock = this.copyBlock.bind(this);
  }

  copyBlock() {
    this.props.copyBlock();
  }
  render() {
    return (
      <div className="group-menu">
        {this.props.children.props.groupCounter && (
          <div className="group-menu-inner">
            GROUP {this.props.children.props.groupCounter}
            <i
              className="fa fa-copy group-copy-icon"
              onClick={this.copyBlock}
              title="Copy"
            />
            <div className="block__controls">{this.props.children}</div>
          </div>
        )}
      </div>
    );
  }
}
