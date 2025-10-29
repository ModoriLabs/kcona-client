'use client'

import { useState, useEffect } from 'react'
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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* NFT Image */}
      <div
        className="relative w-full bg-gradient-to-br from-blue-100 to-purple-100"
        style={{ aspectRatio: '7/11' }}>
        {imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-xs text-gray-500">Loading...</p>
            </div>
          </div>
        ) : imageError || !imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl">🖼️</div>
              <p className="mt-2 text-xs text-gray-500">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={nft.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <h3 className="mb-2 font-semibold">{nft.name}</h3>
        <p className="mb-3 text-xs text-gray-500">
          Symbol: {nft.metadata.symbol}
        </p>

        {/* Mint Address */}
        <div className="mb-3 rounded bg-gray-50 p-2">
          <p className="text-xs text-gray-500">Mint Address</p>
          <p className="break-all font-mono text-xs text-gray-700">
            {nft.mint}
          </p>
        </div>

        {/* Explorer Link */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Explorer에서 보기
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default NFTCard
