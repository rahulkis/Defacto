import React from "react";
import ThemeSettings from "../Theme/ThemeSettings";
import Typography from "../Theme/TypoGraphy";
import UIElement from "../Theme/UIElement";
import Translations from "../Theme/Translations";
import "../../assets/custom/ThemeSection.css";
import { GetData } from "../../stores/requests";
import { store } from "../../index";
import { WEB_FONTS_KEYS } from "../../util/constants";

class ThemeParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render: "themesettings",
      activeSessionclass: "TabBar__tab TabBar__tab--active",
      InactiveSessionClass: "TabBar__tab",
      WebFonts: [],
    };
  }
  componentWillMount() {
    GetData(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=" + WEB_FONTS_KEYS.SECRETKEY
    ).then((result) => {
      if (result != null && result.items !== undefined) {
        this.setState({ WebFonts: result.items });
      }
    });
    this._renderSubComp();
  }

  _renderSubComp() {
    switch (this.state.render) {
      case "themesettings":
        return (
          <ThemeSettings
            ThemeInfo={store.getState().fetchthemeInfo.themeInfo}
          />
        );
      case "typography":
        return <Typography WebFonts={this.state.WebFonts} />;
      case "uielements":
        return <UIElement WebFonts={this.state.WebFonts} />;
      case "translations":
        return <Translations />;
      default:
        return (
          <ThemeSettings
            ThemeInfo={store.getState().fetchthemeInfo.themeInfo}
          />
        );
    }
  }
  changeHandler = (compName) => {
    this.setState({ render: compName });
  };
  handleBackButton = () => {
    this.props.closeModal(false);
  };
  render() {
    return (
      <div className="header-config">
        <div className="XKLhmDNloVln6001ip64E7e Theme-div-1">
          <div className="ZtOZviTTkcmz3-DO_OzgS">
            <div
              className="_2PLFUU9OgtbELWQz3snC0b"
              style={{ padding: "0px" }}
            />
            <div className="TabBar" style={{ marginBottom: "36px" }}>
              <div
                className={
                  this.state.render === "themesettings"
                    ? this.state.activeSessionclass
                    : this.state.InactiveSessionClass
                }
                onClick={(e) => this.changeHandler("themesettings")}
              >
                Theme Settings
              </div>
              <div
                className={
                  this.state.render === "typography"
                    ? this.state.activeSessionclass
                    : this.state.InactiveSessionClass
                }
                onClick={(e) => this.changeHandler("typography")}
              >
                Typography
              </div>
              <div
                className={
                  this.state.render === "uielements"
                    ? this.state.activeSessionclass
                    : this.state.InactiveSessionClass
                }
                onClick={(e) => this.changeHandler("uielements")}
              >
                UI Elements
              </div>
              <div
                className={
                  this.state.render === "translations"
                    ? this.state.activeSessionclass
                    : this.state.InactiveSessionClass
                }
                onClick={(e) => this.changeHandler("translations")}
              >
                Translations
              </div>
            </div>
            <div className="back-btn-alignment">
              <div className="back-div2-align">
                <div
                  className="BtnV2 BtnV2--raised BtnV2--primary"
                  tabIndex="-1"
                  style={{ height: "43px" }}
                  onClick={() => this.handleBackButton()}
                >
                  <span>Back to editor</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ZtOZviTTkcmz3-DO_OzgS Theme-Parent-div">
            {this._renderSubComp()}
          </div>
        </div>
      </div>
    );
  }
}
export default ThemeParent;
