import React, { Component } from "react";
import "react-phone-number-input/style.css";
// import { parsePhoneNumberFromString } from "libphonenumber-js";

class PhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultVal ? props.defaultVal : "",
      translatedData: {},
    };
  }
  validate_int(myEvento) {
    let dato = true;
    if (
      (myEvento.charCode >= 48 && myEvento.charCode <= 57) ||
      myEvento.keyCode === 9 ||
      myEvento.keyCode === 10 ||
      myEvento.keyCode === 13 ||
      myEvento.keyCode === 8 ||
      myEvento.keyCode === 116 ||
      myEvento.keyCode === 46 ||
      (myEvento.keyCode <= 40 && myEvento.keyCode >= 37)
    ) {
      dato = true;
    } else {
      dato = false;
    }
    return dato;
  }

  phone_number_mask = (event, countryCode, mask) => {
    let myMask = mask;
    let myCaja = document.getElementById(event.currentTarget.id);
    let myText = "";
    let myNumbers = [];
    let myOutPut = "";
    let theLastPos = 1;
    myText = myCaja.value;
    //get numbers

    if (myText.length === 1) {
      for (let i = 0; i < myText.length; i++) {
        if (!isNaN(myText.charAt(i)) && myText.charAt(i) !== " ") {
          myNumbers.push(myText.charAt(i));
        }
      }
    } else {
      if (countryCode === "US") {
        for (let i = 2; i < myText.length; i++) {
          if (!isNaN(myText.charAt(i)) && myText.charAt(i) !== " ") {
            myNumbers.push(myText.charAt(i));
          }
        }
      } else if (countryCode === "AU") {
        for (let i = 4; i < myText.length; i++) {
          if (!isNaN(myText.charAt(i)) && myText.charAt(i) !== " ") {
            myNumbers.push(myText.charAt(i));
          }
        }
      }
    }

    //write over mask
    for (let j = 0; j < myMask.length; j++) {
      if (myMask.charAt(j) === "x") {
        //replace "_" by a number
        if (myNumbers.length === 0) myOutPut = myOutPut + myMask.charAt(j);
        else {
          myOutPut = myOutPut + myNumbers.shift();
          theLastPos = j + 1; //set caret position
        }
      } else {
        myOutPut = myOutPut + myMask.charAt(j);
      }
    }
    if (countryCode === "US") {
      theLastPos = theLastPos + 2;
      document.getElementById(event.currentTarget.id).value = "+1" + myOutPut;
    } else {
      theLastPos = theLastPos + 4;
      document.getElementById(event.currentTarget.id).value = `+61 ${myOutPut}`;
      // "+61" + " " + myOutPut;
    }

    document
      .getElementById(event.currentTarget.id)
      .setSelectionRange(theLastPos, theLastPos);
  };

  phone_number_masking_by_id = (id, countryCode, mask) => {
    let myMask = mask;
    let myCaja = document.getElementById(id);
    let myText = "";
    let myNumbers = [];
    let myOutPut = "";
    let theLastPos = 1;
    myText = myCaja.value;
    //get numbers

    if (myText.length === 1) {
      for (let i = 0; i < myText.length; i++) {
        if (!isNaN(myText.charAt(i)) && myText.charAt(i) !== " ") {
          myNumbers.push(myText.charAt(i));
        }
      }
    } else {
      if (countryCode === "US") {
        for (let i = 0; i < myText.length; i++) {
          if (!isNaN(myText.charAt(i)) && myText.charAt(i) !== " ") {
            myNumbers.push(myText.charAt(i));
          }
        }
      } else if (countryCode === "AU") {
        for (let i = 0; i < myText.length; i++) {
          if (!isNaN(myText.charAt(i)) && myText.charAt(i) !== " ") {
            myNumbers.push(myText.charAt(i));
          }
        }
      }
    }

    //write over mask
    for (let j = 0; j < myMask.length; j++) {
      if (myMask.charAt(j) === "x") {
        //replace "_" by a number
        if (myNumbers.length === 0) myOutPut = myOutPut + myMask.charAt(j);
        else {
          myOutPut = myOutPut + myNumbers.shift();
          theLastPos = j + 1; //set caret position
        }
      } else {
        myOutPut = myOutPut + myMask.charAt(j);
      }
    }
    if (countryCode === "US") {
      theLastPos = theLastPos + 2;
      document.getElementById(id).value = "+1" + myOutPut;
    } else {
      theLastPos = theLastPos + 4;
      document.getElementById(id).value = `+61 ${myOutPut}`;
      // "+61" + " " + myOutPut;
    }

    document.getElementById(id).setSelectionRange(theLastPos, theLastPos);
  };
  handlePhoneNumberChange = (e) => {
    this.setState({ value: e.target.value });
    // let phoneNumber = parsePhoneNumberFromString(e.target.value, "US");
    // console.log(phoneNumber);
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.translationInfo &&
      Object.keys(nextProps.translationInfo).length &&
      Object.keys(nextProps.translationInfo).length !==
        Object.keys(this.state.translatedData).length
    ) {
      this.setState({
        translatedData: nextProps.translationInfo,
      });
    }
  }

  componentDidMount() {
    if (
      this.props.defaultText !== undefined &&
      this.props.defaultText !== "" &&
      this.props.format === "NoFormat"
    ) {
      document.getElementById(this.props.id).value = this.props.defaultText;
    } else {
      if (this.props.format === "US" && !isNaN(this.props.defaultText)) {
        document.getElementById(this.props.id).value = this.props.defaultText;
        this.phone_number_masking_by_id(this.props.id, "US", "(xxx) xxx-xxxx");
      } else if (this.props.format === "AU" && !isNaN(this.props.defaultText)) {
        document.getElementById(this.props.id).value = this.props.defaultText;
        this.phone_number_masking_by_id(this.props.id, "AU", "xxx xxx xxx");
      }
    }
  }

  render() {
    let errorMsgId = "error" + this.props.id;
    console.log(errorMsgId);
    return (
      <div className={this.props.parentClass}>
        {this.props.format === "US" && (
          <input
            className={this.props.class}
            type="text"
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            name={this.props.title1}
            id={this.props.id}
            placeholder="+1(xxx) xxx-xxxx"
            pattern="^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$"
            onKeyUp={(event) =>
              this.phone_number_mask(event, "US", "(xxx) xxx-xxxx")
            }
            onKeyPress={(event) => this.validate_int(event)}
            onChange={this.handlePhoneNumberChange}
          />
        )}
        {this.props.format === "AU" && (
          <input
            className={this.props.class}
            type="text"
            name={this.props.title1}
            id={this.props.id}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            placeholder="+61 xxx xxx xxx"
            pattern="^[0-9]{3}\s[0-9]{3}\s[0-9]{3}$"
            onKeyUp={(event) =>
              this.phone_number_mask(event, "AU", "xxx xxx xxx")
            }
            onKeyPress={(event) => this.validate_int(event)}
            value={this.props.defaultText}
            onChange={this.handlePhoneNumberChange}
          />
        )}
        {this.props.format === "Custom" && (
          <input
            className={this.props.class}
            type={this.props.type}
            name={this.props.title1}
            id={this.props.id}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            placeholder={this.props.placeholderData}
            defaultValue={this.props.defaultVal}
            onChange={this.handlePhoneNumberChange}
          />
        )}

        {this.props.format === "NoFormat" && (
          <input
            className={this.props.class}
            type="text"
            name={this.props.title1}
            id={this.props.id}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            placeholder={this.props.placeholderData}
            maxLength={this.props.maxValue}
            onChange={this.handlePhoneNumberChange}
          />
        )}
        <span id={errorMsgId} className="field__error">
          {this.state.translatedData["questionrequired"] ||
            "This question is required."}
        </span>
        <span
          id={"error_invalidPhoneNumber" + this.props.id}
          className="field__error"
        >
          {this.state.translatedData["validPhonenumber"] ||
            "Invalid Phone Number Format"}
        </span>
        <span id={"error_minLength" + this.props.id} className="field__error">
          {this.state.translatedData["Tooshort"] || "Too Short"}
        </span>
        {/* <PhoneInput
             className={this.props.class}
             placeholder={this.props.placeholderData}
             value={this.state.value}
             id={this.props.id}
             onChange={this.handleChange} 
            /> */}
        {/* <input
          className={this.props.class}
          type={this.props.type}
          name={this.props.title1}
          id={this.props.id}
          placeholder={this.props.placeholderData}
          onChange={this.handleChange}
          value={this.state.value}
        /> */}
      </div>
    );
  }
}
export default PhoneNumber;
