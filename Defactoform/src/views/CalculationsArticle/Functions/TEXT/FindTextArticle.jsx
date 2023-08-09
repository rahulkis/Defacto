import React from "react";

class FindTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "findtext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>FIND(find_text, within_text, start_num)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Find one text string within a second text string. Returns the number
          of the starting position of the find text from the first character in
          the search text.
          <p>The FIND function accepts these arguments:</p>
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
                    <td>find_text</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to search for</td>
                  </tr>
                  <tr>
                    <td>within_text</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to search within</td>
                  </tr>
                  <tr>
                    <td>start_num</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the character to start from</td>
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
                'FIND("to", "to be or not to be", 3)',
                this.state.copyFormulaName,
                "// returns 14",
                14
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
                        data-offset-key="ea1cq-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="ea1cq-0-0">
                            <span data-text="true">FIND</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="ea1cq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="ea1cq-2-0">
                            <span data-text="true">"to"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="ea1cq-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="ea1cq-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="ea1cq-5-0">
                            <span data-text="true">"to be or not to be"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="ea1cq-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="ea1cq-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="ea1cq-8-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="ea1cq-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="ea1cq-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="ea1cq-11-0">
                            <span data-text="true">"// returns 14"</span>
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

export default FindTextArticle;
