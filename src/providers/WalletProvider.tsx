'use client'

import { useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { SOLANA_RPC_ENDPOINT, SOLANA_CLUSTER } from '@/constants'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Configure supported wallets
  const wallets = useMemo(
    // () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    () => [new PhantomWalletAdapter()],
    [],
  )

  // Log network info in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔗 Solana Network:', {
      cluster: SOLANA_CLUSTER,
      endpoint: SOLANA_RPC_ENDPOINT,
    })
  }

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
