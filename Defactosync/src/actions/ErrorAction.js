import {
    NODE_ERROR
  } from 'constants/ActionTypes';

  export const nodeError = (error) => {
    return {
      type: NODE_ERROR,
      payload: error
    };
  };