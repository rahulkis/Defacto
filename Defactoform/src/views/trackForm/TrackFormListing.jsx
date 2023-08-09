import React from "react";
import "../../../src/assets/custom/formdetails.css";
import { GetData } from "../../stores/requests";
import { TRACKFORM_URLS } from "../../util/constants";
import { calculateTime } from "../../util/commonFunction";

export default class TrackFormListing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formurl: "",
      isSubmitted: false,
      formName: "",
      fields: [],
      availableSession: 2000,
      isFormCreation: false,
      trackingData: [],
    };
    this.getTrackingForms = this.getTrackingForms.bind(this);
  }
  componentWillMount() {
    this.getTrackingForms();
  }
  getTrackingForms() {
    GetData(TRACKFORM_URLS.GET_TRACKING_FORM).then((result) => {
      if (result != null) {
        this.setState({ trackingData: result.Items });
      }
    });
  }

  componentWillReceiveProps() {
    this.getTrackingForms();
  }
  render = () => {
    return (
      <div>
        <div className="row">
          <button className="btn btn-default" onClick={this.props.ShowForm}>
            New Form Tracking
          </button>
        </div>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Session</th>
                <th>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.trackingData.length === 0 && (
                <tr>
                  <td colSpan="5">No Data found</td>
                </tr>
              )}
              {this.state.trackingData.map((track, key) => (
                <tr>
                  <td>{track.Status}</td>
                  <td>{track.FormName}</td>
                  <td>{track.UsedSession}</td>
                  <td>{calculateTime(track.CreatedAt)} ago</td>
                  <td>
                    <button
                      disabled={
                        track.AvailableSession === track.UsedSession ||
                        track.UsedSession === 0
                      }
                      className="btn btn-default"
                      onClick={(e) => this.props.showTrackingDetail(e, track)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
}
