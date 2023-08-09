import React, { Component } from "react";
import PropTypes from "prop-types";

export default class BlockAction extends Component {
  static propTypes = {
    item: PropTypes.shape({
      key: PropTypes.string.isRequired,
      icon: PropTypes.func.isRequired,
      action: PropTypes.func.isRequired,
    }),
  };

  render() {
    const Icon = this.props.item.icon;
    return (
      <li className="block__action" onClick={this.props.item.action}>
        <a
          href="#pablo#"
          data-toggle="tooltip"
          title="Remove Group"
          data-placement="top"
        >
          <Icon className="block__action__icon" />
        </a>
      </li>
    );
  }
}
