import React from "react";
import Input from "./input";
import SelectControl from "./select";
let countriesData = require("../../JsonData/countries.json");

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      translatedData: {},
    };
  }

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

  render() {
    return (
      <div>
        <div>
          <div>
            <Input
              type="text"
              label={(this.state.translatedData["Street"] || "Street") + "*"}
              labelClass="address"
              name="Street*"
              title={(this.state.translatedData["Street"] || "Street") + "*"}
              parentClass="address_left"
              class=""
              id={"Street" + this.props.id}
              onChange={this.props.handleInputChange}
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              translationInfo={this.state.translatedData}
            />
            <Input
              type="text"
              label={this.state.translatedData["CitySuburb"] || "City/Suburb"}
              labelClass="address"
              name="City/Suburb"
              title={this.state.translatedData["CitySuburb"] || "City/Suburb"}
              parentClass="address_right"
              class=""
              onChange={this.props.handleInputChange}
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              id={"City" + this.props.id}
              translationInfo={this.state.translatedData}
            />
            <Input
              type="text"
              label={(this.state.translatedData["State"] || "State") + "*"}
              name="State"
              labelClass="address"
              title={(this.state.translatedData["State"] || "State") + "*"}
              Pattern="/^[a-zA-Z ]*$/"
              parentClass="Address__input Address__input--error address_left"
              class=""
              id={"State" + this.props.id}
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              onChange={this.props.handleInputChange}
              translationInfo={this.state.translatedData}
            />
            {this.props.data.requireZipCode !== false && (
              <Input
                type="text"
                label={
                  (this.state.translatedData["ZipPostCode"] ||
                    "Zip/Post Code") + "*"
                }
                name="ZipCode"
                labelClass="address"
                Pattern="/^[a-zA-Z0-9 ]*$/"
                parentClass="address_right"
                class=""
                title={
                  (this.state.translatedData["ZipPostCode"] ||
                    "Zip/Post Code") + "*"
                }
                id={"ZipCode" + this.props.id}
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                onChange={this.props.handleInputChange}
                translationInfo={this.state.translatedData}
              />
            )}

            <SelectControl
              options={countriesData}
              name="select"
              id={"Country" + this.props.id}
              title={(this.state.translatedData["Country"] || "Country") + "*"}
              isDisabled={this.props.data.restrictedCountry ? true : false}
              defaultVal={
                this.props.data.defaultVal ? this.props.data.defaultVal : ""
              }
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              translationInfo={this.state.translatedData}
              handleChange={this.props.handleCountryChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Address;
