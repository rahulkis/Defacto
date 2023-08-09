import React from "react";

class ErrorArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "error" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>ERROR(message)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns an error with the custom message provided. NOTE: If the field
          is visible, this error will prevent the form being submitted.
          <p>The ERROR function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper"
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
                    <td>message</td>
                    <td>No</td>
                    <td>text</td>
                    <td>The error message</td>
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
                'IF(1 == 2, ERROR("You can\'t do that!"), "All good 🙌")',
                this.state.copyFormulaName,
                "// returns error message \"You can't do that!",
                '"You can\'t do that!"'
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
                        data-offset-key="20c4l-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="20c4l-0-0">
                            <span data-text="true">IF</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="20c4l-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="20c4l-2-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span data-offset-key="20c4l-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="20c4l-4-0">
                            <span data-text="true">==</span>
                          </span>
                        </span>
                        <span data-offset-key="20c4l-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="20c4l-6-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="20c4l-7-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="20c4l-8-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="20c4l-9-0">
                            <span data-text="true">ERROR</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="20c4l-10-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="20c4l-11-0">
                            <span data-text="true">"You can't do that!"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="20c4l-12-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="20c4l-13-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="20c4l-14-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="20c4l-15-0">
                            <span
                              data-text="true"
                              role="img"
                              aria-label="sheep"
                            >
                              "All good 🙌"
                            </span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="20c4l-16-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="20c4l-17-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="20c4l-18-0">
                            <span data-text="true">
                              " // return error message "You can't do that!""
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

export default ErrorArticle;
