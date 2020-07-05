import React, { createContext } from 'react';
import './App.css';
import WasteCollection from './components/WasteCollection';
import Calendar from './data/calendar';
import WasteHistory from './components/WasteHistory';
import Uploader from './components/Uploader';

const CalendarContext = createContext();

function App() {
    return (
        <div className="main primary">
            <header className="primary-dark">
                <h1>Waste Collection Calendar</h1>
            </header>
            <CalendarContext.Provider
                value={new Calendar()}
            >
                <CalendarContext.Consumer>
                    {(calendar) => (
                        <main>
                            <Uploader
                                onLoad={(e) => calendar.loadWasteData(e.detail)}
                            />
                            <WasteCollection calendar={calendar} />
                            <WasteHistory calendar={calendar} />
                        </main>
                    )}
                </CalendarContext.Consumer>
            </CalendarContext.Provider>
            <footer>(c) narsenico</footer>
        </div>
    );
}

export default App;
