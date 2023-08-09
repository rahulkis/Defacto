import React from "react";

class UniquelookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "uniquelookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>UNIQUE(values)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the unique values from an array of values.
          <p>The UNIQUE function accepts these arguments:</p>
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
                    <td>values</td>
                    <td>No</td>
                    <td>array</td>
                    <td>an array of values</td>
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
                'UNIQUE("an", "apple", "and", "an", "apple")',
                this.state.copyFormulaName,
                '// returns ["an", "apple", "and"]',
                '["an", "apple", "and"]'
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
                        data-offset-key="209oq-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="209oq-0-0">
                            <span data-text="true">UNIQUE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="209oq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="209oq-2-0">
                            <span data-text="true">"an"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="209oq-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="209oq-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="209oq-5-0">
                            <span data-text="true">"apple"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="209oq-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="209oq-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="209oq-8-0">
                            <span data-text="true">"and"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="209oq-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="209oq-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="209oq-11-0">
                            <span data-text="true">"an"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="209oq-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="209oq-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="209oq-14-0">
                            <span data-text="true">"apple"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="209oq-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="209oq-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="209oq-17-0">
                            <span data-text="true">
                              "// returns ["an", "apple", "and"]"
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

export default UniquelookupArticle;
