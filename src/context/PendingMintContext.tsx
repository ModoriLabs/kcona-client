'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PendingMintContextType {
  pendingMintAddress: string | null
  setPendingMint: (mintAddress: string) => void
  clearPendingMint: () => void
}

const PendingMintContext = createContext<PendingMintContextType | undefined>(
  undefined,
)

export function PendingMintProvider({ children }: { children: ReactNode }) {
  const [pendingMintAddress, setPendingMintAddress] = useState<string | null>(
    null,
  )

  const setPendingMint = (mintAddress: string) => {
    setPendingMintAddress(mintAddress)
  }

  const clearPendingMint = () => {
    setPendingMintAddress(null)
  }

  return (
    <PendingMintContext.Provider
      value={{ pendingMintAddress, setPendingMint, clearPendingMint }}>
      {children}
    </PendingMintContext.Provider>
  )
}

export function usePendingMint() {
  const context = useContext(PendingMintContext)
  if (context === undefined) {
    throw new Error('usePendingMint must be used within a PendingMintProvider')
  }
  return context
}
