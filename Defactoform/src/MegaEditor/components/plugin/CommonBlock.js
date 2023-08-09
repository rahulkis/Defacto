import React, { Component } from "react";
import { BlockActionGroup, BlockControls, BlockWrapper } from "../plugin";

export default class CommonBlock extends Component {
  constructor(props) {
    super(props);

    this._handleDisplayChange = this._handleDisplayChange.bind(this);
    this.copyBlock = this.copyBlock.bind(this);
  }

  _handleDisplayChange(newValue) {
    this.props.container.updateData({ display: newValue });
  }
  copyBlock() {
    this.props.addNewBlock();
  }
  render() {
    this.props.data.counter === undefined
      ? localStorage.setItem("grpCounter", localStorage.getItem("grpCounter"))
      : localStorage.setItem(
          "grpCounter",
          parseInt(localStorage.getItem("grpCounter")) + 1
        );
    const groupCounter =
      this.props.data.counter === undefined
        ? this.props.data.counter
        : localStorage.getItem("grpCounter");

    return (
      <div>
        <BlockWrapper ImageClass={this.props.ImageClass}>
          <BlockControls copyBlock={this.copyBlock}>
            <BlockActionGroup
              items={this.props.actions}
              groupCounter={groupCounter}
            />
          </BlockControls>

          {this.props.children}
        </BlockWrapper>
      </div>
    );
  }
}
