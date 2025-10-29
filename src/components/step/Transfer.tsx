'use client'

import { useTossLauncher } from '@/src/hooks/useTossLauncher'
import { useState } from 'react'
import { getTossBankQRCode, TOSS_ACCOUNT_NUMBER } from 'src/constants'
import { VideoPopup } from 'src/components/ui/VideoPopup'
import { ConfirmationModal } from 'src/components/ui/ConfirmationModal'
import QRCode from 'react-qr-code'
import { useWallet } from '@solana/wallet-adapter-react'

export function Transfer({ onNext }: { onNext: () => void }) {
  const { publicKey } = useWallet()
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false)
  const [isCopied, setIsCopied] = useState<{ [key: string]: boolean }>({})

  // For demo: 1,000 KRW
  const transferAmount = '1000'
  const solanaAddress = publicKey?.toBase58()
  const transferMemo = `sol:${solanaAddress}` // This should be dynamic based on intent ID
  const qrCodeUrl = getTossBankQRCode(transferAmount.toString())
  const { launch, fallback, storeURL, reset } = useTossLauncher(qrCodeUrl)

  const handleConfirmTransfer = () => {
    setIsConfirmationOpen(true)
  }

  const handleConfirmAndNext = () => {
    setIsConfirmationOpen(false)
    onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Send KRW</h2>
      </div>

      {/* Video Tutorial Section */}
      <section className="space-y-4 rounded-[24px] border border-border/50 bg-card/50 p-6 backdrop-blur-xl">
        {/* Mobile: Button to open video popup */}
        <button
          onClick={() => setIsVideoPopupOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 sm:hidden">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          View Demo Video
        </button>

        {/* Desktop: Inline video */}
        <div className="hidden overflow-hidden rounded-2xl border border-border/50 bg-background sm:flex sm:items-center sm:justify-center">
          <video controls className="h-[640px] w-full rounded-lg">
            <source src="/tossbank_transfer.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Video Popup for Mobile */}
      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={() => setIsVideoPopupOpen(false)}
        videoSrc="/tossbank_transfer.mp4"
        title="Tossbank Transfer Demo"
      />

      {/* Transfer Instructions */}
      <section className="space-y-4 rounded-[24px] border border-border/50 bg-card/50 p-6 backdrop-blur-xl">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span className="text-primary">◆</span>
            Send Money via Bank App
          </h3>
          <div className="ml-6 space-y-2 text-sm text-muted-foreground">
            <p>1. Send KRW to the recipient via TOSS</p>
            <p className="font-bold text-destructive">
              ⚠️ Please modify the &apos;Transfer Memo&apos;.
            </p>
            <p>2. You must use Toss as the sending bank.</p>
          </div>
        </div>

        {/* QR Code for Desktop */}
        <div className="hidden justify-center pt-4 pb-4 sm:flex">
          <div className="rounded-2xl border border-border/50 bg-background p-4">
            <QRCode value={qrCodeUrl} size={200} level="H" />
          </div>
        </div>

        {/* Mobile: Toss App Launch Button */}
        <button
          onClick={launch}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg sm:hidden">
          Send Money via Tossbank App
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path
              d="M7 3H5.5C4.11929 3 3 4.11929 3 5.5V12.5C3 13.8807 4.11929 15 5.5 15H12.5C13.8807 15 15 13.8807 15 12.5V11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 3H15V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 10L15 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Mobile: Install App Fallback */}
        {fallback && (
          <button
            onClick={() => {
              window.open(storeURL, '_blank')
              reset()
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 sm:hidden">
            Install Tossbank App
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 3H5.5C4.11929 3 3 4.11929 3 5.5V12.5C3 13.8807 4.11929 15 5.5 15H12.5C13.8807 15 15 13.8807 15 12.5V11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 3H15V7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10L15 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Account Details */}
        <section className="space-y-3 rounded-2xl border border-border/50 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Recipient Name</p>
            <p className="text-sm font-medium text-foreground">
              이현민(모임통장)
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Bank Account</p>
            <CopyTextButton
              text={TOSS_ACCOUNT_NUMBER}
              title={`토스뱅크 ${TOSS_ACCOUNT_NUMBER}`}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Transfer Memo</p>
            <CopyTextButton text={transferMemo} title={transferMemo} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Transfer Amount</p>
            <p className="text-sm font-medium text-foreground">
              {transferAmount.toLocaleString()} KRW
            </p>
          </div>
        </section>
      </section>

      {/* Actions */}
      <button
        onClick={handleConfirmTransfer}
        className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-primary-foreground transition-all duration-200 hover:shadow-lg hover:opacity-90 cursor-pointer">
        Next
      </button>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmAndNext}
        recipientName="이현민(모임통장)"
        transferAmount={transferAmount}
        memo={transferMemo}
        bankAccount={`토스뱅크 ${TOSS_ACCOUNT_NUMBER}`}
      />
    </div>
  )
}

const CopyTextButton = ({ text, title }: { text: string; title: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={() => handleCopy(text)}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 ${
        isCopied
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
      }`}
      title="Click to copy">
      {isCopied ? (
        <span>Copied</span>
      ) : (
        <>
          <span>{title}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </>
      )}
    </button>
  )
}
