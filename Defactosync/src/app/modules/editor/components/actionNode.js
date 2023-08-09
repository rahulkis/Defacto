import React from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select2 from "@material-ui/core/Select";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import Menu from "@material-ui/core/Menu";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import LinearProgress from "@material-ui/core/LinearProgress";

import AlertDialog from "components/Dialogs/AlertDialog";
import { httpClient } from "appUtility/Api";
import { showErrorToaster, customFilterApps } from "appUtility/commonFunction";
import {
  updateEchoData,
  onChangeNodeApp,
  updateNodesList,
  loaderOnSelectEvent,
  deleteEchoNode,
} from "actions/index";
import {
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  ACTIONS_LIST_URL,
  CONNECTIONS_URLS,
  APP_EVENTS_URLS,
  ECHO_URLS,
} from "constants/AppConst";

import { CLINAME } from "constants/CliTypes";
import SlackSetup from "../components/setup-action/slackSetup";
import TrelloSetup from "../components/setup-action/trelloSetup";
import ActiveCampaignSetup from "./setup-action/activeCampaignSetup";
import AsanaSetup from "./setup-action/asanaSetup";
import HelpScoutSetup from "./setup-action/helpScoutSetup";
import DropboxSetup from "./setup-action/dropBoxSetup";
import MailerliteSetup from "./setup-action/mailerliteSetup";
import MailChimpSetup from "./setup-action/mailChimpSetup";
import GoToWebinarSetup from "./setup-action/goToWebinarSetup";
import CampaignMonitorSetup from "./setup-action/campaignMonitorSetup";
import GmailSetup from "./setup-action/gmailSetup";
import GoogleDriveSetup from "./setup-action/googleDriveSetup";
import GoogleCalenderSetup from "./setup-action/googleCalenderSetup";
import ZenDeskSetup from "./setup-action/zenDeskSetup";
import FreshDeskSetup from "./setup-action/freshDeskSetup";
import MailShakeSetup from "./setup-action/mailShakeSetup";
import KeapSetup from "./setup-action/keapSetup";
import ZohoCrmSetup from "./setup-action/zohoCrmSetup";
import DripSetup from "./setup-action/dripSetup";
import Intercom from "./setup-action/intercomSetup";
import ClickSendSetup from "./setup-action/clickSendSetup";
import ConvertKitSetup from "./setup-action/convertKitSetup";
import GoogleSheetSetup from "./setup-action/googleSheetSetup";
import SendInBlueSetup from "./setup-action/sendInBlueSetup";
import TelegramSetup from "./setup-action/telegramSetup";
import MixPanelSetup from "./setup-action/mixPanelSetup";
import CustomerioSetup from "./setup-action/customerioSetup";
import GetResponseSetup from "./setup-action/getResponseSetup";
import ClickUpSetup from "./setup-action/clickUpSetup";
import TypeFormSetup from "./setup-action/typeFormSetup";
import DocuSignSetup from "./setup-action/docuSignSetup";
import SwellSetup from "./setup-action/swellSetup";
import XeroSetup from "./setup-action/xeroSetup";
import StoryChiefSetup from "./setup-action/storyChiefSetup";
import MondaySetup from "./setup-action/mondaySetup";
import PipeDriveSetup from "./setup-action/pipeDriveSetup";
import NotionSetup from "./setup-action/notionSetup";
import SurveySparrowSetup from "./setup-action/surveySparrowSetup";
import FollowUpBossSetup from "./setup-action/followUpBossSetup";
import LionDeskSetup from "./setup-action/lionDeskSetup";
import BombBombSetup from "./setup-action/bombBombSetup";
import GoogleContactSetup from "./setup-action/googleContactSetup";
import PandaDocSetup from "./setup-action/pandaDocSetup";


import SlackActionTest from "../components/test-action/slackActionTest";
import ActiveCampaignActionTest from "../components/test-action/activeCampaignActionTest";
import TrelloActionTest from "../components/test-action/trelloActionTest";
import HelpScoutActionTest from "../components/test-action/helpScoutActionTest";
import DropBoxActionTest from "../components/test-action/dropBoxActionTest";
import MailerliteActionTest from "../components/test-action/mailerliteActionTest";
import MailChimpActionTest from "../components/test-action/mailChimpActionTest";
import GoToWebinarActionTest from "../components/test-action/goToWebinarActionTest";
import CampaignMonitorActionTest from "../components/test-action/campaignMonitorActionTest";
import GmailActionTest from "../components/test-action/gmailActionTest";
import GoogleDriveActionTest from "../components/test-action/googleDriveActionTest";
import GoogleCalenderActionTest from "../components/test-action/googleCalenderActionTest";
import ZenDeskTest from "../components/test-action/zenDeskActionTest";
import FreshDeskActionTest from "../components/test-action/freshDeskActionTest";
import MailShakeActionTest from "../components/test-action/mailShakeActionTest";
import KeapActionTest from "../components/test-action/keapActionTest";
import ZohoCrmActionTest from "../components/test-action/zohoCrmActionTest";
import DripActionTest from "../components/test-action/dripActionTest";
import IntercomActionTest from "../components/test-action/intercomActionTest";
import ClickSendActionTest from "../components/test-action/clickSendActionTest";
import ConvertkitActionTest from "../components/test-action/convertKitActionTest";
import GoogleSheetActionTest from "../components/test-action/googleSheetActionTest";
import SendInBlueActionTest from "../components/test-action/sendInBlueActionTest";
import TelegramActionTest from "../components/test-action/telegramActionTest";
import MixPanelActionTest from "../components/test-action/mixPanelActionTest";
import CustomerioActionTest from "./test-action/customerioActionTest";
import GetResponseActionTest from "./test-action/getResponseActionTest";
import ClickUpActionTest from "./test-action/clickUpActionTest";
import TypeFormActionTest from "./test-action/typeFormActionTest";
import DocuSignActionTest from "./test-action/docuSignActionTest";
import SwellActionTest from "./test-action/swellActionTest";
import XeroActionTest from "./test-action/xeroActionTest";
import StoryChiefActionTest from "./test-action/storyChiefActionTest";
import MondayActionTest from "./test-action/mondayActionTest";
import PipeDriveActionTest from "./test-action/pipeDriveActionTest";
import NotionActionTest from "./test-action/notionActionTest";
import SurveySparrowActionTest from "./test-action/surveySparrowActionTest";
import FollowUpBossActionTest from "./test-action/followUpBossActionTest";
import LionDeskActionTest from "./test-action/lionDeskActionTest";
import BombBombActionTest from "./test-action/bombBombActionTest";
import GoogleContactActionTest from "./test-action/googleContactActionTest";
import PandaDocActionTest from "./test-action/pandaDocActionTest";



const options = [
  {
    name: "Rename",
    icon: <ArtTrackIcon />,
  },
  {
    name: "Delete",
    icon: <DeleteIcon />,
  },
];

class ActionNode extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: undefined,
      searchBox: false,
      searchText: "",
      allActions: [],
      isLoadingData: false,
      activeStep: 0,
      selectedEventObj: {},
      noEventsAvailable: false,
      connectionsList: [],
      isShowMenu: false,
      editNodeTitle: false,
      showDeleteDialog: false,
      isDeletingNode: false,
      noFieldsAvailable: false,
      fieldsList: [],
      cliName: "",
      isRefreshinFields: false,
      isFieldsRequired: true,
      isReconnect: false,
      isConnectionReconnect: false,
    };
  }

  randApp(data) {
    let appsArr = [];
    for (var i = 0; i < 10; i++) {
      const rand = data[Math.floor(Math.random() * 26)];
      appsArr.push(rand);
    }
    return appsArr;
  }

  async getActionList(appId) {
    this.setState({
      isLoadingData: true,
    });
    try {
      await httpClient
        .get(ACTIONS_LIST_URL + appId)
        .then(async (res) => {
          if (res.status === 200) {
            const data = res.data.responseBody.Items;
            this.setState({
              allActions: data,
              isLoadingData: false,
              noEventsAvailable: data.length > 0 ? false : true,
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoadingData: false,
            noEventsAvailable: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoadingData: false,
        noEventsAvailable: false,
      });
      showErrorToaster(error);
    }
  }

  async getAppConnectionsList() {
    const nodeObj = this.props.item;

    this.setState({
      isLoadingData: true,
    });
    try {
      await httpClient
        .get(CONNECTIONS_URLS.GET_CONNNECTIONS_BY_CLI + nodeObj.selectedCLI)
        .then(async (res) => {
          if (res.status === 200) {
            const data = res.data.data;
            const connecList = data.map((con) => {
              return {
                ...con,
                value: con.id,
                label: con.connectionName,
              };
            });
            this.setState({
              connectionsList: connecList,
              isLoadingData: false,
              // noEventsAvailable: data.length > 0 ? false : true,
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoadingData: false,
            noEventsAvailable: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoadingData: false,
        noEventsAvailable: false,
      });
      showErrorToaster(error);
    }
  }

  componentWillMount() {
    const { item, allApps } = this.props;
    const selectedApp = allApps.find((app) => app.cliName === item.selectedCLI);
    if (selectedApp && Object.keys(item.meta).length === 0) {
      this.getActionList(selectedApp.id);
    }
    if (Object.keys(item.meta).length > 0) {
      this.getAppConnectionsList();

      if (item.isFieldsRequired && !item.isConnectionTested) {
        this.getCustomeFields();
        this.setState({
          activeStep: 1,
        });
      } else if (
        !item.isFieldsRequired &&
        item.isConnectionTested &&
        !item.isCompleted
      ) {
        this.setState({
          activeStep: 3,
        });
      } else if (
        item.isFieldsRequired &&
        item.isConnectionTested &&
        !item.isCompleted
      ) {
        this.getCustomeFields();
        this.setState({
          activeStep: 3,
        });
      } else if (item.isConnectionTested && item.isCompleted) {
        this.setState({
          activeStep: 4,
        });
      } else if (
        !item.isFieldsRequired &&
        !item.isConnectionTested &&
        !item.isCompleted
      ) {
        this.getActionList(selectedApp.id);
      }
    } else {
      this.setState({
        activeStep: 0,
      });
      this.getAppConnectionsList();
    }
  }

  getCustomeFields = (refreshingFields) => {
    const { item } = this.props;
    if (!refreshingFields) {
      this.setState({
        isLoadingData: true,
      });
    }
    try {
      let body = {
        cliType: item.selectedCLI,
        eventName: item.selectedEvent.value,
        typeOf: item.typeOf,
      };

      httpClient
        .post(APP_EVENTS_URLS.GET_CUSTOM_FIELDS_BY_EVENT, body)
        .then((res) => {
          if (Object.keys(res.data.data).length) {
            this.setCustomFields(res.data.data);
          } else {
            this.setState({
              noFieldsAvailable: true,
              isLoadingData: false,
              isRefreshinFields: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            noFieldsAvailable: false,
            isLoadingData: false,
            isRefreshinFields: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        noFieldsAvailable: false,
        isLoadingData: false,
        isRefreshinFields: false,
      });
      showErrorToaster(error);
    }
  };

  setCustomFields(fieldsData) {
    const { fields } = fieldsData;
    console.log("fields", fields);
    if (fields.length) {
      this.setState({
        fieldsList: fields,
        noFieldsAvailable: false,
        isLoadingData: false,
        isRefreshinFields: false,
      });
    } else {
      const nodeItem = this.props.item;
      let { nodesList } = this.props;
      const nodeIndex = nodesList.findIndex((node) => node.id === nodeItem.id);
      const newNodeObj = {
        ...nodeItem,
        isFieldsRequired: false,
        fields: [],
      };
      nodesList[nodeIndex] = newNodeObj;
      this.props.updateNodesList(nodesList);
      this.props.onChangeNodeApp(newNodeObj);
      this.setState({
        fieldsList: [],
        noFieldsAvailable: false,
        isLoadingData: false,
        isRefreshinFields: false,
        isFieldsRequired: false,
        activeStep: 3,
      });
    }
  }

  refreshCustomFields() {
    this.setState({
      isRefreshinFields: true,
    });
    this.getCustomeFields(true);
  }

  handleStateChange = () => {
    const echoData = this.props.selectedEcho;
    if (echoData.state === "on") {
      try {
        let body = {
          id: echoData.id,
          state: "off",
        };

        httpClient
          .post(ECHO_URLS.UPDATE_ECHO_STATE, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              this.props.updateEchoData({
                ...echoData,
                state: "off",
              });
            }
          })
          .catch((err) => {
            showErrorToaster(err);
          });
      } catch (error) {
        showErrorToaster(error);
      }
    }
  };

  onChangeFieldValue(value, key) {
    this.handleStateChange();
    const { item, nodesList } = this.props;
    const fieldValues = [...item.fields];
    if (fieldValues.length) {
      const fieldIndex = fieldValues.findIndex((field) => field.key === key);
      if (fieldIndex > -1) {
        fieldValues[fieldIndex] = { key: key, value: value };
      } else {
        fieldValues.push({ key: key, value: value });
      }
    } else {
      fieldValues.push({ key: key, value: value });
    }
    const nodeIndex = nodesList.findIndex((node) => node.id === item.id);
    const newNodeObj = {
      ...item,
      fields: fieldValues,
      isCompleted: false,
      isConnectionTested: false,
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.loaderOnSelectEvent(true);
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
  }

  handleOnConnectionTested() {
    const nodeItem = this.props.item;

    let { nodesList } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === nodeItem.id);
    const newNodeObj = {
      ...nodeItem,
      isConnectionTested: true,
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
  }

  renderTestComponent(connectionData) {
    const { nodesList, item } = this.props;
    const { activeStep } = this.state;
    if (item) {
      // Switch Case
      switch (item.selectedCLI) {
        case "SlackCLI":
          return (
            <SlackActionTest
              key={`slackActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "ActiveCampaignCLI":
          return (
            <ActiveCampaignActionTest
              key={`activeCampaignActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "TrelloCLI":
          return (
            <TrelloActionTest
              key={`trelloActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "HelpscoutCLI":
          return (
            <HelpScoutActionTest
              key={`helpScoutActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "DropboxCLI":
          return (
            <DropBoxActionTest
              key={`dropBoxActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "MailerliteCLI":
          return (
            <MailerliteActionTest
              key={`mailerliteActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "MailchimpCLI":
          return (
            <MailChimpActionTest
              key={`mailChimpActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "GoToWebinarCLI":
          return (
            <GoToWebinarActionTest
              key={`goToWebinarActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "CampaignMonitorCLI":
          return (
            <CampaignMonitorActionTest
              key={`campaignMonitorActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "GmailCLI":
          return (
            <GmailActionTest
              key={`gmailActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "GoogleDriveCLI":
          return (
            <GoogleDriveActionTest
              key={`googleDriveActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "GoogleCalendarCLI":
          return (
            <GoogleCalenderActionTest
              key={`googleCalenderActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "ZendeskCLI":
          return (
            <ZenDeskTest
              key={`zenDeskTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "FreshdeskCLI":
          return (
            <FreshDeskActionTest
              key={`freshDeskActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "MailshakeCLI":
          return (
            <MailShakeActionTest
              key={`mailShakeActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "KeapCLI":
          return (
            <KeapActionTest
              key={`keapActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "ZohoCLI":
          return (
            <ZohoCrmActionTest
              key={`zohoCrmActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "DripCLI":
          return (
            <DripActionTest
              key={`dripActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "IntercomCLI":
          return (
            <IntercomActionTest
              key={`intercomActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "ClicksendCLI":
          return (
            <ClickSendActionTest
              key={`clickSendActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );
        case "ConvertkitCLI":
          return (
            <ConvertkitActionTest
              key={`convertkitActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "GoogleSheetCLI":
          return (
            <GoogleSheetActionTest
              key={`googleSheetActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "SendInBlueCLI":
          return (
            <SendInBlueActionTest
              key={`sendInBlueActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "TelegramCLI":
          return (
            <TelegramActionTest
              key={`telegramActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "MixPanelCLI":
          return (
            <MixPanelActionTest
              key={`mixPanelActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "CustomerioCLI":
          return (
            <CustomerioActionTest
              key={`customerioActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

        case "GetResponseCLI":
          return (
            <GetResponseActionTest
              key={`getResponseActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );


        case "TypeFormCLI":
          return (
            <TypeFormActionTest
              key={`typeFormActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );


        case "ClickUpCLI":
          return (
            <ClickUpActionTest
              key={`clickUpActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "DocuSignCLI":
          return (
            <DocuSignActionTest
              key={`docuSignActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "SwellCLI":
          return (
            <SwellActionTest
              key={`swellActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "XeroCLI":
          return (
            <XeroActionTest
              key={`xeroActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "StoryChiefCLI":
          return (
            <StoryChiefActionTest
              key={`storyChiefActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "MondayCLI":
          return (
            <MondayActionTest
              key={`mondayActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "PipedriveCLI":
          return (
            <PipeDriveActionTest
              key={`pipedriveActionTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            />
          );

          case "NotionCLI":
            return (
              <NotionActionTest
                key={`notionActionTest-${item.id}`}
                selectedNode={item}
                fields={this.state.fieldsList}
                connectionData={connectionData}
                nodesList={nodesList}
                activeStep={activeStep}
                handleBack={this.handleBack}
                handleNext={this.handleNext}
                onConnectionTested={() => this.handleOnConnectionTested()}
              />
            );

            case "SurveySparrowCLI":
            return (
              <SurveySparrowActionTest
                key={`surveySparrowActionTest-${item.id}`}
                selectedNode={item}
                fields={this.state.fieldsList}
                connectionData={connectionData}
                nodesList={nodesList}
                activeStep={activeStep}
                handleBack={this.handleBack}
                handleNext={this.handleNext}
                onConnectionTested={() => this.handleOnConnectionTested()}
              />
            );

            case "FollowUpBossCLI":
            return (
              <FollowUpBossActionTest
                key={`followUpBossActionTest-${item.id}`}
                selectedNode={item}
                fields={this.state.fieldsList}
                connectionData={connectionData}
                nodesList={nodesList}
                activeStep={activeStep}
                handleBack={this.handleBack}
                handleNext={this.handleNext}
                onConnectionTested={() => this.handleOnConnectionTested()}
              />
            );

            case "LionDeskCLI":
            return (
              <LionDeskActionTest
                key={`lionDeskActionTest-${item.id}`}
                selectedNode={item}
                fields={this.state.fieldsList}
                connectionData={connectionData}
                nodesList={nodesList}
                activeStep={activeStep}
                handleBack={this.handleBack}
                handleNext={this.handleNext}
                onConnectionTested={() => this.handleOnConnectionTested()}
              />
            );

            case "BombBombCLI":
              return (
                <BombBombActionTest
                  key={`bombBombActionTest-${item.id}`}
                  selectedNode={item}
                  fields={this.state.fieldsList}
                  connectionData={connectionData}
                  nodesList={nodesList}
                  activeStep={activeStep}
                  handleBack={this.handleBack}
                  handleNext={this.handleNext}
                  onConnectionTested={() => this.handleOnConnectionTested()}
                />
              );

              case "GoogleContactCLI":
              return (
                <GoogleContactActionTest
                  key={`googleContactActionTest-${item.id}`}
                  selectedNode={item}
                  fields={this.state.fieldsList}
                  connectionData={connectionData}
                  nodesList={nodesList}
                  activeStep={activeStep}
                  handleBack={this.handleBack}
                  handleNext={this.handleNext}
                  onConnectionTested={() => this.handleOnConnectionTested()}
                />
              );

              case "PandaDocCLI":
              return (
                <PandaDocActionTest
                  key={`pandaDocActionTest-${item.id}`}
                  selectedNode={item}
                  fields={this.state.fieldsList}
                  connectionData={connectionData}
                  nodesList={nodesList}
                  activeStep={activeStep}
                  handleBack={this.handleBack}
                  handleNext={this.handleNext}
                  onConnectionTested={() => this.handleOnConnectionTested()}
                />
              );

        default:
          return <div>{item.selectedCLI}</div>;
      }
    }
  }

  renderSetupComponent(connectionData) {
    const selectedNode = this.props.item;
    if (selectedNode) {
      // Switch Case
      switch (selectedNode.selectedCLI) {
        case "SlackCLI":
          return (
            <SlackSetup
              key={`slackAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshinFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></SlackSetup>
          );

        case "TrelloCLI":
          return (
            <TrelloSetup
              key={`trelloAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshinFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></TrelloSetup>
          );
        case "ActiveCampaignCLI":
          return (
            <ActiveCampaignSetup
              key={`activeCampaignAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshinFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></ActiveCampaignSetup>
          );
        case "AsanaCLI":
          return (
            <AsanaSetup
              key={`asanaAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></AsanaSetup>
          );
        case "HelpscoutCLI":
          return (
            <HelpScoutSetup
              key={`helpScoutAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></HelpScoutSetup>
          );

        case "DropboxCLI":
          return (
            <DropboxSetup
              key={`dropBoxAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></DropboxSetup>
          );

        case "MailerliteCLI":
          return (
            <MailerliteSetup
              key={`mailerliteAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></MailerliteSetup>
          );

        case "MailchimpCLI":
          return (
            <MailChimpSetup
              key={`mailChimpAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></MailChimpSetup>
          );

        case "GoToWebinarCLI":
          return (
            <GoToWebinarSetup
              key={`goToWebinarAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></GoToWebinarSetup>
          );

        case "CampaignMonitorCLI":
          return (
            <CampaignMonitorSetup
              key={`campaignMonitorAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></CampaignMonitorSetup>
          );

        case "GmailCLI":
          return (
            <GmailSetup
              key={`gmailAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></GmailSetup>
          );

        case "GoogleDriveCLI":
          return (
            <GoogleDriveSetup
              key={`googleDriveAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></GoogleDriveSetup>
          );

        case "GoogleCalendarCLI":
          return (
            <GoogleCalenderSetup
              key={`googleCalenderAction-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></GoogleCalenderSetup>
          );

        case "ZendeskCLI":
          return (
            <ZenDeskSetup
              key={`zenDeskSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></ZenDeskSetup>
          );

        case "FreshdeskCLI":
          return (
            <FreshDeskSetup
              key={`freshDeskSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></FreshDeskSetup>
          );

        case "MailshakeCLI":
          return (
            <MailShakeSetup
              key={`mailShakeSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></MailShakeSetup>
          );

        case "KeapCLI":
          return (
            <KeapSetup
              key={`keapSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></KeapSetup>
          );

        case "ZohoCLI":
          return (
            <ZohoCrmSetup
              key={`zohoCrmSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></ZohoCrmSetup>
          );

        case "DripCLI":
          return (
            <DripSetup
              key={`dripSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></DripSetup>
          );

        case "IntercomCLI":
          return (
            <Intercom
              key={`intercomSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></Intercom>
          );

        case "ClicksendCLI":
          return (
            <ClickSendSetup
              key={`clickSendSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></ClickSendSetup>
          );

        case "ConvertkitCLI":
          return (
            <ConvertKitSetup
              key={`convertKitSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></ConvertKitSetup>
          );

        case "GoogleSheetCLI":
          return (
            <GoogleSheetSetup
              key={`googleSheetSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></GoogleSheetSetup>
          );

        case "SendInBlueCLI":
          return (
            <SendInBlueSetup
              key={`sendInBlueSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></SendInBlueSetup>
          );

        case "TelegramCLI":
          return (
            <TelegramSetup
              key={`telegramSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></TelegramSetup>
          );

        case "MixPanelCLI":
          return (
            <MixPanelSetup
              key={`mixPanelSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></MixPanelSetup>
          );

        case "CustomerioCLI":
          return (
            <CustomerioSetup
              key={`customerioSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></CustomerioSetup>
          );

        case "GetResponseCLI":
          return (
            <GetResponseSetup
              key={`getResponseSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></GetResponseSetup>
          );



        case "TypeFormCLI":
          return (
            <TypeFormSetup
              key={`typeFormSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></TypeFormSetup>
          );


        case "ClickUpCLI":
          return (
            <ClickUpSetup
              key={`clickUpSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></ClickUpSetup>
          );

          case "DocuSignCLI":
          return (
            <DocuSignSetup
              key={`docuSignSetup-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></DocuSignSetup>
          );

          case "SwellCLI":
            return (
              <SwellSetup
                key={`swellSetup-${selectedNode.id}`}
                selectedNode={selectedNode}
                fields={this.state.fieldsList}
                connectionData={connectionData}
                isRefreshingFields={this.state.isRefreshinFields}
                onRefreshFields={(e) => this.refreshCustomFields()}
                onChangeValue={(value, key) =>
                  this.onChangeFieldValue(value, key)
                }
                onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
              ></SwellSetup>
            );

            case "XeroCLI":
              return (
                <XeroSetup
                  key={`xeroSetup-${selectedNode.id}`}
                  selectedNode={selectedNode}
                  fields={this.state.fieldsList}
                  connectionData={connectionData}
                  isRefreshingFields={this.state.isRefreshinFields}
                  onRefreshFields={(e) => this.refreshCustomFields()}
                  onChangeValue={(value, key) =>
                    this.onChangeFieldValue(value, key)
                  }
                  onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                ></XeroSetup>
              );

              case "StoryChiefCLI":
              return (
                <StoryChiefSetup
                  key={`storyChiefSetup-${selectedNode.id}`}
                  selectedNode={selectedNode}
                  fields={this.state.fieldsList}
                  connectionData={connectionData}
                  isRefreshingFields={this.state.isRefreshinFields}
                  onRefreshFields={(e) => this.refreshCustomFields()}
                  onChangeValue={(value, key) =>
                    this.onChangeFieldValue(value, key)
                  }
                  onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                ></StoryChiefSetup>
              );

              case "MondayCLI":
                return (
                  <MondaySetup
                    key={`mondaySetup-${selectedNode.id}`}
                    selectedNode={selectedNode}
                    fields={this.state.fieldsList}
                    connectionData={connectionData}
                    isRefreshingFields={this.state.isRefreshinFields}
                    onRefreshFields={(e) => this.refreshCustomFields()}
                    onChangeValue={(value, key) =>
                      this.onChangeFieldValue(value, key)
                    }
                    onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                  ></MondaySetup>
                );

                case "PipedriveCLI":
                return (
                  <PipeDriveSetup
                    key={`pipeDriveSetup-${selectedNode.id}`}
                    selectedNode={selectedNode}
                    fields={this.state.fieldsList}
                    connectionData={connectionData}
                    isRefreshingFields={this.state.isRefreshinFields}
                    onRefreshFields={(e) => this.refreshCustomFields()}
                    onChangeValue={(value, key) =>
                      this.onChangeFieldValue(value, key)
                    }
                    onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                  ></PipeDriveSetup>
                );

                case "NotionCLI":
                return (
                  <NotionSetup
                    key={`notionSetup-${selectedNode.id}`}
                    selectedNode={selectedNode}
                    fields={this.state.fieldsList}
                    connectionData={connectionData}
                    isRefreshingFields={this.state.isRefreshinFields}
                    onRefreshFields={(e) => this.refreshCustomFields()}
                    onChangeValue={(value, key) =>
                      this.onChangeFieldValue(value, key)
                    }
                    onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                  ></NotionSetup>
                );

                case "SurveySparrowCLI":
                  return (
                    <SurveySparrowSetup
                      key={`surveySparrowSetup-${selectedNode.id}`}
                      selectedNode={selectedNode}
                      fields={this.state.fieldsList}
                      connectionData={connectionData}
                      isRefreshingFields={this.state.isRefreshinFields}
                      onRefreshFields={(e) => this.refreshCustomFields()}
                      onChangeValue={(value, key) =>
                        this.onChangeFieldValue(value, key)
                      }
                      onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                    ></SurveySparrowSetup>
                  );

                  case "FollowUpBossCLI":
                  return (
                    <FollowUpBossSetup
                      key={`followUpBossSetup-${selectedNode.id}`}
                      selectedNode={selectedNode}
                      fields={this.state.fieldsList}
                      connectionData={connectionData}
                      isRefreshingFields={this.state.isRefreshinFields}
                      onRefreshFields={(e) => this.refreshCustomFields()}
                      onChangeValue={(value, key) =>
                        this.onChangeFieldValue(value, key)
                      }
                      onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                    ></FollowUpBossSetup>
                  );

                  case "LionDeskCLI":
                  return (
                    <LionDeskSetup
                      key={`lionDeskSetup-${selectedNode.id}`}
                      selectedNode={selectedNode}
                      fields={this.state.fieldsList}
                      connectionData={connectionData}
                      isRefreshingFields={this.state.isRefreshinFields}
                      onRefreshFields={(e) => this.refreshCustomFields()}
                      onChangeValue={(value, key) =>
                        this.onChangeFieldValue(value, key)
                      }
                      onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                    ></LionDeskSetup>
                  );

                  case "BombBombCLI":
                  return (
                    <BombBombSetup
                      key={`bombBombSetup-${selectedNode.id}`}
                      selectedNode={selectedNode}
                      fields={this.state.fieldsList}
                      connectionData={connectionData}
                      isRefreshingFields={this.state.isRefreshinFields}
                      onRefreshFields={(e) => this.refreshCustomFields()}
                      onChangeValue={(value, key) =>
                        this.onChangeFieldValue(value, key)
                      }
                      onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                    ></BombBombSetup>
                  );

                  case "GoogleContactCLI":
                  return (
                    <GoogleContactSetup
                      key={`googleContactSetup-${selectedNode.id}`}
                      selectedNode={selectedNode}
                      fields={this.state.fieldsList}
                      connectionData={connectionData}
                      isRefreshingFields={this.state.isRefreshinFields}
                      onRefreshFields={(e) => this.refreshCustomFields()}
                      onChangeValue={(value, key) =>
                        this.onChangeFieldValue(value, key)
                      }
                      onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                    ></GoogleContactSetup>
                  );

                  case "PandaDocCLI":
                  return (
                    <PandaDocSetup
                      key={`pandaDocSetup-${selectedNode.id}`}
                      selectedNode={selectedNode}
                      fields={this.state.fieldsList}
                      connectionData={connectionData}
                      isRefreshingFields={this.state.isRefreshinFields}
                      onRefreshFields={(e) => this.refreshCustomFields()}
                      onChangeValue={(value, key) =>
                        this.onChangeFieldValue(value, key)
                      }
                      onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
                    ></PandaDocSetup>
                  );

        default:
          return <div>{selectedNode.selectedCLI}</div>;
      }
    }
  }

  onFieldSetupSuccess(response) {
    console.log(response);
    if (response.isFieldsRequired) {
    } else {
      this.setState({
        activeStep: 3,
      });
    }
  }

  updateSearchText(evt) {
    this.setState({
      searchText: evt.target.value,
    });
  }

  handleNext = () => {
    if (this.state.activeStep === 3) {
      this.handleOnConnectionCompleted();
    }

    if (this.state.activeStep + 1 === 1) {
      this.getAppConnectionsList();
    }

    if (this.state.activeStep + 1 === 2) {
      const oldNodeObj = this.props.item;
      if (
        oldNodeObj.selectedCLI === CLINAME.HelpscoutCLI ||
        oldNodeObj.selectedCLI === CLINAME.DropboxCLI ||
        oldNodeObj.selectedCLI === CLINAME.GoToWebinarCLI ||
        oldNodeObj.selectedCLI === CLINAME.GmailCLI ||
        oldNodeObj.selectedCLI === CLINAME.GoogleDriveCLI ||
        oldNodeObj.selectedCLI === CLINAME.GoogleCalendarCLI ||
        oldNodeObj.selectedCLI === CLINAME.GoogleSheetCLI ||
        oldNodeObj.selectedCLI === CLINAME.KeapCLI ||
        oldNodeObj.selectedCLI === CLINAME.ZohoCLI ||
        oldNodeObj.selectedCLI === CLINAME.DocuSignCLI ||
        oldNodeObj.selectedCLI === CLINAME.XeroCLI ||
        oldNodeObj.selectedCLI === CLINAME.LionDeskCLI ||
        oldNodeObj.selectedCLI === CLINAME.GoogleContactCLI
      ) {
        //check token expire
        let tokenExpired = false;
        const connectionEstablishedAt = oldNodeObj.meta.updatedAt;
        let dateString = moment.unix(connectionEstablishedAt).format();
        dateString = moment(dateString)
          .add(oldNodeObj.meta.tokenInfo.expires_in, "seconds")
          .format();
        if (dateString < moment().format()) {
          tokenExpired = true;
        }
        if (tokenExpired) {
          this.setState({
            activeStep: this.state.activeStep,
            isReconnect: true,
            cliName: oldNodeObj.selectedCLI,
          });
        } else {
          this.getCustomeFields();
          this.setState({
            activeStep: this.state.activeStep + 1,
          });
        }
      } else {
        this.getCustomeFields();
        this.setState({
          activeStep: this.state.activeStep + 1,
        });
      }
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    }
  };

  handleOnConnectionCompleted() {
    const nodeItem = this.props.item;

    let { nodesList } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === nodeItem.id);
    const newNodeObj = {
      ...nodeItem,
      isCompleted: true,
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
  }

  handleBack = () => {
    if (this.state.activeStep - 1 === 0) {
      const { item, allApps } = this.props;
      const selectedApp = allApps.find(
        (app) => app.cliName === item.selectedCLI
      );
      if (selectedApp) this.getActionList(selectedApp.id);
      this.setState({
        activeStep: this.state.activeStep - 1,
      });
    }
    if (this.state.activeStep - 1 === 1) {
      this.getAppConnectionsList();
      this.setState({
        activeStep: this.state.activeStep - 1,
      });
    }
    if (this.state.activeStep - 1 === 2) {
      const { item } = this.props;
      if (item.isFieldsRequired) {
        this.getCustomeFields();
        this.setState({
          activeStep: this.state.activeStep - 1,
        });
      } else {
        this.setState({
          activeStep: this.state.activeStep - 2,
        });
      }
    } else {
      this.setState({
        activeStep: this.state.activeStep - 1,
      });
    }
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleEventChange(eventId) {
    this.handleStateChange();
    const oldNodeObj = this.props.item;
    let { nodesList, allApps } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === oldNodeObj.id);
    const selectedAction = this.state.allActions.find(
      (action) => action.id === eventId
    );
    const selectedCLI = allApps.find(
      (app) => app.cliName === oldNodeObj.selectedCLI
    );
    const newActionOhj = {
      id: selectedAction.id,
      value: selectedAction.value,
      apiUrl: selectedAction.apiUrl ? selectedAction.apiUrl : "",
      apiType: selectedAction.apiType ? selectedAction.apiType : "",
    };
    const newNodeObj = {
      ...oldNodeObj,
      title: `${selectedAction.text} in ${selectedCLI.appName}`,
      selectedEvent: newActionOhj,
      selectedEventName: selectedAction.value,
      isInstant: selectedAction.isInstant,
      isConnectionTested: false,
      isCompleted: false,
      fields: [],
      isFieldsRequired: true,
      method: "update",
    };
    nodesList[nodeIndex] = newNodeObj;
    if (oldNodeObj.selectedEvent) {
      if (oldNodeObj.selectedEvent.id !== eventId) {
        this.props.loaderOnSelectEvent(true);
        this.props.updateNodesList(nodesList);
        this.props.onChangeNodeApp(newNodeObj);
      }
    } else {
      this.props.loaderOnSelectEvent(true);
      this.props.updateNodesList(nodesList);
      this.props.onChangeNodeApp(newNodeObj);
    }
  }

  handleAppChange(app) {
    console.log(app, "app");
    this.handleStateChange();
    const oldNodeObj = this.props.item;
    let { nodesList } = this.props;
    if (oldNodeObj.selectedCLI !== app.cliName) {
      const nodeIndex = nodesList.findIndex(
        (node) => node.id === oldNodeObj.id
      );
      const newNodeObj = {
        ...oldNodeObj,
        title: app.appName,
        selectedCLI: app.cliName,
        selectedEvent: null,
        meta: {},
        isConnectionTested: false,
        isCompleted: false,
        isFieldsRequired: true,
        fields: [],
        isInstant: false,
        method: "update",
      };
      nodesList[nodeIndex] = newNodeObj;
      this.props.updateNodesList(nodesList);
      this.props.onChangeNodeApp(newNodeObj);
      this.getActionList(app.id);
      this.setState({
        noFieldsAvailable: false,
      });
    }
  }

  handleReconnect = () => {
    const oldNodeObj = this.props.item;
    let { nodesList } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === oldNodeObj.id);
    const newNodeObj = {
      ...oldNodeObj,
      meta: {},
      isConnectionTested: false,
      isCompleted: false,
      commonInfo: "",
      isFieldsRequired: true,
      fields: [],
      method: "update",
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.loaderOnSelectEvent(true);
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
    this.setState({
      isConnectionReconnect: true,
    });
  };

  handleConnectionChange(data) {
    this.handleStateChange();
    const oldNodeObj = this.props.item;
    let { nodesList } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === oldNodeObj.id);
    const metaData = {
      id: data.id,
      label: data.label,
      value: data.value,
      connectionName: data.label,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
      userName: data.userName,
      email: data.email,
      cliType: data.cliType,
      memberId: data.memberId,
      tokenInfo: data.tokenInfo,
    };
    let commonInfo = data.memberId;
    if (data.cliType === CLINAME.ActiveCampaignCLI) {
      commonInfo = data.connectionName.replace(/\s+/g, "").toLowerCase();
    }

    const newNodeObj = {
      ...oldNodeObj,
      meta: metaData,
      isConnectionTested: false,
      isCompleted: false,
      isFieldsRequired: true,
      commonInfo: commonInfo,
      fields: [],
      method: "update",
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.loaderOnSelectEvent(true);
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
  }

  checkValidation() {
    console.log("checlvalidation");
    const { fieldsList } = this.state;
    const { item } = this.props;
    const savedValues = item.fields;

    console.log(
      "----------------------------------------------------------------"
    );
    console.log(fieldsList, savedValues);
    let valuesArray = [];
    if (fieldsList.filter((fld) => fld.required).length === 0) {
      return true;
    }
    fieldsList.forEach((fld) => {
      if (
        fld.required &&
        savedValues.find((val) => val.key === fld.key && val.value)
      ) {
        valuesArray.push(fld);
      }
    });
    if (
      valuesArray.length === fieldsList.filter((fld) => fld.required).length
    ) {
      return true;
    } else {
      return false;
    }
  }

  showOptionsMenu(e) {
    this.setState({ isShowMenu: e.currentTarget });
  }

  closeOptionsMenu = () => {
    this.setState({ isShowMenu: null });
  };

  handleNodeTitleChange(event) {
    const nodeItem = this.props.item;
    let { nodesList } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === nodeItem.id);
    const newNodeObj = {
      ...nodeItem,
      title: event.target.value,
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
    this.setState({
      editNodeTitle: false,
    });
  }

  onConfirmDeleteNode = () => {
    const nodeItem = this.props.item;
    this.setState({ isDeletingNode: true });
    this.props.deleteEchoNode(nodeItem);
    setTimeout(() => this.setState({ isDeletingNode: false }), 5000);
  };

  render() {
    const { allApps, item, nodesList, showEventLoader } = this.props;
    const nodeItem = item ? nodesList.find((node) => node.id === item.id) : {};
    const {
      allActions,
      isLoadingData,
      activeStep,
      noEventsAvailable,
      connectionsList,
      isShowMenu,
      editNodeTitle,
      showDeleteDialog,
      isDeletingNode,
      noFieldsAvailable,
      fieldsList,
      isReconnect,
      isConnectionReconnect,
      cliName,
    } = this.state;

    if (isConnectionReconnect) {
      return <Redirect to={`/app/connections/cli/${cliName}`} />;
    }

    let selectedCLI = allApps.find(
      (app) => app.cliName === nodeItem.selectedCLI
    );

    if (selectedCLI) {
      selectedCLI = {
        ...selectedCLI,
        value: selectedCLI.id,
        label: (
          <div>
            <img
              height="30"
              width="30"
              src={
                APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + selectedCLI.imageName
              }
              alt="syncImage"
            ></img>
            <span className="ml-2">{selectedCLI.appName}</span>
          </div>
        ),
      };
    }

    const selectedEvent = allActions.find(
      (action) =>
        nodeItem.selectedEvent && action.id === nodeItem.selectedEvent.id
    );

    const appsList = allApps.map((app) => {
      return {
        ...app,
        label: (
          <div>
            <img
              height="30"
              width="30"
              key={app.id}
              src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + app.imageName}
              alt="syncImage"
            ></img>
            <span className="ml-2">{app.appName}</span>
          </div>
        ),
        value: app.id,
      };
    });

    const actionsList = allActions.map((event) => {
      return {
        ...event,
        label: (
          <div className="p-2">
            <h3 className="mb-0">{event.text}</h3>
            <p className="mb-0">{event.description}</p>
          </div>
        ),
        value: event.id,
      };
    });

    let selectedConnectionData = null;
    if (connectionsList.length && Object.keys(nodeItem.meta).length) {
      selectedConnectionData = connectionsList.find(
        (conn) => conn.id === nodeItem.meta.id
      );
    }
    let isfieldsValidated = false;
    if (activeStep === 2 && fieldsList.length) {
      isfieldsValidated = this.checkValidation();
    }

    return (
      <>
        <div className="echo-node-container">
          {isDeletingNode && (
            <div className="loader-view  m-5">
              <CircularProgress />
              <div className="text-center py-2">
                Deleting node. Please wait...
              </div>
            </div>
          )}
          {!isDeletingNode && (
            <>
              <Card className={`shadow border-0`}>
                <CardHeader className="px-4 px-2">
                  <div className="row" style={{ height: "65px" }}>
                    <div className="col-md-11 d-flex">
                      {selectedCLI && (
                        <img
                          className="header-app-icon"
                          src={
                            APP_IMAGE_URL +
                            IMAGE_FOLDER.APP_IMAGES +
                            selectedCLI.imageName
                          }
                          alt="syncImage"
                        />
                      )}
                      <div className="px-2" style={{ width: "90%" }}>
                        <p className="mb-1">Action</p>
                        {!editNodeTitle && (
                          <h2>
                            {nodeItem.sortIndex}.
                            {nodeItem.title !== "" && (
                              <span>{nodeItem.title}</span>
                            )}
                          </h2>
                        )}
                        {editNodeTitle && (
                          <h2 className="title mb-3 mb-sm-0 d-flex">
                            <EditIcon className="text-light" />
                            <input
                              id="standard-basic"
                              variant="filled"
                              style={{ width: "100%" }}
                              defaultValue={
                                nodeItem.title ? nodeItem.title : ""
                              }
                              onBlur={(event) =>
                                this.handleNodeTitleChange(event)
                              }
                            />
                          </h2>
                        )}
                      </div>
                    </div>
                    <div
                      className="col-md-1"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <IconButton
                        className="icon-btn p-2"
                        onClick={(e) => this.showOptionsMenu(e)}
                      >
                        <i className="zmdi zmdi-more-vert" />
                      </IconButton>

                      <Menu
                        id="long-menu"
                        anchorEl={isShowMenu}
                        keepMounted
                        open={Boolean(isShowMenu)}
                        onClose={this.closeOptionsMenu}
                        MenuListProps={{
                          style: {
                            width: 170,
                          },
                        }}
                      >
                        {options.map((option) => (
                          <MenuItem
                            key={option.name}
                            onClick={(e) => {
                              this.closeOptionsMenu();
                              if (option.name === "Rename") {
                                this.setState({ editNodeTitle: true });
                              }
                              if (option.name === "Delete") {
                                this.setState({ showDeleteDialog: true });
                              }
                            }}
                          >
                            {option.icon}
                            <span className="ml-2">{option.name}</span>
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-3">
                  <div className="selection-steps-container">
                    <div className="w-100">
                      <Stepper activeStep={activeStep} orientation="vertical">
                        <Step key={"Choose app & event"}>
                          <StepLabel>{"Choose app & event"}</StepLabel>
                          <StepContent className="pb-3">
                            <div className="p-1">
                              <div className="row">
                                <div className="col-md-12 my-3">
                                  <Select
                                    className="w-100"
                                    options={appsList}
                                    isSearchable={true}
                                    filterOption={customFilterApps}
                                    value={selectedCLI}
                                    onChange={(value) =>
                                      this.handleAppChange(value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="row">
                                {isLoadingData && (
                                  <div className="loader-view  m-5">
                                    <CircularProgress />
                                  </div>
                                )}
                                {!isLoadingData && noEventsAvailable && (
                                  <div className="loader-view mt-3 mb-3 mx-3">
                                    <p className="text-danger">
                                      No events available for this app yet.
                                    </p>
                                  </div>
                                )}
                                {!isLoadingData && actionsList.length > 0 && (
                                  <div className="col-md-12 my-3">
                                    <FormControl className="w-100 mb-2">
                                      <InputLabel htmlFor="age-simple">
                                        Action Event
                                      </InputLabel>
                                      <Select2
                                        value={
                                          nodeItem.selectedEvent
                                            ? nodeItem.selectedEvent.id
                                            : ""
                                        }
                                        input={<Input id="ageSimple3" />}
                                        onChange={(event) =>
                                          this.handleEventChange(
                                            event.target.value
                                          )
                                        }
                                        placeholder="Select Event"
                                      >
                                        {actionsList.map((event) => (
                                          <MenuItem
                                            value={event.id}
                                            key={event.id}
                                          >
                                            <div className="px-1 py-2">
                                              <h4 className="mb-0">
                                                {event.text}
                                              </h4>
                                              <p
                                                className="mb-0"
                                                style={{ fontSize: "12px" }}
                                              >
                                                {event.description}
                                              </p>
                                            </div>
                                          </MenuItem>
                                        ))}
                                      </Select2>
                                      <FormHelperText>
                                        <span className="text-danger ml-1">
                                          (required)
                                        </span>
                                      </FormHelperText>
                                    </FormControl>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <div>
                                {showEventLoader && (
                                  <div className=" m-3">
                                    <LinearProgress color="primary" />
                                  </div>
                                )}
                                <Button
                                  variant="contained"
                                  disabled={!selectedEvent || showEventLoader}
                                  color="primary"
                                  onClick={this.handleNext}
                                  className="jr-btn"
                                >
                                  {activeStep === "finish" ? "Finish" : "Next"}
                                </Button>
                              </div>
                            </div>
                          </StepContent>
                        </Step>
                        <Step key={"Choose account"}>
                          <StepLabel>{"Choose account"}</StepLabel>
                          <StepContent className="pb-3">
                            {isLoadingData && (
                              <div className="loader-view  m-5">
                                <CircularProgress />
                              </div>
                            )}
                            {!isLoadingData && selectedCLI && (
                              <div className="p-1">
                                <div className="row">
                                  <div className="col-md-12 my-3">
                                    <div className="d-flex justify-content-between p-1">
                                      <label>
                                        {selectedCLI.appName} account:
                                        <small className="text-danger text-small">
                                          {" "}
                                          (required)
                                        </small>
                                      </label>
                                      <Link to="/app/connections/">
                                        Manage connections
                                      </Link>
                                    </div>
                                    <Select
                                      className="w-100"
                                      options={connectionsList}
                                      value={nodeItem.meta}
                                      isSearchable={true}
                                      onChange={(value) =>
                                        this.handleConnectionChange(value)
                                      }
                                    />
                                    {showEventLoader && (
                                      <div className=" m-3">
                                        <LinearProgress color="primary" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="mt-2">
                              {!isReconnect && (
                                <div>
                                  <Button
                                    disabled={activeStep === 0}
                                    onClick={this.handleBack}
                                    className="jr-btn"
                                  >
                                    Back
                                  </Button>
                                  <Button
                                    disabled={
                                      Object.keys(nodeItem.meta).length === 0 ||
                                      showEventLoader
                                    }
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleNext}
                                    className="jr-btn"
                                  >
                                    {activeStep === "finish"
                                      ? "Finish"
                                      : "Next"}
                                  </Button>
                                </div>
                              )}

                              {isReconnect && (
                                <div>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleReconnect}
                                    className="jr-btn"
                                  >
                                    Reconnect
                                  </Button>
                                  <span className="text-danger">
                                    Your account has been expired!.Please
                                    reconnect.
                                  </span>
                                </div>
                              )}
                            </div>
                          </StepContent>
                        </Step>
                        <Step key={"Set up Action"}>
                          <StepLabel>{"Set up action"}</StepLabel>
                          <StepContent className="pb-3">
                            <div className="p-2">
                              {isLoadingData && (
                                <div className="loader-view m-5">
                                  <CircularProgress />
                                </div>
                              )}
                              {noFieldsAvailable &&
                                !isLoadingData &&
                                fieldsList.length === 0 && (
                                  <div className="loader-view mt-3 mb-3 mx-3">
                                    <p className="text-danger">
                                      No fields available for this event.
                                    </p>
                                  </div>
                                )}
                              {!noFieldsAvailable &&
                                !isLoadingData &&
                                fieldsList.length > 0 && (
                                  <>
                                    {this.renderSetupComponent(
                                      selectedConnectionData
                                    )}
                                  </>
                                )}
                              {showEventLoader && (
                                <div className=" m-3">
                                  <LinearProgress color="primary" />
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <div>
                                <Button
                                  disabled={activeStep === 0}
                                  onClick={this.handleBack}
                                  className="jr-btn"
                                >
                                  Back
                                </Button>

                                <Button
                                  disabled={
                                    fieldsList.length > 0 && !isfieldsValidated
                                  }
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleNext}
                                  className="jr-btn"
                                >
                                  {activeStep === "finish" ? "Finish" : "Next"}
                                </Button>
                              </div>
                            </div>
                          </StepContent>
                        </Step>
                        <Step key={"Test Action"}>
                          <StepLabel>{"Test action"}</StepLabel>
                          <StepContent className="pb-3">
                            <div className="p-2 test-trigger-step">
                              {this.renderTestComponent(selectedConnectionData)}
                            </div>
                          </StepContent>
                        </Step>
                      </Stepper>
                      {activeStep === 4 && (
                        <div className="text-center">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.setState({ activeStep: 3 })}
                            className="jr-btn"
                          >
                            <span className="mr-2">Edit</span>
                            <EditIcon />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </>
          )}
        </div>
        <AlertDialog
          title={"Really want to delete this node?"}
          data={nodeItem}
          open={showDeleteDialog}
          close={() => this.setState({ showDeleteDialog: false })}
          confirm={this.onConfirmDeleteNode}
        />
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
  updateEchoData,
  onChangeNodeApp,
  updateNodesList,
  loaderOnSelectEvent,
  deleteEchoNode,
})(ActionNode);
