
import {
  FETCH_ALL_APPS,
  UPDATE_APPS_LIST,
  FETCH_ALL_APPS_SUCCESS
} from 'constants/ActionTypes';

export const fetchAllApps = (apps) => {
  return {
    type: FETCH_ALL_APPS,
    payload: apps
  };
};
export const fetchAllAppsSuccess = (apps) => {
  return {
    type: FETCH_ALL_APPS_SUCCESS,
    payload: apps
  };
};
export const updateAppsList = (apps) => {
  return {
    type: UPDATE_APPS_LIST,
    payload: apps
  };
};

