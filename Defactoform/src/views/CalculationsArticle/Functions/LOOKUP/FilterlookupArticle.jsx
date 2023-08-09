import React from "react";

class FilterlookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "filterlookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>FILTER(array, expressionString)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns a new array with the provided elements removed
          <p>The FILTER function accepts these arguments:</p>
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
                      should start with an "=" sign. `item` is a special
                      variable that represents the item in the array when
                      evaluating. `index` can be used to access the position in
                      the array.
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
                'FILTER(ARGS2ARRAY(1, 2, 3, 2), "= item > 2")',
                this.state.copyFormulaName,
                "// returns [3]",
                "[3]"
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
                        data-offset-key="40r9p-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="40r9p-0-0">
                            <span data-text="true">FILTER</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="40r9p-2-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="40r9p-4-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="40r9p-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="40r9p-7-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="40r9p-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="40r9p-10-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-11-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="40r9p-12-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="40r9p-13-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-14-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-15-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="40r9p-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="40r9p-17-0">
                            <span data-text="true">"= item &gt; 2"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="40r9p-18-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="40r9p-19-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="40r9p-20-0">
                            <span data-text="true">"// returns [3]"</span>
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

export default FilterlookupArticle;
