import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import {
  PostData,
  GetData,
  Delete,
  PostDataIntegation,
} from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  ZOHOCRMAUTH_URLS,
  MAILER_LITE_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import { createRecordOnZohoCRM } from "../../../API/IntegrationAPI";
import { calculateTime } from "../../../util/commonFunction";

class ZohoCRMAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      isAccountSelected: false,
      APIKey: "",
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      headerName: "Create a record",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      moduleTypes: [],
      layoutTypes: [],
      isValidated: false,
      emailAddress: "",
      accessTokenDetails: null,
      selectedModuleType: "",
      fieldsList: [],
      isLoadingZohoData: false,
      isTriggerWorkflow: false,
      fieldsDataToSubmit: {},
    };
    this.conditionCount = 0;
  }

  componentWillMount() {
    this.getAccountList();
    if (this.props.code !== "") {
      let uri = window.location.toString();
      this.getAccessToken();

      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
    }
    this.setState({
      headerName: localStorage.Type,
    });
    GetData(FORM_URLS.GET_FORM_BY_ID_URL + localStorage.FormId).then(
      (result) => {
        if (result != null && result.Item !== undefined) {
          if (result.Item.SubmissionCount && result.Item.SubmissionCount > 0) {
            this.setState({ formSubmitted: true });
          } else {
            this.setState({ formSubmitted: false });
          }
        }
      }
    );
  }

  getAccessToken = () => {
    if (this.props.code !== "") {
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", ZOHOCRMAUTH_URLS.CLIENT_ID);
      bodyFormData.append("client_secret", ZOHOCRMAUTH_URLS.CLIENT_SECRET);
      bodyFormData.append("code", this.props.code);
      bodyFormData.append(
        "redirect_uri",
        `${window.location.origin.toString()}/user/IntegrationNwebhooks`
      );
      bodyFormData.append("grant_type", "authorization_code");

      PostDataIntegation(ZOHOCRMAUTH_URLS.ACCESS_TOKEN_URL, bodyFormData).then(
        (result) => {
          if (result != null) {
            if (result.access_token !== undefined) {
              this.setState({ accessTokenDetails: result });
              this.getAccountDetailByToken(result.access_token);
            }
          }
        }
      );
    }
  };
  getAccessTokenFromRefershToken = (refreshToken) => {
    this.setState({
      isLoadingZohoData: true,
    });
    if (refreshToken !== "") {
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", ZOHOCRMAUTH_URLS.CLIENT_ID);
      bodyFormData.append("client_secret", ZOHOCRMAUTH_URLS.CLIENT_SECRET);
      bodyFormData.append("refresh_token", refreshToken);
      bodyFormData.append("grant_type", "refresh_token");

      PostDataIntegation(ZOHOCRMAUTH_URLS.ACCESS_TOKEN_URL, bodyFormData).then(
        (result) => {
          if (result != null) {
            if (result.access_token !== undefined) {
              this.setState({ accessTokenDetails: result });
              this.getZohoModules(result.access_token);
            }
          }
        }
      );
    }
  };

  getZohoModules(token) {
    let formModel = {
      APIUrl: ZOHOCRMAUTH_URLS.ZOHO_MODULES_API,
      headerValue: "Zoho-oauthtoken " + token,
    };
    try {
      PostData(ZOHOCRMAUTH_URLS.GET_ACCOUNT_DETAILS_URL, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            const parsedData = JSON.parse(result.res);
            if (parsedData["modules"]) {
              const modulesData = parsedData["modules"];
              let modulesArray = [];
              modulesData.forEach((module) => {
                if (
                  module.profiles.length &&
                  (module.api_name === "Leads" ||
                    module.api_name === "Contacts" ||
                    module.api_name === "Accounts" ||
                    module.api_name === "Tasks" ||
                    module.api_name === "Campaigns" ||
                    module.api_name === "Vendors" ||
                    module.api_name === "Cases" ||
                    module.api_name === "Solutions")
                ) {
                  let layoutsArray = [];
                  module.profiles.forEach((profile) => {
                    const proData = {
                      value: profile.id,
                      label: profile.name,
                    };
                    layoutsArray.push(proData);
                  });
                  const mdata = {
                    value: module.id,
                    label: module.api_name,
                    layouts: layoutsArray,
                  };
                  modulesArray.push(mdata);
                }
              });
              this.setState({
                moduleTypes: modulesArray,
                isLoadingZohoData: false,
              });
            } else {
              this.setState({
                moduleTypes: [],
                isLoadingZohoData: false,
              });
              alert("Something went wrong. Please try again.");
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        moduleTypes: [],
        isLoadingZohoData: false,
      });
      alert("Something went wrong. Please try again.");
    }
  }

  getLayoutForSelectedModule(moduledType) {
    this.setState({
      isLoadingFields: true,
    });
    let formModel = {
      APIUrl: ZOHOCRMAUTH_URLS.ZOHO_LAYOUTS_API + moduledType,
      headerValue:
        "Zoho-oauthtoken " + this.state.accessTokenDetails.access_token,
    };
    try {
      PostData(ZOHOCRMAUTH_URLS.GET_ACCOUNT_DETAILS_URL, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            const parsedData = JSON.parse(result.res);
            if (parsedData["layouts"]) {
              const layoutsData = parsedData["layouts"];
              let layoutsArray = [];
              layoutsData.forEach((layout) => {
                if (layout.profiles.length) {
                  const data = {
                    value: layout.id,
                    label: layout.name,
                  };
                  layoutsArray.push(data);
                }
              });
              this.setState({
                layoutTypes: layoutsArray,
                isLoadingZohoData: false,
              });
              this.getFieldsForSelectedModule(moduledType);
            } else {
              this.setState({
                layoutTypes: [],
                isLoadingFields: false,
              });
              alert("Something went wrong. Please try again.");
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        layoutTypes: [],
        isLoadingFields: false,
      });
      alert("Something went wrong. Please try again.");
    }
  }

  checkValidation(newData) {
    const keysArray = Object.keys(newData);
    keysArray.forEach((fieldName) => {
      if (
        this.state.selectedModuleType.label === "Leads" ||
        this.state.selectedModuleType.label === "Contacts"
      ) {
        if (fieldName === "Last_Name") {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else if (this.state.selectedModuleType.label === "Accounts") {
        if (fieldName === "Account_Name") {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else if (this.state.selectedModuleType.label === "Tasks") {
        if (fieldName === "Subject") {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else if (this.state.selectedModuleType.label === "Campaigns") {
        if (fieldName === "Campaign_Name") {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else if (this.state.selectedModuleType.label === "Vendors") {
        if (fieldName === "Vendor_Name") {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else if (this.state.selectedModuleType.label === "Cases") {
        if (
          fieldName === "Case_Origin" ||
          fieldName === "Status" ||
          fieldName === "Subject"
        ) {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else if (this.state.selectedModuleType.label === "Solutions") {
        if (fieldName === "Solution_Title") {
          if (newData[fieldName] && newData[fieldName] !== "") {
            this.setState({
              isValidated: true,
            });
          } else {
            this.setState({
              isValidated: false,
            });
          }
        } else {
          this.setState({
            isValidated: true,
          });
        }
      } else {
        this.setState({
          isValidated: true,
        });
      }
    });
  }

  getFieldsForSelectedModule(moduledType) {
    let formModel = {
      APIUrl: ZOHOCRMAUTH_URLS.ZOHO_FIELDS_API + moduledType,
      headerValue:
        "Zoho-oauthtoken " + this.state.accessTokenDetails.access_token,
    };
    try {
      PostData(ZOHOCRMAUTH_URLS.GET_ACCOUNT_DETAILS_URL, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            const parsedData = JSON.parse(result.res);
            if (parsedData["fields"]) {
              const fieldsData = parsedData["fields"];
              let fieldsArray = [];
              fieldsData.forEach((field) => {
                if (
                  field.visible &&
                  (field.data_type === "text" ||
                    field.data_type === "picklist" ||
                    field.data_type === "integer" ||
                    field.data_type === "phone" ||
                    field.data_type === "Date" ||
                    field.data_type === "datetime" ||
                    field.data_type === "textarea" ||
                    field.data_type === "email")
                ) {
                  let listOptions = [];
                  field.pick_list_values.forEach((option) => {
                    const opt = {
                      value: option.actual_value,
                      label: option.display_value,
                    };
                    listOptions.push(opt);
                  });
                  const fData = {
                    id: field.api_name,
                    label: field.display_label,
                    json_type: field.json_type,
                    type: field.data_type,
                    options: listOptions,
                  };
                  fieldsArray.push(fData);
                }
              });
              this.setState({
                fieldsList: fieldsArray,
                isLoadingFields: false,
              });
            } else {
              console.log(parsedData);
              this.setState({
                fieldsList: [],
                isLoadingFields: false,
              });
              alert("Something went wrong. Please try again");
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
      this.setState({
        fieldsList: [],
        isLoadingZohoData: false,
        isLoadingFields: false,
      });
      alert("Something went wrong. Please try again.");
    }
  }

  getMandatoryFields(fieldName) {
    if (
      this.state.selectedModuleType.label === "Leads" ||
      this.state.selectedModuleType.label === "Contacts"
    ) {
      if (fieldName === "Last_Name") {
        return true;
      } else {
        return false;
      }
    } else if (this.state.selectedModuleType.label === "Accounts") {
      if (fieldName === "Account_Name") {
        return true;
      } else {
        return false;
      }
    } else if (this.state.selectedModuleType.label === "Tasks") {
      if (fieldName === "Subject") {
        return true;
      } else {
        return false;
      }
    } else if (this.state.selectedModuleType.label === "Campaigns") {
      if (fieldName === "Campaign_Name") {
        return true;
      } else {
        return false;
      }
    } else if (this.state.selectedModuleType.label === "Vendors") {
      if (fieldName === "Vendor_Name") {
        return true;
      } else {
        return false;
      }
    } else if (this.state.selectedModuleType.label === "Cases") {
      if (
        fieldName === "Case_Origin" ||
        fieldName === "Status" ||
        fieldName === "Subject"
      ) {
        return true;
      } else {
        return false;
      }
    } else if (this.state.selectedModuleType.label === "Solutions") {
      if (fieldName === "Solution_Title") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  componentDidMount() {}

  addAuthAccnt = (data) => {
    let formModel = {
      ID: DraftJS.genKey(),
      Email: data.email,
      AccountName: data.first_name,
      ApiEndPoint: data.api_endpoint,
      MemberId: data.id,
      TeamName: "My ZohoCRM",
      Type: "ZohoCRM",
      CreatedAt: Date.now(),
      RefreshToken: this.state.accessTokenDetails.refresh_token,
      KeyType:"refreshToken",
      CreatedBy:this.loginUserId
    };
    this.setState({ selectedAccntID: formModel.ID });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          this.getAccountList();
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };

  connectZohoCRM = () => {
    if (this.state.APIKey === "") {
      this.setState({ isInValid: true });
    } else {
      this.addAuthAccnt();
      this.setState({ showModal: false });
    }
  };
  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let googleArr = result.Items.filter((data) => data.Type === "ZohoCRM");
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            label:
              googleArr[i].TeamName +
              "(" +
              googleArr[i].Email +
              ")" +
              " Created  " +
              calculateTime(googleArr[i].CreatedAt) +
              " ago",
            value: googleArr[i].ID,
            IntgrationAccntID: googleArr[i].ID,
            RefreshToken: googleArr[i].RefreshToken,
            email: googleArr[i].Email,
            memberId: googleArr[i].MemberId,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.getAccessTokenFromRefershToken(arr[0].RefreshToken);
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
        }
      }
    });
  };

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(MAILER_LITE_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID).then(
        (result) => {
          console.log("removeAccount result:", result);
          this.setState({
            selectedAccntValue: "",
            selectedAccntID: "",
            isAccountSelected: false,
          });
        }
      );
    }
  };

  getAccountDetailByToken(token) {
    let formModel = {
      APIUrl: ZOHOCRMAUTH_URLS.ZOHO_USERS_API,
      headerValue: "Zoho-oauthtoken " + token,
    };
    try {
      PostData(ZOHOCRMAUTH_URLS.GET_ACCOUNT_DETAILS_URL, formModel).then(
        (result) => {
          if (result.statusCode === 200) {
            const usersData = JSON.parse(result.res)["users"];
            if (usersData) {
              const userDetails = usersData[0];
              this.addAuthAccnt(userDetails);
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    }
  }

  handleAccountChange = (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    this.getAccessTokenFromRefershToken(value.RefreshToken);
  };

  onChangeModuleType(module) {
    console.log(module);
    if (module) {
      this.setState({
        selectedModuleType: module,
      });
      this.getLayoutForSelectedModule(module.label);
    } else {
      this.setState({
        selectedModuleType: null,
      });
    }
  }

  handlerChangeFieldData(key, event) {
    console.log(key, event.target.value);
    if (localStorage.Type === "Create a record") {
      const newData = {
        ...this.state.fieldsDataToSubmit,
        [key]: event.target.value,
      };
      this.setState({
        fieldsDataToSubmit: newData,
      });
      this.checkValidation(newData);
    } else {
      const newData = {
        ...this.state.fieldsDataToSubmit,
        id: this.state.selectedlayoutType,
        [key]: event.target.value,
      };
      this.setState({
        fieldsDataToSubmit: newData,
      });
      this.checkValidation(newData);
    }
  }

  sendTest = async () => {
    var _self = this;
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }

    if (!this.state.isValidated) {
      window.alert("Please answer all required fields");
      return false;
    } else {
      let result = {};

      // const fieldsdata = this.state.fieldsDataToSubmit;   // fields data for test
      // const triggerData = this.state.isTriggerWorkflow ? ['workflow'] : [];  // trigerr work flow data

      try {
        const dataObj = {
          data: [this.state.fieldsDataToSubmit],
          trigger: this.state.isTriggerWorkflow ? ["workflow"] : [],
        };
        result = await createRecordOnZohoCRM(
          _self.state.accessTokenDetails.access_token,
          _self.state.selectedModuleType.label,
          dataObj
        );
        if (result.status) {
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  handleTriggerWorkflowChange = (e) => {
    this.setState({ isTriggerWorkflow: e.target.checked });
  };

  handleSwitchChange = (e) => {
    this.setState({ useConditionalLogic: e.target.checked });
  };

  finishSetUp = () => {
    let zohoCRMSetUpData = {};

    zohoCRMSetUpData = {
      email: this.state.selectedAccntValue.email,
      module: this.state.selectedModuleType,
      layoutId: this.state.selectedlayoutType,
      memberId: this.state.selectedAccntValue.memberId,
    };
    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "ZohoCRM",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(zohoCRMSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: "1",
      RefreshToken: this.state.selectedAccntValue.RefreshToken,
      IsConditionalLogic: this.state.conditionalLogic,
      Conditions: JSON.stringify(this.state.conditions),
    };

    if (!this.state.isValidated) {
      window.alert("Please answer all required fields");
      return false;
    }
    if (this.state.testStatus === "") {
      if (
        !window.confirm("Are you sure you want to save setup without test?")
      ) {
        return false;
      }
    }

    try {
      PostData(INTEGRATIONS_URLS.POST_INTEGRATION_FINISH_SETUP, formModel).then(
        (result) => {
          this.closeForm();
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };

  addCondition = (e) => {
    this.formJSON = JSON.parse(localStorage.getItem("formJSON"));
    let conditions = this.state.conditions;
    let conditionsLen = this.state.conditions.length;
    if (conditionsLen > 0) {
      conditions[conditionsLen - 1].isShowAndOr = true;
    }
    let obj = {
      id: this.conditionCount,
      value: "condition" + this.conditionCount,
      questionKey: "",
      questCondition: "is",
      questionType: "",
      controlType: "",
      answerVal: "",
      isShowAndOr: false,
      selectedOperator: "",
      isAndOr: "and",
    };
    conditions.push(obj);
    this.setState({ conditions: conditions });
    this.conditionCount++;
  };
  handleQuestChange = (e, index) => {
    let conditions = this.state.conditions;
    let questionVal = e.target.value;
    let newArr = questionVal.split("_");
    conditions[index].selectedQuestion = newArr[0];
    conditions[index].questionKey = newArr[1];
    this.formJSON.filter((obj) => {
      if (obj.key === newArr[1]) {
        conditions[index].controlType = obj.control;
        conditions[index].controlData = obj;
      }
      return obj;
    });
    this.setState({
      conditions: conditions,
    });
  };
  onQuestCondChange = (e, index, field) => {
    let conditions = this.state.conditions.slice(0);
    conditions[index][field] = e.target.value;
    this.setState({
      conditions: conditions,
    });
  };
  handleSelectAnsChange = (e, index, data, field) => {
    let conditions = this.state.conditions.slice(0);
    conditions[index][field] = data[e.target.value];
    this.setState({
      conditions: conditions,
    });
  };
  isAndHandler = (val, index, op) => {
    let conditions = this.state.conditions;
    conditions[index]["isAndOr"] = op;
    this.setState({
      conditions: conditions,
    });
  };
  removeCondition = (index) => {
    let conditions = this.state.conditions;
    if (conditions.length - 1 === index) {
      if (index !== 0) {
        conditions[index - 1].isShowAndOr = false;
        conditions[index - 1].isAndOr = "";
      }
    }
    conditions.splice(index, 1);
    this.setState({
      conditions: conditions,
    });
  };

  render() {
    return (
      <div className="AdoKE9nnvZr4_zfgdeh5N">
        <div className="Paper Paper--double-padded flex1 mb1">
          <div>
            <div>
              <h3
                className="PaperType--h3"
                style={{
                  display: "flex",
                  marginTop: "0px",
                  marginBottom: "36px",
                }}
              >
                <img
                  alt="..."
                  src={require("assets/img/zoho-square.png")}
                  height="32"
                  style={{ marginRight: "9px", verticalAlign: "middle" }}
                />
                <input
                  placeholder="What do you want to call this action?"
                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                  defaultValue={this.state.headerName}
                />
                <div
                  className="BtnV2 BtnV2--warning"
                  onClick={(e) => this.closeForm()}
                  tabIndex="-1"
                  style={{ marginLeft: "18px" }}
                >
                  <span>Cancel</span>
                </div>
              </h3>
              <div className="FieldConfigurationField ">
                <div className="FieldConfiguration__label">
                  Choose an account
                  <div className="FieldConfigurationField__i">
                    <svg
                      fill="currentColor"
                      preserveAspectRatio="xMidYMid meet"
                      height="1em"
                      width="1em"
                      viewBox="0 0 40 40"
                      style={{ verticalAlign: "middle" }}
                    >
                      <g>
                        <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                      </g>
                    </svg>
                    <div className="FieldConfigurationField__description">
                      <div className="FieldConfigurationField__descriptioninner">
                        You can connect a new Mailshake account, or choose from
                        the list of previously connected accounts.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="FieldConfiguration__value">
                  <Select
                    options={this.state.accountsList}
                    value={this.state.selectedAccntValue}
                    onChange={(value) => this.handleAccountChange(value)}
                  />

                  <div style={{ paddingTop: "18px" }}>
                    {this.state.isAccountSelected && (
                      <div
                        className="BtnV2 BtnV2--warning"
                        tabIndex="-1"
                        onClick={() => this.removeAccount()}
                      >
                        <span>Remove Account</span>
                      </div>
                    )}
                    <a
                      href={
                        ZOHOCRMAUTH_URLS.AUTH_URL +
                        `${window.location.origin.toString()}/user/IntegrationNwebhooks`
                      }
                    >
                      <div className="BtnV2 BtnV2--secondary" tabIndex="-1">
                        <span>Add Account +</span>
                      </div>
                    </a>
                  </div>
                </div>
                {this.state.isAccountSelected && (
                  <div>
                    {this.state.isLoadingZohoData && (
                      <div style={{ paddingTop: "18px", textAlign: "center" }}>
                        <div className="FieldConfigurationField">
                          <h4>Loading...</h4>
                        </div>
                      </div>
                    )}
                    {!this.state.isLoadingZohoData && this.state.moduleTypes && (
                      <div style={{ paddingTop: "18px" }}>
                        <div className="FieldConfigurationField">
                          <div className="FieldConfiguration__label">
                            What kind of record do you want to create?
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.moduleTypes}
                              onChange={(e) => {
                                this.onChangeModuleType(e);
                              }}
                            />
                            {/* {this.state.selectedModuleType === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )} */}
                          </div>
                        </div>
                        {this.state.isLoadingFields && (
                          <div
                            style={{ paddingTop: "18px", textAlign: "center" }}
                          >
                            <div className="FieldConfigurationField">
                              <h4>Loading...</h4>
                            </div>
                          </div>
                        )}
                        {this.state.selectedModuleType !== "" &&
                          this.state.layoutTypes &&
                          !this.state.isLoadingFields && (
                            <div>
                              <div className="FieldConfigurationField">
                                <div className="FieldConfiguration__label">
                                  Which layout would you like to use?
                                </div>
                                <div className="FieldConfiguration__value">
                                  <Select
                                    isClearable={true}
                                    options={this.state.layoutTypes}
                                    onChange={(e) => {
                                      this.setState({
                                        selectedlayoutType: e.value || "",
                                      });
                                    }}
                                  />
                                  {this.state.selectedlayoutType === "" && (
                                    <div className="FieldConfigurationField__error">
                                      This field is required
                                    </div>
                                  )}
                                </div>
                              </div>
                              {this.state.selectedlayoutType && (
                                <div>
                                  <div
                                    style={{
                                      marginBottom: "30px",
                                      marginTop: "30px",
                                    }}
                                  >
                                    <div className="FieldConfiguration__label">
                                      Trigger Workflow?{" "}
                                      <div className="FieldConfigurationField__i">
                                        <svg
                                          fill="currentColor"
                                          preserveAspectRatio="xMidYMid meet"
                                          height="1em"
                                          width="1em"
                                          viewBox="0 0 40 40"
                                          style={{ verticalAlign: "middle" }}
                                        >
                                          <g>
                                            <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                          </g>
                                        </svg>
                                        <div className="FieldConfigurationField__description">
                                          <div className="FieldConfigurationField__descriptioninner">
                                            Turn this on if you would like to
                                            automatically trigger any workflows,
                                            approvals, or blueprints inside Zoho
                                            CRM.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="FieldConfiguration__value">
                                      <Switch
                                        checked={this.state.isTriggerWorkflow}
                                        onChange={(e) =>
                                          this.handleTriggerWorkflowChange(e)
                                        }
                                        value="requiredQuestion"
                                        color="primary"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="FieldConfigurationField ">
                                      <div className="FieldConfiguration__label">
                                        <span>Fields</span>
                                      </div>
                                      <div className="FieldConfiguration__value">
                                        <div className="FieldConfigurationField__subfields">
                                          {this.state.fieldsList.map(
                                            (field, index) => {
                                              return (
                                                <div
                                                  className="FieldConfigurationField "
                                                  key={"zohoField_" + index}
                                                >
                                                  <div className="FieldConfiguration__label">
                                                    {field.label + " "}{" "}
                                                    {this.getMandatoryFields(
                                                      field.id
                                                    ) && "*"}
                                                  </div>
                                                  <div className="FieldConfiguration__value">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.LastName
                                                      }
                                                      onChange={(value) =>
                                                        this.handlerChangeFieldData(
                                                          field.id,
                                                          value
                                                        )
                                                      }
                                                      className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: "36px" }}>
                  <div className="FieldConfigurationField ">
                    {this.state.isValidated && (
                      <div>
                        <div className="FieldConfiguration__label">
                          Test this setup
                          <div className="FieldConfigurationField__i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                              style={{ verticalAlign: "middle" }}
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="FieldConfigurationField__description">
                              <div className="FieldConfigurationField__descriptioninner">
                                Click the button below to test this setup with
                                the last submission. You must have submitted the
                                form to be able to test.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="FieldConfiguration__value">
                          <div
                            className="BtnV2"
                            tabIndex="-1"
                            onClick={() => this.sendTest()}
                          >
                            <span>Send Test</span>
                          </div>
                          {this.state.testStatus === "pass" && (
                            <div
                              className="BtnV2 BtnV2--raised BtnV2--sm BtnV2--success"
                              tabIndex="-1"
                              style={{
                                pointerEvents: "none",
                                margin: "0px 18px",
                              }}
                            >
                              <span>Success!</span>
                            </div>
                          )}
                          {this.state.testStatus === "fail" && (
                            <div
                              className="BtnV2 BtnV2--raised BtnV2--sm BtnV2--warning"
                              tabIndex="-1"
                              style={{ pointerEvents: "none" }}
                            >
                              <span>Failed!</span>
                            </div>
                          )}
                          {this.state.testStatus === "fail" &&
                            this.state.formSubmitted === false && (
                              <div class="FieldConfigurationField__error">
                                This test relies on data from the last
                                submission, please make sure you have submitted
                                the form at least once and try again.
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    <div
                      className="FieldConfigurationField "
                      style={{ marginTop: "30px" }}
                    >
                      <div className="FieldConfiguration__label">
                        Use conditional logic{" "}
                        <div className="FieldConfigurationField__i">
                          <svg
                            fill="currentColor"
                            preserveAspectRatio="xMidYMid meet"
                            height="1em"
                            width="1em"
                            viewBox="0 0 40 40"
                            style={{ verticalAlign: "middle" }}
                          >
                            <g>
                              <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                            </g>
                          </svg>
                          <div className="FieldConfigurationField__description">
                            <div className="FieldConfigurationField__descriptioninner">
                              If turned on, this integration will only be
                              triggered when the specified conditions are met.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="FieldConfiguration__value">
                        <Switch
                          checked={this.state.useConditionalLogic}
                          onChange={(e) => this.handleSwitchChange(e)}
                          value="requiredQuestion"
                          color="primary"
                        />
                        {this.state.useConditionalLogic && (
                          <div className="configure-email VisibilityRules__wrapper">
                            <div>
                              {this.state.conditions.length > 0 &&
                                this.state.conditions.map((val, index) => (
                                  <div key={index}>
                                    <div>
                                      <div className="col-md-12 d-inline-block">
                                        <div
                                          className={
                                            !val.selectedQuestion
                                              ? "col-md-11 d-inline-block"
                                              : "col-md-6 d-inline-block"
                                          }
                                        >
                                          <select
                                            defaultValue={"DEFAULT"}
                                            onChange={(e) =>
                                              this.handleQuestChange(e, index)
                                            }
                                          >
                                            <option
                                              value={"DEFAULT"}
                                              disabled
                                              hidden={true}
                                            >
                                              Choose Question
                                            </option>
                                            {this.formJSON.map((data, i) => (
                                              <option
                                                key={i}
                                                name={data.control}
                                                hidden={
                                                  data.control === "simpletext"
                                                }
                                                value={
                                                  data.title !== ""
                                                    ? data.title +
                                                      "_" +
                                                      data.key
                                                    : "Untitled" +
                                                      "_" +
                                                      data.key
                                                }
                                              >
                                                {data.title !== ""
                                                  ? data.title
                                                  : "Untitled"}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        {val.selectedQuestion && (
                                          <div className="col-md-2 d-inline-block">
                                            <select
                                              className="Dropdown-root"
                                              onChange={(e) =>
                                                this.onQuestCondChange(
                                                  e,
                                                  index,
                                                  "questCondition"
                                                )
                                              }
                                            >
                                              <option value="is">is</option>
                                              <option value="isnot">
                                                isn't
                                              </option>
                                              <option value="isAnswered">
                                                is answered
                                              </option>
                                              <option value="isnotanswered">
                                                isn't answered
                                              </option>
                                              <option value="contains">
                                                contains
                                              </option>
                                              <option value="doesnotcontain">
                                                doesn't contain
                                              </option>
                                            </select>
                                          </div>
                                        )}
                                        {((val.selectedQuestion &&
                                          val.controlType === "") ||
                                          val.controlType === "email" ||
                                          val.controlType === "url" ||
                                          val.controlType === "number" ||
                                          val.controlType === "phonenumber" ||
                                          val.controlType === "address" ||
                                          val.controlType === "country" ||
                                          val.controlType === "date" ||
                                          val.controlType === "time" ||
                                          val.controlType === "imageupload" ||
                                          val.controlType === "fileupload" ||
                                          val.controlType === "signature" ||
                                          val.controlType === "calculation" ||
                                          val.controlType === "hidden") && (
                                          <div className="col-md-3 answer-block d-inline-block">
                                            <input
                                              className="FieldConfiguration-input"
                                              placeholder="answer..."
                                              value={
                                                this.state.conditions[index]
                                                  .answerVal
                                              }
                                              onChange={(e) =>
                                                this.onQuestCondChange(
                                                  e,
                                                  index,
                                                  "answerVal"
                                                )
                                              }
                                            />
                                          </div>
                                        )}
                                        {val.selectedQuestion &&
                                          val.controlType === "scale" && (
                                            <div className="col-md-3 d-inline-block">
                                              <select
                                                defaultValue={"DEFAULT"}
                                                onChange={(e) =>
                                                  this.onQuestCondChange(
                                                    e,
                                                    index,
                                                    "answerVal"
                                                  )
                                                }
                                              >
                                                <option
                                                  value={"DEFAULT"}
                                                  disabled
                                                  hidden={true}
                                                >
                                                  Choose answer
                                                </option>
                                                {val.controlData.scaleOptions.map(
                                                  (data, k) => (
                                                    <option key={k} value={k}>
                                                      {data}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          )}
                                        {val.selectedQuestion &&
                                          val.controlType === "dropdown" && (
                                            <div className="col-md-3 d-inline-block">
                                              <select
                                                defaultValue={"DEFAULT"}
                                                onChange={(e) =>
                                                  this.handleSelectAnsChange(
                                                    e,
                                                    index,
                                                    val.controlData
                                                      .dropdownOptionArray,
                                                    "answerVal"
                                                  )
                                                }
                                              >
                                                <option
                                                  value={"DEFAULT"}
                                                  disabled
                                                  hidden={true}
                                                >
                                                  Choose answer
                                                </option>
                                                {val.controlData.dropdownOptionArray.map(
                                                  (val, k) => (
                                                    <option key={k} value={k}>
                                                      {val.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          )}
                                        {val.selectedQuestion &&
                                          val.controlType ===
                                            "multiplechoice" && (
                                            <div className="col-md-3 d-inline-block">
                                              <select
                                                defaultValue={"DEFAULT"}
                                                onChange={(e) =>
                                                  this.handleSelectAnsChange(
                                                    e,
                                                    index,
                                                    val.controlData
                                                      .MultiChoiceOptions,
                                                    "answerVal"
                                                  )
                                                }
                                              >
                                                <option
                                                  value={"DEFAULT"}
                                                  disabled
                                                  hidden={true}
                                                >
                                                  Choose answer
                                                </option>
                                                {val.controlData.MultiChoiceOptions.map(
                                                  (data, k) => (
                                                    <option key={k} value={k}>
                                                      {data.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          )}
                                        {val.selectedQuestion &&
                                          val.controlType === "yesno" && (
                                            <div className="col-md-3 d-inline-block">
                                              <select
                                                defaultValue={"DEFAULT"}
                                                onChange={(e) =>
                                                  this.onQuestCondChange(
                                                    e,
                                                    index,
                                                    "answerVal"
                                                  )
                                                }
                                              >
                                                <option
                                                  value={"DEFAULT"}
                                                  disabled
                                                  hidden={true}
                                                >
                                                  Choose answer
                                                </option>
                                                <option value={"yes"}>
                                                  {"Yes"}
                                                </option>
                                                <option value={"no"}>
                                                  {"No"}
                                                </option>
                                              </select>
                                            </div>
                                          )}
                                        {val.selectedQuestion &&
                                          val.controlType === "products" && (
                                            <div className="col-md-3 d-inline-block">
                                              <select
                                                defaultValue={"DEFAULT"}
                                                onChange={(e) =>
                                                  this.handleSelectAnsChange(
                                                    e,
                                                    index,
                                                    val.controlData.productList,
                                                    "answerVal"
                                                  )
                                                }
                                              >
                                                <option
                                                  value={"DEFAULT"}
                                                  disabled
                                                  hidden={true}
                                                >
                                                  Choose answer
                                                </option>
                                                {val.controlData.productList.map(
                                                  (data, k) => (
                                                    <option key={k} value={k}>
                                                      {data.SKU}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          )}
                                        <div
                                          className="col-md-1 d-inline-block Toggle-View-Bar-Close"
                                          onClick={() =>
                                            this.removeCondition(index)
                                          }
                                        >
                                          <i
                                            className="fa fa-times"
                                            style={{ fontSize: "20px" }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {val.isShowAndOr === true && (
                                      <div
                                        className="ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL"
                                        style={{ textAlign: "center" }}
                                      >
                                        <div className="AdoKE9nnvZr4_zfgdeh5N">
                                          <div
                                            id={"isAnd"}
                                            className={
                                              val.isAndOr === "and"
                                                ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                                : "BtnV2 BtnV2--sm BtnV2--primary"
                                            }
                                            onClick={() =>
                                              this.isAndHandler(
                                                val,
                                                index,
                                                "and"
                                              )
                                            }
                                            style={{
                                              margin: "10px 5px 10px 10px",
                                            }}
                                          >
                                            <span>And</span>
                                          </div>
                                          <div
                                            id={"isOr"}
                                            className={
                                              val.isAndOr === "or"
                                                ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                                : "BtnV2 BtnV2--sm BtnV2--primary"
                                            }
                                            onClick={() =>
                                              this.isAndHandler(
                                                val,
                                                index,
                                                "or"
                                              )
                                            }
                                            style={{
                                              margin: "10px 10px 10px 5px",
                                            }}
                                          >
                                            <span>Or</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              <div className={"text-center"}>
                                {this.state.conditions.length === 0 ? (
                                  <div
                                    className="BtnV2 BtnV2--primary"
                                    tabIndex="-1"
                                    style={{ marginTop: "15px" }}
                                    onClick={(e) => this.addCondition(e)}
                                  >
                                    <span>Add a condition</span>
                                  </div>
                                ) : (
                                  <div
                                    className="BtnV2 BtnV2--primary"
                                    tabIndex="-1"
                                    style={{ marginTop: "15px" }}
                                    onClick={(e) => this.addCondition(e)}
                                  >
                                    <span>Add another condition</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "36px" }}>
                  <div
                    className="BtnV2 BtnV2--secondary BtnV2--solid"
                    onClick={this.finishSetUp}
                    tabIndex="-1"
                  >
                    <span>Finish Setup</span>
                  </div>
                  <div className="BtnV2 BtnV2--warning" tabIndex="-1">
                    <span>Cancel</span>
                  </div>
                </div>
              </div>
              <ReactModal
                isOpen={this.state.showModal}
                contentLabel="onRequestClose"
                onRequestClose={this.handleCloseModal}
              >
                <div>
                  <h2>Connect FormBuilder to ZohoCRM</h2>
                  <div>
                    <p>
                      You can get your ZohoCRM API key at <br />
                      <a target="blank" href="https://api-console.zoho.com/">
                        https://api-console.zoho.com/
                      </a>
                      .
                    </p>
                  </div>
                  <br />
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">API Key*</div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        onChange={(e) =>
                          this.setState({ APIKey: e.target.value })
                        }
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                      />
                    </div>
                  </div>
                  <span>
                    <div
                      className="BtnV2 "
                      tabIndex="-1"
                      onClick={() => this.connectZohoCRM()}
                    >
                      <span>Connect ZohoCRM</span>
                    </div>
                    <div
                      className="BtnV2 BtnV2--warning"
                      tabIndex="-1"
                      onClick={() => {
                        this.setState({ showModal: false });
                      }}
                    >
                      <span>Cancel</span>
                    </div>
                  </span>
                  {this.state.isInValid && (
                    <div class="FieldConfigurationField__error">
                      Please enter all of the required values
                    </div>
                  )}
                </div>
              </ReactModal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ZohoCRMAuthForm;
