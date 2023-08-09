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
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="url">URL</option>
              <option value="yesno">Yes/No</option>
              <option value="colorpicker"> Color Picker </option>
              <option value="number">Number</option>
              <option value="phonenumber">Phone Number</option>
              <option value="address">Address</option>
              <option value="appointment"> Appointment</option>
              <option value="country">Country</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="scale">Scale</option>
              <option value="multiplechoice">Multiple Choice</option>
              <option value="dropdown">Dropdown</option>
              <option value="imageupload">Image Upload</option>
              <option value="fileupload">File Upload</option>
              <option value="signature">Signature</option>
              <option value="price">Price</option>
              <option value="products">Products</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="calculation">Calculation</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
        {this.renderError(error)}
      </div>
    );
  }
}
