import React from "react";
import "../../../assets/custom/ThemeSection.css";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import Loader from "../../../components/Common/Loader";
import { fetchthemeInfo } from "../../../actions";
import { store } from "../../../index";
import { PostData, GetData } from "../../../stores/requests";
import { THEME_URLS, AWS_BUCKET } from "../../../util/constants";
import {
  UploadImage,
  b64toBlob,
  DeleteImage,
} from "../../../util/commonFunction";
class BackgroundElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: true,
      selectedBackgroundFile: "",
      selectedFileName: null,
      displayBackgroundColorPicker: false,
      backgroundColor: { r: "255", g: "255", b: "255", a: "1" },
      SelectedThemeTypoGraphyFontInfo: [],
      SelectedThemeTypoGraphyListInfo: [],
      SelectedThemeSettingsInfo: [],
      SelectedThemeUISettingsInfo: [],
      currentUserId: null
    };
  }

  componentWillMount = async () => {
    await this.getSelectedThemeInfo();
  };
  // Get Theme from store
  getSelectedThemeInfo = async () => {
    console.log("getselectedtheme Info");
    let result = store.getState().fetchthemeInfo.themeInfo;
    if (result && result.length > 0) {
      let resultItems = result[0];
      if (
        resultItems.BackgroundFile !== null &&
        resultItems.BackgroundFile !== "" &&
        !resultItems.BackgroundFile.includes(AWS_BUCKET.HTTP)
      ) {
        resultItems.BackgroundFile =
          AWS_BUCKET.THEMEIMAGEURL + resultItems.BackgroundFile;
      }

      const userData = localStorage.getItem("loginUserInfo");
      if (userData) {
        const uData = JSON.parse(userData);
        this.setState({          
          currentUserId: uData.UserId
        })
      }


      // Set Value in Edit Case
      this.setState({
        isLoader: false,       
        SelectedThemeUISettingsInfo: resultItems.UIElement,
        SelectedThemeSettingsInfo: resultItems.ThemeSettings,
        SelectedThemeTypoGraphyFontInfo: resultItems.TypoGraphyFont,
        SelectedThemeTypoGraphyListInfo: resultItems.TypoGraphyList,
        SelectedBackgroundColor:
          resultItems.BackgroundColor || this.state.backgroundColor,
        selectedBackgroundFile:
          resultItems.BackgroundFile === "" ? "" : resultItems.BackgroundFile,
        selectedFileName: resultItems.BackgroundFile
          ? resultItems.BackgroundFile
          : null,
      });
    } else {
      this.setState({ isLoader: false });
    }
  };

  _onChange = (e) => {
    var  file = this.refs.file.files[0];
    if(file!==undefined){
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(e) {
      this.setState({
        selectedBackgroundFile: [reader.result],
        selectedFileName:
          file.name.split(".")[0] + "_" + Date.now().toString() + ".jpeg",
      });
      this.setState((prevState) => {
        let formData = Object.assign({}, prevState.formData);
        formData.DetailCoverImage = [reader.result];
        return { formData };
      });
    }.bind(this);
  }
  };
  removeAnswer = () => {
    this.setState({
      selectedBackgroundFile: "",
      selectedFileName: "",
    });
    this.setState((prevState) => {
      let formData = Object.assign({}, prevState.formData);
      formData.DetailCoverImage = "";
      return { formData };
    });
  };
  handleClick = () => {
    this.setState({
      displayBackgroundColorPicker: !this.state.displayBackgroundColorPicker,
    });
  };

  handleClose = () => {
    this.setState({ displayBackgroundColorPicker: false });
  };

  handleChange = (e) => {
    this.setState({ SelectedBackgroundColor: e.rgb });
  };

  componentWillUpdate() {
    let arrTheme = [];
    setTimeout(() => {
      let formModel = {
        FormId: localStorage.CurrentFormId,
        CreatedAt: Date.now(),
        CreatedBy: this.state.currentUserId,
        BackgroundColor: this.state.SelectedBackgroundColor,
        BackgroundFile: this.state.selectedFileName,
        TypoGraphyFont: this.state.SelectedThemeTypoGraphyFontInfo,
        TypoGraphyList: this.state.SelectedThemeTypoGraphyListInfo,
        ThemeSettings: this.state.SelectedThemeSettingsInfo,
        UIElement: this.state.SelectedThemeUISettingsInfo,
      };

      arrTheme.push(formModel);
      store.dispatch(fetchthemeInfo(arrTheme));
    }, 100);
  }

  componentWillUnmount() {
    this.saveChanges();
  }

  deleteAwsFile = async () => {
    // delete file from aws
    if (localStorage.CurrentFormId) {
      await GetData(
        THEME_URLS.GET_THEME_INFO_BY_FORMID + localStorage.CurrentFormId
      ).then(async (result) => {
        if (result !== null && result.Items.length > 0) {
          if (
            result.Items[0].BackgroundFile !== null &&
            result.Items[0].BackgroundFile !== ""
          ) {
            if (result.Items[0].BackgroundFile.includes(AWS_BUCKET.HTTP)) {
              result.Items[0].BackgroundFile = result.Items[0].BackgroundFile.split(
                "/"
              )[4];
            }

            if (!this.state.selectedBackgroundFile.includes(AWS_BUCKET.HTTP)) {
              await DeleteImage(
                result.Items[0].BackgroundFile,
                AWS_BUCKET.THEMEIMAGE
              );
            }
          }
        }
      });
    }
  };

  saveChanges = async () => {
    try {
      //delete file from Aws
      await this.deleteAwsFile();

      //upload filr to aws
      let backgroungImage = null;
      if (
        this.state.selectedBackgroundFile !== null &&
        this.state.selectedBackgroundFile !== ""
      ) {
        //if image saved in db skip uploading file to aws
        if (this.state.selectedBackgroundFile.length > 1) {
          let binaryData = this.state.selectedBackgroundFile;
          if (
            binaryData.includes(AWS_BUCKET.HTTP) &&
            binaryData.includes(AWS_BUCKET.THEMEIMAGE)
          ) {
            backgroungImage = binaryData.split("/")[4];
          }
        } else {
          //if image not saved in db
          backgroungImage = this.state.selectedFileName;
          let blob = b64toBlob(this.state.selectedBackgroundFile[0]);
          let file = new File([blob], backgroungImage, {
            type: "image/jpeg",
          });
          await UploadImage(file, AWS_BUCKET.THEMEIMAGE);
        }
      }

      // Create form model for post request.
      let formModel = {
        FormId: localStorage.CurrentFormId,
        CreatedAt: Date.now(),
        CreatedBy: this.state.currentUserId,
        BackgroundColor: this.state.SelectedBackgroundColor,
        BackgroundFile: backgroungImage ? backgroungImage : null,
        TypoGraphyFont: this.state.SelectedThemeTypoGraphyFontInfo,
        TypoGraphyList: this.state.SelectedThemeTypoGraphyListInfo,
        ThemeSettings: this.state.SelectedThemeSettingsInfo,
        UIElement: this.state.SelectedThemeUISettingsInfo,
      };

      try {
        PostData(THEME_URLS.ADD_THEME_INFO, formModel).then((result) => {
          if (result.statusCode === 200) {
            console.log("values saved successfully");
          }
        });
      } catch (err) {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      alert("something went wrong while uploading file or saving data!");
    }
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    const styles = reactCSS({
      default: {
        BackgroundColor: {
          width: "710px",
          height: "44px",
          borderRadius: "2px",
          background: `rgba(${this.state.SelectedBackgroundColor.r}, ${
            this.state.SelectedBackgroundColor.g
          }, ${this.state.SelectedBackgroundColor.b}, ${
            this.state.SelectedBackgroundColor.a
          })`,
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });
    return (
      <div>
        <div className="UIElements-div">Background</div>
        <div className="FieldConfigurationField ">
          <div className="FieldConfiguration__label">Background Image </div>
          <div className="fieldconfiguration-value">
            <div className="file">
              <span className="spanImagePreview">
                <input
                  ref="file"
                  type="file"
                  name="user[image]"
                  accept="image/*"
                  onChange={this._onChange}
                />

                <div className="file-label">Choose a file</div>
                <div className="imgPreview">
                  {this.state.selectedBackgroundFile && (
                    <img
                      alt="No Image uploaded"
                      src={this.state.selectedBackgroundFile}
                    />
                  )}
                </div>
              </span>
              {this.state.selectedBackgroundFile && (
                <span
                  className="btn-product remove-btn"
                  style={{ position: "relative", zIndex: "2" }}
                  onClick={() => this.removeAnswer()}
                >
                  Remove File
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="FieldConfigurationField ">
          <div className="FieldConfiguration__label">Background Color </div>
          <div className="FieldConfiguration__value">
            <div />
            <div style={styles.swatch} onClick={(e) => this.handleClick()}>
              <div style={styles.BackgroundColor} />
            </div>
            {this.state.displayBackgroundColorPicker ? (
              <div style={styles.popover}>
                <div style={styles.cover} onClick={(e) => this.handleClose()} />
                <SketchPicker
                  color={this.state.backgroundColor}
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundElements;
