"use client";

import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

// Utility to format a Date object as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

// Parse numeric strings with commas
function parseNumber(str) {
    if (!str) return 0;
    const sanitized = str.replace(/,/g, '');
    return parseFloat(sanitized) || 0;
}

export default function StatisticsPage() {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUncategorized, setShowUncategorized] = useState(true);

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
    const totalIncome = filtered.reduce((sum, tx) => sum + parseNumber(tx.Deposits), 0);
    const totalExpenses = filtered.reduce((sum, tx) => sum + parseNumber(tx.Withdrawals), 0);
    const net = totalIncome - totalExpenses;

    // Compute raw category totals
    const rawCategoryTotals = filtered.reduce((acc, tx) => {
        const cat = tx.Category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + parseNumber(tx.Withdrawals);
        return acc;
    }, {});

    // Prepare category breakdown data for Pie, + toggle
    const categoryTotals = Object.entries(rawCategoryTotals)
        .filter(([id]) => showUncategorized || id !== 'Uncategorized')
        .map(([id, value]) => ({ id, value }));

    // Prepare time-series trend data for Line
    const dailyTotals = filtered.reduce((acc, tx) => {
        const dayStr = tx.Date.includes('T') ? tx.Date.split('T')[0] : tx.Date;
        acc[dayStr] = (acc[dayStr] || 0) + parseNumber(tx.Withdrawals);
        return acc;
    }, {});
    const trendDataPoints = Object.entries(dailyTotals)
        .map(([dateStr, value]) => ({ x: new Date(dateStr), y: value }))
        .sort((a, b) => a.x - b.x);
    const trendSeries = [{ id: 'Spending', data: trendDataPoints }];

    return (
        <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div><h2>Total Income</h2><p>${totalIncome.toFixed(2)}</p></div>
                <div><h2>Total Expenses</h2><p>${totalExpenses.toFixed(2)}</p></div>
                <div><h2>Net</h2><p>${net.toFixed(2)}</p></div>
            </div>

            {/* Toggle for Uncategorized */}
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={showUncategorized}
                        onChange={(e) => setShowUncategorized(e.target.checked)}
                    />
                    &nbsp;Show Uncategorized
                </label>
            </div>

            {/* Category Breakdown Pie Chart */}
            <div style={{ height: 400, width: '100%', marginBottom: '2rem' }}>
                <h2>Spending by Category</h2>
                {categoryTotals.length > 0 ? (
                    <ResponsivePie
                        data={categoryTotals}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        colors={{ scheme: 'nivo' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    />
                ) : (
                    <p style={{ textAlign: 'center', paddingTop: 40 }}>No category data for this period.</p>
                )}
            </div>

            {/* Spending Trend Line Chart */}
            <div style={{ height: 400, width: '100%', marginBottom: '2rem' }}>
                <h2>Daily Spending Trend</h2>
                {trendDataPoints.length > 0 ? (
                    <ResponsiveLine
                        data={trendSeries}
                        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                        xScale={{ type: 'time', precision: 'day' }}
                        axisBottom={{ format: '%b %d', tickValues: 'every 1 day', legend: 'Date', legendOffset: 36, legendPosition: 'middle' }}
                        axisLeft={{ legend: 'Amount', legendOffset: -40, legendPosition: 'middle' }}
                        colors={{ scheme: 'category10' }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        useMesh={true}
                        enableSlices="x"
                    />
                ) : (
                    <p style={{ textAlign: 'center', paddingTop: 40 }}>No trend data for this period.</p>
                )}
            </div>

            {/* Transactions table for period */}
            <h2>Transactions from {startDate} to {endDate}</h2>
            <table border="1" cellPadding="4" style={{ width: '100%' }}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Deposits</th>
                    <th>Withdrawals</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((tx, i) => (
                    <tr key={i}>
                        <td>{tx.Date}</td>
                        <td>{tx.Description}</td>
                        <td>{tx.Category}</td>
                        <td>{tx.Deposits}</td>
                        <td>{tx.Withdrawals}</td>
                        <td>{tx.Balance}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
