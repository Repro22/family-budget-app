"use client";

import { useEffect, useState } from 'react';

export default function TransactionsPage() {
    const [txns, setTxns] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const columns = ["Date", "Description", "Deposits", "Withdrawls", "Balance"];
    const [sortKey, setSortKey] = useState(columns[0]);
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

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

    const sortedTxns = [...txns].sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        // date parsing
        if (sortKey === "Date") {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        // parsing deposits/withdrawals/balance:
        else if (["Deposits", "Withdrawls", "Balance"].includes(sortKey)) {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
    if (error) return <p style={{ padding: 20, color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
            <h1>All Transactions</h1>

            {/* Sorting Controls */}
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Sort by:&nbsp;
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                    >
                        {columns.map((col) => (
                            <option key={col} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    onClick={() =>
                        setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                    }
                    style={{ marginLeft: "1rem" }}
                >
                    {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                </button>
            </div>

            {/* Data Table */}
            {sortedTxns.length === 0 ? (
                <p>No transactions imported yet.</p>
            ) : (
                <table border="1" cellPadding="4" style={{ width: '100%' }}>
                    <thead>
                    <tr>
                        {Object.keys(sortedTxns[0]).map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedTxns.map((txn, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                                <td key={col}>{txn[col]}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}