import React from "react";

class CountNumbersStatisticalArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "countnumbersstatistical" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>COUNTNUMBERS(values)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Counts the number of "number" values in an array.
          <p>The COUNTNUMBERS function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper"
              style={{ overflow: "visible" }}
            >
              <table class="ResultsTable CalculationsHelp__formulaHelp table-striped">
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
                    <td>array</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the array of values to count.</td>
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
                'COUNTNUMBERS(ARGS2ARRAY(1, 3, "pear", "5", "pear"))',
                this.state.copyFormulaName,
                "// returns 2",
                2
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
                        data-offset-key="8gjuf-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="8gjuf-0-0">
                            <span data-text="true">COUNTNUMBERS</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="8gjuf-2-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="8gjuf-4-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8gjuf-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="8gjuf-7-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8gjuf-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="8gjuf-10-0">
                            <span data-text="true">"pear"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-11-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8gjuf-12-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="8gjuf-13-0">
                            <span data-text="true">"5"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-14-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8gjuf-15-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="8gjuf-16-0">
                            <span data-text="true">"pear"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-17-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8gjuf-18-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="8gjuf-19-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="8gjuf-20-0">
                            <span data-text="true">"// returns "</span>
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

export default CountNumbersStatisticalArticle;
