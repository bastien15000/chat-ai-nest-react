import React from 'react';

function InsertAudio(props, ref) {
    const onTranscription = (e) => {
        e.preventDefault();
        let path = e.target.file.value
        props.socket.emit("transcription", path)
    }

    return (
        <form className="mt-4" onSubmit={onTranscription}>
            <input name="file" id="transcription" type="file" accept="audio/*"/>
            <input type="submit" className="btn btn-secondary" value="Transcrire"/>
        </form>
    )
}

export default InsertAudio;