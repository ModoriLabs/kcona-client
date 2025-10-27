'use client'

import { useMemo } from 'react'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'

interface UseProgramOptions {
  idl: Idl
  programId?: PublicKey
}

interface UseProgramReturn<T extends Idl> {
  program: Program<T> | null
  programId: PublicKey | null
  isReady: boolean
}

/**
 * Generic hook for creating Anchor programs dynamically
 * - With wallet: Creates provider for transaction signing
 * - Without wallet: Read-only mode with connection only
 *
 * @example
 * const { program, programId, isReady } = useProgram({
 *   idl: counterIdl,
 *   programId: COUNTER_PROGRAM_ID // optional, can be extracted from IDL
 * })
 */
export function useProgram<T extends Idl>({
  idl,
  programId,
}: UseProgramOptions): UseProgramReturn<T> {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  // Extract program ID from IDL metadata if not provided
  const resolvedProgramId = useMemo(() => {
    if (programId) return programId

    // Try to extract from IDL metadata
    const metadata = (idl as any).metadata
    if (metadata && metadata.address) {
      return new PublicKey(metadata.address)
    }

    console.error('Program ID not found in IDL metadata and not provided')
    return null
  }, [idl, programId])

  const program = useMemo(() => {
    if (!resolvedProgramId) return null

    try {
      if (wallet) {
        // Create provider with wallet for transaction signing
        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: 'confirmed',
        })
        return new Program<T>(idl as T, provider)
      } else {
        // Read-only mode without wallet
        return new Program<T>(idl as T, { connection })
      }
    } catch (error) {
      console.error('Failed to create program:', error)
      return null
    }
  }, [idl, connection, wallet, resolvedProgramId])

  return {
    program,
    programId: resolvedProgramId,
    isReady: program !== null && resolvedProgramId !== null,
  }
}
