import React from "react";

class ReverselookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "reverselookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>REVERSE(arrayOrText)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Reverses the order of an array or text.
          <p>The REVERSE function accepts these arguments:</p>
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
                    <td>arrayOrText</td>
                    <td>No</td>
                    <td>any</td>
                    <td>The provided array or string you want reversed.</td>
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
                "REVERSE(ARRAY(1,2,3))",
                this.state.copyFormulaName,
                "// returns [3, 2, 1] ",
                "[3, 2, 1]"
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
                            <span data-text="true">REVERSE</span>
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
                          <span data-offset-key="fmqs9-16-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="fmqs9-17-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="fmqs9-18-0">
                            <span data-text="true">"// returns [3, 2, 1]"</span>
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

export default ReverselookupArticle;
