
import {
    FETCH_ALL_POCKETS,
    FETCH_ALL_POCKETS_SUCCESS,
    UPDATE_POCKETS_LIST,
    UPDATE_TRASH_SELECTED,
    UPDATE_SELECTED_POCKET
  } from 'constants/ActionTypes';
  
  const INIT_STATE = {
    loader: false,
    allPockets: [],
    selectedPocket:'',
    trashSelected:false
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case FETCH_ALL_POCKETS: {
        return {
          ...state,
          loader: true,
        };
      }
      case FETCH_ALL_POCKETS_SUCCESS: {
        return {
          ...state,
          loader: false,
          allPockets: action.payload,
        };
      }
      case UPDATE_POCKETS_LIST: {
        return {
          ...state,
          allPockets: action.payload,
        };
      }

      case UPDATE_SELECTED_POCKET: {
        return {
          ...state,
          selectedPocket: action.payload,
        };
      }
      
      case UPDATE_TRASH_SELECTED: {
        return {
          ...state,
          trashSelected: action.payload,
        };
      }
      default:
        return state;
    }
  };
  