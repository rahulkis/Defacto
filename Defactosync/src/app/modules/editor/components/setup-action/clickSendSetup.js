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
  CLICKSEND_AUTH_URLS,
} from "constants/IntegrationConstant";

class ClickSendSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      contactList: [],
      addressList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      voiceListOptions: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
      templateListOptions: [
        { value: "0", label: "No" },
        { value: "1", label: "Yes" },
      ],
      colorListOptions: [
        { value: "0", label: "Black & White" },
        { value: "1", label: "Colour" },
      ],
      duplexListOptions: [
        { value: "0", label: "Simplex" },
        { value: "1", label: "Duplex" },
      ],
      priorityListOptions: [
        { value: "0", label: "No" },
        { value: "1", label: "Yes" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {

      if (
        fields.find((field) => field.key === "list_id") &&
        this.state.contactList.length === 0
      )
        await this.getContactList(connectionData);
      if (
        fields.find((field) => field.key === "return_address_id") &&
        this.state.contactList.length === 0
      )
        await this.getReturnAdresses(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {

      if (
        fields.find((field) => field.key === "list_id") &&
        this.state.contactList.length === 0
      )
        await this.getContactList(connectionData);
      if (
        fields.find((field) => field.key === "return_address_id") &&
        this.state.contactList.length === 0
      )
        await this.getReturnAdresses(connectionData);
    }

  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
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

  getContactList = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.email, connectionData.token),
      },
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + CLICKSEND_AUTH_URLS.GET_CONTACTS_LISTS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.data.length > 0) {
                const contactListData = parsedResponse.data.data.map((list) => {
                  return {
                    value: list.list_id,
                    label: list.list_name,
                  };
                });
                this.setState({
                  contactList: contactListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  contactList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                contactList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getReturnAdresses = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connectionData.email, connectionData.token),
      },
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + CLICKSEND_AUTH_URLS.GET_RETURN_ADRESSES,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.data.length > 0) {
                const retrunAddressListData = parsedResponse.data.data.map((list) => {
                  return {
                    value: list.return_address_id,
                    label: list.address_country,
                  };
                });
                this.setState({
                  addressList: retrunAddressListData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  addressList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                addressList: [],
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
    const { isLoading, boolTypeListOptions, contactList, addressList, voiceListOptions, priorityListOptions, duplexListOptions, colorListOptions, templateListOptions } = this.state;

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });

    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {(field.key === "to" ||
                field.key === "first_name" ||
                field.key === "media_file" ||
                field.key === "subject" ||
                field.key === "last_name" ||
                field.key === "phone_number" ||
                field.key === "email" ||
                field.key === "email_address" ||
                field.key === "fax_number" ||
                field.key === "organization_name" ||
                field.key === "custom_1" ||
                field.key === "custom_2" ||
                field.key === "custom_3" ||
                field.key === "custom_4" ||
                field.key === "address_name" ||
                field.key === "list_name" ||
                field.key === "address_line_1" ||
                field.key === "address_line_2" ||
                field.key === "contact_list_id" ||
                field.key === "address_city" ||
                field.key === "address_state" ||
                field.key === "address_postal_code" ||
                field.key === "address_country" ||
                field.key === "custom_string" ||
                field.key === "file_urls" ||
                field.key === "file_url" ||
                field.key === "schedule" ||
                field.key === "contact_id" ||
                field.key === "from") && (
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


              {(field.key === "lang") && (
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
                      savedFields[field.key] ? savedFields[field.key].value : "en-us"
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

              {field.key === "body" && (
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

              {field.type === "bool" &&
                field.key === "priority_post" &&
                selectedNode.selectedEventName === "send_letter" && (
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
                      options={priorityListOptions}
                      value={
                        savedFields[field.key]
                          ? priorityListOptions.find(
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

              {field.type === "bool" &&
                field.key === "priority_post" &&
                selectedNode.selectedEventName === "send_postcard" && (
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

              {field.type === "bool" &&
                field.key === "template_used" && (
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
                      options={templateListOptions}
                      value={
                        savedFields[field.key]
                          ? templateListOptions.find(
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

              {field.key === "voice" && (
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
                    options={voiceListOptions}
                    value={
                      savedFields[field.key]
                        ? voiceListOptions.find(
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

              {field.key === "colour" && (
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
                    options={colorListOptions}
                    value={
                      savedFields[field.key]
                        ? colorListOptions.find(
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
              {field.key === "duplex" && (
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
                    options={duplexListOptions}
                    value={
                      savedFields[field.key]
                        ? duplexListOptions.find(
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
              {field.key === "return_address_id" && (
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
                    options={addressList}
                    value={
                      savedFields[field.key]
                        ? addressList.find(
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
                    options={contactList}
                    value={
                      savedFields[field.key]
                        ? contactList.find(
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

export default ClickSendSetup;
