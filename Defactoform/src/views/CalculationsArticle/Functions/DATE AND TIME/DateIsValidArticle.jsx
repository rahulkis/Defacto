import React from "react";

export default class DateIsValidArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copyFormulaName: "dateisvalid" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEISVALID( date )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Check if a date is valid.
          <p>The DATEISVALID function accepts these arguments:</p>
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
                    <td>a date to check</td>
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
                'DATEISVALID("2019-10-21") ',
                this.state.copyFormulaName,
                " //returns true "
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
                  aria-describedby="placeholder-57tji"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="57tji"
                      data-offset-key="f308k-0-0"
                    >
                      <div
                        data-offset-key="f308k-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="f308k-0-0">
                            <span data-text="true">DATEISVALID</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f308k-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="f308k-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="f308k-3-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="f308k-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="f308k-5-0">
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
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'DATEISVALID("apple") ',
                this.state.copyFormulaName,
                " //returns false "
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
                  aria-describedby="placeholder-2lpsq"
                  className="public-DraftEditor-content"
                  spellCheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="2lpsq"
                      data-offset-key="786n1-0-0"
                    >
                      <div
                        data-offset-key="786n1-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="786n1-0-0">
                            <span data-text="true">DATEISVALID</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="786n1-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="786n1-2-0">
                            <span data-text="true">"apple"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="786n1-3-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="786n1-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="786n1-5-0">
                            <span data-text="true">"// return false"</span>
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
