import React from "react";

export function ToggleViewSwitcher({ viewMode, setViewMode }) {
    return (
        <div className="mb-4 flex gap-2">
            <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded border text-sm font-medium transition-colors duration-150 ${
                    viewMode === "all"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-blue-400 text-white border-blue-400 hover:bg-blue-200"
                }`}
            >
                All Transactions
            </button>
            <button
                onClick={() => setViewMode("grouped")}
                className={`px-4 py-2 rounded border text-sm font-medium transition-colors duration-150 ${
                    viewMode === "grouped"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-blue-400 text-white border-blue-400 hover:bg-blue-200"
                }`}
            >
                Grouped by Category
            </button>
        </div>
    );
}
