import React from "react";

class LargeArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "large" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>LARGE(numbers, n)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the nth largest number from an array of numbers.
          <p>The LARGE function accepts these arguments:</p>
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
                    <td>number</td>
                    <td>No</td>
                    <td>array</td>
                    <td>an array of numbers</td>
                  </tr>
                  <tr>
                    <td>n</td>
                    <td>No</td>
                    <td>number</td>
                    <td>indicates order of the number to return</td>
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
                "LARGE(ARGS2ARRAY(17, 5, 42, 6), 2)",
                this.state.copyFormulaName,
                "// returns 17 ",
                17
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
                            <span data-text="true">LARGE</span>
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
                            <span data-text="true">17</span>
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
                            <span data-text="true">5</span>
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
                            <span data-text="true">42</span>
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
                            <span data-text="true">6</span>
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
                            <span data-text="true">"// returns 17"</span>
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

export default LargeArticle;
