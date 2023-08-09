import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import {
  PostData,
  GetData,
  Delete,
  PostDataWithHeaderWithoutJson,
} from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  DROPBOX_AUTH_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {} from "../../../API/IntegrationAPI";
import { Dropbox } from "dropbox";
import {
  calculateTime,
  authenticateUser,
  arrayToObj,
} from "../../../util/commonFunction";

class DropBoxAuthForm extends React.Component {
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
      headerName: "Upload files",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      folderlist: [],
      filelist: [],
      isValidated: false,
      accessToken: "",
      taskNotes: "",
      campaignMonitorCode: "",
      subscriberList: [],
      fieldsList: [],
      testStatus: "",
      selectedFolderToUpload: "",
      selectedFileObject: "",
      fileNamePrefix: "",
      isLoadingFields: false,
      fieldsDataToSubmit: [],
    };
    this.conditionCount = 0;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    if (this.props.code !== "") {
      let uri = window.location.toString();
      this.getAccessToken();

      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        this.setState({ campaignMonitorCode: this.props.code });
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
      const headersData = {
        Authorization: authenticateUser(
          DROPBOX_AUTH_URLS.CLIENT_ID,
          DROPBOX_AUTH_URLS.CLIENT_SECRET
        ),
      };
      const bodyFormData = new FormData();
      bodyFormData.append("code", this.props.code);
      bodyFormData.append(
        "redirect_uri",
        `${window.location.origin.toString()}/user/IntegrationNwebhooks`
      );
      bodyFormData.append("grant_type", "authorization_code");

      PostDataWithHeaderWithoutJson(
        DROPBOX_AUTH_URLS.ACCESS_TOKEN_URL,
        headersData,
        bodyFormData
      ).then((result) => {
        if (result != null) {
          if (result.access_token !== undefined) {
            this.get_accountInfo(result.access_token, result.account_id);
            this.setState({ accessToken: result.access_token });
          }
        }
      });
    }
  };

  get_accountInfo = async (token, uniqueId) => {
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: "  https://api.dropboxapi.com/2/users/get_account",
      bodyInfo: {
        account_id: uniqueId,
      },
    };
    try {
      await PostData(DROPBOX_AUTH_URLS.POST_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          this.addAuthAccnt(result.res, token);
        }
      });
    } catch (err) {}
  };

  addAuthAccnt = (res, access_token) => {
    let formModel = {
      ID: DraftJS.genKey(),
      UserName: res.name.display_name,
      Type: "DropBox",
      CreatedAt: Date.now(),
      MemberId: res.account_id,
      RefreshToken: access_token,
      Email: res.email,
      TeamName: res.team_member_id,
      KeyType:"accessToken",
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
        let googleArr = result.Items.filter((data) => data.Type === "DropBox");
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            ...googleArr[i],
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

          // Get Folder List and File list
          // Refersh token is acesss token in dropbox
          this.setState({ accessToken: arr[0].RefreshToken });
          this.BindDropDownList(arr[0].RefreshToken);
        }
      }
    });
  };

  BindDropDownList = async (token) => {
    let formdata = {
      headerValue: "Bearer " + token,
      APIUrl: "https://api.dropboxapi.com/2/files/list_folder",
      bodyInfo: {
        path: "",
      },
    };
    try {
      await PostData(DROPBOX_AUTH_URLS.POST_API, formdata).then((result) => {
        if (result.statusCode === 200) {
          let folderResult;
          let fileResult;
          if (result.res.entries.length > 0) {
            let tagCol = ".tag";
            folderResult = result.res.entries.filter(
              (p) => p[tagCol] === "folder"
            );
            fileResult = result.res.entries.filter((p) => p[tagCol] === "file");

            if (folderResult.length > 0) {
              folderResult = arrayToObj(folderResult, function(item) {
                return { ...item, value: item.id, label: item.name };
              });
              this.setState({ folderlist: folderResult });
            }
            if (fileResult.length > 0) {
              fileResult = arrayToObj(fileResult, function(item) {
                return { value: item.id, label: item.name };
              });
              this.setState({ filelist: fileResult });
            }
          }
        }
      });
    } catch (err) {}
  };

  handleFolderChange = async (e) => {
    this.setState({
      selectedFolderToUpload: e,
    });
  };

  handleFileChange = (e) => {
    const fileObject = e.target.files[0];

    this.setState({
      selectedFileObject: fileObject,
    });
  };

  handleFileNameChange = (e) => {
    const fileName = e.target.value;
    this.setState({
      fileNamePrefix: fileName,
    });
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
        DROPBOX_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
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

  handleAccountChange = async (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
    });
    //Bind data with refreshToken/userToken
    await this.BindDropDownList(value.refershToken);
  };

  sendTest = async () => {
    var _self = this;
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }

    if (
      this.state.selectedFileObject === "" &&
      this.state.selectedFolderToUpload === ""
    ) {
      window.alert("Please answer all required fields");
      return false;
    } else {
      const splitFile = this.state.selectedFileObject.name.split(".");
      const fileExtension = splitFile[splitFile.length - 1];
      const fileCommitArgs = {
        contents: this.state.selectedFileObject,
        path: this.state.fileNamePrefix
          ? this.state.selectedFolderToUpload.path_lower +
            "/" +
            this.state.fileNamePrefix +
            "." +
            fileExtension
          : this.state.selectedFolderToUpload.path_lower +
            "/" +
            this.state.selectedFileObject.name,
        mode: "add",
        // autorename: true,
        mute: false,
        strict_conflict: false,
      };
      try {
        var dbx = new Dropbox({ accessToken: this.state.accessToken });
        dbx
          .filesUpload(fileCommitArgs)
          .then((res) => {
            console.log(res);
            this.setState({
              testSuccessData: res,
              testStatus: "pass",
            });
          })
          .catch((err) => {
            console.log(err);
            this.setState({ testStatus: "fail" });
          });
      } catch (err) {
        console.log(err);
        this.setState({ testStatus: "fail" });
      }
    }
  };
  finishSetUp = () => {
    if (
      this.state.selectedFileObject === "" &&
      this.state.selectedFolderToUpload === ""
    ) {
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

    let dropBoxSetupData = {};

    dropBoxSetupData = {
      email_address: this.state.selectedAccntValue.Email,
      userName: this.state.selectedAccntValue.UserName,
      folderPath: this.state.selectedFolderToUpload.path_lower,
      fileName: this.state.testSuccessData
        ? this.state.testSuccessData.name
        : this.state.selectedFileObject.name,
      filePath: this.state.testSuccessData
        ? this.state.testSuccessData.path_lower
        : this.state.selectedFolderToUpload.path_lower +
          "/" +
          this.state.selectedFileObject.name,
    };

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "DropBox",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(dropBoxSetupData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.selectedAccntValue.RefreshToken,
      IsConditionalLogic: this.state.conditionalLogic,
      Conditions: JSON.stringify(this.state.conditions),
    };

    try {
      PostData(INTEGRATIONS_URLS.POST_INTEGRATION_FINISH_SETUP, formModel).then(
        (result) => {
          this.closeForm();
        }
      );
    } catch (err) {
      console.log(err);
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
                  src={require("assets/img/dropbox.png")}
                  height="32"
                  style={{ marginRight: "9px", verticalAlign: "middle" }}
                />
                <input
                  placeholder="What do you want to call this action?"
                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                  value={this.state.headerName}
                  onChange={(e) => console.log(e.target.value)}
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
                      href={DROPBOX_AUTH_URLS.AUTH_URL.replace(
                        "{CLIENT_ID}",
                        DROPBOX_AUTH_URLS.CLIENT_ID
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
                {this.state.isAccountSelected && (
                  <div>
                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        Choose the folder you would like to upload to*
                      </div>
                      <div className="FieldConfiguration__value">
                        <Select
                          isClearable={true}
                          options={this.state.folderlist}
                          onChange={(e) => this.handleFolderChange(e)}
                        />
                        {this.state.folderId === "" && (
                          <div className="FieldConfigurationField__error">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    {this.state.selectedFolderToUpload !== "" && (
                      <div>
                        <div className="FieldConfigurationField">
                          <div className="FieldConfiguration__label">
                            Choose files you'd like to upload*
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="file"
                              onChange={(e) => this.handleFileChange(e)}
                              name="uploadFile"
                            />
                            {this.state.fileId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Filename Prefix
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
                                  Prefix the uploaded filename, e.g. with the
                                  submission ID
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.fileNamePrefix || ""}
                              onChange={(e) => this.handleFileNameChange(e)}
                              placeholder=""
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: "36px" }}>
                  <div className="FieldConfigurationField ">
                    {this.state.selectedFileObject !== "" &&
                      this.state.selectedFolderToUpload !== "" && (
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DropBoxAuthForm;
