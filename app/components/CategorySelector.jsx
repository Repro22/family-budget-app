"use client";

import React, { useEffect, useState } from 'react';
import { ToggleViewSwitcher } from './ToggleViewSwitcher';

const predefinedCategories = [
    "Groceries", "Rent/Mortgage", "Utilities", "Transportation",
    "Dining Out", "Entertainment", "Healthcare", "Education",
    "Savings", "Miscellaneous"
];
const newCustomOption = "– New custom –";

export function CategorySelector() {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [customCategories, setCustomCategories] = useState([]);
    const [viewMode, setViewMode] = useState("all");

    useEffect(() => {
        fetch("/api/transactions")
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => setTxns(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryChange = async (idx, value) => {
        let newCategory = value;
        if (value === newCustomOption) {
            const input = prompt("Enter new category name:");
            if (!input) return;
            newCategory = input;
            setCustomCategories(prev => [...prev, input]);
        }
        try {
            const res = await fetch(`/api/${idx}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Category: newCategory })
            });
            if (!res.ok) throw new Error("Failed to update");
            const updated = await res.json();
            setTxns(prev => prev.map((tx, i) => (i === idx ? updated : tx)));
        } catch (err) {
            console.error(err);
            alert(`Update failed: ${err.message}`);
        }
    };

    const dataColumns = txns.length ? Object.keys(txns[0]).filter(col => col !== "Category") : [];
    const allCategories = ["Uncategorized", ...predefinedCategories, ...customCategories];
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
                            <th key={col} className="p-2 border">{col}</th>
                        ))}
                        <th className="p-2 border">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {txns.map((tx, idx) => (
                        <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900">
                            {dataColumns.map(col => (
                                <td key={col} className="p-2 border">{tx[col]}</td>
                            ))}
                            <td className="p-2 border">
                                <select
                                    value={tx.Category || ""}
                                    onChange={e => handleCategoryChange(idx, e.target.value)}
                                    className="p-1 border rounded w-full"
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
                                            <th key={col} className="p-2 border">{col}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {groupedTxns[category].map(row => (
                                        <tr key={row._idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900">
                                            {dataColumns.map(col => (
                                                <td key={col} className="p-2 border">{row[col]}</td>
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
