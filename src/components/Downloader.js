import React from 'react';

function Downloader({ className, calendar }) {
    const onClick = () => {
        try {
            // estraggo i dati da Calendar nel formato wastedata
            const data = calendar.createWasteData();
            // creo blob per file json
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            // creo link per download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'wastedata.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // TODO: dovrei distruggere l'url al termine del download
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <button onClick={onClick}>
                <span className="material-icons">get_app</span>
            </button>
        </div>
    );
}

export default Downloader;
