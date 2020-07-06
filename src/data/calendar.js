import { format, parse, add } from 'date-fns';
import axios from 'axios';

// TODO: possono essere usate variabili di ambiente che iniziano con REACT_APP_
// TODO: si può usare dotenv con react-script?
const SERVER_BASE_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'http://192.168.0.12:3001';

const FORMAT = 'yyyy-MM-dd';

const WASTEDATA_TEMPLATE = {
    types: {
        P: 'Plastica',
        C: 'Carta',
        U: 'Umido',
        V: 'Vetro',
        S: 'Secco',
    },
    calendar: {},
};

export default class Calendar {
    _data = {};
    _date;
    _events = {
        changedate: [],
        changevalue: [],
        loadwastedata: [],
    };

    constructor(data = {}) {
        this._data = data;
        this._date = format(Date.now(), FORMAT);
    }

    /**
     * Ritorna la data corrente.
     */
    get date() {
        return this._date;
    }

    /**
     * Imposta la data corrente.
     * Deve essere una stringa nel formato yyyy-MM-dd.
     */
    set date(value) {
        this._date = value;
    }

    /**
     * Ritorna il valore per la data corrente in array di stringhe.
     */
    get arrayValue() {
        const value = this._data[this._date];
        return value ? value.split('') : [];
    }

    /**
     * Ritorna le tipologie di rifiuti per la data corrente.
     *
     * @returns {String|undefined}
     */
    get value() {
        return this._data[this._date];
    }

    /**
     * Imposta il nuovo valore per la data corrente.
     * Può essere una stringa, un array di stringhe (che verrà trasformato in stringa),
     * oppure un valore nullo o vuoto (la data corrente verrà eliminata dai dati).
     */
    set value(value) {
        if (!value || value.length === 0) {
            delete this._data[this._date];
        } else if (Array.isArray(value)) {
            this._data[this._date] = value.join('');
        } else {
            this._data[this._date] = value;
        }

        this.fire('changevalue', [this._date, this._data[this._date]]);
    }

    /**
     * Ritorna tutte le chiavi.
     *
     * @returns {String[]} Elenco di date nel formato yyyy-MM-dd.
     */
    get dates() {
        return Object.keys(this._data);
    }

    /**
     * Carica - sostistuendo - i dati passati in parametro,
     * che sono nel formato wastedata.json cioè { types: [], data: { } }.
     *
     * Le chiavi di wastedata.data sono delle date nel formato yyyyMMdd,
     * prima di usarle devo convertirle in yyyy-MM-dd.
     *
     * Terminato il caricamento viene scatenato l'evento 'loadwastedata'.
     *
     * @param {Object} wastedata Il contenuto di wastedata.json
     */
    loadWasteData(wastedata) {
        this._data = Object.keys(wastedata.calendar).reduce((m, p) => {
            const [, ...tokens] = /(\d{4})(\d{2})(\d{2})/.exec(p);
            m[tokens.join('-')] = wastedata.calendar[p];
            return m;
        }, {});

        this.fire('loadwastedata');
    }

    /**
     * Crea un oggetto nel formato wastedata.json.
     *
     * @returns {Object} wastedata
     */
    createWasteData() {
        return Object.assign({}, WASTEDATA_TEMPLATE, {
            calendar: Object.keys(this._data).reduce((m, p) => {
                m[p.replace(/-/g, '')] = this._data[p];
                return m;
            }, {}),
        });
    }

    /**
     * Ritorna le tipologie di rifiuti per la data in parametro.
     *
     * @param {String} date data per cui si vuole recuperare il valore.
     */
    get(date) {
        return this._data[date];
    }

    /**
     * Porta avanti di un giorno la data corrente e ne ritorna il valore.
     *
     * @returns {String} nuova data
     */
    nextDate() {
        return (this._date = format(
            add(parse(this._date, FORMAT, Date.now()), {
                days: 1,
            }),
            FORMAT
        ));
    }

    /**
     * Porta indietro di un giorno la data corrente e ne ritorna il valore.
     *
     * @returns {String} nuova data
     */
    previousDate() {
        return (this._date = format(
            add(parse(this._date, FORMAT, Date.now()), {
                days: -1,
            }),
            FORMAT
        ));
    }

    reset() {
        this._data = {};

        this.fire('loadwastedata');
    }

    async loadFromRemote() {
        const res = await axios.get(`${SERVER_BASE_URL}/wastedata`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.loadWasteData(JSON.parse(res.data));
    }

    async saveToRemote() {
        await axios.put(
            `${SERVER_BASE_URL}/wastedata`,
            this.createWasteData(),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    fire(eventType, args = []) {
        this._events[eventType].forEach((cb) => cb(this, ...args));
    }

    /**
     * Registra un handler per l'evento.
     *
     * @param {String} eventType tipo evento
     * @param {Function} handler handler evento
     */
    on(eventType, handler) {
        const handlers = this._events[eventType];
        if (!handlers) {
            throw new Error(`Event '${eventType}' not found`);
        }

        this._events[eventType].push(handler);
    }

    /**
     * Rimuove l'handler per l'evento.
     *
     * @param {String} eventType tipo evento
     * @param {Function} handler handler evento
     */
    off(eventType, handler) {
        const handlers = this._events[eventType];
        if (!handlers) {
            throw new Error(`Event '${eventType}' not found`);
        }

        const idx = handlers.findIndex((cb) => cb === handler);
        if (idx >= 0) {
            handlers.splice(idx, 1);
        }
    }

    toJSON() {
        return JSON.stringify(this._data);
    }
}
