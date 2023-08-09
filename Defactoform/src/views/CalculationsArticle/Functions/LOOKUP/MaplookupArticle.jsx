import React from "react";

class MaplookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "maplookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>MAP(array, expressionString)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns a new array with the provided expression evaluated on each
          item in the array.
          <p>The MAP function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "auto" }}
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
                    <td>array</td>
                    <td>No</td>
                    <td>array</td>
                    <td>The provided array</td>
                  </tr>
                  <tr>
                    <td>expressionString</td>
                    <td>No</td>
                    <td>any</td>
                    <td>
                      A string of an expression to be evaluated. Sub expressions
                      should start with an "=" sign. `item` represents the item
                      in the array when evaluating, and `index` represents its
                      position in the array.
                    </td>
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
                'MAP(ARGS2ARRAY(1, 2, 3), "= item * 100")',
                this.state.copyFormulaName,
                "// returns [100, 200, 300]",
                "[100, 200, 300]"
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
                        data-offset-key="5o3nq-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="5o3nq-0-0">
                            <span data-text="true">MAP</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="5o3nq-2-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5o3nq-4-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5o3nq-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5o3nq-7-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5o3nq-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5o3nq-10-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-11-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5o3nq-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="5o3nq-14-0">
                            <span data-text="true">"= item * 100"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5o3nq-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="5o3nq-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="5o3nq-17-0">
                            <span data-text="true">
                              "// returns [100, 200, 300]"
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

export default MaplookupArticle;
