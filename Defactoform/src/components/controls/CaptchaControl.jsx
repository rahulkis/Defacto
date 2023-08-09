import React from "react";

class CaptchaControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = { captchaStaticValue: "" };
  }
  componentDidMount() {
    this.createCaptcha("captchaN");
  }
  render() {
    return (
      <div className="field-input field-space">
        <div className="">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div id="captchaN" />
            <span
              onClick={(e) => this.createCaptcha("captchaN")}
              title="referesh"
            >
              <i className="fa fa-sync-alt" style={{ marginleft: "10px" }} />
            </span>
          </div>
        </div>
        <div className="col-md-12 live-field-textarea">
          <input
            type="text"
            autoComplete="off"
            placeholder="Enter Captcha"
            onChange={(e) => this.CaptchaValue(e)}
            id="cpatchaTextBox2"
          />

          <br />
        </div>
      </div>
    );
  }

  CaptchaValue = (e) => {
    this.props.CaptchaValue(e.target.value, this.state.captchaStaticValue);
  };
  createCaptcha = (captchaID) => {
    //clear the contents of captcha div first
    if (captchaID != null && captchaID !== undefined) {
      document.getElementById(captchaID).innerHTML = "";

      let charsArray =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
      let lengthOtp = 6;
      let captcha = [];
      for (let i = 0; i < lengthOtp; i++) {
        //below code will not allow Repetition of Characters
        let index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
        if (captcha.indexOf(charsArray[index]) === -1)
          captcha.push(charsArray[index]);
        else i--;
      }
      let canv = document.createElement("canvas");
      canv.id = "captcha";
      canv.width = 100;
      canv.height = 50;
      let ctx = canv.getContext("2d");
      ctx.font = "25px Georgia";
      ctx.strokeText(captcha.join(""), 0, 30);
      this.setState({ captchaStaticValue: captcha.join("") });
      //storing captcha so that can validate you can save it somewhere else according to your specific requirements
      document.getElementById(captchaID).appendChild(canv); // adds the canvas to the body element
    }
  };
}

export default CaptchaControl;
