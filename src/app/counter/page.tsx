'use client'

import { CounterCard } from 'src/components/counter/CounterCard'

export default function CounterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-white">
          Solana Counter Demo
        </h1>
        <p className="text-gray-400">
          Test Anchor program with increment and decrement operations
        </p>
      </div>
      <CounterCard />
    </main>
  )
}
