import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import {
  PostData,
  GetData,
  Delete,
  PostDataIntegation,
  UpdateData,
} from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  HELPSCOUT_AUTH_URLS,
  CAMPAIGN_MONITOR_AUTH_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {} from "../../../API/IntegrationAPI";
import { calculateTime, arrayToObj } from "../../../util/commonFunction";

class HelpScoutAuthForm extends React.Component {
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
      headerName: "Create a Conversation",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      mailBoxlists: [],
      access_token: "",
      isValidated: false,
      helpScoutCode: "",
      tagslists: [],
      conversationTypes: [
        { label: "email", value: "email" },
        { label: "chat", value: "chat" },
        { label: "phone", value: "phone" },
      ],
      statusTypes: [
        { label: "active", value: "active" },
        { label: "closed", value: "closed" },
        { label: "pending", value: "pending" },
      ],
      testStatus: "",
      isLoadingFields: false,
      isAutoReply: false,
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
        this.setState({ helpScoutCode: this.props.code });
      }
    } else {
      this.setState({
        isLoadingFields: true,
      });
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
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", HELPSCOUT_AUTH_URLS.CLIENT_ID);
      bodyFormData.append("client_secret", HELPSCOUT_AUTH_URLS.CLIENT_SECRET);
      bodyFormData.append("code", this.props.code);
      bodyFormData.append("grant_type", "authorization_code");

      PostDataIntegation(
        HELPSCOUT_AUTH_URLS.ACCESS_TOKEN_URL,
        bodyFormData
      ).then((result) => {
        if (result != null) {
          if (result.access_token !== undefined) {
            localStorage.setItem(
              "helpscout_refreshToken",
              result.refresh_token
            );
            this.get_accountInfo(result);
          }
        }
      });
    }
  };

  get_accountInfo = async (res) => {
    let formdata = {
      headerValue: "Bearer " + res.access_token,
      APIUrl: HELPSCOUT_AUTH_URLS.BASE_URL + "v2/users/me",
    };
    try {
      await PostData(HELPSCOUT_AUTH_URLS.GET_API, formdata).then((result) => {
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
    const bodyFormData = new FormData();
    bodyFormData.append("client_id", HELPSCOUT_AUTH_URLS.CLIENT_ID);
    bodyFormData.append("client_secret", HELPSCOUT_AUTH_URLS.CLIENT_SECRET);
    bodyFormData.append("refresh_token", token);
    bodyFormData.append("grant_type", "refresh_token");

    await PostDataIntegation(
      HELPSCOUT_AUTH_URLS.ACCESS_TOKEN_URL,
      bodyFormData
    ).then((result) => {
      if (result != null) {
        if (result.access_token !== undefined) {
          let _self = this;
          _self.updateAuthRefreshToken(
            _self.state.selectedAccntID,
            result.refresh_token
          );
          _self.setState({ access_token: result.access_token });
        }
      }
    });
  };

  addAuthAccnt = (res, refersh_token) => {
    res = JSON.parse(res);
    let formModel = {
      ID: DraftJS.genKey(),
      UserName: res.firstName + " " + res.lastName,
      Type: "HelpScout",
      CreatedAt: Date.now(),
      MemberId: res.id,
      RefreshToken: refersh_token,
      Email: res.email,
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

  updateAuthRefreshToken = async (authId, refersh_token) => {
    let formModel = {
      id: authId,
      refreshToken: refersh_token,
    };
    try {
      await UpdateData(
        HELPSCOUT_AUTH_URLS.UPDATE_REFRESH_TOKEN_URL,
        formModel
      ).then((result) => {});
    } catch (err) {
      console.log(err);
    }
  };
  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };

  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let googleArr = result.Items.filter(
          (data) => data.Type === "HelpScout"
        );
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
        }
      }
    });
    this.setState({
      isLoadingFields: false,
    });
  };

  BindWorkClientWitRefershToken = async (refershToken) => {
    let result = await this.getAccessTokenFromRefershToken(refershToken);

    if (this.state.access_token !== "") {
      // Bind MailBox
      await this.BindMailboxesList(this.state.access_token);
      await this.BindTagsList(this.state.access_token);
    }
  };

  BindMailboxesList = async (token) => {
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: HELPSCOUT_AUTH_URLS.BASE_URL + "v2/mailboxes",
    };
    try {
      await PostData(HELPSCOUT_AUTH_URLS.GET_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          if (result.res !== undefined) {
            let response = JSON.parse(result.res);
            if (response !== undefined) {
              let objectMap = arrayToObj(response._embedded.mailboxes, function(
                item
              ) {
                return { value: item.id, label: item.name, email: item.email };
              });
              this.setState({ mailBoxlists: objectMap });
            }
          }
        }
      });
    } catch (err) {}
  };

  BindTagsList = async (token) => {
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: HELPSCOUT_AUTH_URLS.BASE_URL + "v2/tags",
    };
    try {
      await PostData(HELPSCOUT_AUTH_URLS.GET_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          if (result.res !== undefined) {
            let response = JSON.parse(result.res);
            if (response !== undefined) {
              let objectMap = arrayToObj(response._embedded.tags, function(
                item
              ) {
                return { value: item.id, label: item.name, color: item.color };
              });
              this.setState({ tagslists: objectMap });
            }
          }
        }
      });
    } catch (err) {}
  };

  handleMailBoxChange = async (e) => {
    this.setState({ mailBoxId: e.value });
  };

  handleAutoReplyChange = (e) => {
    this.setState({ isAutoReply: e.target.checked });
  };
  handleSwitchChange = (e) => {
    this.setState({ useConditionalLogic: e.target.checked });
  };
  handleTagChange = (value) => {
    this.setState({ selectedTagOption: value });
  };
  handleConversationType = (e) => {
    this.setState({ selectedConversation: e.value });
  };
  handleStatusType = (e) => {
    this.setState({ statusType: e.value });
  };

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(
        CAMPAIGN_MONITOR_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
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
    if (!this.state.emailAddress || value === "") {
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

  sendTest = () => {
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }

    if (!this.state.isValidated) {
      window.alert("Please answer all required fields");
      return false;
    } else {
      let selectedTags = [];
      let selectedTagOption = this.state.selectedTagOption;
      if (selectedTagOption && selectedTagOption.length > 0) {
        for (let i = 0; i < selectedTagOption.length; i++) {
          selectedTags.push(selectedTagOption[i].label);
        }
      }
      // selectedTags = JSON.stringify(selectedTags);
      // selectedTags = selectedTags.replace(/[["]/g, "").replace(/]/g, "");
      let formData = {
        headerValue: "Bearer " + this.state.access_token,
        APIUrl: HELPSCOUT_AUTH_URLS.BASE_URL + "v2/conversations",
        bodyInfo: {
          subject: this.state.subject,
          autoReply: this.state.isAutoReply,
          customer: {
            email: this.state.emailAddress,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            organization: this.state.organization,
            phone: this.state.phone,
            jobTitle: this.state.jobTitle,
          },
          mailboxId: this.state.mailBoxId,
          type: this.state.selectedConversation,
          status: this.state.statusType,

          threads: [
            {
              type: "customer",
              customer: {
                email: this.state.emailAddress,
              },
              text: this.state.message,
            },
          ],
          tags: selectedTags,
        },
      };

      PostData(HELPSCOUT_AUTH_URLS.POST_API, formData).then((result) => {
        if (result.statusCode === 200) {
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      });
    }
  };

  finishSetUp = () => {
    let heplScoutSetUpData = {};

    heplScoutSetUpData = {
      mailBoxId: this.state.mailBoxId,
      email: this.state.emailAddress,
      subject: this.state.subject,
      autoReply: this.state.isAutoReply,
      message: this.state.message,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      organization: this.state.organization,
      phone: this.state.phone,
      jobTitle: this.state.jobTitle,
      tags: this.state.selectedTagOption,
      conversationType: this.state.selectedConversation,
      status: this.state.statusType,
    };
    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      FormId: localStorage.CurrentFormId,
      IntegrationType: "HelpScout",
      SetUpData: JSON.stringify(heplScoutSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.access_token,
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
                  src={require("assets/img/helpscout-icon-800.png")}
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
                        You can connect a new Campaign Monitor account, or
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
                      href={HELPSCOUT_AUTH_URLS.AUTH_URL.replace(
                        "{CLIENT_ID}",
                        HELPSCOUT_AUTH_URLS.CLIENT_ID
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
                      <div className="FieldConfiguration__label">Mailbox*</div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          onChange={(e) => this.handleMailBoxChange(e)}
                          options={this.state.mailBoxlists}
                        />
                        {this.state.mailBoxId === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        Customer Email*
                      </div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.emailAddress}
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
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Subject*</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.subject}
                          onChange={(e) =>
                            this.setState({
                              subject: e.target.value,
                            })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                        {this.state.subject === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">AutoReply</div>
                      <div className="FieldConfiguration__value">
                        <Switch
                          checked={this.state.isAutoReply}
                          onChange={(e) => this.handleAutoReplyChange(e)}
                          value="requiredQuestion"
                          color="primary"
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Message*</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.message}
                          onChange={(e) =>
                            this.setState({
                              message: e.target.value,
                            })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                        {this.state.message === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">FirstName</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.firstName}
                          onChange={(e) =>
                            this.setState({ firstName: e.target.value })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">LastName</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.lastName}
                          onChange={(e) =>
                            this.setState({ lastName: e.target.value })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        Organization
                      </div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.organization}
                          onChange={(e) =>
                            this.setState({ organization: e.target.value })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Phone</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.phone}
                          onChange={(e) =>
                            this.setState({ phone: e.target.value })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Job Title</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          value={this.state.jobTitle}
                          onChange={(e) =>
                            this.setState({ jobTitle: e.target.value })
                          }
                          placeholder=""
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Tags</div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          isMulti
                          options={this.state.tagslists}
                          onChange={(value) => this.handleTagChange(value)}
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        Conversation Types
                      </div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          options={this.state.conversationTypes}
                          onChange={(e) => this.handleConversationType(e)}
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Status</div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          options={this.state.statusTypes}
                          onChange={(e) => this.handleStatusType(e)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "36px" }}>
                  <div className="FieldConfigurationField ">
                    {this.state.mailBoxlists &&
                      this.state.message &&
                      this.state.subject &&
                      this.state.isValidated && (
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
                                  the last submission. You must have submitted
                                  the form to be able to test.
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
                                  submission, please make sure you have
                                  submitted the form at least once and try
                                  again.
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

export default HelpScoutAuthForm;
