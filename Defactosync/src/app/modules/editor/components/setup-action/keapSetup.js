import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  KEAP_AUTH_URLS,
} from "constants/IntegrationConstant";

class KeapSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      fieldsList: [],
      contacts: [],
      users: [],
      tags: [],
      products: [],
      orders: [],
      companies: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      fieldOptions: [
        { value: "email", label: "Email Address" },
        { value: "id", label: "ContactID" },
      ],
      duplicateOptions: [
        { value: "Email", label: "Email" },
        { value: "EmailAndName", label: "Email And Name" },
      ],
      typeOptions: [
        { value: "Appointment", label: "Appointment" },
        { value: "Call", label: "Call" },
        { value: "Email", label: "Email" },
        { value: "Fax", label: "Fax" },
        { value: "Letter", label: "Letter" },
        { value: "Other", label: "Other" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find(
          (field) => field.key === "contact_id" || field.key === "contactId"
        ) &&
        this.state.contacts.length === 0
      )
        await this.getContacts(connectionData);
      if (
        fields.find((field) => field.key === "user_id") &&
        this.state.users.length === 0
      )
        await this.getUsers(connectionData);
        if (
          fields.find((field) => field.key === "tagIds") &&
          this.state.tags.length === 0
        )
          await this.getTags(connectionData);
      if (
        fields.find((field) => field.key === "product") &&
        this.state.products.length === 0
      )
        await this.getProducts(connectionData);

      if (
        fields.find((field) => field.key === "invoice_id") &&
        this.state.orders.length === 0
      )
        await this.getOrders(connectionData);
      if (
        fields.find((field) => field.key === "company") &&
        this.state.companies.length === 0
      )
        await this.getCompanies(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find(
          (field) => field.key === "contact_id" || field.key === "contactId"
        ) &&
        this.state.contacts.length === 0
      )
        await this.getContacts(connectionData);
      if (
        fields.find((field) => field.key === "user_id") &&
        this.state.users.length === 0
      )
        await this.getUsers(connectionData);
      if (
        fields.find((field) => field.key === "tagIds") &&
        this.state.tags.length === 0
      )
        await this.getTags(connectionData);
      if (
        fields.find((field) => field.key === "product") &&
        this.state.products.length === 0
      )
        await this.getProducts(connectionData);
      if (
        fields.find((field) => field.key === "invoice_id") &&
        this.state.orders.length === 0
      )
        await this.getOrders(connectionData);

      if (
        fields.find((field) => field.key === "company") &&
        this.state.companies.length === 0
      )
        await this.getCompanies(connectionData);
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

  getContacts = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.tokenInfo.access_token,
        Accept: "application/json",
      },
      APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.GET_CONTACTS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.contacts.length > 0) {
                const contactsData = parsedResponse.contacts.map((contact) => {
                  return {
                    value: contact.id,
                    label: contact.given_name?`${contact.given_name} ${contact.family_name}`:"No Title",
                  };
                });
                this.setState({
                  contacts: contactsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  contacts: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                contacts: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getUsers = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.tokenInfo.access_token,
        Accept: "application/json",
      },
      APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.GET_USERS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.users.length > 0) {
                const usersData = parsedResponse.users.map((user) => {
                  return {
                    value: user.id,
                    label: `${user.given_name} ${user.family_name}`,
                  };
                });
                this.setState({
                  users: usersData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  users: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                users: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

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

  getProducts = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.tokenInfo.access_token,
        Accept: "application/json",
      },
      APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.GET_PRODUCTS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.products.length > 0) {
                const productsData = parsedResponse.products.map((product) => {
                  return {
                    value: product.id,
                    label: product.product_name,
                  };
                });
                this.setState({
                  products: productsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  products: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                products: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getOrders = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.tokenInfo.access_token,
        Accept: "application/json",
      },
      APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.GET_ORDERS,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.orders.length > 0) {
                const ordersData = parsedResponse.orders.map((order) => {
                  return {
                    value: order.id,
                    label: order.title,
                  };
                });
                this.setState({
                  orders: ordersData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  orders: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                orders: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getCompanies = async (connectionData) => {
    let formdata = {
      headerValue: {
        Authorization: "Bearer " + connectionData.tokenInfo.access_token,
        Accept: "application/json",
      },
      APIUrl: KEAP_AUTH_URLS.BASE_URL + KEAP_AUTH_URLS.GET_COMPANIES,
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.companies.length > 0) {
                const companiesData = parsedResponse.companies.map(
                  (company) => {
                    return {
                      value: company.id,
                      label: company.company_name,
                    };
                  }
                );
                this.setState({
                  companies: companiesData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  companies: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                companies: [],
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
      boolTypeListOptions,
      fieldOptions,
      contacts,
      users,
      typeOptions,
      tags,
      products,
      orders,
      duplicateOptions,
      companies,
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
              {(field.key === "value" ||
                field.key === "email1" ||
                field.key === "email2" ||
                field.key === "email3" ||
                field.key === "phone__number__1" ||
                field.key === "phone__phoneType__1" ||
                field.key === "phone__number__2" ||
                field.key === "phone__phoneType__2" ||
                field.key === "phone__number__3" ||
                field.key === "phone__phoneType__3" ||
                field.key === "phone__number__4" ||
                field.key === "phone__phoneType__4" ||
                field.key === "phone__number__5" ||
                field.key === "phone__phoneType__5" ||
                field.key === "billing_address__country_code" ||
                field.key === "billing_address__line1" ||
                field.key === "billing_address__line2" ||
                field.key === "billing_address__locality" ||
                field.key === "billing_address__region" ||
                field.key === "billing_address__zip_code" ||
                field.key === "shipping_address__country_code" ||
                field.key === "shipping_address__line1" ||
                field.key === "shipping_address__line2" ||
                field.key === "shipping_address__locality" ||
                field.key === "shipping_address__region" ||
                field.key === "shipping_address__zip_code" ||
                field.key === "other_address__country_code" ||
                field.key === "other_address__line1" ||
                field.key === "other_address__line2" ||
                field.key === "other_address__locality" ||
                field.key === "other_address__region" ||
                field.key === "other_address__zip_code" ||
                field.key === "birthday" ||
                field.key === "anniversary" ||
                field.key === "spouse_name" ||
                field.key === "facebook__name" ||
                field.key === "linkedin__name" ||
                field.key === "twitter__name" ||
                field.key === "given_name" ||
                field.key === "job_title" ||
                field.key === "website" ||
                field.key === "family_name" ||
                field.key === "middle_name" ||
                field.key === "prefix" ||
                field.key === "suffix" ||
                field.key === "order_date" ||
                field.key === "product_quantity" ||
                field.key === "price_override" ||
                field.key === "due_date" ||
                field.key === "title" ||
                field.key === "company_name") && (
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

              {(field.key === "description" || field.key === "body") && (
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

              {field.key === "field" && (
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
                    options={fieldOptions}
                    value={
                      savedFields[field.key]
                        ? fieldOptions.find(
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
              {(field.key === "contact_id" || field.key === "contactId") && (
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
                    options={contacts}
                    value={
                      savedFields[field.key]
                        ? contacts.find(
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
              {field.key === "user_id" && (
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
                    options={users}
                    value={
                      savedFields[field.key]
                        ? users.find(
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

              {field.key === "type" && (
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
                    options={typeOptions}
                    value={
                      savedFields[field.key]
                        ? typeOptions.find(
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

              {field.key === "invoice_id" && (
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
                    options={orders}
                    value={
                      savedFields[field.key]
                        ? orders.find(
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

              {field.key === "product" && (
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
                    options={products}
                    value={
                      savedFields[field.key]
                        ? products.find(
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

              {(field.key === "tagIds" || field.key === "tag_ids") && (
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

              {field.key === "duplicate_option" && (
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
                    options={duplicateOptions}
                    value={
                      savedFields[field.key]
                        ? duplicateOptions.find(
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
              {field.key === "company" && (
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
                    options={companies}
                    value={
                      savedFields[field.key]
                        ? companies.find(
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
              {field.key === "optIn" && (
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

export default KeapSetup;
