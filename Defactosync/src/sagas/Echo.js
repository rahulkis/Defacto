import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ToastsStore } from 'react-toasts';

import { UPDATE_ECHO_DATA, FETCH_ALL_ECHOS, FETCH_ALL_NODES, CHANGE_NODE_APP, ON_DELETE_SINGLE_ECHO_NODE } from 'constants/ActionTypes';
import { ECHO_URLS, NODES_URLS } from 'constants/AppConst';
import { fetchAllEchosSuccess, updateNodesList, loaderOnSelectEvent, showHideNodeSelector } from 'actions/EchoAction';
import { httpClient } from '../appUtility/Api';
import { showErrorToaster, sortArrayWithKey } from 'appUtility/commonFunction';

export const getPocket = (state) => state.pockets.selectedPocket;
export const getTrashSeleted = (state) => state.pockets.trashSelected;

const updateEchoPost = async (Data) => {
  return await httpClient.post(ECHO_URLS.ADD_UPDATE_ECHO, Data);
};

const fetchEchos = async () => {
  return await httpClient.get(ECHO_URLS.GET_ECHOS);
};

const fetchNodes = async (echoId) => {
  return await httpClient.get(NODES_URLS.GET_NODES_BY_ECHO_ID + `${echoId}`);
};

const addUpdateNode = async (nodeData) => {
  return await httpClient.post(NODES_URLS.ADD_UPDATE_NODE, nodeData);
};

const deleteNode = async (nodeId) => {
  return await httpClient.delete(NODES_URLS.DELETE_NODE_BY_ID+ `${nodeId}`);
};

function* updateEchoDetails({ payload }) {
  const echoData = { ...payload, method: 'update' };
  try {
    const response = yield call(updateEchoPost, echoData);
    
    if (response.status === 200) {
      const response = yield call(fetchEchos);
      const echosList = response.data.data;
      yield put(fetchAllEchosSuccess(echosList));
    }
    console.log(response);
  } catch (error) {
    ToastsStore.success(error.response.data.data.message || 'Something went wrong!');
  }
}


function* fetchEchosList() {
  try {
   
    const response = yield call(fetchEchos);
    const echosList = response.data.data;
    yield put(fetchAllEchosSuccess(echosList));
  } catch (error) {
    showErrorToaster(error);
  }
}

function* fetchAllNodes({ payload }) {
  const { echoId } = payload;
  try {
    const response = yield call(fetchNodes, echoId);
    console.log(response);
    // const echosList = response.data.data;
    // yield put(fetchAllEchosSuccess(echosList));
  } catch (error) {
    showErrorToaster(error);
  }
}

function* changeNodeApp({ payload }) {
  const nodeData = { ...payload };
  try {
    const response = yield call(addUpdateNode, nodeData);
    console.log("addttt",response)
    if (response.status === 200) {
      const response = yield call(fetchNodes, nodeData.echoId);
      const nodesList = response.data.data.length ? sortArrayWithKey(response.data.data, 'sortIndex') : [];
      yield put(loaderOnSelectEvent(false));
      yield put(updateNodesList(nodesList));
      yield put(showHideNodeSelector({show:false, nodeIndex: null}));
    }
  } catch (error) {
    showErrorToaster(error);
  }
}

function* deleteSingleEchoNode({ payload }) {
  const {id, echoId} = payload;
  try {
    const response = yield call(deleteNode, id);
    if (response.status === 200) {
      const response = yield call(fetchNodes, echoId);
      const nodesList = response.data.data.length ? sortArrayWithKey(response.data.data, 'sortIndex') : [];
      yield put(loaderOnSelectEvent(false));
      yield put(updateNodesList(nodesList));
      yield put(showHideNodeSelector({show:false, nodeIndex: null}));
    }
  } catch (error) {
    showErrorToaster(error);
  }
}

export function* updateEcho() {
  yield takeEvery(UPDATE_ECHO_DATA, updateEchoDetails);
}

export function* updateEchosList() {
  yield takeEvery(FETCH_ALL_ECHOS, fetchEchosList);
}

export function* getNodesList() {
  yield takeEvery(FETCH_ALL_NODES, fetchAllNodes);
}

export function* onChangeNodeApp() {
  yield takeEvery(CHANGE_NODE_APP, changeNodeApp);
}

export function* onDeleteEchoNode() {
  yield takeEvery(ON_DELETE_SINGLE_ECHO_NODE, deleteSingleEchoNode);
}

export default function* rootSaga() {
  yield all([fork(updateEcho), fork(updateEchosList), fork(onChangeNodeApp), fork(onDeleteEchoNode)]);
}
