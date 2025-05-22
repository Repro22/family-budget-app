export default function SummaryCards({ totalIncome, totalExpenses, net }) {
    return (
        <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="bg-gray-800 shadow-md rounded p-4">
                <h2 className="font-semibold text-gray-600">Total Income</h2>
                <p className="text-green-600 text-lg font-bold">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 shadow-md rounded p-4">
                <h2 className="font-semibold text-gray-600">Total Expenses</h2>
                <p className="text-red-600 text-lg font-bold">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 shadow-md rounded p-4">
                <h2 className="font-semibold text-gray-600">Net</h2>
                <p className={net >= 0 ? 'text-green-500 text-lg font-bold' : 'text-red-500 text-lg font-bold'}>
                    ${net.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
