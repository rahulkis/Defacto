import React from "react";

class IsOddArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "isodd" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>ISODD(number)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns true if the number is odd.
          <p>The ISODD function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "visible" }}
            >
              <table class="ResultsTable CalculationsHelp__formulaHelp table-striped">
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
                    <td>value</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number to check</td>
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
                "ISODD(5)",
                this.state.copyFormulaName,
                "// returns true",
                "true"
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
                        data-offset-key="enloq-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="enloq-0-0">
                            <span data-text="true">ISODD</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="enloq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="enloq-2-0">
                            <span data-text="true">5</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="enloq-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="enloq-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="enloq-8-0">
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

export default IsOddArticle;
