import {
  EMAIL_NOT_UNIQUE,
  LOGOUT_USER,
  UPDATE_NAME_TITLES,
  UPDATE_REGISTER_AS,
  USER_DATA
} from "../constants/ActionType";

const INIT_STATE = {
  register_as: [],
  titles: [],
  user: null,
  emailError: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_REGISTER_AS : {
      return {
        ...state,
        register_as: action.payload
      };
    }
    case UPDATE_NAME_TITLES : {
      return {
        ...state,
        titles: action.payload
      };
    }
    case EMAIL_NOT_UNIQUE : {
      return {
        ...state,
        emailError: action.payload
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
