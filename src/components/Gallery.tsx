'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
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
          <p className="text-muted-foreground">Loading NFTs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="mb-4 text-destructive">{error}</p>
          <button
            onClick={() => refetch()}
            className="cursor-pointer rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2 text-primary-foreground transition-all hover:opacity-90">
            Retry
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
          <h3 className="mb-2 text-xl font-semibold">No NFTs</h3>
          <p className="text-muted-foreground">
            Send KRW and generate the proof to mint your first NFT!
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold">My NFTs</h2>
          <p className="text-muted-foreground">
            Total {nftsWithoutCollection.length + (pendingMintAddress ? 1 : 0)}
            NFTs
          </p>
        </div>
        <button
          onClick={() => refetch({ background: false })}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm font-medium transition-all hover:bg-card backdrop-blur-sm">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

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
    </div>
  )
}

interface PendingNFTCardProps {
  mintAddress: string
}

function PendingNFTCard({ mintAddress }: PendingNFTCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-primary/20 bg-card/50 shadow-sm backdrop-blur transition-all hover:border-primary/50">
      {/* Loading Image Area */}
      <div
        className="relative w-full animate-pulse bg-gradient-to-br from-primary/20 to-secondary/20"
        style={{ aspectRatio: '7/11' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Minting Your Star...
            </p>
          </div>
        </div>
      </div>

      {/* Loading Info */}
      <div className="p-4 space-y-2">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted/50"></div>
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-muted/30"></div>

        {/* Mint Address */}
        <div className="mb-3 rounded bg-muted/30 p-2">
          <p className="text-xs text-muted-foreground">Mint Address</p>
          <p className="break-all font-mono text-xs">{mintAddress}</p>
        </div>

        {/* Loading Button */}
        <div className="h-10 w-full animate-pulse rounded-full bg-muted/50"></div>
      </div>
    </div>
  )
}
