'use client'

import { useNfts } from 'src/hooks/useNfts'
import { isLocalnet, SOLANA_CLUSTER } from 'src/constants'

export function Gallery() {
  const { nfts, isLoading, error, refetch } = useNfts()
  console.log('nfts', nfts)

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

  if (nfts.length === 0) {
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
        {nfts.map((nft) => (
          <div
            key={nft.mint}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* NFT Image Placeholder */}
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <img
                src={nft.metadata.uri}
                alt={nft.name}
                className="h-full w-full object-cover"
              />
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

              {/* NFT URI */}
              <div className="mb-3 rounded bg-gray-50 p-2">
                <p className="text-xs text-gray-500">URI</p>
                <p className="break-all font-mono text-xs text-gray-700">
                  {nft.metadata.uri}
                </p>
              </div>

              {/* Explorer Link */}
              <a
                href={
                  isLocalnet
                    ? `${explorerUrl}`
                    : `${explorerUrl}/${nft.mint}?cluster=${SOLANA_CLUSTER}`
                }
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
        ))}
      </div>

      {nfts.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          총 {nfts.length}개의 NFT
        </div>
      )}
    </div>
  )
}
