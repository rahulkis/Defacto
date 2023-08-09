import React from "react";
import Select from "react-select";
import { options, GDPR, moreOptions } from "../../../JsonData/GDPR";
import "../../../assets/custom/AccountSettings.css";

let array = "";

class GDPRRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      showOption: false,
      State: "",
      question: "",
    };
    this.allOptions = moreOptions;
  }
  inputHandler = (key, event) => {
    
    this.setState({ [key]: event.value });
    if (
      key === "selectedOption" &&
      (event.value === "personalData" ||
        event.value === "thirdParty" ||
        event.value === "personalInformation" ||
        event.value === "stopProcessing")
    ) {
      let moreOptions = this.allOptions.filter(
        (cur) => cur.parentId === event.value
      );
      this.setState({
        question: this.allOptions.filter((cur) => cur.parentId === event.value),
      });
      console.log(this.state.question);
      array = moreOptions[0].options.filter((cur) => event.value);
    }
  };
  render() {
    return (
      <div>
        <div className="AccountSection-div" style={{ textAlign: "center" }}>
          <h2
            className="__header-two alignment--center  paperform__page paperform__page--0"
            data-block="true"
            data-editor="paperform-editor"
            data-offset-key="bm3ud-0-0"
          >
            <div
              data-offset-key="bm3ud-0-0"
              className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
              style={{ fontWeight: "600", fontSize: "24px" }}
            >
              <span>
                <span data-text="true">
                  Send your GDPR request to Defactoform
                </span>
              </span>
            </div>
          </h2>
        </div>
        <div
          className="__unstyled paragraph alignment--center  paperform__page paperform__page--0"
          data-block="true"
          data-editor="paperform-editor"
          data-offset-key="d23si-0-0"
          style={{ textAlign: "center", marginBottom: "30px" }}
        >
          <div
            data-offset-key="d23si-0-0"
            className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
          >
            <span data-offset-key="d23si-0-0">
              <p>
                Your request will be sent to Paperform for processing, and
                you'll hear back from us soon.
              </p>
            </span>
          </div>
        </div>
        <form
          className="LiveFieldSection Paperform__QuestionBlock Paperform__QuestionBlock--5fjfi LiveFieldSection--last "
          data-offset-key="5fjfi-0-0"
          style={{
            width: "700px",
            maxWidth: "100%",
            margin: "0px auto",
            paddingBottom: "15px",
            paddingTop: "15px",
          }}
        >
          <div
            data-key="2sug5"
            className="LiveField Paperform__Question Paperform__Question--2sug5  LiveField--dropdown LiveField--multiline     LiveField--required "
          >
            <div className="LiveField__container">
              <div className="LiveField__header">
                <div style={{ position: "relative", zIndex: "1" }}>
                  <div className="DraftEditor-root">
                    <div className="DraftEditor-editorContainer">
                      <div
                        aria-describedby="placeholder-2sug5_title"
                        className="public-DraftEditor-content"
                        spellCheck="false"
                        style={{
                          outline: "none",
                          userSelect: "text",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        <div data-contents="true">
                          <div
                            className=""
                            data-block="true"
                            data-editor="2sug5_title"
                            data-offset-key="6f9ao-0-0"
                          >
                            <div
                              data-offset-key="6f9ao-0-0"
                              className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                            >
                              <span data-offset-key="6f9ao-0-0">
                                <span data-text="true">
                                  Are you a person or a company?
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
                      defaultvalue={this.state.selectedOption}
                      onChange={this.languageHandleChange}
                      options={options}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="LiveField__error">This question is required</div>
          </div>
          <div
            data-key="3a25o"
            className="LiveField Paperform__Question Paperform__Question--3a25o  LiveField--text LiveField--multiline     LiveField--required "
          >
            <div className="LiveField__container">
              <div className="LiveField__header">
                <div style={{ position: "relative", zIndex: "1" }}>
                  <div className="DraftEditor-root">
                    <div className="DraftEditor-editorContainer">
                      <div
                        aria-describedby="placeholder-3a25o_title"
                        className="public-DraftEditor-content"
                        spellCheck="false"
                        style={{
                          outline: "none",
                          userSelect: "text",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        <div data-contents="true">
                          <div
                            className=""
                            data-block="true"
                            data-editor="3a25o_title"
                            data-offset-key="d7h1j-0-0"
                          >
                            <div
                              data-offset-key="d7h1j-0-0"
                              className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                            >
                              <span data-offset-key="d7h1j-0-0">
                                <span data-text="true">
                                  What's your full name?
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
                  name="What's your full name?"
                  autoComplete="on"
                  className="LiveField__input"
                  rows="1"
                  style={{ height: "37px" }}
                  defaultValue=""
                />
              </div>
            </div>
            <div className="LiveField__error" />
          </div>
          <div
            data-key="3ps0a"
            className="LiveField Paperform__Question Paperform__Question--3ps0a  LiveField--email LiveField--multiline     LiveField--required "
          >
            <div className="LiveField__container">
              <div className="LiveField__header">
                <div style={{ position: "relative", zIndex: "1" }}>
                  <div className="DraftEditor-root">
                    <div className="DraftEditor-editorContainer">
                      <div
                        aria-describedby="placeholder-3ps0a_title"
                        className="public-DraftEditor-content"
                        spellCheck="false"
                        style={{
                          outline: "none",
                          userSelect: "text",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        <div data-contents="true">
                          <div
                            className=""
                            data-block="true"
                            data-editor="3ps0a_title"
                            data-offset-key="7t3q8-0-0"
                          >
                            <div
                              data-offset-key="7t3q8-0-0"
                              className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                            >
                              <span data-offset-key="7t3q8-0-0">
                                <span data-text="true">
                                  Email address (we don't share your email
                                  address, ever)
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
                <span>
                  <input
                    type="email"
                    placeholder=""
                    data="[object Object]"
                    name="Email address (we don't share your email address, ever)"
                    autoComplete="email"
                    className="LiveField__input"
                    defaultValue="kulwindersingh@krishnais.com"
                  />
                </span>
              </div>
            </div>
            <div className="LiveField__error" />
          </div>
          <div
            data-key="373a8"
            className="LiveField Paperform__Question Paperform__Question--373a8  LiveField--dropdown LiveField--multiline     LiveField--required "
          >
            <div className="LiveField__container">
              <div className="LiveField__header">
                <div style={{ position: "relative", zIndex: "1" }}>
                  <div className="DraftEditor-root">
                    <div className="DraftEditor-editorContainer">
                      <div
                        aria-describedby="placeholder-373a8_title"
                        className="public-DraftEditor-content"
                        spellCheck="false"
                        style={{
                          outline: "none",
                          userSelect: "text",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        <div data-contents="true">
                          <div
                            className=""
                            data-block="true"
                            data-editor="373a8_title"
                            data-offset-key="bh0nv-0-0"
                          >
                            <div
                              data-offset-key="bh0nv-0-0"
                              className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                            >
                              <span data-offset-key="bh0nv-0-0">
                                <span data-text="true">
                                  What is your GDPR related request?
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
                      defaultvalue={GDPR.find(
                        (cur) => cur.value === this.state.selectedOption
                      )}
                      onChange={(e) => this.inputHandler("selectedOption", e)}
                      options={GDPR}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="LiveField__error">This question is required</div>
          </div>
          {(this.state.selectedOption === "stopProcessing" ||
            this.state.selectedOption === "personalInformation" ||
            this.state.selectedOption === "thirdParty" ||
            this.state.selectedOption === "personalData") && (
            <div
              data-key="2sug5"
              className="LiveField Paperform__Question Paperform__Question--2sug5  LiveField--dropdown LiveField--multiline     LiveField--required "
            >
              <div className="LiveField__container">
                <div className="LiveField__header">
                  <div style={{ position: "relative", zIndex: "1" }}>
                    <div className="DraftEditor-root">
                      <div className="DraftEditor-editorContainer">
                        <div
                          aria-describedby="placeholder-2sug5_title"
                          className="public-DraftEditor-content"
                          spellCheck="false"
                          style={{
                            outline: "none",
                            userSelect: "text",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                          }}
                        >
                          <div data-contents="true">
                            <div
                              className=""
                              data-block="true"
                              data-editor="2sug5_title"
                              data-offset-key="6f9ao-0-0"
                            >
                              <div
                                data-offset-key="6f9ao-0-0"
                                className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                              >
                                <span data-offset-key="6f9ao-0-0">
                                  <span data-text="true">
                                    {/* To whom do you want us to transfer your data? */}
                                    {/* {JSON.parse(moreOptions)[label]} */}
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
                        defaultvalue={array.find(
                          (cur) => cur.value === this.state.State
                        )}
                        id="stateId"
                        onChange={(e) => this.inputHandler("State", e)}
                        options={array}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="LiveField__error">This question is required</div>
            </div>
          )}
          <div className="LiveField__container btn-raised btn-primary __checkout_btn_ref ">
            <div
              className="LiveField__answer"
              style={{
                fontSize: "large",
                textAlign: "center",
                backgroundColor: " #4d7cea",
                fontStyle: "inherit",
                color: " white",
                padding: " 9px",
              }}
            >
              <span
                // className="btn-raised btn-primary __checkout_btn_ref "
                tabIndex="0"
              >
                Submit
              </span>
            </div>
          </div>
          <div />
        </form>
      </div>
    );
  }
}

export default GDPRRequest;
