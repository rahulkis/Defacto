import React from "react";

import Select from "react-select";

import Switch from "@material-ui/core/Switch";
import {
  PostData,
  GetData,
  PostDataWithoutBody,
  Delete,
} from "../../../stores/requests";
import {
  FORM_URLS,
  GOOGLEAUTH_URLS,
  TRELLOAUTH_CREDENTIALS,
  TRELLOAUTH_URLS,
  TRELLO_URLS,
  INTEGRATIONS_URLS
} from "../../../util/constants";
import { arrayToObj } from "../../../util/commonFunction";
import { DraftJS } from "megadraft";
import TrelloClient from "react-trello-client";
//const APIKEY = 'AIzaSyBQRzub4jUjyidHL6CpN1sD3VG-SQo3z1M';
///const URL = GOOGLEAUTH_URLS.GET_GOOGELDRIVE_FILES + APIKEY;

class TrelloAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      channels: [],
      users: [],
      workSheets: [],
      isAccountSelected: false,
      accountsList: [],
      header: {},
      listId: "",
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedBoardValue: {
        label: "Select Board",
        value: 0,
      },
      selectedOrgValue: {
        label: "Select Organization",
        value: 0,
      },
      selectedAccntID: "",

      refereshToken: "",

      useConditionalLogic: false,
      conditions: [],

      boardArr: [],
      StatusTypeArr: [],
      trello_token: "",
      isListSelected: false,
      cardName: "",
      cardDescription: "",
      formSubmitted: false,
      cardUrl: "",
      listName: "",
      headerMsg: "Create Card",
      organizationArr: [],
      isOrgSelected: false,
      boardName: "",
      errorMessage: "",
      //TrelloAuthUrl: "https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&callback_method=postmessage&return_url=http://localhost:3000/Callback&scope=read,write&response_type=token&key=5bcf3e9ea10041ca755854f735660536"
    };
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }
  componentWillMount() {
    this.getAccountList();
    localStorage.removeItem("trello_token");
    GetData(FORM_URLS.GET_FORM_BY_ID_URL + localStorage.FormId).then(
      (result) => {
        if (result != null) {
          if (result.Item.SubmissionCount && result.Item.SubmissionCount > 0) {
            this.setState({
              formSubmitted: true,
              headerMsg: localStorage.Type,
            });
          } else {
            this.setState({
              formSubmitted: false,
              headerMsg: localStorage.Type,
            });
          }
        }
      }
    );
  }
  postMessage = () => {
    console.log(localStorage.trello_token);
    this.setState({ trello_token: localStorage.trello_token });
    this.getmemberDetail(localStorage.trello_token);
  };

  addAuthAccnt = (userName, fullName, memberId) => {
    let formModel = {
      ID: DraftJS.genKey(),
      Email: fullName + "(@" + userName + ")",
      UserName: userName,
      MemberId: memberId,
      Type: "Trello",
      CreatedAt: Date.now(),
      RefreshToken: localStorage.trello_token,
      KeyType:"accessToken",
      CreatedBy:this.loginUserId
    };
    this.setState({ selectedAccntID: formModel.ID });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          this.getAccountList();
          this.boardList(localStorage.trello_token, memberId);
          localStorage.removeItem("trello_token");
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let googleArr = result.Items.filter((res) => res.Type === "Trello");
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            label: googleArr[i].Email,
            value: googleArr[i].RefreshToken,
            IntgrationAccntID: googleArr[i].ID,
            MemberId: googleArr[i].MemberId,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            isAccountSelected: true,
            selectedAccntID: arr[0].IntgrationAccntID,
          });
          if (localStorage.Type === "Create Board") {
            this.getTrelloOrgById(arr[0].IntgrationAccntID);
          } else {
            this.getBoardListByAccntId(arr[0].IntgrationAccntID);
          }
        } else {
          let selectedAccntValue = {
            label: "Select Account",
            value: 0,
            IntgrationAccntID: "",
          };
          this.setState({
            selectedAccntValue: selectedAccntValue,
            isAccountSelected: false,
            selectedAccntID: "",
          });
        }
      }
    });
  };
  boardList = (token, memberId) => {
    let url = TRELLOAUTH_URLS.GET_BOARDLISTBYMEMBERID.replace(
      "{yourAPIToken}",
      token
    )
      .replace("{id}", memberId)
      .replace("{yourAPIKey}", TRELLOAUTH_CREDENTIALS.API_KEY);
    GetData(url).then((result) => {
      let objectMap = arrayToObj(result, function(item) {
        return { value: item.id, label: item.name };
      });
      this.addBoardList(token, objectMap);
    });
  };
  addBoardList = (token, objMap) => {
    let formModel = {
      IntgrationAccntID: this.state.selectedAccntID,
      Type: "Trello Boards",
      RefreshToken: token,
      Boards: JSON.stringify(objMap),
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };
    try {
      PostData(TRELLO_URLS.ADD_TRELLO_BOARDS, formModel).then((result) => {
        this.setState({ boardArr: objMap });
      });
    } catch (err) {}
  };
  getmemberDetail = (token) => {
    let url = TRELLOAUTH_URLS.GET_TRELLOMEMBERDETAIL.replace(
      "{yourAPIKey}",
      TRELLOAUTH_CREDENTIALS.API_KEY
    ).replace("{yourAPIToken}", token);
    GetData(url).then((result) => {
      this.addAuthAccnt(result.username, result.fullName, result.id);
      this.getTrelloOrgListUsingAuth(result.id, token);
    });
  };
  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );
    if (confirm) {
      Delete(
        TRELLO_URLS.REMOVE_TRELLO_ACCOUNT + this.state.selectedAccntID
      ).then((result) => {
        console.log("removeAccount result:", result);
        this.getAccountList();
      });
    }
  };
  handleSwitchChange = (event) => {
    this.setState({ conditionalLogic: event.target.checked });
  };
  closeForm = (e) => {
    this.props._renderChildComp("IntegrationList");
  };

  finishSetUp = () => {
    let trelloSetUpData = {};
    if (localStorage.Type === "Create Card") {
      trelloSetUpData = {
        idList: this.state.selectedStatusTypeValue.value,
        keepFromSource: "all",
        key: TRELLOAUTH_CREDENTIALS.API_KEY,
        token: this.state.selectedAccntValue.value,
        name: this.state.cardName,
        desc: this.state.cardDescription,
      };
    } else if (localStorage.Type === "Create List") {
      trelloSetUpData = {
        idBoard: this.state.selectedBoardValue.value,
        key: TRELLOAUTH_CREDENTIALS.API_KEY,
        token: this.state.selectedAccntValue.value,
        name: this.state.listName,
      };
    } else {
      trelloSetUpData = {
        name: this.state.boardName,
        defaultLabels: "true",
        defaultLists: "true",
        keepFromSource: "none",
        prefs_permissionLevel: "private",
        prefs_voting: "disabled",
        prefs_comments: "members",
        prefs_invitations: "members",
        prefs_selfJoin: "true",
        prefs_cardCovers: "true",
        prefs_background: "blue",
        prefs_cardAging: "regular",
        key: TRELLOAUTH_CREDENTIALS.API_KEY,
        token: this.state.selectedAccntValue.value,
      };
    }

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType:"Trello",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(trelloSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.selectedAccntValue.value,
      IsConditionalLogic: this.state.conditionalLogic,
      Conditions: JSON.stringify(this.state.conditions),
    };
    if (
      localStorage.Type === "Create List" &&
      (!this.state.isBoardSelected || !this.state.listName)
    ) {
      window.alert("Please answer all required fields");
      return false;
    } else if (
      localStorage.Type === "Create Board" &&
      (!this.state.isOrgSelected || !this.state.boardName)
    ) {
      window.alert("Please answer all required fields");
      return false;
    } else if (
      localStorage.Type === "Create Card" &&
      (!this.state.isListSelected || !this.state.cardName)
    ) {
      window.alert("Please answer all required fields");
      return false;
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
  getBoardListByAccntId = (AccntID) => {
    let url = TRELLO_URLS.GET_BOARDLISTBYINTACCNTID;

    GetData(url + AccntID).then((result) => {
      if (result != null && result.Item !== undefined) {
        this.setState({
          isAccountSelected: true,
          selectedBoardValue: JSON.parse(result.Item.Boards)[0],
          boardArr: JSON.parse(result.Item.Boards),
        });
      }
    });

    if (localStorage.Type === "Create Board") {
      this.getTrelloOrgById(AccntID);
    }
  };

  getListByBoardId = (value) => {
    this.setState({ selectedBoardValue: value, isBoardSelected: true });
    let url = TRELLO_URLS.GET_TRELLOBOARDSTATUSTYPEByID;
    GetData(url + value.value).then((result) => {
      if (result != null && result.Item !== undefined) {
        if (result.Item.BoardStatusTypes !== undefined)
          this.setState({
            StatusTypeArr: JSON.parse(result.Item.BoardStatusTypes),
          });
        else {
          this.getStatusTypeListUsingAuth(value.value);
        }
      } else {
        this.getStatusTypeListUsingAuth(value.value);
      }
    });
  };
  getTrelloOrgById = (id) => {
    let url = TRELLO_URLS.GET_TRELLOORGANIZATIONLISTBYID;
    GetData(url + id).then((result) => {
      if (result != null && result.Item !== undefined) {
        if (result.Item.Organizations !== undefined)
          this.setState({
            organizationArr: JSON.parse(result.Item.Organizations),
          });
        else {
          this.getTrelloOrgListUsingAuth(
            this.state.selectedAccntValue.MemberId,
            this.state.selectedAccntValue.value
          );
        }
      } else {
        this.getTrelloOrgListUsingAuth(
          this.state.selectedAccntValue.MemberId,
          this.state.selectedAccntValue.value
        );
      }
    });
  };
  getStatusTypeListUsingAuth = (id) => {
    let url = TRELLOAUTH_URLS.GET_AUTHSTATUSTYPELISTBYBOARDID.replace(
      "{yourAPIKey}",
      TRELLOAUTH_CREDENTIALS.API_KEY
    )
      .replace("{yourAPIToken}", this.state.selectedAccntValue.value)
      .replace("{id}", id);
    GetData(url).then((result) => {
      let objectMap = arrayToObj(result, function(item) {
        return { value: item.id, label: item.name };
      });
      this.setState({ StatusTypeArr: objectMap });
      this.addStatusTypeList(id, objectMap);
    });
  };
  getTrelloOrgListUsingAuth = (id, token) => {
    let url = TRELLOAUTH_URLS.GET_TRELLOORGANIZATIONLIST.replace(
      "{yourAPIKey}",
      TRELLOAUTH_CREDENTIALS.API_KEY
    )
      .replace("{yourAPIToken}", token)
      .replace("{id}", id);
    GetData(url).then((result) => {
      let objectMap = arrayToObj(result, function(item) {
        return { value: item.id, label: item.displayName };
      });
      if (objectMap.length > 0) {
        this.setState({ organizationArr: objectMap });
        this.addTrelloOrg(
          this.state.selectedAccntValue.IntgrationAccntID,
          objectMap
        );
      }
    });
  };
  addTrelloOrg = (id, Orgs) => {
    let formModel = {
      IntgrationAccntID: this.state.selectedAccntValue.IntgrationAccntID,
      Type: "Trello Organization",
      Organizations: JSON.stringify(Orgs),
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };
    try {
      PostData(TRELLO_URLS.ADD_TRELLOORGANIZATION, formModel).then((result) => {
        //  this.setState({ organizationArr: Orgs });
        //this.getAccountList();
      });
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  addStatusTypeList = (id, BoardStatusTypes) => {
    let formModel = {
      BoardID: id,
      Type: "Trello Status",
      BoardStatusTypes: JSON.stringify(BoardStatusTypes),
      CreatedAt: Date.now(),
      CreatedBy: "1",
    };
    try {
      PostData(TRELLO_URLS.ADD_TRELLOBOARDSTATUSTYPE, formModel).then(
        (result) => {
          // this.setState({ boardArr: objMap });
          //this.getAccountList();
        }
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
        isBoardSelected: false,
      },
      this.getBoardListByAccntId(value.IntgrationAccntID)
    );
  };

  handleOrgChange = (value) => {
    this.setState({
      selectedOrgValue: value,
      isAccountSelected: true,
      isOrgSelected: true,
    });
  };

  handleListChange = (value) => {
    this.setState({ isListSelected: true, selectedStatusTypeValue: value });
  };
  sendTest = () => {
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }
    if (
      localStorage.Type === "Create List" &&
      !this.state.isBoardSelected &&
      this.state.listName !== ""
    ) {
      window.alert("Please answer all required fields");
      return false;
    } else if (
      localStorage.Type === "Create Board" &&
      !this.state.isOrgSelected &&
      this.state.boardName !== ""
    ) {
      window.alert("Please answer all required fields");
      return false;
    } else if (
      localStorage.Type === "Create Card" &&
      !this.state.isListSelected &&
      this.state.cardName !== ""
    ) {
      window.alert("Please answer all required fields");
      return false;
    }

    try {
      if (localStorage.Type === "Create Card") {
        this.createCard();
      } else if (localStorage.Type === "Create List") {
        this.createList();
      } else {
        this.createBoard();
      }
    } catch (err) {}
  };
  createCard = () => {
    let formModel = {
      idList: this.state.selectedStatusTypeValue.value,
      keepFromSource: "all",
      key: TRELLOAUTH_CREDENTIALS.API_KEY,
      token: this.state.selectedAccntValue.value,
      name: this.state.cardName,
      desc: this.state.cardDescription,
    };
    this.setState({ selectedAccntID: formModel.ID });
    let url = TRELLOAUTH_URLS.ADD_TRELLOCARD;

    try {
      PostDataWithoutBody(url, formModel).then((result) => {
        if (result != null) {
          if (result.url !== undefined) {
            this.setState({ testStatus: "pass", cardUrl: result.url });
          } else {
            this.setState({ testStatus: "fail" });
          }
          //console.log(result.url);
        }
      });
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  createList = () => {
    let formModel = {
      idBoard: this.state.selectedBoardValue.value,
      key: TRELLOAUTH_CREDENTIALS.API_KEY,
      token: this.state.selectedAccntValue.value,
      name: this.state.listName,
    };
    let url = TRELLOAUTH_URLS.ADD_TRELLOLIST;

    try {
      PostDataWithoutBody(url, formModel).then((result) => {
        if (result != null) {
          if (result.url !== undefined || result.name !== undefined) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
          //console.log(result.url);
        }
      });
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  createBoard = () => {
    let formModel = {
      name: this.state.boardName,
      defaultLabels: "true",
      defaultLists: "true",
      keepFromSource: "none",
      prefs_permissionLevel: "private",
      prefs_voting: "disabled",
      prefs_comments: "members",
      prefs_invitations: "members",
      prefs_selfJoin: "true",
      prefs_cardCovers: "true",
      prefs_background: "blue",
      prefs_cardAging: "regular",
      key: TRELLOAUTH_CREDENTIALS.API_KEY,
      token: this.state.selectedAccntValue.value,
    };

    let url = TRELLOAUTH_URLS.ADD_TRELLOBOARD;

    try {
      PostDataWithoutBody(url, formModel).then((result) => {
        if (result != null) {
          if (result.url !== undefined || result.name !== undefined) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
          //console.log(result.url);
        }
      });
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
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
    console.log("newArr[0]:", newArr[0]);
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
                  src={require("assets/img/trello.png")}
                  height="32"
                  style={{ marginRight: "9px", verticalAlign: "middle" }}
                />
                <input
                  placeholder="What do you want to call this action?"
                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                  value={this.state.headerMsg}
                  onChange={(e) => this.setState({ headerMsg: e.target.value })}
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
                    <TrelloClient
                      apiKey={TRELLOAUTH_CREDENTIALS.API_KEY} // Get the API key from https://trello.com/app-key/
                      clientVersion={1} // number: {1}, {2}, {3}
                      apiEndpoint="https://api.trello.com" // string: "https://api.trello.com"
                      authEndpoint="https://trello.com" // string: "https://trello.com"
                      intentEndpoint="https://trello.com" // string: "https://trello.com"
                      authorizeName={DraftJS.genKey()} // string: "React Trello Client"
                      authorizeType="popup" // string: popup | redirect
                      authorizePersist={false}
                      authorizeInteractive={true}
                      authorizeScopeRead={true} // boolean: {true} | {false}
                      authorizeScopeWrite={true} // boolean: {true} | {false}
                      authorizeScopeAccount={true} // boolean: {true} | {false}
                      authorizeExpiration="never" // string: "1hour", "1day", "30days" | "never"
                      authorizeOnSuccess={() => this.postMessage()} // function: {() => console.log('Login successful!')}
                      authorizeOnError={() => console.log("Login error!")} // function: {() => console.log('Login error!')}
                      autoAuthorize={false} // boolean: {true} | {false}
                      authorizeButton={true} // boolean: {true} | {false}
                      // buttonStyle="metamorph" // string: "metamorph" | "flat"
                      // buttonColor="light" // string: "green" | "grayish-blue" | "light"
                      buttonText="Add Account +" // string: "Login with Trello"
                    />
                  </div>
                </div>
              </div>
              {this.state.isAccountSelected &&
                localStorage.Type !== "Create Board" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Boards</div>
                    <div className="FieldConfiguration__value">
                      <Select
                        isClearable={true}
                        options={this.state.boardArr}
                        onChange={(e) => this.getListByBoardId(e)}
                      />
                      {this.state.sheetId === "" && (
                        <div className="FieldConfigurationField__error">
                          This field is required
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                this.state.isBoardSelected &&
                localStorage.Type === "Create Card" && (
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">List</div>
                    <div className="FieldConfiguration__value">
                      <Select
                        isClearable={true}
                        options={this.state.StatusTypeArr}
                        // value={this.state.selectedStatusTypeValue}
                        // defaultValue={{ label: "Select List", value: 0 }}
                        onChange={(e) => this.handleListChange(e)}
                      />
                      {this.state.workSheetTitle === "" && (
                        <div className="FieldConfigurationField__error">
                          This field is required
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {this.state.isAccountSelected &&
                this.state.isBoardSelected &&
                localStorage.Type === "Create List" && (
                  <div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        List Name*
                      </div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          value={this.state.listName}
                          onChange={(e) =>
                            this.setState({ listName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              {this.state.isListSelected && (
                <div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Card Name*</div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        value={this.state.cardName}
                        onChange={(e) =>
                          this.setState({ cardName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      Card Description
                    </div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        value={this.state.cardDescription}
                        onChange={(e) =>
                          this.setState({ cardDescription: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              {localStorage.Type === "Create Board" &&
                this.state.isAccountSelected && (
                  <div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">Name*</div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          value={this.state.boardName}
                          onChange={(e) =>
                            this.setState({ boardName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        {" "}
                        Description
                      </div>
                      <div className="FieldConfiguration__value">
                        <input
                          type="text"
                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          value={this.state.boardDescription}
                          onChange={(e) =>
                            this.setState({ boardDescription: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        {" "}
                        Organization*
                      </div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          options={this.state.organizationArr}
                          //value={this.state.selectedOrganizationValue}
                          // defaultValue={{ label: "Select List", value: 0 }}
                          onChange={(e) => this.handleOrgChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              <div style={{ marginTop: "36px" }}>
                <div className="FieldConfigurationField ">
                  {((this.state.isBoardSelected &&
                    this.state.listName !== "") ||
                    (this.state.isListSelected && this.state.cardName !== "") ||
                    (this.state.isOrgSelected &&
                      this.state.boardName !== "")) && (
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
                          <span>
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
                            {this.state.cardUrl !== "" && (
                              <a href={this.state.cardUrl} target="blank">
                                {this.state.cardUrl}
                              </a>
                            )}
                          </span>
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
                        {this.state.testStatus === "fail" && (
                          <div class="FieldConfigurationField__error">
                            {this.state.errorMessage}
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
                                                (data, index) => (
                                                  <option
                                                    key={index}
                                                    value={index}
                                                  >
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
                                                (data, index) => (
                                                  <option
                                                    key={index}
                                                    value={index}
                                                  >
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
                                                (data, index) => (
                                                  <option
                                                    key={index}
                                                    value={index}
                                                  >
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
                                                (data, index) => (
                                                  <option
                                                    key={index}
                                                    value={index}
                                                  >
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

TrelloAuthForm.defaultProps = {
  code: "",
};

export default TrelloAuthForm;
