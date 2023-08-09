import React from "react";
import Input from "./input";
import RadioButtons from "./RadioButtons";
import Textarea from "./textArea";
import Address from "./addressControl";
import Select from "./select";
import DateControl from "./date";
import Time from "./time";
import Scale from "./scale";
let countriesData = require("../../JsonData/countries.json");

class GetFormFields extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {}
  counter = 0;
  getCounter = () => {
    return this.counter++;
  };
  render() {
    let actualInput = "testing";
    let labelData = this.props.labelData;
    let questionLabel1 =
      labelData._root.entries && labelData._root.entries[1]
        ? labelData._root.entries[1][1]
        : "";
    let questionLabel2 =
      labelData._root.entries && labelData._root.entries[2]
        ? labelData._root.entries[2][1]
        : "";
    const controlType =
      labelData._root.entries && labelData._root.entries[3]
        ? labelData._root.entries[3][1]
        : "";
    let keyVal =
      labelData._root.entries && labelData._root.entries[0]
        ? labelData._root.entries[0][1]
        : "";
    let inpHTML = "";
    switch (controlType) {
      case "":
      case "text":
        inpHTML = (
          <Textarea
            id={keyVal}
            title1={questionLabel1}
            title2={questionLabel2}
          />
        );
        return inpHTML;
      case "email":
        inpHTML = (
          <Input
            title1={questionLabel1}
            title2={questionLabel2}
            type="email"
            id={keyVal}
            class="test"
            name="email"
            size="30"
            placeholder=""
          />
        );
        // return <InputControlField type = "email"  name="email"  size="30" placeholder="Email required"/>;
        return inpHTML;
      case "url":
        inpHTML = (
          <Input
            title1={questionLabel1}
            title2={questionLabel2}
            type="text"
            class="test"
            name="url"
            size="30"
            required="true"
            formJson={actualInput}
            id={keyVal}
          />
        );
        return inpHTML;
      case "yesno":
        inpHTML = (
          <div className="YesNo">
            <RadioButtons
              class="btn-raised btn-primary"
              type="radio"
              name="yesnoRadio"
              value="Yes"
              labelval="Yes"
              id="Yes"
              onchange={this.abc}
            />
            <RadioButtons
              class="btn-raised btn-primary"
              type="radio"
              name="yesnoRadio"
              value="No"
              labelval="No"
              id="No"
              onchange={this.onchange}
            />
          </div>
        );
        return inpHTML;
      case "number":
        inpHTML = (
          <Input
            title1={questionLabel1}
            title2={questionLabel2}
            class="test"
            type="number"
            name="number"
            pattern="[0-9]*"
            size="30"
            required="true"
            id={keyVal}
          />
        );
        return inpHTML;
      case "phonenumber":
        inpHTML = (
          <Input
            title1={questionLabel1}
            title2={questionLabel2}
            type="tel"
            name="add"
            autocomplete="tel"
            lass="LiveField__input"
            placeholderchar="x"
            size="30"
            required="true"
            id={keyVal}
          />
        );
        return inpHTML;
      case "address":
        const props = {
          parentClass: "",
          class: "",
        };
        inpHTML = <Address {...props} id={keyVal} />;
        return inpHTML;
      case "country":
        inpHTML = (
          <Select
            title1={questionLabel1}
            title2={questionLabel2}
            name="country"
            options={countriesData}
            id={keyVal}
          />
        );
        return inpHTML;
      case "date":
        inpHTML = (
          <DateControl
            title1={questionLabel1}
            title2={questionLabel2}
            name="Date"
            key={this.getCounter()}
          />
        );
        return inpHTML;
      case "time":
        inpHTML = (
          <Time
            title1={questionLabel1}
            title2={questionLabel2}
            name="time"
            id={keyVal}
          />
        );
        return inpHTML;
      case "scale":
        inpHTML = <Scale />;
        return inpHTML;
      default:
        return <div />;
    }
  }
}
export default GetFormFields;
