/* eslint-disable no-useless-escape */
import React from "react";
import { editorStateFromRaw, DraftJS } from "megadraft";
import Input from "../../components/controls/input";
import PhoneNumber from "../../components/controls/phoneNumber";
import ColorPickerComponent from "../../components/controls/colorPickerControl";
import AppointmentComponent from "../../components/controls/AppointmentPickerControl";
import SelectControl from "../../components/controls/select";
import Address from "../../components/controls/addressControl";
import DateControl from "../../components/controls/date";
import Time from "../../components/controls/time";
import Scale from "../../components/controls/scale";
import RadioButtons from "../../components/controls/RadioButtons";
import TextArea from "../../components/controls/textArea";
import MultipleChoice from "../../components/controls/MultipleChoice";
import PaginationButtons from "./PaginationButtons";

import SquareCheckout from "./PaymentCheckout/SquareCheckout";
import PaypalCheckout from "./PaymentCheckout/PaypalCheckout";
import BraintreeCheckout from "./PaymentCheckout/BraintreeCheckout";
import StripeCheckoutModal from "./PaymentCheckout/StripeCheckoutModal";
import Products from "../../components/controls/products";
import "../../../src/assets/custom/FormBuilder.css";
import "../../../src/assets/custom/question_control.css";
import _ from "lodash";
import fetch from "isomorphic-fetch";
import { convertToRaw } from "draft-js";
import $ from "jquery";
import SignatureCanvas from "react-signature-canvas";
import { isNullOrUndefined } from "util";
import AfterSubmissionPage from "../forms/AfterSubmisssionPage";
import { store } from "../../index";
import math from "mathjs-expression-parser";
import reactCSS from "reactcss";
import FontPicker from "font-picker-react";
import moment from "moment";
import ReactModal from "react-modal";

// import { SketchPicker } from "react-color";

import { getThemeInfoByFormId, getGoogleAccessTokenByRefreshToken } from "../../API/IntegrationAPI";
import {
  GetData,
  PostData,
  PostDataWithHeader,
  PostDataWithoutJson,
  PostDataWithoutBody,
  UpdateData,
} from "../../stores/requests";
import {
  FORM_URLS,
  SUCCESS_N_REDIRECTS_PAGE_URLS,
  GOOGLEAUTH_URLS,
  GOOGLEAUTH_CRENDENTIALS,
  TRELLOAUTH_CREDENTIALS,
  TRELLOAUTH_URLS,
  TRACKFORM_URLS,
  CONFIGURE_PAYMENTS_URLS,
  PAYMENT_ACCOUNT_URLS,
  WEB_FONTS_KEYS,
  SlackAuth_URLS,
} from "../../util/constants";
import {
  AddSubscriberList_mailchimp,
  AddSubscriberTag_mailchimp,
  AddUpdateActiveCampaignContact,
  CreateDeal_ActiveCampaign,
  AddContact_Automations,
  UpdateDeal_ActiveCampaign,
  AddContactNote,
} from "../../API/IntegrationAPI";
import CaptchaControl from "../../components/controls/CaptchaControl";
import Loader from "../../components/Common/Loader";
// import StripeCheckout from "./PaymentCheckout/StripeCheckoutModal";
export {
  Block,
  Inline,
  Entity,
  HANDLED,
  NOT_HANDLED,
} from "../../util/constants";
let countriesData = require("../../JsonData/countries.json");

let initialValue;
let endValue;
let simpletext = [];
let unstyledText;
let alignmentText;
let unorderedText;
let orderedText;
let headerTwoText;
let blockQuoteText;
let headerOneText;
let currentFileState = "";
let priceValue = "";
let minimumPriceValue = "";
let isPriceQuestionReadonly = true;
let minimumFiles = "";
let maximumFiles = "";
const Block = {
  UNSTYLED: "unstyled",
  PARAGRAPH: "unstyled",
  OL: "ordered-list-item",
  UL: "unordered-list-item",
  H1: "header-one",
  H2: "header-two",
  H3: "header-three",
  H4: "header-four",
  H5: "header-five",
  H6: "header-six",
  CODE: "code-block",
  BLOCKQUOTE: "blockquote",
  PULLQUOTE: "pullquote",
  ATOMIC: "atomic",
  BLOCKQUOTE_CAPTION: "block-quote-caption",
  CAPTION: "caption",
  TODO: "todo",
  IMAGE: "atomic:image",
  BREAK: "atomic:break",
  LeftAlign: "leftAlign",
  RightAlign: "rightAlign",
  CenterAlign: "centerAlign",
};
ReactModal.setAppElement("#root");

class PreviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: true,
      questionSettingData:
        localStorage.addAnother !== undefined && localStorage.addAnother != null
          ? JSON.parse(localStorage.addAnother)
          : undefined,
      previewData: "",
      arrayIndex: 0,
      breakValue: "",
      formJSON: props.formJSON,
      previousClicked: false,
      file: null,
      fileState: null,
      files: [],
      filesState: null,
      open: false,
      trimmedDataURL: null,
      showSubmission: false,
      priceInitialValue: 10,
      basePriceValue: "",
      totalPriceValue: "",
      processingFeeAmount: null,
      processingFeePercentage: null,
      taxAmount: null,
      stateConfirmEmail: "",
      formSubmitted: false,
      multiChoiceOptions: [
        { label: "Choice 1", value: "Choice 1" },
        { label: "Choice 2", value: "Choice 2" },
      ],
      editorState: editorStateFromRaw(null),
      submitting: false,
      scaleOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      iframeLoad: false,
      formClass: "full-preview-page preview_page_style preview-form",
      requiredCaptcha: false,
      staticCaptcha: "",
      captchaVal: "",
      setUpWorkSheet: [],
      header: {},
      access_token: "",
      googleSheetConditions: [],
      slackData: Object.assign({}, ""),
      calculationData: "",
      // Theme Info State
      SelectedThemeTypoGraphyFontInfo: JSON.stringify([]),
      SelectedThemeTypoGraphyListInfo: JSON.stringify([]),
      SelectedThemeSettingsInfo: JSON.stringify([]),
      SelectedThemeUISettingsInfo: JSON.stringify([]),
      SelectedBackgroundColor: "",
      SelectedBackgroundFile: "",
      ActiveColor: "",
      TextColor: "",
      WarningColor: "",
      colorFive: "",
      colorSix: "",
      colorSeven: "",
      colorEight: "",
      selectedPrimaryFontFamily: "",
      selectedSecondaryFontFamily: "",
      backgroundShadow: true,
      requiredAsterick: true,
      paginationButtons: {
        style: "buttons",
        background: { r: 255, g: 255, b: 255, a: 1 },
        fontFamily: "Lato",
        fontSize: "20px",
        lineHeight: "auto",
        fontWeight: "regular",
        color: { r: 0, g: 0, b: 0, a: 1 },
        showTotalPages: false,
      },
      submitButtonSettings: "",
      heading1Styles: {},
      heading2Styles: {},
      paragraphStyles: {},
      questionTitleStyles: {},
      QuestionDescStyles: {},
      confirmError: "",
      textError: "",
      urlError: "",
      translatedData: [],
      isPaymentMethodSet: false,
      paymentAccountList: [],
      formHasPriceControl: false,
      showPaymentCheckout: false,
      selectedPaymentMethod: null,
      paymentConfigration: null,
      selectedCurrency: "USD",
      currencySymbol: null,
      submitError: "",
      isPricedItemInForm: false,
      currentUserId: null,
    };
    this.trackDetails = Object.assign({}, "");
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitWithPaymentCheck = this.handleSubmitWithPaymentCheck.bind(
      this
    );
    this.handlePriceSubmit = this.handlePriceSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.createControlHtml = this.createControlHtml.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.updateState = this.updateState.bind(this);
    this.getTranslationData = this.getTranslationData.bind(this);
    this.getPaymentAccountList = this.getPaymentAccountList.bind(this);
    this.getPaymentConfigration = this.getPaymentConfigration.bind(this);
    this.closePaymentCheckoutModal = this.closePaymentCheckoutModal.bind(this);
    this.formControlsCount = 0;
    this.formControls = "";
    this.formControlsArr = [];
    this.formJSON = props.formJSON ? props.formJSON : [];
    this.days = [];
    this.yearJson = [];
    this.addressFieldsJson = [];
    this.showSubmit = false;
    this.handleFileChange = this.handleFileChange.bind(this);
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    this.showSubmission = false;
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.controlKeyId = [];
    this.errorTxt = "This question is required";
    this.controlTimeList = [];
    this.interactedKeys = [];
    this.defaultProductList = [
      {
        Name: "New Product",
        SKU: DraftJS.genKey(),
        productCount: 1,
        Price: "10",
        Stock: "",
        MinQuantity: "",
        MaxQuantity: "",
        Images: [],
        isSelected: false,
      },
    ];

    // set time functions

    this.currentFormId =
      localStorage.CurrentFormId === undefined
        ? this.props.match.params.formId
        : localStorage.CurrentFormId;
    this.submitData = [];    
     // Theme Info    
    this.GetSelectedThemeInfo(this.currentFormId);
    if (
      localStorage.CurrentFormId === undefined &&
      localStorage.formJSON === undefined
    )
    {
      this.saveFieldData();
    }
    setTimeout(function() {}, 3000);
    let dataOfFormJsonClearCondationsObj =
      localStorage.CurrentFormId === undefined
        ? JSON.parse(localStorage.getItem("formJSON"))
        : JSON.parse(localStorage.getItem("formJSON"));
    if (
      dataOfFormJsonClearCondationsObj !== undefined &&
      dataOfFormJsonClearCondationsObj &&
      dataOfFormJsonClearCondationsObj.length > 0
    ) {
      dataOfFormJsonClearCondationsObj.forEach((fomJsonData) => {
        if (
          !isNullOrUndefined(fomJsonData.ListOfQuestionForSettings) &&
          fomJsonData.ListOfQuestionForSettings.length > 0
        ) {
          fomJsonData.ListOfQuestionForSettings.forEach((questionList) => {
            delete questionList.isAddedQuestionAnswer;
            delete questionList.qsOfAnswerMathched;
          });
        }
      });
      localStorage.removeItem("formJSON");
      localStorage.setItem(
        "formJSON",
        JSON.stringify(dataOfFormJsonClearCondationsObj)
      );
    }
    // else
    // {
    //  dataOfFormJsonClearCondationsObj= (async()=>await this.saveFieldData());
    //   dataOfFormJsonClearCondationsObj.forEach(el => {
    //     if (
    //       !isNullOrUndefined(el.ListOfQuestionForSettings) &&
    //       el.ListOfQuestionForSettings.length > 0
    //     ) {
    //       el.ListOfQuestionForSettings.forEach(e => {
    //         delete e.isAddedQuestionAnswer;
    //         delete e.qsOfAnswerMathched;
    //       });
    //     }
    //   });
    //   localStorage.removeItem("formJSON");
    //   localStorage.setItem(
    //     "formJSON",
    //     JSON.stringify(dataOfFormJsonClearCondationsObj)
    //   );
    // }
  }
  sigPad = {
    width: 500,
    height: 200,
  };

  toColorString = (colorObj) => {
    return `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, ${colorObj.a})`;
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ formJSON: nextProps.formJSON });
    this.formJSON = nextProps.formJSON;
    this.updateState();
  }
  componentWillMount() {
    this.setState({ isLoader: true });
    if (localStorage.getItem("formRequireCaptcha") !== undefined) {
      if (localStorage.getItem("formRequireCaptcha")) {
        this.setState({ requiredCaptcha: true });
      }
    }
    // this.getWorkSheetSetupByFormId();
    if (window.location !== window.parent.location) {
      this.setState({
        iframeLoad: true,
        formClass: "iframe-margin-preview preview_page_style preview-form",
      });
    }
    this.formJSON = this.state.formJSON
      ? this.state.formJSON
      : localStorage.formJSON
      ? JSON.parse(localStorage.formJSON)
      : [];

    this.setState({
      previewData: localStorage.pageData,
      formJSON: this.formJSON,
    });
    this.getDynamicPages();
    const userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const uData = JSON.parse(userData);
      this.setState({
        currentUserId: uData.UserId,
      });
      this.getPaymentAccountList(uData.UserId);
    }
    localStorage.removeItem("pagedata");
    localStorage.setItem("previousClicked", false);

    // Append Calculation  value

    this.formJSON.map((data, i) => {
      let str;
      if (data.control === "calculation") {
        if (!data.hideQuestion) {
          str = this.handleCalculationControl(
            data.livePreview,
            data.calculationQuestion
          );
          this.setState({ calculationData: str });
        }
      }
      return str;
    });
    //To update visit count
    GetData(FORM_URLS.GET_FORM_TRACK_DETAILSURL + this.currentFormId).then(
      (result) => {
        if (result != null && result && result.data.Items.length > 0) {
          let data = result.data.Items;

          for (let i = 0; i < result.data.Items.length; i++) {
            let trackObj = {
              trackingid: data[i].TrackingId,
              formid: this.currentFormId,
              visitingTime: Date.now(),
            };
            let trackingData = Object.assign({}, data[i]);
            trackingData.TrackingFields = JSON.parse(data[i].TrackingFields);
            this.controlTimeList.push(trackingData);
            this.updateFormTrack(trackObj);
          }
        }
        this.getTranslationData();
      }
    );
  }

  closePaymentCheckoutModal() {
    this.setState({
      showPaymentCheckout: false,
    });
  }
  GetSelectedThemeInfo = async (formId) => {
    let result = await getThemeInfoByFormId(formId);
    let resultItems = [];
    if (result.Count > 0) {
      if (result.Items !== undefined) {
        resultItems = result.Items[0];

        if (resultItems.ThemeSettings !== "[]") {
          this.SetValuesIntoState(
            resultItems.ThemeSettings,
            resultItems.BackgroundColor
          );
        }
        if (resultItems.TypoGraphyFont !== "[]") {
          this.SetTypoGraphyThemeIntoState(resultItems.TypoGraphyFont);
        }
        if (resultItems.UIElement !== "[]") {
          this.SetQuestionsValueIntoState(
            resultItems.UIElement,
            resultItems.ThemeSettings
          );
        } else {
          if (resultItems.ThemeSettings !== "[]") {
            const items = JSON.parse(resultItems.ThemeSettings);
            this.setState({
              paginationButtons: {
                ...this.state.paginationButtons,
                background: items.BackGroundColor,
                color: this.hexToRgb(items.ActiveColor),
              },
            });
          }
        }
        this.setState({
          SelectedThemeSettingsInfo: resultItems.ThemeSettings,
          SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
          SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
          SelectedThemeUISettingsInfo: resultItems.UIElement,
          SelectedBackgroundColor: resultItems.BackgroundColor,
          SelectedBackgroundFile: resultItems.BackgroundFile,
        });
      }
    }
  };
  SetValuesIntoState = (itemsinfo) => {
    let items = JSON.parse(itemsinfo);
    this.setState({
      ActiveColor: items.ActiveColor,
      TextColor: items.TextColor,
      WarningColor: items.WarningColor,
      colorFive: items.Color1,
      colorSix: items.Color2,
      colorSeven: items.Color3,
      colorEight: items.Color4,
      selectedPrimaryFontFamily: items.PrimaryFont,
      selectedSecondaryFontFamily: items.SecondaryFont,
    });
  };

  SetTypoGraphyThemeIntoState = (info) => {
    const typoSettings = JSON.parse(info);
    this.setState({
      heading1Styles: typoSettings[0],
      heading2Styles: typoSettings[1],
      paragraphStyles: typoSettings[2],
      questionTitleStyles: typoSettings[3],
      QuestionDescStyles: typoSettings[4],
    });
  };
  // handleColorClick = () => {
  //   this.setState({ displayColorPicker: !this.state.displayColorPicker });
  // };

  // handleColorClose = () => {
  //   this.setState({ displayColorPicker: false });
  // };

  handleColorChange = (color, key) => {
    this.setState({ color: color.rgb });
  };
  
  SetQuestionsValueIntoState = (info, themeSettings) => {
    const UiElementInfo = JSON.parse(info);
    let QuestionsObj = [];
    if (UiElementInfo[0].Questions) {
      QuestionsObj = { ...UiElementInfo[0].Questions };
    }

    if (UiElementInfo[0].Pagination) {
      const paginationObj = { ...UiElementInfo[0].Pagination };
      this.setState({
        paginationButtons: paginationObj,
      });
    } else {
      if (themeSettings !== "[]") {
        const items = JSON.parse(themeSettings);
        this.setState({
          paginationButtons: {
            ...this.state.paginationButtons,
            background: items.BackgroundColor,
            color: this.hexToRgb(items.ActiveColor),
          },
        });
      }
    }

    if (UiElementInfo[0].submitButton) {
      const submitbtnObj = { ...UiElementInfo[0].submitButton };

      this.setState({
        submitButtonSettings: submitbtnObj,
      });
    }

    if (QuestionsObj !== "[]") {
      this.setState({
        backgroundShadow: QuestionsObj.backgroundShadow,
        requiredAsterick: QuestionsObj.requiredAsterick,
      });
    }
  };
  getPaymentAccountList = (userId) => {
    GetData(PAYMENT_ACCOUNT_URLS.GET_PAYMENT_ACCOUNT_BY_USER + userId).then(
      (result) => {
        if (
          result != null &&
          result.data.Items !== undefined &&
          result.data.Items.length > 0
        ) {
          // console.log("accountsList", result);
          this.setState({
            paymentAccountList: result.data.Items,
          });
          this.getPaymentConfigration(result.data.Items);
        } else {
          this.setState({ paymentAccountList: [], isPaymentMethodSet: false });
          this.calculateTotalPrice();
        }
      }
    );
  };
  getPaymentConfigration = (accountsList) => {
    GetData(
      CONFIGURE_PAYMENTS_URLS.GET_PAYMENT_CONFIGURATION_URL +
      this.currentFormId
    ).then((result) => {
      if (Object.keys(result.data).length > 0) {
        let resultantItem = result.data.Item;
        const paymentInfo = JSON.parse(resultantItem.PaymentAccount);
        if (paymentInfo.PaymentAccountId !== "") {
          const selectedmethod = accountsList.find(
            (accoundDetail) =>
              accoundDetail.PaymentAccountId === paymentInfo.PaymentAccountId
          );
          if (selectedmethod) {
            this.setState({
              isPaymentMethodSet: true,
              selectedPaymentMethod: selectedmethod,
              paymentConfigration: resultantItem,
            });
          }
        } else {
          this.setState({
            isPaymentMethodSet: false,
          });
        }
      } else {
        this.setState({
          isPaymentMethodSet: false,
        });
      }
      this.calculateTotalPrice();
    });
  };
  updateFormTrack = (trackObj) => {
    UpdateData(TRACKFORM_URLS.UPDATE_TRACKING_FORM_VISIT_COUNT, trackObj).then(
      (result) => {}
    );
  };
  getDynamicPages = () => {
    const URL =
      SUCCESS_N_REDIRECTS_PAGE_URLS.GET_ALL_SUCCESS_PAGES_URL +
      this.currentFormId;
    try {
      GetData(URL).then((result) => {
        if (result.data) {
          let count = result.data.Count;
          if (count > 0) {
            this.setState({
              editorState: JSON.parse(
                result.data.Items[0].SubmissionScreenDesign
              ),
            });
          } else {
            this.getDefaultPage();
          }
        }
      });
    } catch (error) {
      console.log(
        SUCCESS_N_REDIRECTS_PAGE_URLS.GET_ALL_SUCCESS_PAGES_URL,
        error
      );
    }
  };
  getWorkSheetSetupByFormId = () => {
    if (this.currentFormId !== undefined) {
      const URL = FORM_URLS.GET_WORK_SHEET_SETUP_FORM_ID + this.currentFormId;
      try {
        GetData(URL).then((result) => {
          if (result != null && result.Count > 0) {
            result.Items.forEach((element) => {
              if (element.Type === "GoogleSheet") {
                this.setState({ setUpWorkSheet: element });
                this.setState({
                  googleSheetConditions: JSON.parse(element.Conditions),
                });
                this.refreshToken(element.RefreshToken);
              } else if (element.Type === "Slack Channel") {
                this.setState({ slackData: element });
                this.sendSlackData(element);
              } else if (element.Type === "Add Subscriber to a List") {
                let status = "subscribed";
                this.sendMailChimpData(element, status);
              } else if (element.Type === "Add Subscriber to a Tag") {
                this.sendMailChimpData(element);
              } else if (
                element.Type === "Create Note" ||
                element.Type === "Add Contact to an Automation" ||
                element.Type === "Create Update Contact" ||
                element.Type === "Create Deal" ||
                element.Type === "Update Deal"
              ) {
                this.sendActiveCampaignData(element);
              } else if (element.Type === "Create Card") {
                this.CreateCard(element);
              } else if (element.Type === "Create List") {
                this.CreateList(element);
              } else {
                this.CreateBoard(element);
              }
            });
          }
        });
      } catch {}
    }
  };
  sendMailChimpData = async (data, status) => {
    let result = {};
    try {
      if (data.Type === "Add Subscriber to a List") {
        let setUpData = JSON.parse(data.SetUpData);
        result = await AddSubscriberList_mailchimp(
          data.RefreshToken,
          setUpData.api_endPoint,
          setUpData.listId,
          setUpData.email_address,
          setUpData.firstName,
          setUpData.lastName,
          setUpData.phone,
          setUpData.address,
          setUpData.birthday,
          status
        );
        if (result.status) {
          this.setState({ testStatus: "pass" });
        } else {
          this.setState({ testStatus: "fail", detailStatus: result.message });
        }
      } else {
        let setUpData = data.SetUpData;
        let selectedTags = setUpData.selectedTags
          ? JSON.parse(setUpData.selectedTags)
          : [];
        if (selectedTags.length > 0) {
          let resmessage = "";
          let status;
          for (let i = 0; i < selectedTags.length; i++) {
            result = await AddSubscriberTag_mailchimp(
              data.RefreshToken,
              setUpData.api_endPoint,
              setUpData.listId,
              setUpData.emailAddress,
              selectedTags[i].value
            );
            if (result.status) {
              //
              if (status === undefined) status = true;
            } else {
              status = false;
              resmessage = resmessage + "\n" + result.message;
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  sendActiveCampaignData = async (data) => {
    let setUpData = JSON.parse(data.SetUpData);

    try {
      if (data.Type === "Add Contact to an Automation") {
        await AddContact_Automations(
          setUpData.APIUrl,
          setUpData.APIKey,
          setUpData.emailAddress,
          setUpData.automation
        );
      } else if (data.Type === "Create Note") {
        await AddContactNote(
          setUpData.APIUrl,
          setUpData.APIKey,
          setUpData.note,
          setUpData.emailAddress
        );
      } else if (data.Type === "Create Update Contact") {
        await AddUpdateActiveCampaignContact(
          setUpData.APIUrl,
          setUpData.APIKey,
          setUpData.emailAddress,
          this.state.firstName,
          this.state.lastName,
          this.state.phoneNumber,
          setUpData.listid,
          this.state.account,
          this.state.tags
        );
      } else if (data.Type === "Create Deal") {
        await CreateDeal_ActiveCampaign(
          setUpData.APIUrl,
          setUpData.APIKey,
          setUpData.emailAddress,
          setUpData.title,
          setUpData.value,
          setUpData.currency,
          setUpData.pipelineId,
          setUpData.owner,
          setUpData.stage,
          setUpData.group
        );
      } else if (localStorage.Type === "Update Deal") {
        await UpdateDeal_ActiveCampaign(
          setUpData.APIUrl,
          setUpData.APIKey,
          setUpData.dealId,
          setUpData.title,
          setUpData.value,
          setUpData.currency,
          setUpData.pipelineId,
          setUpData.owner,
          setUpData.stage,
          setUpData.group,
          setUpData.status
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  CreateCard = (data) => {
    let trelloSetUpData = JSON.parse(data.SetUpData);
    let FormModel = {
      idList: trelloSetUpData.idList,
      keepFromSource: "all",
      key: TRELLOAUTH_CREDENTIALS.API_KEY,
      token: trelloSetUpData.token,
      name: trelloSetUpData.cardName,
      desc: trelloSetUpData.desc,
    };
    let url = TRELLOAUTH_URLS.ADD_TRELLOCARD;

    try {
      PostDataWithoutBody(url, FormModel).then((result) => {
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
  CreateList = (data) => {
    let trelloSetUpData = JSON.parse(data.SetUpData);
    let FormModel = {
      idBoard: trelloSetUpData.idBoard,
      key: TRELLOAUTH_CREDENTIALS.API_KEY,
      token: trelloSetUpData.token,
      name: trelloSetUpData.name,
    };
    let url = TRELLOAUTH_URLS.ADD_TRELLOLIST;

    try {
      PostDataWithoutBody(url, FormModel).then((result) => {
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
  CreateBoard = (data) => {
    let trelloSetUpData = JSON.parse(data.SetUpData);
    let FormModel = {
      name: trelloSetUpData.name,
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
      token: trelloSetUpData.token,
    };

    let url = TRELLOAUTH_URLS.ADD_TRELLOBOARD;

    try {
      PostDataWithoutBody(url, FormModel).then((result) => {
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
  // getSlackSheet = () => {
  //   if (this.currentFormId != undefined) {
  //     const URL =
  //       "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getworksheetsetupbyformid/" +
  //       this.currentFormId;
  //     try {
  //       GetData(URL).then(result => {
  //         if (result != null && result.Count > 0) {
  //           this.setState({ slackData: result.Items[0] });
  //           this.sendSlackData(result.Items[0]);
  //         }
  //       });
  //     } catch {}
  //   }
  // };

  sendSlackData = (slackData) => {
    try {
      if (slackData.Type === "Slack Reminder") {
        this.setReminder(slackData);
      } else {
        this.sendTestMessgaeInChannel(slackData);
      }
    } catch (err) {}
  };
  sendTestMessgaeInChannel = (slackData) => {
    let slackSetUpData = Object.assign({}, JSON.parse(slackData.SetUpData));
    const bodyFormData = new FormData();
    bodyFormData.append("token", slackData.RefreshToken);
    bodyFormData.append("channel", slackSetUpData.channel);
    bodyFormData.append("text", slackSetUpData.text);
    // let t =
    //   slackData.Type === "Slack User"
    //     ? bodyFormData.append("as_user", true)
    //     : "";
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

  setReminder = (slackData) => {
    let slackSetUpData = Object.assign({}, JSON.parse(slackData.SetUpData));
    const bodyFormData = new FormData();
    bodyFormData.append("token", slackData.RefreshToken);
    bodyFormData.append("text", slackSetUpData.text);
    bodyFormData.append("time", slackSetUpData.time);
    bodyFormData.append("user", slackSetUpData.channel);
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
  submitGoogleintegrationData = () => {
    const SheetUpdateRowUrl = GOOGLEAUTH_URLS.UPDATEWORKSHEET_COLUMNS.replace(
      "{SheetID}",
      this.state.setUpWorkSheet.SheetID
    )
      .replace("{WorkSheetTitle}", this.state.setUpWorkSheet.WorkSheetTitle)
      .replace("{APIKEY}", GOOGLEAUTH_CRENDENTIALS.APIKEY);
    let arrSheetColumns = JSON.parse(
      this.state.setUpWorkSheet.WorkSheetColumns
    );
    let result = arrSheetColumns.map((data) => data.value);
    PostDataWithHeader(SheetUpdateRowUrl, this.state.header, {
      values: [result],
    });
  };

  refreshToken = (refreshtoken) => {
    const grant_type = "refresh_token";
    const client_id = GOOGLEAUTH_CRENDENTIALS.CLIENT_ID;
    const client_secret = GOOGLEAUTH_CRENDENTIALS.CLIENT_SECRET;
    // const redirect_uri = GOOGLEAUTH_CRENDENTIALS.REDIRECT_URI;
    const formData = new FormData();
    formData.append("grant_type", grant_type);
    formData.append("refresh_token", refreshtoken);
    formData.append("client_id", client_id);
    formData.append("client_secret", client_secret);
    fetch(GOOGLEAUTH_URLS.GET_GOOGLEAUTHTOKEN, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res.statusText);
        }
      })
      .then((json) => {
        const headers = {
          Authorization: "Bearer " + json.access_token,
          Accept: "application/json",
        };
        this.setState(
          { access_token: json.access_token, header: headers },
          () => {
            this.submitGoogleintegrationData();
          }
        );
      });
  };
  getDefaultPage = () => {
    const URL =
      SUCCESS_N_REDIRECTS_PAGE_URLS.GET_DEFAULT_PAGE_URL + this.currentFormId;
    try {
      GetData(URL).then((result) => {
        if (result.data.Count > 0) {
          let title = result.data.Items[0].PageTitle;
          let description = result.data.Items[0].Description;
          const myContent = {
            entityMap: {},
            blocks: [
              {
                key: "ag6qs",
                text: title,
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [
                  { offset: 0, length: title.length, style: "center" },
                ],
                entityRanges: [],
                data: {},
              },
              {
                key: "tysw2",
                text: description,
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [
                  { offset: 0, length: description.length, style: "RIGHT" },
                ],
                entityRanges: [],
                data: {},
              },
            ],
          };
          this.setState({ editorState: myContent });
        }
      });
    } catch (error) {
      console.log(SUCCESS_N_REDIRECTS_PAGE_URLS.GET_DEFAULT_PAGE_URL, error);
    }
  };
  getAllUrlParams = (url) => {
    let queryString = url ? url.split("?")[1] : window.location.search.slice(1);
    let obj = {};
    if (queryString) {
      queryString = queryString.split("#")[0];
      let arr = queryString.split("&");
      for (let i = 0; i < arr.length; i++) {
        let a = arr[i].split("=");
        let paramName = a[0];
        let paramValue = typeof a[1] === "undefined" ? true : a[1];
        paramName = paramName.toLowerCase();
        if (typeof paramValue === "string") paramValue = decodeURI(paramValue);
        if (paramName.match(/\[(\d+)?\]$/)) {
          let key = paramName.replace(/\[(\d+)?\]/, "");
          if (!obj[key]) obj[key] = [];
          if (paramName.match(/\[\d+\]$/)) {
            let index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            obj[key].push(paramValue);
          }
        } else {
          if (!obj[paramName]) {
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === "string") {
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            obj[paramName].push(paramValue);
          }
        }
      }
    }
    return obj;
  };
  updatedDefaultValue = (
    queryStringObject,
    preData,
    formJsonObj,
    IsIdMatch,
    keyState
  ) => {
    if (queryStringObject !== "") {
      const newPreData = preData.filter(function(predata) {
        return predata.id === keyState;
      });
      if (newPreData.length > 0) {
        for (let key in queryStringObject) {
          if (key === newPreData[0].id) {
            formJsonObj.defaultVal = Array.isArray(queryStringObject[key])
              ? queryStringObject[key].join(", ")
              : queryStringObject[key];
            IsIdMatch = true;
            break;
          }
        }
        if (!IsIdMatch) {
          for (let key in queryStringObject) {
            if (key === newPreData[0].key) {
              formJsonObj.defaultVal = Array.isArray(queryStringObject[key])
                ? queryStringObject[key].join(", ")
                : queryStringObject[key];
            }
          }
        }
      }
    }
    return formJsonObj.defaultVal;
  };

  updateState = () => {
    const preData = JSON.parse(sessionStorage.getItem("preFilledKeys"));
    const queryStringObject =
      window.location.search === ""
        ? ""
        : this.getAllUrlParams(window.location.search);
    for (let i = 0; i < this.formJSON.length; i++) {
      let formJsonObj = this.formJSON[i];
      let keyState = formJsonObj.key;
      formJsonObj.defaultVal = this.updatedDefaultValue(
        queryStringObject,
        preData,
        formJsonObj,
        false,
        keyState
      );
      if (formJsonObj.control === "price") {
        this.setState({
          [keyState]: formJsonObj.defaultVal ? formJsonObj.defaultVal : 10,
        });
      } else {
        this.setState({
          [keyState]: formJsonObj.defaultVal ? formJsonObj.defaultVal : "",
        });
      }
      if (formJsonObj.control === "date") {
        this.selectedDay = formJsonObj.selectedDay;
        this.selectedMonth = formJsonObj.selectedMonth;
        this.selectedYear = formJsonObj.selectedYear;
        let dateformat = formJsonObj.selectedFormat
          ? formJsonObj.selectedFormat
          : 1;
        this.updateDateState(keyState, dateformat);
      } else if (formJsonObj.control === "time") {
        this.hoursVal = formJsonObj.hoursVal;
        this.minutes = formJsonObj.minutes;
        this.timeFormat = formJsonObj.timeFormat;
        let format = formJsonObj.use24Hours ? formJsonObj.use24Hours : false;
        this.updateTimeState(keyState, format);
      }
    }

    let _this = this;
    _.find(this.formJSON, function(element) {
      if (element.control === "address") {
        let key = element.key;
        let addressFieldsJson = [
          {
            name: "Street",
            required: true,
            type: "text",
            id: "Street" + key,
            value: "",
          },
          {
            name: "City/Suburb",
            required: false,
            type: "text",
            id: "City" + key,
            value: "",
          },
          {
            name: "State",
            required: true,
            type: "text",
            id: "State" + key,
            value: "",
          },
          {
            name: "Country",
            required: true,
            type: "dropdown",
            id: "Country" + key,
            value: element.defaultVal ? element.defaultVal : "",
          },
          {
            name: "Zip/Post Code*",
            required: true,
            type: "text",
            id: "ZipCode" + key,
            value: "",
          },
        ];
        for (let t = 0; t < addressFieldsJson.length; t++) {
          _this.setState({
            [addressFieldsJson[t].id]: addressFieldsJson[t].value,
          });
        }
      }
    });
  };
  hexToRgb = (hex) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : null;
  };
  componentDidMount() {
    localStorage.setItem("previousClicked", false);

    this.updateState();
  }
  handlePriceSubmit(event) {
    event.preventDefault();
    this.showSubmit = false;
    this.setState({ showSubmission: true });
  }
  handlePriceChange(event, key) {
    priceValue = event.target.value || 0;
    const controlIndex = this.formJSON.findIndex((item) => item.key === key);
    if (controlIndex !== -1) {
      this.formJSON[controlIndex]["priceValue"] = Number(priceValue).toString();
      this.formJSON[controlIndex]["defaultVal"] = Number(priceValue).toString();
    }
    this.calculateTotalPrice();
  }
  calculateTotalPrice = () => {
    let priceList = [];
    // eslint-disable-next-line array-callback-return
    this.formJSON.map((data, i) => {
      if (data.control === "price") {
        const controlPrice =
          Number(data.priceValue) > -1 ? Number(data.priceValue) : 10;
        priceList.push(controlPrice);
      }
      if (data.control === "products") {
        const selectedProducts = data.productList.filter(
          (prod) => prod.isSelected === true
        );
        if (selectedProducts.length > 0) {
          selectedProducts.map((data, i) => {
            const controlPrice = Number(data.Price);
            const productCount = data.productCount
              ? Number(data.productCount)
              : 1;
            const productPrice = controlPrice * productCount;
            priceList.push(productPrice);
            return productPrice;
          });
        }
      }

      if (priceList.length > 0) {
        this.setState({
          isPricedItemInForm: true,
        });
      } else {
        this.setState({
          isPricedItemInForm: false,
        });
      }
      const sum = priceList.reduce(function(a, b) {
        return Number(a) + Number(b);
      }, 0);

      const taxValue =
        this.state.paymentConfigration &&
        this.state.paymentConfigration.TaxPercentage &&
        this.state.paymentConfigration.TaxPercentage !== ""
          ? (Number(this.state.paymentConfigration.TaxPercentage) / 100) * sum
          : 0;

      const processPercentageValue =
        this.state.paymentConfigration &&
        this.state.paymentConfigration.ProcessingFeePercentage &&
        this.state.paymentConfigration.ProcessingFeePercentage !== ""
          ? (Number(this.state.paymentConfigration.ProcessingFeePercentage) /
              100) *
            sum
          : 0;

      const processFeeAmount =
        this.state.paymentConfigration &&
        this.state.paymentConfigration.ProcessingFeeAmount &&
        this.state.paymentConfigration.ProcessingFeeAmount !== ""
          ? this.state.paymentConfigration.ProcessingFeeAmount
          : 0;

      const calculatedPrice =
        Number(sum) +
        Number(taxValue) +
        Number(processPercentageValue) +
        Number(processFeeAmount);

      this.setState({
        totalPriceValue: calculatedPrice.toFixed(2),
        basePriceValue: sum.toFixed(2),
        taxAmount: taxValue.toFixed(2),
        processingFeePercentage: processPercentageValue.toFixed(2),
        processingFeeAmount: processFeeAmount,
      });
    });
    if (
      this.state.paymentConfigration &&
      this.state.paymentConfigration.Currency
    ) {
      const currencyData = JSON.parse(this.state.paymentConfigration.Currency);
      this.setState({
        selectedCurrency: currencyData.value,
        currencySymbol: currencyData.symbol,
      });
    }
  };
  isValidEmail = (isValid, stateName) => {
    let el = document.getElementById("error_invalidEmail" + stateName);
    let lastAtPos = this.state[stateName].lastIndexOf("@");
    let lastDotPos = this.state[stateName].lastIndexOf(".");

    if (
      el &&
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        this.state[stateName].indexOf("@@") === -1 &&
        lastDotPos > 2 &&
        this.state[stateName].length - lastDotPos > 2
      )
    ) {
      el.style.display = "block";
      isValid = false;
      return false;
    } else {
      if (el) {
        el.style.display = "none";
        isValid = true;
        return true;
      }
      return true;
    }
  };

  isConfirmEmail = (isValid, stateName) => {
    let el = document.getElementById("error_confirmEmail" + stateName);
    if (
      el &&
      !(this.state[stateName].trim() === this.state.stateConfirmEmail)
    ) {
      el.style.display = "block";
      isValid = false;
      return false;
    } else {
      if (el) {
        el.style.display = "none";
        isValid = true;
        return true;
      }
      return true;
    }
  };
  isValidPhoneNumber = (isValid, stateName) => {
    let el = document.getElementById("error_invalidPhoneNumber" + stateName);
    let e2 = document.getElementById("error" + stateName);
    let targetValue = document.getElementById(stateName).value;
    if (e2 && this.state[stateName].trim() === "") {
      e2.style.display = "block";
      isValid = false;
      return false;
    } else if (el && targetValue && targetValue.indexOf("x") !== -1) {
      el.style.display = "block";
      isValid = false;
      return false;
    } else {
      if (el) {
        el.style.display = "none";
        return isValid ? true : false;
      }
      return isValid ? true : false;
    }
  };

  isUrlValid = (isValid, stateName) => {
    let res = this.state[stateName].match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%.~#?&//=]*)/g
    );
    let el = document.getElementById("error_invalidUrl" + stateName);
    if (el && res == null) {
      el.style.display = "block";
      isValid = false;
      return false;
    } else {
      if (el) {
        el.style.display = "none";
        isValid = true;
        return true;
      }
      return true;
    }
  };

  checkAppointmentValidation(control){
    if(control.defaultVal){
      if (control.appointmentMode == 'minutes') {
        if (
          control.defaultVal.day == '' || 
          control.defaultVal.date == '' || 
          control.defaultVal.timeslot == '' || 
          control.defaultVal.timezone == '' || 
          (control.defaultVal.timeslot && 
          (!control.defaultVal.timeslot.start || !control.defaultVal.timeslot.end))) {
          return false;
        } else {
          return true;
        }
      }
  
      if (control.defaultVal == 'days') {
        if (
          control.defaultVal.day == '' || 
          control.defaultVal.date == '' || 
          control.defaultVal.timezone == ''
        ) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
    
  }
  checkFormValidation = (formJSON) => {
    let isValid = true;
    for (let i = 0; i < formJSON.length; i++) {
      const stateName = formJSON[i].key;
      if (formJSON[i].control === "address") {
        if (formJSON[i].requiredQuestion !== false) {
          for (let t = 0; t < this.addressFieldsJson.length; t++) {
            let addressstateName = this.addressFieldsJson[t].id;
            let stateType = typeof this.state[addressstateName];
            let isStringBlank =
              stateType === "string"
                ? this.state[addressstateName].trim() === ""
                : stateType;
            if (
              this.addressFieldsJson[t].required &&
              (this.state[addressstateName] === [] ||
                isStringBlank === true ||
                this.state[addressstateName] === "")
            ) {
              let el = document.getElementById("error" + addressstateName);
              if (el) {
                el.style.display = "block";
                isValid = false;
              }
            } else {
              let el = document.getElementById("error" + addressstateName);
              if (el) {
                el.style.display = "none";
              }
            }
          }
        }
      } else if (formJSON[i].control === "signature") {
        const signatureName = formJSON[i].key;
        let el = document.getElementById("error" + signatureName);
        if (formJSON[i].requiredQuestion !== false) {
          if (
            this.state.trimmedDataURL == null ||
            this.state.trimmedDataURL === undefined
          ) {
            isValid = false;
            el.style.display = "block";
          } else {
            el.style.display = "none";
          }
        }
      } else if (formJSON[i].control === "price") {
        // let el = document.getElementById("error" + stateName);
        // if (formJSON[i].requiredQuestion !== false && el) {
        //   if (
        //     this.state.priceInitialValue == null ||
        //     this.state.priceInitialValue === undefined ||
        //     this.state.priceInitialValue === ""
        //   ) {
        //     isValid = false;
        //     el.style.display = "block";
        //   } else {
        //     el.style.display = "none";
        //   }
        // }
        if (minimumPriceValue !== undefined) {
          let priceError = document.getElementById("priceError" + stateName);
          if (minimumPriceValue > this.state.priceInitialValue) {
            isValid = false;
            priceError.style.display = "block";
          } else {
            priceError.style.display = "none";
          }
        }
      } else if (formJSON[i].control === "colorpicker") {
        let colorPickerObj = formJSON[i];
        let el = document.getElementById("colopickerError" + colorPickerObj.key);
        if (colorPickerObj.requiredQuestion && colorPickerObj.defaultVal == "") {
          if (el) {
            isValid = false;
            el.style.display = "block";
          }
        } else {
          if (el) {
            el.style.display = "none";
          }
        }
      }
      // appointment
      else if (formJSON[i].control === "appointment") {
        let dateObj = formJSON[i];
        let el = document.getElementById("appointmentError" + dateObj.key);
        if (formJSON[i].requiredQuestion && !this.checkAppointmentValidation(dateObj)) {
          if (el) {
            isValid = false;
            el.style.display = "block";
          } else {
            if (el) {
              el.style.display = "none";
            }
          }
        }
      }
      
      else if (formJSON[i].control === "date") {
        let dateObj = formJSON[i];

        let el = document.getElementById("dateError" + dateObj.key);

        if (formJSON[i].requiredQuestion !== false) {
          if (!this.selectedDay || !this.selectedMonth || !this.selectedYear) {
            if (el) {
              isValid = false;
              el.style.display = "block";
            }
          } else {
            if (el) {
              el.style.display = "none";
            }
          }
        }
      } else if (formJSON[i].control === "time") {
        let dateObj = formJSON[i];
        let el = document.getElementById("timeError" + dateObj.key);
        if (formJSON[i].requiredQuestion !== false) {
          if (!this.hoursVal || !this.minutes || !this.timeFormat) {
            if (el) {
              isValid = false;
              el.style.display = "block";
            }
          } else {
            if (el) {
              el.style.display = "none";
            }
          }
        }
      } else if (formJSON[i].control === "calculation") {
      } else {
        
        if (
          formJSON[i].requiredQuestion !== false &&
          formJSON[i].control !== "simpletext" &&
          formJSON[i].control !== "signature" &&
          formJSON[i].control !== "break" &&
          formJSON[i].control !== "image" &&
          formJSON[i].control !== "video"
        ) {
          let stateType = typeof this.state[stateName];
          let isStringBlank =
            stateType === "string"
              ? this.state[stateName].trim() === ""
              : stateType;
          if (
            formJSON[i].control === "dropdown" ||
            formJSON[i].control === "multiplechoice"
          ) {
            if (this.state["otherOption" + stateName] !== undefined) {
              var el = document.getElementById("errorotherOption" + stateName);
              if (this.state["otherOption" + stateName].trim() === "") {
                if (el) {
                  el.style.display = "block";
                  el.style.height = "25px";
                }
                isValid = false;
              } else {
                if (el) {
                  el.style.display = "none";
                  el.style.height = "0px";
                }
              }
            }
          }
          if (formJSON[i].control === "imageupload") {
            currentFileState = "files" + formJSON[i].key;
            let minimumFiles = localStorage.getItem("minimumFiles");
            if (this.state[currentFileState] !== undefined) {
              if (this.state[currentFileState][0].length < minimumFiles) {
                el = document.getElementById("imageError" + stateName);
                alert("Please select atleast : " + minimumFiles + "files");
              }
            }
          }
          if (
            this.state[stateName] === [] ||
            isStringBlank === true ||
            this.state[stateName] === ""
          ) {
            let el = document.getElementById("error" + stateName);
            if (el) {
              el.style.height = "25px";
              el.style.display = "block";
            }
            isValid = false;
          } else {
            let el = document.getElementById("error" + stateName);
            if (el) {
              el.style.height = "0px";
              el.style.display = "none";
            }
          }
        }
        if (formJSON[i].control === "email") {
          isValid = this.isValidEmail(isValid, stateName);
          if (this.state.ConfirmEmail)
            isValid = this.isConfirmEmail(isValid, stateName);
        }
        if (formJSON[i].control === "phonenumber") {
          isValid = this.isValidPhoneNumber(isValid, stateName);
        }
        if (formJSON[i].control === "url") {
          isValid = this.isUrlValid(isValid, stateName);
        }
        if (
          formJSON[i].minLength !== "" &&
          formJSON[i].minLength !== undefined
        ) {
          let el = document.getElementById("error_minLength" + stateName);
          if (
            el &&
            this.state[stateName].length < parseInt(formJSON[i].minLength)
          ) {
            el.style.display = "block";
            el.style.height = "25px";
            isValid = false;
          } else {
            if (
              el &&
              this.state[stateName].length >= parseInt(formJSON[i].minLength)
            ) {
              el.style.display = "none";
              el.style.height = "0px";
            }
          }
        }
      }    
  }
  return isValid;
  }

  FillCaptchaValid = (val, staticCaptchaVal) => {
    this.setState({ staticCaptcha: staticCaptchaVal, captchaVal: val });
  }

  CheckCaptchaValid() {
    if (this.state.staticCaptcha.toLowerCase() === "") {
      return false;
    } else {
      if (
        this.state.staticCaptcha.toLowerCase() ===
        this.state.captchaVal.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkGoogleConditions = () => {
    let conditionMatch = true;
    let googleSheetConditions = this.state.googleSheetConditions;
    let googleSheetConditionsLen = googleSheetConditions.length;
    if (googleSheetConditionsLen > 0) {
      let submiittedData = this.submitData;
      googleSheetConditions.forEach((element, index) => {
        _.find(submiittedData, function(el) {
          if (element.key === el.key) {
            if (el.questCondition === "is") {
              if (element.answerVal === el.value) {
                if (element.isShowAndOr && element.isAndOr === "and") {
                } else {
                  conditionMatch = true;
                }
              } else {
                if (
                  index !== 0 &&
                  googleSheetConditions[index - 1].isShowAndOr &&
                  googleSheetConditions[index - 1].isAndOr === "or"
                ) {
                  conditionMatch = true;
                } else {
                  conditionMatch = false;
                }
              }
            }
          }
        });
        if (index === googleSheetConditionsLen - 1) {
          return conditionMatch;
        }
      });
    } else {
      return conditionMatch;
    }
    return conditionMatch;
  };
  saveControlTime = () => {
    for (let i = 0; i < this.controlTimeList.length; i++) {
      let trackingData = Object.assign({}, this.controlTimeList[i]);
      trackingData.VisitCount = this.controlTimeList[i].VisitCount + 1;
      trackingData.UsedSession = this.controlTimeList[i].UsedSession + 1;
      trackingData.TrackingFields = JSON.stringify(
        this.controlTimeList[i].TrackingFields
      );
      trackingData.SubmissionCount =
        this.controlTimeList[i].SubmissionCount + 1;
      trackingData.FailedSubmission = this.controlTimeList[i].FailedSubmission;

      try {
        PostData(TRACKFORM_URLS.ADD_TRACKING_FORM, trackingData).then(
          (result) => {
            console.log("result update timing:", result);
            // this.getAccountList();
            this.setState({ isFormCreation: false });
          }
        );
      } catch (err) {
        //console.log(FORM_URLS.POST_FORM, err);
      }
    }
    let cntrlTimeList = _.map(this.controlTimeList, function(count) {
      count.SubmissionCount = count.SubmissionCount + 1;
      return count;
    });
    this.controlTimeList = cntrlTimeList;
  };

  saveFailedControlTime = () => {
    // let trackObj ={
    //   FormId : localStorage.CurrentFormId,
    //   ControlData : JSON.stringify(this.controlTimeList),
    //   UpdatedAt: Date.now().toString(),
    //   UpdatedBy: "1",
    // }

    for (let i = 0; i < this.controlTimeList.length; i++) {
      let trackingData = Object.assign({}, this.controlTimeList[i]);
      trackingData.VisitCount = this.controlTimeList[i].VisitCount + 1;
      trackingData.UsedSession = this.controlTimeList[i].UsedSession + 1;
      trackingData.TrackingFields = JSON.stringify(
        this.controlTimeList[i].TrackingFields
      );
      trackingData.FailedSubmission =
      this.controlTimeList[i].FailedSubmission + 1;
      //  this.controlTimeList[i].VisitCount=this.controlTimeList[i].VisitCount+1;
      //  this.controlTimeList[i].UsedSession=this.controlTimeList[i].UsedSession+1;
      //  this.controlTimeList[i].FailedSubmission=this.controlTimeList[i].FailedSubmission+1;
      //  this.controlTimeList[i].TrackingFields=JSON.stringify(this.controlTimeList[i].TrackingFields);

      try {
        PostData(TRACKFORM_URLS.ADD_TRACKING_FORM, trackingData).then(
          (result) => {
            console.log("result update timing:", result);
            // this.getAccountList();
            this.setState({ isFormCreation: false });
          }
        );
      } catch (err) {
        //console.log(FORM_URLS.POST_FORM, err);
      }
    }
    let cntrlTimeList = _.map(this.controlTimeList, function(failCount) {
      failCount.FailedSubmission = failCount.FailedSubmission + 1;
      return failCount;
    });
    this.controlTimeList = cntrlTimeList;
  };

  componentWillUnmount() {
    //this.saveControlTime();
  }

  handleSubmitWithPaymentCheck(event) {
    event.preventDefault();
    // let checkGoogleConditions = this.checkGoogleConditions();
    // console.log("checkGoogleConditions:", checkGoogleConditions);
    //  this.saveControlTime();

    if (this.state.requiredCaptcha) {
      if (!this.CheckCaptchaValid()) {
        alert("Please enter valid captcha.");
        return false;
      }
    }

    let isValid = this.checkFormValidation(this.formJSON);
    console.log("isValid", isValid);

    if (isValid) {
      if (this.state.isPaymentMethodSet && this.state.selectedPaymentMethod) {
        this.setState({ showPaymentCheckout: true });
      } else {
        this.setState({ showPaymentCheckout: false });
        this.handleSubmit(event, true);
      }
    }
  }

  handleSubmit = (event, isValidationChecked) => {
    console.log(this.submitData)
    if (event) {
      event.preventDefault();
    }
    if (isValidationChecked) {
      this.setState({
        showPaymentCheckout: false,
        submitting: true,
      });
    }
    // let checkGoogleConditions = this.checkGoogleConditions();
    // console.log("checkGoogleConditions:", checkGoogleConditions);
    //  this.saveControlTime();
    if (this.state.requiredCaptcha) {
      if (!this.CheckCaptchaValid()) {
        alert("Please enter valid captcha.");
        return false;
      }
    }
    var isValid= true;
    if (isValidationChecked === undefined) {
      isValid = this.checkFormValidation(this.formJSON);
    } 
    else if (!isValidationChecked) {
      isValid = this.checkFormValidation(this.formJSON);
    } else {
      isValid = true;
    }
    if (isValid) {
      try {
        GetData(
          FORM_URLS.GET_USER_VERIFIED_FORM_ID + this.currentFormId
        ).then((result) => {
          if (result.data && result.statusCode === 200) {
            let checkVerified = JSON.parse(result.data);

            if (checkVerified.isVerified === true) {
              this.saveControlTime();
              let submittedForm = {
                FormId: this.currentFormId,
                SubmissionId: DraftJS.genKey(),
                SubmittedData: JSON.stringify(this.submitData),
                UserId: "1",
                TotalPaid: 0,
                SubmittedAt: Date.now().toString(),
                PartialSubmission: false,
              };
              try {
                this.setState({ submitting: true });
                PostData(FORM_URLS.SUBMIT_FORM, submittedForm).then(async (result) => 
                {
                    await this.insertAppointmentToGoogleCalender(this.formJSON);
                    this.setState({ submitting: false, formSubmitted: true });
                });
              } catch (err) {
                console.log(FORM_URLS.SUBMIT_FORM, err);
              }
            } else {
              let submitError =
                "Forms can't be submitted until the owner's email address has been verified.";
              this.setState({ submitError: submitError, submitting: false });
            }
          } else {
            let submitError =
                "This forms doesn't exist";
              this.setState({ submitError: submitError, submitting: false });
          }
            // Need to check functionality
          //this.getWorkSheetSetupByFormId();

          // //To update successful Submission count
          // let trackObj = {
          //   FormId: this.currentFormId,
          //   VisitCount: this.trackDetails.VisitCount,
          //   FailedSubmission: this.trackDetails.FailedSubmission,
          //   SubmissionCount: this.trackDetails.SubmissionCount + 1,
          //   UpdatedAt: Date.now().toString(),
          //   UpdatedBy: "1",
          // };
          // this.trackDetails.SubmissionCount =
          //   this.trackDetails.SubmissionCount + 1;
          //   debugger;
          // this.updateFormTrack(trackObj);
          //this.saveControlTime();
        });
      } catch (err) {
        alert(
          this.state.translatedData["Somethingwentwrong"] ||
            "Something went wrong, please try again."
        );
      }
    } else {
      let submittedForm = {
        FormId: this.currentFormId,
        SubmissionId: DraftJS.genKey(),
        SubmittedData: JSON.stringify(this.submitData),
        UserId: "1",
        TotalPaid: 0,
        SubmittedAt: Date.now().toString(),
        PartialSubmission: true,
      };
      try {
        this.setState({ submitting: true });
        PostData(FORM_URLS.SUBMIT_FORM, submittedForm).then(async (result) => {
          await this.insertAppointmentToGoogleCalender(this.formJSON);
          this.setState({ submitting: false, formSubmitted: false });
        });
      } catch (err) {
        console.log(FORM_URLS.SUBMIT_FORM, err);
      }
      //To update failed Submission count
      //   let trackObj ={
      //     FormId : this.currentFormId,
      //     VisitCount: this.trackDetails.VisitCount,
      //     FailedSubmission:this.trackDetails.FailedSubmission +1 ,
      //     SubmissionCount:this.trackDetails.SubmissionCount,
      //     UpdatedAt: Date.now().toString(),
      //     UpdatedBy: "1",
      //   }
      // this.trackDetails.FailedSubmission=this.trackDetails.FailedSubmission +1;
      // this.updateFormTrack(trackObj);
      this.saveFailedControlTime();
      return false;
    }
  };

  insertAppointmentToGoogleCalender(formJSON) {

    formJSON.forEach((item) => {
      if(item.control === "appointment" && item.calender) {
        const setupId = item.calender.setupId;
        GetData(
          GOOGLEAUTH_URLS.GET_REFRESH_TOKEN_BY_SETUPID + setupId
        ).then( async (result) => {
          if(result.data){
            const parsedData = JSON.parse(result.data);
            const refreshToken = parsedData.Items[0].RefreshToken;
            const token = await getGoogleAccessTokenByRefreshToken(refreshToken);
            this.addToGoogleCalender(token, item.defaultVal);
          }
        });
      }
    })
  }



  addToGoogleCalender(headers, dataObj){
    const CalenderID = dataObj.connectedCalenderId;
    const startTime = dataObj.mode == "minutes" ? dataObj.timeslot.start : "00:00:00";
    const endTime = dataObj.mode == "minutes" ? dataObj.timeslot.end : "23:59:59";
    let attendees = [];
    if(dataObj.inviteEmails && dataObj.inviteEmails.length > 0){
      dataObj.inviteEmails.forEach(emailaddress => {
        if(this.ValidateEmail(emailaddress.trim())){
          attendees.push({email: emailaddress.trim()})
        }
      })
    }
    const bodyParameters = {
      "summary": dataObj.title,
      "description": dataObj.eventDescription,
      "start": {
        "dateTime": moment(dataObj.date +" "+ startTime).format(),
        "timeZone": dataObj.timezone
      },
      "end": {
        "dateTime": moment(dataObj.date +" "+ endTime).format(),
        "timeZone": dataObj.timezone
      },
    "attendees": attendees,
    "reminders": {
        "useDefault": false,
        "overrides": [
          {"method": "email", "minutes": Number(dataObj.notificationBefore) *60 }
          
        ]
      }
    };

    PostDataWithHeader(GOOGLEAUTH_URLS.INSERT_APPOINTMENT_TO_CALENDER + CalenderID + '/events', headers, bodyParameters).then(response => {
      console.log(response);
    }).catch(error => {
      console.log(error);
    });
  }

  ValidateEmail(mail) 
  {
    console.log(mail);
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(mail.match(mailformat))
    {
      return (true)
    } else {
      return (false)
    }
  }
  leapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  clear = (e) => {
    e.preventDefault();
    // Clears the signature pad / input field for signature
    this.sigPad.clear();
  };
  trim = (e) => {
    e.preventDefault();
    if (this.sigPad.isEmpty()) {
      this.setState({ trimmedDataURL: null });
    } else {
      let trimedURL = this.sigPad.getCanvas().toDataURL("image/png");
      this.setState({
        trimmedDataURL: trimedURL,
      });
    }
  };
  handleChange = (e, key) => {
    console.log(e, key);
    if (e.target.type !== "file") {
      let stateName = e.target.id;
      this.setState({ [stateName]: e.target.value });
      if (key !== undefined) this.matchQsAnsQsSetting(e, key);
    }
  };

  handleChangeEmail = (e) => {
    this.setState({ stateConfirmEmail: e.target.value });
  };

  handleCountryChange = (Value) => {
    this.setState({ country: Value });
  };

  handleCommonChange = (name, value) => {
    _.find(this.formJSON, function(element) {
      if (element.key === name) {
        element.defaultVal = value;
      }
    });
    this.setState({ [name]: value });
    if (value !== undefined) {
      let obj1 = {
        target: {
          value:
            value === undefined || value.value === undefined
              ? value
              : value.value,
        },
      };
      this.matchQsAnsQsSetting(obj1, name);
    }
    this.calculateTotalPrice();
  };
  handleProductCommonChange = (id, valueSctId, name, targetchecked) => {
    this.setState({ [name]: valueSctId });
    let obj1 = { target: { value: id } };
    this.matchQsAnsQsSetting(obj1, valueSctId);
  };
  changeValues = (name, value) => {
    this[name] = value;
  };
  setDate = (eventName, event, key, dateformat) => {
    this[eventName] = event;
    this.updateDateState(key, dateformat);
  };
  setTime = (eventName, event, key, format) => {
    this[eventName] = event;
    this.updateTimeState(key, format);
  };
  updateTimeState = (key, format) => {
    let time = "";
    if (this.hoursVal && this.minutes && this.timeFormat) {
      if (!format) {
        time = this.hoursVal.value + ":" + this.minutes.value;
      } else {
        time =
          this.hoursVal.value +
          ":" +
          this.minutes.value +
          " " +
          this.timeFormat.label;
      }
    }
    this.setState({ [key]: time });
  };
  updateDateState = (key, dateformat) => {
    let date = "";
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      if (!dateformat || dateformat === 1) {
        date =
          this.selectedDay.value +
          "-" +
          this.selectedMonth.value +
          "-" +
          this.selectedYear.value;
      } else if (dateformat === 2) {
        date =
          this.selectedMonth.value +
          "-" +
          this.selectedDay.value +
          "-" +
          this.selectedYear.value;
      } else if (dateformat === 3) {
        date =
          this.selectedYear.value +
          "-" +
          this.selectedMonth.value +
          "-" +
          this.selectedDay.value;
      }
    }
    this.setState({ [key]: date });
  };

  handleFileChange(event, key) {
    if (event !== undefined) {
      if (event.target.files[0] != null) {
        let FileName = event.target.files[0].name;
        let spllitter = FileName.lastIndexOf(".");
        let fileExtension = FileName.substring(spllitter + 1);
        if (
          fileExtension === "jpeg" ||
          fileExtension === "png" ||
          fileExtension === "jpg" ||
          fileExtension === "gif"
        ) {
          this.setState({
            ["file" + key.key]: URL.createObjectURL(event.target.files[0]),
            [key.key]: URL.createObjectURL(event.target.files[0]),
          });
        } else {
          this.setState({
            ["file" + key.key]: null,
            ["Extension" + key.key]: FileName,
            [key.key]: FileName,
          });
        }
      }
    }
  }

  fileSelectedHandler = (e, key) => {
    let filesArray = [];
    let selectedFiles = [];
    if (maximumFiles !== undefined) {
      for (let i = 0; i < e.target.files.length; i++) {
        filesArray.push(e.target.files[i]);
        selectedFiles.push(e.target.files[i].name);
      }
    }
    this.setState({
      ["files" + key.key]: [filesArray],
      [key.key]: selectedFiles,
    });
    //here added new line
    currentFileState = "files" + key.key;
    if (e.target.files.length > maximumFiles) {
      alert("You have exceeded the maximum range of files" + maximumFiles);
    }
  };

  renderSwitch = (
    type,
    key,
    placeholderText,
    confirmEmail,
    defaultAnswer_TextArea,
    errorMsg
  ) => {
    let inpHTML = "";
    if (confirmEmail === true) {
      inpHTML = (
        <>
          <Input
            type={type}
            id={key}
            class="test"
            name="email"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            size="30"
            defaultText={defaultAnswer_TextArea}
            placeholderData={placeholderText}
            onChange={(e) => this.handleChange(e, key)}
            confirmError={this.state.confirmError}
            translationInfo={this.state.translatedData}
          />
          <Input
            type={type}
            id="ConfirmEmail"
            class="test"
            name="email"
            size="30"
            placeholderData=""
            translationInfo={this.state.translatedData}
            onChange={(e) => this.handleChangeEmail(e, key)}
          />
        </>
      );
    } else {
      inpHTML = (
        <>
          <Input
            type={type}
            id={key}
            class="test"
            name="email"
            size="30"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            defaultText={defaultAnswer_TextArea}
            placeholderData={placeholderText}
            onChange={(e) => this.handleChange(e, key)}
            translationInfo={this.state.translatedData}
          />
        </>
      );
    }
    return inpHTML;
  };
  setValuesIntoTranslationState = (data) => {
    const translatedString = data;
    this.setState({
      translatedData: translatedString,
      textError: data.questionisrequired,
      urlError: data.validURL,
      confirmError: data.Confirmemail,
      isLoader: false,
    });
  };
  getTranslationData = async () => {
    try {
      await GetData(
        FORM_URLS.GET_SELECTED_TRANSLATION_FORM_ID + this.currentFormId
      ).then((result) => {
        if (result.data && result.data.Count > 0) {
          let resultItems = result.data.Items.find((item) => item.IsSelected);
          if (resultItems) {
            resultItems = JSON.parse(resultItems.TranslationInfo);
            this.setValuesIntoTranslationState(resultItems);
          }
          this.setState({ isLoader: false });
        } else {
          this.setState({ isLoader: false });
        }
      });
    } catch (err) {
      this.setState({ isLoader: false });
      alert("Something went wrong, please try again.");
    }
  };
  updateJSON = (json) => {
    this.formJSON = json;
  };

  handleSelectedProducts = (controlKey, productList) => {
    let selectedProductsSKU = [];
    let selectedPrices = [];
    productList.forEach((product) => {
      if (product.isSelected) {
        selectedProductsSKU.push(product.SKU);
        selectedPrices.push(product.Price);
      }
    });
    if (selectedPrices.length) {
      let sumValue = selectedPrices.reduce(function(a, b) {
        return Number(a) + Number(b);
      }, 0);
      this.formJSON[
        this.formJSON.findIndex((el) => el.key === controlKey)
      ].Price = String(sumValue);
    }
    this.setState({ [controlKey]: selectedProductsSKU });
    this.calculateTotalPrice();
  };
  getUrlVars = () => {
    let vars = [],
      hash;
    let hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = decodeURI(hash[1]);
    }
    return vars;
  };

  handleCalculationControl = (str, str1, stateValue) => {
    if (str === "" || str === "some error") {
      return "";
    }
    if (str1 && str1.includes("{{") && str1.includes("}}")) {
      const getInsideDoubleCurly = (str) =>
        str
          .split("{{")
          .filter((val) => val.includes("}}"))
          .map((val) => val.substring(0, val.indexOf("}}")));

      let isArray = false;
      let value1 = getInsideDoubleCurly(str1);

      for (let i = 0; i < value1.length; i++) {
        //89tua
        value1[i] = value1[i].replace(/ /g, "");
        str1 = this.RemoveSpacingFromBraces(str1, "");

        let stObject = this.state[value1[i]];
        if (stObject !== undefined) {
          if (Array.isArray(stObject)) {
            function extractColumn(arr, column) {
              return arr.map((x) => x[column]);
            }
            let extractColumnValue = extractColumn(stObject, "label").join(",");
            str1 = str1.replace("{{" + value1[i] + "}}", extractColumnValue);
            isArray = true;
          } else {
            let mainVal =
              typeof stObject == "object" ? stObject.label : stObject;
            str1 = str1.replace("{{" + value1[i] + "}}", mainVal);
          }
        } else {
          let mainVal = typeof stObject == "object" ? stObject.label : "";
          str1 = str1.replace("{{" + value1[i] + "}}", mainVal);
        }
      }
      // check code
      if (!str1.includes("||")) {
        if (!isArray && !str1.includes("||") && !/[A-Za-z]/.test(str1)) {
         //str = math.eval(str1);
          str = str1;
        } else {
          str = str1;
        }
      } else {
        str = str1.replace(/[||"]/g, "");
      }
    }
    if (stateValue !== undefined) {
      if (stateValue !== str) {
        this.setState({ calculationData: str });
      }
    }
    return str;
  };
  RemoveSpacingFromBraces = (str, replacement) => {
    if (typeof str !== "string" || typeof replacement !== "string") return str;

    let pattern = /\{\{([^\}\}]+)\}\}/gi,
      arr = str.match(pattern);

    arr.map((match) => {
      str = str.replace(match, match.replace(/\s/g, replacement));
    });
    return str;
  };
  onFocus = (key) => {
    if (this.controlTimeList.length > 0) {
      let focusedTime = Date.parse(new Date());
      _.map(
        this.controlTimeList,
        function(data) {
          _.map(
            data.TrackingFields,
            function(element) {
              if (
                key &&
                element.key ===
                  key
                    .replace("Country", "")
                    .replace("City", "")
                    .replace("ZipCode", "")
                    .replace("Street", "")
              ) {
                element.focusedTime = focusedTime;
                let elmtArr = _.map(this.interactedKeys, function(val) {
                  if (val === element.key) return val;
                });
                if (elmtArr.length === 0) {
                  element.interactionCount = element.interactionCount + 1;
                }
              }
            }.bind(this)
          );
        }.bind(this)
      );
    }
  };
  onBlur = (key) => {
    // let controlList = this.controlTimeList;
    if (this.controlTimeList.length > 0) {
      let bluredTime = Date.parse(new Date());
      _.map(this.controlTimeList, function(data) {
        _.map(data.TrackingFields, function(element) {
          if (
            element.key ===
            key
              .replace("Country", "")
              .replace("City", "")
              .replace("ZipCode", "")
              .replace("Street", "")
          ) {
            element.bluredTime = bluredTime;
            let diff =
              (bluredTime - element.focusedTime) / (data.VisitCount + 1);
            let averageTime = element.averageTime + diff;
            element.averageTime = averageTime;
          }
        });
      });
    }
  };
  createControlHtml(data, index) {
    // debugger;
    let type = data.control;
    this.controlType = type;
    let key = data.key;
    let isNewLine =
      data.isNewLine || data.isNewLine === undefined ? true : false;
    let placeholderText =
      data.placeholder === "" || data.placeholder === undefined
        ? ""
        : data.placeholder;
    let minLenth_TextArea = data.minLength ? data.minLength : "";
    let maxLenth_TextArea =
      data.maxLength === "" || data.maxLength === undefined
        ? ""
        : data.maxLength;
    let rows_TextArea =
      data.textareaRows === "" ||
      data.textareaRows === undefined ||
      data.textareaRows < 1
        ? "1"
        : data.textareaRows;

    let defaultAnswer_TextArea =
      data.defaultVal === "" || data.defaultVal === undefined
        ? this.getUrlVars()[key] !== undefined
          ? this.getUrlVars()[key]
          : this.state[key]
        : this.getUrlVars()[key] !== undefined
        ? this.getUrlVars()[key]
        : data.defaultVal;
    let confirmEmail = data.confirmEmail;
    let preFillTextArea = data.preFillKey !== "" ? data.preFillKey : data.key;

    this.controlKeyId.push({
      key: preFillTextArea,
      id: data.key,
    });
    const uniqueArray = this.controlKeyId.filter((i, index) => {
      return (
        index ===
        this.controlKeyId.findIndex((obj) => {
          return JSON.stringify(obj) === JSON.stringify(i);
        })
      );
    });
    sessionStorage.setItem("preFilledKeys", JSON.stringify(uniqueArray));
    if (data.isMultipleFileUpload !== undefined) {
      var isMultipleFileUpload = data.isMultipleFileUpload;
    }
    if (data.minimumFiles !== undefined) {
      minimumFiles = data.minimumFiles;
      localStorage.setItem("minimumFiles", minimumFiles);
    }
    if (data.maximumFiles && data.maximumFiles !== undefined) {
      maximumFiles = data.maximumFiles;
    }
    if (data.priceValue !== undefined) {
      priceValue = data.priceValue;
    } else {
      priceValue = this.state.priceInitialValue;
    }

    minimumPriceValue = data.minimumPriceValue;

    if (
      data.isPriceQuestionReadOnly !== undefined ||
      data.isPriceQuestionReadOnly != null
    ) {
      isPriceQuestionReadonly = data.isPriceQuestionReadOnly;
    }
    this.showSubmit = true;
    let inpHTML = "";
    // Calculation
    let isHideCalculationControl = true;
    if (type === "calculation") {
      isHideCalculationControl = data.hideQuestion;
    }

    switch (type) {
      case "":
      case "text":
        inpHTML = (
          <TextArea
            id={key}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            newLine={isNewLine}
            placeholderData={placeholderText}
            minLength={minLenth_TextArea}
            maxLength={maxLenth_TextArea}
            rows={rows_TextArea}
            defaultText={defaultAnswer_TextArea}
            parentMethod={this.matchQsAnsQsSetting}
            mainSelectedQsId={key}
            className={"test"}
            errorMessage={this.state.textError}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "email":
        inpHTML = (
          <>
            {this.renderSwitch(
              type,
              key,
              placeholderText,
              confirmEmail,
              defaultAnswer_TextArea
            )}
          </>
        );
        break;
      case "url":
        inpHTML = (
          <Input
            type="text"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            name="url"
            size="30"
            required="true"
            placeholderData={placeholderText}
            defaultText={defaultAnswer_TextArea}
            id={key}
            onChange={(e) => this.handleChange(e, key)}
            class="test"
            translationInfo={this.state.translatedData}
            urlError={this.state.urlError}
          />
        );
        break;
      case "yesno":
        let textValue = this.state[key];
        inpHTML = (
          <div className="YesNo">
            <RadioButtons
              class="btn-raised btn-primary"
              type="radio"
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              name="yesnoRadio"
              defaultVal={textValue ? textValue : defaultAnswer_TextArea}
              onChange={this.handleCommonChange}
              id={key}
              translationInfo={this.state.translatedData}
            />
          </div>
        );
        break;
      case "number":
        let prop = {
          type: "text",
          name: "number",
          inputMode: "numeric",
          required: "true",
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          placeholderData: placeholderText,
          defaultText: defaultAnswer_TextArea,
          minValue: data.minInputVal,
          maxValue: data.maxInputVal,
          selectedNumberFormat: data.selectedNumberFormat,
          isWholeNumber: data.isWholeNumber,
          id: key,
          className: "test",
        };

        inpHTML = (
          <Input
            onChange={this.handleCommonChange}
            {...prop}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "phonenumber":
        let phoneformat =
          data.selectedFormat !== undefined
            ? data.selectedFormat.value === "US Phone Number"
              ? "US"
              : data.selectedFormat.value === "AU Phone Number"
              ? "AU"
              : data.selectedFormat.value === "No Format"
              ? "NoFormat"
              : "Custom"
            : "NoFormat";
        inpHTML = (
          <PhoneNumber
            type="tel"
            name="add"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autocomplete="tel"
            class="test"
            placeholderchar="x"
            size="30"
            required="true"
            defaultText={defaultAnswer_TextArea}
            placeholderData={placeholderText}
            id={key}
            maxValue={data.maxLength}
            format={phoneformat}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "address":
        this.addressFieldsJson = [
          {
            name: "Street",
            required: true,
            type: "text",
            id: "Street" + key,
            value: "",
          },
          {
            name: "City/Suburb",
            required: false,
            type: "text",
            id: "City" + key,
            value: "",
          },
          {
            name: "State",
            required: true,
            type: "text",
            id: "State" + key,
            value: "",
          },
          {
            name: "Country",
            required: true,
            type: "dropdown",
            id: "Country" + key,
            value: "",
          },
          {
            name: "Zip/Post Code*",
            required: true,
            type: "text",
            id: "ZipCode" + key,
            value: "",
          },
        ];
        const props = {
          parentClass: "",
          class: "",
          handleInputChange: this.handleChange,
          setAddressFields: this.setAddressFields,
          handleCountryChange: this.handleCommonChange,
          data: data,
        };
        inpHTML = (
          <Address
            {...props}
            id={key}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "country":
        inpHTML = (
          <SelectControl
            name="country"
            options={countriesData}
            id={key}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            formJson={this.formJSON}
            value="text"
            updateJSON={this.updateJSON}
            defaultVal={defaultAnswer_TextArea}
            translationInfo={this.state.translatedData}
            handleChange={this.handleCommonChange}
          />
        );
        break;
      case "date":
        if (this.selectedDay) {
          data.selectedDay = this.selectedDay;
        } else {
          this.selectedDay = data.selectedDay ? data.selectedDay : "";
        }
        if (this.selectedMonth) {
          data.selectedMonth = this.selectedMonth;
        } else {
          this.selectedMonth = data.selectedMonth ? data.selectedMonth : "";
        }
        if (this.selectedYear) {
          data.selectedYear = this.selectedYear;
        } else {
          this.selectedYear = data.selectedYear ? data.selectedYear : "";
        }

        if (data.setDefaultAnsToday) {
          let currentDate = new Date();
          let date = currentDate.getDate(); //Current Date.
          let month = currentDate.getMonth() + 1; //Current Month.
          let year = currentDate.getFullYear(); //Current Year.
          data.selectedDay = { id: date, value: date, label: date };
          data.selectedMonth = { id: month, value: month, label: month };
          data.selectedYear = { id: year, value: year, label: year };
        }
        inpHTML = (
          <DateControl
            id={data.key}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            {...data}
            translationInfo={this.state.translatedData}
            setDate={this.setDate}
            handleChange={this.setDate}
          />
        );
        break;
      case "time":
        if (this.hoursVal) {
          data.hoursVal = this.hoursVal;
        } else {
          this.hoursVal = data.hoursVal ? data.hoursVal : "";
        }
        if (this.minutes) {
          data.minutes = this.minutes;
        } else {
          this.minutes = data.minutes ? data.minutes : "";
        }
        if (this.timeFormat) {
          data.timeFormat = this.timeFormat;
        } else {
          this.timeFormat = data.timeFormat ? data.timeFormat : "";
        }
        // if (!this.hoursVal || !this.minutes || !this.timeFormat)
        // this.hoursVal = data.hoursVal;
        // this.minutes = data.minutes;
        // this.timeFormat = data.timeFormat;
        inpHTML = (
          <Time
            name="time"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            id={data.key}
            {...data}
            handleChange={this.setTime}
            setTime={this.setDate}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "scale":
        if (!this.getUrlVars()[key]) {
          defaultAnswer_TextArea = data["scaleOptions"]
            ? data["scaleOptions"][defaultAnswer_TextArea]
            : this.state.scaleOptions[defaultAnswer_TextArea];
        }
        inpHTML = (
          <Scale
            id={data.key}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            {...data}
            onChange={this.handleScaleChange}
            defaultValue={defaultAnswer_TextArea}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "multiplechoice":
        let MultiChoiceOptions = data.MultiChoiceOptions;
        let multianswerquestion = data.multianswerquestion
          ? data.multianswerquestion
          : false;
        let defaultVal = data.defaultVal;
        if (
          typeof defaultAnswer_TextArea === "string" &&
          defaultAnswer_TextArea
        ) {
          defaultVal = {
            value: defaultAnswer_TextArea,
            label: defaultAnswer_TextArea,
          };
        }
        inpHTML = (
          <MultipleChoice
            id={key}
            multiChoiceOptions={
              MultiChoiceOptions
                ? MultiChoiceOptions
                : this.state.multiChoiceOptions
            }
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            multianswerquestion={multianswerquestion}
            minAnswer={data.minAnswer}
            maxAnswer={data.maxAnswer}
            defaultVal={defaultVal}
            otherOptionVal={data.otherOptionVal}
            handleChange={this.handleCommonChange}
            hideLabelFromImg={
              data.hideTextFromOption_MultipleChoice
                ? data.hideTextFromOption_MultipleChoice
                : false
            }
            addImageToOption_MultipleChoice={
              data.addImageToOption_MultipleChoice
                ? data.addImageToOption_MultipleChoice
                : false
            }
            ActiveColor={this.state.ActiveColor}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "dropdown":
        let options = data.Options;
        defaultVal =
          this.getUrlVars()[key] !== undefined
            ? options !== undefined
              ? options.find((o) => o.value === this.getUrlVars()[key])
              : defaultAnswer_TextArea
            : defaultAnswer_TextArea;
        inpHTML = (
          <SelectControl
            name="dropdown"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            options={options ? options : this.state.multiChoiceOptions}
            id={key}
            defaultVal={defaultVal}
            placeholder={data.placeholder}
            multi={data.multianswerquestion}
            otherOptionVal={data.otherOptionVal}
            handleChange={this.handleCommonChange}
            formJson={this.formJSON}
            updateJSON={this.updateJSON}
            translationInfo={this.state.translatedData}
          />
        );
        break;
      case "products":
        let buyMoreThanOneProduct = data.buyMoreThanOneProduct;
        let productSKU = data.SKU;
        let productName =
          data.productName === undefined ? "New Products" : data.productName;
        let productPrice = data.productPrice ? data.productPrice : 0;
        let productCount =
          data.productCount === undefined ? 1 : data.productCount;
        priceValue = Number(productPrice) * Number(productCount);
        inpHTML = (
          <Products
            name="products"
            id={key}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            productSKUId={productSKU}
            productName={productName}
            productPrice={productPrice}
            buyMoreThanOneProduct={buyMoreThanOneProduct}
            productCount={productCount}
            minQuantity={data.minQuantity}
            maxQuantity={data.maxQuantity}
            currencySymbol={this.state.currencySymbol}
            hideproductprices={
              data.hideproductprices ? data.hideproductprices : false
            }
            ProductList={
              data.productList === undefined
                ? this.defaultProductList
                : data.productList
            }
            productSelectedLayout={data.productSelectedLayout}
            defaultVal={data.defaultVal ? data.defaultVal : ""}
            handleSelectedProducts={this.handleSelectedProducts}
            handleInputChange={this.handleCommonChange}
            handleChange={this.handleProductCommonChange}
            index={index}
            formJSON={this.formJSON}
            ActiveColor={this.state.ActiveColor}
          />
        );
        break;
      case "video":
        let videosrc = key.src;
        if (videosrc.includes("watch")) {
          videosrc = videosrc.split("&");
          videosrc = videosrc[0].replace("watch?v=", "embed/");
        }
        inpHTML = (
          <figure class="md-block-image">
            <iframe
              title="myFrame"
              type="text/html"
              width="100%"
              height="400"
              src={videosrc}
              frameborder="0"
              allowFullScreen={true}
            />
            <figcaption class="md-block-image-caption" />
          </figure>
        );
        break;
      case "signature": {
        inpHTML = (
          <div>
            <div>
              <SignatureCanvas
                backgroundColor="rgba(246,246,246,1)"
                penColor="navy"
                ref={(ref) => {
                  this.sigPad = ref;
                }}
              />
            </div>
            <div>
              <button onClick={this.clear}>Clear</button>
              <button onClick={this.trim}>Save</button>
            </div>
            {this.state.trimmedDataURL ? (
              <img alt="Signature" src={this.state.trimmedDataURL} />
            ) : null}
          </div>
        );
        break;
      }
      //  code  of appointment started here
      //  here we need to pass everything

      case "colorpicker":
        inpHTML = (
          <ColorPickerComponent
            translationInfo={this.state.translatedData}
            formJSON={this.formJSON}
            id={key}
            from="previewForm"
            updateJSON={this.updateJSON}
            translationInfo={this.state.translatedData}
            handleChange={this.handleCommonChange}
          />
        );
        break;
      case "appointment": {
        inpHTML = (
          <AppointmentComponent
            translationInfo={this.state.translatedData}
            data={data}
            id={key}
            from="previewForm"
            handleChange={this.handleCommonChange}
          />
        );
        break;
      }
      case "imageupload":
        let fileState = "file" + key;
        if (isMultipleFileUpload !== true) {
          inpHTML = (
            <div>
              <span className="spanImagePreview">
                <input
                  type="file"
                  className="filePreview"
                  accept="image/*"
                  id={key}
                  onChange={(e) => this.handleFileChange(e, { key })}
                />
                <div className="File_label ">
                  {this.state.translatedData["Chooseafile"] || "Choose a file"}
                </div>
                <div id={key} className="imgPreview">
                  <img alt="" src={this.state[fileState]} />
                </div>
              </span>
            </div>
          );
        } else if (isMultipleFileUpload === true) {
          currentFileState = "files" + key;
          inpHTML = (
            <div>
              <span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id={key}
                  onChange={(e) => this.fileSelectedHandler(e, { key })}
                />
                {this.state[currentFileState] != null && (
                  <div id={key}>
                    {this.state[currentFileState][0].map((item, index) => {
                      return (
                        <div key={index}>
                          <li id={item.key}>{item.name}</li>
                        </div>
                      );
                    })}
                  </div>
                )}
              </span>
            </div>
          );
        }
        break;
      case "fileupload":
        let imageState = "file" + key;
        fileState = "Extension" + key;
        if (
          isMultipleFileUpload !== true ||
          isMultipleFileUpload === undefined
        ) {
          inpHTML = (
            <div>
              <span>
                <input
                  type="file"
                  id={key}
                  onChange={(e) => this.handleFileChange(e, { key })}
                />
                <div id={key}>
                  {this.state[imageState] != null && (
                    <img alt=" " src={this.state[imageState]} />
                  )}
                  {this.state[imageState] == null && (
                    <div> {this.state[fileState]} </div>
                  )}
                </div>
              </span>
            </div>
          );
        } else if (isMultipleFileUpload === true) {
          currentFileState = "files" + key;
          inpHTML = (
            <div>
              <span>
                <input
                  type="file"
                  multiple
                  accept="image"
                  id={key}
                  onChange={(e) => this.fileSelectedHandler(e, { key })}
                />
                {this.state[currentFileState] != null && (
                  <div id={key}>
                    {Object.keys(this.state[currentFileState][0]).map((key) => {
                      return (
                        <li key={key} className="image-name-div">
                          {this.state[currentFileState][0][key].name}
                        </li>
                      );
                    })}
                  </div>
                )}
              </span>
            </div>
          );
        }
        break;
      case "price":
        if (
          this.state.showSubmission === false &&
          isPriceQuestionReadonly === true
        ) {
          inpHTML = (
            <div>
              <input
                type="text"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                key={data.defaultVal}
                id={key}
                value={(this.state.currencySymbol || "$") + priceValue}
                readOnly={true}
              />
            </div>
          );
        } else if (
          isPriceQuestionReadonly === false &&
          this.state.showSubmission === false
        ) {
          inpHTML = (
            <div>
              <input
                type="number"
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                id={key}
                onChange={(e) => this.handlePriceChange(e, key)}
                value={priceValue}
              />
            </div>
          );
        }
        break;
      case "calculation":
        if (isHideCalculationControl === false) {
          inpHTML = (
            <div>
              <input
                type="text"
                id={key}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                value={this.handleCalculationControl(
                  data.livePreview,
                  data.calculationQuestion,
                  this.state.calculationData
                )}
                readOnly={true}
                className={"CalculationLivePreview"}
              />
            </div>
          );
        }
        break;
      default:
        inpHTML = <div />;
        break;
    }
    return inpHTML;
  }
  renderForm(arrayIndexValue, formJSON) {
    let breaks = [];
    formJSON = this.formJSON;
    const figureStyle = {};
    this.submitData = [];
    let formUI = formJSON.map((frmData, i) => {
      let addQuestionAnswerDataObj = JSON.parse(
        localStorage.getItem("addQuestionAnswer")
      );
      if (
        addQuestionAnswerDataObj &&
        addQuestionAnswerDataObj !== undefined &&
        addQuestionAnswerDataObj.length > 0
      ) {
        let filterAddQuestionAnswerDataObj = addQuestionAnswerDataObj.filter(
          (val) => {
            let _maianClickedQsId = val.maianClickedQsId;
            _maianClickedQsId = _maianClickedQsId
              ? _maianClickedQsId.split("visibility")
              : "";
            if (_maianClickedQsId && _maianClickedQsId[1] === frmData.key) {
              return val;
            }
            return val;
          }
        );
        if (
          filterAddQuestionAnswerDataObj !== undefined &&
          filterAddQuestionAnswerDataObj.length > 0
        ) {
          frmData.isHideQuestion = true;
          frmData.ListOfQuestionForSettings = filterAddQuestionAnswerDataObj;
        }
      } else {
      }

      let key = frmData.key;
      let type = frmData.control || "text";
      let questLabel = frmData.title || "";
      let helpLabel = frmData.link || "";
      let props = frmData.props || {};
      let imgStyle = {};
      let textType = frmData.type;
      let videosrc = "";

      let questionRequired = frmData.requiredQuestion === false ? false : true;
      if (breaks.length > 0 && i === formJSON.length - 1) {
        breaks.push(i);
      }
      if (type === "image") {
        imgStyle = frmData.props.imgStyle;
      } else if (type === "video") {
        videosrc = frmData.src;
        if (videosrc.includes("watch")) {
          videosrc = videosrc.split("&");
          videosrc = videosrc[0].replace("watch?v=", "embed/");
        }
      } else if (type === "break") {
        breaks.push(i);
        initialValue = breaks[0];
        endValue = formJSON.length - 1;
      } else if (type === "simpletext") {
        let text = frmData.text;

        let boldText = [];
        let ItalicText = [];
        if (frmData.textStyle.length > 0) {
          for (let j = 0; j <= frmData.textStyle.length - 1; j++) {
            if (frmData.textStyle[j].style === "BOLD") {
              let textStyle = frmData.textStyle[j];
              let formattedTextBold = text.slice(
                textStyle.offset,
                textStyle.length + textStyle.offset
              );
              boldText.push(formattedTextBold);
            } else {
              let textStyleItalic = frmData.textStyle[j];
              let formattedItalicText = text.slice(
                textStyleItalic.offset,
                textStyleItalic.length + textStyleItalic.offset
              );
              ItalicText.push(formattedItalicText);
            }
          }
          if (boldText.length > 0) {
            for (let bold = 0; bold <= boldText.length - 1; bold++) {
              text = text.replace(
                boldText[bold],
                "<b>" + boldText[bold] + "</b>"
              );
            }
          }
          if (ItalicText.length > 0) {
            for (let italic = 0; italic <= ItalicText.length - 1; italic++) {
              text = text.replace(
                ItalicText[italic],
                "<em>" + ItalicText[italic] + "</em>"
              );
            }
          }
        }
        switch (textType) {
          case "unstyled": {
            unstyledText = "<p class='paragraph'>" + text + "</p>";
            break;
          }
          case "unordered-list-item": {
            unorderedText = "<ul> <li>" + text + "</li> </ul>";
            break;
          }
          case "orderedsubmitData-list-item": {
            orderedText = "<ol> <li>" + text + "</li> </ol>";
            break;
          }
          case "header-two": {
            headerTwoText = "<h2 class='hTag2'>" + text + "</h2>";
            break;
          }
          case "blockquote": {
            blockQuoteText = "<blockquote>" + text + "</blockquote>";
            break;
          }
          case "header-one": {
            headerOneText = "<h1 class='hTag'>" + text + "</h1>";
            break;
          }
          case "rightAlign": {
            alignmentText = "<div class=text-right>" + text + "</div>";
            break;
          }
          case "leftAlign": {
            alignmentText = "<div class=text-left>" + text + "</div>";
            break;
          }
          case "centerAlign": {
            alignmentText = "<div class=text-center>" + text + "</div>";
            break;
          }
          default:
            alignmentText = "not found";
        }

        // let formattedText = "<" + v.type + ">" + text + "</" + v.type + ">";
        simpletext.push(i);
      }
      if (
        type !== "image" &&
        type !== "break" &&
        type !== "video" &&
        type !== "simpletext"
      ) {
        if (type === "address") {
          let fieldObj = {
            key: frmData.key,
            title: frmData.title,
            value: {
              street: null,
              city: null,
              state: null,
              zipcode: null,
              country: null,
            },
          };
          for (let t = 0; t < this.addressFieldsJson.length; t++) {
            let addressstateName = this.addressFieldsJson[t].id;

            if (
              addressstateName.indexOf(frmData.key) > -1 &&
              addressstateName.indexOf("Street") > -1
            ) {
              fieldObj.value.street = this.state[addressstateName];
            }
            if (
              addressstateName.indexOf(frmData.key) > -1 &&
              addressstateName.indexOf("City") > -1
            ) {
              fieldObj.value.city = this.state[addressstateName];
            }
            if (
              addressstateName.indexOf(frmData.key) > -1 &&
              addressstateName.indexOf("State") > -1
            ) {
              fieldObj.value.state = this.state[addressstateName];
            }
            if (
              addressstateName.indexOf(frmData.key) > -1 &&
              addressstateName.indexOf("ZipCode") > -1
            ) {
              fieldObj.value.zipcode = this.state[addressstateName];
            }
            if (
              addressstateName.indexOf(frmData.key) > -1 &&
              addressstateName.indexOf("Country") > -1
            ) {
              fieldObj.value.country = this.state[addressstateName].value;
            }
          }
          this.submitData.push(fieldObj);
        } else if (type === "date") {
          let fieldObj = {
            key: frmData.key,
            value: this.state[frmData.key],
            title: frmData.title,
          };
          this.submitData.push(fieldObj);
        } else if (type === "calculation") {
          let fieldObj = {
            key: frmData.key,
            value: this.state["calculationData"],
            title: frmData.title,
          };
          this.submitData.push(fieldObj);
        } else if (type === "appointment" && frmData.defaultVal) {
          
          if(frmData.defaultVal.mode === "minutes"){

            const fieldValue = frmData.defaultVal.title + ' - ' 
            + frmData.defaultVal.date + ' ' 
            + frmData.defaultVal.timeslot.start + ' to '
            + frmData.defaultVal.date + ' ' 
            + frmData.defaultVal.timeslot.end + ' ' 
            + '(' +frmData.defaultVal.timezone + ')';

            let fieldObj = {
              key: frmData.key,
              value: fieldValue,
              title: frmData.title,
              defaultValue:frmData.defaultVal
            };

            this.submitData.push(fieldObj);

          } else {

            const fieldValue = frmData.defaultVal.title + ' - ' 
            + frmData.defaultVal.date + ' '
            + '(' +frmData.defaultVal.timezone + ')';

            let fieldObj = {
              key: frmData.key,
              value: fieldValue,
              title: frmData.title,
              defaultValue:frmData.defaultVal
            };

            this.submitData.push(fieldObj);
          }
        } else {
          let fieldObj = {
            key: frmData.key,
            value: "",
            title: frmData.title,
          };
          if (type === "scale") {
            let index = this.state[frmData.key];
            fieldObj = {
              key: frmData.key,
              value: frmData["scaleOptions"]
                ? frmData["scaleOptions"][index]
                : this.state.scaleOptions[index],
              title: frmData.title,
            };
          } else {
            fieldObj = {
              key: frmData.key,
              value: this.state[frmData.key],
              title: frmData.title,
            };
          }
          this.submitData.push(fieldObj);
        }
      }
      // let errorMsgId = "error" + key;
      let errorPriceId = "priceError" + key;

      return (
        <div key={key} id={"visibility" + key} hidden={frmData.isHideQuestion}>
          {type !== "image" &&
            type !== "break" &&
            type !== "video" &&
            type !== "simpletext" && (
              <div
                className={`field-input field-space ${
                  this.state.backgroundShadow ? "no-class" : "backgroundShadow"
                }`}
                style={{ fontFamily: this.state.selectedPrimaryFontFamily }}
              >
                <div>
                  <label
                    className="QuestionLabel"
                    style={this.state.questionTitleStyles}
                    htmlFor={key}
                  >
                    {questLabel}
                    {this.state.requiredAsterick &&
                      questionRequired &&
                      questLabel !== "" && <span>*</span>}
                  </label>
                  <br />
                  {helpLabel && (
                    <label
                      className="DescriptionLabel"
                      style={this.state.QuestionDescStyles}
                      htmlFor={key}
                    >
                      {helpLabel}
                    </label>
                  )}
                  <br />
                  {this.createControlHtml(frmData, i)}
                  {/* <div
                    className="field__error"
                    style={{ backgroundColor: this.state.WarningColor }}
                    // id={errorMsgId}
                  >
                    {this.errorMessage}
                  </div> */}
                  {type === "price" && (
                    <span
                      id={errorPriceId}
                      className="field__error"
                      style={{ backgroundColor: this.state.WarningColor }}
                    >
                      PLEASE ENTER A NUMBER GREATER THAN OR EQUAL TO{" "}
                      {minimumPriceValue}
                    </span>
                  )}
                </div>
              </div>
            )}
          {type === "break" && (
            <div className="field-input field-space text-center">
              <PaginationButtons
                paginationButtons={this.state.paginationButtons}
                breaks={breaks}
                initialValue={initialValue}
                endValue={endValue}
                index={i}
                getPreviousContent={(e) =>
                  this.getPreviousContent(e, breaks, i)
                }
                getContentByPage={(selectedValue, breaksArray) =>
                  this.getContentByPage(selectedValue, breaksArray)
                }
                getContent={(e) => this.getContent(e, breaks)}
              />
            </div>
          )}
          {breaks.length > 0 && i === formJSON.length - 1 && (
            <div className="field-input field-space text-center">
              <PaginationButtons
                paginationButtons={this.state.paginationButtons}
                breaks={breaks}
                initialValue={initialValue}
                endValue={endValue}
                index={i}
                getPreviousContent={(e) =>
                  this.getPreviousContent(e, breaks, i)
                }
                getContentByPage={(lastValue, selectedValue, breaksArray) =>
                  this.getContentByPage(lastValue, selectedValue, breaksArray)
                }
                getContent={(e) => this.getContent(e, breaks)}
              />
            </div>
          )}
          {type === "video" && (
            <div className="field-input field-space">
              <figure className="md-block-image">
                <iframe
                  title="myFrame"
                  type="text/html"
                  width="100%"
                  height="400"
                  src={videosrc}
                  frameborder="0"
                  allowFullScreen={true}
                />
                <figcaption className="md-block-image-caption" />
              </figure>
            </div>
          )}
          {type === "image" && (
            <div className="field-input field-space">
              <figure className="md-block-image" style={figureStyle}>
                <img
                  src={frmData.src}
                  alt=""
                  id={frmData.key}
                  height={props.height}
                  width={props.width}
                  style={imgStyle}
                />
                <figcaption className="md-block-image-caption" />
              </figure>
            </div>
          )}
          {type === "simpletext" && textType === "unstyled" && (
            <div dangerouslySetInnerHTML={{ __html: unstyledText }} />
          )}
          {type === "simpletext" && textType === "unordered-list-item" && (
            <div dangerouslySetInnerHTML={{ __html: unorderedText }} />
          )}
          {type === "simpletext" && textType === "ordered-list-item" && (
            <div dangerouslySetInnerHTML={{ __html: orderedText }} />
          )}
          {type === "simpletext" && textType === "header-two" && (
            <div dangerouslySetInnerHTML={{ __html: headerTwoText }} />
          )}
          {type === "simpletext" && textType === "blockquote" && (
            <div dangerouslySetInnerHTML={{ __html: blockQuoteText }} />
          )}
          {type === "simpletext" && textType === "header-one" && (
            <div dangerouslySetInnerHTML={{ __html: headerOneText }} />
          )}
          {type === "simpletext" &&
            (textType === "rightAlign" ||
              textType === "leftAlign" ||
              textType === "centerAlign") && (
              <div dangerouslySetInnerHTML={{ __html: alignmentText }} />
            )}

          {i === formJSON.length - 1 && this.state.requiredCaptcha && (
            <CaptchaControl CaptchaValue={this.FillCaptchaValid} />
          )}

          {i === formJSON.length - 1 &&
            this.showSubmit === true &&
            this.state.isPricedItemInForm === false && (
              // this.controlType != "price" &&
              // this.controlType !== "products" &&
              <div className="submit">
                {this.state.submitButtonSettings !== "" && (
                  <span className="btn-raised btn-primary __checkout_btn_ref">
                    <button
                      onClick={this.handleSubmit}
                      className="Dynamic_sub_button"
                      disabled={this.state.submitting}
                      style={{
                        ...this.state.submitButtonSettings,
                        lineHeight: this.state.submitButtonSettings.lineHeight,
                        color: this.toColorString(
                          this.state.submitButtonSettings.color
                        ),
                        background: this.toColorString(
                          this.state.submitButtonSettings.background
                        ),
                      }}
                    >
                      {this.state.submitting
                        ? this.state.translatedData["Submitting"] ||
                          "Submitting..."
                        : "Submit"}
                    </button>
                  </span>
                )}

                {this.state.submitButtonSettings === "" &&
                  this.state.isPricedItemInForm === false && (
                    <span className="btn-raised btn-primary __checkout_btn_ref">
                      <button
                        onClick={this.handleSubmit}
                        className="sub_button_prev"
                        disabled={this.state.submitting}
                      >
                        {this.state.submitting
                          ? this.state.translatedData["Submitting"] ||
                            "Submitting..."
                          : "Submit"}
                      </button>
                    </span>
                  )}
                {this.state.submitError && (
                  <div className="SubmissionErrors">
                    <span className="SubmissionErrors__unknown">
                      {this.state.submitError}
                    </span>
                  </div>
                )}
              </div>
            )}
          {i === formJSON.length - 1 &&
            this.showSubmit === true &&
            // (this.controlType == "price" || this.controlType == "products") &&
            this.state.showSubmission === false &&
            this.state.isPricedItemInForm === true && (
              <div>
                <span className="btn-raised btn-primary __checkout_btn_ref">
                  <button
                    onClick={this.handleSubmitWithPaymentCheck}
                    className="sub_button_prev"
                    disabled={this.state.submitting}
                  >
                    {this.state.submitting
                      ? this.state.translatedData["Submitting"] ||
                        "Submitting..."
                      : "Submit -- " +
                        (this.state.currencySymbol || "$") +
                        this.state.totalPriceValue}
                  </button>
                </span>
                {this.state.submitError && (
                  <div className="SubmissionErrors">
                    <span className="SubmissionErrors__unknown">
                      {this.state.submitError}
                    </span>
                  </div>
                )}
              </div>
            )}
        </div>
      );
    });
    let QuestionEditing = formUI;
    let checkPreviousClicked = localStorage.getItem("previousClicked");
    if (breaks.length > 0) {
      if (checkPreviousClicked !== "true") {
        for (let i = 0; i <= breaks.length - 1; i++) {
          if (breaks[i] !== 0) {
            if (arrayIndexValue !== 0) {
              while (
                breaks[i] < arrayIndexValue ||
                breaks[i] === arrayIndexValue
              ) {
                i++;
              }
            }
            if (breaks[i] !== undefined) {
              QuestionEditing = formUI.slice(arrayIndexValue, breaks[i] + 1);
            } else {
              QuestionEditing = formUI.slice(arrayIndexValue, formUI.length);
            }
            let currentIndex = breaks[i] + 1;
            localStorage.setItem("previousArrayIndex", arrayIndexValue);
            localStorage.setItem("arrayIndexValue", currentIndex);
            break;
          }
        }
      } else {
        let currentIndex = breaks.indexOf(arrayIndexValue);
        let startIndexVal = breaks[currentIndex - 2];
        let endIndexVal = breaks[currentIndex - 1];
        if (endIndexVal === breaks[0]) {
          localStorage.setItem("previousArrayIndex", 0);
          localStorage.setItem("arrayIndexValue", endIndexVal + 1);
          QuestionEditing = formUI.slice(0, endIndexVal + 1);
        } else {
          localStorage.setItem("previousArrayIndex", startIndexVal);
          localStorage.setItem("arrayIndexValue", endIndexVal + 1);
          QuestionEditing = formUI.slice(startIndexVal + 1, endIndexVal + 1);
        }
      }
    } else {
      QuestionEditing = formUI;
    }
    this.formJSON = formJSON;
    localStorage.removeItem("formJSON");
    localStorage.setItem("formJSON", JSON.stringify(formJSON));
    return QuestionEditing;
  }

  getContent = (e, breaks) => {
    let previousArrayIndex = localStorage.getItem("previousArrayIndex");
    let currentArrayIndex = localStorage.getItem("arrayIndexValue");

    let validatingJSON = this.formJSON.slice(
      previousArrayIndex,
      currentArrayIndex - 1
    );
    let isValidForm = this.checkFormValidation(validatingJSON);
    if (isValidForm) {
      localStorage.setItem("previousClicked", false);
      if (breaks != null) {
        let arrayIndexValue = localStorage.getItem("arrayIndexValue");
        this.renderForm(arrayIndexValue, this.formJSON);
        this.setState({ arrayIndex: arrayIndexValue });
      }
    }
  };
  getPreviousContent = (e, breaks, currentIndexValue) => {
    let currentIndex = breaks.indexOf(currentIndexValue);
    let previousIndexVal = breaks[currentIndex - 1]; //last index
    if (breaks != null) {
      this.setState({ previousClicked: true });
      localStorage.setItem("previousClicked", true);
      let arrayIndexValue = currentIndexValue;
      this.renderForm(previousIndexVal, this.formJSON);
      this.setState({ arrayIndex: arrayIndexValue });
    }
  };
  getContentByPage = (selectedIndexValue, breaks) => {
    let selectedIndex = breaks.indexOf(selectedIndexValue);
    // let nextIndexValue = breaks[selectedIndex + 1]
    //   ? breaks[selectedIndex + 1]
    //   : selectedIndex;
    let prevIndexValue = breaks[selectedIndex - 1]
      ? breaks[selectedIndex - 1]
      : 0;

    let previousArrayIndex = localStorage.getItem("previousArrayIndex");
    // let currentArrayIndex = localStorage.getItem("arrayIndexValue");
    if (previousArrayIndex > selectedIndexValue) {
      if (breaks != null) {
        const startValue = prevIndexValue > 0 ? prevIndexValue + 1 : 0;
        this.renderForm(prevIndexValue + 1, this.formJSON);
        this.setState({ arrayIndex: startValue });
      }
    } else {
      // let validatingJSON = this.formJSON.slice(
      //   previousArrayIndex,
      //   currentArrayIndex - 1
      // );
      let validatingJSON = this.formJSON.slice(
        0, // To check all pages validation before going selected page
        prevIndexValue + 1
      );
      let isValidForm = this.checkFormValidation(validatingJSON);
      if (isValidForm) {
        if (breaks != null) {
          const startValue = prevIndexValue > 0 ? prevIndexValue + 1 : 0;
          this.renderForm(prevIndexValue + 1, this.formJSON);
          this.setState({ arrayIndex: startValue });
        }
      }
    }
  };
  saveFieldData = async () => {
    let formJSON = [];
    let captchaRes = await this.getCaptcha();
    let response = await this.getAscyncdata(
      FORM_URLS.GET_FORM_BY_ID_URL + this.props.match.params.formId
    );

    let resp = await this.asyncCallForPreview(response);

    let dataOfFormJsonClearCondationsObj =
      localStorage.CurrentFormId === undefined
        ? JSON.parse(localStorage.getItem("formJSON"))
        : JSON.parse(localStorage.getItem("formJSON"));

    if (
      dataOfFormJsonClearCondationsObj !== undefined &&
      dataOfFormJsonClearCondationsObj &&
      dataOfFormJsonClearCondationsObj.length > 0
    ) {
      dataOfFormJsonClearCondationsObj.forEach((frmJsnClearObj) => {
        if (
          !isNullOrUndefined(frmJsnClearObj.ListOfQuestionForSettings) &&
          frmJsnClearObj.ListOfQuestionForSettings.length > 0
        ) {
          frmJsnClearObj.ListOfQuestionForSettings.forEach(
            (listForSettings) => {
              delete listForSettings.isAddedQuestionAnswer;
              delete listForSettings.qsOfAnswerMathched;
            }
          );
        }
      });
      localStorage.removeItem("formJSON");
      localStorage.setItem(
        "formJSON",
        JSON.stringify(dataOfFormJsonClearCondationsObj)
      );
    }

    if (localStorage.getItem("formRequireCaptcha") !== undefined) {
      if (localStorage.getItem("formRequireCaptcha")) {
        this.setState({ requiredCaptcha: true });
      }
    }
    this.formJSON = this.state.formJSON
      ? JSON.parse(localStorage.formJSON)
      : [];
    this.setState({
      previewData: localStorage.pageData,
      formJSON: this.formJSON,
    });

    setTimeout(function() {}, 2000);
    localStorage.setItem("previousClicked", false);

    this.updateState();
  };

  getCaptcha = async () => {
    GetData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getformbehaviour/" +
        this.props.match.params.formId
    ).then((data) => {
      if (data != null && data.data.Items.length > 0) {
        let currentDate = new Date();
        if (data.statusCode === 200) {
          if (
            data.data.Items[0].DisableSubmission ||
            (data.data.Items[0].DisableAfterMaxOfSubmission &&
              data.data.Items[0].MaxSubmission <=
                this.props.FormData.SubmissionCount) ||
            (data.data.Items[0].SubmissionCloseDateTime != null &&
              new Date(data.data.Items[0].SubmissionCloseDateTime) <=
                new Date(currentDate.toISOString())) ||
            (data.data.Items[0].SubmissionOpenDateTime != null &&
              new Date(data.data.Items[0].SubmissionOpenDateTime) >
                new Date(currentDate.toISOString()))
          ) {
            if (data.data.Items[0].CustomCloseSubmissionPage) {
              localStorage.setItem("CustomCloseSubmissionPage", true);
              localStorage.setItem(
                "SubmissionPageData",
                data.data.Items[0].SubmissionPageData
              );
            }
            window.open("../preview/SubmissionClosed", "_blank");
          } else {
            if (data.data.Items[0].RequireCaptcha) {
              localStorage.setItem("formRequireCaptcha", true);
            } else {
              localStorage.removeItem("formRequireCaptcha");
            }
            // window.open("../preview/PreviewForm/"+localStorage.CurrentFormId, "_blank");
          }
        }
      } else {
        localStorage.removeItem("formRequireCaptcha");
        // window.open("../preview/PreviewForm/"+localStorage.CurrentFormId, "_blank");
      }
    });
  };

  getAscyncdata = async (url) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  asyncCallForPreview = async (response) => {
    let formJSON = [];
    if (response != null) {
      let result = response;
      const rawValue = convertToRaw(
        editorStateFromRaw(
          JSON.parse(result.Item.EditorState)
        ).getCurrentContent()
      );
      let text = [];
      let type = [];
      for (let i = 0; i < rawValue.blocks.length; i++) {
        if (rawValue.blocks[i].type !== Block.ATOMIC) {
          text.push(rawValue.blocks[i].text);
          type.push(rawValue.blocks[i].type);
        }
      }
      let rawBlocksLength = rawValue.blocks.length;
      let imgCount = 0;
      for (let i = 0; i < rawBlocksLength; i++) {
        if (rawValue.blocks[i].type === Block.ATOMIC) {
          let blocks = rawValue.blocks[i];
          const blockData = blocks.data;
          const blockDataType = blockData.type;
          if (blockDataType === "related-articles") {
            let controlData = rawValue.blocks[i].data.articles;
            let controlDataArr = JSON.parse(JSON.stringify(controlData));
            let controlDataArrLen = controlDataArr.length;
            for (let c = 0; c < controlDataArrLen; c++) {
              formJSON.push(controlDataArr[c]);
            }
          } else if (blockDataType === "image") {
            let imageWidth = $(".DraftEditor-editorContainer")
              .find("img")
              .eq(imgCount)
              .width();
            let imageHeight = $(".DraftEditor-editorContainer")
              .find("img")
              .eq(imgCount)
              .height();
            let imgStyle = $(".DraftEditor-editorContainer")
              .find("img")
              .eq(imgCount)
              .attr("style");
            const pageType = store.getState().savePageType.pageType;
            if (pageType === "edit") {
              $(".DraftEditor-editorContainer")
                .find("img")
                .eq(imgCount)
                .attr("width", 220);
            }

            imgStyle = imgStyle ? imgStyle.replace(/\s/g, "") : "";
            if (imgStyle.indexOf("float") === -1) {
              imgStyle = {
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
              };
            } else if (
              imgStyle.indexOf("float") !== -1 &&
              imgStyle.indexOf("float:right") !== -1
            ) {
              imgStyle = { position: "relative", float: "right" };
            } else if (
              imgStyle.indexOf("float") !== -1 &&
              imgStyle.indexOf("float:left") !== -1
            ) {
              imgStyle = { position: "relative", float: "left" };
            }
            let obj = {
              key: blocks.key,
              control: blockDataType,
              src: blockData.src,
              display: blockData.display,
              props: {
                width: imageWidth,
                height: imageHeight,
                imgStyle: imgStyle,
              },
            };
            formJSON.push(obj);
            imgCount++;
          } else if (blockDataType === "break") {
            let obj = {
              key: blocks.key,
              control: blockDataType,
              display: blockData.display,
            };
            formJSON.push(obj);
          } else if (blockDataType === "video") {
            let obj = {
              key: blocks.key,
              control: blockDataType,
              src: blockData.src,
              display: blockData.display,
            };
            formJSON.push(obj);
          }
        } else if (rawValue.blocks[i].type !== Block.ATOMIC) {
          let blocks = rawValue.blocks[i];
          let linkEntity = [];
          let linkValue = [];
          if (rawValue.entityMap.length > 0) {
            linkEntity = rawValue.entityMap[i];
            for (let m = 0; m < blocks.entityRanges.length; m++) {
              linkValue.push(blocks.entityRanges[m]);
            }
          }
          let inlineStyleRanges = [];
          if (blocks.inlineStyleRanges.length > 0) {
            for (let j = 0; j < blocks.inlineStyleRanges.length; j++) {
              inlineStyleRanges.push(blocks.inlineStyleRanges[j]);
            }
          }
          let obj = {
            key: blocks.key,
            control: "simpletext",
            data: "",
            text: blocks.text,
            textStyle: inlineStyleRanges,
            type: blocks.type,
            linkEntity: linkEntity,
            linkValue: linkValue,
          };
          formJSON.push(obj);
        }
      }
      //  this.setState({ formJSON: formJSON, editorStateRawValue: rawValue });
      let addQuestionAnswerObj = JSON.parse(
        localStorage.getItem("addQuestionAnswer")
      );

      if (
        addQuestionAnswerObj !== undefined &&
        addQuestionAnswerObj != null &&
        addQuestionAnswerObj.length > 0
      ) {
        formJSON.forEach((data) => {
          let matchedData = addQuestionAnswerObj.filter((val) => {
            let _maianClickedQsId = val.maianClickedQsId
              ? val.maianClickedQsId.split("visibility")
              : "";
            if (_maianClickedQsId && data.key === _maianClickedQsId[1]) {
              return val;
            }
            return val;
          });
          if (matchedData !== undefined && matchedData.length > 0) {
            let filterNewList = matchedData.filter((matchData) => {
              if (
                matchData.isSelectedQuestionId !== undefined &&
                matchData.AddAnotherConditionSubDropdwnList[0].isAnswer !==
                  undefined &&
                matchData.AddAnotherConditionSubDropdwnList[0].isAnswer !== ""
              ) {
                return matchData;
              }
              return matchData;
            });
            data.ListOfQuestionForSettings = filterNewList;
          }
        });
      }
    }
    localStorage.setItem("formJSON", JSON.stringify(formJSON));
    return formJSON;
  };

  render() {
    // Theme Implementation

    let _self = this;
    setTimeout(function() {
      if (_self.state.WarningColor !== undefined) {
        let fieldWarning = document.getElementsByClassName("field__error");

        if (fieldWarning.length > 0) {
          _.map(fieldWarning, function(data) {
            data.style.background = `rgba(${_self.state.WarningColor.r}, ${
              _self.state.WarningColor.g
            }, ${_self.state.WarningColor.b}, ${_self.state.WarningColor.a})`;
          });
        }
      }
      if (_self.state.ActiveColor !== undefined) {
        let activelist = document.getElementsByClassName("test");

        if (activelist.length > 0) {
          _.map(activelist, function(val) {
            val.style.color = _self.state.ActiveColor;
            val.style.fontFamily = _self.state.selectedPrimaryFontFamily;
          });
        }
      }
      // Paragraph
      if (_self.state.paragraphStyles !== "") {
        let HTags = document.getElementsByClassName("paragraph");
        if (HTags.length > 0) {
          let paragraphStyles = _self.state.paragraphStyles;
          _.map(HTags, function(paragraph) {
            paragraph.style.color = paragraphStyles.color;
            paragraph.style.fontFamily = paragraphStyles.fontFamily;
            paragraph.style.fontWeight = paragraphStyles.fontWeight;
            paragraph.style.fontSize = paragraphStyles.fontSize;
            paragraph.style.lineHeight = paragraphStyles.lineHeight;
          });
        }
      } else {
        if (_self.state.selectedPrimaryFontFamily !== undefined) {
          let paragraphTags = document.getElementsByClassName("paragraph");
          if (paragraphTags.length > 0) {
            _.map(paragraphTags, function(font) {
              font.style.fontFamily = _self.state.selectedPrimaryFontFamily;
            });
          }
        }
      }
      // H1 Tag
      if (_self.state.heading1Styles !== "") {
        let HTags = document.getElementsByClassName("hTag");
        if (HTags.length > 0) {
          let heading1Styles = _self.state.heading1Styles;
          _.map(HTags, function(heading1) {
            heading1.style.color = heading1Styles.color;
            heading1.style.fontFamily = heading1Styles.fontFamily;
            heading1.style.fontWeight = heading1Styles.fontWeight;
            heading1.style.fontSize = heading1Styles.fontSize;
            heading1.style.lineHeight = heading1Styles.lineHeight;
          });
        }
      } else {
        if (_self.state.selectedSecondaryFontFamily !== undefined) {
          let HTags = document.getElementsByClassName("hTag");
          if (HTags.length > 0) {
            _.map(HTags, function(secondaryFont) {
              secondaryFont.style.fontFamily =
                _self.state.selectedSecondaryFontFamily;
            });
          }
        }
      }
      // H2 Tag
      if (_self.state.heading2Styles !== "") {
        let HTags2 = document.getElementsByClassName("hTag2");
        if (HTags2.length > 0) {
          let heading2Styles = _self.state.heading2Styles;
          _.map(HTags2, function(heading2) {
            heading2.style.color = heading2Styles.color;
            heading2.style.fontFamily = heading2Styles.fontFamily;
            heading2.style.fontWeight = heading2Styles.fontWeight;
            heading2.style.fontSize = heading2Styles.fontSize;
            heading2.style.lineHeight = heading2Styles.lineHeight;
          });
        }
      } else {
        if (_self.state.selectedSecondaryFontFamily !== undefined) {
          let HTags2 = document.getElementsByClassName("hTag2");
          if (HTags2.length > 0) {
            _.map(HTags2, function(secondaryFont) {
              secondaryFont.style.fontFamily =
                _self.state.selectedSecondaryFontFamily;
            });
          }
        }
      }
    }, 100);
    if (this.state.isLoader) {
      return <Loader />;
    }
    const styles = reactCSS({
      default: {
        ShowBackgroundImage: {
          "background-image": `url(${this.state.SelectedBackgroundFile})`,
          textAlign: "initial",
          direction: this.state.translatedData.rtl ? "rtl" : "",
        },
        ShowBackgroundColor: {
          background: `rgba(${this.state.SelectedBackgroundColor.r}, ${
            this.state.SelectedBackgroundColor.g
          }, ${this.state.SelectedBackgroundColor.b}, ${
            this.state.SelectedBackgroundColor.a
          })`,
          textAlign: "initial",
          direction: this.state.translatedData.rtl ? "rtl" : "",
        },
      },
    });
    if (
      this.state.isLoader &&
      window.parent.location.href.indexOf("Template") !== -1
    ) {
      return <Loader />;
    }

    return (
      <div>
        {!this.state.formSubmitted && (
          <form
            className={this.state.formClass}
            onChange={this.handleChange}
            style={
              this.state.SelectedBackgroundFile !== "" &&
              this.state.SelectedBackgroundFile != null
                ? styles.ShowBackgroundImage
                : styles.ShowBackgroundColor
            }
          >
            <div style={{ color: this.state.TextColor, display:'flow-root'}}>
              {this.renderForm(this.state.arrayIndex, this.state.formJSON)}
            </div>
          </form>
        )}

        {this.state.formSubmitted && (
          <AfterSubmissionPage editorState={this.state.editorState} />
        )}

        {/* Sqaure Checkout Modal */}
        <ReactModal
          contentLabel="onRequestClose"
          isOpen={
            this.state.showPaymentCheckout &&
            this.state.selectedPaymentMethod &&
            this.state.selectedPaymentMethod.AccountType === "SQUARE"
          }
          className="square-checkout-modal Product-Modal"
          style={{
            top: "0px !important",
            bottom: "0px !important",
            width: "100% !important",
          }}
          // onRequestClose={this.closePaymentCheckoutModal}
        >
          <SquareCheckout
            formJSON={this.formJSON}
            formId={this.currentFormId}
            basePriceValue={this.state.basePriceValue}
            totalPriceValue={this.state.totalPriceValue}
            taxAmount={this.state.taxAmount}
            processingFeeAmount={this.state.processingFeeAmount}
            processingFeePercentage={this.state.processingFeePercentage}
            paymentMethod={this.state.selectedPaymentMethod}
            paymentConfigration={this.state.paymentConfigration}
            translationInfo={this.state.translatedData}
            closeModal={this.closePaymentCheckoutModal}
            onPaymentSuccess={(e) => this.handleSubmit(e, true)}
          />
        </ReactModal>

        {/* Paypal Checkout Modal */}
        <ReactModal
          contentLabel="onRequestClose"
          isOpen={
            this.state.showPaymentCheckout &&
            this.state.selectedPaymentMethod &&
            this.state.selectedPaymentMethod.AccountType === "PAYPAL BUSINESS"
          }
          className="paypal-checkout-modal Product-Modal"
          // onRequestClose={this.closePaymentCheckoutModal}
        >
          <PaypalCheckout
            formJSON={this.formJSON}
            formId={this.currentFormId}
            basePriceValue={this.state.basePriceValue}
            totalPriceValue={this.state.totalPriceValue}
            taxAmount={this.state.taxAmount}
            processingFeeAmount={this.state.processingFeeAmount}
            processingFeePercentage={this.state.processingFeePercentage}
            paymentMethod={this.state.selectedPaymentMethod}
            paymentConfigration={this.state.paymentConfigration}
            translationInfo={this.state.translatedData}
            closeModal={this.closePaymentCheckoutModal}
            onPaymentSuccess={(e) => this.handleSubmit(e, true)}
          />
        </ReactModal>

        {/* Braintree Checkout Modal */}
        <ReactModal
          contentLabel="onRequestClose"
          isOpen={
            this.state.showPaymentCheckout &&
            this.state.selectedPaymentMethod &&
            this.state.selectedPaymentMethod.AccountType === "BRAINTREE"
          }
          className="braintree-checkout-modal Product-Modal"
          // onRequestClose={this.closePaymentCheckoutModal}
        >
          <BraintreeCheckout
            formJSON={this.formJSON}
            formId={this.currentFormId}
            basePriceValue={this.state.basePriceValue}
            totalPriceValue={this.state.totalPriceValue}
            taxAmount={this.state.taxAmount}
            processingFeeAmount={this.state.processingFeeAmount}
            processingFeePercentage={this.state.processingFeePercentage}
            paymentMethod={this.state.selectedPaymentMethod}
            paymentConfigration={this.state.paymentConfigration}
            translationInfo={this.state.translatedData}
            closeModal={this.closePaymentCheckoutModal}
            onPaymentSuccess={(e) => this.handleSubmit(e, true)}
          />
        </ReactModal>

        {/* Paypal Checkout Modal */}
        <ReactModal
          contentLabel="onRequestClose"
          isOpen={
            this.state.showPaymentCheckout &&
            this.state.selectedPaymentMethod &&
            this.state.selectedPaymentMethod.AccountType === "STRIPE"
          }
          className="stripe-checkout-modal Product-Modal"
          // onRequestClose={this.closePaymentCheckoutModal}
        >
          <StripeCheckoutModal
            formJSON={this.formJSON}
            formId={this.currentFormId}
            basePriceValue={this.state.basePriceValue}
            totalPriceValue={this.state.totalPriceValue}
            taxAmount={this.state.taxAmount}
            processingFeeAmount={this.state.processingFeeAmount}
            processingFeePercentage={this.state.processingFeePercentage}
            paymentMethod={this.state.selectedPaymentMethod}
            paymentConfigration={this.state.paymentConfigration}
            translationInfo={this.state.translatedData}
            closeModal={this.closePaymentCheckoutModal}
            onPaymentSuccess={(e) => this.handleSubmit(e, true)}
          />
        </ReactModal>

        <div style={{ display: "none" }}>
          <FontPicker
            apiKey={WEB_FONTS_KEYS.SECRETKEY}
            limit={WEB_FONTS_KEYS.LIMIT}
          />
        </div>
      </div>
    );
  }

  //___________________________________10-04-2019-START___________________________________________________
  matchQsAnsQsSetting = (e, divId, isListOrCard, thisStateProductList) => {
    if (e.target.value === undefined) return;
    e.target.value = e.target.value.toString();
    let dataOfFormJsonObj = this.formJSON; //JSON.parse(localStorage.getItem("formJSON"));
    dataOfFormJsonObj.forEach((formJsonObj) => {
      //display question if added more than one

      if (
        formJsonObj.ListOfQuestionForSettings !== undefined &&
        formJsonObj.ListOfQuestionForSettings.length > 1
      ) {
        formJsonObj.ListOfQuestionForSettings.forEach((element) => {
          if (
            element.isSelectedQuestionId === divId &&
            element.AddAnotherConditionSubDropdwnList[0]
              .isSelectedIsOrNotAns === "is"
          ) {
            if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = true;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = false;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            }
          } else if (
            element.isSelectedQuestionId === divId &&
            element.AddAnotherConditionSubDropdwnList[0]
              .isSelectedIsOrNotAns === "isn't"
          ) {
            if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = true;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = false;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            }
          } else if (
            element.isSelectedQuestionId === divId &&
            element.AddAnotherConditionSubDropdwnList[0]
              .isSelectedIsOrNotAns === "isAnswered"
          ) {
            if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = true;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = false;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            }
          } else if (
            element.isSelectedQuestionId === divId &&
            element.AddAnotherConditionSubDropdwnList[0]
              .isSelectedIsOrNotAns === "isn'tAnswered"
          ) {
            if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = true;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                e.target.value.toLocaleLowerCase()
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = false;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            }
          } else if (
            element.isSelectedQuestionId === divId &&
            element.AddAnotherConditionSubDropdwnList[0]
              .isSelectedIsOrNotAns === "contains"
          ) {
            if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.split("")
                .length === e.target.value.split("").length &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer
                .toLocaleLowerCase()
                .includes(e.target.value.toLocaleLowerCase())
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = true;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            } else if (
              element.isSelectedQuestionId === divId &&
              !e.target.value.includes(
                element.AddAnotherConditionSubDropdwnList[0].isAnswer
              )
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = false;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            }
          } else if (
            element.isSelectedQuestionId === divId &&
            element.AddAnotherConditionSubDropdwnList[0]
              .isSelectedIsOrNotAns === "doesn'tContain"
          ) {
            if (
              element.isSelectedQuestionId === divId &&
              !element.AddAnotherConditionSubDropdwnList[0].isAnswer.includes(
                e.target.value
              )
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = true;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.split("")
                .length === e.target.value.split("").length &&
              element.AddAnotherConditionSubDropdwnList[0].isAnswer.includes(
                e.target.value
              )
            ) {
              element.isAddedQuestionAnswer = true;
              element.qsOfAnswerMathched = false;
              localStorage.removeItem("addQuestionAnswer");
              localStorage.setItem(
                "addQuestionAnswer",
                JSON.stringify(formJsonObj.ListOfQuestionForSettings)
              );
            }
          }
        });
      } else {
        //display question if added single
        if (formJsonObj.ListOfQuestionForSettings !== undefined) {
          formJsonObj.ListOfQuestionForSettings.forEach((element) => {
            if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0]
                .isSelectedIsOrNotAns === "is"
            ) {
              if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = true;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              } else if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = false;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              }
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0]
                .isSelectedIsOrNotAns === "isn't"
            ) {
              if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = true;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              } else if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = false;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              }
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0]
                .isSelectedIsOrNotAns === "isAnswered"
            ) {
              if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = true;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              } else if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = false;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              }
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0]
                .isSelectedIsOrNotAns === "isn'tAnswered"
            ) {
              if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() !==
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = true;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              } else if (
                element.isSelectedQuestionId === divId &&
                element.AddAnotherConditionSubDropdwnList[0].isAnswer.toLocaleLowerCase() ===
                  e.target.value.toLocaleLowerCase()
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = false;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              }
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0]
                .isSelectedIsOrNotAns === "contains"
            ) {
              if (
                element.isSelectedQuestionId === divId &&
                e.target.value.includes(
                  element.AddAnotherConditionSubDropdwnList[0].isAnswer
                )
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = true;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              } else if (
                element.isSelectedQuestionId === divId &&
                !e.target.value.includes(
                  element.AddAnotherConditionSubDropdwnList[0].isAnswer
                )
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = false;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              }
            } else if (
              element.isSelectedQuestionId === divId &&
              element.AddAnotherConditionSubDropdwnList[0]
                .isSelectedIsOrNotAns === "doesn'tContain"
            ) {
              if (
                element.isSelectedQuestionId === divId &&
                !e.target.value.includes(
                  element.AddAnotherConditionSubDropdwnList[0].isAnswer
                )
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = true;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              } else if (
                element.isSelectedQuestionId === divId &&
                e.target.value.includes(
                  element.AddAnotherConditionSubDropdwnList[0].isAnswer
                )
              ) {
                element.isAddedQuestionAnswer = true;
                element.qsOfAnswerMathched = false;
                localStorage.removeItem("addQuestionAnswer");
                localStorage.setItem(
                  "addQuestionAnswer",
                  JSON.stringify(formJsonObj.ListOfQuestionForSettings)
                );
              }
            }
          });
        }
      }
    });
    this.formJSON = dataOfFormJsonObj;
    localStorage.removeItem("formJSON");
    localStorage.setItem("formJSON", JSON.stringify(dataOfFormJsonObj));
    let dataOfFormJsonObj1 = JSON.parse(localStorage.getItem("formJSON"));
    dataOfFormJsonObj1.forEach((dataObj) => {
      //display question if added more than one
      if (
        dataObj.ListOfQuestionForSettings !== undefined &&
        dataObj.ListOfQuestionForSettings.length > 1
      ) {
        let filterData = dataObj.ListOfQuestionForSettings.filter((element) => {
          if (
            element.isAddedQuestionAnswer !== undefined &&
            element.qsOfAnswerMathched !== undefined &&
            element.isAddedQuestionAnswer &&
            element.qsOfAnswerMathched
          ) {
            return element;
          } else {
            let data = document.getElementById(
              dataObj.ListOfQuestionForSettings[0].maianClickedQsId
            );
            if (data !== undefined && data != null) {
              document.getElementById(element.maianClickedQsId).hidden = true;
            }
          }
          return element;
        });
        if (
          filterData !== undefined &&
          filterData != null &&
          filterData.length > 0 &&
          filterData.length === dataObj.ListOfQuestionForSettings.length
        ) {
          document.getElementById(
            filterData[0].maianClickedQsId
          ).hidden = false;
        } else if (dataObj.ListOfQuestionForSettings.length > 0) {
          let orfilterData = dataObj.ListOfQuestionForSettings.filter(
            (data) => {
              //or
              if (data.qsOfAnswerMathched) {
                if (data.IsOr) {
                  document.getElementById(data.maianClickedQsId).hidden = false;
                  return data;
                }
              }
              return data;
            }
          );
          if (orfilterData === undefined || orfilterData.length <= 0) {
            let andfilterData = dataObj.ListOfQuestionForSettings.filter(
              (andData) => {
                //or
                if (andData.IsAnd) {
                  return andData;
                }
                return andData;
              }
            );
            let andfilterDataMatched = andfilterData.filter(
              (andDataMatched) => {
                //or
                if (andDataMatched.qsOfAnswerMathched) {
                  return andDataMatched;
                }
                return andDataMatched;
              }
            );
            let dataTag = document.getElementById(
              dataObj.ListOfQuestionForSettings[0].maianClickedQsId
            );
            if (dataTag !== undefined && dataTag !== null) {
              document.getElementById(
                dataObj.ListOfQuestionForSettings[0].maianClickedQsId
              ).hidden = andfilterDataMatched.length !== andfilterData.length;
            }
          }
        }
      } else {
        //display question if added single
        if (dataObj.ListOfQuestionForSettings !== undefined) {
          dataObj.ListOfQuestionForSettings.forEach((element) => {
            if (
              element.isAddedQuestionAnswer !== undefined &&
              element.qsOfAnswerMathched !== undefined &&
              element.isAddedQuestionAnswer &&
              element.qsOfAnswerMathched
            ) {
              document.getElementById(element.maianClickedQsId).hidden = false;
            } else {
              document.getElementById(element.maianClickedQsId).hidden = true;
            }
          });
        }
      }
    });
  };

  handleScaleChange = (id, e) => {
    this.setState({ [id]: e });
    let obj = { target: { value: e } };
    this.matchQsAnsQsSetting(obj, id);
  };
  //___________________________________10-04-2019-END_____________________________________________________
}
export default PreviewForm;
