"use client";

import { useEffect, useState } from 'react';

export default function TransactionsPage() {
    const [txns, setTxns] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/transactions')
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => setTxns(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
    if (error) return <p style={{ padding: 20, color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
            <h1>All Transactions</h1>
            {txns.length === 0 ? (
                <p>No transactions imported yet.</p>
            ) : (
                <table border="1" cellPadding="4" style={{ width: '100%' }}>
                    <thead>
                    <tr>
                        {Object.keys(txns[0]).map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {txns.map((txn, i) => (
                        <tr key={i}>
                            {Object.values(txn).map((val, j) => (
                                <td key={j}>{val}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}