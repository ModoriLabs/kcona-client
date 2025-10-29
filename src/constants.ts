import { PublicKey, clusterApiUrl } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import zkEscrowIdl from 'src/lib/idl/zk_escrow_sol.json'
import nftIdl from 'src/lib/idl/spl_nft.json'
import nullifierRegistryIdl from 'src/lib/idl/nullifier_registry.json'

// =============================================================================
// Solana Network Configuration
// =============================================================================

export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet'

export const DEPLOYER_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || '',
)

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
export const ZK_ESCROW_PROGRAM_ID = new PublicKey(zkEscrowIdl.address)

// SPL NFT Program - NFT collection and minting
export const SPL_NFT_PROGRAM_ID = new PublicKey(nftIdl.address)

// Nullifier Registry Program - Prevent proof replay
export const NULLIFIER_REGISTRY_PROGRAM_ID = new PublicKey(
  nullifierRegistryIdl.address,
)

// TODO: is it works both devnet and mainnet?
export const TOKEN_METADATA_PROGRAM = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

export const COLLECTION_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_COLLECTION_MINT || '',
)
// =============================================================================
// NFT Collection Configuration
// =============================================================================

// Validate collection mint is set in production
if (isMainnet && !TOKEN_METADATA_PROGRAM) {
  console.warn('⚠️ TOKEN_METADATA_PROGRAM is not set in production environment')
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

export const getPaymentConfig = async (): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.PAYMENT_CONFIG), DEPLOYER_ADDRESS.toBuffer()],
    ZK_ESCROW_PROGRAM_ID,
  )[0]
}

/**
 * Find Verification Result PDA
 * Seeds: ["verification", user]
 */
export const getVerificationResult = async (
  user: PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.VERIFICATION), user.toBuffer()],
    ZK_ESCROW_PROGRAM_ID,
  )[0]
}

/**
 * Find Collection State PDA
 * Seeds: ["collection_state", collection_mint]
 */
export const getCollectionState = async (
  collectionMint: PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.COLLECTION_STATE), collectionMint.toBuffer()],
    SPL_NFT_PROGRAM_ID,
  )[0]
}

export const getMintAuthority = async (): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.MINT_AUTHORITY)],
    SPL_NFT_PROGRAM_ID,
  )[0]
}

export const getMetadata = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM,
  )[0]
}

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    TOKEN_METADATA_PROGRAM,
  )[0]
}

// =============================================================================
// Validation
// =============================================================================

// Log environment info in development
if (typeof window !== 'undefined' && DEBUG_MODE) {
  console.log('🔧 Solana Configuration:', {
    cluster: SOLANA_CLUSTER,
    rpcEndpoint: SOLANA_RPC_ENDPOINT,
    zkEscrowProgram: ZK_ESCROW_PROGRAM_ID.toBase58(),
    splNftProgram: SPL_NFT_PROGRAM_ID.toBase58(),
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM.toBase58(),
    adminAddress: ADMIN_ADDRESS || 'Not set',
  })
}
