import React, { useState, useEffect, useRef } from 'react';
import { format, parse } from 'date-fns';

import WasteSelector from './WasteSelector';

const FORMAT = 'yyyy-MM-dd';
const FORMAT_HUMAN = 'EEE dd MMM';

/**
 * Ritorna la data corrente formattata per essere leggibile da umani.
 */
function toHumanDate(date) {
    try {
        return format(parse(date, FORMAT, Date.now()), FORMAT_HUMAN);
    } catch {
        return '';
    }
}

const WasteCollection = ({ calendar }) => {
    const refCalendar = useRef(calendar);
    // è nel formato riconosciuto dall'input yyyy-MM-dd
    const [wasteDate, setWasteDate] = useState(refCalendar.current.date);
    // array delle tipologie selezionate
    const [wasteSelection, setWasteSelection] = useState([]);

    const onWasteSelected = (selection) => {
        refCalendar.current.value = selection;
    };

    useEffect(() => {
        // gestisco gli eventi da tastiera per cambiare data avanti/indietro
        const handler = (e) => {
            if (e.key === 'ArrowRight') {
                setWasteDate(refCalendar.current.nextDate());
            } else if (e.key === 'ArrowLeft') {
                setWasteDate(refCalendar.current.previousDate());
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        // quando cambia la data aggiorno le tipologie selezionate
        refCalendar.current.date = wasteDate;
        setWasteSelection(refCalendar.current.arrayValue);
    }, [wasteDate]);

    return (
        <section>
            <h2>Selettore</h2>
            <form>
                <section className="date-selector">
                    <label htmlFor="collectionDate">Data</label>
                    <input
                        type="date"
                        id="collectionDate"
                        title={toHumanDate(wasteDate)}
                        value={wasteDate}
                        onChange={(e) => setWasteDate(e.target.value)}
                    />
                </section>
                <section>
                    <WasteSelector
                        selected={wasteSelection}
                        onChange={(e) => onWasteSelected(e.detail)}
                    />
                </section>
            </form>
        </section>
    );
};

export default WasteCollection;
