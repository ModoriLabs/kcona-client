import { ProofResult } from 'src/components/step/Proof'
import { BN } from '@coral-xyz/anchor'

/**
 * Anchor-compatible Proof structure
 * Matches the Proof type from zk_escrow_sol program
 */
export type AnchorProof = {
  claimInfo: {
    provider: string
    parameters: string
    context: string
  }
  signedClaim: {
    claim: {
      identifier: string
      owner: string
      timestampS: BN
      epoch: BN
    }
    signatures: Buffer[]
  }
}

/**
 * Convert ProofResult from API to Anchor-compatible Proof structure
 */
export function convertProofToAnchor(proofResult: ProofResult): AnchorProof {
  if (!proofResult.data) {
    throw new Error('Proof data is missing')
  }

  const { receipt } = proofResult.data
  console.log('receipt', receipt)

  // Debug: Log the raw claim data
  console.log('=== Raw Claim Data ===')
  console.log(
    'timestampS:',
    receipt.claim.timestampS,
    typeof receipt.claim.timestampS,
  )
  console.log('epoch:', receipt.claim.epoch, typeof receipt.claim.epoch)
  console.log('Full claim:', JSON.stringify(receipt.claim, null, 2))

  // Validate numeric fields
  if (
    receipt.claim.timestampS === undefined ||
    receipt.claim.timestampS === null
  ) {
    throw new Error('timestampS is missing from claim data')
  }
  if (receipt.claim.epoch === undefined || receipt.claim.epoch === null) {
    throw new Error('epoch is missing from claim data')
  }

  // Convert claimSignature from Buffer objects to Buffer (required by Anchor)
  const signatures: Buffer[] = []

  if (receipt.signatures.claimSignature) {
    const claimSig = Buffer.from(receipt.signatures.claimSignature.data)
    console.log('claimSignature length:', claimSig.length)
    if (claimSig.length !== 65) {
      throw new Error(`claimSignature must be 65 bytes, got ${claimSig.length}`)
    }
    signatures.push(claimSig)
  }

  // Convert to BN with explicit type checking
  let timestampBN: BN
  let epochBN: BN

  try {
    timestampBN = new BN(receipt.claim.timestampS)
    console.log('timestampBN created:', timestampBN.toString())
  } catch (error) {
    console.error('Error creating timestampBN:', error)
    throw new Error(
      `Failed to convert timestampS to BN: ${receipt.claim.timestampS}`,
    )
  }

  try {
    epochBN = new BN(receipt.claim.epoch)
    console.log('epochBN created:', epochBN.toString())
  } catch (error) {
    console.error('Error creating epochBN:', error)
    throw new Error(`Failed to convert epoch to BN: ${receipt.claim.epoch}`)
  }

  const anchorProof = {
    claimInfo: {
      provider: proofResult.data.provider,
      // parameters: receipt.claim.parameters,
      // !NOTE: parameters is not used in the program
      parameters: '',
      context: receipt.claim.context,
    },
    signedClaim: {
      claim: {
        identifier: receipt.claim.identifier,
        owner: receipt.claim.owner,
        timestampS: timestampBN,
        epoch: epochBN,
      },
      signatures,
    },
  }

  console.log('Converted to Anchor format:', {
    provider: anchorProof.claimInfo.provider,
    identifier: anchorProof.signedClaim.claim.identifier,
    owner: anchorProof.signedClaim.claim.owner,
    timestampS: anchorProof.signedClaim.claim.timestampS.toString(),
    epoch: anchorProof.signedClaim.claim.epoch.toString(),
    signaturesCount: anchorProof.signedClaim.signatures.length,
  })

  return anchorProof
}
