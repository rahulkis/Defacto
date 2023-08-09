let nextTodoId = 0;
export const saveState = (field,val) => ({
  type: 'SAVE_STATE',
  id: nextTodoId++,
  val: val,
  field:field
})
export const saveEditorData = text => ({
    type: 'SAVE_EDITOR',
    editorData: text
})
export const savePageType = text => ({
  type: 'SAVE_PAGE_TYPE',
  pageType: text
})
export const fetchthemeInfo=text=>  ({
  type: "GET_THEME_INFO",
  themeInfo: text
})
export const fetchTranslationInfo=text=>  ({
  type: "GET_TRANSLATION_INFO",
  translationInfo: text
})
export const fetchPaymentConfigInfo=text=>  ({
  type: "GET_PAYMENT_CONFIG_INFO",
  paymentConfigInfo: text
})