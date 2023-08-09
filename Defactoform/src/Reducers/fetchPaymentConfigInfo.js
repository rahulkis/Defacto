const fetchPaymentConfigInfo = (state = [], action) => {
    switch (action.type) {
      case "GET_PAYMENT_CONFIG_INFO":
        return action;
      case "CLEAR":
        return "";
      case "RESET":
        return (state = []);
      default:
        return state;
    }
  };
  
  export default fetchPaymentConfigInfo;
  