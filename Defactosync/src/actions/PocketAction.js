import {
    FETCH_ALL_POCKETS,
    UPDATE_POCKETS_LIST,
    FETCH_ALL_POCKETS_SUCCESS,
    UPDATE_SELECTED_POCKET,
    UPDATE_TRASH_SELECTED
  } from 'constants/ActionTypes';
  
  export const fetchAllPockets = (pockets) => {
    return {
      type: FETCH_ALL_POCKETS,
      payload: pockets
    };
  };
  export const fetchAllPocketsSuccess = (pockets) => {
    return {
      type: FETCH_ALL_POCKETS_SUCCESS,
      payload: pockets
    };
  };
  export const updatePocketsList = (pockets) => {
    return {
      type: UPDATE_POCKETS_LIST,
      payload: pockets
    };
  };

  export const updateSelectedPocket = (pocket) => {
    return {
      type: UPDATE_SELECTED_POCKET,
      payload: pocket
    };
  };

  export const updateTrashSelected = (pocket) => {
    return {
      type: UPDATE_TRASH_SELECTED,
      payload: pocket
    };
  };