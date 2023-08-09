import React from "react";

class RadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: props.defaultVal ? props.defaultVal : "",
      translatedData: {},
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.from !== "settings") {
      this.setState({ selectedOption: nextProps.defaultVal });
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
  handleChange = (value) => {
    this.setState({ selectedOption: value });
    if (this.props.from === "settings") {
      this.props.onChange(value);
    } else {
      this.props.onChange(this.props.id, value);
      let el = document.getElementById("error" + this.props.id);
      if (el) {
        el.style.height = "0px";
        el.style.display = "none";
      }
    }
  };
  removeAnswer = () => {
    this.setState({ selectedOption: "" });
    this.props.onChange("");
  };

  render() {
    return (
      <div>
        <div className="ProductConfiguration__DefaultBlock">
          <label
            htmlFor={this.props.id}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            value="yes"
            onClick={(e) => this.handleChange("yes")}
            className={
              this.state.selectedOption === "yes"
                ? "btn-raised btn-primary"
                : "btn-raised btn-default"
            }
          >
            {this.state.translatedData["Yes"] || "yes"}
          </label>

          <label
            value="no"
            htmlFor={this.props.id}
            onClick={(e) => this.handleChange("no")}
            onFocus={
              this.props.onFocus && (() => this.props.onFocus(this.props.id))
            }
            onBlur={
              this.props.onBlur && (() => this.props.onBlur(this.props.id))
            }
            className={
              this.state.selectedOption === "no"
                ? "btn-raised btn-primary"
                : "btn-raised btn-default"
            }
          >
            {this.state.translatedData["No"] || "No"}
          </label>
        </div>
        {this.props.from === "settings" && this.state.selectedOption && (
          <span
            className="btn-product remove-btn"
            style={{ position: "relative", zIndex: "2" }}
            onClick={() => this.removeAnswer()}
          >
            Remove Default Answer
          </span>
        )}
      </div>
    );
  }
}
export default RadioButtons;
