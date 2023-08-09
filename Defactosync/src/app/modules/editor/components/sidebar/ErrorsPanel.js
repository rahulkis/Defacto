import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import ErrorIcon from "@material-ui/icons/Error";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";

import { changeDirection, setDarkTheme, setThemeColor } from "actions/index";

class ErrorsPanel extends React.Component {
  closeCustomizer = () => {
    this.setState({ drawerStatus: false, nodeDivId: "" });
  };

  constructor(props) {
    super(props);
    this.state = { drawerStatus: false };
  }

  componentDidMount() {
    document.body.classList.add(this.props.themeColor);
  }

  getSelectedDiv = (id) => {
    const nodeDiv = document.getElementById("nodeItem" + id);
    nodeDiv.scrollIntoView();
    document.getElementById("echo-wrapper").style.paddingTop="60px"
    this.props.onClose();
  };

  render() {
    // const { themeColor, darkTheme, isDirectionRTL,nodeError } = this.props;
    const { echoNodeError, allApps } = this.props;
    return (
      <div className="container-fluid">
        {echoNodeError.length <= 0 && (
          <div className=" text-center">
            <p>
              <CheckCircleRoundedIcon fontSize={"large"} />
            </p>
            <p className="font-weight-bold">Your Echo has no errors</p>
            <p>Turn on your Echo when you’re ready to start automating.</p>
          </div>
        )}

        {echoNodeError.length > 0 &&
          echoNodeError.map((data) => (
            <div>
              <div
                className="  alert  d-flex align-items-center border border-primary rounded "
                onClick={(e) => this.getSelectedDiv(data.id)}
                style={{ cursor: "pointer", padding: "8px" }}
              >
                {allApps
                  .filter((apps) => apps.cliName === data.selectedCLI)
                  .map((img) => (
                    <div>
                      <img
                        height="30"
                        width="30"
                        src={
                          APP_IMAGE_URL +
                          IMAGE_FOLDER.APP_IMAGES +
                          img.imageName
                        }
                        alt="syncImage"
                      ></img>
                      <span className="ml-2">{data.title}</span>
                    </div>
                  ))}
              </div>
              <div
                className="alert alert-danger d-flex align-items-center border border-danger rounded "
                onClick={(e) =>
                  this.getSelectedDiv(data.id)
                }
                style={{ cursor: "pointer", padding: "13px" }}
              >
                <ErrorIcon />
                {data.error}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

const mapStateToProps = ({ settings, nodeError, apps }) => {
  const { themeColor, darkTheme, isDirectionRTL } = settings;
  const { echoNodeError } = nodeError;
  const { allApps } = apps;
  return {
    themeColor,
    darkTheme,
    isDirectionRTL,
    echoNodeError,
    allApps,
  };
};

export default withRouter(
  connect(mapStateToProps, { setThemeColor, setDarkTheme, changeDirection })(
    ErrorsPanel
  )
);
