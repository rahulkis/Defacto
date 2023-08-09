
import {
  FETCH_ALL_APPS,
  FETCH_ALL_APPS_SUCCESS,
  UPDATE_APPS_LIST
} from 'constants/ActionTypes';

const INIT_STATE = {
  loader: false,
  allApps: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_APPS: {
      return {
        ...state,
        loader: true,
      };
    }
    case FETCH_ALL_APPS_SUCCESS: {
      return {
        ...state,
        loader: false,
        allApps: action.payload,
      };
    }
    case UPDATE_APPS_LIST: {
      return {
        ...state,
        allApps: action.payload,
      };
    }
    default:
      return state;
  }
};
