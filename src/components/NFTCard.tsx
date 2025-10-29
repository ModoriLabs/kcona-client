'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { Badge } from './ui/badge'
import { useNfts, NftWithMetadata } from 'src/hooks/useNfts'
import { isLocalnet, SOLANA_CLUSTER } from 'src/constants'

type NftMetadata = {
  name: string
  description: string
  image: string
  symbol: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

function NFTCard({ nft }: { nft: NftWithMetadata }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setImageLoading(true)
        setImageError(false)

        const response = await fetch(nft.metadata.uri)
        if (!response.ok) {
          throw new Error('Failed to fetch metadata')
        }

        const metadata: NftMetadata = await response.json()
        setImageUrl(metadata.image)
      } catch (err) {
        console.error('Error fetching NFT metadata:', err)
        setImageError(true)
      } finally {
        setImageLoading(false)
      }
    }

    fetchMetadata()
  }, [nft.metadata.uri])

  const explorerUrl = isLocalnet
    ? 'http://localhost:8899'
    : `https://explorer.solana.com/address/${nft.mint}?cluster=${SOLANA_CLUSTER}`

  return (
    <div className="group overflow-hidden rounded-lg border border-primary/20 bg-card/50 shadow-sm backdrop-blur transition-all hover:border-primary/50 hover:shadow-md">
      {/* NFT Image */}
      <div
        className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10"
        style={{ aspectRatio: '7/11' }}>
        {imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
              <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : imageError || !imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl">🖼️</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Image unavailable
              </p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={imageUrl}
              alt={nft.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </>
        )}
      </div>

      {/* NFT Info */}
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold">{nft.name}</h3>
        <Badge
          variant="secondary"
          className="bg-primary/20 text-primary border-primary/30">
          {nft.metadata.symbol}
        </Badge>

        {/* Mint Address */}
        <div className="rounded bg-muted/30 p-2">
          <p className="text-xs text-muted-foreground">Mint Address</p>
          <p className="break-all font-mono text-xs">
            {nft.mint.slice(0, 4)}...{nft.mint.slice(-4)}
          </p>
        </div>

        {/* Explorer Link */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
          View in Explorer
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

export default NFTCard
