"use client";

import { useEffect, useState } from 'react';

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

export default function StatisticsPage() {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Default date range: start at first of month, end at today
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(formatDate(firstOfMonth));
    const [endDate, setEndDate] = useState(formatDate(today));

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

    // Filter transactions by selected date range
    const filtered = txns.filter((tx) => {
        const d = new Date(tx.Date);
        return d >= new Date(startDate) && d <= new Date(endDate);
    });

    // Calculate summary metrics
    const totalIncome = filtered.reduce((sum, tx) => sum + (parseFloat(tx.Deposits) || 0), 0);
    const totalExpenses = filtered.reduce((sum, tx) => sum + (parseFloat(tx.Withdrawals) || 0), 0);
    const net = totalIncome - totalExpenses;

    // Prepare category breakdown data
    const categoryTotals = filtered.reduce((acc, tx) => {
        const cat = tx.Category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + (parseFloat(tx.Withdrawals) || 0);
        return acc;
    }, {});

    // Prepare time-series trend data (daily spend)
    const dailyTotals = filtered.reduce((acc, tx) => {
        const day = tx.Date;
        acc[day] = (acc[day] || 0) + (parseFloat(tx.Withdrawals) || 0);
        return acc;
    }, {});
    const trendData = Object.entries(dailyTotals)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
            <h1>Statistics</h1>

            {/* Date range selector */}
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Start:&nbsp;
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label style={{ marginLeft: '1rem' }}>
                    End:&nbsp;
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>

            {/* Summary cards */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                }}
            >
                <div>
                    <h2>Total Income</h2>
                    <p>{totalIncome.toFixed(2)}</p>
                </div>
                <div>
                    <h2>Total Expenses</h2>
                    <p>{totalExpenses.toFixed(2)}</p>
                </div>
                <div>
                    <h2>Net</h2>
                    <p>{net.toFixed(2)}</p>
                </div>
            </div>

            {/* Placeholder for future Nivo charts */}
            <p>Charts (category breakdown & trend) will be added in a future pass.</p>

            {/* Transactions table for period */}
            <h2>Transactions from {startDate} to {endDate}</h2>
            <table border="1" cellPadding="4" style={{ width: '100%' }}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Deposits</th>
                    <th>Withdrawals</th>
                    <th>Balance</th>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((tx, i) => (
                    <tr key={i}>
                        <td>{tx.Date}</td>
                        <td>{tx.Description}</td>
                        <td>{tx.Deposits}</td>
                        <td>{tx.Withdrawals}</td>
                        <td>{tx.Balance}</td>
                        <td>{tx.Category}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
