import React from "react";

class LeftTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "lefttext" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>LEFT(text, number_of_characters)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the specified number of character from the left of a text
          string.
          <p>The LEFT function accepts these arguments:</p>
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
                    <td>the text string to get characters from</td>
                  </tr>
                  <tr>
                    <td>number_of_characters</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number of characters to get</td>
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
                'LEFT("apples", 3)',
                this.state.copyFormulaName,
                '// returns "app"',
                '"app"'
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
                        data-offset-key="9ad4-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="9ad4-0-0">
                            <span data-text="true">LEFT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9ad4-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9ad4-2-0">
                            <span data-text="true">"apples"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9ad4-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9ad4-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="9ad4-5-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9ad4-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="9ad4-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="9ad4-8-0">
                            <span data-text="true">"// returns "app""</span>
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

export default LeftTextArticle;
