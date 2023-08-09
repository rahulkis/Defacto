import React from "react";

class RegexMatchTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "regexmatchtext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>REGEXMATCH(text,regex_text)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns true if the regex matches against the text.
          <p>The REGEXMATCH function accepts these arguments:</p>
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
                    <td>the text to match from</td>
                  </tr>
                  <tr>
                    <td>regex_text</td>
                    <td>No</td>
                    <td>text</td>
                    <td>a text string regex pattern</td>
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
                'REGEXMATCH("needle in a haystack", "needle")',
                this.state.copyFormulaName,
                "// returns true",
                true
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
                        data-offset-key="mnrr-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="mnrr-0-0">
                            <span data-text="true">REGEXMATCH</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="mnrr-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="mnrr-2-0">
                            <span data-text="true">"needle in a haystack"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="1mg9i-4-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="1mg9i-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="1mg9i-6-0">
                            <span data-text="true">"needle"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="mnrr-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="mnrr-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="mnrr-11-0">
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

export default RegexMatchTextArticle;
