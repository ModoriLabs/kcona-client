'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { CheckCircle2, Send, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
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
    setCurrentStep(Step.TRANSFER)
  }

  // Step 1: Wallet Connection
  if (!connected || currentStep === Step.CONNECT) {
    return <Connect />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <button
          onClick={() => window.location.reload()}
          className="container mx-auto flex items-center justify-between px-4 py-4 cursor-pointer">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Kcona Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              Kcona
            </h1>
          </div>
          <WalletMultiButton />
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* View Toggle Tabs */}
        <div className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 gap-2 rounded-lg bg-muted/50 p-1">
          <button
            onClick={() => setCurrentView(View.WORKFLOW)}
            className={`rounded-md px-6 py-2 font-medium transition-all ${
              currentView === View.WORKFLOW
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md'
                : 'cursor-pointer text-muted-foreground hover:text-foreground'
            }`}>
            Purchase
          </button>
          <button
            onClick={() => setCurrentView(View.GALLERY)}
            className={`rounded-md px-6 py-2 font-medium transition-all ${
              currentView === View.GALLERY
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md'
                : 'cursor-pointer text-muted-foreground hover:text-foreground'
            }`}>
            My NFTs
          </button>
        </div>

        {currentView === View.GALLERY ? (
          <Gallery />
        ) : (
          <div className="mx-auto w-full max-w-2xl space-y-8">
            {/* Progress Steps */}
            <div className="mx-auto flex max-w-2xl items-center justify-between">
              {[
                { id: Step.CONNECT, label: 'Connect', icon: Wallet, step: 1 },
                { id: Step.TRANSFER, label: 'Transfer', icon: Send, step: 2 },
                { id: Step.PROOF, label: 'Proof', icon: ShieldCheck, step: 3 },
                { id: Step.MINT, label: 'Mint', icon: Sparkles, step: 4 },
              ].map((stepInfo, index, arr) => {
                const Icon = stepInfo.icon
                const isActive = stepInfo.id === currentStep
                const isCompleted =
                  stepInfo.step === 1 ||
                  (stepInfo.step === 2 &&
                    (currentStep === Step.PROOF ||
                      currentStep === Step.MINT)) ||
                  (stepInfo.step === 3 && currentStep === Step.MINT)

                // Determine if step is clickable
                const isClickable =
                  stepInfo.id !== Step.CONNECT && (isCompleted || isActive)

                const handleStepClick = () => {
                  if (!isClickable) return

                  // Navigate to the clicked step
                  if (stepInfo.id === Step.TRANSFER) {
                    setCurrentStep(Step.TRANSFER)
                  } else if (
                    stepInfo.id === Step.PROOF &&
                    (currentStep === Step.PROOF || currentStep === Step.MINT)
                  ) {
                    setCurrentStep(Step.PROOF)
                  } else if (
                    stepInfo.id === Step.MINT &&
                    currentStep === Step.MINT &&
                    proofResult
                  ) {
                    setCurrentStep(Step.MINT)
                  }
                }

                return (
                  <div key={stepInfo.id} className="flex flex-1 items-center">
                    <div className="flex flex-1 flex-col items-center">
                      <button
                        onClick={handleStepClick}
                        disabled={!isClickable}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                          isCompleted
                            ? 'bg-primary text-primary-foreground'
                            : isActive
                              ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                        } ${isClickable ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : 'cursor-default'}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </button>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive || isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}>
                        {stepInfo.label}
                      </span>
                    </div>
                    {index < arr.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 transition-all ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-primary/20 bg-card/50 p-8 shadow-lg backdrop-blur">
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
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Kcona - purchase your K-POP star</p>
        </div>
      </footer>
    </div>
  )
}
