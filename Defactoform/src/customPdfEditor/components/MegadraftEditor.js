import React, { Component } from "react";
import {
  Editor,
  RichUtils,
  EditorState,
  genKey,
  ContentBlock,
  SelectionState,
} from "draft-js";
import Immutable from "immutable";

import DefaultToolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Media from "./Media";
import i18nConfig from "../i18n";
import DEFAULT_PLUGINS from "../plugins/default";
import DEFAULT_ACTIONS from "../actions/default";
import DEFAULT_ENTITY_INPUTS from "../entity_inputs/default";
const NO_RESET_STYLE_DEFAULT = ["ordered-list-item", "unordered-list-item"];

export default class MegadraftEditor extends Component {
  static defaultProps = {
    actions: DEFAULT_ACTIONS,
    blockRendererFn: () => {},
    i18n: i18nConfig,
    language: "en-US",
  };

  constructor(props) {
    super(props);
    this.state = {
      readOnly: this.props.readOnly || false,
      hasFocus: false,
      startTyping: false,
      themeInfo: [],
      typographySettings: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onTab = this.onTab.bind(this);

    this.mediaBlockRenderer = this.mediaBlockRenderer.bind(this);

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.setReadOnly = this.setReadOnly.bind(this);
    this.getReadOnly = this.getReadOnly.bind(this);
    this.getInitialReadOnly = this.getInitialReadOnly.bind(this);
    this.setInitialReadOnly = this.setInitialReadOnly.bind(this);

    //this.externalKeyBindings = this.externalKeyBindings.bind(this);

    this.plugins = this.getValidPlugins();
    this.entityInputs = this.props.entityInputs || DEFAULT_ENTITY_INPUTS;
    this.blocksWithoutStyleReset =
      this.props.blocksWithoutStyleReset || NO_RESET_STYLE_DEFAULT;

    this.pluginsByType = this.getPluginsByType();

    this.keyBindings = this.props.keyBindings || [];
  }

  getValidPlugins() {
    let plugins = [];
    for (let plugin of this.props.plugins || DEFAULT_PLUGINS) {
      if (!plugin || typeof plugin.type !== "string") {
        console.warn("Plugin: Missing `type` field. Details: ", plugin);
        continue;
      }
      plugins.push(plugin);
    }
    return plugins;
  }

  getPluginsByType() {
    let pluginsByType = {};

    for (let plugin of this.plugins) {
      pluginsByType[plugin.type] = plugin;
    }

    return pluginsByType;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.readOnly !== nextProps.readOnly) {
      this.setState({ readOnly: nextProps.readOnly });
    }
    this.applyThemeSettings(this.props);
  }

  onChange(editorState) {
    this.props.onChange(editorState);
  }

  // externalKeyBindings(e): string {
  //   for (const kb of this.keyBindings) {
  //     if (kb.isKeyBound(e)) {
  //       return kb.name;
  //     }
  //   }
  //   return getDefaultKeyBinding(e);
  // }

  onTab(event) {
    if (this.props.onTab) {
      this.props.onTab(event);
    }
  }

  handleKeyCommand(command) {
    // external key bindings
    if (this.keyBindings.length) {
      const extKb = this.keyBindings.find((kb) => kb.name === command);
      if (extKb) {
        extKb.action();
        return true;
      }
    }

    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.props.onChange(newState);
      return true;
    }
    return false;
  }

  /*
   * Copyright (c) 2016 Icelab
   *
   * License: MIT
   */
  //Based on https://github.com/icelab/draft-js-block-breakout-plugin
  resetBlockStyle(
    editorState,
    selection,
    contentState,
    currentBlock,
    blockType
  ) {
    const { List } = Immutable;
    const emptyBlockKey = genKey();

    const emptyBlock = new ContentBlock({
      key: emptyBlockKey,
      text: "",
      type: blockType,
      depth: 0,
      characterList: List(),
      inlineStyleRanges: [],
    });
    const blockMap = contentState.getBlockMap();

    const blocksBefore = blockMap.toSeq().takeUntil(function(v) {
      return v === currentBlock;
    });
    const blocksAfter = blockMap
      .toSeq()
      .skipUntil(function(v) {
        return v === currentBlock;
      })
      .rest();

    const augmentedBlocks = [
      [currentBlock.getKey(), currentBlock],
      [emptyBlockKey, emptyBlock],
    ];

    const focusKey = emptyBlockKey;
    const newBlocks = blocksAfter
      .concat(augmentedBlocks, blocksBefore)
      .toOrderedMap();
    const newContentState = contentState.merge({
      blockMap: newBlocks,
      selectionAfter: selection,
      selectionBefore: selection.merge({
        anchorKey: focusKey,
        anchorOffset: 0,
        focusKey: focusKey,
        focusOffset: 0,
        isBackward: false,
      }),
    });
    const noStyle = Immutable.OrderedSet([]);
    const resetState = EditorState.push(
      editorState,
      newContentState,
      "split-block"
    );
    const emptySelection = SelectionState.createEmpty(emptyBlockKey);
    const editorSelected = EditorState.forceSelection(
      resetState,
      emptySelection
    );
    const noStyleState = EditorState.setInlineStyleOverride(
      editorSelected,
      noStyle
    );
    this.props.onChange(noStyleState);
  }

  handleReturn(event) {
    if (this.props.softNewLines === false) {
      return false;
    }

    if (!event.shiftKey) {
      const { editorState } = this.props;
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const currentBlock = contentState.getBlockForKey(selection.getEndKey());
      const endOffset = selection.getEndOffset();
      const atEndOfBlock = endOffset === currentBlock.getLength();
      const resetStyleNewLine = this.props.resetStyleNewLine;
      const noReset = this.blocksWithoutStyleReset.includes(currentBlock.type);

      if (atEndOfBlock && resetStyleNewLine) {
        const blockType = noReset ? currentBlock.type : "unstyled";
        this.resetBlockStyle(
          editorState,
          selection,
          contentState,
          currentBlock,
          blockType
        );
        return true;
      }
      return false;
    }

    const { editorState } = this.props;

    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const contentBlock = currentContent
      .getBlockMap()
      .get(currentSelection.getFocusKey());
    const contentText = contentBlock.getText();

    if (
      contentText.charAt(currentSelection.focusOffset - 1) === "\n" ||
      contentText.charAt(currentSelection.focusOffset) === "\n"
    ) {
      return false;
    }

    const newState = RichUtils.insertSoftNewline(editorState);
    this.props.onChange(newState);
    return true;
  }

  focus() {
    this.draftEl.focus();
  }

  setReadOnly(readOnly) {
    this.setState({ readOnly });
  }

  getReadOnly() {
    return this.state.readOnly;
  }

  getInitialReadOnly() {
    return this.props.readOnly || false;
  }

  setInitialReadOnly() {
    let readOnly = this.props.readOnly || false;
    this.setState({ readOnly });
  }

  // handleBlockNotFound(block) {
  //   if (this.props.handleBlockNotFound) {
  //     return this.props.handleBlockNotFound(block);
  //   }
  //   return notFoundPlugin;
  // }

  handleFocus() {
    clearTimeout(this.blurTimeoutID);

    if (!this.state.hasFocus) {
      this.setState({
        hasFocus: true,
      });
    }
  }

  handleKeyUp(e) {
    if (e.key === "Tab") return;
    if (e.key === "Enter" || e.key === "Backspace") {
      this.setState({
        startTyping: false,
      });
    } else {
      this.setState({
        startTyping: true,
      });
    }
  }

  handleBlur() {
    this.blurTimeoutID = setTimeout(() => {
      if (this.state.hasFocus) {
        this.setState({
          hasFocus: false,
        });
      }
    }, 200);
  }

  componentWillUnmount() {
    clearTimeout(this.blurTimeoutID);
  }

  componentDidMount() {
    this.applyThemeSettings(this.props);
    let summaryBox = document.querySelectorAll(
      "  .DraftEditor-editorContainer "
    );
    for (let h1 = 0; h1 < summaryBox.length; h1++) {
      summaryBox[h1].style.margin = "0 auto";
    }
  }

  componentDidUpdate() {}

  mediaBlockRenderer(block) {
    const handled = this.props.blockRendererFn(block);
    if (handled) {
      return handled;
    }

    if (block.getType() !== "atomic") {
      return null;
    }

    const type = block.getData().toObject().type;

    let plugin = this.pluginsByType[type] || this.handleBlockNotFound(block);
    if (!plugin) {
      return null;
    }

    return {
      component: Media,
      editable: false,
      props: {
        i18n: this.props.i18n[this.props.language],
        plugin: plugin,
        onChange: this.onChange,
        editorState: this.props.editorState,
        getEditorState: this.getEditorState,
        setReadOnly: this.setReadOnly,
        getReadOnly: this.getReadOnly,
        readOnly: this.state.readOnly,
        editable: this.props.editable,
        getInitialReadOnly: this.getInitialReadOnly,
        setInitialReadOnly: this.setInitialReadOnly,
      },
    };
  }

  getEditorState = () => {
    return this.props.editorState;
  };

  blockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === "unstyled") {
      return "paragraph";
    }
  }

  renderSidebar(props) {
    const { sidebarRendererFn } = this.props;
    if (typeof sidebarRendererFn === "function") {
      return sidebarRendererFn(props);
    }
    return <Sidebar {...props} />;
  }

  renderToolbar(props) {
    const { Toolbar = DefaultToolbar } = this.props;
    return <Toolbar {...props} />;
  }

  applyThemeSettings(props) {
    if (props.themeInfo && props.themeInfo.length > 0) {
      if (props.themeInfo[0].TypoGraphyFont !== "[]") {
        const typoGraphyFontObj = JSON.parse(props.themeInfo[0].TypoGraphyFont);
        const themeSettings = JSON.parse(props.themeInfo[0].ThemeSettings);
        this.setStylesFromTypograpgySettings(typoGraphyFontObj, themeSettings);
      } else {
        if (props.themeInfo[0].ThemeSettings !== "[]") {
          const themeSettings = JSON.parse(props.themeInfo[0].ThemeSettings);
          this.setStylesFromThemeSettings(themeSettings);
        }
      }
      if (props.themeInfo[0].UIElement !== "[]") {
        const UIElements = JSON.parse(props.themeInfo[0].UIElement);
        if (
          UIElements[0].Questions &&
          !UIElements[0].Questions.backgroundShadow
        ) {
          let bgElemets = document.querySelectorAll(
            ".block__wrapper, .block__hover,  .block__content.block__content--with-padding, .block__input.block__input--small-padding"
          );
          for (let idx = 0; idx < bgElemets.length; idx++) {
            bgElemets[idx].setAttribute(
              "style",
              "background-color: transparent !important"
            );
          }
        }

        let requiredElements = document.querySelectorAll(
          ".block__input.block__input--big-text.block__input--required"
        );
        for (let el = 0; el < requiredElements.length; el++) {
          if (requiredElements[el].nextSibling) {
            if (
              UIElements[0].Questions &&
              !UIElements[0].Questions.requiredAsterick
            ) {
              requiredElements[el].nextSibling.setAttribute(
                "style",
                "display: none"
              );
            } else {
              requiredElements[el].nextSibling.setAttribute(
                "style",
                "display: initial"
              );
            }
          }
        }
      }
    }
    if (props.paymentAccountId && props.paymentAccountId !== "") {
      let bgElemets = document.querySelectorAll(
        ".related-articles a.configrePaymentLink"
      );
      for (let anc = 0; anc < bgElemets.length; anc++) {
        bgElemets[anc].setAttribute("style", "display: none");
      }
    } else {
      let bgElemets = document.querySelectorAll(
        ".related-articles a.configrePaymentLink"
      );
      for (let anc = 0; anc < bgElemets.length; anc++) {
        bgElemets[anc].setAttribute("style", "display: block");
      }
    }
  }

  setStylesFromTypograpgySettings(typoSettings, themeSettings) {
    const heading1Styles = typoSettings[0];
    const heading2Styles = typoSettings[1];
    const paragraphStyles = typoSettings[2];
    const questionTitleStyles = typoSettings[3];
    const QuestionDescStyles = typoSettings[4];
    const TextColor = themeSettings.TextColor;
    const ActiveColor = themeSettings.ActiveColor;
    const primaryFontFamily = themeSettings.PrimaryFont;

    let heading1Els = document.querySelectorAll(
      ".DraftEditor-editorContainer h1"
    );
    for (let h1 = 0; h1 < heading1Els.length; h1++) {
      heading1Els[h1].style.color = heading1Styles.color;
      heading1Els[h1].style.fontFamily = heading1Styles.fontFamily;
      heading1Els[h1].style.fontWeight = heading1Styles.fontWeight;
      heading1Els[h1].style.fontSize = heading1Styles.fontSize;
      heading1Els[h1].style.lineHeight = heading1Styles.lineHeight;
    }
    let heading2Els = document.querySelectorAll(
      ".DraftEditor-editorContainer h2"
    );
    for (let h2 = 0; h2 < heading2Els.length; h2++) {
      heading2Els[h2].style.color = heading2Styles.color;
      heading2Els[h2].style.fontFamily = heading2Styles.fontFamily;
      heading2Els[h2].style.fontWeight = heading2Styles.fontWeight;
      heading2Els[h2].style.fontSize = heading2Styles.fontSize;
      heading2Els[h2].style.lineHeight = heading2Styles.lineHeight;
    }
    let linkEls = document.querySelectorAll(
      ".DraftEditor-editorContainer a.editor__link"
    );
    for (let link = 0; link < linkEls.length; link++) {
      linkEls[link].style.color = ActiveColor;
      linkEls[link].style.fontFamily = primaryFontFamily;
    }
    let blockquoteEls = document.querySelectorAll(
      ".DraftEditor-editorContainer blockquote"
    );
    for (let quote = 0; quote < blockquoteEls.length; quote++) {
      blockquoteEls[quote].style.color = TextColor;
      blockquoteEls[quote].style.fontFamily = primaryFontFamily;
    }
    let paragrapheEls = document.querySelectorAll(
      ".DraftEditor-editorContainer .public-DraftEditor-content >  div > div > .public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
    );
    for (let p = 0; p < paragrapheEls.length; p++) {
      paragrapheEls[p].style.color = paragraphStyles.color;
      paragrapheEls[p].style.fontFamily = paragraphStyles.fontFamily;
      paragrapheEls[p].style.fontWeight = paragraphStyles.fontWeight;
      paragrapheEls[p].style.fontSize = paragraphStyles.fontSize;
      paragrapheEls[p].style.lineHeight = paragraphStyles.lineHeight;
    }
    let questionTitleEls = document.querySelectorAll(
      ".DraftEditor-editorContainer .block__input--big-text"
    );
    for (let i = 0; i < questionTitleEls.length; i++) {
      questionTitleEls[i].style.color = questionTitleStyles.color;
      questionTitleEls[i].style.fontFamily = questionTitleStyles.fontFamily;
      questionTitleEls[i].style.fontWeight = questionTitleStyles.fontWeight;
      questionTitleEls[i].style.fontSize = questionTitleStyles.fontSize;
      questionTitleEls[i].style.lineHeight = questionTitleStyles.lineHeight;
    }
    let requiredElements = document.querySelectorAll(
      ".block__input__wrapper span.required-input-icon"
    );
    for (let r = 0; r < requiredElements.length; r++) {
      requiredElements[r].parentNode.style.color = questionTitleStyles.color;
      requiredElements[r].parentNode.style.fontFamily =
        questionTitleStyles.fontFamily;
      requiredElements[r].parentNode.style.fontWeight =
        questionTitleStyles.fontWeight;
      requiredElements[r].parentNode.style.fontSize =
        questionTitleStyles.fontSize;
      requiredElements[r].parentNode.style.lineHeight =
        questionTitleStyles.lineHeight;
    }
    let questionDesceEls = document.querySelectorAll(
      ".DraftEditor-editorContainer .block__input--small-padding:not(.block__input--big-text)"
    );
    for (let j = 0; j < questionDesceEls.length; j++) {
      questionDesceEls[j].style.color = QuestionDescStyles.color;
      questionDesceEls[j].style.fontFamily = QuestionDescStyles.fontFamily;
      questionDesceEls[j].style.fontWeight = QuestionDescStyles.fontWeight;
      questionDesceEls[j].style.fontSize = QuestionDescStyles.fontSize;
      questionDesceEls[j].style.lineHeight = QuestionDescStyles.lineHeight;
    }
  }

  setStylesFromThemeSettings(themeSettings) {
    const TextColor = themeSettings.TextColor;
    const ActiveColor = themeSettings.ActiveColor;
    const primaryFontFamily = themeSettings.PrimaryFont;
    const secondaryFontFamily = themeSettings.SecondaryFont;

    let heading1Els = document.querySelectorAll(
      ".DraftEditor-editorContainer h1"
    );
    for (let h1 = 0; h1 < heading1Els.length; h1++) {
      heading1Els[h1].style.color = TextColor;
      heading1Els[h1].style.fontFamily = secondaryFontFamily;
    }
    let heading2Els = document.querySelectorAll(
      ".DraftEditor-editorContainer h2"
    );
    for (let h2 = 0; h2 < heading2Els.length; h2++) {
      heading2Els[h2].style.color = TextColor;
      heading2Els[h2].style.fontFamily = secondaryFontFamily;
    }
    let linkEls = document.querySelectorAll(
      ".DraftEditor-editorContainer a.editor__link"
    );
    for (let link = 0; link < linkEls.length; link++) {
      linkEls[link].style.color = ActiveColor;
      linkEls[link].style.fontFamily = primaryFontFamily;
    }
    let blockquoteEls = document.querySelectorAll(
      ".DraftEditor-editorContainer blockquote"
    );
    for (let quote = 0; quote < blockquoteEls.length; quote++) {
      blockquoteEls[quote].style.color = TextColor;
      blockquoteEls[quote].style.fontFamily = primaryFontFamily;
    }
    let paragrapheEls = document.querySelectorAll(
      ".DraftEditor-editorContainer .public-DraftEditor-content >  div > div > .public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
    );
    for (let p = 0; p < paragrapheEls.length; p++) {
      paragrapheEls[p].style.color = TextColor;
      paragrapheEls[p].style.fontFamily = primaryFontFamily;
    }
    let questionTitleEls = document.querySelectorAll(
      ".DraftEditor-editorContainer .block__input--big-text"
    );
    for (let i = 0; i < questionTitleEls.length; i++) {
      questionTitleEls[i].style.color = TextColor;
      questionTitleEls[i].style.fontFamily = primaryFontFamily;
    }
    let requiredElements = document.querySelectorAll(
      ".block__input__wrapper span.required-input-icon"
    );
    for (let r = 0; r < requiredElements.length; r++) {
      requiredElements[r].style.color = TextColor;
      requiredElements[r].style.fontFamily = primaryFontFamily;
    }
    let questionDesceEls = document.querySelectorAll(
      ".DraftEditor-editorContainer .block__input--small-padding:not(.block__input--big-text)"
    );
    for (let j = 0; j < questionDesceEls.length; j++) {
      questionDesceEls[j].style.color = TextColor;
      questionDesceEls[j].style.fontFamily = primaryFontFamily;
    }
  }

  render() {
    const hideSidebarOnBlur = this.props.hideSidebarOnBlur || false;
    const i18n = this.props.i18n[this.props.language];

    return (
      <div className="megadraft">
        <div
          className="megadraft-editor"
          id={this.props.id || "megadraft-editor"}
          ref={(el) => {
            this.editorEl = el;
          }}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyUp={this.handleKeyUp}
        >
          {this.renderSidebar({
            i18n: i18n,
            plugins: this.plugins,
            editorState: this.props.editorState,
            readOnly: this.state.readOnly,
            editable: this.props.editable,
            onChange: this.onChange,
            maxSidebarButtons: this.props.maxSidebarButtons,
            modalOptions: this.props.modalOptions,
            editorHasFocus: this.state.hasFocus,
            editorStartTyping: this.state.startTyping,
            hideSidebarOnBlur: hideSidebarOnBlur,
          })}
          <Editor
            {...this.props}
            ref={(el) => {
              this.draftEl = el;
            }}
            readOnly={this.state.readOnly}
            editable={this.props.editable}
            blockRendererFn={this.mediaBlockRenderer}
            blockStyleFn={this.props.blockStyleFn || this.blockStyleFn}
            onTab={this.onTab}
            handleKeyCommand={this.handleKeyCommand}
            handleReturn={this.props.handleReturn || this.handleReturn}
            //keyBindingFn={this.externalKeyBindings}
            onChange={this.onChange}
          />
          {this.renderToolbar({
            i18n: i18n,
            editor: this.editorEl,
            draft: this.draftEl,
            editorState: this.props.editorState,
            editorHasFocus: this.state.hasFocus,
            readOnly: this.state.readOnly,
            onChange: this.onChange,
            actions: this.props.actions,
            entityInputs: this.entityInputs,
            shouldDisplayToolbarFn: this.props.shouldDisplayToolbarFn,
          })}
        </div>
      </div>
    );
  }
}
