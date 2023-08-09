import React from "react";

class ConcatenateTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "concatenatetext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>CONCATENATE(text_1, text_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Joins several text items into one text item.
          <p>The CONCATENATE function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper"
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
                    <td>text_n</td>
                    <td>No</td>
                    <td>text</td>
                    <td>a number of text items to be joined.</td>
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
                'CONCATENATE("a", " ", "short", " ", "sentence")',
                this.state.copyFormulaName,
                '// returns "a short sentence"',
                '"a short sentence"'
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
                        data-offset-key="fquaq-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="fquaq-0-0">
                            <span data-text="true">CONCATENATE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fquaq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fquaq-2-0">
                            <span data-text="true">"a"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fquaq-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fquaq-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fquaq-5-0">
                            <span data-text="true">" "</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fquaq-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fquaq-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fquaq-8-0">
                            <span data-text="true">"short"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fquaq-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fquaq-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fquaq-11-0">
                            <span data-text="true">" "</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fquaq-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fquaq-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fquaq-14-0">
                            <span data-text="true">"sentence"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fquaq-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="fquaq-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="fquaq-17-0">
                            <span data-text="true">
                              "// returns "a short sentence""
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

export default ConcatenateTextArticle;
