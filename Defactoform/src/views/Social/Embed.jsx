import React from "react";
import "../../assets/custom/Embed.css";

class Embed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      InlineCode: this.InlineCodeFnc(
        localStorage.CurrentFormId,
        window.location.origin
      ),
      FullScreen: this.FullScreenFnc(
        localStorage.CurrentFormId,
        window.location.origin
      ),
      PopUpScreen: this.PopUpScreenFnc(
        localStorage.CurrentFormId,
        window.location.origin
      ),
      tipstrouble: this.tipstroubleFnc(
        localStorage.CurrentFormId,
        window.location.origin
      ),
    };
  }
  InlineCodeFnc = (e, url) => {
    url = url + "/__embed";
    return (
      '<div data-defactoform-id="' +
      e +
      "\"></div><script>(function(){ let script = document.createElement('script');script.src =\"" +
      url +
      '"; document.body.appendChild(script); })()</script>'
    );
  };
  FullScreenFnc = (e, url) => {
    url = url + "/__embed";
    return (
      '<div data-defactoform-id="' +
      e +
      '" data-takeover="1"></div><script>(function(){ let script = document.createElement(\'script\');script.src ="' +
      url +
      '"; document.body.appendChild(script); })()</script>'
    );
  };
  PopUpScreenFnc = (e, url) => {
    url = url + "/__embed";
    return (
      '<button data-defactoform-id="' +
      e +
      '" data-popup-button="1">Click me to show the form!</button><script>(function(){ let script = document.createElement(\'script\');script.src ="' +
      url +
      '"; document.body.appendChild(script); })()</script>'
    );
  };
  tipstroubleFnc = (e, url) => {
    url = url + "/__embed";
    return '<script.src ="' + url + '"></script>';
  };
  render() {
    return (
      <div>
        <div className="EditorPage">
          <div className="EditorPage__content EditorPage__content--embeds">
            <div className="Paper Paper--double-padded flex1 mb1">
              <div>
                <h2 className="PaperType--h2">Embed your form</h2>
                <p>
                  <small>
                    Just copy and paste the relevant code below to embed your
                    form on your site.
                  </small>
                </p>
                <div className="FieldConfigurationField ">
                  <div className="FieldConfiguration__label">Inline embed </div>
                  <div className="FieldConfigurationField__descriptionInline">
                    <svg
                      fill="currentColor"
                      preserveAspectRatio="xMidYMid meet"
                      height="1em"
                      width="1em"
                      viewBox="0 0 40 40"
                      style={{ verticalalign: "middle" }}
                    >
                      <g>
                        <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                      </g>
                    </svg>
                    <span className="FieldConfigurationField__descriptioninlineinner">
                      Use an inline embed any where you would like to insert the
                      form into an existing page.
                    </span>
                  </div>
                  <div className="FieldConfiguration__value">
                    <textarea
                      className="FieldConfiguration__input field_textarea"
                      columns="10"
                      value={this.state.InlineCode}
                    />
                  </div>
                </div>
                <div className="FieldConfigurationField ">
                  <div className="FieldConfiguration__label">
                    Full screen embed{" "}
                  </div>
                  <div className="FieldConfigurationField__descriptionInline">
                    <svg
                      fill="currentColor"
                      preserveAspectRatio="xMidYMid meet"
                      height="1em"
                      width="1em"
                      viewBox="0 0 40 40"
                      style={{ verticalalign: "middle;" }}
                    >
                      <g>
                        <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                      </g>
                    </svg>
                    <span className="FieldConfigurationField__descriptioninlineinner">
                      <span>
                        Use a full screen embed for the form to take over the
                        entire page. It will look just like it does on
                        Defactoform.
                        <strong>
                          This is currently incompatible with Squarespace sites.
                        </strong>
                      </span>
                    </span>
                  </div>
                  <div className="FieldConfiguration__value">
                    <textarea
                      className="FieldConfiguration__input field_textarea"
                      columns="10"
                      value={this.state.FullScreen}
                    />
                  </div>
                </div>
                <div className="FieldConfigurationField ">
                  <div className="FieldConfiguration__label">Popup </div>
                  <div className="FieldConfigurationField__descriptionInline">
                    <svg
                      fill="currentColor"
                      preserveAspectRatio="xMidYMid meet"
                      height="1em"
                      width="1em"
                      viewBox="0 0 40 40"
                      style={{ verticalalign: "middle;" }}
                    >
                      <g>
                        <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                      </g>
                    </svg>
                    <span className="FieldConfigurationField__descriptioninlineinner">
                      Use the popup to show the form embedded in a popup on any
                      of your pages when an element is clicked.
                    </span>
                  </div>
                  <div className="FieldConfiguration__value">
                    <textarea
                      className="FieldConfiguration__input field_textarea"
                      columns="10"
                      value={this.state.PopUpScreen}
                    />
                    <div className="Embed-div-align">
                      <small>
                        The important part of the popup script are the
                        attributes{" "}
                        <pre>
                          data-Defactoform-id="{localStorage.CurrentFormId}"
                        </pre>{" "}
                        and <pre>data-popup-button="1"</pre>. These two
                        attributes can be placed on any element to make that
                        element trigger a popup when that element is clicked, as
                        long as the Defactoform embed code is included on the
                        page.
                      </small>
                    </div>
                    <div className="Embed-div-align">
                      <small>
                        If you would like to programmatically trigger the popup,
                        you can do so by including the script, and calling the
                        public function{" "}
                        <pre>
                          Defactoform.popup('{localStorage.CurrentFormId}');
                        </pre>{" "}
                        in JavaScript.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="Paper Paper--double-padded flex1 mb1">
              <div>
                <h2 className="PaperType--h2">Tips &amp; Troubleshooting</h2>
                <div className="Embed-div-align">
                  <small>
                    If you would like to put more than one form on a page, you
                    only need to include the <pre>script</pre> part of the code
                    once, preferrably in the footer of the page. You could
                    alternatively reference the script directly like this.
                  </small>
                </div>
                <textarea
                  className="FieldConfiguration__input field_textarea"
                  columns="10"
                  value={this.state.tipstrouble}
                />
                <div className="Embed-div-align">
                  <small>
                    <a href="#" target="_blank">
                      See the docs
                    </a>{" "}
                    for fallback methods of embedding and helpful resources.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Embed;
