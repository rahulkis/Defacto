import React from "react";
import "../../assets/custom/ThemeSection.css";
import { GetData, PostData } from "../../stores/requests";
import {
  getThemeSearchForms,
  getThemeInfoByFormId,
} from "../../API/IntegrationAPI";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

import FontPicker from "font-picker-react";
import Loader from "../../components/Common/Loader";
import { THEME_URLS,WEB_FONTS_KEYS } from "../../util/constants";

import { store } from "../../index";
import PaginationButtonsPreview from "../Theme/UIElements/PaginationButtonsPreview";

import { fetchthemeInfo, fetchTranslationInfo } from "../../actions";

class ThemeSettings extends React.Component {
  constructor(props) {
    super(props);
    this.fontPickerRef = React.createRef();
    this.state = {
      isLoader: true,
      multiChoiceOptions: [
        { label: "Choice 1", value: "Choice 1" },
        { label: "Choice 2", value: "Choice 2" },
      ],
      defaultVal: {
        value: "",
        label: "",
      },
      selectedOption: "Choice 1",
      activeSessionClass:
        "Choices__choice btn-raised btn-default choice-active Choices__choice--1 choice-input",
      InactiveSessionClass:
        "Choices__choice btn-raised btn-default   Choices__choice--1 choice-input",
      displayOneColorPicker: false,
      displayTwoColorPicker: false,
      displayThreeColorPicker: false,
      displayFourColorPicker: false,
      displayFiveColorPicker: false,
      displaySixColorPicker: false,
      displaySevenColorPicker: false,
      displayEightColorPicker: false,
      colorTwo: "#4D7CEA",
      colorThree: "#333333",
      colorFour: { r: "255", g: "163", b: "163", a: "1" },
      colorFive: { r: "255", g: "255", b: "255", a: "1" },
      colorSix: { r: "255", g: "255", b: "255", a: "1" },
      colorSeven: { r: "255", g: "255", b: "255", a: "1" },
      colorEight: { r: "255", g: "255", b: "255", a: "1" },
      activePrimaryFontFamily: "Lato",
      activeSecondaryFontFamily: "Lato",
      selectedPrimaryFontFamily: "Lato",
      selectedSecondaryFontFamily: "Lato",
      showImportSearch: false,
      formlistData: [],
      listofformsInfo: [],
      SelectedThemeTypoGraphyFontInfo: JSON.stringify([]),
      SelectedThemeTypoGraphyListInfo: JSON.stringify([]),
      SelectedThemeSettingsInfo: JSON.stringify([]),
      SelectedThemeUISettingsInfo: JSON.stringify([]),
      selectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
      selectedBackgroundFile: "",
      confirmedFeelingLucky: false,
      backgroundShadow: true,
      requiredAsterick: true,
      paginationButtons: {
        style: "buttons",
        background: { r: 255, g: 255, b: 255, a: 1 },
        fontFamily: "Lato",
        fontSize: "20px",
        lineHeight: "auto",
        fontWeight: "regular",
        color: { r: 0, g: 0, b: 0, a: 1 },
        showTotalPages: false,
      },
      heading1Styles: "",
      heading2Styles: "",
      paragraphStyles: "",
      questionTitleStyles: "",
      questionDescStyles: "",
      selectedTranslationId: null,
      translationInfo: [
        {
          input: "",
          rtl: false,
          selectedLanguage: "",
          selectedFont: "",
        },
      ],
    };
  }

  componentWillUpdate() {
    if (this.state.selectedBackgroundColor !== undefined) {
      let arrTheme = [];
      let themeSettingsInfo = {
        BackGroundColor: this.state.selectedBackgroundColor,
        ActiveColor: this.state.colorTwo,
        TextColor: this.state.colorThree,
        WarningColor: this.state.colorFour,
        Color1: this.state.colorFive,
        Color2: this.state.colorSix,
        Color3: this.state.colorSeven,
        Color4: this.state.colorEight,
        PrimaryFont: this.state.selectedPrimaryFontFamily,
        SecondaryFont: this.state.selectedSecondaryFontFamily,
      };

      // Create form model for post request.

      let formModel = {
        FormId: localStorage.CurrentFormId,
        BackgroundColor: this.state.selectedBackgroundColor,
        BackgroundFile: this.state.selectedBackgroundFile,
        CreatedAt: Date.now(),
        CreatedBy: "1",
        TypoGraphyFont:
          this.state.SelectedThemeTypoGraphyFontInfo === "[]"
            ? JSON.stringify([])
            : this.state.SelectedThemeTypoGraphyFontInfo,
        TypoGraphyList:
          this.state.SelectedThemeTypoGraphyListInfo === "[]"
            ? JSON.stringify([])
            : this.state.SelectedThemeTypoGraphyListInfo,
        ThemeSettings: JSON.stringify(themeSettingsInfo),
        UIElement:
          this.state.SelectedThemeUISettingsInfo === "[]"
            ? JSON.stringify([])
            : JSON.stringify(this.state.SelectedThemeUISettingsInfo),
      };
      arrTheme.push(formModel);
      store.dispatch(fetchthemeInfo(arrTheme));
    }
  }
  getTranslationSettings = async () => {
    const translationData = store.getState().fetchTranslationInfo
      .translationInfo;
    if (translationData) {
      this.setState({
        selectedTranslationId: translationData.TranslationId,
        translationInfo: JSON.parse(translationData.TranslationInfo),
      });
      this.setState({ isLoader: false });
    } else {
      GetData(
        THEME_URLS.GET_TRANSLATION_INFO + localStorage.CurrentFormId
      ).then((result) => {
        if (result != null) {
          const translationList = result.data.Items;
          if (translationList.length > 0) {
            const selectedTranslation = translationList.find(
              (t) => t.IsSelected === true
            );
            if (selectedTranslation) {
              this.setState({
                selectedTranslationId: selectedTranslation.TranslationId,
              });
              this.getSelectedTranslationInfo(
                selectedTranslation.TranslationId
              );
            }
            this.setState({ isLoader: false });
          }
        }
        this.setState({ isLoader: false });
      });
    }
  };
  getSelectedTranslationInfo(Id) {
    GetData(THEME_URLS.GET_TRANSLATION_EDIT_LIST + Id).then((result) => {
      if (result != null) {
        if (result.data.Items.length > 0) {
          let resultItems = JSON.parse(result.data.Items[0].TranslationInfo);
          this.setState({
            translationInfo: resultItems,
          });
          store.dispatch(fetchTranslationInfo(result.data.Items[0]));
          this.setState({ isLoader: false });
        }
      } else {
        this.setState({ isLoader: false });
      }
    });
  }
  getSelectedThemeInfo = async () => {
    let self = this;
    this.setState({ isLoader: true });
    let result = [];
    let resultItems = [];
    if (self.props.ThemeInfo !== undefined) {
      result = store.getState().fetchthemeInfo.themeInfo;
      if (result !== undefined) {
        resultItems = result[0];
        if (resultItems.ThemeSettings !== "[]") {
          this.setValuesIntoState(
            resultItems.ThemeSettings,
            resultItems.BackgroundColor
          );
        }
        if (resultItems.TypoGraphyFont !== "[]") {
          this.setTypoGraphyThemeIntoState(resultItems.TypoGraphyFont);
        }
        if (resultItems.UIElement !== "[]") {
          this.setQuestionsValueIntoState(resultItems.UIElement);
        }
        this.setState({
          SelectedThemeSettingsInfo: resultItems.ThemeSettings,
          SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
          SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
          SelectedThemeUISettingsInfo: JSON.parse(resultItems.UIElement),
          selectedBackgroundColor: resultItems.BackgroundColor || this.state.selectedBackgroundColor,
          selectedBackgroundFile: resultItems.BackgroundFile,
        });
        // this.setState({ isLoader: false });
      }
      this.getTranslationSettings();
    } else {
      result = await getThemeInfoByFormId(localStorage.CurrentFormId);
      if (result.Count > 0) {
        console.log(result);
        if (result.Items !== undefined) {
          resultItems = result.Items[0];
          if (resultItems.ThemeSettings !== "[]") {
            this.setValuesIntoState(
              resultItems.ThemeSettings,
              resultItems.BackgroundColor || this.state.selectedBackgroundColor
            );
          }
          if (resultItems.TypoGraphyFont !== "[]") {
            this.setTypoGraphyThemeIntoState(resultItems.TypoGraphyFont);
          }
          if (resultItems.UIElement !== "[]") {
            this.setQuestionsValueIntoState(resultItems.UIElement);
          }
          this.setState({
            SelectedThemeSettingsInfo: resultItems.ThemeSettings,
            SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
            SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
            SelectedThemeUISettingsInfo: JSON.parse(resultItems.UIElement),
            selectedBackgroundColor: resultItems.BackgroundColor || this.state.selectedBackgroundColor,
            selectedBackgroundFile: resultItems.BackgroundFile,
          });
          // this.setState({ isLoader: false });
          this.getTranslationSettings();
        }
      } else {
        this.getTranslationSettings();
        // this.setState({ isLoader: false });
      }
    }
  };

  setValuesIntoState = (itemsinfo, backgroundColor) => {
    let items = JSON.parse(itemsinfo);
    this.setState({
      selectedBackgroundColor: backgroundColor ,
      colorTwo: items.ActiveColor,
      colorThree: items.TextColor,
      colorFour: items.WarningColor,
      colorFive: items.Color1,
      colorSix: items.Color2,
      colorSeven: items.Color3,
      colorEight: items.Color4,
      activePrimaryFontFamily: items.PrimaryFont,
      activeSecondaryFontFamily: items.SecondaryFont,
      selectedPrimaryFontFamily: items.PrimaryFont,
      selectedSecondaryFontFamily: items.SecondaryFont,
    });
  };
  setTypoGraphyThemeIntoState = (info) => {
    const typoSettings = JSON.parse(info);
    this.setState({
      heading1Styles: typoSettings[0],
      heading2Styles: typoSettings[1],
      paragraphStyles: typoSettings[2],
      questionTitleStyles: typoSettings[3],
      questionDescStyles: typoSettings[4],
    });
  };
  setQuestionsValueIntoState = (info) => {
    const uiElementInfo = JSON.parse(info);
    let questionsObj = [];
    if (uiElementInfo[0].Questions) {
      questionsObj = { ...uiElementInfo[0].Questions };
    }
    if (uiElementInfo[0].Pagination) {
      const paginationObj = { ...uiElementInfo[0].Pagination };
      this.setState({
        paginationButtons: paginationObj,
      });
    }

    if (questionsObj !== "[]") {
      this.setState({
        backgroundShadow: questionsObj.backgroundShadow,
        requiredAsterick: questionsObj.requiredAsterick,
      });
    }
  };

  componentWillMount() {
    this.getSelectedThemeInfo();
  }
  componentWillUnmount() {
    if (this.state.selectedBackgroundColor !== undefined) {
      let themeSettingsInfo = {
        BackGroundColor: this.state.selectedBackgroundColor,
        ActiveColor: this.state.colorTwo,
        TextColor: this.state.colorThree,
        WarningColor: this.state.colorFour,
        Color1: this.state.colorFive,
        Color2: this.state.colorSix,
        Color3: this.state.colorSeven,
        Color4: this.state.colorEight,
        PrimaryFont: this.state.selectedPrimaryFontFamily,
        SecondaryFont: this.state.selectedSecondaryFontFamily,
      };

      // Create form model for post request.

      let formModel = {
        FormId: localStorage.CurrentFormId,
        CreatedAt: Date.now(),
        CreatedBy: "1",
        BackgroundColor: this.state.selectedBackgroundColor,
        BackgroundFile: this.state.selectedBackgroundFile,
        TypoGraphyFont:
          this.state.SelectedThemeTypoGraphyFontInfo === "[]"
            ? JSON.stringify([])
            : this.state.SelectedThemeTypoGraphyFontInfo,
        TypoGraphyList:
          this.state.SelectedThemeTypoGraphyListInfo === "[]"
            ? JSON.stringify([])
            : this.state.SelectedThemeTypoGraphyListInfo,
        ThemeSettings: JSON.stringify(themeSettingsInfo),
        UIElement:
          this.state.SelectedThemeUISettingsInfo === "[]"
            ? JSON.stringify([])
            : JSON.stringify(this.state.SelectedThemeUISettingsInfo),
      };

      try {
        PostData(THEME_URLS.ADD_THEME_INFO, formModel).then((result) => {
          if (result.statusCode === 200) {
          }
        });
      } catch (err) {
        alert("Something went wrong, please try again.");
      }
    }
  }

  changeHandler = (compName) => {
    this.setState({ selectedOption: compName });
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
    if (name === "Three" || name === "Two") {
      this.setState({ [colorPickerName]: colorTwo.hex });
    } else if (name === "SelectedBackgroundColor") {
      this.setState({ selectedBackgroundColor: colorTwo.rgb });
    } else {
      this.setState({ [colorPickerName]: colorTwo.rgb });
    }
  };
  changeFont = (nextFont, key) => {
    let val = "active" + key + "FontFamily";
    this.setState({
      [val]: nextFont.family,
    });

    let selectedKey = "selected" + key + "FontFamily";
    this.setState({ [selectedKey]: nextFont.family });
  };
  restoreToDefault = () => {
    let result = window.confirm(
      "Are you sure you want to reset the theme? All changes will be lost."
    );
    if (result) {
      this.setState({
        selectedOption: "Choice 1",
        activeSessionClass:
          "Choices__choice btn-raised btn-default choice-active Choices__choice--1 choice-input",
        InactiveSessionClass:
          "Choices__choice btn-raised btn-default   Choices__choice--1 choice-input",
        displayOneColorPicker: false,
        displayTwoColorPicker: false,
        displayThreeColorPicker: false,
        displayFourColorPicker: false,
        displayFiveColorPicker: false,
        displaySixColorPicker: false,
        displaySevenColorPicker: false,
        displayEightColorPicker: false,
        selectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
        colorTwo: "#4D7CEA",
        colorThree: "#333333",
        colorFour: { r: "255", g: "163", b: "163", a: "1" },
        colorFive: { r: "255", g: "255", b: "255", a: "1" },
        colorSix: { r: "255", g: "255", b: "255", a: "1" },
        colorSeven: { r: "255", g: "255", b: "255", a: "1" },
        colorEight: { r: "255", g: "255", b: "255", a: "1" },
        activePrimaryFontFamily: "Lato",
        activeSecondaryFontFamily: "Lato",
        selectedPrimaryFontFamily: "Lato",
        selectedSecondaryFontFamily: "Lato",
      });
    }
  };
  iAmFeelingLucky = () => {
    if (!this.state.confirmedFeelingLucky) {
      const isConfirm = window.confirm(
        "This will override your current theme settings with a random theme, do you want to continue?"
      );
      if (isConfirm === true) {
        this.setState({ confirmedFeelingLucky: true });
      } else {
        return;
      }
    }

    const colorTwo = Math.floor(Math.random() * 16777215).toString(16);
    const colorFour = Math.floor(Math.random() * 16777215).toString(16);
    const rbgOpacities = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
    const fontArray = [...this.fontPickerRef.current.fontManager.fonts];
    const primaryFontFamily =
      fontArray[Math.floor(Math.random() * fontArray.length)][0];
    const secondaryFontFamily =
      fontArray[Math.floor(Math.random() * fontArray.length)][0];

    const colorOne = {
      ...this.hexToRgb("#" + this.invertHex(colorTwo)),
      a: 1,
    };

    const newPaginationObject = {
      ...this.state.paginationButtons,
      color: colorOne,
      background: { ...this.hexToRgb("#" + colorTwo), a: "1" },
    };

    if (
      this.state.SelectedThemeUISettingsInfo[0] &&
      this.state.SelectedThemeUISettingsInfo[0].Pagination
    ) {
      const newUiSettingsInfo = [
        {
          ...this.state.SelectedThemeUISettingsInfo[0],
          Pagination: newPaginationObject,
        },
      ];
      this.setState({
        paginationButtons: newPaginationObject,
        SelectedThemeUISettingsInfo: newUiSettingsInfo,
      });
    }

    this.setState({
      selectedOption: "Choice 1",
      displayOneColorPicker: false,
      displayTwoColorPicker: false,
      displayThreeColorPicker: false,
      displayFourColorPicker: false,
      displayFiveColorPicker: false,
      displaySixColorPicker: false,
      displaySevenColorPicker: false,
      displayEightColorPicker: false,
      selectedBackgroundColor: {
        ...this.hexToRgb("#" + colorTwo),
        a: rbgOpacities[Math.floor(Math.random() * rbgOpacities.length)],
      },
      colorTwo: "#" + colorTwo,
      colorThree: "#333333",
      colorFour: { ...this.hexToRgb(colorFour), a: "1" },
      activePrimaryFontFamily: primaryFontFamily,
      selectedPrimaryFontFamily: primaryFontFamily,
      activeSecondaryFontFamily: secondaryFontFamily,
      selectedSecondaryFontFamily: secondaryFontFamily,
      paginationButtons: newPaginationObject,
    });
  };
  invertHex(hex) {
    return (Number(`0x1${hex}`) ^ 0xffffff)
      .toString(16)
      .substr(1)
      .toUpperCase();
  }
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
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
        }
      : null;
  }
  getFormslist = async () => {
    let lists = await getThemeSearchForms(1);
    this.setState({
      showImportSearch: true,
      formlistData: lists,
      listofformsInfo: lists,
    });
  };
  filterData = (e) => {
    let searchedTxt = e.target.value;
    if (e.keyCode === 13) {
      e.preventDefault();
      this.setState({ showImportSearch: true });
      if (searchedTxt !== "") {
        let updatedList = this.state.listofformsInfo;

        let result = updatedList.filter(
          (p) =>
            (this.isEligible(p.FormName) &&
              p.FormName.toLowerCase().includes(searchedTxt.toLowerCase())) ||
            (this.isEligible(p.FormUrl) &&
              p.FormUrl.toLowerCase().includes(searchedTxt.toLowerCase()))
        );

        this.setState({ formlistData: result });
      } else {
        this.setState({ formlistData: this.state.listofformsInfo });
      }
    }
  };
  isEligible(value) {
    if (value !== false || value !== null || value !== 0 || value !== "") {
      return value;
    }
  }
  importTheme = async (formId, formName, formUrl) => {
    const isConfirm = window.confirm(
      "Are you sure you want to import the theme from " +
        formName +
        "(" +
        formUrl +
        ")? Your current theme will be lost."
    );
    if (isConfirm === true) {
    } else {
      return;
    }

    let result = [];
    let resultItems = [];

    this.setState({ isLoader: true });
    result = await getThemeInfoByFormId(formId);
    if (result.Count > 0) {
      if (result.Items !== undefined) {
        resultItems = result.Items[0];
        if (resultItems.ThemeSettings !== "[]") {
          this.setValuesIntoState(
            resultItems.ThemeSettings,
            resultItems.BackgroundColor
          );
        }
        this.setState({
          SelectedThemeSettingsInfo: resultItems.ThemeSettings,
          SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
          SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
          SelectedThemeUISettingsInfo: JSON.parse(resultItems.UIElement),
          selectedBackgroundColor: resultItems.BackgroundColor || this.state.selectedBackgroundColor,
          selectedBackgroundFile: resultItems.BackgroundFile,
        });
        this.setState({ isLoader: false });
      }
    } else {
      this.setState({
        isLoader: false,
        selectedOption: "Choice 1",
        activeSessionClass:
          "Choices__choice btn-raised btn-default choice-active Choices__choice--1 choice-input",
        InactiveSessionClass:
          "Choices__choice btn-raised btn-default   Choices__choice--1 choice-input",
        displayOneColorPicker: false,
        displayTwoColorPicker: false,
        displayThreeColorPicker: false,
        displayFourColorPicker: false,
        displayFiveColorPicker: false,
        displaySixColorPicker: false,
        displaySevenColorPicker: false,
        displayEightColorPicker: false,
        selectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
        colorTwo: "#4D7CEA",
        colorThree: "#333333",
        colorFour: { r: "255", g: "163", b: "163", a: "1" },
        colorFive: { r: "255", g: "255", b: "255", a: "1" },
        colorSix: { r: "255", g: "255", b: "255", a: "1" },
        colorSeven: { r: "255", g: "255", b: "255", a: "1" },
        colorEight: { r: "255", g: "255", b: "255", a: "1" },
        activePrimaryFontFamily: "Lato",
        activeSecondaryFontFamily: "Lato",
        selectedPrimaryFontFamily: "Lato",
        selectedSecondaryFontFamily: "Lato",
      });
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    const styles = reactCSS({
      default: {
        selectedBackgroundColor: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.selectedBackgroundColor.r}, ${
            this.state.selectedBackgroundColor.g
          }, ${this.state.selectedBackgroundColor.b}, ${
            this.state.selectedBackgroundColor.a
          })`,
        },
        colorTwo: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `${this.state.colorTwo}`,
        },
        colorThree: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `${this.state.colorThree}`,
        },
        colorFour: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.colorFour.r}, ${
            this.state.colorFour.g
          }, ${this.state.colorFour.b}, ${this.state.colorFour.a})`,
        },
        colorFive: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.colorFive.r}, ${
            this.state.colorFive.g
          }, ${this.state.colorFive.b}, ${this.state.colorFive.a})`,
        },
        colorSix: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.colorSix.r}, ${
            this.state.colorSix.g
          }, ${this.state.colorSix.b}, ${this.state.colorSix.a})`,
        },
        colorSeven: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.colorSeven.r}, ${
            this.state.colorSeven.g
          }, ${this.state.colorSeven.b}, ${this.state.colorSeven.a})`,
        },
        colorEight: {
          width: "130px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.colorEight.r}, ${
            this.state.colorEight.g
          }, ${this.state.colorEight.b}, ${this.state.colorEight.a})`,
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
          backgroundImage: `url(${this.state.selectedBackgroundFile})`,
        },
        ShowBackgroundColor: {
          background: `rgba(${this.state.selectedBackgroundColor.r}, ${
            this.state.selectedBackgroundColor.g
          }, ${this.state.selectedBackgroundColor.b}, ${
            this.state.selectedBackgroundColor.a
          })`,
        },
        Header1ThemeStyle: {
          color: `${this.state.colorThree}`,
          fontFamily: `${this.state.selectedSecondaryFontFamily}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
        Header1TypoGraphyStyle: {
          color: `${this.state.heading1Styles.color}`,
          fontFamily: `${this.state.heading1Styles.fontFamily}`,
          fontWeight: `${this.state.heading1Styles.fontWeight}`,
          fontSize: `${this.state.heading1Styles.fontSize}`,
          lineHeight: `${this.state.heading1Styles.lineHeight}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
        Header2TypoGraphyStyle: {
          color: `${this.state.heading2Styles.color}`,
          fontFamily: `${this.state.heading2Styles.fontFamily}`,
          fontWeight: `${this.state.heading2Styles.fontWeight}`,
          fontSize: `${this.state.heading2Styles.fontSize}`,
          lineHeight: `${this.state.heading2Styles.lineHeight}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
        ParagraphTypoGraphyStyle: {
          color: `${this.state.paragraphStyles.color}`,
          fontFamily: `${this.state.paragraphStyles.fontFamily}`,
          fontWeight: `${this.state.paragraphStyles.fontWeight}`,
          fontSize: `${this.state.paragraphStyles.fontSize}`,
          lineHeight: `${this.state.paragraphStyles.lineHeight}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
        QuestionsTitleThemeSettings: {
          color: `${this.state.colorThree}`,
          fontFamily: `${this.state.selectedPrimaryFontFamily}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
        QuestionTitleTypography: {
          color: `${this.state.questionTitleStyles.color}`,
          fontFamily: `${this.state.questionTitleStyles.fontFamily}`,
          fontWeight: `${this.state.questionTitleStyles.fontWeight}`,
          fontSize: `${this.state.questionTitleStyles.fontSize}`,
          lineHeight: `${this.state.questionTitleStyles.lineHeight}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
        QuestionDescriptionTypography: {
          color: `${this.state.questionDescStyles.color}`,
          fontFamily: `${this.state.questionDescStyles.fontFamily}`,
          fontWeight: `${this.state.questionDescStyles.fontWeight}`,
          fontSize: `${this.state.questionDescStyles.fontSize}`,
          lineHeight: `${this.state.questionDescStyles.lineHeight}`,
          textAlign: "initial",
          direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
        },
      },
    });

    return (
      <div>
        <div className="Paper Paper--double-padded">
          <div>
            <div className="XKLhmDNloVln61ip64E7e Theme-settings-div1">
              <div className="ZtOZviTTkcmz3-DO_OzgS">
                <div className="_1ZplxGlyCnvyO0gMSgUv3h">
                  <h2 className="PaperType--h2">Theme Settings</h2>
                  <p>
                    Theme settings gives you quick access to commonly used theme
                    defaults. A deeper level of customization is available under
                    the the <a href="#pablo">Typography</a> and{" "}
                    <a href="#pablo">UI Elements</a> sections.
                  </p>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Palette </div>
                    <div className="FieldConfiguration__value">
                      <div
                        className="XKLhmDNloVln61ip64E7e"
                        style={{ padding: "0px", fontsize: "14px" }}
                      >
                        <div className="ZtOZviTTkcmz3-DO_OzgS">
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Background Color
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("One")}
                            >
                              <div style={styles.selectedBackgroundColor} />
                            </div>
                            {this.state.displayOneColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("One")}
                                />
                                <SketchPicker
                                  color={this.state.selectedBackgroundColor}
                                  onChange={(e) =>
                                    this.handleChange(
                                      "SelectedBackgroundColor",
                                      e
                                    )
                                  }
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Active Color
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Two")}
                            >
                              <div style={styles.colorTwo} />
                            </div>
                            {this.state.displayTwoColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Two")}
                                />
                                <SketchPicker
                                  color={this.state.colorTwo}
                                  onChange={(e) => this.handleChange("Two", e)}
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Text Color
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Three")}
                            >
                              <div style={styles.colorThree} />
                            </div>
                            {this.state.displayThreeColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Three")}
                                />
                                <SketchPicker
                                  color={this.state.colorThree}
                                  onChange={(e) =>
                                    this.handleChange("Three", e)
                                  }
                                />
                              </div>
                            ) : null}
                          </div>

                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Warning Color
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Four")}
                            >
                              <div style={styles.colorFour} />
                            </div>
                            {this.state.displayFourColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Four")}
                                />
                                <SketchPicker
                                  color={this.state.colorFour}
                                  onChange={(e) => this.handleChange("Four", e)}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div
                          className="ZtOZviTTkcmz3-DO_OzgS"
                          style={{ marginTop: "9px" }}
                        >
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Color 1
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Five")}
                            >
                              <div style={styles.colorFive} />
                            </div>
                            {this.state.displayFiveColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Five")}
                                />
                                <SketchPicker
                                  color={this.state.colorFive}
                                  onChange={(e) => this.handleChange("Five", e)}
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Color 2
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Six")}
                            >
                              <div style={styles.colorSix} />
                            </div>
                            {this.state.displaySixColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Six")}
                                />
                                <SketchPicker
                                  color={this.state.colorSix}
                                  onChange={(e) => this.handleChange("Six", e)}
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Color 3
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Seven")}
                            >
                              <div style={styles.colorSeven} />
                            </div>
                            {this.state.displaySevenColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Seven")}
                                />
                                <SketchPicker
                                  color={this.state.colorSeven}
                                  onChange={(e) =>
                                    this.handleChange("Seven", e)
                                  }
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className="_1Q5cWluAlEp5vTRePCCYhk">
                            Color 4
                            <div />
                            <div
                              style={styles.swatch}
                              onClick={(e) => this.handleClick("Eight")}
                            >
                              <div style={styles.colorEight} />
                            </div>
                            {this.state.displayEightColorPicker ? (
                              <div style={styles.popover}>
                                <div
                                  style={styles.cover}
                                  onClick={(e) => this.handleClose("Eight")}
                                />
                                <SketchPicker
                                  color={this.state.colorEight}
                                  onChange={(e) =>
                                    this.handleChange("Eight", e)
                                  }
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Fonts{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <div
                              className="Themes__fonts XKLhmDNloVln61ip64E7e"
                              style={{ padding: "0px", fontsize: "14px" }}
                            >
                              <div className="ZtOZviTTkcmz3-DO_OzgS">
                                <div className="div-width50">
                                  Primary Font
                                  <div>
                                    <FontPicker
                                      apiKey={WEB_FONTS_KEYS.SECRETKEY}
                                      //families={this.state.dynamicFamilies}
                                      //scripts={this.state.dynamicScipts}
                                      limit={WEB_FONTS_KEYS.LIMIT}
                                      //sort="alphabet"
                                      ref={this.fontPickerRef}
                                      activeFontFamily={
                                        this.state.activePrimaryFontFamily
                                      }
                                      onChange={(e) =>
                                        this.changeFont(e, "Primary")
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="div-width50">
                                  Secondary Font
                                  <div>
                                    <FontPicker
                                      apiKey={WEB_FONTS_KEYS.SECRETKEY}
                                      limit={WEB_FONTS_KEYS.LIMIT}
                                      activeFontFamily={
                                        this.state.activeSecondaryFontFamily
                                      }
                                      onChange={(e) =>
                                        this.changeFont(e, "Secondary")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Actions{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <div className="btn-group">
                              <div
                                className="BtnV2 BtnV2--primary"
                                tabIndex="-1"
                                onClick={() => this.getFormslist()}
                              >
                                <span>Import theme</span>
                              </div>
                              <div
                                className="BtnV2 BtnV2--secondary"
                                tabIndex="-1"
                                onClick={() => this.iAmFeelingLucky()}
                              >
                                <span>I'm feeling lucky!</span>
                              </div>
                              <div
                                className="BtnV2 BtnV2--warning"
                                tabIndex="-1"
                                onClick={(e) => this.restoreToDefault()}
                              >
                                <span>Reset to default theme</span>
                              </div>
                            </div>

                            {this.state.showImportSearch && (
                              <div>
                                <div
                                  className="ImportTheme"
                                  style={{ "margin-top": "18px" }}
                                >
                                  <input
                                    type="text"
                                    className="ImportTheme_Search_input"
                                    placeholder="Search for form..."
                                    //onChange={this.inputHandler}
                                    onKeyDown={(e) => this.filterData(e)}
                                  />
                                  {this.state.showImportSearch && (
                                    <div className="ImportTheme-div1">
                                      <div className="ImportTheme-div2">
                                        {this.state.formlistData.map(
                                          (t, key) => (
                                            <div className="ImportTheme__form">
                                              <div
                                                className="BtnV2 BtnV2--sm BtnV2--secondary"
                                                tabIndex="-1"
                                                style={{
                                                  float: "right",
                                                  margintop: "0.3px",
                                                }}
                                                onClick={() =>
                                                  this.importTheme(
                                                    t.FormId,
                                                    t.FormName,
                                                    t.FormUrl
                                                  )
                                                }
                                              >
                                                <span>Import Theme</span>
                                              </div>

                                              <div>
                                                {t.FormName}
                                                <div
                                                  style={{ fontsize: "13px" }}
                                                >
                                                  <a
                                                    href={t.FormUrl}
                                                    style={{
                                                      "text-decoration": "none",
                                                    }}
                                                  >
                                                    {t.FormUrl}
                                                  </a>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="_1ZplxGlyCnvyO0gMSgUv3h Theme-Setting-Calc">
                  <div
                    className="editor editor--inline"
                    style={{
                      textAlign: "initial",
                      direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
                    }}
                  >
                    <div
                      className={"Theme__editorPreview p-4"}
                      style={
                        this.state.selectedBackgroundFile !== "" &&
                        this.state.selectedBackgroundFile
                          ? styles.ShowBackgroundImage
                          : styles.ShowBackgroundColor
                      }
                    >
                      <div>
                        <h1
                          className={"__header-one"}
                          style={
                            this.state.heading1Styles !== ""
                              ? styles.Header1TypoGraphyStyle
                              : styles.Header1ThemeStyle
                          }
                        >
                          Heading one
                        </h1>
                        <h2
                          className="__header-two"
                          style={
                            this.state.heading2Styles !== ""
                              ? styles.Header2TypoGraphyStyle
                              : styles.Header1ThemeStyle
                          }
                        >
                          Heading two
                        </h2>
                        <p
                          className="__unstyled"
                          style={
                            this.state.paragraphStyles !== ""
                              ? styles.ParagraphTypoGraphyStyle
                              : styles.Header1ThemeStyle
                          }
                        >
                          Paragraph with a{" "}
                          <a
                            href="#pablo"
                            className="Link"
                            style={{ color: `${this.state.colorTwo}` }}
                          >
                            link
                          </a>
                          . Butcher hashtag single-origin coffee tofu hoodie,
                          man bun microdosing meh put a bird on it actually
                          kickstarter small batch.
                        </p>
                        <div
                          className={
                            this.state.backgroundShadow
                              ? "no-class"
                              : "backgroundShadow"
                          }
                          style={{
                            fontFamily: `${
                              this.state.selectedPrimaryFontFamily
                            }`,
                          }}
                        >
                          <div className="LiveField">
                            <div className="LiveField__container">
                              <div
                                className="LiveField__header"
                                style={
                                  this.state.QuestionTitleTypography !== ""
                                    ? styles.QuestionTitleTypography
                                    : styles.QuestionsTitleThemeSettings
                                }
                              >
                                Question
                              </div>
                              <div
                                className="LiveField__description"
                                style={
                                  this.state.questionDescStyles !== ""
                                    ? styles.QuestionDescriptionTypography
                                    : styles.QuestionsTitleThemeSettings
                                }
                              >
                                This is the question description.
                              </div>
                              <div className="LiveField__answer">
                                <input
                                  type="text"
                                  className="LiveField__input"
                                  style={{ color: `${this.state.colorTwo}` }}
                                  defaultValue="Active color"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="LiveField  LiveField--choices LiveField--multiline">
                            <div className="LiveField__container">
                              <div
                                className="LiveField__header"
                                style={
                                  this.state.questionTitleStyles !== ""
                                    ? styles.QuestionTitleTypography
                                    : styles.QuestionsTitleThemeSettings
                                }
                              >
                                <span>Second Question</span>
                                {this.state.requiredAsterick && (
                                  <span className="LiveField__required">*</span>
                                )}
                              </div>
                              <div className="LiveField__answer">
                                <div className="Choices">
                                  <label
                                    onClick={(e) =>
                                      this.changeHandler("Choice 1")
                                    }
                                    className="btn-raised  Choices__choice--1 choice-theme choice-input"
                                    style={{
                                      background:
                                        this.state.selectedOption === "Choice 1"
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
                                        this.state.selectedOption === "Choice 1"
                                          ? true
                                          : false
                                      }
                                    />
                                    Choice1
                                  </label>
                                  <label
                                    onClick={(e) =>
                                      this.changeHandler("Choice 2")
                                    }
                                    className="btn-raised  Choices__choice--1 choice-theme choice-input"
                                    style={{
                                      background:
                                        this.state.selectedOption === "Choice 2"
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
                                        this.state.selectedOption === "Choice 2"
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
                        <PaginationButtonsPreview
                          paginationButtons={this.state.paginationButtons}
                          btnBackgroundColor={
                            this.state.paginationButtons.background
                          }
                          btnFontColor={this.state.paginationButtons.color}
                        />
                      </div>
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

export default ThemeSettings;
