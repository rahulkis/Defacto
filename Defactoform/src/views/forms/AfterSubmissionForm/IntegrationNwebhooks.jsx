import React from "react";
import GoogleSheetAuthForm from "../GoogleSheet/GoogleSheetAuthForm";
import SlackAuthForm from "../Slack/SlackAuthForm";
import TrelloAuthForm from "../Trello/TrelloAuthForm";
import MailChimpAuthForm from "../MailChimp/MailChimpAuthForm";
import MailerLiteAuthForm from "../MailerLite/MailerLiteAuthForm";
import ConvertKitAuthForm from "../ConvertKit/ConvertKitAuthForm";
import MailShakeAuthForm from "../MailShake/MailShakeAuthForm";
import InterComAuthForm from "../InterCom/InterComAuthForm";
import ActiveCampaignAuthForm from "../ActiveCampaign/ActiveCampaignAuthForm";
import ZohoCRMAuthForm from "../ZohoCRM/ZohoCRMAuthForm";
import AsanaAuthForm from "../Asana/AsanaAuthForm";
import CampaignMonitorAuthForm from "../CampaignMonitor/CampaignMonitorAuthForm";
import DropBoxAuthForm from "../DropBox/DropBoxAuthForm";
import HelpScoutAuthForm from "../HelpScout/HelpScoutAuthForm";
import HubSpotAuthForm from "../HubSpot/HubSpotAuthForm";
import KeapInfusionsoftAuthForm from "../KeapInfusionsoft/KeapInfusionsoftAuthForm";
import IntegrationList from "../IntegartionsList/IntegrationList";
import DripAuthForm from "../Drip/DripAuthForm";
import MeistertaskAuthForm from "../Meistertask/MeistertaskAuthForm";
import FreshdeskAuthForm from "../Freshdesk/FreshdeskAuthForm";
import MoosendAuthForm from "../Moosend/MoosendAuthForm";
import GoToWebinarAuthForm from "../GoToWebinar/GoToWebinarAuthForm";
import ClickSendAuthForm from "../ClickSend/ClickSendAuthForm";
import ZendeskAuthForm from "../Zendesk/ZendeskAuthForm";
import "../../../assets/custom/integration.css";
import IntegrateWebHooks from "../WebHooks/IntegrateWebHooks";

class IntegrationNwebhooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { componentType: "IntegrationList", code: "" };
  }

  _renderChildComp = (type) => {
    this.setState({ componentType: type });
  };
  componentWillMount() {
    if (this.getUrlVars()["code"] !== undefined) {
      if (sessionStorage.ComponentName === "SlackAuthForm") {
        this.setState({
          componentType: "SlackAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "MailChimpAuthForm") {
        this.setState({
          componentType: "MailChimpAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "ZohoCRMAuthForm") {
        this.setState({
          componentType: "ZohoCRMAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "AsanaAuthForm") {
        this.setState({
          componentType: "AsanaAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "InterComAuthForm") {
        this.setState({
          componentType: "InterComAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "CampaignMonitorAuthForm") {
        this.setState({
          componentType: "CampaignMonitorAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "DropBoxAuthForm") {
        this.setState({
          componentType: "DropBoxAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "HelpScoutAuthForm") {
        this.setState({
          componentType: "HelpScoutAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "HubSpotAuthForm") {
        this.setState({
          componentType: "HubSpotAuthForm",
          code: this.getUrlVars()["code"],
        });
      } else if (sessionStorage.ComponentName === "DripAuthForm") {
        this.setState({
          componentType: "DripAuthForm",
          code: this.getUrlVars()["code"],
        });
      } 
      else if (sessionStorage.ComponentName === "GoToWebinarAuthForm") {
        this.setState({
          componentType: "GoToWebinarAuthForm",
          code: this.getUrlVars()["code"],
        });
      } 
      else if (sessionStorage.ComponentName === "ZendeskAuthForm") {
        this.setState({
          componentType: "ZendeskAuthForm",
          code: this.getUrlVars()["code"],
        });
      }     
      else if (sessionStorage.ComponentName === "KeapInfusionsoftAuthForm") {
        this.setState({
          componentType: "KeapInfusionsoftAuthForm",
          code: this.getUrlVars()["code"],
        });
      }            
    }
  }
  getUrlVars = () => {
    let vars = [],
      hash;
    let hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = decodeURI(hash[1]);
    }
    return vars;
  };
  renderComponent() {
    switch (this.state.componentType) {
      case "IntegrationList":
        return <IntegrationList _renderChildComp={this._renderChildComp} />;
      case "GoogleSheetAuthForm":
        return <GoogleSheetAuthForm _renderChildComp={this._renderChildComp} />;
      case "SlackAuthForm":
        return (
          <SlackAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "TrelloAuthForm":
        return <TrelloAuthForm _renderChildComp={this._renderChildComp} />;
      case "MailChimpAuthForm":
        return (
          <MailChimpAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "ActiveCampaignAuthForm":
        return (
          <ActiveCampaignAuthForm _renderChildComp={this._renderChildComp} />
        );
      case "MailerLiteAuthForm":
        return (
          <MailerLiteAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "MailShakeAuthForm":
        return (
          <MailShakeAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "InterComAuthForm":
        return (
          <InterComAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "ConvertKitAuthForm":
        return (
          <ConvertKitAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "ZohoCRMAuthForm":
        return (
          <ZohoCRMAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "AsanaAuthForm":
        return (
          <AsanaAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "CampaignMonitorAuthForm":
        return (
          <CampaignMonitorAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "DropBoxAuthForm":
        return (
          <DropBoxAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "HelpScoutAuthForm":
        return (
          <HelpScoutAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "HubSpotAuthForm":
        return (
          <HubSpotAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
      case "DripAuthForm":
        return (
          <DripAuthForm
            code={this.state.code}
            _renderChildComp={this._renderChildComp}
          />
        );
        case "KeapInfusionsoftAuthForm":
          return (
            <KeapInfusionsoftAuthForm
              code={this.state.code}
              _renderChildComp={this._renderChildComp}
            />
          );
          case "MeistertaskAuthForm":
          return (
            <MeistertaskAuthForm
              code={this.state.code}
              _renderChildComp={this._renderChildComp}
            />
          );
          case "FreshdeskAuthForm":
            return (
              <FreshdeskAuthForm
                code={this.state.code}
                _renderChildComp={this._renderChildComp}
              />
            );
            case "MoosendAuthForm":
            return (
              <MoosendAuthForm
                code={this.state.code}
                _renderChildComp={this._renderChildComp}
              />
            );  
            case "GoToWebinarAuthForm":
            return (
              <GoToWebinarAuthForm
                code={this.state.code}
                _renderChildComp={this._renderChildComp}
              />
            );
            case "ClickSendAuthForm":
            return (
              <ClickSendAuthForm
                code={this.state.code}
                _renderChildComp={this._renderChildComp}
              />
            ); 
            case "ZendeskAuthForm":
            return (
              <ZendeskAuthForm
                code={this.state.code}
                _renderChildComp={this._renderChildComp}
              />
            ); 
      default:
        return <IntegrationList _renderChildComp={this._renderChildComp} />;
    }
  }

  render() {
    return (
      <div>
        <div className="editor-page editor-page-wrapper editor-page-align">
          <div className="content-page content-page-padding-bottom">
            <div>{this.renderComponent()}</div>
          </div>
        </div>
        <div className="editor-page editor-page-wrapper webhook-editor-page-padding">
          <div className="content-page webhook-content-page-padding">
            <div>
              <IntegrateWebHooks />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IntegrationNwebhooks;
