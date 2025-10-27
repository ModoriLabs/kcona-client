import { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export type NftMetadata = {
  mint: string
  name: string
  symbol: string
  uri: string
  image?: string
}

export function useNfts() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [nfts, setNfts] = useState<NftMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNfts = async () => {
    if (!publicKey) {
      setNfts([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get all token accounts owned by the user
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
      )

      // Filter NFTs (amount = 1, decimals = 0)
      const nftAccounts = tokenAccounts.value.filter((account) => {
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount
        const decimals = account.account.data.parsed.info.tokenAmount.decimals
        return amount === 1 && decimals === 0
      })

      // Fetch metadata for each NFT
      const nftMetadataPromises = nftAccounts.map(async (account) => {
        const mintAddress = account.account.data.parsed.info.mint

        try {
          // Get metadata account (Metaplex standard)
          const [metadataPda] = PublicKey.findProgramAddressSync(
            [
              Buffer.from('metadata'),
              new PublicKey(
                'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
              ).toBuffer(),
              new PublicKey(mintAddress).toBuffer(),
            ],
            new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
          )

          const metadataAccount = await connection.getAccountInfo(metadataPda)

          if (metadataAccount) {
            // Parse metadata (simplified - in production, use Metaplex SDK)
            const metadata: NftMetadata = {
              mint: mintAddress,
              name: `NFT ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
              symbol: 'NFT',
              uri: '',
            }

            return metadata
          }
        } catch (err) {
          console.error('Error fetching metadata for', mintAddress, err)
        }

        return {
          mint: mintAddress,
          name: `NFT ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
          symbol: 'NFT',
          uri: '',
        }
      })

      const nftMetadata = await Promise.all(nftMetadataPromises)
      setNfts(nftMetadata.filter((nft) => nft !== null) as NftMetadata[])
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('NFT 목록을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNfts()
  }, [publicKey, connection]) // eslint-disable-line react-hooks/exhaustive-deps

  return { nfts, isLoading, error, refetch: fetchNfts }
}
