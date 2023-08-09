import React from "react";
import "../../../assets/custom/ThemeSection.css";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";

import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import FontPicker from "font-picker-react";
import { fetchthemeInfo } from "../../../actions";
import { PostData } from "../../../stores/requests";
import { THEME_URLS, WEB_FONTS_KEYS } from "../../../util/constants";
import Loader from "../../../components/Common/Loader";

import { store } from "../../../index";

class SubmitButtonElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: true,
      btnFontColor: { r: 0, g: 0, b: 0, a: 1 },
      btnBackgroundColor: { r: 255, g: 255, b: 255, a: 1 },
      defaultWeight: "regular",
      submitButtonStyles: [
        { label: "Default", value: "default" },
        { label: "Round", value: "round" },
      ],
      availableWeights: [{ label: "regular", value: "regular" }],
      fontSize: [
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
      displaybtnFontColorPicker: false,
      displaybtnBackgroundColorPicker: false,
      headerHeading: "Submit Button",
      submitButtonSettings: {
        text: "Submit",
        style: "default",
        background: { r: 255, g: 255, b: 255, a: 1 },
        fontFamily: "Lato",
        fontSize: "20px",
        lineHeight: "auto",
        fontWeight: "regular",
        color: { r: 0, g: 0, b: 0, a: 1 },
        borderRadius: "0px",
        showTotalPrice: false,
        showQuestionsToGo: false,
      },
      SelectedThemeTypoGraphyFontInfo: [],
      SelectedThemeTypoGraphyListInfo: [],
      SelectedThemeSettingsInfo: [],
      SelectedThemeUISettingsInfo: [],
      selectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
      selectedBackgroundFile: "unknown",
    };
  }

  componentWillMount() {
    this.GetSelectedThemeInfo();
  }

  componentWillUnmount() {
    let uiSettings = this.state.SelectedThemeUISettingsInfo.length
      ? this.state.SelectedThemeUISettingsInfo
      : [{}];

    const resultUiSettingsObj = [
      {
        ...uiSettings[0],
        submitButton: this.state.submitButtonSettings,
      },
    ];

    let formModel = {
      FormId: localStorage.CurrentFormId,
      CreatedAt: Date.now(),
      CreatedBy: "1",
      UIElement: JSON.stringify(resultUiSettingsObj),
      TypoGraphyFont: this.state.SelectedThemeTypoGraphyFontInfo,
      TypoGraphyList: this.state.SelectedThemeTypoGraphyListInfo,
      ThemeSettings: this.state.SelectedThemeSettingsInfo,
      BackgroundColor: this.state.selectedBackgroundColor,
      BackgroundFile: this.state.selectedBackgroundFile,
    };
    try {
    
      PostData(THEME_URLS.ADD_THEME_INFO, formModel).then((result) => {
        if (result.statusCode === 200) {
          // alert("Value Submitted");
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
    }
  }

  componentWillUpdate() {
    let self = this;
    let arrTheme = [];
    setTimeout(() => {
      let uiSettings = self.state.SelectedThemeUISettingsInfo.length
        ? self.state.SelectedThemeUISettingsInfo
        : [{}];

      const resultUiSettingsObj = [
        {
          ...uiSettings[0],
          submitButton: self.state.submitButtonSettings,
        },
      ];

      let formModel = {
        FormId: localStorage.CurrentFormId,
        CreatedAt: Date.now(),
        CreatedBy: "1",
        UIElement: JSON.stringify(resultUiSettingsObj),
        TypoGraphyFont: self.state.SelectedThemeTypoGraphyFontInfo,
        TypoGraphyList: self.state.SelectedThemeTypoGraphyListInfo,
        ThemeSettings: self.state.SelectedThemeSettingsInfo,
        BackgroundColor: self.state.selectedBackgroundColor,
        BackgroundFile: self.state.selectedBackgroundFile,
      };
      arrTheme.push(formModel);
      store.dispatch(fetchthemeInfo(arrTheme));
    }, 100);
  }

  GetSelectedThemeInfo = async () => {
    this.setState({ isLoader: true });
    let result = [];
    let resultItems = [];
    result = store.getState().fetchthemeInfo.themeInfo;
    if (result !== undefined) {
      resultItems = result[0];
      if (resultItems.UIElement !== "[]") {
        const uiSettings = JSON.parse(resultItems.UIElement);
        if (uiSettings[0].submitButton) {
          this.SetValuesIntoState(resultItems.UIElement);
        } else {
          this.SetValuesIntoStateFromTheme(resultItems);
        }
      } else {
        this.SetValuesIntoStateFromTheme(resultItems);
      }
      this.setState({
        SelectedThemeSettingsInfo: resultItems.ThemeSettings,
        SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
        SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
        selectedBackgroundColor: resultItems.BackgroundColor,
        selectedBackgroundFile:
          resultItems.BackgroundFile === "unknown"
            ? ""
            : resultItems.BackgroundFile,
      });
      this.setState({ isLoader: false });
    }
  };
  SetValuesIntoState = (itemsinfo) => {
    const uiElementInfo = JSON.parse(itemsinfo);

    const submitButtonObj = uiElementInfo[0].submitButton
      ? { ...uiElementInfo[0].submitButton }
      : { ...this.state.submitButtonSettings };

    const resultUiSettingsObj = [
      { ...uiElementInfo[0], submitButton: submitButtonObj },
    ];

    const fontVariants = this.props.WebFonts.find(
      (prop) => prop.family === submitButtonObj.fontFamily
    );

    let fontWeightsList = [];
    if (fontVariants && fontVariants.variants) {
      fontVariants.variants.map((variant) => {
        if (variant.length < 4 || variant === "regular") {
          fontWeightsList.push({ label: variant, value: variant });
        }
        return variant;
      });
    }

    this.setState({
      btnFontColor: submitButtonObj.color,
      btnBackgroundColor: submitButtonObj.background,
      submitButtonSettings: submitButtonObj,
      SelectedThemeUISettingsInfo: resultUiSettingsObj,
      availableWeights: fontWeightsList.length
        ? fontWeightsList
        : this.state.availableWeights,
    });
  };

  SetValuesIntoStateFromTheme = (resultItems) => {
    if (resultItems.ThemeSettings !== "[]") {
      const items = JSON.parse(resultItems.ThemeSettings);

      let submitButtonObj = this.state.submitButtonSettings;
      const newSubmitButtonObj = {
        ...submitButtonObj,
        color: this.hexToRgb(items.ActiveColor),
        background: items.BackGroundColor,
      };

      const uiSettingObj = JSON.parse(resultItems.UIElement);

      this.setState({
        btnFontColor: this.hexToRgb(items.ActiveColor),
        btnBackgroundColor: items.BackGroundColor,
        submitButtonSettings: newSubmitButtonObj,
        SelectedThemeUISettingsInfo: uiSettingObj,
      });
    } else {
      this.setState({
        SelectedThemeUISettingsInfo: [
          { submitButton: { ...this.state.submitButtonSettings } },
        ],
      });
    }
  };
  handleButtonStyleChage = (selectedStyle, key) => {
    let submitButtonObj = this.state.submitButtonSettings;
    const bRadius = selectedStyle.value === "default" ? "0px" : "1000px";
    const newObj = {
      ...submitButtonObj,
      style: selectedStyle.value,
      borderRadius: bRadius,
    };
    this.setState({
      submitButtonSettings: newObj,
    });
  };
  handleChangeFont = (nextFont, stateKey) => {
    let submitButtonObj = this.state.submitButtonSettings;
    let weightsList = [];
    nextFont.variants.map((variant) => {
      if (variant.length < 4 || variant === "regular") {
        weightsList.push({ label: variant, value: variant });
      }
      return variant;
    });
    const newObj = { ...submitButtonObj, fontFamily: nextFont.family };
    this.setState({
      submitButtonSettings: newObj,
      availableWeights: weightsList,
    });
  };
  handleClick = (name) => {
    const colorPickerName = "display" + name + "ColorPicker";
    this.setState({ [colorPickerName]: !this.state[colorPickerName] });
  };
  handleClose = (name) => {
    let colorPickerName = "display" + name + "ColorPicker";
    this.setState({ [colorPickerName]: false });
  };
  handleChange = (name, colorObj) => {
    const colorPickerName =
      name === "color" ? "btnFontColor" : "btnBackgroundColor";
    let submitButtonObj = this.state.submitButtonSettings;
    const newObj = { ...submitButtonObj, [name]: colorObj.rgb };

    this.setState({
      [colorPickerName]: colorObj.rgb,
      submitButtonSettings: newObj,
    });
  };
  handleWeightChange = (e, stateKey) => {
    const submitButtonObj = this.state.submitButtonSettings;
    const newObj = { ...submitButtonObj, [stateKey]: e.value };
    this.setState({ submitButtonSettings: newObj });
  };
  handleFontSizeChange = (e, stateKey) => {
    let submitButtonObj = this.state.submitButtonSettings;
    const newObj = { ...submitButtonObj, [stateKey]: e.value + "px" };
    this.setState({ submitButtonSettings: newObj });
  };
  handleLineHeightChange = (e, stateKey) => {
    let submitButtonObj = this.state.submitButtonSettings;
    const newObj = { ...submitButtonObj, [stateKey]: e.value + "px" };
    this.setState({ submitButtonSettings: newObj });
  };
  handleSwitchChange = (name) => (event) => {
    let submitButtonObj = this.state.submitButtonSettings;
    const newObj = { ...submitButtonObj, [name]: event.target.checked };
    this.setState({ submitButtonSettings: newObj });
  };
  toColorString = (colorObj) => {
    return `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, ${colorObj.a})`;
  };
  hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : null;
  }

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    const styles = reactCSS({
      default: {
        btnFontColor: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.btnFontColor.r}, ${
            this.state.btnFontColor.g
          }, ${this.state.btnFontColor.b}, ${this.state.btnFontColor.a})`,
        },

        btnBackgroundColor: {
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.btnBackgroundColor.r}, ${
            this.state.btnBackgroundColor.g
          }, ${this.state.btnBackgroundColor.b}, ${
            this.state.btnBackgroundColor.a
          })`,
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
        <div className="UIElements-div">{this.state.headerHeading}</div>
        <div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Pagination style</div>
            <div className="FieldConfiguration__value">
              <input
                type="text"
                defaultValue={this.state.submitButtonSettings.text}
              />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">
              Displays "X questions to go" message
            </div>
            <div className="FieldConfiguration__value">
              <Switch
                checked={this.state.submitButtonSettings.showQuestionsToGo}
                onChange={this.handleSwitchChange("showQuestionsToGo")}
                value="showQuestionsToGo"
                color="primary"
              />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">
              Shows the total price
            </div>
            <div className="FieldConfiguration__value">
              <Switch
                checked={this.state.submitButtonSettings.showTotalPrice}
                onChange={this.handleSwitchChange("showTotalPrice")}
                value="showTotalPrice"
                color="primary"
              />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Button color</div>
            <div className="FieldConfiguration__value">
              <div
                style={{ ...styles.swatch, width: "100%" }}
                onClick={(e) => this.handleClick("btnBackground")}
              >
                <div style={styles.btnBackgroundColor} />
              </div>
              {this.state.displaybtnBackgroundColorPicker ? (
                <div style={styles.popover}>
                  <div
                    style={styles.cover}
                    onClick={(e) => this.handleClose("btnBackground")}
                  />
                  <SketchPicker
                    color={this.toColorString(this.state.btnBackgroundColor)}
                    onChange={(e) => this.handleChange("background", e)}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Button font</div>
            <div className="FieldConfiguration__value">
              <div style={{ clear: "both" }} />
              <div className="ZtOZviTTkcmz3-DO_OzgS">
                <div className="_3pHqiVubpMLEJl33qP-THz">
                  <label style={{ fontSize: "14px", display: "block" }}>
                    Typeface
                  </label>
                  <FontPicker
                    apiKey={WEB_FONTS_KEYS.SECRETKEY}
                    limit={WEB_FONTS_KEYS.LIMIT}
                    ref={this.fontPickerRef}
                    activeFontFamily={
                      this.state.submitButtonSettings.fontFamily
                    }
                    onChange={(e) => this.handleChangeFont(e, "fontFamily")}
                  />
                </div>
                <div className="_1oFs0McTNOmQk5ghTCYFF6">
                  <label style={{ fontSize: "14px", display: "block" }}>
                    Weight
                  </label>
                  <Select
                    options={this.state.availableWeights}
                    value={{
                      label: this.state.submitButtonSettings.fontWeight,
                      value: this.state.submitButtonSettings.fontWeight,
                    }}
                    onChange={(value) =>
                      this.handleWeightChange(value, "fontWeight")
                    }
                  />
                </div>
                <div className="_1oFs0McTNOmQk5ghTCYFF6">
                  <label style={{ fontSize: "14px", display: "block" }}>
                    Font Size
                  </label>
                  {
                    <Select
                      options={this.state.fontSize}
                      value={{
                        label: this.state.submitButtonSettings.fontSize.replace(
                          "px",
                          ""
                        ),
                        value: this.state.submitButtonSettings.fontSize.replace(
                          "px",
                          ""
                        ),
                      }}
                      onChange={(value) =>
                        this.handleFontSizeChange(value, "fontSize")
                      }
                    />
                  }
                </div>
                <div className="_1oFs0McTNOmQk5ghTCYFF6">
                  <label style={{ fontSize: "14px", display: "block" }}>
                    Line Height
                  </label>
                  <Select
                    options={this.state.fontSize}
                    value={{
                      label: this.state.submitButtonSettings.lineHeight.replace(
                        "px",
                        ""
                      ),
                      value: this.state.submitButtonSettings.lineHeight.replace(
                        "px",
                        ""
                      ),
                    }}
                    onChange={(value) =>
                      this.handleLineHeightChange(value, "lineHeight")
                    }
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
                    onClick={(e) => this.handleClick("btnFont")}
                  >
                    <div style={styles.btnFontColor} />
                  </div>
                  {this.state.displaybtnFontColorPicker ? (
                    <div style={styles.popover}>
                      <div
                        style={styles.cover}
                        onClick={(e) => this.handleClose("btnFont")}
                      />
                      <SketchPicker
                        color={this.toColorString(this.state.btnFontColor)}
                        onChange={(e) => this.handleChange("color", e)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Button style</div>
            <div className="FieldConfiguration__value">
              <Select
                options={this.state.submitButtonStyles}
                value={this.state.submitButtonStyles.find(
                  (obj) => obj.value === this.state.submitButtonSettings.style
                )}
                onChange={(value) =>
                  this.handleButtonStyleChage(value, "style")
                }
              />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Preview</div>
            <div className="FieldConfiguration__value">
              <div
                className="editor editor--inline pagination-preview"
                style={{ background: "rgb(230, 230, 230)" }}
              >
                <div
                  className="Theme__editorPreview"
                  style={{ padding: "25px" }}
                >
                  <div className="fieldSection">
                    <div
                      className="submit btn-raised"
                      style={{
                        ...this.state.submitButtonSettings,
                        lineHeight: this.state.submitButtonSettings.lineHeight,
                        color: this.toColorString(this.state.btnFontColor),
                        background: this.toColorString(
                          this.state.btnBackgroundColor
                        ),
                      }}
                    >
                      Submit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubmitButtonElements;
