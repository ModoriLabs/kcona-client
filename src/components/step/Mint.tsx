'use client'

import { useState } from 'react'
import {
  useWallet,
  useConnection,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import {
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  ComputeBudgetProgram,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor'
import { ProofResult } from './Proof'
import { convertProofToAnchor } from 'src/lib/proofUtils'
import { ZkEscrowSol } from 'src/lib/types/zk_escrow_sol'
import zkEscrowIdlJson from 'src/lib/idl/zk_escrow_sol.json'
import {
  ZK_ESCROW_PROGRAM_ID,
  SPL_NFT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  COLLECTION_MINT,
  ADMIN_ADDRESS,
  findVerificationResultPda,
  findCollectionStatePda,
  findMintAuthorityPda,
  findMetadataPda,
  findMasterEditionPda,
} from 'src/constants'

export function Mint({
  proofResult,
  onSuccess,
}: {
  proofResult: ProofResult
  onSuccess?: () => void
}) {
  // useWallet: 트랜잭션 전송용
  const { sendTransaction } = useWallet()
  // useAnchorWallet: Anchor Program 사용용
  const anchorWallet = useAnchorWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mintAddress, setMintAddress] = useState<string | null>(null)

  const handleMint = async () => {
    console.log('=== Starting Mint Process ===')
    console.log('Wallet:', anchorWallet?.publicKey?.toBase58())
    console.log('Collection Mint:', COLLECTION_MINT?.toBase58())
    console.log('Admin Address:', ADMIN_ADDRESS)
    console.log('ZK Escrow Program ID:', ZK_ESCROW_PROGRAM_ID.toBase58())

    if (!anchorWallet) {
      setError('지갑이 연결되지 않았습니다')
      return
    }

    if (!COLLECTION_MINT) {
      setError('Collection mint가 설정되지 않았습니다')
      return
    }

    if (!ADMIN_ADDRESS) {
      setError('Admin address가 설정되지 않았습니다')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert proof to Anchor format
      console.log('=== Converting Proof ===')
      console.log('proofResult:', proofResult)
      const anchorProof = convertProofToAnchor(proofResult)
      console.log('anchorProof:', anchorProof)
      console.log(
        'anchorProof.signedClaim.signatures length:',
        anchorProof.signedClaim.signatures.length,
      )

      // Create program instance with programId explicitly
      // https://www.anchor-lang.com/docs/clients/typescript
      console.log('=== Creating Program Instance ===')
      console.log('Connection endpoint:', connection.rpcEndpoint)
      console.log('ZK_ESCROW_PROGRAM_ID:', ZK_ESCROW_PROGRAM_ID.toBase58())

      // Create provider for wallet operations
      const provider = new AnchorProvider(connection, anchorWallet, {})

      const program = new Program<ZkEscrowSol>(
        zkEscrowIdlJson as ZkEscrowSol,
        ZK_ESCROW_PROGRAM_ID,
        { connection },
      )
      console.log('=== Program Created ===')
      console.log('Program ID:', program.programId.toBase58())

      // Step 1: Verify Proof
      console.log('=== Step 1: Verifying Proof ===')

      const [verificationResultPda] = findVerificationResultPda(
        anchorWallet.publicKey,
      )
      console.log('Verification Result PDA:', verificationResultPda.toBase58())

      console.log('Calling verifyProof with:')
      console.log('- anchorProof:', JSON.stringify(anchorProof, null, 2))
      console.log('- expectedWitnesses:', [ADMIN_ADDRESS])
      console.log('- requiredThreshold:', 1)

      const verifyTx = await program.methods
        .verifyProof(anchorProof, [ADMIN_ADDRESS], 1)
        .accounts({
          signer: anchorWallet.publicKey,
          verificationResult: verificationResultPda,
          systemProgram: SystemProgram.programId,
        })
        .transaction()

      // Add compute budget
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400_000,
      })
      verifyTx.add(modifyComputeUnits)

      const verifySignature = await sendTransaction(verifyTx, connection)
      await connection.confirmTransaction(verifySignature, 'confirmed')

      console.log('Proof verified:', verifySignature)

      // Step 2: Mint NFT
      console.log('Step 2: Minting NFT...')

      const mintKeypair = Keypair.generate()
      const [collectionStatePda] = findCollectionStatePda(COLLECTION_MINT)
      const [mintAuthorityPda] = findMintAuthorityPda()

      // Get destination token account
      const destination = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        anchorWallet.publicKey,
      )

      // Get metadata and master edition PDAs
      const [metadata] = findMetadataPda(mintKeypair.publicKey)
      const [masterEdition] = findMasterEditionPda(mintKeypair.publicKey)

      // Get collection metadata and master edition
      const [collectionMetadata] = findMetadataPda(COLLECTION_MINT)
      const [collectionMasterEdition] = findMasterEditionPda(COLLECTION_MINT)

      const mintTx = await program.methods
        .mintWithVerifiedProof()
        .accounts({
          signer: anchorWallet.publicKey,
          verificationResult: verificationResultPda,
          mint: mintKeypair.publicKey,
          destination,
          metadata,
          masterEdition,
          mintAuthority: mintAuthorityPda,
          collectionMint: COLLECTION_MINT,
          collectionState: collectionStatePda,
          collectionMetadata,
          collectionMasterEdition,
          sysvarInstruction: SYSVAR_INSTRUCTIONS_PUBKEY,
          splNftProgram: SPL_NFT_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .transaction()

      // Add compute budget for collection verification
      mintTx.add(modifyComputeUnits)

      const mintSignature = await sendTransaction(mintTx, connection, {
        signers: [mintKeypair],
      })
      await connection.confirmTransaction(mintSignature, 'confirmed')

      console.log('NFT minted:', mintSignature)
      console.log('Mint address:', mintKeypair.publicKey.toBase58())

      setMintAddress(mintKeypair.publicKey.toBase58())
      setSuccess(true)

      // Call onSuccess callback after a short delay
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err: unknown) {
      console.error('Minting error:', err)
      setError(err instanceof Error ? err.message : 'NFT 민팅에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  if (success && mintAddress) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-green-800">
            NFT 민팅 성공!
          </h2>
          <p className="text-gray-600">
            축하합니다! NFT가 성공적으로 민팅되었습니다.
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-semibold text-green-800">
            NFT Mint Address:
          </p>
          <p className="break-all font-mono text-xs text-green-700">
            {mintAddress}
          </p>
        </div>

        <a
          href={`https://explorer.solana.com/address/${mintAddress}?cluster=localnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-full bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700">
          Explorer에서 보기
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">NFT 민팅</h2>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="font-semibold">민팅 준비 완료</h3>
        <p className="text-sm text-gray-600">
          Proof 검증이 완료되었습니다. 이제 NFT를 민팅할 수 있습니다.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 트랜잭션 1: Proof 검증 (verifyProof)</p>
          <p>• 트랜잭션 2: NFT 민팅 (mintWithVerifiedProof)</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">오류 발생</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleMint}
        disabled={isLoading}
        className="w-full rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? 'NFT 민팅 중...' : 'NFT 민팅하기'}
      </button>
    </div>
  )
}
