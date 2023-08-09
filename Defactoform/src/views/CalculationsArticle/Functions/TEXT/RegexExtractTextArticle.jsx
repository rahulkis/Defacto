import React from "react";

class RegexExtractTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "regexextracttext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>REGEXEXTRACT(text,regex_text)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Extract a text string from another text string using regex.
          <p>The REGEXEXTRACT function accepts these arguments:</p>
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
                    <td>the text to extract from</td>
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
                'REGEXEXTRACT( "get me out of here", "me")',
                this.state.copyFormulaName,
                '// returns "me"',
                "me"
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
                            <span data-text="true">REGEXEXTRACT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="mnrr-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="mnrr-2-0">
                            <span data-text="true">"get me out of here"</span>
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
                            <span data-text="true">"me"</span>
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
                            <span data-text="true">"// returns "me""</span>
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

export default RegexExtractTextArticle;
