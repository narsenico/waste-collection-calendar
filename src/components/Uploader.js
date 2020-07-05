import React, { useRef } from 'react';

const Uploader = ({ onLoad }) => {
    const refFile = useRef();

    const loadJSONFile = (file) => {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log(`File '${file.name}' loaded`);
                if (onLoad) {
                    const event = new CustomEvent('load', {
                        detail: JSON.parse(e.target.result),
                    });
                    onLoad(event);
                }
            };
            reader.onerror = (e) => {
                console.error(e.target.error);
            };
            reader.readAsText(file);
        } catch (e) {
            console.error(e);
        }
    };

    const onFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].type === 'application/json') {
                loadJSONFile(files[0]);
            } else {
                console.warn(
                    'File type not valid: expected "application/json"'
                );
            }
        } else {
            console.log('No file to load');
        }
    };

    return (
        <div>
            <input type="file" ref={refFile} onChange={onFileChange} />
        </div>
    );
};

export default Uploader;
