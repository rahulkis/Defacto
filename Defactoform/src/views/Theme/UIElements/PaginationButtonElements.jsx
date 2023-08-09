import React from "react";
import "../../../assets/custom/ThemeSection.css";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";

import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import FontPicker from "font-picker-react";
import { fetchthemeInfo } from "../../../actions";
import { PostData } from "../../../stores/requests";
import { THEME_URLS,WEB_FONTS_KEYS } from "../../../util/constants";
import Loader from "../../../components/Common/Loader";
import PaginationButtonsPreview from "./PaginationButtonsPreview";

import { store } from "../../../index";

class PaginationButtonElements extends React.Component {
  constructor(props) {
    super(props);
    this.fontPickerRef = React.createRef();
    this.state = {
      isLoader: true,
      btnFontColor: { r: 0, g: 0, b: 0, a: 1 },
      btnBackgroundColor: { r: 255, g: 255, b: 255, a: 1 },
      defaultWeight: "regular",
      paginationStylesList: [
        { label: "Buttons Only", value: "buttons" },
        { label: "Numbers", value: "numbers" },
        { label: "Progress Bar", value: "progress" },
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
      headerHeading: "Pagination Buttons",
      paginationButtons: {
        style: "buttons",
        background: { r: 255, g: 255, b: 255, a: 1 },
        fontFamily: "Lato",
        fontSize: "20px",
        lineHeight: "auto",
        fontWeight: "regular",
        color: { r: 0, g: 0, b: 0, a: 1 },
        showTotalPrice: false,
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
        Pagination: this.state.paginationButtons,
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
      // this.setState({ isLoader: false });
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
          Pagination: self.state.paginationButtons,
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
        this.SetValuesIntoState(resultItems.UIElement);
      } else {
        if (resultItems.ThemeSettings !== "[]") {
          const items = JSON.parse(resultItems.ThemeSettings);

          let paginationObj = this.state.paginationButtons;
          const newPaginationObj = {
            ...paginationObj,
            color: this.hexToRgb(items.ActiveColor),
            background: items.BackGroundColor,
          };
          const uiSettingObj = [
            {
              Pagination: newPaginationObj,
            },
          ];
          this.setState({
            btnFontColor: this.hexToRgb(items.ActiveColor),
            btnBackgroundColor: items.BackGroundColor,
            paginationButtons: newPaginationObj,
            SelectedThemeUISettingsInfo: uiSettingObj,
          });
        } else {
          this.setState({
            SelectedThemeUISettingsInfo: [
              { pagination: { ...this.state.paginationButtons } },
            ],
          });
        }
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
    let paginationObj = [];
    if (uiElementInfo[0].Pagination) {
      paginationObj = { ...uiElementInfo[0].Pagination };
    } else {
      paginationObj = { ...this.state.paginationButtons };
    }
    const resultUiSettingsObj = [
      { ...uiElementInfo[0], Pagination: paginationObj },
    ];
    const fontVariants = this.props.WebFonts.find(
      (prop) => prop.family === paginationObj.fontFamily
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
      btnFontColor: paginationObj.color,
      btnBackgroundColor: paginationObj.background,
      paginationButtons: paginationObj,
      SelectedThemeUISettingsInfo: resultUiSettingsObj,
      availableWeights: fontWeightsList.length
        ? fontWeightsList
        : this.state.availableWeights,
    });
  };
  handlePaginationStyleChage = (style, key) => {
    let paginationObj = this.state.paginationButtons;
    const newObj = { ...paginationObj, style: style.value };
    this.setState({
      paginationButtons: newObj,
    });
  };
  handleChangeFont = (nextFont, stateKey) => {
    let paginationObj = this.state.paginationButtons;
    let weightsList = [];

    nextFont.variants.map((variant) => {
      if (variant.length < 4 || variant === "regular") {
        weightsList.push({ label: variant, value: variant });
      }
      return variant;
    });
    const newObj = { ...paginationObj, fontFamily: nextFont.family };
    this.setState({ paginationButtons: newObj, availableWeights: weightsList });
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
    if (name === "color") {
      const colorPickerName = "btnFontColor";
      let paginationObj = this.state.paginationButtons;
      const newObj = { ...paginationObj, [name]: colorObj.rgb };
      this.setState({
        [colorPickerName]: colorObj.rgb,
        paginationButtons: newObj,
      });
    }

    if (name === "background") {
      const colorPickerName = "btnBackgroundColor";
      let paginationObj = this.state.paginationButtons;
      const newObj = { ...paginationObj, [name]: colorObj.rgb };
      this.setState({
        [colorPickerName]: colorObj.rgb,
        paginationButtons: newObj,
      });
    }
  };

  handleWeightChange = (e, stateKey) => {
    const paginationObj = this.state.paginationButtons;
    const newObj = { ...paginationObj, [stateKey]: e.value };
    this.setState({ paginationButtons: newObj });
  };

  handleFontSizeChange = (e, stateKey) => {
    let paginationObj = this.state.paginationButtons;
    const newObj = { ...paginationObj, [stateKey]: e.value + "px" };
    this.setState({ paginationButtons: newObj });
  };

  handleLineHeightChange = (e, stateKey) => {
    let paginationObj = this.state.paginationButtons;
    const newObj = { ...paginationObj, [stateKey]: e.value + "px" };
    this.setState({ paginationButtons: newObj });
  };

  handleSwitchChange = (name) => (event) => {
    let paginationObj = this.state.paginationButtons;
    const newObj = { ...paginationObj, [name]: event.target.checked };
    this.setState({ paginationButtons: newObj });
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
              <Select
                options={this.state.paginationStylesList}
                value={this.state.paginationStylesList.find(
                  (obj) => obj.value === this.state.paginationButtons.style
                )}
                onChange={(value) =>
                  this.handlePaginationStyleChage(value, "style")
                }
              />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Pagination Font</div>
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
                    activeFontFamily={this.state.paginationButtons.fontFamily}
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
                      label: this.state.paginationButtons.fontWeight,
                      value: this.state.paginationButtons.fontWeight,
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
                        label: this.state.paginationButtons.fontSize.replace(
                          "px",
                          ""
                        ),
                        value: this.state.paginationButtons.fontSize.replace(
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
                      label: this.state.paginationButtons.lineHeight.replace(
                        "px",
                        ""
                      ),
                      value: this.state.paginationButtons.lineHeight.replace(
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
            <div className="FieldConfiguration__label">Pagination color</div>
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
            <div className="FieldConfiguration__label">
              Shows total price in the next page button
            </div>
            <div className="FieldConfiguration__value">
              <Switch
                checked={this.state.paginationButtons.showTotalPrice}
                onChange={this.handleSwitchChange("showTotalPrice")}
                value="showTotalPrice"
                color="primary"
              />
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label">Preview</div>
            <div className="FieldConfiguration__value">
              <div className="editor editor--inline pagination-preview">
                <PaginationButtonsPreview
                  paginationButtons={this.state.paginationButtons}
                  btnBackgroundColor={this.state.btnBackgroundColor}
                  btnFontColor={this.state.btnFontColor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PaginationButtonElements;
