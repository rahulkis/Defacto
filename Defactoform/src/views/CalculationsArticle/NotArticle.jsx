import React from "react";

class NotArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "not" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>not </h3>
        <p>
          The `not` operator returns the negation of the following value. Note
          that this is similar to the `NOT()` function, except that it only
          negates the following value, where as the `NOT()` function can
          evaluate multiple arguments.
        </p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "not 2",
                this.state.copyFormulaName,
                "// return false",
                false
              )
            }
          >
            Copy
            <i className="fa fa-clone" />
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="4968o"
                      data-offset-key="1nhrd-0-0"
                    >
                      <div
                        data-offset-key="1nhrd-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-0-0">
                            <span data-text="true">not</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="1nhrd-4-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="1nhrd-6-0">
                            <span data-text="true">"// return false"</span>
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
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "not true",
                this.state.copyFormulaName,
                "// returns false",
                "false"
              )
            }
          >
            Copy
            <i className="fa fa-clone" />
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="4968o"
                      data-offset-key="1nhrd-0-0"
                    >
                      <div
                        data-offset-key="1nhrd-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-0-0">
                            <span data-text="true">not</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-4-0">
                            <span data-text="true">true</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="1nhrd-6-0">
                            <span data-text="true">"// returns false"</span>
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
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "not false",
                this.state.copyFormulaName,
                "// returns true",
                "true"
              )
            }
          >
            Copy
            <i className="fa fa-clone" />
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="4968o"
                      data-offset-key="1nhrd-0-0"
                    >
                      <div
                        data-offset-key="1nhrd-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-0-0">
                            <span data-text="true">not </span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-4-0">
                            <span data-text="true">false </span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="1nhrd-6-0">
                            <span data-text="true">"// returns true"</span>
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
      </div>
    );
  }
}

export default NotArticle;
