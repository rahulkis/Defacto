import React from "react";
import _ from "lodash";

class MultipleChoice extends React.Component {
  constructor(props) {
    super(props);
    this.Props = props;
    this.state = {
      multiChoiceOptions: "", // default option
      multianswerquestion: false,
      otherVal: "",
      otherInput: false,
      selectedOption: "",
      hideLabelFromImg: false,
      addImageToOption_MultipleChoice: props.addImageToOption_MultipleChoice,
      activeSessionClass:
        "btn-raised  Choices__choice--1 choice-theme choice-input",
      InactiveSessionClass:
        "btn-raised  Choices__choice--1 choice-theme choice-input",
      activeColor: this.props.ActiveColor,
      translatedData: {},
    };
    this.multiSelectOption = [];
    this.handleChange = this.handleChange.bind(this);
    //alert(this.props.ActiveColor)
  }

  componentWillMount() {
    this.setState({
      selectedOption: this.props.defaultVal ? this.props.defaultVal : "",
      multianswerquestion: this.props.multianswerquestion
        ? this.props.multianswerquestion
        : false,
      multiChoiceOptions:
        this.props.multiChoiceOptions === undefined
          ? this.state.multiChoiceOptions
          : this.props.multiChoiceOptions,
      hideLabelFromImg: this.props.hideLabelFromImg,
    });
    this.props.handleChange(this.props.id, this.props.defaultVal);
  }
  componentDidMount() {
    let found = false;
    if (this.state.selectedOption) {
      if (this.props.multianswerquestion === true) {
        this.state.selectedOption.find(
          function(element) {
            if (element.value === "Other") {
              found = true;
              element.other = this.props.otherOptionVal;
            }
          }.bind(this)
        );
      } else {
        found = this.state.selectedOption.value === "Other";
        if (found) {
          let newSelectedOption = this.state.selectedOption;

          const updatedOptionObject = {
            ...newSelectedOption,
            other: this.props.otherOptionVal,
          };

          newSelectedOption = updatedOptionObject;
          this.setState({ selectedOption: newSelectedOption });
          // this.state.selectedOption.other = this.props.otherOptionVal;
        }
      }
      if (found === true) {
        this.setState({
          otherInput: true,
          otherVal: this.props.otherOptionVal,
        });
        this.props.handleChange(
          "otherOption" + this.props.id,
          this.props.otherOptionVal
        );
      } else {
        this.setState({ otherInput: false });
      }
      this.props.handleChange(this.props.id, this.state.selectedOption);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.from === "Settings") {
      this.setState({
        multiChoiceOptions: nextProps.multiChoiceOptions,
        otherVal: nextProps.otherOptionVal,
        multianswerquestion: nextProps.multianswerquestion,
        addImageToOption_MultipleChoice:
          nextProps.addImageToOption_MultipleChoice,
        hideLabelFromImg: nextProps.hideLabelFromImg,
      });
    } else {
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
  handleChange = (option) => {
    if (option.value === "Other") {
      option.other = this.state.otherVal;
      this.setState({ otherInput: true });
    } else {
      option.other = this.state.otherVal;
      this.setState({ otherInput: false });
    }
    this.setState({ selectedOption: option });
    this.props.handleChange(this.props.id, option);
  };

  handleMultiChange = (e, option) => {
    let maxAnswer = this.props.maxAnswer;
    if (e.target.checked) {
      if (!maxAnswer) {
        if (option.value === "Other") {
          this.setState({ otherInput: true });
        }
        this.multiSelectOption.push(option);
      } else if (this.multiSelectOption.length < maxAnswer) {
        if (option.value === "Other") {
          option.other = this.state.otherVal;
          this.setState({ otherInput: true });
        }
        this.multiSelectOption.push(option);
      }
    } else {
      if (option.value === "Other") {
        option.other = this.state.otherVal;
        this.setState({ otherInput: e.target.checked });
      }
      this.multiSelectOption.pop(option);
    }
    this.setState({ selectedOption: this.multiSelectOption });
    this.props.handleChange(this.props.id, this.multiSelectOption);
  };

  handleOtherInput = (e) => {
    this.setState({ otherVal: e.target.value });
    if (this.state.multianswerquestion === true) {
      this.state.selectedOption.forEach((val) => {
        if (val.label === "Other") {
          val.other = e.target.value;
        }
      });
    } else {
      //this.state.selectedOption.other = e.target.value;
      let newSelectedOption = this.state.selectedOption;

      const updatedOptionObject = {
        ...newSelectedOption,
        other: e.target.value,
      };

      newSelectedOption = updatedOptionObject;
      this.setState({ selectedOption: newSelectedOption });
    }

    this.props.handleChange("otherOption" + this.props.id, e.target.value);
  };
  render() {
    return (
      <div className="choices">
        {this.state.multiChoiceOptions.map((option, key) => {
          return (
            <div key={key}>
              {this.state.multianswerquestion === true ? (
                <label className="Choices__choice btn-raised btn-default  Choices__choice--1">
                  <div className="Choices__label">
                    {option.src && this.state.hideLabelFromImg
                      ? ""
                      : option.label}
                    <input
                      type="checkbox"
                      onFocus={
                        this.props.onFocus &&
                        (() => this.props.onFocus(this.props.id))
                      }
                      onBlur={
                        this.props.onBlur &&
                        (() => this.props.onBlur(this.props.id))
                      }
                      className="check-box"
                      value={option.value}
                      onChange={(e) => this.handleMultiChange(e, option)}
                      checked={
                        _.findIndex(this.state.selectedOption, {
                          value: option.value,
                        }) > -1
                      }
                    />
                  </div>
                  {this.state.addImageToOption_MultipleChoice && option.src && (
                    <div className="Choices__imagebox">
                      <img alt="" src={option.src} />
                    </div>
                  )}
                </label>
              ) : (
                <label
                  className={
                    this.state.selectedOption === option
                      ? this.state.activeSessionClass
                      : this.state.InactiveSessionClass
                  }
                  style={{
                    background:
                      this.state.selectedOption === option
                        ? `${this.state.activeColor}`
                        : "",
                  }}
                >
                  {option.src && this.state.hideLabelFromImg
                    ? ""
                    : option.label}
                  <input
                    type="radio"
                    name="Choice"
                    onFocus={
                      this.props.onFocus &&
                      (() => this.props.onFocus(this.props.id))
                    }
                    onBlur={
                      this.props.onBlur &&
                      (() => this.props.onBlur(this.props.id))
                    }
                    className="input-radio"
                    value={option.value}
                    onChange={() => this.handleChange(option)}
                    checked={
                      this.state.selectedOption &&
                      this.state.selectedOption.label === option.label
                    }
                  />
                  {this.state.addImageToOption_MultipleChoice && option.src && (
                    <div className="Choices__imagebox">
                      <img alt="" src={option.src} />
                    </div>
                  )}
                </label>
              )}
            </div>
          );
        })}

        {this.state.otherInput === true && (
          <div>
            <input
              type="text"
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              value={this.state.otherVal}
              placeholder="Specify Other.."
              id={"otherOption" + this.props.id}
              onChange={(e) => this.handleOtherInput(e)}
              className={this.state.otherInput ? "show" : "hide"}
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
export default MultipleChoice;
