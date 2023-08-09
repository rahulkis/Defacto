import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { ToastsStore } from "react-toasts";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  AUTH_INTEGRATION,
  GMAIL_AUTH_URLS,
} from "constants/IntegrationConstant";

class GmailSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      errorFound: false,
      labels: [],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
       
        if (
          fields.find((field) => field.key === "label_ids") &&
          this.state.labels.length === 0
        )
          await this.getLabels(connectionData);
      }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
     if (connectionData) {
       
        if (
          fields.find((field) => field.key === "label_ids") &&
          this.state.labels.length === 0
        )
          await this.getLabels(connectionData);
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

  // get labels
  getLabels = async (connection) => {
    this.setState({       
        isLoading: true
      });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GMAIL_AUTH_URLS.GET_LABELS,
    };
   
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {         
            const parsedResponse = JSON.parse(result.data.res);        
            if (result.status === 200 && !parsedResponse.error) {            
              const labelData = parsedResponse.labels.map((label) => {
                return {
                  value: label.id,
                  label: label.name,
                };
              });
              this.setState({
                labels: labelData,
                isLoading: false,
              });
            } else {
              this.setState({                
                isLoading: false,
              });
              ToastsStore.error("Token expired!.Please reconnect connection.")
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    } 
  };

  // get messages
  getMessages = async (connection) => {
    this.setState({       
        isLoading: true
      });
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GMAIL_AUTH_URLS.GET_LABELS,
    };
   
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {         
            const parsedResponse = JSON.parse(result.data.res);        
            if (result.status === 200 && !parsedResponse.error) {            
              const labelData = parsedResponse.labels.map((label) => {
                return {
                  value: label.id,
                  label: label.name,
                };
              });
              this.setState({
                labels: labelData,
                isLoading: false,
              });
            } else {
              this.setState({                
                isLoading: false,
              });
              ToastsStore.error("Token expired!.Please reconnect connection.")
            }
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    } 
  };

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const { isLoading, labels } = this.state;
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "label_ids" && (
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
                    options={labels}
                    value={
                      savedFields[field.key]
                        ? labels.find(
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
})(GmailSetup);
