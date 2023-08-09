import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  GOOGLE_CONTACT_AUTH_URLS,
} from "constants/IntegrationConstant";

class GoogleContactSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      contactsList: [],
      errorFound: false,
      emailTypesList: [
        { value: "home", label: "home" },
        { value: "work", label: "work" },
      ],
      phoneTypesList: [
        { value: "mobile", label: "mobile" },
        { value: "work", label: "work" },
        { value: "home", label: "home" },
        { value: "main", label: "main" },
        { value: "workFax", label: "workFax" },
        { value: "homeFax", label: "homeFax" },
        { value: "googleVoice", label: "googleVoice" },
        { value: "pager", label: "pager" }
      ],
      addressTypesList: [
        { value: "home", label: "home" },
        { value: "work", label: "work" },
      ],
      eventTypesList: [
        { value: "anniversary", label: "anniversary" }      
    ],
    urlTypesList: [
        { value: "home", label: "home" },
        { value: "work", label: "work" },
        { value: "blog", label: "blog" },
        { value: "profile", label: "profile" },
        { value: "homePage", label: "homePage" },
        { value: "ftp", label: "ftp" },
        { value: "reservations", label: "reservations" },
        { value: "appInstallPage", label: "appInstallPage" },
    ],
    relationshipTypesList: [
        { value: "spouse", label: "spouse" },
        { value: "child", label: "child" },
        { value: "mother", label: "mother" },
        { value: "father", label: "father" },
        { value: "parent", label: "parent" },
        { value: "brother", label: "brother" },
        { value: "sister", label: "home" },
        { value: "friend", label: "friend" },
        { value: "domesticpartner", label: "domesticpartner" },
        { value: "manager", label: "manager" },
        { value: "assistant", label: "assistant" },
        { value: "referredBy", label: "referredBy" },
        { value: "partner", label: "partner" },
    ]
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "contact") &&
        this.state.contactsList.length === 0
      )
        await this.getContacts(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "contact") &&
        this.state.contactsList.length === 0
      )
        await this.getContacts(connectionData);
     
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

  getContacts = async (connection) => {
    let formdata = {
        headerValue: {
            "Authorization": "Bearer "+connection.tokenInfo.access_token,
            Accept: "application/json",
            scope: "https://www.googleapis.com/auth/contacts"
        },
        APIUrl:
            connection.endPoint + GOOGLE_CONTACT_AUTH_URLS.GET_CONTACTS
    };
    this.setState({ isLoading: true });
    try {
        await httpClient
            .post(AUTH_INTEGRATION.GET_API, formdata)
            .then((result) => {
                if (result.status === 200) {
                    const parsedResponse = JSON.parse(result.data.res);
                    if (result.status === 200 && !parsedResponse.error) {
                        if (parsedResponse.connections.length > 0) {
                            const contactsData = parsedResponse.connections.map((item) => {
                                return {
                                    value: item.resourceName,
                                    label: item.names && item.names.map(i => {
                                        return i.displayName
                                    }),
                                };
                            });
                            this.setState({
                                contactsList: contactsData,
                                isLoading: false,
                            });
                        } else {
                            this.setState({
                                contactsList: [],
                                isLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            contactsList: [],
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
    const {
      isLoading,
      emailTypesList,
      phoneTypesList,
      addressTypesList,
      eventTypesList,
      urlTypesList,
      relationshipTypesList,
      contactsList
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
              {(field.key === "name" || field.key === "first_name" || field.key === "middle_name" || 
              field.key === "last_name" || field.key === "name_prefix"|| field.key === "name_suffix" || 
              field.key === "job_title" || field.key === "company" || field.key === "email" || 
              field.key === "phone_number" || 
               field.key === "address_street" || field.key === "address_po_box" || field.key === "address_neighborhood" || 
               field.key === "address_city" || field.key === "address_state" || field.key === "address_zip" || 
               field.key === "address_country" || field.key === "birthday" || 
               field.key === "event_date" || field.key === "url" || field.key === "related_person" || field.key === "photo" 
              ) && (
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

              {field.key === "email_type" && (
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
                    options={emailTypesList}
                    value={
                      savedFields[field.key]
                        ? emailTypesList.find(
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

             
            {field.key === "phone_type" && (
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
                    options={phoneTypesList}
                    value={
                      savedFields[field.key]
                        ? phoneTypesList.find(
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

              {field.key === "address_type" && (
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
                    options={addressTypesList}
                    value={
                      savedFields[field.key]
                        ? addressTypesList.find(
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

              {field.key === "event_type" && (
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
                    options={eventTypesList}
                    value={
                      savedFields[field.key]
                        ? eventTypesList.find(
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

            {field.key === "url_type" && (
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
                    options={urlTypesList}
                    value={
                      savedFields[field.key]
                        ? urlTypesList.find(
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

             {field.key === "relationship_type" && (
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
                    options={relationshipTypesList}
                    value={
                      savedFields[field.key]
                        ? relationshipTypesList.find(
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

            {field.key === "contact" && (
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
                    options={contactsList}
                    value={
                      savedFields[field.key]
                        ? contactsList.find(
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

export default GoogleContactSetup;
