import "./globals.css";
import { HeaderBar } from "@/app/shared-components/HeaderBar";

export const metadata = {
    title: "FamilyBudget",
    description: "Track and analyze your family expenses",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
        <HeaderBar />
        <main className="p-4">{children}</main>
        </body>
        </html>
    );
}