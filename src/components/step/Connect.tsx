'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { SOLANA_CLUSTER, isLocalnet, isDevnet, isMainnet } from '@/constants'

export function Connect() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Kcona Client</h1>
        <p className="text-lg text-gray-600">
          KRW Payment Proof → Solana NFT Minting
        </p>

        {/* Network indicator */}
        <div className="rounded-lg bg-gray-100 px-4 py-2">
          <p className="text-sm">
            Network:{' '}
            <span className="font-semibold">
              {SOLANA_CLUSTER.toUpperCase()}
            </span>
            {isLocalnet && ' (Local Validator)'}
            {isDevnet && ' (Testnet)'}
            {isMainnet && ' (Production)'}
          </p>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="flex flex-col items-center gap-4">
        <WalletMultiButton />

        {connected && publicKey && (
          <div className="rounded-lg bg-green-50 px-6 py-4 text-center">
            <p className="text-sm text-green-600">✅ Wallet Connected</p>
            <p className="mt-2 font-mono text-xs text-gray-600">
              {publicKey.toBase58()}
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!connected && (
        <div className="max-w-md space-y-4 rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold">Getting Started</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
            <li>
              Install a Solana wallet (
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                Phantom
              </a>{' '}
              or{' '}
              <a
                href="https://solflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                Solflare
              </a>
              )
            </li>
            <li>Click &ldquo;Select Wallet&rdquo; to connect</li>
            {isLocalnet && (
              <li className="text-yellow-600">
                Make sure your local Solana validator is running
              </li>
            )}
          </ol>
        </div>
      )}
    </div>
  )
}
