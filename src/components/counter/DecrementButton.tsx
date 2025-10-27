'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { useCounterProgram } from 'src/hooks/useCounterProgram'
import { useTransactionToast } from 'src/hooks/useTransactionToast'

/**
 * Button component that decrements the counter
 * Handles transaction signing and displays loading state
 */
export function DecrementButton() {
  const { publicKey, connected } = useWallet()
  const { program, isReady } = useCounterProgram()
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null)

  useTransactionToast({ transactionSignature })

  const handleDecrement = async () => {
    if (!publicKey || !program) return

    try {
      setIsLoading(true)
      setTransactionSignature(null)

      const txSignature = await program.methods
        .decrement()
        .accounts({
          user: publicKey,
        })
        .rpc()

      setTransactionSignature(txSignature)
    } catch (err) {
      console.error('Error decrementing counter:', err)
      toast.error('Transaction Failed', {
        description: err instanceof Error ? err.message : String(err),
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDecrement}
      disabled={isLoading || !connected || !isReady}
      className="h-11 w-[85%] rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-base font-medium text-white transition-all hover:from-red-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-red-200/50 border-t-red-200"></div>
          <span>Processing...</span>
        </div>
      ) : (
        'Decrement Counter'
      )}
    </button>
  )
}
