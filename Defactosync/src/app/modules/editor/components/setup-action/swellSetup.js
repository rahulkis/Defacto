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
  TYPEFORM_AUTH_URLS,
  SWELL_AUTH_URLS
} from "constants/IntegrationConstant";
import { TextField } from "@material-ui/core";

class SwellSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      promotionsList: [],
      couponsList: [],
      customsList: [],
      errorFound: false,
      discountType: [
        { value: "total", label: "Order Total" },
        { value: "shipment", label: "Shipping" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "promotion_id") &&
        this.state.promotionsList.length === 0
      )
        await this.getPromotions(connectionData);
      if (
        fields.find((field) => field.key === "coupon_id") &&
        this.state.couponsList.length === 0
      )
        await this.getCoupons(connectionData);
      if (
        fields.find((field) => field.key === "customer_id") &&
        this.state.customsList.length === 0
      )
        await this.getCustomers(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "promotion_id") &&
        this.state.promotionsList.length === 0
      )
        await this.getPromotions(connectionData);
      if (
        fields.find((field) => field.key === "coupon_id") &&
        this.state.couponsList.length === 0
      )
        await this.getCoupons(connectionData);
      if (
        fields.find((field) => field.key === "customer_id") &&
        this.state.customsList.length === 0
      )
        await this.getCustomers(connectionData);
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

  getPromotions = async (connection) => {
    let formdata = {
      headerValue: {
        "Api-Token": connection.token,
        Accept: "application/json",
      },
      APIUrl:
      SWELL_AUTH_URLS.GET_PROMOTION.replace("client_id", connection.tokenInfo.client_id).replace("client_key", connection.token)
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
                const promotionsData = parsedResponse.results.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  promotionsList: promotionsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  promotionsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                promotionsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getCoupons = async (connection) => {
    let formdata = {
      headerValue: {
        "Api-Token": connection.token,
        Accept: "application/json",
      },
      APIUrl:
      SWELL_AUTH_URLS.GET_COUPON.replace("client_id", connection.tokenInfo.client_id).replace("client_key", connection.token)
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
                const couponData = parsedResponse.results.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  couponsList: couponData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  couponsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                couponsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getCustomers = async (connection) => {
    let formdata = {
      headerValue: {
        "Api-Token": connection.token,
        Accept: "application/json",
      },
      APIUrl:
      SWELL_AUTH_URLS.GET_CUSTOMER.replace("client_id", connection.tokenInfo.client_id).replace("client_key", connection.token)
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
                const customerData = parsedResponse.results.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  customersList: customerData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  customersList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                customersList: [],
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
      customersList,
      discountType,
      promotionsList,
      couponsList
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
              {(field.key === "name" || field.key === "coupon_code" || field.key === "first_name"
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


              {field.key === "description" && (
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

              {field.key === "discount_type" && (
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
                    options={discountType}
                    value={
                      savedFields[field.key]
                        ? discountType.find(
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

              {(field.key === "amount" || field.key === "last_name") && (
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

            {field.key === "promotion_id" && (
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
                    options={promotionsList}
                    value={
                      savedFields[field.key]
                        ? promotionsList.find(
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

              {field.key === "coupon_id" && (
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
                    options={couponsList}
                    value={
                      savedFields[field.key]
                        ? couponsList.find(
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

            {field.key === "email_address" && (
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

            {field.key === "phone_number" && (
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

              {field.key === "password" && (
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
                      type={"password"}
                    />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}


            {field.key === "customer_id" && (
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
                    options={customersList}
                    value={
                      savedFields[field.key]
                        ? customersList.find(
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

export default SwellSetup;
