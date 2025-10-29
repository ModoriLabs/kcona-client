'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ComputeBudgetProgram, Keypair } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { toast } from 'sonner'
import { useZkEscrowProgram } from 'src/hooks/useZkEscrowProgram'
import { useTransactionToast } from 'src/hooks/useTransactionToast'
import { usePendingMint } from 'src/context/PendingMintContext'
import {
  getVerificationResult,
  getCollectionState,
  getMintAuthority,
  getMetadata,
  getMasterEdition,
  COLLECTION_MINT,
  TOKEN_METADATA_PROGRAM,
} from 'src/constants'

interface MintNFTButtonProps {
  onSuccess?: (mintAddress: string, signature: string) => void
}

/**
 * Button component that mints NFT using verified proof
 * Two-transaction pattern: Step 2 - Mint NFT using verified proof result
 */
export function MintNFTButton({ onSuccess }: MintNFTButtonProps) {
  const { publicKey, connected, sendTransaction } = useWallet()
  const { program, isReady } = useZkEscrowProgram()
  const { setPendingMint } = usePendingMint()
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null)

  useTransactionToast({ transactionSignature })

  const handleMint = async () => {
    if (!publicKey || !program) return

    try {
      setIsLoading(true)
      setTransactionSignature(null)

      // Generate new NFT mint
      const mintKeypair = Keypair.generate()
      const mintAddress = mintKeypair.publicKey.toBase58()
      console.log('NFT Mint address:', mintAddress)

      // Set pending mint in context BEFORE minting
      setPendingMint(mintAddress)

      // Get verification result PDA
      const verificationResultPda = await getVerificationResult(publicKey)

      if (!COLLECTION_MINT) {
        toast.error('Configuration Error', {
          description: 'Collection mint is not set',
          duration: 5000,
        })
        return
      }

      // Get PDAs
      const collectionStatePda = await getCollectionState(COLLECTION_MINT)
      const mintAuthorityPda = await getMintAuthority()
      const destination = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey,
      )
      const metadata = await getMetadata(mintKeypair.publicKey)
      const masterEdition = await getMasterEdition(mintKeypair.publicKey)
      const collectionMetadata = await getMetadata(COLLECTION_MINT)
      const collectionMasterEdition = await getMasterEdition(COLLECTION_MINT)

      console.log('Minting NFT...')
      console.log('Verification Result PDA:', verificationResultPda.toBase58())

      console.log('=== Mint Accounts Debug ===')
      console.log('verificationResult:', verificationResultPda.toBase58())
      console.log('collectionState:', collectionStatePda.toBase58())
      console.log('collectionMint:', COLLECTION_MINT.toBase58())
      const computeUnitLimit = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400_000,
      })
      // Call mintWithVerifiedProof instruction
      const txSignature = await program.methods
        .mintWithVerifiedProof()
        .accounts({
          signer: publicKey,
          mint: mintKeypair.publicKey,
          destination,
          metadata,
          masterEdition,
          mintAuthority: mintAuthorityPda,
          collectionMint: COLLECTION_MINT,
          collectionMetadata,
          collectionMasterEdition,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM,
        })
        .preInstructions([computeUnitLimit])
        .signers([mintKeypair])
        .rpc()

      console.log('NFT minted:', txSignature)
      console.log('NFT address:', mintKeypair.publicKey.toBase58())

      setTransactionSignature(txSignature)

      // Call success callback
      if (onSuccess) {
        onSuccess(mintKeypair.publicKey.toBase58(), txSignature)
      }
    } catch (err) {
      console.error('Error minting NFT:', err)

      // Log transaction logs if available
      if (err && typeof err === 'object' && 'logs' in err) {
        console.error('=== Transaction Logs ===')
        console.error((err as any).logs)
      }
      if (err && typeof err === 'object' && 'transactionLogs' in err) {
        console.error('=== Transaction Logs ===')
        console.error((err as any).transactionLogs)
      }

      toast.error('NFT Minting Failed', {
        description: err instanceof Error ? err.message : String(err),
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleMint}
      disabled={isLoading || !connected || !isReady}
      className="h-11 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-base font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-blue-200/50 border-t-blue-200"></div>
          <span>Minting NFT...</span>
        </div>
      ) : (
        'Step 2: Mint NFT'
      )}
    </button>
  )
}
