import { Metaplex } from '@metaplex-foundation/js'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SOLANA_RPC_ENDPOINT } from '../constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNFTsWithMetadata = async (publicKey: PublicKey) => {
  const connection = new Connection(SOLANA_RPC_ENDPOINT)
  const metaplex = Metaplex.make(connection)

  // 1. basic filter (amount=1, decimals=0)
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    { programId: TOKEN_PROGRAM_ID },
  )

  const potentialNFTs = tokenAccounts.value.filter((account) => {
    const data = account.account.data.parsed.info
    const tokenAmount = data.tokenAmount
    return tokenAmount.decimals === 0 && tokenAmount.uiAmount === 1
  })

  // 2. check if Metaplex metadata exists
  const nftsWithMetadata = []

  for (const account of potentialNFTs) {
    const mintAddress = new PublicKey(account.account.data.parsed.info.mint)

    try {
      // try to get Metaplex metadata
      const nft = await metaplex.nfts().findByMint({ mintAddress })
      nftsWithMetadata.push({
        mint: mintAddress.toBase58(),
        name: nft.name,
        uri: nft.uri,
        metadata: nft,
      })
    } catch (err) {
      // if metadata doesn't exist, it's not an NFT (regular token)
      console.log(`Not an NFT: ${mintAddress.toBase58()}`)
    }
  }

  return nftsWithMetadata
}

export const abbreviateTransferMemo = (transferMemo: string) => {
  // sol:3vFnCkXRFzcDDjbn9A7HVjgxtijbcSAzE3845vmV6jac
  const [, address] = transferMemo.split(':')
  return address ? `sol:${address.slice(0, 3)}...${address.slice(-3)}` : ''
}
