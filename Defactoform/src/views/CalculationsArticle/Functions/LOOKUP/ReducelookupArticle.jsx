import React from "react";

class ReducelookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "reducelookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>REDUCE(array, expressionString, initialValue)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns a new array with the provided elements removed
          <p>The REDUCE function accepts these arguments:</p>
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
                      in the array when evaluating, and `result` represents the
                      result at the time of evaluation, and `index` represents
                      the position of the item in the array.
                    </td>
                  </tr>
                  <tr>
                    <td>initialValue</td>
                    <td>Yes</td>
                    <td>any</td>
                    <td>The initial value of `result`, defaults to 0.</td>
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
                'REDUCE(ARGS2ARRAY(1, 2, 3), "result + (item * 100)", 1)',
                this.state.copyFormulaName,
                '// returns ["100", "200", "300"]',
                '["100", "200", "300"]'
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
                        data-offset-key="agpv7-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token operator">
                          <span data-offset-key="agpv7-0-0">
                            <span data-text="true">=</span>
                          </span>
                        </span>
                        <span data-offset-key="agpv7-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="agpv7-2-0">
                            <span data-text="true">REDUCE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="agpv7-4-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-5-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="agpv7-6-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-7-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="agpv7-8-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="agpv7-9-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="agpv7-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="agpv7-12-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-13-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-14-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="agpv7-15-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="agpv7-16-0">
                            <span data-text="true">
                              "result + (item * 100)"
                            </span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-17-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="agpv7-18-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="agpv7-19-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="agpv7-20-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="agpv7-21-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="agpv7-22-0">
                            <span data-text="true">
                              "// returns ["100", "200", "300"]"
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

export default ReducelookupArticle;
