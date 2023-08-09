import React from "react";
import $ from "jquery";

let list = [
  {
    parent: "BASIC MATHS",
    child: [
      {
        Name: "Numbers",
        unique: "numbersarticle",
        id: 1,
      },
      {
        Name: "Add + ",
        unique: "addarticle",
        id: 2,
      },
      {
        Name: "Subtract - ",
        unique: "subtractarticle",
        id: 3,
      },
      {
        Name: "Multiply * ",
        unique: "multiplyarticle",
        id: 4,
      },
      {
        Name: "Divide / ",
        unique: "dividearticle",
        id: 5,
      },
      {
        Name: "Group () ",
        unique: "grouparticle",
        id: 6,
      },
    ],
  },
  {
    parent: "BASIC TEXT",
    child: [
      {
        Name: "Typing text",
        unique: "typingtextarticle",
        id: 7,
      },
      {
        Name: "Concatenate ||",
        unique: "concatenatearticle",
        id: 8,
      },
    ],
  },
  {
    parent: "WORKING WITH ANSWERS",
    child: [
      {
        Name: "Answer Piping",
        unique: "answerpipingarticle",
        id: 9,
      },
      {
        Name: "Variables",
        unique: "variablesarticle",
        id: 10,
      },
      // {
      //     "Name": "Products",
      //     "unique": "productsarticle",
      //     "id": 11
      // }
    ],
  },
  {
    parent: "LOGIC",
    child: [
      {
        Name: "Booleans (true & false)",
        unique: "booleansarticle",
        id: 12,
      },
      {
        Name: "not",
        unique: "notarticle",
        id: 13,
      },
      {
        Name: "and",
        unique: "andarticle",
        id: 14,
      },
      {
        Name: "or",
        unique: "orarticle",
        id: 15,
      },
      {
        Name: "Equals ==",
        unique: "equalsarticle",
        id: 16,
      },
      {
        Name: "Doesn't equal !=",
        unique: "doesnotequalarticle",
        id: 17,
      },
      {
        Name: "Greater than >",
        unique: "greaterarticle",
        id: 18,
      },
      {
        Name: "Greater or equal >=",
        unique: "greatorequalarticle",
        id: 19,
      },
      {
        Name: "Less than <",
        unique: "lessarticle",
        id: 20,
      },
      {
        Name: "Less or equal <=",
        unique: "lessorequalarticle",
        id: 21,
      },
    ],
  },
  {
    parent: "FUNCTIONS",
  },
  {
    parent: "DATE AND TIME",
    child: [
      {
        Name: "DATEFORMAT ",
        unique: "dateformatarticle",
        id: 22,
      },
      {
        Name: "DATEADD",
        unique: "dateaddarticle",
        id: 23,
      },
      {
        Name: "NOW",
        unique: "nowarticle",
        id: 120,
      },
      {
        Name: "DATESUB",
        unique: "datesubarticle",
        id: 24,
      },
      {
        Name: "DATEDIFF",
        unique: "datediffarticle",
        id: 25,
      },
      {
        Name: "DATESTARTOF",
        unique: "datestartofarticle",
        id: 26,
      },
      {
        Name: "DATEENDOF",
        unique: "dateendofarticle",
        id: 27,
      },
      {
        Name: "DATESET",
        unique: "datesetarticle",
        id: 28,
      },
      {
        Name: "DATEGET",
        unique: "dategetarticle",
        id: 29,
      },
      {
        Name: "DATEISAFTER",
        unique: "dateisafterarticle",
        id: 30,
      },
      {
        Name: "DATEISBEFORE",
        unique: "dateisbeforearticle",
        id: 31,
      },
      {
        Name: "DATEISEQUAL",
        unique: "dateisequalarticle",
        id: 32,
      },
      {
        Name: "DATEISFUTURE",
        unique: "dateisfuturearticle",
        id: 33,
      },
      {
        Name: "DATEISPAST",
        unique: "dateispastarticle",
        id: 34,
      },
      {
        Name: "DATEISVALID",
        unique: "dateisvalidarticle",
        id: 35,
      },
    ],
  },
  {
    parent: "MATHS",
    child: [
      {
        Name: "ABS",
        unique: "absarticle",
        id: 36,
      },
      {
        Name: "POW",
        unique: "powarticle",
        id: 37,
      },
      {
        Name: "AVERAGE",
        unique: "averagearticle",
        id: 38,
      },
      {
        Name: "AVERAGEIF",
        unique: "averageifarticle",
        id: 39,
      },
      {
        Name: "CEILING",
        unique: "ceilingarticle",
        id: 40,
      },
      {
        Name: "CONVERT",
        unique: "convertarticle",
        id: 41,
      },
      {
        Name: "DECIMAL",
        unique: "decimalarticle",
        id: 42,
      },
      {
        Name: "EVEN",
        unique: "evenarticle",
        id: 43,
      },
      {
        Name: "FLOOR",
        unique: "floorarticle",
        id: 44,
      },
      {
        Name: "INT",
        unique: "intarticle",
        id: 45,
      },
      {
        Name: "LARGE",
        unique: "largearticle",
        id: 46,
      },
      {
        Name: "ODD",
        unique: "oddarticle",
        id: 47,
      },
      {
        Name: "ROMAN",
        unique: "romanarticle",
        id: 48,
      },
      {
        Name: "ROUND",
        unique: "roundarticle",
        id: 49,
      },
      {
        Name: "ROUNDDOWN",
        unique: "rounddownarticle",
        id: 50,
      },
      {
        Name: "ROUNDUP",
        unique: "rounduparticle",
        id: 51,
      },
      {
        Name: "SIGN",
        unique: "signarticle",
        id: 52,
      },
      {
        Name: "SMALL",
        unique: "smallarticle",
        id: 53,
      },
      {
        Name: "SUMIF",
        unique: "sumifarticle",
        id: 54,
      },
      {
        Name: "TRUNC",
        unique: "truncarticle",
        id: 55,
      },
    ],
  },
  {
    parent: "LOGICAL",
    child: [
      {
        Name: "AND",
        unique: "andlogicalarticle",
        id: 56,
      },
      {
        Name: "IF",
        unique: "iflogicalarticle",
        id: 57,
      },
      {
        Name: "IFERROR",
        unique: "iferrorlogicalarticle",
        id: 58,
      },
      {
        Name: "NOT",
        unique: "notlogicalarticle",
        id: 59,
      },
      {
        Name: "OR",
        unique: "orlogicalarticle",
        id: 60,
      },
      {
        Name: "SWITCH",
        unique: "switchlogicalarticle",
        id: 61,
      },
      {
        Name: "XOR",
        unique: "xorlogicalarticle",
        id: 62,
      },
    ],
  },
  {
    parent: "LOOKUP",
    child: [
      {
        Name: "FIRST",
        unique: "firstlookuparticle",
        id: 63,
      },
      {
        Name: "LAST",
        unique: "lastlookuparticle",
        id: 64,
      },
      {
        Name: "GET",
        unique: "getlookuparticle",
        id: 65,
      },
      {
        Name: "SLICE",
        unique: "slicelookuparticle",
        id: 66,
      },
      {
        Name: "JOIN",
        unique: "joinlookuparticle",
        id: 67,
      },
      {
        Name: "SET",
        unique: "setlookuparticle",
        id: 68,
      },
      {
        Name: "PUSH",
        unique: "pushlookuparticle",
        id: 69,
      },
      {
        Name: "REVERSE",
        unique: "reverselookuparticle",
        id: 70,
      },
      {
        Name: "UNSHIFT",
        unique: "unshiftlookuparticle",
        id: 71,
      },
      {
        Name: "INCLUDES",
        unique: "includeslookuparticle",
        id: 72,
      },
      {
        Name: "FILTER",
        unique: "filterlookuparticle",
        id: 73,
      },
      {
        Name: "MAP",
        unique: "maplookuparticle",
        id: 74,
      },
      {
        Name: "REDUCE",
        unique: "reducelookuparticle",
        id: 75,
      },
      {
        Name: "WITHOUT",
        unique: "withoutlookuparticle",
        id: 76,
      },
      {
        Name: "ARGS2ARRAY",
        unique: "args2arraylookuparticle",
        id: 77,
      },
      {
        Name: "ARRAY",
        unique: "arraylookuparticle",
        id: 78,
      },
      {
        Name: "CHOOSE",
        unique: "chooselookuparticle",
        id: 79,
      },
      {
        Name: "MATCH",
        unique: "matchlookuparticle",
        id: 80,
      },
      {
        Name: "UNIQUE",
        unique: "uniquelookuparticle",
        id: 81,
      },
    ],
  },
  {
    parent: "TEXT",
    child: [
      {
        Name: "CONCATENATE",
        unique: "concatenatetextarticle",
        id: 82,
      },
      {
        Name: "EXACT",
        unique: "exacttextarticle",
        id: 83,
      },
      {
        Name: "FIND",
        unique: "findtextarticle",
        id: 84,
      },
      {
        Name: "FIXED",
        unique: "fixedtextarticle",
        id: 85,
      },
      {
        Name: "FORMAT",
        unique: "formattextarticle",
        id: 86,
      },
      {
        Name: "LEFT",
        unique: "lefttextarticle",
        id: 87,
      },
      {
        Name: "LEN",
        unique: "lentextarticle",
        id: 88,
      },
      {
        Name: "LOWER",
        unique: "lowertextarticle",
        id: 89,
      },
      {
        Name: "MID",
        unique: "midtextarticle",
        id: 90,
      },
      {
        Name: "NUMBERVALUE",
        unique: "numbervaluetextarticle",
        id: 91,
      },
      {
        Name: "PROPER",
        unique: "propertextarticle",
        id: 92,
      },
      {
        Name: "REGEXEXTRACT",
        unique: "regexextracttextarticle",
        id: 93,
      },
      {
        Name: "REGEXMATCH",
        unique: "regexmatchtextarticle",
        id: 94,
      },
      {
        Name: "REGEXREPLACE",
        unique: "regexreplacetextarticle",
        id: 95,
      },
      {
        Name: "REPLACE",
        unique: "replacetextarticle",
        id: 96,
      },
      {
        Name: "REPT",
        unique: "repttextarticle",
        id: 97,
      },
      {
        Name: "RIGHT",
        unique: "righttextarticle",
        id: 98,
      },
      {
        Name: "SEARCH",
        unique: "searchtextarticle",
        id: 99,
      },
      {
        Name: "SPLIT",
        unique: "splittextarticle",
        id: 100,
      },
      {
        Name: "SUBSTITUTE",
        unique: "substitutetextarticle",
        id: 101,
      },
      {
        Name: "TRIM",
        unique: "trimtextarticle",
        id: 102,
      },
      {
        Name: "UPPER",
        unique: "uppertextarticle",
        id: 103,
      },
      {
        Name: "TEXTVALUE",
        unique: "textvaluetextarticle",
        id: 104,
      },
      {
        Name: "NUMBERFORMAT",
        unique: "numberformattextarticle",
        id: 105,
      },
    ],
  },
  {
    parent: "STATISTICAL",
    child: [
      {
        Name: "COUNT",
        unique: "countstatisticalarticle",
        id: 106,
      },
      {
        Name: "COUNTNUMBERS",
        unique: "countnumbersstatisticalarticle",
        id: 107,
      },
      {
        Name: "COUNTIF",
        unique: "countifstatisticalarticle",
        id: 108,
      },
      {
        Name: "COUNTUNIQUE",
        unique: "countuniquestatisticalarticle",
        id: 109,
      },
      {
        Name: "MAX",
        unique: "maxstatisticalarticle",
        id: 110,
      },
      {
        Name: "MEDIAN",
        unique: "medianstatisticalarticle",
        id: 111,
      },
      {
        Name: "MIN",
        unique: "minstatisticalarticle",
        id: 112,
      },
    ],
  },
  {
    parent: "ERRORS",
    child: [
      {
        Name: "ERROR",
        unique: "errorarticle",
        id: 113,
      },
    ],
  },
  {
    parent: "INFORMATION",
    child: [
      {
        Name: "ISERR",
        unique: "iserrarticle",
        id: 114,
      },
      {
        Name: "ISEVEN",
        unique: "isevenarticle",
        id: 115,
      },
      {
        Name: "ISNONTEXT",
        unique: "isnontextarticle",
        id: 116,
      },
      {
        Name: "ISNUMBER",
        unique: "isnumberarticle",
        id: 117,
      },
      {
        Name: "ISODD",
        unique: "isoddarticle",
        id: 118,
      },
      {
        Name: "ISTEXT",
        unique: "istextarticle",
        id: 119,
      },
    ],
  },
];
class CalculationStaticList extends React.Component {
  constructor() {
    super();
    this.state = { activeClass: 1, listData: list };
  }

  changeHandler = (e, uniqueName, id) => {
    this.props.onClick(uniqueName, id);
    if (this.state.activeClass === id) {
      this.setState({ activeClass: null });
    } else {
      this.setState({ activeClass: id });
    }
  };
  myColor = (position) => {
    if (this.state.activeClass === position) {
      return "#434a50";
    }
    return "";
  };
  toggleli = (event) => {
    $(this.refs[event]).slideToggle();
  };
  render() {
    return (
      <ul className="CalculationsHelp__navSection">
        {this.state.listData.map((t, key) => (
          <li className="collapsible-menu">
            {" "}
            <span
              className="CalculationsHelp__navSectionTitle"
              onClick={(event) => this.toggleli("toggle-" + t.parent)}
            >
              {t.parent}
            </span>
            <ul
              ref={"toggle-" + t.parent}
              className={this.props.searchText !== "" ? "blockUL" : ""}
            >
              {t.child != null &&
                t.child
                  .filter(
                    (e) =>
                      this.props.searchText === "" ||
                      e.Name.toLowerCase().indexOf(
                        this.props.searchText.toLowerCase()
                      ) > -1
                  )
                  .map((temp, key1) => (
                    <li>
                      <div
                        className="CalculationsHelp__navChapter"
                        style={{ color: this.myColor(temp.id) }}
                        onClick={(e) =>
                          this.changeHandler(e, temp.unique, temp.id)
                        }
                      >
                        {temp.Name}
                      </div>
                    </li>
                  ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }
}

export default CalculationStaticList;
