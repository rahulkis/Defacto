import React from "react";

class DateAddArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "dateadd" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEADD( date, amount, unit )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Add some units of time to a date.
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
                    <td>a date to format</td>
                  </tr>
                  <tr>
                    <td>amount</td>
                    <td>No</td>
                    <td>number</td>
                    <td>how many units to add</td>
                  </tr>
                  <tr>
                    <td>unit</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the type of unit to add eg. "minutes"</td>
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
                'DATEADD("2019-10-21", 3, "days")',
                this.state.copyFormulaName,
                "// returns {'2019-10-24 00:00:00'} ",
                "2019-10-24 00:00:00"
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
                        data-offset-key="1kku9-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="1kku9-0-0">
                            <span data-text="true">DATEADD</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="1kku9-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span class="prism-token token string">
                          <span data-offset-key="1kku9-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="1kku9-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="1kku9-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="1kku9-5-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="1kku9-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="1kku9-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="1kku9-8-0">
                            <span data-text="true">"days"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="1kku9-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="1kku9-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="1kku9-11-0">
                            <span data-text="true">
                              "// returns "2019-10-24 00:00:00""
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

export default DateAddArticle;
