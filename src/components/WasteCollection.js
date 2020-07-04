//@ts-check
import React, { useState, useEffect, useRef } from 'react';

import WasteSelector from './WasteSelector';

const WasteCollection = ({ /** @type {Calendar} */ calendar }) => {
    const refCalendar = useRef(calendar);
    // è nel formato riconosciuto dall'input yyyy-MM-dd
    const [wasteDate, setWasteDate] = useState(refCalendar.current.date);
    const [humanDate, setHumanDate] = useState('');
    // array delle tipologie selezionate
    const [wasteSelection, setWasteSelection] = useState([]);

    const storeCurrent = (selection) => {
        refCalendar.current.value = selection;
    };

    const goNext = (e) => {
        setWasteDate(refCalendar.current.nextDate());
        e && e.preventDefault();
    };

    const goPrevious = (e) => {
        setWasteDate(refCalendar.current.previousDate());
        e && e.preventDefault();
    };

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight') {
                goNext();
            } else if (e.key === 'ArrowLeft') {
                goPrevious();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        // quando cambia la data aggiorno le tipologie selezionate
        refCalendar.current.date = wasteDate;
        setWasteSelection(refCalendar.current.arrayValue);
        setHumanDate(refCalendar.current.humanDate);
    }, [wasteDate]);

    return (
        <form>
            <section className="date-selector">
                <label htmlFor="collectionDate">Date</label>
                <input
                    type="date"
                    id="collectionDate"
                    title={humanDate}
                    value={wasteDate}
                    onChange={(e) => setWasteDate(e.target.value)}
                />
            </section>
            <WasteSelector
                selected={wasteSelection}
                onChange={(e) => storeCurrent(e.detail)}
            />
            <section className="buttons">
                <button onClick={goPrevious} title="Freccia sinistra">
                    <i className="material-icons">navigate_before</i>{' '}
                </button>
                <button onClick={goNext} title="Freccia destra">
                    <i className="material-icons">navigate_next</i>{' '}
                </button>
            </section>
        </form>
    );
};

export default WasteCollection;
