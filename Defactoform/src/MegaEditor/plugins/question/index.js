import QuestionButton from "./QuestionButton";
import QuestionBlock from "./QuestionBlock";

import { PLUGIN_TYPE } from "../../../util/constants";

export default {
  title: "Add Question",
  type: PLUGIN_TYPE,
  buttonComponent: QuestionButton,
  blockComponent: QuestionBlock,
  options: {
    displayOptions: [],
    defaultDisplay: null
  }
};
