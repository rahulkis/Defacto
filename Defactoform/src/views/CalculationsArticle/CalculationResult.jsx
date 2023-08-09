/* eslint-disable */
import { Parser } from "hot-formula-parser";
import math from "mathjs-expression-parser";
import dateformat from "dateformat";

export function CalculationResult(copyData, copyFormaulName, resultData) {
  switch (copyFormaulName) {
    case "add":
    case "numbers":
    case "subtract":
    case "multiply":
    case "divide":
    case "group":
      return eval(copyData);
    case "typingtext":
      return copyData.replace(/"/g, "");
    case "concatenate":
    case "booleans":
    case "not":
    case "and":
    case "or":
    case "equals":
    case "doesntequal":
    case "greaterthan":
    case "greaterorequal":
    case "lessthan":
    case "lessorequal":
    case "dateformat":
    case "dateadd":
    case "datesub":
    case "datediff":
    case "abs":
    case "pow":
    case "average":
    case "averageif":
    case "ceiling":
    case "convert":
    case "decimal":
    case "even":
    case "floor":
    case "int":
    case "large":
    case "odd":
    case "roman":
    case "round":
    case "rounddown":
    case "roundup":
    case "sign":
    case "small":
    case "sumif":
    case "trunc":
    case "andlogical":
    case "iflogical":
    case "iferrorlogical":
    case "notlogical":
    case "orlogical":
    case "switchlogical":
    case "xorlogical":
    case "firstlookup":
    case "lastlookup":
    case "getlookup":
    case "slicelookup":
    case "joinlookup":
    case "setlookup":
    case "pushlookup":
    case "reverselookup":
    case "unshiftlookup":
    case "includeslookup":
    case "filterlookup":
    case "maplookup":
    case "reducelookup":
    case "withoutlookup":
    case "args2arraylookup":
    case "arraylookup":
    case "chooselookup":
    case "matchlookup":
    case "uniquelookup":
    case "concatenatetext":
    case "exacttext":
    case "findtext":
    case "fixedtext":
    case "formattext":
    case "lefttext":
    case "lentext":
    case "lowertext":
    case "midtext":
    case "numberformattext":
    case "numbervaluetext":
    case "propertext":
    case "regexextracttext":
    case "regexmatchtext":
    case "regexreplacetext":
    case "replacetext":
    case "repttext":
    case "righttext":
    case "searchtext":
    case "splittext":
    case "substitutetext":
    case "textvaluetext":
    case "trimtext":
    case "uppertext":
    case "countstatistical":
    case "countnumbersstatistical":
    case "countifstatistical":
    case "countuniquestatistical":
    case "maxstatistical":
    case "medianstatistical":
    case "minstatistical":
    case "error":
    case "iserr":
    case "iseven":
    case "isnontext":
    case "isnumber":
    case "isodd":
    case "istext":
    case "answerpiping":
      return resultData;
    default:
      return "not found";
  }
}

export function DynamicCalculationResult(question) {
  let finalResult = "";

  if (/^-?\d*\.?\d*$/.test(question)) {
    finalResult = { iserror: false, result: "", actualFormula: "" };
    finalResult.actualFormula = question;
    finalResult.result = question;
    finalResult.iserror = false;
    return finalResult;
  } else if (
    question.includes(";") &&
    (!question.includes("DATE") && !question.includes("date")) &&
    (question.match(/;/g) || []).length > 1
  ) {
    // variables code
    // Get Question
    let inputText = "";
    inputText = GetQuestion(question);
    if (inputText === "the formula looks incomplete") {
      finalResult = { iserror: false, result: "", actualFormula: "" };
      finalResult.actualFormula = inputText;
      finalResult.result = inputText;
      finalResult.iserror = true;
      return finalResult;
    }
    // Call Execute Function
    if (inputText !== "") {
      finalResult = ExecuteCalculation(inputText);
    }
  } else {
    finalResult = ExecuteCalculation(question);
  }
  return finalResult;
}

export function ExecuteCalculation(question) {
  let finalResult = { iserror: false, result: "", actualFormula: "" };
  let calculation = "";
  try {
    let FormulaParser = new Parser();
    question = question.trim();
    if (
      question.includes("(") &&
      question.includes(")") &&
      !question.includes("DATE") &&
      !question.includes("date") &&
      question.match("[0-9]+")
    ) {
      question = question.replace(/ /g, "");
    }

    if (question.startsWith("not")) {
      let splitQuestion = question.split("not");

      let ans = eval(splitQuestion[1]);
      if (!ans) {
        finalResult.result = "formula looks incomplete";
        finalResult.iserror = true;
        return finalResult;
      }
      let result = !ans;
      if (question.search(/\bnot\b/) >= 0) {
        finalResult.actualFormula = result;
        finalResult.result = result;
        finalResult.iserror = false;
        return finalResult;
      } else {
        finalResult.result = "something went wrong";
        finalResult.iserror = true;
        return finalResult;
      }
    } else {
      calculation = FormulaParser.parse(question);
      if (calculation.error !== "#ERROR!" && calculation.result != null) {
        if (Array.isArray(calculation.result)) {
          finalResult.result = JSON.stringify(calculation.result);
          finalResult.actualFormula = JSON.stringify(calculation.result);
        } else {
          finalResult.result = calculation.result;
          finalResult.actualFormula = calculation.result;
        }
        finalResult.iserror = false;
        //--------------------------------------------------------------------------------------------------//
        //for COUNT-----------------------------------------------------------------------------------//
        if (
          ((question.startsWith("COUNT") || question.startsWith("count")) &&
            question.search(/\bCOUNT\b/) >= 0) ||
          question.search(/\bcount\b/) >= 0
        ) {
          let res = question;

          if (question.startsWith("COUNT")) {
            res = res.split("COUNT");
          } else if (question.startsWith("count")) {
            res = res.split("count");
          }

          if (res[0] !== "") {
            finalResult.result = "something wrong ";
            finalResult.iserror = true;
            return finalResult;
          }
          if (res[1] === "()") {
            finalResult.result = "0";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }

          if (res.length > 1) {
            let resResult;
            if (res[1].includes("ARGS2ARRAY")) {
              resResult = res[1].split("ARGS2ARRAY");
            } else if (res[1].includes("args2array")) {
              resResult = res[1].split("args2array");
            }
            resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

            if (resResult[1] === "()") {
              finalResult.result = "0";
              finalResult.iserror = false;
              return finalResult;
            }
            if (!balanced(res[1])) {
              finalResult.result = "formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }

            if (resResult.length > 1) {
              resResult[1] = resResult[1].replace(/[()]/g, "");

              let errorCheck = resResult[1].split(",");
              for (let i = 0; i < errorCheck.length; i++) {
                let ans = eval(errorCheck[i]);
                if (!ans && ans !== 0) {
                  finalResult.result = "something went wrong ";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }

              let finalValue = resResult[1].split(",");
              let array = finalValue;

              let count = 0;
              for (let i = 0; i < array.length; i++) {
                if (array[i]) {
                  count++;
                }
              }
              finalResult.actualFormula = count;
              finalResult.result = count;
              finalResult.iserror = false;
            }
          }
        }
        return finalResult;
      }

      //for first--------------------------------------------/
      else if (
        question.startsWith("FIRST") ||
        (question.startsWith("first") &&
          (question.match(/;/g) || []).length < 1)
      ) {
        let res = question;

        if (question.startsWith("FIRST")) {
          res = res.split("FIRST");
        } else if (question.startsWith("first")) {
          res = res.split("first");
        }
        if (res[1] === "()") {
          finalResult.result = "Empty results";
          finalResult.iserror = true;
          return finalResult;
        } else if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }
          resResult[1] = resResult[1].replace(/ /g, "");
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

          if (resResult[1] === "()") {
            finalResult.result = "Empty results";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            resResult[1] = resResult[1].substr(1, resResult[1].length - 2);
            let finalValue = resResult[1].split(",");
            for (let i = 0; i < finalValue.length; i++) {
              let ans = eval(finalValue[i]);

              if (!ans && ans !== 0) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              }
              finalResult.actualFormula = finalValue[0];
              finalResult.result = finalValue[0];
              finalResult.iserror = false;
            }
          }
        }
      }
      //----------------------------------------------------------------//
      //for Last-------------------------------------/
      else if (
        question.startsWith("LAST") ||
        (question.startsWith("last") && (question.match(/;/g) || []).length < 1)
      ) {
        let res = question;

        if (question.startsWith("LAST")) {
          res = res.split("LAST");
        } else if (question.startsWith("last")) {
          res = res.split("last");
        }
        if (res[1] === "()") {
          finalResult.result = "Empty results";
          finalResult.iserror = true;
          return finalResult;
        } else if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }
          resResult[1] = resResult[1].trim();
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

          if (resResult[1] === "()") {
            finalResult.result = "Empty results";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            resResult[1] = resResult[1].substr(1, resResult[1].length - 2);
            let finalValue = resResult[1].split(",");
            for (let i = 0; i < finalValue.length; i++) {
              let ans = eval(finalValue[i]);

              if (!ans && ans !== 0) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              }
              finalResult.actualFormula = finalValue[i];
              finalResult.result = finalValue[i];
              finalResult.iserror = false;
            }
          }
        }
      }
      //------------------------------------------------------------------------------------//
      //for get------------------------------------------------------------------------------//
      else if (question.startsWith("GET") || question.startsWith("get")) {
        let finalValue;
        question = question.replace(/ /g, "");

        let res = question;

        if (!balanced(question)) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (question.startsWith("GET")) {
          res = res.split("GET");
        } else if (question.startsWith("get")) {
          res = res.split("get");
        }
        if (res[1] === "()") {
          finalResult.result = "Empty results";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "Empty results";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            finalValue = resResult[1].split("),");
            if (finalValue.length > 1) {
              let array = finalValue[0].replace(/[()]/g, "").split(",");
              for (let i = 0; i < array.length; i++) {
                let ans = eval(array[i]);
                if (!ans && ans !== 0) {
                  finalResult.result = "formula incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              let lastvalue = finalValue[1].split(",");
              for (var i = 0; i < lastvalue.length; i++) {
                var ans = eval(lastvalue[i]);
                if (!ans && ans !== 0) {
                  finalResult.result = "formula incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              lastvalue = array[parseInt(lastvalue)];

              if (lastvalue != null) {
                lastvalue = lastvalue.replace(/["]/g, "");
              }

              finalResult.actualFormula = lastvalue;
              finalResult.result = lastvalue;
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = '""';
              finalResult.result = '""';
              finalResult.iserror = false;
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for slice-----------------------------------------------------------------------------------//
      else if (question.startsWith("SLICE") || question.startsWith("slice")) {
        let finalValue;
        question = question.replace(/ /g, "");

        let res = question;

        if (question.startsWith("SLICE")) {
          res = res.split("SLICE");
        } else if (question.startsWith("slice")) {
          res = res.split("slice");
        }
        if (res[1] === "()") {
          finalResult.result = "Empty results";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }

          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

          if (resResult[1] === "()") {
            finalResult.result = "Empty results";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult[0] !== "(") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let tempValue = resResult[1].substr(1, resResult[1].length - 6);
            finalValue = tempValue.split(",");

            let array = [];
            array = finalValue;
            let x = question;
            let splitvalue = x.split(",");
            let firstIndex = splitvalue[splitvalue.length - 1].replace(
              /[()]/g,
              ""
            );
            let secondIndex = splitvalue[splitvalue.length - 2].replace(
              /[()]/g,
              ""
            );
            let lastvalue = array.slice(
              parseInt(secondIndex),
              parseInt(firstIndex)
            );
            lastvalue = "[" + lastvalue + "]";
            finalResult.actualFormula = lastvalue;
            finalResult.result = lastvalue;
            finalResult.iserror = false;

            for (let i = 0; i < finalValue.length; i++) {
              let ans = eval(finalValue[i]);
              if (!lastvalue && ans) {
                finalResult.result = "";
                finalResult.iserror = false;
              }
              if (!ans && ans !== 0) {
                finalResult.result = "formula incomplete";
                finalResult.iserror = true;
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for JOIN-----------------------------------------------------------------------------------//
      else if (question.startsWith("JOIN") || question.startsWith("join")) {
        let resResult, splitResult, i, ans;

        let res = question;

        if (question.startsWith("JOIN")) {
          res = res.split("JOIN");
        } else if (question.startsWith("join")) {
          res = res.split("join");
        }
        if (res[1] === "()") {
          finalResult.result = "Empty results";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res.length > 1) {
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }

          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

          if (!balanced(resResult[1])) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult[1] === "()") {
            finalResult.result = "Empty results";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult[0] !== "(") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (resResult.length > 1) {
            splitResult = resResult[1].split("),");
            if (splitResult.length > 1) {
              let finalValue = splitResult[0].replace(/[()]/g, "").split(",");
              for (i = 0; i <= finalValue.length - 1; i++) {
                ans = eval(finalValue[i]);
                if (!ans) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              let finalValue1 = splitResult[1].split(",");
              for (i = 0; i <= finalValue1.length - 1; i++) {
                ans = eval(finalValue1[i]);
                if (ans === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              finalValue = finalValue.join(finalValue1[0]);
              finalValue = finalValue.replace(/["]/g, "");

              finalResult.actualFormula = finalValue;
              finalResult.result = finalValue;
              finalResult.iserror = false;
            } else {
              let splitResult = resResult[1].split(")");
              if (splitResult.length > 1 && splitResult[1] !== "") {
                let finalValue = splitResult[0].replace(/[()]/g, "").split(",");
                for (i = 0; i <= finalValue.length - 1; i++) {
                  ans = eval(finalValue[i]);
                  if (!ans) {
                    finalResult.result = "the formula looks incomplete";
                    finalResult.iserror = true;
                    return finalResult;
                  }
                }
                let finalValue1 = splitResult[1].split(",");
                for (i = 0; i <= finalValue1.length - 1; i++) {
                  ans = eval(finalValue1[i]);
                  if (ans === undefined) {
                    finalResult.result = "the formula looks incomplete";
                    finalResult.iserror = true;
                    return finalResult;
                  }
                }
                finalValue = finalValue
                  .join(finalValue1[0])
                  .replace(/["]/g, "");
                finalResult.actualFormula = finalValue;
                finalResult.result = finalValue;
                finalResult.iserror = false;
              } else {
                let finalValue = splitResult[0].replace(/[()",]/g, "");
                finalResult.actualFormula = finalValue;
                finalResult.result = finalValue;
                finalResult.iserror = false;
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for Fixed-----------------------------------------------------------------------------------//
      else if (question.startsWith("FIXED") || question.startsWith("fixed")) {
        let res = question;

        if (question.startsWith("FIXED")) {
          res = res.split("FIXED");
        } else if (question.startsWith("fixed")) {
          res = res.split("fixed");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          question = question.replace(/ /g, "");

          let lastvalue = question.substring(question.lastIndexOf(",") + 1);

          let lastvalue1 = lastvalue.replace(/[()]/g, "");

          let splitValue = question.split("(");

          let splitValue1 = parseInt(split(splitValue[1]));
          if (!splitValue1) {
            let fixedValue = splitValue[1].substr(0, splitValue[1].length - 1);
            fixedValue = fixedValue + ".00";
            finalResult.actualFormula = fixedValue;
            finalResult.result = fixedValue;
            finalResult.iserror = false;

            for (let i = 1; i <= 1; i++) {
              let ans = eval(res[i]);
              if (!ans) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
              }
            }
            return finalResult;
          }
          let splitValue2 = splitValue1.toFixed(lastvalue1);
          finalResult.actualFormula = splitValue2;
          finalResult.result = splitValue2;
          finalResult.iserror = false;

          function split(str) {
            let i = str.indexOf(",");
            if (i > 0) return str.slice(0, i);
          }
          for (let i = 1; i <= 1; i++) {
            var ans = eval(res[i]);
            if (!ans) {
              finalResult.result = "formula looks incomplete";
              finalResult.iserror = true;
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for NumberValue-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("NUMBERVALUE") ||
        question.startsWith("numbervalue")
      ) {
        question = question.replace(/ /g, "");
        let res = question;

        if (question.startsWith("NUMBERVALUE")) {
          res = res.split("NUMBERVALUE");
        } else if (question.startsWith("numbervalue")) {
          res = res.split("numbervalue");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }

        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          // let X = question;

          let splitValue = question.split("(");

          splitValue = splitValue[1].replace(/[()]/g, "");

          if (splitValue.trim() === "") {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          splitValue = splitValue.replace(/[^\d.]/g, "");

          if (splitValue === "") {
            splitValue = 0;
          }
          finalResult.actualFormula = splitValue;
          finalResult.result = splitValue;
          finalResult.iserror = false;

          for (let i = 0; i < res[1].length; i++) {
            ans = eval(res[1]);
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for PUSH-----------------------------------------------------------------------------------//
      else if (question.startsWith("PUSH") || question.startsWith("push")) {
        question = question.replace(/ /g, "");
        let res = question;

        if (question.startsWith("PUSH")) {
          res = res.split("PUSH");
        } else if (question.startsWith("push")) {
          res = res.split("push");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an Array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }

          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(resResult[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let replaceParenthesis = resResult[1].replace(/[(]/g, "");

            let splitValue = replaceParenthesis.split("),");
            if (splitValue.length <= 1) {
              splitValue[0] = splitValue[0].substr(0, splitValue[0].length - 1);
              let checkError = splitValue[0].split(",");
              {
                for (let i = 0; i < checkError.length; i++) {
                  let ans1 = eval(checkError[i]);
                  if (ans1 === undefined) {
                    finalResult.result = "the formula looks incomplete";
                    finalResult.iserror = true;
                    return finalResult;
                  }
                  finalResult.actualFormula = "[" + splitValue[0] + "]";
                  finalResult.result = "[" + splitValue[0] + "]";
                  finalResult.iserror = false;
                }
              }
            } else {
              let finalValue = splitValue[0].split(",");
              let finalValue1 = splitValue[1].split(",");
              finalValue.push(finalValue1);
              finalResult.actualFormula = "[" + finalValue + "]";
              finalResult.result = "[" + finalValue + "]";
              finalResult.iserror = false;

              for (let i = 0; i < finalValue1.length; i++) {
                let ans = eval(finalValue1[i]);
                if (ans === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              for (let i = 0; i < finalValue.length; i++) {
                let ans1 = eval(finalValue[i]);
                if (ans1 === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for Reverse-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("REVERSE") ||
        question.startsWith("reverse")
      ) {
        let splitValue, finalValue;
        question = question.replace(/ /g, "");

        let res = question;

        if (question.startsWith("REVERSE")) {
          res = res.split("REVERSE");
        } else if (question.startsWith("reverse")) {
          res = res.split("reverse");
        }

        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }

        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not Reversible";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }

          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (resResult.length > 1) {
            resResult[1] = resResult[1].substr(1);
            splitValue = resResult[1].split(")");
            if (splitValue[1] === "") {
              resResult[1] = resResult[1].replace(/[()]/g, "");
              finalValue = resResult[1].split(",");
              for (let i = 0; i < finalValue.length; i++) {
                let ans = eval(finalValue[i]);
                if (ans === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              finalValue.reverse();
              finalResult.actualFormula = "[" + finalValue + "]";
              finalResult.result = "[" + finalValue + "]";
              finalResult.iserror = false;
            } else {
              if (splitValue[1].substr(splitValue[1].length - 1) === ",") {
                finalResult.result = "the formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              } else {
                finalValue = splitValue[0].split(",");
                finalValue.reverse();
                finalResult.actualFormula = "[" + finalValue + "]";
                finalResult.result = "[" + finalValue + "]";
                finalResult.iserror = false;
              }
            }
          } else {
            finalResult.actualFormula = finalValue;
            finalResult.result = finalValue;
            finalResult.iserror = false;
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for Reverse-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("NUMBERFORMAT") ||
        question.startsWith("numberformat")
      ) {
        let res = question;

        if (question.startsWith("NUMBERFORMAT")) {
          res = res.split("NUMBERFORMAT");
        } else if (question.startsWith("numberformat")) {
          res = res.split("numberformat");
        }

        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "#VALUE";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          res[1] = res[1].replace(/[()]/g, "");

          function formatMoney(
            amount,
            thousands = "",
            decimal = "",
            prefix = "",
            suffix = "",
            decimalCount = 2
          ) {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(
              (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
            ).toString();
            let j = i.length > 3 ? i.length % 3 : 0;

            return (
              prefix +
              negativeSign +
              (j ? i.substr(0, j) + thousands : "") +
              i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
              (decimalCount
                ? decimal +
                  Math.abs(amount - i)
                    .toFixed(decimalCount)
                    .slice(2) +
                  suffix
                : "")
            );
          }

          let str = res[1];
          str = str.replace(/'/g, '"');

          let arr = str.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

          arr = arr || [];
          for (let i = 0; i <= arr.length; i++) {
            let ans = eval(arr[i]);
          }
          let NumberFormatResult = "";
          if (arr.length === 1) {
            NumberFormatResult = formatMoney(arr[0]).replace(/\"/g, "");
            finalResult.actualFormula = NumberFormatResult;
            finalResult.result = NumberFormatResult;
            finalResult.iserror = false;
          } else if (arr.length === 2) {
            NumberFormatResult = formatMoney(arr[0], arr[1]).replace(/\"/g, "");
            finalResult.actualFormula = NumberFormatResult;
            finalResult.result = NumberFormatResult;
            finalResult.iserror = false;
          } else if (arr.length === 3) {
            NumberFormatResult = formatMoney(arr[0], arr[1], arr[2]).replace(
              /\"/g,
              ""
            );
            finalResult.actualFormula = NumberFormatResult;
            finalResult.result = NumberFormatResult;
            finalResult.iserror = false;
          } else if (arr.length === 4) {
            NumberFormatResult = formatMoney(
              arr[0],
              arr[1],
              arr[2],
              arr[3]
            ).replace(/\"/g, "");
            finalResult.actualFormula = NumberFormatResult;
            finalResult.result = NumberFormatResult;
            finalResult.iserror = false;
          } else if (arr.length === 5 || arr.length > 5) {
            NumberFormatResult = formatMoney(
              arr[0],
              arr[1],
              arr[2],
              arr[3],
              arr[4]
            ).replace(/\"/g, "");
            finalResult.actualFormula = NumberFormatResult;
            finalResult.result = NumberFormatResult;
            finalResult.iserror = false;
          }

          if (!arr[0].includes(".")) {
            if (arr.length > 2) {
              let ind = NumberFormatResult.indexOf(arr[2].replace(/\"/g, ""));
              let tt = NumberFormatResult.substring(0, ind);
              NumberFormatResult = tt;
              if (arr.length === 5) {
                NumberFormatResult = tt + arr[4].replace(/\"/g, "");
              }
            }
            finalResult.actualFormula = NumberFormatResult;
            finalResult.result = NumberFormatResult;
            finalResult.iserror = false;
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for Unshift-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("UNSHIFT") ||
        question.startsWith("unshift")
      ) {
        question = question.replace(/ /g, "");

        let res = question;

        if (question.startsWith("UNSHIFT")) {
          res = res.split("UNSHIFT");
        } else if (question.startsWith("unshift")) {
          res = res.split("unshift");
        }

        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an Array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }

          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(resResult[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].replace(/[(]/g, "");

            let finalValue = splitValue.split("),");
            if (finalValue.length <= 1) {
              finalValue[0] = finalValue[0].substr(0, finalValue[0].length - 1);
              let errorCheck = finalValue[0].split(",");
              {
                for (let i = 0; i < errorCheck.length; i++) {
                  let ans1 = eval(errorCheck[i]);
                  if (ans1 === undefined) {
                    finalResult.result = "the formula looks incomplete";
                    finalResult.iserror = true;
                    return finalResult;
                  }
                  finalResult.actualFormula = "[" + finalValue[0] + "]";
                  finalResult.result = "[" + finalValue[0] + "]";
                  finalResult.iserror = false;
                }
              }
            } else {
              let finalValue1 = finalValue[0].split(",");
              let finalValue2 = finalValue[1].split(",");
              finalValue1.unshift(finalValue2);
              finalResult.actualFormula = "[" + finalValue1 + "]";
              finalResult.result = "[" + finalValue1 + "]";
              finalResult.iserror = false;

              for (let i = 0; i < finalValue2.length; i++) {
                let ans = eval(finalValue2[i]);
                if (ans === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              for (let i = 0; i < finalValue1.length; i++) {
                let ans1 = eval(finalValue1[i]);
                if (ans1 === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for Unshift-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("INCLUDES") ||
        question.startsWith("includes")
      ) {
        let finalValue = "false";

        question = question.replace(/ /g, "");

        let res = question;

        if (question.startsWith("INCLUDES")) {
          res = res.split("INCLUDES");
        } else if (question.startsWith("includes")) {
          res = res.split("includes");
        }

        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an Array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }

          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(resResult[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let replaceParenthesis = resResult[1].replace(/[(]/g, "");

            let splitValue = replaceParenthesis.split("),");

            if (splitValue.length > 1) {
              let splitValue1 = splitValue[0].split(",");
              let splitValue2 = splitValue[1].substr(1);
              splitValue2 = splitValue[1].split(",");
              for (let i = 0; i <= splitValue2.length - 1; i++) {
                let finalValue1 = splitValue1.includes(splitValue2[i]);
                finalValue = finalValue && finalValue1;
              }
              for (let i = 0; i < splitValue1.length; i++) {
                let ans1 = eval(splitValue1[i]);
                if (ans1 === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              for (let i = 0; i < splitValue2.length; i++) {
                let ans1 = eval(splitValue2[i]);
                if (ans1 === undefined) {
                  finalResult.result = "the formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
                finalResult.actualFormula = finalValue;
                finalResult.result = finalValue;
                finalResult.iserror = false;
              }
            } else {
              splitValue[0] = splitValue[0].substr(0, splitValue[0].length - 1);
              let splitValue1 = splitValue[0].split(",");
              {
                for (let i = 0; i < splitValue1.length; i++) {
                  let ans1 = eval(splitValue1[i]);
                  if (ans1 === undefined) {
                    finalResult.result = "the formula looks incomplete";
                    finalResult.iserror = true;
                    return finalResult;
                  }
                  finalResult.result = true;
                  finalResult.iserror = false;
                }
              }
            }
          }
        }
      }
      //----------------------------------------------------------------//
      //for TEXTVALUE-------------------------------------/
      else if (
        question.startsWith("TEXTVALUE") ||
        question.startsWith("textvalue")
      ) {
        let res = question;

        if (question.startsWith("TEXTVALUE")) {
          res = res.split("TEXTVALUE");
        } else if (question.startsWith("textvalue")) {
          res = res.split("textvalue");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "#VALUE";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          // let X = question;

          let splitValue = question.split("(");

          splitValue = splitValue[1].replace(/[()]/g, "");
          splitValue = splitValue.replace(/"/g, "'");

          finalResult.actualFormula = "'" + splitValue + "'";
          finalResult.result = "'" + splitValue + "'";
          finalResult.iserror = false;

          let ContainsString = isNumeric(splitValue.replace(/"/g, "'"));

          function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
          }

          if (!ContainsString) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for COUNTNUMBERS-----------------------------------------------------------------------------------//
      else if (
        ((question.startsWith("COUNTNUMBERS") ||
          question.startsWith("countnumbers")) &&
          question.search(/\bCOUNTNUMBERS\b/) >= 0) ||
        question.search(/\bcountnumbers\b/) >= 0
      ) {
        let res = question;

        if (question.startsWith("COUNTNUMBERS")) {
          res = res.split("COUNTNUMBERS");
        } else if (question.startsWith("countnumbers")) {
          res = res.split("countnumbers");
        }

        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "0";
          finalResult.iserror = false;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARGS2ARRAY")) {
            resResult = res[1].split("ARGS2ARRAY");
          } else if (res[1].includes("args2array")) {
            resResult = res[1].split("args2array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);

          if (resResult[1] === "()") {
            finalResult.result = "0";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }

          if (resResult.length > 1) {
            resResult[1] = resResult[1].replace(/[()]/g, "");

            let checkError = resResult[1].split(",");
            for (let i = 0; i < checkError.length; i++) {
              let ans = eval(checkError[i]);
              if (ans === undefined) {
                finalResult.result = "something went wrong ";
                finalResult.iserror = true;
                return finalResult;
              }
            }
            let finalValue = resResult[1].split`,`.map(Number);
            let array = finalValue;

            let count = 0;
            for (let i = 0; i < array.length; i++) {
              if (Number.isFinite(array[i])) {
                count++;
              }
            }
            finalResult.actualFormula = count;
            finalResult.result = count;
            finalResult.iserror = false;
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for FORMAT-----------------------------------------------------------------------------------//
      else if (question.startsWith("FORMAT") || question.startsWith("format")) {
        let res = question;

        if (question.startsWith("FORMAT")) {
          res = res.split("FORMAT");
        } else if (question.startsWith("format")) {
          res = res.split("format");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "#VALUE";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          res[1] = res[1].replace(/[()]/g, "");

          let string = res[1];
          let total = string.length;
          let index = string.indexOf('",');

          let str = string.substring(0, index);

          let str1 = string.substring(index + 2, total);
          str1 = str1.split(",");

          let outputresult = str;
          for (let i = 1; i <= 1; i++) {
            let ans = eval(string);
          }

          for (let i = 0; i < str1.length; i++) {
            if (str1.length > 1) {
              outputresult = outputresult
                .replace("{}", str1[i])
                .replace(/["']/g, "");
            } else {
              outputresult = outputresult
                .replace("{}", str1[i])
                .replace(/["']/g, "");
            }
          }
          outputresult = outputresult.replace(/[{}]/g, "");
          finalResult.actualFormula = outputresult;
          finalResult.result = outputresult;
          finalResult.iserror = false;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for FILTER-----------------------------------------------------------------------------------//
      else if (question.startsWith("FILTER") || question.startsWith("FILTER")) {
        let res, finalValue;
        question = question.replace(/ /g, "");

        if (question.startsWith("FILTER")) {
          res = question.split("FILTER");
        } else if (question.startsWith("filter")) {
          res = question.split("filter");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARGS2ARRAY")) {
            resResult = res[1].split("ARGS2ARRAY");
          } else if (res[1].includes("args2array")) {
            resResult = res[1].split("args2array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].split("),");
            if (splitValue.length <= 1) {
              for (let i = 0; i <= splitValue.length; i++) {
                let ans = eval(splitValue[i]);
              }
              finalResult.result = "[]";
              finalResult.iserror = false;
            } else {
              splitValue[0] = splitValue[0].replace(/[()]/g, "");
              for (let i = 0; i <= splitValue.length; i++) {
                let ans = eval(splitValue[i]);
              }
              splitValue[0] = splitValue[0].split`,`.map(Number);
              let item = splitValue[0];
              let formula = splitValue[1].replace(/\"/g, "");

              if (formula.startsWith("=")) {
                formula = formula.substr(1);
                function checkAdult(item) {
                  return eval(formula.replace(/\"/g, ""));
                }
                finalValue = item.filter(checkAdult);
                finalResult.actualFormula = "[" + finalValue + "]";
                finalResult.result = "[" + finalValue + "]";
                finalResult.iserror = false;
              } else {
                try {
                  function checkAdult(item) {
                    return eval(formula.replace(/\"/g, ""));
                  }
                  finalValue = item.filter(checkAdult);
                  finalResult.actualFormula = "[" + finalValue + "]";
                  finalResult.result = "[" + finalValue + "]";
                  finalResult.iserror = false;
                } catch {
                  finalResult.result = "[]";
                  finalResult.iserror = false;
                }
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for MAP-----------------------------------------------------------------------------------//
      else if (question.startsWith("MAP") || question.startsWith("map")) {
        let res, finalValue;
        question = question.replace(/ /g, "");
        if (question.startsWith("MAP")) {
          res = question.split("MAP");
        } else if (question.startsWith("map")) {
          res = question.split("map");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARGS2ARRAY")) {
            resResult = res[1].split("ARGS2ARRAY");
          } else if (res[1].includes("args2array")) {
            resResult = res[1].split("args2array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].split("),");
            if (splitValue.length <= 1) {
              for (let i = 0; i <= splitValue.length; i++) {
                let ans = eval(splitValue[i]);
              }
              finalResult.result = "[]";
              finalResult.iserror = false;
            } else {
              splitValue[0] = splitValue[0].replace(/[()]/g, "");
              for (let i = 0; i <= splitValue.length; i++) {
                let ans = eval(splitValue[i]);
              }
              splitValue[0] = splitValue[0].split`,`.map(Number);
              let item = splitValue[0];
              let formula = splitValue[1].replace(/\"/g, "");
              if (formula.startsWith("=")) {
                try {
                  formula = formula.substr(1);
                  function checkAdult(item) {
                    return eval(formula.replace(/\"/g, ""));
                  }
                  finalValue = item.map(checkAdult);
                  finalResult.actualFormula = "[" + finalValue + "]";
                  finalResult.result = "[" + finalValue + "]";
                  finalResult.iserror = false;
                } catch {
                  finalResult.result = "[]";
                  finalResult.iserror = false;
                }
              } else {
                try {
                  function checkAdult(item) {
                    return eval(formula.replace(/\"/g, ""));
                  }
                  bc = item.map(checkAdult);
                  finalResult.actualFormula = "[" + finalValue + "]";
                  finalResult.result = "[" + finalValue + "]";
                  finalResult.iserror = false;
                } catch {
                  finalResult.result = "[]";
                  finalResult.iserror = false;
                }
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for REDUCE-----------------------------------------------------------------------------------//
      else if (question.startsWith("REDUCE") || question.startsWith("reduce")) {
        let res, finalValue;
        question = question.replace(/ /g, "");

        if (question.startsWith("REDUCE")) {
          res = question.split("REDUCE");
        } else if (question.startsWith("reduce")) {
          res = question.split("reduce");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARGS2ARRAY")) {
            resResult = res[1].split("ARGS2ARRAY");
          } else if (res[1].includes("args2array")) {
            resResult = res[1].split("args2array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].split("),");
            if (splitValue.length <= 1) {
              for (let i = 0; i <= splitValue.length; i++) {
                let ans = eval(splitValue[i]);
              }
              finalResult.result = "[]";
              finalResult.iserror = false;
            } else {
              splitValue[0] = splitValue[0].replace(/[()]/g, "");
              for (let i = 0; i <= splitValue.length; i++) {
                let ans = eval(splitValue[i]);
              }
              splitValue[0] = splitValue[0].split`,`.map(Number);
              let item = splitValue[0];
              let formula = splitValue[1].replace(/\"/g, "");
              let splitValue1 = formula.split(",");
              if (splitValue1.length <= 1) {
                if (formula.startsWith("=")) {
                  try {
                    function checkAdult(result, item) {
                      return eval(formula.replace(/\"/g, ""));
                    }
                    finalValue = item.reduce(checkAdult, 0);
                    finalResult.actualFormula = finalValue;
                    finalResult.result = finalValue;
                    finalResult.iserror = false;
                  } catch {
                    finalResult.result = "[]";
                    finalResult.iserror = false;
                  }
                } else {
                  try {
                    function checkAdult(result, item) {
                      return eval(formula.replace(/\"/g, ""));
                    }
                    finalValue = item.reduce(checkAdult, 0);
                    finalResult.actualFormula = finalValue;
                    finalResult.result = finalValue;
                    finalResult.iserror = false;
                  } catch {
                    finalResult.result = "[]";
                    finalResult.iserror = false;
                  }
                }
              } else {
                if (formula.startsWith("=")) {
                  try {
                    function checkAdult(result, item) {
                      return eval(splitValue1[0].replace(/\"/g, ""));
                    }
                    finalValue =
                      item.reduce(checkAdult, 0) + parseInt(splitValue1[1]);
                    finalResult.actualFormula = finalValue;
                    finalResult.result = finalValue;
                    finalResult.iserror = false;
                  } catch {
                    finalResult.result = "[]";
                    finalResult.iserror = false;
                  }
                } else {
                  try {
                    function checkAdult(result, item) {
                      return eval(splitValue1[0].replace(/\"/g, ""));
                    }
                    finalValue =
                      item.reduce(checkAdult, 0) + parseInt(splitValue1[1]);
                    finalResult.actualFormula = finalValue;
                    finalResult.result = finalValue;
                    finalResult.iserror = false;
                  } catch {
                    finalResult.result = "[]";
                    finalResult.iserror = false;
                  }
                }
              }
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for WITHOUT-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("WITHOUT") ||
        question.startsWith("without")
      ) {
        let res;
        question = question.replace(/ /g, "");

        if (question.startsWith("WITHOUT")) {
          res = question.split("WITHOUT");
        } else if (question.startsWith("without")) {
          res = question.split("without");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not an array";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARGS2ARRAY")) {
            resResult = res[1].split("ARGS2ARRAY");
          } else if (res[1].includes("args2array")) {
            resResult = res[1].split("args2array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].split("),");

            splitValue[0] = splitValue[0].replace(/[()]/g, "");
            let checkError = splitValue[0].split(",");
            for (let i = 0; i < checkError.length; i++) {
              let ans = eval(checkError[i]);
              if (ans === undefined) {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }
            }

            if (splitValue.length > 1) {
              let checkError1 = splitValue[1].split(",");
              for (let i = 0; i < checkError1.length; i++) {
                let ans = eval(checkError1[i]);
                if (ans === undefined) {
                  finalResult.result = "something went wrong";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              function removeFromArray(original, checkError1) {
                return original.filter((value) => !checkError1.includes(value));
              }
              let finalValue = removeFromArray(checkError, checkError1);
              finalResult.actualFormula = "[" + finalValue + "]";
              finalResult.result = "[" + finalValue + "]";
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = "[" + splitValue[0] + "]";
              finalResult.result = "[" + splitValue[0] + "]";
              finalResult.iserror = false;
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for XOR-----------------------------------------------------------------------------------//
      else if (question.startsWith("XOR") || question.startsWith("xor")) {
        let finalValue = "";
        let rs = "";
        if (question.startsWith("XOR")) {
          rs = question.split("XOR");
        } else if (question.startsWith("xor")) {
          rs = question.split("xor");
        }

        if (!balanced(rs[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
        if (rs[1] === "()") {
          finalResult.result = "false";
          finalResult.iserror = false;
          return finalResult;
        }
        if (rs.length > 1 && rs[1].includes("(") && rs[1].includes(")")) {
          rs[1] = rs[1].trim();

          rs[1] = rs[1].replace(/[()]/g, "");
          let splitValue = rs[1].split(",");
          for (let i = 0; i <= splitValue.length - 1; i++) {
            let ans = eval(splitValue[i]);
            if (ans === undefined) {
              finalResult.result = "formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
            finalValue = finalValue ^ ans;
          }
          if (finalValue === 1) {
            finalResult.actualFormula = true;
            finalResult.result = true;
            finalResult.iserror = false;
          } else {
            finalResult.actualFormula = false;
            finalResult.result = false;
            finalResult.iserror = false;
          }
        } else {
          finalResult.result = "something went wrong in your formula";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for MATCH-----------------------------------------------------------------------------------//
      else if (question.startsWith("MATCH") || question.startsWith("match")) {
        let res;
        question = question.replace(/ /g, "");

        if (question.startsWith("MATCH")) {
          res = question.split("MATCH");
        } else if (question.startsWith("match")) {
          res = question.split("match");
        }

        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Not found";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(res[1])) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARGS2ARRAY")) {
            resResult = res[1].split("ARGS2ARRAY");
          } else if (res[1].includes("args2array")) {
            resResult = res[1].split("args2array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "0";
            return finalResult;
          }
          if (!balanced(res[1])) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].split("),");
            resResult[1] = resResult[1].replace(/[()]/g, "");
            let d = resResult[1].split(",");
            for (let i = 0; i < d.length; i++) {
              let ans = eval(d[i]);
              if (ans === undefined) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              }
            }

            let answer = splitValue[0]
              .replace(/[()]/g, "")
              .replace(/["']/g, "");

            answer = answer.split(",");

            let formula = splitValue[1].replace(/["']/g, "");
            formula = splitValue[1].split(",");
            formula[0] = formula[0].replace(/["']/g, "");
            function checkAdult(age) {
              return age === formula[0];
            }
            let finalValue = answer.findIndex(checkAdult) + 1;
            finalResult.actualFormula = finalValue;
            finalResult.result = finalValue;
            finalResult.iserror = false;
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for ARRAY-----------------------------------------------------------------------------------//
      else if (question.startsWith("ARRAY") || question.startsWith("array")) {
        let res;
        let value = "";
        let finalValue = "";
        question = question.replace(/ /g, "");
        if (
          question.search(/\bARGS2\b/) >= 0 ||
          question.search(/\bargs2\b/) >= 0
        ) {
          finalResult.result = "something went wrong";
          finalResult.iserror = true;
          return finalResult;
        }
        if (question.startsWith("ARRAY")) {
          res = question.split("ARRAY");

          if (res[0] !== "") {
            finalResult.result = "something wrong ";
            finalResult.iserror = true;
            return finalResult;
          }
          if (res[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(question)) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }

          if (res.length === 2) {
            let value = res[1];
            value = value.replace(/[()]/g, "");

            let arr = value.split(",");
            for (let i = 0; i < arr.length; i++) {
              let array;
              if (arr[i].includes("ARGS2ARRAY")) {
                array = arr[i].split("ARGS2ARRAY");
                arr[i] = array;
              }
              if (arr[i].includes("args2array")) {
                array = arr[i].split("args2array");
                arr[i] = array;
              }
            }
            for (let i = 0; i < arr.length; i++) {
              let ans = eval(arr[i]);
              if (ans === undefined) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              }
            }
            finalResult.actualFormula = "[" + arr + "]";
            finalResult.result = "[" + arr + "]";
            finalResult.iserror = false;
          } else if (res.length > 2) {
            for (let i = 1; i < res.length; i++) {
              value = value + res[i];
            }
            value = value.toString(); //.replace(/[()]/g, "");

            var arr = value.split(",");
            for (let i = 0; i < arr.length; i++) {
              let array;
              if (arr[i].search(/\bARGS2\b/) >= 0) {
                array = arr[i].split("ARGS2");
                arr[i] = array[1];
              } else if (arr[i].search(/\bargs2array\b/) >= 0) {
                array = arr[i].split("args2array");
                arr[i] = array[1];
              }
              arr[i] = arr[i].replace(/[()]/g, "");
            }
          }
          for (let i = 0; i < arr.length; i++) {
            let ans = eval(arr[i]);
            if (ans === undefined) {
              finalResult.result = "formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          finalValue = finalValue + arr;
          finalResult.actualFormula = "[" + finalValue + "]";
          finalResult.result = "[" + finalValue + "]";
          finalResult.iserror = false;
        } else if (question.startsWith("array")) {
          res = question.split("array");

          if (res[0] !== "") {
            finalResult.result = "something wrong ";
            finalResult.iserror = true;
            return finalResult;
          }
          if (res[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!balanced(question)) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }

          if (res.length === 2) {
            let value = res[1];
            value = value.replace(/[()]/g, "");

            let arr = value.split(",");
            for (let i = 0; i < arr.length; i++) {
              let array;
              if (arr[i].includes("ARGS2ARRAY")) {
                array = arr[i].split("ARGS2ARRAY");
                arr[i] = array;
              }
              if (arr[i].includes("args2array")) {
                array = arr[i].split("args2array");
                arr[i] = array;
              }
            }
            for (let i = 0; i < arr.length; i++) {
              let ans = eval(arr[i]);
              if (ans === undefined) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              }
            }
            finalResult.actualFormula = "[" + arr + "]";
            finalResult.result = "[" + arr + "]";
            finalResult.iserror = false;
          } else if (res.length > 2) {
            for (let i = 1; i < res.length; i++) {
              value = value + res[i];
            }
            value = value.toString(); //.replace(/[()]/g, "");

            let arr = value.split(",");
            for (let i = 0; i < arr.length; i++) {
              let ar;
              if (arr[i].search(/\bargs2\b/) >= 0) {
                array = arr[i].split("args2");
                arr[i] = ar[1];
              } else if (arr[i].search(/\bARGS2ARRAY\b/) >= 0) {
                array = arr[i].split("ARGS2ARRAY");
                arr[i] = array[1];
              }

              arr[i] = arr[i].replace(/[()]/g, "");
            }
          }
          for (let i = 0; i < arr.length; i++) {
            let ans = eval(arr[i]);
            if (ans === undefined) {
              finalResult.result = "formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          finalValue = finalValue + arr;
          finalResult.actualFormula = "[" + finalValue + "]";
          finalResult.result = "[" + finalValue + "]";
          finalResult.iserror = false;
        }
      }

      //--------------------------------------------------------------------------------------------------//
      //for ROUND-----------------------------------------------------------------------------------//
      else if (
        question.startsWith("ROUND") ||
        (question.startsWith("round") &&
          (finalResult.result === "" || finalResult.result === "#VALUE!"))
      ) {
        let res;

        if (question.search(/\bROUND\b/) >= 0) {
          res = question.split("ROUND");
        } else if (question.search(/\bround\b/) >= 0) {
          res = question.split("round");
        } else if (question.search(/\bROUNDUP\b/) >= 0) {
          res = question.split("ROUNDUP");
        } else if (question.search(/\broundup\b/) >= 0) {
          res = question.split("roundup");
        } else if (question.search(/\bROUNDDOWN\b/) >= 0) {
          res = question.split("ROUNDDOWN");
        } else if (question.search(/\brounddown\b/) >= 0) {
          res = question.split("rounddown");
        }

        if (res[0] !== "") {
          finalResult.result = "something went wrong ";
          finalResult.iserror = true;
          return finalResult;
        }

        if (res[1] === "()") {
          finalResult.result = "#Value ";
          finalResult.iserror = true;
          return finalResult;
        }

        let value = res[1].match(/\(([^)]+)\)/)[1];

        if (
          question.search(/\bROUNDDOWN\b/) >= 0 ||
          question.search(/\brounddown\b/) >= 0
        ) {
          finalResult.result = Math.floor(value);
        } else {
          finalResult.result = Math.round(value);
        }

        let answer = isNaN(finalResult.result);

        if (answer === true) {
          finalResult.result = "formula looks incomplete ";
          finalResult.iserror = true;
          return finalResult;
        }
        finalResult.actualFormula = Math.round(value);
        finalResult.iserror = false;
      }
      //--------------------------------------------------------------------------------------------------//
      //for SET-----------------------------------------------------------------------------------//
      else if (question.startsWith("SET") || question.startsWith("set")) {
        let res, i;

        if (question.startsWith("SET")) {
          res = question.split("SET");
        } else if (question.startsWith("set")) {
          res = question.split("set");
        }
        if (res[0] !== "") {
          finalResult.result = "something went wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = "Cannot set property NaN of undefined";
          finalResult.iserror = true;
          return finalResult;
        }
        if (!balanced(question)) {
          finalResult.result = "something went wrong";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res.length > 1) {
          let resResult;
          if (res[1].includes("ARRAY")) {
            resResult = res[1].split("ARRAY");
          } else if (res[1].includes("array")) {
            resResult = res[1].split("array");
          }
          resResult[1] = resResult[1].substr(0, resResult[1].length - 1);
          if (resResult[1] === "()") {
            finalResult.result = "[]";
            finalResult.iserror = false;
            return finalResult;
          }
          if (resResult.length > 1) {
            let splitValue = resResult[1].split("),");
            let finalValue = splitValue[0].replace(/[()]/g, "").split(",");

            for (i = 0; i < finalValue.length; i++) {
              let ans = eval(finalValue[i]);
              if (ans === undefined) {
                finalResult.result = "formula looks incomplete";
                finalResult.iserror = true;
                return finalResult;
              }
            }

            if (splitValue.length <= 1) {
              finalResult.result = "[" + finalValue + "]";
              finalResult.actualFormula = "[" + finalValue + "]";
              finalResult.iserror = false;
            } else {
              let finalValue1 = splitValue[1].replace(/[()]/g, "").split(",");
              for (i = 0; i < finalValue1.length; i++) {
                let ans = eval(finalValue1[i]);
                if (ans === undefined) {
                  finalResult.result = "formula looks incomplete";
                  finalResult.iserror = true;
                  return finalResult;
                }
              }
              let index = finalValue1[0].replace(/ /g, "");
              let setValue = finalValue1[1];
              if (finalValue1.length > 1) {
                finalValue.splice(index, 1, setValue);
              }
              finalResult.result = "[" + finalValue + "]";
              finalResult.actualFormula = "[" + finalValue + "]";
              finalResult.iserror = false;
            }
          }
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for AND-----------------------------------------------------------------------------------//
      else if (question.startsWith("AND") || question.startsWith("and")) {
        let bool = false;
        let res;
        res = question.split("(");
        if (!balanced(question)) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
        res[1] = res[1].replace(/[()]/g, "");
        var resResult = res[1].split(",");
        for (let i = 0; i < resResult.length; i++) {
          let ans = eval(resResult[i]);
          if (ans === undefined) {
            finalResult.result = "formula looks incomplete ";
            finalResult.iserror = true;
            return finalResult;
          }
        }
        if (resResult[0] !== 0 && resResult[1] !== undefined) {
          if (resResult[0] === "true") {
            let finalAnswer = eval(resResult[1]);
            if (finalAnswer !== bool) {
              finalResult.result = true;
              finalResult.actualFormula = true;
              finalResult.iserror = false;
            } else {
              finalResult.result = finalAnswer;
              finalResult.actualFormula = finalAnswer;
              finalResult.iserror = false;
            }
          } else {
            finalResult.result = false;
            finalResult.actualFormula = false;
            finalResult.iserror = false;
          }
        } else {
          let finalValue = eval(resResult[0]);
          finalResult.result = finalValue;
          finalResult.actualFormula = finalValue;
          finalResult.iserror = false;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for OR-----------------------------------------------------------------------------------//
      else if (question.startsWith("OR") || question.startsWith("or")) {
        let bool = false;
        let res;
        if (question.startsWith("OR")) {
          res = question.split("OR");
        } else if (question.startsWith("or")) {
          res = question.split("or");
        }
        if (res.length > 1 && res[1].includes("(") && res[1].includes(")")) {
          res[1] = res[1].replace(/[()]/g, "");
          let splitValue = res[1].split(",");
          for (let i = 0; i < splitValue.length; i++) {
            let ans = eval(splitValue[i]);
            if (ans === undefined) {
              finalResult.result = "formula looks incomplete ";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          let checkValue = eval(splitValue[0]);
          if (checkValue === false && splitValue[1] !== null) {
            let finalAnswer = eval(splitValue[1]);
            if (finalAnswer !== bool) {
              finalResult.result = true;
              finalResult.actualFormula = true;
              finalResult.iserror = false;
            } else {
              finalResult.result = finalAnswer;
              finalResult.actualFormula = finalAnswer;
              finalResult.iserror = false;
            }
          } else {
            finalResult.result = true;
            finalResult.actualFormula = true;
            finalResult.iserror = false;
          }
        } else {
          finalResult.result = "something went wrong in your formula";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for NOT-----------------------------------------------------------------------------------//
      else if (question.startsWith("NOT")) {
        let finalAnswer = "";
        let splitValue = question.split("NOT");
        if (
          splitValue.length > 1 &&
          splitValue[1].includes("(") &&
          splitValue[1].includes(")")
        ) {
          let ans = eval(splitValue[1]);
          if (ans === undefined) {
            finalResult.result = "formula looks incomplete";
            finalResult.iserror = true;
            return finalResult;
          }
          finalAnswer = !ans;
          finalResult.result = finalAnswer;
          finalResult.actualFormula = finalAnswer;
          finalResult.iserror = false;
        } else {
          finalResult.result = "something went wrong in your formula";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //for ERROR-----------------------------------------------------------------------------------//
      else if (
        (question.startsWith("IF") &&
          !question.includes("DATE") &&
          (question.includes("ERROR") || question.includes("error"))) ||
        (question.startsWith("if") &&
          !question.includes("date") &&
          (question.includes("ERROR") || question.includes("error")))
      ) {
        let res;
        let splitValue = "";
        if (question.startsWith("IF")) {
          res = question.split("IF");
        } else if (question.startsWith("if")) {
          res = question.split("if");
        }
        if (res[0] !== "") {
          finalResult.result = "something wrong ";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res[1] === "()") {
          finalResult.result = '""';
          finalResult.iserror = false;
          return finalResult;
        }
        if (!balanced(question)) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
        if (res.length > 1) {
          splitValue = res[1].split("),");
          let splitValue1 = splitValue[0].replace(/[()]/g, "");
          splitValue1 = splitValue1.split(",");
          for (let i = 0; i <= splitValue1.length - 1; i++) {
            if (splitValue1[i].includes("ERROR")) {
              splitValue1[i] = splitValue1[i].replace(/[ERRROR]/g, "");
            }
            splitValue1[0] = splitValue1[0].replace(/ /g, "");
            let ans1 = eval(splitValue1[i]);
            if (ans1 === undefined) {
              finalResult.result = "the formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          let finalValue = splitValue[1].replace(/[()]/g, "");
          finalValue = finalValue.split(",");
          for (let i = 0; i <= finalValue.length - 1; i++) {
            let ans1 = eval(finalValue[i]);
            if (ans1 === undefined) {
              finalResult.result = "the formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          splitValue1[0] = splitValue1[0].replace(/ /, "");
          let ans = eval(splitValue1[0]);
          if (ans === true || Number.isInteger(ans)) {
            if (splitValue1[1].includes("ERROR")) {
              let finalValue1 = splitValue1[1].split("ERROR");
              if (finalValue1[0] === "" && finalValue1[1] === "") {
                finalResult.result = "Failure";
                finalResult.iserror = true;
              } else {
                finalValue1[1] = finalValue1[1].replace(/[()"]/g, "");
                finalResult.actualFormula = finalValue1[1];
                finalResult.result = finalValue1[1];
                finalResult.iserror = false;
              }
            } else {
              splitValue1[1] = splitValue1[1].replace(/[()"]/g, "");
              finalResult.result = splitValue1[1];
              finalResult.iserror = true;
            }
          } else {
            finalValue[0] = finalValue[0].replace(/["]/g, "");
            finalResult.actualFormula = finalValue[0];
            finalResult.result = finalValue[0];
            finalResult.iserror = false;
          }
        }
      } else if (question.includes("{{") && question.includes("}}")) {
        let res;
        let formJson = JSON.parse(localStorage.getItem("formJSON"));
        let str = question;
        function replaceChar(str, replacement) {
          if (typeof str !== "string" || typeof replacement !== "string")
            return str;

          let pattern = /\{\{([^\}\}]+)\}\}/gi,
            arr = str.match(pattern);

          if (arr !== null) {
            // eslint-disable-next-line array-callback-return
            arr.map(function(match) {
              str = str.replace(match, match.replace(/\s/g, replacement));
            });
          }

          return str;
        }
        let inputText = replaceChar(str, "");
        if (question.includes("||")) {
          res = question.split("||");
          let res1 = question.replace(/ /g, "").split("||");

          for (let j = 0; j < res1.length; j++) {
            if (res1[j].includes("}}|")) {
              finalResult.result = "Something went wrong ";
              finalResult.iserror = true;
              return finalResult;
            }
            let replaceSpace = res1[j].replace(/ /g, "");
            if (res1[j].includes("}}{{")) {
              finalResult.result = "Something went wrong ";
              finalResult.iserror = true;
              return finalResult;
            }
            const isValid = new RegExp(/[+*\/-]/g).test(res1[j]);
            if (isValid) {
              finalResult.result = "NaN";
              finalResult.iserror = false;
              return finalResult;
            }

            if (replaceSpace.includes("{{") && replaceSpace.startsWith("{{")) {
              res1[j] = "1";
            }

            if (!balanced1(replaceSpace)) {
              finalResult.result = "Something went wrong ";
              finalResult.iserror = true;
              return finalResult;
            }

            let ans = eval(res1[j]);
            if (ans === undefined) {
              finalResult.result = "formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
          }

          const getInsideDoubleCurly = (str) =>
            str
              .split("{{")
              .filter((val) => val.includes("}}"))
              .map((val) => val.substring(0, val.indexOf("}}")));

          res = getInsideDoubleCurly(question);

          for (let i = 0; i < res.length; i++) {
            let findText = res[i].replace(/ /g, "");
            let jsonValue = formJson.find(
              (o) => o.key === findText.toLowerCase()
            );
            findText = "{{" + findText + "}}";
            if (jsonValue !== undefined) {
              // if (jsonValue.title != null && jsonValue.title !== "") {
              //   inputText = inputText.replace(findText, jsonValue.title);
              // }
              if (jsonValue.control === "email") {
                inputText = inputText.replace(findText, "email@address.com");
              } else if (jsonValue.control === "url") {
                inputText = inputText.replace(
                  findText,
                  "https://master.d1i3h6ck09x8p5.amplifyapp.com/auth/Login"
                );
              } else if (jsonValue.control === "yesno") {
                inputText = inputText.replace(findText, "Yes");
              } else if (jsonValue.control === "number") {
                inputText = inputText.replace(findText, "12345");
              } else if (jsonValue.control === "phonenumber") {
                inputText = inputText.replace(findText, "040040404004");
              } else if (jsonValue.control === "address") {
                inputText = inputText.replace(
                  findText,
                  "123 Fake St, Leichhardt, New South Wales, 2040, Australia"
                );
              } else if (jsonValue.control === "country") {
                inputText = inputText.replace(findText, "Australia");
              } else if (jsonValue.control === "date") {
                inputText = inputText.replace(findText, "2038-01-02");
              } else if (jsonValue.control === "time") {
                inputText = inputText.replace(findText, "3:02pm");
              } else if (jsonValue.control === "scale") {
                inputText = inputText.replace(findText, "4");
              } else if (jsonValue.control === "multiplechoice") {
                inputText = inputText.replace(findText, "1");
              } else if (jsonValue.control === "dropdown") {
                inputText = inputText.replace(findText, "1");
              } else if (jsonValue.control === "price") {
                inputText = inputText.replace(findText, "10");
              } else if (jsonValue.control === "products") {
                inputText = inputText.replace(findText, "EXAMPLE_SKU");
              } else if (jsonValue.control === "subscriptions") {
                inputText = inputText.replace(findText, "EXAMPLE_PLAN");
              } else if (jsonValue.control === "hidden") {
                inputText = inputText.replace(findText, "you can't see me.");
              } else if (jsonValue.control === "text") {
                inputText = inputText.replace(findText, "Hello World!");
              } else {
                inputText = inputText.replace(findText, jsonValue.title);
              }
            } else {
              inputText = inputText.replace(findText, "");
            }
            // }
          }

          finalResult.actualFormula = question.replace(/[()||"]/g, "");
          inputText = inputText.replace(/[{{}}||"]/g, "");
          finalResult.result = inputText;
          finalResult.iserror = false;
        } else {
          // Error handling
          if (question.includes("}}|")) {
            finalResult.result = "Something went wrong ";
            finalResult.iserror = true;
            return finalResult;
          }

          if (question.includes("}}{{")) {
            finalResult.result = "Something went wrong ";
            finalResult.iserror = true;
            return finalResult;
          }

          const getInsideDoubleCurly = (str) =>
            str
              .split("{{")
              .filter((val) => val.includes("}}"))
              .map((val) => val.substring(0, val.indexOf("}}")));

          res = getInsideDoubleCurly(question);
          for (let i = 0; i < res.length; i++) {
            let findText = res[i].replace(/ /g, "");
            let jsonValue = formJson.find(
              (o) => o.key === findText.toLowerCase()
            );
            findText = "{{" + findText + "}}";
            if (jsonValue !== undefined) {
              if (jsonValue.control === "email") {
                inputText = inputText.replace(findText, "email@address.com");
              } else if (jsonValue.control === "url") {
                inputText = inputText.replace(
                  findText,
                  "https://master.d1i3h6ck09x8p5.amplifyapp.com/auth/Login"
                );
              } else if (jsonValue.control === "yesno") {
                inputText = inputText.replace(findText, "Yes");
              } else if (jsonValue.control === "number") {
                inputText = inputText.replace(findText, "12345");
              } else if (jsonValue.control === "phonenumber") {
                inputText = inputText.replace(findText, "040040404004");
              } else if (jsonValue.control === "address") {
                inputText = inputText.replace(
                  findText,
                  "123 Fake St, Leichhardt, New South Wales, 2040, Australia"
                );
              } else if (jsonValue.control === "country") {
                inputText = inputText.replace(findText, `"Australia"`);
              } else if (jsonValue.control === "date") {
                inputText = inputText.replace(findText, `"2038-01-02"`);
              } else if (jsonValue.control === "time") {
                inputText = inputText.replace(findText, `"3:02pm"`);
              } else if (jsonValue.control === "scale") {
                inputText = inputText.replace(findText, "4");
              } else if (jsonValue.control === "multiplechoice") {
                inputText = inputText.replace(findText, "1");
              } else if (jsonValue.control === "dropdown") {
                inputText = inputText.replace(findText, "1");
              } else if (jsonValue.control === "price") {
                inputText = inputText.replace(findText, "10");
              } else if (jsonValue.control === "products") {
                inputText = inputText.replace(findText, `"EXAMPLE_SKU"`);
              } else if (jsonValue.control === "subscriptions") {
                inputText = inputText.replace(findText, `"EXAMPLE_PLAN"`);
              } else if (jsonValue.control === "hidden") {
                inputText = inputText.replace(findText, `"you can't see me."`);
              } else if (jsonValue.control === "text") {
                inputText = inputText.replace(findText, `"Hello World!"`);
              } else {
                inputText = inputText.replace(findText, "0");
              }
            } else {
              inputText = inputText.replace(findText, "0");
            }
          }
          finalResult.actualFormula = question.replace(/[()||"]/g, "");
          inputText = inputText.replace(/[{{}}||]/g, "");
          try {
            if (inputText.includes("NAN")) {
              finalResult.result = "NAN";
            } else {
              finalResult.result = eval(inputText);
            }
            finalResult.iserror = false;
          } catch {
            finalResult.result = "the formula looks incomplete";
            finalResult.iserror = true;
          }
        }
      }
      //---------------------------------------------------------------------------------------------------//
      //DATEFORMAT
      else if (
        question.startsWith("DATEFORMAT") ||
        question.startsWith("dateformat")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEFORMAT")) {
            rs = question.split("DATEFORMAT");
          } else if (question.startsWith("dateformat")) {
            rs = question.split("dateformat");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () pehaphs?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong ";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "the formula looks invalid,we didn't expect to see a )there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              resResult[1] = resResult[1].replace(/["]/g, "");
              let answer = dateformat(resResult[0], resResult[1]);
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
            }
          } else {
            try {
              let answer = dateformat(
                resResult[0],
                "yyyy-mm-dd'T'HH:MM:ss  Z "
              );
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          }
        } catch (err) {
          finalResult.result = "the formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //---------------------------------------------------------------------------------------------------//
      //DATEADD
      else if (
        question.startsWith("DATEADD") ||
        question.startsWith("dateadd")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEADD")) {
            rs = question.split("DATEADD");
          } else if (question.startsWith("dateadd")) {
            rs = question.split("dateadd");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some() perhaps? ";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong ";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong ";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid, we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let calculativeData, calculatedData;
              let date = new Date(resResult[0]);
              resResult[1] = parseInt(resResult[1]);
              resResult[2] = resResult[2].replace(/ /g, "").replace(/["]/g, "");
              if (resResult[2] === "days" || resResult[2] === "day") {
                calculativeData = date.getDate();
                calculatedData = calculativeData + resResult[1];
                date.setDate(calculatedData);
              } else if (
                resResult[2] === "months" ||
                resResult[2] === "month"
              ) {
                calculativeData = date.getMonth();
                calculatedData = calculativeData + resResult[1];
                date.setMonth(calculatedData);
              } else if (resResult[2] === "years" || resResult[2] === "year") {
                calculativeData = date.getFullYear();
                calculatedData = calculativeData + resResult[1];
                date.setFullYear(calculatedData);
              } else if (resResult[2] === "hours" || resResult[2] === "hour") {
                calculativeData = date.getHours();
                calculatedData = calculativeData + resResult[1];
                date.setHours(calculatedData);
              } else if (
                resResult[2] === "minutes" ||
                resResult[2] === "minute"
              ) {
                calculativeData = date.getMinutes();
                calculatedData = calculativeData + resResult[1];
                date.setMinutes(calculatedData);
              } else if (
                resResult[2] === "seconds" ||
                resResult[2] === "second"
              ) {
                calculativeData = date.getSeconds();
                calculatedData = calculativeData + resResult[1];
                date.setSeconds(calculatedData);
              } else {
                finalResult.result = "something went wrong ";
                finalResult.iserror = true;
                return finalResult;
              }

              let answer = dateformat(date, "yyyy-mm-dd  HH:MM:ss ");
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
        } catch (err) {
          finalResult.result = "the formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATESUB----
      else if (
        question.startsWith("DATESUB") ||
        question.startsWith("datesub")
      ) {
        let rs;
        try {
          if (question.startsWith("DATESUB")) {
            rs = question.split("DATESUB");
          } else if (question.startsWith("datesub")) {
            rs = question.split("datesub");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function,missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let calculativeData, calculatedData;
              if (resResult[0].includes(":")) {
                resResult[0] = resResult[0].replace(/[""]/g, "");
              }

              let date = new Date(resResult[0]);
              resResult[1] = parseInt(resResult[1]);
              resResult[2] = resResult[2].replace(/ /g, "").replace(/["]/g, "");
              if (resResult[2] === "days" || resResult[2] === "day") {
                calculativeData = date.getDate();
                calculatedData = calculativeData - resResult[1];
                date.setDate(calculatedData);
              } else if (
                resResult[2] === "months" ||
                resResult[2] === "month"
              ) {
                calculativeData = date.getMonth();
                calculatedData = calculativeData - resResult[1];
                date.setMonth(calculatedData);
              } else if (resResult[2] === "years" || resResult[2] === "year") {
                calculativeData = date.getFullYear();
                calculatedData = calculativeData - resResult[1];
                date.setFullYear(calculatedData);
              } else if (resResult[2] === "hours" || resResult[2] === "hour") {
                calculativeData = date.getHours();
                calculatedData = calculativeData - resResult[1];
                date.setHours(calculatedData);
              } else if (
                resResult[2] === "minutes" ||
                resResult[2] === "minute"
              ) {
                calculativeData = date.getMinutes();
                calculatedData = calculativeData - resResult[1];
                date.setMinutes(calculatedData);
              } else if (
                resResult[2] === "seconds" ||
                resResult[2] === "second"
              ) {
                calculativeData = date.getSeconds();
                calculatedData = calculativeData - resResult[1];
                date.setSeconds(calculatedData);
              } else {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }

              let answer = dateformat(date, "yyyy-mm-dd  HH:MM:ss ");
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATEDIFF
      else if (
        question.startsWith("DATEDIFF") ||
        question.startsWith("datediff")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEDIFF")) {
            rs = question.split("DATEDIFF");
          } else if (question.startsWith("datediff")) {
            rs = question.split("datediff");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function,missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a )there";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let firstDate = new Date(resResult[0]);
              let secondDate = new Date(resResult[1]);
              resResult[2] = resResult[2].replace(/ /g, "").replace(/["]/g, "");
              if (resResult[2] === "days" || resResult[2] === "day") {
                let timeDiff = Math.abs(
                  firstDate.getTime() - secondDate.getTime()
                );
                let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (secondDate > firstDate) {
                  finalResult.actualFormula = `-${diffDays}`;
                  finalResult.result = `-${diffDays}`;
                  finalResult.iserror = false;
                } else {
                  finalResult.actualFormula = diffDays;
                  finalResult.result = diffDays;
                  finalResult.iserror = false;
                }
              } else if (
                resResult[2] === "months" ||
                resResult[2] === "month"
              ) {
                let diff = (firstDate.getTime() - secondDate.getTime()) / 1000;
                diff /= 60 * 60 * 24 * 7 * 4;
                diff = Math.abs(Math.round(diff));
                if (secondDate > firstDate) {
                  finalResult.actualFormula = `-${diff}`;
                  finalResult.result = `-${diff}`;
                  finalResult.iserror = false;
                } else {
                  finalResult.actualFormula = diff;
                  finalResult.result = diff;
                  finalResult.iserror = false;
                }
              } else if (resResult[2] === "years" || resResult[2] === "year") {
                let diff = (firstDate.getTime() - secondDate.getTime()) / 1000;
                diff /= 60 * 60 * 24;
                diff = Math.abs(Math.round(diff / 365.25));
                let firstValue = firstDate.getFullYear();
                let secondValue = secondDate.getFullYear();
                if (secondValue > firstValue) {
                  finalResult.actualFormula = `-${diff}`;
                  finalResult.result = `-${diff}`;
                  finalResult.iserror = false;
                } else {
                  finalResult.actualFormula = diff;
                  finalResult.result = diff;
                  finalResult.iserror = false;
                }
              } else {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //---------------------------------------------------------------------------------------------------//
      //DATESTARTOF
      else if (
        question.startsWith("DATESTARTOF") ||
        question.startsWith("datestartof")
      ) {
        let rs;
        try {
          if (question.startsWith("DATESTARTOF")) {
            rs = question.split("DATESTARTOF");
          } else if (question.startsWith("datestartof")) {
            rs = question.split("datestartof");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a )there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let calculativeData;
              if (resResult[0].includes(":")) {
                resResult[0] = resResult[0].replace(/[""]/g, "");
              }
              let date = new Date(resResult[0]);
              resResult[1] = resResult[1].replace(/ /g, "").replace(/["]/g, "");

              if (resResult[1] === "days" || resResult[1] === "day") {
                calculativeData = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                );
              } else if (
                resResult[1] === "months" ||
                resResult[1] === "month"
              ) {
                calculativeData = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  1
                );
              } else if (resResult[1] === "years" || resResult[1] === "year") {
                calculativeData = new Date(date.getFullYear(), 0, 1);
              } else if (resResult[1] === "week" || resResult[1] === "weeks") {
                var diff =
                  date.getDate() -
                  date.getDay() +
                  (date.getDay() === 0 ? -6 : 1);

                calculativeData = new Date(date.setDate(diff));
                calculativeData = calculativeData.setHours(0, 0, 0);
              } else if (resResult[1] === "hours" || resResult[1] === "hour") {
                calculativeData = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  date.getHours()
                );
              } else if (
                resResult[1] === "minutes" ||
                resResult[1] === "minute"
              ) {
                calculativeData = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes()
                );
              } else if (
                resResult[1] === "seconds" ||
                resResult[1] === "second"
              ) {
                calculativeData = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes(),
                  date.getSeconds()
                );
              } else {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }

              let answer = dateformat(calculativeData, "yyyy-mm-dd  HH:MM:ss ");
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid answer";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATEENDOF
      else if (
        question.startsWith("DATEENDOF") ||
        question.startsWith("dateendof")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEENDOF")) {
            rs = question.split("DATEENDOF");
          } else if (question.startsWith("dateendof")) {
            rs = question.split("dateendof");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a )there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let calculativeData;
              if (resResult[0].includes(":")) {
                resResult[0] = resResult[0].replace(/[""]/g, "");
              }
              let date = new Date(resResult[0]);
              resResult[1] = resResult[1].replace(/ /g, "").replace(/["]/g, "");

              if (resResult[1] === "days" || resResult[1] === "day") {
                calculativeData = new Date(date.setHours(23, 59, 59, 999));
              } else if (
                resResult[1] === "months" ||
                resResult[1] === "month"
              ) {
                calculativeData = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                );
                calculativeData = new Date(
                  calculativeData.setHours(23, 59, 59, 999)
                );
              } else if (resResult[1] === "years" || resResult[1] === "year") {
                calculativeData = new Date(new Date().getFullYear(), 11, 31);
                calculativeData = new Date(
                  calculativeData.setHours(23, 59, 59, 999)
                );
              } else if (resResult[1] === "week" || resResult[1] === "weeks") {
                let lastday = date.getDate() - (date.getDay() - 1) + 6;
                calculativeData = new Date(date.setDate(lastday));
                calculativeData.setHours(23, 59, 59, 999);
              } else if (resResult[1] === "hours" || resResult[1] === "hour") {
                calculativeData = new Date(
                  date.setHours(date.getHours(), 59, 59, 999)
                );
              } else if (
                resResult[1] === "minutes" ||
                resResult[1] === "minute"
              ) {
                calculativeData = new Date(
                  date.setHours(date.getHours(), date.getMinutes(), 59)
                );
              } else if (
                resResult[1] === "seconds" ||
                resResult[1] === "second"
              ) {
                calculativeData = new Date(
                  date.setHours(
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds()
                  )
                );
              } else {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }

              let answer = dateformat(calculativeData, "yyyy-mm-dd  HH:MM:ss ");
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid answer";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            finalResult.result = "Cannot read property of undefined";
            finalResult.iserror = true;
            return finalResult;
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATESET
      else if (
        question.startsWith("DATESET") ||
        question.startsWith("dateset")
      ) {
        let rs;
        try {
          if (question.startsWith("DATESET")) {
            rs = question.split("DATESET");
          } else if (question.startsWith("dateset")) {
            rs = question.split("dateset");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              if (resResult[0].includes(":")) {
                resResult[0] = resResult[0].replace(/[""]/g, "");
              }
              let date = new Date(resResult[0]);
              resResult[1] = resResult[1].replace(/ /g, "").replace(/["]/g, "");
              if (resResult[1] === "days" || resResult[1] === "day") {
                date.setDate(resResult[2]);
              } else if (
                resResult[1] === "months" ||
                resResult[1] === "month"
              ) {
                date.setMonth(resResult[2] - 1);
              } else if (resResult[1] === "years" || resResult[1] === "year") {
                date.setFullYear(resResult[2]);
              } else if (resResult[1] === "hours" || resResult[1] === "hour") {
                date.setHours(resResult[2]);
              } else if (
                resResult[1] === "minutes" ||
                resResult[1] === "minute"
              ) {
                date.setMinutes(resResult[2]);
              } else if (
                resResult[1] === "seconds" ||
                resResulta[1] === "second"
              ) {
                date.setSeconds(resResult[2]);
              } else {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }
              let answer = dateformat(date, "yyyy-mm-dd  HH:MM:ss ");
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            try {
              let answer = dateformat(resResult[0]);
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //---------------------------------------------------------------------------------------------------------//
      //DATEGET
      else if (
        question.startsWith("DATEGET") ||
        question.startsWith("dateget")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEGET")) {
            rs = question.split("DATEGET");
          } else if (question.startsWith("dateget")) {
            rs = question.split("dateget");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let calculativeData;
              if (resResult[0].includes(":")) {
                resResult[0] = resResult[0].replace(/[""]/g, "");
              }
              let date = new Date(resResult[0]);
              resResult[1] = resResult[1].replace(/ /g, "").replace(/["]/g, "");
              if (resResult[1] === "days" || resResult[1] === "day") {
                calculativeData = date.getDate();
              } else if (
                resResult[1] === "months" ||
                resResult[1] === "month"
              ) {
                calculativeData = date.getMonth();
              } else if (resResult[1] === "years" || resResult[1] === "year") {
                calculativeData = date.getFullYear();
              } else if (resResult[1] === "hours" || resResult[1] === "hour") {
                calculativeData = date.getHours();
              } else if (
                resResult[1] === "minutes" ||
                resResult[1] === "minute"
              ) {
                calculativeData = date.getMinutes();
              } else if (
                resResult[1] === "seconds" ||
                resResulta[1] === "second"
              ) {
                calculativeData = date.getSeconds();
              } else {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }

              finalResult.actualFormula = calculativeData;
              finalResult.result = calculativeData;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            try {
              let answer = dateformat(resResult[0]);
              finalResult.actualFormula = answer;
              finalResult.result = answer;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATEISAFTER
      else if (
        question.startsWith("DATEISAFTER") ||
        question.startsWith("dateisafter")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEISAFTER")) {
            rs = question.split("DATEISAFTER");
          } else if (question.startsWith("dateisafter")) {
            rs = question.split("dateisafter");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let firstValue = new Date(resResult[0]);
              let secondValue = new Date(resResult[1]);
              if (firstValue > secondValue) {
                finalResult.actualFormula = true;
                finalResult.result = true;
                finalResult.iserror = false;
              } else {
                finalResult.actualFormula = false;
                finalResult.result = false;
                finalResult.iserror = false;
              }
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            try {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATEISBEFORE
      else if (
        question.startsWith("DATEISBEFORE") ||
        question.startsWith("dateisbefore")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEISBEFORE")) {
            rs = question.split("DATEISBEFORE");
          } else if (question.startsWith("dateisbefore")) {
            rs = question.split("dateisbefore");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let firstValue = new Date(resResult[0]);
              let secondValue = new Date(resResult[1]);
              if (secondValue > firstValue) {
                finalResult.actualFormula = true;
                finalResult.result = true;
                finalResult.iserror = false;
              } else {
                finalResult.actualFormula = false;
                finalResult.result = false;
                finalResult.iserror = false;
              }
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            try {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //-------------------------------------------------------------------------------------------------//
      //DATEISEQUAL
      else if (
        question.startsWith("DATEISEQUAL") ||
        question.startsWith("dateisequal")
      ) {
        let rs;
        try {
          if (question.startsWith("DATEISEQUAL")) {
            rs = question.split("DATEISEQUAL");
          } else if (question.startsWith("dateisequal")) {
            rs = question.split("dateisequal");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          let resResult = rs[1]
            .replace(/[()]/g, "")
            .toLowerCase()
            .split(",");

          for (let i = 0; i < resResult.length; i++) {
            let ans = eval(resResult[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (resResult.length > 1) {
            try {
              let firstValue = new Date(resResult[0]);
              let secondValue = new Date(resResult[1]);
              if (secondValue > firstValue || secondValue < firstValue) {
                finalResult.actualFormula = false;
                finalResult.result = false;
                finalResult.iserror = false;
              } else {
                finalResult.actualFormula = true;
                finalResult.result = true;
                finalResult.iserror = false;
              }
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          } else {
            try {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            } catch (err) {
              finalResult.result = "invalid Date";
              finalResult.iserror = false;
              return finalResult;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //-------------------------------------------------------------------------------------------------//
      //DATEINFUTURE
      else if (
        question.startsWith("DATEISFUTURE") ||
        question.startsWith("dateisfuture")
      ) {
        let rs;

        try {
          if (question.startsWith("DATEISFUTURE")) {
            rs = question.split("DATEISFUTURE");
          } else if (question.startsWith("dateisfuture")) {
            rs = question.split("dateisfuture");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          rs[1] = rs[1].replace(/[()]/g, "").toLowerCase();

          for (let i = 1; i < rs.length; i++) {
            let ans = eval(rs[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (rs[1].includes(",")) {
            let resResult = rs[1].split(",");
            let firstValue = new Date(resResult[0]);
            if (firstValue > new Date()) {
              finalResult.actualFormula = true;
              finalResult.result = true;
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            }
          } else {
            let firstValue = new Date(rs[1]);
            if (firstValue > new Date()) {
              finalResult.actualFormula = true;
              finalResult.result = true;
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //-------------------------------------------------------------------------------------------------//
      //DATEISPAST
      else if (
        question.startsWith("DATEISPAST") ||
        question.startsWith("dateispast")
      ) {
        let rs;

        try {
          if (question.startsWith("DATEISPAST")) {
            rs = question.split("DATEISPAST");
          } else if (question.startsWith("dateispast")) {
            rs = question.split("dateispast");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          rs[1] = rs[1].replace(/[()]/g, "").toLowerCase();

          for (let i = 1; i < rs.length; i++) {
            let ans = eval(rs[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          if (rs[1].includes(",")) {
            let resResult = rs[1].split(",");
            let firstValue = new Date(resResult[0]);
            if (firstValue < new Date()) {
              finalResult.actualFormula = true;
              finalResult.result = true;
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            }
          } else {
            let firstValue = new Date(rs[1]);
            if (firstValue < new Date()) {
              finalResult.actualFormula = true;
              finalResult.result = true;
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = false;
              finalResult.result = false;
              finalResult.iserror = false;
            }
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATEISVALID
      else if (
        question.startsWith("DATEISVALID") ||
        question.startsWith("dateisvalid")
      ) {
        let rs;

        try {
          if (question.startsWith("DATEISVALID")) {
            rs = question.split("DATEISVALID");
          } else if (question.startsWith("dateisvalid")) {
            rs = question.split("dateisvalid");
          }
          if (rs[1] === "") {
            finalResult.result =
              "You returned a function, missing some () perhaps?";
            finalResult.iserror = true;
            return finalResult;
          }
          if (rs[1] === "()") {
            finalResult.result = "invalid Date";
            finalResult.iserror = false;
            return finalResult;
          }
          if (!rs[1].includes("(") && !rs[1].includes(")")) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }

          if (!balanced(question) || rs[0] !== "") {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          rs[1] = rs[1].replace(/[()]/g, "").toLowerCase();

          for (let i = 1; i < rs.length; i++) {
            let ans = eval(rs[i]);
            if (!ans) {
              finalResult.result =
                "The formula looks invalid,we didn't expect to see a ) there!";
              finalResult.iserror = true;
              return finalResult;
            }
          }

          try {
            var firstValue = new Date(rs[1]);
            firstValue = dateformat(firstValue, "yyyy-mm-dd");
            if (firstValue) {
              finalResult.actualFormula = true;
              finalResult.result = true;
              finalResult.iserror = false;
            }
          } catch (err) {
            finalResult.actualFormula = false;
            finalResult.result = false;
            finalResult.iserror = false;
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //--------------------------------------------------------------------------------------------------//
      //DATENOW
      else if (
        (question.includes("DATE") &&
          question.includes("IF") &&
          question.includes("ERROR")) ||
        (question.includes("date") &&
          question.includes("if") &&
          question.includes("error"))
      ) {
        let rs;
        debugger;
        try {
          if (!balanced(question)) {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
          rs = question.split(";");
          let value1 = rs[0].split("=");
          for (let i = 1; i < value1.length; i++) {
            let ans = eval(value1[i]);
            if (!ans) {
              finalResult.result = "something went wrong";
              finalResult.iserror = true;
              return finalResult;
            }
          }
          let storeValue1 = value1[0];
          value1[0] = value1[1];
          let value2 = rs[1].trim().split("=");
          if (
            value2[1].includes("DATEDIFF") ||
            value2[1].includes("datediff")
          ) {
            let result;
            if (value2[1].includes("DATEDIFF")) {
              result = value2[1].split("DATEDIFF");
            } else if (value2[1].includes("datediff")) {
              result = value2[1].split("datediff");
            }
            let answer = result[1]
              .replace(/[()]/g, "")
              .toLowerCase()
              .split(",");
            if (answer[0] === "now") {
              answer[0] = new Date();
            }
            if (storeValue1 !== answer[1].replace(/ /g, "")) {
              finalResult.result =
                "doesn't look like it's supposed to be there or you haven't finished typing....";
              finalResult.iserror = true;
              return finalResult;
            }
            answer[1] = value1[0];
            for (let i = 0; i < answer.length; i++) {
              let ans = eval(answer[i]);
              if (!ans) {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }
            }
            let firstDate = new Date(answer[0]);
            let secondDate = new Date(answer[1]);
            answer[2] = answer[2].replace(/ /g, "").replace(/["]/g, "");

            let firstValue = firstDate.getFullYear();
            let secondValue = secondDate.getFullYear();
            let thirdValue = firstValue - secondValue;
            let storeValue2 = value2[0].replace(/ /g, "");
            value2[0] = thirdValue;
            let value3 = rs[2].split(",");
            let splitValue;
            if (value3[0].includes("IF")) {
              splitValue = value3[0].replace(/[()]/g, "").split("IF");
            } else if (value3[0].includes("if")) {
              splitValue = value3[0].replace(/[()]/g, "").split("if");
            }
            const isValid = new RegExp(/[=,+,*,/,-,>=,<=,!=]/g);
            let checkOperator = splitValue[1].match(isValid);
            checkOperator = JSON.stringify(checkOperator)
              .replace(/[,["]/g, "")
              .replace(/]/g, "");
            let storeValue = splitValue[1]
              .replace(/ /g, "")
              .split(`${checkOperator}`);
            if (storeValue[0] !== storeValue2) {
              finalResult.result =
                "doesn't look like it's supposed to be there or you haven't finished typeing....";
              finalResult.iserror = true;
              return finalResult;
            }
            splitValue[1] = splitValue[1].replace(storeValue[0], value2[0]);
            let ans = eval(splitValue[1]);
            let splitValue1;
            if (value3[2].includes("ERROR")) {
              splitValue1 = value3[2].replace(/[()]/g, "").split("ERROR");
            } else if (value3[2].includes("error")) {
              splitValue1 = value3[2].replace(/[()]/g, "").split("error");
            }

            value3[2] = splitValue1[1];
            for (let i = 1; i < value3.length; i++) {
              let ans = eval(value3[i]);
              if (!ans) {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }
            }
            if (ans) {
              finalResult.actualFormula = value3[1];
              finalResult.result = value3[1].replace(/"/g, "");
              finalResult.iserror = false;
            } else {
              finalResult.actualFormula = splitValue1[1];
              finalResult.result = splitValue1[1].replace(/"/g, "");
              finalResult.iserror = true;
            }
          } else if (
            value2[1].includes("DATEISPAST") ||
            value2[1].includes("DATEISFUTURE") ||
            value2[1].includes("DATEISAFTER") ||
            value2[1].includes("DATEISBEFORE") ||
            value2[1].includes("DATEADD") ||
            value2[1].includes("DATESUB") ||
            value2[1].includes("DATEGET") ||
            value2[1].includes("DATESET") ||
            value2[1].includes("dateispast") ||
            value2[1].includes("dateisfuture") ||
            value2[1].includes("dateisafter") ||
            value2[1].includes("dateisbefore") ||
            value2[1].includes("dateadd") ||
            value2[1].includes("datesub") ||
            value2[1].includes("dateget") ||
            value2[1].includes("dateset")
          ) {
            let value3 = rs[2].split(",");

            let splitValue1;
            if (value3[2].includes("ERROR")) {
              splitValue1 = value3[2].replace(/[()]/g, "").split("ERROR");
            } else if (value3[2].includes("error")) {
              splitValue1 = value3[2].replace(/[()]/g, "").split("error");
            }
            value3[2] = splitValue1[1];
            for (let i = 1; i < value3.length; i++) {
              let ans = eval(value3[i]);
              if (!ans) {
                finalResult.result = "something went wrong";
                finalResult.iserror = true;
                return finalResult;
              }
            }

            finalResult.actualFormula = splitValue1[1];
            finalResult.result = splitValue1[1].replace(/"/g, "");
            finalResult.iserror = true;
          } else {
            finalResult.result = "something went wrong";
            finalResult.iserror = true;
            return finalResult;
          }
        } catch (err) {
          finalResult.result = "formula looks incomplete";
          finalResult.iserror = true;
          return finalResult;
        }
      }
      //------------------------------------------------------------------------------------------------------//
      // Last Concatenate Check
      else {
        if (question.includes("||")) {
          let finalAnswer = "";
          let res = question.split("||");

          for (let i = 0; i < res.length; i++) {
            let ans = eval(res[i]);
            if (ans === undefined || ans === "0") {
              finalResult.result = "the formula looks incomplete";
              finalResult.iserror = true;
              return finalResult;
            }
            if (ans === 0) {
              finalResult.result = "Something's gone wrong at line 1";
              finalResult.iserror = true;
              return finalResult;
            }

            finalAnswer = finalAnswer + ans;
          }
          finalResult.actualFormula = finalAnswer;
          finalResult.result = finalAnswer;
          finalResult.iserror = false;
        } else {
          let calculation1 = math.eval(question);
          finalResult.actualFormula = calculation1;
          finalResult.result = calculation1;
          finalResult.iserror = false;
        }
      }
    }
  } catch {
    if (calculation !== "") {
      if (
        calculation.error === "#VALUE!" ||
        calculation.error === "#NUM!" ||
        calculation.error === "#N/A"
      ) {
        finalResult.result = "#VALUE!";
        finalResult.iserror = true;
        finalResult.actualFormula = "some error";
      } else if (calculation.error === "#NAME?") {
        finalResult.result = "You can't end with a variable assignment";
        finalResult.iserror = true;
        finalResult.actualFormula = "some error";
      } else {
        finalResult.result = "some error";
        finalResult.actualFormula = "some error";
        finalResult.iserror = true;
      }
    } else {
      finalResult.result = "some error";
      finalResult.actualFormula = "some error";
      finalResult.iserror = true;
    }
  }

  return finalResult;
}

export function balanced(str) {
  let a = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === "(") a++;
    else if (str.charAt(i) === ")") a--;
  }
  return a === 0;
}

export function balanced1(str) {
  let a = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === "{") a++;
    else if (str.charAt(i) === "}") a--;
  }
  return a === 0;
}

export function GetQuestion(question) {
  let value = question;

  let finalval = "";

  let arr = value.replace(/^\s+|\s+$/g, "").split(";");

  let arr1 = value
    .replace(/^\s+|\s+$/g, "")
    .replace(/=\s*/g, ":")
    .split(";");

  let filtered = arr.filter(function(el) {
    return el !== "";
  });

  let BeforeLastfiltered = arr1.filter(function(el) {
    return el !== "";
  });

  BeforeLastfiltered.splice(-1, 1);

  BeforeLastfiltered = parse(BeforeLastfiltered);

  // Change value to final index
  let val = filtered[filtered.length - 1];

  finalval = val;

  let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  let Internalformat = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (format.test(finalval.trim())) {
    if (Internalformat.test(finalval.trim())) {
      for (let key in BeforeLastfiltered) {
        if (BeforeLastfiltered.hasOwnProperty(key)) {
          let keyName = key;
          let value1 = BeforeLastfiltered[key];
          if (value1 === "" || value1 == null) {
            return "the formula looks incomplete";
          }
          finalval = finalval.replace(
            new RegExp("\\b" + keyName + "\\b", "g"),
            value1
          );
        }
      }
    } else if (
      finalval.trim().startsWith("not") ||
      finalval.trim().includes("and") ||
      finalval.trim().includes("or")
    ) {
      for (let key in BeforeLastfiltered) {
        if (BeforeLastfiltered.hasOwnProperty(key)) {
          let keyName = key;
          let value1 = BeforeLastfiltered[key];
          if (value1 === "" || value1 == null) {
            return "the formula looks incomplete";
          }
          finalval = finalval.replace(
            new RegExp("\\b" + keyName + "\\b", "g"),
            value1
          );
        }
      }
    }
  } else {
    if (finalval.trim().split(" ").length === 1) {
      for (let key in BeforeLastfiltered) {
        if (BeforeLastfiltered.hasOwnProperty(key)) {
          let keyName = key;
          let value1 = BeforeLastfiltered[key];
          if (value1 === "" || value1 == null) {
            return "the formula looks incomplete";
          }
          finalval = finalval.replace(
            new RegExp("\\b" + keyName + "\\b", "g"),
            value1
          );
        }
      }
    }
  }
  return finalval.trimLeft();
}

export function parse(BeforeLastfiltered) {
  let obj = {};
  for (let i = 0; i < BeforeLastfiltered.length; i++) {
    if (BeforeLastfiltered[i].includes(":")) {
      if (
        (BeforeLastfiltered[i].match(new RegExp(":", "g")) || []).length > 1 &&
        BeforeLastfiltered[i].includes("item")
      ) {
        let t = 0;
        BeforeLastfiltered[i] = BeforeLastfiltered[i].replace(/:/g, function(
          match
        ) {
          t++;
          return t === 2 ? "=" : match;
        });

        let split = BeforeLastfiltered[i].split(":");
        obj[split[0].trim()] = split[1].trim();
      } else {
        let split = BeforeLastfiltered[i].split(":");
        obj[split[0].trim()] = split[1].trim();
      }
    }
  }
  return obj;
}
