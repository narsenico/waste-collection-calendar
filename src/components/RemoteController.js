import React, { useEffect, useCallback } from 'react';

function RemoteController({ calendar, className }) {
    const load = useCallback(async () => {
        try {
            calendar.loadFromRemote();
            alert('Wastedata caricato correttamente.');
        } catch (e) {
            console.error(e);
            alert(
                `Si è verificato un errore durante la lettura dei dati.\nControllare i log del browser per maggiori informazioni.`
            );
        }
    }, [calendar]);

    const send = async () => {
        try {
            calendar.saveToRemote();
            alert('Wastedata inviato correttamente.');
            // TODO: riavviare rednode node-red-restart
            // TODO: come fare per aggiornare browser? serve?
        } catch (e) {
            console.error(e);
            alert(
                `Si è verificato un errore durante l'invio dei dati.\nControllare i log del browser per maggiori informazioni.`
            );
        }
    };

    useEffect(() => {
        load();
    }, [load])

    return (
        <div className={className}>
            <button onClick={load}>
                <span className="material-icons">cloud_download</span>
            </button>
            <button onClick={send}>
                <span className="material-icons">send</span>
            </button>
        </div>
    );
}

export default RemoteController;
