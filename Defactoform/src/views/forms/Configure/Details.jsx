import React from "react";
import "../../../../src/assets/custom/Category.css";
import { GetData, PostData, UpdateData } from "../../../stores/requests";
import {
  FORM_DETAILS_URLS,
  FORM_URLS,
  AWS_BUCKET,
} from "../../../util/constants";
import {
  UploadImage,
  b64toBlob,
  DeleteImage,
} from "../../../util/commonFunction";

class ConfigureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        DetailTitle: "",
        DetailDescription: "",
        DetailCustomizeUrl: "",
        urlAvailablity: "",
        DetailCoverImage: "",
      },
      fileName: "",
      saveBtnTxt: "Save",
    };
    this.currentFormId = localStorage.CurrentFormId;
    this.handleChange = this.handleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  goBack = (event) => {
    window.open("../user/PaymentIntegrations");
  };
  componentWillMount() {
    const URL = FORM_DETAILS_URLS.GET_FORM_DETAILS_URL + this.currentFormId;
    GetData(URL).then((data) => {
      if (data.Items.length > 0) {
        //sort updated values
        data.Items = []
          .concat(data.Items)
          .sort((a, b) => (a.CreatedAt < b.CreatedAt ? 1 : -1));

        if (data.Items[0].DetailCoverImage !== null) {
          data.Items[0].DetailCoverImage =
            AWS_BUCKET.COVERIMAGEURL + data.Items[0].DetailCoverImage;
        }
        this.setState({ formData: data.Items[0] });
      }
    });
  }
  componentWillUnmount() {
    //this.saveChanges();
  }
  _onChange = (e) => {
    var file = this.refs.file.files[0];
     if(file!==undefined){
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function(e) {
      this.setState({
        imgSrc: [reader.result],
        fileName: file.name,
      });
      this.setState((prevState) => {
        let formData = Object.assign({}, prevState.formData);
        formData.DetailCoverImage = [reader.result];
        return { formData };
      });
    }.bind(this);
    this.setState({ saveBtnTxt: "Save" });
  }
  };
  handleChange(event) {
    this.setState({ saveBtnTxt: "Save" });
    let newVal = event.target.value;
    this.setState((prevState) => {
      let formData = Object.assign({}, prevState.formData);
      formData.DetailTitle = newVal;
      return { formData };
    });
  }
  handleDescriptionChange(event) {
    this.setState({ saveBtnTxt: "Save" });
    let newVal = event.target.value;
    this.setState((prevState) => {
      let formData = Object.assign({}, prevState.formData);
      formData.DetailDescription = newVal;
      return { formData };
    });
  }
  handleURLChange(event) {
    this.setState({ saveBtnTxt: "Save" });
    let newVal = event.target.value;
    this.setState((prevState) => {
      let formData = Object.assign({}, prevState.formData);
      formData.DetailCustomizeUrl = newVal;
      return { formData };
    });
    this.checkUrlAvailability(newVal);
  }
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
  handleClick(e) {
    e.preventDefault();
    this.saveChanges();
  }

  uploadImageAWS = async () => {
    //delete the file from db
    if (this.currentFormId) {
      const fileURL =
        FORM_DETAILS_URLS.GET_FORM_DETAILS_URL + this.currentFormId;
      await GetData(fileURL).then(async (data) => {
        if (data.Items.length > 0) {
          data.Items = []
            .concat(data.Items)
            .sort((a, b) => (a.CreatedAt < b.CreatedAt ? 1 : -1));

          if (
            data.Items[0].DetailCoverImage !== null &&
            data.Items[0].DetailCoverImage !== ""
          ) {            
            if (
              !this.state.formData.DetailCoverImage.includes(AWS_BUCKET.HTTP)
            ) {
              await DeleteImage(
                data.Items[0].DetailCoverImage,
                AWS_BUCKET.COVERIMAGE
              );
            }
          }
        }
      });
    }
    let detailCoverImage = "";
    if (
      this.state.formData.DetailCoverImage !== null &&
      this.state.formData.DetailCoverImage !== ""
    ) {
      //if image saved in db skip uploading file to aws
      if (this.state.formData.DetailCoverImage.length > 1) {
        let binaryData = this.state.formData.DetailCoverImage;
        if (
          binaryData.includes(AWS_BUCKET.HTTP) &&
          binaryData.includes(AWS_BUCKET.COVERIMAGE)
        ) {
          detailCoverImage = binaryData.split("/")[4];
        }
      } else {
        //if image not saved in db
        detailCoverImage =
          this.state.fileName.split(".")[0] +
          "_" +
          Date.now().toString() +
          ".jpeg";
        let blob = b64toBlob(this.state.formData.DetailCoverImage[0]);
        let file = new File([blob], detailCoverImage, {
          type: "image/jpeg",
        });
        await UploadImage(file, AWS_BUCKET.COVERIMAGE);
      }
    }
    return detailCoverImage;
  };

  saveChanges = async () => {

    try {
      if (this.state.saveBtnTxt === "Saved") {
        return false;
      }
      this.btn.setAttribute("disabled", "disabled");
      let detailCoverImage = await this.uploadImageAWS();
      let currentDetailId = "";
      if (!this.state.formData.DetailID) {
        currentDetailId = this.makeid(6);
      } else {
        currentDetailId = this.state.formData.DetailID;
      }
      let formModel = {
        _CreatedAt: Date.now().toString(),
        get CreatedAt() {
          return this._CreatedAt;
        },
        set CreatedAt(value) {
          this._CreatedAt = value;
        },
        CreatedBy: "1",
        DetailCoverImage: detailCoverImage ? detailCoverImage : null,
        DetailCustomizeUrl: this.state.formData.DetailCustomizeUrl
          ? this.state.formData.DetailCustomizeUrl
          : null,
        DetailDescription: this.state.formData.DetailDescription
          ? this.state.formData.DetailDescription
          : null,
        DetailID: currentDetailId,
        DetailTitle: this.state.formData.DetailTitle
          ? this.state.formData.DetailTitle
          : null,
        FormId: this.currentFormId,
        UpdatedAt: Date.now().toString(),
        UpdatedBy: "1",
      };
      if (!this.state.formData.DetailID) {
        PostData(FORM_DETAILS_URLS.POST_FORM_DETAILS_URL, formModel).then(
          (result) => {
            console.log("Post Details:", result);
          }
        );
      } else {
        UpdateData(FORM_DETAILS_URLS.UPDATE_FORM_DETAILS_URL, formModel).then(
          (result) => {}
        );
      }
      let formObj = {
        FormId: this.currentFormId,
        FormName: this.state.formData.DetailTitle
          ? this.state.formData.DetailTitle
          : localStorage.formName,
        FormUrl: this.state.formData.DetailCustomizeUrl
          ? this.state.formData.DetailCustomizeUrl
          : this.currentFormId,
        CoverImage: detailCoverImage ? detailCoverImage : null,
        FromPage: "Details",
        UpdatedAt: Date.now().toString(),
      };
      UpdateData(FORM_URLS.UPDATE_FORM_URL, formObj).then((result) => {
        this.setState({ saveBtnTxt: "Saved" });
        this.btn.removeAttribute("disabled");
        if (this.state.formData.DetailTitle)
          localStorage.setItem("formName", this.state.formData.DetailTitle);
      });
      if (formModel.Content !== null) {
        //this.setState({ saveBtnTxt: "Saved" });
      }

    } catch (error) {
      alert("something went wrong while uploading file or data!")
    }
   
  };
  removeAnswer = () => {
    this.setState({ saveBtnTxt: "Save" });
    this.setState({
      imgSrc: "",
    });
    this.setState((prevState) => {
      let formData = Object.assign({}, prevState.formData);
      formData.DetailCoverImage = "";
      return { formData };
    });
  };
  checkUrlAvailability = (value) => {
    if (value) {
      GetData(FORM_DETAILS_URLS.CHECK_FORM_URL_AVALILABILITY + value).then(
        (result) => {
          if (result.data.Count === 0)
            this.setState({ urlAvailablity: "available" });
          else this.setState({ urlAvailablity: "taken" });
        }
      );
    } else {
      this.setState({ urlAvailablity: "" });
    }
  };
  render() {
    return (
      <div>
        <div>
          <form name="ViewForm">
            <div className="editor-page editor-page-wrapper">
              <div className="content-page">
                <div className="">
                  <div className="row">
                    <div className="col-md-6 paper-double">
                      <h2 className="paper-Type">Configure Details</h2>
                      <div className="field-configuration">
                        <div className="field-label field-label-title">
                          Title
                        </div>
                        <div className="fieldconfiguration-value">
                          <input
                            className="fieldconfiguration-input"
                            placeholder="What is the form called?"
                            value={this.state.formData.DetailTitle}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="field-configuration">
                        <div className="field-label field-label-title">
                          Description
                          <div className="field-configuration-i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>

                            <div className="field-configuration-description">
                              <div className="field-configuration-description-inner">
                                This description is used when sharing the form
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="fieldconfiguration-value">
                          <textarea
                            className="fieldconfiguration-input"
                            rows="5"
                            placeholder="What's a short description of the form?"
                            value={this.state.formData.DetailDescription}
                            onChange={this.handleDescriptionChange}
                          />
                        </div>
                      </div>
                      <div className="">
                        <div className="field-label field-label-title">
                          Cover image
                          <div className="field-configuration-i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="field-configuration-description">
                              <div className="field-configuration-description-inner">
                                This picture is used when sharing the image
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fieldconfiguration-value">
                        <div className="file">
                          <span className="spanImagePreview">
                            <input
                              ref="file"
                              type="file"
                              name="user[image]"
                              onChange={this._onChange}
                            />

                            <div className="file-label">Choose a file</div>
                            <div className="imgPreview">
                              {this.state.formData.DetailCoverImage && (
                                <img
                                  alt="..."
                                  src={this.state.formData.DetailCoverImage}
                                />
                              )}
                            </div>
                          </span>
                          {this.state.formData.DetailCoverImage && (
                            <span
                              className="btn-product remove-btn"
                              style={{ position: "relative", zIndex: "2" }}
                              onClick={() => this.removeAnswer()}
                            >
                              Remove Image
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="">
                        <div className="field-label field-label-title">
                          Customize URL
                          <div className="field-configuration-i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="field-configuration-description">
                              <div className="field-configuration-description-inner">
                                This picture is used when sharing the image
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fieldconfiguration-value">
                        <div className="input-group">
                          <input
                            className="fieldconfiguration-input flex1"
                            placeholder="my-url"
                            value={this.state.formData.DetailCustomizeUrl}
                            onChange={this.handleURLChange}
                          />
                          <div className="fieldconfiguration-label postfix flex2">
                            {" "}
                            .defactoform.co{" "}
                          </div>
                          {this.state.urlAvailablity && (
                            <button
                              className={
                                this.state.urlAvailablity === "available"
                                  ? "btn-url-availability blue-color"
                                  : "btn-url-availability red-color"
                              }
                            >
                              {this.state.urlAvailablity}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="details-preview">
                        <div
                          className="details-preview-image"
                          style={{
                            backgroundImage:
                              "url(" +
                              this.state.formData.DetailCoverImage +
                              ")",
                          }}
                        />
                        <div className="details-preview-title">
                          {" "}
                          {this.state.formData.DetailTitle}
                        </div>
                        <div className="details-preview-description">
                          {" "}
                          {this.state.formData.DetailDescription}
                        </div>
                        <a
                          className="details-preview-link"
                          href={
                            window.location.origin +
                            "/preview/previewform/" +
                            localStorage.CurrentFormId
                          }
                        >
                          {window.location.origin +
                            "/preview/previewform/" +
                            localStorage.CurrentFormId}
                        </a>
                      </div>

                      <button
                        id="detail-save"
                        ref={(btn) => {
                          this.btn = btn;
                        }}
                        onClick={this.handleClick}
                      >
                        {this.state.saveBtnTxt}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default ConfigureDetail;
