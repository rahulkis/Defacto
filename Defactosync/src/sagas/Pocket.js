import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { fetchAllPocketsSuccess } from 'actions/PocketAction';
import { FETCH_ALL_POCKETS } from 'constants/ActionTypes';
import { POCKETS_URLS } from 'constants/AppConst';
import { httpClient } from '../appUtility/Api';
import { showErrorToaster } from 'appUtility/commonFunction';

const fetchPockets = async (Data) => {
  return await httpClient.get(POCKETS_URLS.GET_ALL_POCKETS);
};

function* fetchPocketsList() {
  try {
    const response = yield call(fetchPockets);
    const pocketsList = response.data.data;
    yield put(fetchAllPocketsSuccess(pocketsList));
  } catch (error) {
    showErrorToaster(error);
  }
}

export function* updatePocketsList() {
  yield takeEvery(FETCH_ALL_POCKETS, fetchPocketsList);
}

export default function* rootSaga() {
  yield all([fork(updatePocketsList)]);
}