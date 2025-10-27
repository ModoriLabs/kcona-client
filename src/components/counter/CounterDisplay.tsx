'use client'

import { useCallback, useEffect, useState } from 'react'
import { useCounterProgram } from 'src/hooks/useCounterProgram'

/**
 * Displays the current counter value with real-time updates
 * Uses WebSocket subscription to listen for account changes
 */
export function CounterDisplay() {
  const { program, counterAddress, isReady } = useCounterProgram()
  const [counterValue, setCounterValue] = useState<number | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  // Fetch counter value
  const fetchCounterValue = useCallback(async () => {
    if (!program || !isReady) return

    try {
      setIsFetching(true)
      const counterAccount = await program.account.counter.fetch(counterAddress)
      setCounterValue(Number(counterAccount.count))
    } catch (err) {
      console.error('Error fetching counter value:', err)
      setCounterValue(null)
    } finally {
      setIsFetching(false)
    }
  }, [program, counterAddress, isReady])

  // Initial fetch
  useEffect(() => {
    if (isReady) {
      fetchCounterValue()
    }
  }, [isReady, fetchCounterValue])

  // Set up WebSocket subscription for real-time updates
  useEffect(() => {
    if (!program || !isReady) return

    try {
      const connection = program.provider.connection
      const subscriptionId = connection.onAccountChange(
        counterAddress,
        (accountInfo) => {
          const decoded = program.coder.accounts.decode(
            'counter',
            accountInfo.data,
          )
          setCounterValue(Number(decoded.count))
        },
        { commitment: 'confirmed', encoding: 'base64' },
      )

      return () => {
        connection.removeAccountChangeListener(subscriptionId)
      }
    } catch (err) {
      console.error('Error setting up account subscription:', err)
    }
  }, [program, counterAddress, isReady])

  return (
    <div className="w-full px-5 text-center">
      <p className="mb-2 text-sm text-gray-600">Current Count:</p>
      <div className="flex h-14 items-center justify-center">
        {isFetching ? (
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-purple-400/30 border-t-purple-400" />
        ) : (
          <p className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            {counterValue ?? 0}
          </p>
        )}
      </div>
    </div>
  )
}
