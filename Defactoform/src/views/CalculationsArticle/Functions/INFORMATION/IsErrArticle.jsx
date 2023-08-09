import React from "react";

class IsErrArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "iserr" };
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
        <h3>ISERR(value)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns true if the value is an error value. ISERROR is another way of
          calling the same function.
          <p>The ISERR function accepts these arguments:</p>
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
                    <td>value</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to check</td>
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
                "ISERR(DIVIDE(2, 0))",
                this.state.copyFormulaName,
                "// returns true",
                "\"DIVIDE\" doesn't look like it's supposed to be there, or you haven't finished typing..."
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
                        data-offset-key="enloq-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="enloq-0-0">
                            <span data-text="true">ISERR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="enloq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="enloq-2-0">
                            <span data-text="true">DIVIDE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="enloq-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="enloq-2-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="enloq-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="enloq-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="enloq-5-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="enloq-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="enloq-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="enloq-8-0">
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

export default IsErrArticle;
