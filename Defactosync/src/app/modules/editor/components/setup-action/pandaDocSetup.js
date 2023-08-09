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
  PANDADOC_AUTH_URLS
} from "constants/IntegrationConstant";

class PandaDocSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      templatesList: [],
      foldersList: [],
      currencyList: [
        {value: "AED", label: "United Arab Emirates Dirham"},
        {value: "AFN", label: "Afghan Afghani"},
        {value: "ALL", label: "Albanian Lek"},
        {value: "AMD", label: "Armenian Dram"},
        {value: "AOA", label: "Angolan Kwanza"},
        {value: "ARS", label: "Argentine Peso"},
        {value: "AUD", label: "Australian Dollar"},
        {value: "AWG", label: "Aruban Florin"},
        {value: "AZN", label: "Azerbaijani Manat"},
        {value: "BAM", label: "Bosnia-Herzegovina Convertible Mark"},
        {value: "BBD", label: "Barbadian Dollar"},
        {value: "BDT", label: "Bangladeshi Taka"},
        {value: "BGN", label: "Bulgarian Lev"},
        {value: "BHD", label: "Bahraini Dinar"},
        {value: "BIF", label: "Burundian Franc"},
        {value: "BMD", label: "Bermudan Dollar"},
        {value: "BND", label: "Brunei Dollar"},
        {value: "BOB", label: "Bolivian Boliviano"},
        {value: "BRL", label: "Brazilian Real"},
        {value: "BWP", label: "Botswanan Pula"},
        {value: "BYN", label: "Belarusian Ruble"},
        {value: "BZD", label: "Belize Dollar"},
        {value: "CAD", label: "Canadian Dollar"},
        {value: "CDF", label: "Congolese Franc"},
        {value: "CHF", label: "Swiss Franc"},
        {value: "CLP", label: "Chilean Peso"},
        {value: "CNY", label: "Chinese Yuan"},
        {value: "COP", label: "Colombian Peso"},
        {value: "CRC", label: "Costa Rican Colon"},
        {value: "CUC", label: "Peso Convertible"},
        {value: "CVE", label: "Cape Verdean Escudo"},
        {value: "CZK", label: "Czech Republic Koruna"},
        {value: "DJF", label: "Djiboutian Franc"},
        {value: "DKK", label: "Danish Krone"},
        {value: "DOP", label: "Dominican Peso"},
        {value: "DZD", label: "Algerian Dinar"},
        {value: "EGP", label: "Egyptian Pound"},
        {value: "ERN", label: "Eritrean Nakfa"},
        {value: "ETB", label: "Ethiopian Birr"},
        {value: "EUR", label: "Euro"},
        {value: "FJD", label: "Fijian Dollar"},
        {value: "GBP", label: "British Pound Sterling"},
        {value: "GEL", label: "Georgian Lari"},
        {value: "GHS", label: "Ghanaian Cedi"},
        {value: "GNF", label: "Guinean Franc"},
        {value: "GTQ", label: "Guatemalan Quetzal"},
        {value: "GYD", label: "Guyanaese Dollar"},
        {value: "HKD", label: "Hong Kong Dollar"},
        {value: "HNL", label: "Honduran Lempira"},
        {value: "HRK", label: "Croatian Kuna"},
        {value: "HUF", label: "Hungarian Forint"},
        {value: "IDR", label: "Indonesian Rupiah"},
        {value: "ILS", label: "Israeli New Sheqel"},
        {value: "INR", label: "Indian Ruppee"},
        {value: "IQD", label: "Iraqi Dinar"},
        {value: "IRR", label: "Iranian Rial"},
        {value: "ISK", label: "Icelandic Krona"},
        {value: "JMD", label: "Jamaican Dollar"},
        {value: "JOD", label: "Jordanian Dinar"},
        {value: "JPY", label: "Japanese Yen"},
        {value: "KES", label: "Kenyan Shilling"},
        {value: "KHR", label: "Cambodian Riel"},
        {value: "KMF", label: "Comorian Franc"},
        {value: "KRW", label: "South Korean Won"},
        {value: "KWD", label: "Kuwaiti Dinar"},
        {value: "KZT", label: "Kazakhstani Tenge"},
        {value: "LBP", label: "Lebanese Pound"},
        {value: "LKR", label: "Sri Lankan Rupee"},
        {value: "LRD", label: "Liberian Dollar"},
        {value: "LTL", label: "Lithuanian Litas"},
        {value: "LVL", label: "Latvian Lats"},
        {value: "LYD", label: "Libyan Dinar"},
        {value: "MAD", label: "Moroccan Dirham"},
        {value: "MDL", label: "Moldovan Leu"},
        {value: "MGA", label: "Malagasy Ariary"},
        {value: "MKD", label: "Macedonian Denar"},
        {value: "MMK", label: "Myanma Kyat"},
        {value: "MOP", label: "Macanese Pataca"},
        {value: "MUR", label: "Mauritian Rupee"},
        {value: "MXN", label: "Mexican Peso"},
        {value: "MYR", label: "Malaysian Ringgit"},
        {value: "MZN", label: "Mozambican Metical"},
        {value: "NAD", label: "Namibian Dollar"},
        {value: "NGN", label: "Nigerian Naira"},
        {value: "NIO", label: "Nicaraguan Cordoba"},
        {value: "NOK", label: "Norwegian Krone"},
        {value: "NPR", label: "Nepalese Rupee"},
        {value: "NZD", label: "New Zealand Dollar"},
        {value: "OMR", label: "Omani Rial"},
        {value: "PAB", label: "Panamanian Balboa"},
        {value: "PEN", label: "Peruvian Nuevo Sol"},
        {value: "PGK", label: "Papua New Guinean Kina"},
        {value: "PHP", label: "Philippine Peso"},
        {value: "PKR", label: "Pakistani Rupee"},
        {value: "PLN", label: "Polish Zloty"},
        {value: "PYG", label: "Paraguayan Guarani"},
        {value: "QAR", label: "Qatari Rial"},
        {value: "RON", label: "Romanian Lue"},
        {value: "RSD", label: "Serbian Dinar"},
        {value: "RUB", label: "Russian Ruble"},
        {value: "RWF", label: "Rwandan Franc"},
        {value: "SAR", label: "Saudi Riyal"},
        {value: "SDG", label: "Sudanese Pound"},
        {value: "SEK", label: "Swedish Krona"},
        {value: "SGD", label: "Singapore Dollar"},
        {value: "SOS", label: "Somali Shilling"},
        {value: "SYP", label: "Syrain Pound"},
        {value: "THB", label: "Thai Baht"},
        {value: "TND", label: "Tunisian Dinar"},
        {value: "TRY", label: "Turkish Lira"},
        {value: "TTD", label: "Trinidad and Tobago Dollar"},
        {value: "TWD", label: "New Taiwan Dollar"},
        {value: "TZS", label: "Tanzanian Shilling"},
        {value: "UAH", label: "Ukrainian Hryvnia"},
        {value: "UF", label: "Unidad de Fomento"},
        {value: "UGX", label: "Ugandan Shilling"},
        {value: "USD", label: "US Dollar"},
        {value: "UYU", label: "Uruguayan Peso"},
        {value: "UZS", label: "Uzbekistan Som"},
        {value: "VEF", label: "VeneZuelan Bolivar"},
        {value: "VND", label: "Vietlabelse Dong"},
        {value: "XAF", label: "CFA Franc BEAC"},
        {value: "XOF", label: "CFA Franc BCEAO"},
        {value: "YER", label: "Yemeni Rail"},
        {value: "ZAR", label: "South African Rand"},
        {value: "ZMK", label: "Zambian Kwacha"},
       
      ],
      errorFound: false,
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "template") &&
        this.state.templatesList.length === 0
      )
        await this.getTemplates(connectionData);
    if (
        fields.find((field) => field.key === "folder") &&
        this.state.foldersList.length === 0
        )
        await this.getFolders(connectionData);
      
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
        if (
            fields.find((field) => field.key === "template") &&
            this.state.templatesList.length === 0
          )
            await this.getTemplates(connectionData);
        if (
            fields.find((field) => field.key === "folder") &&
            this.state.foldersList.length === 0
            )
            await this.getFolders(connectionData);
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

  getTemplates = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "API-key " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      PANDADOC_AUTH_URLS.BASE_URL + PANDADOC_AUTH_URLS.GET_TEMPLATES
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
                const templatesData = parsedResponse.results.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  templatesList: templatesData,
                  isLoading: false,
                });
              } else {
                this.setState({
                    templatesList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                templatesList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getFolders = async (connection) => {
    let formdata = {
      headerValue: {
        Authorization: "API-key " + connection.token,
        Accept: "application/json",
      },
      APIUrl:
      PANDADOC_AUTH_URLS.BASE_URL + PANDADOC_AUTH_URLS.GET_FOLDERS
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
                const foldersData = parsedResponse.results.map((item) => {
                  return {
                    value: item.uuid,
                    label: item.name,
                  };
                });
                this.setState({
                  foldersList: foldersData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  foldersList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                foldersList: [],
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
      templatesList,
      foldersList,
      currencyList,
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
              {(field.key === "document_name" || field.key === "sender_email" || field.key === "sender_first_name" || 
                field.key === "sender_last_name" || field.key === "sender_company" || field.key === "sender_phone" ||
                 field.key === "client_email" || field.key === "client_first_name" || field.key === "client_last_name" || 
                 field.key === "client_company" || field.key === "client_phone" || field.key === "pricing_table_name" || 
                 field.key === "product_name"|| field.key === "product_description" || field.key === "product_price" || 
                 field.key === "product_quantity" || field.key === "product_discount" ||
                 field.key === "email" || field.key === "first_name" || field.key === "last_name" || 
                 field.key === "company" || field.key === "phone" || field.key === "job_title" || 
                 field.key === "street_address" || field.key === "city" || field.key === "postal_code" || 
                 field.key === "state" || field.key === "name"
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


              {field.key === "template" && (
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
                    options={templatesList}
                    value={
                      savedFields[field.key]
                        ? templatesList.find(
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

            {field.key === "folder" && (
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
                    options={foldersList}
                    value={
                      savedFields[field.key]
                        ? foldersList.find(
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

            {field.key === "pricing_table_currency" && (
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

export default PandaDocSetup;
