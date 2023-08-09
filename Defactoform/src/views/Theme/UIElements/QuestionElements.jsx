import React from "react";
import "../../../assets/custom/ThemeSection.css";
import Switch from "@material-ui/core/Switch";
import reactCSS from "reactcss";
import Loader from "../../../components/Common/Loader";
import { fetchthemeInfo } from "../../../actions";
import { store } from "../../../index";
import { PostData } from "../../../stores/requests";
import { THEME_URLS } from "../../../util/constants";

class QuestionElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundShadow: true,
      requiredAsterick: true,
      selectedOption: "Choice 1",
      activeSessionClass:
        "Choices__choice btn-raised btn-default choice-active Choices__choice--1 choice-input",
      InactiveSessionClass:
        "Choices__choice btn-raised btn-default   Choices__choice--1 choice-input",
      selectedPrimaryFontFamily: "Lato",
      selectedSecondaryFontFamily: "Lato",
      colorTwo: "#4D7CEA",
      colorThree: "#333333",
      colorFour: { r: "255", g: "163", b: "163", a: "1" },
      SelectedThemeTypoGraphyFontInfo: [],
      SelectedThemeTypoGraphyListInfo: [],
      SelectedThemeSettingsInfo: [],
      SelectedThemeUISettingsInfo: [],
      selectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
      selectedBackgroundFile: "",
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
  GetTranslationSettings = async () => {
    const translationData = store.getState().fetchTranslationInfo
      .translationInfo;
    if (translationData) {
      this.setState({
        translationInfo: JSON.parse(translationData.TranslationInfo),
      });
    }
  };
  componentWillMount = async () => {
    await this.GetSelectedThemeInfo();
    this.GetTranslationSettings();
  };
  componentWillUpdate() {
    let self = this;
    let arrTheme = [];
    setTimeout(() => {
      const questionsObj = {
        backgroundShadow: self.state.backgroundShadow,
        requiredAsterick: self.state.requiredAsterick,
      };
      let uiSettings = this.state.SelectedThemeUISettingsInfo.length
        ? this.state.SelectedThemeUISettingsInfo
        : [{}];
      const resultUiSettingsObj = [
        {
          ...uiSettings[0],
          Questions: questionsObj,
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

  componentWillUnmount = async () => {
    const questionsObj = {
      backgroundShadow: this.state.backgroundShadow,
      requiredAsterick: this.state.requiredAsterick,
    };
    let uiSettings = this.state.SelectedThemeUISettingsInfo.length
      ? this.state.SelectedThemeUISettingsInfo
      : [{}];
    const resultUiSettingsObj = [
      {
        ...uiSettings[0],
        Questions: questionsObj,
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
  };

  GetSelectedThemeInfo = async () => {
    this.setState({ isLoader: true });
    let result = store.getState().fetchthemeInfo.themeInfo;
    if (result.length > 0) {
   
      let resultItems = result[0];
      // Set Values into state in edit case

      this.SetValuesIntoState(
        resultItems.ThemeSettings,
        resultItems.BackgroundColor || this. state.selectedBackgroundColor
      );

      if (resultItems.UIElement !== "[]") {
        this.SetQuestionsValueIntoState(resultItems.UIElement);
      }
      // Set Value in Edit Case
      this.setState({
        isLoader: false,
        SelectedThemeUISettingsInfo: JSON.parse(resultItems.UIElement),
        SelectedThemeSettingsInfo: resultItems.ThemeSettings,
        SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
        SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
        selectedBackgroundColor: resultItems.BackgroundColor || this. state.selectedBackgroundColor,
        selectedBackgroundFile:
          resultItems.BackgroundFile === "unknown"
            ? ""
            : resultItems.BackgroundFile,
      });
    } else {
      this.setState({ isLoader: false });
    }
  };

  SetQuestionsValueIntoState = (info) => {
    const uiElementInfo = JSON.parse(info);
    let questionsObj = [];
    if (uiElementInfo[0].Questions) {
      questionsObj = { ...uiElementInfo[0].Questions };
    }
    if (questionsObj !== "[]") {
      this.setState({
        backgroundShadow: questionsObj.backgroundShadow,
        requiredAsterick: questionsObj.requiredAsterick,
      });
    }
  };

  SetValuesIntoState = (itemsinfo, backgroundColor) => {
    let items = JSON.parse(itemsinfo);
    this.setState({
      selectedBackgroundColor: backgroundColor,
      colorTwo: items.ActiveColor,
      colorThree: items.TextColor,
      colorFour: items.WarningColor,
      selectedPrimaryFontFamily: items.PrimaryFont,
      selectedSecondaryFontFamily: items.SecondaryFont,
    });
  };

  handleSwitchChange = (name, event) => {
    this.setState({ [name]: event.target.checked });
  };
  changeHandler = (compName) => {
    this.setState({ selectedOption: compName });
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    
    const styles = reactCSS({
      default: {
        defaultBackgroundColor: {
          background: `rgba(${this.state.selectedBackgroundColor.r}, ${
            this.state.selectedBackgroundColor.g
          }, ${this.state.selectedBackgroundColor.b}, ${
            this.state.selectedBackgroundColor.a
          })`,
        },
      },
    });
    return (
      <div>
        <div className="UIElements-div">Questions</div>
        <div className="FieldConfigurationField ">
          <div className="FieldConfiguration__label">
            Has background and shadow{" "}
          </div>
          <div className="FieldConfiguration__value">
            <Switch
              checked={this.state.backgroundShadow}
              onChange={(e) => this.handleSwitchChange("backgroundShadow", e)}
              value="requiredQuestion"
              color="primary"
            />
          </div>
        </div>
        <div className="FieldConfigurationField ">
          <div className="FieldConfiguration__label">
            Required questions are indicated with an asterisk (*){" "}
          </div>
          <div className="FieldConfiguration__value">
            <Switch
              checked={this.state.requiredAsterick}
              onChange={(e) => this.handleSwitchChange("requiredAsterick", e)}
              value="requiredQuestion"
              color="primary"
            />
          </div>
        </div>

        <div className="FieldConfigurationField ">
          <div className="FieldConfiguration__label">Preview </div>
          <div className="FieldConfiguration__value">
            <div
              className="editor editor--inline"
              style={styles.defaultBackgroundColor}
            >
              <div className={"Theme__editorPreview"}>
                <div
                  style={{
                    textAlign: "initial",
                    direction: this.state.translationInfo.rtl ? "rtl" : "ltr",
                  }}
                >
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
                          style={{
                            color: `${this.state.colorThree}`,
                            fontFamily: `${
                              this.state.selectedPrimaryFontFamily
                            }`,
                          }}
                        >
                          Question
                        </div>
                        <div
                          className="LiveField__description"
                          style={{
                            color: `${this.state.colorThree}`,
                            fontFamily: `${
                              this.state.selectedPrimaryFontFamily
                            }`,
                          }}
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
                    <div
                      className="LiveField  LiveField--choices LiveField--multiline"
                      style={{ textAlign: "initial" }}
                    >
                      <div className="LiveField__container">
                        <div
                          className="LiveField__header"
                          style={{
                            color: `${this.state.colorThree}`,
                            fontFamily: `${
                              this.state.selectedPrimaryFontFamily
                            }`,
                          }}
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
                              onClick={(e) => this.changeHandler("Choice 2")}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionElements;
