import React, { Component } from "react";
// import classNames from "classnames";

export default class BlockSelectOptions extends Component {
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

  render() {
    let { value, error, styles, ...props } = this.props;
    styles = styles || {};

    // let className = classNames({
    //   block__input: true,
    //   "block__input--empty": !value,
    //   "block__input--error": error,
    //   [`block__input--${styles.padding}-padding`]: styles.padding,
    //   [`block__input--${styles.text}-text`]: styles.text
    // });

    return (
      <div className="block__input__row">
        <div className="block__input__wrapper">
          <div>
            <select value={value} {...props}>
              <option value="Submissions Results-Public">
                Submissions Results-Public
              </option>
              <option value="Submissions Results-Private">
                Submissions Results-Private
              </option>
              <option value="Submissions Results-Custom">
                Submissions Results-Custom
              </option>
              <option value="Receipt">Receipt</option>
            </select>
          </div>
        </div>
        {this.renderError(error)}
      </div>
    );
  }
}
