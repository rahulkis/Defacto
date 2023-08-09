import React from "react";
import { Col } from "reactstrap";
import ReactModal from "react-modal";
import { DeleteForm, UpdateData } from "../../../stores/requests";
import { SUBMISSION_URLS } from "../../../util/constants";
import $ from "jquery";
import Loader from "../../../components/Common/Loader";

class Submission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submissionList: [],
      showPopup: false,
      submissionDetail: [],
      submissionId: 0,
      checkedCount: 0,
      submissionChecked: false,
      isAllChecked: false,
      checkedSubmissionId: "",
      partialSubmissionList: [],
      submissionBool: false,
      isLoader: true,
    };
    this.getSubmissionList = this.getSubmissionList.bind(this);
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  async componentWillMount() {
    let formid = sessionStorage.getItem("Submissionformid");
    //console.log(sessionStorage.getItem("Submission"));
    if (sessionStorage.getItem("Submission") != null) {
      this.setState({ submissionBool: sessionStorage.getItem("Submission") });
    } else {
      this.setState({ submissionBool: true });
    }
    const URL = SUBMISSION_URLS.GET_SUBMISSIONS + formid;
    const response = await fetch(URL);
    const data = await response.json();
    // console.log(data.data.Items);
    this.setState({
      submissionList: data.data.Items.filter((data) => {
        return data.PartialSubmission === false;
      }),
    });
    this.setState({
      partialSubmissionList: data.data.Items.filter((data) => {
        return data.PartialSubmission === true;
      }),
    });
    this.setState({ isLoader: false });
    ///console.log(this.state.partialSubmissionList);
    // console.log(this.state.submissionList);
  }
  async getSubmissionList() {
    this.setState({ isLoader: true });
    let formid = sessionStorage.getItem("Submissionformid");
    const URL = SUBMISSION_URLS.GET_SUBMISSIONS + formid;
    const response = await fetch(URL);
    const data = await response.json();
    this.setState({
      submissionList: data.data.Items.filter((val) => {
        return val.PartialSubmission === false;
      }),
    });
    this.setState({
      partialSubmissionList: data.data.Items.filter((val) => {
        return val.PartialSubmission === true;
      }),
    });
    //this.setState({ submissionList: data.data.Items });
    this.updateSubmissionCount(this.state.submissionList.length);

    this.setState({ checkedCount: 0, isLoader: false });
  }

  addPage = (data, SubmissionDetail, Id) => {
    this.setState({
      submissionList: data,
      submissionDetail: JSON.parse(SubmissionDetail),
      submissionId: Id,
    });
    this.setState({ showModal: true });
  };

  nextPage = (data, SubmissionDetail, Id) => {
    this.setState({
      submissionList: data,
      submissionDetail: JSON.parse(SubmissionDetail),
      submissionId: Id,
    });

    this.setState({ showModal: true });
  };

  changeDateFormat = (date) => {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let dateFor = new Date(parseInt(date));
    let month = months[dateFor.getMonth()];
    let day = dateFor.getDate();
    let year = dateFor
      .getFullYear()
      .toString()
      .substring(2, 4);
    return (
      month + " " + this.nth(day) + " " + year + " " + this.formatAMPM(dateFor)
    );
  };
  formatAMPM = (date) => {
    let hours = date.getHours();
    let min = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    min = min < 10 ? "0" + min : min;
    let strTime = hours + ":" + min + " " + ampm;
    return strTime;
  };
  nth = function(day) {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  };
  checkSubmissionRecord = (e) => {
    let count = 0;
    $("input:checkbox[class=subGroup]:checked").each(function() {
      count++;
    });
    this.setState({ checkedCount: count });
    if (count < this.state.submissionList.length) {
      $(".mainGroup").prop("checked", false);
    } else if (count === this.state.submissionList.length) {
      $(".mainGroup").prop("checked", true);
    }
  };

  checkAllSubmission = (e) => {
    let checked = e.target.checked;
    if (checked) {
      $(".subGroup").prop("checked", true);
      if (
        this.state.submissionBool === true ||
        this.state.submissionBool === "true"
      )
        this.setState({ checkedCount: this.state.submissionList.length });
      else
        this.setState({
          checkedCount: this.state.partialSubmissionList.length,
        });
    } else {
      $(".subGroup").prop("checked", false);
      this.setState({ checkedCount: 0 });
    }
  };
  deleteSelectedSubRecord = (e) => {
    e.preventDefault();

    let deleteSuccess = true;
    let result = window.confirm("Are you sure you want to delete this?");
    if (result) {
      // this.setState({ isLoader: true });
      $("input:checkbox[class=subGroup]:checked").each(function() {
        let Submissionid = $(this).val();
        if (Submissionid != null) {
          DeleteForm(SUBMISSION_URLS.DELETE_SUBMISSION + Submissionid).then(
            (result) => {
              if (result != null) {
                if (result.statusCode === 200) {
                  if (deleteSuccess) deleteSuccess = true;
                  //window.alert("Selected Submission deleted successfully.");
                } else {
                  deleteSuccess = false;
                  // window.alert("There is an error in deleting the Submission.");
                }
              }
            }
          );
        }
      });
      if (deleteSuccess) {
        window.alert("Selected Submission deleted successfully.");
      } else {
        window.alert("There is an error in deleting the Submission.");
      }
      this.getSubmissionList();
    } else {
      return false;
    }
  };
  deleteAllSubRecord = (e) => {
    e.preventDefault();
    let deleteSuccess = true;
    let result = window.confirm("Are you sure you want to delete this?");
    if (result) {
      $("input:checkbox[class=subGroup]").each(function() {
        let Submissionid = $(this).val();
        if (Submissionid != null) {
          DeleteForm(SUBMISSION_URLS.DELETE_SUBMISSION + Submissionid).then(
            (result) => {
              if (result != null) {
                if (result.statusCode === 200) {
                  if (deleteSuccess) deleteSuccess = true;
                } else {
                  deleteSuccess = false;
                }
              }
            }
          );
        }
      });
      if (deleteSuccess) {
        window.alert("Submission deleted successfully.");
      } else {
        window.alert("There is an error in deleting the Submission.");
      }
      this.getSubmissionList();
    } else {
      return false;
    }
  };

  updateSubmissionCount = (SubCount) => {
    this.setState({ isLoader: true });
    // let editorStateRawData = JSON.stringify(this.state.editorStateRawValue);
    let FormId = sessionStorage.getItem("Submissionformid");
    let FormModel = {
      FormId: FormId,
      SubmissionCount: SubCount,
    };
    //console.log(FormModel);

    try {
      UpdateData(
        SUBMISSION_URLS.UPDATE_SUBMISSIONCOUNT_BY_FORMID,
        FormModel
      ).then((result) => {
        if (result.statusCode === 200) {
          //window.alert("Selected form deleted successfully.");
        } else {
          window.alert("There is an error in updating SubmissionCount.");
        }
        // this.GetSubmissionList();
      });
    } catch (err) {
      console.log(SUBMISSION_URLS.UPDATE_SUBMISSIONCOUNT_BY_FORMID, err);
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <>
        {(this.state.submissionBool === "true" ||
          this.state.submissionBool === true) && (
          <div className="page-with-sidebar__content">
            <div />
            <div>
              <Col md="8" className="main-form-div">
                <div style={{ paddingTop: "100px" }}>
                  <Col className="mb-8" md="12">
                    <form className="preview_page_style font-weight-bold">
                      <div>
                        {this.state.submissionList.length}{" "}
                        {"Submissions of " +
                          '"' +
                          sessionStorage.getItem("formName") +
                          '"'}
                      </div>
                    </form>
                  </Col>
                  <Col className="mb-8" md="12">
                    <form className="p-3 preview_page_style">
                      <div className="col-md-12">
                        {this.state.checkedCount > 0 &&
                          this.state.checkedCount !==
                            this.state.submissionList.length && (
                            <button
                              id="ancSelected"
                              href="#"
                              onClick={(e) => this.deleteSelectedSubRecord(e)}
                              className="BtnV2 BtnV2--sm"
                              tabindex="-1"
                              style={{ width: "auto" }}
                            >
                              <span>
                                Delete {this.state.checkedCount} Selected{" "}
                              </span>
                            </button>
                          )}

                        {this.state.checkedCount ===
                          this.state.submissionList.length &&
                          this.state.submissionList.length > 0 && (
                            <button
                              onClick={(e) => this.deleteAllSubRecord(e)}
                              className="BtnV2 BtnV2--sm"
                              tabindex="-1"
                              style={{ width: "auto" }}
                            >
                              <span>Delete All</span>
                            </button>
                          )}
                      </div>
                    </form>
                  </Col>
                  <div className="container titledform">
                    <div className="p-0 col-md-12">
                      <div class="preview_page_style" id="divSubPreview">
                        <div className="container titledform">
                          <Col md="12" className="p-0">
                            <div className="preview_page_style">
                              <div>
                                <div style={{ position: "relative" }}>
                                  <div
                                    className="ResultsTable__wrapper "
                                    style={{ overflow: "visible" }}
                                  >
                                    {this.state.submissionList.length > 0 && (
                                      <table className="ResultsTable ResultsTable--sortable">
                                        <thead>
                                          <tr>
                                            <th
                                              className="text-right"
                                              style={{ width: "150px" }}
                                            >
                                              <input
                                                type="checkbox"
                                                className="mainGroup"
                                                onChange={(e) =>
                                                  this.checkAllSubmission(e)
                                                }
                                              />
                                            </th>
                                            <th
                                              className="text-center"
                                              style={{ width: "150px" }}
                                            >
                                              View
                                            </th>
                                            <th className="text-center">
                                              Submitted At{" "}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.state.submissionList.map(
                                            (form, key) => (
                                              <tr className="">
                                                <td className="text-center">
                                                  <input
                                                    type="checkbox"
                                                    className="subGroup"
                                                    value={form.SubmissionId}
                                                    onChange={(e) =>
                                                      this.checkSubmissionRecord(
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td className="">
                                                  <button
                                                    type="button"
                                                    className="btn btn-Add btn-lg btn-block"
                                                    style={{ width: "175px" }}
                                                    onClick={() =>
                                                      this.addPage(
                                                        this.state
                                                          .submissionList,
                                                        form.SubmittedData,
                                                        form.SubmissionId
                                                      )
                                                    }
                                                  >
                                                    View Detail
                                                  </button>
                                                </td>
                                                <td className="text-center">
                                                  {" "}
                                                  {this.changeDateFormat(
                                                    form.SubmittedAt
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    )}
                                    {this.state.submissionList.length === 0 && (
                                      <table className="ResultsTable ResultsTable--sortable">
                                        <thead>
                                          <tr>
                                            <th style={{ width: "auto" }} />
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr className="">
                                            <td>No Submission Found</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </div>
            <ReactModal
              isOpen={this.state.showModal}
              contentLabel="onRequestClose"
              onRequestClose={this.handleCloseModal}
              className="Success-Page-Modal"
            >
              <div>
                <div className="header-config">
                  <h2>{this.state.pageName}</h2>
                  <button onClick={this.handleCloseModal}>Back</button>
                </div>
                <div>
                  {this.state.submissionList.map((form, index) => (
                    <div>
                      {this.state.submissionId === form.SubmissionId && (
                        <div>
                          <div className="col-md-12 mt-3">
                            <label className="font-weight-bold">
                              {index + 1}. Submission Result
                            </label>
                          </div>
                          <div className="col-md-12">
                            <label>({form.SubmissionId})</label>
                          </div>
                          <div className="col-md-12 mt-3">
                            <label className="font-weight-bold">
                              SubmissionId
                            </label>
                          </div>
                          <div className="col-md-12">
                            <label>({form.SubmissionId})</label>
                          </div>
                          {this.state.submissionList.length > 1 && (
                            <div className="col-md-12 mt-3">
                              {this.state.submissionList.length > index + 1 &&
                                this.state.submissionList.length >
                                  index + 1 && (
                                  <button
                                    onClick={() =>
                                      this.nextPage(
                                        this.state.submissionList,
                                        this.state.submissionList[index + 1]
                                          .SubmittedData,
                                        this.state.submissionList[index + 1]
                                          .SubmissionId
                                      )
                                    }
                                  >
                                    Next
                                  </button>
                                )}
                              {index > 0 &&
                                this.state.submissionList[index - 1]
                                  .SubmittedData !== undefined && (
                                  <button
                                    onClick={() =>
                                      this.nextPage(
                                        this.state.submissionList,
                                        this.state.submissionList[index - 1]
                                          .SubmittedData,
                                        this.state.submissionList[index - 1]
                                          .SubmissionId
                                      )
                                    }
                                  >
                                    Previous
                                  </button>
                                )}
                            </div>
                          )}
                          <div className="col-md-12 mt-3">
                            <label className="font-weight-bold">
                              SubmissionAt
                            </label>
                          </div>
                          <div className="col-md-12">
                            <label>
                              {this.changeDateFormat(form.SubmittedAt)}
                            </label>
                          </div>

                          {this.state.submissionDetail.map((form1, key1) => (
                            <div>
                              <div className="col-md-12 mt-3">
                                <label className="font-weight-bold">
                                  {form1.title}
                                </label>
                              </div>
                              <div className="col-md-12">
                                <label>
                                  {typeof form1.value === "object"
                                    ? form1.value.value
                                    : form1.value}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ReactModal>
          </div>
        )}
        {this.state.submissionBool === "false" && (
          <div className="page-with-sidebar__content">
            <div />
            <div>
              <Col md="8" className="main-form-div">
                <div style={{ paddingTop: "100px" }}>
                  <Col className="mb-8" md="12">
                    <form className="preview_page_style font-weight-bold">
                      <div>
                        {this.state.partialSubmissionList.length}{" "}
                        {"Partial Submissions of " +
                          '"' +
                          sessionStorage.getItem("formName") +
                          '"'}
                      </div>
                    </form>
                  </Col>
                  <Col className="mb-8" md="12">
                    <form className="p-3 preview_page_style">
                      <div className="col-md-12">
                        {this.state.checkedCount > 0 && (
                          <button
                            id="ancSelected"
                            href="#"
                            onClick={(e) => this.deleteSelectedSubRecord(e)}
                            className="BtnV2 BtnV2--sm"
                            tabindex="-1"
                            style={{ width: "auto" }}
                          >
                            <span>
                              Delete {this.state.checkedCount} Selected{" "}
                            </span>
                          </button>
                        )}
                        <button
                          onClick={(e) => this.deleteAllSubRecord(e)}
                          className="BtnV2 BtnV2--sm"
                          tabindex="-1"
                          style={{ width: "auto" }}
                        >
                          <span>Delete All</span>
                        </button>
                      </div>
                    </form>
                  </Col>
                  <div className="container titledform">
                    <div className="p-0 col-md-12">
                      <div class="preview_page_style" id="divSubPreview">
                        <div className="container titledform">
                          <Col md="12" className="p-0">
                            <div className="preview_page_style">
                              <div>
                                <div style={{ position: "relative" }}>
                                  <div
                                    className="ResultsTable__wrapper "
                                    style={{ overflow: "visible" }}
                                  >
                                    {this.state.partialSubmissionList.length >
                                      0 && (
                                      <table className="ResultsTable ResultsTable--sortable">
                                        <thead>
                                          <tr>
                                            <th
                                              className="text-right"
                                              style={{ width: "150px" }}
                                            >
                                              <input
                                                type="checkbox"
                                                className="mainGroup"
                                                onChange={(e) =>
                                                  this.checkAllSubmission(e)
                                                }
                                              />
                                            </th>
                                            <th
                                              className="text-center"
                                              style={{ width: "150px" }}
                                            >
                                              View
                                            </th>
                                            <th className="text-center">
                                              Submitted At{" "}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.state.partialSubmissionList.map(
                                            (form, key) => (
                                              <tr className="">
                                                <td>
                                                  <input
                                                    type="checkbox"
                                                    className="subGroup"
                                                    value={form.SubmissionId}
                                                    onChange={(e) =>
                                                      this.checkSubmissionRecord(
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td className="text-center">
                                                  <button
                                                    type="button"
                                                    className="btn btn-Add btn-lg btn-block"
                                                    onClick={() =>
                                                      this.addPage(
                                                        this.state
                                                          .submissionList,
                                                        form.SubmittedData,
                                                        form.SubmissionId
                                                      )
                                                    }
                                                  >
                                                    View Detail
                                                  </button>
                                                </td>
                                                <td className="text-center">
                                                  {" "}
                                                  {this.changeDateFormat(
                                                    form.SubmittedAt
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    )}
                                    {this.state.partialSubmissionList.length ===
                                      0 && (
                                      <table className="ResultsTable ResultsTable--sortable">
                                        <thead>
                                          <tr>
                                            <th style={{ width: "auto" }} />
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr className="">
                                            <td>No Submission Found</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </div>
            <ReactModal
              isOpen={this.state.showModal}
              contentLabel="onRequestClose"
              onRequestClose={this.handleCloseModal}
              className="Success-Page-Modal"
            >
              <div>
                <div className="header-config">
                  <h2>{this.state.pageName}</h2>
                  <button onClick={this.handleCloseModal}>Back</button>
                </div>
                <div>
                  {this.state.partialSubmissionList.map((form, index) => (
                    <div>
                      {this.state.submissionId === form.SubmissionId && (
                        <div>
                          <div className="col-md-12 mt-3">
                            <label className="font-weight-bold">
                              {index + 1}. Submission Result
                            </label>
                          </div>
                          <div className="col-md-12">
                            <label>({form.SubmissionId})</label>
                          </div>
                          <div className="col-md-12 mt-3">
                            <label className="font-weight-bold">
                              SubmissionId
                            </label>
                          </div>
                          <div className="col-md-12">
                            <label>({form.SubmissionId})</label>
                          </div>
                          {this.state.partialSubmissionList.length > 1 && (
                            <div className="col-md-12 mt-3">
                              {this.state.partialSubmissionList.length >
                                index + 1 &&
                                this.state.partialSubmissionList.length >
                                  index + 1 && (
                                  <button
                                    onClick={() =>
                                      this.nextPage(
                                        this.state.partialSubmissionList,
                                        this.state.partialSubmissionList[
                                          index + 1
                                        ].SubmittedData,
                                        this.state.partialSubmissionList[
                                          index + 1
                                        ].SubmissionId
                                      )
                                    }
                                  >
                                    Next
                                  </button>
                                )}
                              {index > 0 &&
                                this.state.partialSubmissionList[index - 1]
                                  .SubmittedData !== undefined && (
                                  <button
                                    onClick={() =>
                                      this.nextPage(
                                        this.state.partialSubmissionList,
                                        this.state.partialSubmissionList[
                                          index - 1
                                        ].SubmittedData,
                                        this.state.partialSubmissionList[
                                          index - 1
                                        ].SubmissionId
                                      )
                                    }
                                  >
                                    Previous
                                  </button>
                                )}
                            </div>
                          )}
                          <div className="col-md-12 mt-3">
                            <label className="font-weight-bold">
                              SubmissionAt
                            </label>
                          </div>
                          <div className="col-md-12">
                            <label>
                              {this.changeDateFormat(form.SubmittedAt)}
                            </label>
                          </div>

                          {this.state.submissionDetail.map((form1, key1) => (
                            <div>
                              <div className="col-md-12 mt-3">
                                <label className="font-weight-bold">
                                  {form1.title}
                                </label>
                              </div>
                              <div className="col-md-12">
                                <label>
                                  {typeof form1.value === "object"
                                    ? form1.value.value
                                    : form1.value}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ReactModal>
          </div>
        )}
      </>
    );
  }
}
export default Submission;
