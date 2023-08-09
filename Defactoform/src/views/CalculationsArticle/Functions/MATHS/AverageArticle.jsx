import React from "react";

class AverageArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "average" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>AVERAGE(number_1, number_2, . . .)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Returns the average of its arguments.
          <p>The AVERAGE function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "visible" }}
            >
              <table className="ResultsTable CalculationsHelp__formulaHelp table-striped">
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
                    <td>number_n</td>
                    <td>No</td>
                    <td>number</td>
                    <td>one or more numbers</td>
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
                "AVERAGE(1, 2, 3)",
                this.state.copyFormulaName,
                "// returns 2 ",
                2
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
                        data-offset-key="5fea5-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="5fea5-0-0">
                            <span data-text="true">AVERAGE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5fea5-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5fea5-2-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5fea5-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5fea5-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5fea5-5-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5fea5-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="5fea5-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="5fea5-8-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="5fea5-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="5fea5-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="5fea5-11-0">
                            <span data-text="true">"// returns 2"</span>
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

export default AverageArticle;
