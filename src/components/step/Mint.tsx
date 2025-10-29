'use client'

import { useState } from 'react'
import { ProofResult } from './Proof'
import { VerifyProofButton } from '../mint/VerifyProofButton'
import { MintNFTButton } from '../mint/MintNFTButton'
import {
  VerificationResultViewer,
  VerificationResult,
} from '../mint/VerificationResultViewer'
import { CollectionStateViewer } from '../mint/CollectionStateViewer'

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
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-green-800">
            NFT 민팅 성공!
          </h2>
          <p className="text-gray-600">
            축하합니다! NFT가 성공적으로 민팅되었습니다.
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-semibold text-green-800">
            NFT Mint Address:
          </p>
          <p className="break-all font-mono text-xs text-green-700">
            {mintAddress}
          </p>
        </div>

        <a
          href={`https://explorer.solana.com/address/${mintAddress}?cluster=custom&customUrl=http://localhost:8899`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-full bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700">
          Explorer에서 보기 (Localnet)
        </a>
      </div>
    )
  }

  // Main UI - two-step process
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">NFT 민팅</h2>
      </div>

      {/* Instructions */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="font-semibold">Two-Transaction Pattern</h3>
        <p className="text-sm text-gray-600">
          ZK Proof 검증과 NFT 민팅을 두 단계로 나누어 진행합니다.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                verificationSignature
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
              1
            </span>
            <div>
              <p className="font-medium">Proof 검증 (verifyProof)</p>
              <p className="text-xs text-gray-500">
                ZK Proof를 온체인에서 검증하고 결과를 PDA에 저장합니다
              </p>
              {verificationSignature && (
                <p className="mt-1 font-mono text-xs text-green-600">
                  ✓ Verified
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                mintSignature
                  ? 'bg-green-600 text-white'
                  : verificationSignature
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}>
              2
            </span>
            <div>
              <p className="font-medium">NFT 민팅 (mintWithVerifiedProof)</p>
              <p className="text-xs text-gray-500">
                검증된 Proof를 사용하여 NFT를 민팅합니다
              </p>
              {!verificationSignature && (
                <p className="mt-1 text-xs text-gray-500">
                  Step 1을 먼저 완료해주세요
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
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-xs text-green-700">
              ✓ Proof verified successfully
            </p>
          </div>
        )}
      </div>

      {/* <CollectionStateViewer /> */}

      {/* Verification Result Viewer */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">
          📋 Verification Result
        </h3>
        <VerificationResultViewer
          onResultFetched={handleVerificationResultFetched}
          disabled={!verificationSignature}
        />
        {!verificationSignature && (
          <p className="text-center text-xs text-gray-500">
            Step 1을 먼저 완료해주세요
          </p>
        )}
        {verificationResult?.isUsed && (
          <p className="text-center text-xs text-red-600">
            ⚠️ 이미 사용된 proof입니다
          </p>
        )}
      </div>

      {/* Step 2: Mint NFT */}
      <div className="space-y-3">
        <MintNFTButton onSuccess={handleMintSuccess} disabled={!canMint} />
        {!canMint && (
          <p className="text-center text-xs text-gray-500">
            {!verificationSignature
              ? 'Step 1을 먼저 완료해주세요'
              : !verificationResult
                ? 'Verification Result를 확인해주세요'
                : verificationResult.isUsed
                  ? '이미 사용된 proof입니다'
                  : 'Verification Result를 확인해주세요'}
          </p>
        )}
      </div>
    </div>
  )
}
