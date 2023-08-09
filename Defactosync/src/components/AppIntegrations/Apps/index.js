import React from "react";

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
import Dropbox from "components/AppIntegrations/Dropbox";
import Moosend from "components/AppIntegrations/Moosend";
import MailerLite from "components/AppIntegrations/MailerLite";
import GoToWebinar from "components/AppIntegrations/GoToWebinar";
import Zendesk from "components/AppIntegrations/Zendesk";
import MailShake from "components/AppIntegrations/MailShake";
import KeapInfusionsoft from "components/AppIntegrations/KeapInfusionsoft";
import Intercom from "components/AppIntegrations/Intercom";
import ZohoCRM from "components/AppIntegrations/ZohoCRM";
import DRIP from "components/AppIntegrations/Drip";
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

export default class Apps extends React.Component {
  constructor(prop) {
    super();
  }

  render() {
    const {
      selectedAPI,
      selectedCLI,
      selectedApp,
      onOpen,
      onClose,
      OnSuccess,
      OnLoading,
      isReconnect,
      connectionInfo,
    } = this.props;


    if (selectedApp) {
      // Switch Case
      switch (selectedApp) {
        case "meistertask":
          return (
            <MeisterTask
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "moosend":
          return (
            <Moosend
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "hubspot":
          return (
            <HubSpot
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "asana":
          return (
            <Asana
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "activecampaign":
          return (
            <ActiveCampaign
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "trello":
          return (
            <Trello
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "gotowebinar":
          return (
            <GoToWebinar
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "googledrive":
          return (
            <GoogleDrive
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
              connectionInfo={connectionInfo}
            />
          );
        case "mailshake":
          return (
            <MailShake
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "googlesheet":
          return (
            <GoogleSheet
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "intercom":
          return (
            <Intercom
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "dropbox":
          return (
            <Dropbox
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "campaignmonitor":
          return (
            <CampaignMonitor
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "slack":
          return (
            <Slack
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "freshdesk":
          return (
            <FreshDesk
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "keap":
          return (
            <KeapInfusionsoft
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "drip":
          return (
            <DRIP
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "airtable":
          return <div>{selectedApp}</div>;
        case "zoho":
          return (
            <ZohoCRM
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
              connectionInfo={connectionInfo}
            />
          );
        case "zendesk":
          return (
            <Zendesk
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "helpscout":
          return (
            <HelpScout
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "convertkit":
          return (
            <ConvertKit
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "googlecalendar":
          return (
            <GoogleCalendar
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
              connectionInfo={connectionInfo}
            />
          );
        case "mailerlite":
          return (
            <MailerLite
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "gmail":
          return (
            <Gmail
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );
        case "clicksend":
          return (
            <ClickSend
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "sendinblue":
          return (
            <SendInBlue
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "discord":
          return (
            <Discord
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "telegram":
          return (
            <Telegram
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "mixpanel":
          return (
            <MixPanel
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "customerio":
          return (
            <CustomerIO
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "getresponse":
          return (
            <GetResponse
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "clickup":
          return (
            <ClickUp
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "calendly":
          return (
            <Calendly
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "typeform":
          return (
            <TypeForm
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

        case "mailchimp":
          return (
            <MailChimp
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

          case "docusign":
          return (
            <DocuSign
              onOpen={onOpen}
              onClose={onClose}
              OnSuccess={OnSuccess}
              OnLoading={OnLoading}
              selectedCLI={selectedCLI}
              selectedAPI={selectedAPI}
              isReconnectId={isReconnect}
            />
          );

          

          case "storychief":
            return (
              <StoryChief
                onOpen={onOpen}
                onClose={onClose}
                OnSuccess={OnSuccess}
                OnLoading={OnLoading}
                selectedCLI={selectedCLI}
                selectedAPI={selectedAPI}
                isReconnectId={isReconnect}
              />
            );

            case "swell":
            return (
              <Swell
                onOpen={onOpen}
                onClose={onClose}
                OnSuccess={OnSuccess}
                OnLoading={OnLoading}
                selectedCLI={selectedCLI}
                selectedAPI={selectedAPI}
                isReconnectId={isReconnect}
              />
            );

            case "xero":
            return (
              <Xero
                onOpen={onOpen}
                onClose={onClose}
                OnSuccess={OnSuccess}
                OnLoading={OnLoading}
                selectedCLI={selectedCLI}
                selectedAPI={selectedAPI}
                isReconnectId={isReconnect}
              />
            );

            case "monday":
              return (
                <Monday
                  onOpen={onOpen}
                  onClose={onClose}
                  OnSuccess={OnSuccess}
                  OnLoading={OnLoading}
                  selectedCLI={selectedCLI}
                  selectedAPI={selectedAPI}
                  isReconnectId={isReconnect}
                />
              );

              case "pipedrive":
                return (
                  <PipeDrive
                    onOpen={onOpen}
                    onClose={onClose}
                    OnSuccess={OnSuccess}
                    OnLoading={OnLoading}
                    selectedCLI={selectedCLI}
                    selectedAPI={selectedAPI}
                    isReconnectId={isReconnect}
                  />
                );

                case "notion":
                return (
                  <Notion
                    onOpen={onOpen}
                    onClose={onClose}
                    OnSuccess={OnSuccess}
                    OnLoading={OnLoading}
                    selectedCLI={selectedCLI}
                    selectedAPI={selectedAPI}
                    isReconnectId={isReconnect}
                  />
                );

                case "surveysparrow":
                return (
                  <SurveySparrow
                    onOpen={onOpen}
                    onClose={onClose}
                    OnSuccess={OnSuccess}
                    OnLoading={OnLoading}
                    selectedCLI={selectedCLI}
                    selectedAPI={selectedAPI}
                    isReconnectId={isReconnect}
                  />
                );

                case "followupboss":
                  return (
                    <FollowUpBoss
                      onOpen={onOpen}
                      onClose={onClose}
                      OnSuccess={OnSuccess}
                      OnLoading={OnLoading}
                      selectedCLI={selectedCLI}
                      selectedAPI={selectedAPI}
                      isReconnectId={isReconnect}
                    />
                  );

                  case "liondesk":
                  return (
                    <LionDesk
                      onOpen={onOpen}
                      onClose={onClose}
                      OnSuccess={OnSuccess}
                      OnLoading={OnLoading}
                      selectedCLI={selectedCLI}
                      selectedAPI={selectedAPI}
                      isReconnectId={isReconnect}
                    />
                  );

                  case "bombbomb":
                  return (
                    <BombBomb
                      onOpen={onOpen}
                      onClose={onClose}
                      OnSuccess={OnSuccess}
                      OnLoading={OnLoading}
                      selectedCLI={selectedCLI}
                      selectedAPI={selectedAPI}
                      isReconnectId={isReconnect}
                    />
                  );

                  case "googlecontact":
                    return (
                      <GoogleContact
                        onOpen={onOpen}
                        onClose={onClose}
                        OnSuccess={OnSuccess}
                        OnLoading={OnLoading}
                        selectedCLI={selectedCLI}
                        selectedAPI={selectedAPI}
                        isReconnectId={isReconnect}
                      />
                    );

                  case "pandadoc":
                    return (
                      <PandaDoc
                        onOpen={onOpen}
                        onClose={onClose}
                        OnSuccess={OnSuccess}
                        OnLoading={OnLoading}
                        selectedCLI={selectedCLI}
                        selectedAPI={selectedAPI}
                        isReconnectId={isReconnect}
                      />
                    );

        default:
          return <div>{selectedApp}</div>;
      }
    }
  }
}
