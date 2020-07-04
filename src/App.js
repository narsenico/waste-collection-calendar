import React, { createContext } from 'react';
import './App.css';
import WasteCollection from './components/WasteCollection';
import Calendar from './data/calendar';
import WasteHistory from './components/WasteHistory';

const CalendarContext = createContext();

function App() {
    return (
        <div className="main primary">
            <header className="primary-dark">
                <h1>Waste Collection Calendar</h1>
            </header>
            <CalendarContext.Provider
                value={new Calendar({ '2020-07-04': 'P' })}
            >
                <CalendarContext.Consumer>
                    {(value) => (
                        <main>
                            <WasteCollection calendar={value} />
                            <WasteHistory calendar={value} />
                        </main>
                    )}
                </CalendarContext.Consumer>
            </CalendarContext.Provider>
            <footer>(c) narsenico</footer>
        </div>
    );
}

export default App;
