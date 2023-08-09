import React from "react";
import ReactModal from "react-modal";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
import { PostData, GetData, Delete } from "../../../stores/requests";
import {
  GOOGLEAUTH_URLS,
  FORM_URLS,
  CLICKSEND_AUTH_URLS,
  INTEGRATIONS_URLS,
  CUSTOM_PDF,
} from "../../../util/constants";
import { DraftJS } from "megadraft";
import {
  PostClickSendRequest,
} from "../../../API/IntegrationAPI";
import {
  calculateTime,
  authenticateUser,
  arrayToObj,
} from "../../../util/commonFunction";

class ClickSendAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionalLogic: false,
      isAccountSelected: false,
      selectedAccnt: "",
      userName: "",
      APIKey: "",
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedAccntID: "",
      headerName: "Send a SMS",
      useConditionalLogic: false,
      conditions: [],
      formSubmitted: false,
      showModal: false,
      isInValid: false,
      contactlists: [],
      languagelists: [],
      voiceLists: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
      returnAddresslist: [],
      selectedPostCardPDFOption: [],
      selectedSendLetterPDFOption: [],
      access_token: "",
      isValidated: false,
      customPDFlist: [],
      isRequireInput: false,
      isMachineDetection: false,
      isVoiceListRequireInput: false,
      isVoiceListMachineDetection: false,
      isDuplexPrint: false,
      isColourPrint: false,
      testStatus: "",
      isLoadingFields: false,
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
  componentDidMount() { }
  addAuthAccnt = (res) => {
    let formModel = {
      ID: DraftJS.genKey(),
      TeamName: "My ClickSend",
      Type: "ClickSend",
      CreatedAt: Date.now(),
      APIKey: this.state.APIKey,
      APIUrl: this.state.userName,
      KeyType: "apiKey",
      CreatedBy: this.loginUserId,
      Email: res.user_email,
      UserName: res.user_first_name + " " + res.user_last_name,
      MemberId: res.user_id,
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

  connectClickSend = () => {
    if (this.state.APIKey === "" && this.state.userName === "") {
      this.setState({ isInValid: true });
    } else {
      this.getAccountInfo(this.state.APIKey, this.state.userName);
    }
  };

  getAccountInfo = async (apiKey, userName) => {
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "account",
      headerValue: authenticateUser(userName, apiKey),
    };
    await PostData(CLICKSEND_AUTH_URLS.GET_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.http_code === 200) {
            this.addAuthAccnt(result.data);
            this.setState({ showModal: false });
            this.setState({ isInValid: false });
          } else {
            this.setState({ showModal: true });
            this.setState({ isInValid: true });
          }
        } else {
          this.setState({ showModal: true });
          this.setState({ isInValid: true });
        }
      }
    });
  };
  getAccountList = () => {
    GetData(GOOGLEAUTH_URLS.GET_ACCOUNT_URL).then((result) => {
      if (result != null) {
        this.setState({ isLoadingFields: true });
        let arr = [];
        let googleArr = result.Items.filter(
          (data) => data.Type === "ClickSend"
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
            UserName: googleArr[i].APIUrl,
          });
        }
        this.setState({ accountsList: arr });
        if (googleArr.length > 0) {
          this.setState({
            selectedAccntValue: arr[0],
            selectedAccntID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          if (localStorage.Type === "Send an SMS") {
            this.setState({ isLoadingFields: false });
          } else if (localStorage.Type === "Send a Fax") {
            this.GetCustomPDFList();
          } else if (localStorage.Type === "Send SMS to List") {
            this.GetContactList(arr[0].UserName, arr[0].APIKey);
          } else if (localStorage.Type === "Send a Voice Message") {
            this.GetLanguageList(arr[0].UserName, arr[0].APIKey);
          } else if (localStorage.Type === "Send Voice Message to List") {
            this.GetContactList(arr[0].UserName, arr[0].APIKey);
            this.GetLanguageList(arr[0].UserName, arr[0].APIKey);
          } else if (localStorage.Type === "Create a Contact") {
            this.GetContactList(arr[0].UserName, arr[0].APIKey);
          } else if (localStorage.Type === "Send Postcard/s" || localStorage.Type === "Send Letter/s") {
            this.GetReturnAddress(arr[0].UserName, arr[0].APIKey);
            this.GetCustomPDFList();
          }
        } else {
          this.setState({ isLoadingFields: false });
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
        CLICKSEND_AUTH_URLS.REMOVE_ACCOUNT + this.state.selectedAccntID
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
      isLoadingFields: true,
    });
    if (localStorage.Type === "Send an SMS") {
      this.setState({ isLoadingFields: false });
    } else if (localStorage.Type === "Send a Fax") {
      this.GetCustomPDFList();
    } else if (localStorage.Type === "Send SMS to List") {
      this.GetContactList(value.UserName, value.APIKey);
    } else if (localStorage.Type === "Send a Voice Message") {
      this.GetLanguageList(value.UserName, value.APIKey);
    } else if (localStorage.Type === "Send Voice Message to List") {
      this.GetContactList(value.UserName, value.APIKey);
      this.GetLanguageList(value.UserName, value.APIKey);
    } else if (localStorage.Type === "Create a Contact") {
      this.GetContactList(value.UserName, value.APIKey);
    } else if (localStorage.Type === "Send Postcard/s" || localStorage.Type === "Send Letter/s") {
      this.GetReturnAddress(value.UserName, value.APIKey);
      this.GetCustomPDFList();
    }   
  };

  handleToNumberChange = async (value) => {
    this.setState({ toNumber: value });
    let _self = this;
    if (
      _self.state.messageBody === "" ||
      _self.state.messageBody === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.toNumber === "" && _self.state.toNumber === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleMessageBodyChange = async (value) => {
    this.setState({ messageBody: value });
    let _self = this;
    if (_self.state.toNumber === "" || _self.state.toNumber === undefined) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.messageBody === "" &&
        _self.state.messageBody === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  // Send a Fax
  GetCustomPDFList = async () => {
    let objectMap = {};
    GetData(CUSTOM_PDF.GET_CUSTOM_PDF_FORMID + localStorage.FormId).then(
      (result) => {
        if (result != null) {
          objectMap = arrayToObj(result.Items, function (item) {
            return {
              value: CUSTOM_PDF.GET_FILE_PATH + item.FileName,
              label: "PDF:" + item.PDFName,
            };
          });
          this.setState({ customPDFlist: objectMap, isLoadingFields: false });
        }
      }
    );
  };
  handleCustomChange = async (value) => {
    this.setState({ selectedPDFOption: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.faxFromNumber === "" ||
        _self.state.faxFromNumber === undefined
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.faxToNumber === "" ||
        _self.state.faxToNumber === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };

  handleFaxToNumberChange = async (value) => {
    this.setState({ faxToNumber: value });
    let _self = this;
    if (
      _self.state.faxFromNumber === "" ||
      _self.state.faxFromNumber === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.faxToNumber === "" &&
        _self.state.faxToNumber === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (_self.state.selectedPDFOption.length === 0) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };
  handleFaxFromNumberChange = async (value) => {
    this.setState({ faxFromNumber: value });
    let _self = this;
    if (
      _self.state.faxToNumber === "" ||
      _self.state.faxToNumber === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.faxFromNumber === "" &&
        _self.state.faxFromNumber === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (_self.state.selectedPDFOption.length === 0) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };
  //End Send a Fax

  // Send SMS to list
  GetContactList = async (userName, apiKey) => {
    let objectMap = {};
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "lists",
      headerValue: authenticateUser(userName, apiKey),
    };
    await PostData(CLICKSEND_AUTH_URLS.GET_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.http_code === 200) {
            if (result.data.total > 0) {
              objectMap = arrayToObj(result.data.data, function (item) {
                return {
                  value: item.list_id,
                  label: item.list_name,
                };
              });
            }
            this.setState({ contactlists: objectMap, isLoadingFields: false });
          }
        }
      }
    });
  };

  handleContactChange = async (value) => {
    this.setState({ selectedContactId: value });
    let _self = this;
    if (
      _self.state.SMSListmessageBody === "" ||
      _self.state.SMSListmessageBody === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.selectedContactId === "" &&
        _self.state.selectedContactId === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleSMSListMessageBodyChange = async (value) => {
    this.setState({ SMSListmessageBody: value });
    let _self = this;
    if (
      _self.state.selectedContactId === "" ||
      _self.state.selectedContactId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.SMSListmessageBody === "" &&
        _self.state.SMSListmessageBody === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  CreateSMSContactByListId = async (
    token,
    listId,
    body,
    reference,
    email,
    fromNumber,
    senderId
  ) => {
    let objectMap = {};
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "lists/" + listId + "/contacts",
      headerValue: token,
    };
    await PostData(CLICKSEND_AUTH_URLS.GET_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.http_code === 200) {
            if (result.data.total > 0) {
              if (
                fromNumber !== "" &&
                fromNumber !== null &&
                fromNumber !== undefined
              ) {
                objectMap = arrayToObj(result.data.data, function (item) {
                  return {
                    body: body,
                    to: item.phone_number,
                    from: fromNumber,
                    custom_string: reference === undefined ? "" : reference,
                    from_email: email === undefined ? "" : email,
                  };
                });
              } else if (
                senderId !== "" &&
                senderId !== null &&
                senderId !== undefined
              ) {
                objectMap = arrayToObj(result.data.data, function (item) {
                  return {
                    body: body,
                    to: item.phone_number,
                    from: senderId,
                    custom_string: reference === undefined ? "" : reference,
                    from_email: email === undefined ? "" : email,
                  };
                });
              } else {
                objectMap = arrayToObj(result.data.data, function (item) {
                  return {
                    body: body,
                    to: item.phone_number,
                    custom_string: reference === undefined ? "" : reference,
                    from_email: email === undefined ? "" : email,
                  };
                });
              }
            }
          }
        }
      }
    });
    return objectMap;
  };

  // End SMS to list

  // Send A Voice Message
  GetLanguageList = async (userName, apiKey) => {
    let objectMap = {};
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "voice/lang",
      headerValue: authenticateUser(userName, apiKey),
    };
    await PostData(CLICKSEND_AUTH_URLS.GET_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.http_code === 200) {
            if (result.data.length > 0) {
              objectMap = arrayToObj(result.data, function (item) {
                return {
                  value: item.code,
                  label: item.country,
                };
              });
            }
            this.setState({ languagelists: objectMap, isLoadingFields: false });
          }
        }
      }
    });
  };

  handleRequireInputChange = (e) => {
    this.setState({ isRequireInput: e.target.checked });
  };

  handleMachineDetectionChange = (e) => {
    this.setState({ isMachineDetection: e.target.checked });
  };

  handleVoiceToNumberChange = async (value) => {
    this.setState({ voiceToNumber: value });
    let _self = this;
    if (
      _self.state.voiceMessageBody === "" ||
      _self.state.voiceMessageBody === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.voiceToNumber === "" &&
        _self.state.voiceToNumber === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.voiceTypeId === "" ||
      _self.state.voiceTypeId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };
  handleVoiceMessageBodyChange = async (value) => {
    this.setState({ voiceMessageBody: value });
    let _self = this;
    if (
      _self.state.voiceToNumber === "" ||
      _self.state.voiceToNumber === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.voiceMessageBody === "" &&
        _self.state.voiceMessageBody === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.voiceTypeId === "" ||
      _self.state.voiceTypeId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };
  handleVoiceTypeChange = async (value) => {
    this.setState({ voiceTypeId: value });
    let _self = this;
    if (
      _self.state.voiceMessageBody === "" ||
      _self.state.voiceMessageBody === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.voiceTypeId === "" &&
        _self.state.voiceTypeId === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.voiceToNumber === "" ||
      _self.state.voiceToNumber === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  // End Send A Voice Message

  // Send Voice to list
  handleVoiceContactChange = async (value) => {
    this.setState({ selectedVoiceContactId: value });
    let _self = this;
    if (
      _self.state.voiceListMessageBody === "" ||
      _self.state.voiceListMessageBody === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.selectedVoiceContactId === "" &&
        _self.state.selectedVoiceContactId === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.voiceListTypeId === "" ||
      _self.state.voiceListTypeId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleVoiceListRequireInputChange = (e) => {
    this.setState({ isVoiceListRequireInput: e.target.checked });
  };

  handleVoiceListMachineDetectionChange = (e) => {
    this.setState({ isVoiceListMachineDetection: e.target.checked });
  };

  handleVoiceListMessageBodyChange = async (value) => {
    this.setState({ voiceListMessageBody: value });
    let _self = this;
    if (
      _self.state.selectedVoiceContactId === "" ||
      _self.state.selectedVoiceContactId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.voiceListMessageBody === "" &&
        _self.state.voiceListMessageBody === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.voiceListTypeId === "" ||
      _self.state.voiceListTypeId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };
  handleVoiceListTypeChange = async (value) => {
    this.setState({ voiceListTypeId: value });
    let _self = this;
    if (
      _self.state.voiceListMessageBody === "" ||
      _self.state.voiceListMessageBody === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.voiceListTypeId === "" &&
        _self.state.voiceListTypeId === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else if (
      _self.state.selectedVoiceContactId === "" ||
      _self.state.selectedVoiceContactId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  CreateVoiceListForSend = async (
    token,
    listId,
    body,
    reference,
    voice,
    lang,
    requireinput,
    machinedetection
  ) => {
    let objectMap = {};
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "lists/" + listId + "/contacts",
      headerValue: token,
    };
    await PostData(CLICKSEND_AUTH_URLS.GET_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.http_code === 200) {
            if (result.data.total > 0) {
              objectMap = arrayToObj(result.data.data, function (item) {
                return {
                  body: body,
                  to: item.phone_number,
                  custom_string: reference === undefined ? "" : reference,
                  voice: voice,
                  lang: lang === undefined ? "" : lang,
                  require_input: requireinput,
                  machine_detection: machinedetection,
                };
              });
            }
          }
        }
      }
    });
    return objectMap;
  };

  // End Send Voice to list

  // Create Contact
  handleCreateContactChange = async (value) => {
    this.setState({ selectedCreateContactId: value });
    let _self = this;
    if (
      _self.state.contactPhoneNumber === "" ||
      _self.state.contactPhoneNumber === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.selectedCreateContactId === "" &&
        _self.state.selectedCreateContactId === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };

  handleCreateContactPhoneNoChange = async (value) => {
    this.setState({ contactPhoneNumber: value });
    let _self = this;
    if (
      _self.state.selectedCreateContactId === "" ||
      _self.state.selectedCreateContactId === undefined
    ) {
      _self.setState({ isValidated: false });
    } else if (
      (_self.state.contactPhoneNumber === "" &&
        _self.state.contactPhoneNumber === undefined) ||
      value === "" ||
      value === null
    ) {
      _self.setState({ isValidated: false });
    } else {
      _self.setState({ isValidated: true });
    }
  };
  // End Create COntact

  // Send Send PostCards
  GetReturnAddress = async (userName, apiKey) => {
    let objectMap = {};
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "post/return-addresses",
      headerValue: authenticateUser(userName, apiKey),
    };
    await PostData(CLICKSEND_AUTH_URLS.GET_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          result = JSON.parse(result.res);
          if (result.http_code === 200) {
            if (result.data.total > 0) {
              objectMap = arrayToObj(result.data.data, function (item) {
                return {
                  value: item.return_address_id,
                  label: item.address_name,
                };
              });
            }
            this.setState({ returnAddresslist: objectMap, isLoadingFields: false });
          }
        }
      }
    });
  };

  handlePostCardCustomChange = async (value) => {
    this.setState({ selectedPostCardPDFOption: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedPostCardPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.postCardRecipientName === "" ||
        _self.state.postCardRecipientName === undefined
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.postCardAddress === "" ||
        _self.state.postCardAddress === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };


  handlePostCardRecipientNameChange = async (value) => {
    this.setState({ postCardRecipientName: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedPostCardPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.postCardRecipientName === "" &&
        _self.state.postCardRecipientName === undefined ||
        value === "" ||
        value === null
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.postCardAddress === "" ||
        _self.state.postCardAddress === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };


  handlePostCardAddressChange = async (value) => {
    this.setState({ postCardAddress: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedPostCardPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.postCardAddress === "" &&
        _self.state.postCardAddress === undefined ||
        value === "" ||
        value === null
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.postCardRecipientName === "" ||
        _self.state.postCardRecipientName === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };

  GetDetectAddressInfo = async (
    token,
    addressInfo,
    return_address_id,
    reference,
  ) => {
    let objectMap = {};
    let dataToSubmit = {
      address: addressInfo
    }
    let formModel = {
      APIUrl: CLICKSEND_AUTH_URLS.BASE_URL + "post/letters/detect-address",
      headerValue: token,
      bodyInfo: dataToSubmit,
    };
    await PostData(CLICKSEND_AUTH_URLS.POST_API, formModel).then((result) => {
      if (result != null) {
        if (result.statusCode === 200) {
          if (result.res.http_code === 200) {
            let item = result.res.data;
            objectMap =
            {
              address_name: item.address_name,
              address_line_1: item.address_line_1,
              address_line_2: item.address_line_2,
              address_city: item.address_city,
              address_state: item.address_state,
              address_postal_code: item.address_postal_code,
              address_country: item.address_country,
              return_address_id: return_address_id === undefined ? "" : return_address_id,
              custom_string: reference === undefined ? "" : reference,
            };
          }
        }
      }
    });
    return objectMap;
  };


  //End Send PostCards

  // Send Letters
  handleSendLetterCustomChange = async (value) => {
    this.setState({ selectedSendLetterPDFOption: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedSendLetterPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.sendLetterRecipientName === "" ||
        _self.state.sendLetterRecipientName === undefined
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.sendLetterAddress === "" ||
        _self.state.sendLetterAddress === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };


  handleSendLetterRecipientNameChange = async (value) => {
    this.setState({ sendLetterRecipientName: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedSendLetterPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.sendLetterRecipientName === "" &&
        _self.state.sendLetterRecipientName === undefined ||
        value === "" ||
        value === null
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.sendLetterAddress === "" ||
        _self.state.sendLetterAddress === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };


  handleSendLetterAddressChange = async (value) => {
    this.setState({ sendLetterAddress: value });
    let _self = this;
    setTimeout(() => {
      if (_self.state.selectedSendLetterPDFOption.length === 0) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.sendLetterAddress === "" &&
        _self.state.sendLetterAddress === undefined ||
        value === "" ||
        value === null
      ) {
        _self.setState({ isValidated: false });
      } else if (
        _self.state.sendLetterRecipientName === "" ||
        _self.state.sendLetterRecipientName === undefined
      ) {
        _self.setState({ isValidated: false });
      } else {
        _self.setState({ isValidated: true });
      }
    }, 100);
  };

  handleDuplexPrintChange = (e) => {
    this.setState({ isDuplexPrint: e.target.checked });
  };
  handleColourPrintChange = (e) => {
    this.setState({ isColourPrint: e.target.checked });
  };
  // End Send Letters

  // Send Test Methods
  SendASMS = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "sms/send";
    let dataToSubmit = {};
    if (
      _self.state.fromNumber != "" &&
      _self.state.fromNumber != null &&
      _self.state.fromNumber != undefined
    ) {
      dataToSubmit = {
        messages: [
          {
            body: _self.state.messageBody,
            to: _self.state.toNumber,
            from: _self.state.fromNumber,
            custom_string:
              _self.state.yourReference === undefined
                ? ""
                : _self.state.yourReference,
            from_email:
              _self.state.replyToEmail === undefined
                ? ""
                : _self.state.replyToEmail,
          },
        ],
      };
    } else if (
      _self.state.senderId != "" &&
      _self.state.senderId != null &&
      _self.state.senderId != undefined
    ) {
      dataToSubmit = {
        messages: [
          {
            body: _self.state.messageBody,
            to: _self.state.toNumber,
            from: _self.state.senderId,
            custom_string:
              _self.state.yourReference === undefined
                ? ""
                : _self.state.yourReference,
            from_email:
              _self.state.replyToEmail === undefined
                ? ""
                : _self.state.replyToEmail,
          },
        ],
      };
    } else {
      dataToSubmit = {
        messages: [
          {
            body: _self.state.messageBody,
            to: _self.state.toNumber,
            custom_string:
              _self.state.yourReference === undefined
                ? ""
                : _self.state.yourReference,
            from_email:
              _self.state.replyToEmail === undefined
                ? ""
                : _self.state.replyToEmail,
          },
        ],
      };
    }
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);
    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };

  SendAFax = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "fax/send";
    _self.state.selectedPDFOption.forEach(async (val) => {
      let dataToSubmit = {
        file_url: val.value,
        messages: [
          {
            to: _self.state.faxToNumber,
            from: _self.state.faxFromNumber,
            custom_string:
              _self.state.faxYourReference === undefined
                ? ""
                : _self.state.faxYourReference,
            from_email:
              _self.state.faxReplyToEmail === undefined
                ? ""
                : _self.state.faxReplyToEmail,
          },
        ],
      };
      let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);
      if (result.status) {
        this.setState({ testStatus: "pass" });
      } else {
        this.setState({ testStatus: "fail" });
      }
    });
  };

  SendSMStoList = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "sms/send";
    let messageList = await this.CreateSMSContactByListId(
      token,
      _self.state.selectedContactId,
      _self.state.SMSListmessageBody,
      _self.state.SMSListyourReference,
      _self.state.SMSListreplyToEmail,
      _self.state.SMSListfromNumber,
      _self.state.SMSListsenderId
    );
    let dataToSubmit = {
      messages: messageList,
    };
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);

    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };

  SendAVoiceMessage = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "voice/send";
    let dataToSubmit = {};
    dataToSubmit = {
      messages: [
        {
          body: _self.state.voiceMessageBody,
          to: _self.state.voiceToNumber,
          custom_string:
            _self.state.voiceYourReference === undefined
              ? ""
              : _self.state.voiceYourReference,
          voice: _self.state.voiceTypeId,
          lang:
            _self.state.languageTypeId === undefined
              ? ""
              : _self.state.languageTypeId,
          require_input: _self.state.isRequireInput,
          machine_detection: _self.state.isMachineDetection,
        },
      ],
    };
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);
    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };

  SendVoiceMessagetoList = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "voice/send";
    let messageList = await this.CreateVoiceListForSend(
      token,
      _self.state.selectedVoiceContactId,
      _self.state.voiceListMessageBody,
      _self.state.voiceListYourReference,
      _self.state.voiceListTypeId,
      _self.state.voiceListLanguageTypeId,
      _self.state.isVoiceListRequireInput,
      _self.state.isVoiceListMachineDetection
    );
    let dataToSubmit = {
      messages: messageList,
    };
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);

    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };

  SendCreateContact = async (_self, token) => {
    let APIUrl =
      CLICKSEND_AUTH_URLS.BASE_URL +
      "lists/" +
      _self.state.selectedCreateContactId +
      "/contacts";
    let dataToSubmit = {};
    dataToSubmit = {
      phone_number: _self.state.contactPhoneNumber,
      first_name:
        _self.state.contactFirstName === undefined
          ? ""
          : _self.state.contactFirstName,
      last_name:
        _self.state.contactLastName === undefined
          ? ""
          : _self.state.contactLastName,
      custom_1:
        _self.state.contactCustom1 === undefined
          ? ""
          : _self.state.contactCustom1,
      custom_2:
        _self.state.contactCustom2 === undefined
          ? ""
          : _self.state.contactCustom2,
      custom_3:
        _self.state.contactCustom3 === undefined
          ? ""
          : _self.state.contactCustom3,
      custom_4:
        _self.state.contactCustom4 === undefined
          ? ""
          : _self.state.contactCustom4,
      fax_number:
        _self.state.contactFaxNumber === undefined
          ? ""
          : _self.state.contactFaxNumber,
      organization_name:
        _self.state.contactOrganization === undefined
          ? ""
          : _self.state.contactOrganization,
      email:
        _self.state.contactEmailAddress === undefined
          ? ""
          : _self.state.contactEmailAddress,
      address_line_1:
        _self.state.contactAddress === undefined
          ? ""
          : _self.state.contactAddress,
    };
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);
    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };


  SendPostalCards = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "post/postcards/send";
    let recipientInfo = await this.GetDetectAddressInfo(
      token,
      _self.state.postCardRecipientName + "," + _self.state.postCardAddress,
      _self.state.postCardReturnAddressId,
      _self.state.postCardYourReference
    );
    let fileUrls = {};

    fileUrls = _self.state.selectedPostCardPDFOption.map(function (elem) {
      return elem.value;
    });
    let dataToSubmit = {
      file_urls: fileUrls,
      recipients: [
        recipientInfo]
    };
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);

    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };

  SendLetters = async (_self, token) => {
    let APIUrl = CLICKSEND_AUTH_URLS.BASE_URL + "post/postcards/send";
    let recipientInfo = await this.GetDetectAddressInfo(
      token,
      _self.state.sendLetterRecipientName + "," + _self.state.sendLetterAddress,
      _self.state.sendLetterReturnAddressId,
      _self.state.sendLetterYourReference
    );
    let fileUrls = {};

    fileUrls = _self.state.selectedPostCardPDFOption.map(function (elem) {
      return elem.value;
    });
    let dataToSubmit = {
      file_urls: fileUrls,
      colour: _self.state.isColourPrint,
      duplex: _self.state.isDuplexPrint,
      recipients: [
        recipientInfo]
    };
    let result = await PostClickSendRequest(token, APIUrl, dataToSubmit);

    if (result.status) {
      this.setState({ testStatus: "pass" });
    } else {
      this.setState({ testStatus: "fail" });
    }
  };

  // End Send Test Methods

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
        let token = authenticateUser(
          _self.state.selectedAccntValue.UserName,
          _self.state.selectedAccntValue.APIKey
        );
        if (_self.state.headerName === "Send an SMS") {
          this.SendASMS(_self, token);
        } else if (_self.state.headerName === "Send a Fax") {
          this.SendAFax(_self, token);
        } else if (_self.state.headerName === "Send SMS to List") {
          this.SendSMStoList(_self, token);
        } else if (_self.state.headerName === "Send a Voice Message") {
          this.SendAVoiceMessage(_self, token);
        } else if (_self.state.headerName === "Send Voice Message to List") {
          this.SendVoiceMessagetoList(_self, token);
        } else if (_self.state.headerName === "Create a Contact") {
          this.SendCreateContact(_self, token);
        } else if (_self.state.headerName === "Send Postcard/s") {
          this.SendPostalCards(_self, token);
        } else if (_self.state.headerName === "Send Letter/s") {
          this.SendLetters(_self, token);
        }


      } catch (err) {
        console.log(err);
      }
    }
  };
  finishSetUp = async () => {
    let clickSendSetUpData = {};
    let _self = this;
    if (!_self.state.isValidated) {
      window.alert("Please answer all required fields");
      return false;
    }
    if (_self.state.testStatus === "") {
      if (
        !window.confirm("Are you sure you want to save setup without test?")
      ) {
        return false;
      }
    }

    if (_self.state.headerName === "Send an SMS") {
      if (
        _self.state.fromNumber != "" &&
        _self.state.fromNumber != null &&
        _self.state.fromNumber != undefined
      ) {
        clickSendSetUpData = {
          messages: [
            {
              body: _self.state.messageBody,
              to: _self.state.toNumber,
              from: _self.state.fromNumber,
              custom_string:
                _self.state.yourReference === undefined
                  ? ""
                  : _self.state.yourReference,
              from_email:
                _self.state.replyToEmail === undefined
                  ? ""
                  : _self.state.replyToEmail,
            },
          ],
        };
      } else if (
        _self.state.senderId != "" &&
        _self.state.senderId != null &&
        _self.state.senderId != undefined
      ) {
        clickSendSetUpData = {
          messages: [
            {
              body: _self.state.messageBody,
              to: _self.state.toNumber,
              from: _self.state.senderId,
              custom_string:
                _self.state.yourReference === undefined
                  ? ""
                  : _self.state.yourReference,
              from_email:
                _self.state.replyToEmail === undefined
                  ? ""
                  : _self.state.replyToEmail,
            },
          ],
        };
      } else {
        clickSendSetUpData = {
          messages: [
            {
              body: _self.state.messageBody,
              to: _self.state.toNumber,
              custom_string:
                _self.state.yourReference === undefined
                  ? ""
                  : _self.state.yourReference,
              from_email:
                _self.state.replyToEmail === undefined
                  ? ""
                  : _self.state.replyToEmail,
            },
          ],
        };
      }
    } else if (_self.state.headerName === "Send a Fax") {
      _self.state.selectedPDFOption.forEach(async (val) => {
        clickSendSetUpData = {
          file_url: val.value,
          messages: [
            {
              to: _self.state.faxToNumber,
              from: _self.state.faxFromNumber,
              custom_string:
                _self.state.faxYourReference === undefined
                  ? ""
                  : _self.state.faxYourReference,
              from_email:
                _self.state.faxReplyToEmail === undefined
                  ? ""
                  : _self.state.faxReplyToEmail,
            },
          ],
        };
      });
    } else if (_self.state.headerName === "Send SMS to List") {
      let messageList = await this.CreateSMSContactByListId(
        authenticateUser(
          _self.state.selectedAccntValue.UserName,
          _self.state.selectedAccntValue.APIKey
        ),
        _self.state.selectedContactId,
        _self.state.SMSListmessageBody,
        _self.state.SMSListyourReference,
        _self.state.SMSListreplyToEmail,
        _self.state.SMSListfromNumber,
        _self.state.SMSListsenderId
      );
      clickSendSetUpData = {
        messages: messageList,
      };
    } else if (_self.state.headerName === "Send a Voice Message") {
      clickSendSetUpData = {
        messages: [
          {
            body: _self.state.voiceMessageBody,
            to: _self.state.voiceToNumber,
            custom_string:
              _self.state.voiceYourReference === undefined
                ? ""
                : _self.state.voiceYourReference,
            voice: _self.state.voiceTypeId,
            lang:
              _self.state.languageTypeId === undefined
                ? ""
                : _self.state.languageTypeId,
            require_input: _self.state.isRequireInput,
            machine_detection: _self.state.isMachineDetection,
          },
        ],
      };
    } else if (_self.state.headerName === "Send Voice Message to List") {
      let messageList = await this.CreateSMSContactByListId(
        authenticateUser(
          _self.state.selectedAccntValue.UserName,
          _self.state.selectedAccntValue.APIKey
        ),
        _self.state.selectedVoiceContactId,
        _self.state.voiceListMessageBody,
        _self.state.voiceListYourReference,
        _self.state.voiceListTypeId,
        _self.state.voiceListLanguageTypeId,
        _self.state.isVoiceListRequireInput,
        _self.state.isVoiceListMachineDetection
      );
      clickSendSetUpData = {
        messages: messageList,
      };
    } else if (_self.state.headerName === "Create a Contact") {
      clickSendSetUpData = {
        phone_number: _self.state.contactPhoneNumber,
        first_name:
          _self.state.contactFirstName === undefined
            ? ""
            : _self.state.contactFirstName,
        last_name:
          _self.state.contactLastName === undefined
            ? ""
            : _self.state.contactLastName,
        custom_1:
          _self.state.contactCustom1 === undefined
            ? ""
            : _self.state.contactCustom1,
        custom_2:
          _self.state.contactCustom2 === undefined
            ? ""
            : _self.state.contactCustom2,
        custom_3:
          _self.state.contactCustom3 === undefined
            ? ""
            : _self.state.contactCustom3,
        custom_4:
          _self.state.contactCustom4 === undefined
            ? ""
            : _self.state.contactCustom4,
        fax_number:
          _self.state.contactFaxNumber === undefined
            ? ""
            : _self.state.contactFaxNumber,
        organization_name:
          _self.state.contactOrganization === undefined
            ? ""
            : _self.state.contactOrganization,
        email:
          _self.state.contactEmailAddress === undefined
            ? ""
            : _self.state.contactEmailAddress,
        address_line_1:
          _self.state.contactAddress === undefined
            ? ""
            : _self.state.contactAddress,
      };
    }
    else if (_self.state.headerName === "Send Postcard/s") {
      let recipientInfo = await this.GetDetectAddressInfo(
        authenticateUser(
          _self.state.selectedAccntValue.UserName,
          _self.state.selectedAccntValue.APIKey
        ),
        _self.state.postCardRecipientName + "," + _self.state.postCardAddress,
        _self.state.postCardReturnAddressId,
        _self.state.postCardYourReference
      );

      let fileUrls = {};

      fileUrls = _self.state.selectedPostCardPDFOption.map(function (elem) {
        return elem.value;
      });
      clickSendSetUpData = {
        file_urls: fileUrls,
        recipients: [
          recipientInfo]
      };
    }
    else if (_self.state.headerName === "Send Letter/s") {
      let recipientInfo = await this.GetDetectAddressInfo(
        authenticateUser(
          _self.state.selectedAccntValue.UserName,
          _self.state.selectedAccntValue.APIKey
        ),
        _self.state.sendLetterRecipientName + "," + _self.state.sendLetterAddress,
        _self.state.sendLetterReturnAddressId,
        _self.state.sendLetterYourReference
      );
      let fileUrls = {};

      fileUrls = _self.state.selectedPostCardPDFOption.map(function (elem) {
        return elem.value;
      });
      clickSendSetUpData = {
        file_urls: fileUrls,
        colour: _self.state.isColourPrint,
        duplex: _self.state.isDuplexPrint,
        recipients: [
          recipientInfo]
      };
    }
    _self.FinishSetupPostRequest(_self, clickSendSetUpData);
  };

  FinishSetupPostRequest = async (_self, clickSendSetUpData) => {
    let formModel = {
      FinishSetupId: DraftJS.genKey(),
      Type: localStorage.Type,
      IntegrationType: "ClickSend",
      FormId: localStorage.CurrentFormId,
      SetUpData: JSON.stringify(clickSendSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: _self.loginUserId,
      RefreshToken: authenticateUser(
        _self.state.selectedAccntValue.UserName,
        _self.state.selectedAccntValue.APIKey
      ),
      IsConditionalLogic: _self.state.conditionalLogic,
      Conditions: JSON.stringify(_self.state.conditions),
    };

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
                  src={require("assets/img/clicksend.png")}
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
                        You can connect a new Freshdesk account, or choose from
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
                    {this.state.headerName === "Send an SMS" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>From Number</span>
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
                                  This can be any mobile number or a dedicated
                                  ClickSend number. Leave blank to send from a
                                  default number assigned by ClickSend. Replies
                                  will be sent to this number. Must be correctly
                                  formatted with international codes.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.fromNumber}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({ fromNumber: e.target.value })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Sender ID</span>
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
                                  Some text (up to 11 characters). Messages will
                                  be sent with this instead of a number.
                                  Receivers cannot reply. If 'From Number' is
                                  set 'Sender ID' will be ignored.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.senderId}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({ senderId: e.target.value })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>To Number*</span>
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
                                  Then number/s to send to. Use a Hidden
                                  question to send to set a default number. Must
                                  be correctly formatted with international
                                  codes.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.toNumber}
                              placeholder=""
                              onChange={(e) =>
                                this.handleToNumberChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.toNumber === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Message Body*</span>
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
                                  Every 160 characters will result in one SMS
                                  charge from ClickSend.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.messageBody}
                              placeholder=""
                              maxLength={160}
                              onChange={(e) =>
                                this.handleMessageBodyChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.messageBody === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the SMS record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.yourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({ yourReference: e.target.value })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Reply To Email</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.replyToEmail}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({ replyToEmail: e.target.value })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Send a Fax" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Files To Send*</span>
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
                                  Files to fax. Each file will be sent as a
                                  separate fax. Supports pdf format only.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.customPDFlist}
                              isMulti={true}
                              onChange={(value) =>
                                this.handleCustomChange(value)
                              }
                            />
                            {this.state.selectedPDFOption === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>To Number*</span>
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
                                  Then number/s to send to. Use a Hidden
                                  question to send to set a default number. Must
                                  be valid E.164 fax numbers.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.faxToNumber}
                              placeholder=""
                              onChange={(e) =>
                                this.handleFaxToNumberChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.toNumber === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>From Number*</span>
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
                                  Must be a valid fax number
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.faxFromNumber}
                              placeholder=""
                              onChange={(e) =>
                                this.handleFaxFromNumberChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.faxFromNumber === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.faxYourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  faxYourReference: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Reply To Email</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.faxReplyToEmail}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  faxReplyToEmail: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Send SMS to List" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>From Number</span>
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
                                  This can be any mobile number or a dedicated
                                  ClickSend number. Leave blank to send from a
                                  default number assigned by ClickSend. Replies
                                  will be sent to this number. Must be correctly
                                  formatted with international codes.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.SMSListfromNumber}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  SMSListfromNumber: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Sender ID</span>
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
                                  Some text (up to 11 characters). Messages will
                                  be sent with this instead of a number.
                                  Receivers cannot reply. If 'From Number' is
                                  set 'Sender ID' will be ignored.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.SMSListsenderId}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  SMSListsenderId: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Contact List*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.contactlists}
                              onChange={(e) =>
                                this.handleContactChange(e.value)
                              }
                            />
                            {this.state.selectedContactId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Message Body*</span>
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
                                  Every 160 characters will result in one SMS
                                  charge from ClickSend.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.SMSListmessageBody}
                              placeholder=""
                              maxLength={160}
                              onChange={(e) =>
                                this.handleSMSListMessageBodyChange(
                                  e.target.value
                                )
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.SMSListmessageBody === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the SMS record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.SMSListyourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  SMSListyourReference: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Reply To Email</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.SMSListreplyToEmail}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  SMSListreplyToEmail: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Send a Voice Message" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>To Number*</span>
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
                                  Then number/s to send to. Use a Hidden
                                  question to send to set a default number. Must
                                  be valid E.164 fax numbers.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.voiceToNumber}
                              placeholder=""
                              onChange={(e) =>
                                this.handleVoiceToNumberChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.voiceToNumber === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Message Body*</span>
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
                                  Every 300 characters will result in one SMS
                                  charge from ClickSend. Messages over 1200
                                  characters will be truncated
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.voiceMessageBody}
                              placeholder=""
                              onChange={(e) =>
                                this.handleVoiceMessageBodyChange(
                                  e.target.value
                                )
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.voiceMessageBody === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Voice*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.voiceLists}
                              onChange={(e) =>
                                this.handleVoiceTypeChange(e.value)
                              }
                            />
                            {this.state.voiceTypeId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Language</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.languagelists}
                              onChange={(e) =>
                                this.setState({ languageTypeId: e.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.voiceYourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  voiceYourReference: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
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
                            Require Input{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isRequireInput}
                              onChange={(e) => this.handleRequireInputChange(e)}
                              value="requiredQuestion"
                              color="primary"
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
                            Machine Detection{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isMachineDetection}
                              onChange={(e) =>
                                this.handleMachineDetectionChange(e)
                              }
                              value="requiredQuestion"
                              color="primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Send Voice Message to List" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Contact List*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.contactlists}
                              onChange={(e) =>
                                this.handleVoiceContactChange(e.value)
                              }
                            />
                            {this.state.selectedVoiceContactId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Message Body*</span>
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
                                  Every 300 characters will result in one SMS
                                  charge from ClickSend. Messages over 1200
                                  characters will be truncated
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.voiceListMessageBody}
                              placeholder=""
                              onChange={(e) =>
                                this.handleVoiceListMessageBodyChange(
                                  e.target.value
                                )
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.voiceListMessageBody === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Voice*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.voiceLists}
                              onChange={(e) =>
                                this.handleVoiceListTypeChange(e.value)
                              }
                            />
                            {this.state.voiceListTypeId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Language</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.languagelists}
                              onChange={(e) =>
                                this.setState({
                                  voiceListLanguageTypeId: e.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.voiceListYourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  voiceListYourReference: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
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
                            Require Input{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isVoiceListRequireInput}
                              onChange={(e) =>
                                this.handleVoiceListRequireInputChange(e)
                              }
                              value="requiredQuestion"
                              color="primary"
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
                            Machine Detection{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isVoiceListMachineDetection}
                              onChange={(e) =>
                                this.handleVoiceListMachineDetectionChange(e)
                              }
                              value="requiredQuestion"
                              color="primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Create a Contact" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Contact List*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.contactlists}
                              onChange={(e) =>
                                this.handleCreateContactChange(e.value)
                              }
                            />
                            {this.state.selectedCreateContactId === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Phone Number*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactPhoneNumber}
                              placeholder="123456789"
                              onChange={(e) =>
                                this.handleCreateContactPhoneNoChange(
                                  e.target.value
                                )
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.contactPhoneNumber === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>First Name</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactFirstName}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactFirstName: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Last Name</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactLastName}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactLastName: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>

                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Custom 1</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactCustom1}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactCustom1: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Custom 2</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactCustom2}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactCustom2: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Custom 3</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactCustom3}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactCustom3: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Custom 4</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactCustom4}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactCustom4: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Fax Number</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactFaxNumber}
                              placeholder="123456789"
                              onChange={(e) =>
                                this.setState({
                                  contactFaxNumber: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Organization</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactOrganization}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  contactOrganization: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Email Address</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactEmailAddress}
                              placeholder="hello@formbuilder.co"
                              onChange={(e) =>
                                this.setState({
                                  contactEmailAddress: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Address</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.contactAddress}
                              placeholder="123 Fake St,Sydney,NSW,2000,Australia"
                              onChange={(e) =>
                                this.setState({
                                  contactAddress: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Send Postcard/s" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Files To Send*</span>
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
                                  Files to fax. Each file will be sent as a
                                  separate fax. Supports pdf format only.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.customPDFlist}
                              isMulti={true}
                              onChange={(value) =>
                                this.handlePostCardCustomChange(value)
                              }
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Name of recipient*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.postCardRecipientName}
                              placeholder=""
                              onChange={(e) =>
                                this.handlePostCardRecipientNameChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.postCardRecipientName === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Address*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.postCardAddress}
                              placeholder="123 Fake St,Sydney,NSW,2000,Australia"
                              onChange={(e) =>
                                this.handlePostCardAddressChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.postCardAddress === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Return address</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.returnAddresslist}
                              onChange={(e) =>
                                this.setState({
                                  postCardReturnAddressId: e.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.postCardYourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  postCardYourReference: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {this.state.headerName === "Send Letter/s" && (
                      <div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Files To Send*</span>
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
                                  Files to fax. Each file will be sent as a
                                  separate fax. Supports pdf format only.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.customPDFlist}
                              isMulti={true}
                              onChange={(value) =>
                                this.handleSendLetterCustomChange(value)
                              }
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Name of recipient*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.sendLetterRecipientName}
                              placeholder=""
                              onChange={(e) =>
                                this.handleSendLetterRecipientNameChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.sendLetterRecipientName === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Address*</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.sendLetterAddress}
                              placeholder="123 Fake St,Sydney,NSW,2000,Australia"
                              onChange={(e) =>
                                this.handleSendLetterAddressChange(e.target.value)
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
                            />
                            {this.state.sendLetterAddress === "" && (
                              <div className="FieldConfigurationField__error">
                                This field is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Return address</span>
                          </div>
                          <div className="FieldConfiguration__value">
                            <Select
                              isClearable={true}
                              options={this.state.returnAddresslist}
                              onChange={(e) =>
                                this.setState({
                                  sendLetterReturnAddressId: e.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <span>Your Reference</span>
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
                                  A reference to add to the record in your
                                  ClickSend account
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <input
                              type="text"
                              value={this.state.sendLetterYourReference}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  sendLetterYourReference: e.target.value,
                                })
                              }
                              className="FormTagInput LiveField__input LiveField__input--manualfocus"
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
                            Duplex print{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isDuplexPrint}
                              onChange={(e) => this.handleDuplexPrintChange(e)}
                              value="requiredQuestion"
                              color="primary"
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
                            Colour print{" "}
                          </div>
                          <div className="FieldConfiguration__value">
                            <Switch
                              checked={this.state.isColourPrint}
                              onChange={(e) => this.handleColourPrintChange(e)}
                              value="requiredQuestion"
                              color="primary"
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
                  <h2>Connect FormBuilder to ClickSend</h2>
                  <div>
                    <p>
                      <p>
                        To find the API Secret, go to your{" "}
                        <a href="https://dashboard.clicksend.com/#/dashboard/home">
                          ClickSend dashboard
                        </a>
                        , and click "API Credentials" in the top right.
                      </p>
                    </p>
                  </div>
                  <br />
                  <br />
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Username*</div>
                    <div className="FieldConfiguration__value">
                      <input
                        type="text"
                        onChange={(e) =>
                          this.setState({ userName: e.target.value })
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
                      onClick={() => this.connectClickSend()}
                    >
                      <span>Connect ClickSend</span>
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
                      Please enter all of the valid values
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

export default ClickSendAuthForm;
