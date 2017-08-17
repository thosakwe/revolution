import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

const RevolutionApp = ({
                           api, children, dismissError, dispatch, drawerOpen, error, title, user, websocket,
                           setDrawer, setError, setUser, setWebsocket
                       }) => {
    const _applyJwt = (jwt) => {
        return api.revive(jwt, websocket)
            .then(setUser)
            .then(() => {
                return api.fetchSecureData(dispatch);
            });
    };

    const _startAuth = () => {
        window.addEventListener('token', (e) => {
            return _applyJwt(e.detail).catch(e => {
                setError(e.message);
            });
        }, false);
        window.open('/auth/twitter');
    };

    if (!user && window.localStorage['token']) {
        _applyJwt(window.localStorage['token']).catch(() => {
            window.localStorage.removeItem('token');
        });
    } else if (!websocket) {
        /*
         this.fetchCta().then(value => {
         dispatch({
         value,
         type: 'revolution_app::push_cta'
         });
         }),
         */
        // TODO: Figure out how to make secure WebSockets in production
        const ws = new WebSocket(WS_URL);

        ws.onerror = e => {
            setError(e.message);
        };

        ws.onopen = () => {
            setWebsocket(ws);

            ws.onmessage = e => {
                const msg = JSON.parse(e.data);

                switch (msg.eventName) {
                    case 'api/cta::indexed':
                    case 'api/cta::created':
                        dispatch({
                            type: 'revolution_app::push_cta',
                            value: msg.data,
                        });
                        break;
                }
            };

            if (ws.readyState !== 1) {
                dispatch({
                    type: 'revolution_app::websocket_error',
                    value: 'Could not connect to real-time server.'
                });
                return;
            }

            ws.send(JSON.stringify({
                eventName: 'api/cta::index'
            }));
        }
    }

    const actions = [
        <FlatButton label="Dismiss" onTouchTap={dismissError} primary={true}/>
    ];

    const drawerHeaderStyle = {boxShadow: 'none', height: '10em'};

    if (user) {
        drawerHeaderStyle.backgroundImage = `url('${user.avatar}')`;
        drawerHeaderStyle.backgroundSize = 'cover';
    }

    const linkStyle = {
        textDecoration: 'none'
    };

    let userSection;

    if (!user) {
        userSection = (
            <List>
                <ListItem
                    leftIcon={<FontIcon className="material-icons">person</FontIcon>}
                    onTouchTap={_startAuth}
                    primaryText="Sign In"/>
            </List>
        );
    } else {
        userSection = (
            <List>
                <ListItem
                    leftAvatar={<Avatar src={user.avatar}/>}
                    primaryText="My Actions"/>
                <Link to="/settings" style={{textDecoration: 'none'}}>
                    <ListItem
                        leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
                        primaryText="Account Settings"/>
                </Link>
            </List>
        );
    }

    return (
        <div>
            <Drawer
                docked={false}
                onRequestChange={setDrawer}
                open={drawerOpen}>
                <AppBar
                    showMenuIconButton={false}
                    style={drawerHeaderStyle}
                    title={user ? `@${user.name}` : 'Revolution'}
                    titleStyle={{position: 'absolute', bottom: '0', marginLeft: '-0.5em'}}/>
                <List>
                    <Link style={linkStyle} to="/">
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText="Get Involved"/>
                    </Link>
                </List>
                <Divider/>
                {userSection}
            </Drawer>
            <AppBar onLeftIconButtonTouchTap={() => setDrawer(true)} title={title}/>
            <Dialog actions={actions} modal={true} open={error.length > 0} title="Whoops! That didn't go as planned.">
                {error}
            </Dialog>
            {children}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        api: state.revolutionApp.api,
        children: ownProps.children,
        drawerOpen: state.revolutionApp.drawerOpen,
        error: state.revolutionApp.error,
        title: state.revolutionApp.title,
        user: state.revolutionApp.user,
        websocket: state.revolutionApp.websocket,
    };
};

const dispatchToProps = dispatch => {
    return {
        dispatch,
        dismissError: () => {
            dispatch({
                type: 'revolution_app::error_dismiss'
            });
        },
        setDrawer: (value) => {
            dispatch({
                value,
                type: 'revolution_app::drawer'
            });
        },
        setError: error => {
            dispatch({
                error,
                type: 'revolution_app::error'
            });
        },
        setUser: value => {
            dispatch({
                value,
                type: 'revolution_app::user'
            });
        },
        setWebsocket: value => {
            dispatch({
                value,
                type: 'revolution_app::websocket'
            })
        }
    };
};

export default connect(mapStateToProps, dispatchToProps)(RevolutionApp);