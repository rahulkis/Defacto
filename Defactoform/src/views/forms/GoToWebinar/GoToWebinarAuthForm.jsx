import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { PostData, GetData, Delete } from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  GOTOWEBINAR_AUTH_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {
  CreateRegistrantGoToWebinar,
  CreateWebinarGoToWebinar,
} from "../../../API/IntegrationAPI";
import {
  calculateTime,
  arrayToObj,
  authenticateUser,
} from "../../../util/commonFunction";

class GoToWebinarAuthForm extends React.Component {
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
      headerName: "Create a Registrant",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      webinarList: [],
      fieldsList: [],
      questionsList: [],
      access_token: "",
      isValidated: false,
      goToWebinarCode: "",
      recordingList: [],
      testStatus: "",
      isLoadingFields: false,
      parentLoading: false,
      organizer_key: "",
      account_key: "",
      isPasswordProtected: false,
      isOnDemand: false,
      experienceTypes: [
        { label: "Classic", value: "CLASSIC" },
        { label: "BroadCast", value: "BROADCAST" },
        { label: "Simulive", value: "SIMULIVE" },
      ],
    };
    this.conditionCount = 0;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    this.setState({ headerName: localStorage.Type });

    if (this.props.code !== "") {
      this.setState({
        parentLoading: true,
      });
      let uri = window.location.toString();
      this.getAccessToken();

      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        this.setState({ goToWebinarCode: this.props.code });
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
        APIUrl: "https://api.getgo.com/oauth/v2/token",
        headerValue: authenticateUser(
          GOTOWEBINAR_AUTH_URLS.CLIENT_ID,
          GOTOWEBINAR_AUTH_URLS.CLIENT_SECRET
        ),
        bodyInfo: {
          code: this.props.code,
          grant_type: "authorization_code",
          redirect_uri: `${window.location.origin.toString()}/user/IntegrationNwebhooks`,
        },
      };
      PostData(GOTOWEBINAR_AUTH_URLS.ACCESS_TOKEN_URL, formModel).then(
        (result) => {
          if (result != null) {
            if (result.statusCode === 200) {
              result = JSON.parse(result.res);
              if (result.access_token !== undefined) {
                this.addAuthAccnt(result);
              }
            }
          }
        }
      );
    }
  };

  getAccessTokenFromRefershToken = async (token) => {
    let formModel = {
      APIUrl: "https://api.getgo.com/oauth/v2/token",
      headerValue: authenticateUser(
        GOTOWEBINAR_AUTH_URLS.CLIENT_ID,
        GOTOWEBINAR_AUTH_URLS.CLIENT_SECRET
      ),
      bodyInfo: {
        refresh_token: token,
        grant_type: "refresh_token",
        redirect_uri: `${window.location.origin.toString()}/user/IntegrationNwebhooks`,
      },
    };
    await PostData(GOTOWEBINAR_AUTH_URLS.ACCESS_TOKEN_URL, formModel).then(
      (result) => {
        if (result != null) {
          if (result.statusCode === 200) {
            result = JSON.parse(result.res);
            if (result.access_token !== undefined) {
              this.setState({
                access_token: result.access_token,
                account_key: result.account_key,
                organizer_key: result.organizer_key,
              });

              if (this.state.headerName === "Create a Registrant") {
                this.BindWebinarList(result.access_token, result.account_key);
              } else {
                this.BindRecordingAssetList(
                  result.access_token,
                  result.account_key
                );
              }
            }
          }
        }
      }
    );
  };

  addAuthAccnt = (res) => {
    let formModel = {
      ID: DraftJS.genKey(),
      UserName: res.firstName + " " + res.lastName,
      Type: "GoToWebinar",
      CreatedAt: Date.now(),
      MemberId: res.account_key,
      RefreshToken: res.refresh_token,
      keyType: "refreshToken",
      Email: res.email,
      CreatedBy:this.loginUserId
    };
    this.setState({ selectedAccntID: formModel.ID });
    try {
      PostData(GOOGLEAUTH_URLS.ADD_AUTH_INTEGRATION, formModel).then(
        (result) => {
          this.setState({ access_token: res.access_token });
          this.getAccountList();
        }
      );
    } catch (err) {
      this.setState({
        parentLoading: false,
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
          parentLoading: true,
        });
        let arr = [];
        let googleArr = result.Items.filter(
          (data) => data.Type === "GoToWebinar"
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
          this.getAccessTokenFromRefershToken(arr[0].RefreshToken);
        } else {
          this.setState({
            parentLoading: false,
          });
        }
      } else {
        this.setState({
          parentLoading: false,
        });
      }
    });
  };

  BindWebinarList = async (token, accountKey) => {
    let objectMap = [];
    let fromTime = GOTOWEBINAR_AUTH_URLS.START_DATE;
    let toTime = GOTOWEBINAR_AUTH_URLS.END_DATE;

    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl:
        "https://api.getgo.com/G2W/rest/v2/accounts/" +
        accountKey +
        "/webinars?fromTime=" +
        fromTime +
        "&toTime=" +
        toTime,
    };
    try {
      await PostData(GOTOWEBINAR_AUTH_URLS.GET_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.page.totalElements) {
            objectMap = arrayToObj(result._embedded.webinars, function(item) {
              return { value: item.webinarKey, label: item.subject };
            });
            this.setState({ webinarList: objectMap, parentLoading: false });
          }
        }
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
      this.setState({
        parentLoading: false,
      });
    }
  };

  handleWebinarChange = async (e) => {
    this.setState({ webinarKeyId: e.value });
    let token = this.state.access_token;
    await this.BindCustomFields(token, e.value);
  };

  BindCustomFields = async (token, val) => {
    this.setState({ isLoadingFields: true });
    let objectMap = [];
    let organizerKey = this.state.organizer_key;
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl:
        "https://api.getgo.com/G2W/rest/v2/organizers/" +
        organizerKey +
        "/webinars/" +
        val +
        "/registrants/fields",
    };
    try {
      PostData(GOTOWEBINAR_AUTH_URLS.GET_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          const parsedData = JSON.parse(result.res);
          if (parsedData) {
            let fieldsArray = [];
            let questionArray = [];
            if (parsedData.fields.length > 0) {
              parsedData.fields.forEach((field) => {
                fieldsArray.push(field);
              });
            }
            if (parsedData.questions.length > 0) {
              parsedData.questions.forEach((field) => {
                questionArray.push(field);
              });
            }
            this.setState({
              fieldsList: fieldsArray,
              questionsList: questionArray,
              isLoadingFields: false,
            });
          }
        } else {
          this.setState({
            fieldsList: [],
            questionsList: [],
            isLoadingFields: false,
          });
          alert("Something went wrong. Please try again.");
        }
      });
    } catch (err) {
      console.log(err);
      this.setState({
        fieldsList: [],
        questionsList: [],
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
        GOTOWEBINAR_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
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
  handlerChangeQuestionData(key, event) {
    const newData = {
      ...this.state.QuestionsDataToSubmit,
      [key]: event.target.value,
    };
    this.setState({
      QuestionsDataToSubmit: newData,
    });
  }

  handleAccountChange = async (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    //Bind Refersh token value code
     await this.getAccessTokenFromRefershToken(value.RefreshToken);
  };

  handlePasswordProtectedChange = (e) => {
    this.setState({ isPasswordProtected: e.target.checked });
  };
  handleOnDemandChange = (e) => {
    this.setState({ isOnDemand: e.target.checked });
  };

  BindRecordingAssetList = async (token, accountKey) => {
    let objectMap = [];

    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: "https://api.getgo.com/G2W/rest/v2/recordingassets/search",
      AccountKey: accountKey,
    };
    try {
      await PostData(GOTOWEBINAR_AUTH_URLS.RECORDING_ASSETS, formdata).then(
        (result) => {
          if (result.statusCode === 200) {
            result = JSON.parse(result.res);
            if (result.page.totalElements) {
              objectMap = arrayToObj(result._embedded.recordingAssets, function(
                item
              ) {
                return { value: item.recordingAssetKey, label: item.name };
              });
              this.setState({ recordingList: objectMap, parentLoading: false });
            } else {
              this.setState({ parentLoading: false });
            }
          } else {
            this.setState({ parentLoading: false });
          }
        }
      );
    } catch (err) {
      alert("Something went wrong. Please try again.");
      this.setState({
        parentLoading: false,
      });
    }
  };

  handleUserSubjectChange = async (value) => {
    this.setState({ userSubject: value });
    let _self = this;
    if (_self.state.startTime === "" || _self.state.startTime === undefined) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.endTime === "" ||
      _self.state.endTime === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.userSubject === "" &&
        _self.state.userSubject === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.submitDate === "" ||
      _self.state.submitDate === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleUserStartTimeChange = async (value) => {
    this.setState({ startTime: value });
    let _self = this;
    if (
      _self.state.userSubject === "" ||
      _self.state.userSubject === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.endTime === "" ||
      _self.state.endTime === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.startTime === "" && _self.state.startTime === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.submitDate === "" ||
      _self.state.submitDate === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleUserEndTimeChange = async (value) => {
    this.setState({ endTime: value });
    let _self = this;
    if (
      _self.state.userSubject === "" ||
      _self.state.userSubject === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.startTime === "" ||
      _self.state.startTime === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.endTime === "" && _self.state.endTime === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.submitDate === "" ||
      _self.state.submitDate === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleUserSubmitDateChange = async (value) => {
    this.setState({ submitDate: value });
    let _self = this;
    if (
      _self.state.userSubject === "" ||
      _self.state.userSubject === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.startTime === "" ||
      _self.state.startTime === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.submitDate === "" && _self.state.submitDate === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.endTime === "" ||
      _self.state.endTime === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
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
        let token = this.state.access_token;
        if (token != undefined) {
          if (_self.state.headerName === "Create a Webinar") {
            const dataObj = {
              subject: _self.state.userSubject,
              description: _self.state.userDescription,
              times: [
                {
                  startTime:
                    _self.state.submitDate +
                    "T" +
                    _self.state.startTime +
                    ":00Z",
                  endTime:
                    _self.state.submitDate + "T" + _self.state.endTime + ":00Z",
                },
              ],
              isPasswordProtected: _self.state.isPasswordProtected,
              recordingAssetKey: _self.state.recordingId,
              isOndemand: _self.state.isOnDemand,
              experienceType: _self.state.experienceId,
            };
            result = await CreateWebinarGoToWebinar(
              token,
              _self.state.organizer_key,
              dataObj
            );
            if (result.status) {
              this.setState({ testStatus: "pass" });
            } else {
              this.setState({ testStatus: "fail" });
            }
          } else {
            const dataObj = {
              ..._self.state.fieldsDataToSubmit,
              responses:
                _self.state.QuestionsDataToSubmit === undefined
                  ? []
                  : _self.state.QuestionsDataToSubmit,
            };

            result = await CreateRegistrantGoToWebinar(
              token,
              _self.state.organizer_key,
              _self.state.webinarKeyId,
              _self.state.fieldsDataToSubmit
            );
            if (result.status) {
              this.setState({ testStatus: "pass" });
            } else {
              this.setState({ testStatus: "fail" });
            }
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
    let goToWebinarSetupData = {};
    if (this.state.headerName === "Create a Webinar") {
      const dataObj = {
        subject: this.state.userSubject,
        description: this.state.userDescription,
        times: [
          {
            startTime:
              this.state.submitDate + "T" + this.state.startTime + ":00Z",
            endTime: this.state.submitDate + "T" + this.state.endTime + ":00Z",
          },
        ],
        isPasswordProtected: this.state.isPasswordProtected,
        recordingAssetKey: this.state.recordingId,
        isOndemand: this.state.isOnDemand,
        experienceType: this.state.experienceId,
      };

      goToWebinarSetupData = {
        organizer_key: this.state.organizer_key,
        account_key: this.state.account_key,
        webinarKeyId: this.state.webinarKeyId,
        CustomFields: dataObj,
      };
    } else {
      const dataObj = {
        ...this.state.fieldsDataToSubmit,
        responses:
          this.state.QuestionsDataToSubmit === undefined
            ? []
            : this.state.QuestionsDataToSubmit,
      };

      goToWebinarSetupData = {
        organizer_key: this.state.organizer_key,
        account_key: this.state.account_key,
        webinarKeyId: this.state.webinarKeyId,
        CustomFields: dataObj,
      };
    }

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "GoToWebinar",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(goToWebinarSetupData),
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
                  src={require("assets/img/gotowebinar.jpg")}
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
                      href={GOTOWEBINAR_AUTH_URLS.AUTH_URL.replace(
                        "{CLIENT_ID}",
                        GOTOWEBINAR_AUTH_URLS.CLIENT_ID
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
                {this.state.parentLoading && this.state.isAccountSelected && (
                  <div style={{ paddingTop: "18px", textAlign: "center" }}>
                    <div className="FieldConfigurationField">
                      <h4>Loading...</h4>
                    </div>
                  </div>
                )}

                {this.state.headerName === "Create a Registrant" && (
                  <div>
                    {this.state.isAccountSelected && !this.state.parentLoading && (
                      <div>
                        <br />
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Webinar*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.webinarList}
                              onChange={(e) => this.handleWebinarChange(e)}
                            />
                            {this.state.webinarKeyId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {this.state.isAccountSelected && this.state.webinarKeyId && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Fields</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__subfields">
                              {this.state.isLoadingFields && (
                                <div
                                  style={{
                                    paddingTop: "18px",
                                    textAlign: "center",
                                  }}
                                >
                                  <div className="FieldConfigurationField">
                                    <h4>Loading...</h4>
                                  </div>
                                </div>
                              )}

                              {!this.state.isLoadingFields &&
                                this.state.fieldsList.map((field, index) => {
                                  return (
                                    <div
                                      className="FieldConfigurationField "
                                      key={"customField_" + index}
                                    >
                                      <div className="FieldConfiguration__label">
                                        {(field.field + " ")
                                          .charAt(0)
                                          .toUpperCase() +
                                          field.field.slice(1)}{" "}
                                        {"*"}
                                      </div>
                                      <div className="FieldConfiguration__value">
                                        <input
                                          type="text"
                                          onChange={(value) =>
                                            this.handlerChangeFieldData(
                                              field.field,
                                              value
                                            )
                                          }
                                          className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                        />
                                        {this.state[field.field] === "" && (
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
                    )}
                    {this.state.isAccountSelected && this.state.webinarKeyId && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Questions</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__subfields">
                              {this.state.isLoadingFields && (
                                <div
                                  style={{
                                    paddingTop: "18px",
                                    textAlign: "center",
                                  }}
                                >
                                  <div className="FieldConfigurationField">
                                    <h4>Loading...</h4>
                                  </div>
                                </div>
                              )}

                              {!this.state.isLoadingFields &&
                                this.state.questionsList.length === 0 && (
                                  <div
                                    style={{
                                      paddingTop: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div className="FieldConfigurationField">
                                      <h4>No Questions Available</h4>
                                    </div>
                                  </div>
                                )}
                              {!this.state.isLoadingFields &&
                                this.state.questionsList.length > 0 &&
                                this.state.questionsList.map((field, index) => {
                                  return (
                                    <div
                                      className="FieldConfigurationField "
                                      key={"customField_" + index}
                                    >
                                      <div className="FieldConfiguration__label">
                                        {field.question}
                                      </div>
                                      <div className="FieldConfiguration__value">
                                        <input
                                          type="text"
                                          onChange={(value) =>
                                            this.handlerChangeQuestionData(
                                              field.questionKey,
                                              value
                                            )
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
                    )}
                  </div>
                )}

                {this.state.headerName === "Create a Webinar" && (
                  <div>
                    <br />
                    {this.state.isAccountSelected && !this.state.parentLoading && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Subject*
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.userSubject}
                              placeholder=""
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                              onChange={(e) =>
                                this.handleUserSubjectChange(e.target.value)
                              }
                            />
                          </div>
                          {this.state.userSubject === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Description
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.userDescription}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  userDescription: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Start Time*
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.startTime}
                              placeholder="15:03"
                              onChange={(e) =>
                                this.handleUserStartTimeChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                          {this.state.startTime === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            End Time*
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.endTime}
                              placeholder="15:03"
                              onChange={(e) =>
                                this.handleUserEndTimeChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                          {this.state.endTime === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">Date*</div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.submitDate}
                              placeholder="2021-12-01"
                              onChange={(e) =>
                                this.handleUserSubmitDateChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                          {this.state.submitDate === "" && (
                            <div className="FieldConfigurationField__error">
                              This field is required
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            marginBottom: "30px",
                            marginTop: "30px",
                          }}
                        >
                          <div className="FieldConfiguration__label">
                            Password Protected{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isPasswordProtected}
                              onChange={(e) =>
                                this.handlePasswordProtectedChange(e)
                              }
                              value="requiredQuestion"
                              color="primary"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Recording Asset</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.recordingList}
                              onChange={(e) =>
                                this.setState({ recordingId: e.value })
                              }
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            marginBottom: "30px",
                            marginTop: "30px",
                          }}
                        >
                          <div className="FieldConfiguration__label">
                            Is On Demand{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isOnDemand}
                              onChange={(e) => this.handleOnDemandChange(e)}
                              value="requiredQuestion"
                              color="primary"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Experience Type</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.experienceTypes}
                              onChange={(e) =>
                                this.setState({ experienceId: e.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
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

export default GoToWebinarAuthForm;
