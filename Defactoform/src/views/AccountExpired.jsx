import React from "react";

export default class AccoundExpired extends React.Component {
  render() {
    return (
      <div class="main-container">
        <section
          class="text-center height-100 parallax"
          style={{ minHeight: "100vh", backgroundColor: "#FFF" }}
        >
          <div class="container pos-vertical-center">
            <div class="row">
              <div class="col-sm-12">
                <img
                  alt=""
                  src={require("assets/img/apple-icon.png")}
                  height="75px"
                  style={{ marginBottom: "16px", marginTop: "200px" }}
                />

                <p
                  style={{
                    fontSize: " 18px",
                    fontWeight: "400",
                  }}
                >
                  It looks like this form doesn't exist any more. Make your own
                  forms fast with <a href="/dasboard">Defactoform</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
