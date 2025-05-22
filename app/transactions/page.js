"use client";
import React, { useEffect, useState } from 'react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState('Date');
    const [sortOrder, setSortOrder] = useState('asc');

    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterMinAmount, setFilterMinAmount] = useState('');
    const [filterMaxAmount, setFilterMaxAmount] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/transactions');
                const data = await res.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch transactions', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const parseAmount = (value) =>
        parseFloat(String(value).replace(/,/g, '')) || 0;

    const filteredTransactions = transactions.filter(tx => {
        const dateVal = Date.parse(tx.Date);
        const amountVal = parseAmount(tx.Withdrawals || tx.Deposits);
        const inDateRange =
            (!filterStartDate || dateVal >= Date.parse(filterStartDate)) &&
            (!filterEndDate || dateVal <= Date.parse(filterEndDate));

        const inAmountRange =
            (!filterMinAmount || amountVal >= parseFloat(filterMinAmount)) &&
            (!filterMaxAmount || amountVal <= parseFloat(filterMaxAmount));

        const inCategory =
            !filterCategory || tx.Category === filterCategory;

        return inDateRange && inAmountRange && inCategory;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        if (sortKey === 'Date') {
            aVal = Date.parse(aVal);
            bVal = Date.parse(bVal);
        } else if (['Deposits', 'Withdrawals', 'Balance'].includes(sortKey)) {
            aVal = parseAmount(aVal);
            bVal = parseAmount(bVal);
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const uniqueCategories = [...new Set(transactions.map(tx => tx.Category).filter(Boolean))];

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                    <label className="block mb-1 font-medium">Start Date</label>
                    <input
                        type="date" value={filterStartDate}
                        onChange={e => setFilterStartDate(e.target.value)}
                        className="w-full border rounded p-1 bg-gray-800" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">End Date</label>
                    <input
                        type="date" value={filterEndDate}
                        onChange={e => setFilterEndDate(e.target.value)}
                        className="w-full border rounded p-1 bg-gray-800" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Min Amount</label>
                    <input
                        type="number" value={filterMinAmount}
                        onChange={e => setFilterMinAmount(e.target.value)}
                        className="w-full border rounded p-1 bg-gray-800" />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Max Amount</label>
                    <input
                        type="number" value={filterMaxAmount}
                        onChange={e => setFilterMaxAmount(e.target.value)}
                        className="w-full border rounded p-1 bg-gray-800"  />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="p-1 border rounded w-full text-sm bg-white dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">All</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <label>
                    Sort by:
                    <select
                        className="p-1 border rounded w-full text-sm bg-white dark:bg-gray-800 dark:text-white"
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                    >
                        <option value="Date">Date</option>
                        <option value="Deposits">Deposits</option>
                        <option value="Withdrawals">Withdrawals</option>
                        <option value="Balance">Balance</option>
                    </select>
                </label>
                <label>
                    Order:
                    <select
                        className="p-1 border rounded w-full text-sm bg-white dark:bg-gray-800 dark:text-white"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full text-left border border-collapse border-gray-300 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Deposits</th>
                        <th className="p-2 border">Withdrawals</th>
                        <th className="p-2 border">Balance</th>
                        <th className="p-2 border">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedTransactions.map((tx, index) => (
                        <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700">
                            <td className="p-2 border">{tx.Date}</td>
                            <td className="p-2 border">{tx.Description}</td>
                            <td className="p-2 border">{tx.Deposits}</td>
                            <td className="p-2 border">{tx.Withdrawals}</td>
                            <td className="p-2 border">{tx.Balance}</td>
                            <td className="p-2 border">{tx.Category}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
