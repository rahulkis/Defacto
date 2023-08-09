import React from "react";

class TruncArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "trunc" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>TRUNC(number)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Truncates a decimal number to a whole integer.
          <p>The TRUNC function accepts these arguments:</p>
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
                    <td>number</td>
                    <td>the number to truncate</td>
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
                "TRUNC(2.345354623124)",
                this.state.copyFormulaName,
                "// returns 2 ",
                2
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
                        data-offset-key="dkfnc-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="dkfnc-0-0">
                            <span data-text="true">TRUNC</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dkfnc-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dkfnc-3-0">
                            <span data-text="true">2.345354623124</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dkfnc-4-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="dkfnc-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="dkfnc-6-0">
                            <span data-text="true">"// returns 2"</span>
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

export default TruncArticle;
