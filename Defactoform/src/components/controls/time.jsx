import React from "react";
import Select from "react-select";

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      use24Hours: props.use24Hours ? props.use24Hours : false,
      hours: [],
      hoursVal: props.hoursVal ? props.hoursVal : "",
      minutes: props.minutes ? props.minutes : "",
      timeFormat: props.timeFormat ? props.timeFormat : "",
      errorTxt: "Please Enter Valid Time",
      translatedData: {},
    };
    this.format = [
      {
        value: "1",
        label: "am",
      },
      {
        value: "2",
        label: "pm",
      },
    ];
    this.hourCount = 12;
    this.minutes = [];
  }

  componentWillMount() {
    // Minutes
    for (let i = 0; i <= 59; i++) {
      let tempMinute = i;
      if (i >= 0 && i < 10) {
        tempMinute = "0" + i;
      }
      this.minutes.push({ value: tempMinute, label: tempMinute });
    }
    let hours = [];
    let t = 1;
    this.hourCount = 12;
    if (this.props.use24Hours) {
      this.hourCount = 23;
      t = 0;
    }
    // hours
    for (let i = t; i <= this.hourCount; i++) {
      let tempHour = i;
      if (i >= 0 && i < 10) {
        tempHour = "0" + i;
      }
      hours.push({ value: tempHour, label: tempHour });
      if (i === this.hourCount - 1) {
        this.setState({ hours: hours });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    let hours = [];
    let t = 1;
    this.hourCount = 12;

    if (nextProps.use24Hours) {
      this.hourCount = 23;
      t = 0;
    }
    for (let i = t; i <= this.hourCount; i++) {
      let tempHour = i;
      if (i >= 0 && i < 10) {
        tempHour = i;
      }
      hours.push({ value: tempHour, label: tempHour });
      if (i === this.hourCount - 1) {
        this.setState({ hours: hours });
      }
    }
    this.setState({ use24Hours: nextProps.use24Hours });
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

  handleHourChange = (e) => {
    this.setState({ hoursVal: e });
    if (!this.state.minutes) {
      this.setState({
        minutes: {
          value: "00",
          label: "00",
        },
      });
      if (this.props.from === "Settings") {
        this.props.updateArticle("minutes", {
          value: "00",
          label: "00",
        });
      } else {
        this.props.handleChange(
          "minutes",
          {
            value: "00",
            label: "00",
          },
          this.props.id,
          this.state.use24Hours
        );
      }
    }
    if (!this.state.timeFormat) {
      this.setState({
        timeFormat: {
          value: "1",
          label: "am",
        },
      });
      if (this.props.from === "Settings") {
        this.props.updateArticle("timeFormat", {
          value: "1",
          label: "am",
        });
      } else {
        this.props.handleChange(
          "timeFormat",
          {
            value: "1",
            label: "am",
          },
          this.props.id,
          this.state.use24Hours
        );
      }
    }
    if (this.props.from === "Settings") {
      this.props.updateArticle("hoursVal", e);
    } else {
      this.props.handleChange(
        "hoursVal",
        e,
        this.props.id,
        this.state.use24Hours
      );
    }
  };
  handleMinuteChange = (e) => {
    this.setState({ minutes: e });
    if (this.props.from === "Settings") this.props.updateArticle("minutes", e);
    else {
      this.props.handleChange(
        "minutes",
        e,
        this.props.id,
        this.state.use24Hours
      );
    }
  };
  handleTimeFormatChange = (e) => {
    this.setState({ timeFormat: e });
    if (this.props.from === "Settings")
      this.props.updateArticle("timeFormat", e);
    else {
      this.props.handleChange(
        "timeFormat",
        e,
        this.props.id,
        this.state.use24Hours
      );
    }
  };
  removeAnswer = () => {
    this.setState({ minutes: "", hoursVal: "", timeFormat: "" });
    this.props.updateArticle("minutes", "");
    this.props.updateArticle("timeFormat", "");
    this.props.updateArticle("hoursVal", "");
  };
  render() {
    const parentClass = this.props.parentClass
      ? " " + this.props.parentClass
      : "";
    return (
      <div className="field-input-time">
        {this.props.title1 ||
          (this.props.title2 && (
            <div className="display_output">
              <h2>{this.props.title1}</h2>
              <p>{this.props.title2}</p>
            </div>
          ))}
        <div className={"row" + parentClass}>
          <div className="col-md-4">
            <label>{this.state.translatedData["Hours"] || "Hours"}</label>
            <Select
              title="Hours"
              name="Hours"
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              options={this.state.hours}
              value={this.state.hoursVal}
              onChange={(e) => this.handleHourChange(e)}
            />
          </div>
          <div className="col-md-4">
            <label>{this.state.translatedData["Minutes"] || "Minutes"}</label>
            <Select
              title="Minutes"
              name="Minutes"
              onFocus={
                this.props.onFocus && (() => this.props.onFocus(this.props.id))
              }
              onBlur={
                this.props.onBlur && (() => this.props.onBlur(this.props.id))
              }
              value={this.state.minutes}
              options={this.minutes}
              onChange={(e) => this.handleMinuteChange(e)}
            />
          </div>
          {!this.state.use24Hours && (
            <div className="col-md-4">
              <label>{this.state.translatedData["ampm"] || "am/pm"}</label>
              <Select
                title="am/pm"
                name="timeFormat"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                value={this.state.timeFormat}
                options={this.format}
                onChange={(e) => this.handleTimeFormatChange(e)}
              />
            </div>
          )}
        </div>
        {this.props.from === "Settings" &&
          (this.state.minutes ||
            this.state.hoursVal ||
            this.state.timeFormat) && (
            <span
              className="btn-product remove-btn"
              style={{ position: "relative" }}
              onClick={() => this.removeAnswer()}
            >
              Remove Default Answer
            </span>
          )}
        {this.props.from !== "Settings" && (
          <div className="field__error" id={"timeError" + this.props.id}>
            {this.state.errorTxt}
          </div>
        )}
      </div>
    );
  }
}
