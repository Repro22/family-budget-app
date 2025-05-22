"use client";

import React from 'react';
import { ToggleViewSwitcher } from '../components/ToggleViewSwitcher';

export function CategorySelector({
                                     txns,
                                     loading,
                                     error,
                                     viewMode,
                                     setViewMode,
                                     handleCategoryChange,
                                     customCategories,
                                     predefinedCategories,
                                     newCustomOption
                                 }) {
    const dataColumns = txns.length ? Object.keys(txns[0]).filter(col => col !== "Category") : [];
    const allCategories = ["Uncategorized", ...predefinedCategories, ...customCategories];
    const columnWidths = {
        Date: 'w-[120px]',
        Description: 'w-[200px]',
        Deposits: 'w-[120px]',
        Withdrawals: 'w-[120px]',
        Balance: 'w-[120px]',
    };
    const groupedTxns = txns.reduce((acc, tx, idx) => {
        const cat = tx.Category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({ ...tx, _idx: idx });
        return acc;
    }, {});

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
    if (error) return <p style={{ padding: 20, color: "red" }}>Error: {error}</p>;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Categories</h1>
            <ToggleViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />

            {viewMode === "all" && (
                <table className="w-full text-left border border-collapse border-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        {dataColumns.map(col => (
                            <th
                                key={col}
                                className={`p-2 border font-medium text-sm text-gray-700 dark:text-gray-200 ${columnWidths[col] || ''}`}
                            >
                                {col}
                            </th>
                        ))}
                        <th className="p-2 border font-medium text-sm text-gray-700 dark:text-gray-200">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {txns.map((tx, idx) => (
                        <tr
                            key={idx}
                            className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700"
                        >
                            {dataColumns.map(col => (
                                <td key={col} className={`p-2 border text-sm ${columnWidths[col] || ''}`}>{tx[col]}</td>
                            ))}
                            <td className="p-2 border">
                                <select
                                    value={tx.Category || ""}
                                    onChange={e => handleCategoryChange(idx, e.target.value)}
                                    className="p-1 border rounded w-full text-sm bg-white dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Uncategorized</option>
                                    {predefinedCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    {customCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value={newCustomOption}>{newCustomOption}</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {viewMode === "grouped" && (
                <div>
                    {allCategories.filter(c => c !== "Uncategorized").map(category => (
                        groupedTxns[category] && (
                            <div key={category} className="mb-8">
                                <h2 className="text-xl font-semibold mb-2">{category}</h2>
                                <table className="w-full text-left border border-collapse border-gray-300">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        {dataColumns.map(col => (
                                            <th
                                                key={col}
                                                className={`p-2 border font-medium text-sm text-gray-700 dark:text-gray-200 ${columnWidths[col] || ''}`}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {groupedTxns[category].map(row => (
                                        <tr
                                            key={row._idx}
                                            className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700"
                                        >
                                            {dataColumns.map(col => (
                                                <td key={col} className={`p-2 border text-sm ${columnWidths[col] || ''}`}>{row[col]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}