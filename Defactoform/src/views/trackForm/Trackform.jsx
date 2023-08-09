import React from "react";
import "../../../src/assets/custom/formdetails.css";
import { GetData, PostData } from "../../stores/requests";
import { FORM_URLS, TRACKFORM_URLS } from "../../util/constants";
import { editorStateFromRaw } from "megadraft";
import { DraftJS } from "megadraft";
import { convertToRaw } from "draft-js";
import TrackFormListing from "../trackForm/TrackFormListing";
import ProjectDetail from "../trackForm/projectDetail";
import Loader from "../../components/Common/Loader";

export {
  Block,
  Inline,
  Entity,
  HANDLED,
  NOT_HANDLED,
} from "../../util/constants";
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
  LeftAlign: "leftAlign",
  RightAlign: "rightAlign",
  CenterAlign: "centerAlign",
};

export default class trackform extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      formurl: "",
      isValidUrl: false,
      isSubmitted: false,
      formName: "",
      fields: [],
      availableSession: 2000,
      formId: "",
      isFormCreation: false,
      activeSessionclass:
        "btn active btn-big flex flex-direction-column justify-content-center mrb",
      InactiveSessionClass:
        "btn  btn-big flex flex-direction-column justify-content-center mrb",
    };
    this.showForm = this.showForm.bind(this);
  }
  componentWillMount() {
    // this.formJSON = JSON.parse(localStorage.getItem("formJSON"));
  }

  saveFieldData = (editorState, formId) => {
    let formJSON = [];
    const rawValue = convertToRaw(editorState.getCurrentContent());
    let text = [];
    let type = [];
    for (let i = 0; i < rawValue.blocks.length; i++) {
      if (rawValue.blocks[i].type !== Block.ATOMIC) {
        text.push(rawValue.blocks[i].text);
        type.push(rawValue.blocks[i].type);
      }
    }
    let rawBlocksLength = rawValue.blocks.length;
    // let imgCount = 0;
    // let controlListArray = []; //this.controlListArray ;

    for (let i = 0; i < rawBlocksLength; i++) {
      if (rawValue.blocks[i].type === Block.ATOMIC) {
        let blocks = rawValue.blocks[i];
        const blockData = blocks.data;
        const blockDataType = blockData.type;
        if (blockDataType === "related-articles") {
          let controlData = rawValue.blocks[i].data.articles;
          let controlDataArr = JSON.parse(JSON.stringify(controlData));
          let controlDataArrLen = controlDataArr.length;
          for (let c = 0; c < controlDataArrLen; c++) {
            let controlObj = Object.assign({}, "");
            controlObj.key = controlDataArr[c].key;
            controlObj.control =
              controlDataArr[c].control === ""
                ? "Text"
                : controlDataArr[c].control;
            controlObj.title = controlDataArr[c].title;
            controlObj.averageTime = 0;
            controlObj.focusTime = 0;
            controlObj.interactionCount = 0;
            console.log("this.controlListArray:", this.controlListArray);

            formJSON.push(controlObj);
          }
        }
      }
    }

    // localStorage.setItem("controlList",JSON.stringify(this.controlListArray));
    this.setState({ fields: formJSON, formId: formId });
    //console.log(formJSON);
  };
  launchFormFieldfinder = (e) => {
    this.setState({ isSubmitted: true });
    if (this.validateForm()) {
      let formId = this.state.formurl
        .toLowerCase()
        .replace(window.location.origin + "/preview/previewform/", "");
      GetData(FORM_URLS.GET_FORM_BY_URL + formId.toLowerCase()).then(
        (result) => {
          if (
            result != null &&
            result.Items !== undefined &&
            result.Items.length > 0
          ) {
            this.saveFieldData(
              editorStateFromRaw(JSON.parse(result.Items[0].EditorState)),
              result.Items[0].FormId
            );
          } else {
            this.setState({ fields: [] });
          }
        }
      );
    }
  };

  setSessionValue = (value) => {
    this.setState({ availableSession: value });
  };
  validateForm = () => {
    let validate = true;
    let isValidUrl = true;
    if (this.state.formurl === "") {
      validate = false;
    }
    if (this.state.formName === "") {
      validate = false;
    }
    let url = this.state.formurl
      .toLowerCase()
      .replace(
        window.location.origin.toLowerCase() + "/preview/previewform/",
        ""
      );

    if (
      this.state.formurl
        .toLowerCase()
        .indexOf(
          window.location.origin.toLowerCase() + "/preview/previewform/"
        ) === -1 ||
      url === ""
    ) {
      validate = false;
      isValidUrl = false;
    }
    this.setState({ isValidUrl: isValidUrl });
    return validate;
  };

  showForm = () => {
    this.setState({
      isFormCreation: true,
      isTrackingDetail: false,
    });
  };
  showTrackList = () => {
    this.setState({ isFormCreation: false, isTrackingDetail: false });
  };
  showTrackingDetail = (e, track) => {
    this.setState({ isTrackingDetail: true, trackdetail: track });
  };

  saveFormTracking = (e) => {
    let formModel = {
      TrackingId: DraftJS.genKey(),
      FormId: this.state.formId,
      FormName: this.state.formName,
      AvailableSessions: this.state.availableSession,
      TrackingFields: JSON.stringify(this.state.fields),
      CreatedAt: Date.now(),
      CreatedBy: 1,
      VisitCount: 0,
      FailedSubmission: 0,
      SubmissionCount: 0,
      VisitingTime: Date.now(),
      UsedSession: 0,
    };

    try {
      PostData(TRACKFORM_URLS.ADD_TRACKING_FORM, formModel).then((result) => {
        this.setState({ isFormCreation: false, isTrackingDetail: false });
      });
    } catch (err) {}
    window.alert("saved successfully");
  };

  removeField = (e, index) => {
    let array = [...this.state.fields]; // make a separate copy of the array
    array.splice(index, 1);
    this.setState({ fields: array });
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div className="content" style={{ overflowY: "auto" }}>
        {this.state.isFormCreation && !this.state.isTrackingDetail && (
          <div>
            <div className="divbox">
              <div className="row">
                <div className="col-md-9">
                  <fieldset>
                    <legend>Report Detail</legend>
                    <div className="mbb">
                      <label for="name">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.formName}
                        onChange={(e) =>
                          this.setState({ formName: e.target.value })
                        }
                      />

                      {this.state.isSubmitted && this.state.formName === "" && (
                        <div className="form-error">
                          {" "}
                          This field is required.{" "}
                        </div>
                      )}
                    </div>
                    <div>
                      <label>Sessions</label>
                      <div className="help-text no-margin-top">
                        The Form analysis report should record:
                      </div>
                      <div
                        className="flex"
                        tooltip="You can't change the number of sessions once Form tracking is active."
                      >
                        <div
                          onClick={() => this.setSessionValue(1000)}
                          className={
                            this.state.availableSession === 1000
                              ? this.state.activeSessionclass
                              : this.state.InactiveSessionClass
                          }
                        >
                          <span className="badge-holder">
                            <div plan="'basic'">
                              <span className="badge badge-plan basic">
                                basic
                              </span>
                            </div>
                          </span>
                          <div class="value">1,000</div>
                          <span className="label">Sessions</span>

                          <i class="fa fa-check-circle" aria-hidden="true" />
                        </div>
                        <div
                          onClick={() => this.setSessionValue(2000)}
                          className={
                            this.state.availableSession === 2000
                              ? this.state.activeSessionclass
                              : this.state.InactiveSessionClass
                          }
                        >
                          <span className="badge-holder">
                            <div plan="basic">
                              <span className="badge badge-plan basic">
                                premium
                              </span>
                            </div>
                          </span>
                          <div class="value">2,000</div>
                          <span className="label">Sessions</span>
                          <i class="fa fa-check-circle" aria-hidden="true" />
                        </div>
                        <div
                          onClick={() => this.setSessionValue(5000)}
                          className={
                            this.state.availableSession === 5000
                              ? this.state.activeSessionclass
                              : this.state.InactiveSessionClass
                          }
                        >
                          <span className="badge-holder">
                            <div plan="'basic'">
                              <span className="badge badge-plan basic">
                                buisness
                              </span>
                            </div>
                          </span>
                          <div class="value">5,000</div>
                          <span className="label">Sessions</span>
                          <i class="fa fa-check-circle" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="divbox">
              <div className="row">
                <div className="col-md-9">
                  <fieldset>
                    <legend>Import form</legend>
                    <div className="mbb">
                      <label>Form url</label>
                      <div className="help-text no-margin-top">
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.formurl}
                          onChange={(e) =>
                            this.setState({ formurl: e.target.value })
                          }
                        />
                        {this.state.isSubmitted &&
                          this.state.formurl === "" && (
                            <div className="form-error">
                              {" "}
                              This field is required.{" "}
                            </div>
                          )}
                        {this.state.isSubmitted &&
                          (this.state.formurl !== "" &&
                            this.state.isValidUrl === false) && (
                            <div className="form-error">
                              {" "}
                              This Form url is invalid .{" "}
                            </div>
                          )}
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <button
                    className="btn btn-default"
                    type="button"
                    disabled={!this.state.formurl}
                    onClick={(e) => this.launchFormFieldfinder(e)}
                  >
                    <span className="icon-open-new-window" />
                    <span>Launch Form Finder</span>
                  </button>
                </div>
              </div>
            </div>
            {this.state.isSubmitted &&
              (this.state.formurl !== "" && this.state.isValidUrl === true) && (
                <div className="divbox">
                  <div className="row">
                    <div className="col-sm-6">
                      <p>
                        {" "}
                        <strong>Form fields</strong>
                      </p>
                      <ul className="p-0">
                        {this.state.fields.length > 0 &&
                          this.state.fields.map((data, i) =>
                            data.control !== "simpletext" ? (
                              <li className="list-group-item mb-3 shadow-sm">
                                <div className="name-list-item mb-2">
                                  <span>
                                    <strong>
                                      <h5 className="float-left mr-2">{i}:</h5>{" "}
                                      {data.title !== ""
                                        ? data.title
                                        : "Untitled"}{" "}
                                    </strong>
                                  </span>{" "}
                                  <button
                                    type="button"
                                    onClick={(e) => this.removeField(e, i)}
                                    class="close"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>{" "}
                                </div>
                                <div className="filed-type ml-3 mr-3 pt-1">
                                  <p className="mb-0">
                                    Field type: <strong>{data.control}</strong>
                                  </p>
                                </div>
                              </li>
                            ) : (
                              ""
                            )
                          )}
                        {this.state.fields.length === 0 && (
                          <li className="list-group-item mb-3 shadow-sm">
                            <div className="filed-type ml-3 mr-3 pt-1">
                              <p className="mb-0">
                                {" "}
                                <strong>No Fields exist for tracking.</strong>
                              </p>
                            </div>
                          </li>
                        )}
                        {/* <li className="list-group-item mb-3 shadow-sm">
                                <div className="name-list-item mb-2"><span><strong><h5 className="float-left mr-2">1:</h5> name </strong></span> <button type="button" class="close" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button> </div>
                                <div className="filed-type ml-3 mr-3 pt-1">
                                    <p className="mb-0">Field type: <strong>Name</strong></p>
                                </div>
                            </li>
                            <li className="list-group-item mb-3 shadow-sm">
                                <div className="name-list-item mb-2"><span><strong><h5 className="float-left mr-2">1:</h5> name </strong></span> <button type="button" class="close" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button> </div>
                                <div className="filed-type ml-3 mr-3 pt-1">
                                    <p className="mb-0">Field type: <strong>Name</strong></p>
                                </div>
                            </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            <hr />
            <div className="row">
              <div className="col-md-6">
                <button
                  className="btn btn-deafult"
                  type="button"
                  disabled={
                    this.state.fields.length === 0 ||
                    this.state.formName === "" ||
                    this.state.formurl === ""
                  }
                  onClick={(e) => this.saveFormTracking(e)}
                >
                  <span className="icon-open-new-window" />
                  <span>Start Analaysing</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {!this.state.isFormCreation && !this.state.isTrackingDetail && (
          <div>
            {" "}
            <TrackFormListing
              ShowForm={this.showForm}
              showTrackingDetail={this.showTrackingDetail}
            />
          </div>
        )}
        {this.state.isTrackingDetail && (
          <div>
            {" "}
            <ProjectDetail
              trackdetail={this.state.trackdetail}
              ShowTrackList={this.showTrackList}
            />
          </div>
        )}
      </div>
    );
  }
}
