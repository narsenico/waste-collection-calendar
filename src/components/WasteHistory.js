import React, {
    useEffect,
    useCallback,
    useReducer,
} from 'react';

function itemReducer(state, action) {
    switch (action.type) {
        case 'update':
            state[action.date] = action.value;
            return { ...state };
        case 'delete':
            delete state[action.date];
            return { ...state };
        default:
            throw new Error('Wrong action');
    }
}

const WasteHistory = ({ /** @type {Calendar} */ calendar }) => {
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

    useEffect(() => {
        calendar.on('changevalue', onChangeValue);
        return () => calendar.off('changevalue', onChangeValue);
    }, [calendar, onChangeValue]);

    return (
        <div className="history-container">
            {Object.keys(items).sort().map((date) => (
                <div key={date}>
                    xxx{date}: {items[date]}
                </div>
            ))}
        </div>
    );
};

export default WasteHistory;
