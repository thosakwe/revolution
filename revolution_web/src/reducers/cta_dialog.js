const defaultState = {
    open: false, sending: false, companyName: '', message: '',
    snackbarOpen: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'cta_dialog::open':
            return {...state, open: true};
        case 'cta_dialog::close':
            return {...state, open: false};
        case 'cta_dialog::sending':
            return {...state, sending: true};
        case 'cta_dialog::set_company_name':
            return {...state, companyName: action.value};
        case 'cta_dialog::set_message':
            return {...state, message: action.value};
        case 'cta_dialog::snackbar_open':
            return {...state, snackbarOpen: true};
        case 'cta_dialog::snackbar_close':
            return {...state, snackbarOpen: false};
        default:
            return state;
    }
};