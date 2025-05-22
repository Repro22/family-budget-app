import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'transactions.json');

    if (req.method === 'GET') {
        try {
            const json = fs.readFileSync(filePath, 'utf-8');
            const transactions = JSON.parse(json);
            return res.status(200).json(transactions);
        } catch (err) {
            console.error('Read error:', err);
            return res.status(500).json({ error: 'Could not read transactions' });
        }
    }

    if (req.method === 'POST') {
        try {
            const transactions = req.body;
            fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
            return res.status(200).json({ message: 'Imported successfully', count: transactions.length });
        } catch (err) {
            console.error('Write error:', err);
            return res.status(500).json({ error: 'Failed to save transactions' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
