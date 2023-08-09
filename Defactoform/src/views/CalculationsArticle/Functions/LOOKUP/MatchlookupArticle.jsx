import React from "react";

class MatchlookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "matchlookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>MATCH(values, value)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the position of a value in an array of values.
          <p>The MATCH function accepts these arguments:</p>
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
                    <td>any</td>
                    <td>an array of values to search in</td>
                  </tr>
                  <tr>
                    <td>value</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to search for</td>
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
                'MATCH(ARGS2ARRAY("apple", "fish", "desk"), "fish")',
                this.state.copyFormulaName,
                "// returns 2",
                2
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
                        data-offset-key="e3fl1-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="e3fl1-0-0">
                            <span data-text="true">MATCH</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="e3fl1-2-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="e3fl1-4-0">
                            <span data-text="true">"apple"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="e3fl1-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="e3fl1-7-0">
                            <span data-text="true">"fish"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="e3fl1-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="e3fl1-10-0">
                            <span data-text="true">"desk"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-11-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="e3fl1-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="e3fl1-14-0">
                            <span data-text="true">"fish"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="e3fl1-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="e3fl1-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="e3fl1-17-0">
                            <span data-text="true">"// returns 2"</span>
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

export default MatchlookupArticle;
