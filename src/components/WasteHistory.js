import React, { useEffect, useCallback, useReducer } from 'react';
import WasteHistoryItem from './WasteHistoryItem';

function itemReducer(state, action) {
    switch (action.type) {
        case 'update':
            state[action.date] = action.value;
            return { ...state };
        case 'delete':
            delete state[action.date];
            return { ...state };
        case 'swap':
            return { ...action.newState };
        default:
            throw new Error('Wrong action');
    }
}

const WasteHistory = ({ calendar }) => {
    const [items, dispacthItems] = useReducer(itemReducer, {
        ...calendar._data,
    });

    const onChangeValue = useCallback((_, date, value) => {
        if (value) {
            dispacthItems({ type: 'update', date, value });
        } else {
            dispacthItems({ type: 'delete', date });
        }
    }, []);

    const onLoadWasteData = useCallback((calendar) => {
        dispacthItems({ type: 'swap', newState: calendar._data });
    }, []);

    useEffect(() => {
        calendar.on('changevalue', onChangeValue);
        calendar.on('loadwastedata', onLoadWasteData);
        return () => {
            calendar.off('changevalue', onChangeValue);
            calendar.off('loadwastedata', onLoadWasteData);
        };
    }, [calendar, onChangeValue, onLoadWasteData]);

    return (
        <section>
            <h2>Storico</h2>
            <div className="history-container">
                {Object.keys(items)
                    .sort()
                    .map((date) => (
                        <WasteHistoryItem
                            key={date}
                            date={date}
                            selection={items[date]}
                        />
                    ))}
            </div>
        </section>
    );
};

export default WasteHistory;
