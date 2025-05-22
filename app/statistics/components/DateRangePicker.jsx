export default function DateRangePicker({
                                            startDate,
                                            endDate,
                                            onStartDateChange,
                                            onEndDateChange,
                                        }) {
    return (
        <div className="flex gap-4 mb-6">
            <label className="flex flex-col text-sm">
                Start date
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full border rounded p-1 bg-gray-800"
                />
            </label>
            <label className="flex flex-col text-sm">
                End date
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full border rounded p-1 bg-gray-800"
                />
            </label>
        </div>
    );
}
