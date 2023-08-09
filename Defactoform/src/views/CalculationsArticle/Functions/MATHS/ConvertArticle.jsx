import React from "react";

class ConvertArticle extends React.Component {
  constructor() {
    super();
    this.state = {
      copyFormulaName: "convert",
      fromUnitshowResults: false,
      fromUnitShowOptions: "Show Options",
      toUnitshowResults: false,
      toUnitShowOptions: "Show Options",
    };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  onClick = (result, Options) => {
    result = result === true ? false : true;
    Options = Options === "Show Options" ? "Hide Options" : "Show Options";
    this.setState({
      fromUnitshowResults: result,
      fromUnitShowOptions: Options,
    });
  };
  ontoUnitClick = (result, Options) => {
    result = result === true ? false : true;
    Options = Options === "Show Options" ? "Hide Options" : "Show Options";
    this.setState({ toUnitshowResults: result, toUnitShowOptions: Options });
  };
  render() {
    return (
      <div>
        <h3>CONVERT(number, from_unit, to_unit)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Converts a number from one measurement system to another.
          <p>The CONVERT function accepts these arguments:</p>
          <div style={{ position: "relative" }}>
            <div
              className="ResultsTable__wrapper "
              style={{ overflow: "visible" }}
            >
              <table class="ResultsTable CalculationsHelp__formulaHelp  table-striped">
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
                    <td>number</td>
                    <td>No</td>
                    <td>number</td>
                    <td>the number to convert</td>
                  </tr>
                  <tr>
                    <td>from_unit</td>
                    <td>No</td>
                    <td>option</td>
                    <td>
                      <div
                        class="BtnV2 BtnV2--raised BtnV2--primary BtnV2--square"
                        tabindex="-1"
                        onClick={(event) =>
                          this.onClick(
                            this.state.fromUnitshowResults,
                            this.state.fromUnitShowOptions
                          )
                        }
                      >
                        <span>{this.state.fromUnitShowOptions}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>to_unit</td>
                    <td>No</td>
                    <td>option</td>
                    <td>
                      <div
                        class="BtnV2 BtnV2--raised BtnV2--primary BtnV2--square"
                        tabindex="-1"
                        onClick={(event) =>
                          this.ontoUnitClick(
                            this.state.toUnitshowResults,
                            this.state.toUnitShowOptions
                          )
                        }
                      >
                        <span>{this.state.toUnitShowOptions}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {(this.state.fromUnitshowResults || this.state.toUnitshowResults) && (
            <div style={{ position: "relative" }}>
              <div
                class="ResultsTable__wrapper"
                style={{ overflow: "visible" }}
              >
                <table class="ResultsTable table-striped">
                  <thead>
                    <tr>
                      <td colspan="1">Option</td>
                      <td colspan="3">Description</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="1">g</td>
                      <td colspan="3">grams</td>
                    </tr>
                    <tr>
                      <td colspan="1">lbm</td>
                      <td colspan="3">pound ( mass )</td>
                    </tr>
                    <tr>
                      <td colspan="1">ozm</td>
                      <td colspan="3">ounce ( mass )</td>
                    </tr>
                    <tr>
                      <td colspan="1">m</td>
                      <td colspan="3">meter</td>
                    </tr>
                    <tr>
                      <td colspan="1">in</td>
                      <td colspan="3">inch</td>
                    </tr>
                    <tr>
                      <td colspan="1">ft</td>
                      <td colspan="3">foot</td>
                    </tr>
                    <tr>
                      <td colspan="1">yd</td>
                      <td colspan="3">yard</td>
                    </tr>
                    <tr>
                      <td colspan="1">mi</td>
                      <td colspan="3">mile</td>
                    </tr>
                    <tr>
                      <td colspan="1">yr</td>
                      <td colspan="3">year</td>
                    </tr>
                    <tr>
                      <td colspan="1">d</td>
                      <td colspan="3">day</td>
                    </tr>
                    <tr>
                      <td colspan="1">hr</td>
                      <td colspan="3">hour</td>
                    </tr>
                    <tr>
                      <td colspan="1">min</td>
                      <td colspan="3">minute</td>
                    </tr>
                    <tr>
                      <td colspan="1">s</td>
                      <td colspan="3">second</td>
                    </tr>
                    <tr>
                      <td colspan="1">C</td>
                      <td colspan="3">degrees celsius</td>
                    </tr>
                    <tr>
                      <td colspan="1">F</td>
                      <td colspan="3">degress fahrenheit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <a
            href="#pablo"
            className="a-copy"
            onClick={() =>
              this.copyformula(
                'CONVERT(10, "in", "cm")',
                this.state.copyFormulaName,
                "// returns 25.4 ",
                25.4
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
                        data-offset-key="8l4ub-0-0"
                        class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="8l4ub-0-0">
                            <span data-text="true">CONVERT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l4ub-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="8l4ub-2-0">
                            <span data-text="true">10</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l4ub-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l4ub-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="8l4ub-5-0">
                            <span data-text="true">"in"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l4ub-6-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="8l4ub-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="8l4ub-8-0">
                            <span data-text="true">"cm"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="8l4ub-9-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="8l4ub-10-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="8l4ub-11-0">
                            <span data-text="true">"// returns 25.4"</span>
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

export default ConvertArticle;
