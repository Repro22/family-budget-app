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

    return (
        <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
            <h1>Categories</h1>
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
        </div>
    );
}
