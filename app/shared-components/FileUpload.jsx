import React, { useRef } from 'react';

export function FileUpload({ onUpload }) {
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Choose CSV File
            </button>
        </div>
    );
}
