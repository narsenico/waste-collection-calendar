import React, { useEffect, useCallback } from 'react';

function RemoteController({ calendar, className }) {
    const load = useCallback(async () => {
        try {
            await calendar.loadFromRemote();
            alert('Wastedata caricato correttamente.');
        } catch (e) {
            console.error(e);
            alert(
                `Si è verificato un errore durante la lettura dei dati.\nControllare i log del browser per maggiori informazioni.`
            );
        }
    }, [calendar]);

    const apply = async () => {
        try {
            await calendar.saveToRemote();
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
            <button onClick={load} title="Ricarica dati">
                <span className="material-icons">refresh</span>
            </button>
            <button onClick={apply} title="Applica modifiche">
                <span className="material-icons">save</span>
            </button>
        </div>
    );
}

export default RemoteController;
