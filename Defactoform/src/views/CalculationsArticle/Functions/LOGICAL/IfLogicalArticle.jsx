import React from "react";

class IfLogicalArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "iflogical" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>IF(test, if_true, if_false)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Specify a logical test to perform.
          <p>The IF function accepts these arguments:</p>
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
                    <td>test</td>
                    <td>No</td>
                    <td>boolean</td>
                    <td>a test function that returns true or false</td>
                  </tr>
                  <tr>
                    <td>if_true</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to return if test is true</td>
                  </tr>
                  <tr>
                    <td>if_false</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to return if test is true</td>
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
                'IF( 4 > 5, "is true", "is false")',
                this.state.copyFormulaName,
                '// returns "is false"',
                "is false"
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
                        data-offset-key="7limk-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="7limk-0-0">
                            <span data-text="true">IF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7limk-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span data-offset-key="7limk-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="7limk-3-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span data-offset-key="7limk-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="7limk-5-0">
                            <span data-text="true">&gt;</span>
                          </span>
                        </span>
                        <span data-offset-key="7limk-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="7limk-7-0">
                            <span data-text="true">5</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7limk-8-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="7limk-9-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="7limk-10-0">
                            <span data-text="true">"is true"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7limk-11-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="7limk-12-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="7limk-13-0">
                            <span data-text="true">"is false"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="7limk-14-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="7limk-15-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="7limk-16-0">
                            <span data-text="true">
                              "// returns "is false""
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

export default IfLogicalArticle;
