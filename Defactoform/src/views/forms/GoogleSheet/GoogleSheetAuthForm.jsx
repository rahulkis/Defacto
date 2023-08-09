import React from "react";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import GoogleLogin from "react-google-login";
import {
  PostData,
  GetData,
  GetDataWithHeader,
  PostDataWithHeader,
  Delete,
} from "../../../stores/requests";
import {
  FORM_URLS,
  GOOGLEAUTH_URLS,
  GOOGLEAUTH_CRENDENTIALS,
  INTEGRATIONS_URLS
} from "../../../util/constants";
import { calculateTime } from "../../../util/commonFunction";
import { DraftJS } from "megadraft";
import { getProfileInfoByToken } from "../../../API/IntegrationAPI";

//const APIKEY = 'AIzaSyBQRzub4jUjyidHL6CpN1sD3VG-SQo3z1M';
///const URL = GOOGLEAUTH_URLS.GET_GOOGELDRIVE_FILES + APIKEY;

class GoogleSheetAuthForm extends React.Component {
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
      sheetId: null,
      workSheetTitle: null,
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      sheetName: "Add Row to Sheet",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      selectedSheet: {
        label: "Select",
        value: 0,
      },
      worksheetSelected: { value: 0, label: "select" },
      isWorkSheetSelected: false,
    };
    this.conditionCount = 0;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    this.getAccountList();
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
  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let googleArr = result.Items.filter(
          (data) => data.Type === "GoogleSheet"
        );
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            label:
              googleArr[i].Email +
              " Created " +
              calculateTime(googleArr[i].CreatedAt) +
              " ago",
            value: googleArr[i].RefreshToken,
            IntgrationAccntID: googleArr[i].ID,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.setState({ selectedAccntValue: arr[0] });
          this.setState({
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          
          this.refreshToken(googleArr[0].RefreshToken);
        } else {
          this.setState({
            selectedAccntValue: {
              label: "No Account",
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

  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(GOOGLEAUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID).then(
        (result) => {
          this.setState({ isSheetSelected: false });
          this.getAccountList();
          console.log("removeAccount result:", result);
        }
      );
    }
  };
  responseGoogle = (response) => {
    const formdata = new FormData();
    formdata.append("grant_type", GOOGLEAUTH_CRENDENTIALS.GRANT_TYPE);
    formdata.append("code", response.code);
    formdata.append("client_id", GOOGLEAUTH_CRENDENTIALS.CLIENT_ID);
    formdata.append("client_secret", GOOGLEAUTH_CRENDENTIALS.CLIENT_SECRET);
    formdata.append("redirect_uri", window.location.origin.toString());
    //formdata.append("scope", "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/gmail.metadata ");
    fetch(GOOGLEAUTH_URLS.GET_GOOGLEAUTHTOKEN, {
      method: "POST",
      body: formdata,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((json) => {
        localStorage.setItem("refreshToken", json.refresh_token);
        this.setState({ access_token: json.access_token });
        const headers = {
          Authorization: "Bearer " + json.access_token,
          Accept: "application/json",
        };
        this.setState({ header: headers });
        this.GetProfileInfoByToken(json.access_token);
      })
      .catch((error) => console.error(error));
  };
  GetProfileInfoByToken = async (token) => {
    let resProfile = await getProfileInfoByToken(token);
    if (resProfile != null) {
      this.addAuthAccnt(resProfile);
      this.getSheetsList(token, "GoogleAuth");
    } else {
      window.alert("SomeThing went wrong please try again?");
      return false;
    }
  };
  addAuthAccnt = (resProfile) => {
    let formModel = {
      ID: DraftJS.genKey(),
      Email: resProfile,
      Type: "GoogleSheet",
      CreatedAt: Date.now(),
      RefreshToken: localStorage.refreshToken,
      KeyType:"refreshToken",
      CreatedBy:this.loginUserId
    };
    let arr = [
      {
        label:
          formModel.Email +
          " Created  " +
          calculateTime(formModel.CreatedAt) +
          " ago",
        value: formModel.RefreshToken,
        IntgrationAccntID: formModel.ID,
      },
      ...this.state.accountsList,
    ];
    this.setState({
      selectedAccntID: formModel.ID,
      accountsList: arr,
      selectedAccntValue: arr[0],
    });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          //  this.getAccountList();
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };
  getSheetsList = (token, Type) => {
    if (Type === "GoogleAuth") {
      const headers = {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      };
      this.setState({ header: headers });
      GetDataWithHeader(
        GOOGLEAUTH_URLS.GET_GOOGELDRIVE_FILES + GOOGLEAUTH_CRENDENTIALS.APIKEY,
        headers
      ).then((result) => {
        if (result != null) {
          //Filter records to get only google sheets
          const list = result.files.filter((item) => {
            return item.mimeType === "application/vnd.google-apps.spreadsheet";
          });

          let objectMap = this.arrayToObj(list, function(item) {
            return { value: item.id, label: item.name };
          });
          this.setState({
            sheets: objectMap,
            selectedSheet: { value: 0, label: "Select" },
            isAccountSelected: true,
            isSheetSelected: false,
          });
        }
      });
    } 
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

  getWorkSheetsById = (e) => {
    // Api call to get list of worksheets using  spread sheet Id.
    if (e) {
      this.setState({ selectedSheet: e, isWorkSheetSelected: false });
      const SheetUrl = GOOGLEAUTH_URLS.GETWORKSHEETLIST_BY_SHEETID.replace(
        "{SHEETID}",
        e.value
      ).replace("{SHEETTITLE}", e.label);
      GetDataWithHeader(SheetUrl, this.state.header).then((result) => {
        if (result != null && result.sheets !== undefined) {
          let list = [];
          //Api call to get column list
          result.sheets.forEach(function(o) {
            list.push(o.properties);
          });
          let objectMap = this.arrayToObj(list, function(item) {
            return { value: item.sheetId, label: item.title };
          });
          this.setState({
            workSheets: objectMap,
            selectedWorksheet: { value: 0, label: "select" },
            isSheetSelected: true,
            sheetId: e.value,
          });
        }
      });
    } else {
      this.setState({
        workSheets: [],
        isSheetSelected: false,
        sheetId: "",
      });
    }
  };

  getColumnsListByWorkSheetID = (e) => {
    if (e) {
      const SheetUrl = GOOGLEAUTH_URLS.GETWORKSHEET_COLUMNLIST_BY_ID.replace(
        "{WORKSHEETID}",
        this.state.sheetId
      ).replace("{WORKSHEETTITLE}", e.label);
      this.setState({ workSheetTitle: e.label });
      GetDataWithHeader(SheetUrl, this.state.header).then((result) => {
        if (result != null) {
          if (result.values !== undefined) {
            let objectMap = this.arrayToObj(result.values[0], function(item) {
              return { value: "", label: item };
            });
            this.setState({
              columnsList: objectMap,
              selectedWorksheet: e,
              isWorkSheetSelected: true,
            });
          } else {
            this.setState({
              columnsList: [],
              selectedWorksheet: e,
              isWorkSheetSelected: true,
            });
          }
        }
      });
    } else {
      this.setState({
        columnsList: [],
        workSheetTitle: "",
        selectedWorksheet: { value: 0, label: "select" },
        isWorkSheetSelected: false,
      });
    }
  };
  refreshToken = (refreshtoken) => {
    const formdata = new FormData();
    formdata.append("grant_type", "refresh_token");
    formdata.append("refresh_token", refreshtoken);
    formdata.append("client_id", GOOGLEAUTH_CRENDENTIALS.CLIENT_ID);
    formdata.append("client_secret", GOOGLEAUTH_CRENDENTIALS.CLIENT_SECRET);

    fetch(GOOGLEAUTH_URLS.GET_GOOGLEAUTHTOKEN, {
      method: "POST",
      body: formdata,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((json) => {
        this.setState({ access_token: json.access_token });
        const headers = {
          Authorization: "Bearer " + json.access_token,
          Accept: "application/json",
        };
        this.setState({ header: headers });
        this.getSheetsList(json.access_token, "GoogleAuth");
      });
  };
  handleSwitchChange = (event) => {
    this.setState({ conditionalLogic: event.target.checked });
  };
  closeForm = (e) => {
    this.props._renderChildComp("IntegrationList");
  };
  finishSetUp = () => {
    console.log("this.state.conditions:", this.state.conditions);
    let googleSheetSetupData={}
    googleSheetSetupData={
      WorkSheetTitle: this.state.workSheetTitle,
      SheetID: this.state.sheetId,
      WorkSheetColumns: JSON.stringify(this.state.columnsList)
        };

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: this.state.sheetName,
      IntegrationType:"GoogleSheet",
      FormId: localStorage.CurrentFormId,      
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.selectedAccntValue.value,   
      SetUpData: JSON.stringify(googleSheetSetupData),
      IsConditionalLogic: this.state.conditionalLogic,
      Conditions: JSON.stringify(this.state.conditions),
    };
    if (!this.state.sheetId || !this.state.workSheetTitle) {
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

  sendTest = () => {
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }
    if (!this.state.sheetId || !this.state.workSheetTitle) {
      window.alert("Please answer all required fields");
      return false;
    }
    const SheetUpdateRowUrl = GOOGLEAUTH_URLS.UPDATEWORKSHEET_COLUMNS.replace(
      "{SheetID}",
      this.state.sheetId
    )
      .replace("{WorkSheetTitle}", this.state.workSheetTitle)
      .replace("{APIKEY}", GOOGLEAUTH_CRENDENTIALS.APIKEY);
    let arrSheetColumns = this.state.columnsList;
    let result = arrSheetColumns.map((a) => a.value);
    try {
      PostDataWithHeader(SheetUpdateRowUrl, this.state.header, {
        values: [result],
      }).then((result) => {
        this.setState({ testStatus: "pass" });
      });
    } catch (err) {
      this.setState({ testStatus: "fail" });
    }
  };
  
  handleInputChange = (e, key, label) => {
    const arr = Object.assign([], this.state.columnsList, {
      [key]: { label: label, value: e.target.value },
    });
    this.setState({ columnsList: arr });
  };

  handleAccountChange = (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
    });
    this.refreshToken(value.value);
  };

  hanleSheetName = (e) => {
    this.setState({ sheetName: e.target.value });
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
                  alt=""
                  src="https://s3-ap-southeast-2.amazonaws.com/paperform/u-1/0/2019-01-03/3c536ce/sheets.png"
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
                    defaultValue={{ label: "Select", value: 0 }}
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

                    <GoogleLogin
                      clientId={GOOGLEAUTH_CRENDENTIALS.CLIENT_ID}
                      render={(renderProps) => (
                        // <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
                        <div
                          className="BtnV2 BtnV2--secondary"
                          tabIndex="-1"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <span>Add Account +</span>
                        </div>
                      )}
                      scope={GOOGLEAUTH_CRENDENTIALS.Scope}
                      buttonText="Login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      cookiePolicy={"single_host_origin"}
                      accessType="false"
                      responseType="code"
                      approvalPrompt="force"
                      prompt="consent"
                    />
                  </div>
                </div>
              </div>
              {this.state.isAccountSelected && (
                <div className="FieldConfigurationField ">
                  <div className="FieldConfiguration__label">Sheet</div>
                  <div className="FieldConfiguration__value">
                    <Select
                      isClearable={true}
                      options={this.state.sheets}
                      value={this.state.selectedSheet}
                      //defaultValue={this.state.sheets.length>0?this.state.sheets[0]:{ label: "Select Sheet", value: 0 }}
                      onChange={(e) => this.getWorkSheetsById(e)}
                    />
                    {this.state.sheetId === "" && (
                      <div className="FieldConfigurationField__error">
                        This field is required
                      </div>
                    )}
                  </div>
                </div>
              )}
              {this.state.isAccountSelected && this.state.isSheetSelected && (
                <div className="FieldConfigurationField ">
                  <div className="FieldConfiguration__label">WorkSheets</div>
                  <div className="FieldConfiguration__value">
                    <Select
                      isClearable={true}
                      options={this.state.workSheets}
                      value={this.state.selectedWorksheet}
                      onChange={(e) => this.getColumnsListByWorkSheetID(e)}
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
                this.state.isSheetSelected &&
                this.state.isWorkSheetSelected && (
                  <div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__value">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Columns
                          </div>
                          {this.state.columnsList.length === 0 ? (
                            <div
                              style={{
                                textAlign: "center",
                                fontSize: "14px",
                                color: "rgba(0, 0, 0, 0.4)",
                              }}
                            >
                              No Columns Available
                            </div>
                          ) : (
                            <div className="FieldConfiguration__value">
                              <div className="FieldConfigurationField__subfields">
                                {this.state.columnsList.map((temp, key) => (
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
                    </div>
                  </div>
                )}
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
                          please make sure you have submitted the form at least
                          once and try again.
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
                                                  : `Untitled  _  ${data.key}`
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
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t}
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
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t.label}
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
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t.label}
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
                                                (t, k) => (
                                                  <option key={k} value={k}>
                                                    {t.SKU}
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

GoogleSheetAuthForm.defaultProps = {
  display: "none",
};

export default GoogleSheetAuthForm;
