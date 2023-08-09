import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { PostData, GetData, Delete } from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  MEISTER_TASK_AUTH_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import { AddNewMeisterTask } from "../../../API/IntegrationAPI";
import { calculateTime, arrayToObj } from "../../../util/commonFunction";

class MeistertaskAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      isAccountSelected: false,
      selectedAccnt: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      headerName: "Create a task",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      projectLists: [],
      access_token: "",
      isValidated: false,
      meistertaskCode: "",
      sectionLists: [],
      assignToLists: [],
      testStatus: "",
      isLoadingFields: false,
      statusLists: [
        {label: "open", value: "1" },
        { label: "completed", value: "2" },
        { label: "trashed", value: "8" },
        {label:"completed_archived", value: "18"}
      ],
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
        this.setState({ meistertaskCode: this.props.code });
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
        APIUrl: MEISTER_TASK_AUTH_URLS.BASE_URL + "oauth2/token",
        bodyInfo: {
          client_id: MEISTER_TASK_AUTH_URLS.CLIENT_ID,
          client_secret: MEISTER_TASK_AUTH_URLS.CLIENT_SECRET,
          code: this.props.code,
          grant_type: "authorization_code",
          redirect_uri:
            //"https://master.d1i3h6ck09x8p5.amplifyapp.com/user/IntegrationNwebhooks"
            `${window.location.origin.toString()}/user/IntegrationNwebhooks`,
        },
      };
      PostData(MEISTER_TASK_AUTH_URLS.ACCESS_TOKEN_URL, formModel).then(
        (result) => {
          if (result != null) {
            if (result.statusCode === 200) {
              result = JSON.parse(result.res);
              if (result.access_token !== undefined) {
                this.get_accountInfo(result);
              }
            }
          }
        }
      );
    }
  };

  get_accountInfo = async (res) => {
    let formdata = {
      headerValue: "Bearer " + res.access_token,
      APIUrl: MEISTER_TASK_AUTH_URLS.BASE_URL + "api/v2/users/me",
    };
    try {
      await PostData(MEISTER_TASK_AUTH_URLS.GET_API, formdata).then(
        (result) => {
          if (result.statusCode === 200) {
            this.addAuthAccnt(result.res, res.access_token);
            this.setState({ access_token: res.access_token });
          }
        }
      );
    } catch (err) {
      this.setState({
        isLoadingFields: false,
      });
    }
  };

  addAuthAccnt = (res, access_token) => {
    res = JSON.parse(res);
    let formModel = {
      ID: DraftJS.genKey(),
      UserName: res.name,
      Type: "Meistertask",
      CreatedAt: Date.now(),
      MemberId: res.id,
      RefreshToken: access_token,
      keyType:"accessToken",
      Email: res.email,
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
        let googleArr = result.Items.filter(
          (data) => data.Type === "Meistertask"
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
          this.BindProjectList(arr[0].RefreshToken);
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

  BindProjectList = async (token) => {
    let objectMap = [];
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: MEISTER_TASK_AUTH_URLS.GET_BASE_URL + "api/projects",
    };
    try {
      await PostData(MEISTER_TASK_AUTH_URLS.GET_API, formdata).then(
        (result) => {
          if (result.statusCode === 200) {
            objectMap = arrayToObj(JSON.parse(result.res), function(item) {
              return { value: item.id, label: item.name };
            });
            this.setState({ projectLists: objectMap, isLoadingFields: false });
          }
        }
      );
    } catch (err) {
      alert("Something went wrong. Please try again.");
      this.setState({
        isLoadingFields: false,
      });
    }
  };

  handleProjectChange = async (e) => {
    this.setState({projectId:e.value});
    let _self = this;
    let token = _self.state.accountsList[0].RefreshToken;
    await this.BindSectionList(token, e.value);
    await this.BindAssignList(token, e.value);

    if(_self.state.projectId === "" && _self.state.projectId === undefined || e.value === "" || e.value === null)
    {
      _self.setState({isValidated : false});
    }
    else if (_self.state.sectionId === ""|| _self.state.sectionId === undefined )
    {
      _self.setState({isValidated : false});
    }
    else if (_self.state.userName === "" || _self.state.userName === undefined)
    {
      _self.setState({isValidated : false});
    }
    else if(_self.state.statusId === ""  || _self.state.statusId === undefined)
    {
      _self.setState({isValidated : false});
    }
    else
    {
      _self.setState({isValidated : true});
    }  
  };

  BindSectionList = async (token, val) => {
    let objectMap = [];
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl:
        MEISTER_TASK_AUTH_URLS.GET_BASE_URL +
        "api/projects/" +
        val +
        "/sections",
    };
    try {
      await PostData(MEISTER_TASK_AUTH_URLS.GET_API, formdata).then(
        (result) => {
          if (result.statusCode === 200) {
            objectMap = arrayToObj(JSON.parse(result.res), function(item) {
              return { value: item.id, label: item.name, sort: item.sequence };
            });
            this.setState({ sectionLists: objectMap });
          }
        }
      );
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  BindAssignList = async (token, val) => {
    let objectMap = [];
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl:
        MEISTER_TASK_AUTH_URLS.GET_BASE_URL +
        "api/projects/" +
        val +
        "/persons",
    };
    try {
      await PostData(MEISTER_TASK_AUTH_URLS.GET_API, formdata).then(
        (result) => {
          if (result.statusCode === 200) {
            objectMap = arrayToObj(JSON.parse(result.res), function(item) {
              return { value: item.id, label: item.firstname + " " + item.lastname + " (" + item.email +")",  };
            });
            this.setState({ assignToLists: objectMap });
          }
        }
      );
    } catch (err) {
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
        MEISTER_TASK_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
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

  handleSectionChange = async (value) => {
    this.setState({sectionId:value});
    let _self =this;
    if(_self.state.projectId === "" || _self.state.projectId === undefined)
    {
      _self.setState({isValidated : false});
    }
    else if (_self.state.sectionId === "" && _self.state.sectionId === undefined || value === "" || value === null)
    {
      _self.setState({isValidated : false});
    }
    else if (_self.state.userName === "" || _self.state.userName === undefined)
    {
      _self.setState({isValidated : false});
    }
    else if(_self.state.statusId === ""  || _self.state.statusId === undefined)
    {
      _self.setState({isValidated : false});
    }
    else
    {
      _self.setState({isValidated : true});
    }  
  }

  handleStatusChange = async (value) => {
    this.setState({statusId:value});
    let _self =this;
    if(_self.state.projectId === "" || _self.state.projectId === undefined)
    {
      this.setState({isValidated : false});
    }
    else if (_self.state.sectionId === "" || _self.state.sectionId === undefined )
    {
      this.setState({isValidated : false});
    }
    else if (_self.state.userName === "" || _self.state.userName === undefined)
    {
      this.setState({isValidated : false});
    }
    else if(_self.state.statusId === ""  && _self.state.statusId === undefined || value === ""  || value === null)
    {
      this.setState({isValidated : false});
    }
    else
    {
      _self.setState({isValidated : true});
    }  
  }

  
  handleUserNameChange = async (value) => {
    this.setState({userName:value});
    let _self =this;
    if(_self.state.projectId === "" || _self.state.projectId === undefined)
    {
      _self.setState({isValidated : false});
    }
    else if (_self.state.sectionId === ""|| _self.state.sectionId === undefined )
    {
      _self.setState({isValidated : false});
    }
    else if (_self.state.userName === "" && _self.state.userName === undefined || value === "" || value === null)
    {
      _self.setState({isValidated : false});
    }
    else if(_self.state.statusId === ""  || _self.state.statusId === undefined )
    {
      _self.setState({isValidated : false});
    }
    else
    {
      _self.setState({isValidated : true});
    }  
  }

  handleAccountChange = async (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    //Bind Refersh token value code
    await this.BindProjectList(value.RefreshToken);
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
        let token = this.state.accountsList[0].RefreshToken;
        if (token != undefined) {
          const dataObj = {
            name: this.state.userName,
            assigned_to_id:this.state.assignId,
            notes:this.state.userNotes,
            status:this.state.statusId
          };
          result = await AddNewMeisterTask(
            token,
            _self.state.sectionId,
            dataObj
          );
          if (result.status) {
            this.setState({ testStatus: "pass" });
          } else {
            this.setState({ testStatus: "fail" });
          }
        } else {
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
      projectId: this.state.projectId,
      sectionId:this.state.sectionId,
      name: this.state.userName,
      assigned_to_id:this.state.assignId,
      notes:this.state.userNotes,
      status:this.state.statusId
    };

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "Meistertask",
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
                  src={require("assets/img/meistertask.png")}
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
                        You can connect a new Hub Spot account, or choose from
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
                      href={MEISTER_TASK_AUTH_URLS.AUTH_URL.replace(
                        "{CLIENT_ID}",
                        MEISTER_TASK_AUTH_URLS.CLIENT_ID
                      ).replace(
                        "{REDIRECT_URI}",
                        `${window.location.origin.toString()}/user/IntegrationNwebhooks`
                        //`https://master.d1i3h6ck09x8p5.amplifyapp.com/user/IntegrationNwebhooks`
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
                      <div className="FieldConfiguration__label">
                        <span>Project*</span>
                      </div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          options={this.state.projectLists}
                          onChange={(e) => this.handleProjectChange(e)}
                        />
                        {this.state.projectId === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {this.state.isAccountSelected &&
                  this.state.projectId && (
                    <div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Section*</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.sectionLists}
                            onChange={(e) => this.handleSectionChange(e.value)}
                          />
                          {this.state.sectionId === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Name*</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.userName}
                            onChange={(e) =>
                              this.handleUserNameChange(e.target.value)
                            }
                            placeholder=""
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                          {this.state.userName === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Assign To</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.assignToLists}
                            onChange={(e) => this.setState({assignId:e.value})}
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Notes</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <input
                            type="text"
                            value={this.state.userNotes}
                            onChange={(e) =>
                              this.setState({
                                userNotes: e.target.value,
                              })
                            }
                            placeholder=""
                            className="FormTagInput LiveField__input LiveField__input--manualfocus"
                          />
                        </div>
                      </div>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          <span>Status*</span>
                        </div>
                        <div className="FieldConfiguration__value">
                          <Select
                            isClearable={true}
                            options={this.state.statusLists}
                            onChange={(e) => this.handleStatusChange(e.value)}
                          />
                           {this.state.statusId === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
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

export default MeistertaskAuthForm;
