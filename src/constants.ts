import { PublicKey, clusterApiUrl } from '@solana/web3.js'

// =============================================================================
// Solana Network Configuration
// =============================================================================

export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet'

export const SOLANA_CLUSTER =
  (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as SolanaCluster) || 'localnet'

export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ||
  (SOLANA_CLUSTER === 'localnet'
    ? 'http://localhost:8899'
    : clusterApiUrl(SOLANA_CLUSTER as 'devnet' | 'testnet' | 'mainnet-beta'))

export const isLocalnet = SOLANA_CLUSTER === 'localnet'
export const isDevnet = SOLANA_CLUSTER === 'devnet'
export const isMainnet = SOLANA_CLUSTER === 'mainnet-beta'

// =============================================================================
// Solana Program IDs
// =============================================================================

// ZK Escrow Program - Main verification and minting logic
export const ZK_ESCROW_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ZK_ESCROW_PROGRAM_ID ||
    '944j5oBiD7kTvS2j2hYow4oq5MFLbPXaGF7ZHUG2Fpbu',
)

// SPL NFT Program - NFT collection and minting
export const SPL_NFT_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SPL_NFT_PROGRAM_ID ||
    '99hrQQHRwNoEFaaDyE8NoVmXykFTuPuhEgUYfq8J6dr1',
)

// Nullifier Registry Program - Prevent proof replay
export const NULLIFIER_REGISTRY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_NULLIFIER_REGISTRY_PROGRAM_ID ||
    'J3tkLEXB6vvj9wKDbsKFcUiCma82Hw5iV2qTjvNGsofh',
)

// Metaplex Token Metadata Program (Standard)
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_TOKEN_METADATA_PROGRAM_ID ||
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

// =============================================================================
// NFT Collection Configuration
// =============================================================================

// Collection Mint Address (must be set after creating collection)
const collectionMintEnv = process.env.NEXT_PUBLIC_COLLECTION_MINT
export const COLLECTION_MINT = collectionMintEnv
  ? new PublicKey(collectionMintEnv)
  : null

// Validate collection mint is set in production
if (isMainnet && !COLLECTION_MINT) {
  console.warn('⚠️ COLLECTION_MINT is not set in production environment')
}

// =============================================================================
// PDA Seeds (Program Derived Address Seeds)
// =============================================================================

export const SEEDS = {
  // ZK Escrow Program Seeds
  PAYMENT_CONFIG: 'payment_config',
  VERIFICATION: 'verification',

  // SPL NFT Program Seeds
  COLLECTION_STATE: 'collection_state',
  MINT_AUTHORITY: 'authority',

  // Metaplex Seeds
  METADATA: 'metadata',
  EDITION: 'edition',
} as const

// =============================================================================
// Attestor & Payment Configuration
// =============================================================================

// Attestor Core Backend URL (ZK Proof generation service)
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://attestor-core-production-5795.up.railway.app'

// Toss Bank Account Number for KRW deposits
const TOSS_ACCOUNT_NUMBER_PROD = '100202642943' // production
const TOSS_ACCOUNT_NUMBER_TEST = '100202642943' // test/devnet
const TOSS_ACCOUNT_NUMBER_LOCAL = '100000021389' // local

export const TOSS_ACCOUNT_NUMBER =
  process.env.NEXT_PUBLIC_TOSS_ACCOUNT_NUMBER ||
  (isMainnet
    ? TOSS_ACCOUNT_NUMBER_PROD
    : isDevnet
      ? TOSS_ACCOUNT_NUMBER_TEST
      : TOSS_ACCOUNT_NUMBER_LOCAL)

// Admin Address for Ethereum signature verification (witness address)
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || ''

if (!ADMIN_ADDRESS) {
  console.warn('⚠️ ADMIN_ADDRESS is not set - proof verification will fail')
}

// =============================================================================
// Currency & Token Configuration
// =============================================================================

// =============================================================================
// Toss Bank Deep Link
// =============================================================================

export const TOSS_PLAY =
  'https://play.google.com/store/apps/details?id=viva.republica.toss'
export const TOSS_APPLE = 'https://apps.apple.com/kr/app/id839333328'

export const getTossBankQRCode = (transferAmount: string) =>
  `supertoss://send?amount=${transferAmount}&bank=%ED%86%A0%EC%8A%A4%EB%B1%85%ED%81%AC&accountNo=${TOSS_ACCOUNT_NUMBER}&origin=qr`

// =============================================================================
// Feature Flags
// =============================================================================

export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
export const SKIP_PREFLIGHT = process.env.NEXT_PUBLIC_SKIP_PREFLIGHT === 'true'

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Find Payment Config PDA
 * Seeds: ["payment_config", authority]
 */
export function findPaymentConfigPda(
  authority: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.PAYMENT_CONFIG), authority.toBuffer()],
    ZK_ESCROW_PROGRAM_ID,
  )
}

/**
 * Find Verification Result PDA
 * Seeds: ["verification", user]
 */
export function findVerificationResultPda(
  user: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.VERIFICATION), user.toBuffer()],
    ZK_ESCROW_PROGRAM_ID,
  )
}

/**
 * Find Collection State PDA
 * Seeds: ["collection_state", collection_mint]
 */
export function findCollectionStatePda(
  collectionMint: PublicKey,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.COLLECTION_STATE), collectionMint.toBuffer()],
    SPL_NFT_PROGRAM_ID,
  )
}

/**
 * Find Mint Authority PDA
 * Seeds: ["authority"]
 */
export function findMintAuthorityPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.MINT_AUTHORITY)],
    SPL_NFT_PROGRAM_ID,
  )
}

/**
 * Find Metadata PDA (Metaplex)
 * Seeds: ["metadata", token_metadata_program_id, mint]
 */
export function findMetadataPda(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.METADATA),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  )
}

/**
 * Find Master Edition PDA (Metaplex)
 * Seeds: ["metadata", token_metadata_program_id, mint, "edition"]
 */
export function findMasterEditionPda(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.METADATA),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from(SEEDS.EDITION),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  )
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate all required environment variables are set
 */
export function validateEnvironment(): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!ADMIN_ADDRESS) {
    errors.push('NEXT_PUBLIC_ADMIN_ADDRESS is not set')
  }

  if (isMainnet && !COLLECTION_MINT) {
    errors.push('NEXT_PUBLIC_COLLECTION_MINT is not set for mainnet')
  }

  if (!process.env.NEXT_PUBLIC_ZK_ESCROW_PROGRAM_ID) {
    errors.push('NEXT_PUBLIC_ZK_ESCROW_PROGRAM_ID is not set')
  }

  if (!process.env.NEXT_PUBLIC_SPL_NFT_PROGRAM_ID) {
    errors.push('NEXT_PUBLIC_SPL_NFT_PROGRAM_ID is not set')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Log environment info in development
if (typeof window !== 'undefined' && DEBUG_MODE) {
  console.log('🔧 Solana Configuration:', {
    cluster: SOLANA_CLUSTER,
    rpcEndpoint: SOLANA_RPC_ENDPOINT,
    zkEscrowProgram: ZK_ESCROW_PROGRAM_ID.toBase58(),
    splNftProgram: SPL_NFT_PROGRAM_ID.toBase58(),
    collectionMint: COLLECTION_MINT?.toBase58() || 'Not set',
    adminAddress: ADMIN_ADDRESS || 'Not set',
  })
}
