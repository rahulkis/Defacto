import React, { Component } from "react";
import NumberFormat from "react-number-format";

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultValue: props.defaultText ? props.defaultText : "",
      value: props.defaultText ? props.defaultText : "",
      selectedNumberFormat: props.selectedNumberFormat
        ? props.selectedNumberFormat.id
        : 1,
      numberProp: {},
      translatedData: {},
      errorText: "This question is required",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    if (this.props.inputMode === "numeric") {
      let selectedNumberFormatID = this.props.selectedNumberFormat
        ? this.props.selectedNumberFormat.id
        : 1;
      this.getInputFormat(selectedNumberFormatID);
    }
  }

  componentWillReceiveProps(nextProps, prevState) {
    if (nextProps.inputMode === "numeric") {
      let selectedNumberFormatID = nextProps.selectedNumberFormat
        ? nextProps.selectedNumberFormat.id
        : 1;
      this.setState({
        selectedNumberFormat: selectedNumberFormatID,
      });
      this.getInputFormat(selectedNumberFormatID);
    }

    this.setState({
      defaultValue: nextProps.defaultText
        ? nextProps.defaultText
        : this.state.defaultValue,
    });
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

  getInputFormat = (id) => {
    switch (id) {
      case 2:
        this.setState({
          numberProp: {
            thousandSeparator: true,
          },
        });
        return;
      case 3:
        this.setState({
          numberProp: {
            thousandSeparator: true,
            prefix: "$",
          },
        });
        return;
      default:
        this.setState({
          numberProp: {},
        });
    }
  };

  handleChange(e) {
    if (this.props.from === "settings") {
      this.props.onChange(e.target.value);
      this.setState({ value: e.target.value });
    } else {
      if (this.props.name === "State") {
        let regex = /^[a-zA-Z ]*$/; // let regex = /^[a-zA-Z0-9 ]*$/;
        let result = regex.test(e.target.value);
        if (result) {
          this.setState({ value: e.target.value });
          this.props.onChange(e);
        }
      } else if (this.props.name === "ZipCode") {
        let regex = /^[a-zA-Z0-9]*$/;
        let result = regex.test(e.target.value);
        if (result) {
          this.setState({ value: e.target.value });
          this.props.onChange(e);
        }
      } else {
        this.setState({ value: e.target.value });
        this.props.onChange(e);
      }
    }
  }

  handleNumberChange = (values) => {
    let val = values.value;
    let re = /^(\d*)(\.\d*)?$/; // to accept digits and one decimal only
    if (this.props.isWholeNumber) {
      re = /^[0-9\b]+$/; //to allow whole number only
    }
    this.setState({
      errorText:
        this.state.translatedData["questionrequired"] ||
        "This question is required",
    });
    let min = this.props.minValue;
    let max = this.props.maxValue;
    let el = document.getElementById("error_invalidNumber" + this.props.id);
    if (max && Number(val) > Number(max)) {
      let translatedStr = this.state.translatedData["lessThanX"];
      if (translatedStr) {
        translatedStr = translatedStr.replace("X", max);
        this.setState({
          errorText: translatedStr,
        });
        el.style.display = "block";
      } else {
        this.setState({
          errorText: "Please enter a number less than or equal to " + max,
        });
        el.style.display = "block";
      }
    } else if (min && Number(val) < Number(min)) {
      let translatedStr = this.state.translatedData["greaterThanX"];
      if (translatedStr) {
        translatedStr = translatedStr.replace("X", min);
        this.setState({
          errorText: translatedStr,
        });
        el.style.display = "block";
      } else {
        this.setState({
          errorText: "Please enter a number greater than or equal to " + min,
        });
        el.style.display = "block";
      }
    } else {
      el.style.display = "none";
      this.setState({
        errorText:
          this.state.translatedData["questionrequired"] ||
          "This question is required",
      });
    }
    this.props.onChange(this.props.id, val);
    return re.test(val);
  };
  render() {
    // let errorMsgId = "error" + this.props.id;
    return (
      <div className={this.props.parentClass}>
        {this.props.title ? <label>{this.props.title}</label> : ""}
        {this.props.inputMode === "numeric" ? (
          <NumberFormat
            id={this.props.id}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            //key={this.state.defaultValue}
            placeholder={this.props.placeholderData}
            {...this.state.numberProp}
            isAllowed={this.handleNumberChange}
            defaultValue={this.state.defaultValue}
            className={this.props.className}
          />
        ) : (
          <input
            //key={this.state.defaultValue}
            className={this.props.class}
            type={this.props.type}
            name={this.props.title1}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            id={this.props.id}
            placeholder={this.props.placeholderData}
            onChange={this.handleChange}
            defaultValue={this.state.defaultValue}
          />
        )}
        {/* <span id={errorMsgId} className="field__error">
          {this.state.errorText}
        </span> */}
        <span
          id={"error_invalidNumber" + this.props.id}
          className="field__error"
        >
          {this.state.errorText}
        </span>
        <span
          id={"error_invalidEmail" + this.props.id}
          className="field__error"
        >
          {this.state.translatedData["PleaseEnterAValidEmail"] ||
            "Invalid Email"}
        </span>
        <span
          id={"error_confirmEmail" + this.props.id}
          className="field__error"
        >
          {this.state.translatedData["EmailAddressesNotMatch"] ||
            "Email and Confirm Email did not match"}
        </span>
        <span id={"error_invalidUrl" + this.props.id} className="field__error">
          {this.state.translatedData["validURL"] || "Enter a valid URL"}
        </span>
      </div>
    );
  }
}

export default Input;
