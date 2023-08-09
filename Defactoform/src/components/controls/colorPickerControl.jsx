// "use strict";

import React from "react";
import reactCSS from "reactcss";
import { SketchPicker, SwatchesPicker } from "react-color";

import _ from "lodash";

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      // color: {
      //   // r: "241",
      //   // g: "112",
      //   // b: "19",
      //   // a: "1",
      // },
      errorTxt: "This question is required",
      translatedData: {},
      showError: false,
      color: props.data && props.data.defaultVal ? props.data.defaultVal : {},
    };
    console.log(props);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.translationInfo &&
      Object.keys(nextProps.translationInfo).length &&
      Object.keys(nextProps.translationInfo).length !==
        Object.keys(this.state.translatedData).length
    ) {
      this.setState({
        translatedData: nextProps.translationInfo,
      });
      if (nextProps.translationInfo.questionrequired) {
        this.setState({
          errorTxt: nextProps.translationInfo.questionrequired,
        });
      }
    }
  }
  handleClick = () => {
    // this.setState( (state)=>{ displayColorPicker: !state.displayColorPicker });

    this.setState((state) => ({
      displayColorPicker: !state.displayColorPicker,
    }));
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };
  handleRemoveDefalt = () => {
    this.setState({ color: {}, displayColorPicker: false });
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
    // const defaultVal  =( this.props && this.props.data)? this.props.data.defaultVal:null
    const styles = reactCSS({
      default: {
        color: {
          width: "100%",
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
          width: "100%",
        },
        widthblock: {
          display: "inline-block",
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
      <>
        <div style={styles.swatch} onClick={this.handleClick}>
          <label>Default Answer</label>
          {_.isEmpty(this.state.color) ? (
            <div>Pick color</div>
          ) : (
            <div style={styles.color} />
          )}
        </div>
        {this.props.showRemoveButton ? (
          _.isEmpty(this.state.color) ? null : (
            <div style={styles.widthblock} onClick={this.handleRemoveDefalt}>
              {" "}
              Remove default color
            </div>
          )
        ) : null}

        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            {this.props &&
            this.props.data &&
            this.props.data.allowOnlySwitches ? (
              <SwatchesPicker
                color={this.state.color}
                onChange={this.handleChange}
              />
            ) : (
              <SketchPicker
                color={this.state.color}
                onChange={this.handleChange}
              />
            )}
          </div>
        ) : null}
        {this.props.from !== "Settings" && (
          <div className="field__error" id={"colopickerError" + this.props.id}>
            {this.state.errorTxt || ""}
          </div>
        )}
      </>
    );
  }
}

export default ColorPicker;
