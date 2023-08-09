import {
  GetImageAWS,
  PostData,
  GetFileAWS,
  PutFileWithHeader,
  DeleteImageAWS,
} from "../../src/stores/requests";
import FileSaver from "file-saver";
import { AWS_BUCKET } from "./constants";

export const arrayToObj = (array, fn) => {
  let arrList = [];
  let len = array.length;
  for (let i = 0; i < len; i++) {
    let item = fn(array[i], i, array);
    arrList.push(item);
  }
  return arrList;
};

export const calculateTime = (date_future) => {
  let updatedTime = "";
  let date_now = Date.parse(new Date());
  //get total seconds between the times
  let delta = Math.abs(date_future - date_now) / 1000;
  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;
  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  // what's left is seconds
  // let seconds = delta % 60; // in theory the modulus is not required
  if (days > 0) {
    updatedTime = days + " days";
  } else if (hours > 0) {
    updatedTime = hours + (hours === 1 ? " hour" : " hours");
  } else if (minutes > 0) {
    updatedTime = minutes + " minutes";
  } else {
    updatedTime = "few seconds";
  }
  return updatedTime;
};

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

// export function Evaluate(value) {

//   return eval(value);
// }

// Authenticate Hash Info
export const authenticateUser = (user, password) => {
  let token = user + ":" + password;

  // Should i be encoding this value????? does it matter???
  // Base64 Encoding -> btoa
  let hash = btoa(token);

  return "Basic " + hash;
};

//upload file to the aws
export const UploadFile = (file) => {
  PostData(
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getawssignedurl",
    {
      filename: "CustomPDF/" + file.name,
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
    })
    .catch(function(err) {
      alert("something went wrong while saving file to aws, try again");
      console.log(err);
    });
};

//get file from aws
export const GetFile = (fileName) => {
  PostData(
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getawssignedurl",
    {
      filename: "CustomPDF/" + fileName,
      bucketName: AWS_BUCKET.NAME,
      filetype: "application/pdf",
      eventType: "getObject",
    }
  )
    .then(function(result) {
      var signedUrl = result.res;
      return GetFileAWS(signedUrl);
    })
    .then(function(result) {
      var blob = new Blob([result], { type: "application/pdf" });
      FileSaver.saveAs(blob, fileName);
      console.log(result);
    })
    .catch(function(error) {
      if (error.message === "Request failed with status code 404") {
        console.log("file doesnot exist");
      } else {
        console.log(error.message);
      }
    });
};

//upload Image to the aws
export const UploadImage = async (file, folderName) => {
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
    })
    .catch(function(err) {
      alert("something went wrong while saving file to aws, try again");
      console.log(err);
    });
};

//get image from aws
export const GetImage = async (fileName) => {
  var data = "";
  await PostData(
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getawssignedurl",
    {
      filename: "FormImages/" + fileName,
      bucketName: AWS_BUCKET.NAME,
      filetype: "image/jpeg",
      eventType: "getObject",
    }
  )
    .then((result) => {
      var signedUrl = result.res;    
      return GetImageAWS(signedUrl);
    })
    .then((result) => {
      data = result;
    })
    .catch(function(error) {
      if (error.message === "Request failed with status code 404") {
        console.log("file doesnot exist");
      } else {
        console.log(error.message);
      }
    });
  return data;
};

//get image from aws
export const GetImageWithoutSignedUrl = async (fileName) => {
  let data = "";
  var signedUrl =
    "https://defactoform-objects.s3.amazonaws.com/FormImages/" + fileName;
  await GetImageAWS(signedUrl)
    .then((result) => {
      data = result;
    })
    .catch(function(error) {
      if (error.message === "Request failed with status code 404") {
        console.log("file doesnot exist");
      } else {
        console.log(error.message);
      }
    });
  return data;
};

//delete image from aws
export const DeleteImage = async (fileName,folderName) => {
  await PostData(
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getawssignedurl",
    {
      filename: folderName + "/" + fileName,
      bucketName: AWS_BUCKET.NAME,
      filetype: "image/jpeg",
      eventType: "deleteObject",
    }
  )
    .then((result) => {    
      var signedUrl = result.res;
      return DeleteImageAWS(signedUrl);
    })
    .then((result) => {
      console.log("Image deleted");
    })
    .catch(function(error) {
      if (error.message === "Request failed with status code 404") {
        console.log("file doesnot exist");
      } else {
        console.log(error.message);
      }
    });
};

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
