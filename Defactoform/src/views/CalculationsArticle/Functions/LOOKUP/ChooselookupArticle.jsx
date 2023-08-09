import React from "react";

class ChooselookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "chooselookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>CHOOSE(index_num, value_1, value_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Chooses a value from provided values by index.
          <p>The CHOOSE function accepts these arguments:</p>
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
                    <td>index_num</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the index to choose</td>
                  </tr>
                  <tr>
                    <td>value</td>
                    <td>No</td>
                    <td>any</td>
                    <td>the value which will be selected</td>
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
                'CHOOSE(3, "Mon", "Tues", "Wed", "Thurs", "Fri")',
                this.state.copyFormulaName,
                "// returns Wed",
                "Wed"
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
                        data-offset-key="9nn95-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="9nn95-0-0">
                            <span data-text="true">CHOOSE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="9nn95-2-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9nn95-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9nn95-5-0">
                            <span data-text="true">"Mon"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9nn95-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9nn95-8-0">
                            <span data-text="true">"Tues"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9nn95-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9nn95-11-0">
                            <span data-text="true">"Wed"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-12-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9nn95-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9nn95-14-0">
                            <span data-text="true">"Thurs"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-15-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="9nn95-16-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="9nn95-17-0">
                            <span data-text="true">"Fri"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="9nn95-18-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="9nn95-19-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="9nn95-20-0">
                            <span data-text="true">"// returns "Wed""</span>
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

export default ChooselookupArticle;
