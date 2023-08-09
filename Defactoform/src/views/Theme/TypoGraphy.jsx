import React from "react";
import "../../assets/custom/ThemeSection.css";
import Select from "react-select";

import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import FontPicker from "font-picker-react";
import _ from "lodash";

import { PostData } from "../../stores/requests";
import { THEME_URLS,WEB_FONTS_KEYS } from "../../util/constants";
import Loader from "../../components/Common/Loader";

import { fetchthemeInfo } from "../../actions";
import { store } from "../../index";

class TypoGraphy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: true,
      colorOne: { r: "255", g: "163", b: "163", a: "1" },
      multiChoiceOptions: [
        { label: "Choice 1", value: "Choice 1" },
        { label: "Choice 2", value: "Choice 2" },
      ],
      defaultVal: {
        value: "",
        label: "",
      },
      defaultWeight: "regular",
      SelectedOption: "Choice 1",
      activeSessionClass:
        "Choices__choice btn-raised btn-default choice-active Choices__choice--1 choice-input",
      InactiveSessionClass:
        "Choices__choice btn-raised btn-default   Choices__choice--1 choice-input",
      Weight: [{ label: "regular", value: "regular" }],
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
      displayOneColorPicker: false,
      // colorOne: { r: "255", g: "163", b: "255", a: "1" },

      activePrimaryFontFamily: "Lato",
      HeaderHeading: "Heading 1",
      HeaderType: "Heading1",

      Heading1Font: {
        fontFamily: "Lato",
        overflow: "auto",
        padding: "18px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        //  backgroundColor: "rgb(17, 17, 17)",
        fontSize: "48px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgba(0, 0, 0, 1)",
      },

      Heading2Font: {
        fontFamily: "La Belle Aurore",
        overflow: "auto",
        padding: "18px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        // backgroundColor: "rgb(17, 17, 17)",
        fontSize: "36px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgba(0, 0, 0, 1)",
      },

      ParagraphFont: {
        fontFamily: "La Belle Aurore",
        overflow: "auto",
        padding: "18px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        // backgroundColor: "rgb(17, 17, 17)",
        fontSize: "18px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgba(0, 0, 0, 1)",
      },

      QuestionTitleFont: {
        fontFamily: "La Belle Aurore",
        overflow: "auto",
        padding: "18px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        //  backgroundColor: "rgb(17, 17, 17)",
        fontSize: "24px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgba(0, 0, 0, 1)",
      },

      QuestionDesFont: {
        fontFamily: "La Belle Aurore",
        overflow: "auto",
        padding: "14px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        // backgroundColor: "rgb(17, 17, 17)",
        fontSize: "15px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgba(0, 0, 0, 1)",
      },

      previewFontStyle: {
        fontFamily: "La Belle Aurore",
        overflow: "auto",
        padding: "18px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        //  backgroundColor: "rgb(17, 17, 17)",
        fontSize: "48px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgba(0, 0, 0, 1)",
      },
      typographyPart: [
        {
          label: "Heading 1",
          value: "Heading1",
          font: "Lato",
          color: { r: "0", g: "0", b: "0", a: "1" },
        },
        {
          label: "Heading 2",
          value: "Heading2",
          font: "Adamina",
          color: { r: "0", g: "0", b: "0", a: "1" },
        },
        {
          label: "Paragraph",
          value: "Paragraph",
          font: "Mulish",
          color: { r: "0", g: "0", b: "0", a: "1" },
        },
        {
          label: "Question title",
          value: "QuestionTitle",
          font: "Noto Sans",
          color: { r: "0", g: "0", b: "0", a: "1" },
        },
        {
          label: "Question Description",
          value: "QuestionDes",
          font: "Noto Sans",
          color: { r: "0", g: "0", b: "0", a: "1" },
        },
      ],
      countStyle: 0,
      SelectedThemeTypoGraphyFontInfo: [],
      SelectedThemeTypoGraphyListInfo: [],
      SelectedThemeSettingsInfo: [],
      SelectedThemeUISettingsInfo: [],
      SelectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
      SelectedBackgroundFile: "",
      selectedPrimaryFontFamily: "Lato",
      selectedSecondaryFontFamily: "Lato",
      backgroundShadow: true,
      requiredAsterick: true,
      translationInfo: [
        {
          input: "",
          rtl: false,
          selectedLanguage: "",
          selectedFont: "",
        },
      ],
    };
    //this.GetSelectedThemeInfo();
    // this.createControlHtml = this.createControlHtml.bind(this);
  }

  componentWillReceiveProps(nextProps) {}
  componentWillMount = async () => {
    await this.GetSelectedThemeInfo();
    //store.dispatch(fetchThemeInfo([]));
    this.GetTranslationSettings();
    this.setState({ colorOne: this.state.typographyPart[0].color });
  };

  componentWillUpdate() {
    let self = this;
    setTimeout(() => {
      let arrTheme = [];
      let resultTypographyFonts = _.map(this.state.typographyPart, function(a) {
        return self.state[a.value + "Font"];
      });
      let FormModel = {
        FormId: localStorage.CurrentFormId,
        CreatedAt: Date.now(),
        CreatedBy: "1",
        TypoGraphyFont: JSON.stringify(resultTypographyFonts),
        TypoGraphyList: JSON.stringify(this.state.typographyPart),
        ThemeSettings: this.state.SelectedThemeSettingsInfo,
        UIElement: this.state.SelectedThemeUISettingsInfo,
        BackgroundColor: this.state.SelectedBackgroundColor,
        BackgroundFile: this.state.SelectedBackgroundFile,
      };
      arrTheme.push(FormModel);
      store.dispatch(fetchthemeInfo(arrTheme));
    }, 100);
  }
  GetTranslationSettings = async () => {
    const translationData = store.getState().fetchTranslationInfo
      .translationInfo;
    if (translationData) {
      this.setState({
        translationInfo: JSON.parse(translationData.TranslationInfo),
      });
    }
  };
  GetSelectedThemeInfo = async () => {
    this.setState({ isLoader: true });
    let result = store.getState().fetchthemeInfo.themeInfo;
    if (result.length > 0) {
      let resultItems = result[0];
      // Set Values into state in edit case
      if (
        resultItems.ThemeSettings !== "[]" &&
        resultItems.TypoGraphyFont !== "[]" &&
        !Array.isArray(resultItems.TypoGraphyFont)
      ) {
        this.SetValuesIntoState(resultItems.ThemeSettings, resultItems);
        const typoGarphyFontParsed = JSON.parse(resultItems.TypoGraphyFont);
        this.setState({
          SelectedThemeTypoGraphyFontInfo: typoGarphyFontParsed,
          activePrimaryFontFamily: typoGarphyFontParsed[0].fontFamily,
          typographyPart: JSON.parse(resultItems.TypoGraphyList),
        });
      }
      if (resultItems.UIElement !== "[]") {
        this.SetQuestionsValueIntoState(resultItems.UIElement);
      }

      this.setState({
        isLoader: false,
        SelectedThemeUISettingsInfo: resultItems.UIElement,
        SelectedThemeSettingsInfo: resultItems.ThemeSettings,
        SelectedBackgroundColor: resultItems.BackgroundColor || this.state.SelectedBackgroundColor,
        SelectedBackgroundFile: resultItems.BackgroundFile,
      });
    } else {
      this.setState({ isLoader: false });
    }
  };
  SetValuesIntoState = (items, result) => {
    const typoGraphy = JSON.parse(result.TypoGraphyList);
    let typoGarphyFont = JSON.parse(result.TypoGraphyFont);
    let count = 0;
    let self = this;
    let FontObj = Object.assign({}, "");
    _.map(typoGarphyFont, function(obj) {
      if (count < 5) {
        let pro = typoGraphy[count].value + "Font";
        FontObj[pro] = obj;
      }
      count = count + 1;
    });
    this.setState(FontObj);
    count = 0;
    _.map(typoGarphyFont, function(obj) {
      if (count > 4) {
        let typfont = typoGraphy[count].value;
        self.state[typfont + "Font"] = obj;
      }
      count = count + 1;
    });

    items = JSON.parse(items);
    this.setState({
      colorOne: items.BackGroundColor,
      colorTwo: items.ActiveColor,
      selectedPrimaryFontFamily: items.PrimaryFont,
      selectedSecondaryFontFamily: items.SecondaryFont,
    });
  };
  SetQuestionsValueIntoState = (info) => {
    const UiElementInfo = JSON.parse(info);
    let QuestionsObj = [];
    if (UiElementInfo[0].Questions) {
      QuestionsObj = { ...UiElementInfo[0].Questions };
    }
    if (QuestionsObj !== "[]") {
      this.setState({
        backgroundShadow: QuestionsObj.backgroundShadow,
        requiredAsterick: QuestionsObj.requiredAsterick,
      });
    }
  };
  componentWillUnmount() {
    let self = this;
    let resultTypographyFonts = _.map(this.state.typographyPart, function(a) {
      return self.state[a.value + "Font"];
    });
    let FormModel = {
      FormId: localStorage.CurrentFormId,
      CreatedAt: Date.now(),
      CreatedBy: "1",
      TypoGraphyFont: JSON.stringify(resultTypographyFonts),
      TypoGraphyList: JSON.stringify(this.state.typographyPart),
      ThemeSettings: this.state.SelectedThemeSettingsInfo,
      UIElement: this.state.SelectedThemeUISettingsInfo,
      BackgroundColor: this.state.SelectedBackgroundColor,
      BackgroundFile: this.state.SelectedBackgroundFile,
    };

    try {
      PostData(THEME_URLS.ADD_THEME_INFO, FormModel).then((result) => {
        if (result.statusCode === 200) {
          //alert("Value Submitted");
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      //this.setState({ isLoader: false });
    }
  }

  ChangeFont = (nextFont, key) => {
    let arrWeight = [];
    let results = _.filter(this.props.WebFonts, function(obj) {
      return obj.family.indexOf(nextFont.family) !== -1;
    });
    let hdrType = this.state.HeaderType;
    let resultTypographyPart = _.map(this.state.typographyPart, function(a) {
      return a.value.indexOf(hdrType) !== -1
        ? {
            label: a.label,
            value: a.value,
            font: nextFont.family,
            color: a.color,
          }
        : a;
    });
    _.forEach(results[0].variants, (user) => {
      arrWeight.push({ label: user, value: user });
    });

    let FontType = this.state.HeaderType + "Font";
    let fontObj = this.state[FontType];
    const fontObj1 = { ...fontObj, fontFamily: nextFont.family };
    //const typoObj={...this.}
    //fontObj.fontFamily=nextFont.family;

    let val = "active" + key + "FontFamily";
    if (arrWeight.length > 0) {
      this.setState({
        [val]: nextFont.family,
        Weight: arrWeight,
        [FontType]: fontObj1,
        typographyPart: resultTypographyPart,
      });
    } else {
      this.setState({
        [val]: nextFont.family,
        [FontType]: fontObj1,
        typographyPart: resultTypographyPart,
      });
    }
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
    let FontType = this.state.HeaderType + "Font";
    let fontObj = this.state[FontType];
    let hdrType = this.state.HeaderType;
    let resultTypographyPart = _.map(this.state.typographyPart, function(a) {
      return a.value.indexOf(hdrType) !== -1
        ? { label: a.label, value: a.value, font: a.font, color: colorTwo.rgb }
        : a;
    });
    const fontObj1 = {
      ...fontObj,
      color: `rgba(${colorTwo.rgb.r}, ${colorTwo.rgb.g}, ${colorTwo.rgb.b}, ${
        colorTwo.rgb.a
      })`,
    };
    this.setState({
      [colorPickerName]: colorTwo.rgb,
      [FontType]: fontObj1,
      typographyPart: resultTypographyPart,
    });
  };
  changeHandler = (compName) => {
    this.setState({ SelectedOption: compName });
  };
  handleFontChange = (e, headerHeading, font, fontType) => {
    debugger;
    let arrWeight = [];
    let results = _.filter(this.props.WebFonts, function(obj) {
      return obj.family.indexOf(font) !== -1;
    });

    _.forEach(results[0].variants, (user) => {
      arrWeight.push({ label: user, value: user });
    });
    results = _.filter(this.props.WebFonts, function(obj) {
      return obj.family.indexOf(font) !== -1;
    });
    let resTyp = _.filter(this.state.typographyPart, function(obj) {
      return obj.value.indexOf(fontType) !== -1;
    });

    let FontType = fontType + "Font";
    let fontObj = this.state[FontType];
    const fontObj1 = { ...fontObj, fontFamily: font };
    this.setState({
      HeaderHeading: headerHeading,
      [FontType]: fontObj1,
      HeaderType: fontType,
      Weight: arrWeight,
      defaultWeight: fontObj1.fontWeight,
      activePrimaryFontFamily: font,
      colorOne: resTyp[0].color,
    });
  };
  handleWeightChange = (e, headerType) => {
    let FontType = headerType + "Font";
    let fontObj = this.state[FontType];
    if (e.value !== "regular") {
      const fontObj1 = { ...fontObj, fontWeight: e.value };
      this.setState({ [FontType]: fontObj1 });
    }
  };
  AddCustomStyle = (e) => {
    let count = this.state.countStyle;
    let custTypo = {
      label: "New Style",
      value: "NewStyle" + (count + 1),
      font: "Noto Sans",
      color: { r: "255", g: "163", b: "163", a: "1" },
    };
    let arr = [...this.state.typographyPart, custTypo];

    this.setState({
      [custTypo.value + "Font"]: {
        fontFamily: "La Belle Aurore",
        overflow: "auto",
        padding: "18px",
        boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
        // backgroundColor: "rgb(17, 17, 17)",
        fontSize: "48px",
        lineHeight: "1.2em",
        fontWeight: "regular",
        color: "rgb(83, 193, 98)",
      },
    });

    this.setState({ typographyPart: arr });

    let arrWeight = [];
    let results = _.filter(this.props.WebFonts, function(obj) {
      return obj.family.indexOf("Noto Sans") !== -1;
    });

    _.forEach(results[0].variants, (user) => {
      arrWeight.push({ label: user, value: user });
    });
    results = _.filter(this.props.WebFonts, function(obj) {
      return obj.family.indexOf("Noto Sans") !== -1;
    });

    this.setState({
      HeaderHeading: "New Style",
      HeaderType: custTypo.value,
      Weight: arrWeight,
      defaultWeight: "regular",
      activePrimaryFontFamily: custTypo.font,
      colorOne: custTypo.color,
      countStyle: count + 1,
    });
  };
  handleFontSizeChange = (e, headerType) => {
    let FontType = headerType + "Font";
    let fontObj = this.state[FontType];
    const fontObj1 = { ...fontObj, fontSize: e.value + "px" };
    this.setState({ [FontType]: fontObj1 });
  };
  handleLineHeightChange = (e, headerType) => {
    let FontType = headerType + "Font";
    let fontObj = this.state[FontType];
    const fontObj1 = { ...fontObj, lineHeight: e.value + "px" };
    this.setState({ [FontType]: fontObj1 });
  };
  RemoveCustomStyle = (e, headerType) => {
    let typoList = this.state.typographyPart;
    _.remove(typoList, { value: headerType });

    delete this.state[headerType + "Font"];
    this.setState({ HeaderType: "Heading1", typographyPart: typoList });
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
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
        ShowBackgroundImage: {
          backgroundImage: `url(${this.state.SelectedBackgroundFile})`,
        },
        ShowBackgroundColor: {
          background: `rgba(${this.state.SelectedBackgroundColor.r}, ${
            this.state.SelectedBackgroundColor.g
          }, ${this.state.SelectedBackgroundColor.b}, ${
            this.state.SelectedBackgroundColor.a
          })`,
        },
      },
    });
    return (
      <div className="row" style={{ width: "100%" }}>
        <div
          className="column"
          style={{ maxWidth: "33%", minWidth: "33%", padding: "35px" }}
        >
          <div className="Paper">
            <div>
              <div>
                <div>
                  <div>
                    <div
                      className="Paper Paper--padded"
                      style={{ borderRadius: "0px" }}
                    >
                      <div>
                        <h2
                          className="PaperType--h2"
                          style={{ margin: "18px 18px 0px" }}
                        >
                          Typography
                        </h2>
                      </div>
                    </div>
                    {this.state.typographyPart.map((typ, key) => (
                      <div
                        className={
                          this.state.HeaderType === typ.value
                            ? "Paper Paper--padded Paper--active Paper--clickable"
                            : "Paper Paper--padded  Paper--clickable"
                        }
                        key={"TypoGraphy-" + typ.value}
                        style={{ borderRadius: "0px" }}
                      >
                        <div
                          onClick={(e) =>
                            this.handleFontChange(
                              e,
                              typ.label,
                              typ.font,
                              typ.value
                            )
                          }
                        >
                          <span>
                            {typ.label}
                            <span style={{ opacity: "0.5" }}> {typ.font}</span>

                            <i
                              className="tim-icons icon-minimal-right"
                              style={{ opacity: "0.5", float: "right" }}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label" />
            <div className="FieldConfiguration__value">
              <div className="btn-group">
                <div
                  className="BtnV2 BtnV2--primary"
                  tabIndex="-1"
                  onClick={(e) => this.AddCustomStyle(e)}
                >
                  <span>+ Add Custom Style</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "calc(36px - 0.5em)",
            maxWidth: "66%",
            minWidth: "67%",
            padding: "35px",
          }}
          className="_2PLFUU9OgtbELWQz3snC0b column"
        >
          <div
            className="Paper Paper--padded Paper--double-padded-x"
            style={{ marginBottom: "18px" }}
          >
            <div>
              <div className="FieldConfigurationField">
                <div className="FieldConfiguration__label">
                  <span
                    style={{
                      fontSize: "24px",
                      display: "block",
                      height: "29px",
                      lineHeight: "29px",
                    }}
                  >
                    {this.state.HeaderHeading}
                  </span>
                </div>
                <div className="FieldConfiguration__value">
                  <div style={{ clear: "both" }}>
                    <div className="ZtOZviTTkcmz3-DO_OzgS">
                      <div className="_3pHqiVubpMLEJl33qP-THz">
                        <label style={{ fontSize: "14px", display: "block" }}>
                          Typeface
                        </label>
                        <FontPicker
                          apiKey={WEB_FONTS_KEYS.SECRETKEY}
                          limit={WEB_FONTS_KEYS.LIMIT}
                          activeFontFamily={this.state.activePrimaryFontFamily}
                          onChange={(e) => this.ChangeFont(e, "Primary")}
                        />
                      </div>
                      <div className="_1oFs0McTNOmQk5ghTCYFF6">
                        <label style={{ fontSize: "14px", display: "block" }}>
                          Weight
                        </label>
                        <Select
                          options={this.state.Weight}
                          defaultValue={{
                            label: this.state[this.state.HeaderType + "Font"]
                              .fontWeight,
                            value: this.state[this.state.HeaderType + "Font"]
                              .fontWeight,
                          }}
                          // value ={this.state.selectedCurrency}
                          onChange={(value) =>
                            this.handleWeightChange(
                              value,
                              this.state.HeaderType
                            )
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
                              label: this.state[
                                this.state.HeaderType + "Font"
                              ].fontSize.replace("px", ""),
                              value: this.state[
                                this.state.HeaderType + "Font"
                              ].fontSize.replace("px", ""),
                            }}
                            // value ={{label:this.state[this.state.HeaderType+"Font"].fontSize.replace("px",""),value:this.state[this.state.HeaderType+"Font"].fontSize.replace("px","")}}
                            onChange={(value) =>
                              this.handleFontSizeChange(
                                value,
                                this.state.HeaderType
                              )
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
                            label: this.state[
                              this.state.HeaderType + "Font"
                            ].lineHeight.replace("px", ""),
                            value: this.state[
                              this.state.HeaderType + "Font"
                            ].lineHeight.replace("px", ""),
                          }}
                          // value ={this.state.selectedCurrency}
                          onChange={(value) =>
                            this.handleLineHeightChange(
                              value,
                              this.state.HeaderType
                            )
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
                    <div
                      className="ZtOZviTTkcmz3-DO_OzgS"
                      style={{ marginTop: "18px" }}
                    >
                      <div className="AdoKE9nnvZr4_zfgdeh5N">
                        <label style={{ fontSize: "14px", display: "block" }}>
                          Preview
                        </label>
                        <div style={this.state[this.state.HeaderType + "Font"]}>
                          The quick brown fox jumps over the lazy dog
                        </div>
                      </div>
                    </div>
                    {this.state.HeaderType.indexOf("NewStyle") > -1 && (
                      <div
                        className="ZtOZviTTkcmz3-DO_OzgS"
                        style={{ marginTop: "18px" }}
                      >
                        <div className="AdoKE9nnvZr4_zfgdeh5N">
                          <label style={{ fontSize: "14px", display: "block" }}>
                            Remove Style
                          </label>
                          <div
                            className="BtnV2 BtnV2--warning"
                            onClick={(e) =>
                              this.RemoveCustomStyle(e, this.state.HeaderType)
                            }
                            tabIndex="-1"
                            style={{ marginTop: "9px" }}
                          >
                            <span>Remove Custom Style</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="editor editor--inline">
              <div
                className="Theme__editorPreview p-4"
                style={
                  this.state.SelectedBackgroundFile !== ""
                    ? styles.ShowBackgroundImage
                    : styles.ShowBackgroundColor
                }
              >
                <div
                  style={{
                    textAlign: "initial",
                    direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
                  }}
                >
                  <h1 className="__header-one" style={this.state.Heading1Font}>
                    Heading one
                  </h1>
                  <h2 className="__header-two" style={this.state.Heading2Font}>
                    Heading two
                  </h2>
                  <p className="__unstyled" style={this.state.ParagraphFont}>
                    Paragraph with a{" "}
                    <a href="#pablo" className="Link">
                      link
                    </a>
                    . Butcher hashtag single-origin coffee tofu hoodie, man bun
                    microdosing meh put a bird on it actually kickstarter small
                    batch.
                  </p>
                  <div
                    className={
                      this.state.backgroundShadow
                        ? "no-class"
                        : "backgroundShadow"
                    }
                    style={{
                      fontFamily: `${this.state.selectedPrimaryFontFamily}`,
                    }}
                  >
                    <div className="LiveField" style={{ textAlign: "initial" }}>
                      <div className="LiveField__container">
                        <div
                          className="LiveField__header"
                          style={this.state.QuestionTitleFont}
                        >
                          Question
                        </div>
                        <div
                          className="LiveField__description"
                          style={this.state.QuestionDesFont}
                        >
                          This is the question description.
                        </div>
                        <div className="LiveField__answer">
                          <input
                            type="text"
                            className="LiveField__input"
                            defaultValue="Active color"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="LiveField  LiveField--choices LiveField--multiline"
                      style={{ textAlign: "initial" }}
                    >
                      <div className="LiveField__container">
                        <div
                          className="LiveField__header"
                          style={this.state.QuestionTitleFont}
                        >
                          <span>Second Question</span>
                          {this.state.requiredAsterick && (
                            <span className="LiveField__required">*</span>
                          )}
                        </div>
                        <div className="LiveField__answer">
                          <div className="Choices">
                            <label
                              onClick={(e) => this.changeHandler("Choice 1")}
                              className="btn-raised  Choices__choice--1 choice-theme choice-input"
                              style={{
                                background:
                                  this.state.SelectedOption === "Choice 1"
                                    ? `${this.state.colorTwo}`
                                    : "",
                              }}
                            >
                              <input
                                type="radio"
                                value="Choice1"
                                className="input-radio"
                                name="ChoiceQuestion"
                                defaultChecked={
                                  this.state.SelectedOption === "Choice 1"
                                    ? true
                                    : false
                                }
                              />
                              Choice1
                            </label>
                            <label
                              onClick={(e) => this.changeHandler("Choice 2")}
                              className="btn-raised  Choices__choice--1 choice-theme choice-input"
                              style={{
                                background:
                                  this.state.SelectedOption === "Choice 2"
                                    ? `${this.state.colorTwo}`
                                    : "",
                              }}
                            >
                              <input
                                type="radio"
                                value="Choice2"
                                className="input-radio"
                                name="ChoiceQuestion"
                                defaultChecked={
                                  this.state.SelectedOption === "Choice 2"
                                    ? true
                                    : false
                                }
                              />
                              Choice2
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="LiveField__error" />
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

export default TypoGraphy;
