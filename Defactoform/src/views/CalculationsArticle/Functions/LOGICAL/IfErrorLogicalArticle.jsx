import React from "react";

class IfErrorLogicalArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "iferrorlogical" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>IFERROR(value, value_if_error)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Trap and handle errors.
          <p>The IFERROR function accepts these arguments:</p>
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
                    <td>value</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to test for an error</td>
                  </tr>
                  <tr>
                    <td>value_if_error</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value to return if it is an error</td>
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
                "IFERROR( DIVIDE(2, 0), 0)",
                this.state.copyFormulaName,
                "// returns 0",
                0
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
                        data-offset-key="c6ph8-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="c6ph8-0-0">
                            <span data-text="true">IFERROR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c6ph8-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span data-offset-key="c6ph8-2-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="c6ph8-3-0">
                            <span data-text="true">DIVIDE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c6ph8-4-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="c6ph8-5-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c6ph8-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="c6ph8-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="c6ph8-8-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c6ph8-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c6ph8-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="c6ph8-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="c6ph8-12-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="c6ph8-13-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="c6ph8-14-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="c6ph8-15-0">
                            <span data-text="true">"// returns 0"</span>
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

export default IfErrorLogicalArticle;
