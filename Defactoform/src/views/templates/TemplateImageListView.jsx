import React from "react";
const ImageUrl = "/templateImage/";
class TemplateImageListView extends React.Component {
  showTemplateView = (e, Id) => {
    e.preventDefault();
    this.props.showTemplateView(Id);
  };
  render() {
    return (
      <a
        className="templates-module--templateWrapper"
        href="/templates/parental-consent"
        onClick={(e) =>
          this.showTemplateView(e, this.props.templateData.TemplateId)
        }
      >
        <div
          className="templates-module--template"
          style={{
            backgroundImage: `url(${ImageUrl +
              this.props.templateData.TemplateImage})`,
          }}
        />
        <div className="templates-module--tempateContent">
          <div>{this.props.templateData.TemplateName}</div>
          <div className="templates-module--templateDescription">
            {this.props.templateData.Description}
          </div>
        </div>
      </a>
    );
  }
}

export default TemplateImageListView;
