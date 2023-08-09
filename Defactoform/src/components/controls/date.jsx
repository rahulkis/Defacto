import React from "react";
import Select from "react-select";

let months = require("../../JsonData/months.json");

export default class DateControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: months,
      days: [],
      years: [],
      errorTxt: "Please Enter Valid date",
      translatedData: {},
    };
    this.yearJson = [];
    this.days = [];
    let currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;
    this.minOffset = -20; // for showing future dates
    this.maxOffset = 150; // Change to whatever you want // for showing past dates
    this.allowFutureDate = props.allowFutureDate;
    this.allowPastDate = props.allowPastDate;
    this.selectedFormatId = 1;
  }
  componentWillMount() {
    this.setState({
      selectedMonth: this.props.selectedMonth
        ? this.props.selectedMonth
        : this.state.selectedMonth,
      selectedYear: this.props.selectedYear
        ? this.props.selectedYear
        : this.state.selectedYear,
      selectedDay: this.props.selectedDay ? this.props.selectedDay : "",
    });
    if (this.props.allowFutureDate && this.props.allowPastDate) {
      this.minOffset = 0; // for showing future dates
      this.maxOffset = 0; // Change to whatever you want // for showing past dates
    } else if (this.props.allowFutureDate === true) {
      this.minOffset = -20; // for showing future dates
      this.maxOffset = 0; // Change to whatever you want // for showing past dates
    } else if (this.props.allowPastDate === true) {
      this.minOffset = 0; // for showing future dates
      this.maxOffset = 150; // Change to whatever you want // for showing past dates
    } else {
      this.minOffset = -20; // for showing future dates
      this.maxOffset = 150; // Change to whatever you want // for showing past dates
    }
    this.setYear();
    this.renderDays(31, 1);
    if (this.props.selectedFormat) {
      this.selectedFormatId = this.props.selectedFormat.id;
    }
  }

  componentWillReceiveProps(nextProps) {
    //if (nextProps.from !== "Settings") {
    this.setState({
      selectedMonth:
        nextProps.selectedMonth !== undefined
          ? nextProps.selectedMonth
          : this.state.selectedMonth,
      selectedYear:
        nextProps.selectedYear !== undefined
          ? nextProps.selectedYear
          : this.state.selectedYear,
      selectedDay:
        nextProps.selectedDay !== undefined ? nextProps.selectedDay : "",
    });
    // }
    if (nextProps.selectedFormat) {
      this.selectedFormatId = nextProps.selectedFormat.id;
    }
    if (
      nextProps.selectedYear !== undefined &&
      nextProps.selectedYear.value === new Date().getFullYear()
    ) {
      if (this.allowFutureDate) {
        let filteredMonths = months.filter(
          function(value, index, arr) {
            return value.id >= this.currentMonth;
          }.bind(this)
        );
        this.setState({ months: filteredMonths });
      } else if (this.allowPastDate) {
        let filteredMonths = months.filter(
          function(value, index, arr) {
            return value.id <= this.currentMonth;
          }.bind(this)
        );
        this.setState({ months: filteredMonths });
      }
    }
    this.allowFutureDate = nextProps.allowFutureDate;
    this.allowPastDate = nextProps.allowPastDate;
    if (nextProps.allowFutureDate && nextProps.allowPastDate) {
      this.minOffset = 0; // for showing future dates
      this.maxOffset = 0; // Change to whatevezr you want // for showing past dates
    } else if (nextProps.allowFutureDate === true) {
      this.minOffset = -20; // for showing future dates
      this.maxOffset = 0; // Change to whatever you want // for showing past dates
    } else if (nextProps.allowPastDate === true) {
      this.minOffset = 0; // for showing future dates
      this.maxOffset = 150; // Change to whatever you want // for showing past dates
    } else {
      this.minOffset = -20; // for showing future dates
      this.maxOffset = 150; // Change to whatever you want // for showing past dates
    }
    this.setYear();
    if (
      nextProps.translationInfo &&
      Object.keys(nextProps.translationInfo).length &&
      Object.keys(nextProps.translationInfo).length !==
        Object.keys(this.state.translatedData).length
    ) {
      this.setState({
        translatedData: nextProps.translationInfo,
      });
      if (nextProps.translationInfo.validDate) {
        this.setState({
          errorTxt: nextProps.translationInfo.validDate,
        });
      }
    }
  }

  setYear = () => {
    this.yearJson = [];
    for (let i = this.minOffset; i <= this.maxOffset; i++) {
      let year = this.currentYear - i;
      this.yearJson.push({ id: year, value: year, label: year });
    }
    this.setState({ years: this.yearJson });
  };

  renderDays = (count, monthID) => {
    this.days = [];
    let index = 1;
    if (this.allowFutureDate) {
      if (monthID === this.currentMonth) {
        let currentDate = new Date().getDate();
        index = currentDate;
        if (this.state.selectedDay.id <= index) {
          this.setState({ selectedDay: "" });
        }
      }
    } else if (this.allowPastDate) {
      if (monthID === this.currentMonth) {
        let currentDate = new Date().getDate();
        count = currentDate;
        if (this.state.selectedDay.id > count) {
          this.setState({ selectedDay: "" });
        }
      }
    }
    for (let i = index; i <= count; i++) {
      this.days.push({ id: i, value: i, label: i });
    }
    this.setState({ days: this.days });
  };
  handleMonthChange = (value) => {
    this.setState({ selectedMonth: value });
    let errorMonthChange = document.getElementById("dateError" + this.props.id);
    let year = this.state.selectedYear
      ? this.state.selectedYear.value
      : this.currentYear;
    let daysInMonth = this.daysInMonth(value.id, year);
    this.renderDays(daysInMonth, value.id);

    if (this.props.from !== "Settings") {
      if (!this.state.selectedYear) {
        this.setState({
          errorTxt:
            this.state.translatedData["chooseAyear"] || "Please Choose Year",
        });
        if (errorMonthChange) {
          errorMonthChange.style.height = "25px";
        }
      } else if (!this.state.selectedDay) {
        this.setState({
          errorTxt:
            this.state.translatedData["chooseAday"] || "Please Choose Day",
        });
        if (errorMonthChange) {
          errorMonthChange.style.height = "25px";
        }
      } else {
        if (errorMonthChange) {
          errorMonthChange.style.height = "0px";
        }
      }
      // this.props.handleChange("selectedMonth",e);
      this.props.setDate(
        "selectedMonth",
        value,
        this.props.id,
        this.selectedFormatId
      );
    } else {
      this.props.updateArticle("selectedMonth", value);
    }
  };

  handleYearChange = (e) => {
    this.setState({ selectedYear: e });
    let month = this.state.selectedMonth ? this.state.selectedMonth.id : 1;
    let daysInMonth = this.daysInMonth(month, e.value);
    let errorYearChange = document.getElementById("dateError" + this.props.id);
    if (this.allowFutureDate) {
      if (this.currentYear === e.value) {
        let filteredMonths = months.filter(
          function(value, index, arr) {
            return value.id >= this.currentMonth;
          }.bind(this)
        );

        let monthIndex = filteredMonths.findIndex(
          (x) => x.id === this.state.selectedMonth.id
        );
        if (monthIndex === -1) {
          this.setState({ selectedMonth: "" });
          this.setState({ selectedDay: "" });
          if (this.props.from === "Settings") {
            this.props.updateArticle("selectedMonth", "");
            this.props.updateArticle("selectedDay", "");
          }
          month = 1;
        }
        this.setState({ months: filteredMonths });
      }
    } else if (this.allowPastDate) {
      if (this.currentYear === e.value) {
        let filteredMonths = months.filter(
          function(value, index, arr) {
            return value.id <= this.currentMonth;
          }.bind(this)
        );
        let monthIndex = filteredMonths.findIndex(
          (mIndex) => mIndex.id === this.state.selectedMonth.id
        );
        if (monthIndex === -1) {
          this.setState({ selectedMonth: "" });
          this.setState({ selectedDay: "" });
          if (this.props.from === "Settings") {
            this.props.updateArticle("selectedMonth", "");
            this.props.updateArticle("selectedDay", "");
          }
          month = 1;
        }
        this.setState({ months: filteredMonths });
      }
    }
    if (this.props.from !== "Settings") {
      if (!this.state.selectedMonth) {
        this.setState({
          errorTxt:
            this.state.translatedData["chooseAmonth"] || "Please Choose Month",
        });
        if (errorYearChange) {
          errorYearChange.style.height = "25px";
        }
      } else if (!this.state.selectedDay) {
        this.setState({
          errorTxt:
            this.state.translatedData["chooseAday"] || "Please Choose Day",
        });
        if (errorYearChange) {
          errorYearChange.style.height = "25px";
        }
      } else {
        if (errorYearChange) {
          errorYearChange.style.height = "0px";
        }
      }
      // this.props.handleChange("selectedYear",e);
      this.props.setDate(
        "selectedYear",
        e,
        this.props.id,
        this.selectedFormatId
      );
    } else {
      this.props.updateArticle("selectedYear", e);
    }
    this.renderDays(daysInMonth, month);
  };
  handleDateChange = (e) => {
    this.setState({ selectedDay: e });
    let errorDateChange = document.getElementById("dateError" + this.props.id);

    if (this.props.from !== "Settings") {
      if (!this.state.selectedMonth) {
        this.setState({
          errorTxt:
            this.state.translatedData["chooseAmonth"] || "Please Choose Month",
        });
        if (errorDateChange) {
          errorDateChange.style.height = "25px";
        }
      } else if (!this.state.selectedYear) {
        this.setState({
          errorTxt:
            this.state.translatedData["chooseAyear"] || "Please Choose Year",
        });
        if (errorDateChange) {
          errorDateChange.style.height = "25px";
        }
      } else {
        if (errorDateChange) {
          errorDateChange.style.height = "0px";
        }
      }
      //  this.props.handleChange("selectedDay",e);
      this.props.setDate(
        "selectedDay",
        e,
        this.props.id,
        this.selectedFormatId
      );
    } else {
      this.props.updateArticle("selectedDay", e);
    }
  };
  leapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  removeAnswer = () => {
    this.setState({ selectedDay: "", selectedMonth: "", selectedYear: "" });
    this.props.updateArticle("selectedDay", "");
    this.props.updateArticle("selectedMonth", "");
    this.props.updateArticle("selectedYear", "");
  };
  render() {
    const selectedFormatId = this.props.selectedFormat
      ? this.props.selectedFormat.id
      : 1;
    const parentClass = this.props.parentClass
      ? " " + this.props.parentClass
      : "";
    return (
      <div>
        {selectedFormatId === 2 ? (
          <div className={"row" + parentClass}>
            <div className="col-md-4">
              <label>{this.state.translatedData["Month"] || "Month"}</label>
              <Select
                name="Month"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                onChange={(e) => this.handleMonthChange(e)}
                options={this.state.months}
                value={this.state.selectedMonth}
              />
            </div>
            <div className="col-md-4">
              <label>{this.state.translatedData["Day"] || "Day"}</label>
              <Select
                name="Day"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                options={this.state.days}
                onChange={(e) => this.handleDateChange(e)}
                value={this.state.selectedDay}
              />
            </div>

            <div className="col-md-4">
              <label>{this.state.translatedData["Year"] || "Year"}</label>
              <Select
                title="Year"
                name="Year"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                options={this.state.years}
                onChange={(e) => this.handleYearChange(e)}
                value={this.state.selectedYear}
              />
            </div>
          </div>
        ) : selectedFormatId === 3 ? (
          <div className={"row" + parentClass}>
            <div className="col-md-4">
              <label>{this.state.translatedData["Year"] || "Year"}</label>
              <Select
                title="Year"
                name="Year"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                options={this.state.years}
                onChange={(e) => this.handleYearChange(e)}
                value={this.state.selectedYear}
              />
            </div>
            <div className="col-md-4">
              <label>{this.state.translatedData["Month"] || "Month"}</label>
              <Select
                title="Month"
                name="Month"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                onChange={(e) => this.handleMonthChange(e)}
                options={this.state.months}
                value={this.state.selectedMonth}
              />
            </div>
            <div className="col-md-4">
              <label>{this.state.translatedData["Day"] || "Day"}</label>
              <Select
                name="Day"
                options={this.state.days}
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                onChange={(e) => this.handleDateChange(e)}
                value={this.state.selectedDay}
              />
            </div>
          </div>
        ) : (
          <div className={"row" + parentClass}>
            <div className="col-md-4">
              <label>{this.state.translatedData["Day"] || "Day"}</label>
              <Select
                name="Day"
                options={this.state.days}
                onChange={(e) => this.handleDateChange(e)}
                value={this.state.selectedDay}
              />
            </div>
            <div className="col-md-4">
              <label>{this.state.translatedData["Month"] || "Month"}</label>
              <Select
                title="Month"
                name="Month"
                onChange={(e) => this.handleMonthChange(e)}
                options={this.state.months}
                value={this.state.selectedMonth}
              />
            </div>
            <div className="col-md-4">
              <label>{this.state.translatedData.Year || "Year"}</label>
              <Select
                title="Year"
                name="Year"
                onFocus={
                  this.props.onFocus &&
                  (() => this.props.onFocus(this.props.id))
                }
                onBlur={
                  this.props.onBlur && (() => this.props.onBlur(this.props.id))
                }
                options={this.state.years}
                value={this.state.selectedYear}
                onChange={(e) => this.handleYearChange(e)}
              />
            </div>
          </div>
        )}
        {this.props.from === "Settings" &&
          (this.state.selectedYear ||
            this.state.selectedMonth ||
            this.state.selectedDay) && (
            <span
              className="btn-product remove-btn"
              style={{ position: "relative" }}
              onClick={() => this.removeAnswer()}
            >
              Remove Default Answer
            </span>
          )}
        {this.props.from !== "Settings" && (
          <div className="field__error" id={"dateError" + this.props.id}>
            {this.state.errorTxt || ""}
          </div>
        )}
      </div>
    );
  }
}
