import React from "react";

class DateSubArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "datesub" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATESUB( date, amount, unit )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Subtract some units of time from a date.
          <p>The DATESUB function accepts these arguments:</p>
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
                    <td>how many units to subtract </td>
                  </tr>
                  <tr>
                    <td>unit</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the type of unit to subtract eg. "minutes"</td>
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
                'DATESUB("2019-10-21 09:00", 30, "minutes")',
                this.state.copyFormulaName,
                "// returns {'2019-10-21 08:30:00'} ",
                "2019-10-21 08:30:00"
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
                            <span data-text="true">DATESUB</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="1kku9-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span class="prism-token token string">
                          <span data-offset-key="1kku9-2-0">
                            <span data-text="true">"2019-10-21 09:00"</span>
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
                            <span data-text="true">30</span>
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
                            <span data-text="true">"minutes"</span>
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

export default DateSubArticle;
