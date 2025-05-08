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


}
