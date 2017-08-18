const defaultState = {
    files: [],
    open: false,
    sending: false
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'avatar_dialog::files':
            return {...state, files: action.value};
        case 'avatar_dialog::open':
            return {...state, open: action.value};
        case 'avatar_dialog::sending':
            return {...state, files: [], sending: action.value};
        default:
            return state;
    }
};