import React, { Component } from "react";

import CustomIcons from "../../../variables/customIcons";
import insertDataBlock from "megadraft/lib/insertDataBlock";

export default class BreakButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const data = { type: "break", display: "small" };
    this.props.onChange(insertDataBlock(this.props.editorState, data));
    let Content = localStorage.getItem("Content");
    if (Content != null) {
    } else {
    }
  }

  render() {
    return (
      <button
        className={this.props.className}
        type="button"
        onClick={this.onClick}
        title={this.props.title}
      >
        <CustomIcons.BreakIcon className="sidemenu__button__icon" />
      </button>
    );
  }
}
