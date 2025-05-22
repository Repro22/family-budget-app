"use client";

import React, { useEffect, useState } from 'react';
import { ToggleViewSwitcher } from '../components/ToggleViewSwitcher';
import { CategorySelector } from './CategorySelector';

const predefinedCategories = [
    "Groceries", "Rent/Mortgage", "Utilities", "Transportation",
    "Dining Out", "Entertainment", "Healthcare", "Education",
    "Savings", "Miscellaneous"
];
const newCustomOption = "– New custom –";

export default function CategoriesPage() {
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

    return (
        <CategorySelector
            txns={txns}
            loading={loading}
            error={error}
            viewMode={viewMode}
            setViewMode={setViewMode}
            handleCategoryChange={handleCategoryChange}
            customCategories={customCategories}
            predefinedCategories={predefinedCategories}
            newCustomOption={newCustomOption}
        />
    );
}
