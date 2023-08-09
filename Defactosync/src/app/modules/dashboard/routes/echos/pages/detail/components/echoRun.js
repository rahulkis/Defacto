
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import Widget from "components/Widget/index";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CircularProgress from "@material-ui/core/CircularProgress";
import InfoIcon from "@material-ui/icons/Info";
import InData from "./inData";
import OutData from "./outData";
import { ECHO_URLS } from "constants/AppConst";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

import {
  APP_IMAGE_URL,
  IMAGE_FOLDER
} from "constants/AppConst";

function TabContainer({ children, dir }) {
  return (
    <div dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class EchoRun extends React.Component {
  constructor(prop) {
    super();
    this.state = { isLoading: false, value: 0, echo: null, nodes: [] };
  }

  componentDidMount() {
    let id=this.props.selectedEcho.id;
    console.log("id...",id)
   if(id){
    this.getRunEchos(id);
   } 
  }

  getRunEchos = (id) => {
    this.setState({ isLoading: true })
    try {
      httpClient
        .get(ECHO_URLS.GET_RUN_ECHOS + id)
        .then((res) => {
          if (res.data.statusCode === 200) {
            if (res.data.data.nodes.length > 1 && res.data.data.nodes.find((node) => node.sortIndex === 2).actionResponse.length > 0) {
              this.setState({
                echo: res.data.data.echo,
                nodes: res.data.data.nodes,
                isLoading: false
              })
            } else {
              this.setState({
                isLoading: false
              })
            }

          }
        })
        .catch((err) => {
          this.setState({ isLoading: false })
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({ isLoading: false })
      showErrorToaster(error);
    }
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { theme } = this.props;
    const { echo, nodes, isLoading } = this.state;


    nodes.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });


    return (
      <>
        {!isLoading && echo !== null && (
          <>
            <div className="row">
              <div className="col-md-6">
                <Link className="mr-2" to="/app/history/usage"><ArrowBackIcon /></Link> <span className="ml-2" style={{ fontSize: "18px", fontWeight: "700" }}>Echoes runs</span>
                <div className="m-2">
                  <CheckCircleIcon style={{ fill: "rgb(98, 212, 147)" }} /> <span className="ml-2" style={{ fontSize: "24px" }}>Success</span>
                </div>

                {echo !== null && (
                  <div>
                    <span className="ml-2" style={{ fontSize: "32px", fontWeight: "700" }}>{echo.title}</span><span>
                      <Tooltip title="View Echo Details" placement="bottom">
                        <Link to={"/app/echos/" + echo.id}>
                          <InfoIcon style={{ fill: "gray" }} className="ml-3" />
                        </Link>
                      </Tooltip>
                    </span>
                  </div>
                )}

              </div>
              <div className="col-md-2"></div>
              {echo !== null && (
                <div className="col-md-4" style={{ marginTop: "40px", fontSize: "18px", color: "rgb(153, 153, 153)" }}>RUN ID:{echo.id}</div>
              )}

            </div>

            {echo !== null && (
              <>
                <div className="ml-2 mt-3">
                  {moment.unix(echo.updatedAt).format("LL")}
                </div>
                <div className="ml-2">
                  This Echo run used the UTC timezone - <Link to={"/app/echos/" + echo.id}>Edit Echo Settings</Link>
                </div>
              </>
            )}


            {nodes && nodes.length > 0 && (
              nodes.map((node) => (
                <div className="card">
                  <div className="card-header">
                    <img
                      height="30"
                      width="30"
                      className="echo-connection-icon"
                      src={`${APP_IMAGE_URL}${IMAGE_FOLDER.APP_IMAGES}${node.selectedCLI.toLowerCase()}.png`}
                      alt="img"
                    ></img>
                    <CheckCircleIcon style={{ fill: "rgb(98, 212, 147)", paddingTop: "8px" }} /><span style={{ fontSize: "20px", fontWeight: "700" }}>
                      {node.sortIndex}.{node.title}
                    </span>
                    <div style={{ marginLeft: "65px" }}>{moment.unix(echo.updatedAt).format("LLL")} - <Link to={"/editor/setup/" + echo.id}>Edit This Step</Link></div>
                  </div>

                  <div className="card-body">
                    <Widget className="jr-card-full jr-card-tabs-right jr-card-profile">
                      <div className="jr-tabs-classic">
                        <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="scrollable"
                          scrollButtons="on"
                        >
                          <Tab className="tabs" label="DataIn" />
                          {node.typeOf === "action" && (
                            <Tab className="tabs" label="DataOut" />
                          )}

                        </Tabs>
                        <div className="jr-tabs-content jr-task-list">
                          <div className="row">
                            <div className="col-md-12">
                              <SwipeableViews
                                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                              >
                                <TabContainer dir={theme.direction} style={{ padding: "0px" }}>
                                  {this.state.value === 0 && <InData data={node.fields} />}
                                </TabContainer>
                                {node.typeOf === "action" && (
                                  <TabContainer dir={theme.direction}>

                                    {this.state.value === 1 && <OutData actionResponse={node.actionResponse} />}
                                  </TabContainer>)}
                              </SwipeableViews>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Widget>

                  </div>
                </div>
              ))
            )}
          </>
        )}

        {isLoading && (
          <div id="profileLoader" className="loader-view">
            <CircularProgress />
          </div>
        )}

        {!isLoading && echo === null && (
          <h4 style={{ marginLeft: "580px" }}>No Result Found</h4>
        )}
      </>

    );
  }
}
EchoRun.propTypes = {
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = ({ echo }) => {
  const { selectedEcho } = echo;
  return { selectedEcho };
};

export default withStyles(null, { withTheme: true })(
  connect(mapStateToProps, null)(
    EchoRun
  )
);



