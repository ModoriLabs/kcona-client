'use client'

import { useState, useEffect } from 'react'
import { useNfts, NftWithMetadata } from 'src/hooks/useNfts'
import { isLocalnet, SOLANA_CLUSTER } from 'src/constants'
import NFTCard from './NFTCard'

export function Gallery() {
  const { nfts, isLoading, error, refetch } = useNfts()
  const nftsWithoutCollection = nfts.filter(
    (nft) => !nft.metadata.uri.includes('collection'),
  )

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

  if (nftsWithoutCollection.length === 0) {
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

  const explorerUrl = isLocalnet
    ? 'http://localhost:8899'
    : `https://explorer.solana.com/address`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">내 NFT 컬렉션</h2>
        <button
          onClick={refetch}
          className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200">
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nftsWithoutCollection.map((nft) => (
          <NFTCard key={nft.mint} nft={nft} />
        ))}
      </div>

      {nftsWithoutCollection.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          총 {nftsWithoutCollection.length}개의 NFT
        </div>
      )}
    </div>
  )
}
