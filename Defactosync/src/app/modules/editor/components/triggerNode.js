import React from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select2 from "@material-ui/core/Select";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import Menu from "@material-ui/core/Menu";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import LinearProgress from "@material-ui/core/LinearProgress";

import { showErrorToaster, customFilterApps } from "appUtility/commonFunction";
import {
  updateEchoData,
  onChangeNodeApp,
  updateNodesList,
  loaderOnSelectEvent,
} from "actions/index";
import { httpClient } from "appUtility/Api";
import {
  APP_IMAGE_URL,
  IMAGE_FOLDER,
  TRIGGERS_LIST_URL,
  CONNECTIONS_URLS,
  APP_EVENTS_URLS,
  ECHO_URLS,
} from "constants/AppConst";
import { CLINAME } from "constants/CliTypes";
import SlackSetup from "../components/setup-trigger/slackSetup";
import TrelloSetup from "../components/setup-trigger/trelloSetup";
import ActiveCampaignSetup from "./setup-trigger/activeCampaignSetup";
import AsanaSetup from "./setup-trigger/asanaSetup";
import HelpScoutSetup from "./setup-trigger/helpScoutSetup";
import DropBoxSetup from "./setup-trigger/dropBoxSetup";
import MailerliteSetup from "./setup-trigger/mailerliteSetup";
import MailChimpSetup from "./setup-trigger/mailChimpSetup";
import GoToWebinarSetup from "./setup-trigger/goToWebinarSetup";
import CampaignMonitorSetup from "./setup-trigger/campaignMonitor";
import GmailSetup from "./setup-trigger/gmailSetup";
import GoogleDriveSetup from "./setup-trigger/googleDriveSetup";
import GoogleCalenderSetup from "./setup-trigger/googleCalenderSetup";
import ZenDeskSetup from "./setup-trigger/zenDeskSetup";
import FreshDeskSetup from "./setup-trigger/freshDeskSetup";
import MailShakeSetup from "./setup-trigger/mailShakeSetup";
import KeapSetup from "./setup-trigger/keapSetup";
import ZohoCrmSetup from "./setup-trigger/zohoCrmSetup";
import DripSetup from "./setup-trigger/dripSetup";
import IntercomSetup from "./setup-trigger/intercomSetup";
import ClickSendSetup from "./setup-trigger/clickSendSetup";
import ConvertKitSetup from "./setup-trigger/convertKitSetup";
import SendInBlueSetup from "./setup-trigger/sendInBlueSetup";
import TelegramSetup from "./setup-trigger/telegramSetup";
import GetResponseSetup from "./setup-trigger/getResponseSetup";
import ClickUpSetup from "./setup-trigger/clickUpSetup";
import CalendlySetup from "./setup-trigger/calendlySetup";
import DocuSignSetup from "./setup-trigger/docuSignSetup";
import SwellSetup from "./setup-trigger/swellSetup";
import BombBombSetup from "./setup-trigger/bombBombSetup";
import PandaDocSetup from "./setup-trigger/pandaDocSetup";


import SlackTriggerTest from "../components/test-trigger/slackTriggerTest";
import ActiveCampaignTriggerTest from "../components/test-trigger/activeCampaignTriggerTest";
import TrelloTriggerTest from "../components/test-trigger/trelloTriggerTest";
import HelpScoutTriggerTest from "../components/test-trigger/helpScoutTriggerTest";
import DropBoxTriggerTest from "../components/test-trigger/dropBoxTriggerTest";
import MailerliteTriggerTest from "../components/test-trigger/mailerliteTriggerTest";
import MailChimpTriggerTest from "../components/test-trigger/mailChimpTriggerTest";
import GoToWebinarTriggerTest from "../components/test-trigger/goToWebinarTriggerTest";
import CampaignMonitorTriggerTest from "../components/test-trigger/campaignMonitorTriggerTest";
import GmailTriggerTest from "../components/test-trigger/gmailTriggerTest";
import GoogleDriveTriggerTest from "../components/test-trigger/googleDriveTriggerTest";
import GoogleCalenderTriggerTest from "../components/test-trigger/googleCalenderTriggerTest";
import ZenDeskTriggerTest from "../components/test-trigger/zenDeskTriggerTest";
import FreshDeskTriggerTest from "../components/test-trigger/freshDeskTriggerTest";
import MailShakeTriggerTest from "../components/test-trigger/mailShakeTriggerTest";
import KeapTriggerTest from "../components/test-trigger/keapTriggerTest";
import ZohoCrmTriggerTest from "../components/test-trigger/zohoCrmTriggerTest";
import DripTriggerTest from "../components/test-trigger/dripTriggerTest";
import IntercomTriggerTest from "../components/test-trigger/intercomTriggerTest";
import ClickSendTriggerTest from "../components/test-trigger/clickSendTriggerTest";
import ConvertKitTriggerTest from "../components/test-trigger/convertKitTriggerTest";
import SendInBlueTriggerTest from "../components/test-trigger/sendInBlueTriggerTest";
import TelegramTriggerTest from "../components/test-trigger/telegramTriggerTest";
import GetResponseTriggerTest from "../components/test-trigger/getResponseTriggerTest";
import ClickUpTriggerTest from "../components/test-trigger/clickUpTriggerTest";
import CalendlyTriggerTest from "../components/test-trigger/calendlyTriggerTest";
import DocuSignTriggerTest from "./test-trigger/docuSignTriggerTest";
import SwellTriggerTest from "./test-trigger/swellTriggerTest";
import BombBombTriggerTest from "./test-trigger/bombBombTriggerTest";
import PandaDocTriggerTest from "./test-trigger/pandaDocTriggerTest";

const options = [
  {
    name: "Rename",
    icon: <ArtTrackIcon />,
  },
];

class TriggerNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      searchBox: false,
      searchText: "",
      allTriggers: [],
      isReconnect: false,
      isLoadingData: false,
      activeStep: 0,
      selectedEventObj: {},
      noEventsAvailable: false,
      connectionsList: [],
      isShowMenu: false,
      editNodeTitle: false,
      selectedEvent: null,
      noFieldsAvailable: false,
      fieldsList: [],
      cliName: "",
      isConnectionReconnect: false,
      isRefreshinFields: false,
      isFieldsRequired: true,
    };
  }

  async getTriggersList(appId) {
    this.setState({
      isLoadingData: true,
    });
    try {
      await httpClient
        .get(TRIGGERS_LIST_URL + appId)
        .then(async (res) => {
          if (res.status === 200) {
            const data = res.data.responseBody.Items;
            this.setState({
              allTriggers: data,
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
      this.getTriggersList(selectedApp.id);
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
        this.getTriggersList(selectedApp.id);
      }
    } else {
      this.setState({
        activeStep: 0,
      });
      this.getAppConnectionsList();
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
        oldNodeObj.selectedCLI === CLINAME.KeapCLI ||
        oldNodeObj.selectedCLI === CLINAME.ZohoCLI ||
        oldNodeObj.selectedCLI === CLINAME.DocuSignCLI
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

  handleBack = () => {
    if (this.state.activeStep - 1 === 0) {
      const { item, allApps } = this.props;
      const selectedApp = allApps.find(
        (app) => app.cliName === item.selectedCLI
      );
      if (selectedApp) this.getTriggersList(selectedApp.id);
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

  handleEventChange(eventId) {
    this.handleStateChange();
    const oldNodeObj = this.props.item;
    let { nodesList, allApps } = this.props;
    const nodeIndex = nodesList.findIndex((node) => node.id === oldNodeObj.id);
    const selectedTrigger = this.state.allTriggers.find(
      (trigger) => trigger.id === eventId
    );
    const selectedCLI = allApps.find(
      (app) => app.cliName === oldNodeObj.selectedCLI
    );

    const newTriggerObj = {
      id: selectedTrigger.id,
      value: selectedTrigger.value,
    };
    const newNodeObj = {
      ...oldNodeObj,
      title: `${selectedTrigger.text} in ${selectedCLI.appName}`,
      selectedEvent: newTriggerObj,
      selectedEventName: selectedTrigger.value,
      isInstant: selectedTrigger.isInstant,
      fields: [],
      isConnectionTested: false,
      isCompleted: false,
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
      this.getTriggersList(app.id);
      this.setState({
        noFieldsAvailable: false,
      });
    }
  }

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
      commonInfo: commonInfo,
      isFieldsRequired: true,
      fields: [],
      method: "update",
    };
    nodesList[nodeIndex] = newNodeObj;
    this.props.loaderOnSelectEvent(true);
    this.props.updateNodesList(nodesList);
    this.props.onChangeNodeApp(newNodeObj);
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
    // this.checkValidation();
  }

  refreshCustomFields() {
    this.setState({
      isRefreshinFields: true,
    });
    this.getCustomeFields(true);
  }

  onChangeFieldValue(value, key) {
    console.log(value, key);
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

  checkValidation() {
    console.log("checlvalidation");
    const { fieldsList } = this.state;
    const { item } = this.props;
    const savedValues = item.fields;
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

  renderSetupComponent(connectionData) {
    const selectedNode = this.props.item;
    if (selectedNode) {
      // Switch Case
      switch (selectedNode.selectedCLI) {
        case "SlackCLI":
          return (
            <SlackSetup
              key={`slackTrigger-${selectedNode.id}`}
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
              key={`trelloTrigger-${selectedNode.id}`}
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
              key={`activeCampaignTrigger-${selectedNode.id}`}
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
              key={`asanaTrigger-${selectedNode.id}`}
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
              key={`helpScoutTrigger-${selectedNode.id}`}
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
            <DropBoxSetup
              key={`dropBoxTrigger-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></DropBoxSetup>
          );

        case "MailerliteCLI":
          return (
            <MailerliteSetup
              key={`mailerliteTrigger-${selectedNode.id}`}
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
              key={`mailChimpTrigger-${selectedNode.id}`}
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
              key={`goToWebinarSetupTrigger-${selectedNode.id}`}
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
              key={`campaignMonitorSetupTrigger-${selectedNode.id}`}
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
              key={`gmailSetupTrigger-${selectedNode.id}`}
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
              key={`googleDriveSetupTrigger-${selectedNode.id}`}
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
              key={`googleCalenderSetupTrigger-${selectedNode.id}`}
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
              key={`zenDeskSetupTrigger-${selectedNode.id}`}
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
              key={`freshDeskSetupTrigger-${selectedNode.id}`}
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
              key={`mailShakeSetupTrigger-${selectedNode.id}`}
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
              key={`keapSetupTrigger-${selectedNode.id}`}
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
              key={`zohoCrmSetupTrigger-${selectedNode.id}`}
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
              key={`dripSetupTrigger-${selectedNode.id}`}
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
            <IntercomSetup
              key={`intercomSetupTrigger-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></IntercomSetup>
          );

        case "ClicksendCLI":
          return (
            <ClickSendSetup
              key={`clickSendSetupTrigger-${selectedNode.id}`}
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
              key={`convertKitSetupTrigger-${selectedNode.id}`}
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

        case "SendInBlueCLI":
          return (
            <SendInBlueSetup
              key={`sendInBlueSetupTrigger-${selectedNode.id}`}
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
              key={`telegramSetupTrigger-${selectedNode.id}`}
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

        case "GetResponseCLI":
          return (
            <GetResponseSetup
              key={`getResponseSetupTrigger-${selectedNode.id}`}
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


        case "ClickUpCLI":
          return (
            <ClickUpSetup
              key={`clickUpSetupTrigger-${selectedNode.id}`}
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

        case "CalendlyCLI":
          return (
            <CalendlySetup
              key={`calendlySetupTrigger-${selectedNode.id}`}
              selectedNode={selectedNode}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              isRefreshingFields={this.state.isRefreshinFields}
              onRefreshFields={(e) => this.refreshCustomFields()}
              onChangeValue={(value, key) =>
                this.onChangeFieldValue(value, key)
              }
              onFieldSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            ></CalendlySetup>
          );

          case "DocuSignCLI":
          return (
            <DocuSignSetup
              key={`docuSignSetupTrigger-${selectedNode.id}`}
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
              key={`swellSetupTrigger-${selectedNode.id}`}
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

          case "BombBombCLI":
          return (
            <BombBombSetup
              key={`bombBombSetupTrigger-${selectedNode.id}`}
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

          case "PandaDocCLI":
          return (
            <PandaDocSetup
              key={`pandaDocSetupTrigger-${selectedNode.id}`}
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

  renderTestComponent(connectionData) {
    const { nodesList, item } = this.props;
    const { activeStep } = this.state;
    if (item) {
      // Switch Case
      switch (item.selectedCLI) {
        case "SlackCLI":
          return (
            <SlackTriggerTest
              key={`slackTriggerTest-${item.id}`}
              selectedNode={item}
              fields={this.state.fieldsList}
              connectionData={connectionData}
              nodesList={nodesList}
              activeStep={activeStep}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              onConnectionTested={() => this.handleOnConnectionTested()}
            // onChangeValue={(value, key) => this.onChangeFieldValue(value, key)}
            // onTestSetupSuccess={(e) => this.onFieldSetupSuccess(e)}
            />
          );
        case "ActiveCampaignCLI":
          return (
            <ActiveCampaignTriggerTest
              key={`activeCampaignTriggerTest-${item.id}`}
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
            <TrelloTriggerTest
              key={`trelloTriggerTest-${item.id}`}
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
            <HelpScoutTriggerTest
              key={`helpscoutTriggerTest-${item.id}`}
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
            <DropBoxTriggerTest
              key={`dropBoxTriggerTest-${item.id}`}
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
            <MailerliteTriggerTest
              key={`mailerliteTriggerTest-${item.id}`}
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
            <MailChimpTriggerTest
              key={`mailChimpTriggerTest-${item.id}`}
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
            <GoToWebinarTriggerTest
              key={`goToWebinarTriggerTest-${item.id}`}
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
            <CampaignMonitorTriggerTest
              key={`campaignMonitorTriggerTest-${item.id}`}
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
            <GmailTriggerTest
              key={`gmailTriggerTest-${item.id}`}
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
            <GoogleDriveTriggerTest
              key={`googleDriveTriggerTest-${item.id}`}
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
            <GoogleCalenderTriggerTest
              key={`googleCalenderTriggerTest-${item.id}`}
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
            <ZenDeskTriggerTest
              key={`zenDeskTriggerTest-${item.id}`}
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
            <FreshDeskTriggerTest
              key={`freshDeskTriggerTest-${item.id}`}
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
            <MailShakeTriggerTest
              key={`mailShakeTriggerTest-${item.id}`}
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
            <KeapTriggerTest
              key={`keapTriggerTest-${item.id}`}
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
            <ZohoCrmTriggerTest
              key={`zohoCrmTriggerTest-${item.id}`}
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
            <DripTriggerTest
              key={`dripTriggerTest-${item.id}`}
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
            <IntercomTriggerTest
              key={`intercomTriggerTest-${item.id}`}
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
            <ClickSendTriggerTest
              key={`clickSendTriggerTest-${item.id}`}
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
            <ConvertKitTriggerTest
              key={`convertKitTriggerTest-${item.id}`}
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
            <SendInBlueTriggerTest
              key={`sendInBlueTriggerTest-${item.id}`}
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
            <TelegramTriggerTest
              key={`telegramTriggerTest-${item.id}`}
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
            <GetResponseTriggerTest
              key={`getResponseTriggerTest-${item.id}`}
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
            <ClickUpTriggerTest
              key={`clickUpTriggerTest-${item.id}`}
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


        case "CalendlyCLI":
          return (
            <CalendlyTriggerTest
              key={`calendlyTriggerTest-${item.id}`}
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
              <DocuSignTriggerTest
                key={`docuSignTriggerTest-${item.id}`}
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
              <SwellTriggerTest
                key={`swellTriggerTest-${item.id}`}
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
                <BombBombTriggerTest
                  key={`bombBombTriggerTest-${item.id}`}
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
                  <PandaDocTriggerTest
                    key={`pandaDocTriggerTest-${item.id}`}
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

  onFieldSetupSuccess(response) {
    if (response.isFieldsRequired) {
    } else {
      this.setState({
        activeStep: 3,
      });
    }
  }

  render() {
    const { allApps, item, nodesList, showEventLoader } = this.props;
    const nodeItem = nodesList.find((node) => node.id === item.id);
    const {
      allTriggers,
      isLoadingData,
      activeStep,
      noEventsAvailable,
      connectionsList,
      editNodeTitle,
      isShowMenu,
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

    const selectedEvent = allTriggers.find(
      (trigger) =>
        nodeItem.selectedEvent && trigger.id === nodeItem.selectedEvent.id
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

    const triggersList = allTriggers.map((event) => {
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
                      <p className="mb-1">Trigger</p>
                      {!editNodeTitle && (
                        <h2>
                          1.
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
                            defaultValue={nodeItem.title ? nodeItem.title : ""}
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
                              {!isLoadingData && triggersList.length > 0 && (
                                <div className="col-md-12 my-3">
                                  <FormControl className="w-100 mb-2">
                                    <InputLabel htmlFor="age-simple">
                                      Trigger Event
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
                                      {triggersList.map((event) => (
                                        <MenuItem
                                          value={event.id}
                                          key={event.id}
                                        >
                                          <div
                                            className="row"
                                            style={{ width: "100%" }}
                                          >
                                            <div className="py-2 col-md-10">
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
                                            {event.isInstant && (
                                              <div className="py-3 col-md-2">
                                                <Chip label="INSTANT" />
                                              </div>
                                            )}
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
                                  {activeStep === "finish" ? "Finish" : "Next"}
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
                      <Step key={"Set up trigger"}>
                        <StepLabel>{"Set up trigger"}</StepLabel>
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
                      <Step key={"Test trigger"}>
                        <StepLabel>{"Test trigger"}</StepLabel>
                        <StepContent className="pb-3">
                          <div className="p-2 test-trigger-step">
                            {/* <h2 className="font-weight-bold">Test Trigger</h2> */}
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
          {/* )} */}
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
  updateEchoData,
  onChangeNodeApp,
  updateNodesList,
  loaderOnSelectEvent,
})(TriggerNode);
