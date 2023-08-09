import React, { Component } from "react";
import $ from "jquery";
import { DraftJS } from "megadraft";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";

import "draft-js-image-plugin/lib/plugin.css";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createImagePlugin from "draft-js-image-plugin";

import createAlignmentPlugin from "draft-js-alignment-plugin";

import createFocusPlugin from "draft-js-focus-plugin";

import createResizeablePlugin from "draft-js-resizeable-plugin";

import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";

import editorStyles from "./editorStyles.css";
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const plugins = [
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
];

/* eslint-disable */

/* eslint-enable */

export default class CustomImageEditor extends Component {
  constructor(props) {
    super(props);
    this.imgkey = DraftJS.genKey();
    const initialState = {
      entityMap: {
        "0": {
          type: "IMAGE",
          mutability: "IMMUTABLE",
          data: {
            src: props.imageSrc,
            type: "image",
            display: "medium",
            width: props.width,
            alignment: props.alignment,
          },
        },
      },
      blocks: [
        {
          key: this.imgkey,
          text: " ",
          type: "atomic",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [
            {
              offset: 0,
              length: 1,
              key: 0,
            },
          ],
          data: {
            src: props.imageSrc,
            type: "image",
            display: "medium",
            width: props.width,
            alignment: props.alignment,
          },
        },
      ],
    };
    // initialState.entityMap["0"].data.src = props.imageSrc;
    // initialState.blocks[0].data.src = props.imageSrc;
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(initialState)),
      data: "",
    };
  }

  componentDidMount() {
    $("figure")
      .find("img")
      .append("<div style='clear:both'></div>");
      $("figure")
      .find("img").attr( "alt", "Image not found").css('font-size', '12px');
  }
  onChange = (editorState) => {    
    let convertedState = convertToRaw(editorState.getCurrentContent());
    let data = convertedState.entityMap["0"]
      ? convertedState.entityMap["0"].data
      : "";
    this.setState({
      editorState,
      data,
    });
    if (this.props.allProps.blockProps.editable !== false && data) {
      Object.keys(data).map(
        function(key, value) {
          if (key === "width" || key === "alignment") {
            this.props.allProps.container.updateData({ [key]: data[key] });
          }
        }.bind(this)
      );
    }
  };

  focus = () => {
    this.editor.focus();
  };
  render() {
    const editable = this.props.allProps.blockProps.editable;
    return (
      <div>
        <div className={editorStyles.editor} id={this.imgkey}>
          {editable === false ? "" : <AlignmentTool />}
          <div className="draft-alignment-editor">
            <Editor
              readOnly={editable === false ? true : false}
              editorState={this.state.editorState}
              onChange={this.onChange}
              plugins={plugins}
              ref={(element) => {
                this.editor = element;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
