import {CLOSE_DRAWER, FETCH_ERROR, FETCH_START, FETCH_SUCCESS, TOGGLE_DRAWER} from "../constants/ActionTypes";

const INIT_STATE = {
  error: "",
  drawerState: false,
  loading: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_START: {
      return {...state, error: '', loading: true};
    }
    case FETCH_SUCCESS: {
      return {...state, error: '', loading: false};
    }
    case FETCH_ERROR: {
      return {...state, loading: false, error: action.payload};
    }
    case TOGGLE_DRAWER: {
      return {...state, drawerState: !state.drawerState};
    }
    case CLOSE_DRAWER: {
      return {...state, drawerState: false};
    }
    default:
      return state;
  }
}
