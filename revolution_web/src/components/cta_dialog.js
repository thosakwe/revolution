import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import React from 'react';

export default ({
                    companyName, message, open, snackbarOpen,
                    closeSnackbar, openSnackbar, onSubmit, onCancel, setCompanyName, setMessage
                }) => {
    const _handleCompanyNameChange = (_, value) => {
        setCompanyName(value);
    };

    const _handleMessageChange = (_, value) => {
        setMessage(value);
    };

    const _handleSubmit = () => {
        if (companyName.length && message.length) {
            onSubmit({
                company_name: companyName,
                message,
            });
        } else {
            openSnackbar();
        }
    };

    const actions = [
        <FlatButton onTouchTap={onCancel} primary={true} label="Cancel"/>,
        <FlatButton onTouchTap={_handleSubmit} primary={true} label="Ok"/>,
    ];

    return (
        <div>
            <Snackbar
                onRequestClose={closeSnackbar}
                open={snackbarOpen}
                message="Incomplete form. Please ensure all fields are filled correctly."/>
            <Dialog
                actions={actions}
                modal={true}
                open={open}
                title="It's time to act.">
                <p>Publicly call a company to take action. Your voice is powerful.</p>
                <br/>
                <TextField onChange={_handleCompanyNameChange} fullWidth={true} value={companyName}
                           floatingLabelText="Company or Entity Name"/>
                <br/>
                <TextField
                    onChange={_handleMessageChange}
                    fullWidth={true}
                    multiLine={true}
                    rows={5}
                    value={message}
                    floatingLabelText="Message - What do you demand?"/>
            </Dialog>
        </div>
    );
};