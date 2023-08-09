import React from "react";

class ReplaceTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "replacetext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>REPLACE(text, start, replace_num, replace_text)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Replace characters within text.
          <p>The REPLACE function accepts these arguments:</p>
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
                    <td>the text to replace characters in</td>
                  </tr>
                  <tr>
                    <td>start</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the position number of the character to start with</td>
                  </tr>
                  <tr>
                    <td>replace_num</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number of characters to replace</td>
                  </tr>
                  <tr>
                    <td>replace_text</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to replace the character with</td>
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
                'REPLACE("06-07-2019", 7, 4, "19")',
                this.state.copyFormulaName,
                "",
                "06-07-19"
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
                            <span data-text="true">REPLACE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="66nrk-2-0">
                            <span data-text="true">"06-07-2019"</span>
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
                            <span data-text="true">7</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="66nrk-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="66nrk-8-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="66nrk-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="66nrk-8-0">
                            <span data-text="true">"19"</span>
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
                            <span data-text="true" />
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

export default ReplaceTextArticle;
