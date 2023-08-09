import React from "react";
import Intercom from "react-intercom";
export default class InterComIcon extends React.Component {
  render() {
    const user = {
      user_id: localStorage.getItem("loginUserInfo")
        ? JSON.parse(localStorage.getItem("loginUserInfo")).UserId
        : null,
      email: localStorage.getItem("loginUserInfo")
        ? JSON.parse(localStorage.getItem("loginUserInfo")).Email
        : null,
      name: localStorage.getItem("loginUserInfo")
        ? JSON.parse(localStorage.getItem("loginUserInfo")).Name
        : null,
    };

    return (
      <div>
        <Intercom appID="lr2ntnfq" {...user} />
      </div>
    );
  }
}
