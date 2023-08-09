import React from "react";

export default class NowArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "now" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>NOW()</h3>
        <div className="CalculationsHelp__formulaHelp">
          Get the date time for the current moment. You might use this to check
          that someone is older than the required age in a validation rule for
          example. Note that calculations are run in the browser and then again
          on the server during submission so the value of NOW() will vary. You
          need to account for this in the calculation if required.
        </div>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'dob="1986-07-22";\nage = DATEDIFF(NOW(), dob, "years");\nIF(age >= 18, "You can vote", ERROR("You are too young to vote")) ',
                this.state.copyFormulaName,
                " //returns You can vote"
              )
            }
          >
            Copy{" "}
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-7nau0"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="7nau0"
                      data-offset-key="1srv-0-0"
                    >
                      <div
                        data-offset-key="1srv-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="1srv-0-0">
                          <span data-text="true">dob</span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="1srv-1-0">
                            <span data-text="true">=</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="1srv-2-0">
                            <span data-text="true">"1986-07-22"</span>
                          </span>
                        </span>
                        <span data-offset-key="1srv-3-0">
                          <span data-text="true">;</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className=""
                      data-block="true"
                      data-editor="7nau0"
                      data-offset-key="a3ie5-0-0"
                    >
                      <div
                        data-offset-key="a3ie5-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="a3ie5-0-0">
                          <span data-text="true">age </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="a3ie5-1-0">
                            <span data-text="true">=</span>
                          </span>
                        </span>
                        <span data-offset-key="a3ie5-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="a3ie5-3-0">
                            <span data-text="true">DATEDIFF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a3ie5-4-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="a3ie5-5-0">
                            <span data-text="true">NOW</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a3ie5-6-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a3ie5-7-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a3ie5-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="a3ie5-9-0">
                          <span data-text="true"> dob</span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a3ie5-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="a3ie5-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="a3ie5-12-0">
                            <span data-text="true">"years"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a3ie5-13-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="a3ie5-14-0">
                          <span data-text="true">;</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className=""
                      data-block="true"
                      data-editor="7nau0"
                      data-offset-key="f35hu-0-0"
                    >
                      <div
                        data-offset-key="f35hu-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="f35hu-0-0">
                            <span data-text="true">IF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f35hu-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span data-offset-key="f35hu-2-0">
                          <span data-text="true">age </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="f35hu-3-0">
                            <span data-text="true">&gt;=</span>
                          </span>
                        </span>
                        <span data-offset-key="f35hu-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="f35hu-5-0">
                            <span data-text="true">18</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f35hu-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="f35hu-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="f35hu-8-0">
                            <span data-text="true">"You can vote"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f35hu-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="f35hu-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="f35hu-11-0">
                            <span data-text="true">ERROR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f35hu-12-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="f35hu-13-0">
                            <span data-text="true">
                              "You are too young to vote"
                            </span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f35hu-14-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f35hu-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="f35hu-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="f35hu-17-0">
                            <span data-text="true">
                              "// returns "You can vote""
                            </span>
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
