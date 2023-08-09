import React from "react";

class RightTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "righttext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>RIGHT(text, number)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Return the rightmost characters from a text string.
          <p>The RIGHT function accepts these arguments:</p>
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
                    <td>text</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to return characters from</td>
                  </tr>
                  <tr>
                    <td>number</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number of characters to return</td>
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
                'RIGHT("$100", 3)',
                this.state.copyFormulaName,
                '// returns "100"',
                "100"
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
                        data-offset-key="66nrk-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="66nrk-0-0">
                            <span data-text="true">RIGHT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="66nrk-2-0">
                            <span data-text="true">"$100"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="66nrk-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="66nrk-5-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="66nrk-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="66nrk-11-0">
                            <span data-text="true">"// returns "100"</span>
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

export default RightTextArticle;
