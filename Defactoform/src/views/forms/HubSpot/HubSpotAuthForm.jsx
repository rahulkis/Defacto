import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import {
  PostData,
  GetData,
  Delete
} from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  HUBSPOT_AUTH_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {AddUpdateContactHubSpot} from "../../../API/IntegrationAPI";
import { calculateTime } from "../../../util/commonFunction";

class HubSpotAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      isAccountSelected: false,
      RefreshToken: "",
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      headerName: "Create or update a contact",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      mailBoxlists: [],
      access_token: "",
      isValidated: false,
      hubSpotCode: "",
      fieldsList: [],
      mandatoryfieldsList: [],
      testStatus: "",
      isLoadingFields: false,
      fieldsDataToSubmit:[]
    };
    this.conditionCount = 0;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    if (this.props.code !== "") {
      this.setState({
        isLoadingFields: true,
      });
      let uri = window.location.toString();
      this.getAccessToken();

      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        this.setState({ hubSpotCode: this.props.code });
      }
    } else {
      this.getAccountList();
    }
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
      let formModel = {
        APIUrl: HUBSPOT_AUTH_URLS.BASE_URL + "oauth/v1/token",
        bodyInfo: {
          client_id: HUBSPOT_AUTH_URLS.CLIENT_ID,
          client_secret: HUBSPOT_AUTH_URLS.CLIENT_SECRET,
          code: this.props.code,
          grant_type: "authorization_code",
          redirect_uri: `${window.location.origin.toString()}/user/IntegrationNwebhooks`,
        },
      };
      PostData(HUBSPOT_AUTH_URLS.ACCESS_TOKEN_URL, formModel).then((result) => {
        if (result != null) {
          if (result.statusCode === 200) {
            result = JSON.parse(result.res);
            if (result.access_token !== undefined) {
              this.get_accountInfo(result);
            }
          }
        }
      });
    }
  };

  get_accountInfo = async (res) => {
    let formdata = {
      headerValue: "Bearer " + res.access_token,
      APIUrl: HUBSPOT_AUTH_URLS.BASE_URL + "crm/v3/owners",
    };
    try {
      await PostData(HUBSPOT_AUTH_URLS.GET_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          this.addAuthAccnt(result.res, res.refresh_token);
          this.setState({ access_token: res.access_token });
        }
      });
    } catch (err) {
      this.setState({
        isLoadingFields: false,
      });
    }
  };

  getAccessTokenFromRefershToken = async (token) => {
    let formModel = {
      APIUrl: HUBSPOT_AUTH_URLS.BASE_URL + "oauth/v1/token",
      bodyInfo: {
        client_id: HUBSPOT_AUTH_URLS.CLIENT_ID,
        client_secret: HUBSPOT_AUTH_URLS.CLIENT_SECRET,
        refresh_token: token,
        grant_type: "refresh_token",
        redirect_uri: `${window.location.origin.toString()}/user/IntegrationNwebhooks`,
      },
    };
    PostData(HUBSPOT_AUTH_URLS.ACCESS_TOKEN_URL, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.access_token !== undefined) {
            let _self = this;
            // _self.updateAuthRefreshToken(
            //   _self.state.selectedAccntID,
            //   result.refresh_token
            // );
            _self.setState({ access_token: result.access_token });
            _self.BindDynamicFieldsList(result.access_token);
          }
        }
      }
    });
  };

  addAuthAccnt = (res, refersh_token) => {
    res = JSON.parse(res);
    let formModel = {
      ID: DraftJS.genKey(),
      UserName: res.results[0].firstName + " " + res.results[0].lastName,
      Type: "HubSpot",
      CreatedAt: Date.now(),
      MemberId: res.results[0].id,
      RefreshToken: refersh_token,
      Email: res.results[0].email,
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
      this.setState({
        isLoadingFields: false,
      });
    }
  };

  // updateAuthRefreshToken = async (authId, refersh_token) => {
  //   let formModel = {
  //     id: authId,
  //     refreshToken: refersh_token,
  //   };
  //   try {
  //     await UpdateData(
  //       HELPSCOUT_AUTH_URLS.UPDATE_REFRESH_TOKEN_URL,
  //       formModel
  //     ).then((result) => {});
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };

  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {        
      this.setState({
        isLoadingFields: true,
      });
        let arr = [];
        let googleArr = result.Items.filter((data) => data.Type === "HubSpot");
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            label:
              googleArr[i].UserName +
              "(" +
              googleArr[i].Email +
              ")" +
              " Created  " +
              calculateTime(googleArr[i].CreatedAt) +
              " ago",
            value: googleArr[i].ID,
            IntgrationAccntID: googleArr[i].ID,
            RefreshToken: googleArr[i].RefreshToken,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          // Bind Functionality
          this.BindWorkClientWitRefershToken(arr[0].RefreshToken);
        } else {
          this.setState({
            isLoadingFields: false,
          });
        }
      } else {
        this.setState({
          isLoadingFields: false,
        });
      }
    });
  };

  BindWorkClientWitRefershToken = async (refershToken) => {
    await this.getAccessTokenFromRefershToken(refershToken);
  };

  BindDynamicFieldsList = async (token) => {
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: HUBSPOT_AUTH_URLS.BASE_URL + "properties/v2/contacts/properties",
    };
    try {
      await PostData(HUBSPOT_AUTH_URLS.GET_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          let parsedData = JSON.parse(result.res);
          parsedData = parsedData
            .filter((p) => p.formField)
            .filter(
              (l) =>
                l.groupName === "contactinformation" ||
                l.groupName === "facebook_ads_properties"
            )
            .filter((m) => m.type !== "enumeration");
          if (parsedData) {
            let fieldsArray = [];
            let mandatoryArray = [];
            parsedData.forEach((field) => {
              if (
                field.name.toLowerCase() !== "email" &&
                field.name.toLowerCase() !== "firstname" &&
                field.name.toLowerCase() !== "lastname" &&
                field.name.toLowerCase() !== "company"
              ) {
                fieldsArray.push({
                  value: field.name,
                  type: field.fieldType,
                  label: field.label,
                  sort: field.displayOrder,
                });
              } else if (
                field.name.toLowerCase() === "firstname" ||
                field.name.toLowerCase() === "lastname" ||
                field.name.toLowerCase() === "company"
              ) {
                mandatoryArray.push({
                  value: field.name,
                  type: field.fieldType,
                  label: field.label,
                  sort: field.displayOrder,
                });
              }
            });
            this.setState({
              mandatoryfieldsList: mandatoryArray,
              fieldsList: fieldsArray,
              isLoadingFields: false,
            });
          }
        } else {
          this.setState({
            mandatoryfieldsList: [],
            fieldsList: [],
            isLoadingFields: false,
          });
          alert("Something went wrong. Please try again.");
        }
      });
    } catch (err) {
      console.log(err);
      this.setState({
        mandatoryfieldsList: [],
        fieldsList: [],
        isLoadingFields: false,
      });
      alert("Something went wrong. Please try again.");
    }
  };


    handleSwitchChange = (e) => {
    this.setState({ useConditionalLogic: e.target.checked });
  };

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(
        HUBSPOT_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
      ).then((result) => {
        console.log("removeAccount result:", result);
        this.setState({
          selectedAccntValue: "",
          selectedAccntID: "",
          isAccountSelected: false,
        });
      });
    }
  };

  handleEmailAddress = async (value) => {
    this.setState({ emailAddress: value });
    if (this.state.emailAddress === "" || value === "") {
      this.setState({ isValidated: false });
    } else if (this.state.clientId === "") {
      this.setState({ isValidated: false });
    } else if (this.state.listId === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };

  handleAccountChange = async (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    //Bind Refersh token value code
    await this.BindWorkClientWitRefershToken(value.refershToken);
  };

  handlerChangeFieldData(key, event) {
    console.log(key, event.target.value);
    const newData = {property:key,value:event.target.value};
    const objIndex = this.state.fieldsDataToSubmit.findIndex((obj) => obj.property === key)
    if(objIndex > -1)
    {
      const fdata = this.state.fieldsDataToSubmit;
      fdata[objIndex] = newData;
      this.setState({
        fieldsDataToSubmit: fdata,
      });
    }
    else
    {
      const fdata = this.state.fieldsDataToSubmit;
      fdata.push(newData);
      this.setState({
        fieldsDataToSubmit: fdata,
      });

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
      try {
        let token = this.state.access_token;
        if(token !== undefined)
        {
        const dataObj = {
          properties: this.state.fieldsDataToSubmit
        }
        result = await AddUpdateContactHubSpot(
          token,
          _self.state.emailAddress,
          dataObj
        );
        if (result.status) {
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      }else {
        this.setState({ testStatus: "fail" });
      }
      } catch (err) {
        console.log(err);
      }
    }
  };
  finishSetUp = () => {
    let hubSpotSetUpData = {};

    hubSpotSetUpData = {
      EmailAddress:this.state.emailAddress,
      CustomFields: this.state.fieldsDataToSubmit,
    };

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType:"HubSpot",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(hubSpotSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
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
    } catch (err) {}
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
                  src={require("assets/img/hubspot.png")}
                  height="32"
                  style={{ marginRight: "9px", verticalAlign: "middle" }}
                />
                <input
                  placeholder="What do you want to call this action?"
                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                  value={this.state.headerName}
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
                        You can connect a new Hub Spot account, or
                        choose from the list of previously connected accounts.
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
                      href={HUBSPOT_AUTH_URLS.AUTH_URL.replace(
                        "{CLIENT_ID}",
                        HUBSPOT_AUTH_URLS.CLIENT_ID
                      ).replace(
                        "{REDIRECT_URI}",
                        `${window.location.origin.toString()}/user/IntegrationNwebhooks`
                      )}
                    >
                      <div className="BtnV2 BtnV2--secondary" tabIndex="-1">
                        <span>Add Account +</span>
                      </div>
                    </a>
                  </div>
                </div>
                {this.state.isLoadingFields && (
                  <div style={{ paddingTop: "18px", textAlign: "center" }}>
                    <div className="FieldConfigurationField">
                      <h4>Loading...</h4>
                    </div>
                  </div>
                )}
                {this.state.isAccountSelected && !this.state.isLoadingFields && (
                  <div>
                    <br />
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Email*</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.customerEmail}
                          onChange={(e) =>
                           this.handleEmailAddress(e.target.value)
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                        {this.state.customerEmail === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    {!this.state.isLoadingFields &&
                      this.state.mandatoryfieldsList.map((field, index) => {
                        return (
                          <div
                            className="FieldConfigurationField "
                            key={"customField_" + index}
                          >
                            <div className="FieldConfiguration__label">
                              {field.label + " "}
                            </div>
                            <div className="FieldConfiguration__value">
                              <input
                                type="text"
                                onChange={(value) =>
                                this.handlerChangeFieldData(field.value, value)
                                }
                                className="FormTagInput LiveField__input LiveField__input--manualfocus"
                              />
                            </div>
                          </div>
                        );
                      })}

                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Properties</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <div className="FieldConfigurationField__subfields">
                            {!this.state.isLoadingFields &&
                              this.state.fieldsList.map((field, index) => {
                                return (
                                  <div
                                    className="FieldConfigurationField "
                                    key={"customField_" + index}
                                  >
                                    <div className="FieldConfiguration__label">
                                      {field.label + " "}
                                    </div>
                                    <div className="FieldConfiguration__value">
                                      <input
                                        type="text"
                                        onChange={(value) =>
                                        this.handlerChangeFieldData(field.value, value)
                                        }
                                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
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

                    <div className="FieldConfigurationField ">
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
                  <h2>Connect FormBuilder to MailerLite</h2>
                  <div>
                    <p>
                      You can get your MailerLite API key at <br />
                      <a
                        target="blank"
                        href="https://app.mailerlite.com/integrations/api"
                      >
                        https://app.mailerlite.com/integrations/api
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
                      onClick={() => this.connectMailerLite()}
                    >
                      <span>Connect MailerLite</span>
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

export default HubSpotAuthForm;
