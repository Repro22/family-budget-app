import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Family Budget App",
  description: "Work in progress",
};

export default function RootLayout({ children }) {
    // WIP Frontend needed for next assigment
    const enableUI = process.env.NEXT_PUBLIC_ENABLE_UI === 'true';


    if (!enableUI) {
        return null;
    }
    return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
