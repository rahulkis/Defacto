import React from 'react';
import Select from 'react-select';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { showErrorToaster } from 'appUtility/commonFunction';

import { v4 as uuidv4 } from 'uuid';

import { httpClient } from 'appUtility/Api';
import { APPS_LIST_URL, TRIGGERS_LIST_URL, ACTIONS_LIST_URL, APP_IMAGE_URL, IMAGE_FOLDER, ECHO_URLS, NODES_URLS } from 'constants/AppConst';

import { compareValues } from 'appUtility/commonFunction';
import Echo from 'appUtility/models/Echo';
import EchoNode from 'appUtility/models/EchoNode';

class SelectApps extends React.Component {
  constructor() {
    super();
    this.state = {
      appsList: [],
      selectedApps: [],
      triggerApp: null,
      actionApp: null,
      selectedTrigger: null,
      selectedAction: null,
      triggersList: [],
      actionsList: [],
      isLoading: false,
      redirectToEditor: false,
      echoId: uuidv4(),
    };
    this.customFilter = this.customFilter.bind(this);
  }

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
                    <img height="30" width="30" src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + app.imageName} alt="syncImage"></img>
                    &nbsp;{app.appName}
                  </div>
                ),
                value: app.id,
              };
              appsArray.push(appData);
            }
            this.setState({
              appsList: appsArray,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  async handleAppChange(appIndex, value) {
    const appsListArray = [...this.state.selectedApps];
    appsListArray[appIndex] = value;
    this.setState({
      selectedApps: appsListArray,
      triggerApp: null,
      actionApp: null,
      selectedTrigger: null,
      selectedAction: null,
    });
    if (appsListArray.length === 2) {
      this.setState({
        isLoading: true,
      });
      const firstAppId = appsListArray[0].id;
      const secondAppId = appsListArray[1].id;
      const triggersData = await this.getTriggersList(firstAppId, secondAppId);
      const actionsData = await this.getActionsList(firstAppId, secondAppId);
      this.setState({
        triggersList: triggersData,
        actionsList: actionsData,
        isLoading: false,
      });
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

  //Add your search logic here.
  customFilter(option, searchText) {
    if (option.data.text.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  async getTriggersList(firstAppId, secondAppId) {
    let triggerListData = [];
    try {
      await httpClient
        .get(TRIGGERS_LIST_URL + firstAppId)
        .then(async (res) => {
          if (res.status === 200) {
            const data = res.data.responseBody.Items;
            const triggers = await this.setTriggerList(data);
            triggerListData = [...triggers];
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
      if (firstAppId !== secondAppId) {
        await httpClient
          .get(TRIGGERS_LIST_URL + secondAppId)
          .then(async (res) => {
            if (res.status === 200) {
              const data = res.data.responseBody.Items;
              const triggers = await this.setTriggerList(data);
              triggerListData = [...triggerListData, ...triggers];
            }
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
            });
            showErrorToaster(err);
          });
      }
      return triggerListData;
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  async getActionsList(firstAppId, secondAppId) {
    let actionsListData = [];
    try {
      await httpClient
        .get(ACTIONS_LIST_URL + firstAppId)
        .then(async (res) => {
          if (res.status === 200) {
            const data = res.data.responseBody.Items;
            const actions = await this.setActionsList(data);
            actionsListData = [...actions];
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
      if (firstAppId !== secondAppId) {
        await httpClient
          .get(ACTIONS_LIST_URL + secondAppId)
          .then(async (res) => {
            if (res.status === 200) {
              const data = res.data.responseBody.Items;
              const actions = await this.setActionsList(data);
              actionsListData = [...actionsListData, ...actions];
            }
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
            });
            showErrorToaster(err);
          });
      }
      return actionsListData;
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  setTriggerList(data) {
    let triggers = [...data];
    const selectedApp = this.state.appsList.find((app) => app.id === data[0].appId);
    const appImage = selectedApp.imageName;
    return (triggers = triggers.map((trig) => {
      return {
        ...trig,
        imageName: appImage,
        label: (
          <div>
            <img height="30" width="30" src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + appImage} alt="syncImage"></img>
            &nbsp;{trig.text}
          </div>
        ),
      };
    }));
  }

  setActionsList(data) {
    let actions = [...data];
    const selectedApp = this.state.appsList.find((app) => app.id === data[0].appId);
    const appImage = selectedApp.imageName;
    return (actions = actions.map((act) => {
      return {
        ...act,
        imageName: appImage,
        label: (
          <div>
            <img height="30" width="30" src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + appImage} alt="syncImage"></img>
            &nbsp;{act.text}
          </div>
        ),
      };
    }));
  }

  handleTriggerChange(value) {
    const triggerApp = this.state.appsList.find((app) => app.id === value.appId);
    let trigger = { ...value };
    delete trigger.label;
    this.setState({
      triggerApp: triggerApp,
      selectedTrigger: trigger,
    });
  }

  handleActionChange(value) {
    const actionApp = this.state.appsList.find((app) => app.id === value.appId);
    let action = { ...value };
    delete action.label;
    this.setState({
      actionApp: actionApp,
      selectedAction: action,
    });
  }

  async useEchoHandle() {
    const { triggerApp, actionApp, selectedTrigger, selectedAction, echoId } = this.state;
    const echoTitle = `${selectedAction.text} in ${actionApp.appName} when ${selectedTrigger.text} in ${triggerApp.appName}`;
    const formData = new Echo(echoId, echoTitle);
    this.setState({
      isLoading: true,
    });

    try {
      await httpClient
        .post(ECHO_URLS.ADD_UPDATE_ECHO, formData)
        .then(async (res) => {
          if (res.status === 200) {
            this.addNodesToEchoData(echoId);
            // this.setState({
            //   redirectToEditor: true,
            // });
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  async addNodesToEchoData(echoId) {
    let { triggerApp, actionApp, selectedTrigger, selectedAction } = this.state;

    const triggerFormData = new EchoNode(1, `${selectedTrigger.text} in ${triggerApp.appName}`, 'trigger', triggerApp.cliName, { id: selectedTrigger.id, value: selectedTrigger.value }, echoId, selectedTrigger.isInstant, 'create');
    const actionFormData = new EchoNode(2, `${selectedAction.text} in ${actionApp.appName}`, 'action', actionApp.cliName, { id: selectedAction.id, value: selectedAction.value }, echoId, selectedAction.isInstant, 'create');

    try {
      await this.saveNode(triggerFormData);
      await this.saveNode(actionFormData);
      this.setState({
        redirectToEditor: true,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  async saveNode(formData) {
    return await httpClient.post(NODES_URLS.ADD_UPDATE_NODE, formData);
  }

  render() {
    let {
      appsList,
      isLoading,
      selectedApps,
      triggersList,
      actionsList,
      triggerApp,
      actionApp,
      selectedTrigger,
      selectedAction,
      redirectToEditor,
      echoId,
    } = this.state;

    appsList = appsList.sort(compareValues('appName'));
    triggersList = triggersList.sort(compareValues('text'));
    actionsList = actionsList.sort(compareValues('text'));

    const styles = {
      iconStyle: {
        fontSize: '20px',
        padding: '12px',
        fontWeight: 'bold',
      },
    };

    if (redirectToEditor) {
      return <Redirect to={'/editor/setup/' + echoId} />;
    }

    return (
      <>
        <div>
          <div className="apps-container">
            <div
              className="row"
              style={{
                justifyContent: 'space-around',
              }}
            >
              <div className="col-md-5 mx-2">
                <label>Connect this app...</label>
                <Select
                  options={appsList}
                  isSearchable={true}
                  filterOption={this.customFilterApps}
                  placeholder={
                    <div>
                      <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                      &nbsp;Select an app
                    </div>
                  }
                  onChange={(value) => this.handleAppChange(0, value)}
                />
              </div>
              <div className="col-md-5 mx-2">
                <label>Connect With</label>
                <Select
                  options={appsList}
                  isSearchable={true}
                  filterOption={this.customFilterApps}
                  placeholder={
                    <div>
                      <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                      &nbsp;Select an app
                    </div>
                  }
                  onChange={(value) => this.handleAppChange(1, value)}
                />
              </div>
            </div>
          </div>
          {selectedApps.length === 2 && (
            <div className="trigger-action-container mt-5">
              <div
                className="row"
                style={{
                  justifyContent: 'space-around',
                }}
              >
                <div className="col-md-5 mx-2">
                  <label>When this happens..</label>
                  <Select
                    options={triggersList}
                    isSearchable={true}
                    filterOption={this.customFilter}
                    placeholder={
                      <div>
                        <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                        &nbsp;Select a Trigger
                      </div>
                    }
                    onChange={(value) => this.handleTriggerChange(value)}
                  />
                </div>
                <div className="col-md-5 mx-2">
                  <label>then do this!</label>
                  <Select
                    options={actionsList}
                    isSearchable={true}
                    filterOption={this.customFilter}
                    placeholder={
                      <div>
                        <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                        &nbsp;Select an Action
                      </div>
                    }
                    onChange={(value) => this.handleActionChange(value)}
                  />
                </div>
              </div>
            </div>
          )}
          {selectedTrigger && selectedAction && (
            <div className="final-echo-container p-5">
              <h5 className="mb-2">THIS IS LIKELY WHAT YOU WANT...</h5>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-12">
                  <div className="shadow border-0 undefined card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <img height="40" width="40" alt="syncImage" src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + triggerApp.imageName} />
                        <span>
                          <i className="zmdi zmdi-long-arrow-right text-primary" style={styles.iconStyle} />
                        </span>
                        <img height="40" width="40" alt="syncImage" src={APP_IMAGE_URL + IMAGE_FOLDER.APP_IMAGES + actionApp.imageName} />
                      </div>
                      <div>
                        <p className="card-text">
                          <strong>{`${selectedAction.text} in ${actionApp.appName} when ${selectedTrigger.text} in ${triggerApp.appName}`}</strong>
                        </p>
                      </div>
                      <div>
                        <Button variant="contained" color="primary" onClick={() => this.useEchoHandle()}>
                          Use Echo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="loader-view">
              <CircularProgress />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default SelectApps;
