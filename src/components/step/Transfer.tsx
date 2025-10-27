'use client'

import { useState } from 'react'
import { getTossBankQRCode, TOSS_ACCOUNT_NUMBER } from 'src/constants'

export function Transfer({ onNext }: { onNext: () => void }) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isCopied, setIsCopied] = useState<{ [key: string]: boolean }>({})

  // For demo: 10,000 KRW
  const transferAmount = '10000'
  const qrCodeUrl = getTossBankQRCode(transferAmount)

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied({ ...isCopied, [key]: true })
      setTimeout(() => {
        setIsCopied({ ...isCopied, [key]: false })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

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
        <h2 className="text-2xl font-bold">KRW 송금</h2>
      </div>

      {/* Transfer Instructions */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="font-semibold">송금 안내</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
          <li>아래 QR 코드를 스캔하거나 계좌 정보를 확인하세요</li>
          <li>토스뱅크 앱에서 지정된 금액을 송금하세요</li>
          <li>
            송금 후 &ldquo;송금 완료&rdquo; 버튼을 눌러 다음 단계로 진행하세요
          </li>
        </ol>
        <p className="text-sm font-semibold text-red-600">
          ⚠️ 정확한 금액을 송금해야 합니다
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex h-48 w-48 items-center justify-center bg-gray-100">
            <p className="text-xs text-gray-500">QR Code Placeholder</p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">은행</span>
          <span className="font-medium">토스뱅크</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">계좌번호</span>
          <button
            onClick={() => copyToClipboard(TOSS_ACCOUNT_NUMBER, 'account')}
            className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
            <span>{TOSS_ACCOUNT_NUMBER}</span>
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">예금주</span>
          <span className="font-medium">이현민(모임통장)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">송금 금액</span>
          <span className="text-lg font-bold">{transferAmount} KRW</span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleConfirmTransfer}
        className="w-full rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
        송금 완료
      </button>

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">송금 확인</h3>
            <p className="mb-6 text-sm text-gray-600">
              토스뱅크로 {transferAmount} KRW를 송금하셨나요?
              <br />
              송금 완료 후 증명서를 발급받을 수 있습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50">
                취소
              </button>
              <button
                onClick={handleConfirmAndNext}
                className="flex-1 rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
