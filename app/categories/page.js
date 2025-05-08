"use client";

import { useEffect, useState } from "react";

const predefinedCategories = [
    "Groceries",
    "Rent/Mortgage",
    "Utilities",
    "Transportation",
    "Dining Out",
    "Entertainment",
    "Healthcare",
    "Education",
    "Savings",
    "Miscellaneous"
];
const newCustomOption = "– New custom –";

export default function CategoriesPage() {
    const [txns, setTxns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [customCategories, setCustomCategories] = useState([]);
    const [viewMode, setViewMode] = useState("all"); // 'all' or 'grouped'

    useEffect(() => {
        fetch("/api/transactions")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => setTxns(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleCategoryChange = async (idx, value) => {
        let newCategory = value;
        if (value === newCustomOption) {
            const input = prompt("Enter new category name:");
            if (!input) return;
            newCategory = input;
            setCustomCategories((prev) => [...prev, input]);
        }
        try {
            const res = await fetch(`/api/${idx}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Category: newCategory })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update");
            }
            const updated = await res.json();
            setTxns((prev) => prev.map((tx, i) => (i === idx ? updated : tx)));
        } catch (err) {
            console.error(err);
            alert(`Update failed: ${err.message}`);
        }
    };

    if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
    if (error) return <p style={{ padding: 20, color: "red" }}>Error: {error}</p>;

    const dataColumns = txns.length
        ? Object.keys(txns[0]).filter((col) => col !== "Category")
        : [];

    const allCategories = [
        "Uncategorized",
        ...predefinedCategories,
        ...customCategories
    ];
    // Group transactions by category
    const groupedTxns = txns.reduce((acc, tx, idx) => {
        const cat = tx.Category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({ ...tx, _idx: idx });
        return acc;
    }, {});

    return (
        <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
            <h1>Categories</h1>
            {/* View mode toggle */}
            <div style={{ marginBottom: "1rem" }}>
                <button
                    onClick={() => setViewMode("all")}
                    disabled={viewMode === "all"}
                    style={{ marginRight: "0.5rem" }}
                >
                    All Transactions
                </button>
                <button
                    onClick={() => setViewMode("grouped")}
                    disabled={viewMode === "grouped"}
                >
                    Grouped by Category
                </button>
            </div>

            {viewMode === "all" && (
                <table border="1" cellPadding="4" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        {dataColumns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                        <th>Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {txns.map((tx, idx) => (
                        <tr key={idx}>
                            {dataColumns.map((col) => (
                                <td key={col}>{tx[col]}</td>
                            ))}
                            <td>
                                <select
                                    value={tx.Category || ""}
                                    onChange={(e) => handleCategoryChange(idx, e.target.value)}
                                >
                                    <option value="">Uncategorized</option>
                                    {predefinedCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    {customCategories.map((cat) => (
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
                    {allCategories.map((category) => (
                        groupedTxns[category] && (
                            <div key={category} style={{ marginBottom: "2rem" }}>
                                <h2>{category}</h2>
                                <table border="1" cellPadding="4" style={{ width: "100%" }}>
                                    <thead>
                                    <tr>
                                        {dataColumns.map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {groupedTxns[category].map((row) => (
                                        <tr key={row._idx}>
                                            {dataColumns.map((col) => (
                                                <td key={col}>{row[col]}</td>
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

