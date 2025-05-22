"use client";

import React, { useEffect, useState } from 'react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState('Date');
    const [sortOrder, setSortOrder] = useState('asc');

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

    const sortedTransactions = [...transactions].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });


    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
            <div className="flex gap-4 mb-4">
                <label className="text-sm">
                    Sort by:
                    <select className="p-1 border rounded w-full text-sm bg-white dark:bg-gray-800 dark:text-white" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                        <option value="Date">Date</option>
                        <option value="Deposits">Deposits</option>
                        <option value="Withdrawals">Withdrawals</option>
                        <option value="Balance">Balance</option>
                    </select>
                </label>
                <label className="text-sm">
                    Order:
                    <select className="p-1 border rounded w-full text-sm bg-white dark:bg-gray-800 dark:text-white" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full text-left border border-collapse border-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        {['Date', 'Description', 'Deposits', 'Withdrawals', 'Balance', 'Category'].map((col) => (
                            <th key={col} className="p-2 border font-medium text-sm text-gray-700 dark:text-gray-200">{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedTransactions.map((tx, index) => (
                        <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700"
                        >
                            <td className="p-2 border text-sm">{tx.Date}</td>
                            <td className="p-2 border text-sm">{tx.Description}</td>
                            <td className="p-2 border text-sm">{tx.Deposits}</td>
                            <td className="p-2 border text-sm">{tx.Withdrawals}</td>
                            <td className="p-2 border text-sm">{tx.Balance}</td>
                            <td className="p-2 border text-sm">
                  <span className="inline-block bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white px-2 py-0.5 rounded text-xs">
                    {tx.Category || 'Uncategorized'}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
