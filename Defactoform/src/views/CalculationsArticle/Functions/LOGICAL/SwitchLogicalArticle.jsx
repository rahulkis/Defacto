import React from "react";

class SwitchLogicalArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "switchlogical" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>SWITCH(original_value, key_1, value_1, key_2, value_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Matches a given value to one of the provided key value pairs and
          returns that value.
          <p>The SWITCH function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "visible" }}
            >
              <table className="ResultsTable CalculationsHelp__formulaHelp table-striped">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Optional</td>
                    <td>Type</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>original_value</td>
                    <td>No</td>
                    <td>any</td>
                    <td>a value to match</td>
                  </tr>
                  <tr>
                    <td>key_n</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the key to match against</td>
                  </tr>
                  <tr>
                    <td>value_n</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to return</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <a
            href="#pa"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'SWITCH(3,1, "Mon",2, "Tues",3, "Wed",4, "Thurs",5, "Fri",6, "Sat",7,"Sun") ',
                this.state.copyFormulaName,
                '// returns "Wed"',
                "Wed"
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
              <div>
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="3p34n-0-0"
                    >
                      <div
                        data-offset-key="3p34n-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="3p34n-0-0">
                          <br data-text="true" />
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="2h8sl-0-0"
                    >
                      <div
                        data-offset-key="2h8sl-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="2h8sl-0-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="2h8sl-1-0">
                            <span data-text="true">SWITCH</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="2h8sl-2-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="2h8sl-3-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="2h8sl-4-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="2h8sl-5-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="70t58-0-0"
                    >
                      <div
                        data-offset-key="70t58-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="70t58-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="70t58-1-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="70t58-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="70t58-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="70t58-4-0">
                            <span data-text="true">"Mon"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="70t58-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="70t58-6-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="5bgeg-0-0"
                    >
                      <div
                        data-offset-key="5bgeg-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="5bgeg-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5bgeg-1-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5bgeg-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5bgeg-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="5bgeg-4-0">
                            <span data-text="true">"Tues"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5bgeg-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5bgeg-6-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="5kg1m-0-0"
                    >
                      <div
                        data-offset-key="5kg1m-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="5kg1m-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5kg1m-1-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5kg1m-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5kg1m-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="5kg1m-4-0">
                            <span data-text="true">"Wed"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5kg1m-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5kg1m-6-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="asfm-0-0"
                    >
                      <div
                        data-offset-key="asfm-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="asfm-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="asfm-1-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="asfm-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="asfm-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="asfm-4-0">
                            <span data-text="true">"Thurs"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="asfm-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="asfm-6-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="13r26-0-0"
                    >
                      <div
                        data-offset-key="13r26-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="13r26-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="13r26-1-0">
                            <span data-text="true">5</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="13r26-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="13r26-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="13r26-4-0">
                            <span data-text="true">"Fri"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="13r26-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="13r26-6-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="2fdvs-0-0"
                    >
                      <div
                        data-offset-key="2fdvs-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="2fdvs-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="2fdvs-1-0">
                            <span data-text="true">6</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="2fdvs-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="2fdvs-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="2fdvs-4-0">
                            <span data-text="true">"Sat"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="2fdvs-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="2fdvs-6-0">
                          <span data-text="true"> </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="41ls6-0-0"
                    >
                      <div
                        data-offset-key="41ls6-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="41ls6-0-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="41ls6-1-0">
                            <span data-text="true">7</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="41ls6-2-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="41ls6-3-0">
                            <span data-text="true">"Sun"</span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      data-block="true"
                      data-editor="7st20"
                      data-offset-key="3p62i-0-0"
                    >
                      <div
                        data-offset-key="3p62i-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span data-offset-key="3p62i-0-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="3p62i-1-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="3p62i-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="3p62i-3-0">
                            <span data-text="true">"// returns "Wed""</span>
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

export default SwitchLogicalArticle;
