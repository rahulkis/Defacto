import React from "react";
import Select from "react-select";

import Switch from "@material-ui/core/Switch";
import {
  PostData,
  GetData,
  Delete,
  PostDataIntegation,
} from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  MAILCHIMPAUTH_CREDENTIALS,
  MAILCHIMPAUTH_URLS,
  MAILCHIMPAPI_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import {
  getListByToken_mailchimp,
  getAccountByToken_mailchimp,
  getSegmentsBylistId_mailchimp,
  AddSubscriberList_mailchimp,
  AddSubscriberTag_mailchimp,
} from "../../../API/IntegrationAPI";
import { DraftJS } from "megadraft";

class MailChimpAuthform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      sheets: [],
      users: [],
      workSheets: [],
      isAccountSelected: false,
      isSheetSelected: false,
      accountsList: [],
      columnsList: [],
      header: {},
      listId: null,
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
        ApiEndPoint: "",
      },
      selectedAccntID: "",
      sheetName: "Add Subscriber to list",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      mailChimpCode: "",
      lists: [],
      isListSelected: false,
      isAddressCustOption: false,
      isBirthDaySelected: false,
      firstName: "",
      lastName: "",
      addressValue: "",
      birthDayValue: "",
      birthDaySelectedOption: "",
      isDoubleOptIn: false,
      segments: [],
      detailStatus: "",
      selectedTags: [],
      isValidated: false,
      customOption: [{ label: "Custom(advance)", value: "Custom(advance)" }],
      birthDayOption: [
        { label: "Submitted At", value: "Submitted At" },
        { label: "Custom(advance)", value: "Custom(advance)" },
      ],
    };
    this.conditionCount = 0;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }
  componentWillMount() {
    this.getAccountList();
    if (this.props.code !== "") {
      let uri = window.location.toString();
      this.getAccessToken();

      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        this.setState({ mailChimpCode: this.props.code });
      }
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
  closeForm = (e) => {
    this.props._renderChildComp("IntegrationList");
  };
  getAccessToken = () => {
    if (this.props.code !== "") {
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", MAILCHIMPAUTH_CREDENTIALS.CLIENT_ID);
      bodyFormData.append(
        "client_secret",
        MAILCHIMPAUTH_CREDENTIALS.CLIENT_SECRET
      );
      bodyFormData.append("code", this.props.code);
      bodyFormData.append(
        "redirect_uri",
        MAILCHIMPAUTH_CREDENTIALS.REDIRECT_URI
      );
      bodyFormData.append("grant_type", "authorization_code");

      PostDataIntegation(MAILCHIMPAPI_URLS.GET_ACCESS_TOKEN, bodyFormData).then(
        (result) => {
          if (result != null) {
            if (result.access_token !== undefined) {
              localStorage.setItem("refreshToken", result.access_token);
              this.setState({ access_token: result.access_token });
              this.getAccountDetailByToken(result.access_token);
            }
          }
        }
      );
    }
  };
  getAccountDetailByToken = async (token) => {
    let res = await getAccountByToken_mailchimp(token);

    this.addAuthAccnt(res);
  };
  getListByToken = async (token, api_endpoint, IntAcctId) => {
    let lists = await getListByToken_mailchimp(token, api_endpoint);
    if (lists.length > 0) {
      this.addMailChimpSheet(token, lists, IntAcctId);
    }
    this.setState({
      refereshToken: token,
      lists: lists,
      isAccountSelected: true,
    });
  };
  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let accountArr = result.Items.filter(
          (data) => data.Type === "MailChimp"
        );
        for (let i = 0; i < accountArr.length; i++) {
          arr.push({
            label: accountArr[i].AccountName,
            value: accountArr[i].RefreshToken,
            IntgrationAccntID: accountArr[i].ID,
            ApiEndPoint: accountArr[i].ApiEndPoint,
          });
        }
        if (accountArr.length > 0) {
          this.setState({
            accountsList: arr,
            isAccountSelected: true,
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
          });

          this.getMailChimpListByIntAccntId(arr[0].IntgrationAccntID);
          // this.refreshToken(accountArr[0].RefreshToken);
        } else {
          this.setState({
            accountsList: arr,
            isAccountSelected: false,
            // selectedAccntValue: arr[0],
            // selectedAccntID: arr[0].IntgrationAccntID
          });
        }
      }
    });
  };

  getMailChimpListByIntAccntId = (IntAcctId) => {
    if (IntAcctId != null)
      GetData(MAILCHIMPAPI_URLS.GET_MAILCHIMPLISTBYINTACCNTID + IntAcctId).then(
        (result) => {
          if (
            result !== undefined &&
            result != null &&
            Object.keys(result).length &&
            Object.keys(result.Item).length
          ) {
            this.setState({
              isAccountSelected: true,
              lists: JSON.parse(result.Item.Lists),
              listId: "",
              isListSelected: false,
              selectedSheet: { value: 0, label: "Select" },
              selectedTags: [],
              emailAddress: "",
            });
          } else {
            // this.setState({ isLoader: false });
          }
        }
      );
  };

  getMailChimSegmentsByListId = async (e) => {
    if (e.value != null) {
      this.setState({
        isListSelected: true,
        listId: e.value,
        selectedSheet: { value: e.value, label: e.label },
      });
      let segments = await getSegmentsBylistId_mailchimp(
        this.state.selectedAccntValue.value,
        this.state.selectedAccntValue.ApiEndPoint,
        e.value
      );
      if (segments.length > 0) {
        this.setState({ segments: segments });
      }
    }
  };
  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(
        MAILCHIMPAPI_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
      ).then((result) => {
        this.setState({
          selectedAccntValue: "",
          selectedAccntID: "",
          isAccountSelected: false,
        });
        this.getAccountList();
      });
    }
  };
  addAuthAccnt = (res) => {
    let formModel = {
      ID: DraftJS.genKey(),
      Email: res.email,
      AccountName: res.accountName,
      ApiEndPoint: res.api_endpoint,
      Type: "MailChimp",
      CreatedAt: Date.now(),
      RefreshToken: localStorage.refreshToken,
      KeyType:"refreshToken",
      CreatedBy:this.loginUserId
    };
    this.setState({ selectedAccntID: formModel.ID });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          if (res.api_endpoint !== undefined) {
            this.getListByToken(
              localStorage.refreshToken,
              res.api_endpoint,
              formModel.ID
            );
          }
          this.getAccountList();
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  addMailChimpSheet = (refresh_token, objlists, IntAcctId) => {
    let formModel = {
      IntgrationAccntID: IntAcctId,
      Type: "MailChimp",
      RefreshToken: refresh_token,
      Lists: JSON.stringify(objlists),
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };
    try {
      PostData(MAILCHIMPAPI_URLS.ADD_MAILCHIMPLIST, formModel).then(
        (result) => {}
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  handleAccountChange = (value) => {
    this.setState(
      {
        selectedAccntValue: value,
        selectedAccntID: value.IntgrationAccntID,
        isAccountSelected: true,
      },
      this.getMailChimpListByIntAccntId(value.IntgrationAccntID)
    );
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

    this.formJSON.filter(function(obj) {
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
  handleEmailAddressChange = (e) => {
    if (
      e.target.value !== "" &&
      this.state.selectedTags.length > 0 &&
      localStorage.Type === "Add Subscriber to a Tag"
    )
      this.setState({ emailAddress: e.target.value, isValidated: true });
    else if (
      e.target.value !== "" &&
      localStorage.Type === "Add Subscriber to a List"
    ) {
      this.setState({ emailAddress: e.target.value, isValidated: true });
    } else this.setState({ emailAddress: e.target.value, isValidated: false });
  };

  sendTest = async (status) => {
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }
    //let isValid=this.checkValidation(localStorage.Type)
    if (!this.state.isValidated) {
      window.alert("Please answer all required fields");
      return false;
    } else {
      let result = {};
      try {
        if (localStorage.Type === "Add Subscriber to a List") {
          status = status ? status : "subscribed";
          result = await AddSubscriberList_mailchimp(
            this.state.selectedAccntValue.value,
            this.state.selectedAccntValue.ApiEndPoint,
            this.state.listId,
            this.state.emailAddress,
            this.state.firstName,
            this.state.lastName,
            this.state.phone,
            this.state.addressValue,
            this.state.birthDayValue,
            status
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            if (result.title === "Member Exists") {
              result = await AddSubscriberList_mailchimp(
                this.state.selectedAccntValue.value,
                this.state.selectedAccntValue.ApiEndPoint,
                this.state.listId,
                this.state.emailAddress,
                this.state.firstName,
                this.state.lastName,
                this.state.phone,
                this.state.addressValue,
                this.state.birthDayValue,
                "unsubscribed"
              );
            }

            this.setState({ testStatus: "fail", detailStatus: result.message });
          }
        } else {
          if (this.state.selectedTags.length > 0) {
            let resmessage = "";
            // let status;
            for (let i = 0; i < this.state.selectedTags.length; i++) {
              result = await AddSubscriberTag_mailchimp(
                this.state.selectedAccntValue.value,
                this.state.selectedAccntValue.ApiEndPoint,
                this.state.listId,
                this.state.emailAddress,
                this.state.selectedTags[i].value
              );
              if (result.status) {
                //
                if (status === undefined) status = true;
              } else {
                status = false;
                resmessage = resmessage + "\n" + result.message;
              }
            }
            if (status) this.setState({ testStatus: "pass" });
            else
              this.setState({ testStatus: "fail", detailStatus: resmessage });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  finishSetUp = () => {
    let mailChimpSetUpData = {};
    if (localStorage.Type === "Add Subscriber to a List") {
      mailChimpSetUpData = {
        email_address: this.state.emailAddress,
        status: "subscribed",
        listId: this.state.listId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phone: this.state.phone,
        birthday: this.state.birthDayValue,
        address: this.state.addressValue,
        api_endPoint: this.state.selectedAccntValue.ApiEndPoint,
      };
    } else {
      mailChimpSetUpData = {
        email_address: this.state.emailAddress,

        selectedTags: this.state.selectedTags,
        listId: this.state.listId,
        api_endPoint: this.state.selectedAccntValue.ApiEndPoint,
      };
    }

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType:"MailChimp",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(mailChimpSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.selectedAccntValue.value,
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

  handleSegmentChange = (e) => {
    if (
      this.state.emailAddress !== "" &&
      e.length > 0 &&
      localStorage.Type === "Add Subscriber to a Tag"
    )
      this.setState({ selectedTags: e, isValidated: true });
    else this.setState({ selectedTags: e, isValidated: false });
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
                  src={require("assets/img/mailchimp.png")}
                  height="32"
                  style={{ marginRight: "9px", verticalAlign: "middle" }}
                />
                <input
                  placeholder="What do you want to call this action?"
                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                  value={this.state.sheetName}
                  onChange={this.hanleSheetName}
                />
                <div
                  className="BtnV2 BtnV2--warning"
                  onClick={(e) => this.closeForm(e)}
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
                        You can connect a new Google Sheets account, or choose
                        from the list of previously connected accounts.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="FieldConfiguration__value">
                  <Select
                    // isClearable={true}
                    options={this.state.accountsList}
                    // value={this.state.accountsList.filter(option => option.value === this.state.accountsList[0].value)}
                    value={this.state.selectedAccntValue}
                    onChange={(value) => this.handleAccountChange(value)}
                    //defaultValue={this.state.accountsList.length>0?this.state.accountsList[0]:{ label: "Select Account", value: 0 }}
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
                        MAILCHIMPAUTH_URLS.AUTH_URL +
                        MAILCHIMPAUTH_CREDENTIALS.REDIRECT_URI
                      }
                    >
                      <div className="BtnV2 BtnV2--secondary" tabIndex="-1">
                        <span>Add Account +</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              {this.state.isAccountSelected && (
                <div className="FieldConfigurationField ">
                  <div className="FieldConfiguration__label">List*</div>
                  <div className="FieldConfiguration__value">
                    <Select
                      isClearable={true}
                      options={this.state.lists}
                      value={this.state.selectedSheet}
                      onChange={(e) => this.getMailChimSegmentsByListId(e)}
                    />
                  </div>
                </div>
              )}
              {this.state.isListSelected && (
                <div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      Email Address*
                    </div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        value={this.state.emailAddress}
                        onChange={(e) => this.handleEmailAddressChange(e)}
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                      />
                    </div>
                  </div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      Require Double Opt In
                    </div>
                    <div className="FieldConfiguration__value">
                      <Switch
                        checked={this.state.isDoubleOptIn}
                        onChange={(e) =>
                          this.setState({
                            isDoubleOptIn: !this.state.isDoubleOptIn,
                          })
                        }
                        value="requiredQuestion"
                        color="primary"
                      />
                    </div>
                  </div>
                </div>
              )}
              {this.state.isAccountSelected &&
                this.state.isListSelected &&
                localStorage.Type === "Add Subscriber to a Tag" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      Choose the tags you want to add to this subscriber*
                    </div>
                    <div className="FieldConfiguration__value">
                      <Select
                        isClearable={true}
                        isMulti={true}
                        options={this.state.segments}
                        //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                        onChange={(e) => this.handleSegmentChange(e)}
                      />
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                this.state.isListSelected &&
                localStorage.Type === "Add Subscriber to a List" && (
                  <div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__value">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Columns
                          </div>

                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__subfields">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  Address
                                </div>
                                <div className="FieldConfiguration__value">
                                  <Select
                                    isClearable={true}
                                    options={this.state.customOption}
                                    //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                                    onChange={(e) =>
                                      this.setState({
                                        isAddressCustOption: true,
                                      })
                                    }
                                  />
                                </div>
                                <div className="FieldConfiguration__value">
                                  {this.state.isAddressCustOption && (
                                    <input
                                      type="text"
                                      value={this.state.addressValue}
                                      onChange={(e) =>
                                        this.setState({
                                          addressValue: e.target.value,
                                        })
                                      }
                                      placeholder="123 Fake st, Sydney NSW 2000 Australia"
                                      className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  BirthDay
                                </div>
                                <div className="FieldConfiguration__value">
                                  <Select
                                    isClearable={true}
                                    options={this.state.birthDayOption}
                                    //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                                    onChange={(e) =>
                                      this.setState({
                                        isBirthDaySelected: true,
                                        birthDaySelectedOption: e.value,
                                      })
                                    }
                                  />
                                  {this.state.isBirthDaySelected &&
                                    this.state.birthDaySelectedOption ===
                                      "Custom(advance)" && (
                                      <input
                                        type="text"
                                        value={this.state.birthDayValue}
                                        onChange={(e) =>
                                          this.setState({
                                            birthDayValue: e.target.value,
                                          })
                                        }
                                        placeholder="2021-12-01"
                                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                      />
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
                                    value={this.state.firstName}
                                    onChange={(e) =>
                                      this.setState({
                                        firstName: e.target.value,
                                      })
                                    }
                                    placeholder=""
                                    className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                  />
                                </div>
                              </div>
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  Last Name
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    type="text"
                                    value={this.state.lastName}
                                    onChange={(e) =>
                                      this.setState({
                                        lastName: e.target.value,
                                      })
                                    }
                                    placeholder=""
                                    className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                  />
                                </div>
                              </div>
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  PhoneNumber
                                </div>
                                <div className="FieldConfiguration__value">
                                  <Select
                                    isClearable={true}
                                    options={this.state.customOption}
                                    //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                                    onChange={(e) =>
                                      this.setState({ isPhnNumSelected: true })
                                    }
                                  />
                                  {this.state.isPhnNumSelected && (
                                    <input
                                      type="text"
                                      value={this.state.phnNumberValue}
                                      onChange={(e) =>
                                        this.setState({
                                          phnNumberValue: e.target.value,
                                        })
                                      }
                                      placeholder="Enter a phone,number value"
                                      className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* //</div> */}
                            </div>
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
                              Click the button below to test this setup with the
                              last submission. You must have submitted the form
                              to be able to test.
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
                              This test relies on data from the last submission,
                              please make sure you have submitted the form at
                              least once and try again.
                            </div>
                          )}
                        {this.state.testStatus === "fail" &&
                          this.state.detailStatus !== "" && (
                            <div class="FieldConfigurationField__error">
                              {this.state.detailStatus}
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
                                                  ? data.title + "_" + data.key
                                                  : `Untitled ${data.key}`
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
                                            <option value="isnot">isn't</option>
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
                                        val.controlType === "text" ||
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
                                                (val, k) => (
                                                  <option key={k} value={k}>
                                                    {val}
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
                                            this.isAndHandler(val, index, "and")
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
                                            this.isAndHandler(val, index, "or")
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
          </div>
        </div>
      </div>
    );
  }
}

export default MailChimpAuthform;
