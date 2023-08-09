
import {
    FETCH_ALL_CONNECTIONS,
    FETCH_ALL_CONNECTIONS_SUCCESS,
    UPDATE_CONNECTIONS_LIST,
    UPDATE_SELECTED_CONNECTION
  } from 'constants/ActionTypes';
  
  const INIT_STATE = {
    loader: false,
    connectionsList: [],
    selectedConnection:''
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case FETCH_ALL_CONNECTIONS: {        
        return {
          ...state,
          loader: true,
        };
      }
      case FETCH_ALL_CONNECTIONS_SUCCESS: {
        return {
          ...state,
          loader: false,
          connectionsList: action.payload,
        };
      }
      case UPDATE_CONNECTIONS_LIST: {
        return {
          ...state,
          connectionsList: action.payload,
        };
      }

      case UPDATE_SELECTED_CONNECTION: {
        return {
          ...state,
          selectedConnection: action.payload,
        };
      }
      default:
        return state;
    }
  };
  