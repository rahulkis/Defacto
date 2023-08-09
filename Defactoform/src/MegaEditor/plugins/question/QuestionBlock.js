import React, { Component } from "react";
import { DraftJS } from "megadraft";

import Icon from "../../icons";

import RelatedArticle from "./RelatedArticle";

import CommonBlock from "../../components/plugin/CommonBlock";
import BlockContent from "../../components/plugin/BlockContent";
import insertDataBlock from "../../insertDataBlock";
import { PLUGIN_TYPE } from "../../../util/constants";
import $ from "jquery";

export default class RelatedArticleBlock extends Component {
  constructor(props) {
    super(props);

    this._handleAddAnotherClick = this._handleAddAnotherClick.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.addNewBlock = this.addNewBlock.bind(this);
    this.actions = [
      {
        key: "delete",
        icon: Icon.DeleteIcon,
        action: this.props.container.remove,
      },
    ];
  }

  _handleAddAnotherClick(event) {
    event.preventDefault();
    this.props.container.updateData({
      articles: this.props.data.articles.concat({
        key: DraftJS.genKey(),
        title: "",
        link: "",
        control: "",
        requiredQuestion: true,
        isNewLine: true,
        confirmEmail: false,
        placeholderText: "",
        minLength: "",
        maxLength: "",
        textareaRows: "1",
        defaultVal: "",
        requireZipCode: true,
        preFillKey: "",
      }),
    });
  }

  updateArticle(key, field, value) {
    // alert('I am from question block . . . . .. . ..')
    // Should we use immutable or helpers?
    for (let item of this.props.data.articles) {
      if (item.key === key) {
        item[field] = value;
      }
    }
    this.props.container.updateData({ articles: this.props.data.articles });
  }

  removeArticle(key) {
    // Should we use immutable or helpers?
    // let articles = Array();
    let articles = [];
    for (let item of this.props.data.articles) {
      if (item.key !== key) {
        articles.push(item);
      }
    }
    this.props.container.updateData({ articles: articles });
  }

  addNewBlock() {
    let grpCounter = 0;
    if ($(".group-menu-inner") !== undefined) {
      grpCounter = $(".group-menu-inner").length;
    }
    //let count=$('.group-menu-inner').length;
    let newGroup = [];
    for (let item of this.props.data.articles) {
      if (item.key) {
        item.key = DraftJS.genKey();
      }
      newGroup.push(item);
    }
    const data = {
      articles: newGroup,
      type: PLUGIN_TYPE,
      counter: grpCounter + 1,
    };

    this.props.blockProps.onChange(
      insertDataBlock(this.props.blockProps.editorState, data)
    );
  }
  render() {
    return (
      <div className="block__outer">
        <CommonBlock
          {...this.props}
          actions={this.actions}
          addNewBlock={this.addNewBlock}
        >
          <BlockContent className="with-padding">
            <div>
              {this.props.data.articles.map((item) => {
                return (
                  <div key={item.key}>
                    <RelatedArticle
                      key={item.key}
                      item={item}
                      updateArticle={this.updateArticle}
                      removeArticle={this.removeArticle}
                      {...this.props}
                    />
                  </div>
                );
              })}
              {this.props.data.articles.length > 0 && (
                <div className="related-articles__add-new-wrapper">
                  <a
                    href="#pablo"
                    onClick={this._handleAddAnotherClick}
                    className="related-articles__add-new"
                  >
                    {"Add Question"}
                  </a>
                </div>
              )}
            </div>
          </BlockContent>
        </CommonBlock>
      </div>
    );
  }
}
