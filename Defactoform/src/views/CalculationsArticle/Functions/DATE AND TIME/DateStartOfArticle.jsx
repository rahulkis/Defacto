import React from "react";

export default class DateStartOfArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "datestartof" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATESTARTOF( date, unit )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Set a date to the start of a unit of time.
          <p>The DATESTARTOF function accepts these arguments:</p>
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
                    <td>a date to operate on</td>
                  </tr>
                  <tr>
                    <td>unit</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the unit to get the start of</td>
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
                'DATESTARTOF("2019-10-21 09:53", "hour") ',
                this.state.copyFormulaName,
                " // returns 2019-10-21 09:00:00 "
              )
            }
          >
            Copy <i className="fa fa-clone" />{" "}
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: "relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-7b49p"
                  className="public-DraftEditor-content"
                  contenteditable="false"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="7b49p"
                      data-offset-key="4kfi8-0-0"
                    >
                      <div
                        data-offset-key="4kfi8-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="4kfi8-0-0">
                            <span data-text="true">DATESTARTOF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="4kfi8-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="4kfi8-2-0">
                            <span data-text="true">"2019-10-21 09:53"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="4kfi8-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="4kfi8-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="4kfi8-5-0">
                            <span data-text="true">"hour"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="4kfi8-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="4kfi8-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="4kfi8-8-0">
                            <span data-text="true">
                              "// returns "2019-10-21 09:00:00""
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
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'DATESTARTOF("2019-10-21", "week") ',
                this.state.copyFormulaName,
                " //returns 2019-10-21 00:00:00 "
              )
            }
          >
            Copy <i className="fa fa-clone" />{" "}
          </a>
          <div
            className="FormTagInput Calculation__input"
            style={{ position: " relative" }}
          >
            <div className="DraftEditor-root">
              <div className="">
                <div
                  aria-describedby="placeholder-cd34k"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="cd34k"
                      data-offset-key="c0oaf-0-0"
                    >
                      <div
                        data-offset-key="c0oaf-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="c0oaf-0-0">
                            <span data-text="true">DATESTARTOF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c0oaf-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="c0oaf-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c0oaf-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="c0oaf-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="c0oaf-5-0">
                            <span data-text="true">"week"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c0oaf-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="c0oaf-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="c0oaf-8-0">
                            <span data-text="true">
                              " // returns "2019-10-20 00:00:00""
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
