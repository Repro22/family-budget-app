import { ResponsivePie } from '@nivo/pie';

export default function IncomeExpensePie({ totalIncome, totalExpenses }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Income vs Expenses</h2>
            <div className="h-80">
                <ResponsivePie
                    data={[
                        { id: 'Income', value: totalIncome },
                        { id: 'Expenses', value: totalExpenses },
                    ]}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.4}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'set2' }}
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
            </div>
        </div>
    );
}
