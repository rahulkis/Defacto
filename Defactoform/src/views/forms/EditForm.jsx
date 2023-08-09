import React from "react";
import CreateForms from "./CreateForms";
import { saveEditorData, savePageType } from "../../actions";
import { FORM_URLS ,AWS_BUCKET} from "../../util/constants";
import { GetData } from "../../stores/requests";
import { store } from "../../index";
import Loader from "../../components/Common/Loader";

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: true,
      editorState: "",
      EditForm: localStorage.EditForm ? localStorage.EditForm : "true",
      formContent: [],
      existedImages: [],
    };
  }
  componentWillMount() {
    try {
      GetData(FORM_URLS.GET_FORM_BY_ID_URL + localStorage.FormId).then(
        async (result) => {
          if (result && result.Item) {
            localStorage.setItem(
              "EditFormData",
              JSON.stringify(result.Item.Content)
            );
            var content = "";
            var editorStateImg = "";
            var imageContent = new Map();

            if (result.Item.FormImages) {
              this.setState({
                existedImages: result.Item.FormImages.split(","),
              });
              let images = result.Item.FormImages.split(",");

              images.map(async (image) => {
                imageContent.set(
                  image,
                  AWS_BUCKET.IMAGEURL +
                    image
                );
              });

              content = JSON.parse(result.Item.Content);
              editorStateImg = JSON.parse(result.Item.EditorState);
              for (var image of imageContent) {
                //append image to content
                content.map((value) => {
                  if (value.key === image[0].split("_")[0]) {
                    value.src = image[1];
                  }
                });
                //append image to editorstate
                editorStateImg.blocks.map((element) => {
                  if (element.key === image[0].split("_")[0]) {
                    element.data.src = image[1];
                  }
                });
              }
            } else {
              content = JSON.parse(result.Item.Content);
              editorStateImg = JSON.parse(result.Item.EditorState);
            }
            //localStorage.setItem("EditFormData", JSON.stringify(content));
            this.setState({
              editorState: JSON.stringify(editorStateImg),
              EditForm: localStorage.EditForm,
              FormData: result.Item,
            });
            store.dispatch(saveEditorData(JSON.stringify(editorStateImg)));
          }
          if (localStorage.EditForm !== "true") {
            localStorage.setItem("formPageType", "add");
            localStorage.setItem("formName", result.Item.FormName + " (copy)");
            this.setState({ formContent: JSON.stringify(content) });
          } else {
            store.dispatch(savePageType("edit"));
            localStorage.setItem("formPageType", "edit");
            localStorage.setItem("formName", result.Item.FormName);
          }
          this.setState({ isLoader: false });
        }
      );
    } catch (error) {
      alert("Something went wrong, please try again.");
      this.props.history.push("/dashboard");
    }

    // if (localStorage.EditForm != true) {
    //   //this.setState({ formContent: localStorage.EditFormData.Content });
    // }
  }
  componentWillUnmount() {
    //   localStorage.removeItem("EditorState");
    //   localStorage.removeItem("EditFormData");
    //   localStorage.removeItem("FormId");
    //   localStorage.removeItem("UpdatedFormName");
    //   localStorage.removeItem("EditForm");
  }
  componentDidMount() {}
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <CreateForms
        editorState={this.state.editorState}
        splitPreviewMode={this.props.splitPreviewMode}
        FormData={this.state.FormData}
        formContent={this.state.formContent}
        EditForm={this.state.EditForm}
        ExistedImages={this.state.existedImages}
      />
    );
  }
}
export default EditForm;
