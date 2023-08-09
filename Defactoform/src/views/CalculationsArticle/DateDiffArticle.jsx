import React from "react";

class DateDiffArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "datediff" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEDIFF(date_1, date_2, unit)</h3>
        <div className="CalculationsHelp__formulaHelp">
          The difference between to dates in a unit of time.
          <p>The DATEADD function accepts these arguments:</p>
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
                    <td>date</td>
                    <td>No</td>
                    <td>date</td>
                    <td>the dates to compare</td>
                  </tr>
                  <tr>
                    <td>unit</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the type of unit to measure eg."minutes"</td>
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
                'DATEDIFF("2019-10-21", "2019-10-22", "days")',
                this.state.copyFormulaName,
                "// returns -1 ",
                -1
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
                        data-offset-key="fbnvs-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="fbnvs-0-0">
                            <span data-text="true">DATEDIFF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fbnvs-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fbnvs-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fbnvs-5-0">
                            <span data-text="true">"2019-10-22"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fbnvs-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fbnvs-8-0">
                            <span data-text="true">"days"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="fbnvs-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="fbnvs-11-0">
                            <span data-text="true">{/* returns -1*/}</span>
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
                'DATEDIFF("2019-10-22", "2019-10-21", "days")',
                this.state.copyFormulaName,
                "// returns 1 ",
                1
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
                        data-offset-key="fbnvs-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="fbnvs-0-0">
                            <span data-text="true">DATEDIFF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fbnvs-2-0">
                            <span data-text="true">"2019-10-22"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fbnvs-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fbnvs-5-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fbnvs-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fbnvs-8-0">
                            <span data-text="true">"days"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fbnvs-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="fbnvs-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="fbnvs-11-0">
                            <span data-text="true">"// returns 1"</span>
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

export default DateDiffArticle;
