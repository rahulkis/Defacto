import React from "react";

import Select from "react-select";

import Switch from "@material-ui/core/Switch";
import {
  PostData,
  GetData,
  PostDataWithoutJson,
  Delete,
} from "../../../stores/requests";
import {
  FORM_URLS,
  GOOGLEAUTH_URLS,
  SlackAuth_URLS,
  SLACKAUTH_CREDENTIALS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";

//const APIKEY = 'AIzaSyBQRzub4jUjyidHL6CpN1sD3VG-SQo3z1M';
///const URL = GOOGLEAUTH_URLS.GET_GOOGELDRIVE_FILES + APIKEY;

class SlackAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      channels: [],
      users: [],
      workSheets: [],
      isAccountSelected: false,
      isSheetSelected: false,
      accountsList: [],
      columnsList: [],
      header: {},
      sheetId: "",
      workSheetTitle: "",
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      slackCode: "",
      refereshToken: "",
      teamName: "",
      channelId: "0",
      textMessage: "This is test message",
      useConditionalLogic: false,
      conditions: [],
      testStatus: "",
      reminderTime: "Tomorrow",
      headerMsg: "Send Messgae to Channel",
      slackType: "Slack Channel",
    };
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    if (localStorage.Type === "Slack Channel") {
      this.setState({
        headerMsg: "Send Messgae to Channel",
        slackType: "Slack Channel",
      });
    } else if (localStorage.Type === "Slack Reminder") {
      this.setState({
        headerMsg: "Add a Reminder",
        slackType: "Slack Reminder",
      });
    } else {
      this.setState({
        headerMsg: "Send a Direct Message",
        slackType: "Slack User",
      });
    }

    if (this.props.code !== "") {
      let uri = window.location.toString();
      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        this.setState({ slackCode: this.props.code }, () =>
          this.getAccessToken()
        );
      }
    } else {
      this.getAccountList();
    }
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
  }
  componentDidMount() {}
  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let slackArr = result.Items.filter((data) => data.Type === "Slack");
        for (let i = 0; i < slackArr.length; i++) {
          if (slackArr[i].Type === "Slack") {
            arr.push({
              label: slackArr[i].TeamName,
              value: slackArr[i].ID,
              RefreshToken: slackArr[i].RefreshToken,
              IntgrationAccntID: slackArr[i].ID,
            });
          }
        }
        this.setState({ accountsList: arr });
        if (slackArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          this.setState(
            { refereshToken: arr[0].RefreshToken },
            this.getChannelUserList(arr[0].IntgrationAccntID)
          );
        } else {
          this.setState({
            selectedAccntValue: {
              label: "Select Account",
              value: 0,
              RefreshToken: "",
              IntgrationAccntID: "",
            },
            selectedAccntID: 0,
            isAccountSelected: false,
          });
        }
      }
    });
  };
  addAuthAccnt = (refereshToken) => {
    let formModel = {
      ID: DraftJS.genKey(),
      TeamName: this.state.teamName,
      Type: "Slack",
      CreatedAt: Date.now(),
      RefreshToken: refereshToken,
      KeyType:"refreshToken",
      CreatedBy:this.loginUserId
    };
    this.setState({ selectedAccntID: formModel.ID, isAccountSelected: true });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          this.getChannelUsersByAuth(formModel.ID, refereshToken);
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  getAccessToken = () => {
    if (this.props.code !== "") {
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", SLACKAUTH_CREDENTIALS.CLIENT_ID);
      bodyFormData.append("client_secret", SLACKAUTH_CREDENTIALS.CLIENT_SECRET);
      bodyFormData.append("code", this.props.code);
      bodyFormData.append("redirect_uri", SLACKAUTH_CREDENTIALS.REDIRECT_URI);
      bodyFormData.append("grant_type", "authorization_code");

      PostDataWithoutJson(SlackAuth_URLS.POST_OAUTH_ACCESS, bodyFormData).then(
        (result) => {
          if (result != null) {
            if (result.ok)
              this.setState(
                {
                  refereshToken: result.access_token,
                  teamName: result.team_name,
                  isAccountSelected: true,
                },
                () => this.addAuthAccnt(result.access_token)
              );
          }
        }
      );
    }
  };
  sendTest = () => {
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }
    if (
      this.state.channelId === "0" ||
      (this.state.textMessage === "" &&
        this.state.slackType === "Slack Reminder" &&
        this.state.reminderTime === "")
    ) {
      window.alert("Please answer all required fields");
      return false;
    }

    try {
      if (localStorage.Type === "Slack Reminder") {
        this.setReminder();
      } else {
        this.sendTestMessgaeInChannel();
      }
    } catch (err) {
      console.log(err);
    }
  };
  sendTestMessgaeInChannel = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("token", this.state.selectedAccntValue.RefreshToken);
    bodyFormData.append("channel", this.state.channelId);
    bodyFormData.append("text", this.state.textMessage);

    PostDataWithoutJson(SlackAuth_URLS.POST_MESSAGE, bodyFormData).then(
      (result) => {
        if (result != null) {
          if (result.ok === true) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        }
      }
    );
  };

  setReminder = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("token", this.state.selectedAccntValue.RefreshToken);
    bodyFormData.append("text", this.state.textMessage);
    bodyFormData.append("time", this.state.reminderTime);
    bodyFormData.append("user", this.state.channelId);
    PostDataWithoutJson(SlackAuth_URLS.ADD_REMINDER, bodyFormData).then(
      (result) => {
        if (result != null) {
          if (result.ok === true) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: result.error });
          }
        }
      }
    );
  };
  getChannelUsersByAuth = (IntAccntID, refereshToken) => {
    const headers = {
      token: "Bearer " + refereshToken,
      Accept: "application/x-www-form-urlencoded",
    };
    const bodyFormData = new FormData();
    bodyFormData.append("token", this.state.refereshToken);
    this.setState({ header: headers });
    PostDataWithoutJson(
      SlackAuth_URLS.GETCHANNELSLISTBYAUTH_URL,
      bodyFormData
    ).then((result) => {
      if (result != null) {
        let objectMap = this.arrayToObj(result.channels, function(item) {
          return { value: item.id, label: item.name };
        });

        this.setState({ channels: objectMap });
        this.addSlackChannel(refereshToken, objectMap);
      }
    });
  };
  getSlackUserByAuth = (refresh_token) => {
    const bodyFormData = new FormData();
    bodyFormData.append("token", refresh_token);
    PostDataWithoutJson(
      SlackAuth_URLS.GETUSERSLISTBYAUTH_URL,
      bodyFormData
    ).then((result) => {
      if (result != null) {
        console.log(result);

        let objectMap = this.arrayToObj(result.members, function(item) {
          return { value: item.id, label: item.name };
        });
        this.addSlackUser(refresh_token, objectMap);
      }
    });
  };
  getChannelUserList = (AccntID) => {
    let url =
      this.state.slackType === "Slack Channel"
        ? SlackAuth_URLS.GETSLACK_CHANNEL_BY_INTACCTID
        : SlackAuth_URLS.GETSLACK_USER_BY_INTACCTID;
    GetData(url + AccntID).then((result) => {
      if (result != null && result.Item !== undefined) {
        this.setState({ isAccountSelected: true });
        this.state.slackType === "Slack Channel"
          ? this.setState({ channels: JSON.parse(result.Item.Channels) })
          : this.setState({ users: JSON.parse(result.Item.Users) });
      } else {
        this.state.slackType === "Slack Channel"
          ? this.setState({ channels: [] })
          : this.setState({ users: [] });
      }
    });
  };
  addSlackChannel = (refresh_token, obj) => {
    let formModel = {};
    formModel = {
      IntgrationAccntID: this.state.selectedAccntID,
      Type: "Slack Channel",
      RefreshToken: refresh_token,
      Channels: JSON.stringify(obj),
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };

    try {
      PostData(SlackAuth_URLS.ADD_SLACK_CHANNEL_USER, formModel).then(
        (result) => {
          this.getSlackUserByAuth(refresh_token);
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };

  addSlackUser = (refresh_token, obj) => {
    let formModel = {
      IntgrationAccntID: this.state.selectedAccntID,
      Type: "Slack User",
      RefreshToken: refresh_token,
      Users: JSON.stringify(obj),
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };
    try {
      PostData(SlackAuth_URLS.ADD_SLACK_CHANNEL_USER, formModel).then(
        (result) => {
          this.setState({ users: obj });
          this.getAccountList();
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };

  removeAccount = () => {
    Delete(SlackAuth_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID).then(
      (result) => {
        this.getAccountList();
      }
    );
  };
  handleSwitchChange = (event) => {
    this.setState({ conditionalLogic: event.target.checked });
  };
  closeForm = (e) => {
    this.props._renderChildComp("IntegrationList");
  };

  finishSetUp = () => {
    let channelSetUpData = {};
    if (localStorage.Type === "Slack User") {
      channelSetUpData = {
        channel: this.state.channelId,
        text: this.state.textMessage,
        as_user: true,
      };
    } else if (localStorage.Type === "Slack Reminder") {
      channelSetUpData = {
        user: this.state.channelId,
        text: this.state.textMessage,
        time: this.state.reminderTime,
      };
    } else {
      channelSetUpData = {
        channel: this.state.channelId,
        text: this.state.textMessage,
      };
    }

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "Slack",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(channelSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: "1",
      RefreshToken: this.state.selectedAccntValue.RefreshToken,
      IsConditionalLogic: this.state.conditionalLogic,
      Conditions: JSON.stringify(this.state.conditions),
    };
    if (
      (localStorage.Type === "Slack Channel" && this.state.channelId === "0") ||
      !this.state.textMessage
    ) {
      window.alert("Please answer all required fields");
      return false;
    }
    try {
      PostData(INTEGRATIONS_URLS.POST_INTEGRATION_FINISH_SETUP, formModel).then(
        (result) => {
          this.props._renderChildComp("IntegrationList");
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };

  handleInputChange = (e, key, label) => {
    const arr = Object.assign([], this.state.columnsList, {
      [key]: { label: label, value: e.target.value },
    });
    this.setState({ columnsList: arr });
  };

  handleAccountChange = (value) => {
    this.setState(
      {
        selectedAccntValue: value,
        selectedAccntID: value.IntgrationAccntID,
        isAccountSelected: true,
      },
      this.getChannelUserList(value.IntgrationAccntID)
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
      isAndOr: "",
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
  arrayToObj = (array, fn) => {
    let sheets = [];
    let len = array.length;
    for (let i = 0; i < len; i++) {
      let item = fn(array[i], i, array);
      sheets.push(item);
    }
    return sheets;
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
                  src={require("assets/img/Slack-Mark-Web.png")} 
                  height="32"
                  style={{ marginRight: "9px", verticalAlign: "middle" }}
                />
                <input
                  placeholder="What do you want to call this action?"
                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                  value={this.state.headerMsg}
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
                        You can connect a new Slack account, or choose from the
                        list of previously connected accounts.
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
                      href={SlackAuth_URLS.GetSLACKAuthCODE_URL.replace(
                        "{CLIENTID}",
                        SLACKAUTH_CREDENTIALS.CLIENT_ID
                      ).replace(
                        "{REDIRECTURI}",
                        SLACKAUTH_CREDENTIALS.REDIRECT_URI
                      )}
                    >
                      <div className="BtnV2 BtnV2--secondary" tabIndex="-1">
                        <span>Add Account +</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              {this.state.isAccountSelected &&
                localStorage.Type === "Slack Channel" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Channel*</div>
                    <div className="FieldConfiguration__value">
                      <Select
                        isClearable={true}
                        options={this.state.channels}
                        //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                        onChange={(e) => this.setState({ channelId: e.value })}
                      />
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                localStorage.Type !== "Slack Channel" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">User*</div>
                    <div className="FieldConfiguration__value">
                      <Select
                        isClearable={true}
                        options={this.state.users}
                        //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                        onChange={(e) => this.setState({ channelId: e.value })}
                      />
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                this.state.channelId !== "0" &&
                localStorage.Type !== "Slack Reminder" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Message*</div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        value={this.state.textMessage}
                        onChange={(e) =>
                          this.setState({ textMessage: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                this.state.channelId !== "0" &&
                localStorage.Type === "Slack Reminder" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      What should they be reminded?* Describe what they should
                      be reminded.
                    </div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        value={this.state.textMessage}
                        onChange={(e) =>
                          this.setState({ textMessage: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                this.state.channelId !== "0" &&
                localStorage.Type === "Slack Reminder" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      When? (e.g. "In 5 minutes", or "Next thursday")*
                    </div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        value={this.state.reminderTime}
                        onChange={(e) =>
                          this.setState({ reminderTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

              {this.state.channelId !== "0" && (
                <div style={{ marginTop: "36px" }}>
                  <div className="FieldConfigurationField ">
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
                            last submission. You must have submitted the form to
                            be able to test.
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
                          style={{ pointerEvents: "none", margin: "0px 18px" }}
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
                    </div>
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
                                        {!val.selectedQuestion && (
                                          <div className="col-md-11 d-inline-block">
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
                                                    data.control ===
                                                    "simpletext"
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
                                        )}
                                        {val.selectedQuestion && (
                                          <div className="col-md-6 d-inline-block">
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
                                                    data.control ===
                                                    "simpletext"
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
                                        )}
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
              )}
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

SlackAuthForm.defaultProps = {
  code: "",
};

export default SlackAuthForm;
