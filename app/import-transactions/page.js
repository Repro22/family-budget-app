"use client";
import { useState } from 'react';
import Papa from 'papaparse';

export default function Page() {
    const [file, setFile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setError('');
        setTransactions([]);
        if (e.target.files.length) {
            setFile(e.target.files[0]);
        }
    };

    const handleParse = () => {
        if (!file) {
            setError('Please choose a CSV file first.');
            return;
        }
        Papa.parse (file, {
            header: true,
            skipEmptyLines: true,
            complete: ({ data, errors }) => {
                if (errors.length) {
                    setError(`Parsing error: ${errors[0].message}`);
                } else {
                    setTransactions(data);
                }
            },
        });
    };

        const handleConfirm = async () => {
            try {
                const res = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transactions),
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || 'Unknown error');
                alert(`✅ Imported ${result.count} transactions!`);
            } catch (err) {
                console.error(err);
                alert(`❌ Import failed: ${err.message}`);
            }
        };



}
