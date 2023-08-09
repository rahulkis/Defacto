import React from "react";

class RomanArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "roman" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>ROMAN(number)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the roman numeral representation of a number.
          <p>The ROMAN function accepts these arguments:</p>
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
                    <td>the number to convert</td>
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
                "ROMAN(2019)",
                this.state.copyFormulaName,
                "// returns MMXIX ",
                "MMXIX"
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
                            <span data-text="true">ROMAN</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dkfnc-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dkfnc-3-0">
                            <span data-text="true">2019</span>
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
                            <span data-text="true">"// returns "MMXIX""</span>
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

export default RomanArticle;
