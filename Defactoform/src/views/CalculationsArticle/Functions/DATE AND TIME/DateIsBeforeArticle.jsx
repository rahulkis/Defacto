import React from "react";

export default class DateIsBeforeArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "dateisbefore" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEISBEFORE( date_1, date_2 )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Check if the first date is before the second date.
          <p>The DATEISBEFORE function accepts these arguments:</p>
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
                    <td>date_n</td>
                    <td>No</td>
                    <td>date</td>
                    <td>the dates to compare</td>
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
                'DATEISBEFORE("2019-10-21", "2019-10-20") ',
                this.state.copyFormulaName,
                " // returns false "
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
                  aria-describedby="placeholder-acu7q"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="acu7q"
                      data-offset-key="edthc-0-0"
                    >
                      <div
                        data-offset-key="edthc-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="edthc-0-0">
                            <span data-text="true">DATEISBEFORE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="edthc-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="edthc-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="edthc-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="edthc-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="edthc-5-0">
                            <span data-text="true">"2019-10-20"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="edthc-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="edthc-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="edthc-8-0">
                            <span data-text="true">"// returns false"</span>
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
