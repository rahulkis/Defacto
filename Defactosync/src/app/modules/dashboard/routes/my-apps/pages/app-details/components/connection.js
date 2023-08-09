import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import { CONNECTIONS_URLS } from "constants/AppConst";
import { ToastsStore } from "react-toasts";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import RenameConnection from "./renameConnection";
import Menubar from "./menubar";
import AlertDialog from "components/Dialogs/AlertDialog";
import TransferOwnership from "./transferOwnership";
import { CLITYPENAME } from "constants/CliTypes";
import Apps from "components/AppIntegrations/Apps";
import {
  deleteClickSendWebhook,
  deleteGoogleDriveWebhook,
  deleteGoogleCalendarWebhook,
  deleteZohoCrmWebhook,
  deleteKeapWebhook,
  deleteMailerShakeWebhook,
  deleteHelpScoutWebhook,
  deleteTrelloWebhook,
  deleteFreshDeskWebhook,
  deleteDripWebhook,
  deleteCampaignMonitorWebhook,
  deleteZenDeskWebhook,
  deleteActiveCampaignWebhook,
  deleteMailerLiteWebhook,
  deleteGoToWebinarWebhook,
  deleteMailChimpWebhook,
  deleteGmailWebhook,
  deleteConvertKitWebhook,
  deleteSendinBlueWebhook,
  deleteTelegramWebhook,
  deleteGetResponseWebhook,
  deleteClickUpWebhook,
  deleteCalendlyWebhook,
  deleteDocuSignWebhook,
  deleteSwellWebhook,
  deleteBombBombWebhook,
  deletePandaDocWebhook
} from "./deleteConnections";

import { fetchAllConnections, updateSelectedConnection } from "actions/index";

class Connection extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      renameConnectionModal: false,
      deleteConnectionModal: false,
      transferOwnershipModal: false,
      anchorEl: undefined,
      menuState: false,
      connectionId: "",
      selectedApp: "",
      selectedCLI: "",
      selectedAPI: "",
      openModal: false,
      isLoading: false,
      isRedirect: false,
      connectionInfo: "",
    };
  }

  componentDidMount() {
    const { cliType } = this.props;
    this.props.fetchAllConnections(cliType);
  }

  handleRequestConnectionClose = () => {
    this.setState({
      selectedApp: "",
      selectedCLI: "",
    });
    if (this.state.openModal) {
      this.setState({ openModal: false });
    }

    //this.props.closedialog();
  };

  handleSuccessRedirection = (cliType) => {
    this.setState({ isRedirect: true, selectedCLI: cliType });
  };

  handleIsLoadingRequest = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  handleReconnectConnection = (value) => {
    console.log("value", value);
    this.setState({
      connectionInfo: value,
      connectionId: value.id,
      openModal: true,
      selectedAPI: CLITYPENAME[value.cliType],
      selectedApp: value.cliType
        .replace("CLI", "")
        .replace(/ /g, "")
        .toLowerCase(),
      selectedCLI: value.cliType,
    });
  };

  onConnectionOptionSelect = (event) => {
    this.setState({ menuState: true, anchorEl: event.currentTarget });
  };
  handleRequestClose = () => {
    this.setState({ menuState: false });
  };

  onRenameConnection = (connection) => {
    this.props.updateSelectedConnection(connection);
    this.setState({ renameEchoModal: true });
  };

  onDeleteConnection = (connection) => {
    this.props.updateSelectedConnection(connection);
    this.setState({
      deleteConnectionModal: true,
    });
  };

  onTransferOwnership = (connection) => {
    this.setState({
      transferOwnershipModal: true,
      //selectedConnection: connection,
    });
  };

  onTransferOwnershipClose = () => {
    this.setState({ transferOwnershipModal: false });
  };

  onSaveTransferOwnership = (data) => { };

  onRenameModalClose = () => {
    this.setState({ renameEchoModal: false });
  };

  onDeleteConnectionClose = () => {
    this.setState({ deleteConnectionModal: false });
  };

  onDeleteConnectionConfirm = () => {
    const { connectionsList, selectedConnection } = this.props;
    const connectionCount = connectionsList.filter(
      (connectionItem) => connectionItem.email === selectedConnection.email
    );

    //if last connection delete webhook
    if (connectionCount.length === 1) {
      switch (selectedConnection.cliType) {
        case "ClicksendCLI":
          deleteClickSendWebhook(selectedConnection);
          break;
        case "ZohoCLI":
          deleteZohoCrmWebhook(selectedConnection);
          break;
        case "KeapCLI":
          deleteKeapWebhook(selectedConnection);
          break;
        case "FreshdeskCLI":
          deleteFreshDeskWebhook(selectedConnection);
          break;
        case "DripCLI":
          deleteDripWebhook(selectedConnection);
          break;
        case "MailshakeCLI":
          deleteMailerShakeWebhook(selectedConnection);
          break;
        case "HelpscoutCLI":
          deleteHelpScoutWebhook(selectedConnection);
          break;
        case "TrelloCLI":
          deleteTrelloWebhook(selectedConnection);
          break;
        case "GoogleDriveCLI":
          deleteGoogleDriveWebhook(selectedConnection);
          break;
        case "GoogleCalendarCLI":
          deleteGoogleCalendarWebhook(selectedConnection);
          break;
        case "CampaignMonitorCLI":
          deleteCampaignMonitorWebhook(selectedConnection);
          break;
        case "ZendeskCLI":
          deleteZenDeskWebhook(selectedConnection);
          break;
        case "ActiveCampaignCLI":
          deleteActiveCampaignWebhook(selectedConnection);
          break;
        case "MailerliteCLI":
          deleteMailerLiteWebhook(selectedConnection);
          break;
        case "GoToWebinarCLI":
          deleteGoToWebinarWebhook(selectedConnection);
          break;
        case "MailchimpCLI":
          deleteMailChimpWebhook(selectedConnection);
          break;
        case "GmailCLI":
          deleteGmailWebhook(selectedConnection);
          break;
        case "ConvertkitCLI":
          deleteConvertKitWebhook(selectedConnection);
          break;
        case "SendInBlueCLI":
          deleteSendinBlueWebhook(selectedConnection);
          break;
        case "TelegramCLI":
          deleteTelegramWebhook(selectedConnection);
          break;
        case "GetResponseCLI":
          deleteGetResponseWebhook(selectedConnection);
          break;
        case "CalendlyCLI":
          deleteCalendlyWebhook(selectedConnection);
          break;
        case "ClickUpCLI":
          deleteClickUpWebhook(selectedConnection);
          break;
        case "DocuSignCLI":
          deleteDocuSignWebhook(selectedConnection);
          break;
        case "SwellCLI":
          deleteSwellWebhook(selectedConnection);
          break;
        case "BombBombCLI": 
          deleteBombBombWebhook(selectedConnection);
          break;
        case "PandaDocCLI": 
        deletePandaDocWebhook(selectedConnection);
        break;
      }
    }

    try {
      let body = {
        connectionId: selectedConnection.id,
        echoIds: selectedConnection.echoes,
        cliType: selectedConnection.cliType,
      };
      httpClient
        .post(CONNECTIONS_URLS.DELETE_CONNECTION, body)
        .then((res) => {
          if (res.status === 200) {
            const {
              cliType,
              fetchAllConnections,
              updateSelectedConnection,
            } = this.props;
            fetchAllConnections(cliType);
            updateSelectedConnection("");
            ToastsStore.success("Deleted Successfully");
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  };

  render() {
    const {
      connectionsList,
      cliType,
      selectedConnection,
      handleChangeIndex,
    } = this.props;
    const {
      renameEchoModal,
      deleteConnectionModal,
      transferOwnershipModal,
      selectedApp,
      selectedCLI,
      selectedAPI,
      isRedirect,
      connectionId,
      isLoading,
      connectionInfo,
    } = this.state;

    if (isRedirect && selectedCLI) {
      return <Redirect to={"/app/connections/cli/" + selectedCLI} />;
    }
    let loader = this.props.loader;
    if (isLoading) {
      loader = isLoading;
    }
    if (connectionsList && connectionsList.length) {
      connectionsList.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
    }
    console.log("connectionsList",connectionsList)
    return (
     
      <div className="apps-detail-body">
        {!loader && (
          <div>
            {connectionsList && connectionsList.length ? (
              <div>
                <div className="heading mb-4">
                  My connections ({connectionsList.length})
                </div>
                {connectionsList.map((connection) => (
                  <div key={connection.id} className="card ">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h3 className="mb-0">{connection.connectionName }</h3>
                          {connection.cliType === "StoryChiefCLI" ? connection.workSpaceId : connection.email ? `@${connection.email}` : ""}
                          <span className="ml-2">- added</span>{" "}
                          {moment(
                            moment.unix(connection.createdAt).format("LLL")
                          ).fromNow()}
                        </div>

                        <div className="col-md-2">
                          <div className="ml-2" style={{ fontWeight: "800" }}>
                            {connection.echoes.length}
                          </div>
                          <h5>Echo</h5>
                        </div>

                        <Button className="col-md-2 text-primary">
                          <LockRoundedIcon className="mr-1" />
                          <span>Only you</span>
                        </Button>

                        <div
                          className="col-md-2"
                          style={{ padding: "6px 70px" }}
                        >
                          <Menubar
                            viewEchos={handleChangeIndex}
                            connection={connection}
                            renameConnection={this.onRenameConnection}
                            deleteConnection={this.onDeleteConnection}
                            transferOwnership={this.onTransferOwnership}
                            onReconnect={this.handleReconnectConnection}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <RenameConnection
                  connection={selectedConnection}
                  open={renameEchoModal}
                  cliType={cliType}
                  onClose={this.onRenameModalClose}
                />

                <AlertDialog
                  title={"Are you sure you want to delete this connection?"}
                  data={selectedConnection}
                  open={deleteConnectionModal}
                  close={this.onDeleteConnectionClose}
                  confirm={this.onDeleteConnectionConfirm}
                />

                <TransferOwnership
                  connection={selectedConnection}
                  open={transferOwnershipModal}
                  onClose={this.onTransferOwnershipClose}
                  onSaveTransferOwnership={this.onSaveTransferOwnership}
                />
              </div>
            ) : (
              <div>
                <div className="heading mb-4">
                  My connections ({connectionsList.length})
                </div>
                <div
                  className="card"
                  style={{ height: "64px", paddingTop: "11px" }}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">No Connection Found</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedApp && (
          <Apps
            selectedApp={selectedApp}
            selectedCLI={selectedCLI}
            selectedAPI={selectedAPI}
            onOpen={this.state.openModal}
            onClose={this.handleRequestConnectionClose}
            OnSuccess={(e) => this.handleSuccessRedirection(e)}
            OnLoading={this.handleIsLoadingRequest}
            isReconnect={connectionId}
            connectionInfo={connectionInfo}
          />
        )}

        {loader && (
          <div id="profileLoader" className="loader-view">
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ connections }) => {
  const { connectionsList, loader, selectedConnection } = connections;
  return { connectionsList, loader, selectedConnection };
};

export default connect(mapStateToProps, {
  fetchAllConnections,
  updateSelectedConnection,
})(Connection);
