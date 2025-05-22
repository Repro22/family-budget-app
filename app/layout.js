
import "./globals.css";
import { HeaderBar } from "@/app/shared-components/HeaderBar";
import NavBar  from "@/app/shared-components/NavBar";

export const metadata = {
    title: "FamilyBudget",
    description: "Track and analyze your family expenses",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
        <NavBar />
        <main className="p-4">{children}</main>
        </body>
        </html>
    );
}
