import React from "react";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";
import { PostData } from "../../../stores/requests";

export default class DripAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerName: "",
      selectedAccntID: "",
      isAccountSelected: false,
      selectedAccntValue: {
        label: "Select Account",
        value: 0,
        IntgrationAccntID: "",
      },
    };
  }
  componentWillMount() {
    this.setState({ headerName: localStorage.Type });
  }
  //
  closeForm = () => {
    this.props._renderChildComp("IntegrationList");
  };
  handleSwitchChange = (e) => {
    this.setState({ useConditionalLogic: e.target.checked });
  };
  render() {
    return (
      <div>
        <div className="XKLhmDNloVln61ip64E7e" style={{ padding: "0px" }}>
          <div className="ZtOZviTTkcmz3-DO_OzgS">
            <div className="AdoKE9nnvZr4_zfgdeh5N">
              <div className="Paper Paper--double-padded flex1 mb1">
                <div>
                  <div>
                    <h3
                      className="PaperType--h3"
                      style={{
                        display: "flex",
                        marginTop: "0px",
                        marginBottom: "36px",
                      }}
                    >
                      <img
                        alt=""
                        src={require("assets/img/drip.png")}
                        height="32"
                        style={{ margiRight: "9px", verticalAlign: "middle" }}
                      />
                      <input
                        placeholder="What do you want to call this action?"
                        className="FormTagInput LiveField__input LiveField__input--manualfocus"
                        defaultValue={this.state.headerName}
                      />
                      <div
                        className="BtnV2 BtnV2--warning"
                        tabIndex="-1"
                        onClick={(e) => this.closeForm()}
                        style={{ marginLeft: "18px" }}
                      >
                        <span>Cancel</span>
                      </div>
                    </h3>

                    <div className="FieldConfigurationField ">
                      <div className="FieldConfiguration__label">
                        Choose an account{" "}
                        <div className="FieldConfigurationField__i">
                          <svg
                            fill="currentColor"
                            preserveAspectRatio="xMidYMid meet"
                            height="1em"
                            width="1em"
                            viewBox="0 0 40 40"
                            style={{ verticalAlign: "middle" }}
                          >
                            <g>
                              <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                            </g>
                          </svg>
                          <div className="FieldConfigurationField__description">
                            <div className="FieldConfigurationField__descriptioninner">
                              You can connect a new Mailshake account, or choose
                              from the list of previously connected accounts.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="FieldConfiguration__value">
                        <div className="Select is-clearable is-searchable Select--single">
                          <Select
                            options={this.state.accountsList}
                            value={this.state.selectedAccntValue}
                            onChange={(value) =>
                              this.handleAccountChange(value)
                            }
                          />
                        </div>
                        <div style={{ paddingTop: "18px" }}>
                          {this.state.isAccountSelected && (
                            <div
                              className="BtnV2 BtnV2--warning"
                              tabIndex="-1"
                              onClick={() => this.removeAccount()}
                            >
                              <span>Remove Account</span>
                            </div>
                          )}
                          <a
                            href={`https://www.getdrip.com/oauth/authorize?response_type=code&client_id=adsvfcdscvsfaerewfds12547asdfasdf&redirect_uri=${window.location.origin.toString()}/user/IntegrationNwebhooks`}
                          >
                            <div
                              className="BtnV2 BtnV2--secondary"
                              tabIndex="-1"
                            >
                              <span>Add Account +</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "36px" }}>
                      <div className="FieldConfigurationField ">
                        <div className="FieldConfiguration__label">
                          Use conditional logic{" "}
                          <div className="FieldConfigurationField__i">
                            <svg
                              fill="currentColor"
                              preserveAspectRatio="xMidYMid meet"
                              height="1em"
                              width="1em"
                              viewBox="0 0 40 40"
                              style={{ verticalAlign: "middle" }}
                            >
                              <g>
                                <path d="m21.6 15v-3.4h-3.2v3.4h3.2z m0 13.4v-10h-3.2v10h3.2z m-1.6-25c9.2 0 16.6 7.4 16.6 16.6s-7.4 16.6-16.6 16.6-16.6-7.4-16.6-16.6 7.4-16.6 16.6-16.6z" />
                              </g>
                            </svg>
                            <div className="FieldConfigurationField__description">
                              <div className="FieldConfigurationField__descriptioninner">
                                If turned on, this integration will only be
                                triggered when the specified conditions are met.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="FieldConfiguration__value">
                          <Switch
                            checked={this.state.useConditionalLogic}
                            onChange={(e) => this.handleSwitchChange(e)}
                            value="requiredQuestion"
                            color="primary"
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "36px" }}>
                      <div
                        className="BtnV2 BtnV2--secondary BtnV2--solid"
                        tabIndex="-1"
                      >
                        <span>Finish Setup</span>
                      </div>
                      <div
                        className="BtnV2 BtnV2--warning"
                        tabIndex="-1"
                        onClick={(e) => this.closeForm()}
                      >
                        <span>Cancel</span>
                      </div>
                    </div>
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
