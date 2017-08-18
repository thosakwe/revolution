import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {createStore, combineReducers} from 'redux';
import Components from './components';
import revolutionApp from './reducers';

injectTapEventPlugin();

const store = createStore(
    combineReducers({
        ...revolutionApp,
        routing: routerReducer,
    }),
);

const history = syncHistoryWithStore(browserHistory, store);

const rootEl = document.getElementById('app');
const render = Component =>
    ReactDOM.render(
        <AppContainer>
            <MuiThemeProvider>
                <Provider store={store}>
                    <Router history={history}>
                        <Route path="/" component={Component}>
                            <IndexRoute component={Components.CTAList}/>
                            <Route path="/cta/:id" component={Components.CTADetail}/>
                        </Route>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        </AppContainer>,
        rootEl
    );

render(Components.RevolutionApp);
if (module.hot) module.hot.accept('./components/revolution_app', () => render(Components.RevolutionApp));