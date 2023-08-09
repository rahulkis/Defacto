import React, { Component } from "react";

import CustomIcons from "../../../variables/customIcons";
import { DraftJS } from "megadraft";
import insertDataBlock from "../../insertDataBlock";
import { PLUGIN_TYPE } from "../../../util/constants";
import $ from "jquery";

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.onQuestionButtonClick = this.onQuestionButtonClick.bind(this);
  }

  onQuestionButtonClick(e) {
    localStorage.setItem("grpCounter", 0);
    let grpCounter = 0;
    if ($(".group-menu-inner") !== undefined) {
      grpCounter = $(".group-menu-inner").length;
    }
    const data = {
      articles: [{ key: DraftJS.genKey(), title: "", link: "", control: "" }],
      type: PLUGIN_TYPE,
      counter: grpCounter + 1,
    };

    this.props.onChange(insertDataBlock(this.props.editorState, data));
  }

  render() {
    return (
      <button
        id="add_Question"
        className={this.props.className + " addQuestion"}
        type="button"
        onClick={this.onQuestionButtonClick}
        title={this.props.title}
      >
        <CustomIcons.QuestionIcon className="sidemenu__button__icon" />
      </button>
    );
  }
}
