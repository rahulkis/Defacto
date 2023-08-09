import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import React from "react";
// import Tooltip from "rc-tooltip";
import Slider from "rc-slider";

class Scale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleOptions: props.scaleOptions
        ? props.scaleOptions
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      scaleLabelOption: props.scaleLabelOption
        ? props.scaleLabelOption
        : { 0: "1", 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: "10" },
      vertical: props.displayOptionVertically
        ? props.displayOptionVertically
        : false,
      defaultValue: props.defaultValue ? props.defaultValue : 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      scaleLabelOption: nextProps.scaleLabelOption
        ? nextProps.scaleLabelOption
        : this.state.scaleLabelOption,
      scaleOptions: nextProps.scaleOptions
        ? nextProps.scaleOptions
        : this.state.scaleOptions,
      defaultValue: nextProps.defaultValue ? nextProps.defaultValue : 0,
    });
  }
  onChangeSlider = (e) => {
    this.props.onChange(this.props.id, e);
  };

  render() {
    let max = this.state.scaleOptions.length;
    let defaultValue = this.state.scaleOptions.indexOf(
      Number(this.state.defaultValue)
    );

    const wrapperStyle = this.state.vertical
      ? { height: 400, margin: 50 }
      : { width: 500, margin: 50 };
    return (
      <div style={wrapperStyle}>
        <Slider
          onFocus={
            this.props.onFocus && (() => this.props.onFocus(this.props.id))
          }
          onBlur={this.props.onBlur && (() => this.props.onBlur(this.props.id))}
          key={this.state.defaultValue}
          min={0}
          max={max - 1}
          dots={true}
          included={true}
          pushable={false}
          marks={this.state.scaleLabelOption}
          vertical={this.state.vertical}
          defaultValue={defaultValue}
          onChange={this.onChangeSlider}
          trackStyle={{
            background: "none",
          }}
        />
      </div>
    );
  }
}

export default Scale;
