import {all} from 'redux-saga/effects';
import authSagas from './Auth';
import echoSagas from './Echo';
import appEvent from './AppEvent';
import pocketSagas from './Pocket';
import connectionSagas from './connection';

export default function* rootSaga(getState) {
  yield all([  
    authSagas(),
    echoSagas(),
    appEvent(),
    pocketSagas(),
    connectionSagas()
  ]);
}
