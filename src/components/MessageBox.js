import React, { useRef, useEffect } from 'react';

function ensureArray(value) {
    if (value === undefined) {
        return [];
    } else if (Array.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}

function typeToIcon(type) {
    switch (type) {
        case 'error':
            return 'error_outline';
        case 'confirm':
            return 'help_outline';
        default:
            return 'check_circle_outline';
    }
}

function MessageBox({ options, show, onClose }) {
    const refDialog = useRef();

    useEffect(() => {
        // resetto il valore di ritorno altrimenti alla pressione di ESC viene usato l'ultimo
        refDialog.current.returnValue = '';
        show && refDialog.current.showModal();
        // nessuna dipendenza, perché questo effetto deve essere sempre esguito,
        // qualsiasi sia il valore di show
    });

    useEffect(() => {
        refDialog.current.addEventListener(
            'close',
            (e) => {
                if (options.onClose || onClose) {
                    const event = new CustomEvent('close', {
                        // returnValue riporta il valore del pulsante premuto dentro menu
                        detail: refDialog.current.returnValue === 'confirm',
                    });
                    (options.onClose || onClose)(event);
                }
            },
            // gestisco l'evento una volta sola
            { once: true }
        );
    }, [options, onClose]);

    return (
        <dialog ref={refDialog}>
            <form method="dialog">
                <div className="dialog-icon">
                    <span className="material-icons">
                        {typeToIcon(options ? options.type : 'info')}
                    </span>
                </div>
                {options &&
                    ensureArray(options.text).map((row, index) => (
                        <p key={index}>
                            {row}
                        </p>
                    ))}
                <menu>
                    {options && options.type === 'confirm' ? (
                        <>
                            <button value="cancel">Annulla</button>
                            <button value="confirm">Conferma</button>
                        </>
                    ) : (
                        <button value="confirm">Ok</button>
                    )}
                </menu>
            </form>
        </dialog>
    );
}

export default MessageBox;
