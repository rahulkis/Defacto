import React from "react";

class DivideArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyData: "4 / 2", copyFormulaName: "divide" };
  }
  copyformula = (copyData, copyFormulaName) => {
    this.props.copyformula(copyData, copyFormulaName);
  };
  render() {
    return (
      <div>
        <h3>Divide /</h3>
        <p>Dividing numbers can be done using the / sign.</p>
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
                            <span data-text="true">4 / 2</span>
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

export default DivideArticle;
