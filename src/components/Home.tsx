'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connect } from './step/Connect'
import { Transfer } from './step/Transfer'
import { Proof, ProofResult } from './step/Proof'
import { Mint } from './step/Mint'
import { Gallery } from './Gallery'

enum Step {
  CONNECT = 'CONNECT',
  TRANSFER = 'TRANSFER',
  PROOF = 'PROOF',
  MINT = 'MINT',
}

enum View {
  WORKFLOW = 'WORKFLOW',
  GALLERY = 'GALLERY',
}

export function Home() {
  const { connected, publicKey } = useWallet()
  const [currentStep, setCurrentStep] = useState<Step>(Step.CONNECT)
  const [currentView, setCurrentView] = useState<View>(View.WORKFLOW)
  const [proofResult, setProofResult] = useState<ProofResult | null>(null)

  // Update step when wallet connection changes
  if (!connected && currentStep !== Step.CONNECT) {
    setCurrentStep(Step.CONNECT)
    setProofResult(null)
    setCurrentView(View.WORKFLOW)
  } else if (connected && currentStep === Step.CONNECT) {
    setCurrentStep(Step.TRANSFER)
  }

  const handleTransferComplete = () => {
    setCurrentStep(Step.PROOF)
  }

  const handleProofComplete = (proof: ProofResult) => {
    setProofResult(proof)
    setCurrentStep(Step.MINT)
  }

  const handleMintSuccess = () => {
    setCurrentView(View.GALLERY)
  }

  // Step 1: Wallet Connection
  if (!connected || currentStep === Step.CONNECT) {
    return <Connect />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Wallet Info Header */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <span className="text-lg">👛</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Connected Wallet</p>
              {publicKey && (
                <p className="font-mono text-sm font-medium text-gray-800">
                  {publicKey.toBase58().slice(0, 4)}...
                  {publicKey.toBase58().slice(-4)}
                </p>
              )}
            </div>
          </div>
          <WalletMultiButton />
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView(View.WORKFLOW)}
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              currentView === View.WORKFLOW
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            NFT 민팅
          </button>
          <button
            onClick={() => setCurrentView(View.GALLERY)}
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              currentView === View.GALLERY
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            내 NFT
          </button>
        </div>

        {currentView === View.GALLERY ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <Gallery />
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            {/* Step Indicator */}
            <div className="mb-8 flex items-center justify-center gap-2">
              <StepIndicator
                step={1}
                label="연결"
                active={false}
                completed={true}
              />
              <div className="h-0.5 w-12 bg-gray-300" />
              <StepIndicator
                step={2}
                label="송금"
                active={currentStep === Step.TRANSFER}
                completed={
                  currentStep === Step.PROOF || currentStep === Step.MINT
                }
              />
              <div className="h-0.5 w-12 bg-gray-300" />
              <StepIndicator
                step={3}
                label="증명"
                active={currentStep === Step.PROOF}
                completed={currentStep === Step.MINT}
              />
              <div className="h-0.5 w-12 bg-gray-300" />
              <StepIndicator
                step={4}
                label="민팅"
                active={currentStep === Step.MINT}
                completed={false}
              />
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              {currentStep === Step.TRANSFER && (
                <Transfer onNext={handleTransferComplete} />
              )}

              {currentStep === Step.PROOF && (
                <Proof
                  onNext={handleProofComplete}
                  proofResult={proofResult}
                  setProofResult={setProofResult}
                />
              )}

              {currentStep === Step.MINT && proofResult && (
                <Mint proofResult={proofResult} onSuccess={handleMintSuccess} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
          completed
            ? 'border-green-600 bg-green-600 text-white'
            : active
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-300 bg-white text-gray-400'
        }`}>
        {completed ? '✓' : step}
      </div>
      <span
        className={`text-xs font-medium ${
          active
            ? 'text-blue-600'
            : completed
              ? 'text-green-600'
              : 'text-gray-400'
        }`}>
        {label}
      </span>
    </div>
  )
}
