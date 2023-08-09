import React from "react";
import CalculationStaticList from "../../../views/CalculationsArticle/CalculationStaticList";
import NumbersArticle from "../../../views/CalculationsArticle/NumbersArticle";
import AddArticle from "../../../views/CalculationsArticle/AddArticle";
import SubtractArticle from "../../../views/CalculationsArticle/SubtractArticle";
import MultiplyArticle from "../../../views/CalculationsArticle/MultiplyArticle";
import DivideArticle from "../../../views/CalculationsArticle/DivideArticle";
import GroupArticle from "../../../views/CalculationsArticle/GroupArticle";
import TypingTextArticle from "../../../views/CalculationsArticle/TypingTextArticle";
import ConcatenateArticle from "../../../views/CalculationsArticle/ConcatenateArticle";
import AnswerPipingArticle from "../../../views/CalculationsArticle/AnswerPipingArticle";
import VariablesArticle from "../../../views/CalculationsArticle/VariablesArticle";
import ProductsArticle from "../../../views/CalculationsArticle/ProductsArticle";
import BooleansArticle from "../../../views/CalculationsArticle/BooleansArticle";
import NotArticle from "../../../views/CalculationsArticle/NotArticle";
import AndArticle from "../../../views/CalculationsArticle/AndArticle";
import OrArticle from "../../../views/CalculationsArticle/OrArticle";
import EqualsArticle from "../../../views/CalculationsArticle/EqualsArticle";
import DoesntEqualArticle from "../../../views/CalculationsArticle/DoesntEqualArticle";
import GreaterthanArticle from "../../../views/CalculationsArticle/GreaterthanArticle";
import GreaterOrEqualArticle from "../../../views/CalculationsArticle/GreaterOrEqualArticle";
import LessthanArticle from "../../../views/CalculationsArticle/LessthanArticle";
import LessOrEqualArticle from "../../../views/CalculationsArticle/LessOrEqualArticle";
// Functions Section
// Maths
import AbsArticle from "../../../views/CalculationsArticle/Functions/MATHS/AbsArticle";
import PowArticle from "../../../views/CalculationsArticle/Functions/MATHS/PowArticle";
import AverageArticle from "../../../views/CalculationsArticle/Functions/MATHS/AverageArticle";
import AverageIfArticle from "../../../views/CalculationsArticle/Functions/MATHS/AverageIfArticle";
import CeilingArticle from "../../../views/CalculationsArticle/Functions/MATHS/CeilingArticle";
import ConvertArticle from "../../../views/CalculationsArticle/Functions/MATHS/ConvertArticle";
import DecimalArticle from "../../../views/CalculationsArticle/Functions/MATHS/DecimalArticle";
import EvenArticle from "../../../views/CalculationsArticle/Functions/MATHS/EvenArticle";
import FloorArticle from "../../../views/CalculationsArticle/Functions/MATHS/FloorArticle";
import IntArticle from "../../../views/CalculationsArticle/Functions/MATHS/IntArticle";
import LargeArticle from "../../../views/CalculationsArticle/Functions/MATHS/LargeArticle";
import OddArticle from "../../../views/CalculationsArticle/Functions/MATHS/OddArticle";
import RomanArticle from "../../../views/CalculationsArticle/Functions/MATHS/RomanArticle";
import RoundArticle from "../../../views/CalculationsArticle/Functions/MATHS/RoundArticle";
import RoundDownArticle from "../../../views/CalculationsArticle/Functions/MATHS/RoundDownArticle";
import RoundUpArticle from "../../../views/CalculationsArticle/Functions/MATHS/RoundUpArticle";
import SignArticle from "../../../views/CalculationsArticle/Functions/MATHS/SignArticle";
import SmallArticle from "../../../views/CalculationsArticle/Functions/MATHS/SmallArticle";
import SumIfArticle from "../../../views/CalculationsArticle/Functions/MATHS/SumIfArticle";
import TruncArticle from "../../../views/CalculationsArticle/Functions/MATHS/TruncArticle";
// End Maths
// Logical
import AndLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/AndLogicalArticle";
import IfLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/IfLogicalArticle";
import IfErrorLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/IfErrorLogicalArticle";
import NotLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/NotLogicalArticle";
import OrLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/OrLogicalArticle";
import SwitchLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/SwitchLogicalArticle";
import XorLogicalArticle from "../../../views/CalculationsArticle/Functions/LOGICAL/XorLogicalArticle";
//End Logical
// Lookup
import FirstlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/FirstlookupArticle";
import LastlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/LastlookupArticle";
import GetlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/GetlookupArticle";
import SlicelookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/SlicelookupArticle";
import JoinlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/JoinlookupArticle";
import SetlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/SetlookupArticle";
import PushlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/PushlookupArticle";
import ReverselookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/ReverselookupArticle";
import UnshiftlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/UnshiftlookupArticle";
import IncludeslookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/IncludeslookupArticle";
import FilterlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/FilterlookupArticle";
import MaplookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/MaplookupArticle";
import ReducelookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/ReducelookupArticle";
import WithoutlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/WithoutlookupArticle";
import Args2ArraylookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/Args2ArraylookupArticle";
import ArraylookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/ArraylookupArticle";
import ChooselookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/ChooselookupArticle";
import MatchlookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/MatchlookupArticle";
import UniquelookupArticle from "../../../views/CalculationsArticle/Functions/LOOKUP/UniquelookupArticle";
//End Lookup
// Text
import ConcatenateTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/ConcatenateTextArticle";
import ExactTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/ExactTextArticle";
import FindTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/FindTextArticle";
import FixedTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/FixedTextArticle";
import FormatTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/FormatTextArticle";
import LeftTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/LeftTextArticle";
import LenTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/LenTextArticle";
import LowerTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/LowerTextArticle";
import MidTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/MidTextArticle";
import NumberFormatTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/NumberFormatTextArticle";
import NumberValueTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/NumberValueTextArticle";
import ProperTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/ProperTextArticle";
import RegexExtractTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/RegexExtractTextArticle";
import RegexMatchTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/RegexMatchTextArticle";
import RegexReplaceTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/RegexReplaceTextArticle";
import ReplaceTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/ReplaceTextArticle";
import ReptTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/ReptTextArticle";
import RightTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/RightTextArticle";
import SearchTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/SearchTextArticle";
import SplitTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/SplitTextArticle";
import SubstituteTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/SubstituteTextArticle";
import TextValueTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/TextValueTextArticle";
import TrimTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/TrimTextArticle";
import UpperTextArticle from "../../../views/CalculationsArticle/Functions/TEXT/UpperTextArticle";
// End Text
// STATISTICAL
import CountStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/CountStatisticalArticle";
import CountNumbersStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/CountNumbersStatisticalArticle";
import CountIfStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/CountIfStatisticalArticle";
import CountUniqueStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/CountUniqueStatisticalArticle";
import MaxStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/MaxStatisticalArticle";
import MedianStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/MedianStatisticalArticle";
import MinStatisticalArticle from "../../../views/CalculationsArticle/Functions/STATISTICAL/MinStatisticalArticle";
// End STATISTICAL
// Error
import ErrorArticle from "../../../views/CalculationsArticle/Functions/ERROR/ErrorArticle";
// End Error
// Information
import IsErrArticle from "../../../views/CalculationsArticle/Functions/INFORMATION/IsErrArticle";
import IsEvenArticle from "../../../views/CalculationsArticle/Functions/INFORMATION/IsEvenArticle";
import IsNonTextArticle from "../../../views/CalculationsArticle/Functions/INFORMATION/IsNonTextArticle";
import IsNumberArticle from "../../../views/CalculationsArticle/Functions/INFORMATION/IsNumberArticle";
import IsOddArticle from "../../../views/CalculationsArticle/Functions/INFORMATION/IsOddArticle";
import IsTextArticle from "../../../views/CalculationsArticle/Functions/INFORMATION/IsTextArticle";
// End Information
import DateFormatArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateFormatArticle";
import DateAddArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateAddArticle";
import DateSubArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateSubArticle";
import DateDiffArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateDiffArticle";
import DateGetArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateGetArticle";
import DateSetArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateSetArticle";
import DateIsAfterArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateIsAfterArticle";
import DateIsBeforeArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateIsBeforeArticle";
import DateStartOfArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateStartOfArticle";
import DateIsEqualArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateIsEqualArticle";
import DateIsFutureArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateIsFutureArticle";
import DateEndOfArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateEndOfArticle";
import DateIsPastArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateIsPastArticle";
import DateIsValidArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/DateIsValidArticle";
import NowArticle from "../../../views/CalculationsArticle/Functions/DATE AND TIME/NowArticle";
import "../../../../src/assets/custom/CalculationHelp.css";

class CalculationHelp extends React.Component {
  constructor() {
    super();
    this.state = { render: "numbersarticle", searchtxt: "", activeClass: 0 };
  }

  componentWillMount() {
    this._renderSubComp();
  }

  changeHandler = (compName, position) => {
    this.setState({ render: compName });
  };

  filterData = (e) => {
    let searchedTxt = e.target.value;
    if (searchedTxt) {
      this.setState({ searchtxt: searchedTxt });
    } else {
      this.setState({ searchtxt: searchedTxt });
    }
  };

  copyformula = (
    copydata,
    copyFormaulName,
    commentText,
    resultData,
    IsError
  ) => {
    this.props.GetCopyData(
      copydata,
      copyFormaulName,
      commentText,
      resultData,
      IsError
    );
    this.props.handleCall_CopyData(copydata);
  };

  _renderSubComp() {
    switch (this.state.render) {
      case "addarticle":
        return <AddArticle copyformula={this.copyformula} />;
      case "numbersarticle":
        return <NumbersArticle copyformula={this.copyformula} />;
      case "subtractarticle":
        return <SubtractArticle copyformula={this.copyformula} />;
      case "multiplyarticle":
        return <MultiplyArticle copyformula={this.copyformula} />;
      case "dividearticle":
        return <DivideArticle copyformula={this.copyformula} />;
      case "grouparticle":
        return <GroupArticle copyformula={this.copyformula} />;
      case "typingtextarticle":
        return <TypingTextArticle copyformula={this.copyformula} />;
      case "concatenatearticle":
        return <ConcatenateArticle copyformula={this.copyformula} />;
      case "answerpipingarticle":
        return <AnswerPipingArticle copyformula={this.copyformula} />;
      case "variablesarticle":
        return <VariablesArticle copyformula={this.copyformula} />;
      case "productsarticle":
        return <ProductsArticle copyformula={this.copyformula} />;
      case "booleansarticle":
        return <BooleansArticle copyformula={this.copyformula} />;
      case "notarticle":
        return <NotArticle copyformula={this.copyformula} />;
      case "andarticle":
        return <AndArticle copyformula={this.copyformula} />;
      case "orarticle":
        return <OrArticle copyformula={this.copyformula} />;
      case "equalsarticle":
        return <EqualsArticle copyformula={this.copyformula} />;
      case "doesnotequalarticle":
        return <DoesntEqualArticle copyformula={this.copyformula} />;
      case "greaterarticle":
        return <GreaterthanArticle copyformula={this.copyformula} />;
      case "greatorequalarticle":
        return <GreaterOrEqualArticle copyformula={this.copyformula} />;
      case "lessarticle":
        return <LessthanArticle copyformula={this.copyformula} />;
      case "lessorequalarticle":
        return <LessOrEqualArticle copyformula={this.copyformula} />;
      // Functions
      // Maths
      case "absarticle":
        return <AbsArticle copyformula={this.copyformula} />;
      case "powarticle":
        return <PowArticle copyformula={this.copyformula} />;
      case "averagearticle":
        return <AverageArticle copyformula={this.copyformula} />;
      case "averageifarticle":
        return <AverageIfArticle copyformula={this.copyformula} />;
      case "ceilingarticle":
        return <CeilingArticle copyformula={this.copyformula} />;
      case "convertarticle":
        return <ConvertArticle copyformula={this.copyformula} />;
      case "decimalarticle":
        return <DecimalArticle copyformula={this.copyformula} />;
      case "evenarticle":
        return <EvenArticle copyformula={this.copyformula} />;
      case "floorarticle":
        return <FloorArticle copyformula={this.copyformula} />;
      case "intarticle":
        return <IntArticle copyformula={this.copyformula} />;
      case "largearticle":
        return <LargeArticle copyformula={this.copyformula} />;
      case "oddarticle":
        return <OddArticle copyformula={this.copyformula} />;
      case "romanarticle":
        return <RomanArticle copyformula={this.copyformula} />;
      case "roundarticle":
        return <RoundArticle copyformula={this.copyformula} />;
      case "rounddownarticle":
        return <RoundDownArticle copyformula={this.copyformula} />;
      case "rounduparticle":
        return <RoundUpArticle copyformula={this.copyformula} />;
      case "signarticle":
        return <SignArticle copyformula={this.copyformula} />;
      case "smallarticle":
        return <SmallArticle copyformula={this.copyformula} />;
      case "sumifarticle":
        return <SumIfArticle copyformula={this.copyformula} />;
      case "truncarticle":
        return <TruncArticle copyformula={this.copyformula} />;
      // End Maths
      // Logical
      case "andlogicalarticle":
        return <AndLogicalArticle copyformula={this.copyformula} />;
      case "iflogicalarticle":
        return <IfLogicalArticle copyformula={this.copyformula} />;
      case "iferrorlogicalarticle":
        return <IfErrorLogicalArticle copyformula={this.copyformula} />;
      case "notlogicalarticle":
        return <NotLogicalArticle copyformula={this.copyformula} />;
      case "orlogicalarticle":
        return <OrLogicalArticle copyformula={this.copyformula} />;
      case "switchlogicalarticle":
        return <SwitchLogicalArticle copyformula={this.copyformula} />;
      case "xorlogicalarticle":
        return <XorLogicalArticle copyformula={this.copyformula} />;
      //End Logical
      // Lookup
      case "firstlookuparticle":
        return <FirstlookupArticle copyformula={this.copyformula} />;
      case "lastlookuparticle":
        return <LastlookupArticle copyformula={this.copyformula} />;
      case "getlookuparticle":
        return <GetlookupArticle copyformula={this.copyformula} />;
      case "slicelookuparticle":
        return <SlicelookupArticle copyformula={this.copyformula} />;
      case "joinlookuparticle":
        return <JoinlookupArticle copyformula={this.copyformula} />;
      case "setlookuparticle":
        return <SetlookupArticle copyformula={this.copyformula} />;
      case "pushlookuparticle":
        return <PushlookupArticle copyformula={this.copyformula} />;
      case "reverselookuparticle":
        return <ReverselookupArticle copyformula={this.copyformula} />;
      case "unshiftlookuparticle":
        return <UnshiftlookupArticle copyformula={this.copyformula} />;
      case "includeslookuparticle":
        return <IncludeslookupArticle copyformula={this.copyformula} />;
      case "filterlookuparticle":
        return <FilterlookupArticle copyformula={this.copyformula} />;
      case "maplookuparticle":
        return <MaplookupArticle copyformula={this.copyformula} />;
      case "reducelookuparticle":
        return <ReducelookupArticle copyformula={this.copyformula} />;
      case "args2arraylookuparticle":
        return <Args2ArraylookupArticle copyformula={this.copyformula} />;
      case "arraylookuparticle":
        return <ArraylookupArticle copyformula={this.copyformula} />;
      case "chooselookuparticle":
        return <ChooselookupArticle copyformula={this.copyformula} />;
      case "matchlookuparticle":
        return <MatchlookupArticle copyformula={this.copyformula} />;
      case "uniquelookuparticle":
        return <UniquelookupArticle copyformula={this.copyformula} />;
      case "withoutlookuparticle":
        return <WithoutlookupArticle copyformula={this.copyformula} />;
      //End Lookup
      // Text
      case "concatenatetextarticle":
        return <ConcatenateTextArticle copyformula={this.copyformula} />;
      case "exacttextarticle":
        return <ExactTextArticle copyformula={this.copyformula} />;
      case "findtextarticle":
        return <FindTextArticle copyformula={this.copyformula} />;
      case "fixedtextarticle":
        return <FixedTextArticle copyformula={this.copyformula} />;
      case "formattextarticle":
        return <FormatTextArticle copyformula={this.copyformula} />;
      case "lefttextarticle":
        return <LeftTextArticle copyformula={this.copyformula} />;
      case "lentextarticle":
        return <LenTextArticle copyformula={this.copyformula} />;
      case "lowertextarticle":
        return <LowerTextArticle copyformula={this.copyformula} />;
      case "midtextarticle":
        return <MidTextArticle copyformula={this.copyformula} />;
      case "numberformattextarticle":
        return <NumberFormatTextArticle copyformula={this.copyformula} />;
      case "numbervaluetextarticle":
        return <NumberValueTextArticle copyformula={this.copyformula} />;
      case "propertextarticle":
        return <ProperTextArticle copyformula={this.copyformula} />;
      case "regexextracttextarticle":
        return <RegexExtractTextArticle copyformula={this.copyformula} />;
      case "regexmatchtextarticle":
        return <RegexMatchTextArticle copyformula={this.copyformula} />;
      case "regexreplacetextarticle":
        return <RegexReplaceTextArticle copyformula={this.copyformula} />;
      case "replacetextarticle":
        return <ReplaceTextArticle copyformula={this.copyformula} />;
      case "repttextarticle":
        return <ReptTextArticle copyformula={this.copyformula} />;
      case "righttextarticle":
        return <RightTextArticle copyformula={this.copyformula} />;
      case "searchtextarticle":
        return <SearchTextArticle copyformula={this.copyformula} />;
      case "splittextarticle":
        return <SplitTextArticle copyformula={this.copyformula} />;
      case "substitutetextarticle":
        return <SubstituteTextArticle copyformula={this.copyformula} />;
      case "textvaluetextarticle":
        return <TextValueTextArticle copyformula={this.copyformula} />;
      case "trimtextarticle":
        return <TrimTextArticle copyformula={this.copyformula} />;
      case "uppertextarticle":
        return <UpperTextArticle copyformula={this.copyformula} />;
      // End Text
      // STATISTICAL
      case "countstatisticalarticle":
        return <CountStatisticalArticle copyformula={this.copyformula} />;
      case "countnumbersstatisticalarticle":
        return (
          <CountNumbersStatisticalArticle copyformula={this.copyformula} />
        );
      case "countifstatisticalarticle":
        return <CountIfStatisticalArticle copyformula={this.copyformula} />;
      case "countuniquestatisticalarticle":
        return <CountUniqueStatisticalArticle copyformula={this.copyformula} />;
      case "maxstatisticalarticle":
        return <MaxStatisticalArticle copyformula={this.copyformula} />;
      case "medianstatisticalarticle":
        return <MedianStatisticalArticle copyformula={this.copyformula} />;
      case "minstatisticalarticle":
        return <MinStatisticalArticle copyformula={this.copyformula} />;
      // End STATISTICAL
      // Error
      case "errorarticle":
        return <ErrorArticle copyformula={this.copyformula} />;
      // End Error
      // Information
      case "iserrarticle":
        return <IsErrArticle copyformula={this.copyformula} />;
      case "isevenarticle":
        return <IsEvenArticle copyformula={this.copyformula} />;
      case "isnontextarticle":
        return <IsNonTextArticle copyformula={this.copyformula} />;
      case "isnumberarticle":
        return <IsNumberArticle copyformula={this.copyformula} />;
      case "isoddarticle":
        return <IsOddArticle copyformula={this.copyformula} />;
      case "istextarticle":
        return <IsTextArticle copyformula={this.copyformula} />;
      // End Information
      case "dateformatarticle":
        return <DateFormatArticle copyformula={this.copyformula} />;
      case "dateaddarticle":
        return <DateAddArticle copyformula={this.copyformula} />;
      case "datesubarticle":
        return <DateSubArticle copyformula={this.copyformula} />;
      case "datediffarticle":
        return <DateDiffArticle copyformula={this.copyformula} />;
      case "dategetarticle":
        return <DateGetArticle copyformula={this.copyformula} />;
      case "datesetarticle":
        return <DateSetArticle copyformula={this.copyformula} />;
      case "dateisafterarticle":
        return <DateIsAfterArticle copyformula={this.copyformula} />;
      case "dateisbeforearticle":
        return <DateIsBeforeArticle copyformula={this.copyformula} />;
      case "datestartofarticle":
        return <DateStartOfArticle copyformula={this.copyformula} />;
      case "dateisequalarticle":
        return <DateIsEqualArticle copyformula={this.copyformula} />;
      case "dateisfuturearticle":
        return <DateIsFutureArticle copyformula={this.copyformula} />;
      case "dateendofarticle":
        return <DateEndOfArticle copyformula={this.copyformula} />;
      case "dateispastarticle":
        return <DateIsPastArticle copyformula={this.copyformula} />;
      case "dateisvalidarticle":
        return <DateIsValidArticle copyformula={this.copyformula} />;
      case "nowarticle":
        return <NowArticle copyformula={this.copyformula} />;
      default:
        return <AddArticle copyformula={this.copyformula} />;
    }
  }
  render() {
    return (
      <div className="Calculation col-md-12">
        <div className="FieldConfiguration__label">
          <label>How to use calculations</label>{" "}
        </div>
        <div className="calculation-main-style">
          <div className="FieldConfigurationField-adjustment">
            <div className="FieldConfiguration__value m-0">
              <div className="CalculationsHelp">
                <div className="CalculationsHelp__nav">
                  <input
                    placeholder="Search..."
                    name="Search for docs"
                    className="calculation_Input_Search"
                    onKeyDown={(e) => this.filterData(e)}
                  />
                  <div />
                  <CalculationStaticList
                    searchText={this.state.searchtxt}
                    onClick={this.changeHandler}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="CalculationsHelp__article">
            {this._renderSubComp()}
          </div>
        </div>
      </div>
    );
  }
}

export default CalculationHelp;
