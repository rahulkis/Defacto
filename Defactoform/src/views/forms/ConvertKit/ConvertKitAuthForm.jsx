import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { PostData, GetData, Delete } from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  CONVERTKIT_API_URLS,
  INTEGRATIONS_URLS  
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {
  addSubscriberToForm,
  addSubscriberToTag,
  addSubscriberToSquence,
} from "../../../API/IntegrationAPI";
import { calculateTime } from "../../../util/commonFunction";

class ConvertKitAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      users: [],
      isAccountSelected: false,
      accountsList: [],
      header: {},
      APIKey: "",
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      headerName: "Add Active campaign account",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      automations: [],
      automationId: 0,
      customFields: [],
      lists: [],
      isValidated: false,
      emailAddress: "",
      testError: "",
      isConnecting: false,
      selectedForm: null,
      selectedTag: null,
      selectedSequence: null,
      isFormSelected: false,
      isTagSelected: false,
      isSquenceSelected: false,
      convertKitFormsList: [],
      convertKitSequenceList: [],
      convertKitTagsList: [],
      convertKitData: null,
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
      TeamName: "My ConvertKit",
      Type: "ConvertKit",
      CreatedAt: Date.now(),
      APIKey: this.state.APIKey,
      KeyType:"apiType",
      CreatedBy:this.loginUserId
    };
    this.setState({ selectedAccntID: formModel.ID });
    this.setState({
      isConnecting: true,
    });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          this.getAccountList();
          this.setState({
            isConnecting: true,
            showModal: false,
          });
        }
      );
    } catch (err) {
      this.setState({ showModal: false });
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };

  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };

  connectConvertKit = () => {
    if (this.state.APIKey === "") {
      this.setState({ isInValid: true });
    } else {
      this.addAuthAccnt();
    }
  };

  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let ConvertKitArr = result.Items.filter(
          (data) => data.Type === "ConvertKit"
        );
        for (let i = 0; i < ConvertKitArr.length; i++) {
          arr.push({
            label:
              ConvertKitArr[i].TeamName +
              " Created  " +
              calculateTime(ConvertKitArr[i].CreatedAt) +
              " ago",
            value: ConvertKitArr[i].ID,
            IntgrationAccntID: ConvertKitArr[i].ID,
            APIKey: ConvertKitArr[i].APIKey,
          });
        }
        this.setState({ accountsList: arr });
        if (ConvertKitArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          if (localStorage.Type === "Add Subscriber to Sequence") {
            this.getConverKitSequences(arr[0]);
          }
          if (localStorage.Type === "Add Subscriber to Form") {
            this.getConverKitFormsList(arr[0]);
          }
          if (localStorage.Type === "Add Subscriber to Tag") {
            this.getConverKitTagsList(arr[0]);
          }
        }
      }
    });
  };

  getConverKitFormsList = (accountData) => {
    console.log(accountData);
    GetData(CONVERTKIT_API_URLS.GET_FORMS_LIST_URL + accountData.APIKey).then(
      (result) => {
        if (result != null) {
          console.log(result);
          const formsArray = result.forms.map((form) => {
            const data = { ...form, label: form.name, value: form.id };
            return data;
          });
          this.setState({
            convertKitFormsList: formsArray,
          });
        }
      }
    );
  };

  getConverKitSequences = (accountData) => {
    GetData(
      CONVERTKIT_API_URLS.GET_SEQUENCES_LIST_URL + accountData.APIKey
    ).then((result) => {
      if (result != null) {
        console.log(result);
        const courseArray = result.courses.map((course) => {
          const data = { ...course, label: course.name, value: course.id };
          return data;
        });
        this.setState({
          convertKitSequenceList: courseArray,
        });
      }
    });
  };
  getConverKitTagsList = (accountData) => {
    GetData(CONVERTKIT_API_URLS.GET_TEGS_LIST_URL + accountData.APIKey).then(
      (result) => {
        if (result != null) {
          console.log(result);
          const tagsArray = result.tags.map((tag) => {
            const data = { ...tag, label: tag.name, value: tag.id };
            return data;
          });
          this.setState({
            convertKitTagsList: tagsArray,
          });
        }
      }
    );
  };

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(
        "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/" +
          this.state.selectedAccntID
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

  handleAccountChange = (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    if (localStorage.Type === "Add Subscriber to Sequence") {
      this.getConverKitSequences(value);
    }
    if (localStorage.Type === "Add Subscriber to Form") {
      this.getConverKitFormsList(value);
    }
    if (localStorage.Type === "Add Subscriber to Tag") {
      this.getConverKitTagsList(value);
    }
  };

  sendTest = async () => {
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
        if (localStorage.Type === "Add Subscriber to Form") {
          result = await addSubscriberToForm(
            this.state.emailAddress,
            this.state.firstName,
            this.state.selectedForm.id,
            this.state.selectedAccntValue.APIKey
          );
          console.log(result);
          if (result.status) {
            this.setState({
              testStatus: "pass",
              testError: "",
              convertKitData: result.data,
            });
          } else {
            this.setState({ testStatus: "fail" });
            this.setState({
              testError:
                result.message || "Something went wrong. Please try again",
            });
          }
        }
        if (localStorage.Type === "Add Subscriber to Tag") {
          result = await addSubscriberToTag(
            this.state.emailAddress,
            this.state.firstName,
            this.state.selectedTag.id,
            this.state.selectedAccntValue.APIKey
          );
          console.log(result);
          if (result.status) {
            this.setState({
              testStatus: "pass",
              testError: "",
              convertKitData: result.data,
            });
          } else {
            this.setState({ testStatus: "fail" });
            this.setState({
              testError:
                result.message || "Something went wrong. Please try again",
            });
          }
        }
        if (localStorage.Type === "Add Subscriber to Sequence") {
          result = await addSubscriberToSquence(
            this.state.emailAddress,
            this.state.firstName,
            this.state.selectedSequence.id,
            this.state.selectedAccntValue.APIKey
          );
          console.log(result);
          if (result.status) {
            this.setState({
              testStatus: "pass",
              testError: "",
              convertKitData: result.data,
            });
          } else {
            this.setState({ testStatus: "fail" });
            this.setState({
              testError:
                result.message || "Something went wrong. Please try again",
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  finishSetUp = () => {
    let convertKitSetUpData = {};
    convertKitSetUpData = { ...this.state.convertKitData };

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType:"ConvertKit",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(convertKitSetUpData),
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
    this.setState({
      isProcessing: true,
    });
    try {
      PostData(INTEGRATIONS_URLS.POST_INTEGRATION_FINISH_SETUP, formModel).then(
        (result) => {
          this.closeForm();
        }
      );
    } catch (err) {
      this.setState({
        isProcessing: false,
      });
    }
  };

  handleEmailAddressChange = (value) => {
    this.setState({ emailAddress: value });
    if (value === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };

  handleFormsListChange = (value) => {
    console.log(value);
    this.setState({
      selectedForm: value,
      isFormSelected: value ? true : false,
    });
  };

  handleTagsListChange = (value) => {
    console.log(value);
    this.setState({
      selectedTag: value,
      isTagSelected: value ? true : false,
    });
  };

  handleSquenceListChange = (value) => {
    console.log(value);
    this.setState({
      selectedSequence: value,
      isSquenceSelected: value ? true : false,
    });
  };

  handleSwitchChange = (e) => {
    this.setState({ useConditionalLogic: e.target.checked });
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
                  src={require("assets/img/convertkit-logomark-red.png")}
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
                        You can connect a new ConvertKit account, or choose from
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

                {this.state.isAccountSelected &&
                  (localStorage.Type === "Add Subscriber to Form" ||
                    localStorage.Type === "Add Subscriber to Tag") && (
                    <div>
                      {localStorage.Type === "Add Subscriber to Form" && (
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Forms*
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.convertKitFormsList}
                              value={
                                this.state.selectedForm
                                  ? this.state.selectedForm
                                  : {}
                              }
                              onChange={(e) => this.handleFormsListChange(e)}
                            />
                            {this.state.listId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {localStorage.Type === "Add Subscriber to Tag" && (
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">Tags*</div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.convertKitTagsList}
                              value={
                                this.state.selectedTag
                                  ? this.state.selectedTag
                                  : {}
                              }
                              onChange={(e) => this.handleTagsListChange(e)}
                            />
                            {this.state.tagId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {localStorage.Type === "Add Subscriber to Sequence" && (
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Squences*
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.convertKitSequenceList}
                              value={
                                this.state.selectedSequence
                                  ? this.state.selectedSequence
                                  : {}
                              }
                              onChange={(e) => this.handleSquenceListChange(e)}
                            />
                            {this.state.tagId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {(this.state.isFormSelected ||
                        this.state.isTagSelected) && (
                        <div>
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              Email Address*
                            </div>
                            <div className="FieldConfiguration__value">
                              <input
                                type="text"
                                defaultValue={this.state.EmailAddress || ""}
                                onChange={(e) =>
                                  this.handleEmailAddressChange(e.target.value)
                                }
                                className="FormTagInput LiveField__input LiveField__input--manualfocus"
                              />
                              {this.state.sheetId === "" && (
                                <div className="FieldConfigurationField__error">
                                  This field is required
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              First Name
                            </div>
                            <div className="FieldConfiguration__value">
                              <input
                                type="text"
                                defaultValue={this.state.firstName || ""}
                                onChange={(e) =>
                                  this.setState({ firstName: e.target.value })
                                }
                                className="FormTagInput LiveField__input LiveField__input--manualfocus"
                              />
                              {this.state.sheetId === "" && (
                                <div className="FieldConfigurationField__error">
                                  This field is required
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              Fields
                            </div>
                            {this.state.customFields.length === 0 && (
                              <div
                                style={{
                                  textAlign: "center",
                                  fontSize: "14px",
                                  color: "rgba(0, 0, 0, 0.4)",
                                  border: "2px solid #ccc",
                                  padding: "8px",
                                  borderRadius: "5px",
                                }}
                              >
                                No Custom Fields Available
                              </div>
                            )}
                            {this.state.customFields.length !== 0 && (
                              <div className="FieldConfiguration__value">
                                <div className="FieldConfigurationField__subfields">
                                  {this.state.customFields.map((temp, key) => (
                                    <div className="FieldConfigurationField ">
                                      <div className="FieldConfiguration__label">
                                        {temp.label}
                                      </div>
                                      <div className="FieldConfiguration__value">
                                        <input
                                          type="text"
                                          value={temp.value}
                                          onChange={(e) =>
                                            this.handleInputChange(
                                              e,
                                              key,
                                              temp.label
                                            )
                                          }
                                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  {/* //</div> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ marginTop: "36px" }}>
                            <div className="FieldConfigurationField ">
                              {this.state.emailAddress !== "" && (
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
                                          Click the button below to test this
                                          setup with the last submission. You
                                          must have submitted the form to be
                                          able to test.
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
                                    {this.state.testError && (
                                      <div className="FieldConfigurationField__error">
                                        {this.state.testError}
                                      </div>
                                    )}
                                    {this.state.testStatus === "fail" &&
                                      this.state.formSubmitted === false && (
                                        <div class="FieldConfigurationField__error">
                                          This test relies on data from the last
                                          submission, please make sure you have
                                          submitted the form at least once and
                                          try again.
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                <div style={{ marginTop: "36px" }}>
                  <div className="FieldConfigurationField ">
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
                  {!this.state.isProcessing && (
                    <div>
                      <div
                        className="BtnV2 BtnV2--secondary BtnV2--solid"
                        onClick={this.finishSetUp}
                        tabIndex="-1"
                        style={{ fontFamily: "inherit" }}
                      >
                        <span>Finish Setup</span>
                      </div>
                      <div
                        className="BtnV2 BtnV2--warning"
                        tabIndex="-1"
                        onClick={(e) => this.closeForm()}
                      >
                        <span>Cancel</span>
                      </div>
                    </div>
                  )}
                  {this.state.isProcessing && (
                    <div
                      className="BtnV2 BtnV2--secondary BtnV2--solid"
                      tabIndex="-1"
                      style={{ fontFamily: "inherit" }}
                    >
                      <span>Finishing...</span>
                    </div>
                  )}
                </div>
              </div>
              <ReactModal
                isOpen={this.state.showModal}
                contentLabel="onRequestClose"
                onRequestClose={this.handleCloseModal}
              >
                <div>
                  <h2>Connect FormBuilder to ConvertKit</h2>
                  <div>
                    <p>
                      To find the API Secret, Login to your ConvertKit account,
                      and Go to <br />
                      <a
                        target="blank"
                        href="https://app.convertkit.com/users/login"
                      >
                        Account Settings
                      </a>{" "}
                      and click "Show" under "API Secret".
                    </p>
                  </div>
                  <br />
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">API Secret*</div>
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
                    {!this.state.isConnecting && (
                      <div
                        className="BtnV2 "
                        tabIndex="-1"
                        onClick={() => this.connectConvertKit()}
                      >
                        <span>Connect ConvertKit</span>
                      </div>
                    )}
                    {this.state.isConnecting && (
                      <div className="BtnV2 " tabIndex="-1">
                        <span>Connecting...</span>
                      </div>
                    )}
                    {!this.state.isConnecting && (
                      <div
                        className="BtnV2 BtnV2--warning"
                        tabIndex="-1"
                        onClick={() => {
                          this.setState({ showModal: false });
                        }}
                      >
                        <span>Cancel</span>
                      </div>
                    )}
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

export default ConvertKitAuthForm;
