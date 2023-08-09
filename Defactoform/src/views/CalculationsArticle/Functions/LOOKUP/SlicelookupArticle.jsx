import React from "react";

class SlicelookupArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "slicelookup" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>SLICE(array, from, to)</h3>
        <div className="CalculationsHelp__formulaHelp">
          Extracts elements from an array
          <p>The SLICE function accepts these arguments:</p>
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
                    <td>The provided array</td>
                  </tr>
                  <tr>
                    <td>from</td>
                    <td>No</td>
                    <td>number</td>
                    <td>The index to start from (0 is the first index).</td>
                  </tr>
                  <tr>
                    <td>to</td>
                    <td>Yes</td>
                    <td>number</td>
                    <td>
                      The index to end on. If left empty, will grab all elements
                      after the from index.
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
                "SLICE(ARRAY(1,2,3,4,4,5,6), 2, 4)",
                this.state.copyFormulaName,
                "// returns [3, 4] ",
                [3, 4]
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
                        data-offset-key="dqm64-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="dqm64-0-0">
                            <span data-text="true">SLICE</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token constant">
                          <span data-offset-key="dqm64-2-0">
                            <span data-text="true">ARRAY</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-3-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-4-0">
                            <span data-text="true">1</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-5-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-6-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-7-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-8-0">
                            <span data-text="true">3</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-9-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-10-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-11-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-12-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-13-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-14-0">
                            <span data-text="true">5</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-15-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-16-0">
                            <span data-text="true">6</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-17-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-18-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="dqm64-19-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-20-0">
                            <span data-text="true">2</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-21-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="dqm64-22-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token number">
                          <span data-offset-key="dqm64-23-0">
                            <span data-text="true">4</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="dqm64-24-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="dqm64-25-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="dqm64-26-0">
                            <span data-text="true">"// returns [3, 4]"</span>
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

export default SlicelookupArticle;
