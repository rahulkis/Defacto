import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { SIGNIN_USER, SIGNOUT_USER, SIGNUP_USER } from "constants/ActionTypes";
import {
  showAuthMessage,
  userSignInSuccess,
  userSignOutSuccess,
  userSignUpSuccess,  
} from "actions/Auth";
import { httpClient } from "../appUtility/Api";
import { sendVerificationEmail } from "../appUtility/emailHelper";


const saveVerificationCode = async (email, code, type) => {
  return await httpClient.post("syncaddverificationcode/", {
    emailAddress: email,
    code: code,
    type: type,
  });
};

function* createUserWithEmailPassword({ payload }) {
  const { userData, emailTemplate, verificationCode } = payload;

  try {
    console.log("signupUsr", userData);
    const signUpUser = userData;   
    localStorage.setItem("login_user", JSON.stringify(signUpUser));
    localStorage.setItem("tokens", JSON.stringify(signUpUser.token));
    sendVerificationEmail(signUpUser.email, emailTemplate);
    const codeResponse = yield call(
      saveVerificationCode,
      signUpUser.email,
      verificationCode,
      "signup"
    );
    console.log(codeResponse);   
    yield put(userSignUpSuccess(signUpUser));
  } catch (error) {
    console.log(error.response);
    yield put(
      showAuthMessage(
        error.response.data.data.message || "Something went wrong!"
      )
    );
  }
}

function* signInUserWithEmailPassword({ payload }) {
  const { userData } = payload;
  try {
    console.log("loginUser", userData);
    const signUpUser = userData;
    localStorage.setItem("login_user", JSON.stringify(signUpUser));
    localStorage.setItem("tokens", JSON.stringify(signUpUser.token));
    yield put(userSignInSuccess(signUpUser));
  } catch (error) {
    console.log(error);
    yield put(showAuthMessage("Something went wrong!"));
  }
}

function* signOut() {
  try {
    localStorage.removeItem("tokens");
    localStorage.removeItem("login_user");
    yield put(userSignOutSuccess(signOutUser));
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser), fork(createUserAccount), fork(signOutUser)]);
}
