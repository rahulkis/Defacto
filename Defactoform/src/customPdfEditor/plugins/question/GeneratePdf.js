import React from "react";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { SUBMISSION_URLS } from "../../../util/constants";

export default class GeneratePdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render: "",
      submissionList: [],
      submissionData: [],
      answeredQuestionData: [],
      dataFormEditorState: [],
      selectedSummaryOption: "Submissions Results-Public",
      selectedLayout: "List",
      checkAll: false,
      receipt: [{ title: "No payments associated with this submission" }],
      summaryOptions: [
        {
          label: "Submissions Results-Public",
          value: "Submissions Results-Public",
        },
        {
          label: "Submissions Results-Private",
          value: "Submissions Results-Private",
        },
        {
          label: "Submissions Results-Custom",
          value: "Submissions Results-Custom",
        },
        { label: "Receipt", value: "Receipt" },
      ],
      layoutOption: [
        { label: "Table", value: "Table" },
        { label: "List", value: "List" },
      ],
    };
    this.oldData = [];
  }
  async componentWillMount() {
    let jsonData = [];
    const URL = SUBMISSION_URLS.GET_SUBMISSIONS + localStorage.CurrentFormId;
    const response = await fetch(URL);
    const data = await response.json();

    let formData = data.data.Items.filter((data) => {
      return data.PartialSubmission === false;
    });
    for (let i = formData.length - 1; i < formData.length; i++) {
      jsonData.push(formData[i]);
    }
    this.setState({ submissionList: jsonData });
    let subData = this.state.submissionList;
    if (subData[0]) {
      subData = JSON.parse(subData[0].SubmittedData);
    }
    this.setState({ submissionData: subData, answeredQuestionData: subData });
    if (
      this.props.item.selectedSummaryOption.label ===
        "Submissions Results-Public" &&
      !localStorage.editPdf
    ) {
      this.updateArticle("pdfData", this.state.submissionData);
    } else if (
      this.props.item.selectedSummaryOption.label ===
      "Submissions Results-Custom"
    ) {
      this.setState({
        submissionData: this.props.item.pdfData,
        dataFormEditorState: this.props.item.pdfData,
      });
    }
  }

  updateArticle = (fieldName, value) => {
    this.props.updateArticle(this.props.item.key, fieldName, value);
  };
  summaryHandler = (value) => {
    localStorage.removeItem("editPdf");
    let staticValues = [
      { key: "1av5d", title: "Score" },
      { key: "2gd6d", title: "Total Amount" },
      { key: "3df56", title: "Submitted At" },
      { key: "4dfe", title: "Submission ID" },
    ];
    let formJson = JSON.parse(localStorage.getItem("formJSON"));
    formJson = formJson.filter((data) => {
      return data.control !== "simpletext";
    });
    this.setState({ selectedSummaryOption: value.label });

    this.updateArticle("selectedSummaryOption", value);
    if (
      value.label === "Submissions Results-Public" ||
      value.label === "Submissions Results-Private"
    ) {
      if (this.props.item.includeUnAnsweredQuestion) {
        let combineArray = formJson.concat(this.state.answeredQuestionData);
        combineArray = this.removeDuplicate(combineArray);
        this.updateArticle("pdfData", combineArray);
      } else {
        this.updateArticle("pdfData", this.state.answeredQuestionData);
      }
    } else if (value.label === "Submissions Results-Custom") {
      if (this.props.item.checkAll && this.props.item.pdfData.length > 1) {
        this.setState({ submissionData: this.state.dataFormEditorState });
        this.updateArticle("pdfData", this.state.dataFormEditorState);
      } else if (this.props.item.checkAll) {
        this.updateArticle("pdfData", this.state.submissionData);
      } else {
        let newArr = formJson.concat(this.state.submissionData);

        for (let i = 0; i < staticValues.length; i++) {
          newArr.push(staticValues[i]);
        }
        newArr = this.removeDuplicate(newArr);
        let result = newArr.map((obj) => {
          obj.isChecked = false;
          return obj;
        });
        this.setState({ submissionData: result });
        this.updateArticle("pdfData", "");
      }
    } else if (value.label === "Receipt") {
      this.updateArticle("pdfData", this.state.receipt);
    }
  };
  layoutHandler = (value) => {
    localStorage.removeItem("editPdf");
    this.setState({ selectedLayout: value.label });
    this.updateArticle("selectedLayout", value);
  };
  handleSwitchChange = (e) => {
    localStorage.removeItem("editPdf");
    let formJson = JSON.parse(localStorage.getItem("formJSON"));
    formJson = formJson.filter((data) => {
      return data.control !== "simpletext";
    });
    this.updateArticle("includeUnAnsweredQuestion", e.target.checked);
    if (this.props.item.includeUnAnsweredQuestion) {
      if (
        this.props.item.selectedSummaryOption.label !==
        "Submissions Results-Custom"
      ) {
        let newArr = formJson.concat(this.state.answeredQuestionData);
        newArr = this.removeDuplicate(newArr);
        this.updateArticle("pdfData", newArr);
      }
    } else {
      if (
        this.props.item.selectedSummaryOption.label ===
          "Submissions Results-Public" ||
        this.props.item.selectedSummaryOption.label ===
          "Submissions Results-Private"
      ) {
        this.updateArticle("pdfData", this.state.answeredQuestionData);
      }
    }
  };
  removeDuplicate = (array) => {
    let uniqueArray = [];
    let uniqueObject = {};
    for (let i = 0; i < array.length; i++) {
      let obj = array[i].key;
      uniqueObject[obj] = array[i];
    }
    for (let j in uniqueObject) {
      uniqueArray.push(uniqueObject[j]);
    }
    return uniqueArray;
  };

  checkChildElements = (e, fieldValue) => {
    localStorage.removeItem("editPdf");
    let list = this.state.submissionData;
    list.forEach((data) => {
      if (data.title === fieldValue.title) {
        data.isChecked = e.target.checked;
      }
    });
    this.setState({ submissionData: list });
    if (e.target.checked) {
      this.oldData.push(fieldValue);
      this.updateArticle("pdfData", list);
    } else {
      const myIndex = this.oldData.indexOf(fieldValue);
      if (myIndex > -1) {
        let oldData = [...this.oldData];
        oldData.splice(myIndex, 1);
        this.oldData = oldData;
        this.updateArticle("pdfData", list);
      }
    }

    const selectedItem = this.props.item.pdfData.find(
      (tr) => tr.isChecked === false
    );
    if (selectedItem) {
      this.updateArticle("checkAll", false);
    } else {
      this.updateArticle("checkAll", true);
    }
  };
  handleAllChecked = (event) => {
    localStorage.removeItem("editPdf");
    this.updateArticle("checkAll", event.target.checked);
    let list = this.state.submissionData;
    list.forEach((data) => (data.isChecked = event.target.checked));
    this.setState({ submissionData: list, checkAll: event.target.checked });
    if (event.target.checked) {
      this.oldData = list;

      this.updateArticle("pdfData", this.oldData);
    } else {
      this.oldData = [];

      this.updateArticle("pdfData", this.oldData);
    }
  };

  removeSummary = () => {
    this.props.removeArticle(this.props.item.key);
  };

  render() {
    return (
      <div>
        <div className="PDFEditor" style={{ transition: "all 0.3s ease 0s" }}>
          <div className="DraftEditor-root">
            <div className="DraftEditor-editorContainer">
              <div
                aria-describedby="placeholder-bmncm"
                className="notranslate public-DraftEditor-content"
                role="textbox"
                spellCheck="false"
                style={{
                  outline: "none",
                  userSelect: "text",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                }}
              >
                <div data-contents="true">
                  <figure
                    className="summary summary-undefined alignment--left "
                    data-block="true"
                    data-editor="bmncm"
                    data-offset-key="7cims-0-0"
                  >
                    <div className="SummaryEditor">
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Submission Summary{" "}
                        </div>
                        <div className="FieldConfigurationField__i">
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
                          {this.state.selectedSummaryOption ===
                            "Submissions Results-Public" && (
                            <span>
                              Shows all of the visible questions and answers,
                              suitable to send to customers.
                            </span>
                          )}
                          {this.state.selectedSummaryOption ===
                            "Submissions Results-Private" && (
                            <span>
                              Shows all questions and answers, including hidden
                              questions, scores, and the submission ID.
                            </span>
                          )}
                          {this.state.selectedSummaryOption ===
                            "Submissions Results-Custom" && (
                            <span>
                              Choose which fields you would to display.
                            </span>
                          )}
                          {this.state.selectedSummaryOption === "Receipt" && (
                            <span>
                              Shows an itemized summary of any payments made on
                              this submission.
                            </span>
                          )}
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            options={this.state.summaryOptions}
                            defaultValue={this.props.item.selectedSummaryOption}
                            onChange={(value) => this.summaryHandler(value)}
                          />
                        </div>
                      </div>
                      {this.props.item.selectedSummaryOption.label !==
                        "Receipt" && (
                        <span>
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              Include unanswered questions
                              <div className="FieldConfigurationField__i">
                                <svg
                                  fill="currentColor"
                                  s
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
                                <div className="FieldConfigurationField__description">
                                  <div className="FieldConfigurationField__descriptioninner">
                                    By default, if a question isn't answered
                                    then we don't show it. Turn this on to
                                    always show all answers.
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="FieldConfiguration__value">
                              <Switch
                                onChange={(e) => this.handleSwitchChange(e)}
                                value="requiredQuestion"
                                color="primary"
                                checked={
                                  this.props.item.includeUnAnsweredQuestion
                                }
                              />
                            </div>
                          </div>
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              Summary Layout{" "}
                            </div>
                            <div className="FieldConfiguration__value">
                              <Select
                                options={this.state.layoutOption}
                                defaultValue={this.props.item.selectedLayout}
                                onChange={(value) => this.layoutHandler(value)}
                              />
                            </div>
                          </div>
                        </span>
                      )}

                      <i
                        className="fas fa-times SummaryEditor__delete"
                        onClick={(e) => this.removeSummary()}
                      />
                      {this.props.item.selectedSummaryOption.label ===
                        "Submissions Results-Custom" && (
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Choose fields to display{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <div
                              className="pull-right"
                              style={{
                                clear: "both",
                                display: "block",
                                padding: "9px 9px 9px 0px",
                              }}
                            >
                              <i
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                Select All
                              </i>
                              <span
                                style={{
                                  display: "block",
                                  marginTop: "-15px",
                                }}
                              >
                                <Switch
                                  onChange={(e) => this.handleAllChecked(e)}
                                  checked={this.props.item.checkAll}
                                  color="primary"
                                />
                              </span>
                            </div>
                            {this.state.submissionData.length > 0 &&
                              this.state.submissionData.map((data) => (
                                <div
                                  style={{
                                    flex: "1 1 0%",
                                    padding: "9px 9px 9px 0px",
                                    clear: "both",
                                  }}
                                  key={"submissionfields-" + data.title}
                                >
                                  {data.title}
                                  <span className="pull-right">
                                    {" "}
                                    <Switch
                                      onChange={(e) =>
                                        this.checkChildElements(e, data)
                                      }
                                      checked={data.isChecked || false}
                                      color="primary"
                                    />
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
