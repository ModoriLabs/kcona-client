'use client'

import { CounterDisplay } from './CounterDisplay'
import { IncrementButton } from './IncrementButton'
import { DecrementButton } from './DecrementButton'

/**
 * Main Counter card component
 * Displays the counter value and provides increment/decrement controls
 */
export function CounterCard() {
  return (
    <div className="mx-auto w-[350px] rounded-lg border border-gray-800 bg-gray-900/70 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold">Solana Counter</h2>
        <CounterDisplay />
        <div className="flex w-full flex-col items-center space-y-3">
          <IncrementButton />
          <DecrementButton />
        </div>
      </div>
    </div>
  )
}
