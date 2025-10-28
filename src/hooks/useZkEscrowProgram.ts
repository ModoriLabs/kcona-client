'use client'

import { useMemo } from 'react'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { ZkEscrowSol } from 'src/lib/types/zk_escrow_sol'
import zkEscrowIdl from 'src/lib/idl/zk_escrow_sol.json'
import nftIdl from 'src/lib/idl/spl_nft.json'

interface UseZkEscrowProgramReturn {
  program: Program<ZkEscrowSol> | null
  programId: PublicKey
  nftProgramId: PublicKey
  isReady: boolean
}

/**
 * Hook for ZK Escrow program
 * - With wallet: Creates provider for transaction signing
 * - Without wallet: Read-only mode with connection only
 */
export function useZkEscrowProgram(): UseZkEscrowProgramReturn {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const programId = useMemo(() => new PublicKey(zkEscrowIdl.address), [])
  const nftProgramId = useMemo(() => new PublicKey(nftIdl.address), [])
  const program = useMemo(() => {
    try {
      if (wallet) {
        // Create provider with wallet for transaction signing
        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: 'confirmed',
        })
        return new Program<ZkEscrowSol>(zkEscrowIdl as ZkEscrowSol, provider)
      } else {
        // Read-only mode without wallet
        return new Program<ZkEscrowSol>(zkEscrowIdl as ZkEscrowSol, {
          connection,
        })
      }
    } catch (error) {
      console.error('Failed to create ZK Escrow program:', error)
      return null
    }
  }, [connection, wallet])

  return {
    program,
    programId,
    nftProgramId,
    isReady: program !== null,
  }
}
