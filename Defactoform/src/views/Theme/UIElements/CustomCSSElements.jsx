import React from "react";
import "../../../assets/custom/ThemeSection.css";
import Switch from "@material-ui/core/Switch";

class CusromCSSElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customCSS:false
    }
  }
  render() {

    return (
      <div>
        <div className="UIElements-div">
         
            Custom CSS</div>
            <div className="FieldConfigurationField ">
            <div className="FieldConfiguration__label"> </div>
            <div className="FieldConfiguration__value">
            <div className="ZtOZviTTkcmz3-DO_OzgS">
            <div className="AdoKE9nnvZr4_zfgdeh5N">
            <p style={{margintop: "0px"}}>Custom CSS is an Agency only feature, <a target="blank" className="custom-css-anchor" href="/account/agency">upgrade to Agency</a> to continue.</p>
            <Switch
                checked={this.state.customCSS}
                value="customCSS"
                color="primary"
              />
            </div></div></div></div></div>
        
        );
    }
  }

export default CusromCSSElements;