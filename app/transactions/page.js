"use client";

import { useEffect, useState } from 'react';

export default function TransactionsPage() {
    const [txns, setTxns] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const columns = ["Date", "Description", "Deposits", "Withdrawals", "Balance", "Category"];
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
        else if (["Deposits", "Withdrawals", "Balance", "Category"].includes(sortKey)) {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
    if (error) return <p style={{ padding: 20, color: 'red' }}>Error: {error}</p>;


}