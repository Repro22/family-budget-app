'use client';

import { useEffect, useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import SummaryCards from './components/SummaryCards';
import IncomeExpensePie from './components/IncomeExpensePie';
import CategoryPie from './components/CategoryPie';
import TrendChart from './components/TrendChart';

const formatDate = (date) => date.toISOString().slice(0, 10);
const parseNumber = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, '')) || 0;
};

export default function StatisticsPage() {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUncategorized, setShowUncategorized] = useState(true);

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
            .then(setTxns)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6 text-lg">Loading…</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    // filter by date
    const filtered = txns.filter((tx) => {
        const d = new Date(tx.Date);
        return d >= new Date(startDate) && d <= new Date(endDate);
    });

    // summary numbers
    const totalIncome = filtered.reduce((sum, tx) => sum + parseNumber(tx.Deposits), 0);
    const totalExpenses = filtered.reduce((sum, tx) => sum + parseNumber(tx.Withdrawals), 0);
    const net = totalIncome - totalExpenses;

    // category data
    const rawCat = filtered.reduce((acc, tx) => {
        const cat = tx.Category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + parseNumber(tx.Withdrawals);
        return acc;
    }, {});
    const categoryTotals = Object.entries(rawCat)
        .filter(([cat]) => showUncategorized || cat !== 'Uncategorized')
        .map(([id, value]) => ({ id, value }));

// in /app/statistics/page.jsx
    const dailyTotals = filtered.reduce((acc, tx) => {
        const dayStr = tx.Date.split('T')[0];              // "2025-05-22"
        acc[dayStr] = (acc[dayStr] || 0) + parseNumber(tx.Withdrawals);
        return acc;
    }, {});

    const trendSeries = [
        {
            id: 'Spending',
            data: Object.entries(dailyTotals)
                .map(([date, value]) => ({ x: new Date(date), y: value }))
                .sort((a, b) => a.x - b.x),
        },
    ];


    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Statistics</h1>

            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />

            <SummaryCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                net={net}
            />

            <IncomeExpensePie totalIncome={totalIncome} totalExpenses={totalExpenses} />

            <CategoryPie
                data={categoryTotals}
                showUncategorized={showUncategorized}
                onToggleUncategorized={setShowUncategorized}
            />

            <TrendChart series={trendSeries} />

        </div>
    );
}
