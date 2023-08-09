import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { PostData, GetData, Delete } from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  MOOSEND_AUTH_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {
  AddUpdateSubscriberMoosend
} from "../../../API/IntegrationAPI";
import { calculateTime, arrayToObj } from "../../../util/commonFunction";

class MoosendAuthForm extends React.Component {
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
      headerName: "Create or Update Subscriber",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      mailLists: [],
      fieldsList: [],
      isValidated: false,
      testStatus: "",
      IsdoubleOption: false,
    };
    this.conditionCount = 0;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    this.setState({ headerName: localStorage.Type });
    GetData(FORM_URLS.GET_FORM_BY_ID_URL + localStorage.FormId).then(
      (result) => {
        if (result != null) {
          if (result.Item.SubmissionCount && result.Item.SubmissionCount > 0) {
            this.setState({ formSubmitted: true });
          } else {
            this.setState({ formSubmitted: false });
          }
        }
      }
    );
    this.getAccountList();
  }
  componentDidMount() {}
  addAuthAccnt = () => {
    let formModel = {
      ID: DraftJS.genKey(),
      TeamName: "My Moosend",
      Type: "Moosend",
      CreatedAt: Date.now(),
      APIKey: this.state.APIKey,
      KeyType: "apiKey",
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
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };
  getMailinglist = async (apiKey) => {
    let objectMap = [];
    try {
      await GetData(
        "https://api.moosend.com/v3/lists.json?apikey=" +
          apiKey +
          "&WithStatistics=true&ShortBy=CreatedOn&SortMethod=ASC"
      ).then((result) => {
        if (result.Error === null) {
          if (result.Context.MailingLists.length > 0) {
            objectMap = arrayToObj(result.Context.MailingLists, function(item) {
              return {
                value: item.ID,
                label: item.Name,
              };
            });
            this.setState({ mailLists: objectMap, isLoadingFields: false });
          }
        }
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
      this.setState({
        isLoadingFields: false,
      });
    }
  };

  handleMailListChange = async (val) => {
    let _self = this;
    _self.setState({ maillistId: val });
    await _self.getCustomeFieldsForSelectedlist(
      val,
      _self.state.selectedAccntValue.APIKey
    );
  };

  getCustomeFieldsForSelectedlist(listId, apiKey) {
    this.setState({
      isLoadingFields: true,
    });
    try {
      GetData(
        "https://api.moosend.com/v3/lists/" +
          listId +
          "/details.json?apikey=" +
          apiKey
      ).then((result) => {
        if (result.Error === null) {
          const parsedData = result.Context.CustomFieldsDefinition.filter(
            (p) => p.IsRequired
          );
          if (parsedData) {
            let fieldsArray = [];
            parsedData.forEach((field) => {
              fieldsArray.push(field);
            });
            this.setState({
              fieldsList: fieldsArray,
              isLoadingFields: false,
            });
          }
        } else {
          this.setState({
            fieldsList: [],
            isLoadingFields: false,
          });
          alert("Something went wrong. Please try again.");
        }
      });
    } catch (err) {
      console.log(err);
      this.setState({
        fieldsList: [],
        isLoadingFields: false,
      });
      alert("Something went wrong. Please try again.");
    }
  }
  connectMoosend = () => {
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
        let googleArr = result.Items.filter((data) => data.Type === "Moosend");
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            label:
              googleArr[i].TeamName +
              " Created  " +
              calculateTime(googleArr[i].CreatedAt) +
              " ago",
            value: googleArr[i].ID,
            IntgrationAccntID: googleArr[i].ID,
            APIKey: googleArr[i].APIKey,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });

          this.getMailinglist(arr[0].APIKey);
        }
      }
    });
  };

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(MOOSEND_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID).then(
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

  handleAccountChange = (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    this.getMailinglist(value.APIKey);
  };

  handlerChangeFieldData(key, event) {
    console.log(key, event.target.value);
    const newData = {
      ...this.state.fieldsDataToSubmit,
      [key]: event.target.value,
    };
    this.setState({
      fieldsDataToSubmit: newData,
    });
    this.checkValidation(newData);

    const isValidEmail = new RegExp(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
    ).test(this.state.emailAddress);
    if (!isValidEmail) {
      this.setState({ isValidated: false });
    }
  }

  checkValidation(newData) {
    const keysArray = Object.keys(newData);
    keysArray.forEach((fieldName) => {
      if (newData[fieldName] && newData[fieldName] !== "") {
        this.setState({
          isValidated: true,
        });
      } else {
        this.setState({
          isValidated: false,
        });
      }
    });
    if (this.state.fieldsList.length !== keysArray.length) {
      this.setState({
        isValidated: false,
      });
    }
  }

  handleEmailAddressChange = (value) => {
    this.setState({ emailAddress: value });
    const isValidEmail = new RegExp(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
    ).test(value);
    if (value === "") {
      this.setState({ isValidated: false });
    } else if (!isValidEmail) {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }

    if (isValidEmail) {
      if (this.state.fieldsList.length > 0) {
        if (this.state.fieldsDataToSubmit !== undefined) {
          const newData = {
            ...this.state.fieldsDataToSubmit,
          };
          this.checkValidation(newData);
        } else {
          this.setState({ isValidated: false });
        }
      }
    }
  };

  handleSwitchChange = (e) => {
    this.setState({ useConditionalLogic: e.target.checked });
  };

  handleDoubleOptionChange = (e) => {
    this.setState({ IsdoubleOption: e.target.checked });
  };

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
        const customArray= [];
        Object.keys(_self.state.fieldsDataToSubmit).forEach(function (item) {        
          const obj = item + "=" + _self.state.fieldsDataToSubmit[item];
          customArray.push(obj);
        });
        const dataObj = {
          Name:_self.state.userName,
          Email:_self.state.emailAddress,
          CustomFields: customArray,
          HasExternalDoubleOptIn:_self.state.IsdoubleOption,
        }
          result = await AddUpdateSubscriberMoosend(
            _self.state.selectedAccntValue.APIKey,
           _self.state.maillistId,
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
  finishSetUp = () => {
    let mooSendSetUpData = {};
    let _self = this;
    const customArray= [];
        Object.keys(_self.state.fieldsDataToSubmit).forEach(function (item) {        
          const obj = item + "=" + _self.state.fieldsDataToSubmit[item];
          customArray.push(obj);
        });

      mooSendSetUpData = {
      Name:_self.state.userName,
      Email:_self.state.emailAddress,
      CustomFields: customArray,
      HasExternalDoubleOptIn:_self.state.IsdoubleOption,
      APIKey: this.state.selectedAccntValue.APIKey,
    };

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "Moosend",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(mooSendSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.selectedAccntValue.APIKey,
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
                  src={require("assets/img/moosend.png")}
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
                        You can connect a new Moosend account, or choose from
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

                    <div
                      className="BtnV2 BtnV2--secondary"
                      tabIndex="-1"
                      onClick={(e) =>
                        this.setState({
                          showModal: true,
                          APIKey: "",
                          APIUrl: "",
                        })
                      }
                    >
                      <span>Add Account +</span>
                    </div>
                  </div>
                </div>

                {this.state.isAccountSelected && (
                  <div>
                    <br />
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        <span>Mailing List*</span>
                      </div>
                      <div className="FieldConfiguration__value">
                        <Select
                          options={this.state.mailLists}
                          onChange={(e) => this.handleMailListChange(e.value)}
                        />
                        {this.state.maillistId === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {this.state.isLoadingFields &&
                  this.state.isAccountSelected &&
                  this.state.maillistId && (
                    <div style={{ paddingTop: "18px", textAlign: "center" }}>
                      <div className="FieldConfigurationField">
                        <h4>Loading...</h4>
                      </div>
                    </div>
                  )}
                {this.state.isAccountSelected &&
                  this.state.maillistId &&
                  !this.state.isLoadingFields && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Name</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.userName}
                            placeholder=""
                            onChange={(e) =>
                              this.setState({ userName: e.target.value })
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Email*</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.emailAddress}
                            placeholder=""
                            onChange={(e) =>
                              this.handleEmailAddressChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                          {this.state.emailAddress === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Has Double Opt In</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <Switch
                            checked={this.state.useConditionalLogic}
                            onChange={(e) => this.handleDoubleOptionChange(e)}
                            value="requiredQuestion"
                            color="primary"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Custom Fields</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__subfields">
                              {this.state.fieldsList.map((field, index) => {
                                return (
                                  <div
                                    className="FieldConfigurationField "
                                    key={"moosend_" + index}
                                  >
                                    <div className="FieldConfiguration__label">
                                      {field.Name + " "} {"*"}
                                    </div>
                                    <div className="FieldConfiguration__value">
                                      <input
                                        type="text"
                                        value={this.state[field.Name]}
                                        onChange={(value) =>
                                          this.handlerChangeFieldData(
                                            field.Name,
                                            value
                                          )
                                        }
                                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                      />
                                      {this.state[field.Name] === "" && (
                                        <div className="FieldConfigurationField__error">
                                          This field is required
                                        </div>
                                      )}
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
                  <h2>Connect FormBuilder to Moosend</h2>
                  <div>
                    <p>
                      To find your API Key
                      <ul>
                        <li>Login to your MooSend account</li>
                        <li>Go to Account &gt; Api Key</li>
                        <li>Click on "Copy API Key"</li>
                      </ul>
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
                      onClick={() => this.connectMoosend()}
                    >
                      <span>Connect Moosend</span>
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

export default MoosendAuthForm;
