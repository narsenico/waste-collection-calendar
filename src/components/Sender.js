import React from 'react';
import axios from 'axios';

function Sender({ calendar, className }) {
    const test = async () => {
        try {
            const res = await axios.get(
                'http://192.168.0.12:3001/hello'
            );
            console.log(res);
            alert('test ok');
        } catch (e) {
            console.error(e);
            alert(
                `Si è verificato un errore durante l'invio dei dati.\nControllare i log del browser per maggiori informazioni.`
            );
        }
    }

    const onClick = async () => {
        try {
            const res = await axios.put(
                'http://192.168.0.12:3001/copywastedata',
                calendar.createWasteData()
            );
            console.log(res);
            alert('Wastedata inviato correttamente.');
            // TODO: riavviare rednode
        } catch (e) {
            console.error(e);
            alert(`Si è verificato un errore durante l'invio dei dati.\nControllare i log del browser per maggiori informazioni.`);
        }
    };

    return (
        <div className={className}>
            <button onClick={test}>
                test
            </button>
            <button onClick={onClick}>
                <span className="material-icons">send</span>
            </button>
        </div>
    );
}

export default Sender;
