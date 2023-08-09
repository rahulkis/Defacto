import React from "react";
import FontPicker from "font-picker-react";
import reactCSS from "reactcss";
import Select from "react-select";
import { SketchPicker } from "react-color";
import _ from "lodash";
import { WEB_FONTS_KEYS } from "../../../util/constants";
import { GetData } from "../../../stores/requests";

export default class ThemeSettingsCustomPDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePrimaryFontFamily: "Lato",
      header: "Heading1",
      HeaderType: "",
      colorOne: { r: "0", g: "0", b: "0", a: "1" },
      displayOneColorPicker: false,

      FontSize: [
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
        { label: "14", value: "14" },
        { label: "16", value: "16" },
        { label: "18", value: "18" },
        { label: "20", value: "20" },
        { label: "24", value: "24" },
        { label: "36", value: "36" },
        { label: "48", value: "48" },
        { label: "64", value: "64" },
        { label: "72", value: "72" },
      ],
      FontWeight: [
        { label: "100", value: "100" },
        { label: "300", value: "300" },
        { label: "regular", value: "regular" },
        { label: "700", value: "700" },
        { label: "900", value: "00" },
      ],
    };
  }
  componentWillMount() {
    GetData(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=" +
        WEB_FONTS_KEYS.SECRETKEY
    ).then((result) => {
      if (result != null && result.items !== undefined) {
        this.setState({ WebFonts: result.items });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ HeaderType: nextProps.headerType });
  }

  ChangeFont = (nextFont, key) => {
    let arrWeight = [];
    let results = _.filter(this.state.WebFonts, function(obj) {
      return obj.family.indexOf(nextFont.family) !== -1;
    });

    _.forEach(results[0].variants, (user) => {
      arrWeight.push({ label: user, value: user });
    });

    let fontObj = this.state.HeaderType;
    const fontObj1 = { ...fontObj, fontFamily: nextFont.family };

    this.props.fontChange(nextFont.family, fontObj1, arrWeight);
  };
  handleWeightChange = (e) => {
    let fontObj = this.state.HeaderType;

    const fontObj1 = { ...fontObj, fontWeight: e.value };
    this.props.weightChange(fontObj1);
  };
  handleClick = (name) => {
    let colorPickerName = "display" + name + "ColorPicker";
    this.setState({ [colorPickerName]: !this.state[colorPickerName] });
  };
  handleClose = (name) => {
    let colorPickerName = "display" + name + "ColorPicker";
    this.setState({ [colorPickerName]: false });
  };
  handleChange = (name, colorTwo) => {
    let colorPickerName = "color" + name;
    // let FontType = this.state.HeaderType + "Font";
    let fontObj = this.state.HeaderType;

    const fontObj1 = {
      ...fontObj,
      color: `rgba(${colorTwo.rgb.r}, ${colorTwo.rgb.g}, ${colorTwo.rgb.b}, ${
        colorTwo.rgb.a
      })`,
    };
    this.setState({
      [colorPickerName]: colorTwo.rgb,
      // [FontType]: fontObj1,
    });
    this.props.colorChange(colorTwo.rgb, fontObj1);
  };
  handleLineHeightChange = (e, headerType) => {
    let fontObj = this.state.HeaderType;
    const fontObj1 = { ...fontObj, lineHeight: e.value + "px" };
    this.props.lineHeight(fontObj1);
  };
  handleFontSizeChange = (e) => {
    let fontObj = this.state.HeaderType;
    const fontObj1 = { ...fontObj, fontSize: e.value + "px" };
    this.props.fontSize(fontObj1);
  };
  render() {
    const styles = reactCSS({
      default: {
        colorOne: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.colorOne.r}, ${
            this.state.colorOne.g
          }, ${this.state.colorOne.b}, ${this.state.colorOne.a})`,
        },

        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });
    return (
      <div>
        {this.state.HeaderType && (
          <div className="ZtOZviTTkcmz3-DO_OzgS">
            <div className="_3pHqiVubpMLEJl33qP-THz">
              <label style={{ fontSize: "14px", display: "block" }}>
                Typeface
              </label>
              <FontPicker
                apiKey={WEB_FONTS_KEYS.SECRETKEY}
                limit={WEB_FONTS_KEYS.LIMIT}
                activeFontFamily={this.state.HeaderType.fontFamily}
                onChange={(e) => this.ChangeFont(e, "Primary")}
              />
            </div>
            <div className="_1oFs0McTNOmQk5ghTCYFF6">
              <label style={{ fontSize: "14px", display: "block" }}>
                Weight
              </label>
              <Select
                options={this.state.FontWeight}
                defaultValue={{
                  label: this.state.HeaderType.fontWeight,
                  value: this.state.HeaderType.fontWeight,
                }}
                onChange={(value) =>
                  this.handleWeightChange(value, this.state.HeaderType)
                }
              />
            </div>
            <div className="_1oFs0McTNOmQk5ghTCYFF6">
              <label style={{ fontSize: "14px", display: "block" }}>
                Font Size
              </label>
              {
                <Select
                  options={this.state.FontSize}
                  value={{
                    label: this.state.HeaderType.fontSize,
                    value: this.state.HeaderType.fontSize,
                  }}
                  onChange={(value) =>
                    this.handleFontSizeChange(value, this.state.HeaderType)
                  }
                />
              }
            </div>
            <div className="_1oFs0McTNOmQk5ghTCYFF6">
              <label style={{ fontSize: "14px", display: "block" }}>
                Line Height
              </label>
              <Select
                options={this.state.FontSize}
                value={{
                  label: this.state.HeaderType.lineHeight,
                  value: this.state.HeaderType.lineHeight,
                }}
                onChange={(value) => this.handleLineHeightChange(value)}
              />
            </div>
            <div
              className="_1oFs0McTNOmQk5ghTCYFF6"
              style={{ position: "relative" }}
            >
              <label style={{ fontSize: "14px", display: "block" }}>
                Color
              </label>

              <div
                style={styles.swatch}
                onClick={(e) => this.handleClick("One")}
              >
                <div style={styles.colorOne} />
              </div>
              {this.state.displayOneColorPicker ? (
                <div style={styles.popover}>
                  <div
                    style={styles.cover}
                    onClick={(e) => this.handleClose("One")}
                  />
                  <SketchPicker
                    color={this.state.colorOne}
                    onChange={(e) => this.handleChange("One", e)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}
