import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { fetchAllConnectionsSuccess } from 'actions/ConnectionAction';
import { FETCH_ALL_CONNECTIONS } from 'constants/ActionTypes';
import { CONNECTIONS_URLS } from 'constants/AppConst';
import { httpClient } from '../appUtility/Api';
import { showErrorToaster } from 'appUtility/commonFunction';

const fetchConnections = async (cliType) => {   
  return await httpClient.get(CONNECTIONS_URLS.GET_CONNNECTIONS_ECHOES_BY_CLI + `${cliType}`);
};

function* fetchConnectionsList({ payload }) {

  try {   
    console.log("bb",payload)
    const response = yield call(fetchConnections,payload);    
    const connectionsList = response.data.data;
    yield put(fetchAllConnectionsSuccess(connectionsList));
  } catch (error) {
    showErrorToaster(error);
  }
}

export function* updateConnectionsList() {
  yield takeEvery(FETCH_ALL_CONNECTIONS, fetchConnectionsList);
}

export default function* rootSaga() {
  yield all([fork(updateConnectionsList)]);
}
