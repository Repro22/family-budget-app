import { ResponsivePie } from '@nivo/pie';

export default function CategoryPie({
                                        data,
                                        showUncategorized,
                                        onToggleUncategorized,
                                    }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Spending by Category</h2>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={showUncategorized}
                        onChange={(e) => onToggleUncategorized(e.target.checked)}
                    />
                    Show Uncategorized
                </label>
            </div>
            <div className="h-80">
                {data.length > 0 ? (
                    <ResponsivePie
                        data={data}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        colors={{ scheme: 'nivo' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        arcLinkLabelsSkipAngle={10}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        theme={{
                            tooltip: {
                                container: {
                                    background: '#333333',
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    borderRadius: '4px',
                                    padding: '6px 8px',
                                }
                            }
                        }}
                    />
                ) : (
                    <p className="text-center text-gray-500 pt-10">
                        No category data for this period.
                    </p>
                )}
            </div>
        </div>
    );
}
