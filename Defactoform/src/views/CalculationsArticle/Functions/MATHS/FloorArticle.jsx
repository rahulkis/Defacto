import React from "react";

class PowArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "floor" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>FLOOR(number, significance)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Rounds a number toward zero, to the nearest multiple of significance.
          <p>The FLOOR function accepts these arguments:</p>
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
                    <td>significance</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the multiple to round to</td>
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
                "FLOOR(4.512, 0.05)",
                this.state.copyFormulaName,
                "// returns 4.5 ",
                4.5
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
                            <span data-text="true">FLOOR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="b02ej-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="b02ej-2-0">
                            <span data-text="true">4.512</span>
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
                            <span data-text="true">0.05</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="b02ej-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="b02ej-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="b02ej-8-0">
                            <span data-text="true">"// returns 4.5"</span>
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

export default PowArticle;
