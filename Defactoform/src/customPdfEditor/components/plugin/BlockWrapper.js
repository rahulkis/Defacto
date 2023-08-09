/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 *
 * License: MIT
 */

import React, {Component} from "react";


export default class BlockWrapper extends Component {
  render() {
    let ImageClass = this.props.ImageClass?" "+this.props.ImageClass:"";
    return (
      <div className="block__hover">
        
        <div className={"block__wrapper"+ImageClass}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
