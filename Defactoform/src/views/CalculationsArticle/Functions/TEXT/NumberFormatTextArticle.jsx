import React from "react";

class NumberFormatTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "numberformattext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>
          NUMBERFORMAT(number, thousands_sep, decimal_sep, prefix, suffix){" "}
        </h3>
        <div className="CalculationsHelp__formulaHelp">
          Format a number.
          <p>The NUMBERFORMAT function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
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
                    <td>number</td>
                    <td>No</td>
                    <td>number</td>
                    <td>The number to format</td>
                  </tr>
                  <tr>
                    <td>thousands_sep</td>
                    <td>Yes</td>
                    <td>number</td>
                    <td>The thousands separator</td>
                  </tr>
                  <tr>
                    <td>decimal_sep</td>
                    <td>Yes</td>
                    <td>text</td>
                    <td>The decimal separator</td>
                  </tr>
                  <tr>
                    <td>prefix</td>
                    <td>Yes</td>
                    <td>text</td>
                    <td>Add a prefix to the number</td>
                  </tr>
                  <tr>
                    <td>suffix</td>
                    <td>Yes</td>
                    <td>text</td>
                    <td>Add a suffix to the number</td>
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
                "NUMBERFORMAT(10000.59, '.', ',', '', '$')",
                this.state.copyFormulaName,
                "// returns \"'10.000,59$'\"",
                "10.000,59$"
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
                        data-offset-key="epeco-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="epeco-0-0">
                            <span data-text="true">NUMBERFORMAT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="epeco-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="epeco-2-0">
                            <span data-text="true">10000.59</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="epeco-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="epeco-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="epeco-5-0">
                            <span data-text="true">'.'</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="epeco-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="epeco-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="epeco-8-0">
                            <span data-text="true">','</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="epeco-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="epeco-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="epeco-11-0">
                            <span data-text="true">''</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="epeco-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="epeco-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="epeco-14-0">
                            <span data-text="true">'$'</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="epeco-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="epeco-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="epeco-17-0">
                            <span data-text="true">
                              "// returns '10.000,59$'"
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

export default NumberFormatTextArticle;
