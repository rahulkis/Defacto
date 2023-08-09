import React from "react";
import "../../assets/custom/ThemeSection.css";

class PaginationButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPages: null,
      pageNumbers: null,
      progressWidth: "0%",
    };
  }

  componentWillMount() {
    const pagesLength = this.props.breaks.length;
    let pages = [];
    for (let i = 1; i < pagesLength + 1; i++) {
      pages.push(i);
    }
    this.setState({
      totalPages: pagesLength,
      pageNumbers: pages,
    });
    this.getProgressBarWidth();
  }

  getProgressBarWidth() {
    const singlePagePercentage = 100 / this.props.breaks.length;
    const pageComleted = this.props.breaks.indexOf(this.props.index);
    const progress = singlePagePercentage * pageComleted + "%";
    this.setState({
      progressWidth: progress,
    });
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
    setTimeout(() => {
      const toggleView = document.querySelector(".Toggle-View");
      if (!toggleView) {
        let paginationEl = document.querySelector(".pagination");
        if (paginationEl) {
          paginationEl.style.position = "fixed";
          paginationEl.style.bottom = "30px";
        }
      }
    });
    let paginationContent = null;
    if (this.props.paginationButtons.style === "numbers") {
      const buttonEls = this.state.pageNumbers.map((pageNum, index) => {
        return (
          <div
            className={`btn-raised Pagination__btn Pagination__btn--numbers ${
              this.props.breaks[index] === this.props.index
                ? " Pagination__pagebutton--active"
                : ""
            }`}
            key={"btnIndex" + index}
            style={{
              ...this.props.paginationButtons,
              fontFamily: this.props.paginationButtons.fontFamily,
              lineHeight: this.props.paginationButtons.lineHeight,
              fontWeight: this.props.paginationButtons.fontWeight,
              pointerEvents: "auto",
              cursor: "pointer",
              background:
                this.props.breaks[index] === this.props.index
                  ? this.toColorString(this.props.paginationButtons.color)
                  : this.toColorString(this.props.paginationButtons.background),
            }}
            onClick={() =>
              this.props.breaks[index] === this.props.index
                ? ""
                : this.props.getContentByPage(
                    this.props.breaks[index],
                    this.props.breaks
                  )
            }
          >
            <span
              style={{
                color:
                  this.props.breaks[index] === this.props.index
                    ? this.toColorString(
                        this.props.paginationButtons.background
                      )
                    : this.toColorString(this.props.paginationButtons.color),
              }}
            >
              {pageNum}
            </span>
          </div>
        );
      });

      paginationContent = <div className="Pagination__pages">{buttonEls}</div>;
    }

    if (this.props.paginationButtons.style === "progress") {
      paginationContent = (
        <div className="Pagination__progress">
          <div
            className="Pagination__progresstrack"
            style={{
              width: this.state.progressWidth,
              background: this.toColorString(
                this.props.paginationButtons.background
              ),
            }}
          />
        </div>
      );
    }

    let previousButton = null;
    if (
      this.props.index !== this.props.initialValue ||
      this.props.index === this.props.endValue ||
      this.props.paginationButtons.style === "numbers" ||
      this.props.paginationButtons.style === "progress"
    ) {
      previousButton = (
        <div
          className="btn-raised Pagination__btn Pagination__btn--previous"
          style={{
            ...this.props.paginationButtons,
            lineHeight: this.props.paginationButtons.lineHeight,
            pointerEvents: "auto",
            cursor:
              this.props.index === this.props.initialValue
                ? "not-allowed"
                : "pointer",
            background: this.toColorString(
              this.props.paginationButtons.background
            ),
            borderTopRightRadius:
              this.props.index === this.props.endValue &&
              this.props.paginationButtons.style !== "numbers" &&
              this.props.paginationButtons.style !== "progress"
                ? "20px"
                : "0px",
            borderBottomRightRadius:
              this.props.index === this.props.endValue &&
              this.props.paginationButtons.style !== "numbers" &&
              this.props.paginationButtons.style !== "progress"
                ? "20px"
                : "0px",
          }}
          onClick={() =>
            this.props.index === this.props.initialValue
              ? ""
              : this.props.getPreviousContent()
          }
        >
          <i
            className="fa fa-arrow-left"
            style={{
              color: this.toColorString(this.props.paginationButtons.color),
            }}
          />
        </div>
      );
    }

    let nextButton = null;
    if (
      this.props.index !== this.props.endValue ||
      this.props.paginationButtons.style === "numbers" ||
      this.props.paginationButtons.style === "progress"
    ) {
      nextButton = (
        <div
          className="btn-raised Pagination__btn Pagination__btn--next"
          style={{
            ...this.props.paginationButtons,
            lineHeight: this.props.paginationButtons.lineHeight,
            pointerEvents: "auto",
            cursor:
              this.props.index === this.props.endValue
                ? "not-allowed"
                : "pointer",
            background: this.toColorString(
              this.props.paginationButtons.background
            ),
            borderTopLeftRadius:
              this.props.index === this.props.initialValue &&
              this.props.paginationButtons.style !== "numbers" &&
              this.props.paginationButtons.style !== "progress"
                ? "20px"
                : "0px",
            borderBottomLeftRadius:
              this.props.index === this.props.initialValue &&
              this.props.paginationButtons.style !== "numbers" &&
              this.props.paginationButtons.style !== "progress"
                ? "20px"
                : "0px",
          }}
          onClick={() =>
            this.props.index === this.props.endValue
              ? ""
              : this.props.getContent()
          }
        >
          <i
            className="fa fa-arrow-right"
            style={{
              color: this.toColorString(this.props.paginationButtons.color),
            }}
          />
        </div>
      );
    }
    const previewContainer = (
      <div className="pagination">
        {previousButton}
        {paginationContent}
        {nextButton}
      </div>
    );
    return <div className="UIElements-div">{previewContainer}</div>;
  }
}

export default PaginationButtons;
