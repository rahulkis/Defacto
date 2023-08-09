import React, { Component } from "react";
// import FacebookLogin from 'react-facebook-login';
// import GoogleLogin from "react-google-login";
// import {PostData} from '../../services/PostData';
import { Redirect } from "react-router-dom";

import { GetData, PostData } from "../stores/requests";

import { v1 as uuidv1 } from "uuid";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: false,
      redirect: false,
    };
    this.signup = this.signup.bind(this);
  }

  signup(res, type) {
    let postData;
    if (type === "facebook" && res.email) {
      postData = {
        name: res.name,
        provider: type,
        email: res.email,
        provider_id: res.id,
        token: res.accessToken,
        provider_pic: res.picture.data.url,
      };
    }

    if (type === "google" && res.w3.U3) {
      postData = {
        name: res.w3.ig,
        provider: type,
        email: res.w3.U3,
        provider_id: res.El,
        token: res.Zi.access_token,
        provider_pic: res.w3.Paa,
      };
    }

    if (postData) {
      GetData(
        "https://e5oekwzo9k.execute-api.sa-east-1.amazonaws.com/dev/user/" +
          postData.email
      ).then((result) => {
        let responseJson = result;
        if (responseJson.Item === undefined) {
          postData.id = uuidv1();
          PostData(
            "https://e5oekwzo9k.execute-api.sa-east-1.amazonaws.com/dev/user",
            postData
          );
          this.setState({ redirect: true });
        } else {
          sessionStorage.setItem("userData", JSON.stringify(responseJson));
          this.setState({ redirect: true });
        }
      });
    }
  }

  render() {
    if (this.state.redirect || sessionStorage.getItem("userData")) {
      return <Redirect to={"/dashboard"} />;
    }

    return (
      <div className="row body">
        <div className="medium-12 columns">
          <div className="medium-12 columns">
            {/* <h2 id="welcomeText" /> */}
            <Redirect to={"/auth/Login"} />
            {/* 
            <GoogleLogin
              clientId="800857083368-bquvla6auk0anjl8g0n7i0aivcjga16r.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            /> */}
          </div>
        </div>
      </div>
    );
  }
}
export default Welcome;
