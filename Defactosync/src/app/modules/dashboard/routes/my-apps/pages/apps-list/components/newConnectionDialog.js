import React, { Component } from "react";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import { httpClient } from "appUtility/Api";
import Button from "@material-ui/core/Button";
import { compareValues } from "appUtility/commonFunction";
import { APPS_LIST_URL, APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";

// App Component Import
import MeisterTask from "components/AppIntegrations/MeisterTask";
import Asana from "components/AppIntegrations/Asana";
import CampaignMonitor from "components/AppIntegrations/CampaignMonitor";
import Slack from "components/AppIntegrations/Slack";
import Trello from "components/AppIntegrations/Trello";
import Gmail from "components/AppIntegrations/Gmail";
import GoogleSheet from "components/AppIntegrations/GoogleSheet";
import GoogleDrive from "components/AppIntegrations/GoogleDrive";
import GoogleCalendar from "components/AppIntegrations/GoogleCalendar";
import MailChimp from "components/AppIntegrations/MailChimp";
import HelpScout from "components/AppIntegrations/HelpScout";
import HubSpot from "components/AppIntegrations/HubSpot";
import ActiveCampaign from "components/AppIntegrations/ActiveCampaign";
import FreshDesk from "components/AppIntegrations/FreshDesk";
import ConvertKit from "components/AppIntegrations/ConvertKit";
import Airtable from "components/AppIntegrations/Airtable";
import Dropbox from "components/AppIntegrations/Dropbox";
import Moosend from "components/AppIntegrations/Moosend";
import MailerLite from "components/AppIntegrations/MailerLite";
import GoToWebinar from "components/AppIntegrations/GoToWebinar";
import Zendesk from "components/AppIntegrations/Zendesk";
import MailShake from "components/AppIntegrations/MailShake";
import KeapInfusionsoft from "components/AppIntegrations/KeapInfusionsoft";
import Intercom from "components/AppIntegrations/Intercom";
import ZohoCRM from "components/AppIntegrations/ZohoCRM";
import Drip from "components/AppIntegrations/Drip";
import ClickSend from "components/AppIntegrations/ClickSend";
import SendInBlue from "components/AppIntegrations/SendInBlue";
import Discord from "components/AppIntegrations/Discord";
import Telegram from "components/AppIntegrations/Telegram";
import MixPanel from "components/AppIntegrations/MixPanel";
import CustomerIO from "components/AppIntegrations/CustomerIO";
import GetResponse from "components/AppIntegrations/GetResponse";
import ClickUp from "components/AppIntegrations/ClickUp";
import Calendly from "components/AppIntegrations/Calendly";
import TypeForm from "components/AppIntegrations/TypeForm";
import DocuSign from "components/AppIntegrations/DocuSign";
import StoryChief from "components/AppIntegrations/StoryChief";
import Swell from "components/AppIntegrations/Swell";
import Xero from "components/AppIntegrations/Xero";
import Monday from "components/AppIntegrations/Monday.com";
import PipeDrive from "components/AppIntegrations/PipeDrive";
import Notion from "components/AppIntegrations/Notion";
import SurveySparrow from "components/AppIntegrations/SurveySparrow";
import FollowUpBoss from "components/AppIntegrations/FollowUpBoss";
import LionDesk from "components/AppIntegrations/LionDesk";
import BombBomb from "components/AppIntegrations/BombBomb";
import GoogleContact from "components/AppIntegrations/GoogleContact";
import PandaDoc from "components/AppIntegrations/PandaDoc";

class NewConnectionDialog extends Component {
  constructor() {
    super();
    this.state = {
      appsList: [],
      selectedApp: "",
      selectedCLI: "",
      selectedAPI: "",
      isLoading: false,
      openModal: false,
      isRedirect: false,
    };
  }

  handleRequestClose = () => {
    this.setState({
      selectedApp: "",
      selectedCLI: "",
    });
    if (this.state.openModal) {
      this.setState({ openModal: false });
    }
    this.props.closedialog();
  };

  handleSuccessRedirection = (cliType) => {
    this.setState({ isRedirect: true, selectedCLI: cliType });
  };

  handleDialogRequestClose = () => {
    this.props.closedialog();
  };

  handleIsLoadingRequest = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  componentWillMount() {
    try {
      this.setState({
        isLoading: true,
      });
      httpClient
        .get(APPS_LIST_URL)
        .then((res) => {
          if (res.status === 200) {
            const data = [...res.data.data];
            let appsArray = [];
            for (let app of data) {
              const appData = {
                ...app,
                label: (
                  <div>
                    <img
                      height="30"
                      width="30"
                      src={
                        APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + app.imageName
                      }
                      alt="syncImage"
                    ></img>
                    &nbsp;{app.appName}
                  </div>
                ),
                value: app.id,
              };
              appsArray.push(appData);
            }
            this.setState({
              appsList: appsArray.sort(compareValues("appName")),
              isLoading: false,
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

  //Add your search logic here.
  customFilterApps(option, searchText) {
    if (option.data.appName.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  randApp(data) {
    let appsArr = [];
    for (var i = 0; i < 10; i++) {
      //data[[Math.floor(Math.random() * 26)]];
      appsArr.push(data[i]);
    }
    return appsArr;
  }

  async handleAppChange(value) {
    console.log(value, "value");
    this.setState({
      openModal: true,
      selectedAPI: value.appName,
      selectedApp: value.appName.replace(/ /g, "").toLowerCase(),
      selectedCLI: value.cliName,
    });
  }

  renderAppSwitch(selectedApp, selectedCLI, selectedAPI) {
    if (selectedApp) {
      // Switch Case
      switch (selectedApp) {
        case "meistertask":
          return (
            <MeisterTask
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "moosend":
          return (
            <Moosend
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "hubspot":
          return (
            <HubSpot
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "asana":
          return (
            <Asana
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "activecampaign":
          return (
            <ActiveCampaign
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "trello":
          return (
            <Trello
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "gotowebinar":
          return (
            <GoToWebinar
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "googledrive":
          return (
            <GoogleDrive
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "mailshake":
          return (
            <MailShake
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "googlesheets":
          return (
            <GoogleSheet
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "intercom":
          return (
            <Intercom
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "dropbox":
          return (
            <Dropbox
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "campaignmonitor":
          return (
            <CampaignMonitor
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "slack":
          return (
            <Slack
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "freshdesk":
          return (
            <FreshDesk
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "keapinfusionsoft":
          return (
            <KeapInfusionsoft
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "drip":
          return (
            <Drip
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "airtable":
          return (
            <Airtable
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "zohocrm":
          return (
            <ZohoCRM
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "zendesk":
          return (
            <Zendesk
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "helpscout":
          return (
            <HelpScout
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "convertkit":
          return (
            <ConvertKit
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "googlecalendar":
          return (
            <GoogleCalendar
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "mailerlite":
          return (
            <MailerLite
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              closeDialog={this.handleRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "gmail":
          return (
            <Gmail
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );
        case "clicksend":
          return (
            <ClickSend
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "sendinblue":
          return (
            <SendInBlue
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "discord":
          return (
            <Discord
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "telegram":
          return (
            <Telegram
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "mixpanel":
          return (
            <MixPanel
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "customer.io":
          return (
            <CustomerIO
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );


        case "getresponse":
          return (
            <GetResponse
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );



        case "clickup":
          return (
            <ClickUp
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );


        case "calendly":
          return (
            <Calendly
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "typeform":
          return (
            <TypeForm
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

        case "mailchimp":
          return (
            <MailChimp
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
            />
          );

          case "docusign":
            return (
              <DocuSign
              closeDialog={this.handleDialogRequestClose}
              OnSuccess={(e) => this.handleSuccessRedirection(e)}
              onOpen={this.state.openModal}
              onClose={this.handleRequestClose}
              OnLoading={this.handleIsLoadingRequest}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={""}
              />
            );

            
            case "storychief":
              return (
                <StoryChief
                closeDialog={this.handleDialogRequestClose}
                OnSuccess={(e) => this.handleSuccessRedirection(e)}
                onOpen={this.state.openModal}
                onClose={this.handleRequestClose}
                OnLoading={this.handleIsLoadingRequest}
                selectedCLI={selectedCLI}
                selectedAPI={selectedAPI}
                isReconnectId={""}
                />
              );

              case "swell":
              return (
                <Swell
                closeDialog={this.handleDialogRequestClose}
                OnSuccess={(e) => this.handleSuccessRedirection(e)}
                onOpen={this.state.openModal}
                onClose={this.handleRequestClose}
                OnLoading={this.handleIsLoadingRequest}
                selectedCLI={selectedCLI}
                selectedAPI={selectedAPI}
                isReconnectId={""}
                />
              );

              case "xero":
              return (
                <Xero
                closeDialog={this.handleDialogRequestClose}
                OnSuccess={(e) => this.handleSuccessRedirection(e)}
                onOpen={this.state.openModal}
                onClose={this.handleRequestClose}
                OnLoading={this.handleIsLoadingRequest}
                selectedCLI={selectedCLI}
                selectedAPI={selectedAPI}
                isReconnectId={""}
                />
              );

              case "monday.com":
                return (
                  <Monday
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "pipedrive":
                return (
                  <PipeDrive
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "notion":
                return (
                  <Notion
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "surveysparrow":
                return (
                  <SurveySparrow
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "followupboss":
                return (
                  <FollowUpBoss
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "liondesk":
                return (
                  <LionDesk
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "bombbomb":
                return (
                  <BombBomb
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "googlecontact":
                return (
                  <GoogleContact
                  closeDialog={this.handleDialogRequestClose}
                  OnSuccess={(e) => this.handleSuccessRedirection(e)}
                  onOpen={this.state.openModal}
                  onClose={this.handleRequestClose}
                  OnLoading={this.handleIsLoadingRequest}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={""}
                  />
                );

                case "pandadoc":
                  return (
                    <PandaDoc
                    closeDialog={this.handleDialogRequestClose}
                    OnSuccess={(e) => this.handleSuccessRedirection(e)}
                    onOpen={this.state.openModal}
                    onClose={this.handleRequestClose}
                    OnLoading={this.handleIsLoadingRequest}
                    selectedCLI={selectedCLI}
                    selectedAPI={selectedAPI}
                    isReconnectId={""}
                    />
                  );

        default:
          return <div>{selectedApp}</div>;
      }
    }
  }

  render() {
    const { classes, users, onClose, selectedValue, ...other } = this.props;
    const {
      appsList,
      selectedApp,
      selectedCLI,
      selectedAPI,
      isRedirect,
      isLoading,
    } = this.state;

    const appsListData = appsList.map((app, i) => {
      return {
        ...app,
        label: (
          <div key={i}>
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
    const randomAppsList = [...this.randApp(appsListData)];
    if (isRedirect && selectedCLI) {
      return <Redirect to={"/app/connections/cli/" + selectedCLI} />;
    }

    return (
      <>
        <Dialog
          onClose={this.handleDialogRequestClose}
          {...other}
          className="new-app-connection-dialog"
        >
          <DialogTitle>Add a new app connection</DialogTitle>
          <DialogContent className="">
            <div className="new-app-dialog-content">
              <div className="w-100">
                <div>
                  <label>Add a new app connection</label>
                  <Select
                    options={appsList}
                    isSearchable={true}
                    filterOption={this.customFilterApps}
                    placeholder={
                      <div>
                        <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                        &nbsp;Search for app
                      </div>
                    }
                    onChange={(value) => this.handleAppChange(value)}
                  />
                </div>
                {isLoading && (
                  <div id="LoaderId" className="loader-view loader-settings">
                    <CircularProgress />
                  </div>
                )}
                <div className="row mt-2">
                  {randomAppsList.length > 0 &&
                    randomAppsList.map((app, i) => (
                      <>
                        {app && (
                          <div key={i} className="col-md-6  my-2 ">
                            <Button
                              variant="contained"
                              className="jr-btn bg-white btn-block app-selector-btn"
                              style={{ justifyContent: "flex-start" }}
                              onClick={() => this.handleAppChange(app)}
                            >
                              <div>{app.label}</div>
                            </Button>
                          </div>
                        )}
                      </>
                    ))}
                  {randomAppsList.length > 0 && (
                    <span className="text-light mt-4 text-center w-100">
                      …and over 15+ more
                    </span>
                  )}
                </div>
              </div>
            </div>
            {selectedApp &&
              this.renderAppSwitch(selectedApp, selectedCLI, selectedAPI)}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

NewConnectionDialog.propTypes = {
  closedialog: PropTypes.func,
  selectedCLI: PropTypes.string,
  selectedAPI: PropTypes.string,
  OnLoading: PropTypes.func,
  isReconnectId: PropTypes.string,
};
export default NewConnectionDialog;
