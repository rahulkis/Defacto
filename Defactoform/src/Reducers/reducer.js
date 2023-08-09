import { combineReducers } from 'redux';
import storeData  from "./controlReducer";
import StoreState  from "./saveStateReducer";
import savePageType from "./savePageType";

import fetchthemeInfo from "./fetchthemeInfo";
import fetchTranslationInfo from "./fetchTranslationInfo";
import fetchPaymentConfigInfo from "./fetchPaymentConfigInfo";

export default combineReducers({
    storeData,
    StoreState,
    savePageType,
    fetchthemeInfo,
    fetchTranslationInfo,
    fetchPaymentConfigInfo,
})