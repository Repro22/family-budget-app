import { ResponsiveLine } from '@nivo/line';

export default function TrendChart({ series }) {
    return (
        <div className="h-80 mb-8">
            <h2 className="text-xl font-semibold mb-2">
                Daily Spending Trend
            </h2>
            <ResponsiveLine
                data={series}
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                xScale={{ type: 'time', format: 'native', precision: 'day' }}
                xFormat="time:%b %d"
                axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 1 day',
                    legend: 'Date',
                    legendOffset: 36,
                    legendPosition: 'middle',
                }}
                axisLeft={{
                    legend: 'Amount',
                    legendOffset: -40,
                    legendPosition: 'middle',
                }}
                enableArea={true}
                areaOpacity={0.2}
                colors={{ scheme: 'category10' }}
                pointSize={6}
                useMesh={true}

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
        </div>
    );
}
