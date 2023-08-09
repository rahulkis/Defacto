import {
    FETCH_ALL_CONNECTIONS,
    UPDATE_CONNECTIONS_LIST,
    FETCH_ALL_CONNECTIONS_SUCCESS,
    UPDATE_SELECTED_CONNECTION
  } from 'constants/ActionTypes';
  
  export const fetchAllConnections = (cliType) => {
    console.log("fetchAllConnections",cliType)
    return {
      type: FETCH_ALL_CONNECTIONS,
      payload: cliType
    };
  };
  export const fetchAllConnectionsSuccess = (connections) => {
    return {
      type: FETCH_ALL_CONNECTIONS_SUCCESS,
      payload: connections
    };
  };
  export const updateConnectionsList = (connections) => {
    return {
      type: UPDATE_CONNECTIONS_LIST,
      payload: connections
    };
  };

  export const updateSelectedConnection = (connection) => {
    return {
      type: UPDATE_SELECTED_CONNECTION,
      payload: connection
    };
  };