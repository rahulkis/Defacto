import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  KEAP_AUTH_URLS,
} from "constants/IntegrationConstant";

class KeapSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      errorFound: false,
      tags: [],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "tagId") &&
        this.state.tags.length === 0
      )
        await this.getTags(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "tagId") &&
        this.state.tags.length === 0
      )
        await this.getTags(connectionData);
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

  getTags = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.tokenInfo.access_token,
        Accept: "application/json",
      },
      APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.GET_TAGS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.tags.length > 0) {
                const tagsData = parsedResponse.tags.map((tag) => {
                  return {
                    value: tag.id,
                    label: tag.name,
                  };
                });
                this.setState({
                  tags: tagsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  tags: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                tags: [],
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
    const { isLoading, tags } = this.state;
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
                {field.key === "tagId" && (
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
                      options={tags}
                      value={
                        savedFields[field.key]
                          ? tags.find(
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
})(KeapSetup);
