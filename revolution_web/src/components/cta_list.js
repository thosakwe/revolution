import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import LinearProgress from 'material-ui/LinearProgress';
import React from 'react';
import {connect} from 'react-redux';
import CTADialog from './cta_dialog';

const CTAList = ({
                     api, companyName, cta, dialogIsOpen, message,
                     openDialog, sending, snackbarOpen,
                     closeDialog, closeSnackbar, openSnackbar, onSubmit, setCompanyName,
                     setMessage
                 }) => {
    const _handleSubmit = data => onSubmit(api, data);

    const fabStyle = {
        position: 'fixed',
        bottom: '1em',
        right: '1em'
    };

    if (sending) {
        return (
            <div>
                <Dialog modal={true} open={true} title="Creating your call to action...">
                    <LinearProgress mode="indeterminate"/>
                    <br/>
                    Hang in there...
                </Dialog>
            </div>
        );
    }

    return (
        // TODO: Cards for each CTA
        <div>
            <FloatingActionButton onTouchTap={openDialog} style={fabStyle}>
                <FontIcon className="material-icons">add</FontIcon>
            </FloatingActionButton>
            <CTADialog
                closeSnackbar={closeSnackbar}
                companyName={companyName}
                message={message}
                open={dialogIsOpen}
                openSnackbar={openSnackbar}
                onCancel={closeDialog}
                onSubmit={_handleSubmit}
                setCompanyName={setCompanyName}
                setMessage={setMessage}
                snackbarOpen={snackbarOpen}
            />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        api: state.revolutionApp.api,
        companyName: state.ctaDialog.companyName,
        cta: state.revolutionApp.cta,
        dialogIsOpen: state.ctaDialog.open,
        message: state.ctaDialog.message,
        sending: state.ctaDialog.sending,
        snackbarOpen: state.ctaDialog.snackbarOpen,
    }
};

const dispatchToProps = dispatch => {
    return {
        closeDialog: () => {
            dispatch({
                type: 'cta_dialog::close'
            });
        },
        closeSnackbar: () => {
            dispatch({
                type: 'cta_dialog::snackbar_close'
            })
        },
        onSubmit: (api, data) => {
            dispatch({
                type: 'cta_dialog::sending'
            });

            api.createCallToAction(data).then(cta => {
                // TODO: Insert CTA, should also reset dialog
            }).catch(e => {
                // TODO: Display error globally
                console.error(e);
            });
        },
        openDialog: () => {
            dispatch({
                type: 'cta_dialog::open'
            });
        },
        openSnackbar: () => {
            dispatch({
                type: 'cta_dialog::snackbar_open'
            })
        },
        setCompanyName: (value) => {
            dispatch({
                value,
                type: 'cta_dialog::set_company_name'
            });
        },
        setMessage: (value) => {
            dispatch({
                value,
                type: 'cta_dialog::set_message'
            });
        }
    };
};

export default connect(mapStateToProps, dispatchToProps)(CTAList);