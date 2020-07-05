import React, { createContext } from 'react';
import './App.css';
import WasteCollection from './components/WasteCollection';
import Calendar from './data/calendar';
import WasteHistory from './components/WasteHistory';
import Uploader from './components/Uploader';
import Downloader from './components/Downloader';
import Sender from './components/Sender';

const CalendarContext = createContext();

function App() {
    return (
        <div>
            <header className="primary-dark">
                <h1>Calendario raccolta rifiuti</h1>
            </header>
            <CalendarContext.Provider value={new Calendar()}>
                <CalendarContext.Consumer>
                    {(calendar) => (
                        <>
                            <main className="layout-grid">
                                <WasteCollection calendar={calendar} />
                                <WasteHistory calendar={calendar} />
                            </main>
                            <footer>
                                <Uploader
                                    className="footer-fill"
                                    onLoad={(e) =>
                                        calendar.loadWasteData(e.detail)
                                    }
                                />
                                <Sender
                                    className="footer-fa-end"
                                    calendar={calendar}
                                />
                                <Downloader
                                    className="footer-far-end"
                                    calendar={calendar}
                                />
                            </footer>
                        </>
                    )}
                </CalendarContext.Consumer>
            </CalendarContext.Provider>
        </div>
    );
}

export default App;
