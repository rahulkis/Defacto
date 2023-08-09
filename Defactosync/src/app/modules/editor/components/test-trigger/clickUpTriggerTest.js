import React from "react";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import ReactJson from "react-json-view";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
    hideMessage,
    showAuthLoader,
    onSelectEcho,
    updateEchoData,
    loaderOnSelectEvent,
} from "actions/index";
import {
    APP_IMAGE_URL,
    IMAGE_FOLDER,
    CLICKUP_WEBHOOK_URLS,
} from "constants/AppConst";

class ClickUpTriggerTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: undefined,
            searchBox: false,
            searchText: "",
            mailNotification: false,
            userInfo: false,
            langSwitcher: false,
            appNotification: false,
            echoState: false,
            editEchoTitle: false,
            isTested: false,
            triggerTestInfo: [],
            isTestInfo: false,
        };
    }

    componentDidMount() {
        const item = this.props.selectedNode;
        if (item.isConnectionTested) {
            try {
                const body = {
                    eventType: item.selectedEvent.value,
                    cliType: item.selectedCLI,
                    nodeId: item.id,
                    commonInfo: item.commonInfo,
                    typeOf: item.typeOf,
                };
                this.props.loaderOnSelectEvent(true);
                httpClient
                    .post(CLICKUP_WEBHOOK_URLS.GET_RESPONSE_BY_NODE_ID, body)
                    .then((res) => {
                        if (res.data.statusCode === 200) {
                            this.setState({
                                triggerTestInfo: res.data.data.responseInfo,
                                isTested: true,
                            });
                        } else {
                            this.setState({
                                isTestInfo: false,
                                isTested: false,
                            });
                        }
                        this.props.loaderOnSelectEvent(false);
                    })
                    .catch((err) => {
                        this.props.loaderOnSelectEvent(false);
                        showErrorToaster(err);
                    });
            } catch (error) {
                this.props.loaderOnSelectEvent(false);
                showErrorToaster(error);
            }
        }
    }

    handleTestTrigger = () => {        
        const item = this.props.selectedNode;
        if (item) {
            const body = {
                eventType: item.selectedEvent.value,
                cliType: item.selectedCLI,
                commonInfo: item.commonInfo,
                nodeId: item.id
            };           
            this.props.loaderOnSelectEvent(true);           
            try {
                httpClient
                    .post(CLICKUP_WEBHOOK_URLS.GET_RESPONSE, body)
                    .then((res) => {                       
                        if (res.data.statusCode === 200) {
                            if (res.data.data.length !== 0) {
                                this.setState({
                                    triggerTestInfo: res.data.data.responseInfo,
                                    isTested: true,
                                });
                                this.props.onConnectionTested();
                            } else {
                                this.setState({
                                    isTestInfo: true,
                                    isTested: false,
                                });
                            }
                        } else {
                            this.setState({
                                isTestInfo: true,
                            });
                        }
                        this.props.loaderOnSelectEvent(false);
                    })
                    .catch((err) => {
                        this.props.loaderOnSelectEvent(false);
                        showErrorToaster(err);
                    });
            } catch (error) {
                this.props.loaderOnSelectEvent(false);
                showErrorToaster(error);
            }
        }
    };

    render() {
        const {
            selectedNode,
            nodesList,
            allApps,
            showEventLoader,
            activeStep,
        } = this.props;
        const { triggerTestInfo, isTested, isTestInfo } = this.state;
        const nodeItem = nodesList.find((node) => node.id === selectedNode.id);

        let selectedCLI = allApps.find(
            (app) => app.cliName === nodeItem.selectedCLI
        );

        return (
            <>
                {!nodeItem.isConnectionTested && !isTested && !isTestInfo && (
                    <div className="text-center">
                        <div className="d-flex justify-content-center">
                            <img
                                className="header-app-icon"
                                src={
                                    APP_IMAGE_URL +
                                    IMAGE_FOLDER.APP_IMAGES +
                                    selectedCLI.imageName
                                }
                                alt="syncImage"
                            />
                            <div alt="syncImage">
                                <ArrowForwardIcon
                                    color="primary"
                                    style={{
                                        fontSize: "45px",
                                        paddingTop: "10px",
                                        marginTop: "5px",
                                    }}
                                />
                            </div>
                            <div className="header-app-icon" alt="syncImage">
                                <SettingsIcon
                                    color="primary"
                                    style={{
                                        fontSize: "45px",
                                        paddingTop: "5px",
                                    }}
                                />
                            </div>
                        </div>

                        <h3 className="mt-2 font-weight-bold">Test your trigger</h3>
                        <div className="mt-2 info-text">
                            <p>
                                We'll find a recent message posted in your ClickUp account
                                <span className="app-account-name">
                                    <img
                                        src={
                                            APP_IMAGE_URL +
                                            IMAGE_FOLDER.APP_IMAGES +
                                            selectedCLI.imageName
                                        }
                                        alt="syncImage"
                                    />
                                    {nodeItem.meta.connectionName}
                                </span>{" "}
                                to confirm that the right account is connected and your trigger
                                is set up correctly.
                            </p>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleTestTrigger}
                                className="jr-btn test-trigger-btn"
                            >
                                Test Trigger
                            </Button>
                        </div>
                    </div>
                )}

                {isTested && (
                    <>
                        <h1>We found a message posted!</h1>
                        <h6>
                            This message posted was found in your
                            <span>
                                <img
                                    src={
                                        APP_IMAGE_URL +
                                        IMAGE_FOLDER.APP_IMAGES +
                                        selectedCLI.imageName
                                    }
                                    alt="syncImage"
                                    style={{ height: "15px", padding: "2px" }}
                                />
                                {nodeItem.meta.connectionName}
                            </span>{" "}
                            account.
                        </h6>

                        <div
                            className="mt-4 test-trigger-content"
                            style={{ maxHeight: "500px", overflow: "auto" }}
                        >
                            <ReactJson
                                src={triggerTestInfo}
                                displayDataTypes={false}
                                enableClipboard={false}
                                style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                }}
                            />
                        </div>
                    </>
                )}

                {isTestInfo && (
                    <div cl assName="mt-4 test-trigger-content">
                        <h4>No Information Found</h4>
                    </div>
                )}

                <div className="mt-3">
                    {showEventLoader && (
                        <div className=" m-3">
                            <LinearProgress color="primary" />
                        </div>
                    )}
                    <div>
                        <Button
                            disabled={activeStep === 0}
                            onClick={this.props.handleBack}
                            className="jr-btn"
                        >
                            Back
                        </Button>
                        <Button
                            disabled={isTestInfo || !isTested}
                            variant="contained"
                            color="primary"
                            onClick={this.props.handleNext}
                            className="jr-btn"
                        >
                            {activeStep === 3 ? "Finish" : "Next"}
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ echo, apps }) => {
    const { loader, selectedEcho, nodesList, showEventLoader } = echo;
    const { allApps } = apps;
    return { loader, selectedEcho, allApps, nodesList, showEventLoader };
};

export default connect(mapStateToProps, {
    hideMessage,
    showAuthLoader,
    updateEchoData,
    onSelectEcho,
    loaderOnSelectEvent,
})(ClickUpTriggerTest);
