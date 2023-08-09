import React from "react";

class SearchTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "searchtext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>SEARCH(search, text, start_position)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Searches for text within a text string from the start position.
          Returns the start position of the text or an error if not found.
          <p>The SEARCH function accepts these arguments:</p>
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
                    <td>search</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to search for</td>
                  </tr>
                  <tr>
                    <td>text</td>
                    <td>No</td>
                    <td>text</td>
                    <td>the text to search in</td>
                  </tr>
                  <tr>
                    <td>start_position</td>
                    <td>Yes</td>
                    <td>number</td>
                    <td>the position to start from (default 0)</td>
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
                'SEARCH("needle", "needle in a haystack")',
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
                        data-offset-key="591p6-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span class="prism-token token constant">
                          <span data-offset-key="591p6-0-0">
                            <span data-text="true">SEARCH</span>
                          </span>
                        </span>
                        <span class="prism-token token punctuation">
                          <span data-offset-key="591p6-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span class="prism-token token string">
                          <span data-offset-key="591p6-2-0">
                            <span data-text="true">"needle"</span>
                          </span>
                        </span>
                        <span class="prism-token token punctuation">
                          <span data-offset-key="591p6-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="591p6-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token string">
                          <span data-offset-key="591p6-5-0">
                            <span data-text="true">"needle in a haystack"</span>
                          </span>
                        </span>
                        <span class="prism-token token punctuation">
                          <span data-offset-key="591p6-10-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="591p6-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token comment">
                          <span data-offset-key="591p6-12-0">
                            <span data-text="true">"// returns 1"</span>
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
            href="#psblo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'SEARCH("needle", "needle in a haystack", 4)',
                this.state.copyFormulaName,
                "// returns #VALUE! error ",
                "#VALUE! error"
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
                        data-offset-key="bm14k-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="bm14k-0-0">
                            <span data-text="true">SEARCH</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bm14k-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="bm14k-2-0">
                            <span data-text="true">"needle"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bm14k-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="bm14k-5-0">
                            <span data-text="true">"needle in a haystack"</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="bm14k-7-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-8-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="bm14k-9-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bm14k-10-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="bm14k-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="bm14k-12-0">
                            <span data-text="true">
                              "// returns #VALUE! error"
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

export default SearchTextArticle;
