// "use strict";

import React from "react";
import reactCSS from "reactcss";
import { SwatchesPicker  } from "react-color";

class ColorPickerSwitches extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: "255",
      g: "18",
      b: "64",
      a: "100",
    },
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    if(color.rgb){
      this.setState({
        showError: false
      })
      this.setState({ color: color.rgb });
      if (this.props.from == "settings") {
        this.props.updateArticle("defaultVal", color.rgb);
        this.props.updateRuiredField("requiredQuestion", false);
      } else{
        this.props.handleChange(this.props.id, color.rgb)
      }
    } else {
      this.setState({
        showError: true
      })
    }
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${
            this.state.color.b
          }, ${this.state.color.a})`,
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>

        <label> Swatches  </label>

          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SwatchesPicker 
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}

        {/* add here  */}
        {this.props.from !== "Settings" && (
          <div className="field__error" id={"colopickerError" + this.props.id}>
            {this.state.errorTxt || ""}
          </div>
        )}
      </div>
    );
  }
}

export default ColorPickerSwitches;
