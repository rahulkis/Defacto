import React from "react";
import BackgroundElements from "../Theme/UIElements/BackgroundElements";
import QuestionElements from "../Theme/UIElements/QuestionElements";
import SubmitButtonElements from "../Theme/UIElements/SubmitButtonElements";
import PaginationButtonElements from "../Theme/UIElements/PaginationButtonElements";
import CustomCSSElements from "../Theme/UIElements/CustomCSSElements";
import "../../assets/custom/ThemeSection.css";

class UIElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render: "backgroundelements",
      headerType: "background",
      uiElementMenuList: [
        {
          label: "Background",
          value: "background",
          clickvalue: "backgroundelements",
        },
        {
          label: "Questions",
          value: "questions",
          clickvalue: "questionelements",
        },
        {
          label: "Submit Button",
          value: "submitbutton",
          clickvalue: "submitbuttonelements",
        },
        {
          label: "Pagination Buttons",
          value: "paginationbuttons",
          clickvalue: "paginationbuttonelements",
        },
        {
          label: "Custom CSS",
          value: "customcss",
          clickvalue: "customcsselements",
        },
      ],
    };
  }

  componentWillMount() {
    this._renderSubComp();
  }

  _renderSubComp() {
    switch (this.state.render) {
      case "backgroundelements":
        return <BackgroundElements />;
      case "questionelements":
        return <QuestionElements />;
      case "submitbuttonelements":
        return <SubmitButtonElements WebFonts={this.props.WebFonts} />;
      case "paginationbuttonelements":
        return <PaginationButtonElements WebFonts={this.props.WebFonts} />;
      case "customcsselements":
        return <CustomCSSElements />;
      default:
        return <BackgroundElements />;
    }
  }

  changeMenuHandle = (compName, val) => {
    this.setState({ render: compName });

    if (this.state.headerType === val) {
      this.setState({ headerType: null });
    } else {
      this.setState({ headerType: val });
    }
  };

  render() {
    return (
      <div className="row" style={{ width: "100%" }}>
        <div
          className="column"
          style={{ maxWidth: "33%", minWidth: "33%", padding: "35px" }}
        >
          <div className="Paper">
            <div>
              <div>
                <div>
                  <div>
                    <div
                      className="Paper Paper--padded"
                      style={{ borderRadius: "0px" }}
                    >
                      <div>
                        <h2
                          className="PaperType--h2"
                          style={{ margin: "18px 18px 0px" }}
                        >
                          UI Elements
                        </h2>
                      </div>
                    </div>
                    {this.state.uiElementMenuList.map((typ, key) => (
                      <div
                        className={
                          this.state.headerType === typ.value
                            ? "Paper Paper--padded Paper--active Paper--clickable"
                            : "Paper Paper--padded  Paper--clickable"
                        }
                        key={"UiElement" + typ.value}
                        onClick={(e) =>
                          this.changeMenuHandle(typ.clickvalue, typ.value)
                        }
                      >
                        <div>
                          <span>
                            {typ.label}
                            <span style={{ opacity: "0.5" }}> {typ.font}</span>

                            <i
                              className="tim-icons icon-minimal-right"
                              style={{ opacity: "0.5", float: "right" }}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "calc(36px - 0.5em)",
            maxWidth: "66%",
            minWidth: "67%",
            padding: "35px",
          }}
          className="_2PLFUU9OgtbELWQz3snC0b column"
        >
          <div
            className="Paper Paper--padded Paper--double-padded-x"
            style={{ marginBottom: "18px" }}
          >
            <div>{this._renderSubComp()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default UIElement;
