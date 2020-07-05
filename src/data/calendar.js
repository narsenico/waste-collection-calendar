import { format, parse, add } from 'date-fns';

const FORMAT = 'yyyy-MM-dd';
const FORMAT_HUMAN = 'EEE dd MMM';

export default class Calendar {
    _data = {};
    _date;
    _events = {
        changedate: [],
        changevalue: [],
        loadwastedata: []
    };

    constructor(data = {}) {
        this._data = data;
        this._date = format(Date.now(), FORMAT);
    }

    /**
     * Ritorna la data corrente formattata per essere leggibile da umani.
     */
    get humanDate() {
        try {
            return format(parse(this._date, FORMAT, Date.now()), FORMAT_HUMAN);
        } catch {
            return '';
        }
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

    toJSON() {
        return JSON.stringify(this._data);
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
}
