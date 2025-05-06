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
        Papa.parse(file, {
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


    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
            <h1>Import Transactions</h1>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
            />
            <button onClick={handleParse} style={{ marginLeft: '1rem' }}>
                Parse CSV
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {transactions.length > 0 && (
                <>
                    <h2>Preview</h2>
                    <table border="1" cellPadding="4" style={{ width: '100%', marginBottom: '1rem' }}>
                        <thead>
                        <tr>
                            {Object.keys(transactions[0]).map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.slice(0, 5).map((txn, i) => (
                            <tr key={i}>
                                {Object.values(txn).map((val, j) => (
                                    <td key={j}>{val}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={handleConfirm}>Confirm Import</button>
                </>
            )}
        </div>
    );
}
