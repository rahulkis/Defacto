import React from "react";

class AnswerPipingArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "answerpiping" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>Answer Piping </h3>
        <p>
          Answer piping allows you to insert answers from other questions into
          your calculations. Use the + button to the right of the calculations
          input to insert these easily, or alternatively type {"`{{`"} in the
          calculations box to search for questions inline.
        </p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                '"My answer to question `abcde`:" || {{ abcde }}',
                this.state.copyFormulaName,
                '// Returns "My answer to question `abcde`: blah" where "blah" is the answer to the question.',
                "My answer to question `abcde`:"
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
                        data-offset-key="2okjv-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token string">
                          <span data-offset-key="2okjv-0-0">
                            <span data-text="true">
                              "My answer to question `abcde`:"
                            </span>
                          </span>
                        </span>
                        <span data-offset-key="2okjv-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token operator">
                          <span data-offset-key="2okjv-2-0">
                            <span data-text="true">||</span>
                          </span>
                        </span>
                        <span data-offset-key="2okjv-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="FormTagInput__tagerror">
                          <span data-offset-key="2okjv-4-0">
                            <span data-text="true">{"{{ abcde }}"}</span>
                          </span>
                        </span>
                        <span data-offset-key="2okjv-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="2okjv-6-0">
                            <span data-text="true" />
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
                "{{ numberQuestion }} + 3",
                this.state.copyFormulaName,
                "// Returns the answer of the number question plus 3.",
                3
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
            <div class="DraftEditor-root">
              <div class="">
                <div
                  aria-describedby="placeholder-68ugd"
                  className="public-DraftEditor-content calculation-placeHolder"
                  contenteditable="false"
                  spellcheck="false"
                >
                  <div data-contents="true">
                    <div
                      class=""
                      data-block="true"
                      data-editor="3khqt"
                      data-offset-key="6takv-0-0"
                    >
                      <div
                        data-offset-key="6takv-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span class="FormTagInput__tagerror">
                          <span data-offset-key="6takv-0-0">
                            <span data-text="true">
                              {"{{ numberQuestion }}"}
                            </span>
                          </span>
                        </span>
                        <span data-offset-key="6takv-1-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token operator">
                          <span data-offset-key="6takv-2-0">
                            <span data-text="true">+</span>
                          </span>
                        </span>
                        <span data-offset-key="6takv-3-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token number">
                          <span data-offset-key="6takv-4-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span data-offset-key="6takv-5-0">
                          <span data-text="true"> </span>
                        </span>
                        <span class="prism-token token comment">
                          <span data-offset-key="6takv-6-0">
                            <span data-text="true">
                              "// Returns the answer of the number question plus
                              3."
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

export default AnswerPipingArticle;
