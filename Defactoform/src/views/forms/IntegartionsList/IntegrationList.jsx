import React from "react";
import reactCSS from "reactcss";

class IntegrationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: "block" };
  }
  integrationActions = (e, type) => {
    this.setState({ showAction: type });
  };
  addRowsToSheet = (e) => {
    this.props._renderChildComp("GoogleSheetAuthForm");
  };
  showIntegration = (e, Type, ComponentName) => {
    localStorage.setItem("Type", Type);

    sessionStorage.removeItem("ComponentName");
    sessionStorage.setItem("ComponentName", ComponentName);
    this.props._renderChildComp(ComponentName);
  };

  componentWillMount() {
    console.log("code");
  }
  componentDidMount() {
    if (this.getUrlVars()["code"] !== undefined)
      console.log("Updatecode", this.getUrlVars()["code"]);
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
  render() {
    const styles = reactCSS({
      default: {
        appItemBlock: {
          maxWidth: "260px",
          paddingLeft: "8px",
          paddingRight: "8px",
        },
      },
    });
    return (
      <div className="row">
        <div className="col-md-12 paper-double">
          <h2 className="paper-Type">Direct Integrations</h2>
          <p className="p-0 font-14">
            Use direct integrations to easily connect your forms with other
            apps. You can do all kinds of things automatically, like adding a
            contact in Mailchimp, or send your team a message on Slack. Direct
            Integrations may incur a charge depending on the amount of actions
            processed per month. See pricing for more details.
          </p>
          <div
            className="ZtOZviTTkcmz3-DO_OzgS _2qJAdUvXLdQixlGX3vOpbL"
            style={{ padding: "0px" }}
          >
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "google")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/googleSheet.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Google Sheets
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "google"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) => this.addRowsToSheet(e)}
                  >
                    Add row to sheet
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) => this.addRowsToSheet(e)}
                  >
                    Add row to sheet(legacy)
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "slack")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/Slack-Mark-Web.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Slack
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "slack"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Slack Channel", "SlackAuthForm")
                    }
                  >
                    Send Message to Channel
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Slack User", "SlackAuthForm")
                    }
                  >
                    Send Direct message
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Slack Reminder", "SlackAuthForm")
                    }
                  >
                    Add a Reminder
                  </div>
                </div>
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "Trello")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/trello.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Trello
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "Trello"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Create Card", "TrelloAuthForm")
                    }
                  >
                    Create Card
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Create List", "TrelloAuthForm")
                    }
                  >
                    Create List
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Create Board", "TrelloAuthForm")
                    }
                  >
                    Create Board
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "activecampaign")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/active-campaign.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Active Camapaign
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "activecampaign"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Contact to an Automation",
                        "ActiveCampaignAuthForm"
                      )
                    }
                  >
                    Add Contact to an Automation
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create Note",
                        "ActiveCampaignAuthForm"
                      )
                    }
                  >
                    Add Contact Note
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create Update Contact",
                        "ActiveCampaignAuthForm"
                      )
                    }
                  >
                    Create / Update a Contact
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create Deal",
                        "ActiveCampaignAuthForm"
                      )
                    }
                  >
                    Create Deal
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Update Deal",
                        "ActiveCampaignAuthForm"
                      )
                    }
                  >
                    Update Deal
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "mailchimp")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/mailchimp.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Mailchimp
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "mailchimp"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Subscriber to a List",
                        "MailChimpAuthForm"
                      )
                    }
                  >
                    Add Subscriber to list
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Subscriber to a Tag",
                        "MailChimpAuthForm"
                      )
                    }
                  >
                    Add Subscriber to a Tag
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "mailerlite")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/ml.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        MailerLite
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "mailerlite"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Subscriber",
                        "MailerLiteAuthForm"
                      )
                    }
                  >
                    Add Subscriber
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "ConvertKit")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/convertkit-logomark-red.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        ConvertKit
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "ConvertKit"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Subscriber to Sequence",
                        "ConvertKitAuthForm"
                      )
                    }
                  >
                    Add Subscriber to Sequence
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Subscriber to Form",
                        "ConvertKitAuthForm"
                      )
                    }
                  >
                    Add Subscriber to Form
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Subscriber to Tag",
                        "ConvertKitAuthForm"
                      )
                    }
                  >
                    Add Subscriber to Tag
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "zohoCRM")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/zoho-square.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Zoho CRM
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "zohoCRM"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a record",
                        "ZohoCRMAuthForm"
                      )
                    }
                  >
                    Create a record
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or update a record",
                        "ZohoCRMAuthForm"
                      )
                    }
                  >
                    Create or update a record
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "mailshake")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/mailshake.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Mailshake
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "mailshake"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Recipient to Campaign",
                        "MailShakeAuthForm"
                      )
                    }
                  >
                    Add Recipient to Campaign
                  </div>
                </div>
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "Intercom")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/Intercom_Logo_Mark_Color.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Intercom
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "Intercom"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "245px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or Update User",
                        "InterComAuthForm"
                      )
                    }
                  >
                    Create or Update User
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or Update a Lead",
                        "InterComAuthForm"
                      )
                    }
                  >
                    Create or Update a Lead
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Manage People Tags",
                        "InterComAuthForm"
                      )
                    }
                  >
                    Manage People Tags
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Manage Company Tags",
                        "InterComAuthForm"
                      )
                    }
                  >
                    Manage Company Tags
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send Incoming Message",
                        "InterComAuthForm"
                      )
                    }
                  >
                    Send Incoming Message
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add Event to Person",
                        "InterComAuthForm"
                      )
                    }
                  >
                    Add Event to Person
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "campaignMonitor")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/campaign-monitor.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Campaign Monitor
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "campaignMonitor"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add or Update a Subscriber",
                        "CampaignMonitorAuthForm"
                      )
                    }
                  >
                    Add or Update a Subscriber
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "asana")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/asana.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Asana
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "asana"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Create a task", "AsanaAuthForm")
                    }
                  >
                    Create a task
                  </div>
                </div>
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "dropbox")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/dropbox.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        DropBox
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "dropbox"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Upload files", "DropBoxAuthForm")
                    }
                  >
                    Upload files
                  </div>
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Upload files(Legacy)",
                        "DropBoxAuthForm"
                      )
                    }
                  >
                    Upload files(Legacy)
                  </div>
                </div>
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "keap")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/keap.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Keap (Infusionsoft)
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "keap"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(e, "Create or update a contact", "KeapInfusionsoftAuthForm")
                    }
                  >
                    Create or update a contact
                  </div>
                </div>
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "hubspot")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/hubspot.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Hubspot CRM
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "hubspot"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or update a contact",
                        "HubSpotAuthForm"
                      )
                    }
                  >
                    Create or update a contact
                  </div>
                </div>
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "helpscout")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/helpscout-icon-800.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Help Scout
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "helpscout"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a Conversation",
                        "HelpScoutAuthForm"
                      )
                    }
                  >
                    Create a Conversation
                  </div>
                </div>
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "drip")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span tabIndex="0" className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt=""
                        src={require("assets/img/drip.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Drip
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "drip"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or update a contact",
                        "DripAuthForm"
                      )
                    }
                  >
                    Create or update a contact
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Add subscriber to campaign",
                        "DripAuthForm"
                      )
                    }
                  >
                    Add subscriber to campaign
                  </div>
                </div>                
              </div>
            </div>

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "meistertask")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span tabIndex="0" className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt=""
                        src={require("assets/img/meistertask.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Meistertask
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "meistertask"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a task",
                        "MeistertaskAuthForm"
                      )
                    }
                  >
                    Create a task
                  </div>
                </div>                
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "freshdesk")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span tabIndex="0" className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt=""
                        src={require("assets/img/freshdesk.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Freshdesk
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "freshdesk"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a Ticket",
                        "FreshdeskAuthForm"
                      )
                    }
                  >
                    Create a Ticket
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or Update a Contact",
                        "FreshdeskAuthForm"
                      )
                    }
                  >
                    Create or Update a Contact
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a Company",
                        "FreshdeskAuthForm"
                      )
                    }
                  >
                    Create a Company
                  </div>
                </div>                
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "moosend")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span tabIndex="0" className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt=""
                        src={require("assets/img/moosend.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Moosend
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "moosend"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create or Update Subscriber",
                        "MoosendAuthForm"
                      )
                    }
                  >
                    Create or Update Subscriber
                  </div>
                </div>                
              </div>
            </div>
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "gotowebinar")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span tabIndex="0" className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt=""
                        src={require("assets/img/gotowebinar.jpg")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        GoToWebinar
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "gotowebinar"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a Registrant",
                        "GoToWebinarAuthForm"
                      )
                    }
                  >
                    Create a Registrant
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a Webinar",
                        "GoToWebinarAuthForm"
                      )
                    }
                  >
                    Create a Webinar
                  </div>
                </div>                
              </div>
            </div>        

            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "clicksend")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span tabIndex="0" className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt=""
                        src={require("assets/img/clicksend.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        ClickSend
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "clicksend"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send an SMS",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send an SMS
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send a Fax",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send a Fax
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send SMS to List",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send SMS to List
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send a Voice Message",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send a Voice Message
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send Voice Message to List",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send Voice Message to List
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a Contact",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Create a Contact
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send Postcard/s",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send Postcard/s
                  </div>
                  <div
                    className="ContextMenu__option "
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Send Letter/s",
                        "ClickSendAuthForm"
                      )
                    }
                  >
                    Send Letter/s
                  </div>
                </div>                
              </div>
            </div>        
         
         
            <div
              className="_2PLFUU9OgtbELWQz3snC0b mb1"
              onClick={(e) => this.integrationActions(e, "zendesk")}
              style={styles.appItemBlock}
            >
              <div className="ContextMenu__wrapper">
                <span className="ContextMenu__control">
                  <div
                    className="Paper Paper--padded Paper--clickable"
                    style={{ textAlign: "center" }}
                  >
                    <div>
                      <img
                        alt="..."
                        src={require("assets/img/zendesk.png")}
                        style={{ height: "42px" }}
                      />
                      <div
                        style={{
                          paddingTop: "9px",
                          fontSize: "16px",
                          lineHeight: "18px",
                        }}
                      >
                        Zendesk
                      </div>
                    </div>
                  </div>
                </span>
                <div
                  className={
                    this.state.showAction === "zendesk"
                      ? "ContextMenu ContextMenu--open"
                      : "ContextMenu ContextMenu--closed"
                  }
                  style={{ width: "230px" }}
                >
                  <div
                    className="ContextMenu__option"
                    onClick={(e) =>
                      this.showIntegration(
                        e,
                        "Create a ticket",
                        "ZendeskAuthForm"
                      )
                    }
                  >
                    Create a ticket
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IntegrationList;
