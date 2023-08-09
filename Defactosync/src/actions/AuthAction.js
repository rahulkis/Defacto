
import {cleanObject} from "../appUtility/Utils";

import {httpClient} from '../appUtility/Api';
import {
  EMAIL_NOT_UNIQUE,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  INIT_USER_DATA,
  USER_DATA
} from "../constants/ActionType";

const qs = require('qs');

export const signUpUser = ({title_id, fname, lname, email, password, role, registration_type_id, device_id}) => {
  console.log('signup data: ', {
    title_id: title_id,
    fname: fname,
    lname: lname,
    email: email,
    password: password,
    device_id,
    registration_type_id: registration_type_id,
    role: role,
  });
  return (dispatch) => {
    dispatch({type: FETCH_START});
    httpClient.post('user/signup',
      qs.stringify({
        title_id,
        fname,
        lname,
        device_id,
        email,
        password,
        registration_type_id,
        role,
      })
    ).then(({data}) => {
      console.log("data for user: ", data);
      if (data.code === 200) {
        httpClient.defaults.headers.common['Access-Token'] = data.data.access_token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: INIT_USER_DATA, payload: data.data.user});
        // AsyncStorage.setItem("access_token", data.data.access_token);
      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
        console.log("data.data.error", data.data.error)
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      setTimeout(() => {
        // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
      }, 200);
      console.log("Error****:", error.message);
    });
  }
};



export const resendVerificationMail = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    httpClient.get('user/resend-verification-email').then(({data}) => {
      console.log("Received data: ", data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        setTimeout(() => {
          // Snackbar.show({
          //   title: "Mail Send Successfully. Please check your mail and verify it",
          //   duration: Snackbar.LENGTH_LONG
          // });
        }, 200);

      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    }).catch((error) => {
      dispatch({type: FETCH_ERROR, payload: error.message});
      setTimeout(() => {
        // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
      }, 200);
      console.log("Error****:", error.message);
    });
  }
};

export const isMailVerified = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    httpClient.get('user/is-email-verified').then(({data}) => {
      console.log("data: ", data);
      dispatch({type: FETCH_SUCCESS});
      if (data.code === 200) {
        if (data.data.is_email_verified.toString() === '0') {
          setTimeout(() => {
            // Snackbar.show({title: "Please check your mail and verify it", duration: Snackbar.LENGTH_LONG});
          }, 200);
        } else {
          // Actions.pop();
          // Actions.reset("profileImageUpload");
        }
      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    }).catch((error) => {
      dispatch({type: FETCH_ERROR, payload: error.message});
      setTimeout(() => {
        // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
      }, 200);
      console.log("Error****:", error.message);
    });
  }
};

export const updateProfilePic = (data) => {
  const obj = cleanObject(data);
  console.log('Sending Data: ', obj);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    httpClient.post('user/update-basic-info',
      qs.stringify(obj)
    ).then(({data}) => {
      console.log("Received data: ", data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_DATA, payload: data.data});
        // AsyncStorage.setItem("user", JSON.stringify(data.data));
        setTimeout(() => {
          // Snackbar.show({title: "User Profile Pic has been uploaded successfully", duration: Snackbar.LENGTH_LONG});
        }, 200);
        // Actions.pop();
        // Actions.mediApp();
      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    }).catch((error) => {
      dispatch({type: FETCH_ERROR, payload: error.message});
      setTimeout(() => {
        // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
      }, 200);
      console.log("Error****:", error.message);
    });
  }
};


export const updateEmail = (data) => {
  const obj = cleanObject(data);
  console.log('Sending Data: ', obj);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    httpClient.post('user/update-email',
      qs.stringify(obj)
    ).then(({data}) => {
      console.log("Received data: ", data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_DATA, payload: data.data});
        setTimeout(() => {
          // Snackbar.show({title: "Email has been updated successfully", duration: Snackbar.LENGTH_LONG});
        }, 200);
      } else {
        dispatch({type: FETCH_ERROR, payload: data.data.error});
        setTimeout(() => {
          // Snackbar.show({title: data.data.error, duration: Snackbar.LENGTH_LONG});
        }, 200);
      }
    }).catch((error) => {
      dispatch({type: FETCH_ERROR, payload: error.message});
      setTimeout(() => {
        // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
      }, 200);
      console.log("Error****:", error.message);
    });
  }
};


export const updateUser = (user) => {
  return {
    type: USER_DATA,
    payload: user
  }
};


export const isEmailUnique = ({email}) => {

  console.log("user/is-email-unique", email)
  return (dispatch) => {
    httpClient.post('user/is-email-unique',
      qs.stringify({
        email: email,
      })
    ).then(({data}) => {
      console.log(data);
      if (data.code === 600) {
        dispatch({type: EMAIL_NOT_UNIQUE, payload: data.data.error});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      setTimeout(() => {
        // Snackbar.show({title: error.message, duration: Snackbar.LENGTH_LONG});
      }, 200);
      console.log("Error****:", error.message);
    });
  }
};

export const login = ({email, password, device_id}) => {
  console.log("Login Inside actions: ", email, password, device_id);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    httpClient.post('user/login',
      qs.stringify({
        email,
        password,
        device_id,
      })
    ).then(({data}) => {
      console.log(data);
      if (data.code === 200) {
        dispatch({type: FETCH_SUCCESS});
        httpClient.defaults.headers.common['Access-Token'] = data.data.access_token;
        // AsyncStorage.setItem("access_token", data.data.access_token);
        dispatch({type: INIT_USER_DATA, payload: data.data.user});
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

