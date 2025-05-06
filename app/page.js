"use client"
import Link from "next/link";

export default function Home() {
  return (
      <main style={{ padding: 20 }}>
        <h1>Family Budget App</h1>
        <p><Link href="/import-transactions">Go to Import Transactions</Link></p>
        <p><Link href="/transactions">View Transactions</Link></p>
      </main>
  );
}