import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const {
        query: { index },
        method,
        body,
    } = req;

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'transactions.json');

    if (method === 'PATCH') {
        try {
            const idx = parseInt(index, 10);
            if (isNaN(idx)) {
                return res.status(400).json({ error: 'Invalid transaction index' });
            }

            // Read existing transactions
            const json = fs.readFileSync(filePath, 'utf-8');
            const txns = JSON.parse(json);

            if (idx < 0 || idx >= txns.length) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // Merge in updates (e.g. { category: 'Groceries' })
            txns[idx] = { ...txns[idx], ...body };

            // Write back
            fs.writeFileSync(filePath, JSON.stringify(txns, null, 2));

            return res.status(200).json(txns[idx]);
        } catch (err) {
            console.error('PATCH error:', err);
            return res.status(500).json({ error: 'Failed to update transaction' });
        }
    }

    // Method not allowed
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${method} Not Allowed`);
}