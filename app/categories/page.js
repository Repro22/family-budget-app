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

}

