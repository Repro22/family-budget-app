import Link from 'next/link';

export default function NavBar() {
    return (
        <header className="w-full px-6 py-4 shadow-md dark:bg-gray-800">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                    FamilyBudget
                </Link>
                <nav>
                    <ul className="flex space-x-6 text-blue-200">
                        <li>
                            <Link href="/import-transactions" className="hover:text-blue-600">
                                Import
                            </Link>
                        </li>
                        <li>
                            <Link href="/transactions" className="hover:text-blue-600">
                                Transactions
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="hover:text-blue-600">
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/statistics" className="hover:text-blue-600">
                                Statistics
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
