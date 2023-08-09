const StoreState = (state = [], action) => {
    switch (action.type) {
        case 'SAVE_STATE':
        return [action ]
        case 'CLEAR':
         return []
        default:
        return state
    }
}
export default StoreState;