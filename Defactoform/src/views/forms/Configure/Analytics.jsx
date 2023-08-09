import React from "react";
import "../../../../src/assets/custom/analytics.css";
import { DraftJS } from "megadraft";
import { GetData, PostData } from "../../../stores/requests";
import { FORM_ANALYTICS_URLS } from "../../../util/constants";
class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gAnalyticsId: "",
      fbPixelId: "",
      pgLoadScripts: "",
      submissionScripts: "",
    };
  }
  componentWillMount() {
    let currentFormId = localStorage.CurrentFormId;
    let URL = FORM_ANALYTICS_URLS.GET_FORM_ANALYTICS_URL + currentFormId;
    GetData(URL).then((result) => {
      let resultantJson = result.data.Item;
      if (resultantJson) {
        this.setState({
          gAnalyticsId: resultantJson.GoogleAnalyticsId,
          fbPixelId: resultantJson.FacebookPixelId,
          pgLoadScripts: resultantJson.PageLoadScripts,
          submissionScripts: resultantJson.SubmissionScripts,
        });
      }
    });
  }
  componentWillUnmount() {
    this.saveChange();
  }
  handleChange = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
  };
  saveChange = () => {
    let currentFormId = localStorage.CurrentFormId;
    let obj = {
      FormId: currentFormId,
      AnalyticId: DraftJS.genKey(),
      GoogleAnalyticsId: this.state.gAnalyticsId
        ? this.state.gAnalyticsId
        : null,
      FacebookPixelId: this.state.fbPixelId ? this.state.fbPixelId : null,
      PageLoadScripts: this.state.pgLoadScripts
        ? this.state.pgLoadScripts
        : null,
      SubmissionScripts: this.state.submissionScripts
        ? this.state.submissionScripts
        : null,
      CreatedAt: Date.now().toString(),
      CreatedBy: "1",
      UpdatedAt: Date.now().toString(),
      UpdatedBy: "1",
    };
    PostData(FORM_ANALYTICS_URLS.POST_FORM_ANALYTICS_URL, obj).then(
      (result) => {}
    );
  };
  submit = (e) => {
    e.preventDefault();
    this.saveChange();
  };
  render() {
    return (
      <form className="full-preview-page preview_page_style">
        <div className="col-md-12">
          <div className="row">
            <div className="Main-from-page">
              <div className="form-analytic">
                <h2 className="analytic-type">Analyse your visitors</h2>
                <p>
                  We support popular analytics platforms so you can understand
                  your users and their behaviour.
                  <a className="Analytic-tag" href="#pablo">
                    {" "}
                    Go to analytics{" "}
                  </a>
                  to see Paperform's built in analytics.
                </p>
                <div className="form-analyse mt-5">
                  <div className="Analytic-text">
                    Google Analytics
                    <div className="Field-configuration-i">
                      <svg
                        fill="currentColor"
                        preserveAspectRatio="xMidYMid meet"
                        height="1em"
                        width="1em"
                        viewBox="0 0 40 40"
                        style={{ verticalAlign: "middle" }}
                      >
                        <g>
                          <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                        </g>
                      </svg>
                      <div className="Form-analytic-page show-field">
                        <div className="Form-analytic-show">
                          Get started with google analytics
                        </div>
                      </div>
                    </div>
                  </div>

                  <input
                    className="Analytic-show-input"
                    placeholder="Google Analytics Tracking ID"
                    onChange={(e) => this.handleChange(e, "gAnalyticsId")}
                    value={this.state.gAnalyticsId}
                  />
                </div>
                <div className="form-analyse mt-5">
                  <div className="area-field">
                    <div className="Analytic-text">
                      Facebook Pixel
                      <div className="Field-configuration-i">
                        <svg
                          fill="currentColor"
                          preserveAspectRatio="xMidYMid meet"
                          height="1em"
                          width="1em"
                          viewBox="0 0 40 40"
                          style={{ verticalAlign: "middle" }}
                        >
                          <g>
                            <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                          </g>
                        </svg>
                        <div className="Form-analytic-page show-field">
                          <div className="Form-analytic-show">
                            Get started with Facebook Pixel
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    className="Analytic-show-input"
                    placeholder="Facebook Pixel ID"
                    onChange={(e) => this.handleChange(e, "fbPixelId")}
                    value={this.state.fbPixelId}
                  />
                </div>
                <div className="form-analyse mt-5">
                  <div className="area-field">
                    <div className="Analytic-text">
                      page-load-script
                      <div className="Field-configuration-i">
                        <svg
                          fill="currentColor"
                          preserveAspectRatio="xMidYMid meet"
                          height="1em"
                          width="1em"
                          viewBox="0 0 40 40"
                          style={{ verticalAlign: "middle" }}
                        >
                          <g>
                            <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                          </g>
                        </svg>
                        <div className="Form-analytic-page show-field">
                          <div className="Form-analytic-show">
                            Add script tags to load JavaScript when the page
                            loads.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="text-area-input text-area-field"
                    placeholder="Paste third party analytics scripts here..."
                    onChange={(e) => this.handleChange(e, "pgLoadScripts")}
                    value={this.state.pgLoadScripts}
                  />
                </div>
                <div className="form-analyse mt-5">
                  <div className="area-field">
                    <div className="Analytic-text">
                      Successful submission scripts
                      <div className="Field-configuration-i">
                        <svg
                          fill="currentColor"
                          preserveAspectRatio="xMidYMid meet"
                          height="1em"
                          width="1em"
                          viewBox="0 0 40 40"
                          style={{ verticalAlign: "middle" }}
                        >
                          <g>
                            <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                          </g>
                        </svg>
                        <div className="Form-analytic-page show-field">
                          <div className="Form-analytic-show">
                            Add script tags to load JavaScript when the form is
                            submitted.
                          </div>
                        </div>
                      </div>
                    </div>
                    <textarea
                      className="text-area-input text-area-field"
                      placeholder="Paste conversion tracking scripts here..."
                      onChange={(e) =>
                        this.handleChange(e, "submissionScripts")
                      }
                      value={this.state.submissionScripts}
                    />
                  </div>
                </div>
                <button value="submit" onClick={(e) => this.submit(e)}>
                  submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Analytics;
