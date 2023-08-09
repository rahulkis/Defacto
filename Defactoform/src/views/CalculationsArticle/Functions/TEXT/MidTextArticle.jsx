import React from "react";

class MidTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "midtext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>MID(text, start_number, number_of_characters)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns a specific number of characters from a text string starting at
          the position specified.
          <p>The LOWER function accepts these arguments:</p>
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
                    <td>the text to get characters from</td>
                  </tr>
                  <tr>
                    <td>start_number</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the position of the first character to extract</td>
                  </tr>
                  <tr>
                    <td>number_of_characters</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number of characters to extract</td>
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
                'MID("get me out of here", 5, 2)',
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
                            <span data-text="true">MID</span>
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
                          <span data-offset-key="mnrr-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="mnrr-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="mnrr-5-0">
                            <span data-text="true">5</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="mnrr-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="mnrr-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="mnrr-8-0">
                            <span data-text="true">2</span>
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

export default MidTextArticle;
