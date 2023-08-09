import React from "react";
import "../../../assets/custom/AccountSettings.css";
import Select from "react-select";
import { GetData, PostData } from "../../../stores/requests";
import { ACCOUNT_SETTINGS } from "../../../util/constants";
import Loader from "../../../components/Common/Loader";
import { DraftJS } from "megadraft";

let countries = require("../../../JsonData/countries.json");

class Receipts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoader: false,
      openReceiptdiv: false,
      default_Country: "",
      businessName: "",
      receiptdetails: "",
      receiptId: "",
    };
    this.dropdownHandler = this.dropdownHandler.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    let jsonData = JSON.parse(localStorage.getItem("loginUserInfo"));
    if (jsonData != null) {
      this.loginUserId = jsonData.UserId;
    }
  }
  componentWillMount = async () => {
    await this.receiptInfo();
  };
  receiptInfo = async () => {
    this.setState({ isLoader: true });

    try {
      const URL = ACCOUNT_SETTINGS.GET_RECEIPT_INFO + this.loginUserId;
      GetData(URL).then((result) => {
        if (result.statusCode === 200) {
          let resultedItem = result.data;
          resultedItem = JSON.parse(resultedItem);
          this.bindDataIntoState(resultedItem);
          this.setState({ isLoader: false });
        }
      });
    } catch (err) {
      this.setState({ isLoader: false });
    }
  };

  bindDataIntoState(resultInfo) {
    if (resultInfo.Items.length > 0) {
      let info = resultInfo.Items[0];
      this.setState({
        default_Country: info.Country,
        businessName: info.BusinessName,
        receiptdetails: info.ReceiptDetails,
        receiptId: info.ReceiptId,
      });
    }
  }

  onhandleOpendiv = (event) => {
    this.setState({ openReceiptdiv: true });
  };
  dropdownHandler = (key, event) => {
    this.setState({ [key]: event.value });
  };
  inputHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (e) => {
    this.setState({ isLoader: true });
    let formModel = {
      ReceiptId:
        this.state.receiptId === "" ? DraftJS.genKey() : this.state.receiptId,
      UserId: this.loginUserId,
      Country: this.state.default_Country,
      BusinessName: this.state.businessName,
      ReceiptDetails: this.state.receiptdetails,
      CreatedBy: this.loginUserId,
      CreatedAt: Date.now(),
    };
    try {
      PostData(ACCOUNT_SETTINGS.POST_RECEIPTINFO, formModel).then((result) => {
        if (result.statusCode === 200) {
          this.setState({ isLoader: false });
        }
      });
    } catch (err) {
      alert("Something went wrong, please try again.");
      this.setState({ isLoader: false });
    }
  };
  render() {
    if (this.state.isLoader) {
      return <Loader />;
    }

    return (
      <div>
        <div className="receipt-section">
          <h2 className="PaperType--h2">Receipts</h2>
          {this.state.openReceiptdiv === false && (
            <div
              className="BtnV2 BtnV2--raised BtnV2--primary"
              onClick={(e) => this.onhandleOpendiv()}
            >
              <span>Customize Receipts</span>
            </div>
          )}
          {this.state.openReceiptdiv && (
            <h3 className="PaperType--h3">Customize Receipt</h3>
          )}
          {this.state.openReceiptdiv === false && (
            <div style={{ position: "relative" }}>
              <div
                className="ResultsTable__wrapper "
                style={{ overflow: "visible" }}
              >
                <table className="ResultsTable ">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>No Receipts</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          )}

          {this.state.openReceiptdiv && (
            <div style={{ maxwidth: "700px" }}>
              <div className="LiveField" style={{ marginLeft: "0px" }}>
                <div className="LiveField__container">
                  <div>
                    <div className="LiveField__header">
                      <span>Country</span>
                    </div>
                    <div className="LiveField__answer">
                      <Select
                        name="default_Country"
                        options={countries}
                        value={countries.find(
                          (cur) => cur.value === this.state.default_Country
                        )}
                        onChange={(e) =>
                          this.dropdownHandler("default_Country", e)
                        }
                        id="countryId"
                      />
                    </div>
                  </div>
                </div>
                <div className="LiveField__container">
                  <div>
                    <div className="LiveField__header">
                      <span>Business Name</span>
                    </div>
                    <div className="LiveField__answer">
                      <input
                        placeholder=""
                        data="[object Object]"
                        name="businessName"
                        className="LiveField__input"
                        type="text"
                        onChange={this.inputHandler}
                        defaultValue={this.state.businessName}
                      />
                    </div>
                  </div>
                </div>
                <div className="LiveField__container">
                  <div>
                    <div className="LiveField__header">
                      <span>Receipt Details</span>
                    </div>
                    <div className="LiveField__answer">
                      <textarea
                        placeholder="Enter any text that needs to be displayed on receipts, e.g address, business number, VAT number."
                        data="[object Object]"
                        name="receiptdetails"
                        className="LiveField__input"
                        type="text"
                        onChange={this.inputHandler}
                        defaultValue={this.state.receiptdetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="BtnV2 BtnV2--disabled BtnV2--primary acctSubmit-btn-alignment"
                tabIndex="-1"
                onClick={(e) => this.handleSubmit(e)}
              >
                <span>Save</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Receipts;
