import React, { Component } from "react";

import { BlockContent, CommonBlock } from "../../components/plugin";

import icons from "megadraft/lib/icons";

import BreakBlockStyle from "./BreakBlockStyle";

export default class BreakBlock extends Component {
  constructor(props) {
    super(props);

    this.actions = [
      {
        key: "delete",
        icon: icons.DeleteIcon,
        action: this.props.container.remove
      }
    ];
  }

  render() {
    return (
      <CommonBlock {...this.props} actions={this.actions}>
        <BlockContent>
          <hr style={BreakBlockStyle.break} alt="" />
        </BlockContent>
      </CommonBlock>
    );
  }
}
