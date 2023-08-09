import React from "react";
import Select from "react-select";
import { languageOptions, fontOptions } from "../LanguageOption/data";
import "../../assets/custom/ThemeSection.css";
import { Delete, UpdateData, GetData, PostData } from "../../stores/requests";
import { DraftJS } from "megadraft";
import { THEME_URLS } from "../../util/constants";
import Loader from "../../components/Common/Loader";
import { store } from "../../index";
import { fetchTranslationInfo } from "../../actions";

class Translations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayOfObjects: [
        {
          input: "",
          rtl: false,
          selectedLanguage: "",
          selectedFont: "",
        },
      ],
      clicked: "",
      translationList: [],
      editTranslation: false,
      updateId: "",
      useTranslation: "",
      isLoader: false,
      defaultData: false,
      showPopUp: false,
      IsSelectedEditCase: false,
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.useTranslationHandler = this.useTranslationHandler.bind(this);
  }
  componentWillMount = async () => {
    await this.getMenulist();
  };

  getMenulist = async () => {
       this.setState({ isLoader: true });
    GetData(THEME_URLS.GET_TRANSLATION_INFO + localStorage.CurrentFormId).then(
      (result) => {
          if (result.data.Items.length > 0) {
          this.setState({ translationList: result.data.Items });

          const selectedItem = result.data.Items.find(
            (tr) => tr.IsSelected === true
          );
          if (selectedItem) {
            this.setState({
              useTranslation: selectedItem.TranslationId,
            });
          } else {
            this.setState({ useTranslation: "default" });
          }
        } else  {
          this.setState({ useTranslation: "default" });
        }
        this.setState({ isLoader: false });
      }
    );
  };
  changeHandler = (option) => {
    this.setState({ clicked: option });
    const newObject = [
      {
        input: "",
        rtl: false,
        selectedLanguage: "",
        selectedFont: "",
      },
    ];
    if (option === "addTranslation") {
      this.setState({
        showPopUp: true,
        editTranslation: false,
        arrayOfObjects: newObject,
      });
    } else {
      this.setState({ showPopUp: false });
    }
  };

  inputHandler = (event) => {
    this.method(event.target.name, event.target.value);
  };

  method(name, value) {
    // make a copy
    const arrayOfObjects = [...this.state.arrayOfObjects];
    // merge properties and set dynamic value
    arrayOfObjects[0] = { ...arrayOfObjects[0], [name]: value };

    this.setState({
      arrayOfObjects,
    });
  }

  titleHandler = (event) => {
    this.method("input", event.target.value);
  };
  handleChange = (option) => {
    this.method("rtl", option);
  };
  languageHandleChange = (selectedLanguage) => {
    this.method("selectedLanguage", selectedLanguage);
  };
  fontHandleChange = (selectedFont) => {
    this.method("selectedFont", selectedFont);
  };
  handleSubmit(e) {
    // e.preventDefault();
    let formModel = {
      TranslationId: DraftJS.genKey(),
      FormId: localStorage.CurrentFormId,
      CreatedAt: Date.now(),
      CreatedBy: "1",
      TranslationInfo: JSON.stringify(this.state.arrayOfObjects[0]),
      TranslationName: this.state.arrayOfObjects[0].input,
      IsSelected: false,
      TranslationLanguage: JSON.stringify(
        this.state.arrayOfObjects[0].selectedLanguage
      ),
      IsSelectedAccount: false,
    };
    try {
      PostData(THEME_URLS.POST_TRANSLATION_INFO, formModel).then((result) => {
        if (result.statusCode === 200) {
          this.setState({ showPopUp: false, clicked: "" });
          this.getMenulist();
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      //this.setState({ isLoader: false });
    }
  }
  editHandler = (Id) => {
    this.setState({ updateId: Id, clicked: "" });
    const newObject = [
      {
        input: "",
        rtl: false,
        selectedLanguage: "",
        selectedFont: "",
      },
    ];
    this.setState({
      showPopUp: false,
      arrayOfObjects: newObject,
    });
    GetData(THEME_URLS.GET_TRANSLATION_EDIT_LIST + Id).then((result) => {
      if (result != null) {
        this.setState({ showPopUp: true, editTranslation: true });

        if (result != null) {
          if (result.data.Count > 0) {
            this.setState({
              IsSelectedEditCase: result.data.Items[0].IsSelected,
            });
            let resultItems = result.data.Items[0].TranslationInfo;
            resultItems = JSON.parse(resultItems);
            const newData = [{ ...newObject, ...resultItems }];
            this.setState({
              arrayOfObjects: newData,
            });
            store.dispatch(fetchTranslationInfo(result.data.Items[0]));
          }
        }
      }
    });
  };
  updateHandler = (e) => {
    let selectedFromAccoountTranslation = false;
    if (this.state.translationList !== "") {
      this.state.translationList.map((item) => {
        if (
          this.state.updateId === item.TranslationId &&
          item.IsSelectedAccount === true
        ) {
          selectedFromAccoountTranslation = true;
        } else if (
          this.state.updateId === !item.TranslationId &&
          item.IsSelectedAccount === true
        ) {
          selectedFromAccoountTranslation = true;
        }
        return item.IsSelectedAccount;
      });
    }
    let formModel = {
      TranslationId: this.state.updateId,
      FormId: localStorage.CurrentFormId,
      CreatedAt: Date.now(),
      CreatedBy: "1",
      TranslationInfo: JSON.stringify(this.state.arrayOfObjects[0]),
      TranslationName: this.state.arrayOfObjects[0].input,
      IsSelected: this.state.IsSelectedEditCase,
      TranslationLanguage: JSON.stringify(
        this.state.arrayOfObjects[0].selectedLanguage
      ),
      IsSelectedAccount: selectedFromAccoountTranslation,
    };
    try {
      PostData(THEME_URLS.POST_TRANSLATION_INFO, formModel).then((result) => {
        if (result.statusCode === 200) {
          this.setState({ showPopUp: false });
          this.getMenulist();
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      //this.setState({ isLoader: false });
    }
  };

  useTranslationHandler = (Id) => {
    if (Id === "default") {
      this.setState({ useTranslation: Id });
    } else {
      this.setState({ useTranslation: Id });
    }
    let formModel = {
      FormId: localStorage.CurrentFormId,
      IsSelected: false,
    };
    try {
      this.setState({ isLoader: true });
      UpdateData(THEME_URLS.UPDATE_ALL_FALSE_SERVICES, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            let formModel1 = {
              TranslationId: Id,
              IsSelected: true,
            };
            try {
              UpdateData(THEME_URLS.UPDATE_SELECTED_SERVICE, formModel1).then(
                (result) => {
                  if (result.statusCode === 200) {
                    this.setState({ isLoader: false });
                    this.getMenulist();
                  }
                }
              );
            } catch (err) {
              alert("Something went wrong, please try again.");
              // this.setState({ isLoader: false });
            }
          }
        }
      );
    } catch (err) {
      alert("Something went wrong, please try again.");
    }
  };
  deleteHandler = (e) => {
    // e.preventDefault();
    if (this.state.updateId != null) {
      Delete(THEME_URLS.DELETE_TRANSLATION + this.state.updateId).then(
        (result) => {
          if (result != null) {
            if (result.statusCode === 200) {
            } else {
              window.alert("There is an error in deleting the form.");
            }
            this.setState({ showPopUp: false });
            this.getMenulist();
          }
        }
      );
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div className="ZtOZviTTkcmz3-DO_OzgS boxTranslation">
        <div className="_3JeAfoKibbHbzssmnpicvq">
          <div className="Paper Paper--double-padded translation-Page">
            <div>
              <div className="XKLhmDNloVln61ip64E7e">
                <div
                  className="ZtOZviTTkcmz3-DO_OzgS"
                  style={{ display: "block" }}
                >
                  <h2 className="PaperType--h2">Translations</h2>
                  <br />
                  <p className="PaperType--p">
                    Control the overall form UI language.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="Paper Paper--padded Paper--clickable">
            <div>
              <span>
                <span>English (Defactoform)</span>
                {this.state.useTranslation === "default" && (
                  <div
                    className="BtnV2 BtnV2--raised BtnV2--disabled BtnV2--primary"
                    tabIndex="-1"
                  >
                    <span>Selected</span>
                  </div>
                )}
                {this.state.useTranslation !== "default" && (
                  <div
                    className="BtnV2 BtnV2--raised  BtnV2--primary"
                    tabIndex="-1"
                    onClick={(e) => this.useTranslationHandler("default")}
                  >
                    <span>Use</span>
                  </div>
                )}
              </span>
            </div>
          </div>
          {this.state.translationList !== "" && (
            <div>
              {this.state.translationList.map((translationData, key) => (
                <div
                  className="Paper Paper--padded Paper--clickable"
                  key={"trasnlatioMenu" + key}
                >
                  <div>
                    <span>
                      <span>{translationData.TranslationName}</span>
                      <div
                        style={{ marginLeft: "18px" }}
                        className="BtnV2 BtnV2--raised BtnV2--primary"
                        tabIndex="-1"
                        onClick={(e) =>
                          this.editHandler(translationData.TranslationId)
                        }
                      >
                        <span>Edit</span>
                      </div>
                      {translationData.IsSelected === false && (
                        <div
                          className="BtnV2 BtnV2--raised  BtnV2--primary"
                          tabIndex="-1"
                          onClick={(e) =>
                            this.useTranslationHandler(
                              translationData.TranslationId
                            )
                          }
                        >
                          <span>Use</span>
                        </div>
                      )}
                      {translationData.IsSelected === true && (
                        <div
                          className="BtnV2 BtnV2--raised BtnV2--disabled BtnV2--primary"
                          tabIndex="-1"
                        >
                          <span>Selected</span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mb1 mt-3 text-center">
            {(this.state.clicked === "" ||
              this.state.clicked === "cancel" ||
              this.state.editTranslation) && (
              <div
                className="BtnV2 BtnV2--primary"
                onClick={(e) => this.changeHandler("addTranslation")}
              >
                <span>Add Translation +</span>
              </div>
            )}
          </div>
        </div>

        <div className="_2rjoo-klXFU_UQnvbHm5F8">
          {this.state.showPopUp === true && (
            <form>
              <div className="Paper Paper--double-padded">
                <div>
                  <div className="XKLhmDNloVln61ip64E7e">
                    <div className="ZtOZviTTkcmz3-DO_OzgS">
                      <div className="AdoKE9nnvZr4_zfgdeh5N">
                        <div>
                          {this.state.editTranslation &&
                            this.state.clicked === "" && (
                              <div>
                                <div
                                  className="BtnV2 BtnV2--primary pull-right"
                                  tabIndex="-1"
                                  onClick={(e) =>
                                    this.state.arrayOfObjects[0].input
                                      ? this.updateHandler()
                                      : ""
                                  }
                                >
                                  <span>
                                    {this.state.arrayOfObjects[0].input
                                      ? "Update Translation"
                                      : "Please answer all required questions"}
                                  </span>
                                </div>
                              </div>
                            )}
                          {!this.state.editTranslation && (
                            <h2 className="PaperType--h2">Add Translation</h2>
                          )}
                          {this.state.editTranslation && (
                            <h2 className="PaperType--h2">
                              Edit {this.state.arrayOfObjects[0].input || ""}
                            </h2>
                          )}
                          <div
                            style={{
                              textAlign: "initial",
                              direction: this.state.arrayOfObjects[0].rtl
                                ? "rtl"
                                : "",
                            }}
                          >
                            <div
                              data-key="title"
                              className="LiveField Paperform__Question Paperform__Question--title  LiveField--text LiveField--multiline     LiveField--required "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-title_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="title_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Translation Title
                                                  </span>
                                                  <span className="LiveField__required">
                                                    *
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder="My Custom Translations"
                                    data="[object Object]"
                                    name="Translation Title"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.titleHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].input
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error">
                                This question is required
                              </div>
                            </div>
                            <div
                              data-key="language"
                              className="LiveField Paperform__Question Paperform__Question--language  LiveField--dropdown LiveField--multiline     LiveField--required "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-language_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="language_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Translation Language
                                                  </span>
                                                  <span className="LiveField__required">
                                                    *
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <div>
                                    <div className="Select is-searchable Select--single">
                                      <Select
                                        aria-activedescendant="react-select-language--value"
                                        aria-expanded="false"
                                        aria-haspopup="false"
                                        aria-owns=""
                                        role="combobox"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="English"
                                        value={
                                          this.state.arrayOfObjects[0]
                                            .selectedLanguage
                                        }
                                        onChange={this.languageHandleChange}
                                        options={languageOptions}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="LiveField__error">
                                This question is required
                              </div>
                            </div>
                            <div
                              data-key="rtl"
                              className="LiveField Paperform__Question Paperform__Question--rtl  LiveField--yesNoEnglish LiveField--multiline     LiveField--required "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-rtl_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="rtl_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Translation Language is RTL
                                                  </span>
                                                  <span className="LiveField__required">
                                                    *
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__description">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-rtl_description"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="rtl_description"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Enable if the language is
                                                    written right to left
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <div className="YesNo">
                                    <label
                                      value="yes"
                                      onClick={(e) => this.handleChange(true)}
                                      className={
                                        this.state.arrayOfObjects[0].rtl
                                          ? "btn-raised btn-primary"
                                          : "btn-raised btn-default"
                                      }
                                    >
                                      yes
                                    </label>
                                    <label
                                      value="no"
                                      onClick={(e) => this.handleChange(false)}
                                      className={
                                        !this.state.arrayOfObjects[0].rtl
                                          ? "btn-raised btn-primary"
                                          : "btn-raised btn-default"
                                      }
                                    >
                                      no
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="subsets"
                              className="LiveField Paperform__Question Paperform__Question--subsets  LiveField--dropdown LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-subsets_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="subsets_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Font subsets
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__description">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-subsets_description"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="subsets_description"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Choose from the following
                                                    character subsets if your
                                                    language requires them
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <div>
                                    <div className="Select is-searchable Select--multi">
                                      <Select
                                        isMulti
                                        aria-activedescendant="react-select-subsets--value"
                                        aria-expanded="false"
                                        aria-haspopup="false"
                                        aria-owns=""
                                        role="combobox"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        value={
                                          this.state.arrayOfObjects[0]
                                            .selectedFont
                                        }
                                        onChange={this.fontHandleChange}
                                        options={fontOptions}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <br />
                            <h3 className="PaperType--h3">
                              General Translations
                            </h3>
                            <div
                              data-key="submitting"
                              className="LiveField Paperform__Question Paperform__Question--submitting  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-submitting_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="submitting_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Submitting...
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Submitting"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Submitting
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="submitAnother"
                              className="LiveField Paperform__Question Paperform__Question--submitAnother  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-submitAnother_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="submitAnother_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Submit another
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Submitanother"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Submitanother
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="submissionsClosed"
                              className="LiveField Paperform__Question Paperform__Question--submissionsClosed  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-submissionsClosed_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="submissionsClosed_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Submissions are closed.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Submissionsareclosed"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Submissionsareclosed
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="soldout"
                              className="LiveField Paperform__Question Paperform__Question--soldout  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-soldout_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="soldout_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    SOLD OUT
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="SOLDOUT"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].SOLDOUT
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="submissionFailedUnknown"
                              className="LiveField Paperform__Question Paperform__Question--submissionFailedUnknown  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-submissionFailedUnknown_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="submissionFailedUnknown_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Something went wrong while
                                                    trying to submit. Please try
                                                    again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Somethingwentwrong"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Somethingwentwrong
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="submissionFailedKnown"
                              className="LiveField Paperform__Question Paperform__Question--submissionFailedKnown  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-submissionFailedKnown_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="submissionFailedKnown_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out all of the
                                                    questions correctly.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Pleasefillout"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Pleasefillout
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="continue"
                              className="LiveField Paperform__Question Paperform__Question--continue  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-continue_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="continue_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Continue
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Continue"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Continue
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="cancel"
                              className="LiveField Paperform__Question Paperform__Question--cancel  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-cancel_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="cancel_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Cancel
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Cancel"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Cancel
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_or"
                              className="LiveField Paperform__Question Paperform__Question--checkout_or  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_or_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_or_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Or
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Or"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Or
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_cc"
                              className="LiveField Paperform__Question Paperform__Question--checkout_cc  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_cc_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_cc_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Credit Card
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CreditCard"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CreditCard
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout"
                              className="LiveField Paperform__Question Paperform__Question--checkout  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Checkout
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Checkout"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Checkout
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_summary"
                              className="LiveField Paperform__Question Paperform__Question--checkout_summary  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_summary_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_summary_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    More...
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="More"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].More
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout__stripe_choose"
                              className="LiveField Paperform__Question Paperform__Question--checkout__stripe_choose  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout__stripe_choose_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout__stripe_choose_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Choose Payment Method
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ChoosePaymentMethod"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.ChoosePaymentMethod
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_stripe_name"
                              className="LiveField Paperform__Question Paperform__Question--checkout_stripe_name  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_stripe_name_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_stripe_name_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Name
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Name"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Name
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_stripe_email"
                              className="LiveField Paperform__Question Paperform__Question--checkout_stripe_email  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_stripe_email_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_stripe_email_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Email Address
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="EmailAddress"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].EmailAddress
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_back"
                              className="LiveField Paperform__Question Paperform__Question--checkout_back  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_back_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_back_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Too many failed payment
                                                    attempts. Please try again
                                                    later.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="failedPaymentAttempts"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .failedPaymentAttempts
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_back"
                              className="LiveField Paperform__Question Paperform__Question--checkout_back  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_back_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_back_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Back
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Back"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Back
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_name"
                              className="LiveField Paperform__Question Paperform__Question--checkout_name  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_name_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_name_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Name on card
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Nameoncard"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Nameoncard
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_receiptEmail"
                              className="LiveField Paperform__Question Paperform__Question--checkout_receiptEmail  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_receiptEmail_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_receiptEmail_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Receipt email
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Receiptemail"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Receiptemail
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_card"
                              className="LiveField Paperform__Question Paperform__Question--checkout_card  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_card_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_card_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Credit Card
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Creditcard"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Creditcard
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_number"
                              className="LiveField Paperform__Question Paperform__Question--checkout_number  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_number_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_number_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Card Number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CardNumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CardNumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_cvc"
                              className="LiveField Paperform__Question Paperform__Question--checkout_cvc  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_cvc_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_cvc_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    CVC
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CVC"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CVC
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_tax"
                              className="LiveField Paperform__Question Paperform__Question--checkout_tax  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_tax_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_tax_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Tax
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Tax"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Tax
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_total"
                              className="LiveField Paperform__Question Paperform__Question--checkout_total  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_total_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_total_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Total
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Total"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Total
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_processing_fee"
                              className="LiveField Paperform__Question Paperform__Question--checkout_processing_fee  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_processing_fee_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_processing_fee_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Processing Fee
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ProcessingFee"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].ProcessingFee
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_calculated"
                              className="LiveField Paperform__Question Paperform__Question--checkout_calculated  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_calculated_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_calculated_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Calculated Pricing
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CalculatedPricing"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .CalculatedPricing
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_authorizedOnly"
                              className="LiveField Paperform__Question Paperform__Question--checkout_authorizedOnly  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_authorizedOnly_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_authorizedOnly_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    You are authorizing this
                                                    charge to be processed in
                                                    the future.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Youare "
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Youare
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_stripe_subAuthCharge"
                              className="LiveField Paperform__Question Paperform__Question--checkout_stripe_subAuthCharge  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_stripe_subAuthCharge_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_stripe_subAuthCharge_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    A small verification charge
                                                    may appear on your credit
                                                    card statement, you will not
                                                    be charged this value.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Asmall  "
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Asmall
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_willBeCharged"
                              className="LiveField Paperform__Question Paperform__Question--checkout_willBeCharged  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_willBeCharged_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_willBeCharged_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    You will be charged
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="charged"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].charged
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_willBeAuthorized"
                              className="LiveField Paperform__Question Paperform__Question--checkout_willBeAuthorized  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_willBeAuthorized_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_willBeAuthorized_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    You are authorizing a charge
                                                    of
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Youareauthorizing"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Youareauthorizing
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_willBeChargedRecurring"
                              className="LiveField Paperform__Question Paperform__Question--checkout_willBeChargedRecurring  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_willBeChargedRecurring_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_willBeChargedRecurring_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    You will be subscribed to:{" "}
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Youwillbe "
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Youwillbe
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_subscriptionIncludesTax"
                              className="LiveField Paperform__Question Paperform__Question--checkout_subscriptionIncludesTax  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_subscriptionIncludesTax_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_subscriptionIncludesTax_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Plus X tax.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PlusXtax"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].PlusXtax
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_includingFee"
                              className="LiveField Paperform__Question Paperform__Question--checkout_includingFee  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_includingFee_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_includingFee_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Inc X processing fee.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="IncXprocessingfee"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .IncXprocessingfee
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_square_pos"
                              className="LiveField Paperform__Question Paperform__Question--checkout_square_pos  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_square_pos_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_square_pos_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Continue in Square POS app
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ContinueinSquarePOSapp"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .ContinueinSquarePOSapp
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_alipay"
                              className="LiveField Paperform__Question Paperform__Question--checkout_alipay  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_alipay_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_alipay_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Alipay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Alipay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Alipay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_bancontact"
                              className="LiveField Paperform__Question Paperform__Question--checkout_bancontact  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_bancontact_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_bancontact_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Bancontact
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Bancontact"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Bancontact
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_eps"
                              className="LiveField Paperform__Question Paperform__Question--checkout_eps  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_eps_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_eps_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    EPS
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="EPS"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].EPS
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_giropay"
                              className="LiveField Paperform__Question Paperform__Question--checkout_giropay  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_giropay_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_giropay_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Giropay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Giropay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Giropay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_ideal"
                              className="LiveField Paperform__Question Paperform__Question--checkout_ideal  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_ideal_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_ideal_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    iDEAL
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="iDEAL"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].iDEAL
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_p24"
                              className="LiveField Paperform__Question Paperform__Question--checkout_p24  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_p24_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_p24_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Przelewy24
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Przelewy24"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Przelewy24
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="checkout_wechat"
                              className="LiveField Paperform__Question Paperform__Question--checkout_wechat  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-checkout_wechat_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="checkout_wechat_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    WeChat Pay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="WeChatPay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].WeChatPay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="day"
                              className="LiveField Paperform__Question Paperform__Question--day  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-day_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="day_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Day
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Day"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Day
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="month"
                              className="LiveField Paperform__Question Paperform__Question--month  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-month_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="month_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Month
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Month"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Month
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="year"
                              className="LiveField Paperform__Question Paperform__Question--year  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-year_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="year_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Year
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Year"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Year
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="days"
                              className="LiveField Paperform__Question Paperform__Question--days  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-days_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="days_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Days
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Days"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Days
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="months"
                              className="LiveField Paperform__Question Paperform__Question--months  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-months_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="months_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Months
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Months"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Months
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="years"
                              className="LiveField Paperform__Question Paperform__Question--years  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-years_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="years_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Years
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Years"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Years
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="hours"
                              className="LiveField Paperform__Question Paperform__Question--hours  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-hours_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="hours_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Hours
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Hours"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Hours
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="minutes"
                              className="LiveField Paperform__Question Paperform__Question--minutes  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-minutes_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="minutes_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Minutes
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Minutes"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Minutes
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="ampm"
                              className="LiveField Paperform__Question Paperform__Question--ampm  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-ampm_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="ampm_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    am/pm
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ampm"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].ampm
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="hours_placeholder"
                              className="LiveField Paperform__Question Paperform__Question--hours_placeholder  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-hours_placeholder_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="hours_placeholder_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    HH
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="HH"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].HH
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="minutes_placeholder"
                              className="LiveField Paperform__Question Paperform__Question--minutes_placeholder  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-minutes_placeholder_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="minutes_placeholder_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    MM
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="MM"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].MM
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="yes"
                              className="LiveField Paperform__Question Paperform__Question--yes  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-yes_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="yes_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Yes
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Yes"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Yes
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="no"
                              className="LiveField Paperform__Question Paperform__Question--no  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-no_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="no_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    No
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="No"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].No
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="other"
                              className="LiveField Paperform__Question Paperform__Question--other  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-other_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="other_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Other
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Other"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Other
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="unit"
                              className="LiveField Paperform__Question Paperform__Question--unit  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-unit_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="unit_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    unit
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="unit"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].unit
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="units"
                              className="LiveField Paperform__Question Paperform__Question--units  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-units_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="units_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    units
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="units"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].units
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appointment_pickstarttime"
                              className="LiveField Paperform__Question Paperform__Question--appointment_pickstarttime  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appointment_pickstarttime_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appointment_pickstarttime_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    pick start time
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="pickstarttime"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].pickstarttime
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appointment_pickendtime"
                              className="LiveField Paperform__Question Paperform__Question--appointment_pickendtime  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appointment_pickendtime_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appointment_pickendtime_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    pick end time
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="pickendtime"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].pickendtime
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="address_search"
                              className="LiveField Paperform__Question Paperform__Question--address_search  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-address_search_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="address_search_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Search for address
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Searchforaddress"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Searchforaddress
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_address_search"
                              className="LiveField Paperform__Question Paperform__Question--error_address_search  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_address_search_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_address_search_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    No address found, add
                                                    manually
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="addmanually"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].addmanually
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="colorPicker__choose"
                              className="LiveField Paperform__Question Paperform__Question--colorPicker__choose  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-colorPicker__choose_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="colorPicker__choose_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Pick a color
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Pickacolor"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Pickacolor
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="subpremise"
                              className="LiveField Paperform__Question Paperform__Question--subpremise  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-subpremise_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="subpremise_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Apartment/Unit
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ApartmentUnit"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].ApartmentUnit
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="streetNumber"
                              className="LiveField Paperform__Question Paperform__Question--streetNumber  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-streetNumber_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="streetNumber_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Street Number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="StreetNumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].StreetNumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="street"
                              className="LiveField Paperform__Question Paperform__Question--street  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-street_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="street_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Street
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Street"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Street
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="suburb"
                              className="LiveField Paperform__Question Paperform__Question--suburb  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-suburb_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="suburb_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    City/Suburb
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CitySuburb"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CitySuburb
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="state"
                              className="LiveField Paperform__Question Paperform__Question--state  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-state_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="state_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    State
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="State"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].State
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="city"
                              className="LiveField Paperform__Question Paperform__Question--city  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-city_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="city_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    City
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="City"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].City
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="postcode"
                              className="LiveField Paperform__Question Paperform__Question--postcode  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-postcode_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="postcode_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Zip/Post Code
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ZipPostCode"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].ZipPostCode
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="country"
                              className="LiveField Paperform__Question Paperform__Question--country  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-country_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="country_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Country
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Country"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Country
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="latitude"
                              className="LiveField Paperform__Question Paperform__Question--latitude  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-latitude_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="latitude_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Latitude
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Latitude"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Latitude
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="longitude"
                              className="LiveField Paperform__Question Paperform__Question--longitude  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-longitude_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="longitude_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Longitude
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Longitude"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Longitude
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="address_line1"
                              className="LiveField Paperform__Question Paperform__Question--address_line1  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-address_line1_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="address_line1_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Address line 1
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="addressline1"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].addressline1
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="address_line2"
                              className="LiveField Paperform__Question Paperform__Question--address_line2  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-address_line2_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="address_line2_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Address line 2
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Addressline2"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Addressline2
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="choose_file"
                              className="LiveField Paperform__Question Paperform__Question--choose_file  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-choose_file_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="choose_file_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Choose a file
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Chooseafile"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Chooseafile
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="uploading_file"
                              className="LiveField Paperform__Question Paperform__Question--uploading_file  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-uploading_file_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="uploading_file_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Uploading X
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="UploadingX"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].UploadingX
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="signature_confirmation"
                              className="LiveField Paperform__Question Paperform__Question--signature_confirmation  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-signature_confirmation_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="signature_confirmation_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Confirm signature
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Confirmsignature"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Confirmsignature
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="answerOther"
                              className="LiveField Paperform__Question Paperform__Question--answerOther  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-answerOther_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="answerOther_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Specify other...
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="SpecifyOther"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].SpecifyOther
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_required"
                              className="LiveField Paperform__Question Paperform__Question--error_required  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_required_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_required_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    This question is required
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="questionrequired"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .questionrequired
                                    }
                                    onChange={this.inputHandler}
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_email"
                              className="LiveField Paperform__Question Paperform__Question--error_email  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_email_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_email_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid email
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PleaseEnterAValidEmail"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .PleaseEnterAValidEmail
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="email_confirmation"
                              className="LiveField Paperform__Question Paperform__Question--email_confirmation  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-email_confirmation_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="email_confirmation_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Confirm email address
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Confirmemail"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Confirmemail
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_email_confirmation"
                              className="LiveField Paperform__Question Paperform__Question--error_email_confirmation  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_email_confirmation_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_email_confirmation_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Email addresses don't match
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="EmailAddressesNotMatch"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .EmailAddressesNotMatch
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_filetype"
                              className="LiveField Paperform__Question Paperform__Question--error_filetype  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_filetype_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_filetype_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    "X" is not an allowed file
                                                    type
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Xnotallowed"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Xnotallowed
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_fileUploading"
                              className="LiveField Paperform__Question Paperform__Question--error_fileUploading  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_fileUploading_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_fileUploading_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    File is still uploading
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="stillUploading"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .stillUploading
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_url"
                              className="LiveField Paperform__Question Paperform__Question--error_url  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_url_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_url_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid URL
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="validURL"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].validURL
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_signature"
                              className="LiveField Paperform__Question Paperform__Question--error_signature  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_signature_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_signature_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Signature still uploading
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="SignatureStillUploading"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .SignatureStillUploading
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_maxFilesReached"
                              className="LiveField Paperform__Question Paperform__Question--error_maxFilesReached  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_maxFilesReached_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_maxFilesReached_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    The maximum number of files
                                                    have been added
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="maximumfilesadded"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .maximumfilesadded
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_maxMultipleFiles"
                              className="LiveField Paperform__Question Paperform__Question--error_maxMultipleFiles  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_maxMultipleFiles_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_maxMultipleFiles_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Too many files, the maximum
                                                    is X
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="maximumisX"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].maximumisX
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_minMultipleFiles"
                              className="LiveField Paperform__Question Paperform__Question--error_minMultipleFiles  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_minMultipleFiles_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_minMultipleFiles_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please upload atleast X
                                                    files
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="atleastXfiles"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].atleastXfiles
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="sign"
                              className="LiveField Paperform__Question Paperform__Question--sign  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-sign_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="sign_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Sign here
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Signhere"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Signhere
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_yesNo"
                              className="LiveField Paperform__Question Paperform__Question--error_yesNo  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_yesNo_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_yesNo_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please choose an answer
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PleaseChooseAnAnswer"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .PleaseChooseAnAnswer
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_number"
                              className="LiveField Paperform__Question Paperform__Question--error_number  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_number_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_number_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="enterAnumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].enterAnumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_long"
                              className="LiveField Paperform__Question Paperform__Question--error_long  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_long_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_long_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Too long
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Toolong"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Toolong
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_short"
                              className="LiveField Paperform__Question Paperform__Question--error_short  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_short_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_short_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Too short
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Tooshort"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Tooshort
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_color"
                              className="LiveField Paperform__Question Paperform__Question--error_color  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_color_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_color_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid hex
                                                    color
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="hexColor"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].hexColor
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_minNumber"
                              className="LiveField Paperform__Question Paperform__Question--error_minNumber  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_minNumber_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_minNumber_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a number
                                                    greater than or equal to X
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="greaterThanX"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].greaterThanX
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_maxNumber"
                              className="LiveField Paperform__Question Paperform__Question--error_maxNumber  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_maxNumber_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_maxNumber_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a number less
                                                    than or equal to X
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="lessThanX"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].lessThanX
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_integerOnly"
                              className="LiveField Paperform__Question Paperform__Question--error_integerOnly  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_integerOnly_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_integerOnly_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a whole number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="WholeNumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].WholeNumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_price"
                              className="LiveField Paperform__Question Paperform__Question--error_price  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_price_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_price_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid price
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="validPrice"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].validPrice
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_date"
                              className="LiveField Paperform__Question Paperform__Question--error_date  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_date_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_date_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid date
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="validDate"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].validDate
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_date_year"
                              className="LiveField Paperform__Question Paperform__Question--error_date_year  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_date_year_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_date_year_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please choose a year
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="chooseAyear"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].chooseAyear
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_date_month"
                              className="LiveField Paperform__Question Paperform__Question--error_date_month  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_date_month_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_date_month_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please choose a month
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="chooseAmonth"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].chooseAmonth
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_date_day"
                              className="LiveField Paperform__Question Paperform__Question--error_date_day  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_date_day_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_date_day_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please choose a day
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="chooseAday"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].chooseAday
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_date_futureonly"
                              className="LiveField Paperform__Question Paperform__Question--error_date_futureonly  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_date_futureonly_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_date_futureonly_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please choose a day in the
                                                    future
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="dayfuture"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].dayfuture
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_date_pastonly"
                              className="LiveField Paperform__Question Paperform__Question--error_date_pastonly  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_date_pastonly_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_date_pastonly_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please choose a day in the
                                                    past
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="daypast"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].daypast
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_time"
                              className="LiveField Paperform__Question Paperform__Question--error_time  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_time_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_time_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid time
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="validTime"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].validTime
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_phone"
                              className="LiveField Paperform__Question Paperform__Question--error_phone  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_phone_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_phone_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please enter a valid phone
                                                    number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="validPhonenumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .validPhonenumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_maxOptions"
                              className="LiveField Paperform__Question Paperform__Question--error_maxOptions  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_maxOptions_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_maxOptions_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Can only choose X or less
                                                    options
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="lessOptions"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].lessOptions
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_minOptions"
                              className="LiveField Paperform__Question Paperform__Question--error_minOptions  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_minOptions_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_minOptions_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Choose X or more options
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="moreOptions"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].moreOptions
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_other"
                              className="LiveField Paperform__Question Paperform__Question--error_other  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_other_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_other_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please specify other
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PleaseSpecifyOther"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .PleaseSpecifyOther
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_creditCard"
                              className="LiveField Paperform__Question Paperform__Question--error_creditCard  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_creditCard_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_creditCard_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Not a valid credit card
                                                    number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="NotValidCardNumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .NotValidCardNumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_incompleteForm"
                              className="LiveField Paperform__Question Paperform__Question--error_incompleteForm  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_incompleteForm_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_incompleteForm_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please finish the form
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="finishform"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].finishform
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_incorrectFields"
                              className="LiveField Paperform__Question Paperform__Question--error_incorrectFields  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_incorrectFields_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_incorrectFields_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out all of the
                                                    fields correctly
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="fillFieldsCorrectly"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .fillFieldsCorrectly
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_incorrectFieldsPagination"
                              className="LiveField Paperform__Question Paperform__Question--error_incorrectFieldsPagination  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_incorrectFieldsPagination_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_incorrectFieldsPagination_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please answer all required
                                                    questions
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="requiredQuestions"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .requiredQuestions
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_unknownFailure"
                              className="LiveField Paperform__Question Paperform__Question--error_unknownFailure  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_unknownFailure_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_unknownFailure_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Something went wrong while
                                                    trying to submit. Please try
                                                    again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PleaseTryAgain"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .PleaseTryAgain
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="questiontogo"
                              className="LiveField Paperform__Question Paperform__Question--questiontogo  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-questiontogo_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="questiontogo_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    1 question to go
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="question1"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].question1
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="questionstogo"
                              className="LiveField Paperform__Question Paperform__Question--questionstogo  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-questionstogo_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="questionstogo_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    X questions to go
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Xquestions"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Xquestions
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_submittedAt"
                              className="LiveField Paperform__Question Paperform__Question--results_submittedAt  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_submittedAt_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_submittedAt_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Submitted At
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="SubmittedAt"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .SubmittedAt || ""
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_item"
                              className="LiveField Paperform__Question Paperform__Question--results_item  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_item_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_item_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Item
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Item"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Item
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_total"
                              className="LiveField Paperform__Question Paperform__Question--results_total  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_total_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_total_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Total Amount
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="TotalAmount"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].TotalAmount
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_quantity"
                              className="LiveField Paperform__Question Paperform__Question--results_quantity  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_quantity_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_quantity_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Quantity
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Quantity"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Quantity
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_price"
                              className="LiveField Paperform__Question Paperform__Question--results_price  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_price_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_price_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Price
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Pricex"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Pricex
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_totalNum"
                              className="LiveField Paperform__Question Paperform__Question--results_totalNum  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_totalNum_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_totalNum_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Total
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Totalx"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Totalx
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_id"
                              className="LiveField Paperform__Question Paperform__Question--results_id  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_id_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_id_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Submission ID
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="SubmissionID"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].SubmissionID
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_subscription_id"
                              className="LiveField Paperform__Question Paperform__Question--results_subscription_id  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_subscription_id_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_subscription_id_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Subscription ID
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="SubscriptionID"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .SubscriptionID
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_plan"
                              className="LiveField Paperform__Question Paperform__Question--results_plan  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_plan_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_plan_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Plan
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Plan"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Plan
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_interval"
                              className="LiveField Paperform__Question Paperform__Question--results_interval  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_interval_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_interval_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Interval
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Interval"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Interval
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="results_amount"
                              className="LiveField Paperform__Question Paperform__Question--results_amount  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-results_amount_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="results_amount_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Amount
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Amount"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Amount
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="score"
                              className="LiveField Paperform__Question Paperform__Question--score  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-score_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="score_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Score
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Score"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Score
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon"
                              className="LiveField Paperform__Question Paperform__Question--coupon  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Coupon
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Coupon"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Coupon
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_enter"
                              className="LiveField Paperform__Question Paperform__Question--coupon_enter  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_enter_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_enter_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Enter Coupon
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="EnterCoupon"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].EnterCoupon
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="apply_coupon"
                              className="LiveField Paperform__Question Paperform__Question--apply_coupon  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-apply_coupon_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="apply_coupon_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Apply Coupon
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ApplyCoupon"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].ApplyCoupon
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="apply_coupon_applying"
                              className="LiveField Paperform__Question Paperform__Question--apply_coupon_applying  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-apply_coupon_applying_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="apply_coupon_applying_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Applying
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Applying"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Applying
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_forever"
                              className="LiveField Paperform__Question Paperform__Question--coupon_forever  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_forever_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_forever_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    forever
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="forever"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].forever
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_once"
                              className="LiveField Paperform__Question Paperform__Question--coupon_once  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_once_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_once_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    once
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="once"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].once
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_repeating_1"
                              className="LiveField Paperform__Question Paperform__Question--coupon_repeating_1  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_repeating_1_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_repeating_1_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    for 1 month
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="for1month"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].for1month
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_repeating_multiple"
                              className="LiveField Paperform__Question Paperform__Question--coupon_repeating_multiple  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_repeating_multiple_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_repeating_multiple_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    for X months
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="forXmonths"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].forXmonths
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_discount"
                              className="LiveField Paperform__Question Paperform__Question--coupon_discount  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_discount_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_discount_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    discount
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="discount"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].discount
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_discount_off"
                              className="LiveField Paperform__Question Paperform__Question--coupon_discount_off  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_discount_off_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_discount_off_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    off
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="off"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].off
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="coupon_applied_to"
                              className="LiveField Paperform__Question Paperform__Question--coupon_applied_to  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-coupon_applied_to_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="coupon_applied_to_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    applied to
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="appliedto"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].appliedto
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_start_date"
                              className="LiveField Paperform__Question Paperform__Question--appt_start_date  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_start_date_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_start_date_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Start Date
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="StartDate"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].StartDate
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_stop_date"
                              className="LiveField Paperform__Question Paperform__Question--appt_stop_date  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_stop_date_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_stop_date_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    End Date
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="EndDate"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].EndDate
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_start_time"
                              className="LiveField Paperform__Question Paperform__Question--appt_start_time  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_start_time_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_start_time_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Start Time
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="StartTime"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].StartTime
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_start_time"
                              className="LiveField Paperform__Question Paperform__Question--appt_start_time  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_stop_time_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_start_time_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Stop Time
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="StopTime"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].StopTime
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_invitee_emails"
                              className="LiveField Paperform__Question Paperform__Question--appt_invitee_emails  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_invitee_emails_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_invitee_emails_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Invitee Emails
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="InviteeEmails"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].InviteeEmails
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_timezone"
                              className="LiveField Paperform__Question Paperform__Question--appt_timezone  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_timezone_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_timezone_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Timezone
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Timezone"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Timezone
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_description"
                              className="LiveField Paperform__Question Paperform__Question--appt_description  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_description_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_description_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Description
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Description"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Description
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_location"
                              className="LiveField Paperform__Question Paperform__Question--appt_location  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_location_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_location_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Location
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Location"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Location
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_title"
                              className="LiveField Paperform__Question Paperform__Question--appt_title  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_title_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_title_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Title
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Title"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Title
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_search"
                              className="LiveField Paperform__Question Paperform__Question--appt_search  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_search_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_search_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Search...
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Search"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Search
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="appt_until"
                              className="LiveField Paperform__Question Paperform__Question--appt_until  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-appt_until_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="appt_until_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    —
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="underScore"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].underScore
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="agree"
                              className="LiveField Paperform__Question Paperform__Question--agree  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-agree_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="agree_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    I Agree
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="IAgree"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].IAgree
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="disagree"
                              className="LiveField Paperform__Question Paperform__Question--disagree  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-disagree_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="disagree_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    I Disagree
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="IDisagree"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].IDisagree
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_product_min"
                              className="LiveField Paperform__Question Paperform__Question--error_product_min  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_product_min_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_product_min_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    You must select at least X
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="selectleastX"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].selectleastX
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="error_product_max"
                              className="LiveField Paperform__Question Paperform__Question--error_product_max  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-error_product_max_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="error_product_max_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    You must select at no more
                                                    than X
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="nomorethanX"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].nomorethanX
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <br />{" "}
                            <h3 className="PaperType--h3">
                              Braintree Specific Translations
                            </h3>
                            <div
                              data-key="braintree_payingWith"
                              className="LiveField Paperform__Question Paperform__Question--braintree_payingWith  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_payingWith_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_payingWith_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Paying with{" "}
                                                  </span>
                                                </span>
                                                <span className="AnswerPipe AnswerPipe--paymentSource" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Payingwith"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Payingwith
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_chooseAnotherWayToPay"
                              className="LiveField Paperform__Question Paperform__Question--braintree_chooseAnotherWayToPay  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_chooseAnotherWayToPay_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_chooseAnotherWayToPay_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Choose another way to pay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="anotherwaytopay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .anotherwaytopay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_chooseAWayToPay"
                              className="LiveField Paperform__Question Paperform__Question--braintree_chooseAWayToPay  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_chooseAWayToPay_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_chooseAWayToPay_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Choose a way to pay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="awaytopay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].awaytopay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_otherWaysToPay"
                              className="LiveField Paperform__Question Paperform__Question--braintree_otherWaysToPay  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_otherWaysToPay_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_otherWaysToPay_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Other ways to pay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Otherwaystopay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Otherwaystopay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_browserNotSupported"
                              className="LiveField Paperform__Question Paperform__Question--braintree_browserNotSupported  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_browserNotSupported_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_browserNotSupported_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Browser not supported.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Browsernotsupported"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Browsernotsupported
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldEmptyForCvv"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldEmptyForCvv  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldEmptyForCvv_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldEmptyForCvv_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out a CVV.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PleaseCVV"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].PleaseCVV
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldEmptyForExpirationDate"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldEmptyForExpirationDate  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldEmptyForExpirationDate_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldEmptyForExpirationDate_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out an
                                                    expiration date.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="expirationDate"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .expirationDate
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldEmptyForCardholderName"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldEmptyForCardholderName  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldEmptyForCardholderName_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldEmptyForCardholderName_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out a cardholder
                                                    name.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="cardholdeName"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].cardholdeName
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldEmptyForNumber"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldEmptyForNumber  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldEmptyForNumber_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldEmptyForNumber_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out a card
                                                    number.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="cardnumber."
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].cardnumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldEmptyForPostalCode"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldEmptyForPostalCode  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldEmptyForPostalCode_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldEmptyForPostalCode_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please fill out a postal
                                                    code.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="postalcode"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].postalcode
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldInvalidForCvv"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldInvalidForCvv  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldInvalidForCvv_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldInvalidForCvv_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    This security code is not
                                                    valid.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="securitycodenotvalid"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .securitycodenotvalid
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldInvalidForExpirationDate"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldInvalidForExpirationDate  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldInvalidForExpirationDate_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldInvalidForExpirationDate_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    This expiration date is not
                                                    valid.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="expirationdatenotvalid"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .expirationdatenotvalid
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldInvalidForNumber"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldInvalidForNumber  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldInvalidForNumber_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldInvalidForNumber_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    This card number is not
                                                    valid.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="cardnumbernotvalid"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .cardnumbernotvalid
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_fieldInvalidForPostalCode"
                              className="LiveField Paperform__Question Paperform__Question--braintree_fieldInvalidForPostalCode  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_fieldInvalidForPostalCode_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_fieldInvalidForPostalCode_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    This postal code is not
                                                    valid.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="postalcodenotvalid"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .postalcodenotvalid
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_genericError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_genericError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_genericError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_genericError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Something went wrong on our
                                                    end.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Somethingwrongonend"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Somethingwrongonend
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_hostedFieldsFailedTokenizationError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_hostedFieldsFailedTokenizationError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_hostedFieldsFailedTokenizationError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_hostedFieldsFailedTokenizationError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please check your
                                                    information and try again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="checkyourInformation"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .checkyourInformation
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_hostedFieldsTokenizationCvvVerificationFailedError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_hostedFieldsTokenizationCvvVerificationFailedError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_hostedFieldsTokenizationCvvVerificationFailedError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_hostedFieldsTokenizationCvvVerificationFailedError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Credit card verification
                                                    failed. Please check your
                                                    information and try again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Creditcardverificationfailed"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .Creditcardverificationfailed
                                    }
                                    autoComplete="on"
                                    className="LiveField__input"
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_hostedFieldsTokenizationNetworkErrorError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_hostedFieldsTokenizationNetworkErrorError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_hostedFieldsTokenizationNetworkErrorError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_hostedFieldsTokenizationNetworkErrorError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Network error. Please try
                                                    again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Networkerror"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Networkerror
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_hostedFieldsFieldsInvalidError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_hostedFieldsFieldsInvalidError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_hostedFieldsFieldsInvalidError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_hostedFieldsFieldsInvalidError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Please check your
                                                    information and try again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Pleasecheck"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Pleasecheck
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_paypalAccountTokenizationFailedError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_paypalAccountTokenizationFailedError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_paypalAccountTokenizationFailedError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_paypalAccountTokenizationFailedError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Something went wrong adding
                                                    the PayPal account. Please
                                                    try again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="wrongaddingPayPalaccount"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .wrongaddingPayPalaccount
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_paypalFlowFailedError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_paypalFlowFailedError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_paypalFlowFailedError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_paypalFlowFailedError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Something went wrong
                                                    connecting to PayPal. Please
                                                    try again.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="wrongConnectingtoPayPal"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .wrongConnectingtoPayPal
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_paypalTokenizationRequestActiveError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_paypalTokenizationRequestActiveError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_paypalTokenizationRequestActiveError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_paypalTokenizationRequestActiveError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    PayPal payment authorization
                                                    is already in progress.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="authorizationinprogress"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .authorizationinprogress
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_unsupportedCardTypeError"
                              className="LiveField Paperform__Question Paperform__Question--braintree_unsupportedCardTypeError  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_unsupportedCardTypeError_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_unsupportedCardTypeError_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    This card type is not
                                                    supported. Please try
                                                    another card.
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="cardnotsupported"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .cardnotsupported
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_cardholderNameLabel"
                              className="LiveField Paperform__Question Paperform__Question--braintree_cardholderNameLabel  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_cardholderNameLabel_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_cardholderNameLabel_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Cardholder Name
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CarholderName"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CarholderName
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_cardNumberLabel"
                              className="LiveField Paperform__Question Paperform__Question--braintree_cardNumberLabel  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_cardNumberLabel_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_cardNumberLabel_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Card Number
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CarNumber"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CarNumber
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_cvvLabel"
                              className="LiveField Paperform__Question Paperform__Question--braintree_cvvLabel  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_cvvLabel_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_cvvLabel_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    CVV
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="cvv"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].cvv
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_cvvThreeDigitLabelSubheading"
                              className="LiveField Paperform__Question Paperform__Question--braintree_cvvThreeDigitLabelSubheading  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_cvvThreeDigitLabelSubheading_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_cvvThreeDigitLabelSubheading_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    {"(3 digits)"}
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="digits"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].digits
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_cvvFourDigitLabelSubheading"
                              className="LiveField Paperform__Question Paperform__Question--braintree_cvvFourDigitLabelSubheading  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_cvvFourDigitLabelSubheading_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_cvvFourDigitLabelSubheading_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    {"(4 digits)"}
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="digit"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].digit
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_expirationDateLabel"
                              className="LiveField Paperform__Question Paperform__Question--braintree_expirationDateLabel  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_expirationDateLabel_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_expirationDateLabel_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Expiration Date
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="ExpirationDate"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .ExpirationDate
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_expirationDateLabelSubheading"
                              className="LiveField Paperform__Question Paperform__Question--braintree_expirationDateLabelSubheading  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_expirationDateLabelSubheading_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_expirationDateLabelSubheading_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    (MM/YY)
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="MMYY"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].MMYY
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_cardholderNamePlaceholder"
                              className="LiveField Paperform__Question Paperform__Question--braintree_cardholderNamePlaceholder  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_cardholderNamePlaceholder_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_cardholderNamePlaceholder_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Cardholder Name
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="CardName"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].CardName
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_expirationDatePlaceholder"
                              className="LiveField Paperform__Question Paperform__Question--braintree_expirationDatePlaceholder  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_expirationDatePlaceholder_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_expirationDatePlaceholder_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    MM/YY
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="MMY"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].MMY
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_postalCodeLabel"
                              className="LiveField Paperform__Question Paperform__Question--braintree_postalCodeLabel  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_postalCodeLabel_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_postalCodeLabel_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Postal Code
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Postalode"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Postalode
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_payWithCard"
                              className="LiveField Paperform__Question Paperform__Question--braintree_payWithCard  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_payWithCard_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_payWithCard_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Pay with card
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Paywithcard"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Paywithcard
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_endingIn"
                              className="LiveField Paperform__Question Paperform__Question--braintree_endingIn  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_endingIn_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_endingIn_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Ending in{" "}
                                                  </span>
                                                </span>
                                                <span className="AnswerPipe AnswerPipe--lastFourCardDigits" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Endingin "
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Endingin
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_Card"
                              className="LiveField Paperform__Question Paperform__Question--braintree_Card  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_Card_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_Card_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Card
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Ca"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Ca
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_PayPal"
                              className="LiveField Paperform__Question Paperform__Question--braintree_PayPal  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_PayPal_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_PayPal_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    PayPal
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Paypal"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Paypal
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_'PayPal Credit'"
                              className="LiveField Paperform__Question Paperform__Question--braintree_'PayPal Credit'  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_'PayPal Credit'_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_'PayPal Credit'_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    PayPal Credit
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="PayPalCredit"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].PayPalCredit
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_'American Express'"
                              className="LiveField Paperform__Question Paperform__Question--braintree_'American Express'  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_'American Express'_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_'American Express'_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    American Express
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="AmericanExpress"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0]
                                        .AmericanExpress
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_Discover"
                              className="LiveField Paperform__Question Paperform__Question--braintree_Discover  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_Discover_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_Discover_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Discover
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Discover"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Discover
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_'Diners Club'"
                              className="LiveField Paperform__Question Paperform__Question--braintree_'Diners Club'  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_'Diners Club'_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_'Diners Club'_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Diners Club
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="DinersClub"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].DinersClub
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_MasterCard"
                              className="LiveField Paperform__Question Paperform__Question--braintree_MasterCard  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_MasterCard_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_MasterCard_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    MasterCard
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="MasterCard"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].MasterCard
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_Visa"
                              className="LiveField Paperform__Question Paperform__Question--braintree_Visa  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_Visa_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_Visa_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Visa
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Visa"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Visa
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_JCB"
                              className="LiveField Paperform__Question Paperform__Question--braintree_JCB  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_JCB_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_JCB_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    JCB
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="JCB"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].JCB
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_Maestro"
                              className="LiveField Paperform__Question Paperform__Question--braintree_Maestro  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_Maestro_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_Maestro_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    Maestro
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    data="[object Object]"
                                    name="Maestro"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    type="text"
                                    onChange={this.inputHandler}
                                    defaultValue={
                                      this.state.arrayOfObjects[0].Maestro
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                            <div
                              data-key="braintree_UnionPay"
                              className="LiveField Paperform__Question Paperform__Question--braintree_UnionPay  LiveField--text LiveField--multiline      "
                            >
                              <div className="LiveField__container">
                                <div className="LiveField__header">
                                  <div>
                                    <div className="DraftEditor-root">
                                      <div className="DraftEditor-editorContainer">
                                        <div
                                          aria-describedby="placeholder-braintree_UnionPay_title"
                                          className="public-DraftEditor-content"
                                          contentEditable="false"
                                          suppressContentEditableWarning={true}
                                          spellCheck="false"
                                        >
                                          <div data-contents="true">
                                            <div
                                              className=""
                                              data-block="true"
                                              data-editor="braintree_UnionPay_title"
                                              data-offset-key="initial-0-0"
                                            >
                                              <div
                                                data-offset-key="initial-0-0"
                                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                              >
                                                <span data-offset-key="initial-0-0">
                                                  <span data-text="true">
                                                    UnionPay
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="LiveField__answer">
                                  <input
                                    placeholder=""
                                    type="text"
                                    onChange={this.inputHandler}
                                    data="[object Object]"
                                    name="UnionPay"
                                    autoComplete="on"
                                    className="LiveField__input"
                                    defaultValue={
                                      this.state.arrayOfObjects[0].UnionPay
                                    }
                                  />
                                </div>
                              </div>
                              <div className="LiveField__error" />
                            </div>
                          </div>
                          <br />
                          {this.state.arrayOfObjects[0].input !== "" &&
                            this.state.arrayOfObjects[0].selectedLanguage !==
                              "" &&
                            !this.state.editTranslation && (
                              <div
                                className="BtnV2 BtnV2--disabled BtnV2--primary"
                                tabIndex="-1"
                                onClick={(e) => this.handleSubmit(e)}
                              >
                                <span>Create Translation</span>
                              </div>
                            )}
                          {(this.state.arrayOfObjects[0].input === "" ||
                            this.state.arrayOfObjects[0].selectedLanguage ===
                              "") &&
                            !this.state.editTranslation && (
                              <div
                                className="BtnV2 BtnV2--disabled BtnV2--primary"
                                tabIndex="-1"
                              >
                                <span>
                                  Please answer all required questions
                                </span>
                              </div>
                            )}
                          {!this.state.editTranslation && (
                            <div
                              style={{ marginLeft: "18px" }}
                              className="BtnV2 BtnV2--warning"
                              tabIndex="-1"
                              onClick={(e) => this.changeHandler("cancel")}
                            >
                              <span>Cancel</span>
                            </div>
                          )}
                          {this.state.editTranslation &&
                            this.state.clicked === "" && (
                              <div
                                className="BtnV2 BtnV2--disabled BtnV2--primary"
                                tabIndex="-1"
                                onClick={(e) => this.deleteHandler()}
                              >
                                <span>Delete Translation</span>
                              </div>
                            )}
                          {this.state.editTranslation &&
                            this.state.clicked === "" && (
                              <div
                                style={{ marginLeft: "18px" }}
                                className="BtnV2 BtnV2--primary"
                                tabIndex="-1"
                                onClick={(e) => this.updateHandler()}
                              >
                                <span>Update Translation</span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default Translations;
