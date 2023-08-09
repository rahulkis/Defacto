import React from "react";

class AndArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "and" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>and </h3>
        <p>
          The `and` operator returns true if the value before and after it are
          true. Note that this is similar to the `AND()` function, except that
          it only evaluates the values on either side of it, where as the
          `AND()` function can evaluate multiple arguments.
        </p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "1 and 2",
                this.state.copyFormulaName,
                "// return true",
                true
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
                      data-block="true"
                      data-editor="4s074"
                      data-offset-key="5pg5p-0-0"
                    >
                      <div
                        data-offset-key="5pg5p-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token number">
                          <span data-offset-key="5pg5p-0-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span data-offset-key="5pg5p-1-0">
                          <span data-text="true"> and </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5pg5p-2-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span data-offset-key="5pg5p-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="5pg5p-4-0">
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
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "false and true",
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
                      data-block="true"
                      data-editor="4s074"
                      data-offset-key="5pg5p-0-0"
                    >
                      <div
                        data-offset-key="5pg5p-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token number">
                          <span data-offset-key="5pg5p-0-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span data-offset-key="5pg5p-1-0">
                          <span data-text="true"> and </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5pg5p-2-0">
                            <span data-text="true">true</span>
                          </span>
                        </span>
                        <span data-offset-key="5pg5p-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="5pg5p-4-0">
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
            href="#false"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                '"popcorn" and "tadaa"',
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
                      data-block="true"
                      data-editor="4s074"
                      data-offset-key="5pg5p-0-0"
                    >
                      <div
                        data-offset-key="5pg5p-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token string">
                          <span data-offset-key="5pg5p-0-0">
                            <span data-text="true">"popcorn"</span>
                          </span>
                        </span>
                        <span data-offset-key="5pg5p-1-0">
                          <span data-text="true"> and </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="5pg5p-2-0">
                            <span data-text="true">"tadaa"</span>
                          </span>
                        </span>
                        <span data-offset-key="5pg5p-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="5pg5p-4-0">
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

export default AndArticle;
