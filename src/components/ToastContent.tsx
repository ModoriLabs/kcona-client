'use client'

import { useState, MouseEvent } from 'react'

interface ToastContentProps {
  transactionSignature: string
  explorerUrl: string
}

export function ToastContent({
  transactionSignature,
  explorerUrl,
}: ToastContentProps) {
  const [isContentCopied, setIsContentCopied] = useState(false)

  const handleContentCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    navigator.clipboard.writeText(transactionSignature)
    setIsContentCopied(true)
    setTimeout(() => setIsContentCopied(false), 500)
  }

  return (
    <div className="mt-2">
      <div className="mb-3 overflow-auto rounded border border-gray-800 bg-black/30 p-1.5 font-mono text-xs">
        {transactionSignature}
      </div>
      <div className="flex w-full gap-2">
        <button
          className={`flex h-8 flex-1 items-center justify-center rounded border px-2 text-xs ${
            isContentCopied
              ? 'border-purple-500/50 bg-purple-900/20'
              : 'border-purple-800/30 bg-black/20 hover:bg-purple-900/20'
          }`}
          onClick={handleContentCopy}>
          {isContentCopied ? (
            <>
              <svg
                className="mr-1.5 h-3.5 w-3.5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="mr-1.5 h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Signature
            </>
          )}
        </button>
        <button
          className="flex h-8 flex-1 items-center justify-center rounded border border-blue-800/30 bg-black/20 px-2 text-xs hover:bg-blue-900/20"
          onClick={(e) => {
            e.stopPropagation()
            window.open(explorerUrl, '_blank')
          }}>
          <svg
            className="mr-1.5 h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          View in Explorer
        </button>
      </div>
    </div>
  )
}
