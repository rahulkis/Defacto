import React from "react";

export default class DateSetArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "dateset" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATESET( date, unit, value )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Set a unit of time on a date.
          <p>The DATESET function accepts these arguments:</p>
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
                'DATESET("2019-10-21 09:00", "month", 9) ',
                this.state.copyFormulaName,
                "// returns 2019-09-21 09:00:00"
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
                  aria-describedby="placeholder-767g3"
                  className="public-DraftEditor-content"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="767g3"
                      data-offset-key="9939u-0-0"
                    >
                      <div
                        data-offset-key="9939u-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="9939u-0-0">
                            <span data-text="true">DATESET</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9939u-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9939u-2-0">
                            <span data-text="true">"2019-10-21 09:00"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9939u-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9939u-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9939u-5-0">
                            <span data-text="true">"month"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9939u-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9939u-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="9939u-8-0">
                            <span data-text="true">9</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9939u-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="9939u-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="9939u-11-0">
                            <span data-text="true">
                              "// returns "2019-09-21 09:00:00""
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
