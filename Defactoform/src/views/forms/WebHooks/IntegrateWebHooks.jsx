import React from "react";
import { PostData, GetData, Delete } from "../../../stores/requests";

import { FORM_URLS, WEBHOOKS_URLS } from "../../../util/constants";
import { DraftJS } from "megadraft";
import Loader from "../../../components/Common/Loader";

class IntegrateWebHooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addWebHooks: false,
      webHooklist: [],
      webHookUrl: "",
      isLoader: false,
      showHideDiv: "webhook-collapse",
    };
  }
  componentWillMount() {
    this.getWebHooksList();
    this.GetFormSubmissionCount();
  }
  GetFormSubmissionCount() {
    GetData(FORM_URLS.GET_FORM_BY_ID_URL + localStorage.FormId).then(
      (result) => {
        if (result != null) {
          if (result.Item !== undefined) {
            if (
              result.Item.SubmissionCount &&
              result.Item.SubmissionCount > 0
            ) {
              this.setState({ addWebHooks: true });
            } else {
              this.setState({ addWebHooks: false });
            }
          } else {
            this.setState({ addWebHooks: false });
          }
        }
      }
    );
  }
  getWebHooksList() {
    GetData(WEBHOOKS_URLS.GET_WEBHOOKS_LIST + localStorage.FormId).then(
      (result) => {
        if (result != null) {
          console.log(result.data.Items);
          this.setState({ webHooklist: result.data.Items });
        }
      }
    );
  }
  addDataIntoWebHooks() {
    this.setState({ isLoader: true });
    let formModel = {
      WebhookId: DraftJS.genKey(),
      FormId: localStorage.FormId,
      WebUrl: this.state.webHookUrl,
      IsActive: true,
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };
    try {
      PostData(WEBHOOKS_URLS.ADD_WEBHOOK, formModel).then((result) => {
        if (result.statusCode === 200) {
          this.getWebHooksList();
          this.setState({ webHookUrl: "", isLoader: false });
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      this.setState({ isLoader: false });
    }
  }
  DeleteWebHooks = (valueId) => {
    let result = window.confirm("Are you sure you want to delete this?");
    if (result) {
      if (valueId != null) {
        this.setState({ isLoader: true });
        Delete(WEBHOOKS_URLS.DELETE_WEBHOOK + valueId).then((result) => {
          if (result != null) {
            this.setState({ isLoader: false });
            if (result.statusCode === 200) {
              window.alert("Selected Webhook deleted successfully.");
              this.getWebHooksList();
            } else {
              window.alert("There is an error in deleting the Webhook.");
            }
          }
        });
      }
    } else {
      return false;
    }
  };
  testUrl = (url) => {
    if (this.state.addWebHooks) {
      window.alert("Test failed");
    } else {
      window.alert(
        "Test failed: the form needs to be submitted at least once to test."
      );
      return false;
    }
  };
  showHide = (val) => {
    this.setState({ showHideDiv: "" });
  };
  redirectHelp = (e) => {
    window.open("../articles/HowToUseWebHooks", "_blank");
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div className="row">
        <div className="Paper Paper--double-padded Paper--collapsable flex1 mb1">
          <div>
            <h2 className="paper-Type" onClick={(event) => this.showHide()}>
              Webhooks
            </h2>
            <div className={this.state.showHideDiv}>
              <p className="p-0 font-14">
                Webhooks allow the form to send data directly to your own
                services.{" "}
                <a
                  href="#pablo"
                  className="ReadDocs-a-style"
                  onClick={(event) => this.redirectHelp()}
                >
                  Read the docs
                </a>{" "}
                for more information on how to get started.
              </p>
              <div className="ConfigureWebhooks">
                <span>
                  <div style={{ position: "relative" }}>
                    <div
                      className="ResultsTable__wrapper"
                      style={{ overflow: "visible" }}
                    >
                      <table className="ResultsTable webhook-table">
                        <thead>
                          <tr>
                            <th>URL</th>
                            <th width="120">Test</th>
                            <th width="80">Remove</th>
                          </tr>
                        </thead>
                        {this.state.webHooklist.length > 0 && (
                          <tbody>
                            {this.state.webHooklist.map((data, index) => (
                              <tr key={'webhooksItem'+index}>
                                <td> {data.WebUrl} </td>
                                <td className="ResultsTable__btn">
                                  <div
                                    className="BtnV2 BtnV2--raised BtnV2--primary"
                                    tabIndex="-1"
                                    onClick={() => this.testUrl(data.WebUrl)}
                                  >
                                    <span>
                                      <i className="fas fa-sync-alt" /> Test
                                    </span>
                                  </div>
                                </td>
                                <td className="ResultsTable__delete">
                                  <div
                                    className="BtnV2 BtnV2--raised BtnV2--warning"
                                    tabIndex="-1"
                                    onClick={() =>
                                      this.DeleteWebHooks(data.WebhookId)
                                    }
                                  >
                                    <span>
                                      <i className="fas fa-times" />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                        {this.state.webHooklist.length === 0 && (
                          <tbody>
                            <tr>
                              <td colSpan="3">
                                <p style={{ textAlign: "center" }}>
                                  No webhooks.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                  <div className="row webhook-Form-style">
                    <div className="col-md-12 answer-block d-inline-block">
                      <input
                        type="text"
                        className="FieldConfiguration-input webhook-text-input-align"
                        placeholder="http://website.com"
                        onChange={(e) =>
                          this.setState({ webHookUrl: e.target.value })
                        }
                      />
                    </div>
                    <div
                      className="BtnV2 BtnV2--primary webhook-btn-align"
                      style={{ marginTop: "18px" }}
                      onClick={() => this.addDataIntoWebHooks()}
                    >
                      <span>Add Webhook</span>
                    </div>
                  </div>
                </span>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IntegrateWebHooks;
