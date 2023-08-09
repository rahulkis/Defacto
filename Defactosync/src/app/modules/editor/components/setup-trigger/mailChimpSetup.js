import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { showErrorToaster} from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  AUTH_INTEGRATION,
  MAILCHIMP_AUTH_URLS,
} from "constants/IntegrationConstant";

class MailChimpSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      audienceList: [],
      campaignList: [],
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      errorFound: false,
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "list_id") &&
        this.state.audienceList.length === 0
      )
        await this.getList(connectionData);
      if (
        fields.find((field) => field.key === "campaign_id") &&
        this.state.campaignList.length === 0
      )
        await this.getCampaignList(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields} = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "list_id") &&
        this.state.audienceList.length === 0
      )
        await this.getList(connectionData);

      if (
        fields.find((field) => field.key === "campaign_id") &&
        this.state.campaignList.length === 0
      )
        await this.getCampaignList(connectionData);
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

  // get list
  getList = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.token}`,
      },
      APIUrl:connection.endPoint+ MAILCHIMP_AUTH_URLS.GET_AUDENCIES,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const listData = parsedResponse.lists.map((list) => {
              return {
                ...list,
                value: list.id,
                label: list.name,
              };
            });
            this.setState({
              audienceList: listData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get list
  getCampaignList = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.token}`,
      },
      APIUrl: connection.endPoint+MAILCHIMP_AUTH_URLS.GET_CAMPAIGNS,
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const campaignData = parsedResponse.campaigns.map((list) => {
              return {
                ...list,
                value: list.id,
                label: list.settings.title,
              };
            });
            this.setState({
              campaignList: campaignData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const {
      isLoading,
      audienceList,
      boolTypeListOptions,
      campaignList,
    } = this.state;
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "list_id" && (
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
                    options={audienceList}
                    value={
                      savedFields[field.key]
                        ? audienceList.find(
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
                    options={campaignList}
                    value={
                      savedFields[field.key]
                        ? campaignList.find(
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

              {field.key === "link_id" && (
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
})(MailChimpSetup);
