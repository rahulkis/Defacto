import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from "@material-ui/core/Input";
import Select from "react-select";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  MAILSHAKE_AUTH_URLS,
} from "constants/IntegrationConstant";

class MailShakeSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      errorFound: false,
      campaigns: [],
      members: [],
      boolTypeOption: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      replyOption: [
        { value: "", label: "Any" },
        { value: "reply", label: "Normal Reply" },
        { value: "bounce", label: "Bounce" },
        { value: "unsubscribe", label: "Unsubscribe" },
        { value: "out-of-office", label: "Out Of Office" },
        { value: "delay-notification", label: "Delay-Notification" },
        { value: "info", label: "Information" },
      ],
      messageOption: [
        { value: "", label: "Any" },
        { value: "initial", label: "Initial Campaign Message" },
        { value: "follow-up", label: "Follow-up" },
        { value: "drip", label: "Drip" },
        { value: "on-click", label: "On Click" },
        { value: "one-off", label: "One-off Reply" },
        { value: "campaign", label: "Any Campaign Message" },
      ],

      statusOption: [
        { value: "", label: "Any" },
        { value: "open", label: "Open" },
        { value: "ignored", label: "Ignored" },
        { value: "closed", label: "Won" },
        { value: "lost", label: "Lost" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "campaignID") &&
        this.state.campaigns.length === 0
      )
        await this.getCampaigns(connectionData);
      if (
        fields.find((field) => field.key === "assignedToEmailAddress") &&
        this.state.members.length === 0
      )
        await this.getTeamMembers(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "campaignID") &&
        this.state.campaigns.length === 0
      )
        await this.getCampaigns(connectionData);
      if (
        fields.find((field) => field.key === "assignedToEmailAddress") &&
        this.state.members.length === 0
      )
        await this.getTeamMembers(connectionData);
    }
  };

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  getFieldLabel(field) {
    if (field.label) {
      return field.label;
    } else {
      const splitKeys = field.key.split("_");
      let label = "";
      splitKeys.forEach((key, index) => {
        if (index === 0) {
          label = key;
        } else {
          label = label + " " + key;
        }
      });
      return label;
    }
  }

  getCampaigns = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.token, ""),
      },
      APIUrl: MAILSHAKE_AUTH_URLS.BASE_URL + MAILSHAKE_AUTH_URLS.GET_CAMPAIGNS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.results.length > 0) {
                const campaignData = parsedResponse.results.map((campaign) => {
                  return {
                    value: campaign.id,
                    label: campaign.title,
                  };
                });
                this.setState({
                  campaigns: campaignData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  campaigns: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                campaigns: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getTeamMembers = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.token, ""),
      },
      APIUrl:
        MAILSHAKE_AUTH_URLS.BASE_URL + MAILSHAKE_AUTH_URLS.GET_TEAM_MEMBERS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.results.length > 0) {
                const memberData = parsedResponse.results.map((member) => {
                  return {
                    value: member.id,
                    label: member.emailAddress,
                  };
                });
                this.setState({
                  members: memberData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  members: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                members: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const {
      isLoading,
      boolTypeOption,
      campaigns,
      replyOption,
      messageOption,
      statusOption,
      members,
    } = this.state;
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          <div>
            {fields.map((field) => (
              <>
                {field.key === "campaignID" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={campaigns}
                      value={
                        savedFields[field.key]
                          ? campaigns.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {field.key === "assignedToEmailAddress" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={members}
                      value={
                        savedFields[field.key]
                          ? members.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}
                {field.key === "status" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={statusOption}
                      value={
                        savedFields[field.key]
                          ? statusOption.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {field.key === "campaignMessageType" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={messageOption}
                      value={
                        savedFields[field.key]
                          ? messageOption.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {field.key === "replyType" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={replyOption}
                      value={
                        savedFields[field.key]
                          ? replyOption.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}
                {field.type === "boolean" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Select
                      className="w-100"
                      options={boolTypeOption}
                      value={
                        savedFields[field.key]
                          ? boolTypeOption.find(
                              (val) =>
                                val.value === savedFields[field.key].value
                            )
                          : ""
                      }
                      onChange={(e) =>
                        this.handleChangeSelectValue(e.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}

                {field.key === "matchUrl" && (
                  <div className="col-md-12 my-2">
                    <div className="d-flex justify-content-between">
                      <label className="text-capitalize">
                        {this.getFieldLabel(field)}{" "}
                      </label>
                      {field.required && (
                        <span className="text-danger ml-1">(required)</span>
                      )}
                    </div>
                    <Input
                      className="w-100"
                      defaultValue={
                        savedFields[field.key]
                          ? savedFields[field.key].value
                          : ""
                      }
                      onBlur={(e) =>
                        this.handleChangeSelectValue(e.target.value, field.key)
                      }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                )}
              </>
            ))}

            {fields.length && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="jr-btn jr-btn-sm my-2"
                  onClick={(e) => this.handlelRefreshFields()}
                >
                  <RefreshIcon className="mr-1" />
                  {!isRefreshinFields && <span>Refresh fields</span>}
                  {isRefreshinFields && <span>Refreshing fields...</span>}
                </Button>
              </>
            )}
            {isLoading && (
              <div className="loader-settings m-5">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { loader, selectedEcho } = echo;
  return { loader, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
})(MailShakeSetup);
