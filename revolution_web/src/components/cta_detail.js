import {Card, CardHeader, CardMedia, CardText, CardTitle} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import AvatarDialog from './avatar_dialog';

const CTADetail = ({
                       api, cta, dialogOpen, files, id, sending, user, websocket,
                       setAvatar, setError, setFiles, setOpen, setSending, setTitle
                   }) => {

    if (!websocket || !cta) {
        if (websocket && !cta) {
            api.fetchCtaById(id, websocket);
        }

        return (
            <div style={{padding: '5em', textAlign: 'center'}}>
                <CircularProgress/>
                <br/><br/>
                Connecting to the server...
            </div>
        );
    }

    setTitle(cta.company_name);

    let toolbarComponent;

    if (user && cta.user_id === user.id) {
        toolbarComponent = (
            <Toolbar>
                <ToolbarGroup firstChild={true}>
                    <ToolbarTitle text="Actions" style={{marginLeft: '1em'}}/>
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconMenu
                        iconButtonElement={
                            <IconButton touch={true}>
                                <FontIcon className="material-icons">expand_more</FontIcon>
                            </IconButton>
                        }>
                        <MenuItem
                            onTouchTap={() => setOpen(true)}
                            primaryText="Upload Cover Image..."
                            leftIcon={<FontIcon className="material-icons">camera_alt</FontIcon>}/>
                    </IconMenu>
                </ToolbarGroup>
            </Toolbar>
        );
    }

    let titleComponent;

    if (cta.avatar) {
        titleComponent = (
            <CardMedia
                overlay={<CardTitle title={`Calling out ${cta.company_name}`}/>}>
                <img
                    src={`/upload/${cta.avatar}`}
                    alt={cta.company_name}/>
            </CardMedia>
        );
    } else {
        titleComponent = (
            <CardTitle title={`Calling out ${cta.company_name}`}/>
        );
    }

    return (
        <div>
            <AvatarDialog
                api={api}
                files={files}
                id={id}
                onComplete={(avatar) => setAvatar(id, avatar)}
                open={dialogOpen}
                sending={sending}
                setError={setError}
                setFiles={setFiles}
                setOpen={setOpen}
                setSending={setSending}/>
            {toolbarComponent}
            <div style={{padding: '1em'}}>
                <FloatingActionButton style={{position: 'fixed', bottom: '1em', right: '1em'}}>
                    <FontIcon className="material-icons">share</FontIcon>
                </FloatingActionButton>

                <Card>
                    <CardHeader
                        avatar={cta.user.avatar}
                        subtitle={moment(cta.created_at).format('MMMM Do, YYYY')}
                        title={`@${cta.user.name}`}/>
                    {titleComponent}
                    <CardText>{cta.message}</CardText>
                </Card>
            </div>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    let cta = null;

    for (const c of state.revolutionApp.cta) {
        if (c.id === ownProps.routeParams.id) {
            cta = c;
            break;
        }
    }

    return {
        cta,
        id: ownProps.routeParams.id,
        api: state.revolutionApp.api,
        dialogOpen: state.avatarDialog.open,
        files: state.avatarDialog.files,
        sending: state.avatarDialog.sending,
        websocket: state.revolutionApp.websocket,
        user: state.revolutionApp.user,
    };
};

const dispatchToProps = dispatch => {
    return {
        setAvatar: (id, avatar) => {
            dispatch({
                id, avatar,
                type: 'revolution_app::cta_avatar'
            });
        },
        setError: error => {
            dispatch({
                error,
                type: 'revolution_app::error'
            });
        },
        setFiles: value => {
            dispatch({
                value,
                type: 'avatar_dialog::files'
            });
        },
        setOpen: value => {
            dispatch({
                value,
                type: 'avatar_dialog::open'
            });
        },
        setSending: value => {
            dispatch({
                value,
                type: 'avatar_dialog::sending'
            });
        },
        setTitle: value => {
            dispatch({
                value,
                type: 'revolution_app::title'
            });
        }
    };
};

export default connect(mapStateToProps, dispatchToProps)(CTADetail);