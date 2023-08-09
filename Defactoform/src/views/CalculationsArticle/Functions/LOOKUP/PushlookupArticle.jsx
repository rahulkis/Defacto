import React from "react";

class PushlookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "pushlookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>PUSH(array, value, ...valueN)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns a new array with the provided value (or multiple values) added
          to the end.
          <p>The PUSH function accepts these arguments:</p>
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
                    <td>array</td>
                    <td>No</td>
                    <td>array</td>
                    <td>The provided array</td>
                  </tr>
                  <tr>
                    <td>value</td>
                    <td>Yes</td>
                    <td>any</td>
                    <td>The provided value in the array.</td>
                  </tr>
                  <tr>
                    <td>valueN</td>
                    <td>Yes</td>
                    <td>any</td>
                    <td>Other values you would like to add to the array.</td>
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
                "PUSH(ARRAY(1,2,3), 2, 3)",
                this.state.copyFormulaName,
                "// returns [1, 2, 3, 2, 3] ",
                "[1, 2, 3, 2, 3]"
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
                            <span data-text="true">PUSH</span>
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
                            <span data-text="true">3</span>
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
                              "// returns [1, 2, 3, 2, 3]"
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

export default PushlookupArticle;
