import React from "react";

export default class DateEndOfArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "dateendof" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEENDOF( date, unit )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Set a date to the end of a unit of time.
          <p>The DATEENDOF function accepts these arguments:</p>
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
                    <td>the unit to get the end of</td>
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
                'DATEENDOF("2019-10-21 09:53", "hour")',
                this.state.copyFormulaName,
                " // returns 2019-10-21 09:59:59 "
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
                  aria-describedby="placeholder-96ic6"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="96ic6"
                      data-offset-key="7uakl-0-0"
                    >
                      <div
                        data-offset-key="7uakl-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="7uakl-0-0">
                            <span data-text="true">DATEENDOF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7uakl-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="7uakl-2-0">
                            <span data-text="true">"2019-10-21 09:53"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7uakl-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="7uakl-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="7uakl-5-0">
                            <span data-text="true">"hour"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7uakl-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="7uakl-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="7uakl-8-0">
                            <span data-text="true">
                              "// returns "2019-10-21 09:59:59""
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
        <div style={{ position: " relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'DATEENDOF("2019-10-21 09:53", "month")',
                this.state.copyFormulaName,
                " // returns 2019-10-31 23:59:59 "
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
                  aria-describedby="placeholder-9vta9"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="9vta9"
                      data-offset-key="av10s-0-0"
                    >
                      <div
                        data-offset-key="av10s-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="av10s-0-0">
                            <span data-text="true">DATEENDOF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="av10s-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="av10s-2-0">
                            <span data-text="true">"2019-10-21 09:53"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="av10s-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="av10s-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="av10s-5-0">
                            <span data-text="true">"month"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="av10s-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="av10s-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="av10s-8-0">
                            <span data-text="true">
                              "// returns "2019-10-31 23:59:59""
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
