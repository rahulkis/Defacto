import React from "react";
import Select from "react-select";
import _ from "lodash";
class SelectControl extends React.Component {
  //initial state
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.defaultVal,
      OtherInput: false,
      Options: props.options,
      OtherVal: "",
      translatedData: {},
      requiredText: "",
    };
    this.selectedValues = [];
    this.formJSON = this.props.formJson;
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let found = false;
    if (this.state.selectedOption) {
      if (this.props.multi === true) {
        /* for Submit form Value : END */
        this.state.selectedOption.forEach((ele) => {
          if (ele.label !== "Other") {
            this.selectedValues.push(ele.value);
          }
        });
        /* for Submit form Value : END */

        this.state.selectedOption.find(function(element) {
          if (element.label === "Other") {
            found = true;
            element.other = this.props.otherOptionVal;
            this.selectedValues.push(this.props.otherOptionVal);
          }
          return found;
        });
      } else {
        /* for Submit form Value : START */
        this.selectedValues = [];
        if (this.state.selectedOption.label !== "Other") {
          this.selectedValues.push(this.state.selectedOption.value);
        } else {
          // this.state.selectedOption.other = this.props.otherOptionVal;
          //-------------------------------------------------------------------------------//
          let newSelectedOption = this.state.SelectedOption;

          const updatedOptionObject = {
            ...newSelectedOption,
            other: this.props.otherOptionVal,
          };

          newSelectedOption = updatedOptionObject;
          this.setState({ SelectedOption: newSelectedOption });
          //------------------------------------------------------------------//
          this.selectedValues.push(this.props.otherOptionVal);
        }
        /* for Submit form Value : END */
        found = this.state.selectedOption.label === "Other";
      }
      /* for Submit form Value : START */
      _.find(
        this.formJSON,
        function(element) {
          if (element.key === this.props.id) {
            element.value = this.selectedValues;
            this.props.updateJSON(this.formJSON);
          }
        }.bind(this)
      );
      /* for Submit form Value : END */
      if (found === true) {
        this.setState({
          OtherInput: true,
          OtherVal: this.props.otherOptionVal,
        });
        this.props.handleChange(
          "otherOption" + this.props.id,
          this.props.otherOptionVal
        );
      } else {
        this.setState({ OtherInput: false });
      }
      this.props.handleChange(this.props.id, this.state.selectedOption);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.from === "Settings") {
      this.setState({
        Options: nextProps.options,
        OtherVal: nextProps.otherOptionVal,
      });
    }

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
  handleChange = (selectedOption) => {
    this.setState({ selectedOption: selectedOption });
    let found = false;
    if (selectedOption) {
      this.selectedValues = [];
      if (this.props.multi === true) {
        /* for Submit form Value : START */
        selectedOption.forEach((ele) => {
          if (ele.label !== "Other") {
            this.selectedValues.push(ele.value);
          }
        });
        /* for Submit form Value : END */
        selectedOption.find(function(element) {
          if (element.label === "Other") {
            found = true;
          }
          return found;
        });
      } else if (selectedOption) {
        /* for Submit form Value : START */
        this.selectedValues = [];
        if (selectedOption.label !== "Other") {
          this.selectedValues.push(selectedOption.value);
        }
        /* for Submit form Value : END */
        found = selectedOption.label === "Other";
      }
      /* for Submit form Value : START */
      _.find(
        this.formJSON,
        function(element) {
          if (element.key === this.props.id) {
            element.value = this.selectedValues;
            this.props.updateJSON(this.formJSON);
          }
        }.bind(this)
      );
      /* for Submit form Value : END */
      if (found === true) {
        this.setState({ OtherInput: true });
      } else {
        this.setState({ OtherInput: false });
      }
    }

    if (this.props.handleChange) {
      this.props.handleChange(this.props.id, selectedOption);
    }
  };

  handleOtherInput = (e) => {
    let formJSON = this.props.formJson;
    this.setState({ OtherVal: e.target.value });
    this.selectedValues = [];
    /* for Submit form Value : START */
    if (this.props.multi === true) {
      this.state.selectedOption.forEach((ele) => {
        if (ele.label !== "Other") {
          this.selectedValues.push(ele.value);
        } else {
          ele.other = e.target.value;
          this.selectedValues.push(e.target.value);
        }
      });
    } else {
      // this.state.selectedOption.other = e.target.value;
      //----------------------------------------------------------------//
      let newSelectedOption = this.state.SelectedOption;

      const updatedOptionObject = {
        ...newSelectedOption,
        other: e.target.value,
      };

      newSelectedOption = updatedOptionObject;
      this.setState({ SelectedOption: newSelectedOption });
      //--------------------------------------------------------------------//
      this.selectedValues.push(e.target.value);
    }
    _.find(
      this.formJSON,
      function(element) {
        if (element.key === this.props.id) {
          element.value = this.selectedValues;
          this.props.updateJSON(formJSON);
        }
      }.bind(this)
    );
    /* for Submit form Value : END */
    this.props.handleChange("otherOption" + this.props.id, e.target.value);
  };
  removeAnswer = () => {
    this.setState({ selectedOption: "" });
    this.props.handleChange(this.props.id, "");
  };
  render() {
    let parentClass = this.props.parentClass ? this.props.parentClass : "";
    return (
      <div className="field-input-time">
        {this.props.title && <label>{this.props.title}</label>}
        <div className={parentClass}>
          <Select
            placeholder={this.props.placeholder && this.props.placeholder}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            id={this.props.id}
            name={this.props.name}
            value={this.state.selectedOption}
            onChange={this.handleChange}
            isMulti={this.props.multi ? this.props.multi : false}
            isDisabled={this.props.isDisabled}
            options={this.state.Options}
          />
        </div>
        {this.props.RemoveAnswer === true && this.state.selectedOption && (
          <span
            className="btn-product remove-btn"
            style={{ position: "relative", zIndex: "2" }}
            onClick={() => this.removeAnswer()}
          >
            Remove Default Answer
          </span>
        )}
        {this.props.name === "NumberFormatting" && this.state.selectedOption && (
          <span
            className="btn-product remove-btn"
            style={{ position: "relative", zIndex: "2" }}
            onClick={() => this.removeAnswer()}
          >
            Remove Default Settings
          </span>
        )}
        <span id={"error" + this.props.id} className="field__error">
          {this.state.translatedData.questionrequired ||
            "This question is required"}
        </span>
        {this.state.OtherInput && (
          <div>
            <input
              type="text"
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              value={this.state.OtherVal}
              placeholder={
                this.state.translatedData["SpecifyOther"] || "Specify Other.."
              }
              id={"otherOption" + this.props.id}
              onChange={(e) => this.handleOtherInput(e)}
            />
            <span
              id={"errorotherOption" + this.props.id}
              className="field__error"
            >
              {this.state.translatedData["PleaseSpecifyOther"] ||
                "Please Specify Other"}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default SelectControl;
