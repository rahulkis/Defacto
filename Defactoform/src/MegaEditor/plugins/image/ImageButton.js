import React, { Component } from "react";

import icons from "megadraft/lib/icons";
import insertDataBlock from "../../insertDataBlock";
const image2base64 = require("image-to-base64");
export default class BlockButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick(e) {
    this.input.value = null;
    this.input.click();
  }

  onChange(e) {
    // e.preventDefault();
    const file = e.target.files[0]; 
    if (file.type.indexOf("image/") === 0) {
      // console.log(this.props.getEditorState());
      // eslint-disable-next-line no-undef
      const src = URL.createObjectURL(file);
      image2base64(src) // you can also to use url
        .then(response => { //cGF0aC90by9maWxlLmpwZw==
          const data = {
            src: "data:image/jpeg;base64," + response,
            type: "image",
            display: "medium"
          };
          this.props.onChange(insertDataBlock(this.props.editorState, data));
        })
        .catch(error => {
          const data = {
            src: src,
            type: "image",
            display: "medium"
          };
          this.props.onChange(insertDataBlock(this.props.editorState, data));
          console.log(error); //Exepection error....
        });
    }
    //this.props.close();
  }

  render() {
    return (
      <button
        className={this.props.className}
        id="file-upload"
        type="button"
        onClick={this.onClick}
        title={this.props.title}
      >
        <icons.ImageIcon className="sidemenu__button__icon" />
        <input
          type="file"
          accept="image/*"
          ref={c => {
            this.input = c;
          }}
          onChange={this.onChange}
          style={{ display: "none" }}
        />
      </button>
    );
  }
}
