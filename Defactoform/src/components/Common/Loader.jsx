import React from "react";

class Loader extends React.Component {
  render() {
    return (
      <div className="content">
        <div className="loader " />
      </div>
    );
  }
}
Loader.defaultProps = {
  message: "Loading...",
};
export default Loader;
