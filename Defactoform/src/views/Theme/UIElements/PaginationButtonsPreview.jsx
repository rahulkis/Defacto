import React from "react";
import "../../../assets/custom/ThemeSection.css";

class PaginationButtonsPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toColorString = (colorObj) => {
    return `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, ${colorObj.a})`;
  };
  hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : null;
  }

  render() {
    let previewContent = null;
    if (this.props.paginationButtons.style === "numbers") {
      const buttonEls = ["1", "2", "3", "4", "5"].map((pageNum, index) => {
        if (pageNum !== 3) {
          return (
            <button
              className="btn-raised Pagination__btn Pagination__btn--numbers"
              key={"btnIndex" + index}
              style={{
                ...this.props.paginationButtons,
                fontFamily: this.props.paginationButtons.fontFamily,
                lineHeight: this.props.paginationButtons.lineHeight,
                fontWeight: this.props.paginationButtons.fontWeight,
                background: this.toColorString(this.props.btnBackgroundColor),
              }}
            >
              <span
                style={{ color: this.toColorString(this.props.btnFontColor) }}
              >
                {pageNum}
              </span>
            </button>
          );
        } else {
          return (
            <button
              className="btn-raised Pagination__btn Pagination__btn--numbers Pagination__pagebutton--active"
              key={"btnIndex" + index}
              style={{
                ...this.props.paginationButtons,
                fontFamily: this.props.paginationButtons.fontFamily,
                lineHeight: this.props.paginationButtons.lineHeight,
                fontWeight: this.props.paginationButtons.fontWeight,
                background: this.toColorString(this.props.btnFontColor),
              }}
            >
              <span
                style={{
                  color: this.toColorString(this.props.btnBackgroundColor),
                }}
              >
                {pageNum}
              </span>
            </button>
          );
        }
      });

      previewContent = <div className="Pagination__pages">{buttonEls}</div>;
    }

    if (this.props.paginationButtons.style === "progress") {
      previewContent = (
        <div className="Pagination__progress">
          <div
            className="Pagination__progresstrack"
            style={{
              width: "50%",
              background: this.toColorString(this.props.btnBackgroundColor),
            }}
          />
        </div>
      );
    }

    const previewContainer = (
      <div className="pagination">
        <button
          className="btn-raised Pagination__btn Pagination__btn--previous"
          style={{
            ...this.props.paginationButtons,
            lineHeight: this.props.paginationButtons.lineHeight,
            background: this.toColorString(this.props.btnBackgroundColor),
          }}
        >
          <i
            className="fa fa-arrow-left"
            style={{ color: this.toColorString(this.props.btnFontColor) }}
          />
        </button>
        {previewContent}
        <button
          className="btn-raised Pagination__btn Pagination__btn--next"
          style={{
            ...this.props.paginationButtons,
            lineHeight: this.props.paginationButtons.lineHeight,
            background: this.toColorString(this.props.btnBackgroundColor),
          }}
        >
          <i
            className="fa fa-arrow-right"
            style={{ color: this.toColorString(this.props.btnFontColor) }}
          />
        </button>
      </div>
    );
    return <div className="UIElements-div">{previewContainer}</div>;
  }
}

export default PaginationButtonsPreview;
