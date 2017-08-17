import Api from '../api';
import ctaDialog from './cta_dialog';

const defaultState = {
    // Global
    api: new Api(),
    drawerOpen: false,
    error: '',
    title: 'Revolutionizr',
    user: null,
    websocket: null,

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
        case 'revolution_app::error_dismiss':
            return {...state, error: ''};
        case 'revolution_app::push_cta':
            if (Array.isArray(action.value)) {
                return {...state, cta: action.value.concat(state.cta)};
            }

            return {...state, cta: [action.value, ...state.cta]};
        case 'revolution_app::title':
            document.title = `${action.value} - Revolution`;
            return {...state, title: action.value};
        case 'revolution_app::user':
            return {...state, user: action.value};
        case 'revolution_app::websocket':
            if (state.websocket) {
                if (action.value.readyState === 0 || action.value.readyState === 1)
                    action.value.close();
                return state;
            }

            return {...state, websocket: action.value};
        case 'revolution_app::websocket_error':
            if (state.websocket !== null) return state;
            //console.info(state);
            return {...state, error: action.value};
        default:
            //console.warn(`Unknown action type: ${action.type}`);
            return state;
    }
};

export default {revolutionApp, ctaDialog};