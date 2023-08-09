"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "sa-east-1" });

var lambda = new AWS.Lambda();

exports.handler = async (event, context) => {
  const docClient = new AWS.DynamoDB.DocumentClient({ region: "sa-east-1" });
  const headerToken = event.headers;
  console.log("event", event);
  const { eventType, cliType, commonInfo, nodeId, typeOf } = JSON.parse(
    event.body
  );

  let responseBody = {};
  let statusCode = 0;

  var rows = [];

  const getAllData = async (params) => {
    console.log("scan");
    const data = await docClient.scan(params).promise();
    if (data["Items"].length > 0) {
      rows = [...rows, ...data["Items"]];
    }

    if (data.LastEvaluatedKey) {
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      return await getAllData(params, rows);
    } else {
      return rows;
    }
  };

  const sortArrayWithtimestamps = (dataArray) => {
    return dataArray.sort(function(a, b) {
      return b.createdAt - a.createdAt;
    });
  };

  try {
    const params = {
      FunctionName: "SyncVerificationCodeAsync",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        token: headerToken["Authorization"],
      }),
    };

    const LambdaPromise = (params) => lambda.invoke(params).promise();

    const responseFromLambda2 = await LambdaPromise(params);

    if (responseFromLambda2.Payload) {
      let result = JSON.parse(responseFromLambda2.Payload);

      if (result.sub != undefined) {
        let params1 = {};

        let keyCondition = "";
        let filterExpression = "";
        let expressionAttribute = {};

        if (typeOf == "trigger") {
          (keyCondition =
            "eventType = :eventType,cliType =:cliType,commonInfo =:commonInfo,isTest =:isTest ,nodeId = :nodeId"),
            (filterExpression =
              "eventType = :eventType AND cliType =:cliType AND commonInfo =:commonInfo AND isTest =:isTest AND nodeId = :nodeId"),
            (expressionAttribute = {
              ":eventType": eventType,
              ":cliType": cliType,
              ":commonInfo": commonInfo,
              ":isTest": true,
              ":nodeId": nodeId,
            });
        } else {
          (keyCondition =
            "eventType = :eventType,cliType =:cliType,commonInfo =:commonInfo,isTest =:isTest ,nodeId = :nodeId"),
            (filterExpression =
              "eventType = :eventType AND cliType =:cliType AND commonInfo =:commonInfo AND isTest =:isTest AND nodeId = :nodeId"),
            (expressionAttribute = {
              ":eventType": eventType,
              ":cliType": cliType,
              ":commonInfo": commonInfo,
              ":isTest": true,
              ":nodeId": nodeId,
            });
        }

        if (typeOf == "trigger") {
          params1 = {
            TableName: "TableDsWebHookResponse",
            KeyConditionExpression: keyCondition,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttribute,
          };
        } else {
          params1 = {
            TableName: "TableDsActionResponses",
            KeyConditionExpression: keyCondition,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttribute,
          };
        }

        console.log("params1", params1);

        let data = await getAllData(params1);
        if (data.length == 0) {
          responseBody = { message: "No data available" };
          statusCode = 403;
        } else if (data.length >= 1) {
          data = sortArrayWithtimestamps(data);
          responseBody = data[0];
          statusCode = 200;
        }
      } else {
        responseBody = { message: "Invalid Token" };
        statusCode = 401;
      }
    } else {
      responseBody = { message: "Invalid Token" };
      statusCode = 401;
    }
  } catch (err) {
    responseBody = err.message;
    statusCode = 403;
  }
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ statusCode: statusCode, data: responseBody }),
  };
  return response;
};
