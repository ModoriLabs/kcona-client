import { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { getNFTsWithMetadata } from 'src/lib/utils'
import { Sft, SftWithToken, Nft, NftWithToken } from '@metaplex-foundation/js'

export type NftWithMetadata = {
  mint: string
  name: string
  uri: string
  metadata: Nft | NftWithToken | Sft | SftWithToken
}

export function useNfts() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [nfts, setNfts] = useState<NftWithMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNfts = async (options?: { background?: boolean }) => {
    if (!publicKey) {
      setNfts([])
      return
    }

    // Only show loading indicator for initial fetch, not background refetch
    if (!options?.background) {
      setIsLoading(true)
    }
    setError(null)

    try {
      const nftsWithMetadata = await getNFTsWithMetadata(publicKey)
      setNfts(nftsWithMetadata)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setError('NFT 목록을 불러오는데 실패했습니다')
    } finally {
      if (!options?.background) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchNfts()
  }, [publicKey, connection]) // eslint-disable-line react-hooks/exhaustive-deps

  return { nfts, isLoading, error, refetch: fetchNfts }
}
