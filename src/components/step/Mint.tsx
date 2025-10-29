'use client'

import { useState } from 'react'
import { ProofResult } from './Proof'
import { VerifyProofButton } from '../mint/VerifyProofButton'
import { MintNFTButton } from '../mint/MintNFTButton'
import {
  VerificationResultViewer,
  VerificationResult,
} from '../mint/VerificationResultViewer'

export function Mint({
  proofResult,
  onSuccess,
}: {
  proofResult: ProofResult
  onSuccess?: () => void
}) {
  const [verificationSignature, setVerificationSignature] = useState<
    string | null
  >(null)
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null)
  const [mintAddress, setMintAddress] = useState<string | null>(null)
  const [mintSignature, setMintSignature] = useState<string | null>(null)

  const handleVerificationSuccess = (signature: string) => {
    setVerificationSignature(signature)
    console.log('✅ Proof verified:', signature)
  }

  const handleVerificationResultFetched = (
    result: VerificationResult | null,
  ) => {
    setVerificationResult(result)
    console.log('📋 Verification result:', result)
  }

  const handleMintSuccess = (address: string, signature: string) => {
    setMintAddress(address)
    setMintSignature(signature)
    console.log('✅ NFT minted:', address)
    console.log('✅ Signature:', signature)

    // Call parent success callback
    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }
  }

  // Check if mint button should be enabled
  const canMint =
    verificationResult !== null && verificationResult.isUsed === false

  // Success state - show minted NFT
  if (mintAddress && mintSignature) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-primary">
            NFT Minting Success!
          </h2>
          <p className="text-muted-foreground">
            Congratulations! The NFT has been successfully minted.
          </p>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 backdrop-blur">
          <p className="mb-2 text-sm font-semibold text-primary">
            NFT Mint Address:
          </p>
          <p className="break-all font-mono text-xs text-foreground">
            {mintAddress}
          </p>
        </div>

        <a
          href={`https://explorer.solana.com/address/${mintAddress}?cluster=custom&customUrl=http://localhost:8899`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 text-center font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg">
          View in Explorer (Localnet)
        </a>
      </div>
    )
  }

  // Main UI - two-step process
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">NFT Minting</h2>
      </div>

      {/* Instructions */}
      <div className="space-y-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur">
        <h3 className="font-semibold text-foreground">
          Two-Transaction Pattern
        </h3>
        <p className="text-sm text-muted-foreground">
          First, verify the proof, and then mint the NFT using the verified
          proof result.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                verificationSignature
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
              1
            </span>
            <div>
              <p className="font-medium text-foreground">
                Verify Proof (verifyProof)
              </p>
              <p className="text-xs text-muted-foreground">
                Verify the ZK Proof and store the result in a PDA.
              </p>
              {verificationSignature && (
                <p className="mt-1 font-mono text-xs text-primary">
                  ✓ Verified
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                mintSignature
                  ? 'bg-primary text-primary-foreground'
                  : verificationSignature
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}>
              2
            </span>
            <div>
              <p className="font-medium text-foreground">
                Mint NFT (mintWithVerifiedProof)
              </p>
              <p className="text-xs text-muted-foreground">
                Mint the NFT using the verified proof result.
              </p>
              {!verificationSignature && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Please complete Step 1 first.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Verify Proof */}
      <div className="space-y-3">
        <VerifyProofButton
          proofResult={proofResult}
          onSuccess={handleVerificationSuccess}
        />
        {verificationSignature && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 backdrop-blur">
            <p className="text-xs text-primary">
              ✓ Proof verified successfully
            </p>
          </div>
        )}
      </div>

      {/* <CollectionStateViewer /> */}

      {/* Verification Result Viewer */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          📋 Verification Result
        </h3>
        <VerificationResultViewer
          onResultFetched={handleVerificationResultFetched}
          disabled={!verificationSignature}
        />
        {!verificationSignature && (
          <p className="text-center text-xs text-muted-foreground">
            Please complete Step 1 first.
          </p>
        )}
        {verificationResult?.isUsed && (
          <p className="text-center text-xs text-destructive">
            ⚠️ The proof has already been used.
          </p>
        )}
      </div>

      {/* Step 2: Mint NFT */}
      <div className="space-y-3">
        <MintNFTButton onSuccess={handleMintSuccess} disabled={!canMint} />
        {!canMint && (
          <p className="text-center text-xs text-muted-foreground">
            {!verificationSignature
              ? 'Please complete Step 1 first.'
              : !verificationResult
                ? 'Please check the Verification Result.'
                : verificationResult.isUsed
                  ? 'The proof has already been used.'
                  : 'Please check the Verification Result.'}
          </p>
        )}
      </div>
    </div>
  )
}
