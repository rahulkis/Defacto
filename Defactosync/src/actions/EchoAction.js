import {
  HIDE_MESSAGE,
  UPDATE_ECHO_DATA,
  SELECTED_ECHO_DATA,
  FETCH_ALL_ECHOS_SUCCESS,
  UPDATE_NODES_LIST,
  FETCH_ALL_ECHOS,
  UPDATE_SELECTED_ECHO_LIST,
  CHANGE_NODE_APP,
  LOADER_ON_SELECT_EVENT,
  SHOW_HIDE_NODE_SELECTOR,
  UPDATE_CHECKED_ECHOS,
  ON_DELETE_SINGLE_ECHO_NODE
} from 'constants/ActionTypes';

export const fetchAllEchos = (echos) => {
  return {
    type: FETCH_ALL_ECHOS,
    payload: echos
  };
};

export const fetchAllEchosSuccess = (echos) => {
  return {
    type: FETCH_ALL_ECHOS_SUCCESS,
    payload: echos
  };
};

export const updateEchoData = (echo) => {
  return {
    type: UPDATE_ECHO_DATA,
    payload: echo
  };
};

export const updateSelectedEchoList = (echoes) => {
  return {
    type: UPDATE_SELECTED_ECHO_LIST,
    payload: echoes
  };
};

export const updateCheckedEchos = (echos) => {
  return {
    type: UPDATE_CHECKED_ECHOS,
    payload: echos
  };
};

export const updateNodesList = (nodes) => {
  return {
    type: UPDATE_NODES_LIST,
    payload: nodes
  };
};

export const onSelectEcho = (echo) => {
  return {
    type: SELECTED_ECHO_DATA,
    payload: echo
  };
};
export const onChangeNodeApp = (node) => {
  return {
    type: CHANGE_NODE_APP,
    payload: node
  };
};
export const deleteEchoNode = (node) => {
  return {
    type: ON_DELETE_SINGLE_ECHO_NODE,
    payload: node
  };
};
export const loaderOnSelectEvent = (value) => {
  return {
    type: LOADER_ON_SELECT_EVENT,
    payload: value
  };
};
export const showHideNodeSelector = (value) => {
  return {
    type: SHOW_HIDE_NODE_SELECTOR,
    payload: value
  };
};
export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};

