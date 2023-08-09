import React from "react";

class JoinlookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "joinlookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>JOIN(array, separator)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Combines all of the elements in an array into a piece of text.
          <p>The JOIN function accepts these arguments:</p>
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
                    <td>array</td>
                    <td>No</td>
                    <td>array</td>
                    <td>The array you would like to join</td>
                  </tr>
                  <tr>
                    <td>separator</td>
                    <td>Yes</td>
                    <td>text</td>
                    <td>
                      Optionally place a separator between the elements in the
                      array when joining them.
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
                'JOIN(ARRAY("Hello", "how are you"), " $$$ ")',
                this.state.copyFormulaName,
                "// returns Hello $$$ how are you",
                "Hello $$$ how are you"
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
                        data-offset-key="485sh-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="485sh-0-0">
                            <span data-text="true">JOIN</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="485sh-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="485sh-2-0">
                            <span data-text="true">ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="485sh-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="485sh-4-0">
                            <span data-text="true">"Hello"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="485sh-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="485sh-6-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="485sh-7-0">
                            <span data-text="true">"how are you"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="485sh-8-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="485sh-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="485sh-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="485sh-11-0">
                            <span data-text="true">" $$$ "</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="485sh-12-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="485sh-13-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="485sh-14-0">
                            <span data-text="true">
                              "// returns "Hello $$$ how are you""
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

export default JoinlookupArticle;
