import React, { useEffect, useCallback, useState } from 'react';
import MessageBox from './MessageBox';

function RemoteController({ calendar, className }) {
    const [message, setMessage] = useState();

    const load = useCallback(async () => {
        try {
            await calendar.loadFromRemote();
            setMessage({
                type: 'info',
                text: 'Wastedata caricato correttamente.',
            });
        } catch (e) {
            console.error(e);
            setMessage({
                type: 'error',
                text: [
                    'Si è verificato un errore durante la lettura dei dati.',
                    'Controllare i log del browser per maggiori informazioni.',
                ],
            });
        }
    }, [calendar]);

    const apply = async () => {
        try {
            await calendar.saveToRemote();
            setMessage({
                type: 'confirm',
                text: [
                    'Wastedata inviato correttamente.',
                    'Applicare le modifiche?',
                ],
                onClose: async (e) => {
                    if (e.detail) {
                        try {
                            await calendar.applyChangesToRemote();
                        } catch (e) {
                            console.error(e);
                            setMessage({
                                type: 'error',
                                text: [
                                    'Si è verificato un errore durante la lettura dei dati.',
                                    'Controllare i log del browser per maggiori informazioni.',
                                ],
                            });
                        }
                    }
                }
            });
            // TODO: come fare per aggiornare browser? serve?
        } catch (e) {
            console.error(e);
            setMessage({
                type: 'error',
                text: [
                    'Si è verificato un errore durante la lettura dei dati.',
                    'Controllare i log del browser per maggiori informazioni.',
                ],
            });
        }
    };

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className={className}>
            <button onClick={load} title="Ricarica dati">
                <span className="material-icons">refresh</span>
            </button>
            <button onClick={apply} title="Applica modifiche">
                <span className="material-icons">save</span>
            </button>
            {message ? (
                <MessageBox
                    options={message}
                    show
                />
            ) : null}
        </div>
    );
}

export default RemoteController;
