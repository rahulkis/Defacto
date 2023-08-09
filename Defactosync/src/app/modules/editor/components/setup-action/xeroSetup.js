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
  XERO_AUTH_URLS,
  SWELL_AUTH_URLS
} from "constants/IntegrationConstant";
import { TextField } from "@material-ui/core";

class XeroSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      organizationList: [],
      groupsList: [],
      contactsList: [],
      currencyList: [],
      itemList: [],
      accountsList: [],
      themesList: [],
      errorFound: false,
      addressTypeOf: [
        { value: "POBOX", label: "Postal Address" },
        { value: "STREET", label: "Street Address" },
      ],
      type: [
        {value: "ACCPAYCREDIT", label: "Bill Credit Note (Accounts Payable)"},
        {value: "ACCRECCREDIT", label: "Sales Credit Note (Accounts Receivable)"},
      ],
      tax_type: [
        {value: "Exclusive", label: "TAX EXCLUSIVE"},
        {value: "Inclusive", label: "TAX INCLUSIVE"},
        {value: "NoTax", label: "NO TAX"},
      ],
      item_tax_type: [
        {value: "NONE", label: "Tax Exempt"},
        {value: "INPUT", label: "Tax on Purchases"},
        {value: "OUTPUT", label: "Tax on Sales"},
      ],
      credit_note_status: [
        {value: "DRAFT", label: "Draft"},
        {value: "SUBMITTED", label: "Awaiting Approval"},
        {value: "AUTHORISED", label: "Awaiting Payment"},
        {value: "PAID", label: "Paid"},
      ],
      items_tax_type: [
        {value: "NONE", label: "Tax Exempt"},
        {value: "INPUT", label: "Tax on Purchases"},
        {value: "OUTPUT", label: "Tax on Sales"},
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "organization") &&
        this.state.organizationList.length === 0
      )
        await this.getOrganization(connectionData);
      if (
        fields.find((field) => field.key === "groups") &&
        this.state.groupsList.length === 0
      )
        await this.getGroups(connectionData);
      if (
        fields.find((field) => field.key === "contact") || 
        fields.find((field) => field.key === "contact_name") ||
        fields.find((field) => field.key === "contact_supplier")
         &&
        this.state.contactsList.length === 0
      )
        await this.getContacts(connectionData);

      if (
        fields.find((field) => field.key === "item_code") &&
        this.state.itemList.length === 0
      )
        await this.getItems(connectionData);
      
      if (
        fields.find((field) => field.key === "currency") &&
        this.state.currencyList.length === 0
      )
        await this.getCurrency(connectionData);

      if (
        fields.find((field) => field.key === "account") &&
        this.state.accountsList.length === 0
      )
        await this.getAccounts(connectionData);

      if (
        fields.find((field) => field.key === "theme") &&
        this.state.themesList.length === 0
      )
        await this.getThemes(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "organization") &&
        this.state.organizationList.length === 0
      )
        await this.getOrganization(connectionData);
      if (
        fields.find((field) => field.key === "groups") &&
        this.state.groupsList.length === 0
      )
        await this.getGroups(connectionData);
      if (
        fields.find((field) => field.key === "contact") || 
        fields.find((field) => field.key === "contact_name") ||
        fields.find((field) => field.key === "contact_supplier") &&
        this.state.contactsList.length === 0
      )
        await this.getContacts(connectionData);

      if (
        fields.find((field) => field.key === "item_code") &&
        this.state.itemList.length === 0
      )
        await this.getItems(connectionData);

      if (
        fields.find((field) => field.key === "currency") &&
        this.state.currencyList.length === 0
      )
        await this.getCurrency(connectionData);

      if (
        fields.find((field) => field.key === "account") &&
        this.state.accountsList.length === 0
      )
        await this.getAccounts(connectionData);

      if (
        fields.find((field) => field.key === "theme") &&
        this.state.themesList.length === 0
      )
        await this.getThemes(connectionData);
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

  getOrganization = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.ORGANIZATION_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.Organisations.length > 0) {
                const organizationData = parsedResponse.Organisations.map((item) => {
                  return {
                    value: item.OrganisationID,
                    label: item.LegalName,
                  };
                });
                this.setState({
                  organizationList: organizationData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  organizationList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                organizationList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getGroups = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.GROUPS_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.ContactGroups.length > 0) {
                const groupData = parsedResponse.ContactGroups.map((item) => {
                  return {
                    value: item.ContactGroupID,
                    label: item.Name,
                  };
                });
                this.setState({
                  groupsList: groupData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  groupsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                groupsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getContacts = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.CONTACT_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.Contacts.length > 0) {
                const contactData = parsedResponse.Contacts.map((item) => {
                  return {
                    value: item.ContactID,
                    label: item.Name,
                  };
                });
                this.setState({
                  contactsList: contactData,
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

  getCurrency = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.CURRENCY_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.Currencies.length > 0) {
                const currencyData = parsedResponse.Currencies.map((item) => {
                  return {
                    value: item.Code,
                    label: item.Description,
                  };
                });
                this.setState({
                  currencyList: currencyData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  currencyList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                currencyList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };


  getItems = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.ITEM_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.Items.length > 0) {
                const itemData = parsedResponse.Items.map((item) => {
                  return {
                    value: item.Code,
                    label: item.Name !== undefined ? item.Name : item.Code,
                  };
                });
                this.setState({
                  itemList: itemData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  itemList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                itemList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };


  getAccounts = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.ACCOUNT_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.Accounts.length > 0) {
                const accountData = parsedResponse.Accounts.map((item) => {
                  return {
                    value: item.Code,
                    label: item.Name,
                  };
                });
                this.setState({
                  accountsList: accountData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  accountsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                accountsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getThemes = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connection.tokenInfo.access_token,
        Accept: "application/json",
        "xero-tenant-id": connection.memberId
      },
      APIUrl:
      XERO_AUTH_URLS.BASE_URL + XERO_AUTH_URLS.THEME_GET
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.BrandingThemes.length > 0) {
                const themeData = parsedResponse.BrandingThemes.map((item) => {
                  return {
                    value: item.BrandingThemeID,
                    label: item.Name,
                  };
                });
                this.setState({
                  themesList: themeData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  themesList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                themesList: [],
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
      organizationList,
      groupsList,
      addressTypeOf,
      type,
      contactsList,
      currencyList,
      tax_type,
      itemList, 
      accountsList,
      item_tax_type,
      credit_note_status,
      themesList,
      items_tax_type
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
              {(field.key === "organization"
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
                    <Select
                    className="w-100"
                    options={organizationList}
                    value={
                      savedFields[field.key]
                        ? organizationList.find(
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


              {(field.key === "contact_supplier" || field.key === "contact") && (
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


              {(field.key === "contact_name" || field.key === "account_number" || field.key === "description" || field.key === "delivery_date" ||
              field.key === "primary_person - first_name" || field.key === "date" || field.key === "order_number" ||
              field.key === "primary_person - last_name" || field.key === "quantity_1.0" || field.key === "reference" ||
              field.key === "primary_person - email" || field.key === "unit_price_1.0" ||
              field.key === "phone - country_code" || field.key === "discount_%_1.0" ||
              field.key === "phone - area_code" || field.key === "attention" ||
              field.key === "phone_number" || field.key === "telephone" ||
              field.key === "fax - country_code" || field.key === "fax - area_code" ||
              field.key === "fax - number" ||
              field.key === "mobile - country_code" ||
              field.key === "mobile - area_code" ||
              field.key === "mobile - number" ||
              field.key === "direct_dial - country_code" ||
              field.key === "direct_dial - area_code" ||
              field.key === "direct_dial - number" ||
              field.key === "address - attention" ||
              field.key === "address - line_1" ||
              field.key === "address - line_2" ||
              field.key === "address - city/town" ||
              field.key === "address - state/region" ||
              field.key === "address - postal/zip_code" ||
              field.key === "address - country" ||
              field.key === "tax_number" ||
              field.key === "bank_account_number" ||
              field.key === "expiry" ||
              field.key === "quote_number" ||
              field.key === "title" ||
              field.key === "summary" ||
              field.key === "code" || field.key === "name"
              
              ) && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
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

             

            {(field.key === "delivery_address" || field.key === "delivery_instructions" || field.key === "terms")&& (
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


              

            {field.key === "address_type_of" && (
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
                    options={addressTypeOf}
                    value={
                      savedFields[field.key]
                        ? addressTypeOf.find(
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

          

           {field.key === "groups" && (
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
                    options={groupsList}
                    value={
                      savedFields[field.key]
                        ? groupsList.find(
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

          {field.key === "Type" && (
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
                    options={type}
                    value={
                      savedFields[field.key]
                        ? type.find(
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


            {field.key === "currency" && (
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
                    options={currencyList}
                    value={
                      savedFields[field.key]
                        ? currencyList.find(
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

          {(field.key === "tax_type" || field.key === "amounts_are") && (
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
                    options={tax_type}
                    value={
                      savedFields[field.key]
                        ? tax_type.find(
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


            {field.key === "item_code" && (
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
                    options={itemList}
                    value={
                      savedFields[field.key]
                        ? itemList.find(
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

          {field.key === "account" && (
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
                    options={accountsList}
                    value={
                      savedFields[field.key]
                        ? accountsList.find(
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

           {field.key === "item_tax_rate" && (
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
                    options={item_tax_type}
                    value={
                      savedFields[field.key]
                        ? item_tax_type.find(
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

          {(field.key === "credit_note_status" || field.key === "purchase_order_status") && (
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
                    options={credit_note_status}
                    value={
                      savedFields[field.key]
                        ? credit_note_status.find(
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

          {field.key === "theme" && (
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
                    options={themesList}
                    value={
                      savedFields[field.key]
                        ? themesList.find(
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


           {field.key === "items_tax_type" && (
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
                    options={items_tax_type}
                    value={
                      savedFields[field.key]
                        ? items_tax_type.find(
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

export default XeroSetup;
