
import {httpClient} from '../appUtility/Api'
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  UPDATE_USER_EMAIL,
  VERIFY_PHONE_CODE,
} from "../constants/ActionType";

const qs = require('qs');

export const sendVerificationEmail = (email) => {
  console.log("ak");
  console.log(codee.verifyCode);
  return (dispatch) => {
    httpClient.post('user/verification-code',
      qs.stringify({
        action: "add_phone_number",
        source: "sms", code: codee.verifyCode
      })
    ).then(({data}) => {
      console.log("updateTaggedUser: ", data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: VERIFY_PHONE_CODE, payload: data.data});
        // Actions.pop();
      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    })
      .catch(function (error) {
        dispatch({type: FETCH_ERROR, payload: error.message});
        setTimeout(() => {
          // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
        }, 200);
        console.log("Error****:", error.message);
      });
  }
};



export const updateUserEmail = (email, update) => {
  return (dispatch) => {
    httpClient.post('user/phone',
      qs.stringify({email})
    ).then(({data}) => {
      console.log("updateTaggedUser: ", data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: UPDATE_USER_EMAIL, payload: data.data});
        // Actions.pop();
        // Actions.checkEmail({email, update})
      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    })
      .catch(function (error) {
        dispatch({type: FETCH_ERROR, payload: error.message});
        setTimeout(() => {
          // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
        }, 200);
        console.log("Error****:", error.message);
      });
  }
};

export const updateUserPassword = (currentPasss, newPass, confirmPass) => {
  console.log(currentPasss);
  console.log(newPass);
  console.log(confirmPass);
  return (dispatch) => {
    httpClient.post('user/change-password',
      qs.stringify({
        old_password: currentPasss,
        new_password: newPass, confirm_password: confirmPass
      })
    ).then(({data}) => {
      console.log("updateTaggedUser: ", data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        setTimeout(() => {
          // Snackbar.show({title: "Successfully Changed", duration: Snackbar.LENGTH_LONG});
        }, 200);

      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    })
      .catch(function (error) {
        dispatch({type: FETCH_ERROR, payload: error.message});
        setTimeout(() => {
          // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
        }, 200);
        console.log("Error****:", error.message);
      });
  }
};





