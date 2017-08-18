import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import Dropzone from 'react-dropzone';

export default ({api, files, id, onComplete, open, sending, setError, setFiles, setOpen, setSending}) => {
    const _handleCancel = () => {
        setFiles([]);
        setOpen(false);
    };

    const _startUpload = () => {
        if (sending) return;
        setSending(true);
        api.upload(id, files[0])
            .then(onComplete)
            .catch(e => {
                setError(e.message);
            })
            .finally(() => {
                setOpen(false);
                setSending(false);
                setFiles([]);
            });
    };

    let content, actions = [];

    if (sending) {
        content = (
            <div>
                <CircularProgress/>
                <br/>
                Uploading...
            </div>
        );
    } else {
        actions.push(
            <FlatButton onTouchTap={_handleCancel} primary={true} label="Cancel"/>,
        );

        if (!files.length) {
            content = (
                <div>
                    <Dropzone
                        accept="image/jpeg, image/png"
                        onDrop={setFiles}/>
                    <br/>
                    <em>Allowed file types: .jpeg, .jpg, .png</em>
                    <br/>
                    <em>Max file size: 5MB</em>
                    <br/>
                    <em>Max dimensions: 500x500</em>
                </div>
            );
        } else {
            content = (
                <div>
                    <img
                        style={{maxWidth: '10em'}}
                        src={window.URL.createObjectURL(files[0].slice())}/>
                    <br/><br/>
                    <em>Upload {files[0].name}?</em>
                </div>
            );


            actions.push(
                <FlatButton onTouchTap={_startUpload} primary={true} label="Ok"/>,
            );
        }
    }

    return (
        <Dialog actions={actions} open={open} title="Upload an Image">
            {content}
        </Dialog>
    );
};