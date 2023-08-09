import React, { Component } from "react";
import classNames from "classnames";

import $ from "jquery";

export default class BlockInput extends Component {
  renderError(error) {
    if (!error) {
      return;
    }
    return <div className="block__input__error-text">{error}</div>;
  }

  _handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  componentDidMount() {}

  render() {
    $('input[type="text"]').css({
      paddingRight: "0px",
      display: "initial",
      marginRight: "0px",
    });

    let { value, error, styles, ...props } = this.props;
    styles = styles || {};
    let className = classNames({
      block__input: true,
      "block__input--empty": !value,
      "block__input--error": error,
      [`block__input--${styles.padding}-padding`]: styles.padding,
      [`block__input--${styles.text}-text`]: styles.text,
      [`block__input--${styles.required}`]: styles.required,
    });

    return (
      <div className="block__input__row">
        <div className="block__input__wrapper" style={{ display: "block" }}>
          <div
            style={{
              textAlign: "left",
              width: "100%",
              display: "inline-block",
            }}
          >
            <input
              {...props}
              value={value}
              type="text"
              style={{
                maxWidth:
                  (this.props.value.length === 0
                    ? "50"
                    : this.props.value.length + 1) + "ch",
                minWidth: "5ch",
              }}
              className={className}
              onDrop={this._handleDrop}
              size={
                this.props.value.length > 0 ? this.props.value.length + 1 : 50
              }
            />
            {styles.text === "big" &&
              styles.required &&
              this.props.value.length > 0 && (
                <span className="required-input-icon">*</span>
              )}
            {/* <icons.EditIcon className="block__input__icon" /> */}
          </div>
        </div>
        {this.renderError(error)}
      </div>
    );
  }
}
