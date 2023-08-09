import React, { Component } from "react";
import Loader from "../../components/Common/Loader";
import { UpdateData } from "../../stores/requests";
import CryptoJS from "crypto-js";
import { ENCRYPTION_KEYS, USER_RELATED_URLS } from "../../util/constants";

class VerifyUser extends Component {
  state = {
    isLoader: false,
    confirm: false,
  };

  componentDidMount = () => {
    this.setState({ isLoader: true });
    const id = this.props.match.params.userId;
    let bytes = CryptoJS.AES.decrypt(id, ENCRYPTION_KEYS.SECRETKEY);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);

    let FormModel = {
      userId: originalText,
      isverified: true,
    };

    try {
      UpdateData(USER_RELATED_URLS.VERIFY_USER_EMAIL, FormModel).then(
        (result) => {
          if (result.statusCode === 200)
            this.setState({ confirm: true, isLoader: false });
        }
      );
    } catch (err) {
      alert("some error");
    }
  };

  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }
    return (
      <div>
        {!this.state.isLoader && this.state.confirm && (
          <div data-contents="true">
            <h1
              class="text-center"
              data-block="true"
              data-editor="68f1e"
              data-offset-key="ag6qs-0-0"
            >
              <div
                data-offset-key="ag6qs-0-0"
                class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
              >
                <span data-offset-key="ag6qs-0-0">
                  <span data-text="true">verified successfuly</span>
                </span>
              </div>
            </h1>
            <div
              class="text-center"
              data-block="true"
              data-editor="68f1e"
              data-offset-key="tysw2-0-0"
            >
              <div
                data-offset-key="tysw2-0-0"
                class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
              >
                <span data-offset-key="tysw2-0-0">
                  <span data-text="true">
                    Thanks! We have received your confirmaion.
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default VerifyUser;
