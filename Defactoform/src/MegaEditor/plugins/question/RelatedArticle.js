import React, { Component } from "react";
import { DraftJS } from "megadraft";
import moment from "moment";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import BlockInput from "../../../MegaEditor/components/plugin/BlockInput";
import BlockSelectOptions from "../../../MegaEditor/components/plugin/BlockSelectOptions";
import Switch from "@material-ui/core/Switch";
import Input from "../../../components/controls/input";
import TextArea from "../../../components/controls/textArea";
import RadioButtons from "../../../components/controls/RadioButtons";
import SelectControl from "../../../components/controls/select";
import MultipleChoice from "../../../components/controls/MultipleChoice";
import Products from "../../../components/controls/products";
import DateControl from "../../../components/controls/date";
import Time from "../../../components/controls/time";
import ColorPickerControl from "../../../components/controls/colorPickerControl";
// import ColorSwitchesPicker from "../../../components/controls/colorPickerOnlySwitches";
import Select from "react-select";
import ReactModal from "react-modal";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import _ from "lodash";
import $ from "jquery";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import CalculationHelp from "../../../MegaEditor/plugins/question/CalculationHelp";
import {
  CalculationResult,
  DynamicCalculationResult,
} from "../../../views/CalculationsArticle/CalculationResult";
import {
  FORM_URLS,
  GOOGLEAUTH_URLS,
  GOOGLEAUTH_CRENDENTIALS,
  INTEGRATIONS_URLS
} from "../../../util/constants";
import {
  PostData,
  GetData,
  GetDataWithHeader,
  PostDataWithHeader,
  Delete,
} from "../../../stores/requests";
import { calculateTime } from "../../../util/commonFunction";
import { getProfileInfoByToken } from "../../../API/IntegrationAPI";

import TimeZone from "../../../JsonData/timezone";
ReactModal.setAppElement("#root");
let countriesData = require("../../../JsonData/countries.json");

export default class RelatedArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formJSONReleated: localStorage.getItem("formJSON"),
      disabled: false,
      addImageToOption_MultipleChoice: false,
      isNewLine: true,
      visibility: true,
      visibilityLogic: false,
      visibilityLogic_Step_1: false,
      hideQuestion: false,
      columnQuestion: false,
      confirmEmail: false,
      includeOtherOption_MultipleChoice: false,
      hideTextFromOption_MultipleChoice: false,
      includeOtherOption_Dropdown: false,
      multianswerquestion: false,
      isWholeNumber: false,
      selectedMultipleChoice: "Choice 1\nChoice 2",
      multipleChoiceArray: [
        { label: "Choice 1", value: "Choice 1" },
        { label: "Choice 2", value: "Choice 2" },
      ],
      appointmentModeList: [
        {
          value: "minutes",
          label: `Minutes (e.g.   9:30am - 11:30am on  ${moment(
            new Date()
          ).format("LL")})`,
        },
        {
          value: "days",
          label: `Days (e.g.  ${moment(new Date()).format("LL")} -  ${moment(
            new Date()
          )
            .add(5, "days")
            .format("LL")})`,
        },
      ],
      appointmentTimeFormat: "am/pm",
      appointmentMode: "minutes",
      appointmentTimeZone: "",
      showQuestion: false,
      requiredQuestion: true,
      allowOnlySwitches: false,
      showModal: false,
      isMultipleFileUpload: false,
      DropdownOption: "Choice 1\nChoice 2",
      selectedScaleOptions: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
      scaleOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      scaleLabelOption: {
        0: "1",
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8,
        8: 9,
        9: "10",
      },
      dropdownOptionArray: [
        { value: "Choice 1", label: "Choice 1" },
        { value: "Choice 2", label: "Choice 2" },
      ],
      layoutOptionArray: [
        { value: "list", label: "List" },
        { value: "card", label: "Card" },
        { value: "gallery", label: "Gallery" },
      ],
      numberformatingOption: [
        { id: 1, value: "Default", label: "Default" },
        { id: 2, value: "Formatted", label: "Formatted" },
        { id: 3, value: "Currency", label: "Currency" },
      ],
      PhNumberformatOption: [
        { id: 1, value: "No Format", label: "No Format", format: "" },
        {
          id: 2,
          value: "US Phone Number",
          label: "US Phone Number",
          format: "",
        },
        {
          id: 3,
          value: "AU Phone Number",
          label: "AU Phone Number",
          format: "",
        },
        { id: 4, value: "Custom Format", label: "Custom Format", format: "" },
      ],

      orderOfDateOptions: [
        { id: 1, value: "Day Month Year", label: "Day Month Year" },
        { id: 2, value: "Month Day Year", label: "Month Day Year" },
        { id: 3, value: "Year Month Day", label: "Year Month Day" },
      ],
      productSelectedLayout: { value: "list", label: "List" },
      selectedNumberFormat: { id: 1, value: "Default", label: "Default" },
      selectedFormat: {
        id: 1,
        value: "No Format",
        label: "No Format",
      },
      SelectedOption: "",
      isPriceQuestionReadOnly: true,
      isDiscountedPriceQuestion: true,
      buyMoreThanOneProduct: false,
      priceValue: 10,
      selectedTab: "settings",
      propsUpdated: false,
      productPrice: 10,
      productName: "New Product",
      productCount: 1,
      stock: "",
      minQuantity: "",
      maxQuantity: "",
      minLength: "",
      maxLength: "",
      productImages: [],
      hideproductprices: false,
      productList: [
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
      ],
      selectedProduct: {},
      selectedProductIndex: 0,
      textareaRows: "1",
      preFillKey: "",
      isShowMultipleOptions: false,
      addAnotherConditionList: [],
      addAnotherConditionMainDropdwnList: [],
      requireZipCode: true,
      allowFutureDate: false,
      allowPastDate: false,
      setDefaultAnsToday: false,
      restrictCountry: false,
      showComponent: false,
      calculationtext: "",
      calculationPreview: '""',
      disabledColor: "no-disabling",
      calculationPreviewClassName: "calculation-preview-success",
      CalculationhideShowQuestionInfo: "Question is visible",
      calculationMessageDiv: false,
      calculationActualFormula: "",
      showConnectCalender: false,
      isMultipleCalender: false,
      header: {},
      googleAccountsList: [],
      googleCalendersList: [],
      header: {},
      setupId: null,
      googleCalenderTitle: null,
      selectedGoogleAccount: "",
      selectedGoogleAccountValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedGoogleAccountID: "",
      GoogleCalenderName: "",
      formSubmitted: false,
      selectedGoogleCalender: {
        label: "Select",
        value: 0,
      },
      GoogleCalenderSelected: { value: 0, label: "select" },
      isGoogleCalenderSelected: false,
      isAccountSelected: false,
      inputCalenderName: "",
      connectedCalenders: [],
      eventTitle: "Meeting",
      eventDescription: "",
      eventLocation: "",
      startTimeInterval: "15",
      startTimeCustomInterval: "",
      lengthOfTimeMinutes: "15",
      lengthOfTimeDays: "15",
      lengthOfTimeCustomMinutes: "",
      lengthOfTimeCustomDays: "",
      timeLengthBySubmitter: "no",
      minLengthOfAppointment: "none",
      maxLengthOfAppointment: "none",
      sendInviteFromDefactoform: true,
      generalMinutesAvailability: {
        sunday: [],
        monday: ["09:00AM-05:00PM"],
        tuesday:["09:00AM-05:00PM"],
        wednesday: ["09:00AM-05:00PM"],
        thursday: ["09:00AM-05:00PM"],
        friday: ["09:00AM-05:00PM"],
        saturday: []
      },
      generalDaysAvailability: {
        sunday: false,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false
      },
      startTimeMeridiem: 'AM',
      endTimeMeridiem: 'PM',
      availabilityStartTime: {
        hours: "09", 
        minutes: "00"
      },
      availabilityEndTime: {
        hours: "05", 
        minutes: "00"
      },
      selectedAvailibiltyDay: 'monday',
      showSelectTimeSection: false,
      currentDate: new Date(),
      blackoutDates: [],
      advanceAppointmentDays: "90",
      minimumNoticeHours: "2",
      minimumNoticeDays: "1",
      maximumAppointmentsInDay: "10",
      minimumTimeBetweenAppointments: "15",
    };
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
    this.jsonFromData = JSON.parse(localStorage.getItem("formJSON"));
    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._handleLinkChange = this._handleLinkChange.bind(this);
    this._handleControlChange = this._handleControlChange.bind(this);

    this._handleDeleteClick = this._handleDeleteClick.bind(this);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.minimumFilesSelection = this.minimumFilesSelection.bind(this);
    this.maximumFilesSelection = this.maximumFilesSelection.bind(this);
  }
  _handleTitleChange(event) {
    this.props.updateArticle(this.props.item.key, "title", event.target.value);
  }

  _handleLinkChange(event) {
    this.props.updateArticle(this.props.item.key, "link", event.target.value);
  }

  GetCalculationCopyData = (
    copydata,
    copyFormaulName,
    commentText,
    resultData,
    IsError
  ) => {
    this.setState({ calculationtext: copydata });
    let result = CalculationResult(copydata, copyFormaulName, resultData);
    this.setState({ calculationPreview: result });
    if (IsError) {
      this.setState({
        calculationPreviewClassName: "calculation-preview-error",
      });
    } else {
      this.setState({
        calculationPreviewClassName: "calculation-preview-success",
      });
    }
  };

  // getPayConfigrationData = () => {
  //   GetData(
  //     CONFIGURE_PAYMENTS_URLS.GET_PAYMENT_CONFIGURATION_URL + this.FormId
  //   ).then((result) => {
  //     if (Object.keys(result.data).length > 0) {
  //       let resultantItem = result.data.Item;
  //       const paymentInfo = JSON.parse(resultantItem.PaymentAccount)

  //     }
  //   });
  // }

  _handleControlChange(event) {
    this.setState({ placeholder: "" });
    this.props.updateArticle(
      this.props.item.key,
      "control",
      event.target.value
    );
    if (event.target.value === "dropdown") {
      this.props.updateArticle(
        this.props.item.key,
        "dropdownOptionArray",
        this.state.dropdownOptionArray
      );
    }
    if (event.target.value === "products") {
      this.updateArticle(
        "buyMoreThanOneProduct",
        this.state.buyMoreThanOneProduct
      );
      this.updateArticle("productList", this.state.productList);
    }
  }

  _handleDeleteClick(event) {
    this.props.removeArticle(this.props.item.key);
  }

  handleOpenModal = (event) => {
    this.props.data.articles.forEach((val) => {
      if (val.key === this.props.item.key) {
        val.AddedQuestionSetting = true;
      }
    });
    let propsArr = Object.keys(this.props.item);
    propsArr.forEach((element) => {
      this.setState({ [element]: this.props.item[element] });
      if (element === "MultiChoiceOptions") {
        let multiChoiceOptionsArr = Object.keys(this.props.item[element]);
        multiChoiceOptionsArr.forEach((val) => {
          let imgId = val + this.props.item.key.trim();
          let imgSrcStateName = "file" + imgId;
          this.setState({
            [imgSrcStateName]: this.props.item[element][val].src,
          });
        });
        this.setOptionsInBox(
          this.props.item[element],
          "selectedMultipleChoice"
        );
      }
      if (element === "visibilityRules") {
        this.setState({
          addAnotherConditionMainDropdwnList: this.props.item[element],
        });
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
      if (element === "dropdownOptionArray") {
        this.setOptionsInBox(this.props.item[element], "DropdownOption");
      }
      if (element === "scaleOptions") {
        let selectedScaleOptions = this.props.item["scaleOptions"].join("\n");
        this.setState({ selectedScaleOptions: selectedScaleOptions });
      }

      if (element === "livePreview") {
        let livePreview = this.props.item[element];
        this.setState({ calculationPreview: livePreview });
      }
      if (element === "hideQuestion") {
        let hideQuestion = this.props.item[element];
        this.setState({ hideQuestion: hideQuestion });
        if (hideQuestion) {
          this.setState({
            CalculationhideShowQuestionInfo: "Question is hidden",
          });
        }
      }
      if (element === "calculationQuestion") {
        let calculationQuestion = this.props.item[element];
        this.setState({ calculationtext: calculationQuestion });
      }
    });
    localStorage.setItem(
      "updatedFromJson",
      JSON.stringify(this.props.data.articles)
    );
    this.setState({ showModal: true });

    if(this.props.item.requiredQuestion != undefined){
      this.setState({
        requiredQuestion: this.props.item.requiredQuestion
      })
    } else{
      this.updateArticle('requiredQuestion', true)
    }
    
    if(this.props.item.control === "appointment"){
      if(this.props.item.startTimeInterval){
        this.setState({
          startTimeInterval: this.props.item.startTimeInterval
        })
      }
      if(this.props.item.startTimeInterval === "custom"){
        this.setState({
          startTimeCustomInterval: this.props.item.startTimeCustomInterval
        })
      }
      if(this.props.item.lengthOfTimeMinutes){
        this.setState({
          lengthOfTimeMinutes: this.props.item.lengthOfTimeMinutes
        })
      }
      if(this.props.item.lengthOfTimeMinutes === "custom-minutes"){
        this.setState({
          lengthOfTimeCustomMinutes: this.props.item.lengthOfTimeCustomMinutes
        })
      }
      if(this.props.item.eventTitle){
        this.setState({
          eventTitle: this.props.item.eventTitle
        })
      } else{
        this.setState({
          eventTitle: "Meeting"
        })
        this.updateArticle("eventTitle", "Meeting")
      }

      if(this.props.item.lengthOfTimeDays){
        this.setState({
          lengthOfTimeDays: this.props.item.lengthOfTimeDays
        })
      }
      if(this.props.item.lengthOfTimeMinutes === "custom-days"){
        this.setState({
          lengthOfTimeCustomDays: this.props.item.lengthOfTimeCustomDays
        })
      }
      if(this.props.item.timeLengthBySubmitter){
        this.setState({
          timeLengthBySubmitter: this.props.item.timeLengthBySubmitter
        })
      }
      if(this.props.item.minLengthOfAppointment){
        this.setState({
          minLengthOfAppointment: this.props.item.minLengthOfAppointment
        })
      }
      if(this.props.item.maxLengthOfAppointment){
        this.setState({
          maxLengthOfAppointment: this.props.item.maxLengthOfAppointment
        })
      }
      if(this.props.item.generalMinutesAvailability){
        this.setState({
          generalMinutesAvailability: this.props.item.generalMinutesAvailability
        })
      } else {
        this.updateArticle("generalMinutesAvailability", this.state.generalMinutesAvailability)
      }
      if(this.props.item.generalDaysAvailability){
        this.setState({
          generalDaysAvailability: this.props.item.generalDaysAvailability
        })
      } else {
        this.updateArticle("generalDaysAvailability", this.state.generalDaysAvailability)
      }
      if(this.props.item.appointmentMode){
        this.setState({
          appointmentMode: this.props.item.appointmentMode
        })

        if(this.props.item.appointmentTimeFormat){
          this.setState({
            appointmentTimeFormat: this.props.item.appointmentTimeFormat
          })
        } else {
          this.updateArticle("appointmentTimeFormat", "am/pm")
        }
      } else {
        this.setState({
          appointmentMode: "minutes"
        })
        this.updateArticle("appointmentMode", "minutes")
        this.updateArticle("appointmentTimeFormat", "am/pm")
      }
      this.setState({
        advanceAppointmentDays: this.props.item.advanceAppointmentDays || "90",
        minimumNoticeHours: this.props.item.minimumNoticeHours || "2",
        minimumNoticeDays: this.props.item.minimumNoticeDays || "1",
        maximumAppointmentsInDay: this.props.item.maximumAppointmentsInDay || "10",
        minimumTimeBetweenAppointments: this.props.item.minimumTimeBetweenAppointments || "15",
      })
      if(!this.props.item.advanceAppointmentDays){
        this.updateArticle("advanceAppointmentDays", "90")
      }
      if(!this.props.item.minimumNoticeHours){
        this.updateArticle("minimumNoticeHours", "2")
      }
      if(!this.props.item.minimumNoticeHours){
        this.updateArticle("minimumNoticeDays", "1")
      }
      if(!this.props.item.maximumAppointmentsInDay){
        this.updateArticle("maximumAppointmentsInDay", "10")
      }
      if(!this.props.item.minimumTimeBetweenAppointments){
        this.updateArticle("minimumTimeBetweenAppointments", "15")
      }
      this.getSavedCalenders();
    }
    
  };

  setOptionsInBox = (array, stateField) => {
    let data = "";
    array.forEach((element) => {
      data += element.label + "\n";
    });
    this.setState({ [stateField]: data });
  };

  handleCloseModal() {
    this.updateArticle(
      "visibilityRules",
      this.state.addAnotherConditionMainDropdwnList
    );
    //console.log("handleCloseModal addAnotherConditionMainDropdwnList:",this.state.addAnotherConditionMainDropdwnList);
    this.setState({ showModal: false });
  }
  handlePriceChange(value, event) {
    if (value === "setPriceValue") {
      this.setState({ priceValue: event.target.value });
      if (event.target.value === undefined || event.target.value == null) {
        event.target.value = 10;
      }
      this.updateArticle("defaultVal", event.target.value);
      this.updateArticle("priceValue", event.target.value);
    } else if (value === "minimumPrice") {
      this.setState({ minimumPriceValue: event.target.value });
      this.updateArticle("minimumPriceValue", event.target.value);
    }
  }
  componentDidMount() {
    if (
      this.props.item.control === "multiplechoice" &&
      this.props.item.MultiChoiceOptions
    ) {
      this.setState({
        multipleChoiceArray: this.props.item.MultiChoiceOptions,
      });
    } else {
      this.updateArticle("MultiChoiceOptions", this.state.multipleChoiceArray);
    }
    if(this.props.item.control === "appointment"){
      this.setState({
        isMultipleCalender: this.props.item.isMultipleCalender
      })
      this.getSavedCalenders();
    }
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.item.control && !this.state.propsUpdated && !localStorage.EditForm) {
    if (
      nextProps.item.control &&
      !this.state.propsUpdated &&
      !localStorage.EditForm
    ) {
      this.setState({ propsUpdated: true });
      if (nextProps.item.control === "dropdown") {
        this.updateArticle("Options", this.state.dropdownOptionArray);
        this.updateArticle(
          "dropdownOptionArray",
          this.state.dropdownOptionArray
        );
        this.updateArticle("scaleLabelOption", this.state.scaleLabelOption);
        this.updateArticle("scaleOptions", this.state.scaleOptions);
      } else if (nextProps.item.control === "products") {
        this.updateArticle(
          "buyMoreThanOneProduct",
          this.state.buyMoreThanOneProduct
        );
        this.updateArticle("productList", this.state.productList);
        this.updateArticle("productName", this.state.productName); //default-name
        this.updateArticle("productPrice", this.state.productPrice); //default-price
        this.updateArticle("productCount", this.state.productCount);
      } else if (nextProps.item.control === "scale") {
        this.updateArticle("scaleLabelOption", this.state.scaleLabelOption);
        this.updateArticle("scaleOptions", this.state.scaleOptions);
      } else if (nextProps.item.control === "multiplechoice") {
        this.updateArticle(
          "MultiChoiceOptions",
          this.state.multipleChoiceArray
        );
        this.updateArticle("scaleLabelOption", this.state.multipleChoiceArray);
        this.updateArticle("scaleOptions", this.state.multipleChoiceArray);
      } else if (nextProps.item.control === "products") {
        this.updateArticle("productList", this.state.productList);
      }
    }
  }
  updateRuiredField = (name, val) => {
    this.setState({ [name]: val });
    this.updateArticle("requiredQuestion", val);
  };
  
  handleSwitchChange = (name) => (event) => {
    // debugger;
    console.log(name);
    console.log(event.target.checked);
    this.setState({ [name]: event.target.checked });
    if (name === "requiredQuestion") {
      this.updateArticle("requiredQuestion", event.target.checked);
    } else if (name === "visibilityLogic") {
      this.updateArticle("visibilityLogic", event.target.checked);
      this.updateArticle("visibilityLogic_Step_1", event.target.checked);
      if (event.target.checked) {
        this.setState({
          isShowMultipleOptions: false,
          visibilityLogic_Step_1: true,
        });

        let objList = {
          value: "name",
          title: "nameTitle",
          maianClickedQsId: "visibility" + this.props.item.key,
          Id: DraftJS.genKey(),
          IsAnd: false,
          IsOr: false,
          IsShowAndOr: false,
          isShowMultipleOptionsFirstDrop: true,
          AddAnotherConditionSubDropdwnList: [],
        };
        this.setState(
          (previousState) => ({
            addAnotherConditionMainDropdwnList: [objList],
          }),
          () => {}
        );
      } else {
        this.setState({
          isShowMultipleOptions: false,
          visibilityLogic_Step_1: false,
        });
      }
    } else if (name === "isNewLine") {
      this.props.updateArticle(
        this.props.item.key,
        "isNewLine",
        event.target.checked
      );
    } else if (name === "PreFillKey_txtArea") {
      this.setState({ preFillKey: event.target.value });
      this.updateArticle("preFillKey", event.target.value);
      this.props.updateArticle(
        this.props.item.key,
        "preFillKey",
        event.target.value
      );
    } else if (name === "allowOnlySwitches") {
      // this.setState({ allowOnlySwitches: event.target.value });
      this.updateArticle("allowOnlySwitches", event.target.checked);
    } else if (name === "multianswerquestion") {
      this.setState({ multianswerquestion: event.target.checked });
      this.updateArticle("multianswerquestion", event.target.checked);
    } else if (
      name === "addImageToOption_MultipleChoice" ||
      name === "hideTextFromOption_MultipleChoice" ||
      name === "buyMoreThanOneProduct" ||
      name === "hideproductprices" ||
      name === "confirmEmail"
    ) {
      this.updateArticle(name, event.target.checked);
    }
    if (name === "includeOtherOption_Dropdown" && event.target.checked) {
      let option = { value: "Other", label: "Other" };
      let options = this.state.dropdownOptionArray;
      options.push(option);
      options = options.concat([]);
      this.setState({ dropdownOptionArray: options });
      this.updateArticle("dropdownOptionArray", options);
      this.updateArticle("Options", options);
    } else if (
      name === "includeOtherOption_Dropdown" &&
      event.target.checked === false
    ) {
      let options = this.state.dropdownOptionArray.filter(function(element) {
        return element.label !== "Other";
      });
      this.setState({ dropdownOptionArray: options });
      this.updateArticle("dropdownOptionArray", options);
      this.updateArticle("Options", options);
    }
    if (name === "includeOtherOption_MultipleChoice" && event.target.checked) {
      let option = { label: "Other", value: "Other" };
      let options = this.state.multipleChoiceArray;
      options.push(option);
      this.setState({ multipleChoiceArray: options });
      this.updateArticle("MultiChoiceOptions", options);
    } else if (
      name === "includeOtherOption_MultipleChoice" &&
      event.target.checked === false
    ) {
      let options = this.state.multipleChoiceArray.filter(function(element) {
        return element.label !== "Other";
      });
      this.setState({ multipleChoiceArray: options });
      this.updateArticle("MultiChoiceOptions", options);
    }

    if (name === "isMultipleFileUpload") {
      this.updateArticle("isMultipleFileUpload", event.target.checked);
      this.setState({ minimumFiles: 1 });
      this.setState({ maximumFiles: 1 });
    }
    if (name === "isPriceQuestionReadOnly") {
      this.updateArticle("isPriceQuestionReadOnly", event.target.checked);
    }
    if (name === "isDiscountedPriceQuestion") {
      this.updateArticle("isDiscountedPriceQuestion", event.target.checked);
    }
    if (name === "hideQuestion") {
      if (event.target.checked) {
        this.setState({
          hideQuestion: true,
          CalculationhideShowQuestionInfo: "Question is hidden",
        });
      } else {
        this.setState({
          hideQuestion: false,
          CalculationhideShowQuestionInfo: "Question is visible",
        });
      }
      this.updateArticle("hideQuestion", event.target.checked);
    }
    if (name === "isMultipleCalender") {
      this.props.updateArticle(this.props.item.key,"isMultipleCalender",event.target.checked);
    }
  };
  //
  handleCommonSwitchChange = (name) => (event) => {
    if (name === "allowPastDate") {
      this.setState({ allowFutureDate: false });
      this.updateArticle("selectedYear", {
        id: new Date().getFullYear(),
        value: new Date().getFullYear(),
        label: new Date().getFullYear(),
      });
      this.updateArticle("selectedMonth", "");
      this.updateArticle("selectedDay", "");
      this.updateArticle("allowFutureDate", false);
    } else if (name === "allowFutureDate") {
      this.setState({ allowPastDate: false });
      this.updateArticle("selectedYear", {
        id: new Date().getFullYear(),
        value: new Date().getFullYear(),
        label: new Date().getFullYear(),
      });
      this.updateArticle("selectedMonth", "");
      this.updateArticle("selectedDay", "");
      this.updateArticle("allowPastDate", false);
    }
    this.setState({ [name]: event.target.checked });
    this.updateArticle(name, event.target.checked);
  };

  handleSelectChange = (id, selectedVal) => {
    this.setState({ SelectedOption: selectedVal });
    if (id.indexOf("otherOption" + this.props.item.key) > -1) {
      this.updateArticle("otherOptionVal", selectedVal);
    } else {
      this.updateArticle("defaultVal", selectedVal);
    }
  };
  handleAddCalenderSection(value){
    if(value){
      this.getAccountList();
    }
    this.setState({
      showConnectCalender: value
    })
  }
  handleCommonSelectChange = (name, selectedVal) => {
    this.setState({ [name]: selectedVal });
    this.updateArticle(name, selectedVal);
    if(this.props.item.control !== "appointment"){
      this.updateArticle("defaultVal", selectedVal);
    }
  };

  handleLayoutChange = (id, selectedVal) => {
    this.setState({ productSelectedLayout: selectedVal });
    this.updateArticle("productSelectedLayout", selectedVal);
  };

  handleFormat = (id, selectedVal) => {
    if (this.props.item.control === "number") {
      this.setState({ selectedNumberFormat: selectedVal });
      this.updateArticle("selectedNumberFormat", selectedVal);
    } else {
      if (selectedVal.id === 2 || selectedVal.id === 3) {
        this.setState({ disabled: true });
        this.setState({ disabledColor: "disabled-color" });
        this.setState({ selectedFormat: selectedVal });
        this.updateArticle("selectedFormat", selectedVal);
      } else {
        this.setState({ disabled: false });
        this.setState({ disabledColor: !"disabled-color" });
        this.setState({ selectedFormat: selectedVal });
        this.updateArticle("selectedFormat", selectedVal);
      }
    }
  };
  handlePlaceHolder_txtArea = (event) => {
    this.setState({ placeholder: event.target.value });
    this.updateArticle("placeholder", event.target.value);
    this.props.updateArticle(
      this.props.item.key,
      "placeholderText",
      event.target.checked
    );
  };
  handleCalculation_txtArea = (event) => {
    let question = event.target.value;
    this.CalculationCallCommonCode(question);
  };

  handleCall_CopyData = (question) => {
    this.CalculationCallCommonCode(question);
  };

  CalculationCallCommonCode(question) {
    //---------------------to get question title from question key----------------------//
    // let formJson = JSON.parse(localStorage.getItem("formJSON"));
    // let question1 = question;
    //
    // if (String(question).includes("{{") && String(question).includes("}}")) {

    //   const getInsideDoubleCurly = (str) =>
    //     str
    //       .split("{{")
    //       .filter((val) => val.includes("}}"))
    //       .map((val) => val.substring(0, val.indexOf("}}")));
    //   let res = getInsideDoubleCurly(question);

    //   for (let i = 0; i < res.length; i++) {
    //     let findText = res[i].replace(/ /g, "");
    //     let jsonValue = formJson.find((o) => o.key === findText.toLowerCase());
    //     if (jsonValue) {
    //       question = question.replace(findText, jsonValue.title);
    //       question = question.replace(/[{{}}]/g, "");
    //     }
    //   }
    // }
    //-------------------------------------------------------------------------------------------//

    this.setState({ calculationtext: question });
    let result = DynamicCalculationResult(question);
    if (result.iserror) {
      this.setState({
        calculationPreviewClassName: "calculation-preview-error",
      });
    } else {
      this.setState({
        calculationPreviewClassName: "calculation-preview-success",
      });
    }
    this.setState({
      calculationPreview: result.result,
      calculationActualFormula: result.actualFormula,
    });
    if (String(question).includes("{{") && String(question).includes("}}")) {
      this.updateArticle("livePreview", result.result);
    } else {
      this.updateArticle("livePreview", result.actualFormula);
    }
    this.updateArticle("calculationQuestion", question);
  }

  handleDefAnswer_txtArea = (defaultText) => {
    this.setState({ defaultVal: defaultText });
    this.updateArticle("defaultVal", defaultText);
    this.props.updateArticle(this.props.item.key, "defaultVal", defaultText);
  };
  handleDefAnswer = (defaultText) => {
    this.setState({ defaultVal: defaultText });
    this.updateArticle("defaultVal", defaultText);
    this.props.updateArticle(this.props.item.key, "defaultVal", defaultText);
  };
  handleMinMaxLength = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
    if (name === "minLength_Textarea") {
      this.setState({ minLength: event.target.value });
      this.updateArticle("minLength", event.target.value);
      this.props.updateArticle(
        this.props.item.key,
        "minLength",
        event.target.value
      );
    } else if (name === "maxLength_Textarea") {
      this.setState({ maxLength: event.target.value });
      this.updateArticle("maxLength", event.target.value);
      this.props.updateArticle(
        this.props.item.key,
        "maxLength",
        event.target.value
      );
    }
  };

  handleRowsTextArea = (event) => {
    this.setState({ textareaRows: event.target.value });
    this.updateArticle("textareaRows", event.target.value);
    this.props.updateArticle(
      this.props.item.key,
      "textareaRows",
      event.target.value
    );
  };

  bindOptions = (event) => {
    this.setState({ selectedMultipleChoice: event.target.value });
    let enteredTextEncoded = encodeURI(event.target.value);
    let linebreaks = enteredTextEncoded.split(/%0A/g);
    let updatedmultipleChoiceArray = [];
    linebreaks.forEach((element) => {
      if (element) {
        element = decodeURI(element);
        let index = _.findIndex(this.state.multipleChoiceArray, {
          value: element,
        });
        let imgsrc = "";
        if (index > -1) {
          imgsrc = this.state.multipleChoiceArray[index].src;
        }
        let option = { value: element, label: element, src: imgsrc };
        updatedmultipleChoiceArray.push(option);
      }
    });
    this.setState({ multipleChoiceArray: updatedmultipleChoiceArray });
    this.updateArticle("MultiChoiceOptions", this.state.multipleChoiceArray);
  };
  minimumFilesSelection = (event) => {
    if (event.target.value !== "") {
      if (event.target.value < 1) {
        event.target.value = 1;
      }
      if (event.target.value > 10) {
        event.target.value = 10;
      }
    }
    this.updateArticle("minimumFiles", event.target.value);
  };
  maximumFilesSelection = (event) => {
    if (event.target.value !== "") {
      if (event.target.value < 1) {
        event.target.value = 1;
      }
      if (event.target.value > 10) {
        event.target.value = 10;
      }
    }
    this.updateArticle("maximumFiles", event.target.value);
  };
  updateArticle = (fieldName, value) => {
    this.props.updateArticle(this.props.item.key, fieldName, value);
  };
  setPayment = (event) => {
    this.setState({ showComponent: true });
    this.props.history.push({
      pathname: "/user/ConfigurePayment",
    });
  };
  bindDropdownOptions = (event) => {
    this.setState({ DropdownOption: event.target.value });
    let enteredTextEncoded = encodeURI(event.target.value);
    let linebreaks = enteredTextEncoded.split(/%0A/g);
    this.setState({ dropdownOptionArray: [] });
    // this.state.dropdownOptionArray = [];
    let OptionArr = [];
    linebreaks.forEach((element) => {
      if (element) {
        element = decodeURI(element);
        let option = { value: element, label: element };
        OptionArr.push(option);
        this.setState({ dropdownOptionArray: OptionArr });
      }
      this.updateArticle("dropdownOptionArray", OptionArr);
      this.updateArticle("Options", OptionArr);
    });
  };
  bindScaleOptions = (event) => {
    this.setState({ selectedScaleOptions: event.target.value });
    let enteredTextEncoded = encodeURI(event.target.value);
    let linebreaks = enteredTextEncoded.split(/%0A/g);
    let scaleOptionArray = [];
    let scaleLabelOption = {};
    linebreaks.forEach((element, i) => {
      if (element) {
        element = decodeURI(element);
        let index = parseInt(element);
        scaleLabelOption[i] = index;
        scaleOptionArray.push(element);
      }
    });
    this.setState({ scaleLabelOption: scaleLabelOption });
    this.setState({ scaleOptions: scaleOptionArray });
    this.updateArticle("scaleLabelOption", scaleLabelOption);
    this.updateArticle("scaleOptions", scaleOptionArray);
  };
  handleMinMaxSelectChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.updateArticle(e.target.name, e.target.value);
  };

  handleFileChange(event, key) {
    if (event !== undefined) {
      let id = event.target.id;
      let arrayIndex = key;
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
            ["file" + id]: URL.createObjectURL(event.target.files[0]),
          });
        } else {
          this.setState({
            ["file" + id]: null,
            ["Extension" + id]: FileName,
          });
        }
        // this.state.multipleChoiceArray[arrayIndex].src = URL.createObjectURL(
        //   event.target.files[0]
        // );
        let newChoicesArray = this.state.multipleChoiceArray;

        const updatedNewChoicesObject = {
          ...newChoicesArray[arrayIndex],
          src: URL.createObjectURL(event.target.files[0]),
        };

        newChoicesArray[arrayIndex] = updatedNewChoicesObject;

        this.setState({
          multipleChoiceArray: newChoicesArray,
        });
        this.updateArticle(
          "MultiChoiceOptions",
          this.state.multipleChoiceArray
        );
      }
    }
  }

  handleProductImageChange = (event) => {
    //  this.setState({selectedProduct:this.state.productList[0],selectedProductIndex:0})
    if (event !== undefined) {
      if (event.target.files.length > 0) {
        let productImages = this.state.selectedProduct.Images;

        let imagesCount = event.target.files.length;
        for (let i = 0; i < imagesCount; i++) {
          let FileName = event.target.files[i].name;
          let spllitter = FileName.lastIndexOf(".");
          let fileExtension = FileName.substring(spllitter + 1);
          if (
            fileExtension === "jpeg" ||
            fileExtension === "png" ||
            fileExtension === "jpg" ||
            fileExtension === "gif"
          ) {
            let imageUrl = URL.createObjectURL(event.target.files[i]);
            imageUrl = imageUrl.replace("blob:", "");
            productImages.push(URL.createObjectURL(event.target.files[i]));
            // this.state.selectedProduct.Images = productImages;

            // this.state.productList[
            //   this.state.selectedProductIndex
            // ].Images = productImages;
            let newImageArray = this.state.productList;

            const updatedImagesObject = {
              ...newImageArray[this.state.selectedProductIndex],
              Images: productImages,
            };

            newImageArray[
              this.state.selectedProductIndex
            ] = updatedImagesObject;

            let newSelectedProduct = this.state.selectedProduct;

            let updatedNewSelectedProductObject = {
              ...newSelectedProduct,
              Images: productImages,
            };
            newSelectedProduct = updatedNewSelectedProductObject;
            //----------------------------------------------------------------------------------//
            this.setState({
              selectedProduct: newSelectedProduct,
              productList: newImageArray,
            });
            this.updateArticle("productList", this.state.productList);
          }
        }
      }
    }
  };
  removeImage = (index) => {
    let productImages = this.state.selectedProduct.Images;
    productImages.splice(index, 1);
    // this.state.productList[
    //   this.state.selectedProductIndex
    // ].Images = productImages;

    //--------------------------------------------------//
    let newproductList = this.state.productList;

    const updatedNewproductListObject = {
      ...newproductList[this.state.selectedProductIndex],
      Images: productImages,
    };

    newproductList[
      this.state.selectedProductIndex
    ] = updatedNewproductListObject;

    let newSelectedProduct = this.state.selectedProduct;

    let updatedNewSelectedProductObject = {
      ...newSelectedProduct,
      Images: productImages,
    };
    newSelectedProduct = updatedNewSelectedProductObject;
    //------------------------------------------------------------------------------------//
    this.setState({
      selectedProduct: newSelectedProduct,
      productList: newproductList,
    });
    this.updateArticle("productList", this.state.productList);
  };
  removeFile = (index, imgId) => {
    this.setState({
      ["file" + imgId]: null,
    });
    // this.state.multipleChoiceArray[index].src = "";
    //----------------------------------------------------------------//
    let newChoicesArray = this.state.multipleChoiceArray;

    const updatedNewChoicesObject = {
      ...newChoicesArray[index],
      src: "",
    };
    this.setState({
      multipleChoiceArray: newChoicesArray,
    });
    newChoicesArray[index] = updatedNewChoicesObject;
    //------------------------------------------------------------//
    this.updateArticle("MultiChoiceOptions", newChoicesArray);
  };
  showProductTab = (tab) => {
    if (tab === "products") {
      let selectedproduct = [];
      selectedproduct.push(this.state.productList[0]);
      this.setState({
        selectedProduct: this.state.productList[0],
        selectedProductIndex: 0,
      });
    }
    this.setState({ selectedTab: tab });
  };
  showAppointmentTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
    // this.state.productList[this.state.selectedProductIndex][field] =
    //   e.target.value;
    // this.state.selectedProduct[field] = e.target.value;

    //-----------------------------------------------------//
    let newProductList = this.state.productList;
    let value = e.target.value;

    const updatedNewProductObject = {
      ...newProductList[this.state.selectedProductIndex],
      [field]: value,
    };
    newProductList[this.state.selectedProductIndex] = updatedNewProductObject;

    let newSelectedProduct = this.state.selectedProduct;

    const updatedNewSelectedProductObject = {
      ...newSelectedProduct,
      [field]: value,
    };
    newSelectedProduct = updatedNewSelectedProductObject;

    //----------------------------------------------------------------//
    this.setState({
      selectedProduct: newSelectedProduct,
      productList: newProductList,
    });
    this.updateArticle("productList", this.state.productList);
    this.updateArticle(field, e.target.value);
  };
  handleCommonChange = (name, value) => {
    this.setState({ [name]: value });
    this.updateArticle(name, value);
  };
  handleCommonValueChange = (event, key) => {
    const value = event.target.value;
    this.updateArticle(key, value);
  };

  addProduct = () => {
    let productList = this.state.productList;
    let newProduct = {
      Name: "New Product",
      SKU: DraftJS.genKey(),
      productCount: 1,
      Price: "10",
      Stock: "",
      MinQuantity: "",
      MaxQuantity: "",
      Images: [],
      isSelected: false,
    };
    productList.push(newProduct);
    this.setState({ productList: productList });
    this.updateArticle("productList", this.state.productList);
  };
  duplicateProduct = (index) => {
    let productListArr = this.state.productList.slice();
    let product = productListArr[index];
    let newProduct = {
      Name: product.Name,
      SKU: DraftJS.genKey(),
      productCount: product.productCount,
      Price: product.Price,
      Stock: product.Stock,
      MinQuantity: product.MinQuantity,
      MaxQuantity: product.MaxQuantity,
      Images: product.Images,
      isSelected: false,
    };
    productListArr.push(newProduct);
    this.setState({ productList: productListArr });
    this.updateArticle("productList", this.state.productList);
  };
  deleteProduct = (index) => {
    let productList = this.state.productList;
    productList.splice(index, 1);
    this.setState({ productList: productList });
    this.setState({ selectedProductIndex: 0, selectedProduct: productList[0] });
    this.updateArticle("productList", this.state.productList);
  };
  showProductDetail = (index) => {
    let selectedproduct = [];
    selectedproduct.push(this.state.productList[index]);
    this.setState({
      selectedProduct: this.state.productList[index],
      selectedProductIndex: index,
    });
  };
  setExportData = () => {
    let ProductsList = this.state.productList.slice(0);
    let csvData = [];
    if (ProductsList.length > 0) {
      for (let i = 0; i < ProductsList.length; i++) {
        let obj = ProductsList[i];
        let productImages = obj.Images;
        if (productImages) {
          for (let t = 0; t < productImages.length; t++) {
            obj["Image " + (t + 1)] = productImages[t];
          }
        }
        const newObj = Object.keys(obj).reduce((object, key) => {
          if (key !== "isSelected" && key !== "Images") {
            object[key] = obj[key];
          }
          return object;
        }, {});
        csvData.push(newObj);
        if (i === ProductsList.length - 1) {
          return csvData;
        }
      }
    } else {
      return csvData;
    }
  };
  handleFiles = (files) => {
    let reader = new FileReader();
    reader.onload = function(e) {};
    reader.readAsText(files[0]);
  };
  handleImportFileData = (data) => {
    let productsArr = [];
    let fileData = data;
    for (let f = 1; f < fileData.length; f++) {
      let productLength = fileData[f].length;
      let newProduct = {
        Name: fileData[f][0],
        SKU: fileData[f][1],
        productCount: fileData[f][2],
        Price: fileData[f][2],
        Stock: fileData[f][3],
        MinQuantity: fileData[f][4],
        MaxQuantity: fileData[f][5],
        Images: [],
      };

      if (productLength > 7) {
        for (let l = 8; l < productLength; l++) {
          if (fileData[f][l]) {
            newProduct.Images.push(fileData[f][l]);
          }
        }
      }
      productsArr.push(newProduct);
    }
    this.setState({ productList: productsArr });
    this.setState({ selectedProductIndex: 0, selectedProduct: productsArr[0] });
  };

  //_______________________________________________________20-06-2019____________________________________
  updateformJson = () => {};
  closeButton_visibiltyFX = (val1, deletedIndex) => {
    let newList = this.state.addAnotherConditionMainDropdwnList;
    newList = newList.filter((val, index) => {
      if (val.Id !== val1.Id) {
        val.SelectedQs = this.props.item.title;
        if (
          (val.IsAnd === undefined || val.IsAnd === false) &&
          (val.IsOr === undefined || val.IsOr === false)
        ) {
          val.IsShowAndOr = true;
          val.IsAnd = true;
          val.IsOr = false;
        } else if (val.IsAnd) {
          val.IsShowAndOr = true;
          val.IsAnd = true;
          val.IsOr = false;
        } else if (val.IsAnd) {
          val.IsShowAndOr = true;
          val.IsAnd = false;
          val.IsOr = true;
        }
        return val;
      }
      return val;
    });
    newList.forEach((val, index) => {
      val.IsShowAndOr = true;
      if (index === newList.length - 1) {
        val.IsShowAndOr = false;
        val.IsAnd = true;
        val.IsOr = false;
      }
    });
    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: newList,
      }),
      () => {
        let addQuestionAnswerObj = JSON.parse(
          localStorage.getItem("addQuestionAnswer")
        );
        if (
          addQuestionAnswerObj !== undefined &&
          addQuestionAnswerObj !== null &&
          addQuestionAnswerObj.length > 0
        ) {
          addQuestionAnswerObj = addQuestionAnswerObj.filter((addQs) => {
            if (
              addQs.maianClickedQsId === val1.maianClickedQsId &&
              addQs.indexMain !== deletedIndex
            ) {
              return addQs;
            }
            return addQs;
          });
          localStorage.removeItem("addQuestionAnswer");
          localStorage.setItem(
            "addQuestionAnswer",
            JSON.stringify(addQuestionAnswerObj)
          );
        }
        this.isDeleteAddAnotherLocalstorageDataFX(deletedIndex);
      }
    );
    return;
  };
  selectedValueFromMultiple_OptionFX = (selectedVal, e, indexMain) => {
    let list = this.state.addAnotherConditionMainDropdwnList;
    let formJson = JSON.parse(localStorage.getItem("formJSON"));
    list.forEach((val, indx) => {
      if (val.Id === selectedVal.Id) {
        val.SelectedQs = this.props.item.title;
        val.isShowMultipleOptionsFirstDrop = false;
        val.isShowMultipleOptions = true;
        val.isSelectedQuestion = e.target.value;
        val.maianClickedQsId = "visibility" + this.props.item.key;
        val.indexMain = indx;
        val.isSelectedQuestionId = e.target.value.split("_")[1];
        val.isSelectedQuestion = e.target.value.split("_")[0];
        let filterDataForQsProductMoreThenOne = formJson.filter(
          (moreProducts) => {
            if (
              val.isSelectedQuestionId !== undefined &&
              val.isSelectedQuestionId !== "" &&
              val.isSelectedQuestionId === moreProducts.key
            ) {
              return moreProducts;
            }
            return moreProducts;
          }
        )[0];
        if (
          filterDataForQsProductMoreThenOne !== undefined &&
          filterDataForQsProductMoreThenOne.control === "products"
        ) {
          val.buyMoreThanOneProduct =
            filterDataForQsProductMoreThenOne.buyMoreThanOneProduct;
        }

        let selectedQsData = formJson.filter((qsData) => {
          if (qsData.key === val.isSelectedQuestionId) {
            return qsData;
          }
          return qsData;
        })[0];
        if (selectedQsData !== undefined && selectedQsData !== null) {
          val.Controltype = selectedQsData.control;
          if (
            val.Controltype === "scale" ||
            val.Controltype === "multiplechoice" ||
            val.Controltype === "dropdown"
          ) {
            val.scaleOptions = selectedQsData.scaleOptions;
            if (
              val.AddAnotherConditionSubDropdwnList !== undefined &&
              val.AddAnotherConditionSubDropdwnList !== null &&
              val.AddAnotherConditionSubDropdwnList.length > 0
            )
              delete val.AddAnotherConditionSubDropdwnList[0].isAnswer;
          } else if (val.Controltype === "products") {
            val.productList = selectedQsData.productList;
            if (
              selectedQsData.productList !== undefined &&
              selectedQsData.productList.length > 1 &&
              val.buyMoreThanOneProduct === true
            ) {
              val.productMainList = [];
              val.productMainList.push({
                key: "1Backtoquestions",
                value: "Back to questions...",
                title: "Back to questions...",
              });
              val.productMainList.push({
                key: val.isSelectedQuestionId,
                value: val.isSelectedQuestion,
                title: val.isSelectedQuestion,
              });
              val.productMainList.push({
                key: "2TotalQuantity",
                value: "Total Quantity",
                title: "Total Quantity",
              });
              selectedQsData.productList.forEach((productListData) => {
                val.productMainList.push({
                  key: productListData.SKU,
                  value: productListData.SKU,
                  title: productListData.Name,
                });
              });
            } else {
              val.productList = selectedQsData.productList;
              $(".productMainList").toggle("hide");
            }
          } else {
            delete val.scaleOptions;
          }
        } else {
          val.Controltype = "";
        }
        val.indexMain = indexMain;
        val.AddAnotherConditionSubDropdwnList.push({
          maianClickedQsId: val.maianClickedQsId,
          value: "name",
          isAnswer: "",
          isSelectedIsOrNotAns: "is",
          title: "nameTitle",
          Id: DraftJS.genKey(),
          isShowSubMultipleOptionsDrop: false,
        });
      }
    });

    this.jsonFromData.filter((formJsonData) => {
      if (formJsonData.title === e.target.value) {
        return this;
      }
      return this;
    });
    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: list,
      }),
      () => {
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
    );
  };

  addAnotherConditionHandler = () => {
    let objList = {
      value: "name",
      title: "nameTitle",
      Id: DraftJS.genKey(),
      IsAnd: true,
      IsOr: false,
      IsShowAndOr: false,
      isShowMultipleOptionsFirstDrop: true,
      AddAnotherConditionSubDropdwnList: [],
    };
    let newlist = this.state.addAnotherConditionMainDropdwnList;
    newlist.push(objList);
    let count = 1;
    newlist.forEach((addConditionData, indx) => {
      if (newlist.length === 1) {
        addConditionData.IsShowAndOr = false;
      } else if (count === newlist.length - 1) {
        addConditionData.IsAnd = true;
        addConditionData.IsShowAndOr = true;
      }
      addConditionData.indexMain = indx;
      count++;
    });

    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: newlist,
      }),
      () => {
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
    );
  };

  isAndHandler = (val1, isSelected, indexMain) => {
    let list = this.state.addAnotherConditionMainDropdwnList;
    list.forEach((val) => {
      if (
        val.Id === val1.Id &&
        val.indexMain !== undefined &&
        val.indexMain === indexMain
      ) {
        val.SelectedQs = this.props.item.title;
        if (isSelected === "isAnd") {
          val.IsAnd = true;
          val.IsOr = false;
          let listfilterData = list.filter((filterData) => {
            if (filterData.indexMain === indexMain + 1) {
              return filterData;
            }
            return filterData;
          })[0];
          if (listfilterData !== undefined && listfilterData != null) {
            val.IsAddORCondationQsId = listfilterData.isSelectedQuestionId;
            val.IsORCondationQsId = null;
          }
        } else {
          val.IsOr = true;
          val.IsAnd = false;
          let listfilterData = list.filter((filterData) => {
            if (filterData.indexMain === indexMain + 1) {
              return filterData;
            }
            return filterData;
          })[0];
          if (listfilterData !== undefined && listfilterData != null) {
            val.IsORCondationQsId = listfilterData.isSelectedQuestionId;
            val.IsAddORCondationQsId = null;
          }
        }
      }
    });
    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: list,
      }),
      () => {
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
    );
  };

  handleInputChangeIsAnswerFFX = (e, valMain, val, indexMain) => {
    let newList = this.state.addAnotherConditionMainDropdwnList;
    newList.forEach(
      (list) => {
        if (
          list.Id === valMain.Id &&
          list.indexMain !== undefined &&
          list.indexMain === indexMain
        ) {
          list.SelectedQs = this.props.item.title;
          if (list.AddAnotherConditionSubDropdwnList.length > 0) {
            list.AddAnotherConditionSubDropdwnList.forEach(
              (subDropdownList) => {
                if (subDropdownList.Id === val.Id) {
                  subDropdownList.isAnswer = e.target.value;
                }
              }
            );
          }
        }
      },
      () => {}
    );

    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: newList,
      }),
      () => {
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
    );
  };

  updatedmultipleChoiceIsAnsIsNotAns = (e, valMain, val, indexMain) => {
    let newList = this.state.addAnotherConditionMainDropdwnList;
    valMain.AddAnotherConditionSubDropdwnList = [val];
    newList.forEach(
      (listData) => {
        if (
          listData.Id === valMain.Id &&
          listData.indexMain !== undefined &&
          listData.indexMain === indexMain
        ) {
          listData.SelectedQs = this.props.item.title;
          if (listData.AddAnotherConditionSubDropdwnList.length > 0) {
            listData.AddAnotherConditionSubDropdwnList.forEach(
              (subDropdownListData) => {
                if (subDropdownListData.Id === val.Id) {
                  subDropdownListData.isSelectedIsOrNotAns = e.target.value;
                }
              }
            );
          } else {
          }
        }
      },
      () => {}
    );

    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: newList,
      }),
      () => {
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
    );
  };

  updatedMultipleChoiceIsQuestionFX = (e, valMain, val, indexMain) => {
    let newList = this.state.addAnotherConditionMainDropdwnList;
    if ("Back to questions..._1Backtoquestions" === e.target.value) {
      if (newList.length === 1) {
        let objList = {
          value: "name",
          title: "nameTitle",
          maianClickedQsId: "visibility" + this.props.item.key,
          Id: DraftJS.genKey(),
          IsAnd: false,
          IsOr: false,
          IsShowAndOr: false,
          isShowMultipleOptionsFirstDrop: true,
          AddAnotherConditionSubDropdwnList: [],
        };
        this.setState(
          (previousState) => ({
            addAnotherConditionMainDropdwnList: [objList],
          }),
          () => {}
        );
      } else {
        newList = newList.filter((element) => {
          if (element.indexMain !== indexMain) {
            return element;
          }
          return element;
        });
        let objList = {
          value: "name",
          title: "nameTitle",
          maianClickedQsId: "visibility" + this.props.item.key,
          Id: DraftJS.genKey(),
          IsAnd: false,
          IsOr: false,
          IsShowAndOr: true,
          isShowMultipleOptions: false,
          isShowMultipleOptionsFirstDrop: true,
          AddAnotherConditionSubDropdwnList: [],
        };

        newList.splice(indexMain, 0, objList);
        newList.forEach((element, index) => {
          if (index === newList.length - 1) {
            newList.IsShowAndOr = false;
          }
        });

        this.setState(
          (previousState) => ({
            addAnotherConditionMainDropdwnList: newList,
          }),
          () => {}
        );
      }
      return;
    }
    let jsonFromData = JSON.parse(localStorage.getItem("formJSON"));
    newList.forEach(
      (newListData) => {
        if (
          newListData.Id === valMain.Id &&
          newListData.indexMain !== undefined &&
          newListData.indexMain === indexMain
        ) {
          newListData.MainSelectedQs = this.props.item.title;
          newListData.isSelectedQuestionId = e.target.value.split("_")[1];
          newListData.isSelectedQuestion = e.target.value.split("_")[0];
          let filterDataForQsProductMoreThenOne = jsonFromData.filter(
            (moreThanOneProduct) => {
              if (
                newListData.isSelectedQuestionId !== undefined &&
                newListData.isSelectedQuestionId !== "" &&
                newListData.isSelectedQuestionId === moreThanOneProduct.key
              ) {
                return moreThanOneProduct;
              }
              return moreThanOneProduct;
            }
          )[0];
          if (
            filterDataForQsProductMoreThenOne !== undefined &&
            filterDataForQsProductMoreThenOne.control === "products"
          ) {
            newListData.buyMoreThanOneProduct =
              filterDataForQsProductMoreThenOne.buyMoreThanOneProduct;
          }

          let selectedQsData = jsonFromData.filter((qsData) => {
            if (qsData.key === newListData.isSelectedQuestionId) {
              return qsData;
            }
            return qsData;
          })[0];
          if (selectedQsData !== undefined && selectedQsData !== null) {
            newListData.Controltype = selectedQsData.control;
            if (
              newListData.Controltype === "scale" ||
              newListData.Controltype === "multiplechoice" ||
              newListData.Controltype === "dropdown"
            ) {
              newListData.scaleOptions = selectedQsData.scaleOptions;
              delete newListData.AddAnotherConditionSubDropdwnList[0].isAnswer;
            } else if (newListData.Controltype === "products") {
              newListData.productList = selectedQsData.productList;
              if (
                selectedQsData.productList !== undefined &&
                selectedQsData.productList.length > 1 &&
                newListData.buyMoreThanOneProduct === true
              ) {
                newListData.productMainList = [];
                newListData.productMainList.push({
                  key: "1Backtoquestions",
                  value: "Back to questions...",
                  title: "Back to questions...",
                });
                newListData.productMainList.push({
                  key: newListData.isSelectedQuestionId,
                  value: newListData.isSelectedQuestion,
                  title: newListData.isSelectedQuestion,
                });
                newListData.productMainList.push({
                  key: "2TotalQuantity",
                  value: "Total Quantity",
                  title: "Total Quantity",
                });
                selectedQsData.productList.forEach((selectedData) => {
                  newListData.productMainList.push({
                    key: selectedData.SKU,
                    value: selectedData.SKU,
                    title: selectedData.Name,
                  });
                });
                $(".productMainList").toggle("show");
              } else {
                newListData.productList = selectedQsData.productList;
                $(".productMainList").toggle("hide");
              }
            } else {
              delete newListData.scaleOptions;
              if (
                newListData.AddAnotherConditionSubDropdwnList !== undefined &&
                newListData.AddAnotherConditionSubDropdwnList !== null &&
                newListData.AddAnotherConditionSubDropdwnList.length > 0
              ) {
                delete newListData.AddAnotherConditionSubDropdwnList[0]
                  .isAnswer;
              }
            }
          } else {
            newListData.Controltype = "";
          }
        }
      },
      () => {}
    );

    this.setState(
      (previousState) => ({
        addAnotherConditionMainDropdwnList: newList,
      }),
      () => {
        this.isUpDateAddAnotherLocalstorageDataFX();
      }
    );
  };

  isUpDateAddAnotherLocalstorageDataFX = () => {
    let newFilteredList = [];
    let addQuestionAnswerObj = JSON.parse(
      localStorage.getItem("addQuestionAnswer")
    );
    if (
      addQuestionAnswerObj !== undefined &&
      addQuestionAnswerObj !== null &&
      addQuestionAnswerObj.length > 0
    ) {
      let mainQsId =
        this.state.addAnotherConditionMainDropdwnList !== undefined &&
        this.state.addAnotherConditionMainDropdwnList.length > 0 &&
        this.state.addAnotherConditionMainDropdwnList.filter((listData) => {
          if (listData.maianClickedQsId !== undefined) {
            return listData;
          }
          return listData;
        });
      if (mainQsId !== undefined && mainQsId.length > 0) {
        mainQsId =
          mainQsId[0].maianClickedQsId !== undefined
            ? mainQsId[0].maianClickedQsId
            : undefined;
      }
      newFilteredList =
        mainQsId !== undefined && mainQsId !== ""
          ? addQuestionAnswerObj.filter((qsAnsObj) => {
              if (qsAnsObj.maianClickedQsId !== mainQsId) {
                return qsAnsObj;
              }
              return qsAnsObj;
            })
          : [];

      if (
        this.state.addAnotherConditionMainDropdwnList !== undefined &&
        this.state.addAnotherConditionMainDropdwnList.length > 0
      ) {
        this.state.addAnotherConditionMainDropdwnList.forEach((val) => {
          newFilteredList.push(val);
        });
      }
    } else {
      let addAnotherConditionMainDropdwnList = this.state
        .addAnotherConditionMainDropdwnList;
      if (
        addAnotherConditionMainDropdwnList.length === 0 &&
        this.props.item["visibilityRules"]
      ) {
        addAnotherConditionMainDropdwnList = this.props.item["visibilityRules"];
      }
      if (
        addAnotherConditionMainDropdwnList !== undefined &&
        addAnotherConditionMainDropdwnList.length > 0
      ) {
        addAnotherConditionMainDropdwnList.forEach((val) => {
          newFilteredList.push(val);
        });
      }
    }
    if (newFilteredList.length > 0) {
      newFilteredList = newFilteredList.filter((data) => {
        if (data.indexMain !== undefined) {
          return data;
        }
        return data;
      });
      localStorage.removeItem("addQuestionAnswer");
      localStorage.setItem(
        "addQuestionAnswer",
        JSON.stringify(newFilteredList)
      );
    }
  };

  isDeleteAddAnotherLocalstorageDataFX = (deletedIndex) => {
    let addQuestionAnswerObj = JSON.parse(
      localStorage.getItem("addQuestionAnswer")
    );
    let newFilteredList = [];
    this.state.addAnotherConditionMainDropdwnList.map((item, index) => {
      return (item.indexMain = index);
    });

    if (
      addQuestionAnswerObj !== undefined &&
      addQuestionAnswerObj !== null &&
      addQuestionAnswerObj.length > 0
    ) {
      let mainQsId = this.state.addAnotherConditionMainDropdwnList.filter(
        (data) => {
          if (data.maianClickedQsId !== undefined) {
            return data;
          }
          return data;
        }
      );
      if (mainQsId !== undefined && mainQsId.length > 0) {
        mainQsId =
          mainQsId[0].maianClickedQsId !== undefined
            ? mainQsId[0].maianClickedQsId
            : undefined;
      }

      newFilteredList =
        mainQsId !== undefined && mainQsId != null && mainQsId !== ""
          ? addQuestionAnswerObj.filter((f) => {
              if (f.maianClickedQsId !== mainQsId) {
                return f;
              }
              return f;
            })
          : [];
      this.state.addAnotherConditionMainDropdwnList.forEach((val) => {
        newFilteredList.push(val);
      });
    }
    if (newFilteredList.length > 1)
      newFilteredList = newFilteredList.filter((list) => {
        if (list.indexMain !== undefined) {
          return list;
        }
        return list;
      });

    localStorage.removeItem("addQuestionAnswer");
    localStorage.setItem("addQuestionAnswer", JSON.stringify(newFilteredList));
  };

  //_______________________________________________________END-20-06-2019____________________________________
  duplicateControl = (controlData) => {
    let originalKey = controlData.key;
    let previousControl = Object.assign({}, controlData);
    previousControl.key = DraftJS.genKey();
    let updatedarticles = this.props.data.articles;
    let index = updatedarticles.findIndex((obj) => {
      return obj.key === originalKey;
    });
    updatedarticles.splice(index + 1, 0, previousControl);
    this.props.container.updateData({ articles: updatedarticles });
  };
  calculationMessage = (e) => {
    if (e) this.setState({ calculationMessageDiv: false });
    else this.setState({ calculationMessageDiv: true });
  };
  
  responseGoogle = (response) => {
    console.log(response);
    const grant_type = GOOGLEAUTH_CRENDENTIALS.GRANT_TYPE;
    const code = response.code;
    const client_id = GOOGLEAUTH_CRENDENTIALS.CLIENT_ID;
    const client_secret = GOOGLEAUTH_CRENDENTIALS.CLIENT_SECRET;
    const redirect_uri = window.location.origin.toString();
    const formdata = new FormData();
    formdata.append("grant_type", grant_type);
    formdata.append("code", code);
    formdata.append("client_id", client_id);
    formdata.append("client_secret", client_secret);
    formdata.append("redirect_uri", redirect_uri);
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
        console.log(json);
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
      console.log(resProfile)
      this.addAuthAccnt(resProfile);
      // this.getSheetsList(token, "GoogleAuth");
    } else {
      window.alert("SomeThing went wrong please try again?");
      return false;
    }
  };
  addAuthAccnt = (resProfile) => {
    let formModel = {
      ID: DraftJS.genKey(),
      Email: resProfile,
      Type: "GoogleCalender",
      CreatedAt: Date.now(),
      CreatedBy:this.loginUserId,
      TeamName:resProfile.split("(")[0],
      RefreshToken: localStorage.refreshToken,
      KeyType:"refreshToken"
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
      ...this.state.googleAccountsList,
    ];
    this.setState({
      selectedGoogleAccountID: formModel.ID,
      googleAccountsList: arr,
      selectedGoogleAccountValue: arr[0],
    });
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
        let googleArr = result.Items.filter(
          (data) => data.Type === "GoogleCalender"
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
        console.log(arr);
        this.setState({ googleAccountsList: arr });
        if (googleArr.length > 0) {
          this.setState({ selectedGoogleAccountValue: arr[0] });
          this.setState({
            selectedGoogleAccountID: arr[0].IntgrationAccntID,
            isAccountSelected: true,
          });
          // this.getSheetsList(googleArr[0].RefreshToken, "Database");
          this.getGoogleAccessToken(googleArr[0].RefreshToken);
        } else {
          this.setState({
            selectedGoogleAccountValue: {
              label: "No Account",
              value: 0,
              RefreshToken: "",
              IntgrationAccntID: "",
            },
            selectedGoogleAccountID: 0,
            isAccountSelected: false,
          });
        }
      }
    });
  };
  getSavedCalenders(){
    let formModel = {
      integrationType: "GoogleCalender",
      createdBy:this.loginUserId
    };
    try {
      PostData(GOOGLEAUTH_URLS.GET_APPOINTMENT_CALENDERS, formModel).then(
        (result) => {
          if(result.Items.length){
            const newData =  result.Items.map(item => {
              return (
                item['calenders'] = JSON.parse(item.SetUpData)
              )
            })
            this.setState({
              connectedCalenders: newData
            })
          } 
        }
      );
    } catch (err) {
      //console.log(FORM_URLS.POST_FORM, err);
    }
  }
  getGoogleAccessToken = (refreshtoken) => {
    const grant_type = "refresh_token";
    const client_id = GOOGLEAUTH_CRENDENTIALS.CLIENT_ID;
    const client_secret = GOOGLEAUTH_CRENDENTIALS.CLIENT_SECRET;
    //const redirect_uri = GOOGLEAUTH_CRENDENTIALS.REDIRECT_URI;
    const formdata = new FormData();
    formdata.append("grant_type", grant_type);
    formdata.append("refresh_token", refreshtoken);
    formdata.append("client_id", client_id);
    formdata.append("client_secret", client_secret);
    // googleUser.getAuthResponse().id_token
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
      this.getGoogleCalendersList(headers);
    });
  };
  removeAccount = () => {
    const confirm = window.confirm(
      "Woah there! Are you sure you want to remove this connection? Any integrations that use it will immediately stop working. This can't be un-done."
    );
    if (confirm) {
      Delete(GOOGLEAUTH_URLS.REMOVE_ACCOUNT + this.state.selectedGoogleAccountID).then(
        (result) => {
          this.setState({ isAccountSelected: false });
          this.getAccountList();
          console.log("removeAccount result:", result);
        }
      );
    }
  };
  async handleGoogleAccountChange(value){
    console.log(value);
    this.setState({
      selectedGoogleAccountValue: value,
      selectedGoogleAccountID: value.IntgrationAccntID,
    });
    this.getGoogleAccessToken(value.value)
  }
  getGoogleCalendersList = (headers) => {
      GetDataWithHeader(
        GOOGLEAUTH_URLS.GET_GOOGLE_CALENDERS,
        headers
      ).then((result) => {
        if (result != null) {
          // Filter records to get only access role owner
          const list = result.items.filter((item) => {
            return item.accessRole === "owner";
          });

          let objectMap = this.arrayToObj(list, function(item) {
            return {...item, setupId: DraftJS.genKey(), value: item.id, label: item.summary +'-'+ item.timeZone};
          });
          this.setState({
            googleCalendersList: objectMap,
            selectedGoogleCalender: { value: 0, label: "Select" },
            isAccountSelected: true,
            isGoogleCalenderSelected: false,
          });
        }
      });
  };
  handleCalenderSelect(key, e){
    const calId = e.target.value;
    const data = this.state.connectedCalenders.find(cal => cal.setupId == calId);
    this.props.updateArticle(this.props.item.key, key, data);
  }
  handleGoogleCalenderChange(value){
    console.log(value);
    this.setState({
      selectedGoogleCalender: value,
    });
  }
  arrayToObj = (array, fn) => {
    let calenders = [];
    let len = array.length;
    for (let i = 0; i < len; i++) {
      let item = fn(array[i], i, array);
      calenders.push(item);
    }
    return calenders;
  };
  handleInputCalenderName(event){
    this.setState({
      inputCalenderName: event.target.value,
    });
  }
  finishGoogleCalenderSetUp = () => {

    if(!this.state.selectedGoogleAccountID  || this.state.selectedGoogleCalender.value == 0 || this.state.inputCalenderName == ""){
      window.alert("Please answer all required fields");
      return false;
    }

    let googleCalenderSetUpData = {};

    googleCalenderSetUpData = { ...this.state.selectedGoogleCalender, calenderName: this.state.inputCalenderName };


    let formModel = {
      FinishSetupId: googleCalenderSetUpData.setupId,
      Type: "GoogleCalender",
      IntegrationType:"GoogleCalender",
      FormId: localStorage.CurrentFormId,
      setupId: googleCalenderSetUpData.setupId,
      SetUpData: JSON.stringify(googleCalenderSetUpData),
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      RefreshToken: this.state.selectedGoogleAccountValue.value,
      IsConditionalLogic: false,
      Conditions: JSON.stringify([]),
    };

    this.setState({
      isProcessing: true,
    });

    try {
      PostData(INTEGRATIONS_URLS.POST_INTEGRATION_FINISH_SETUP, formModel).then(
        (result) => {
          this.setState({
            isProcessing: false,
          });
          this.closeConnectCalender(googleCalenderSetUpData)
        }
      );
    } catch (err) {
      this.setState({
        isProcessing: false,
      });
    }

  };

  closeConnectCalender(googleCalenderSetUpData){
    this.setState({
      showConnectCalender: false,
      googleCalenderTitle: null,
      selectedGoogleAccount: "",
      selectedGoogleAccountValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
      selectedGoogleAccountID: "",
      GoogleCalenderName: "",
      formSubmitted: false,
      selectedGoogleCalender: {
        label: "Select",
        value: 0,
      },
      GoogleCalenderSelected: { value: 0, label: "select" },
      isGoogleCalenderSelected: false,
      isAccountSelected: false,
      inputCalenderName: "",
      isMultipleCalender: false,
    })
    const newCalendersList = [...this.state.connectedCalenders];
    newCalendersList.push(googleCalenderSetUpData);
    this.setState({
      connectedCalenders: newCalendersList
    });
  }
  getSelectedCalenderItem(key, calItem){
    return this.props.item[key].calenderName == calItem.calenderName;
  }

  openSelectMinutesSection(day){
    this.setState({
      selectedAvailibiltyDay: day,
      showSelectTimeSection: true
    })
  }
  changeTimeMeridiem(key){
    this.setState({
      [key]: this.state[key] == "AM" ? "PM" : "AM"
    })
  }
  restrictAlphabets(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)){
      evt.preventDefault();
    }
  }
  handleChangeAvailibiltyTime(key, type, event){
    let stateObj = {...this.state[key]}
    const timeValue = event.target.value;
    stateObj[type] = timeValue;
    this.setState({
      [key]: stateObj
    })
  }
  canceAddAvailibiltyTime(){
    this.setState({
      showSelectTimeSection: false,
      startTimeMeridiem: 'AM',
      endTimeMeridiem: 'PM',
      availabilityStartTime: {
        hours: "09", 
        minutes: "00"
      },
      availabilityEndTime: {
        hours: "05", 
        minutes: "00"
      },
    })
  }
  addAvailabilityTime(day) {
    if(
      this.state.availabilityStartTime.hours == '' || 
      this.state.availabilityStartTime.minutes == '' || 
      this.state.availabilityEndTime.hours == '' ||
      this.state.availabilityEndTime.minutes == ''
    ) {
      alert("Please fill all fields.");
      return false;
    }

    if(
      Number(this.state.availabilityStartTime.hours) > 12 ||  Number(this.state.availabilityStartTime.hours) < 0 || 
      Number(this.state.availabilityStartTime.minutes) > 59 ||  Number(this.state.availabilityStartTime.minutes) < 0 || 
      Number(this.state.availabilityEndTime.hours) > 12 || Number(this.state.availabilityEndTime.hours) < 0 || 
      Number(this.state.availabilityEndTime.minutes) > 59 ||  Number(this.state.availabilityEndTime.minutes) < 0
    ) {
        alert("Please enter a valid time. Time should be in 12-hour format");
        return false;
    }

    let dayObj = [...this.state.generalMinutesAvailability[day]];
    // if(Number(this.state.availabilityStartTime.hours) >= Number(this.state.availabilityEndTime.hours && this.state.startTimeMeridiem == this.state.endTimeMeridiem)) {
    //   const timeObj = this.state.availabilityEndTime.hours+":"+this.state.availabilityEndTime.minutes + 
    //   this.state.endTimeMeridiem + "-" + this.state.availabilityStartTime.hours+":"+this.state.availabilityStartTime.minutes + 
    //   this.state.startTimeMeridiem;
    //   dayObj.push(timeObj)
    // } else {
      const timeObj = this.state.availabilityStartTime.hours+":"+this.state.availabilityStartTime.minutes + 
      this.state.startTimeMeridiem + "-" + this.state.availabilityEndTime.hours+":"+this.state.availabilityEndTime.minutes + 
      this.state.endTimeMeridiem;
      
      // }
      const checkExist = this.state.generalMinutesAvailability[day].find(obj => obj === timeObj)
      if(!checkExist){
        dayObj.push(timeObj)
        const generalObj = {...this.state.generalMinutesAvailability, [day]: dayObj}
        this.setState({
          generalMinutesAvailability: generalObj
        })
        this.updateArticle("generalMinutesAvailability", generalObj);
      }
      
  }
  removeAvailabilityTime(day, index) {
    let dataObj = {...this.state.generalMinutesAvailability}
    dataObj[day].splice(index, 1);
    this.setState({
      generalMinutesAvailability: dataObj
    })
    this.updateArticle("generalMinutesAvailability", dataObj);
  }
  handleChangeAvailibiltyDays(day, value){
    let dataObj = {...this.state.generalDaysAvailability};
    dataObj[day] = value;
    this.setState({
      generalDaysAvailability: dataObj
    })
    this.updateArticle("generalDaysAvailability", dataObj);
  }
  handleDatesDisbled = (activeStartDate, date, view) => {
    const disabledDates = [
      new Date(2018, 0, 1),
      new Date(2018, 1, 2),
    ];
    (view === 'month') && // Block day tiles only
  disabledDates.some(disabledDate =>
    date.getFullYear() === disabledDate.getFullYear() &&
    date.getMonth() === disabledDate.getMonth() &&
    date.getDate() === disabledDate.getDate())
    // console.log(activeStartDate, date, view);
  }
  handleChangeBlackoutDates = (date) => {
    const startDate = moment(date[0]).format('MMM DD YYYY');
    const endDate = moment(date[1]).format('MMM DD YYYY');
    const dateObj = {start: startDate, end: endDate}
    let blackoutDatesObj = [...this.state.blackoutDates];
    const checkExist = this.state.blackoutDates.find(obj => (obj.start === dateObj.start && obj.end === dateObj.end))
    if(!checkExist){
      blackoutDatesObj.push(dateObj);
      this.setState({
        blackoutDates: blackoutDatesObj
      });
      this.updateArticle("blackoutDates", blackoutDatesObj);
    }
  }
  removeBlackoutDates(index) {
    let blackoutDatesObj = [...this.state.blackoutDates];
    blackoutDatesObj.splice(index, 1);
    this.setState({
      blackoutDates: blackoutDatesObj
    });
    this.updateArticle("blackoutDates", blackoutDatesObj);
  }
  render() {

    // let { value, ...props } = this.props;
    let jsonFromData = JSON.parse(localStorage.getItem("formJSON"));

    return (
      <div className="related-articles">
        <div className="related-articles__inputs">
          <BlockInput
            placeholder={"What is your question ?"}
            value={this.props.item.title}
            styles={{
              padding: "small",
              text: "big",
              required:
                this.props.item.requiredQuestion != null &&
                this.props.item.requiredQuestion === false
                  ? ""
                  : "required",
            }}
            onChange={this._handleTitleChange}
          />
          <BlockInput
            placeholder={"Add some help text."}
            value={this.props.item.link}
            styles={{ padding: "small" }}
            onChange={this._handleLinkChange}
          />
          <BlockSelectOptions
            value={this.props.item.control}
            styles={{ padding: "small" }}
            onChange={this._handleControlChange}
          />
          {this.props.item.control === "price" && (
            <Link
              to={{
                pathname: "ConfigurePayment",
                state: {
                  fromNotifications: this.props.item,
                },
              }}
              className="configrePaymentLink"
              // style={{display:"none"}}
            >
              Connect to Payment Accounts
            </Link>
          )}
        </div>
        <div
          className="related-articles__trash"
          onClick={this._handleDeleteClick}
        >
          <i className="fa fa-trash" />
        </div>
        <div
          className="related-articles__trash"
          onClick={() => this.duplicateControl(this.props.item)}
        >
          <i className="fa fa-copy" />
        </div>
        <div>
          <div
            className="related-articles__trash"
            onClick={this.handleOpenModal}
          >
            <i className="tim-icons icon-settings-gear-63" />
          </div>
          {/* <ConfigurePayment/> */}
          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="onRequestClose"
            onRequestClose={this.handleCloseModal}
            className={
              this.props.item.control === "calculation"
                ? "popup-adjustment"
                : ""
            }
          >
            <div className="header-config">
              <h2 ref={(subtitle) => (this.subtitle = subtitle)}>
                Configure "
                {this.props.item.title === ""
                  ? "untitled"
                  : this.props.item.title}
                "
              </h2>
              <button className="modal-button" onClick={this.handleCloseModal}>Back to editor</button>
            </div>

            {/* Type Of Questions */}

            <div className="col-md-12">
              <label>Type of question</label>
            </div>
            <div className="col-md-12">
              <BlockSelectOptions
                value={this.props.item.control}
                styles={{ padding: "small" }}
                onChange={this._handleControlChange}
              />
            </div>

            {/* Type Of Questions */}
            {this.props.item.control !== "calculation" && (
              <div>
                <div className="col-md-12">
                  <label>Question is required</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.requiredQuestion}
                    onChange={this.handleSwitchChange("requiredQuestion")}
                    value="requiredQuestion"
                    color="primary"
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "calculation" && (
              <div>
                <div className="col-md-12 mt-3">
                  <label>Hide this question</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" />
                    {this.state.CalculationhideShowQuestionInfo}
                  </span>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.hideQuestion}
                    onChange={this.handleSwitchChange("hideQuestion")}
                    value="hideQuestion"
                    color="primary"
                  />
                </div>
              </div>
            )}
            {!this.state.hideQuestion && (
              <div>
                <div className="col-md-12 mt-3">
                  <label>
                    Question visibility logic:{" "}
                    {this.state.visibilityLogic ? "On" : "Off"}
                  </label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                    {this.state.visibilityLogic
                      ? "Show question only when conditions are met"
                      : "Question is always visible"}
                  </span>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.visibilityLogic}
                    onChange={this.handleSwitchChange("visibilityLogic")}
                    value="visibilityLogic"
                    color="primary"
                  />
                </div>
              </div>
            )}

            {/* ------------------------------ Question visibility logic: Off Html start ------------------------*/}

            {this.state.visibilityLogic_Step_1 === true && (
              <div className="VisibilityRules__wrapper margin_bottom">
                {this.state.addAnotherConditionMainDropdwnList !== undefined &&
                  this.state.addAnotherConditionMainDropdwnList.length > 0 &&
                  this.state.addAnotherConditionMainDropdwnList.map(
                    (valMain, indexMain) => {
                      return (
                        <div key={indexMain}>
                          <div className="col-md-11 d-inline-block">
                            {valMain.isShowMultipleOptionsFirstDrop ===
                              true && (
                              <div className="col-md-11 d-inline-block">
                                <select
                                  onChange={(e) =>
                                    this.selectedValueFromMultiple_OptionFX(
                                      valMain,
                                      e,
                                      indexMain
                                    )
                                  }
                                  defaultValue=""
                                >
                                  <option value="" disabled={true}>
                                    Choose question
                                  </option>
                                  {jsonFromData.map(
                                    (data) =>
                                      data.control !== "imageupload" &&
                                      data.control !== "image" &&
                                      data.control !== "fileupload" &&
                                      data.control !== "simpletext" && (
                                        <option
                                          key={data.key}
                                          hidden={
                                            data.key === this.props.item.key
                                              ? true
                                              : false
                                          }
                                          value={data.title + "_" + data.key}
                                        >
                                          {data.title !== ""
                                            ? data.title
                                            : "Untitled"}
                                        </option>
                                      )
                                  )}
                                </select>
                              </div>
                            )}
                            {valMain.isShowMultipleOptions === true && (
                              <div className="col-md-11 d-inline-block margin_bottom ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL">
                                {valMain.AddAnotherConditionSubDropdwnList !==
                                  undefined &&
                                  valMain.AddAnotherConditionSubDropdwnList
                                    .length > 0 &&
                                  valMain.AddAnotherConditionSubDropdwnList.map(
                                    (val, index) => {
                                      return (
                                        <div className="col-md-12  margin_bottom ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL">
                                          <div className="col-md-4 d-inline-block Dropdown-root Dropdown-placeholder">
                                            <select
                                              className="productMainList"
                                              value={val.isSelectedQuestion}
                                              onChange={(e) =>
                                                this.updatedMultipleChoiceIsQuestionFX(
                                                  e,
                                                  valMain,
                                                  val,
                                                  indexMain
                                                )
                                              }
                                              // className="Dropdown-root"
                                            >
                                              <option value="" disabled={true}>
                                                Choose question
                                              </option>
                                              {(valMain.productMainList ===
                                                undefined ||
                                                valMain.productMainList
                                                  .length <= 0) &&
                                                jsonFromData.map(
                                                  (value1, indexArtical) =>
                                                    value1.control !==
                                                      "imageupload" &&
                                                    value1.control !==
                                                      "image" &&
                                                    value1.control !==
                                                      "fileupload" &&
                                                    value1.control !==
                                                      "simpletext" && (
                                                      <option
                                                        hidden={
                                                          value1.key ===
                                                          this.props.item.key
                                                            ? true
                                                            : false
                                                        }
                                                        selected={
                                                          valMain.isSelectedQuestionId ===
                                                          value1.key
                                                            ? true
                                                            : false
                                                        }
                                                        value={
                                                          value1.title +
                                                          "_" +
                                                          value1.key
                                                        }
                                                      >
                                                        {value1.title !== ""
                                                          ? value1.title
                                                          : "Untitled"}
                                                      </option>
                                                    )
                                                )}
                                              {valMain.productMainList !==
                                                undefined &&
                                                valMain.productMainList.length >
                                                  0 &&
                                                valMain.productMainList.map(
                                                  (value1, indexArtical) =>
                                                    value1.control !==
                                                      "imageupload" &&
                                                    value1.control !==
                                                      "image" &&
                                                    value1.control !==
                                                      "fileupload" &&
                                                    value1.control !==
                                                      "simpletext" && (
                                                      <option
                                                        hidden={
                                                          value1.key ===
                                                          this.props.item.key
                                                            ? true
                                                            : false
                                                        }
                                                        selected={
                                                          valMain.isSelectedQuestionId ===
                                                          value1.key
                                                            ? true
                                                            : false
                                                        }
                                                        value={
                                                          value1.title +
                                                          "_" +
                                                          value1.key
                                                        }
                                                      >
                                                        {value1.title !== ""
                                                          ? value1.title
                                                          : "Untitled"}
                                                      </option>
                                                    )
                                                )}
                                            </select>
                                          </div>
                                          <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                            <select
                                              value={val.isSelectedIsOrNotAns}
                                              onChange={(e) =>
                                                this.updatedmultipleChoiceIsAnsIsNotAns(
                                                  e,
                                                  valMain,
                                                  val,
                                                  indexMain
                                                )
                                              }
                                              className="Dropdown-root"
                                            >
                                              <option value="is">is</option>
                                              <option value="isn't">
                                                isn't
                                              </option>
                                              <option value="isAnswered">
                                                is answered
                                              </option>
                                              <option value="isn'tAnswered">
                                                isn't answered
                                              </option>
                                              <option value="contains">
                                                contains
                                              </option>
                                              <option value="doesn'tContain">
                                                doesn't contain
                                              </option>
                                            </select>
                                          </div>
                                          {/*________________________________________________________Display Html of question type is empty string text---START-____________________________________________________ */}
                                          {(valMain.Controltype === "" ||
                                            valMain.Controltype === "email" ||
                                            valMain.Controltype === "url" ||
                                            valMain.Controltype === "number" ||
                                            valMain.Controltype ===
                                              "phonenumber" ||
                                            valMain.Controltype === "address" ||
                                            valMain.Controltype === "country" ||
                                            valMain.Controltype === "date" ||
                                            valMain.Controltype === "time" ||
                                            valMain.Controltype ===
                                              "imageupload" ||
                                            valMain.Controltype ===
                                              "fileupload" ||
                                            valMain.Controltype ===
                                              "signature" ||
                                            valMain.Controltype ===
                                              "hidden") && (
                                            <div className="col-md-3 d-inline-block">
                                              <div className="_3pHqiVubpMLEJl33qP-THz ">
                                                <input
                                                  className="FieldConfiguration__input"
                                                  onChange={(e) =>
                                                    this.handleInputChangeIsAnswerFFX(
                                                      e,
                                                      valMain,
                                                      val,
                                                      indexMain
                                                    )
                                                  }
                                                  placeholder="Answer..."
                                                  value={val.isAnswer}
                                                />
                                              </div>
                                            </div>
                                          )}
                                          {/*________________________________________________________Display Html of question type is empty string text---END-____________________________________________________ */}
                                          {/*________________________________________________________Display Html of question type is yes/no---START-____________________________________________________ */}
                                          {valMain.Controltype !== undefined &&
                                            valMain.Controltype !== "" &&
                                            valMain.Controltype === "yesno" && (
                                              <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                <select
                                                  value={val.isAnswer}
                                                  onChange={(e) =>
                                                    this.handleInputChangeIsAnswerFFX(
                                                      e,
                                                      valMain,
                                                      val,
                                                      indexMain
                                                    )
                                                  }
                                                  className="Dropdown-root"
                                                >
                                                  <option
                                                    value=""
                                                    disabled={true}
                                                  >
                                                    Choose answer
                                                  </option>
                                                  <option value="Yes">
                                                    Yes
                                                  </option>
                                                  <option value="No">No</option>
                                                </select>
                                              </div>
                                            )}
                                          {/*________________________________________________________Display Html of question type is yes/no---END-____________________________________________________ */}
                                          {/*________________________________________________________Display Html of question type is SCALE---START-____________________________________________________ */}
                                          {valMain.Controltype !== undefined &&
                                            valMain.Controltype !== "" &&
                                            (valMain.Controltype === "scale" ||
                                              valMain.Controltype ===
                                                "dropdown") && (
                                              <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                <select
                                                  value={val.isAnswer}
                                                  onChange={(e) =>
                                                    this.handleInputChangeIsAnswerFFX(
                                                      e,
                                                      valMain,
                                                      val,
                                                      indexMain
                                                    )
                                                  }
                                                  className="Dropdown-root"
                                                >
                                                  {valMain.scaleOptions !==
                                                    undefined &&
                                                    valMain.scaleOptions !=
                                                      null &&
                                                    valMain.scaleOptions
                                                      .length > 0 &&
                                                    valMain.scaleOptions.map(
                                                      (SLdata) => (
                                                        <option value={SLdata}>
                                                          {SLdata}
                                                        </option>
                                                      )
                                                    )}
                                                </select>
                                              </div>
                                            )}
                                          {/* ----------------------------------------------multiplechoice----------------------------------------------------- */}
                                          {valMain.Controltype !== undefined &&
                                            valMain.Controltype !== "" &&
                                            valMain.Controltype ===
                                              "multiplechoice" && (
                                              <div className="col-md-3 d-inline-blockDropdown-root Dropdown-placeholder">
                                                <select
                                                  value={val.isAnswer}
                                                  onChange={(e) =>
                                                    this.handleInputChangeIsAnswerFFX(
                                                      e,
                                                      valMain,
                                                      val,
                                                      indexMain
                                                    )
                                                  }
                                                  className="Dropdown-root"
                                                >
                                                  <option
                                                    disabled={true}
                                                    value=""
                                                  >
                                                    Choose answer
                                                  </option>
                                                  {valMain.scaleOptions !==
                                                    undefined &&
                                                    valMain.scaleOptions !=
                                                      null &&
                                                    valMain.scaleOptions
                                                      .length > 0 &&
                                                    valMain.scaleOptions.map(
                                                      (SLdata) => (
                                                        <option
                                                          value={SLdata.value}
                                                        >
                                                          {SLdata.value}
                                                        </option>
                                                      )
                                                    )}
                                                </select>
                                              </div>
                                            )}
                                          {/*________________________________________________________Display Html of question type is SCALE---END-____________________________________________________ */}
                                          {valMain.Controltype !== undefined &&
                                            valMain.Controltype !== "" &&
                                            valMain.Controltype ===
                                              "products" && (
                                              <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                <select
                                                  value={val.isAnswer}
                                                  onChange={(e) =>
                                                    this.handleInputChangeIsAnswerFFX(
                                                      e,
                                                      valMain,
                                                      val,
                                                      indexMain
                                                    )
                                                  }
                                                  className="Dropdown-root"
                                                >
                                                  <option
                                                    disabled={true}
                                                    value=""
                                                  >
                                                    Choose answer
                                                  </option>
                                                  {valMain.productList !==
                                                    undefined &&
                                                    valMain.productList !=
                                                      null &&
                                                    valMain.productList.length >
                                                      0 &&
                                                    valMain.productList.map(
                                                      (productdata) => (
                                                        <option
                                                          value={
                                                            productdata.SKU
                                                          }
                                                        >
                                                          {productdata.SKU}
                                                        </option>
                                                      )
                                                    )}
                                                </select>
                                              </div>
                                            )}
                                          {/*___________________________________________________Subscription-START_____________________________________________________________ */}
                                          {valMain.Controltype !== undefined &&
                                            valMain.Controltype !== "" &&
                                            valMain.Controltype ===
                                              "subscriptions" && (
                                              <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                <select
                                                  value={val.isAnswer}
                                                  className="Dropdown-root"
                                                >
                                                  <option
                                                    selected
                                                    disabled="true"
                                                    value="Choose answer"
                                                  >
                                                    Choose answer
                                                  </option>
                                                  <option value="No options found">
                                                    No options found
                                                  </option>
                                                </select>
                                              </div>
                                            )}
                                          {/*___________________________________________________Subscription-END_____________________________________________________________ */}
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            )}
                            <div className="col-md-1 d-inline-block VisibilityRules__close">
                              <a
                                href="#pablo"
                                onClick={() =>
                                  this.closeButton_visibiltyFX(
                                    valMain,
                                    indexMain
                                  )
                                }
                              >
                                <i
                                  className="material-icons close_iconFor_Visibility_logic"
                                  style={{ margin: "0px line-height: 1.5" }}
                                >
                                  x
                                </i>
                              </a>
                            </div>

                            {valMain.IsShowAndOr === true && (
                              <div
                                className="ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL"
                                style={{ textAlign: "center" }}
                              >
                                <div className="AdoKE9nnvZr4_zfgdeh5N">
                                  <div
                                    id={"isAnd" + indexMain}
                                    className={
                                      valMain.IsAnd
                                        ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                        : "BtnV2 BtnV2--sm BtnV2--primary"
                                    }
                                    onClick={() =>
                                      this.isAndHandler(
                                        valMain,
                                        "isAnd",
                                        indexMain
                                      )
                                    }
                                    style={{ margin: "10px 5px 10px 10px" }}
                                  >
                                    <span>And</span>
                                  </div>
                                  <div
                                    id={"isOr" + indexMain}
                                    className={
                                      valMain.IsOr
                                        ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                        : "BtnV2 BtnV2--sm BtnV2--primary"
                                    }
                                    onClick={() =>
                                      this.isAndHandler(
                                        valMain,
                                        "Or",
                                        indexMain
                                      )
                                    }
                                    style={{ margin: "10px 10px 10px 5px" }}
                                  >
                                    <span>Or</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                {
                  <div style={{ textAlign: "center" }}>
                    <div
                      className="BtnV2 BtnV2--primary"
                      style={{ marginTop: "15px" }}
                      onClick={this.addAnotherConditionHandler}
                    >
                      <span>Add another condition</span>
                    </div>
                  </div>
                }
              </div>
            )}

            {/*--------------------------------Question visibility logic: Off Html End---------------------------*/}

            {this.props.item.control === "calculation" && (
              <div className="mt-3">
                <div className="col-md-12">
                  <label>Calculation </label>
                </div>
                <div className="col-md-12">
                  <textarea
                    //className="calculationTextAreaResize"
                    rows={3}
                    placeholder="1 + 2"
                    onChange={this.handleCalculation_txtArea}
                    value={this.state.calculationtext}
                  />
                  <div
                    className="FormTagInput__insert"
                    onClick={() =>
                      this.calculationMessage(this.state.calculationMessageDiv)
                    }
                  >
                    <i className="fa fa-bars custom-alignment">
                      <i className="fa fa-plus" />
                    </i>
                  </div>
                  {this.state.calculationMessageDiv && (
                    <div className="Calculation_div_message_align">
                      <div
                        contenteditable="false"
                        className="FormTagInput__options"
                        style={{
                          width: "300px;",
                          marginleft: "-300px;",
                          margintop: "20px;",
                        }}
                      >
                        <div className="FormTagInput__option">
                          <span className="FormTagInput__optionTitle">
                            WHAT{" "}
                          </span>
                          <span className="FormTagInput__optionExample">
                            Hello World!
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {this.props.item.control === "calculation" && (
              <div className="mt-3">
                <div className="col-md-12">
                  <label>Live Preview </label>
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
                        Based on latest submission .
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <input
                    className={this.state.calculationPreviewClassName}
                    value={this.state.calculationPreview}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "address" && (
              <div>
                <div className="col-md-12 mt-3">
                  <label>Require Zip/Post Code</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" /> Turn
                    this off if you don't want the Zip/Post Code.
                  </span>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.requireZipCode}
                    onChange={this.handleCommonSwitchChange("requireZipCode")}
                    value="requireZipCode"
                    color="primary"
                  />
                </div>
                <div className="col-md-12 mt-3">
                  <label>Restrict addresses to a country</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.restrictCountry}
                    onChange={this.handleCommonSwitchChange("restrictCountry")}
                    value="restrictCountry"
                    color="primary"
                  />
                </div>
                {this.state.restrictCountry && (
                  <div className="col-md-12 mt-1">
                    <Select
                      options={countriesData}
                      name="countryRestrictipn"
                      id={"countryRestrictipn" + this.props.id}
                      value={this.state.restrictedCountry}
                      onChange={(e) =>
                        this.handleCommonSelectChange("restrictedCountry", e)
                      }
                    />
                  </div>
                )}
              </div>
            )}
            {this.props.item.control === "scale" && (
              <div>
                <div className="col-md-12">
                  <label>Options</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" /> Place
                    each option on a new line.
                  </span>
                </div>
                <div className="col-md-12">
                  <textarea
                    value={this.state.selectedScaleOptions}
                    onChange={this.bindScaleOptions}
                  />
                </div>
                <div className="col-md-12">
                  {this.state.scaleOptions.map((e, key) => {
                    return (
                      <span className="preview" key={key}>
                        {e}
                      </span>
                    );
                  })}
                </div>
                <div className="col-md-12">
                  <label>Display the options vertically</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.displayOptionVertically}
                    onChange={this.handleCommonSwitchChange(
                      "displayOptionVertically"
                    )}
                    value="displayOptionVertically"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Display the options vertically on mobile</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" />
                    If the options don't fit horizontally on mobile, you can
                    display them vertically.
                  </span>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.displayOptionVerticallyOnMob}
                    onChange={this.handleCommonSwitchChange(
                      "displayOptionVerticallyOnMob"
                    )}
                    value="displayOptionVerticallyOnMob"
                    color="primary"
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "date" && (
              <div>
                <div className="col-md-12">
                  <label>Only allow dates in the past</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.allowPastDate}
                    onChange={this.handleCommonSwitchChange("allowPastDate")}
                    value="allowPastDate"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Only allow dates in the future</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.allowFutureDate}
                    onChange={this.handleCommonSwitchChange("allowFutureDate")}
                    value="allowFutureDate"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Set the default answer to today</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.setDefaultAnsToday}
                    onChange={this.handleCommonSwitchChange(
                      "setDefaultAnsToday"
                    )}
                    value="setDefaultAnsToday"
                    color="primary"
                  />
                </div>
                {!this.state.setDefaultAnsToday && (
                  <div>
                    <div className="col-md-12">
                      <label>Default Answer</label>
                    </div>
                    <div className="col-md-12">
                      <DateControl
                        from="Settings"
                        parentClass="ProductConfiguration__DefaultBlock"
                        selectedDay={this.props.item.selectedDay}
                        selectedMonth={this.props.item.selectedMonth}
                        selectedYear={this.props.item.selectedYear}
                        selectedFormat={this.state.selectedFormat}
                        allowFutureDate={this.state.allowFutureDate}
                        allowPastDate={this.state.allowPastDate}
                        updateArticle={this.updateArticle}
                      />
                    </div>
                  </div>
                )}
                <div className="col-md-12">
                  <label>Order of date</label>
                </div>
                <div className="col-md-12">
                  <SelectControl
                    from="Settings"
                    name="OrderOfDate"
                    options={this.state.orderOfDateOptions}
                    defaultVal={this.props.item.selectedFormat}
                    id={this.props.item.key}
                    updateArticle={this.updateArticle}
                    handleChange={this.handleFormat}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "time" && (
              <div>
                <div className="col-md-12">
                  <label>Use 24 hour time</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.use24Hours}
                    onChange={this.handleCommonSwitchChange("use24Hours")}
                    value="use24Hours"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Default Answer</label>
                </div>
                <div className="col-md-12">
                  <Time
                    from="Settings"
                    name="time"
                    use24Hours={this.state.use24Hours}
                    hoursVal={this.props.item.hoursVal}
                    minutes={this.props.item.minutes}
                    timeFormat={this.props.item.timeFormat}
                    parentClass={"ProductConfiguration__DefaultBlock"}
                    updateArticle={this.updateArticle}
                  />
                </div>
              </div>
            )}
            {(this.props.item.control === "text" ||
              this.props.item.control === "") && (
              <div>
                <div className="col-md-12">
                  <label>Allow multiple lines of text</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.isNewLine}
                    onChange={this.handleSwitchChange("isNewLine")}
                    value="isNewLine"
                    color="primary"
                  />
                </div>
              </div>
            )}
            {(this.props.item.control === "text" ||
              this.props.item.control === "") &&
              this.state.isNewLine && (
                <div>
                  <div>
                    <div className="col-md-12">
                      <label>
                        How many lines of text should the question be?
                      </label>
                    </div>
                    <div className="col-md-12">
                      <span className="info-decr">
                        <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                        This controls how large the box is for the user to enter
                        into.
                      </span>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <input
                      type="number"
                      min="1"
                      value={this.state.textareaRows}
                      onChange={this.handleRowsTextArea}
                    />
                  </div>
                </div>
              )}
            {this.props.item.control === "multiplechoice" && (
              <div>
                <div className="col-md-12">
                  <label>Can choose more than one answer</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.multianswerquestion}
                    onChange={this.handleSwitchChange("multianswerquestion")}
                    value="multianswerquestion"
                    color="primary"
                  />
                </div>
                {this.state.multianswerquestion && (
                  <div>
                    <div className="col-md-12">
                      <label>Maximum number of answers</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        type="number"
                        name="maxAnswer"
                        defaultValue={this.state.maxAnswer}
                        onChange={this.handleMinMaxSelectChange}
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Minimum number of answers</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        type="number"
                        name="minAnswer"
                        defaultValue={this.state.minAnswer}
                        onChange={this.handleMinMaxSelectChange}
                      />
                    </div>
                  </div>
                )}
                <div className="col-md-12">
                  <label>Options</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" /> Place
                    each option on a new line.
                  </span>
                </div>
                <div className="col-md-12">
                  <textarea
                    value={this.state.selectedMultipleChoice}
                    onChange={this.bindOptions}
                  />
                </div>
                <div className="col-md-12">
                  {this.state.multipleChoiceArray.map((e, key) => {
                    return (
                      <span className="preview" key={key}>
                        {e.label}
                      </span>
                    );
                  })}
                </div>
                <div className="col-md-12">
                  <label>Add images to the options</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.addImageToOption_MultipleChoice}
                    onChange={this.handleSwitchChange(
                      "addImageToOption_MultipleChoice"
                    )}
                    value="addImageToOption_MultipleChoice"
                    color="primary"
                  />
                </div>
                {this.state.addImageToOption_MultipleChoice && (
                  <div className="col-md-12 settings-options-image-div">
                    <div className="row">
                      {this.state.multipleChoiceArray.map((element, key) => {
                        let imgId = key + this.props.item.key.trim();
                        let imgSrcStateName = "file" + imgId;
                        return (
                          <div className="col-md-6 add-image-option" key={key}>
                            <label>{element.label}</label>
                            <span className="spanImagePreview">
                              <input
                                type="file"
                                className="filePreview"
                                accept="image/*"
                                id={imgId}
                                onChange={(e) => this.handleFileChange(e, key)}
                              />
                              <div className="File_label">Choose a file</div>
                              <div id={imgId} className="imgPreview">
                                <img
                                  alt=" "
                                  src={this.state[imgSrcStateName]}
                                />
                              </div>
                            </span>
                            <span
                              className="btn-raised btn-default remove-file"
                              onClick={() => this.removeFile(key, imgId)}
                            >
                              Remove file
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="col-md-12">
                  <label>Hide the text when the option has an image</label>
                </div>

                <div className="col-md-12">
                  <Switch
                    checked={this.state.hideTextFromOption_MultipleChoice}
                    onChange={this.handleSwitchChange(
                      "hideTextFromOption_MultipleChoice"
                    )}
                    value="hideTextFromOption_MultipleChoice"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Number of columns</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                    Display the options side by side, up to 5 columns.
                  </span>
                </div>
                <div className="col-md-12">
                  <input type="number" placeholder="" defaultValue={1} />
                </div>
                <div className="col-md-12">
                  <label>Number of columns on mobile</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                    Choose how many columns you would like there to be on
                    smaller screens.
                  </span>
                </div>
                <div className="col-md-12">
                  <input type="number" placeholder="" defaultValue={1} />
                </div>
                <div className="col-md-12">
                  <label>
                    Include an “Other” option to specify another answer.
                  </label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.includeOtherOption_MultipleChoice}
                    onChange={this.handleSwitchChange(
                      "includeOtherOption_MultipleChoice"
                    )}
                    value="includeOtherOption_MultipleChoice"
                    color="primary"
                  />
                </div>
                <div>
                  <div className="col-md-12">
                    <label>Default answer</label>
                  </div>
                  <div className="col-md-12">
                    <MultipleChoice
                      from="Settings"
                      id={this.props.item.key}
                      multiChoiceOptions={this.state.multipleChoiceArray}
                      multianswerquestion={this.state.multianswerquestion}
                      minAnswer={this.state.minAnswer}
                      maxAnswer={this.state.maxAnswer}
                      hideLabelFromImg={
                        this.state.hideTextFromOption_MultipleChoice
                      }
                      defaultVal={this.props.item.defaultVal}
                      otherOptionVal={this.props.item.otherOptionVal}
                      addImageToOption_MultipleChoice={
                        this.state.addImageToOption_MultipleChoice
                      }
                      handleChange={this.handleSelectChange}
                    />
                  </div>
                </div>
              </div>
            )}
            {this.props.item.control === "multiplechoice" ||
              (this.props.item.control !== "imageupload" &&
                this.props.item.control !== "fileupload" &&
                this.props.item.control !== "yesno" &&
                this.props.item.control !== "address" &&
                this.props.item.control !== "country" &&
                this.props.item.control !== "date" &&
                this.props.item.control !== "time" &&
                this.props.item.control !== "scale" &&
                this.props.item.control !== "signature" &&
                this.props.item.control !== "colorpicker" &&
                this.props.item.control !== "appointment" &&
                this.props.item.control !== "calculation" && (
                  <div className="mt-3">
                    <div className="col-md-12">
                      <label>Placeholder Text</label>
                    </div>
                    <div className="col-md-12">
                      <input
                        onChange={this.handlePlaceHolder_txtArea}
                        value={this.state.placeholder}
                      />
                    </div>
                  </div>
                ))}
            {this.props.item.control === "phonenumber" && (
              <div className="mb-4">
                <div className="col-md-12">
                  <label>Format of phone number</label>
                </div>
                <div className="col-md-12">
                  <SelectControl
                    from="Settings"
                    name="PhoneNumberFormat"
                    options={this.state.PhNumberformatOption}
                    id={this.props.item.key}
                    defaultVal={this.state.selectedFormat}
                    handleChange={this.handleFormat}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "number" && (
              <div>
                <div className="col-md-12">
                  <label>Minimum value</label>
                </div>
                <div className="col-md-12">
                  <input
                    type="number"
                    name="minVal"
                    value={this.state.minInputVal}
                    onChange={(e) =>
                      this.handleCommonChange("minInputVal", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label>Maximum value</label>
                </div>
                <div className="col-md-12">
                  <input
                    type="number"
                    name="maxInputVal"
                    value={this.state.maxInputVal}
                    onChange={(e) =>
                      this.handleCommonChange("maxInputVal", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label>Answer must be a whole number</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.isWholeNumber}
                    onChange={this.handleCommonSwitchChange("isWholeNumber")}
                    value="isWholeNumber"
                    color="primary"
                  />
                </div>

                <div className="col-md-12">
                  <label>Number input formatting </label>
                  <span className="ml-2">
                    <i className="fa fa-info-circle" aria-hidden="true" />
                  </span>
                </div>
                <div className="col-md-12">
                  <SelectControl
                    from="Settings"
                    RemoveAnswer={false}
                    name="NumberFormatting"
                    parentClass="ProductConfiguration__DefaultBlock"
                    options={this.state.numberformatingOption}
                    id={this.props.item.key}
                    defaultVal={this.state.selectedNumberFormat}
                    handleChange={this.handleFormat}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "dropdown" && (
              <div>
                <div className="col-md-12">
                  <label>Can choose more than one answer</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.multianswerquestion}
                    onChange={this.handleSwitchChange("multianswerquestion")}
                    value="multianswerquestion"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Options</label>
                </div>
                <div className="col-md-12">
                  <span className="info-decr">
                    <i className="fa fa-info-circle" aria-hidden="true" /> Place
                    each option on a new line.
                  </span>
                </div>
                <div className="col-md-12">
                  <textarea
                    value={this.state.DropdownOption}
                    onChange={this.bindDropdownOptions}
                  />
                </div>
                <div className="col-md-12">
                  {this.state.dropdownOptionArray.map((e, key) => {
                    return (
                      <span className="preview" key={key}>
                        {e.label}
                      </span>
                    );
                  })}
                </div>
                <div className="col-md-12">
                  <label>
                    Include an “Other” option to specify another answer.
                  </label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.includeOtherOption_Dropdown}
                    onChange={this.handleSwitchChange(
                      "includeOtherOption_Dropdown"
                    )}
                    value="includeOtherOption_Dropdown"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Default answer</label>
                </div>
                <div className="col-md-12">
                  <SelectControl
                    from="Settings"
                    name="dropdown"
                    options={this.state.dropdownOptionArray}
                    defaultVal={this.props.item.defaultVal}
                    otherOptionVal={this.props.item.otherOptionVal}
                    id={this.props.item.key}
                    placeholder={this.state.placeholder}
                    multi={this.state.multianswerquestion}
                    handleChange={this.handleSelectChange}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "email" && (
              <div>
                <div className="col-md-12">
                  <label>Require users to confirm the email address</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.confirmEmail}
                    onChange={this.handleSwitchChange("confirmEmail")}
                    value="confirmEmail"
                    color="primary"
                  />
                </div>
              </div>
            )}
            {(this.props.item.control === "text" ||
              this.props.item.control === "" ||
              this.props.item.control === "phonenumber") && (
              <div>
                <div>
                  <div className="col-md-12">
                    <label>Minimum length (characters)</label>
                  </div>
                  <div className="col-md-12">
                    <input
                      type="number"
                      min="1"
                      className={this.state.disabledColor}
                      onChange={this.handleMinMaxLength("minLength_Textarea")}
                      value={this.state.minLength}
                      disabled={this.state.disabled}
                    />
                  </div>
                </div>
                <div>
                  <div className="col-md-12">
                    <label>Maximum length (characters)</label>
                  </div>
                  <div className="col-md-12">
                    <input
                      type="number"
                      min="1"
                      className={this.state.disabledColor}
                      onChange={this.handleMinMaxLength("maxLength_Textarea")}
                      value={this.state.maxLength}
                      disabled={this.state.disabled}
                    />
                  </div>
                </div>
              </div>
            )}

            {(this.props.item.control === "imageupload" ||
              this.props.item.control === "fileupload") && (
              <div>
                <div className="col-md-12">
                  <label>Can upload multiple files</label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.props.item.isMultipleFileUpload}
                    onChange={this.handleSwitchChange("isMultipleFileUpload")}
                    value="isMultipleFileUpload"
                    color="primary"
                  />
                </div>
              </div>
            )}

            {(this.props.item.control === "imageupload" ||
              this.props.item.control === "fileupload") &&
              this.state.isMultipleFileUpload === true && (
                <div>
                  <div className="col-md-12">
                    <label>Minimum number of Files</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={this.props.item.minimumFiles}
                      onChange={this.minimumFilesSelection}
                    />
                  </div>
                  <div className="col-md-12">
                    <label> Maximum number Of Files </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={this.props.item.maximumFiles}
                      onChange={this.maximumFilesSelection}
                    />
                  </div>
                </div>
              )}

            {this.props.item.control === "price" && (
              <div>
                <div className="col-md-12">
                  <label>Price </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="number"
                    onChange={(e) => this.handlePriceChange("setPriceValue", e)}
                    value={this.state.priceValue}
                  />
                </div>
                <div className="col-md-12">
                  <label>Minimum price </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="number"
                    defaultValue={this.state.minimumPriceValue}
                    onChange={(e) => this.handlePriceChange("minimumPrice", e)}
                  />
                </div>
                <div className="col-md-12">
                  <label>Question is read only </label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.isPriceQuestionReadOnly}
                    onChange={this.handleSwitchChange(
                      "isPriceQuestionReadOnly"
                    )}
                    value="isPriceQuestionReadOnly"
                    color="primary"
                  />
                </div>
                <div className="col-md-12">
                  <label>Price is discountable </label>
                </div>
                <div className="col-md-12">
                  <Switch
                    checked={this.state.isDiscountedPriceQuestion}
                    onChange={this.handleSwitchChange(
                      "isDiscountedPriceQuestion"
                    )}
                    value="isDiscountedPriceQuestion"
                    color="primary"
                  />
                </div>
              </div>
            )}
            {(this.props.item.control === "text" ||
              this.props.item.control === "") && (
              <div>
                <div className="col-md-12">
                  <label>Default answer</label>
                </div>
                <div className="col-md-12">
                  <TextArea
                    from="Settings"
                    handleChange={this.handleDefAnswer_txtArea}
                    defaultText={this.state.defaultVal}
                    maxLength={this.state.maxLength}
                    minLength={this.state.minLength}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "phonenumber" && (
              <div>
                <div className="col-md-12">
                  <label>Default answer</label>
                </div>
                <div className="col-md-12 ">
                  <input
                    type="tel"
                    name="number"
                    onChange={(e) =>
                      this.handleCommonChange("minInputVal", e.target.value)
                    }
                  />
                  {/* <PhoneNumber
                    type="tel"
                    from="settings"
                    name="phonenumber"
                    minLength={this.state.minLength}
                    maxLength={this.state.maxLength}
                    parentClass="ProductConfiguration__DefaultBlock"
                    placeholderData={this.state.placeholder}
                    id={"settings" + this.props.item.key}
                    defaultVal={this.state.selectedFormat.format}
                    updateArticle={this.updateArticle}
                    onChange={this.handleDefAnswer}
                  /> */}
                </div>
              </div>
            )}
            {this.props.item.control === "url" && (
              <div>
                <div className="col-md-12">
                  <label>Default answer</label>
                </div>
                <div className="col-md-12">
                  <Input
                    type="text"
                    from="settings"
                    name="url"
                    size="30"
                    placeholderData={this.state.placeholder}
                    id={"settings" + this.props.item.key}
                    onChange={this.handleDefAnswer_txtArea}
                  />
                </div>
              </div>
            )}
            {this.props.item.control === "yesno" && (
              <div>
                <div className="col-md-12">
                  <label>Default answer</label>
                </div>
                <div className="col-md-12">
                  <div className="YesNo">
                    <RadioButtons
                      className="btn-raised btn-primary"
                      from="settings"
                      type="radio"
                      name="yesnoRadio"
                      defaultVal={this.props.item.defaultVal}
                      id={"settings" + this.props.item.key}
                      onChange={this.handleDefAnswer}
                    />
                  </div>
                </div>
              </div>
            )}
            {this.props.item.control === "country" && (
              <div>
                <div className="col-md-12">
                  <label>Default answer</label>
                </div>
                <div className="col-md-12">
                  <SelectControl
                    name="country"
                    from="Settings"
                    RemoveAnswer={true}
                    parentClass={"ProductConfiguration__DefaultBlock"}
                    options={countriesData}
                    id={this.props.item.key}
                    defaultVal={this.props.item.defaultVal}
                    handleChange={this.handleCommonSelectChange}
                  />
                </div>
              </div>
            )}

            {this.props.item.control === "colorpicker" && (
              <>
                <ColorPickerControl
                  from="Settings"
                  id={this.props.item.key}
                  defaultVal={this.props.item.defaultVal}
                  updateArticle={this.updateArticle}
                  showRemoveButton={true}
                  updateRuiredField={this.updateRuiredField}
                />

                {/* <ColorSwitchesPicker /> */}
                <div>
                  <label>Allow swatches only</label>
                  <div className="col-md-12">
                    <Switch
                      checked={this.state.allowOnlySwitches}
                      onChange={this.handleSwitchChange("allowOnlySwitches")}
                      value="allowOnlySwitches"
                      color="primary"
                    />
                  </div>
                </div>
              </>
            )}

            {this.props.item.control !== "calculation" ||
              (this.props.item.control !== "appointment" && (
                <div>
                  <div className="col-md-12 mt-3">
                    <label>Make question one of two columns</label>
                  </div>
                  <div className="col-md-12">
                    <span className="info-decr">
                      <i className="fa fa-info-circle" aria-hidden="true" /> Two
                      questions must be next to each other for this to be
                      enabled. Columns aren't visible in the editor.
                    </span>
                  </div>
                  <div className="col-md-12">
                    <Switch
                      checked={this.state.columnQuestion}
                      onChange={this.handleSwitchChange("columnQuestion")}
                      value="columnQuestion"
                      color="primary"
                    />
                  </div>
                </div>
              ))}
            {this.props.item.control === "calculation" && (
              <CalculationHelp
                GetCopyData={this.GetCalculationCopyData}
                handleCall_CopyData={this.handleCall_CopyData}
              >
                {" "}
              </CalculationHelp>
            )}
            {this.props.item.control !== "appointment" && (
              <>
                <div className="col-md-12">
                  <label>
                    Pre-fill Key: {this.props.item.key} (What's this?)
                  </label>
                </div>
                <div className="col-md-12">
                  <Input
                    type="text"
                    placeholder="Custom Pre-fill Keyy"
                    defaultText={this.state.preFillKey}
                    onChange={this.handleSwitchChange("PreFillKey_txtArea")}
                  />
                </div>
              </>
            )}
          </ReactModal>
        
      {/*__________________________________________For appointment settings_________________________ */}
          <div className="Products-settings">
            <ReactModal
              isOpen={
                this.state.showModal && this.props.item.control === "appointment"
              }
              contentLabel="onRequestClose"
              onRequestClose={this.handleCloseModal}
              className="Product-Modal"
            >
              <div className="header-config">
                <h2 ref={(subtitle) => (this.subtitle = subtitle)}>
                  Configure "
                  {this.props.item.title === ""
                    ? "untitled"
                    : this.props.item.title}
                  "
                </h2>
                <button className="modal-button" onClick={this.handleCloseModal}>Back to editor</button>
              </div>
              {!this.state.showConnectCalender && ( <div>
                <div className="row">
                  <div className="col-md-4" />
                  <div
                    className="btn-group col-md-4"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      className="btn btn-secondary BtnV2"
                      onClick={() => this.showAppointmentTab("settings")}
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary BtnV2"
                      onClick={() => this.showAppointmentTab("appointmentEventDetails")}
                    >
                      Event Details
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary BtnV2"
                      onClick={() => this.showAppointmentTab("appointmentAvailability")}
                    >
                      Availability
                    </button>
                  </div>
                </div>
                {this.state.selectedTab === "settings" && (
                <div className="row" style={{ justifyContent: "center"}}>
                    <div className="col-md-8">
                      <div className="col-md-12">
                        <label>Type of question</label>
                      </div>
                      <div className="col-md-12">
                        <BlockSelectOptions
                          value={this.props.item.control}
                          styles={{ padding: "small" }}
                          onChange={this._handleControlChange}
                        />
                      </div>
                      <div className="col-md-12">
                        <label>Question is required</label>
                      </div>
                      <div className="col-md-12">
                        <Switch
                          checked={this.state.requiredQuestion}
                          onChange={this.handleSwitchChange("requiredQuestion")}
                          value="requiredQuestion"
                          color="primary"
                        />
                      </div>

                      <div className="col-md-12 mt-3">
                        <label>Question visibility logic: Off</label>
                      </div>
                      <div className="col-md-12">
                        <span className="info-decr">
                          <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                          Show question only when conditions are met
                        </span>
                      </div>
                      <div className="col-md-12">
                        <Switch
                          checked={this.state.visibilityLogic}
                          onChange={this.handleSwitchChange('visibilityLogic')}
                          value="showQuestion"
                          color="primary"
                        />
                      </div>

                      {/* ------------------------------ Question visibility logic: Off Html start ------------------------*/}

                      {this.state.visibilityLogic_Step_1 === true && (
                        <div className="VisibilityRules__wrapper margin_bottom">
                          {this.state.addAnotherConditionMainDropdwnList !== undefined &&
                            this.state.addAnotherConditionMainDropdwnList.length > 0 &&
                            this.state.addAnotherConditionMainDropdwnList.map(
                              (valMain, indexMain) => {
                                return (
                                  <div key={indexMain}>
                                    <div className="col-md-11 d-inline-block">
                                      {valMain.isShowMultipleOptionsFirstDrop ===
                                        true && (
                                        <div className="col-md-11 d-inline-block">
                                          <select
                                            onChange={(e) =>
                                              this.selectedValueFromMultiple_OptionFX(
                                                valMain,
                                                e,
                                                indexMain
                                              )
                                            }
                                            defaultValue=""
                                          >
                                            <option value="" disabled={true}>
                                              Choose question
                                            </option>
                                            {jsonFromData.map(
                                              (data) =>
                                                data.control !== "imageupload" &&
                                                data.control !== "image" &&
                                                data.control !== "fileupload" &&
                                                data.control !== "simpletext" && (
                                                  <option
                                                    key={data.key}
                                                    hidden={
                                                      data.key === this.props.item.key
                                                        ? true
                                                        : false
                                                    }
                                                    value={data.title + "_" + data.key}
                                                  >
                                                    {data.title !== ""
                                                      ? data.title
                                                      : "Untitled"}
                                                  </option>
                                                )
                                            )}
                                          </select>
                                        </div>
                                      )}
                                      {valMain.isShowMultipleOptions === true && (
                                        <div className="col-md-11 d-inline-block margin_bottom ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL">
                                          {valMain.AddAnotherConditionSubDropdwnList !==
                                            undefined &&
                                            valMain.AddAnotherConditionSubDropdwnList
                                              .length > 0 &&
                                            valMain.AddAnotherConditionSubDropdwnList.map(
                                              (val, index) => {
                                                return (
                                                  <div className="col-md-12  margin_bottom ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL">
                                                    <div className="col-md-4 d-inline-block Dropdown-root Dropdown-placeholder">
                                                      <select
                                                        className="productMainList"
                                                        value={val.isSelectedQuestion}
                                                        onChange={(e) =>
                                                          this.updatedMultipleChoiceIsQuestionFX(
                                                            e,
                                                            valMain,
                                                            val,
                                                            indexMain
                                                          )
                                                        }
                                                        // className="Dropdown-root"
                                                      >
                                                        <option value="" disabled={true}>
                                                          Choose question
                                                        </option>
                                                        {(valMain.productMainList ===
                                                          undefined ||
                                                          valMain.productMainList
                                                            .length <= 0) &&
                                                          jsonFromData.map(
                                                            (value1, indexArtical) =>
                                                              value1.control !==
                                                                "imageupload" &&
                                                              value1.control !==
                                                                "image" &&
                                                              value1.control !==
                                                                "fileupload" &&
                                                              value1.control !==
                                                                "simpletext" && (
                                                                <option
                                                                  hidden={
                                                                    value1.key ===
                                                                    this.props.item.key
                                                                      ? true
                                                                      : false
                                                                  }
                                                                  selected={
                                                                    valMain.isSelectedQuestionId ===
                                                                    value1.key
                                                                      ? true
                                                                      : false
                                                                  }
                                                                  value={
                                                                    value1.title +
                                                                    "_" +
                                                                    value1.key
                                                                  }
                                                                >
                                                                  {value1.title !== ""
                                                                    ? value1.title
                                                                    : "Untitled"}
                                                                </option>
                                                              )
                                                          )}
                                                        {valMain.productMainList !==
                                                          undefined &&
                                                          valMain.productMainList.length >
                                                            0 &&
                                                          valMain.productMainList.map(
                                                            (value1, indexArtical) =>
                                                              value1.control !==
                                                                "imageupload" &&
                                                              value1.control !==
                                                                "image" &&
                                                              value1.control !==
                                                                "fileupload" &&
                                                              value1.control !==
                                                                "simpletext" && (
                                                                <option
                                                                  hidden={
                                                                    value1.key ===
                                                                    this.props.item.key
                                                                      ? true
                                                                      : false
                                                                  }
                                                                  selected={
                                                                    valMain.isSelectedQuestionId ===
                                                                    value1.key
                                                                      ? true
                                                                      : false
                                                                  }
                                                                  value={
                                                                    value1.title +
                                                                    "_" +
                                                                    value1.key
                                                                  }
                                                                >
                                                                  {value1.title !== ""
                                                                    ? value1.title
                                                                    : "Untitled"}
                                                                </option>
                                                              )
                                                          )}
                                                      </select>
                                                    </div>
                                                    <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                      <select
                                                        value={val.isSelectedIsOrNotAns}
                                                        onChange={(e) =>
                                                          this.updatedmultipleChoiceIsAnsIsNotAns(
                                                            e,
                                                            valMain,
                                                            val,
                                                            indexMain
                                                          )
                                                        }
                                                        className="Dropdown-root"
                                                      >
                                                        <option value="is">is</option>
                                                        <option value="isn't">
                                                          isn't
                                                        </option>
                                                        <option value="isAnswered">
                                                          is answered
                                                        </option>
                                                        <option value="isn'tAnswered">
                                                          isn't answered
                                                        </option>
                                                        <option value="contains">
                                                          contains
                                                        </option>
                                                        <option value="doesn'tContain">
                                                          doesn't contain
                                                        </option>
                                                      </select>
                                                    </div>
                                                    {/*________________________________________________________Display Html of question type is empty string text---START-____________________________________________________ */}
                                                    {(valMain.Controltype === "" ||
                                                      valMain.Controltype === "email" ||
                                                      valMain.Controltype === "url" ||
                                                      valMain.Controltype === "number" ||
                                                      valMain.Controltype ===
                                                        "phonenumber" ||
                                                      valMain.Controltype === "address" ||
                                                      valMain.Controltype === "country" ||
                                                      valMain.Controltype === "date" ||
                                                      valMain.Controltype === "time" ||
                                                      valMain.Controltype ===
                                                        "imageupload" ||
                                                      valMain.Controltype ===
                                                        "fileupload" ||
                                                      valMain.Controltype ===
                                                        "signature" ||
                                                      valMain.Controltype ===
                                                        "hidden") && (
                                                      <div className="col-md-3 d-inline-block">
                                                        <div className="_3pHqiVubpMLEJl33qP-THz ">
                                                          <input
                                                            className="FieldConfiguration__input"
                                                            onChange={(e) =>
                                                              this.handleInputChangeIsAnswerFFX(
                                                                e,
                                                                valMain,
                                                                val,
                                                                indexMain
                                                              )
                                                            }
                                                            placeholder="Answer..."
                                                            value={val.isAnswer}
                                                          />
                                                        </div>
                                                      </div>
                                                    )}
                                                    {/*________________________________________________________Display Html of question type is empty string text---END-____________________________________________________ */}
                                                    {/*________________________________________________________Display Html of question type is yes/no---START-____________________________________________________ */}
                                                    {valMain.Controltype !== undefined &&
                                                      valMain.Controltype !== "" &&
                                                      valMain.Controltype === "yesno" && (
                                                        <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                          <select
                                                            value={val.isAnswer}
                                                            onChange={(e) =>
                                                              this.handleInputChangeIsAnswerFFX(
                                                                e,
                                                                valMain,
                                                                val,
                                                                indexMain
                                                              )
                                                            }
                                                            className="Dropdown-root"
                                                          >
                                                            <option
                                                              value=""
                                                              disabled={true}
                                                            >
                                                              Choose answer
                                                            </option>
                                                            <option value="Yes">
                                                              Yes
                                                            </option>
                                                            <option value="No">No</option>
                                                          </select>
                                                        </div>
                                                      )}
                                                    {/*________________________________________________________Display Html of question type is yes/no---END-____________________________________________________ */}
                                                    {/*________________________________________________________Display Html of question type is SCALE---START-____________________________________________________ */}
                                                    {valMain.Controltype !== undefined &&
                                                      valMain.Controltype !== "" &&
                                                      (valMain.Controltype === "scale" ||
                                                        valMain.Controltype ===
                                                          "dropdown") && (
                                                        <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                          <select
                                                            value={val.isAnswer}
                                                            onChange={(e) =>
                                                              this.handleInputChangeIsAnswerFFX(
                                                                e,
                                                                valMain,
                                                                val,
                                                                indexMain
                                                              )
                                                            }
                                                            className="Dropdown-root"
                                                          >
                                                            {valMain.scaleOptions !==
                                                              undefined &&
                                                              valMain.scaleOptions !=
                                                                null &&
                                                              valMain.scaleOptions
                                                                .length > 0 &&
                                                              valMain.scaleOptions.map(
                                                                (SLdata) => (
                                                                  <option value={SLdata}>
                                                                    {SLdata}
                                                                  </option>
                                                                )
                                                              )}
                                                          </select>
                                                        </div>
                                                      )}
                                                    {/* ----------------------------------------------multiplechoice----------------------------------------------------- */}
                                                    {valMain.Controltype !== undefined &&
                                                      valMain.Controltype !== "" &&
                                                      valMain.Controltype ===
                                                        "multiplechoice" && (
                                                        <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                          <select
                                                            value={val.isAnswer}
                                                            onChange={(e) =>
                                                              this.handleInputChangeIsAnswerFFX(
                                                                e,
                                                                valMain,
                                                                val,
                                                                indexMain
                                                              )
                                                            }
                                                            className="Dropdown-root"
                                                          >
                                                            <option
                                                              disabled={true}
                                                              value=""
                                                            >
                                                              Choose answer
                                                            </option>
                                                            {valMain.scaleOptions !==
                                                              undefined &&
                                                              valMain.scaleOptions !=
                                                                null &&
                                                              valMain.scaleOptions
                                                                .length > 0 &&
                                                              valMain.scaleOptions.map(
                                                                (SLdata) => (
                                                                  <option
                                                                    value={SLdata.value}
                                                                  >
                                                                    {SLdata.value}
                                                                  </option>
                                                                )
                                                              )}
                                                          </select>
                                                        </div>
                                                      )}
                                                    {/*________________________________________________________Display Html of question type is SCALE---END-____________________________________________________ */}
                                                    {valMain.Controltype !== undefined &&
                                                      valMain.Controltype !== "" &&
                                                      valMain.Controltype ===
                                                        "products" && (
                                                        <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                          <select
                                                            value={val.isAnswer}
                                                            onChange={(e) =>
                                                              this.handleInputChangeIsAnswerFFX(
                                                                e,
                                                                valMain,
                                                                val,
                                                                indexMain
                                                              )
                                                            }
                                                            className="Dropdown-root"
                                                          >
                                                            <option
                                                              disabled={true}
                                                              value=""
                                                            >
                                                              Choose answer
                                                            </option>
                                                            {valMain.productList !==
                                                              undefined &&
                                                              valMain.productList !=
                                                                null &&
                                                              valMain.productList.length >
                                                                0 &&
                                                              valMain.productList.map(
                                                                (productdata) => (
                                                                  <option
                                                                    value={
                                                                      productdata.SKU
                                                                    }
                                                                  >
                                                                    {productdata.SKU}
                                                                  </option>
                                                                )
                                                              )}
                                                          </select>
                                                        </div>
                                                      )}
                                                    {/*___________________________________________________Subscription-START_____________________________________________________________ */}
                                                    {valMain.Controltype !== undefined &&
                                                      valMain.Controltype !== "" &&
                                                      valMain.Controltype ===
                                                        "subscriptions" && (
                                                        <div className="col-md-3 d-inline-block Dropdown-root Dropdown-placeholder">
                                                          <select
                                                            value={val.isAnswer}
                                                            className="Dropdown-root"
                                                          >
                                                            <option
                                                              selected
                                                              disabled="true"
                                                              value="Choose answer"
                                                            >
                                                              Choose answer
                                                            </option>
                                                            <option value="No options found">
                                                              No options found
                                                            </option>
                                                          </select>
                                                        </div>
                                                      )}
                                                    {/*___________________________________________________Subscription-END_____________________________________________________________ */}
                                                  </div>
                                                );
                                              }
                                            )}
                                        </div>
                                      )}
                                      <div className="col-md-1 d-inline-block VisibilityRules__close">
                                        <a
                                          href="#pablo"
                                          onClick={() =>
                                            this.closeButton_visibiltyFX(
                                              valMain,
                                              indexMain
                                            )
                                          }
                                        >
                                          <i
                                            className="material-icons close_iconFor_Visibility_logic"
                                            style={{ margin: "0px line-height: 1.5" }}
                                          >
                                            x
                                          </i>
                                        </a>
                                      </div>

                                      {valMain.IsShowAndOr === true && (
                                        <div
                                          className="ZtOZviTTkcmz3-DO_OzgS _2GJwnaqQsluFKOCxVoTOym _2qJAdUvXLdQixlGX3vOpbL"
                                          style={{ textAlign: "center" }}
                                        >
                                          <div className="AdoKE9nnvZr4_zfgdeh5N">
                                            <div
                                              id={"isAnd" + indexMain}
                                              className={
                                                valMain.IsAnd
                                                  ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                                  : "BtnV2 BtnV2--sm BtnV2--primary"
                                              }
                                              onClick={() =>
                                                this.isAndHandler(
                                                  valMain,
                                                  "isAnd",
                                                  indexMain
                                                )
                                              }
                                              style={{ margin: "10px 5px 10px 10px" }}
                                            >
                                              <span>And</span>
                                            </div>
                                            <div
                                              id={"isOr" + indexMain}
                                              className={
                                                valMain.IsOr
                                                  ? "BtnV2 BtnV2--sm BtnV2--primary BtnV2--solid"
                                                  : "BtnV2 BtnV2--sm BtnV2--primary"
                                              }
                                              onClick={() =>
                                                this.isAndHandler(
                                                  valMain,
                                                  "Or",
                                                  indexMain
                                                )
                                              }
                                              style={{ margin: "10px 10px 10px 5px" }}
                                            >
                                              <span>Or</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          {
                            <div style={{ textAlign: "center" }}>
                              <div
                                className="BtnV2 BtnV2--primary"
                                style={{ marginTop: "15px" }}
                                onClick={this.addAnotherConditionHandler}
                              >
                                <span>Add another condition</span>
                              </div>
                            </div>
                          }
                        </div>
                      )}

                      {/*--------------------------------Question visibility logic: Off Html End---------------------------*/}

                      <div>
                        <div className="col-md-12">
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              <label>Connect multiple calendars</label>
                            <div className="FieldConfigurationField__i">
                              <svg
                                fill="currentColor"
                                preserveAspectRatio="xMidYMid meet"
                                height="1em"
                                width="1em"
                                viewBox="0 0 40 40"
                                style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                              >
                                <g>
                                  <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                </g>
                              </svg>
                              <div className="FieldConfigurationField__description">
                                <div className="FieldConfigurationField__descriptioninner">
                                You can connect multiple calendars to check availability against and book appointments on.
                                </div>
                              </div>
                            </div>
                          </div>      
                              <Switch
                                checked={this.state.isMultipleCalender}
                                onChange={this.handleSwitchChange("isMultipleCalender")}
                                value="isMultipleCalender"
                                color="primary"
                                />
                            </div>
                        </div>
                        {!this.state.isMultipleCalender && (
                          <div>
                            <div className="col-md-12">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                <label>Calendar</label>
                                <div className="FieldConfigurationField__i">
                                  <svg
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                    height="1em"
                                    width="1em"
                                    viewBox="0 0 40 40"
                                    style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                                  >
                                    <g>
                                      <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                    </g>
                                  </svg>
                                  <div className="FieldConfigurationField__description">
                                    <div className="FieldConfigurationField__descriptioninner">
                                    The selected calendar will be used to block out availability, and a meeting will be created on this calendar automatically on submission.
                                    </div>
                                  </div>
                                </div>
                              </div>      
                              <div className="row">
                                  <div className="col-md-8">
                                    <div className="block__input__row">
                                        <div className="block__input__wrapper">
                                          <div>
                                            <select onChange={(e) => this.handleCalenderSelect('calender', e)} value={this.props.item['calender'] ? this.props.item['calender'].setupId || '' : ''}>
                                              <option value="text">-None selected-</option>
                                              {this.state.connectedCalenders.map((cal, i) => {
                                                return (
                                                  <option value={cal.setupId} key={'calender-'+i+cal.etag}>{cal.calenderName}</option>
                                                )
                                              })}
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                                  <div className="col-md-3">
                                    <button className="modal-button" onClick={() => this.handleAddCalenderSection(true)}>+Calender</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          )}
                        {this.state.isMultipleCalender && (
                          <div>
                            <div>
                            <div className="col-md-12">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                <label>Calendars to check availability on</label>
                                <div className="FieldConfigurationField__i">
                                  <svg
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                    height="1em"
                                    width="1em"
                                    viewBox="0 0 40 40"
                                    style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                                  >
                                    <g>
                                      <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                    </g>
                                  </svg>
                                  <div className="FieldConfigurationField__description">
                                    <div className="FieldConfigurationField__descriptioninner">
                                    The selected calendars will be used to block out availability.
                                    </div>
                                  </div>
                                </div>
                              </div>      
                              <div className="row">
                                  <div className="col-md-8">
                                    <div className="block__input__row">
                                        <div className="block__input__wrapper">
                                          <div>
                                          <select onChange={(e) => this.handleCalenderSelect('availabilityCalender', e)} value={this.props.item['availabilityCalender'] ? this.props.item['availabilityCalender'].setupId || '' : ''}>
                                              <option value="text">-None selected-</option>
                                              {this.state.connectedCalenders.map((cal, i) => {
                                               return (
                                                 <option value={cal.setupId} key={'availabilityCalender-'+i+cal.etag}>{cal.calenderName}</option>
                                               )
                                              })}
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                                  <div className="col-md-3">
                                    <button className="modal-button" onClick={() => this.handleAddCalenderSection(true)}>+Calender</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="col-md-12">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                <label>Calendars to make bookings on</label>
                                <div className="FieldConfigurationField__i">
                                  <svg
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                    height="1em"
                                    width="1em"
                                    viewBox="0 0 40 40"
                                    style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                                  >
                                    <g>
                                      <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                    </g>
                                  </svg>
                                  <div className="FieldConfigurationField__description">
                                    <div className="FieldConfigurationField__descriptioninner">
                                      The selected calendars will be used to make bookings on. If more than one calendar is selected we will choose a calendar with an available appointment at random.
                                    </div>
                                  </div>
                                </div>
                              </div>      
                              <div className="row">
                                  <div className="col-md-8">
                                    <div className="block__input__row">
                                        <div className="block__input__wrapper">
                                          <div>
                                          <select onChange={(e) => this.handleCalenderSelect('bookingCalender', e)} value={this.props.item['bookingCalender'] ? this.props.item['bookingCalender'].setupId || '' : ''}>
                                              <option value="text">-None selected-</option>
                                              {this.state.connectedCalenders.map((cal, i) => {
                                                return (
                                                  <option value={cal.setupId}  key={'bookingCalender-'+i+cal.etag}>{cal.calenderName}</option>
                                                )
                                              })}
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                                  <div className="col-md-3">
                                    <button className="modal-button" onClick={() => this.handleAddCalenderSection(true)}>+Calender</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>)}
                        <div>
                        </div>
                        <>
                        <div className="col-md-12">
                          <label>Appointment timezone</label>
                        </div>
                        <div className="col-md-12 mt-1">
                          <select
                            name="appointmentTimeZone"
                            id={"appointmentTimeZone" + this.props.id}
                            value={this.state.appointmentTimeZone}
                            onChange={(e) =>
                              this.handleCommonSelectChange(
                                "appointmentTimeZone",
                                e.target.value
                              )
                            }
                          >
                            <option value="" key="somethngkey">
                              {" "}
                              Select{" "}
                            </option>

                            {TimeZone.map((tz) => {
                              return (
                                <option key={tz} value={tz}>
                                  {" "}
                                  {tz}{" "}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* end appointment zone */}
                        <div className="col-md-12">
                          <label>Appointment mode</label>
                        </div>
                        <div className="col-md-12 mt-1">
                          <select
                            name="appointmentMode"
                            id={"appointmentMode" + this.props.id}
                            value={this.state.appointmentMode}
                            onChange={(e) => {
                              this.handleCommonSelectChange(
                                "appointmentMode",
                                e.target.value
                              );
                            }}
                          >
                            <option value="">Select</option>
                            {this.state.appointmentModeList.map((modes) => {
                              return (
                                <option
                                  key={this.props.id + modes.value}
                                  value={modes.value}
                                >
                                  {" "}
                                  {modes.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        {this.state.appointmentMode === "minutes" && (
                          <>
                            <div className="col-md-12">
                              <label>Time format</label>
                            </div>
                            <div className="col-md-12 mt-1">
                              <select
                                name="appointmentTimeFormat"
                                id={"appointmentTimeFormat" + this.props.id}
                                value={this.state.appointmentTimeFormat}
                                onChange={(e) =>
                                  this.handleCommonSelectChange(
                                    "appointmentTimeFormat",
                                    e.target.value
                                  )
                                }
                              >
                                <option value=""> Select </option>
                                <option value="am/pm"> AM/PM</option>
                                <option value="24hours"> 24 Hours </option>
                              </select>
                            </div>
                          </>
                        )}
                      </>
                    </div>
                  </div>
                </div>)}
                {this.state.selectedTab === "appointmentEventDetails" && (
                  <div className="row" style={{ justifyContent: "center"}}>
                    <div className="col-md-8">
                      <div className="col-md-12">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            <label>Event Details</label>
                            </div>
                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__SubField ">
                              <div className="FieldConfigurationField__SubFieldTitle">Title</div>
                              <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                <input type="text" placeholder="Meeting" name="eventTitle" defaultValue={this.state.eventTitle || "Meeting"} onChange={(e) => this.handleCommonValueChange(e, "eventTitle")} />
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__SubField ">
                              <div className="FieldConfigurationField__SubFieldTitle">Description</div>
                              <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                <input type="text" placeholder="Let's discuss that thing!" name="eventDescription" defaultValue={this.props.item.eventDescription || ""} onChange={(e) => this.handleCommonValueChange(e, "eventDescription")}/>
                              </div>
                            </div>
                          </div>
                          <div className="FieldConfiguration__value">
                            <div className="FieldConfigurationField__SubField ">
                              <div className="FieldConfigurationField__SubFieldTitle">Location</div>
                              <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                <input type="text" placeholder="123 Fake St, New York" name="eventLocation" defaultValue={this.props.item.eventLocation || ""} onChange={(e) => this.handleCommonValueChange(e, "eventLocation")}/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      { this.state.appointmentMode === "minutes" && (
                        <div className="col-md-12">
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                            <label>Start time interval</label>
                            <div className="FieldConfigurationField__i">
                              <svg
                                fill="currentColor"
                                preserveAspectRatio="xMidYMid meet"
                                height="1em"
                                width="1em"
                                viewBox="0 0 40 40"
                                style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                              >
                                <g>
                                  <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                </g>
                              </svg>
                              <div className="FieldConfigurationField__description">
                                <div className="FieldConfigurationField__descriptioninner">
                                  The interval between available appointment start times. If using a custom interval it must be at least 15 minutes. If less than 15 minutes it will be rounded up.
                                </div>
                              </div>
                            </div>
                          </div>      
                          <div className="row">
                            <div className="col-md-12">
                              <div className="block__input__row">
                                  <div className="block__input__wrapper">
                                    <div>
                                      <select onChange={(e) => this.handleCommonSelectChange('startTimeInterval', e.target.value)} value={this.state.startTimeInterval}>
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">60 minutes</option>
                                        <option value="custom">Custom (minutes)</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                {this.state.startTimeInterval === "custom" && ( 
                                  <div className="FieldConfiguration__value">
                                    <div className="FieldConfigurationField__SubField ">
                                      <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                        <input type="text" placeholder="Enter length in minutes"  name="startTimeCustomInterval" defaultValue={this.props.item.startTimeCustomInterval || ""} onChange={(e) => this.handleCommonValueChange(e, "startTimeCustomInterval")}/>
                                      </div>
                                    </div>
                                  </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      { this.state.appointmentMode === "minutes" && (
                      <div className="col-md-12">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                          <label>Length of time</label>
                          <div className="FieldConfigurationField__i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                              style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="FieldConfigurationField__description">
                              <div className="FieldConfigurationField__descriptioninner">
                                Determine how long the appointment should be.
                              </div>
                            </div>
                          </div>
                        </div>      
                        <div className="row">
                          <div className="col-md-12">
                            <div className="FieldConfigurationField__SubFieldTitle">Is the length of time chosen by the submitter?</div>
                            <div className="block__input__row">
                                <div className="block__input__wrapper">
                                  <div className="ProductConfiguration__DefaultBlock">
                                    <div className="YesNo">
                                      <label
                                        onClick={(e) =>
                                          this.handleCommonSelectChange("timeLengthBySubmitter", "yes")
                                        }
                                        className={
                                          this.state.timeLengthBySubmitter === "yes"
                                            ? "btn-raised btn-primary"
                                            : "btn-raised btn-default"
                                        }
                                      >
                                        yes
                                      </label>
                                      <label
                                        onClick={(e) =>
                                          this.handleCommonSelectChange("timeLengthBySubmitter", "no")
                                        }
                                        className={
                                          this.state.timeLengthBySubmitter === "no"
                                            ? "btn-raised btn-primary"
                                            : "btn-raised btn-default"
                                        }
                                      >
                                        no
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {this.state.timeLengthBySubmitter == "no" && ( 
                                <div className="row" style={{marginTop:"20px"}}>
                                  <div className="col-md-12">
                                    <div className="block__input__row">
                                        <div className="block__input__wrapper">
                                        <div className="FieldConfigurationField__SubFieldTitle">Choose the length of time</div>
                                          <div>
                                            <select onChange={(e) => this.handleCommonSelectChange('lengthOfTimeMinutes', e.target.value)} value={this.state.lengthOfTimeMinutes}>
                                              <option value="15">15 minutes</option>
                                              <option value="30">30 minutes</option>
                                              <option value="60">45 minutes</option>
                                              <option value="60">60 minutes</option>
                                              <option value="60">90 minutes</option>
                                              <option value="60">120 minutes</option>
                                              <option value="custom-minutes">Custom (minutes)</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      {this.state.lengthOfTime === "custom-minutes" && ( 
                                        <div className="FieldConfiguration__value">
                                          <div className="FieldConfigurationField__SubField ">
                                            <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                              <input type="text" placeholder="Enter length in minutes"  name="lengthOfTimeCustomMinutes" defaultValue={this.props.item.lengthOfTimeCustomMinutes || ""} onChange={(e) => this.handleCommonValueChange(e, "lengthOfTimeCustomMinutes")}/>
                                            </div>
                                          </div>
                                        </div>
                                        )}
                                    </div>
                                  </div>
                                )}
                              {this.state.timeLengthBySubmitter == "yes" && ( 
                                <div className="row" style={{marginTop:"20px"}}>
                                  <div className="col-md-6">
                                    <div className="_2PLFUU9OgtbELWQz3snC0b">
                                      <div className="FieldConfigurationField__SubField ">
                                        <div className="FieldConfigurationField__SubFieldTitle">Minimum length of appointment (minutes)</div>
                                        <div>
                                          <select onChange={(e) => this.handleCommonSelectChange('minLengthOfAppointment', e.target.value)} value={this.state.minLengthOfAppointment}>
                                            <option value="none">None</option>
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                            <option value="60">90 minutes</option>
                                            <option value="60">120 minutes</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="_2PLFUU9OgtbELWQz3snC0b">
                                      <div className="FieldConfigurationField__SubField ">
                                        <div className="FieldConfigurationField__SubFieldTitle">Maximum length of appointment (minutes)</div>
                                        <div>
                                          <select onChange={(e) => this.handleCommonSelectChange('maxLengthOfAppointment', e.target.value)} value={this.state.maxLengthOfAppointment}>
                                            <option value="none">None</option>
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                            <option value="60">90 minutes</option>
                                            <option value="60">120 minutes</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                      { this.state.appointmentMode === "days" && (
                      <div className="col-md-12">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                          <label>Length of time</label>
                          <div className="FieldConfigurationField__i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                              style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="FieldConfigurationField__description">
                              <div className="FieldConfigurationField__descriptioninner">
                                Determine how long the appointment should be.
                              </div>
                            </div>
                          </div>
                        </div>      
                        <div className="row">
                          <div className="col-md-12">
                            <div className="FieldConfigurationField__SubFieldTitle">Is the length of time chosen by the submitter?</div>
                            <div className="block__input__row">
                                <div className="block__input__wrapper">
                                  <div className="ProductConfiguration__DefaultBlock">
                                    <div className="YesNo">
                                      <label
                                        onClick={(e) =>
                                          this.handleCommonSelectChange("timeLengthBySubmitter", "yes")
                                        }
                                        className={
                                          this.state.timeLengthBySubmitter === "yes"
                                            ? "btn-raised btn-primary"
                                            : "btn-raised btn-default"
                                        }
                                      >
                                        yes
                                      </label>
                                      <label
                                        onClick={(e) =>
                                          this.handleCommonSelectChange("timeLengthBySubmitter", "no")
                                        }
                                        className={
                                          this.state.timeLengthBySubmitter === "no"
                                            ? "btn-raised btn-primary"
                                            : "btn-raised btn-default"
                                        }
                                      >
                                        no
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {this.state.timeLengthBySubmitter == "no" && ( 
                                <div className="row" style={{marginTop:"20px"}}>
                                  <div className="col-md-12">
                                    <div className="block__input__row">
                                        <div className="block__input__wrapper">
                                        <div className="FieldConfigurationField__SubFieldTitle">Choose the length of time</div>
                                          <div>
                                            <select onChange={(e) => this.handleCommonSelectChange('lengthOfTimeDays', e.target.value)} value={this.state.lengthOfTimeDays}>
                                              <option value="1">1 day</option>
                                              <option value="2">2 days</option>
                                              <option value="3">3 days</option>
                                              <option value="4">4 days</option>
                                              <option value="5">5 days</option>
                                              <option value="6">6 days</option>
                                              <option value="7">7 days</option>
                                              <option value="8">8 days</option>
                                              <option value="9">9 days</option>
                                              <option value="10">10 days</option>
                                              <option value="11">11 days</option>
                                              <option value="12">12 days</option>
                                              <option value="13">13 days</option>
                                              <option value="14">14 days</option>
                                              <option value="custom-days">Custom (days)</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      {this.state.lengthOfTimeDays === "custom-days" && ( 
                                        <div className="FieldConfiguration__value">
                                          <div className="FieldConfigurationField__SubField ">
                                            <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                              <input type="text" placeholder="Enter length in days"  name="lengthOfTimeCustomDays" defaultValue={this.props.item.lengthOfTimeCustomDays || ""} onChange={(e) => this.handleCommonValueChange(e, "lengthOfTimeCustomDays")}/>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              {this.state.timeLengthBySubmitter == "yes" && ( 
                                <div className="row" style={{marginTop:"20px"}}>
                                  <div className="col-md-6">
                                    <div className="_2PLFUU9OgtbELWQz3snC0b">
                                      <div className="FieldConfigurationField__SubField ">
                                        <div className="FieldConfigurationField__SubFieldTitle">Minimum length of appointment (days)</div>
                                        <div>
                                          <select onChange={(e) => this.handleCommonSelectChange('minLengthOfAppointment', e.target.value)} value={this.state.minLengthOfAppointment}>
                                            <option value="none">None</option>
                                            <option value="1">1 day</option>
                                            <option value="2">2 days</option>
                                            <option value="3">3 days</option>
                                            <option value="4">4 days</option>
                                            <option value="5">5 days</option>
                                            <option value="6">6 days</option>
                                            <option value="7">7 days</option>
                                            <option value="8">8 days</option>
                                            <option value="9">9 days</option>
                                            <option value="10">10 days</option>
                                            <option value="11">11 days</option>
                                            <option value="12">12 days</option>
                                            <option value="13">13 days</option>
                                            <option value="14">14 days</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="_2PLFUU9OgtbELWQz3snC0b">
                                      <div className="FieldConfigurationField__SubField ">
                                        <div className="FieldConfigurationField__SubFieldTitle">Maximum length of appointment (days)</div>
                                        <div>
                                          <select onChange={(e) => this.handleCommonSelectChange('maxLengthOfAppointment', e.target.value)} value={this.state.maxLengthOfAppointment}>
                                            <option value="none">None</option>
                                            <option value="1">1 day</option>
                                            <option value="2">2 days</option>
                                            <option value="3">3 days</option>
                                            <option value="4">4 days</option>
                                            <option value="5">5 days</option>
                                            <option value="6">6 days</option>
                                            <option value="7">7 days</option>
                                            <option value="8">8 days</option>
                                            <option value="9">9 days</option>
                                            <option value="10">10 days</option>
                                            <option value="11">11 days</option>
                                            <option value="12">12 days</option>
                                            <option value="13">13 days</option>
                                            <option value="14">14 days</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                      <div className="col-md-12">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                          <label>Invite emails</label>
                          <div className="FieldConfigurationField__i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                              style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="FieldConfigurationField__description">
                              <div className="FieldConfigurationField__descriptioninner">
                              Email addresses added here will be sent invitations to the appointment.
                              </div>
                            </div>
                          </div>
                        </div>      
                        <div className="row">
                          <div className="col-md-12">
                                <div className="FieldConfiguration__value">
                                  <div className="FieldConfigurationField__SubField ">
                                    <div className="FieldConfiguration__input" style={{height: "auto"}}>
                                      <input type="text" placeholder="Enter emails here"  name="inviteEmails" defaultValue={this.props.item.inviteEmails || ""} onChange={(e) => this.handleCommonValueChange(e, "inviteEmails")}/>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">
                              <label>Send Invite from Paperform</label>
                            <div className="FieldConfigurationField__i">
                              <svg
                                fill="currentColor"
                                preserveAspectRatio="xMidYMid meet"
                                height="1em"
                                width="1em"
                                viewBox="0 0 40 40"
                                style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                              >
                                <g>
                                  <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                </g>
                              </svg>
                              <div className="FieldConfigurationField__description">
                                <div className="FieldConfigurationField__descriptioninner">
                                  Google calendar will automatically email new invitees, but we can send through a default summary too.
                                </div>
                              </div>
                            </div>
                          </div>      
                              <Switch
                                checked={this.state.sendInviteFromDefactoform}
                                onChange={this.handleSwitchChange("sendInviteFromDefactoform")}
                                value="sendInviteFromDefactoform"
                                color="primary"
                                />
                            </div>
                        </div>
                    </div>
                  </div>)}            
                </div>)}
                {this.state.selectedTab === "appointmentAvailability" && (
                  <div className="row" style={{ justifyContent: "center"}}>
                    <div className="col-md-8">
                      <div className="col-md-12">
                        <p style={{padding: "4% 12%"}}>
                          <small>The appointments field will check the connected calendar and
                          prevent you from being double booked. On top of this, you can set
                          your general availability here.
                          </small>
                        </p>
                      </div>
                      <div className="col-md-12">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">General Availability </div>
                          { this.state.appointmentMode == "minutes" &&  ( 
                          <div className="FieldConfiguration__value">
                            <div style={{marginLeft: "-75px", marginRight: "-75px", padding: "0px 20px 20px", border: "1px solid rgb(238, 238, 238)", boxShadow: "rgba(0, 0, 0, 0.3) 0px 3px 20px -16px", marginTop: "18px"}}>
                              <div style={{position: "relative"}}>
                                <div className="ResultsTable__wrapper  ResultsTable__noscroll" style={{overflow: "visible"}}>
                                  <table className="ResultsTable ">
                                    <thead>
                                      <tr>
                                        <th>Sunday</th>
                                        <th>Monday</th>
                                        <th>Tuesday</th>
                                        <th>Wednesday</th>
                                        <th>Thursday</th>
                                        <th>Friday</th>
                                        <th>Saturday</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          {this.state.generalMinutesAvailability.sunday.length == 0 && (
                                            <div>
                                              <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                            </div>
                                          )}
                                          {this.state.generalMinutesAvailability.sunday.length > 0 && (
                                            <div>
                                              {this.state.generalMinutesAvailability.sunday.map((availTime, index) => {
                                                return ( <div 
                                                  key={'sundayTime-'+index} 
                                                  style={{
                                                  border: "1px solid rgb(221, 221, 221)", 
                                                  padding: "2px 6px", fontSize: "12px", 
                                                  marginBottom: "4px", 
                                                  marginLeft: "-12px", 
                                                  marginRight: "-5px", 
                                                  position: "relative", 
                                                  borderRadius: "4px"}}>
                                                  { availTime }
                                                  <div 
                                                    role="button" 
                                                    className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                    tabIndex="-1" 
                                                    style={{
                                                      width: "20px", 
                                                      height: "100%", 
                                                      padding: "0px", 
                                                      border: "0px", 
                                                      borderRadius: "6px",
                                                      position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                    >
                                                  <span onClick={(e) => this.removeAvailabilityTime('sunday', index)}>×</span>
                                                </div>
                                              </div>)}
                                              )}
                                            </div>)}
                                          </td>
                                        <td>
                                          {this.state.generalMinutesAvailability.monday.length == 0 && (
                                            <div>
                                              <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                            </div>
                                          )}
                                          {this.state.generalMinutesAvailability.monday.length && (
                                          <div>
                                            {this.state.generalMinutesAvailability.monday.map((availTime, index) => {
                                            return ( <div 
                                              key={'mondayTime-'+index} 
                                              style={{
                                              border: "1px solid rgb(221, 221, 221)", 
                                              padding: "2px 6px", fontSize: "12px", 
                                              marginBottom: "4px", 
                                              marginLeft: "-12px", 
                                              marginRight: "-5px", 
                                              position: "relative", 
                                              borderRadius: "4px"}}>
                                              { availTime }
                                                <div 
                                                  role="button" 
                                                  className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                  tabIndex="-1" 
                                                  style={{
                                                    width: "20px", 
                                                    height: "100%", 
                                                    padding: "0px", 
                                                    border: "0px", 
                                                    borderRadius: "6px",
                                                    position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                  >
                                                <span onClick={(e) => this.removeAvailabilityTime('monday', index)}>×</span>
                                              </div>
                                            </div>)}
                                            )}
                                          </div>)}
                                        </td>
                                        <td>
                                          {this.state.generalMinutesAvailability.tuesday.length == 0 && (
                                            <div>
                                              <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                            </div>
                                          )}
                                          {this.state.generalMinutesAvailability.tuesday.length && (
                                            <div>
                                              {this.state.generalMinutesAvailability.tuesday.map((availTime, index) => {
                                              return ( <div 
                                                key={'tuesdayTime-'+index} 
                                                style={{
                                                border: "1px solid rgb(221, 221, 221)", 
                                                padding: "2px 6px", fontSize: "12px", 
                                                marginBottom: "4px", 
                                                marginLeft: "-12px", 
                                                marginRight: "-5px", 
                                                position: "relative", 
                                                borderRadius: "4px"}}>
                                                { availTime }
                                                  <div 
                                                    role="button" 
                                                    className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                    tabIndex="-1" 
                                                    style={{
                                                      width: "20px", 
                                                      height: "100%", 
                                                      padding: "0px", 
                                                      border: "0px", 
                                                      borderRadius: "6px",
                                                      position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                    >
                                                  <span onClick={(e) => this.removeAvailabilityTime('tuesday', index)}>×</span>
                                                </div>
                                              </div>)}
                                              )}
                                            </div>)}
                                        </td>
                                        <td>
                                        {this.state.generalMinutesAvailability.wednesday.length == 0 && (
                                          <div>
                                            <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                          </div>
                                        )}
                                        {this.state.generalMinutesAvailability.wednesday.length && (
                                          <div>
                                            {this.state.generalMinutesAvailability.wednesday.map((availTime, index) => {
                                            return ( <div 
                                              key={'wednesdayTime-'+index} 
                                              style={{
                                              border: "1px solid rgb(221, 221, 221)", 
                                              padding: "2px 6px", fontSize: "12px", 
                                              marginBottom: "4px", 
                                              marginLeft: "-12px", 
                                              marginRight: "-5px", 
                                              position: "relative", 
                                              borderRadius: "4px"}}>
                                              { availTime }
                                                <div 
                                                  role="button" 
                                                  className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                  tabIndex="-1" 
                                                  style={{
                                                    width: "20px", 
                                                    height: "100%", 
                                                    padding: "0px", 
                                                    border: "0px", 
                                                    borderRadius: "6px",
                                                    position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                  >
                                                  <span onClick={(e) => this.removeAvailabilityTime('wednesday', index)}>×</span>
                                              </div>
                                            </div>)}
                                            )}
                                          </div>)}
                                        </td>
                                        <td>
                                        {this.state.generalMinutesAvailability.thursday.length == 0 && (
                                          <div>
                                            <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                          </div>
                                        )}
                                        {this.state.generalMinutesAvailability.thursday.length && (
                                          <div>
                                            {this.state.generalMinutesAvailability.thursday.map((availTime, index) => {
                                            return ( <div 
                                              key={'thursdayTime-'+index} 
                                              style={{
                                              border: "1px solid rgb(221, 221, 221)", 
                                              padding: "2px 6px", fontSize: "12px", 
                                              marginBottom: "4px", 
                                              marginLeft: "-12px", 
                                              marginRight: "-5px", 
                                              position: "relative", 
                                              borderRadius: "4px"}}>
                                              { availTime }
                                                <div 
                                                  role="button" 
                                                  className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                  tabIndex="-1" 
                                                  style={{
                                                    width: "20px", 
                                                    height: "100%", 
                                                    padding: "0px", 
                                                    border: "0px", 
                                                    borderRadius: "6px",
                                                    position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                  >
                                                <span onClick={(e) => this.removeAvailabilityTime('thursday', index)}>×</span>
                                              </div>
                                            </div>)}
                                            )}
                                          </div>)}
                                        </td>
                                        <td>
                                          {this.state.generalMinutesAvailability.friday.length == 0 && (
                                            <div>
                                              <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                            </div>
                                          )}
                                          {this.state.generalMinutesAvailability.friday.length && (
                                            <div>
                                              {this.state.generalMinutesAvailability.friday.map((availTime, index) => {
                                              return ( <div 
                                                key={'fridayTime-'+index} 
                                                style={{
                                                border: "1px solid rgb(221, 221, 221)", 
                                                padding: "2px 6px", fontSize: "12px", 
                                                marginBottom: "4px", 
                                                marginLeft: "-12px", 
                                                marginRight: "-5px", 
                                                position: "relative", 
                                                borderRadius: "4px"}}>
                                                { availTime }
                                                <div 
                                                  role="button" 
                                                  className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                  tabIndex="-1" 
                                                  style={{
                                                    width: "20px", 
                                                    height: "100%", 
                                                    padding: "0px", 
                                                    border: "0px", 
                                                    borderRadius: "6px",
                                                    position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                  >
                                                <span onClick={(e) => this.removeAvailabilityTime('friday', index)}>×</span>
                                              </div>
                                            </div>)}
                                            )}
                                          </div>)}
                                        </td>
                                        <td>
                                            {this.state.generalMinutesAvailability.saturday.length == 0 && (
                                              <div>
                                                <div style={{textAlign: "center", fontSize: "12px", opacity: "0.3"}}>Not available</div>
                                              </div>
                                            )}
                                            {this.state.generalMinutesAvailability.saturday.length && (
                                              <div>
                                                {this.state.generalMinutesAvailability.saturday.map((availTime, index) => {
                                                return ( <div 
                                                  key={'saturdayTime-'+index} 
                                                  style={{
                                                  border: "1px solid rgb(221, 221, 221)", 
                                                  padding: "2px 6px", fontSize: "12px", 
                                                  marginBottom: "4px", 
                                                  marginLeft: "-12px", 
                                                  marginRight: "-5px", 
                                                  position: "relative", 
                                                  borderRadius: "4px"}}
                                                  >
                                                  { availTime }
                                                  <div 
                                                    role="button" 
                                                    className="BtnV2 BtnV2--sm BtnV2--warning" 
                                                    tabIndex="-1" 
                                                    style={{
                                                      width: "20px", 
                                                      height: "100%", 
                                                      padding: "0px", 
                                                      border: "0px", 
                                                      borderRadius: "6px",
                                                      position: "absolute", right: "0px", top: "0px", bottom: "0px"}}
                                                    >
                                                  <span onClick={(e) => this.removeAvailabilityTime('saturday', index)}>×</span>
                                                </div>
                                              </div>)}
                                              )}
                                            </div>)}
                                          </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('sunday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('monday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('tuesday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('wednesday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('thursday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('friday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" onClick={(e) => this.openSelectMinutesSection('saturday')}>
                                            <span> + </span>
                                          </div>
                                        </td>
                                      </tr>
                                      { this.state.showSelectTimeSection && (
                                        <tr>
                                        <td colSpan="7">
                                          <div style={{display: "flex", flexDirection: "row", alignItems: "flexEnd"}}>
                                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", flexGrow: 1}}>
                                              <div className="PaperTime" style={{alignItems: "baseline"}}>
                                                <div className="PaperTime__time">
                                                  <input 
                                                    name="hour" 
                                                    className="LiveField__input PaperTime__input" 
                                                    type="text" pattern="[0-9]*" 
                                                    maxLength="2" 
                                                    placeholder="HH"
                                                    onKeyPress={(e) => this.restrictAlphabets(e)} 
                                                    defaultValue={ this.state.availabilityStartTime.hours}
                                                    onChange={(e) => this.handleChangeAvailibiltyTime('availabilityStartTime', 'hours', e)}/>
                                                  <span className="PaperTime__colon">:</span>
                                                    <input 
                                                      name="minute" 
                                                      className="LiveField__input PaperTime__input" 
                                                      type="number" 
                                                      pattern="[0-9]*"
                                                      maxLength="2"
                                                      placeholder="MM"
                                                      onKeyPress={(e) => this.restrictAlphabets(e)} 
                                                      defaultValue={ this.state.availabilityStartTime.minutes} 
                                                      onChange={(e) => this.handleChangeAvailibiltyTime('availabilityStartTime', 'minutes', e)}/>
                                                  </div>
                                                  <div role="button" className="BtnV2 BtnV2--raised BtnV2--sm " tabIndex="0" onClick={(e) => this.changeTimeMeridiem('startTimeMeridiem')}>
                                                  <span><span>{ this.state.startTimeMeridiem}</span></span>
                                                  </div>
                                                </div>
                                                <span style={{paddingTop: "10px"}}>to</span>
                                              <div className="PaperTime" style={{alignItems: "baseline"}}>
                                                <div className="PaperTime__time">
                                                  <input 
                                                    name="hour" 
                                                    className="LiveField__input PaperTime__input" 
                                                    type="number" 
                                                    pattern="[0-9]*"
                                                    maxLength="2" 
                                                    placeholder="HH" 
                                                    onKeyPress={(e) => this.restrictAlphabets(e)}
                                                    defaultValue={ this.state.availabilityEndTime.hours}  
                                                    onChange={(e) => this.handleChangeAvailibiltyTime('availabilityEndTime', 'hours', e)}/>
                                                  <span className="PaperTime__colon">:</span>
                                                  <input 
                                                    name="minute" 
                                                    className="LiveField__input PaperTime__input" 
                                                    type="tel" 
                                                    pattern="[0-9]*"
                                                    maxLength="2"
                                                    placeholder="MM"
                                                    onKeyPress={(e) => this.restrictAlphabets(e)}   
                                                    defaultValue={ this.state.availabilityEndTime.minutes} 
                                                    onChange={(e) => this.handleChangeAvailibiltyTime('availabilityEndTime', 'minutes', e)}/>
                                                </div>
                                                <div role="button" className="BtnV2 BtnV2--raised BtnV2--sm " tabIndex="0" onClick={(e) => this.changeTimeMeridiem('endTimeMeridiem')}>
                                                  <span>{ this.state.endTimeMeridiem}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "row", alignItems: "flexEnd"}}>
                                              <div role="button" className="BtnV2 BtnV2--sm BtnV2--primary" tabIndex="-1" style={{width: "100px"}} onClick={(e) => this.addAvailabilityTime(this.state.selectedAvailibiltyDay)}>
                                                <span>Save</span>
                                              </div>
                                              <div role="button" className="BtnV2 BtnV2--sm BtnV2--warning" tabIndex="-1" style={{width: "100px"}} onClick={(e) => this.canceAddAvailibiltyTime()}>
                                                <span>Cancel</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>)}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          )}
                          { this.state.appointmentMode == "days" &&  ( 
                          <div className="FieldConfiguration__value">
                            <div style={{position: "relative"}}>
                              <div className="ResultsTable__wrapper  ResultsTable__noscroll" style={{overflow: "visible"}}>
                                <table className="ResultsTable ">
                                  <thead>
                                    <tr>
                                      <th>Sunday</th>
                                      <th>Monday</th>
                                      <th>Tuesday</th>
                                      <th>Wednesday</th>
                                      <th>Thursday</th>
                                      <th>Friday</th>
                                      <th>Saturday</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.sunday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("sunday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.monday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("monday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.tuesday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("tuesday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.wednesday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("wednesday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.thursday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("thursday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.friday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("friday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="col-md-12">
                                          <Switch
                                            checked={this.state.generalDaysAvailability.saturday}
                                            onChange={(e) => this.handleChangeAvailibiltyDays("saturday", e.target.checked)}
                                            value="generalDaysAvailability"
                                            color="primary"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="FieldConfigurationField ">
                          <div className="FieldConfiguration__label">
                            Blockout dates
                          </div>
                          <div className="col-md-12">
                            <span className="info-decr">
                              <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                              Choose dates on the calendar below to block out availability on those days.
                            </span>
                          </div>
                          <div className="row" style={{ marginTop: "30px" }}>
                            <div className="col-md-6" style={{ display: "flex",justifyContent: "center"}}>
                            <Calendar
                              onChange={this.handleChangeBlackoutDates}
                              selectRange={true}
                              tileDisabled={this.handleDatesDisbled}
                            />
                            </div>
                            <div className="col-md-4" style={{display: "flex",justifyContent: "start"}}>
                              <ul style={{margin: "0px", padding:" 0px 0px 2rem 1rem", overflow: "auto", maxHeight: "310px"}}>
                                {this.state.blackoutDates.map((dateRange, index)=> {
                                 return (<li key={'blackoutDateKey-'+index} style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",width: "100%",border: "1px solid rgb(238, 238, 238)",borderRadius: "5px",listStyle: "none",fontSize: "0.8rem",padding: "0.4rem 0.6rem",margin: "0.2rem 0px",color: "rgb(119, 119, 119)", height: "2rem"}}>
                                  <div>
                                    <span>{ dateRange.start }</span>  -  <span>{ dateRange.end }</span>
                                  </div>
                                  <div role="button" className="BtnV2 BtnV2--sm BtnV2--warning" tabIndex="-1" style={{width: "20px",height: "100%",padding: "0px",border:" 0px",borderRadius: "6px",right: "0px",top: "0px", bottom: "0px"}}>
                                    <span onClick={(e) => this.removeBlackoutDates(index)}>×</span>
                                  </div>
                                </li>)}
                                )}
                              </ul>
                            </div>
                          </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">Number of days in advance an appointment can be made </div>
                            <div className="FieldConfiguration__value">
                              <input 
                                step="any" 
                                className="FieldConfiguration__input" 
                                type="number" 
                                min="0" 
                                steps="1" 
                                defaultValue={this.state.advanceAppointmentDays} 
                                onChange={(e) => this.handleCommonValueChange(e, "advanceAppointmentDays")}
                                />
                            </div>
                          </div>
                        </div>
                        { this.state.appointmentMode === "minutes" && (
                        <div>
                          <div className="col-md-12">
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">Minimum number of hours notice</div>
                              <div className="FieldConfiguration__value">
                              <input 
                                  step="any" 
                                  className="FieldConfiguration__input" 
                                  type="number" 
                                  min="0" 
                                  steps="1" 
                                  defaultValue={this.state.minimumNoticeHours} 
                                  onChange={(e) => this.handleCommonValueChange(e, "minimumNoticeHours")}
                                  />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Maximum # of appointments in a day
                                <div className="FieldConfigurationField__i">
                                  <svg
                                    fill="currentColor"
                                    preserveAspectRatio="xMidYMid meet"
                                    height="1em"
                                    width="1em"
                                    viewBox="0 0 40 40"
                                    style={{ verticalAlign: "middle" , marginLeft:"15px"}}
                                  >
                                    <g>
                                      <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                                    </g>
                                  </svg>
                                  <div className="FieldConfigurationField__description">
                                    <div className="FieldConfigurationField__descriptioninner">
                                      Limit the maximum number of appointments that can be on any one day when a calendar is connected. If multiple calendars are connected all appointments on the availability calendars will be counted.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="FieldConfiguration__value">
                                <input 
                                    step="any" 
                                    className="FieldConfiguration__input" 
                                    type="number" 
                                    min="0" 
                                    steps="1" 
                                    defaultValue={this.state.maximumAppointmentsInDay}
                                    onChange={(e) => this.handleCommonValueChange(e, "maximumAppointmentsInDay")}
                                    />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">Minimum time between appointments (minutes)</div>
                                <div className="FieldConfiguration__value">
                                  <input 
                                    step="any" 
                                    className="FieldConfiguration__input" 
                                    type="number" 
                                    min="0" 
                                    steps="1" 
                                    defaultValue={this.state.minimumTimeBetweenAppointments}
                                    onChange={(e) => this.handleCommonValueChange(e, "minimumTimeBetweenAppointments")}
                                    />
                                </div>
                              </div>
                            </div>
                        </div>
                        )}
                      { this.state.appointmentMode === "days" && (
                        <div className="col-md-12">
                          <div className="FieldConfigurationField ">
                            <div className="FieldConfiguration__label">Minimum number of days notice</div>
                            <div className="FieldConfiguration__value">
                            <input 
                                step="any" 
                                className="FieldConfiguration__input" 
                                type="number" 
                                min="0" 
                                steps="1" 
                                defaultValue={this.state.minimumNoticeDays} 
                                onChange={(e) => this.handleCommonValueChange(e, "minimumNoticeDays")}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                )}
              { this.state.showConnectCalender && (
                  <div className="connect-calender-section">
                    <div style={{width: '60%',margin: 'auto'}}>
                      <h3 className="PaperType--h3" style={{display: 'flex', marginTop: '0px', marginBottom: '36px'}}>
                        <img src={require("assets/img/googleSheet.png")} height="32" style={{marginRight: '9px', verticalAlign: 'middle'}}/>
                          <span>Connect a Google Calendar</span>
                          </h3>
                          <div className="FieldConfigurationField">
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
                                options={this.state.googleAccountsList}
                                // value={this.state.accountsList.filter(option => option.value === this.state.accountsList[0].value)}
                                value={this.state.selectedGoogleAccountValue}
                                onChange={(value) => this.handleGoogleAccountChange(value)}
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
                                    // <button className="modal-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
                                    <div
                                      className="BtnV2 BtnV2--secondary"
                                      tabIndex="-1"
                                      onClick={renderProps.onClick}
                                      disabled={renderProps.disabled}
                                    >
                                      <span>Add Account +</span>
                                    </div>
                                  )}
                                  scope={GOOGLEAUTH_CRENDENTIALS.CALENDER_SCOPE}
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
                          <div className="FieldConfigurationField">
                            <div className="FieldConfiguration__label">
                              Calendar*
                            </div>
                            <div className="FieldConfiguration__value">
                              <Select
                                isClearable={true}
                                options={this.state.googleCalendersList}
                                value={this.state.selectedGoogleCalender}
                                onChange={(value) => this.handleGoogleCalenderChange(value)}
                                defaultValue={{ label: "Select", value: 0 }}
                              />
                            </div>
                          </div>
                          <div className="FieldConfigurationField">
                            <div className="FieldConfiguration__label">
                              Calendar name
                            </div>
                            <div className="FieldConfiguration__value">
                              <input type="text" name="calenderNameInput" 
                                  value={this.state.inputCalenderName}
                                  onChange={(e) => this.handleInputCalenderName(e)}
                                  className="FormTagInput LiveField__input LiveField__input--manualfocus"
                                  style={{borderBottom: "1px solid #ccc"}}
                               />
                            </div>
                          </div>
                        {!this.state.isProcessing && (
                          <div style={{ marginTop: "36px" }}>
                            <div
                                className="BtnV2 BtnV2--secondary BtnV2--solid"
                                onClick={this.finishGoogleCalenderSetUp}
                                tabIndex="-1"
                              >
                                <span>Finish Setup</span>
                              </div>
                            <div className="BtnV2 BtnV2--warning" tabIndex="-1" onClick={() => this.handleAddCalenderSection(false)}>
                              <span>Cancel</span>
                            </div>
                          </div>
                        )}
                        {this.state.isProcessing && (
                          <div
                            className="BtnV2 BtnV2--secondary BtnV2--solid"
                            tabIndex="-1"
                            style={{ fontFamily: "inherit", marginTop: "36px"}}
                          >
                            <span>Finishing...</span>
                          </div>
                        )}
                    </div>
                  </div>
              )}
            </ReactModal>
          </div>
          {/*__________________________________________For products settings_________________________ */}
          <div className="Products-settings">
            <ReactModal
              isOpen={
                this.state.showModal && this.props.item.control === "products"
              }
              contentLabel="onRequestClose"
              onRequestClose={this.handleCloseModal}
              className="Product-Modal"
            >
              <div className="header-config">
                <h2 ref={(subtitle) => (this.subtitle = subtitle)}>
                  Configure "
                  {this.props.item.title === ""
                    ? "untitled"
                    : this.props.item.title}
                  "
                </h2>
                <button className="modal-button" onClick={this.handleCloseModal}>Back to editor</button>
              </div>

              <div className="row">
                <div className="col-md-4" />
                <div
                  className="btn-group col-md-4"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    className="btn btn-secondary BtnV2"
                    onClick={() => this.showProductTab("settings")}
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary BtnV2"
                    onClick={() => this.showProductTab("products")}
                  >
                    Products
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary BtnV2"
                    onClick={() => this.showProductTab("appearance")}
                  >
                    Appearance
                  </button>
                </div>
              </div>

              {/* Type Of Questions */}
              {this.state.selectedTab === "settings" && (
                <div className="row">
                  <div className="col-md-2" />
                  <div className="col-md-8">
                    <div className="col-md-12">
                      <label>Type of question</label>
                    </div>
                    <div className="col-md-12">
                      <BlockSelectOptions
                        value={this.props.item.control}
                        styles={{ padding: "small" }}
                        onChange={this._handleControlChange}
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Question is required</label>
                    </div>
                    <div className="col-md-12">
                      <Switch
                        checked={this.state.requiredQuestion}
                        onChange={this.handleSwitchChange("requiredQuestion")}
                        value="requiredQuestion"
                        color="primary"
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Can buy more than one product</label>
                    </div>
                    <div className="col-md-12">
                      <Switch
                        checked={this.state.buyMoreThanOneProduct}
                        onChange={this.handleSwitchChange(
                          "buyMoreThanOneProduct"
                        )}
                        value="buyMoreThanOneProduct"
                        color="primary"
                      />
                    </div>

                    <div className="col-md-12">
                      <label>Default Answer</label>
                    </div>
                    <div className="col-md-12">
                      <Products
                        name="products"
                        from="settings"
                        id={this.props.item.key}
                        stock={this.state.stock}
                        ProductList={this.state.productList}
                        productName={this.state.productName}
                        productPrice={this.state.productPrice}
                        buyMoreThanOneProduct={this.state.buyMoreThanOneProduct}
                        productCount={this.state.productCount}
                        hideproductprices={this.state.hideproductprices}
                        productSelectedLayout={this.state.productSelectedLayout}
                        handleChange={this.handleSelectChange}
                        handleInputChange={this.handleCommonChange}
                        updateArticle={this.updateArticle}
                      />
                    </div>

                    <div className="col-md-12 mt-3">
                      <label>Question visibility logic: Off</label>
                    </div>
                    <div className="col-md-12">
                      <span className="info-decr">
                        <i className="fa fa-info-circle" aria-hidden="true" />{" "}
                        Show question only when conditions are met
                      </span>
                    </div>
                    <div className="col-md-12">
                      <Switch
                        checked={this.state.showQuestion}
                        onChange={this.handleSwitchChange(this.props.item.key)}
                        value="showQuestion"
                        color="primary"
                      />
                    </div>
                    <div className="col-md-12">
                      <label>
                        Pre-fill Key: {this.props.item.key} (What's this?)
                      </label>
                    </div>
                    <div className="col-md-12">
                      <input type="text" placeholder="Custom Pre-fill Key" />
                    </div>
                  </div>
                </div>
              )}
              {this.state.selectedTab === "products" && (
                <div className="row">
                  <div className="col-md-3 product-side-bar">
                    <div className="button_sidebar">
                      <input
                        type="file"
                        accept="text/csv"
                        className="hide"
                        name="file"
                      />
                      <div className="BtnV2 BtnV2--raised BtnV2--sm export-btn">
                        &nbsp;
                        <CSVLink
                          data={this.setExportData()}
                          filename={"products.csv"}
                        >
                          <i className="fa fa-download" aria-hidden="true" />{" "}
                          Export
                        </CSVLink>
                      </div>
                      <div className="BtnV2 BtnV2--raised BtnV2--sm import-btn">
                        <span>
                          <i className="fa fa-upload" aria-hidden="true" />
                          &nbsp; Import
                        </span>
                        <CSVReader
                          cssClass="react-csv-input"
                          onFileLoaded={this.handleImportFileData}
                        />{" "}
                      </div>
                    </div>
                    <div className="ProductConfiguration__productWrapper Product-Overview-Block">
                      {this.state.productList.map((element, i) => {
                        return (
                          <div
                            key={i}
                            className="ProductConfiguration_newProduct"
                          >
                            <div
                              className="ProductConfiguration__product ProductConfiguration__product--clickable"
                              onClick={() => this.showProductDetail(i)}
                            >
                              {element.Images && element.Images.length > 0 && (
                                <div
                                  className="products-cover-image"
                                  style={{
                                    backgroundImage:
                                      "url('" + element.Images[0] + "')",
                                  }}
                                />
                              )}
                              <h3 className="ProductConfiguration__producttitle PaperType--h3 product-text">
                                {element.Name}
                                <br />
                                <small>{element.SKU}</small>
                              </h3>
                            </div>
                            <div className="ProductConfiguration__controls">
                              <div
                                data-label="Copy"
                                className="BtnV2 BtnV2--raised BtnV2--sm BtnV2--secondary"
                                onClick={() => this.duplicateProduct(i)}
                              >
                                <span>
                                  <i className="fa fa-copy" />
                                </span>
                              </div>
                              <div
                                data-label="Delete"
                                className="BtnV2 BtnV2--raised BtnV2--sm BtnV2--warning"
                                onClick={() => this.deleteProduct(i)}
                              >
                                <span>
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className="ProductConfiguration__productWrapper"
                      onClick={() => this.addProduct()}
                    >
                      <div className="ProductConfiguration__product ProductConfiguration__product--clickable ">
                        <h3 className="ProductConfiguration__producttitle ProductConfiguration__producttitle--add PaperType--h3 add-product-text">
                          Add Product +
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    {this.state.selectedProduct && (
                      <div className="ProductConfiguration__product">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Name*{" "}
                              </div>
                              <div className="FieldConfiguration__value">
                                <textarea
                                  className="FieldConfiguration__input"
                                  placeholder="My Product"
                                  value={this.state.selectedProduct.Name}
                                  onChange={(e) =>
                                    this.handleInputChange(e, "Name")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="_2PLFUU9OgtbELWQz3snC0b">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  SKU*{" "}
                                  <div className="FieldConfigurationField__i" />
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    className="FieldConfiguration__input"
                                    placeholder="red-tshirt-small"
                                    value={this.state.selectedProduct.SKU}
                                    onChange={(e) =>
                                      this.handleInputChange(e, "SKU")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="ZtOZviTTkcmz3-DO_OzgS">
                              <div className="_2PLFUU9OgtbELWQz3snC0b">
                                <div className="FieldConfigurationField ">
                                  <div className="FieldConfiguration__label">
                                    Price*{" "}
                                  </div>
                                  <div className="FieldConfiguration__value">
                                    <input
                                      type="number"
                                      min="0"
                                      className="FieldConfiguration__input"
                                      placeholder="0"
                                      value={this.state.selectedProduct.Price}
                                      onChange={(e) =>
                                        this.handleInputChange(e, "Price")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="_2PLFUU9OgtbELWQz3snC0b">
                              <div className="FieldConfigurationField ">
                                <div className="FieldConfiguration__label">
                                  Stock{" "}
                                  <div className="FieldConfigurationField__i" />
                                </div>
                                <div className="FieldConfiguration__value">
                                  <input
                                    type="number"
                                    min="0"
                                    className="FieldConfiguration__input"
                                    placeholder="-"
                                    value={this.state.selectedProduct.Stock}
                                    onChange={(e) =>
                                      this.handleInputChange(e, "Stock")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {this.state.buyMoreThanOneProduct && (
                          <div className="row">
                            <div className="col-md-6">
                              <div className="ZtOZviTTkcmz3-DO_OzgS">
                                <div className="_2PLFUU9OgtbELWQz3snC0b">
                                  <div className="FieldConfigurationField ">
                                    <div className="FieldConfiguration__label">
                                      Minimum Quantity / Submission
                                    </div>
                                    <span className="info-decr">
                                      <i
                                        className="fa fa-info-circle"
                                        aria-hidden="true"
                                      />{" "}
                                      If this product is selected, the submitter
                                      must order atleast the minimum quantity or
                                      more.
                                    </span>
                                    <div className="FieldConfiguration__value">
                                      <input
                                        type="number"
                                        min="0"
                                        key={
                                          this.state.selectedProduct.MinQuantity
                                        }
                                        className="FieldConfiguration__input"
                                        placeholder="-"
                                        defaultValue={
                                          this.state.selectedProduct.MinQuantity
                                        }
                                        onChange={(e) =>
                                          this.handleInputChange(
                                            e,
                                            "MinQuantity"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="_2PLFUU9OgtbELWQz3snC0b">
                                <div className="FieldConfigurationField ">
                                  <div className="FieldConfiguration__label">
                                    Maximum Quantity / Submission
                                  </div>
                                  <span className="info-decr">
                                    <i
                                      className="fa fa-info-circle"
                                      aria-hidden="true"
                                    />
                                    If this product is selected, the submitter
                                    can only order the maximum quantity or less.
                                  </span>
                                  <div className="FieldConfiguration__value">
                                    <input
                                      type="number"
                                      min="0"
                                      key={
                                        this.state.selectedProduct.MaxQuantity
                                      }
                                      className="FieldConfiguration__input"
                                      placeholder="-"
                                      defaultValue={
                                        this.state.selectedProduct.MaxQuantity
                                      }
                                      onChange={(e) =>
                                        this.handleInputChange(e, "MaxQuantity")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="row">
                          <div className="col-md-12">
                            <div className="FieldConfigurationField ">
                              <div className="FieldConfiguration__label">
                                Images{" "}
                              </div>
                              <div className="FieldConfiguration__value">
                                <div className="ProductConfiguration__imagesWrapper">
                                  <div className="ProductConfiguration__images" />
                                  <input
                                    type="file"
                                    multiple
                                    className="add-image"
                                    accept="image/*"
                                    onChange={(e) =>
                                      this.handleProductImageChange(e)
                                    }
                                  />
                                  <div className="BtnV2 BtnV2--secondary BtnV2--solid">
                                    <span>Add Images +</span>
                                  </div>
                                </div>
                              </div>
                              <div className="product-images">
                                <div className="product-image-wrapper">
                                  {this.state.selectedProduct &&
                                    this.state.selectedProduct.Images.map(
                                      (element, index) => {
                                        return (
                                          <div
                                            id={index}
                                            key={index}
                                            className="image-upload-style"
                                            style={{
                                              backgroundImage:
                                                "url('" + element + "')",
                                            }}
                                          >
                                            <div
                                              className="ProductConfiguration__imageDelete"
                                              onClick={() =>
                                                this.removeImage(index)
                                              }
                                            >
                                              <i className="fa fa-times cross-icon" />
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {this.state.selectedTab === "appearance" && (
                <div className="row">
                  <div className="col-md-3 product-side-bar">
                    <div className="col-md-12">
                      <label>Hide product prices</label>
                    </div>
                    <div className="col-md-12">
                      <Switch
                        checked={this.state.hideproductprices}
                        onChange={this.handleSwitchChange("hideproductprices")}
                        value="hideProductPrices"
                        color="primary"
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Layout</label>
                    </div>
                    <div className="col-md-12">
                      <SelectControl
                        from="Settings"
                        name="productsLayout"
                        options={this.state.layoutOptionArray}
                        defaultVal={this.state.productSelectedLayout}
                        id={this.props.item.key}
                        multi={false}
                        handleChange={this.handleLayoutChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="main-heading">
                      <h4 className="layout-heading">Preview</h4>
                      <div className="Product-preview">
                        <div className="Live-Field">
                          <div className="Field-container">
                            {this.state.productSelectedLayout.value ===
                            "card" ? (
                              <div className="cards">
                                {this.state.productList.map((element, c) => {
                                  return (
                                    <div key={c} className="card-heading">
                                      <div className="card-images">
                                        {element.Images.length > 0 && (
                                          <div className="image-view">
                                            <img
                                              alt=""
                                              src={element.Images[0]}
                                            />
                                          </div>
                                        )}
                                        <label className="Choices__choice btn-raised btn-default">
                                          <div className="Choices__label">
                                            <div className="Product-label-wrapper">
                                              <div className="Product-label">
                                                {element.Name}
                                              </div>
                                              {this.state.hideproductprices ===
                                                false && (
                                                <div className="Product__price">
                                                  ${element.Price}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : this.state.productSelectedLayout.value ===
                              "gallery" ? (
                              <div className="gallery">
                                {this.state.productList.map((element, c) => {
                                  return (
                                    <div key={c} className="gallery-heading">
                                      <div className="gallery-images">
                                        {element.Images.length > 0 && (
                                          <div
                                            className="gallery-view"
                                            style={{
                                              backgroundImage:
                                                "url('" +
                                                element.Images[0] +
                                                "')",
                                            }}
                                          />
                                        )}
                                        <label className="Choices__choice btn-raised btn-product btn-default choice-input">
                                          <div className="Choices__label">
                                            <div className="Product-label-wrapper">
                                              <div className="Product-label">
                                                {element.Name}
                                              </div>
                                              {this.state.hideproductprices ===
                                                false && (
                                                <div className="Product__price">
                                                  ${element.Price}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : this.state.buyMoreThanOneProduct === true ? (
                              this.state.productList.map((ev, i) => {
                                let inputClass = ev.isSelected
                                  ? "Choices__choice btn-raised btn-product btn-default  Choices__choice--1 choice-input"
                                  : "Choices__choice btn-raised btn-default  Choices__choice--1";
                                let imgLength = ev.Images.length;
                                return (
                                  <div key={i} className="Choices">
                                    {imgLength > 0 && (
                                      <div className="col-md-1 p-0">
                                        <img
                                          alt=""
                                          src={ev.Images[0]}
                                          className="option-img"
                                        />
                                      </div>
                                    )}
                                    <div
                                      className={
                                        imgLength > 0
                                          ? "col-md-11"
                                          : "col-md-12"
                                      }
                                    >
                                      <div className="Product__withquantity">
                                        <label className={inputClass}>
                                          <div className="Choices__label">
                                            <input
                                              type="checkbox"
                                              className="product-check-box"
                                            />
                                            <div className="Product-label-wrapper">
                                              <div className="Product-label">
                                                {ev.Name}
                                              </div>
                                              {this.state.hideproductprices ===
                                                false && (
                                                <div className="Product__price">
                                                  ${ev.Price}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              this.state.productList.map((ev, i) => {
                                return (
                                  <div key={i} className="Choices">
                                    {ev.Images.length > 0 && (
                                      <div className="col-md-1 p-0">
                                        <img
                                          alt=""
                                          src={ev.Images[0]}
                                          className="option-img"
                                        />
                                      </div>
                                    )}
                                    <div
                                      className={
                                        ev.Images.length
                                          ? "col-md-11"
                                          : "col-md-12"
                                      }
                                    >
                                      <div className="Product__withquantity">
                                        <label className="Choices__choice btn-raised btn-default  Choices__choice--1 choice-input">
                                          <div className="Choices__label">
                                            <input
                                              type="radio"
                                              name="Choice"
                                              className="input-radio"
                                            />
                                            <div className="Product-label-wrapper">
                                              <div className="Product-label">
                                                {" "}
                                                {ev.Name}
                                              </div>
                                              {this.state.hideproductprices ===
                                                false && (
                                                <div className="Product__price">
                                                  ${ev.Price}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ReactModal>
          </div>
        </div>
      </div>
    );
  }
}
