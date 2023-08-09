import React from "react";
import FontPicker from "font-picker-react";
import { editorStateFromRaw } from "megadraft";
import MegadraftEditor from "../../MegaEditor/components/MegadraftEditor";
import actions from "megadraft/lib/actions/default";
import breakPlugin from "../../MegaEditor/plugins/break";
import questionPlugin from "../../MegaEditor/plugins/question";
import image from "../../MegaEditor/plugins/image";
import video from "../../MegaEditor/plugins/video";
import { convertToRaw } from "draft-js";
import { composeDecorators } from "draft-js-plugins-editor";
import createImagePlugin from "draft-js-image-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import createResizeablePlugin from "draft-js-resizeable-plugin";
import $ from "jquery";
import PreviewForm from "./PreviewForm";

import "../../assets/custom/ThemeSection.css";
import { getThemeInfoByFormId } from "../../API/IntegrationAPI";
import watch from "redux-watch";
import { UploadImage, DeleteImage, b64toBlob } from "../../util/commonFunction";

import { CONFIGURE_PAYMENTS_URLS, WEB_FONTS_KEYS } from "../../util/constants";

import "draft-js-focus-plugin/lib/plugin.css";
import "../../assets/custom/question_control.css";
import "../../assets/custom/sidebar.css";
import { PostData, GetData } from "../../stores/requests";

import Loader from "../../components/Common/Loader";
// reactstrap components
import { Card, CardBody, Row, Col } from "reactstrap";
// core components
import {
  FORM_URLS,
  TEMPLATE_URLS,
  FORM_BEHAVIOUR_URLS,
} from "../../util/constants";
import { saveEditorData } from "../../actions";
import { store } from "../../index";
import ReactDatetimeClass from "react-datetime";
export {
  Block,
  Inline,
  Entity,
  HANDLED,
  NOT_HANDLED,
} from "../../util/constants";
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

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

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === "leftAlign") {
    sessionStorage.setItem("alignClass", "text-left");

    if (sessionStorage.getItem("h1Class") != null) {
      return `text-left ${sessionStorage.getItem("h1Class")}`;
    } else if (sessionStorage.getItem("h2Class") != null) {
      return `text-left ${sessionStorage.getItem("h2Class")}`;
    }
    return "text-left";
  } else if (type === "rightAlign") {
    sessionStorage.setItem("alignClass", "text-right");

    if (sessionStorage.getItem("h1Class") != null) {
      return `text-right ${sessionStorage.getItem("h1Class")}`;
    } else if (sessionStorage.getItem("h2Class") != null) {
      return `text-right ${sessionStorage.getItem("h2Class")}`;
    }
    return "text-right";
  } else if (type === "centerAlign") {
    sessionStorage.setItem("alignClass", "text-center");
    if (sessionStorage.getItem("h1Class") != null) {
      return `text-center ${sessionStorage.getItem("h1Class")}`;
    } else if (sessionStorage.getItem("h2Class") != null) {
      return `text-center ${sessionStorage.getItem("h2Class")}`;
    }
    return "text-center";
  } else if (type === "header-one") {
    sessionStorage.removeItem("h2Class");
    if (sessionStorage.getItem("h1Class") != null) {
      sessionStorage.removeItem("h1Class");
    } else {
      sessionStorage.setItem("h1Class", "h1_Cust");
    }
  } else if (type === "header-two") {
    sessionStorage.removeItem("h1Class");
    if (sessionStorage.getItem("h2Class") != null) {
      sessionStorage.removeItem("h2Class");
    } else {
      sessionStorage.setItem("h2Class", "h2_Cust");
    }
  } else if (type === "unordered-list-item") {
    sessionStorage.removeItem("h1Class");
    sessionStorage.removeItem("h2Class");
  } else if (type === "ordered-list-item") {
    sessionStorage.removeItem("h1Class");
    sessionStorage.removeItem("h2Class");
  }

  if (sessionStorage.getItem("alignClass") !== undefined) {
    return sessionStorage.getItem("alignClass");
  }
}
class CreateForms extends React.Component {
  jsonToLoad = [];
  constructor(props) {
    super(props);
    this.maxSidebarButtons = 4;
    const myContent = {
      entityMap: {},
      blocks: [
        {
          key: "ag6qs",
          text: "",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
    };
    let editorState =
      props.editorState && props.editorState !== "undefined"
        ? editorStateFromRaw(JSON.parse(props.editorState))
        : editorStateFromRaw(myContent);
    if (localStorage.templateId) {
      this.useTemplate(localStorage.templateId);
    }

    this.state = {
      editorState,
      toPreviewPage: false,
      formData: [],
      previewContent: "",
      formJSON:
        this.props.EditForm && this.props.EditForm === "false"
          ? JSON.parse(localStorage.EditFormData)
          : [],
      isDuplicate:
        this.props.EditForm && this.props.EditForm !== true ? true : false,
      saveBtnTxt: "Save",
      updateBtnTxt: "Update",
      isLoader: false,
      tempId: 0,
      themeInfo: [],
      selectedBackgroundColor: { r: "255", g: "255", b: "255", a: "1" },
      selectedBackgroundFile: null,
      PaymentAccount: null,
      currentUserId: null,
    };
    this.saveFieldData = this.saveFieldData.bind(this);
  }
  useTemplate = (tempId) => {
    this.setState({ isLoader: true });
    if (tempId != null) {
      GetData(TEMPLATE_URLS.GET_TEMPLATE_BY_TEMPID + tempId).then((result) => {
        if (result != null) {
          this.setState({
            editorState: editorStateFromRaw(
              JSON.parse(result.Item.EditorState)
            ),
          });
          this.setState({ isLoader: false });
        } else {
          this.setState({ isLoader: false });
        }
      });
    }
  };
  async componentWillMount() {
    const userData = localStorage.getItem("loginUserInfo");
    if (userData) {
      const uData = JSON.parse(userData);
      this.setState({
        currentUserId: uData.UserId,
      });
    }

    localStorage.setItem("grpCounter", 0);
    if (
      store.getState().savePageType === "edit" &&
      store.getState().storeData &&
      store.getState().storeData.editorData &&
      store.getState().storeData.editorData !== "undefined"
    ) {
      this.setState({
        editorState: editorStateFromRaw(
          JSON.parse(store.getState().storeData.editorData)
        ),
      });
    } else if (
      store.getState().storeData &&
      store.getState().storeData.editorData &&
      store.getState().storeData.editorData !== "undefined"
    ) {
      this.setState({
        editorState: editorStateFromRaw(
          JSON.parse(store.getState().storeData.editorData)
        ),
      });
    }
    if (localStorage.templateId) this.setState({ isLoader: true });
    sessionStorage.removeItem("h1Class");
    sessionStorage.removeItem("h2Class");
    this.FormId = localStorage.CurrentFormId;
    this.GetSelectedThemeInfo();
  }

  GetSelectedThemeInfo = async () => {
    this.setState({ isLoader: true });
    let result = [];
    result = await getThemeInfoByFormId(localStorage.CurrentFormId);
    if (result.Count > 0) {
      if (result.Items !== undefined) {
        const themeData = result.Items;
        this.setState({
          themeInfo: themeData,
          selectedBackgroundColor: themeData[0].BackgroundColor ? themeData[0].BackgroundColor : this.state.selectedBackgroundColor,
          selectedBackgroundFile: themeData[0].BackgroundFile,
        });
        this.getPaymentConfigration();
      }
    } else {
      this.getPaymentConfigration();
    }
  };

  getPaymentConfigration() {
    const paymentConfigData = store.getState().fetchPaymentConfigInfo
      .paymentConfigInfo;
    if (paymentConfigData) {
      console.log("store", paymentConfigData);
      const paymentInfo = JSON.parse(paymentConfigData.PaymentAccount);
      this.setState({ PaymentAccount: paymentInfo.PaymentAccountId });
      this.setState({ isLoader: false });
    } else {
      GetData(
        CONFIGURE_PAYMENTS_URLS.GET_PAYMENT_CONFIGURATION_URL +
          localStorage.CurrentFormId
      ).then((result) => {
        if (Object.keys(result.data).length > 0) {
          let resultantItem = result.data.Item;
          const paymentInfo = JSON.parse(resultantItem.PaymentAccount);
          this.setState({
            PaymentAccount: paymentInfo.PaymentAccountId,
          });
          this.setState({ isLoader: false });
        } else {
          this.setState({ isLoader: false });
        }
      });
    }
  }

  onChange = (editorState) => {    
    localStorage.setItem("grpCounter", 0);
    this.setState({
      saveBtnTxt: "Save",
      updateBtnTxt: "Update",
      isDuplicate: false,
    });
    this.setState({ editorState });
    let rawValue = convertToRaw(editorState.getCurrentContent());
    let editorStateRawData = JSON.stringify(rawValue);
    store.dispatch(saveEditorData(editorStateRawData));
    this.saveFieldData();
  };

  makeid(length) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  componentWillUnmount() {   
    let rawValue = convertToRaw(this.state.editorState.getCurrentContent());
    let editorStateRawData = JSON.stringify(rawValue);
    store.dispatch(saveEditorData(editorStateRawData));
    this.saveFieldData();
  }
  componentDidMount() {

    localStorage.setItem("grpCounter", 0);
    if (this.props.EditForm && this.props.EditForm === "false") {
      this.FormId = this.makeid(6);
      localStorage.setItem("CurrentFormId", this.FormId);
      localStorage.setItem("FormId", this.FormId);
      this.setState({ isDuplicate: true });
      this.saveChanges();
      localStorage.setItem("EditForm", true);
    }

    // store is THE redux store
    let w = watch(store.getState, "fetchthemeInfo");

    store.subscribe(
      w((newVal, oldVal, objectPath) => {
        const themeData = newVal.themeInfo;
        if (themeData) {
          this.setState({
            themeInfo: themeData,
            selectedBackgroundColor: themeData[0].BackgroundColor || this.state.selectedBackgroundColor,
            selectedBackgroundFile: themeData[0].BackgroundFile,
          });
        }
      })
    );
  }

  saveChanges = async () => {
    this.btn.setAttribute("disabled", "disabled");
    try{     
    let rawValue = convertToRaw(this.state.editorState.getCurrentContent());
    let imgName = [];
    let content = this.state.formJSON;

    //remove image data from content
    content.map((value) => {
      if (value.src !== undefined) {
        value.src = "null";
      }
    });
   
    //removing image from editor state and uploading images to aws
    await this.getSavedBinaryData(rawValue,imgName);
    //images names
    let images = imgName.join();
    let editorStateRawData = JSON.stringify(rawValue);

    // let editorStateRawData = JSON.stringify(this.state.editorStateRawValue);

    let formId = this.FormId;
    if (formId) {
      localStorage.setItem("grpCounter", 0);
      localStorage.setItem("EditForm", true);
      localStorage.setItem("FormId", formId);
      localStorage.setItem("CurrentFormId", formId);

      let FormModel = {
        Type: "add",
        FormId: formId,
        Content: this.state.isDuplicate ? content : JSON.stringify(content),
        CreatedAt: Date.now().toString(),
        CreatedBy: this.state.currentUserId,
        FormName: localStorage.formName ? localStorage.formName : null,      
        FormImages:images,
        IsActive: true,
        FormUrl: formId,
        EditorState: editorStateRawData,
        UpdatedAt: Date.now().toString(),
        UpdatedBy: this.state.currentUserId,
        SubmissionCount: 0,
        Tags: [],
        SendEmailOnSubmission: true,
        FormHashKey: localStorage.formName
          ? localStorage.formName.toLowerCase()
          : null,
      };
      try {
        PostData(FORM_URLS.POST_FORM, FormModel).then((result) => {
          if (FormModel.Content != null) {
            this.setState({ saveBtnTxt: "Saved" });
            this.props.history.push("../user/EditForm");
          }
        });
      } catch (err) {
        console.log(FORM_URLS.POST_FORM, err);
      }
    }
  
  
  }
  catch(error){
    alert("something went wrong.Please try again!")
  }
  this.btn.removeAttribute("disabled");
};

  getSavedBinaryData=async (rawValue,imgName)=> {
  await Promise.all(
    rawValue.blocks.map(async (element) => {
      if (element.data.src !== undefined) {
        let binarydata = element.data.src;
        let fileName = element.key + "_" + Date.now().toString() + ".jpeg";
        imgName.push(fileName);
        var blob = b64toBlob(binarydata);
        let file = new File([blob], fileName, {
          type: "image/jpeg",
        });
        await UploadImage(file, "FormImages");
        element.data.src = "null";
      }
    })
  );
}

  UpdateForm = async () => {
    if(this.state.updateBtnTxt==="Updated"){
      return false;
    } 
    this.btn.setAttribute("disabled", "disabled"); 
    try{
    let FormData = this.props.FormData;
    let rawValue = convertToRaw(this.state.editorState.getCurrentContent());

    //get existing images from db
    let existedImages = [];
    await GetData(FORM_URLS.GET_FORM_BY_ID_URL + localStorage.FormId)
      .then((result) => {
        if (result && result.Item) {
          if ((result.Item.FormImages !== null)) {
            existedImages = result.Item.FormImages.split(",");
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    let content = this.state.formJSON;
    //delete file from aws
    let imgPresent = [];
    content.map((value) => {
      if (value.src !== undefined) {
        if (value.src.includes("http") && value.src.includes("FormImages")) {
          imgPresent.push(value.src.split("/")[4]);
        }
      }
    });
    if ((existedImages.length >=1)&&(existedImages[0]!=="")) {
      //get the removed image;
      var removedImages = existedImages.filter(function(obj) {
        return imgPresent.indexOf(obj) == -1;
      });
      async function deleteImg() {
        await Promise.all(
          removedImages.map(async (removedImg) => {
            await DeleteImage(removedImg,"FormImages");
          })
        );
      }
        await deleteImg();
    }

    let imgName = [];
    //remove image data from content
    content.map((value) => {
      if (value.src !== undefined) {
        value.src = "null";
      }
    });
    
    //removing image from editor state and uploading images to aws
    await this.getUploadBinaryData(rawValue,existedImages,imgName);

    //images names
    let images = imgName.join();
    let editorStateRawData = JSON.stringify(rawValue);
    let FormModel = {
      Type: "update",
      FormId: FormData.FormId,
      Content: JSON.stringify(content),
      CreatedAt: FormData.CreatedAt,
      CreatedBy: this.state.currentUserId,
      FormName: localStorage.formName ? localStorage.formName : null,      
      FormImages:images,
      IsActive: true,
      FormUrl: FormData.FormUrl ? FormData.FormUrl : FormData.FormId,
      EditorState: editorStateRawData,
      UpdatedAt: Date.now().toString(),
      SubmissionCount: FormData.SubmissionCount,
      UpdatedBy: this.state.currentUserId,
      Tags: FormData.Tags,
      SendEmailOnSubmission: FormData.SendEmailOnSubmission,
      FormHashKey: localStorage.formName
        ? localStorage.formName.toLowerCase()
        : null,
    };
    try {
      PostData(FORM_URLS.POST_FORM, FormModel).then((result) => {
        if (FormModel.Content != null) {
          this.setState({ updateBtnTxt: "Updated" });
        }
      });
    } catch (err) {
      console.log(FORM_URLS.POST_FORM, err);
    }
  }
    catch(error){
     alert("something went wrong.Please try again!")
    }
    this.btn.removeAttribute("disabled");
  };


  getUploadBinaryData = async(rawValue,existedImages,imgName) =>{
    await Promise.all(
      rawValue.blocks.map(async (element) => {
        if (element.data.src !== undefined) {
          let binarydata = element.data.src;           
          if(binarydata!=="null"){
          if (
            binarydata.includes("http") &&
            binarydata.includes("FormImages")
          ) {
            if (existedImages.includes(binarydata.split("/")[4])) {
              imgName.push(binarydata.split("/")[4]);
            }
          } else {
            let fileName =
              element.key + "_" + Date.now().toString() + ".jpeg";
            imgName.push(fileName);
            var blob = b64toBlob(binarydata);
            let file = new File([blob], fileName, {
              type: "image/jpeg",
            });
            await UploadImage(file, "FormImages");
          }
          element.data.src = "null";
       }
        }
      })
    );
  }



  saveFieldData = () => {
    let formJSON = [];
    const rawValue = convertToRaw(this.state.editorState.getCurrentContent());
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
    this.setState({ formJSON: formJSON, editorStateRawValue: rawValue });
    let addQuestionAnswerObj = JSON.parse(
      localStorage.getItem("addQuestionAnswer")
    );

    if (
      addQuestionAnswerObj !== undefined &&
      addQuestionAnswerObj != null &&
      addQuestionAnswerObj.length > 0
    ) {
      formJSON.forEach((e) => {
        let matchedData = addQuestionAnswerObj.filter((data) => {
          let _maianClickedQsId = data.maianClickedQsId
            ? data.maianClickedQsId.split("visibility")
            : "";
          if (_maianClickedQsId && e.key === _maianClickedQsId[1]) {
            return data;
          }
          return data;
        });
        if (matchedData !== undefined && matchedData.length > 0) {
          let filterNewList = matchedData.filter((listData) => {
            if (
              listData.isSelectedQuestionId !== undefined &&
              listData.AddAnotherConditionSubDropdwnList[0].isAnswer !==
                undefined &&
              listData.AddAnotherConditionSubDropdwnList[0].isAnswer !== ""
            ) {
              return listData;
            }
            return listData;
          });
          e.ListOfQuestionForSettings = filterNewList;
        }
      });
    }
    localStorage.setItem("formJSON", JSON.stringify(formJSON));
  };
  previewForm = () => {
    localStorage.removeItem("formRequireCaptcha");
    this.saveFieldData();
    if (
      localStorage.CurrentFormId !== undefined &&
      localStorage.CurrentFormId != null &&
      localStorage.CurrentFormId != null
    ) {
      GetData(
        FORM_BEHAVIOUR_URLS.GET_FORM_BEHAVIOUR_URL + localStorage.CurrentFormId
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
              window.open(
                "../preview/PreviewForm/" + localStorage.CurrentFormId,
                "_blank"
              );
            }
          }
        } else {
          localStorage.removeItem("formRequireCaptcha");
          window.open(
            "../preview/PreviewForm/" + localStorage.CurrentFormId,
            "_blank"
          );
        }
      });
    } else {
      this.getForms();
    }
  };

  render() {
    const pageType = store.getState().savePageType.pageType;
    const customActions = actions.concat([
      { type: "block", label: "H1", style: Block.H1, icon: HeaderOneIcon },

      {
        type: "block",
        label: "LeftAlign",
        style: Block.LeftAlign,
        icon: LeftIndentIcon,
      },
      {
        type: "block",
        label: "CenterAlign",
        style: Block.CenterAlign,
        icon: CenterIndentIcon,
      },
      {
        type: "block",
        label: "RightAlign",
        style: Block.RightAlign,
        icon: RightIndentIcon,
      },
    ]);
    if (this.state.isLoader) {
      return <Loader />;
    }
    const html = (
      <Card
        style={
          this.state.selectedBackgroundFile != null &&
          this.state.selectedBackgroundFile !== ""
            ? {
                backgroundImage: `url(${this.state.selectedBackgroundFile})`,
              }
            : {
                background: `rgba(${this.state.selectedBackgroundColor.r}, ${
                  this.state.selectedBackgroundColor.g
                }, ${this.state.selectedBackgroundColor.b}, ${
                  this.state.selectedBackgroundColor.a
                })`,
              }
        }
      >
        <CardBody>
          <Row>
            {!this.props.splitPreviewMode && <Col className="mb-8" md="3" />}
            <Col className="mb-8" md="7">
              <MegadraftEditor
                editorState={this.state.editorState}
                onChange={this.onChange}
                actions={customActions}
                spellCheck={true}
                maxSidebarButtons={this.maxSidebarButtons}
                blockStyleFn={myBlockStyleFn}
                placeholder="Type here or choose an option to get started"
                themeInfo={this.state.themeInfo}
                paymentAccountId={this.state.PaymentAccount}
                plugins={[
                  image,
                  video,
                  breakPlugin,
                  questionPlugin,
                  focusPlugin,
                  resizeablePlugin,
                  imagePlugin,
                ]}
                ref={(element) => {
                  this.editor = element;
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <button onClick={this.previewForm}>Preview</button>
              &nbsp; &nbsp;
              {/* {this.props.EditForm == "true"? <button onClick={this.UpdateForm}> Update </button>:
              <button onClick={this.saveChanges}> {this.state.saveBtnTxt} </button> } */}
              {pageType === "edit" ? (
                <button  ref={btn => { this.btn = btn; }}  onClick={this.UpdateForm}>
                  {this.state.updateBtnTxt}
                </button>
              ) : (
                <button  ref={btn => { this.btn = btn; }}  onClick={this.saveChanges}>
                  {" "}
                  {this.state.saveBtnTxt}{" "}
                </button>
              )}
            </Col>
          </Row>
          <div style={{ visibility: "hidden" }}>
            <FontPicker
              apiKey={WEB_FONTS_KEYS.SECRETKEY}
              limit={WEB_FONTS_KEYS.LIMIT}
            />
          </div>
        </CardBody>
      </Card>
    );

    return (
      <>
        <div className="content">
          {this.props.splitPreviewMode ? (
            <Row>
              <Col md="6">{html}</Col>
              <Col md="6 Toggle-View">
                <CardBody>
                  <Row>
                    <Col className="mb-8 Toggle-View" md="12">
                      <PreviewForm formJSON={this.state.formJSON} />
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md="12">{html}</Col>
            </Row>
          )}
        </div>
      </>
    );
  }
}
class HeaderOneIcon extends React.Component {
  render() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M11.58,19.86H9.69v-6.57H2.53v6.57H0.65V5.64h1.88v6.11h7.17V5.64h1.88V19.86z M20.38,19.86h-1.82V7.82l-3.64,1.34V7.52l5.18-1.94h0.28V19.86z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}

class RightIndentIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}

class LeftIndentIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}

class CenterIndentIcon extends React.Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}

export default CreateForms;
