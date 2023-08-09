import React, { Component } from "react";
import {
  BlockContent,
  CommonBlock
} from "../../../MegaEditor/components/plugin";

import icons from "megadraft/lib/icons";
import "../../../assets/custom/image.css";
import CustomImageEditor from "./ImageEditor";

export default class ImageBlock extends Component {
  constructor(props) {
    super(props);

    this._handleCaptionChange = this._handleCaptionChange.bind(this);
    this._handleRightsHolderChange = this._handleRightsHolderChange.bind(this);

    this.actions = [
      {
        key: "delete",
        icon: icons.DeleteIcon,
        action: this.props.container.remove
      }
    ];
  }

  _handleCaptionChange(event) {
    event.stopPropagation();
    this.props.container.updateData({ caption: event.target.value });
  }

  _handleRightsHolderChange(event) {
    event.stopPropagation();
    this.props.container.updateData({ rightsHolder: event.target.value });
  }

  render() {
    return (
      <CommonBlock {...this.props} actions={this.actions} ImageClass="Remove-Border">
        <BlockContent>
           {/* <img src={this.props.data.src} /> */}
          <CustomImageEditor
            imageSrc={this.props.data.src}
            width = {this.props.data.width}
            alignment = {this.props.data.alignment}
            allProps={this.props}
            // id={this.props.data}
          />
        </BlockContent>
      </CommonBlock>
    );
  }
}
