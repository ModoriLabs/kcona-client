'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { useZkEscrowProgram } from 'src/hooks/useZkEscrowProgram'
import { useTransactionToast } from 'src/hooks/useTransactionToast'
import { ProofResult } from '../step/Proof'
import { convertProofToAnchor } from 'src/lib/proofUtils'
import { getVerificationResult, getPaymentConfig } from 'src/constants'
import { ADMIN_ADDRESS } from 'src/constants'

interface VerifyProofButtonProps {
  proofResult: ProofResult
  onSuccess?: (signature: string) => void
}

/**
 * Button component that verifies ZK proof on-chain
 * Two-transaction pattern: Step 1 - Verify proof and store result in PDA
 */
export function VerifyProofButton({
  proofResult,
  onSuccess,
}: VerifyProofButtonProps) {
  const { publicKey, connected } = useWallet()
  const { program, isReady } = useZkEscrowProgram()
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null)

  useTransactionToast({ transactionSignature })

  const handleVerifyProof = async () => {
    if (!publicKey || !program) return

    if (!ADMIN_ADDRESS) {
      toast.error('Configuration Error', {
        description: 'Admin address is not set',
        duration: 5000,
      })
      return
    }

    if (!proofResult.data?.receipt?.claim?.identifier) {
      toast.error('Claim identifier is missing', {
        duration: 5000,
      })
      return
    }

    try {
      setIsLoading(true)
      setTransactionSignature(null)

      console.log('=== Debug: Verify Proof Setup ===')
      console.log('Network:', program.provider.connection.rpcEndpoint)
      console.log('Wallet:', publicKey.toBase58())
      console.log('ZK Program ID:', program.programId.toBase58())

      // Check payment config exists
      const paymentConfigPda = await getPaymentConfig()
      console.log('Payment Config PDA:', paymentConfigPda.toBase58())

      const paymentConfigAccount =
        await program.account.paymentConfig.fetchNullable(paymentConfigPda)
      console.log('Payment Config exists:', !!paymentConfigAccount)

      if (!paymentConfigAccount) {
        console.error('❌ Payment config not initialized for this wallet!')
        toast.error('Initialization Required', {
          description: `Please run initialization script with wallet: ${publicKey.toBase58()}`,
          duration: 8000,
        })
        return
      }

      // Convert proof to Anchor format
      const anchorProof = convertProofToAnchor(proofResult)
      console.log(
        'Proof converted, signatures:',
        anchorProof.signedClaim.signatures.length,
      )

      // Get verification result PDA
      const verificationResultPda = await getVerificationResult(publicKey)
      console.log('Verification Result PDA:', verificationResultPda.toBase58())

      const txSignature = await program.methods
        .verifyProof(anchorProof, [ADMIN_ADDRESS], 1)
        .accounts({
          signer: publicKey,
        })
        .rpc({
          skipPreflight: false,
        })

      console.log('✅ Proof verified:', txSignature)
      setTransactionSignature(txSignature)

      // Call success callback
      if (onSuccess) {
        onSuccess(txSignature)
      }
    } catch (err) {
      console.error('Error verifying proof:', err)
      toast.error('Proof Verification Failed', {
        description: err instanceof Error ? err.message : String(err),
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleVerifyProof}
      disabled={isLoading || !connected || !isReady}
      className="h-11 w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-base font-medium text-white transition-all hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-green-200/50 border-t-green-200"></div>
          <span>Verifying Proof...</span>
        </div>
      ) : (
        'Step 1: Verify Proof'
      )}
    </button>
  )
}
