import React from "react";

class SubstituteTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "substitutetext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>SUBSTITUTE(text, replace, replacement)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Replaces matches within a text string.
          <p>The SUBSTITUTE function accepts these arguments:</p>
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
                    <td>the text to replace in</td>
                  </tr>
                  <tr>
                    <td>replace</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to match and replace</td>
                  </tr>
                  <tr>
                    <td>replacement</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the new text to replace with</td>
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
                'SUBSTITUTE("a few words", " ", "-")',
                this.state.copyFormulaName,
                '// returns "a-few-words"',
                "a-few-words"
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
                            <span data-text="true">SUBSTITUTE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="66nrk-2-0">
                            <span data-text="true">"a few words"</span>
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
                            <span data-text="true">" "</span>
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
                            <span data-text="true">"-"</span>
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
                            <span data-text="true">
                              "// returns "a-few-words""
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

export default SubstituteTextArticle;
