import React from "react";

import PreviewForm from "./PreviewForm";

class ViewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewData: "" };
  }
  componentWillMount() {
    this.setState({ ViewData: JSON.parse(localStorage.formData) });
    //localStorage.removeItem("formData");
  }
  render() {
    return (
      <div>
        {/* <form name="ViewForm" className="full-preview-page preview_page_style">
          <div>{renderHTML(this.state.ViewData)}</div>
        </form> */}
        <PreviewForm formJSON={this.state.ViewData} />
      </div>
    );
  }
}
export default ViewForm;
