import React, { Component } from "react";
import "../../assets/custom/question_control.css";
//import { threadId } from "worker_threads";

class TextArea extends Component {
  //initial state
  constructor(props) {
    super(props);
    //this.hideOrMatchQsAnsFXPrent = this.props.hideOrMatchQsAnsFX;
    this.state = {
      textValue: props.defaultText,
      translatedData: {},
      errorText: "This question is required",
    };
  }

  onKeyDown = (e) => {
    const newLine = this.props.newLine;
    if (e.keyCode === 13 && !newLine) {
      e.preventDefault();
      return false;
    }
  };
  handleChangeInput = (e, Id) => {
    if (
      e.target !== undefined &&
      e.target != null &&
      e.target !== "" &&
      Id !== undefined &&
      Id != null &&
      Id !== ""
    ) {
      this.props.parentMethod(e, Id);
    }
    const { value, maxLength } = e.target;
    const newValue = maxLength > 0 ? value.slice(0, maxLength) : value;
    this.setState({ textValue: newValue });
    if (this.props.handleChange)
      this.props.handleChange(newValue ? newValue : this.props.defaultText);
  };

  componentWillReceiveProps(nextProps) {
    //if(nextProps.from === "Settings"){
    if (nextProps.defaultText)
      this.setState({ textValue: nextProps.defaultText });
    //}
    if (
      nextProps.translationInfo &&
      Object.keys(nextProps.translationInfo).length &&
      Object.keys(nextProps.translationInfo).length !==
        Object.keys(this.state.translatedData).length
    ) {
      this.setState({
        translatedData: nextProps.translationInfo,
      });
      if (nextProps.translationInfo.questionrequired) {
        this.setState({
          errorTxt: nextProps.translationInfo.questionrequired,
        });
      }
    }
  }
  render() {
    //console.log(this.props)
    return (
      <div className="live-field-textarea">
        {/* <label>{this.props.title1}</label>
        <label>{this.props.title2}</label> */}
        <textarea
          // key={this.state.textValue?this.props.id:this.state.textValue}
          id={this.props.id}
          required
          onFocus={
            this.props.onFocus && (() => this.props.onFocus(this.props.id))
          }
          onBlur={this.props.onBlur && (() => this.props.onBlur(this.props.id))}
          onChange={(e) => this.handleChangeInput(e, this.props.id)}
          rows={this.props.rows}
          onKeyDown={this.onKeyDown}
          placeholder={this.props.placeholderData}
          minLength={this.props.minLength}
          maxLength={this.props.maxLength}
          defaultValue={this.state.textValue}
          className={this.props.className}
        />
        <span id={"error" + this.props.id} className="field__error">
          {this.props.errorMessage === "" && <div>{this.state.errorText}</div>}
          {this.props.errorMessage !== "" && <div>{this.state.errorText}</div>}
        </span>
        <span id={"error_minLength" + this.props.id} className="field__error">
          Too Short
        </span>
      </div>
    );
  }
}

export default TextArea;
