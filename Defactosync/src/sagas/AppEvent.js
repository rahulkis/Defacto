import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { fetchAllAppsSuccess } from 'actions/AppEventAction';
import { FETCH_ALL_APPS } from 'constants/ActionTypes';
import { APPS_LIST_URL } from 'constants/AppConst';
import { httpClient } from '../appUtility/Api';
import { showErrorToaster } from 'appUtility/commonFunction';

const fetchApps = async (Data) => {
  return await httpClient.get(APPS_LIST_URL);
};

function* fetchAppsList() {
  try {
    const response = yield call(fetchApps);
    const appsList = response.data.data;
    yield put(fetchAllAppsSuccess(appsList));
  } catch (error) {
    showErrorToaster(error);
  }
}

export function* updateAppsList() {
  yield takeEvery(FETCH_ALL_APPS, fetchAppsList);
}

export default function* rootSaga() {
  yield all([fork(updateAppsList)]);
}
