import React from "react";

class VariablesArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "answerpiping" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>Variables </h3>
        <p>
          DefactoForm expressions come with basic support for variables.
          Variables allow you to write an expression and save it to a variable,
          and then use it later in the same calculation. Expressions are
          separated using semi-colons ";", and the final expression in a
          calculation can't be assigning a variable (because it doesn't return
          any value).
        </p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "x = 2 * 6 / 3;\nx * 4;",
                this.state.copyFormulaName,
                "// returns 16 as the answer to the calculation.",
                16
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
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="f08h1"
                      data-offset-key="2bp5d-0-0"
                    >
                      <div
                        data-offset-key="2bp5d-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="2bp5d-0-0">
                          <span data-text="true">x </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="2bp5d-1-0">
                            <span data-text="true">=</span>
                          </span>
                        </span>
                        <span data-offset-key="2bp5d-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="2bp5d-3-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span data-offset-key="2bp5d-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="2bp5d-5-0">
                            <span data-text="true">*</span>
                          </span>
                        </span>
                        <span data-offset-key="2bp5d-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="2bp5d-7-0">
                            <span data-text="true">6</span>
                          </span>
                        </span>
                        <span data-offset-key="2bp5d-8-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="2bp5d-9-0">
                            <span data-text="true">/</span>
                          </span>
                        </span>
                        <span data-offset-key="2bp5d-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="2bp5d-11-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span data-offset-key="2bp5d-12-0">
                          <span data-text="true">; </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="2bp5d-13-0">
                            <span data-text="true">
                              "// set's the variable x to the result 2 * 6 / 3,
                              which is 4."
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className=""
                      data-block="true"
                      data-editor="f08h1"
                      data-offset-key="8vcs8-0-0"
                    >
                      <div
                        data-offset-key="8vcs8-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="8vcs8-0-0">
                          <span data-text="true">x </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="8vcs8-1-0">
                            <span data-text="true">*</span>
                          </span>
                        </span>
                        <span data-offset-key="8vcs8-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="8vcs8-3-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span data-offset-key="8vcs8-4-0">
                          <span data-text="true">; </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="8vcs8-5-0">
                            <span data-text="true">
                              "// returns 16 as the answer to the calculation"
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className=""
                      data-block="true"
                      data-editor="f08h1"
                      data-offset-key="fcfl4-0-0"
                    >
                      <div
                        data-offset-key="fcfl4-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="fcfl4-0-0">
                          <span data-text="true"> </span>
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
                'firstName = "Dean";\nlastName = "McPherson";\nformat("Hey {} {} ! Nice to meet you.", firstName, lastName);',
                this.state.copyFormulaName,
                "//.",
                "Hey  Dean  McPherson ! Nice to meet you."
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
            <div class="DraftEditor-root">
              <div class="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="b6saq"
                      data-offset-key="b3c01-0-0"
                    >
                      <div
                        data-offset-key="b3c01-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="b3c01-0-0">
                          <span data-text="true">firstName </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="b3c01-1-0">
                            <span data-text="true">=</span>
                          </span>
                        </span>
                        <span data-offset-key="b3c01-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="b3c01-3-0">
                            <span data-text="true">"Dean"</span>
                          </span>
                        </span>
                        <span data-offset-key="b3c01-4-0">
                          <span data-text="true">;</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className=""
                      data-block="true"
                      data-editor="b6saq"
                      data-offset-key="1sm8g-0-0"
                    >
                      <div
                        data-offset-key="1sm8g-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="1sm8g-0-0">
                          <span data-text="true">lastName </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="1sm8g-1-0">
                            <span data-text="true">=</span>
                          </span>
                        </span>
                        <span data-offset-key="1sm8g-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="1sm8g-3-0">
                            <span data-text="true">"McPherson"</span>
                          </span>
                        </span>
                        <span data-offset-key="1sm8g-4-0">
                          <span data-text="true">;</span>
                        </span>
                      </div>
                    </div>
                    <div
                      class=""
                      data-block="true"
                      data-editor="b6saq"
                      data-offset-key="254rr-0-0"
                    >
                      <div
                        data-offset-key="254rr-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token function">
                          <span data-offset-key="254rr-0-0">
                            <span data-text="true">format</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="254rr-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="254rr-2-0">
                            <span data-text="true">
                              "Hey {"{} {}"} ! Nice to meet you."
                            </span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="254rr-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="254rr-4-0">
                          <span data-text="true"> firstName</span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="254rr-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="254rr-6-0">
                          <span data-text="true"> lastName</span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="254rr-7-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="254rr-8-0">
                          <span data-text="true">;</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className=""
                      data-block="true"
                      data-editor="b6saq"
                      data-offset-key="firk5-0-0"
                    >
                      <div
                        data-offset-key="firk5-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="firk5-0-0">
                          <span data-text="true"> </span>
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

export default VariablesArticle;
