import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { PostData, GetData, Delete } from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  ACTIVE_CAMPAIGNS_URLS,
  INTEGRATIONS_URLS
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {
  getAllAutomations,
  getCustomFields,
  getContactList,
  getAllPipeLine,
  getAllUsers,
  getAllDealStages,
  AddContact_Automations,
  AddContactNote,
  AddUpdateActiveCampaignContact,
  CreateDeal_ActiveCampaign,
  UpdateDeal_ActiveCampaign,
  getAllDeals,
  getDealbyId,
} from "../../../API/IntegrationAPI";
import { calculateTime } from "../../../util/commonFunction";
class ActiveCampaignAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      users: [],
      isAccountSelected: false,
      accountsList: [],
      columnsList: [],
      header: {},
      APIKey: "",
      APIUrl: "",
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
      pipelines: [],
      owners: [],
      pipelineId: "",
      dealStages: [],
      isValidated: false,
      emailAddress: "",
      contactNote: "",
      stageId: "",
      stages: [],
      ownerId: "",
      status: [],
      statusId: "0",
      dealId: "",
      dealslist: [],
      dealContactId: "",
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
      TeamName: "My Active Campaign",
      Type: "ActiveCampaign",
      CreatedAt: Date.now(),
      APIKey: this.state.APIKey,
      APIUrl: this.state.APIUrl,
      ActiveCampAccntId: this.state.ActiveCampAccntId,
      KeyType:"apiType",
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

  getAutomations = async (selectedAccnt) => {
    let result;
    let lists = [];
    let customFields = [];
    let owners = [];
    let pipeline = [];
    let dealStages = [];
    let deals = [];
    let status = [
      { value: "0", label: "Open" },
      { value: "1", label: "Won" },
      { value: "2", label: "Lost" },
    ];

    result = await getAllAutomations(
      selectedAccnt.APIUrl,
      selectedAccnt.APIKey
    );
    if (localStorage.Type === "Create Update Contact") {
      lists = await getContactList(selectedAccnt.APIUrl, selectedAccnt.APIKey);
      customFields = await getCustomFields(
        selectedAccnt.APIUrl,
        selectedAccnt.APIKey
      );
    } else if (localStorage.Type === "Create Deal") {
      pipeline = await getAllPipeLine(
        selectedAccnt.APIUrl,
        selectedAccnt.APIKey
      );
      owners = await getAllUsers(selectedAccnt.APIUrl, selectedAccnt.APIKey);
      dealStages = await getAllDealStages(
        selectedAccnt.APIUrl,
        selectedAccnt.APIKey
      );
    } else if (localStorage.Type === "Update Deal") {
      owners = await getAllUsers(selectedAccnt.APIUrl, selectedAccnt.APIKey);

      deals = await getAllDeals(selectedAccnt.APIUrl, selectedAccnt.APIKey);
      pipeline = await getAllPipeLine(
        selectedAccnt.APIUrl,
        selectedAccnt.APIKey
      );
      dealStages = await getAllDealStages(
        selectedAccnt.APIUrl,
        selectedAccnt.APIKey
      );
    }

    this.setState({
      automations: result,
      lists: lists,
      customFields: customFields,
      pipelines: pipeline,
      owners: owners,
      dealStages: dealStages,
      status: status,
      dealslist: deals,
    });
  };
  connectActiveCampaign = () => {
    if (this.state.APIKey === "" || this.state.APIUrl === "") {
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
        let googleArr = result.Items.filter(
          (data) => data.Type === "ActiveCampaign"
        );
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
            APIUrl: googleArr[i].APIUrl,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          this.getAutomations(arr[0]);
        }
      }
    });
  };

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(
        ACTIVE_CAMPAIGNS_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
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
    this.getAutomations(value);
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
        if (localStorage.Type === "Add Contact to an Automation") {
          result = await AddContact_Automations(
            this.state.selectedAccntValue.APIUrl,
            this.state.selectedAccntValue.APIKey,
            this.state.emailAddress,
            this.state.automationId
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        } else if (localStorage.Type === "Create Note") {
          result = await AddContactNote(
            this.state.selectedAccntValue.APIUrl,
            this.state.selectedAccntValue.APIKey,
            this.state.contactNote,
            this.state.emailAddress
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        } else if (localStorage.Type === "Create Update Contact") {
          result = await AddUpdateActiveCampaignContact(
            this.state.selectedAccntValue.APIUrl,
            this.state.selectedAccntValue.APIKey,
            this.state.emailAddress,
            this.state.FirstName,
            this.state.LastName,
            this.state.PhoneNumber,
            this.state.listId,
            this.state.Account,
            this.state.Tags
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        } else if (localStorage.Type === "Create Deal") {
          result = await CreateDeal_ActiveCampaign(
            _self.state.selectedAccntValue.APIUrl,
            _self.state.selectedAccntValue.APIKey,
            _self.state.emailAddress,
            _self.state.title,
            _self.state.value,
            _self.state.currency,
            _self.state.pipelineId,
            _self.state.ownerId,
            _self.state.stageId,
            _self.state.groupId
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        } else if (localStorage.Type === "Update Deal") {
          result = await UpdateDeal_ActiveCampaign(
            _self.state.selectedAccntValue.APIUrl,
            _self.state.selectedAccntValue.APIKey,
            _self.state.dealId,
            _self.state.title,
            _self.state.value === "" ? 0 : _self.state.value,
            _self.state.currency,
            _self.state.pipelineId,
            _self.state.ownerId,
            _self.state.stageId,
            _self.state.groupId,
            _self.state.statusId,
            _self.state.dealContactId
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  finishSetUp = () => {
    let activeCampaignSetUpData = {};
    if (localStorage.Type === "Add Contact to an Automation") {
      activeCampaignSetUpData = {
        emailAddress: this.state.emailAddress,
        automation: this.state.automationId,
        APIKey: this.state.selectedAccntValue.APIKey,
        APIUrl: this.state.selectedAccntValue.APIUrl,
      };
    } else if (localStorage.Type === "Create Note") {
      activeCampaignSetUpData = {
        emailAddress: this.state.emailAddress,
        note: this.state.contactNote,
        reltype: "Subscriber",
        APIKey: this.state.selectedAccntValue.APIKey,
        APIUrl: this.state.APIUrl,
      };
    } else if (localStorage.Type === "Create Update Contact") {
      activeCampaignSetUpData = {
        email: this.state.emailAddress,
        firstName: this.state.FirstName,
        lastName: this.state.LastName,
        phone: this.state.PhoneNumber,
        listid: this.state.listId,
        account: this.state.Account,
        tag: this.state.Tags,
        APIKey: this.state.selectedAccntValue.APIKey,
        APIUrl: this.state.selectedAccntValue.APIUrl,
      };
    } else if (localStorage.Type === "Create Deal") {
      activeCampaignSetUpData = {
        email: this.state.emailAddress,
        currency: this.state.currency,
        group: this.state.groupId,
        owner: this.state.ownerId,
        percent: null,
        stage: this.state.stageId,
        status: this.state.statusId,
        title: this.state.title,
        value: this.state.value,
        pipelineId: this.state.pipelineId,
        APIKey: this.state.selectedAccntValue.APIKey,
        APIUrl: this.state.selectedAccntValue.APIUrl,
      };
    } else {
      activeCampaignSetUpData = {
        currency: this.state.currency,
        group: this.state.groupId,
        owner: this.state.ownerId,
        percent: null,
        stage: this.state.stageId,
        status: this.state.statusId,
        title: this.state.title,
        dealId: this.state.dealId,
        pipelineId: this.state.pipelineId,
        value: this.state.value,
        APIKey: this.state.selectedAccntValue.APIKey,
        APIUrl: this.state.selectedAccntValue.APIUrl,
      };
    }
    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType:"ActiveCampaign",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(activeCampaignSetUpData),
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

  handleEmailAddressChange = (value) => {
    this.setState({ emailAddress: value });
    let type = localStorage.Type;
    if (
      type === "Create Note" &&
      (this.state.contactNote === "" || value === "")
    ) {
      this.setState({ isValidated: false });
    } else if (
      type === "Add Contact to an Automation" &&
      (this.state.automationId === "" || value === "")
    ) {
      this.setState({ isValidated: false });
    } else if (
      type === "Create Update Contact" &&
      (this.state.listId === "" || value === "")
    ) {
      this.setState({ isValidated: false });
    } else if (
      type === "Create Deal" &&
      (this.state.title === "" ||
        value === "" ||
        this.state.currency === "" ||
        this.state.value === "" ||
        this.state.pipelineId === "" ||
        this.state.stageId === "")
    ) {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handleAutomationChange = (value) => {
    this.setState({ automationId: value });
    let type = localStorage.Type;
    if (
      type === "Add Contact to an Automation" &&
      (value === "" || this.state.emailAddress === "")
    ) {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handleNoteChange = (value) => {
    this.setState({ contactNote: value });
    let type = localStorage.Type;
    if (
      type === "Create Note" &&
      (value === "" || this.state.emailAddress === "")
    ) {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };

  handleCurrencyChange = (value) => {
    let type = localStorage.Type;
    this.setState({ currency: value });
    if (
      type === "Create Deal" &&
      (this.state.title === "" ||
        this.state.emailAddress === "" ||
        value === "" ||
        this.state.value === "" ||
        this.state.pipelineId === "" ||
        this.state.stageId === "")
    ) {
      this.setState({ isValidated: false });
    }
  };
  handleTitleChange = (value) => {
    let type = localStorage.Type;
    this.setState({ title: value });
    if (
      type === "Create Deal" &&
      (value === "" ||
        this.state.emailAddress === "" ||
        this.state.currency === "" ||
        this.state.value === "" ||
        this.state.pipelineId === "" ||
        this.state.stageId === "")
    ) {
      this.setState({ isValidated: false });
    }
  };
  handleVlaueChange = (value) => {
    let type = localStorage.Type;
    this.setState({ value: value });
    if (
      type === "Create Deal" &&
      (this.state.title === "" ||
        this.state.emailAddress === "" ||
        this.state.currency === "" ||
        value === "" ||
        this.state.pipelineId === "" ||
        this.state.stageId === "")
    ) {
      this.setState({ isValidated: false });
    } else if (type === "Update Deal" && this.state.dealId === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handlePipeLineChange = (value) => {
    let type = localStorage.Type;
    this.setState({ pipelineId: value });
    if (
      type === "Create Deal" &&
      (this.state.title === "" ||
        this.state.emailAddress === "" ||
        this.state.currency === "" ||
        this.state.value === "" ||
        value === "" ||
        this.state.stageId === "")
    ) {
      this.setState({ isValidated: false });
    } else if (type === "Update Deal" && this.state.dealId === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handleStageChange = (value) => {
    let type = localStorage.Type;
    this.setState({ stageId: value });
    if (
      type === "Create Deal" &&
      (this.state.title === "" ||
        this.state.emailAddress === "" ||
        this.state.currency === "" ||
        this.state.value === "" ||
        this.state.pipelineId === "" ||
        value === "")
    ) {
      this.setState({ isValidated: false });
    } else if (type === "Update Deal" && this.state.dealId === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handleOwnerChange = (value) => {
    let type = localStorage.Type;
    this.setState({ ownerId: value });
    if (
      type === "Create Deal" &&
      (this.state.title === "" ||
        this.state.emailAddress === "" ||
        this.state.currency === "" ||
        this.state.value === "" ||
        this.state.pipelineId === "" ||
        this.state.stageId === "")
    ) {
      this.setState({ isValidated: false });
    } else if (type === "Update Deal" && this.state.dealId === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handleListChange = (value) => {
    this.setState({ listId: value });
    let type = localStorage.Type;
    if (
      type === "Create Update Contact" &&
      (value === "" || this.state.emailAddress === "")
    ) {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  handleDealIdChange = (value) => {
    this.setState({ dealId: value });
    if (value === "") {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
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

  bindUpdateDealControls = async (id) => {
    var _self = this;
    var result = await getDealbyId(
      _self.state.selectedAccntValue.APIUrl,
      _self.state.selectedAccntValue.APIKey,
      id
    );
    if (result != null) {
      this.setState({
        dealId: id,
        title: result.title,
        value: result.value,
        currency: result.currency,
        ownerId: result.owner,
        stageId: result.stage,
        groupId: result.group,
        statusId: result.status,
        dealContactId: result.contact,
      });
    }
  };
  render() {
    return (
      <div className="AdoKE9nnvZr4_zfgdeh5N">
        <div className="Paper Paper--double-padded flex1 mb1">
          <div>
            <div>
              ActiveCampaign
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
                  src={require("assets/img/active-campaign.png")}
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
                        You can connect a new Active Campaign account, or choose
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
                  localStorage.Type === "Add Contact to an Automation" && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Email address*
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
                                If the contact doesn't exist for this email,
                                we'll create it for you.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.Email}
                            onChange={(e) =>
                              this.handleEmailAddressChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                          {this.state.EmailAddress === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="FieldConfigurationField">
                        <div className="FieldConfiguration__label">
                          Choose the automation you would like to add this
                          contact to*
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.automations}
                            //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                            onChange={(e) => {
                              this.handleAutomationChange(e.value);
                            }}
                          />
                          {this.state.automationId === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {this.state.isAccountSelected &&
                  localStorage.Type === "Create Note" && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Email Address*
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.emailAddress}
                            onChange={(e) =>
                              this.setState({ emailAddress: e.target.value })
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
                        <div className="FieldConfiguration__label">Note*</div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.ContactNote}
                            onChange={(e) =>
                              this.handleNoteChange(e.target.value)
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
                    </div>
                  )}
                {this.state.isAccountSelected &&
                  localStorage.Type === "Create Update Contact" && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Lists*</div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.lists}
                            onChange={(e) => this.handleListChange(e.value)}
                          />
                          {this.state.listId === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Email Address*
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.EmailAddress}
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
                            value={this.state.FirstName}
                            onChange={(e) =>
                              this.setState({ FirstName: e.target.value })
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
                          Last Name
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.LastName}
                            onChange={(e) =>
                              this.setState({ LastName: e.target.value })
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Full Name
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.FullName}
                            onChange={(e) =>
                              this.setState({ FullName: e.target.value })
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Phone Number
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.PhoneNumber}
                            onChange={(e) =>
                              this.setState({ PhoneNumber: e.target.value })
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Account</div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.Account}
                            onChange={(e) =>
                              this.setState({ Account: e.target.value })
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Add Tags
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.Tags}
                            onChange={(e) =>
                              this.setState({ Tags: e.target.value })
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Custom Fields
                        </div>
                        {this.state.customFields.length === 0 && (
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "14px",
                              color: "rgba(0, 0, 0, 0.4)",
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
                    </div>
                  )}
                {this.state.isAccountSelected &&
                  localStorage.Type === "Create Deal" && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Contact Email address*
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.emailAddress}
                            onChange={(e) =>
                              this.setState({ emailAddress: e.target.value })
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
                        <div className="FieldConfiguration__label">Title*</div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.title}
                            onChange={(e) =>
                              this.handleTitleChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Value*</div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.value}
                            onChange={(e) =>
                              this.handleVlaueChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Currency (e.g. usd)*
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.currency}
                            onChange={(e) =>
                              this.handleCurrencyChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>

                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Owner</div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.owners}
                            onChange={(e) => {
                              this.handleOwnerChange(e.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Pipeline*
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.pipelines}
                            onChange={(e) => {
                              this.handlePipeLineChange(e.value);
                            }}
                          />
                        </div>
                      </div>
                      {this.state.EmailAddress !== "" &&
                        this.state.value !== "" &&
                        this.state.title !== "" &&
                        this.state.pipelineId !== "" && (
                          <div>
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Stages*
                              </div>
                              <div className="FieldConfiguration__value">
                                <Select
                                  isClearable={true}
                                  options={this.state.dealStages}
                                  onChange={(e) => {
                                    this.handleStageChange(e.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                {this.state.isAccountSelected &&
                  localStorage.Type === "Update Deal" && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Deal Id*
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.dealslist}
                            onChange={(e) =>
                              this.bindUpdateDealControls(e.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Title*</div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.title}
                            onChange={(e) =>
                              this.handleTitleChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Value*</div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.value}
                            onChange={(e) =>
                              this.handleVlaueChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Status</div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.status}
                            onChange={(e) =>
                              this.setState({ statusId: e.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Currency (e.g. usd)
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.currency}
                            onChange={(e) =>
                              this.handleCurrencyChange(e.target.value)
                            }
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>

                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Owner</div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.owners}
                            onChange={(e) => {
                              this.handleOwnerChange(e.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Pipeline
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.pipelines}
                            onChange={(e) => {
                              this.handlePipeLineChange(e.value);
                            }}
                          />
                        </div>
                      </div>
                      {/* {this.state.EmailAddress !="" &&  this.state.Value!="" &&this.state.Title!=""&& this.state.pipelineId!=""&&
                    <div> */}
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">Stages</div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.dealStages}
                            onChange={(e) => {
                              this.handleStageChange(e.value);
                            }}
                          />
                        </div>
                      </div>
                      {/* </div>} */}
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
                  <h2>Connect FormBuilder to Active Campaign</h2>
                  <div>
                    <p>
                      To find the API URL and Key, Login to your Active Campaign
                      account, and Go to Settings &gt; Developer.
                    </p>
                  </div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">API URL*</div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        //   value={temp.value}
                        //   onChange={e =>
                        //     this.handleInputChange(
                        //       e,
                        //       key,
                        //       temp.label
                        //     )
                        //   }
                        value={this.state.APIUrl}
                        onChange={(e) =>
                          this.setState({ APIUrl: e.target.value })
                        }
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                      />
                    </div>
                  </div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">API Key*</div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        //   value={temp.value}
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
                      onClick={() => this.connectActiveCampaign()}
                    >
                      <span>Connect Active Campaign</span>
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

export default ActiveCampaignAuthForm;
