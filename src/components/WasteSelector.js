import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Selettore di tipologie di rifiuti.
 * Le tipologie sono: P,C,V,U,S
 *
 * Scorciatoie tastiera:
 * P,C,V,U,S => seleziona/deseleziona tipologia corrispondente
 * r => reset giornata corrente
 */
const WasteSelector = ({
    /** @type {String[]} */ selected = [],
    /** @type {Function|undefined} */ onChange,
}) => {
    const refContainer = useRef();

    const fireOnChange = useCallback(() => {
        if (refContainer.current && onChange) {
            const detail = [
                ...refContainer.current.querySelectorAll('input:checked'),
            ].map((input) => input.value);

            const evt = new CustomEvent('change', {
                detail,
            });
            onChange(evt);
        }
    }, [onChange]);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'r') {
                const inputs = refContainer.current.querySelectorAll('input');
                for (let input of inputs) {
                    input.checked = false;
                }
                fireOnChange();
            } else {
                const input = refContainer.current.querySelector(
                    `input[value="${e.key.toUpperCase()}"]`
                );
                if (input) {
                    input.checked = !input.checked;
                    fireOnChange();
                }
            }
        };
        document.addEventListener('keypress', handler);
        return () => document.removeEventListener('keypress', handler);
    }, [fireOnChange]);

    useEffect(() => {
        if (refContainer.current) {
            const inputs = refContainer.current.querySelectorAll('input');
            for (let input of inputs) {
                input.checked = selected && selected.indexOf(input.value) >= 0;
            }
        }
    }, [selected]);

    return (
        <div className="waste-selector" ref={refContainer}>
            <div className="waste-checkbox waste-c">
                <input
                    type="checkbox"
                    id="waste_C"
                    value="C"
                    onChange={(e) => fireOnChange(e)}
                />
                <label htmlFor="waste_C">
                    <span>Carta</span>
                </label>
            </div>
            <div className="waste-checkbox waste-p">
                <input
                    type="checkbox"
                    id="waste_P"
                    value="P"
                    onChange={(e) => fireOnChange(e)}
                />
                <label htmlFor="waste_P">
                    <span>Plastica</span>
                </label>
            </div>
            <div className="waste-checkbox waste-s">
                <input
                    type="checkbox"
                    id="waste_S"
                    value="S"
                    onChange={(e) => fireOnChange(e)}
                />
                <label htmlFor="waste_S">
                    <span>Secco</span>
                </label>
            </div>
            <div className="waste-checkbox waste-u">
                <input
                    type="checkbox"
                    id="waste_U"
                    value="U"
                    onChange={(e) => fireOnChange(e)}
                />
                <label htmlFor="waste_U">
                    <span>Umido</span>
                </label>
            </div>
            <div className="waste-checkbox waste-v">
                <input
                    type="checkbox"
                    id="waste_V"
                    value="V"
                    onChange={fireOnChange}
                />
                <label htmlFor="waste_V">
                    <span>Vetro</span>
                </label>
            </div>
        </div>
    );
};

export default WasteSelector;
