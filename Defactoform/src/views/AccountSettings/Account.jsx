import React from "react";
import "../../assets/custom/AccountSettings.css";
import AccountDetails from "../AccountSettings/AccountInsidePages/AccountDetails.jsx";
import AccountServices from "../AccountSettings/AccountInsidePages/AccountServices.jsx";
import Billing from "../AccountSettings/AccountInsidePages/Billing.jsx";
import Developer from "../AccountSettings/AccountInsidePages/Developer.jsx";
import GDPRRequest from "../AccountSettings/AccountInsidePages/GDPRRequest.jsx";
import ManageUsers from "../AccountSettings/AccountInsidePages/ManageUsers.jsx";
import Receipts from "../AccountSettings/AccountInsidePages/Receipts.jsx";
import SecurityPassword from "../AccountSettings/AccountInsidePages/SecurityPassword.jsx";
import TranslationsAccount from "../AccountSettings/AccountInsidePages/TranslationsAccount.jsx";
import AgencyView from "./AccountInsidePages/AgencyView.jsx";
import ReferralView from "./AccountInsidePages/ReferralView.jsx";

class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      render: "account",
      headerType: "account",
      menuList: [
        {
          label: "Account Details",
          value: "account",
          clickvalue: "account",
        },
        {
          label: "Billing",
          value: "billing",
          clickvalue: "billing",
        },
        {
          label: "Receipts",
          value: "receipts",
          clickvalue: "receipts",
        },
        {
          label: "Account Services",
          value: "accountservices",
          clickvalue: "accountservices",
        },
        {
          label: "Manage Users",
          value: "manageusers",
          clickvalue: "manageusers",
        },
        {
          label: "Security & Password",
          value: "securitypassword",
          clickvalue: "securitypassword",
        },
        {
          label: "Translations",
          value: "translations",
          clickvalue: "translations",
        },
        {
          label: "GDPR Request",
          value: "gdprrequest",
          clickvalue: "gdprrequest",
        },
        {
          label: "Developer",
          value: "developer",
          clickvalue: "developer",
        },
      ],
    };
  }

  componentWillMount() {
    let activateAccount = localStorage.getItem("activate");
    this._renderSubComp();
    if (activateAccount != null) {
      if (activateAccount === "agencyTab") {
        this.setState({ render: "agency", headerType: "agency" });
      } else if (activateAccount === "referal") {
        this.setState({ render: "referral", headerType: "referral" });
      } else if (activateAccount === "activateMyAccount") {
        this.setState({ render: "billing", headerType: "billing" });
      }
      localStorage.removeItem("activate");
    }
  }

  _renderSubComp() {
    switch (this.state.render) {
      case "account":
        return <AccountDetails />;
      case "accountservices":
        return <AccountServices />;
      case "billing":
        return <Billing />;
      case "developer":
        return <Developer />;
      case "gdprrequest":
        return <GDPRRequest />;
      case "manageusers":
        return <ManageUsers />;
      case "receipts":
        return <Receipts />;
      case "securitypassword":
        return <SecurityPassword />;
      case "translations":
        return <TranslationsAccount />;
      case "agency":
        return <AgencyView />;
      case "referral":
        return <ReferralView />;
      default:
        return <AccountDetails />;
    }
  }
  changeMenuHandle = (compName, val) => {
    this.setState({ render: compName });
    if (this.state.headerType === val) {
      this.setState({ headerType: null });
    } else {
      this.setState({ headerType: val });
    }
  };

  render() {
    return (
      <div className="row" style={{ width: "100%" }}>
        <div
          className="column margintop72"
          style={{ maxWidth: "22%", minWidth: "22%" }}
        >
          <div className="Paper">
            <div>
              <div>
                <div>
                  <div>
                    {this.state.menuList.map((typ, key) => (
                      <div
                        className={
                          this.state.headerType === typ.value
                            ? "Paper Paper--padded Paper--active Paper--clickable"
                            : "Paper Paper--padded  Paper--clickable"
                        }
                        key={"UiElement" + typ.value}
                        onClick={(e) =>
                          this.changeMenuHandle(typ.clickvalue, typ.value)
                        }
                      >
                        <div>
                          <span>
                            {typ.label}
                            <span style={{ opacity: "0.5" }}> {typ.font}</span>

                            <i
                              className="tim-icons icon-minimal-right"
                              style={{ opacity: "0.5", float: "right" }}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "calc(36px - 0.5em)",
            maxWidth: "75%",
            minWidth: "75%",
            padding: "35px",
          }}
          className="_2PLFUU9OgtbELWQz3snC0b column margintop35"
        >
          <div
            className="Paper Paper--padded Paper--double-padded-x"
            style={{ marginBottom: "18px" }}
          >
            <div>{this._renderSubComp()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
