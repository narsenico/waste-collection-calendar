import React from 'react';
import { format, parse } from 'date-fns';

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

function WasteHistoryItem({ date, selection }) {
    return (
        <div>
            <div>
                {toHumanDate(date)}
            </div>
            {selection
                .split('')
                .sort()
                .map((wasteType) => (
                    <div
                        key={wasteType}
                        className="waste-icon"
                        waste-type={wasteType}
                    ></div>
                ))}
        </div>
    );
}

export default WasteHistoryItem;
