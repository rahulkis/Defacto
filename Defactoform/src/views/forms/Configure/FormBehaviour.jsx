import React from "react";
import "../../../../src/assets/custom/formbehaviour.css";
import Switch from "@material-ui/core/Switch";
import { DraftJS } from "megadraft";
import DateTimePicker from "react-datetime-picker";
import { PostData, GetData, UpdateData } from "../../../stores/requests";
import { editorStateFromRaw } from "megadraft";
import { convertToRaw } from "draft-js";
import image from "../../../MegaEditor/plugins/image";
import video from "../../../MegaEditor/plugins/video";
import MegadraftEditor from "../../../MegaEditor/components/MegadraftEditor";
import actions from "megadraft/lib/actions/default";
import { FORM_BEHAVIOUR_URLS } from "../../../util/constants";
const Block = {
  UNSTYLED: "unstyled",
  PARAGRAPH: "unstyled",
  OL: "ordered-list-item",
  UL: "unordered-list-item",
  H1: "header-one",
  H2: "header-two",
  H3: "header-three",
  H4: "header-four",
  H5: "header-five",
  H6: "header-six",
  CODE: "code-block",
  BLOCKQUOTE: "blockquote",
  PULLQUOTE: "pullquote",
  ATOMIC: "atomic",
  BLOCKQUOTE_CAPTION: "block-quote-caption",
  CAPTION: "caption",
  TODO: "todo",
  IMAGE: "atomic:image",
  BREAK: "atomic:break",
};
class HeaderOneIcon extends React.Component {
  render() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M11.58,19.86H9.69v-6.57H2.53v6.57H0.65V5.64h1.88v6.11h7.17V5.64h1.88V19.86z M20.38,19.86h-1.82V7.82l-3.64,1.34V7.52l5.18-1.94h0.28V19.86z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}
class FormBehaviour extends React.Component {
  constructor(props) {
    super(props);
    const myContent = {
      entityMap: {},
      blocks: [
        {
          key: "ag6qs",
          text: "Submission Closed",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
    };
    let editorState = editorStateFromRaw(myContent);
    this.state = {
      requireCaptcha: false,
      disableResultStorage: false,
      autoSave: false,
      scoring: false,
      customCloseSubmissionPage: false,
      disableSubmission: false,
      disableafterMaxOfSubmission: false,
      FormBehaviourId: "",
      maxSubmission: "",
      initialScore: "",
      editorState,
    };
    this.currentFormId = localStorage.CurrentFormId;
  }
  componentWillMount() {
    const URL = FORM_BEHAVIOUR_URLS.GET_FORM_BEHAVIOUR_URL + this.currentFormId;
    GetData(URL).then((result) => {
      if (result.data.Items.length > 0) {
        let resultantItem = result.data.Items[0];
        this.setState({
          FormBehaviourId: resultantItem.FormBehaviourId,
          requireCaptcha: resultantItem.RequireCaptcha,
          disableResultStorage: resultantItem.DisableResultStorage,
          autoSave: resultantItem.AutoSave,
          scoring: resultantItem.Scoring,
          customCloseSubmissionPage: resultantItem.CustomCloseSubmissionPage,
          closedt: resultantItem.SubmissionCloseDateTime
            ? new Date(resultantItem.SubmissionCloseDateTime)
            : null,
          opendt: resultantItem.SubmissionOpenDateTime
            ? new Date(resultantItem.SubmissionOpenDateTime)
            : null,
          disableafterMaxOfSubmission:
            resultantItem.DisableAfterMaxOfSubmission,
          disableSubmission: resultantItem.DisableSubmission,
        });
        if (resultantItem.Scoring)
          this.setState({ scoring: resultantItem.Scoring });
        if (resultantItem.DisableAfterMaxOfSubmission) {
          this.setState({
            disableafterMaxOfSubmission:
              resultantItem.DisableAfterMaxOfSubmission,
          });
          this.setState({
            maxSubmission: resultantItem.MaxSubmission,
          });
        }
        if (resultantItem.CustomCloseSubmissionPage)
          this.setState({
            editorState: editorStateFromRaw(
              JSON.parse(resultantItem.SubmissionPageData)
            ),
          });
      }
    });
  }
  handleSwitchChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };
  handleSubmissionOpenDateTime = (opendt) => {
    this.setState({ opendt });
  };
  handleSubmissionCloseDateTime = (closedt) => {
    this.setState({ closedt });
  };
  removeRestriction = (name) => {
    this.setState({ [name]: "" });
  };
  handleInputChange = (event, name) => {
    this.setState({ [name]: event.target.value });
  };
  componentWillUnmount = () => {
    this.saveFormBehaviour();
  };
  saveFormBehaviour = () => {
    let rawValue = convertToRaw(this.state.editorState.getCurrentContent());
    let editorStateRawData = JSON.stringify(rawValue);
    let formBehaviourObj = {
      FormId: this.currentFormId,
      FormBehaviourId: DraftJS.genKey(),
      RequireCaptcha: this.state.requireCaptcha,
      DisableResultStorage: this.state.disableResultStorage,
      AutoSave: this.state.autoSave,
      Scoring: this.state.scoring,
      CustomCloseSubmissionPage: this.state.customCloseSubmissionPage,
      DisableSubmission: this.state.disableSubmission,
      DisableAfterMaxOfSubmission: this.state.disableafterMaxOfSubmission,
      SubmissionOpenDateTime: this.state.opendt ? this.state.opendt : null,
      SubmissionCloseDateTime: this.state.closedt ? this.state.closedt : null,
      CreatedAt: Date.now().toString(),
      CreatedBy: "1",
      UpdatedAt: Date.now().toString(),
      UpdatedBy: "1",
    };
    if (this.state.scoring)
      formBehaviourObj.InitialScore = this.state.initialScore
        ? this.state.initialScore
        : null;
    if (this.state.disableafterMaxOfSubmission) {
      formBehaviourObj.MaxSubmission = this.state.maxSubmission
        ? this.state.maxSubmission
        : null;
    }
    if (this.state.customCloseSubmissionPage)
      formBehaviourObj.SubmissionPageData = editorStateRawData;
    if (this.state.FormBehaviourId) {
      formBehaviourObj.FormBehaviourId = this.state.FormBehaviourId;
      UpdateData(
        FORM_BEHAVIOUR_URLS.POST_FORM_BEHAVIOUR_URL,
        formBehaviourObj
      ).then((result) => {});
    } else {
      PostData(
        FORM_BEHAVIOUR_URLS.POST_FORM_BEHAVIOUR_URL,
        formBehaviourObj
      ).then((result) => {});
    }
  };
  onChange = (editorState) => {
    this.setState({ editorState });
  };
  render() {
    const customActions = actions.concat([
      { type: "block", label: "H1", style: Block.H1, icon: HeaderOneIcon },
    ]);
    return (
      <div className="form-behaviour-page">
        <div className="behaviour-page">
          <div className="Main-from-page">
            <div className="form-behaviour">
              <h2 className="form-behaviour-Type">Form Behaviour</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="behaviour-text">
                    Require captcha verification
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
                      <br />

                      <div
                        className="behaviour-show-field show-field"
                        style={{ top: "-62px" }}
                      >
                        <div className="toggle-behaviour-text">
                          <span>
                            When enabled, submitters are verified as human using
                            <a
                              href="https://www.google.com/recaptcha/intro/invisible.html"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Google Invisible reCAPTCHA
                            </a>
                            . The Invisible reCAPTCHA means that most submitters
                            will not have to do anything extra to verify they
                            are human.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={this.state.requireCaptcha}
                    onChange={this.handleSwitchChange("requireCaptcha")}
                    value="requireCaptcha"
                    color="primary"
                  />

                  <div className="disable-toggle">
                    <div className="behaviour-text">
                      Disable storage of results on DefactoForm
                    </div>
                  </div>
                  <div className="toggle-description">
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
                    <span className="Defacto-help-style">
                      Toggle this on if you don't want results stored on
                      DefactoForm. Note that results are temporarily held if
                      emails or webhooks are sent on submission.
                    </span>
                  </div>

                  <Switch
                    checked={this.state.disableResultStorage}
                    onChange={this.handleSwitchChange("disableResultStorage")}
                    value="disableResultStorage"
                    color="primary"
                  />
                </div>
                <div className="col-md-6">
                  <div className="behaviour-text">
                    {" "}
                    Hide form from search engine results
                  </div>
                  <Switch
                    checked={this.state.hideFromSearchEngine}
                    onChange={this.handleSwitchChange("hideFromSearchEngine")}
                    value="hideFromSearchEngine"
                    color="primary"
                  />
                  <div className="disable-toggle">
                    <div className="behaviour-text">
                      {" "}
                      Automatic save and resume later{" "}
                    </div>
                    <Switch
                      checked={this.state.autoSave}
                      onChange={this.handleSwitchChange("autoSave")}
                      value="autoSave"
                      color="primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="Main-from-page">
            <div className="form-behaviour">
              <h2 className="form-behaviour-Type">Form Availability</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="behaviour-text">Disable submissions</div>
                  <Switch
                    checked={this.state.disableSubmission}
                    onChange={this.handleSwitchChange("disableSubmission")}
                    value="disableSubmission"
                    color="primary"
                  />
                  <div className="submission-open">
                    <div className="behaviour-text">
                      Submissions open after date/time
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
                        <br />
                        <div className="behaviour-show-field show-field">
                          <div className="toggle-behaviour-text">
                            When this is set, submissions will be closed before
                            this time. The time is in your current timezone.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DateTimePicker
                    onChange={(opendt) =>
                      this.handleSubmissionOpenDateTime(opendt)
                    }
                    value={this.state.opendt}
                  />
                  {/* <input type="date" classame="input-calender" onChange={this.handleCalenderChange("submissionOpenDateTime")}/> */}
                  {this.state.opendt && (
                    <button
                      className="remove-restriction"
                      onClick={() => this.removeRestriction("opendt")}
                    >
                      Remove Restriction
                    </button>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="behaviour-text">
                    {" "}
                    Disable after a maximum number of submissions{" "}
                  </div>

                  <Switch
                    checked={this.state.disableafterMaxOfSubmission}
                    onChange={this.handleSwitchChange(
                      "disableafterMaxOfSubmission"
                    )}
                    value="disableafterMaxOfSubmission"
                    color="primary"
                  />
                  <input
                    type="number"
                    placeholder="Maximum number of submission"
                    value={this.state.maxSubmission}
                    onChange={(e) => this.handleInputChange(e, "maxSubmission")}
                    disabled={!this.state.disableafterMaxOfSubmission}
                    className="input-number-text"
                  />

                  <div className="disable-toggle">
                    <div className="behaviour-text">
                      Submissions close after date/time
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
                        <br />
                        <div className="behaviour-show-field show-field">
                          <div className="toggle-behaviour-text">
                            When this is set, submissions will be closed before
                            this time. The time is in your current timezone.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DateTimePicker
                    onChange={(closedt) =>
                      this.handleSubmissionCloseDateTime(closedt)
                    }
                    value={this.state.closedt}
                  />
                  {this.state.closedt && (
                    <button
                      className="remove-restriction"
                      onClick={() => this.removeRestriction("closedt")}
                    >
                      Remove Restriction
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="behaviour-page">
          <div className="Main-from-page">
            <div className="form-behaviour">
              <h2 className="form-behaviour-Type">
                Custom Closed Submissions Page{" "}
              </h2>
              <Switch
                checked={this.state.customCloseSubmissionPage}
                onChange={this.handleSwitchChange("customCloseSubmissionPage")}
                value="customCloseSubmissionPage"
                color="primary"
              />
              <div className="input-paragraph">
                {this.state.customCloseSubmissionPage && (
                  <div>
                    <hr />
                    <MegadraftEditor
                      editorState={this.state.editorState}
                      actions={customActions}
                      onChange={this.onChange}
                      plugins={[image, video]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="behaviour-page">
          <div className="Main-from-page">
            <div className="form-behaviour mb-5">
              <h2 className="form-behaviour-Type">Scoring</h2>
              <Switch
                checked={this.state.scoring}
                onChange={this.handleSwitchChange("scoring")}
                value="scoring"
                color="primary"
              />
              {this.state.scoring && (
                <div
                  id="console-event"
                  className="ResultsTable-wrapper  Results-noscroll"
                >
                  <div className="input-paragraph">
                    <p>
                      The score is calculated by defining a set of actions that
                      are applied to the initial score when questions are
                      answered in a specific way. Rules are applied to the score
                      in the order they are listed below.
                    </p>
                  </div>
                  <div className="behaviour-text">
                    Initial Score
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
                      <br />
                      <div className="behaviour-show-field show-field mt-3">
                        <div className="toggle-behaviour-text">
                          This is the score before any of the rules below are
                          applied.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-value">
                    <input
                      className="input-number"
                      type="number"
                      minvalue="0"
                      maxvalue="100"
                      placeholder="0"
                      onChange={(e) =>
                        this.handleInputChange(e, "initialScore")
                      }
                      value={this.state.initialScore}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FormBehaviour;
