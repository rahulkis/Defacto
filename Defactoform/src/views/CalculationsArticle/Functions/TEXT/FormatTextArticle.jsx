import React from "react";

class FormatTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "formattext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>FORMAT(template, arg_1, arg_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Extracts arguments from text template.
          <p>The FORMAT function accepts these arguments:</p>
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
                    <td>arg_n</td>
                    <td>No</td>
                    <td>number</td>
                    <td>one or more values of any type</td>
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
                'FORMAT("Hi {}, {}", "there!", "You")',
                this.state.copyFormulaName,
                '// returns "Hi there! You"',
                '"Hi there! You"'
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
                        data-offset-key="l8dg-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="l8dg-0-0">
                            <span data-text="true">FORMAT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="l8dg-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="l8dg-2-0">
                            <span data-text="true">
                              "Hi {}, {}"
                            </span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="l8dg-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="l8dg-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="l8dg-5-0">
                            <span data-text="true">"there!"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="l8dg-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="l8dg-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="l8dg-8-0">
                            <span data-text="true">"You"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="l8dg-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="l8dg-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="l8dg-11-0">
                            <span data-text="true">
                              "// returns "Hi there! You""
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

export default FormatTextArticle;
