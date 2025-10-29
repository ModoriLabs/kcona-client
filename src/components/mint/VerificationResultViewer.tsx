'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { useZkEscrowProgram } from 'src/hooks/useZkEscrowProgram'
import { getVerificationResult } from 'src/constants'

export interface VerificationResult {
  user: string
  verifiedAt: number
  claimIdentifier: string
  isUsed: boolean
}

interface VerificationResultViewerProps {
  onResultFetched?: (result: VerificationResult | null) => void
  disabled?: boolean
}

export function VerificationResultViewer({
  onResultFetched,
  disabled = false,
}: VerificationResultViewerProps) {
  const { publicKey, connected } = useWallet()
  const { program, isReady } = useZkEscrowProgram()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleFetchResult = async () => {
    if (!publicKey || !program) return

    try {
      setIsLoading(true)
      setResult(null)
      setNotFound(false)

      // Get verification result PDA
      const verificationResultPda = await getVerificationResult(publicKey)
      console.log('Fetching PDA:', verificationResultPda.toBase58())

      // Fetch account data
      const accountInfo = await program.account.verificationResult.fetch(
        verificationResultPda,
      )

      console.log('Verification Result:', accountInfo)

      // Convert to display format
      const resultData: VerificationResult = {
        user: accountInfo.user.toBase58(),
        verifiedAt: accountInfo.verifiedAt.toNumber(),
        claimIdentifier: accountInfo.claimIdentifier,
        isUsed: accountInfo.isUsed,
      }

      setResult(resultData)

      // Notify parent component
      if (onResultFetched) {
        onResultFetched(resultData)
      }

      toast.success('Verification Result Loaded', {
        description: `Verified at: ${new Date(resultData.verifiedAt * 1000).toLocaleString()}`,
      })
    } catch (err) {
      console.error('Error fetching verification result:', err)

      // Check if account doesn't exist
      if (
        err instanceof Error &&
        err.message.includes('Account does not exist')
      ) {
        setNotFound(true)

        // Notify parent component
        if (onResultFetched) {
          onResultFetched(null)
        }

        toast.info('No Verification Result', {
          description: 'Please verify proof first (Step 1)',
        })
      } else {
        toast.error('Failed to Fetch Result', {
          description: err instanceof Error ? err.message : String(err),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-600">
        Connect wallet to view verification result
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Fetch Button */}
      <button
        onClick={handleFetchResult}
        disabled={isLoading || !connected || !isReady || disabled}
        className="h-10 w-full rounded-lg border-2 border-indigo-600 bg-white text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-indigo-600/30 border-t-indigo-600"></div>
            <span>Loading...</span>
          </div>
        ) : (
          'Step 2: Check Verification Result'
        )}
      </button>

      {/* Result Display */}
      {result && (
        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <h3 className="font-semibold text-green-800">
              Verification Result Found
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-green-700">User:</p>
              <p className="break-all font-mono text-xs text-green-600">
                {result.user}
              </p>
            </div>

            <div>
              <p className="font-medium text-green-700">Verified At:</p>
              <p className="font-mono text-xs text-green-600">
                {new Date(result.verifiedAt * 1000).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="font-medium text-green-700">Claim Identifier:</p>
              <p className="break-all font-mono text-xs text-green-600">
                {result.claimIdentifier}
              </p>
            </div>

            <div>
              <p className="font-medium text-green-700">Status:</p>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    result.isUsed
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                  {result.isUsed ? 'Used' : 'Available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Found Message */}
      {notFound && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            ℹ️ No verification result found
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Complete Step 1 (Verify Proof) first
          </p>
        </div>
      )}
    </div>
  )
}
