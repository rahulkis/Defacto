import React from "react";

class XorLogicalArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "xorlogical" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>XOR(value_1, value_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns true if only one of the values is true.
          <p>The XOR function accepts these arguments:</p>
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
                    <td>value_n</td>
                    <td>No</td>
                    <td>boolean</td>
                    <td>a number of boolean values to test</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <a
            href="##pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "XOR(true, false, false, false)",
                this.state.copyFormulaName,
                "// returns true ",
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
                      data-editor="av8fg"
                      data-offset-key="1kku9-0-0"
                    >
                      <div
                        data-offset-key="8l2ap-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="8l2ap-0-0">
                            <span data-text="true">XOR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-2-0">
                            <span data-text="true">true</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-5-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-8-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-11-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-12-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="8l2ap-14-0">
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
                "XOR(true, false, false, true)",
                this.state.copyFormulaName,
                "// returns false ",
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
                      data-editor="av8fg"
                      data-offset-key="1kku9-0-0"
                    >
                      <div
                        data-offset-key="8l2ap-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="8l2ap-0-0">
                            <span data-text="true">XOR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-2-0">
                            <span data-text="true">true</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-5-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-8-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="8l2ap-11-0">
                            <span data-text="true">true</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l2ap-12-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="8l2ap-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="8l2ap-14-0">
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
      </div>
    );
  }
}

export default XorLogicalArticle;
