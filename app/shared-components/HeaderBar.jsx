import React from "react";

export function HeaderBar() {
    return (
        <header className="w-full px-6 py-4 shadow-md bg-white dark:bg-gray-800 flex justify-between items-center">
            <div className="text-xl font-bold">FamilyBudget</div>
            <div className="flex gap-4 items-center">
                <button>🌙</button> {/* ThemeToggle placeholder */}
                <div className="rounded-full bg-gray-300 w-8 h-8"></div> {/* UserMenu placeholder */}
            </div>
        </header>
    );
}