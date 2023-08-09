import React from "react";

class OrLogicalArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "orlogical" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>OR(value_1, value_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns true if any of the values are true.
          <p>The OR function accepts these arguments:</p>
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
                    <td>a boolean value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "OR( true, 1 == 0 )",
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
                        data-offset-key="591p6-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span class="prism-token token constant">
                          <span data-offset-key="591p6-0-0">
                            <span data-text="true">OR</span>
                          </span>
                        </span>
                        <span class="prism-token token punctuation">
                          <span data-offset-key="591p6-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span class="prism-token token boolean">
                          <span data-offset-key="591p6-2-0">
                            <span data-text="true">true</span>
                          </span>
                        </span>
                        <span class="prism-token token punctuation">
                          <span data-offset-key="591p6-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="591p6-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token number">
                          <span data-offset-key="591p6-5-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span data-offset-key="591p6-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token operator">
                          <span data-offset-key="591p6-7-0">
                            <span data-text="true">&lt;</span>
                          </span>
                        </span>
                        <span data-offset-key="591p6-8-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token number">
                          <span data-offset-key="591p6-9-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span class="prism-token token punctuation">
                          <span data-offset-key="591p6-10-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="591p6-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token comment">
                          <span data-offset-key="591p6-12-0">
                            <span data-text="true" />
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
                "OR( false, 1 == 0 )",
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
                        data-offset-key="bm14k-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="bm14k-0-0">
                            <span data-text="true">OR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bm14k-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="bm14k-2-0">
                            <span data-text="true">false</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bm14k-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="bm14k-5-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="bm14k-7-0">
                            <span data-text="true">==</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-8-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="bm14k-9-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bm14k-10-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="bm14k-12-0">
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

export default OrLogicalArticle;
