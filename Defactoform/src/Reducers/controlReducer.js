 const storeData = (state = [], action) => {
    switch (action.type) {
      case 'SAVE_EDITOR':
        return  action
      case 'SAVE_MAILSTATE':
        return  action  
      case 'CLEAR':
            return  ""  
      default:
        return state
    }
  }

  export default storeData; 