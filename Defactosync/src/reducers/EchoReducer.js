import {
  HIDE_MESSAGE,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  FETCH_ALL_ECHOS,
  FETCH_ALL_ECHOS_SUCCESS,
  ON_SELECT_ECHO,
  SELECTED_ECHO_DATA,
  UPDATE_ECHO_DATA,
  UPDATE_NODES_LIST,
  CHANGE_NODE_APP,
  LOADER_ON_SELECT_EVENT,
  SHOW_HIDE_NODE_SELECTOR,
  ON_DELETE_SINGLE_ECHO_NODE,
  UPDATE_CHECKED_ECHOS ,
  UPDATE_SELECTED_ECHO_LIST
} from 'constants/ActionTypes';

const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  selectedEcho: '',
  allEchos: [],
  selectedEchosList: [],
  nodesList:[],  
  selectedNode: null,
  showEventLoader: false,
  nodeSelector:{show: false, nodeIndex: null},
  checkedEchos:[]
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_ECHOS: {
      return {
        ...state,
        loader: true,
      };
    }
    case FETCH_ALL_ECHOS_SUCCESS: {
      return {
        ...state,
        loader: false,
        allEchos: action.payload,
        selectedEchosList:action.payload
      };
    }

    case UPDATE_SELECTED_ECHO_LIST: {
      return {
        ...state,        
        selectedEchosList: action.payload,
      };
    }

    case ON_SELECT_ECHO: {
      return {
        ...state,
        loading: false,
        selectedEcho: action.payload,
      };
    }
    case UPDATE_ECHO_DATA: {
      return {
        ...state,
        loader: true,
        selectedEcho: action.payload,
      };
    }
    case SELECTED_ECHO_DATA: {
      return {
        ...state,
        loading: false,
        selectedEcho: action.payload,
      };
    }
    case UPDATE_CHECKED_ECHOS: {
      return {
        ...state,
        checkedEchos: action.payload,
      };
    }
    case UPDATE_NODES_LIST: {
      return {
        ...state,
        // loading: false,
        nodesList: action.payload,
      };
    }    
    case ON_DELETE_SINGLE_ECHO_NODE: {
      return {
        ...state,
        // loading: false,
        nodeId: action.payload,
      };
    }
    case CHANGE_NODE_APP: {
      return {
        ...state,
        // loading: false,
        selectedNode: action.payload,
      };
    }
    case LOADER_ON_SELECT_EVENT: {
      return {
        ...state,
        showEventLoader: action.payload
      };
    }
    case SHOW_HIDE_NODE_SELECTOR: {
      return {
        ...state,
        nodeSelector: action.payload,
        loader: false,
      };
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false,
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        loader: false,
      };
    }
    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true,
      };
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false,
      };
    }
    default:
      return state;
  }
};
