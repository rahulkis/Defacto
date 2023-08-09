import React from "react";

class SignArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "sign" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>SIGN(number)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the sign of a number.
          <p>The SIGN function accepts these arguments:</p>
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
                    <td>number</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number to return the sign for</td>
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
                'SIGN("104")',
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
                        data-offset-key="c1jbk-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="c1jbk-0-0">
                            <span data-text="true">SIGN</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c1jbk-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="c1jbk-2-0">
                            <span data-text="true">104</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c1jbk-3-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="c1jbk-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="c1jbk-5-0">
                            <span data-text="true">"// returns 1" </span>
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
                'SIGN("-104")',
                this.state.copyFormulaName,
                "// returns -1",
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
                        data-offset-key="3p54l-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="3p54l-0-0">
                            <span data-text="true">SIGN</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="3p54l-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="3p54l-2-0">
                            <span data-text="true">-104</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="3p54l-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="3p54l-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="3p54l-8-0">
                            <span data-text="true">"// returns -1" </span>
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

export default SignArticle;
