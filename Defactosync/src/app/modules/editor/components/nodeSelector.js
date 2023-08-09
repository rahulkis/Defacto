import React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import OfflineBoltIcon from "@material-ui/icons/OfflineBolt";
import AppsSharpIcon from "@material-ui/icons/AppsSharp";
import CircularProgress from '@material-ui/core/CircularProgress';


import { updateEchoData, onChangeNodeApp } from "actions/index";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";
import { customFilterApps } from "appUtility/commonFunction";
import EchoNode from "appUtility/models/EchoNode";

class TriggerSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: undefined,
      searchBox: false,
      searchText: "",
      isLoading: false,
    };
  }

  updateSearchText(evt) {
    this.setState({
      searchText: evt.target.value,
    });
  }

  randApp(data) {
    let appsArr = [];
    for (var i = 0; i < 10; i++) {
      const rand = data[Math.floor(Math.random() * 26)];
      appsArr.push(rand);
    }
    return appsArr;
  }

  onSelectApp(app) {
    this.setState({
      isLoading: true,
    });
    const { echoId, type, nodeIndex } = this.props;
    console.log(app);
    const formData = new EchoNode(
      nodeIndex,
      app.appName,
      type,
      app.cliName,
      null,
      echoId,
      false,
      "create"
    );
    this.props.onChangeNodeApp(formData);
  }

  render() {
    const { allApps, type } = this.props;
    const { isLoading } = this.state;

    const appsList = allApps.map((app,i) => {
      return {
        ...app,
        label: (
          <div>
            <img
              height="30"
              width="30"
              src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + app.imageName}
              alt="syncImage"
            ></img>
            <span className="ml-2">{app.appName}</span>
          </div>
        ),
        value: app.id,
      };
    });
    const randomAppsList = [...this.randApp(appsList)];
    return (
      <>
        <div className="trigger-action-selector-container" id="nodeSelectorDiv">
          <Card className={`shadow border-0`}>
            <CardHeader className="bg-primary text-white px-4 px-2">
              <div className="d-flex" style={{ height: "55px" }}>
                <OfflineBoltIcon className="selector-header-icon" />
                {type === "trigger" && (
                  <div className="px-2">
                    <h1 className="mb-1">Trigger</h1>
                    <p>A trigger is an event that starts your Echo</p>
                  </div>
                )}
                {type === "action" && (
                  <div className="px-2">
                    <h1 className="mb-1">Action</h1>
                    <p>An action is an event a Echo performs after it starts</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody className="p-3">
              <div className="bg-light p-3 selector-inner-wrapper">
                <div className="d-flex" style={{ height: "40px" }}>
                  <AppsSharpIcon className="selector-event-icon text-primary" />
                  <div className="px-2">
                    <h3 className="mb-1">App Event</h3>
                    <p>Start the Echo when something happens in an app</p>
                  </div>
                </div>
                {isLoading && (
                  <div className="loader-view  m-5">
                    <CircularProgress />
                  </div>
                )}
                {!isLoading && (
                  <div className="row">
                    <div className="col-md-9 my-3">
                      <Select
                        options={appsList}
                        isSearchable={true}
                        filterOption={customFilterApps}
                        placeholder={
                          <div>
                            <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                            &nbsp;Search Apps
                          </div>
                        }
                        onChange={(value) => this.onSelectApp(value)}
                      />
                    </div>
                    <div className="col-md-12  row mt-1 mx-auto random-apps-list">
                      {randomAppsList.length > 0 &&
                        randomAppsList.map((app,i) => (
                          <>
                            {app && (
                              <div key={i} className="col-md-6  my-2 ">
                                <Button
                                  variant="contained"
                                  className="jr-btn bg-white btn-block app-selector-btn"
                                  style={{ justifyContent: "flex-start" }}
                                  onClick={() => this.onSelectApp(app)}
                                >
                                  <div>{app.label}</div>
                                </Button>
                              </div>
                            )}
                          </>
                        ))}
                      <span className="text-light mt-4 text-center w-100">
                        …and over 15+ more 
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ echo, apps }) => {
  const { loader, selectedEcho, nodesList } = echo;
  const { allApps } = apps;
  return { loader, selectedEcho, allApps, nodesList };
};

export default connect(mapStateToProps, {
  updateEchoData,
  onChangeNodeApp,
})(TriggerSelector);
