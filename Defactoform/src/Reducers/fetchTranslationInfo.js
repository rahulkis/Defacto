const fetchTranslationInfo = (state = [], action) => {
  switch (action.type) {
    case "GET_TRANSLATION_INFO":
      return action;
    case "CLEAR":
      return "";
    case "RESET":
      return (state = []);
    default:
      return state;
  }
};

export default fetchTranslationInfo;
