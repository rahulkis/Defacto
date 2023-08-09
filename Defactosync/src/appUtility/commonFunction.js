import { PostData, PutFileWithHeader } from "./requests";
import { AWS_BUCKET } from "../constants/AppConst";
import { ToastsStore } from "react-toasts";
import moment from "moment";
export async function SendEmail(ToAddresses, Subject, BodyText) {
  let objectMap = "";
  let FormModel = {
    ToAddresses: ToAddresses,
    BodyText: BodyText,
    Subject: Subject,
  };
  try {
    await PostData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/sendemailfromlambda",
      FormModel
    ).then((result) => {});
  } catch (err) {
    return objectMap;
  }
}

export async function UpdatePassword(email, password) {
  let updated = false;
  let FormModel = {
    emailAddress: email,
    password: password,
  };
  try {
    await PostData(
      "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/syncpasswordreset",
      FormModel
    ).then((result) => {
      if (result.statusCode === 200) {
        updated = true;
      } else {
        updated = false;
      }
    });
    return updated;
  } catch (err) {
    console.log("error occured while resetting password");
  }
}

//binary string to blob format
export const b64toBlob = (dataURI) => {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
};

//upload Image to the aws
export const UploadImage = async (file, folderName) => {
  let data = false;
  await PostData(
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getawssignedurl",
    {
      filename: folderName + "/" + file.name,
      filetype: file.type,
      bucketName: AWS_BUCKET.NAME,
      eventType: "putObject",
    }
  )
    .then(function(result) {
      const signedUrl = result.res;
      return PutFileWithHeader(signedUrl, file);
    })
    .then(function(result) {
      console.log("file uploaded");
      data = true;
    })
    .catch(function(err) {
      ToastsStore.error(
        "something went wrong while saving file to aws, try again"
      );
    });
  return data;
};

export const compareValues = (key, order = "asc") => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
};

export const showErrorToaster = (error) => {
  if (error.response && error.response.data.data) {
    ToastsStore.error(error.response.data.data.message);
  } else if (error.response && error.response.data.responseBody) {
    ToastsStore.error(error.response.data.responseBody.message);
  } else if (error.message) {
    ToastsStore.error(error.message);
  } else {
    ToastsStore.error("Something Went wrong");
  }
};

export const customFilter = (option, searchText) => {
  if (option.data.text.toLowerCase().includes(searchText.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

//Add your search logic here.
export const customFilterApps = (option, searchText) => {
  if (option.data.appName.toLowerCase().includes(searchText.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

//sort array with key
export const sortArrayWithKey = (dataArray, key) => {
  console.log("sortData", dataArray);
  if (dataArray.length > 0) {
    let sorrtedArray = dataArray.sort(function(a, b) {
      return b[key] - a[key];
    });
    let arr = sorrtedArray.reverse();

    //inserting  sorting index in sequence after any changes
    let k = 1;
    for (let i = 0; i < arr.length; i++) {
      arr[i].sortIndex = k;
      k++;
    }
    return arr;
  } else {
    return dataArray;
  }
};

//sort array with timestamp
export const sortArrayWithtimestamps = (dataArray) => {
  let sorrtedArray = dataArray.sort(function(a, b) {
    return moment(b.createdAt).format("X") - moment(a.createdAt).format("X");
  });
  return sorrtedArray.reverse();
};

export const isTokenExipred = () => {
  const token = localStorage.getItem("tokens");
  if (token) {
    const tokenData = JSON.parse(token);
    const { accessToken } = tokenData;
    if (accessToken) {
      const expiresAt = moment.unix(accessToken.expires).toDate();
      return moment(expiresAt).isBefore(moment());
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const isConnectionExpired = (lastUpdated, expireIn) => {
  return new Promise((resolve, reject) => {
    try {
      let tokenExpired = false;
      const connectionEstablishedAt = lastUpdated;
      let dateString = moment.unix(connectionEstablishedAt).format();
      dateString = moment(dateString)
        .add(expireIn, "seconds")
        .format();
      if (dateString < moment().format()) {
        tokenExpired = true;
      } else {
        tokenExpired = false;
      }
      resolve(tokenExpired);
    } catch (err) {
      reject(false);
    }
  });
};

// Authenticate Hash Info
export const authenticateUser = (user, password) => {
  let token = user + ":" + password;

  // Should i be encoding this value????? does it matter???
  // Base64 Encoding -> btoa
  let hash = btoa(token);

  return "Basic " + hash;
};

//ckean null,undefined and empty key from object
export const cleanObject = (obj) => {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
};

//convert query string to json format
export const queryStringToJson = (data) => {
  let qsData = JSON.parse(
    '{"' + decodeURI(data.replace(/&/g, '","').replace(/=/g, '":"')) + '"}'
  );
  let mainContent = {};
  let commonKey = "";

  Object.keys(qsData).map(function(key, index) {
    if (key.match(/\[[^\]]*]/g)) {
      commonKey = key.split("[")[0];
      if (!mainContent.hasOwnProperty(commonKey)) {
        mainContent[commonKey] = {};
      }
      mainContent[commonKey][key.match(/\[(.*?)\]/)[1]] = qsData[key];
    } else {
      mainContent[key] = qsData[key];
    }
  });
  return mainContent;
};

//rename key of the object
export const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};
const clone = (obj) => Object.assign({}, obj);

//remove empty params from url
export const removeParam = (sourceURL) => {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=");
      if (param[1] === "") {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
};

//array to object
export const arrayToObj = (array, fn) => {
  let arrList = [];
  let len = array.length;
  for (let i = 0; i < len; i++) {
    let item = fn(array[i], i, array);
    arrList.push(item);
  }
  return arrList;
};
