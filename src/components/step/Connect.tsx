'use client'

import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Wallet, CheckCircle2 } from 'lucide-react'

export function Connect() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Logo/Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg">
          <Image
            src="/logo.png"
            alt="Kcona"
            width={80}
            height={80}
            className="rounded-full object-contain"
          />
        </div>

        <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-bold text-transparent">
          Kcona
        </h1>
        <p className="text-lg text-muted-foreground">
          purchase your K-POP star with KRW payment
        </p>

        {/* Demo Introduction */}
        <div className="max-w-2xl space-y-4 rounded-2xl border border-primary/20 bg-card/50 p-8 backdrop-blur-sm">
          <div className="space-y-3 text-left">
            <p className="text-md leading-relaxed text-muted-foreground">
              This demo explains the{' '}
              <span className="font-semibold text-foreground">
                zkTLS-enabled payment module
              </span>
              .
            </p>
            <p className="text-md leading-relaxed text-muted-foreground">
              How it works in the process of purchasing an NFT, which we assume
              as a product.
            </p>
          </div>

          <div className="h-px bg-border/50" />

          <div className="space-y-3 text-left">
            <p className="text-md leading-relaxed text-muted-foreground">
              Using the zkTLS payment module, you can{' '}
              <span className="font-semibold text-foreground">
                verify fiat transfer record
              </span>{' '}
              and conduct on-chain transactions.
            </p>
            <p className="text-md leading-relaxed text-muted-foreground">
              In this demo, we&apos;ll show you how to{' '}
              <span className="font-semibold text-foreground">
                send KRW and receive an NFT
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="flex flex-col items-center gap-4">
        <WalletMultiButton />

        {connected && publicKey && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-card/50 px-6 py-4 backdrop-blur-sm">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-primary">Wallet Connected</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {publicKey.toBase58().slice(0, 4)}...
                {publicKey.toBase58().slice(-4)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!connected && (
        <div className="max-w-md space-y-4 rounded-lg border border-primary/20 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Getting Started</h3>
          </div>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Install a Solana wallet (
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline">
                Phantom
              </a>{' '}
              or{' '}
              <a
                href="https://solflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline">
                Solflare
              </a>
              )
            </li>
            <li>Click &ldquo;Select Wallet&rdquo; to connect</li>
          </ol>
        </div>
      )}
    </div>
  )
}
