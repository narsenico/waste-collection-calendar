import React from 'react';

function Reset({ className, calendar }) {
    const reset = () => {
        calendar.reset();
    };

    return (
        <div className={className}>
            <button onClick={reset} title="Pulisci dati">
                <span className="material-icons">clear</span>
            </button>
        </div>
    );
}

export default Reset;
