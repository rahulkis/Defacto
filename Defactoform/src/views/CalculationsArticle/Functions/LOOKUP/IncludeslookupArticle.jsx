import React from "react";

class IncludeslookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "includeslookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>INCLUDES(array, value, valueN)</h3>
        <div className="CalculationsHelp__formulaHelp">
          <p>The INCLUDES function accepts these arguments:</p>
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
                    <td>value</td>
                    <td>No</td>
                    <td>any</td>
                    <td>The value to search if it is included in an array.</td>
                  </tr>
                  <tr>
                    <td>valueN</td>
                    <td>Yes</td>
                    <td>array</td>
                    <td>
                      If the `value` is an array, or more arguments are passed,
                      then this function will check if ALL of the individual
                      values are included in the provided array.
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
                "INCLUDES(ARRAY(1,2,3), 2, 3)",
                this.state.copyFormulaName,
                "// returns true",
                true
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
                            <span data-text="true">INCLUDES</span>
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
                          <span data-offset-key="cjvtq-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="cjvtq-11-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="cjvtq-12-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="cjvtq-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="cjvtq-11-0">
                          <span data-text="true" />
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="cjvtq-12-0">
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
                            <span data-text="true">"// returns true"</span>
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

export default IncludeslookupArticle;
