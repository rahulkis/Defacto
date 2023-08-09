import React from "react";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import {
  PostDataIntegation,
  PostData,
  GetData,
  Delete,
} from "../../../stores/requests";
import { DraftJS } from "megadraft";
import { calculateTime } from "../../../util/commonFunction";
import {
  FORM_URLS,
  GOOGLEAUTH_URLS,
  INTERCOM_URLS,
  INTEGRATIONS_URLS,
} from "../../../util/constants";

const options = [
  {
    value: "Create a User",
    label: "Create a User",
  },
  { value: "Create a Lead", label: "Create a Lead" },
  {
    value: "Do Nothing",
    label: "Do Nothing",
  },
];
export default class InterComAuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      headerName: "Add Subscriber",
      selectedAccntID: "",
      isAccountSelected: false,
      isValidated: false,
      conditions: [],
      customFields: [],
      tags: "",
      tagUrl: "",
      userId: "",
      userRole: "",
      companyId: "",
      otherOptions: "",
      formSubmitted: false,
      testStatus: "",
      Email: "",
      name: "",
      phone: "",
      company: "",
      customValue: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      access_token:""
    };
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }

  componentWillMount() {
    this.setState({ headerName: localStorage.Type });    

    if (this.props.code !== "") {
      let uri = window.location.toString();
      this.getAccessToken();
      if (uri.indexOf("?") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
        this.setState({ asanaCode: this.props.code });
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
      const bodyFormData = new FormData();
      bodyFormData.append("client_id", INTERCOM_URLS.CLIENT_ID);
      bodyFormData.append("client_secret", INTERCOM_URLS.CLIENT_SECRET);
      bodyFormData.append("code", decodeURIComponent(this.props.code));

      PostDataIntegation(INTERCOM_URLS.ACCESS_TOKEN_URL, bodyFormData).then(
        (result) => {
          if (result != null) {
            if (result.access_token !== undefined) {
              this.setState({access_token:result.access_token});
              let formModel = {
                headerValue: "Bearer " + result.access_token,
                APIUrl: INTEGRATIONS_URLS.BASE_URL +  "me",
              };

              PostData(
                INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL,
                formModel
              ).then((result1) => {
                let data = JSON.parse(result1.res);

                this.addAuthAccnt(data, result.access_token);
              });
            }
          }
        }
      );
    }
  };
  addAuthAccnt = (res, token) => {
    let formModel = {
      ID: DraftJS.genKey(),
      Email: res.email,
      UserName: res.name,
      TeamName: res.app.name,
      MemberId: res.id,
      Type: "Intercom",
      RefreshToken: token,
      CreatedAt: Date.now(),
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
      //console.log(FORM_URLS.POST_FORM, err);
    }
  };

  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        let arr = [];
        let googleArr = result.Items.filter((data) => data.Type === "Intercom");
        for (let i = 0; i < googleArr.length; i++) {
          arr.push({
            label:
              googleArr[i].TeamName +
              "-" +
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
        this.setState({ accountsList: arr  });
        if (googleArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
            access_token : arr[0].RefreshToken
          });
        }
        // bind custom fields
        this.handleCustomFields();
      }
    });
  };

  handleCustomFields = (e) => {
    debugger;
    let customFields = [];
    let token=this.state.access_token;

    let formModel = {
      headerValue: "Bearer "+ token,
      APIUrl: INTERCOM_URLS.BASE_URL + "data_attributes?model=contact",
    };

    PostData(INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL, formModel).then(
      (result1) => {
        let object;
        let data = JSON.parse(result1.res);

        let data1 = data.data;

        if (
          localStorage.Type === "Create or Update User" ||
          localStorage.Type === "Create or Update a Lead"
        ) {
          for (let i = 0; i < data1.length; i++) {
            if (data1[i].custom === true) {
              object = data1[i].label;
            }
          }

          let storeObject = object;
          if (storeObject) {
            object = { label: storeObject, value: "" };
            customFields.push(object);

            this.setState({
              customFields: customFields,
            });
          }
        } else if (
          localStorage.Type === "Manage People Tags" ||
          localStorage.Type === "Manage Company Tags"
        ) {
          let formModel = {
            headerValue: "Bearer " + token,
            APIUrl: INTERCOM_URLS.BASE_URL + "tags",
          };
          PostData(INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL, formModel).then(
            (result) => {
              let resultData = JSON.parse(result.res);
              resultData = resultData.data;
              for (let j = 0; j < resultData.length; j++) {
                object = {
                  label: resultData[j].name,
                  value: resultData[j].id,
                };
                customFields.push(object);
              }
              this.setState({ tagsList: customFields });
            }
          );
        }
      }
    );
  };
  handleNoPersonMatch = async () => {
    let checkSelectedOption = this.state.otherOptions;
    if (checkSelectedOption.value === "Create a User") {
      await this.createUser();
    } else if (checkSelectedOption.value === "Create a Lead") {
      await this.createLead();
    } else if (checkSelectedOption.value === "Create a Company") {
      await this.handleCreateCompany();
    }
  };
  handleAddTags = (e) => {
    this.handleNoPersonMatch();
    let token = this.state.access_token;
    let formModel = {
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL +  "contacts",
    };
    PostData(INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL, formModel).then(
      (result1) => {
        let data = JSON.parse(result1.res);
        let data1 = data.data;
        let googleArr = data1.filter((data) => data.email === this.state.Email);
        if (googleArr.length > 0 || this.state.tagUrl) {
          let getUrl;
          if (this.state.tagUrl) {
            getUrl = this.state.tagUrl;
          } else if (googleArr.length > 0) {
            googleArr = googleArr[0].tags;
            getUrl = googleArr.url;
          }

          let selectedOption = this.state.tags;
          if (selectedOption) {
            selectedOption = selectedOption[0].value;
          }
          let tagformModel;
          if (this.state.selectedTagType === "addTag") {
            tagformModel = {
              APIType: "POST",
              headerValue: `Bearer ${token}`,
              APIUrl: INTERCOM_URLS.BASE_URL +`${getUrl}`,
              bodyInfo: {
                id: selectedOption,
              },
            };
          } else if (this.state.selectedTagType === "removeTag") {
            tagformModel = {
              APIType: "DELETE",
              headerValue: `Bearer ${token}`,
              APIUrl: INTERCOM_URLS.BASE_URL + `${getUrl}/${selectedOption}`,
              bodyInfo: {},
            };
          }

          PostData(INTERCOM_URLS.POST_INTERCOM_API, tagformModel).then(
            (result) => {
              if (
                (result.statusCode === 200 &&
                  result.res.type !== "error.list") ||
                this.state.userId
              ) {
                this.setState({ testStatus: "pass" });
              } else {
                this.setState({ testStatus: "fail" });
              }
            }
          );
        } else {
          this.setState({ testStatus: "fail" });
        }
      }
    );
  };
  handleManageCompanyTags = () => {
    this.handleNoPersonMatch();
    let token = this.state.access_token;
    let formModel = {
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL + "companies",
    };
    PostData(INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL, formModel).then(
      (result1) => {
        let data = JSON.parse(result1.res);
        let data1 = data.data;
        let googleArr = data1.filter(
          (data) => data.name === this.state.company
        );
        if (googleArr.length > 0 || this.state.companyId) {
          let companyId = googleArr[0].id;
          let selectedOption = this.state.tags;
          if (selectedOption) {
            selectedOption = selectedOption[0].label;
          }
          let companyFormModel;
          if (this.state.selectedTagType === "addTag") {
            companyFormModel = {
              APIType: "POST",
              headerValue: `Bearer ${token}`,
              APIUrl: INTERCOM_URLS.BASE_URL + "tags",
              bodyInfo: {
                name: selectedOption,
                companies: [
                  {
                    id: companyId,
                  },
                ],
              },
            };
          } else if (this.state.selectedTagType === "removeTag") {
            companyFormModel = {
              APIType: "POST",
              headerValue: `Bearer ${token}`,
              APIUrl: INTERCOM_URLS.BASE_URL + "tags",
              bodyInfo: {
                name: selectedOption,
                companies: [
                  {
                    id: companyId,
                    untag: true,
                  },
                ],
              },
            };
          }
          PostData(INTERCOM_URLS.POST_INTERCOM_API, companyFormModel).then(
            (result1) => {
              if (
                (result1.statusCode === 200 &&
                  result1.res.type !== "error.list") ||
                this.state.companyId
              ) {
                this.setState({ testStatus: "pass" });
              } else {
                this.setState({ testStatus: "fail" });
              }
            }
          );
        }
      }
    );
  };
  handleSendIncomingMessage = () => {
    this.handleNoPersonMatch();
    let token = this.state.access_token
    let formModel = {
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL + "contacts",
    };
    PostData(INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL, formModel).then(
      (result1) => {
        let data = JSON.parse(result1.res);
        let data1 = data.data;
        let googleArr = data1.filter((data) => data.email === this.state.Email);
        if (googleArr.length > 0 || this.state.userId) {
          let getUserId;
          let getRole;
          if (this.state.userId) {
            getUserId = this.state.userId;
            getRole = this.state.userRole;
          } else if (googleArr.length > 0) {
            getUserId = googleArr[0].id;
            getRole = googleArr[0].role;
          }
          let formModel = {
            headerValue: `Bearer ${token}`,
            APIUrl: INTERCOM_URLS.BASE_URL + "conversations",
            bodyInfo: {
              from: {
                type: getRole,
                id: getUserId,
              },
              body: this.state.company,
            },
          };
          PostData(INTERCOM_URLS.POST_INTERCOM_API, formModel).then(
            (result) => {
              if (
                result.statusCode === 200 &&
                result.res.type !== "error.list"
              ) {
                this.setState({ testStatus: "pass" });
              } else {
                this.setState({ testStatus: "fail" });
              }
            }
          );
        }
      }
    );
  };
  handleAddEvent = () => {
    this.handleNoPersonMatch();
    let token = this.state.access_token;
    let formModel = {
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL + "contacts",
    };
    PostData(INTERCOM_URLS.GET_INTERCOM_ACCOUNT_DETAIL, formModel).then(
      (result1) => {
        let data = JSON.parse(result1.res);
        let data1 = data.data;
        let googleArr = data1.filter((data) => data.email === this.state.Email);
        if (googleArr.length > 0 || this.state.userId) {
          let formModel = {
            headerValue: `Bearer ${token}`,
            APIUrl: INTERCOM_URLS.BASE_URL +"conversations",
            bodyInfo: {
              event_name: this.state.company,
              created_at: Date.now(),
              email: this.state.Email,
            },
          };
          PostData(INTERCOM_URLS.POST_INTERCOM_API, formModel).then(
            (result) => {
              if (
                result.statusCode === 200 &&
                result.res.type !== "error.list"
              ) {
                this.setState({ testStatus: "pass" });
              } else {
                this.setState({ testStatus: "fail" });
              }
            }
          );
        } else {
          this.setState({ testStatus: "fail" });
        }
      }
    );
  };
  handleEmailAddressChange = (value) => {
    this.setState({ Email: value });
    const isValidEmail = new RegExp(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
    ).test(this.state.Email);
    if (value === "" && !isValidEmail) {
      this.setState({ isValidated: false });
    } else {
      this.setState({ isValidated: true });
    }
  };
  
  
  handleCompanyChange = (e) => {
    this.setState({ company: e.target.value });
  };
  handleInputChange = (e) => {
    this.setState({ customValue: e.target.value });
  };
  tagHandler = (tagType, value) => {
    this.setState({
      tags: value,
      isAccountSelected: true,
      selectedTagType: tagType,
    });
  };
  tagNoPersonMatchHandler = (value) => {
    this.setState({ otherOptions: value });
  };
  createUser = async () => {
    let token = this.state.access_token;
    let formModel = {
      APIType: "POST",
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL +"contacts",
      bodyInfo: {
        role: "user",
        email: this.state.Email,
        name: this.state.name,
        phone: this.state.phone,
        custom_attributes: {
          job_title: this.state.customValue,
        },
      },
    };

    await PostData(INTERCOM_URLS.POST_INTERCOM_API, formModel).then(
      (result) => {
        if (result.statusCode === 200 && result.res.type !== "error.list") {
          this.setState({
            tagUrl: result.res.tags.url,
            userId: result.res.id,
            userRole: result.res.role,
          });

          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      }
    );
  };
  createLead = async () => {
    let token = this.state.access_token;
    let formModel = {
      APIType: "POST",
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL +"contacts",
      bodyInfo: {
        role: "lead",
        email: this.state.Email,
        name: this.state.name,
        phone: this.state.phone,
        custom_attributes: {
          job_title: this.state.customValue,
        },
      },
    };

    await PostData(INTERCOM_URLS.POST_INTERCOM_API, formModel).then(
      (result) => {
        if (result.statusCode === 200 && result.res.type !== "error.list") {
          this.setState({
            tagUrl: result.res.tags.url,
            userId: result.res.id,
            userRole: result.res.role,
          });
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      }
    );
  };
  handleCreateCompany = async (e) => {
    let token = this.state.access_token;
    let formModel = {
      APIType: "POST",
      headerValue: `Bearer ${token}`,
      APIUrl: INTERCOM_URLS.BASE_URL + "companies",
      bodyInfo: {
        name: this.state.company,
        company_id: DraftJS.genKey(),
      },
    };
    await PostData(INTERCOM_URLS.POST_INTERCOM_API, formModel).then(
      (result) => {
        if (result.statusCode === 200 && result.res.type !== "error.list") {
          this.setState({ companyId: result.res.id });
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      }
    );
  };
  handleSendTest = async () => {
    let token = this.state.access_token;
    if (!this.state.formSubmitted) {
      this.setState({ testStatus: "fail" });
      return false;
    }

    if (this.state.headerName === "Create or Update User") {
      await this.createUser();
      await this.handleCreateCompany();
      let formModel = {
        APIType: "POST",
        headerValue: `Bearer ${token}`,
        APIUrl: INTERCOM_URLS.BASE_URL + `contacts/${
          this.state.userId
        }/companies`,
        bodyInfo: {
          id: this.state.companyId,
        },
      };
      PostData(INTERCOM_URLS.POST_INTERCOM_API, formModel).then((result) => {
        if (result.statusCode === 200 && result.res.type !== "error.list") {
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail" });
        }
      });
    } else if (this.state.headerName === "Create or Update a Lead") {
      this.createLead();
    } else if (this.state.headerName === "Manage People Tags") {
      if (!this.state.tags && this.state.otherOptions === "Creat a User") {
        this.createUser();
      } else if (
        !this.state.tags &&
        this.state.otherOptions === "Create a Lead"
      ) {
        this.createLead();
      } else if (this.state.otherOptions === "do Nothing") {
        return;
      } else {
        this.handleAddTags();
      }
    } else if (this.state.headerName === "Manage Company Tags") {
      if (!this.state.tags && this.state.otherOptions === "Create a Company") {
        this.handleCreateCompany();
      } else if (this.state.otherOptions === "do Nothing") {
        return;
      } else {
        this.handleManageCompanyTags();
      }
    } else if (this.state.headerName === "Send Incoming Message") {
      this.handleSendIncomingMessage();
    } else if (this.state.headerName === "Add Event to Person") {
      this.handleAddEvent();
    }
  };
  handleAccountChange = async (value) => {
    this.setState({
      selectedAccntValue: value,
      selectedAccntID: value.IntgrationAccntID,
      isAccountSelected: true,
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
  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };
  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );

    if (confirm) {
      Delete(INTERCOM_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID).then(
        (result) => {
          // console.log("removeAccount result:", result);
          this.setState({
            selectedAccntValue: "",
            selectedAccntID: "",
            isAccountSelected: false,
          });
        }
      );
    }
  };
  finishSetUp = () => {
    let intercomSetUpData = {};
    if (
      this.state.headerName === "Create or Update User" ||
      this.state.headerName === "Create or Update a Lead"
    ) {
      intercomSetUpData = {
        email: this.state.Email,
        name: this.state.name,
        phone: this.state.phone,
        company: this.state.company,
        job_title: this.state.customValue,
      };
    } else if (
      this.state.headerName === "Manage People Tags" ||
      this.state.headerName === "Manage Company Tags"
    ) {
      intercomSetUpData = {
        email: this.state.Email,
        tag: this.state.tags,
        selectedTagType: this.state.selectedTagType,
        noPersonMatch: this.state.otherOptions,
      };
    } else if (
      this.state.headerName === "Send Incoming Message" ||
      this.state.headerName === "Add Event to Person"
    ) {
      intercomSetUpData = {
        email: this.state.Email,
        Message: this.state.company,
        noPersonMatch: this.state.otherOptions,
      };
    }

    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      FormId: localStorage.CurrentFormId,
      IntegrationType: "Intercom",
      SetUpData: JSON.stringify(intercomSetUpData),
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
    } catch (err) {
    }
  };
  render() {
    return (
      <div>
        <div className="XKLhmDNloVln61ip64E7e" style={{ padding: "0px" }}>
          <div className="ZtOZviTTkcmz3-DO_OzgS">
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
                        src={require("assets/img/Intercom_Logo_Mark_Color.png")}
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
                        tabIndex="-1"
                        onClick={(e) => this.closeForm()}
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
                              You can connect a new Mailshake account, or choose
                              from the list of previously connected accounts.
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
                            href={INTERCOM_URLS.AUTH_URL.replace(
                              "{CLIENT_ID}",
                              INTERCOM_URLS.CLIENT_ID
                            ).replace(
                              "{REDIRECT_URI}",
                              `${window.location.origin.toString()}/user/IntegrationNwebhooks`
                            )}
                          >
                            <div
                              className="BtnV2 BtnV2--secondary"
                              tabIndex="-1"
                            >
                              <span>Add Account +</span>
                            </div>
                          </a>
                        </div>
                      </div>
                      {this.state.isAccountSelected &&
                        (this.state.headerName === "Create or Update User" ||
                          this.state.headerName ===
                            "Create or Update a Lead") && (
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
                                      If the contact doesn't exist for this
                                      email, we'll create it for you.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="FieldConfiguration__value">
                                <input
                                  type="text"
                                  defaultValue={this.state.Email}
                                  onChange={(e) =>
                                    this.handleEmailAddressChange(
                                      e.target.value
                                    )
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
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Full Name
                              </div>
                              <div className="FieldConfiguration__value">
                                <input
                                  type="text"
                                  defaultValue={this.state.name}
                                  onChange={(e) => this.setState({ name: e.target.value })}
                                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                />
                              </div>
                            </div>
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Phone
                              </div>
                              <div className="FieldConfiguration__value">
                                <input
                                  type="text"
                                  defaultValue={this.state.phone}
                                  onChange={(e) => this.setState({ phone: e.target.value })}
                                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                />
                              </div>
                            </div>
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Company
                              </div>
                              <div className="FieldConfiguration__value">
                                <input
                                  type="text"
                                  defaultValue={this.state.company}
                                  onChange={(e) => this.setState({ company: e.target.value })}
                                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                />
                              </div>
                            </div>
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                <span>Custom Fields</span>
                              </div>
                              {this.state.customFields.length === 0 && (
                                <div className="FieldConfiguration__value">
                                  <div className="FieldConfigurationField__subfields">
                                    <div> No Custom Fields Available</div>
                                  </div>
                                </div>
                              )}
                              {this.state.customFields.length !== 0 && (
                                <div className="FieldConfiguration__value">
                                  <div className="FieldConfigurationField__subfields">
                                    {this.state.customFields.map(
                                      (temp, key) => (
                                        <div className="FieldConfigurationField ">
                                          <div className="FieldConfiguration__label">
                                            {temp.label}
                                          </div>
                                          <div className="FieldConfiguration__value">
                                            <input
                                              type="text"
                                              defaultValue={
                                                this.state.customValue
                                              }
                                              onChange={this.handleInputChange}
                                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                    {/* //</div> */}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      {this.state.isAccountSelected &&
                        (this.state.headerName === "Manage People Tags" ||
                          this.state.headerName === "Manage Company Tags") && (
                          <div>
                            {this.state.headerName === "Manage People Tags" && (
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
                                        If the contact doesn't exist for this
                                        email, we'll create it for you.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    type="text"
                                    defaultValue={this.state.Email}
                                    onChange={(e) =>
                                      this.handleEmailAddressChange(
                                        e.target.value
                                      )
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
                            )}
                            {this.state.headerName ===
                              "Manage Company Tags" && (
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  Name*
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    type="text"
                                    defaultValue={this.state.company}
                                    onChange={this.handleCompanyChange}
                                    className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Add Tags{" "}
                              </div>
                              <div className="FieldConfiguration__value">
                                <Select
                                  isMulti
                                  options={this.state.tagsList}
                                  defaultValue={this.state.tags}
                                  onChange={(value) =>
                                    this.tagHandler("addTag", value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Remove Tags{" "}
                              </div>
                              <div className="FieldConfiguration__value">
                                <Select
                                  isMulti
                                  options={this.state.tagsList}
                                  defaultValue={this.state.tags}
                                  onChange={(value) =>
                                    this.tagHandler("removeTag", value)
                                  }
                                />
                              </div>
                            </div>
                            {this.state.headerName === "Manage People Tags" && (
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  If No Matching Person{" "}
                                </div>
                                <div className="FieldConfiguration__value">
                                  <Select
                                    options={options}
                                    defaultValue={this.state.otherOptions}
                                    onChange={(value) =>
                                      this.tagNoPersonMatchHandler(value)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {this.state.headerName ===
                              "Manage Company Tags" && (
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  If No Matching Company{" "}
                                </div>
                                <div className="FieldConfiguration__value">
                                  <Select
                                    options={[
                                      {
                                        label: "Create a Company",
                                        value: "Create a Company",
                                      },
                                      {
                                        label: "do Nothing",
                                        value: "do Nothing",
                                      },
                                    ]}
                                    defaultValue={this.state.tags}
                                    onChange={(value) =>
                                      this.tagNoPersonMatchHandler(value)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      {this.state.isAccountSelected &&
                        (this.state.headerName === "Send Incoming Message" ||
                          this.state.headerName === "Add Event to Person") && (
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
                                      If the contact doesn't exist for this
                                      email, we'll create it for you.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="FieldConfiguration__value">
                                <input
                                  type="text"
                                  defaultValue={this.state.Email}
                                  onChange={(e) =>
                                    this.handleEmailAddressChange(
                                      e.target.value
                                    )
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
                            {this.state.headerName ===
                              "Send Incoming Message" && (
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  Message
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    type="text"
                                    value={this.state.company}
                                    onChange={this.handleCompanyChange}
                                    className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                  />
                                </div>
                              </div>
                            )}
                            {this.state.headerName ===
                              "Add Event to Person" && (
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  Event Name
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    type="text"
                                    value={this.state.company}
                                    onChange={this.handleCompanyChange}
                                    className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                If No Matching Person{" "}
                              </div>
                              <div className="FieldConfiguration__value">
                                <Select
                                  options={options}
                                  defaultValue={this.state.otherOptions}
                                  onChange={(value) =>
                                    this.tagNoPersonMatchHandler(value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                    <div style={{ marginTop: "36px" }}>
                      <div className="FieldConfigurationField ">
                        {(this.state.isValidated || this.state.company) && (
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
                                    Click the button below to test this setup
                                    with the last submission. You must have
                                    submitted the form to be able to test.
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="FieldConfiguration__value">
                              <div
                                className="BtnV2"
                                tabIndex="-1"
                                onClick={() => this.handleSendTest()}
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
                                  <div className="FieldConfigurationField__error">
                                    This test relies on data from the last
                                    submission, please make sure you have
                                    submitted the form at least once and try
                                    again.
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                        <div className="FieldConfiguration__label">
                          Use conditional logic
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
                                                      val.controlData
                                                        .productList,
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
                    <div style={{ marginTop: "36px" }}>
                      <div
                        className="BtnV2 BtnV2--secondary BtnV2--solid"
                        tabIndex="-1"
                        onClick={(e) => this.finishSetUp()}
                      >
                        <span>Finish Setup</span>
                      </div>
                      <div
                        className="BtnV2 BtnV2--warning"
                        onClick={(e) => this.closeForm()}
                        tabIndex="-1"
                      >
                        <span>Cancel</span>
                      </div>
                    </div>
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
