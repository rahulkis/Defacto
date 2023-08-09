import React, { Component } from "react";
import PropTypes from "prop-types";

import BlockAction from "./BlockAction";

export default class BlockActionGroup extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        icon: PropTypes.func.isRequired,
        action: PropTypes.func.isRequired
      })
    )
  };

  renderItem(item) {
    return <BlockAction item={item} key={item.key} />;
  }

  render() {
    return (
      <div>
        <ul className="block__action-group">
          {this.props.items.map(this.renderItem)}
        </ul>
      </div>
    );
  }
}
