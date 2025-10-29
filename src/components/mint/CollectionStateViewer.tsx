'use client'

import { useState } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { Program } from '@coral-xyz/anchor'
import { useZkEscrowProgram } from 'src/hooks/useZkEscrowProgram'
import { COLLECTION_MINT, getCollectionState } from 'src/constants'
import splNftIdl from 'src/lib/idl/spl_nft.json'
import { SplNft } from 'src/lib/types/spl_nft'

interface CollectionState {
  collectionMint: string
  name: string
  symbol: string
  uriPrefix: string
  counter: number
  price: number
}

export function CollectionStateViewer() {
  const { connection } = useConnection()
  const { program, isReady } = useZkEscrowProgram()
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState<CollectionState | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleFetchState = async () => {
    if (!COLLECTION_MINT) {
      toast.error('Collection Not Configured', {
        description: 'NEXT_PUBLIC_COLLECTION_MINT is not set in .env',
      })
      return
    }

    try {
      setIsLoading(true)
      setState(null)
      setNotFound(false)

      // Create SPL NFT program instance
      const nftProgram = new Program<SplNft>(splNftIdl, {
        connection,
      })

      // Get collection state PDA
      const collectionStatePda = await getCollectionState(COLLECTION_MINT)
      console.log(
        'Fetching Collection State PDA:',
        collectionStatePda.toBase58(),
      )
      console.log('Collection Mint:', COLLECTION_MINT.toBase58())

      // Fetch account data
      const accountInfo =
        await nftProgram.account.collectionState.fetch(collectionStatePda)

      console.log('Collection State:', accountInfo)

      // Convert to display format
      const stateData: CollectionState = {
        collectionMint: accountInfo.collectionMint.toBase58(),
        name: accountInfo.name,
        symbol: accountInfo.symbol,
        uriPrefix: accountInfo.uriPrefix,
        counter: accountInfo.counter.toNumber(),
        price: accountInfo.price.toNumber(),
      }

      setState(stateData)
      toast.success('Collection State Loaded', {
        description: `${stateData.name} (${stateData.symbol})`,
      })
    } catch (err) {
      console.error('Error fetching collection state:', err)

      // Check if account doesn't exist
      if (
        err instanceof Error &&
        err.message.includes('Account does not exist')
      ) {
        setNotFound(true)
        toast.error('Collection Not Initialized', {
          description: 'Run "yarn init-collection" in solana project',
          duration: 8000,
        })
      } else {
        toast.error('Failed to Fetch Collection', {
          description: err instanceof Error ? err.message : String(err),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Fetch Button */}
      <button
        onClick={handleFetchState}
        disabled={isLoading || !COLLECTION_MINT}
        className="h-10 w-full rounded-lg border-2 border-purple-600 bg-white text-sm font-medium text-purple-600 transition-all hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-purple-600/30 border-t-purple-600"></div>
            <span>Loading...</span>
          </div>
        ) : (
          '🎨 Check Collection State'
        )}
      </button>

      {/* Collection Mint Info */}
      {COLLECTION_MINT && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="mb-1 text-xs font-medium text-gray-600">
            Collection Mint:
          </p>
          <p className="break-all font-mono text-xs text-gray-700">
            {COLLECTION_MINT.toBase58()}
          </p>
        </div>
      )}

      {/* {state && <CollectionState state={state} />} */}

      {/* Not Found Message */}
      {notFound && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl">❌</span>
            <h4 className="font-semibold text-red-800">
              Collection Not Initialized
            </h4>
          </div>
          <p className="mb-2 text-sm text-red-700">
            The collection needs to be initialized first.
          </p>
          <div className="rounded bg-red-100 p-2">
            <p className="mb-1 font-mono text-xs text-red-800">
              Run in terminal:
            </p>
            <code className="block font-mono text-xs text-red-900">
              cd solana/zk-escrow-sol
              <br />
              yarn init-collection
            </code>
          </div>
        </div>
      )}

      {/* Not Configured Message */}
      {!COLLECTION_MINT && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center">
          <p className="text-sm text-yellow-800">
            ⚠️ Collection mint not configured
          </p>
          <p className="mt-1 text-xs text-yellow-700">
            Set NEXT_PUBLIC_COLLECTION_MINT in .env
          </p>
        </div>
      )}
    </div>
  )
}

const CollectionState = ({ state }: { state: CollectionState }) => {
  return (
    <div className="space-y-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">✅</span>
        <h3 className="font-semibold text-purple-800">
          Collection Initialized
        </h3>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <p className="font-medium text-purple-700">Collection Mint:</p>
          <p className="break-all font-mono text-xs text-purple-600">
            {state.collectionMint}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-medium text-purple-700">Name:</p>
            <p className="text-xs text-purple-600">{state.name}</p>
          </div>

          <div>
            <p className="font-medium text-purple-700">Symbol:</p>
            <p className="text-xs text-purple-600">{state.symbol}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-purple-700">URI Prefix:</p>
          <p className="break-all font-mono text-xs text-purple-600">
            {state.uriPrefix}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-medium text-purple-700">NFTs Minted:</p>
            <p className="text-xs text-purple-600">{state.counter}</p>
          </div>

          <div>
            <p className="font-medium text-purple-700">Price (lamports):</p>
            <p className="text-xs text-purple-600">
              {state.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
