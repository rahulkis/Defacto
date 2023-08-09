import React from "react";

export default class DateGetArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "dateget" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEGET( date, unit, value )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Get a unit of time from a date.
          <p>The DATEGET function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "visible" }}
            >
              <table className="ResultsTable CalculationsHelp__formulaHelp">
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
                    <td>unit</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the unit to set</td>
                  </tr>
                  <tr>
                    <td>value</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the value to set</td>
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
                'DATEGET("2019-10-21", "days") ',
                this.state.copyFormulaName,
                " // returns 21 "
              )
            }
          >
            Copy <i className="fa fa-clone" />
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-999rc"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="999rc"
                      data-offset-key="4efa4-0-0"
                    >
                      <div
                        data-offset-key="4efa4-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="4efa4-0-0">
                            <span data-text="true">DATEGET</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="4efa4-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="4efa4-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="4efa4-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="4efa4-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="4efa4-5-0">
                            <span data-text="true">"days"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="4efa4-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="4efa4-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="4efa4-8-0">
                            <span data-text="true">"// returns 21"</span>
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
