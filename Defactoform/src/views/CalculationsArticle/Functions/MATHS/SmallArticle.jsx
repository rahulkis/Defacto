import React from "react";

class SmallArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "small" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>SMALL(numbers, nth)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the nth smallest number from the array of numbers.
          <p>The SMALL function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "visible" }}
            >
              <table className="ResultsTable CalculationsHelp__formulaHelp table-striped">
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
                    <td>numbers</td>
                    <td>No</td>
                    <td>array</td>
                    <td>the array of numbers</td>
                  </tr>
                  <tr>
                    <td>nth</td>
                    <td>No</td>
                    <td>array</td>
                    <td>the size of the number to return</td>
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
                "SMALL(ARGS2ARRAY(456, 78, 123, 4), 2)",
                this.state.copyFormulaName,
                "// returns 78 ",
                78
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
                        data-offset-key="d5ks8-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="d5ks8-0-0">
                            <span data-text="true">SMALL</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="d5ks8-2-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="d5ks8-4-0">
                            <span data-text="true">456</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="d5ks8-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="d5ks8-7-0">
                            <span data-text="true">78</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="d5ks8-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="d5ks8-10-0">
                            <span data-text="true">123</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-11-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="d5ks8-12-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="d5ks8-13-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-14-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-15-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="d5ks8-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="d5ks8-17-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="d5ks8-18-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="d5ks8-19-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="d5ks8-20-0">
                            <span data-text="true">"// returns 78"</span>
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

export default SmallArticle;
