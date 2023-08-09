import React, { Component } from "react";

class Checkbox extends Component {
  constructor(props) {
    super();
    this.state = {
      isChecked:
        props.jsonData[props.formJson.name] || props.formJson.value || false,
    };
    props.jsonCollector({ [props.formJson.name]: this.state.isChecked });
  }

  handleInputChange = () => {
    this.setState(
      {
        ...this.state,
        isChecked: !this.state.isChecked,
      },
      () => {
        if (this.props.formJson.name === "required") {
          if (this.state.isChecked) {
            //is required
            document.querySelector(
              ".index_" + this.props.index + " span.requied"
            ).innerHTML = "*";
          } else {
            document.querySelector(
              ".index_" + this.props.index + " span.requied"
            ).innerHTML = "";
          }
        }
        this.props.jsonCollector({
          [this.props.formJson.name]: this.state.isChecked,
        });
      }
    );
  };

  render() {
    return (
      <div className="field-input">
        <div className="radio-box">
          <label className="mainLabel">
            <span>{this.props.formJson.label}</span>
            {/*Input*/}
            <input
              type="checkbox"
              checked={this.state.isChecked}
              onChange={() => this.handleInputChange()}
            />
          </label>
        </div>
      </div>
    );
  }
}

export default Checkbox;
