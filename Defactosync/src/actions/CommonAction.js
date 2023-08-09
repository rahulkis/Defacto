import {FETCH_ERROR, FETCH_START, FETCH_SUCCESS, TOGGLE_DRAWER} from "../constants/ActionTypes";

export const onToggleDrawer = () => {
  return {
    type: TOGGLE_DRAWER
  }
};
export const fetchSuccess = () => {
  return {
    type: FETCH_SUCCESS
  }
};

export const fetchError = (error) => {
  return {
    type: FETCH_ERROR,
    payload: error
  }
};
export const fetchStart = () => {
  return {
    type: FETCH_START
  }
};




