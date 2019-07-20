import React from 'react';

const modal = props => {
    return (
        <div className="modal">
            <header className="modal-header">
                <h1>{props.title}</h1>
            </header>
            <section className="modal-content">
                {props.children}
            </section>
            <section className="modal-action">
                {props.canCancel && (<button onClick={() => props.onCancel()}>Cancel</button>)}
                {props.canConfirm && (<button onClick={() => props.onConfirm()}>{props.confirmText}</button>)}
            </section>
        </div>
    )
}

export default modal;