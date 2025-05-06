// pages/api/transactions.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const transactions = req.body;        // Next.js parses JSON by default
        // (For now just dump them into a JSON file under /data)
        const dataDir = path.join(process.cwd(), 'data');
        fs.mkdirSync(dataDir, { recursive: true });
        const filePath = path.join(dataDir, 'transactions.json');
        fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

        return res
            .status(200)
            .json({ message: 'Imported successfully', count: transactions.length });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save transactions' });
    }
}
