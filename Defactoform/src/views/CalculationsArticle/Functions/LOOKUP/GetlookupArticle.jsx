import React from "react";

class GetlookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "getlookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>GET(array, index, fallback)</h3>
        <div className="CalculationsHelp__formulaHelp">
          <p>The LAST function accepts these arguments:</p>
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
                    <td>array</td>
                    <td>The array or text you would like to look at</td>
                  </tr>
                  <tr>
                    <td>index</td>
                    <td>No</td>
                    <td>number</td>
                    <td>
                      The index that you would like to return - starting at 0.
                    </td>
                  </tr>
                  <tr>
                    <td>fallback</td>
                    <td>Yes</td>
                    <td>any</td>
                    <td>
                      Return this if there is nothing found at that index.
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
                "GET(ARRAY(1,2,3), 0)",
                this.state.copyFormulaName,
                "// returns 1 ",
                1
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
                        data-offset-key="a8tpl-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="a8tpl-0-0">
                            <span data-text="true">GET</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="a8tpl-2-0">
                            <span data-text="true">ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="a8tpl-4-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="a8tpl-6-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-7-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="a8tpl-8-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-10-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="a8tpl-11-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="a8tpl-12-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="a8tpl-13-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="a8tpl-14-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="a8tpl-15-0">
                            <span data-text="true">"// returns 1"</span>
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

export default GetlookupArticle;
