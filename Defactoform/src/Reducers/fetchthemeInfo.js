
const fetchthemeInfo = (state = [], action) => {
    switch (action.type) {
     
      case 'GET_THEME_INFO':
        return  action  
        case 'RESET':
          return  state = []
      default:
        return state
    }
  }

  export default fetchthemeInfo; 