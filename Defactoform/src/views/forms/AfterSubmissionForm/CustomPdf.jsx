import React from "react";
import Modal from "react-modal";
import ThemeSettingsCustomPDF from "./ThemeSettingsCustomPDF";
import image from "../../../customPdfEditor/plugins/image";
import question from "../../../customPdfEditor/plugins/question";
import MegadraftEditor from "../../../customPdfEditor/components/MegadraftEditor";
import { editorStateFromRaw, editorStateToJSON, DraftJS } from "megadraft";
import actions from "megadraft/lib/actions/default";
import Loader from "../../../components/Common/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { GetData, PostData, Delete } from "../../../stores/requests";
import { SUBMISSION_URLS, CUSTOM_PDF } from "../../../util/constants";
import { EditorState } from "draft-js";
import { UploadFile, GetFile } from "./../../../util/commonFunction";

class CustomPdf extends React.Component {
  constructor(props) {
    super(props);
    this.myContent = {
      entityMap: {},
      blocks: [
        {
          key: DraftJS.genKey,
          text: "Here are your results",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
    };
    let editorState = EditorState.createEmpty();
    this.state = {
      editorState,
      blobContent: null,
      isLoader: false,
      editedFileName: null,
      upload: false,
      downloadedfileName: `CustomPDF1_${Date.now()}.pdf`,
      reactModalData: "",
      title: "Submission Results",
      render: "",
      submissionList: [],
      HeaderType: "Heading1",
      colorOne: { r: "255", g: "163", b: "163", a: "1" },
      pdfStyling: [
        {
          name: "Heading1Font",
          Heading1Font: {
            fontFamily: "Lato",
            overflow: "auto",
            padding: "18px",
            boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
            fontSize: "36px",
            lineHeight: "auto",
            fontWeight: "700",
            color: "rgba(0, 0, 0, 1)",
            backgroundColor: "white",
          },
        },
        {
          name: "Heading2Font",
          Heading2Font: {
            fontFamily: "La Belle Aurore",
            overflow: "auto",
            padding: "18px",
            boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
            fontSize: "36px",
            lineHeight: "auto",
            fontWeight: "700",
            color: "rgba(0, 0, 0, 1)",
          },
        },
        {
          name: "ParagraphFont",
          ParagraphFont: {
            fontFamily: "Lato",
            // overflow: "auto",
            padding: "18px",
            boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
            fontSize: "18px",
            lineHeight: "auto",
            fontWeight: "700",
            color: "rgba(0, 0, 0, 1)",
          },
        },
        {
          name: "TitleFont",
          TitleFont: {
            fontFamily: "La Belle Aurore",
            overflow: "auto",
            padding: "18px",
            boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
            fontSize: "24px",
            lineHeight: "auto",
            fontWeight: "regular",
            color: "rgba(0, 0, 0, 1)",
          },
        },
        {
          name: "Answer",
          Answer: {
            fontFamily: "Lato",
            overflow: "auto",
            padding: "14px",
            boxshadow: "rgba(0, 0, 0, 0.3) 0px 3px 15px -8px inset",
            fontSize: "15px",
            lineHeight: "auto",
            fontWeight: "700",
            color: "rgba(0, 0, 0, 1)",
          },
        },
      ],
    };
    this.themeInitialState = this.state.pdfStyling;
    let JsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (JsonData != null) {
      this.loginUserId = JsonData.UserId;
    }
  }
  async componentWillMount() {
    this.setState({ isLoader: true });
    let jsonData = [];

    const URL = SUBMISSION_URLS.GET_SUBMISSIONS + localStorage.CurrentFormId;
    const response = await fetch(URL);
    const data = await response.json();

    let formData = data.data.Items.filter((data) => {
      return data.PartialSubmission === false;
    });

    if (formData.length > 0) {
      for (let i = formData.length - 1; i < formData.length; i++) {
        jsonData.push(formData[i]);
      }
      this.setState({ submissionList: jsonData });
    } else {
      this.setState({ isLoader: false });
    }
    this.getSavedData();
  }
  addPdf = (e) => {
    localStorage.setItem("addPdf", true);
    localStorage.removeItem("editPdf");
    this.setState({
      pdfStyling: this.themeInitialState,
      showModal: true,
      editorState: editorStateFromRaw(),
      title: "Submission Results",
      showThemeDialogue1: false,
      showThemeDialogue2: false,
      showThemeDialogue3: false,
      showThemeDialogue4: false,
      showThemeDialogue5: false,
    });
    EditorState.moveFocusToEnd(this.state.editorState);
  };

  ChangeFont = (val, FontType, arrWeight) => {
    let checkSelectedFont = this.state.render;
    this.setState({
      activePrimaryFontFamily: val,
      [checkSelectedFont]: FontType,
      Weight: arrWeight,
    });
  };
  openStyle = (value) => {
    this.setState({ render: value });
    if (value === "Heading1Font") {
      this.setState({ showThemeDialogue1: true });
    } else if (value === "Heading2Font") {
      this.setState({ showThemeDialogue2: true });
    } else if (value === "ParagraphFont") {
      this.setState({ showThemeDialogue3: true });
    } else if (value === "TitleFont") {
      this.setState({ showThemeDialogue4: true });
    } else if (value === "Answer") {
      this.setState({ showThemeDialogue5: true });
    }
  };
  handleFontSize = (value) => {
    let checkSelectedFont = this.state.render;

    let newArray = [...this.state.pdfStyling];

    const elementsIndex = newArray.findIndex(
      (element) => element.name === checkSelectedFont
    );
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      [checkSelectedFont]: value,
    };
    this.setState({
      pdfStyling: newArray,
    });
  };
  handleLineHeightChange = (value) => {
    let checkSelectedFont = this.state.render;
    let newArray = [...this.state.pdfStyling];

    const elementsIndex = newArray.findIndex(
      (element) => element.name === checkSelectedFont
    );
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      [checkSelectedFont]: value,
    };
    this.setState({
      pdfStyling: newArray,
    });
  };
  handleWeightChange = (value) => {
    let checkSelectedFont = this.state.render;
    let newArray = [...this.state.pdfStyling];

    const elementsIndex = newArray.findIndex(
      (element) => element.name === checkSelectedFont
    );
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      [checkSelectedFont]: value,
    };
    this.setState({
      pdfStyling: newArray,
    });
  };
  handleColorchange = (colorTwo, obj) => {
    let checkSelectedFont = this.state.render;
    let newArray = [...this.state.pdfStyling];

    const elementsIndex = newArray.findIndex(
      (element) => element.name === checkSelectedFont
    );
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      [checkSelectedFont]: obj,
    };
    this.setState({
      pdfStyling: newArray,
      colorOne: colorTwo,
    });
  };

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  changeDateFormat = (date) => {
    let dateFor = new Date(parseInt(date));
    let month = dateFor.getMonth();
    let day = dateFor.getDate();
    let year = dateFor.getFullYear().toString();
    let hours = dateFor.getHours();
    let minutes = dateFor.getMinutes();
    let seconds = dateFor.getSeconds();

    return `${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`;
  };

  htmltopdf = async () => {
    const divToDisplay = document.getElementById("pdf");
    await html2canvas(divToDisplay).then((canvas) => {
      const divImage = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(divImage, "PNG", 10, 10);
      if (this.state.upload) {
        this.setState({ blobContent: pdf.output("blob"), upload: false });
      } else {
        let checkAddPdf = localStorage.getItem("addPdf");
        let check = localStorage.getItem("duplicatePdf");
        let downloadPdfName = null;
        //get pdf name
        if (check || checkAddPdf) {
          downloadPdfName = this.state.downloadedfileName;
        } else {
          downloadPdfName = this.state.editedFileName;
        }
        //download file in the browser
        pdf.save(downloadPdfName);
      }
    });
  };

  backtoEditor = async () => {
    this.setState({ showModal: false, isLoader: true, upload: true });
    let checkAddPdf = localStorage.getItem("addPdf");
    let check = localStorage.getItem("duplicatePdf");
    let pdfName = null;

    //get pdf name
    if (check || checkAddPdf) {
      pdfName = this.state.downloadedfileName;
    } else {
      pdfName = this.state.editedFileName;
    }
    //upload file to aws
    await this.htmltopdf();
    let file = new File([this.state.blobContent], pdfName, {
      type: "application/pdf",
    });
    await UploadFile(file);

    if (check || checkAddPdf) {
      await this.savePdfData();
    } else {
      await this.updatePdfData();
    }
  };
  savePdfData = () => {
    let formModel = {
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      CustomPDFId: DraftJS.genKey(),
      FileName: this.state.downloadedfileName,
      FormId: localStorage.CurrentFormId,
      IsActive: true,
      PDFName: this.state.title,
      FileContent: editorStateToJSON(this.state.editorState),
      PDFStyle: this.state.pdfStyling,
    };
    try {
      PostData(CUSTOM_PDF.ADD_CUSTOM_PDF, formModel).then((result) => {
        this.getSavedData();
      });
    } catch (err) {
      console.log(err);
    }
  };
  updatePdfData = () => {
    let formModel = {
      CreatedAt: Date.now(),
      CreatedBy: this.loginUserId,
      CustomPDFId: this.state.editId,
      FileName: this.state.editedFileName,
      FormId: localStorage.CurrentFormId,
      IsActive: true,
      PDFName: this.state.title,
      FileContent: editorStateToJSON(this.state.editorState),
      PDFStyle: this.state.pdfStyling,
    };

    try {
      PostData(CUSTOM_PDF.ADD_CUSTOM_PDF, formModel).then((result) => {
        this.getSavedData();
      });
    } catch (err) {
      console.log(err);
    }
  };
  getSavedData = async () => {
    try {
      await GetData(
        CUSTOM_PDF.GET_CUSTOM_PDF_FORMID + localStorage.CurrentFormId
      ).then((result) => {
        this.setState({ reactModalData: result.Items });
        this.setState({ isLoader: false });
      });
    } catch (error) {
      console.log(error);
    }
  };
  editPdfHandler = async (id) => {
    localStorage.setItem("editPdf", true);
    localStorage.removeItem("duplicatePdf");
    localStorage.removeItem("addPdf");
    this.setState({ editId: id, isLoader: true });
    try {
      await GetData(CUSTOM_PDF.GET_CUSTOM_PDF_ID + id).then((result) => {
        let data = JSON.parse(result.data);
        let pdfData = editorStateFromRaw(JSON.parse(data.Items[0].FileContent));
        let pdfName = data.Items[0].PDFName;
        let pdfThemeStyle = data.Items[0].PDFStyle;
        let fileName = data.Items[0].FileName;
        this.setState({
          editorState: pdfData,
          showModal: true,
          title: pdfName,
          isLoader: false,
          pdfStyling: pdfThemeStyle,
          editedFileName: fileName,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  deletePdfHandler = (id) => {
    const confirm = window.confirm(
      "are you sure you want to delete this screen?"
    );
    if (confirm) {
      this.setState({ isLoader: true });
      try {
        Delete(CUSTOM_PDF.DELETE_CUSTOM_PDF + id).then((result) => {
          ("deleted successfully");
          this.getSavedData();
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  duplicateForm = (id) => {
    localStorage.setItem("duplicatePdf", true);
    this.setState({ editId: id, isLoader: true });
    try {
      GetData(CUSTOM_PDF.GET_CUSTOM_PDF_ID + id).then((result) => {
        let data = JSON.parse(result.data);
        let pdfData = editorStateFromRaw(JSON.parse(data.Items[0].FileContent));
        let pdfName = data.Items[0].PDFName;
        let pdfThemeStyle = data.Items[0].PDFStyle;
        this.setState({
          editorState: pdfData,
          showModal: true,
          title: `${pdfName} (copy)`,
          isLoader: false,
          pdfStyling: pdfThemeStyle,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    const content = JSON.parse(editorStateToJSON(this.state.editorState));
    const myStyle = {
      display: "block",
    };
    const myStyle1 = {
      display: "none",
    };
    const openTheme = this.state.showThemeDialogue1 ? myStyle : myStyle1;
    const openTheme1 = this.state.showThemeDialogue2 ? myStyle : myStyle1;
    const openTheme2 = this.state.showThemeDialogue3 ? myStyle : myStyle1;
    const openTheme3 = this.state.showThemeDialogue4 ? myStyle : myStyle1;
    const openTheme4 = this.state.showThemeDialogue5 ? myStyle : myStyle1;

    const customStyle = {
      content: {
        width: "80%",
      },
    };
    const ref = React.createRef();
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

    return (
      <div>
        <div className="default-margin">
          <form name="ViewForm" className="background-top-block">
            <div className="">
              <div className="defacto-form">
                <h2 className="defacto-header">Custom PDFs</h2>
                <p>
                  Create custom PDFs for every form submission. Design custom
                  PDFs below which can then be attached to emails, Zaps or
                  Direct Integrations, or downloaded manually from your forms
                  submissions page.
                </p>
                <div>
                  <div style={{ position: "relative" }}>
                    <div
                      className="ResultsTable__wrapper "
                      style={{ overflow: "visible" }}
                    >
                      <table className="ResultsTable ">
                        <thead>
                          <tr>
                            <th>PDF Name</th>
                            <th style={{ width: "100px" }}>Edit</th>
                            <th style={{ width: "100px" }}>Copy</th>
                            <th style={{ width: "100px" }}>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.reactModalData.length > 0 &&
                            this.state.reactModalData.map((data) => (
                              <tr>
                                <td> {data.PDFName}</td>
                                <td className="ResultsTable__delete">
                                  <div
                                    className="BtnV2 BtnV2--raised BtnV2--secondary"
                                    tabIndex="-1"
                                    onClick={(e) =>
                                      this.editPdfHandler(data.CustomPDFId)
                                    }
                                  >
                                    <span>
                                      <i className="fa fa-edit" />
                                    </span>
                                  </div>
                                </td>
                                <td className="ResultsTable__delete">
                                  <div
                                    className="BtnV2 BtnV2--raised BtnV2--secondary"
                                    tabIndex="-1"
                                    onClick={(e) =>
                                      this.duplicateForm(data.CustomPDFId)
                                    }
                                  >
                                    <span>
                                      <i className="fa fa-copy" />
                                    </span>
                                  </div>
                                </td>
                                <td className="ResultsTable__delete">
                                  <div
                                    className="BtnV2 BtnV2--raised BtnV2--warning"
                                    tabIndex="-1"
                                    onClick={(e) =>
                                      this.deletePdfHandler(data.CustomPDFId)
                                    }
                                  >
                                    <span>
                                      <i className="fa fa-times" />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {this.state.reactModalData.length <= 0 && (
                            <td colSpan="7">
                              <p style={{ textAlign: "center" }}>No PDFs.</p>
                            </td>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "-1px" }}>
                  <div
                    className="BtnV2 BtnV2--raised BtnV2--lg BtnV2--primary BtnV2--solid BtnV2--square BtnV2--fullwidth"
                    tabIndex="-1"
                    style={{ width: "100%" }}
                    onClick={(e) => this.addPdf()}
                  >
                    <span>Add PDF +</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <Modal
            isOpen={this.state.showModal}
            contentLabel="onRequestClose"
            onRequestClose={this.handleCloseModal}
            style={customStyle}
          >
            <div>
              <div className="EditPDF">
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    right: "30px",
                    zIndex: "10",
                  }}
                >
                  <div
                    className="BtnV2 BtnV2--primary"
                    tabIndex="-1"
                    onClick={(e) => this.backtoEditor()}
                  >
                    <span>Back to editor</span>
                  </div>
                </div>
                <div
                  style={{
                    margin: "0px auto -18px",
                  }}
                >
                  <h2 className="PaperType--h2">
                    {this.state.title ? this.state.title : "Untitled"}
                  </h2>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">File name </div>
                    <div className="FieldConfiguration__value">
                      <div className="FieldConfiguration__input">
                        <div
                          className="FormTagInput undefined"
                          style={{ position: "relative" }}
                        >
                          <div className="DraftEditor-root">
                            <div>
                              <div
                                aria-describedby="placeholder-7m9kt"
                                className="notranslate public-DraftEditor-content"
                                role="textbox"
                                spellCheck="false"
                                style={{
                                  outline: "none",
                                  userSelect: "text",
                                  whiteSpace: "pre-wrap",
                                  overfloWrap: "break-word",
                                }}
                              >
                                <div data-contents="true">
                                  <div
                                    className=""
                                    data-block="true"
                                    data-editor="7m9kt"
                                    data-offset-key="4pefi-0-0"
                                  >
                                    <div
                                      data-offset-key="4pefi-0-0"
                                      className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                                    >
                                      <span data-offset-key="4pefi-0-0">
                                        <span data-text="true">
                                          <input
                                            type="text"
                                            value={this.state.title}
                                            onChange={(e) =>
                                              this.setState({
                                                title: e.target.value,
                                              })
                                            }
                                            style={{ width: "100%" }}
                                          />
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">Theming </div>
                    <div className="FieldConfiguration__value">
                      <div
                        collapsed="Heading 1"
                        className="Paper Paper--padded Paper--clickable Paper--collapsable Paper--collapsed"
                        onClick={(e) => this.openStyle("Heading1Font")}
                      >
                        Heading 1
                        <div style={openTheme}>
                          <ThemeSettingsCustomPDF
                            headerType={this.state.pdfStyling[0].Heading1Font}
                            fontChange={(val, FontType, Weight) =>
                              this.ChangeFont(
                                val,
                                FontType,

                                Weight
                              )
                            }
                            fontSize={(value) => this.handleFontSize(value)}
                            lineHeight={(value) =>
                              this.handleLineHeightChange(value)
                            }
                            weightChange={(value) =>
                              this.handleWeightChange(value)
                            }
                            colorChange={(colorTwo, obj) =>
                              this.handleColorchange(colorTwo, obj)
                            }
                          />
                        </div>
                      </div>
                      <div
                        collapsed="Heading 2"
                        className="Paper Paper--padded Paper--clickable Paper--collapsable Paper--collapsed "
                        onClick={(e) => this.openStyle("Heading2Font")}
                      >
                        Heading 2
                        <div style={openTheme1}>
                          <ThemeSettingsCustomPDF
                            headerType={this.state.pdfStyling[1].Heading2Font}
                            fontChange={(val, FontType, Weight) =>
                              this.ChangeFont(
                                val,
                                FontType,

                                Weight
                              )
                            }
                            fontSize={(value) => this.handleFontSize(value)}
                            lineHeight={(value) =>
                              this.handleLineHeightChange(value)
                            }
                            weightChange={(value) =>
                              this.handleWeightChange(value)
                            }
                            colorChange={(colorTwo, obj) =>
                              this.handleColorchange(colorTwo, obj)
                            }
                          />
                        </div>
                      </div>
                      <div
                        collapsed="Paragraph"
                        className="Paper Paper--padded Paper--clickable Paper--collapsable Paper--collapsed"
                        onClick={(e) => this.openStyle("ParagraphFont")}
                      >
                        Paragraph
                        <div style={openTheme2}>
                          <ThemeSettingsCustomPDF
                            headerType={this.state.pdfStyling[2].ParagraphFont}
                            fontChange={(val, FontType, Weight) =>
                              this.ChangeFont(
                                val,
                                FontType,

                                Weight
                              )
                            }
                            fontSize={(value) => this.handleFontSize(value)}
                            lineHeight={(value) =>
                              this.handleLineHeightChange(value)
                            }
                            weightChange={(value) =>
                              this.handleWeightChange(value)
                            }
                            colorChange={(colorTwo, obj) =>
                              this.handleColorchange(colorTwo, obj)
                            }
                          />
                        </div>
                      </div>
                      <div
                        collapsed="Title"
                        className="Paper Paper--padded Paper--clickable Paper--collapsable Paper--collapsed"
                        onClick={(e) => this.openStyle("TitleFont")}
                      >
                        Title
                        <div style={openTheme3}>
                          <ThemeSettingsCustomPDF
                            headerType={this.state.pdfStyling[3].TitleFont}
                            fontChange={(val, FontType, Weight) =>
                              this.ChangeFont(
                                val,
                                FontType,

                                Weight
                              )
                            }
                            fontSize={(value) => this.handleFontSize(value)}
                            lineHeight={(value) =>
                              this.handleLineHeightChange(value)
                            }
                            weightChange={(value) =>
                              this.handleWeightChange(value)
                            }
                            colorChange={(colorTwo, obj) =>
                              this.handleColorchange(colorTwo, obj)
                            }
                          />
                        </div>
                      </div>
                      <div
                        collapsed="Answer"
                        className="Paper Paper--padded Paper--clickable Paper--collapsable Paper--collapsed"
                        onClick={(e) => this.openStyle("Answer")}
                      >
                        Answer
                        <div style={openTheme4}>
                          <ThemeSettingsCustomPDF
                            headerType={this.state.pdfStyling[4].Answer}
                            fontChange={(val, FontType, Weight) =>
                              this.ChangeFont(val, FontType, Weight)
                            }
                            fontSize={(value) => this.handleFontSize(value)}
                            lineHeight={(value) =>
                              this.handleLineHeightChange(value)
                            }
                            weightChange={(value) =>
                              this.handleWeightChange(value)
                            }
                            colorChange={(colorTwo, obj) =>
                              this.handleColorchange(colorTwo, obj)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="FieldConfigurationField ">
                    <div className="FieldConfiguration__label">
                      <span>
                        PDF Content                       
                        <button
                          onClick={this.htmltopdf}
                          className="BtnV2 BtnV2--primary BtnV2--sm BtnV2--solid pull-right"
                          style={{ height: "30px", padding: "0 20px" }}
                        >
                          <i
                            className="fas fa-download"
                            style={{ marginRight: "5px" }}
                          />
                          Download Sample
                        </button>                      
                      </span>
                    </div>
                    <div className="FieldConfiguration__value" />
                  </div>
                </div>
              </div>

              <div>
                <MegadraftEditor
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                  actions={customActions}
                  blockStyleFn={myBlockStyleFn}
                  plugins={[image, question]}
                />
              </div>
              <div ref={ref} id="pdf" style={{ width: "75%" }}>
                {content.blocks.map((formData) => (
                  <div>
                    <div className="col-md-12">
                      <p style={this.state.pdfStyling[2].ParagraphFont}>
                        {formData.text}
                      </p>
                    </div>

                    {Object.keys(formData.data).length > 0 && (
                      <div>
                        {formData.data.src && (
                          <div>
                            <img src={formData.data.src} alt="" />
                          </div>
                        )}
                        {formData.data.articles &&
                          formData.data.articles.map((val) => (
                            <div>
                              {val.selectedLayout.label === "List" && (
                                <div>
                                  {(val.selectedSummaryOption.label ===
                                    "Submissions Results-Public" ||
                                    val.selectedSummaryOption.label ===
                                      "Submissions Results-Private") && (
                                    <div>
                                      {this.state.submissionList.map((date) => (
                                        <div>
                                          <div className="col-md-12 mt-3">
                                            <p
                                              style={
                                                this.state.pdfStyling[3]
                                                  .TitleFont
                                              }
                                              className="font-weight-bold"
                                            >
                                              SubmissionAt
                                            </p>
                                          </div>
                                          <div className="col-md-12">
                                            <p
                                              style={
                                                this.state.pdfStyling[4].Answer
                                              }
                                            >
                                              {this.changeDateFormat(
                                                date.SubmittedAt
                                              )}
                                            </p>
                                          </div>
                                          {val.pdfData.length > 0 &&
                                            val.pdfData.map((data) => (
                                              <div>
                                                <div className="col-md-12 mt-3">
                                                  <p
                                                    style={
                                                      this.state.pdfStyling[3]
                                                        .TitleFont
                                                    }
                                                    className="font-weight-bold"
                                                  >
                                                    {data.title}
                                                  </p>
                                                </div>
                                                <div className="col-md-12 mt-3">
                                                  <p
                                                    style={
                                                      this.state.pdfStyling[4]
                                                        .Answer
                                                    }
                                                    className="font-weight-bold"
                                                  >
                                                    {data.value}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                          {val.selectedSummaryOption.label ===
                                            "Submissions Results-Private" && (
                                            <div>
                                              <div className="col-md-12 mt-3">
                                                <p
                                                  style={
                                                    this.state.pdfStyling[3]
                                                      .TitleFont
                                                  }
                                                  className="font-weight-bold"
                                                >
                                                  Submission ID
                                                </p>
                                              </div>
                                              <div className="col-md-12">
                                                <p
                                                  style={
                                                    this.state.pdfStyling[4]
                                                      .Answer
                                                  }
                                                >
                                                  {date.SubmissionId}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {val.selectedSummaryOption.label ===
                                    "Submissions Results-Custom" && (
                                    <div>
                                      {val.pdfData.length > 0 &&
                                        val.pdfData.map((data) => (
                                          <div>
                                            <div className="col-md-12 mt-3">
                                              <p
                                                style={
                                                  this.state.pdfStyling[3]
                                                    .TitleFont
                                                }
                                                className="font-weight-bold"
                                              >
                                                {data.title}
                                              </p>
                                            </div>
                                            {data.title === "Submitted At" && (
                                              <div>
                                                {this.state.submissionList.map(
                                                  (date) => (
                                                    <div className="col-md-12">
                                                      <p
                                                        style={
                                                          this.state
                                                            .pdfStyling[4]
                                                            .Answer
                                                        }
                                                      >
                                                        {this.changeDateFormat(
                                                          date.SubmittedAt
                                                        )}
                                                      </p>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                            {data.title === "Submission ID" && (
                                              <div>
                                                {this.state.submissionList.map(
                                                  (subID) => (
                                                    <div className="col-md-12">
                                                      <p
                                                        style={
                                                          this.state
                                                            .pdfStyling[4]
                                                            .Answer
                                                        }
                                                      >
                                                        {subID.SubmissionId}
                                                      </p>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                            {val.title === "Total Amount" && (
                                              <div className="col-md-12">
                                                <p
                                                  style={
                                                    this.state.pdfStyling[4]
                                                      .Answer
                                                  }
                                                >
                                                  0
                                                </p>
                                              </div>
                                            )}
                                            {val.title !== "Total Amount" &&
                                              val.title !== "Submission ID" &&
                                              val.title !== "Submitted At" && (
                                                <div className="col-md-12 mt-3">
                                                  <p
                                                    style={
                                                      this.state.pdfStyling[4]
                                                        .Answer
                                                    }
                                                    className="font-weight-bold"
                                                  >
                                                    {data.value}
                                                  </p>
                                                </div>
                                              )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              )}
                              {val.selectedLayout.label === "Table" && (
                                <div>
                                  {(val.selectedSummaryOption.label ===
                                    "Submissions Results-Public" ||
                                    val.selectedSummaryOption.label ===
                                      "Submissions Results-Private") && (
                                    <table
                                      className="ResultsTable"
                                      style={{ lineHeight: "normal" }}
                                    >
                                      {this.state.submissionList.map((date) => (
                                        <tbody>
                                          <tr>
                                            <td
                                              style={
                                                this.state.pdfStyling[3]
                                                  .TitleFont
                                              }
                                            >
                                              SubmissionAt
                                            </td>
                                            <td
                                              style={
                                                this.state.pdfStyling[4].Answer
                                              }
                                            >
                                              {" "}
                                              {this.changeDateFormat(
                                                date.SubmittedAt
                                              )}
                                            </td>
                                          </tr>
                                          {val.pdfData.length > 0 &&
                                            val.pdfData.map((data) => (
                                              <tr>
                                                {" "}
                                                <td
                                                  style={
                                                    this.state.pdfStyling[3]
                                                      .TitleFont
                                                  }
                                                >
                                                  {data.title}
                                                </td>
                                                <td
                                                  style={
                                                    this.state.pdfStyling[4]
                                                      .Answer
                                                  }
                                                >
                                                  {data.value}
                                                </td>
                                              </tr>
                                            ))}
                                          {val.selectedSummaryOption.label ===
                                            "Submissions Results-Private" && (
                                            <tr>
                                              <td
                                                style={
                                                  this.state.pdfStyling[3]
                                                    .TitleFont
                                                }
                                              >
                                                SubmissionID
                                              </td>
                                              <td
                                                style={
                                                  this.state.pdfStyling[4]
                                                    .Answer
                                                }
                                              >
                                                {date.SubmissionId}
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      ))}
                                    </table>
                                  )}
                                  {val.selectedSummaryOption.label ===
                                    "Submissions Results-Custom" && (
                                    <div>
                                      <table className="ResultsTable ">
                                        {val.pdfData.length > 0 &&
                                          val.pdfData.map((val) => (
                                            <tbody>
                                              {val.isChecked && (
                                                <tr>
                                                  <td
                                                    style={
                                                      this.state.pdfStyling[3]
                                                        .TitleFont
                                                    }
                                                  >
                                                    {val.title}
                                                  </td>
                                                  {val.title ===
                                                    "Submitted At" && (
                                                    <td
                                                      style={
                                                        this.state.pdfStyling[4]
                                                          .Answer
                                                      }
                                                    >
                                                      {this.state.submissionList.map(
                                                        (date) => (
                                                          <div>
                                                            {this.changeDateFormat(
                                                              date.SubmittedAt
                                                            )}
                                                          </div>
                                                        )
                                                      )}
                                                    </td>
                                                  )}
                                                  {val.title ===
                                                    "Submission ID" && (
                                                    <td
                                                      style={
                                                        this.state.pdfStyling[4]
                                                          .Answer
                                                      }
                                                    >
                                                      {this.state.submissionList.map(
                                                        (id) => (
                                                          <div>
                                                            {id.SubmissionId}
                                                          </div>
                                                        )
                                                      )}
                                                    </td>
                                                  )}
                                                  {val.title ===
                                                    "Total Amount" && (
                                                    <td
                                                      style={
                                                        this.state.pdfStyling[4]
                                                          .Answer
                                                      }
                                                    >
                                                      0
                                                    </td>
                                                  )}
                                                  {val.title !==
                                                    "Total Amount" &&
                                                    val.title !==
                                                      "Submission ID" &&
                                                    val.title !==
                                                      "Submitted At" && (
                                                      <td
                                                        style={
                                                          this.state
                                                            .pdfStyling[4]
                                                            .Answer
                                                        }
                                                      >
                                                        {val.value}
                                                      </td>
                                                    )}
                                                </tr>
                                              )}
                                            </tbody>
                                          ))}
                                      </table>
                                    </div>
                                  )}
                                </div>
                              )}
                              {val.selectedSummaryOption.label ===
                                "Receipt" && (
                                <div>
                                  {val.pdfData.map((data) => (
                                    <div
                                      style={this.state.pdfStyling[4].Answer}
                                    >
                                      {data.title}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default CustomPdf;

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
