import React from "react";
import { withRouter } from "react-router";
import moment from "moment";
import Menubar from "./menubar";
import SettingsIcon from "@material-ui/icons/Settings";
import Tooltip from "@material-ui/core/Tooltip";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowRightTwoToneIcon from "@material-ui/icons/ArrowRightTwoTone";
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import Avatar from "@material-ui/core/Avatar";
import LabelIcon from '@material-ui/icons/Label';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import {
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  ECHO_RAN_MESSAGE,
  TASK_AUTOMATED_MESSAGE
} from "constants/AppConst";

class TaskUsage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null, open: false, userName: ''

    };
  }

  componentDidMount() {
    this.getUser();
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getUser = () => {
    let nameString = localStorage.getItem('login_user') ? JSON.parse(localStorage.getItem('login_user')) : '';
    if (nameString) {
      var fullName = nameString.fullName.split(' ');
      var initials = fullName.length > 1 ? fullName.shift().charAt(0) + fullName.pop().charAt(0) : fullName.shift().charAt(0);
      this.setState({ userName: initials.toUpperCase() })
    }
  }


  openEditor = (echo) => {
    this.props.history.push("/editor/setup/" + echo.id)
  }

  vIewEchoRun=(echo)=>{
    this.props.history.push("/app/history/" + echo.id)
  }

  viewDetail = (echo) => {
    this.props.history.push("/app/echos/" + echo.id)
  }

  renderConnectionIcons(nodesList) {
    const sortedNodes = nodesList;
    return (
      <div style={{ display: "flex", alignItems: "center", marginTop: "3px" }}>
        {sortedNodes.length > 0 && (
          <>
            <img
              className="echo-connection-icon"
              height="30"
              width="30"
              src={`${APP_IMAGE_URL}${IMAGE_FOLDER.APP_IMAGES
                }${sortedNodes[0].selectedCLI.toLowerCase()}.png`}
              alt="img"
            ></img>
            <ArrowRightTwoToneIcon />
            {sortedNodes.length > 2 && (
              <div className="echo-connection-icon">
                {sortedNodes.length - 2}
              </div>
            )}
            {sortedNodes.length === 1 && (
              <SettingsIcon className="echo-connection-icon" />
            )}
            {sortedNodes.length > 2 && <ArrowRightTwoToneIcon />}
            {sortedNodes.length >= 2 && (
              <img
                height="30"
                width="30"
                className="echo-connection-icon"
                src={`${APP_IMAGE_URL}${IMAGE_FOLDER.APP_IMAGES}${sortedNodes[
                  sortedNodes.length - 1
                ].selectedCLI.toLowerCase()}.png`}
                alt="img"
              ></img>
            )}
          </>
        )}
        {sortedNodes.length === 0 && (
          <>
            <SettingsIcon className="echo-connection-icon" />
            <ArrowRightTwoToneIcon />{" "}
            <SettingsIcon className="echo-connection-icon" />
          </>
        )}
      </div>
    );
  }



  render() {
    const { userName } = this.state;
    const { taskEchoes} = this.props;

    let echoes = taskEchoes;

    const automatedTasks = echoes.map((echo) => {
      return echo.tasks
    }).reduce((a, b) => a + b, 0)    
    return (
      <div className="apps-detail-body task-history">
        <div className="row">
          <div className="col-md-6">
            <div className="card ">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-1">
                    < OfflineBoltIcon style={{ fill: "rgb(204 204 204)", fontSize: "40px", marginTop: "5px" }} />
                  </div>
                  <div className="col-md-8" style={{ fontSize: "20px" }}>
                    <div>Echos that ran</div>
                    <div style={{ fontWeight: "800" }}>{echoes.length}</div>
                  </div>
                  <div className="col-md-1" style={{ position: "absolute", right: "0px", top: "0px" }}>
                    <Tooltip title={ECHO_RAN_MESSAGE} placement="bottom-end">
                      < HelpOutlineIcon style={{ fill: "#639AEF" }} />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card ">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-1">
                    < CheckCircleIcon style={{ fill: "rgb(204 204 204)", fontSize: "40px", marginTop: "5px" }} />
                  </div>
                  <div className="col-md-8" style={{ fontSize: "20px" }}>
                    <div>Tasks automated</div>
                    <div style={{ fontWeight: "800" }}>{automatedTasks}</div>
                  </div>
                  <div className="col-md-1" style={{ position: "absolute", right: "0px", top: "0px" }}>
                    <Tooltip title={TASK_AUTOMATED_MESSAGE} placement="bottom-end">
                      < HelpOutlineIcon style={{ fill: "#639AEF" }} />
                    </Tooltip>
                  </div>
                </div>
              </div></div>
          </div>
        </div>


        <div className="row mt-4">
          <div className="heading mb-4 col-md-2"></div>
          <div className="heading mb-4 col-md-5" style={{ paddingLeft: "66px" }}
          >Echo Details</div>
          <div className="heading mb-4 col-md-3">
            Tasks Used
          </div>
        </div>
        <div>
          {echoes && echoes.length > 0 ?
            (
              <>
                {echoes.map((echo) => (
                  <div className="card ">
                    <div className="card-body">
                      <div className="row" >
                        <div className="col-md-2">
                          {this.renderConnectionIcons(echo.nodes)}
                        </div>
                        <div className="col-md-5"><h2>{echo.title}</h2>
                          <span className="h5 text-uppercase">{echo.state}</span><span className="ml-2 h5">-Last run</span>{" "}
                          {moment.unix(echo.lastLiveAt).format("LLL")}</div>
                        <div className="col-md-1 d-flex justify-content-center" style={{ marginLeft: "20px", padding: "20px" }}>
                          <LabelIcon style={{ fill: "green" }} /> <span className="ml-2" style={{ fontSize: "17px" }} >{echo.tasks}</span>
                        </div>

                        <div className="col-md-2 " style={{ padding: "15px" }}>
                          <Avatar className="float-right ">{userName}</Avatar>

                        </div>
                        <div className="col-md-1" style={{ padding: "12px", marginLeft: "60px" }}>
                          <div className="ml-auto">
                            <Menubar
                              vIewEchoRun={this.vIewEchoRun}
                              openEditor={this.openEditor}
                              viewDetail={this.viewDetail}
                              echo={echo}
                            />

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}

              </>
            ) : (
              <>

                <div className="card ">
                  <div className="card-body">
                    <div className="row justify-content-center">
                      No Task History
                    </div>
                  </div>
                </div>

              </>
            )}
        </div>
      </div>
    );
  }
}
export default withRouter(TaskUsage);

