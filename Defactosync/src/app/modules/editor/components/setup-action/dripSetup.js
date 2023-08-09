import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster,authenticateUser } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  DRIP_AUTH_URLS,
} from "constants/IntegrationConstant";

class DripSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      accounts: [],
      campaigns: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      statusOptions: [
        { value: "active", label: "Active" },
        { value: "unsubscribed", label: "Unsubscribed" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (
            fld.key === "account_id" &&
            (selectedNode.selectedEventName === "unsubscribe_campaign" ||
              selectedNode.selectedEventName === "subscribe_campaign")
          ) {
            await this.getCampaigns(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "account_id") &&
        this.state.accounts.length === 0
      )
        await this.getAccounts(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (
            fld.key === "account_id" &&
            (selectedNode.selectedEventName === "unsubscribe_campaign" ||
              selectedNode.selectedEventName === "subscribe_campaign")
          ) {
            await this.getCampaigns(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "account_id") &&
        this.state.accounts.length === 0
      )
        await this.getAccounts(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);

    const { connectionData, selectedNode } = this.props;
    if (connectionData) {
      if (
        key === "account_id" &&
        (selectedNode.selectedEventName === "unsubscribe_campaign" ||
          selectedNode.selectedEventName === "subscribe_campaign")
      ) {
        await this.getCampaigns(connectionData, value);
      }
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

  getAccounts = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.token, "X"),
      },
      APIUrl: DRIP_AUTH_URLS.BASE_URL + DRIP_AUTH_URLS.GET_ACCOUNTS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.accounts.length > 0) {
                const accountsData = parsedResponse.accounts.map((account) => {
                  return {
                    value: account.id,
                    label: account.name,
                  };
                });
                this.setState({
                  accounts: accountsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  accounts: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                accounts: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getCampaigns = async (connectionData, account) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.token, "X"),
      },
      APIUrl:
        DRIP_AUTH_URLS.BASE_URL +
        DRIP_AUTH_URLS.GET_CAMPAIGNS.replace("{account_id}", account),
    };
    this.setState({ isLoading: true });   
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {              
              if (parsedResponse.campaigns.length > 0) {
                const campaignsData = parsedResponse.campaigns.map(
                  (campaign) => {
                    return {
                      value: campaign.id,
                      label: campaign.name,
                    };
                  }
                );
                this.setState({
                  campaigns: campaignsData,
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

  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const { isLoading, boolTypeListOptions, accounts, campaigns,statusOptions } = this.state;

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });

    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {(field.key === "email" ||
                field.key === "new_email" ||
                field.key === "time_zone" ||
                field.key === "email_address" ||
                field.key === "starting_email_index" ||
                field.key === "tags" ||
                field.key === "tag" ||
                field.key === "action") && (
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

              {field.key === "account_id" && (
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
                    options={accounts}
                    value={
                      savedFields[field.key]
                        ? accounts.find(
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
              {field.key === "campaign_id" && (
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
              {field.type === "bool" && (
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
                    options={boolTypeListOptions}
                    value={
                      savedFields[field.key]
                        ? boolTypeListOptions.find(
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
                    options={statusOptions}
                    value={
                      savedFields[field.key]
                        ? statusOptions.find(
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

export default DripSetup;
