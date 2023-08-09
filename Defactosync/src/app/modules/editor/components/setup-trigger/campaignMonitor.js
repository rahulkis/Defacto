import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { httpClient } from "appUtility/Api";
import { showErrorToaster,authenticateUser } from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import {
  AUTH_INTEGRATION,
  CAMPAIGN_MONITOR_AUTH_URLS,
} from "constants/IntegrationConstant";



class CampaignMonitorSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      errorFound: false,
      clients:[],
      clientList:[]
    };
  }

  componentWillMount = async () => {    
    const { connectionData, fields,selectedNode } = this.props;  
    if (connectionData) {

      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "ClientID") {
            await this.getClientList(connectionData,fld.value)
          }
        });
      }


      if (
        fields.find((field) => field.key === "ClientID") &&
        this.state.clients.length === 0
      )
        await this.getClients(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields,selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "ClientID") {
            await this.getClientList(connectionData,fld.value)
          }
        });
      }

      if (
        fields.find((field) => field.key === "ClientID") &&
        this.state.clients.length === 0
      )
        await this.getClients(connectionData);
    }
  };

  handleChangeSelectValue = async (value, key) => {
    const { connectionData} = this.props;
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);

    if (connectionData) {
      if (key === "ClientID") {
        await this.getClientList(connectionData,value)
      }
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  getFieldLabel(field) {
    if (field.label) {
      return field.label;
    } else {
      const splitKeys = field.key.split("_");
      let label = "";
      splitKeys.forEach((key, index) => {
        if (index === 0) {
          label = key;
        } else {
          label = label + " " + key;
        }
      });
      return label;
    }
  }

  // get clients
  getClients = async (connection) => {
    let formdata = {
        headerValue: {
            "Authorization": authenticateUser(connection.token, "X"),
          },

      APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.GET_CLIENTS
    };    
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {  
            const parsedResponse = JSON.parse(result.data.res);
            if (parsedResponse.length > 0) {
              const clientData = parsedResponse.map(
                (client) => {
                  return {
                    value: client.ClientID,
                    label: client.Name,
                  };
                }
              );
              this.setState({
                clients: clientData,
                isLoading: false
              });
            }else{
              this.setState({
                clients: [],
                isLoading: false
              });
            }
            
          }
        });
    } catch (err) {
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

   // get client Lists
   getClientList = async (connection,clientId) => {   
    let formdata = {
        headerValue: {
            "Authorization": authenticateUser(connection.token, "X"),
          },
      APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.GET_CLIENT_LIST.replace("{clientid}",clientId)
    }; 
 
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {          
          if (result.status === 200) {           
            const parsedResponse = JSON.parse(result.data.res);
            const listData = parsedResponse.map(
              (list) => {
                return {
                  value: list.ListID,
                  label: list.Name,
                };
              }
            );
            this.setState({
                clientList: listData,
              isLoading: false,
            });
          }
        });
    } catch (err) {      
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };


  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;
    const { isLoading ,clientList,clients} = this.state;
    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "ClientID" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={clients}
                    value={
                      savedFields[field.key]
                        ? clients.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}
               {field.key === "ListID" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={clientList}
                    value={
                      savedFields[field.key]
                        ? clientList.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}
              {field.key === "CampaignID" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    // options={webinarList}
                    // value={
                    //   savedFields[field.key]
                    //     ? webinarList.find(
                    //         (val) => val.value === savedFields[field.key].value
                    //       )
                    //     : ""
                    // }
                    // onChange={(e) =>
                    //   this.handleChangeSelectValue(e.value, field.key)
                    // }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}
              
            </>
          ))}
          {fields.length && (
            <>
              <Button
                variant="contained"
                color="primary"
                className="jr-btn jr-btn-sm my-2"
                onClick={(e) => this.handlelRefreshFields()}
              >
                <RefreshIcon className="mr-1" />
                {!isRefreshinFields && <span>Refresh fields</span>}
                {isRefreshinFields && <span>Refreshing fields...</span>}
              </Button>
            </>
          )}
          {isLoading && (
            <div className="loader-settings m-5">
              <CircularProgress />
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { loader, selectedEcho } = echo;
  return { loader, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
})(CampaignMonitorSetup);
