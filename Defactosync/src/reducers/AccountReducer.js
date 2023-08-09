import {
  LOGOUT_USER,
  UPDATE_NAME_TITLES,
  USER_DATA
} from "../constants/ActionType";

const INIT_STATE = {
  titles: [],
  user: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case UPDATE_NAME_TITLES : {
      return {
        ...state,
        titles: action.payload
      };
    }
    case LOGOUT_USER: {
      return {...state, INIT_STATE};
    }
    case USER_DATA: {
      return {
        ...state,
        user: action.payload,
        error: "",
        loading: false
      };
    }
    default:
      return state;
  }
}
