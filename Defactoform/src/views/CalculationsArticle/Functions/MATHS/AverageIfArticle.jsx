import React from "react";

class AverageIfArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "averageif" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>AVERAGEIF(array, criteria)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the average of its arguments which meet the criteria.
          <p>The AVERAGEIF function accepts these arguments:</p>
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
                    <td>array</td>
                    <td>No</td>
                    <td>array</td>
                    <td>an array of values to average</td>
                  </tr>
                  <tr>
                    <td>criteria</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the criteria to match against eg. ">32" or "apples"</td>
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
                'AVERAGEIF(ARGS2ARRAY(4, 8, 12), "<10")',
                this.state.copyFormulaName,
                "// returns 6 ",
                6
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
                        data-offset-key="arsd4-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="arsd4-0-0">
                            <span data-text="true">AVERAGEIF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="arsd4-2-0">
                            <span data-text="true">ARGS2ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="arsd4-4-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="arsd4-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="arsd4-7-0">
                            <span data-text="true">8</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="arsd4-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="arsd4-10-0">
                            <span data-text="true">12</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-11-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="arsd4-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="arsd4-14-0">
                            <span data-text="true">"&lt;10"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="arsd4-15-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="arsd4-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="arsd4-17-0">
                            <span data-text="true">"// returns 6"</span>
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

export default AverageIfArticle;
