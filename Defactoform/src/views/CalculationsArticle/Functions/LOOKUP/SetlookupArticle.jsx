import React from "react";

class SetlookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "setlookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(
      copyData,
      copyFormulaName,
      commentText,
      resultData,
      true
    );
  };
  render() {
    return (
      <div>
        <h3>SET(array, index, value)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns a new array or text with the provided value set at the
          specified index.
          <p>The SET function accepts these arguments:</p>
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
                    <td>arrayOrText</td>
                    <td>No</td>
                    <td>array</td>
                    <td>The provided array or text</td>
                  </tr>
                  <tr>
                    <td>index</td>
                    <td>No</td>
                    <td>number</td>
                    <td>The index you would like to set at, starting at 0.</td>
                  </tr>
                  <tr>
                    <td>value</td>
                    <td>Yes</td>
                    <td>any</td>
                    <td>The value you would like to set.</td>
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
                'SET(ARRAY(1,2,3), 2, "Popcorn")',
                this.state.copyFormulaName,
                '// returns [1, 2, "Popcorn"] ',
                "\"ARRAYSET\" doesn't look like it's supposed to be there, or you haven't finished typing..."
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
                        data-offset-key="fmqs9-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="fmqs9-0-0">
                            <span data-text="true">ARRAYSET</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="fmqs9-2-0">
                            <span data-text="true">ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="fmqs9-4-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="fmqs9-6-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-7-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="fmqs9-8-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fmqs9-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="fmqs9-12-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-13-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="fmqs9-14-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="fmqs9-15-0">
                            <span data-text="true">"Popcorn"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="fmqs9-16-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="fmqs9-17-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="fmqs9-18-0">
                            <span data-text="true">
                              "// returns [1, 2, "Popcorn"]"
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

export default SetlookupArticle;
