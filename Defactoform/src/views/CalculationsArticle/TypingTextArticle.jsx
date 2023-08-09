import React from "react";

class TypingTextArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyData: '"Hello there"', copyFormulaName: "typingtext" };
  }
  copyformula = (copyData, copyFormulaName) => {
    this.props.copyformula(copyData, copyFormulaName);
  };
  render() {
    return (
      <div>
        <h3>Typing text </h3>
        <p>
          Text can be typed into expressions as long as it is in double
          quotation marks "". If you insert an answer that is text, the
          quotation marks are handled automatically.
        </p>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(this.state.copyData, this.state.copyFormulaName)
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
                        data-offset-key="8dmub-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token number">
                          <span data-offset-key="8dmub-0-0">
                            <span data-text="true">"Hello there"</span>
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

export default TypingTextArticle;
