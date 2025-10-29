'use client'

import { abbreviateTransferMemo } from '@/src/lib/utils'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  recipientName: string
  transferAmount: string
  memo: string
  bankAccount: string
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  recipientName,
  transferAmount,
  memo,
  bankAccount,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const renderArrowIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="inline-block"
        aria-hidden="true"
        focusable="false">
        <path d="M9 18l6-6-6-6" />
      </svg>
    )
  }

  const abbreviatedTransferMemo = abbreviateTransferMemo(memo)
  console.log('abbreviatedTransferMemo', abbreviatedTransferMemo)

  return (
    <div className="fixed inset-0 z-50 mb-0 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#00000060] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <aside className="relative z-10 mx-auto w-[90%] min-w-[320px] max-w-[400px] overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h3 className="text-lg font-semibold text-foreground">
            Transfer Confirmation
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="mb-4 text-sm text-muted-foreground">
            Did your KRW transfer completed?
          </p>

          {/* Warning Box */}
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-destructive/30 bg-destructive/10 p-5 shadow-lg backdrop-blur-sm">
            <div className="relative z-10">
              <p className="flex items-center justify-center gap-2 text-center text-sm font-bold leading-relaxed text-destructive drop-shadow-sm">
                <span className="inline-block animate-pulse">⚠️</span>
                Please modify the &apos;Transfer Memo&apos;.
              </p>
            </div>
          </div>

          {/* Toss Bank UI Mockup */}
          <section className="relative aspect-[1080/1394] w-full max-h-[600px] overflow-hidden rounded-2xl bg-[#18171c]">
            <section className="pt-10">
              <p className="text-center text-[22px] font-bold text-white">
                <span className="text-[#3a83f1]">{recipientName}</span>님에게
              </p>
              <p className="text-center text-[22px] font-bold text-white">
                {transferAmount}원을
              </p>
              <p className="text-center text-[22px] font-bold text-white">
                보낼까요?
              </p>
            </section>

            <section className="absolute bottom-10 left-1/2 flex w-[90%] -translate-x-1/2 flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <p className="text-[#7e7e86] label">받는 분에게 표시</p>
                <div className="flex items-center">
                  <p className="border border-red-500 px-2 py-1 text-xs font-bold text-[#3a83f1]">
                    {abbreviatedTransferMemo}
                  </p>
                  {renderArrowIcon()}
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-[#7e7e86] label">출금 계좌</p>
                <div className="flex items-center">
                  <p className="pr-2 text-xs text-white">-</p>
                  {renderArrowIcon()}
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-[#7e7e86] label">입금 계좌</p>
                <div className="flex items-center">
                  <p className="border border-red-500 px-2 py-1 text-xs font-bold text-[#3a83f1]">
                    {bankAccount}
                  </p>
                  {renderArrowIcon()}
                </div>
              </div>
            </section>
          </section>

          {/* Buttons */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted/80">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="cursor-pointer flex-1 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg">
              Confirm
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
