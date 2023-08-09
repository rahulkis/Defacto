import React from "react";

class ConcatenateArticle extends React.Component {
  constructor() {
    super();
    this.state = {
      copyData: '"Hello" || "World"',
      resultData: "HelloWorld",
      commentText: ' // returns Hello World "',
      copyFormulaName: "concatenate",
    };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>Concatenate || </h3>
        <p>Text can be joined using the `||` operator.</p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                this.state.copyData,
                this.state.copyFormulaName,
                this.state.commentText,
                this.state.resultData
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
              <div className="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      className=""
                      data-block="true"
                      data-editor="68ugd"
                      data-offset-key="8dmub-0-0"
                    >
                      <div
                        data-offset-key="4bggi-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token string">
                          <span data-offset-key="4bggi-0-0">
                            <span data-text="true">"Hello"</span>
                          </span>
                        </span>
                        <span data-offset-key="4bggi-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="4bggi-2-0">
                            <span data-text="true">||</span>
                          </span>
                        </span>
                        <span data-offset-key="4bggi-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="4bggi-4-0">
                            <span data-text="true">"World"</span>
                          </span>
                        </span>
                        <span data-offset-key="4bggi-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="4bggi-6-0">
                            <span data-text="true">
                              "// returns "Hello World""
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

export default ConcatenateArticle;
