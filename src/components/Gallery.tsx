'use client'

import { useEffect } from 'react'
import { useNfts } from 'src/hooks/useNfts'
import { usePendingMint } from 'src/context/PendingMintContext'
import NFTCard from './NFTCard'

export function Gallery() {
  const { nfts, isLoading, error, refetch } = useNfts()
  const { pendingMintAddress, clearPendingMint } = usePendingMint()
  const nftsWithoutCollection = nfts
    .filter((nft) => !nft.metadata.uri.includes('collection'))
    .sort((a, b) => {
      // https://kcona.s3.ap-northeast-2.amazonaws.com/json/16.json -> 16
      const getIndex = (uri: string) => {
        const match = uri.match(/\/(\d+)(?:\.json)?$/)
        return match ? parseInt(match[1]) : 0
      }
      // Sort descending (higher index first - newest mints)
      return getIndex(b.metadata.uri) - getIndex(a.metadata.uri)
    })

  // Polling for pending NFT
  useEffect(() => {
    if (!pendingMintAddress) return

    // Poll every 2 seconds
    const pollInterval = setInterval(async () => {
      // Use background refetch to avoid loading state
      await refetch({ background: true })

      // Check if the pending NFT is now in the list
      const nftExists = nfts.some((nft) => nft.mint === pendingMintAddress)
      if (nftExists) {
        clearPendingMint()
      }
    }, 2000)

    // Stop polling after 60 seconds
    const timeout = setTimeout(() => {
      clearPendingMint()
    }, 60000)

    return () => {
      clearInterval(pollInterval)
      clearTimeout(timeout)
    }
  }, [pendingMintAddress, nfts, refetch, clearPendingMint])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔄</div>
          <p className="text-gray-600">NFT 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="rounded-full bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (nftsWithoutCollection.length === 0 && !pendingMintAddress) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🖼️</div>
          <h3 className="mb-2 text-xl font-semibold">NFT가 없습니다</h3>
          <p className="text-gray-600">
            KRW 송금 증명을 통해 첫 NFT를 민팅해보세요!
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pending NFT with loading card */}
        {pendingMintAddress && (
          <PendingNFTCard
            key={pendingMintAddress}
            mintAddress={pendingMintAddress}
          />
        )}
        {/* Existing NFTs - exclude pending mint if it exists in the list */}
        {nftsWithoutCollection
          .filter((nft) => nft.mint !== pendingMintAddress)
          .map((nft) => (
            <NFTCard key={nft.mint} nft={nft} />
          ))}
      </div>

      {(nftsWithoutCollection.length > 0 || pendingMintAddress) && (
        <div className="text-center text-sm text-gray-500">
          총 {nftsWithoutCollection.length + (pendingMintAddress ? 1 : 0)}개의
          NFT
          {pendingMintAddress && (
            <span className="ml-2 text-blue-600">(1개 민팅 중)</span>
          )}
        </div>
      )}
    </div>
  )
}

interface PendingNFTCardProps {
  mintAddress: string
}

function PendingNFTCard({ mintAddress }: PendingNFTCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm">
      {/* Loading Image Area */}
      <div
        className="relative w-full animate-pulse bg-gradient-to-br from-blue-100 to-purple-100"
        style={{ aspectRatio: '7/11' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-sm font-medium text-gray-600">
              NFT 민팅 중...
            </p>
          </div>
        </div>
      </div>

      {/* Loading Info */}
      <div className="p-4">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-100"></div>

        {/* Mint Address */}
        <div className="mb-3 rounded bg-gray-50 p-2">
          <p className="text-xs text-gray-500">Mint Address</p>
          <p className="break-all font-mono text-xs text-gray-700">
            {mintAddress}
          </p>
        </div>

        {/* Loading Button */}
        <div className="h-10 w-full animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </div>
  )
}
