import React from "react";

class DateFormatArticle extends React.Component {
  constructor() {
    super();
    this.state = { copyFormulaName: "dateformat" };
  }
  copyformula = (copyData, copyFormulaName, commentText, resultData) => {
    this.props.copyformula(copyData, copyFormulaName, commentText, resultData);
  };
  render() {
    return (
      <div>
        <h3>DATEFORMAT(date, format )</h3>
        <div className="CalculationsHelp__formulaHelp">
          Format a date or time string.
          <p>The DATEFORMAT function accepts these arguments:</p>
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
                    <td>date</td>
                    <td>No</td>
                    <td>date</td>
                    <td>a date to format</td>
                  </tr>
                  <tr>
                    <td>format</td>
                    <td>No</td>
                    <td>text</td>
                    <td>
                      <div>
                        <p>
                          A date format string, see table below for a reference
                          of what date format strings can contain.
                        </p>
                        <table>
                          <thead>
                            <tr>
                              <th>Unit</th>
                              <th>Token</th>
                              <th>Result examples</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Month</td>
                              <td>M</td>
                              <td>1, 2, ..., 12</td>
                            </tr>
                            <tr>
                              <td />
                              <td>Mo</td>
                              <td>1st, 2nd, ..., 12th</td>
                            </tr>
                            <tr>
                              <td />
                              <td>MM</td>
                              <td>01, 02, ..., 12</td>
                            </tr>
                            <tr>
                              <td />
                              <td>MMM</td>
                              <td>Jan, Feb, ..., Dec</td>
                            </tr>
                            <tr>
                              <td />
                              <td>MMMM</td>
                              <td>January, February, ..., December</td>
                            </tr>
                            <tr>
                              <td>Quarter</td>
                              <td>Q</td>
                              <td>1, 2, 3, 4</td>
                            </tr>
                            <tr>
                              <td />
                              <td>Qo</td>
                              <td>1st, 2nd, 3rd, 4th</td>
                            </tr>
                            <tr>
                              <td>Day of month</td>
                              <td>D</td>
                              <td>1, 2, ..., 31</td>
                            </tr>
                            <tr>
                              <td />
                              <td>Do</td>
                              <td>1st, 2nd, ..., 31st</td>
                            </tr>
                            <tr>
                              <td />
                              <td>DD</td>
                              <td>01, 02, ..., 31</td>
                            </tr>
                            <tr>
                              <td>Day of year</td>
                              <td>DDD</td>
                              <td>1, 2, ..., 366</td>
                            </tr>
                            <tr>
                              <td />
                              <td>DDDo</td>
                              <td>1st, 2nd, ..., 366th</td>
                            </tr>
                            <tr>
                              <td />
                              <td>DDDD</td>
                              <td>001, 002, ..., 366</td>
                            </tr>
                            <tr>
                              <td>Day of week</td>
                              <td>d</td>
                              <td>0, 1, ..., 6</td>
                            </tr>
                            <tr>
                              <td />
                              <td>do</td>
                              <td>0th, 1st, ..., 6th</td>
                            </tr>
                            <tr>
                              <td />
                              <td>dd</td>
                              <td>Su, Mo, ..., Sa</td>
                            </tr>
                            <tr>
                              <td />
                              <td>ddd</td>
                              <td>Sun, Mon, ..., Sat</td>
                            </tr>
                            <tr>
                              <td />
                              <td>dddd</td>
                              <td>Sunday, Monday, ..., Saturday</td>
                            </tr>
                            <tr>
                              <td>Day of ISO week</td>
                              <td>E</td>
                              <td>1, 2, ..., 7</td>
                            </tr>
                            <tr>
                              <td>ISO week</td>
                              <td>W</td>
                              <td>1, 2, ..., 53</td>
                            </tr>
                            <tr>
                              <td />
                              <td>Wo</td>
                              <td>1st, 2nd, ..., 53rd</td>
                            </tr>
                            <tr>
                              <td />
                              <td>WW</td>
                              <td>01, 02, ..., 53</td>
                            </tr>
                            <tr>
                              <td>Year</td>
                              <td>YY</td>
                              <td>00, 01, ..., 99</td>
                            </tr>
                            <tr>
                              <td />
                              <td>YYYY</td>
                              <td>1900, 1901, ..., 2099</td>
                            </tr>
                            <tr>
                              <td>ISO week-numbering year</td>
                              <td>GG</td>
                              <td>00, 01, ..., 99</td>
                            </tr>
                            <tr>
                              <td />
                              <td>GGGG</td>
                              <td>1900, 1901, ..., 2099</td>
                            </tr>
                            <tr>
                              <td>AM/PM</td>
                              <td>A</td>
                              <td>AM, PM</td>
                            </tr>
                            <tr>
                              <td />
                              <td>a</td>
                              <td>am, pm</td>
                            </tr>
                            <tr>
                              <td />
                              <td>aa</td>
                              <td>a.m., p.m.</td>
                            </tr>
                            <tr>
                              <td>Hour</td>
                              <td>H</td>
                              <td>0, 1, ... 23</td>
                            </tr>
                            <tr>
                              <td />
                              <td>HH</td>
                              <td>00, 01, ... 23</td>
                            </tr>
                            <tr>
                              <td />
                              <td>h</td>
                              <td>1, 2, ..., 12</td>
                            </tr>
                            <tr>
                              <td />
                              <td>hh</td>
                              <td>01, 02, ..., 12</td>
                            </tr>
                            <tr>
                              <td>Minute</td>
                              <td>m</td>
                              <td>0, 1, ..., 59</td>
                            </tr>
                            <tr>
                              <td />
                              <td>mm</td>
                              <td>00, 01, ..., 59</td>
                            </tr>
                            <tr>
                              <td>Second</td>
                              <td>s</td>
                              <td>0, 1, ..., 59</td>
                            </tr>
                            <tr>
                              <td />
                              <td>ss</td>
                              <td>00, 01, ..., 59</td>
                            </tr>
                            <tr>
                              <td>1/10 of second</td>
                              <td>S</td>
                              <td>0, 1, ..., 9</td>
                            </tr>
                            <tr>
                              <td>1/100 of second</td>
                              <td>SS</td>
                              <td>00, 01, ..., 99</td>
                            </tr>
                            <tr>
                              <td>Millisecond</td>
                              <td>SSS</td>
                              <td>000, 001, ..., 999</td>
                            </tr>
                            <tr>
                              <td>Timezone</td>
                              <td>Z</td>
                              <td>-01:00, +00:00, ... +12:00</td>
                            </tr>
                            <tr>
                              <td />
                              <td>ZZ</td>
                              <td>-0100, +0000, ..., +1200</td>
                            </tr>
                            <tr>
                              <td>Seconds timestamp</td>
                              <td>X</td>
                              <td>512969520</td>
                            </tr>
                            <tr>
                              <td>Milliseconds timestamp</td>
                              <td>x</td>
                              <td>512969520900</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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
                'DATEFORMAT("2019-10-21", "YYYY-DD-MM")',
                this.state.copyFormulaName,
                "// returns {'2019-21-10'} ",
                "2019-21-10"
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
                      data-block="true"
                      data-editor="6tek1"
                      data-offset-key="bcjfm-0-0"
                    >
                      <div
                        data-offset-key="bcjfm-0-0"
                        className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                      >
                        <span className="prism-token token constant">
                          <span data-offset-key="bcjfm-0-0">
                            <span data-text="true">DATEFORMAT</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bcjfm-1-0">
                            <span data-text="true">(</span>
                          </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="bcjfm-2-0">
                            <span data-text="true">"2019-10-21"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bcjfm-3-0">
                            <span data-text="true">,</span>
                          </span>
                        </span>
                        <span data-offset-key="bcjfm-4-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token string">
                          <span data-offset-key="bcjfm-5-0">
                            <span data-text="true">"YYYY-DD-MM"</span>
                          </span>
                        </span>
                        <span className="prism-token token punctuation">
                          <span data-offset-key="bcjfm-6-0">
                            <span data-text="true">)</span>
                          </span>
                        </span>
                        <span data-offset-key="bcjfm-7-0">
                          <span data-text="true"> </span>
                        </span>
                        <span className="prism-token token comment">
                          <span data-offset-key="bcjfm-8-0">
                            <span data-text="true">
                              "// returns "2019-21-10""
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

export default DateFormatArticle;
