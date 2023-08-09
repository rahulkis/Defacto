import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster, authenticateUser } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  MAILSHAKE_AUTH_URLS,
} from "constants/IntegrationConstant";

class MailShakeSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      campaigns: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      pauseOptions: [
        { value: "pause", label: "Pause" },
        { value: "unpause", label: "Unpause" },
      ],
      statusOption: [
        { value: "closed", label: "Won" },
        { value: "lost", label: "Lost" },
        { value: "ignored", label: "Ignored" },
        { value: "reopened", label: "Reopened" },
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
    }
    
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue(value, key) {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const { isLoading, campaigns, pauseOptions, statusOption } = this.state;

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });

    return (
      <>
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
                            (val) => val.value === savedFields[field.key].value
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
                            (val) => val.value === savedFields[field.key].value
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
              {field.key === "action" && (
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
                    options={pauseOptions}
                    value={
                      savedFields[field.key]
                        ? pauseOptions.find(
                            (val) => val.value === savedFields[field.key].value
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
              {(field.key === "link" ||
                field.key === "emailAddress" ||
                field.key === "fullName" ||
                field.key === "first" ||
                field.key === "last" ||
                field.key === "emailColumnName" ||
                field.key === "fullNameColumnName") && (
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
                      savedFields[field.key] ? savedFields[field.key].value : ""
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

              {(field.key === "listOfEmails" ||
                field.key === "emailAddresses") && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <TextField
                    multiline
                    fullWidth
                    rows="3"
                    defaultValue={
                      savedFields[field.key] ? savedFields[field.key].value : ""
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
                {!isRefreshingFields && <span>Refresh fields</span>}
                {isRefreshingFields && <span>Refreshing fields...</span>}
              </Button>
            </>
          )}
          {isLoading && (
            <div className="loader-settings m-5">
              <CircularProgress />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default MailShakeSetup;
