import React from "react";

class RoundUpArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "roundup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>ROUNDUP(number, precision)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Behaves the same as round but always rounds up.
          <p>The ROUNDUP function accepts these arguments:</p>
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
                    <td>the number to round</td>
                  </tr>
                  <tr>
                    <td>precision</td>
                    <td>Yes</td>
                    <td>number</td>
                    <td>
                      the number of decimal places to round to (defaults to 0).
                    </td>
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
                "ROUNDUP(3.6423, 2)",
                this.state.copyFormulaName,
                "// returns 3.65 ",
                3.65
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
                        data-offset-key="b02ej-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="b02ej-0-0">
                            <span data-text="true">ROUNDUP</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="b02ej-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="b02ej-2-0">
                            <span data-text="true">3.6423</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="b02ej-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="b02ej-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="b02ej-5-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token   punctuation">
                          <span data-offset-key="b02ej-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="b02ej-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="b02ej-8-0">
                            <span data-text="true">"// returns 3.65"</span>
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

export default RoundUpArticle;
