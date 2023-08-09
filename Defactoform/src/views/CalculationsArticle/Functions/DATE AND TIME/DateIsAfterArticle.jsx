import React from "react";
export default class DateIsAfterArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "dateisafter" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEISAFTER( date_1, date_2 )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Check if the first date is after the second date.
          <p>The DATEISAFTER function accepts these arguments:</p>
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
                'DATEISAFTER("2019-10-21", "2019-10-20") ',
                this.state.copyFormulaName,
                " // returns true "
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
                  aria-describedby="placeholder-4j1kq"
                  className="public-DraftEditor-content"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="4j1kq"
                      data-offset-key="494pt-0-0"
                    >
                      <div
                        data-offset-key="494pt-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="494pt-0-0">
                            <span data-text="true">DATEISAFTER</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="494pt-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="494pt-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="494pt-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="494pt-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="494pt-5-0">
                            <span data-text="true">"2019-10-20"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="494pt-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="494pt-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="494pt-8-0">
                            <span data-text="true">"// returns true"</span>
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
