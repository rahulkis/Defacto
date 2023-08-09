import React from "react";
import Select from "react-select";
import { languageOptions, fontOptions } from "../../LanguageOption/data";
import { DraftJS } from "megadraft";
import { Delete, GetData, PostData } from "../../../stores/requests";
import { THEME_URLS } from "../../../util/constants";
import "../../../assets/custom/AccountSettings.css";

class TranslationsAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translationList: [],
      arrayOfObjects: [
        {
          input: "",
          rtl: false,
          selectedLanguage: "",
          selectedFont: "",
        },
      ],
      isEditCase: false,
      translationCount: "1",
      updateId: "",
      selectedAccount: "",
      IsSelectedEditCase: "",
    };
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
    }
  }
  componentWillMount() {
    this.getTranslationList();
  }
  getTranslationList = () => {
    let self = this;
    GetData(THEME_URLS.GET_TRANSLATION_INFO + localStorage.CurrentFormId).then(
      (result) => {
        if (result.data.Items.length > 0) {
          self.setState({
            translationList: result.data.Items,
            translationCount: result.data.Items.length + 1,
          });

          const selectedItem = result.data.Items.find(
            (tr) => tr.IsSelectedAccount === true
          );
          if (selectedItem) {
            self.setState({
              selectedAccount: selectedItem.TranslationId,
            });
          } else {
            self.setState({ selectedAccount: "default" });
          }
        } else {
          self.setState({ selectedAccount: "default" });
        }
      }
    );
  };
  translationHandler = (option) => {
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
        showAddTranslation: true,
        isEditCase: false,
        arrayOfObjects: newObject,
      });
    }
    if (option === "Cancel") {
      this.setState({ showAddTranslation: false });
    }
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
  languageHandleChange = (selectedLanguage) => {
    this.method("selectedLanguage", selectedLanguage);
  };
  fontHandleChange = (selectedFont) => {
    this.method("selectedFont", selectedFont);
  };
  handleChange = (option) => {
    this.method("rtl", option);
  };

  inputHandler = (event) => {
    this.method(event.target.name, event.target.value);
  };
  handleCreateTranslation(e) {
    let formModel = {
      TranslationId: DraftJS.genKey(),
      FormId: localStorage.CurrentFormId,
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      TranslationInfo: JSON.stringify(this.state.arrayOfObjects[0]),
      TranslationName: this.state.arrayOfObjects[0].input,
      IsSelected: false,
      TranslationLanguage: JSON.stringify(
        this.state.arrayOfObjects[0].selectedLanguage
      ),
      IsSelectedAccount: false,
    };
    if (
      this.state.arrayOfObjects[0].input !== "" &&
      this.state.arrayOfObjects[0].selectedLanguage !== ""
    ) {
      try {
        PostData(THEME_URLS.POST_TRANSLATION_INFO, formModel).then((result) => {
          if (result.statusCode === 200) {
            alert(
              "Successfully added translation,you can now enable it on your forms"
            );
            this.setState({ showAddTranslation: false });
            this.getTranslationList();
          }
        });
      } catch (err) {
        alert("Something went wrong, please try again.");
      }
    } else {
      alert("please answer all required questions");
    }
  }
  editTranslationHandler = (Id) => {
    this.setState({ updateId: Id });
    const newObject = [
      {
        input: "",
        rtl: false,
        selectedLanguage: "",
        selectedFont: "",
      },
    ];
    this.setState({
      arrayOfObjects: newObject,
    });
    GetData(THEME_URLS.GET_TRANSLATION_EDIT_LIST + Id).then((result) => {
      if (result != null) {
        this.setState({ showAddTranslation: true, isEditCase: true });

        if (result.data.Count > 0) {
          this.setState({
            IsSelectedEditCase: result.data.Items[0].IsSelectedAccount,
          });
          let resultItems = result.data.Items[0].TranslationInfo;
          resultItems = JSON.parse(resultItems);
          const newData = [{ ...newObject, ...resultItems }];
          this.setState({
            arrayOfObjects: newData,
          });
          // store.dispatch(fetchTranslationInfo(result.data.Items[0]));
        }
      }
    });
  };
  updateHandler = (e) => {
    let selectedFromThemeTranslation = false;
    if (this.state.translationList !== "") {
      this.state.translationList.map((item) => {
        if (
          this.state.updateId === item.TranslationId &&
          item.IsSelected === true
        ) {
          selectedFromThemeTranslation = true;
        } else if (
          this.state.updateId === !item.TranslationId &&
          item.IsSelected === true
        ) {
          selectedFromThemeTranslation = true;
        }
        return item.IsSelected;
      });
    }
    let formModel = {
      TranslationId: this.state.updateId,
      FormId: localStorage.CurrentFormId,
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      TranslationInfo: JSON.stringify(this.state.arrayOfObjects[0]),
      TranslationName: this.state.arrayOfObjects[0].input,
      TranslationLanguage: JSON.stringify(
        this.state.arrayOfObjects[0].selectedLanguage
      ),
      IsSelectedAccount: this.state.IsSelectedEditCase,
      IsSelected: selectedFromThemeTranslation,
    };
    if (
      this.state.arrayOfObjects[0].input !== "" &&
      this.state.arrayOfObjects[0].selectedLanguage !== ""
    ) {
      try {
        PostData(THEME_URLS.POST_TRANSLATION_INFO, formModel).then((result) => {
          if (result.statusCode === 200) {
            this.setState({ showAddTranslation: false });
            this.getTranslationList();
          }
        });
      } catch (err) {
        alert("Something went wrong, please try again.");
      }
    } else {
      alert("please answer all required questions");
    }
  };
  deleteTranslationHandler = (Id) => {
    alert("are you sure you want to remove this translaion?");
    Delete(THEME_URLS.DELETE_TRANSLATION + Id).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          alert("Translation deleted successfuly ");
        } else {
          window.alert("There is an error in deleting the form.");
        }
        this.getTranslationList();
      }
    });
  };
  makeDefaultHandler = (Id) => {
    let formModel = {
      TranslationId: Id,
      IsSelectedAccount: true,
      PreviousTranslationId: this.state.selectedAccount,
    };

    try {
      PostData(
        THEME_URLS.ACCOUNT_DETAILS_MAKE_DEFAULT_TRANSLATION,
        formModel
      ).then((result) => {
        if (result.statusCode === 200) {
          // alert("updated Successfully");
          this.getTranslationList();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    const tableDataDesign = {
      width: "50%",
      display: "inline-block",
      whiteSpace: "normal",
    };
    const self = this;
    return (
      <div>
        {!this.state.showAddTranslation && (
          <div>
            {this.state.translationCount <= "1" && (
              <h2 className="AccountSection-div">
                Account Translations
                <small style={{ marginLeft: "10px" }}>
                  ({this.state.translationCount} translation)
                </small>
              </h2>
            )}
            {this.state.translationCount > "1" && (
              <h2 className="AccountSection-div">
                Account Translations
                <small style={{ marginLeft: "10px" }}>
                  ({this.state.translationCount} translations)
                </small>
              </h2>
            )}
            <div
              className="BtnV2 BtnV2--raised BtnV2--secondary"
              tabIndex="-1"
              onClick={(e) => this.translationHandler("addTranslation")}
            >
              <span>Add Translation</span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                className="ResultsTable__wrapper "
                style={{ overflow: "visible" }}
              >
                <table className="ResultsTable ">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Language</th>
                      <th style={{ width: "100px" }}>Default</th>
                      <th style={{ width: "100px" }}>Edit</th>
                      <th style={{ width: "100px" }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>English (Defactoform)</td>
                      <td>English</td>
                      {this.state.selectedAccount === "default" && (
                        <td>Default</td>
                      )}
                      {this.state.selectedAccount !== "default" && (
                        <td className="ResultsTable__delete">
                          {" "}
                          <div
                            className="BtnV2 BtnV2--raised BtnV2--primary"
                            tabIndex="-1"
                            onClick={(e) => this.makeDefaultHandler("default")}
                          >
                            <span>Make default</span>
                          </div>
                        </td>
                      )}
                      <td className="ResultsTable__delete" />
                      <td className="ResultsTable__delete" />
                    </tr>
                  </tbody>
                  {self.state.translationList.length > 0 && (
                    <tbody>
                      {self.state.translationList.map((item, t) => (
                        <tr>
                          <td>{item.TranslationName}</td>
                          <td>
                            {JSON.parse(item.TranslationLanguage)["label"]}
                          </td>
                          {item.IsSelectedAccount === false && (
                            <td className="ResultsTable__delete">
                              <div
                                className="BtnV2 BtnV2--raised BtnV2--primary"
                                tabIndex="-1"
                                onClick={(e) =>
                                  this.makeDefaultHandler(item.TranslationId)
                                }
                              >
                                <span>Make default</span>
                              </div>
                            </td>
                          )}
                          {item.IsSelectedAccount === true && <td>Default</td>}
                          <td className="ResultsTable__delete">
                            <div
                              className="BtnV2 BtnV2--raised BtnV2--secondary"
                              tabIndex="-1"
                              onClick={(e) =>
                                this.editTranslationHandler(item.TranslationId)
                              }
                            >
                              <span>
                                <i className="fa fa-edit" />
                              </span>
                            </div>
                          </td>
                          <td className="ResultsTable__delete">
                            <div
                              className="BtnV2 BtnV2--raised BtnV2--warning"
                              tabIndex="-1"
                              onClick={(e) =>
                                this.deleteTranslationHandler(
                                  item.TranslationId
                                )
                              }
                            >
                              <span>
                                <i className="fa fa-times" />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
        {this.state.showAddTranslation && (
          <div
            padded="0"
            className="Paper Paper--double-padded"
            style={{ overflowY: "scroll", height: "90vh" }}
          >
            <div>
              <div style={{ maxWidth: "700px" }}>
                {!this.state.isEditCase && (
                  <h2
                    className="AccountSection-div"
                    style={{ marginBottom: "18px" }}
                  >
                    Add Translation
                  </h2>
                )}
                {this.state.isEditCase && (
                  <h2
                    className="AccountSection-div"
                    style={{ marginBottom: "18px" }}
                  >
                    Edit Translation
                  </h2>
                )}
                <p style={{ marginBottom: "2em" }}>
                  Adding your own translation is easy, below we have the current
                  English translation, just write whatever you'd like in the
                  input next to the default. If you leave any blank, we'll will
                  just use the default.
                </p>
                <div className="LiveField Paperform__Question Paperform__Question--title  LiveField--text LiveField--multiline     LiveField--required ">
                  <div className="LiveField__container">
                    <div className="LiveField__header">
                      <div style={{ position: "relative", zIndex: "1" }}>
                        <div className="DraftEditor-root">
                          <div className="DraftEditor-editorContainer">
                            <div
                              aria-describedby="placeholder-title_title"
                              className="public-DraftEditor-content"
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
                                        Translation Title*
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
                        name="Translation Title*"
                        autoComplete="on"
                        className="LiveField__input"
                        onChange={this.titleHandler}
                        defaultValue={this.state.arrayOfObjects[0].input}
                      />
                    </div>
                  </div>
                  <div className="LiveField__error">
                    This question is required
                  </div>
                </div>
                <div className="LiveField Paperform__Question Paperform__Question--title  LiveField--text LiveField--multiline     LiveField--required ">
                  <div className="LiveField__container">
                    <div className="LiveField__header">
                      <div style={{ position: "relative", zIndex: "1" }}>
                        <div className="DraftEditor-root">
                          <div className="DraftEditor-editorContainer">
                            <div
                              aria-describedby="placeholder-title_title"
                              className="public-DraftEditor-content"
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
                                        Translation Language*
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
                              this.state.arrayOfObjects[0].selectedLanguage
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
                <div className="LiveField Paperform__Question Paperform__Question--rtl  LiveField--yesNoEnglish LiveField--multiline     LiveField--required ">
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
                                        Enable if the language is written right
                                        to left
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
                                      <span data-text="true">Font subsets</span>
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
                                        Choose from the following character
                                        subsets if your language requires them
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
                            value={this.state.arrayOfObjects[0].selectedFont}
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
                <div style={{ position: "relative" }}>
                  <div
                    className="ResultsTable__wrapper "
                    style={{ overflow: "visible" }}
                  />
                  <table className="ResultsTable ">
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            display: "inline-block",
                            fontWeight: "600",
                            backgroundColor: "white",
                          }}
                        >
                          Default Translation
                        </td>
                        <td
                          style={{
                            width: "50%",
                            display: "inline-block",
                            fontWeight: "600",
                            backgroundColor: "white",
                          }}
                        >
                          Custom Translation
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Submitting...</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Submitting"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Submitting
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Submit Another</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Submitanother"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Submitanother
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Submissions are closed</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Submissionsareclosed"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Submissionsareclosed
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>SOLD OUT</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="SOLDOUT"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].SOLDOUT}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Something went wrong while trying to submit.Please try
                          again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Somethingwentwrong"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Somethingwentwrong
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please fill out all of the questions correctly.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Pleasefillout"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Pleasefillout
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Continue</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Continue"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Continue}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Cancel</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Cancel"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Cancel}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Or</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Or"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Or}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Credit Card</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CreditCard"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].CreditCard
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Checkout</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Checkout"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Checkout}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>More...</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="More"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].More}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Choose Payment Method</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ChoosePaymentMethod"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].ChoosePaymentMethod
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Name</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Name"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Name}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Email Address</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="EmailAddress"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].EmailAddress
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Too many failed payment attempts. Please try again
                          later.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="failedPaymentAttempts"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].failedPaymentAttempts
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Back</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Back"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Back}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Name on card</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Nameoncard"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Nameoncard
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Receipt email</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Receiptemail"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Receiptemail
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Credit Card</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Creditcard"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Creditcard
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Card Number</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CardNumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].CardNumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>CVC</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CVC"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].CVC}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Tax</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Tax"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Tax}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Total</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Total"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Total}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Processing Fee.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ProcessingFee"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].ProcessingFee
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Calculated Pricing.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CalculatedPricing"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].CalculatedPricing
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          You are authorizing this charge to be processed in the
                          future.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Youare"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Youare}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          A small verification charge may appear on your credit
                          card statement,you will not be charged this value.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Asmall"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Asmall}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>You will be charged.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="charged"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].charged}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          You are authorizing a charge of
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Youareauthorizing"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Youareauthorizing
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          You will be subscribed to:
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Youwillbe"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Youwillbe
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Plus X tax.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PlusXtax"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].PlusXtax}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Inc X processing fee.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="IncXprocessingfee"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].IncXprocessingfee
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Continue in Square POS app.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ContinueinSquarePOSapp"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .ContinueinSquarePOSapp
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Alipay</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Alipay"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Alipay}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Bancontact</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Bancontact"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Bancontact
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>EPS</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="EPS"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].EPS}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Giropay</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Giropay"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Giropay}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>iDEAL</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="iDEAL"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].iDEAL}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Przelewy24</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Przelewy24"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Przelewy24
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>WeChat Pay</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="WeChatPay"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].WeChatPay
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Day</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Day"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Day}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Month</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Month"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Month}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Year</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Year"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Year}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Days</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Days"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Days}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Months</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Months"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Months}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Years</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Years"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Years}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Hours</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Hours"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Hours}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Minutes</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Minutes"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Minutes}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>am/pm</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ampm"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].ampm}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>HH</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="HH"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].HH}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>MM</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="MM"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].MM}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Yes</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Yes"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Yes}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>No</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="No"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].No}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Other</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Other"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Other}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>unit</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="unit"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].unit}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>units</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="units"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].units}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>pick start time</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="pickstarttime"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].pickstarttime
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>pick end time</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="pickendtime"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].pickendtime
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Search for address.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Searchforaddress"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Searchforaddress
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          No address found,add manually
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="addmanually"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].addmanually
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Pick a color</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Pickacolor"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Pickacolor
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Apartment/Unit</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ApartmentUnit"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].ApartmentUnit
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Street Number</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="StreetNumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].StreetNumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Street</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Street"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Street}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>City/Suburb</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CitySuburb"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].CitySuburb
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>State</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="State"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].State}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>City</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="City"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].City}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Zip/Post Code</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ZipPostCode"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].ZipPostCode
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Country</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Country"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Country}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Latitude</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Latitude"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Latitude}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Longitude</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Longitude"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Longitude
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Address line 1</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="addressline1"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].addressline1
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Address line 2</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Addressline2"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Addressline2
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Choose a file</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Chooseafile"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Chooseafile
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Uploading X</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="UploadingX"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].UploadingX
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Confirm signature</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Confirmsignature"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Confirmsignature
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Specify other...</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="SpecifyOther"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].SpecifyOther
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          This question in required
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="questionrequired"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].questionrequired
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid email
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PleaseEnterAValidEmail"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .PleaseEnterAValidEmail
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Confirm email address</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Confirmemail"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Confirmemail
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Email addresses don't match
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="EmailAddressesNotMatch"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .EmailAddressesNotMatch
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          "X" is not an allowed file type
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Xnotallowed"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Xnotallowed
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>File is still uploading</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="stillUploading"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].stillUploading
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid URL
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="validURL"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].validURL}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Signature still uploading
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="SignatureStillUploading"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .SignatureStillUploading
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          The maximum number of files have been added
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="maximumfilesadded"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].maximumfilesadded
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Too many files,the maximum is X
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="maximumisX"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].maximumisX
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please upload atleast X files
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="atleastXfiles"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].atleastXfiles
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Sign here</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Signhere"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Signhere}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please choose an answer</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PleaseChooseAnAnswer"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].PleaseChooseAnAnswer
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please enter a number</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="enterAnumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].enterAnumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Too long</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Toolong"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Toolong}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Too short</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Tooshort"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Tooshort}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid hex color
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="hexColor"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].hexColor}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a number greater than or equal to X
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="greaterThanX"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].greaterThanX
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a number greater than or equal to X
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="lessThanX"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].lessThanX
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a whole number
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="WholeNumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].WholeNumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid price
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="validPrice"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].validPrice
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid date
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="validDate"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].validDate
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please choose a year</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="chooseAyear"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].chooseAyear
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please choose a month</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="chooseAmonth"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].chooseAmonth
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please choose a day</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="chooseAday"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].chooseAday
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please choose a day in the future
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="dayfuture"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].dayfuture
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please choose a day in the past
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="daypast"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].daypast}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid time
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="validTime"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].validTime
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please enter a valid phone number
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="validPhonenumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].validPhonenumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Can only choose only X or less options
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="lessOptions"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].lessOptions
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Choose X or more options
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="moreOptions"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].moreOptions
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please specify other</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PleaseSpecifyOther"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].PleaseSpecifyOther
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Not a valid credit card number
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="NotValidCardNumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].NotValidCardNumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please finish the form</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="finishform"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].finishform
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please fill out all of the fields correctly
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="fillFieldsCorrectly"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].fillFieldsCorrectly
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please answer all required questions
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="requiredQuestions"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].requiredQuestions
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Something went wrong while trying to submit.Please try
                          again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PleaseTryAgain"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].PleaseTryAgain
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>1 question to go</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="question1"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].question1
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>X questions to go</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Xquestions"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Xquestions
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Submitted At</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="SubmittedAt"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].SubmittedAt
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Item</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Item"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Item}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Total Amount</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="TotalAmount"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].TotalAmount
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Quantity</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Quantity"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Quantity}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Price</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Pricex"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Pricex}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Total</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Totalx"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Totalx}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Submission ID</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="SubmissionID"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].SubmissionID
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Subscription ID</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="SubscriptionID"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].SubscriptionID
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Plan</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Plan"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Plan}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Interval</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Interval"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Interval}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Amount</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Amount"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Amount}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Score</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Score"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Score}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Paying with {"{{paymentSource}}"}
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Payingwith"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Payingwith
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Choose another way to pay
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="anotherwaytopay"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].anotherwaytopay
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Choose a way to pay</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="awaytopay"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].awaytopay
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Other ways to pay</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Otherwaystopay"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Otherwaystopay
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Browser not supported.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Browsernotsupported"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Browsernotsupported
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Please out a CVV.</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PleaseCVV"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].PleaseCVV
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please fill out an expireation date.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="expirationDate"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].expirationDate
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please fill out a cardholder name.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="cardholdeName"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].cardholdeName
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please fill out a card number.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="cardnumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].cardnumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please fill out a postal code.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="postalcode"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].postalcode
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          This security code is not valid.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="securitycodenotvalid"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].securitycodenotvalid
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          This expiration date is not valid
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="expirationdatenotvalid"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .expirationdatenotvalid
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          This card number is not valid.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="cardnumbernotvalid"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].cardnumbernotvalid
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          This postal code is not valid.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="postalcodenotvalid"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].postalcodenotvalid
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Something went wrong on our end.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Somethingwrongonend"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Somethingwrongonend
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please check your information and try again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="checkyourInformation"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].checkyourInformation
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Credit card verification failed.Please check your
                          information and try again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Creditcardverificationfailed"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .Creditcardverificationfailed
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Network error.Please try again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Networkerror"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Networkerror
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Please check your information and try again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Pleasecheck"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Pleasecheck
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Something went wrong adding the PayPal account.Please
                          try again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="wrongaddingPayPalaccount"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .wrongaddingPayPalaccount
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Something went wrong connecting to PayPal.Please try
                          again.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="wrongConnectingtoPayPal"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .wrongConnectingtoPayPal
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          PayPal payment authorization is already in progress.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="authorizationinprogress"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0]
                                .authorizationinprogress
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          This card type is not supported.Please try another
                          card.
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="cardnotsupported"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].cardnotsupported
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>cardholder Name</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CarholderName"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].CarholderName
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}> Card Number </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CarNumber"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].CarNumber
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>CVV</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="cvv"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].cvv}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}> {"(3 digits)"}</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="digits"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].digits}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}> {"(4 digits)"}</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="digit"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].digit}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Expiration Date</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ExpirationDate"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].ExpirationDate
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>(MM/YY)</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="MMYY"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].MMYY}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Cardholder Name</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="CardName"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].CardName}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>MM/YY</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="MMY"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].MMY}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Postal Code</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Postalode"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Postalode
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Pay with card</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Paywithcard"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Paywithcard
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          Ending in {"{{lastFourCardDigits}}"}
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Endingin"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Endingin}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Card</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Ca"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Ca}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>PayPal</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Paypal"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Paypal}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>PayPal Credit</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="PayPalCredit"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].PayPalCredit
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>American Express</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="AmericanExpress"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].AmericanExpress
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Discover</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Discover"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Discover}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Diners Club</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="DinersClub"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].DinersClub
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>MasterCard</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="MasterCard"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].MasterCard
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Visa</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Visa"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Visa}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>JCB</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="JCB"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].JCB}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Maestro</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Maestro"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Maestro}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Union Pay</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="UnionPay"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].UnionPay}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Coupon</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Coupon"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Coupon}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Enter Coupon</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="EnterCoupon"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].EnterCoupon
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Apply Coupon</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="ApplyCoupon"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].ApplyCoupon
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Applying</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Applying"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Applying}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>forever</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="forever"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].forever}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>once</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="once"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].once}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>for 1 month</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="for1month"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].for1month
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>for X months</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="forXmonths"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].forXmonths
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>discount</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="discount"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].discount}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>off</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="off"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].off}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>applied to</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="appliedto"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].appliedto
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Start Date</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="StartDate"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].StartDate
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>End Date</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="EndDate"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].EndDate}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Start Time</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="StartTime"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].StartTime
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Stop Time</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="StopTime"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].StopTime}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Invitee Emails</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="InviteeEmails"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].InviteeEmails
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Timezone</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Timezone"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Timezone}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Description</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Description"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].Description
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Location</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Location"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Location}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Title</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Title"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Title}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>Search...</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="Search"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].Search}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>_</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="underScore"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].underScore
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>I Agree</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="IAgree"
                            onChange={this.inputHandler}
                            defaultValue={this.state.arrayOfObjects[0].IAgree}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>I Disagree</td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="IDisagree"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].IDisagree
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          You must select atleast X
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="selectleastX"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].selectleastX
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={tableDataDesign}>
                          You must select at no more than X
                        </td>
                        <td style={tableDataDesign}>
                          <input
                            className="ResultsTable__input"
                            name="nomorethanX"
                            onChange={this.inputHandler}
                            defaultValue={
                              this.state.arrayOfObjects[0].nomorethanX
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <br />
              {!this.state.isEditCase && (
                <div
                  className="BtnV2 BtnV2--raised BtnV2--secondary"
                  tabIndex="-1"
                  style={{ marginRight: "10px" }}
                  onClick={(e) => this.handleCreateTranslation()}
                >
                  <span>Create Translation</span>
                </div>
              )}
              {this.state.isEditCase && (
                <div
                  className="BtnV2 BtnV2--raised BtnV2--secondary"
                  tabIndex="-1"
                  style={{ marginRight: "10px" }}
                  onClick={(e) => this.updateHandler()}
                >
                  <span>Update Translation</span>
                </div>
              )}
              <div
                className="BtnV2 BtnV2--raised BtnV2--secondary"
                tabIndex="-1"
                onClick={(e) => this.translationHandler("Cancel")}
              >
                <span>Cancel</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TranslationsAccount;
