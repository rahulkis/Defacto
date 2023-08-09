import React from "react";

class LessthanArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "lessthan" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>Less than {"<"} </h3>
        <p>
          Returns true when the value on the left is smaller than the value on
          the right.
        </p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "1 < 0 ",
                this.state.copyFormulaName,
                "// that's false!",
                1 < 0
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
                      data-editor="4968o"
                      data-offset-key="1nhrd-0-0"
                    >
                      <div
                        data-offset-key="1nhrd-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-0-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="1nhrd-2-0">
                            <span data-text="true">{"<"}</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-4-0">
                            <span data-text="true">0</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="1nhrd-6-0">
                            <span data-text="true">"// that's false!"</span>
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
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                "1 < 2",
                this.state.copyFormulaName,
                "// that's true!",
                1 < 2
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
                      data-editor="4968o"
                      data-offset-key="1nhrd-0-0"
                    >
                      <div
                        data-offset-key="1nhrd-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-0-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="1nhrd-2-0">
                            <span data-text="true">{"<"}</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token boolean">
                          <span data-offset-key="1nhrd-4-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span data-offset-key="1nhrd-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="1nhrd-6-0">
                            <span data-text="true">"// that's true!"</span>
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

export default LessthanArticle;
