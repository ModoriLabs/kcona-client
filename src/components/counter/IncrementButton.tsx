'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { useCounterProgram } from 'src/hooks/useCounterProgram'
import { useTransactionToast } from 'src/hooks/useTransactionToast'

/**
 * Button component that increments the counter
 * Handles transaction signing and displays loading state
 */
export function IncrementButton() {
  const { publicKey, connected } = useWallet()
  const { program, isReady } = useCounterProgram()
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null)

  useTransactionToast({ transactionSignature })

  const handleIncrement = async () => {
    if (!publicKey || !program) return

    try {
      setIsLoading(true)
      setTransactionSignature(null)

      const txSignature = await program.methods
        .increment()
        .accounts({
          user: publicKey,
        })
        .rpc()

      setTransactionSignature(txSignature)
    } catch (err) {
      console.error('Error incrementing counter:', err)
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
      onClick={handleIncrement}
      disabled={isLoading || !connected || !isReady}
      className="h-11 w-[85%] rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-base font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-purple-200/50 border-t-purple-200"></div>
          <span>Processing...</span>
        </div>
      ) : (
        'Increment Counter'
      )}
    </button>
  )
}
