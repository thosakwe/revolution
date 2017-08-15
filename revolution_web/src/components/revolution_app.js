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

const RevolutionApp = ({api, children, dismissError, drawerOpen, error, setDrawer, setError, setUser, title, user}) => {
    const _startAuth = () => {
        window.addEventListener('token', (e) => {
            const jwt = e.detail;
            api.revive(jwt).then(setUser).catch(e => {
                setError(e.message);
            });
        }, false);
        const wnd = window.open('/auth/twitter');
    };

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
                {userSection}
                <Divider/>
                <List>
                    <Link style={linkStyle} to="/">
                        <ListItem
                            leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                            primaryText="Get Involved"/>
                    </Link>
                </List>
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
    };
};

const dispatchToProps = dispatch => {
    return {
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
        }
    };
};

export default connect(mapStateToProps, dispatchToProps)(RevolutionApp);