import { NODE_ERROR } from "constants/ActionTypes";

const INIT_STATE = {
  echoNodeError: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case NODE_ERROR:
      return {
        ...state,
        echoNodeError: action.payload.echoNodeError,
      };

    default:
      return state;
  }
};
