import React from "react";
import "../../../src/assets/custom/formdetails.css";

import { Row, Col } from "reactstrap";
export default class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      formData: {},
      failedSubmission: 0,
      visitCount: 0,
      submissionCount: 0,
      controlData: [],
    };
  }
  componentWillMount() {
    let allInfo = this.props.trackdetail;
    this.setState({
      controlData: JSON.parse(allInfo.TrackingFields),
      failedSubmission: allInfo.FailedSubmission,
      visitCount: allInfo.VisitCount,
      submissionCount: allInfo.SubmissionCount,
    });
  }
  componentWillReceiveProps(nextProps) {
    let allInfo = nextProps.trackdetail;
    this.setState({
      controlData: JSON.parse(allInfo.TrackingFields),
      failedSubmission: allInfo.FailedSubmission,
      visitCount: allInfo.VisitCount,
      submissionCount: allInfo.SubmissionCount,
    });
  }
  render() {
    return (
      <div>
        <div className="row">
          <button
            className="btn btn-default"
            onClick={this.props.ShowTrackList}
          >
            Tracking list
          </button>
        </div>
        <Row>
          <Col md="8" className="main-form-div">
            <div>
              <h2>This form is based on a sample of your total visitors</h2>
              <div class=" " style={{ width: "100%", overflow: "auto" }}>
                <table className="table table-bordered table-responsive-manual">
                  <tbody>
                    <tr>
                      {" "}
                      <td className="defacto-grey-bg" />{" "}
                      {this.state.controlData.map((val, i) => (
                        <td key={i}>
                          <div style={{ whiteSpace: "nowrap" }}>
                            <b>{val.title ? val.title : val.control}</b>
                          </div>

                          <div>
                            <i class="fas fa-clock pr-2" />
                            {Math.ceil(val.averageTime / 1000)} sec
                          </div>
                        </td>
                      ))}
                      <td className="defacto-grey-bg" />
                    </tr>
                    <tr>
                      <td className="defacto-grey-bg">
                        {" "}
                        <p>
                          {" "}
                          Total Visitors
                          <br />
                          <b> {this.state.visitCount}</b>
                        </p>
                      </td>
                      {this.state.controlData.map((val, i) => (
                        <td>
                          <p>
                            INTERACTIONS
                            <br />
                            {val.interactionCount}
                          </p>
                        </td>
                      ))}
                      <td className="defacto-grey-bg">
                        <p>
                          SUCEESSFUL SUBMISSION <br />{" "}
                          {this.state.submissionCount} out of{" "}
                          {Number(this.state.failedSubmission) +
                            Number(this.state.submissionCount)}
                        </p>
                      </td>{" "}
                    </tr>

                    <tr>
                      <td
                        className="defacto-grey-bg"
                        style={{ verticalAlign: "top" }}
                      >
                        <i
                          class="fa fa-arrow-circle-down fa-lg"
                          aria-hidden="true"
                        />
                        <p className="aa">
                          DROPOFF <br />(
                          {parseInt(
                            (Number(this.state.failedSubmission) /
                              Number(this.state.visitCount)) *
                              100
                          ).toFixed(3)}
                          %)
                        </p>
                      </td>
                      {this.state.controlData.map((val, i) => (
                        <td>
                          <i
                            class="fa fa-arrow-circle-down fa-lg"
                            aria-hidden="true"
                            style={{ verticalAlign: "top" }}
                          />
                          <p>
                            DROPOFF
                            <br />
                            {(
                              Number(val.interactionCount) /
                              (Number(this.state.visitCount) * 100)
                            ).toFixed(3)}
                            %<br />(
                            {Number(this.state.visitCount) -
                              Number(val.interactionCount)}
                            )
                          </p>
                        </td>
                      ))}
                      <td className="defacto-grey-bg">
                        {" "}
                        <i class="fas fa-exclamation-circle fa-lg" />
                        <p className="aa">
                          Failed Submits <br /> {this.state.failedSubmission}{" "}
                          out of{" "}
                          {Number(this.state.failedSubmission) +
                            Number(this.state.submissionCount)}

                        {/* <br />(
                          {parseInt(
                            (Number(this.state.failedSubmission) /
                            (Number(this.state.failedSubmission) +
                            Number(this.state.submissionCount))) * 100 
                          ).toFixed(1)}
                          %) */}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
