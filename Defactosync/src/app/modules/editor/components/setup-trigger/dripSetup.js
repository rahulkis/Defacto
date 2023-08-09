import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { showErrorToaster ,authenticateUser} from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  DRIP_AUTH_URLS,
  AUTH_INTEGRATION,
} from "constants/IntegrationConstant";

class DripSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      errorFound: false,
      accounts: [],
    };
  }

  componentWillMount() {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "account_id") &&
        this.state.accounts.length === 0
      )
        this.getAccounts(connectionData);
    }
  }

  componentWillReceiveProps() {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "account_id") &&
        this.state.accounts.length === 0
      )
        this.getAccounts(connectionData);
    }
  }

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

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const { isLoading, accounts } = this.state;
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
})(DripSetup);
