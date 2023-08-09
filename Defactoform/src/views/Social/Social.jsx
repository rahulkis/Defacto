import React from "react";
import { GetData } from "../../stores/requests";
import {
  FORM_DETAILS_URLS,
  SUCCESS_N_REDIRECTS_PAGE_URLS,
} from "../../util/constants";

class Social extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        DetailTitle: "",
        DetailDescription: "",
        DetailCustomizeUrl: "",
        urlAvailablity: "",
      },
    };
    this.currentFormId = localStorage.CurrentFormId;
    this.sharingURL =`${window.location.origin.toString()}/preview/PreviewForm/` + localStorage.CurrentFormId
  }
  componentWillMount() {
    //this.getSocialInfo();
  }

  getSocialInfo = () => {
    const URL = FORM_DETAILS_URLS.GET_FORM_DETAILS_URL + this.currentFormId;
    try {
      GetData(URL).then((result) => {
        if (result.items) {
          // Bind result items with above defined state when customize URL works.
          // Also comment out this method in componentWillMount;
        }
      });
    } catch (error) {
      console.log(
        SUCCESS_N_REDIRECTS_PAGE_URLS.GET_ALL_SUCCESS_PAGES_URL,
        error
      );
    }
  };
  render() {
    return (
      <div>
        <form name="ViewForm">
          <div className="editor-page editor-page-wrapper">
            <div className="content-page">
              <div className="">
                <div className="row">
                  <div className="col-md-12 paper-double">
                    <h2 className="paper-Type">Share this form</h2>
                    <p className="p-0 font-14">
                      You can use the link below to share your form.
                    </p>
                    <textarea rows="1" className="social_Input">
                    {this.sharingURL}
                    </textarea>
                    <a
                      target="blank"
                      href={"http://www.facebook.com/sharer/sharer.php?u=" + this.sharingURL}
                      class="BtnV2 BtnV2--raised BtnV2--primary BtnV2--solid share share--fb"
                      tabindex="-1"
                    >
                      <span>Share to Facebook</span>
                    </a>
                    <a
                      target="blank"
                      href={"http://www.twitter.com/share?url="+ this.sharingURL + "&amp;text=Checkout%20my%20form%20on%20%40FormBuilderCo"}
                      class="BtnV2 BtnV2--raised BtnV2--primary BtnV2--solid share share--twitter"
                      tabindex="-1"
                    >
                      <span>Share to Twitter</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default Social;
