"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileUpload } from '../components/FileUpload';

export default function ImportTransactionsPage() {
    const [message, setMessage] = useState(null);

    const handleUpload = (file) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data
                    .filter(row =>
                        row.Date !== "Date" &&  // remove CSV header row if included
                        Object.values(row).some(val => val && val.trim() !== "")
                    )
                    .map(row => ({
                        Date: row.Date,
                        Description: row.Description,
                        Deposits: row.Deposits,
                        Withdrawals: row.Withdrawals,
                        Balance: row.Balance,
                        Category: ""
                    }));
                uploadTransactions(data);
            }
        });
    };

    const uploadTransactions = async (data) => {
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            setMessage(result.message || 'Import successful!');
        } catch (err) {
            setMessage('Error importing file.');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Import Transactions</h1>
            <FileUpload onUpload={handleUpload} />
            {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
        </div>
    );
}
