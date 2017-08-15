import Api from '../api';
import ctaDialog from './cta_dialog';

const defaultState = {
    api: new Api(),
    title: 'Revolution',
    user: null,
    cta: [],
};

const revolutionApp = (state = defaultState, action) => {
    return state;
};

export default {revolutionApp, ctaDialog};