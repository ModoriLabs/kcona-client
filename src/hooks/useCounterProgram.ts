'use client'

import { useMemo } from 'react'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import counterIdl from 'src/lib/idl/counter.json'
import type { Counter } from 'src/lib/types/counter'

interface UseCounterProgramReturn {
  program: Program<Counter> | null
  programId: PublicKey
  counterAddress: PublicKey
  isReady: boolean
}

/**
 * Hook for Counter program
 * - With wallet: Creates provider for transaction signing
 * - Without wallet: Read-only mode with connection only
 */
export function useCounterProgram(): UseCounterProgramReturn {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const programId = useMemo(() => new PublicKey(counterIdl.address), [])
  console.log('programId', programId.toBase58())
  // Get the counter account address
  const counterAddress = PublicKey.findProgramAddressSync(
    [Buffer.from('counter')],
    programId,
  )[0]
  console.log('counterAddress', counterAddress.toBase58())

  const program = useMemo(() => {
    try {
      if (wallet) {
        // Create provider with wallet for transaction signing
        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: 'confirmed',
        })
        return new Program<Counter>(counterIdl as Counter, provider)
      } else {
        // Read-only mode without wallet
        return new Program<Counter>(counterIdl as Counter, { connection })
      }
    } catch (error) {
      console.error('Failed to create Counter program:', error)
      return null
    }
  }, [connection, wallet])

  return {
    program,
    programId,
    counterAddress,
    isReady: program !== null,
  }
}
