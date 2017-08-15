import Api from '../api';
import ctaDialog from './cta_dialog';

export const defaultState = {
    // Global
    api: null,
    drawerOpen: false,
    error: '',
    title: 'Revolution',
    user: null,

    // Data
    cta: [],
};

const revolutionApp = (state = defaultState, action) => {
    switch (action.type) {
        case 'revolution_app::drawer':
            return {...state, drawerOpen: action.value};
        case 'revolution_app::error':
            console.error(action.error);
            return {...state, error: action.error};
        case 'revolution_app::error_dimiss':
            return {...state, error: ''};
        case 'revolution_app::title':
            document.title = `${action.value} - Revolution`;
            return {...state, title: action.value};
        case 'revolution_app::user':
            return {...state, user: action.value};
        default:
            return state;
    }
};

export default {revolutionApp, ctaDialog};