const savePageType = (state = [], action) => {
    switch (action.type) {
      case 'SAVE_PAGE_TYPE':
        return  action
      case 'SAVE_MAILSTATE':
        return  action  
      case 'CLEAR':
            return ""
      default:
        return state
    }
  }

  export default savePageType; 