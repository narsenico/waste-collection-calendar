//@ts-check
import { format, parse, add } from 'date-fns';

const FORMAT = 'yyyy-MM-dd';
const FORMAT_HUMAN = 'EEE dd MMM';

export default class Calendar {
    _data = {};
    /** @type {String} */
    _date;
    _events = {
        changedate: [],
        changevalue: [],
    };

    constructor(data = {}) {
        this._data = data;
        this._date = format(Date.now(), FORMAT);
    }

    get humanDate() {
        return format(parse(this._date, FORMAT, Date.now()), FORMAT_HUMAN);
    }

    get date() {
        return this._date;
    }

    set date(/** @type {String} */ value) {
        this._date = value;
    }

    /** @returns {String[]} */
    get arrayValue() {
        const value = this._data[this._date];
        return value ? value.split('') : [];
    }

    get value() {
        return this._data[this._date];
    }

    set value(/** @type {String|String[]|null} */ value) {
        if (!value || value.length === 0) {
            delete this._data[this._date];
        } else if (Array.isArray(value)) {
            this._data[this._date] = value.join('');
        } else {
            this._data[this._date] = value;
        }

        this.fire('changevalue', [this._date, this._data[this._date]]);
    }

    get dates() {
        return Object.keys(this._data);
    }

    get(date) {
        return this._data[date];
    }

    nextDate() {
        return (this._date = format(
            add(parse(this._date, FORMAT, Date.now()), {
                days: 1,
            }),
            FORMAT
        ));
    }

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

    fire(eventType, args) {
        this._events[eventType].forEach((cb) => cb(this, ...args));
    }

    on(eventType, handler) {
        const handlers = this._events[eventType];
        if (!handlers) {
            throw new Error(`Event '${eventType}' not found`);
        }

        this._events[eventType].push(handler);
    }

    off(eventType, callback) {
        const handlers = this._events[eventType];
        if (!handlers) {
            throw new Error(`Event '${eventType}' not found`);
        }

        const idx = handlers.findIndex((cb) => cb === callback);
        if (idx >= 0) {
            handlers.splice(idx, 1);
        }
    }
}
