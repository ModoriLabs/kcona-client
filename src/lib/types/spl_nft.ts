/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spl_nft.json`.
 */
export type SplNft = {
  address: '2BrzdsjAbsuvHFcJZswEq6YBNBzuzy2AEXpMR6FLrwck'
  metadata: {
    name: 'splNft'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'createCollection'
      discriminator: [156, 251, 92, 54, 233, 2, 16, 82]
      accounts: [
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'mint'
          writable: true
          signer: true
        },
        {
          name: 'collectionState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'mint'
              },
            ]
          }
        },
        {
          name: 'mintAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121]
              },
            ]
          }
        },
        {
          name: 'metadata'
          writable: true
        },
        {
          name: 'masterEdition'
          writable: true
        },
        {
          name: 'destination'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'user'
              },
              {
                kind: 'const'
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ]
              },
              {
                kind: 'account'
                path: 'mint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'tokenMetadataProgram'
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        },
      ]
      args: [
        {
          name: 'name'
          type: 'string'
        },
        {
          name: 'symbol'
          type: 'string'
        },
        {
          name: 'collectionUri'
          type: 'string'
        },
        {
          name: 'uriPrefix'
          type: 'string'
        },
        {
          name: 'price'
          type: 'u64'
        },
      ]
    },
    {
      name: 'mintNft'
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'mint'
          writable: true
          signer: true
        },
        {
          name: 'destination'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'const'
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ]
              },
              {
                kind: 'account'
                path: 'mint'
              },
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ]
            }
          }
        },
        {
          name: 'metadata'
          writable: true
        },
        {
          name: 'masterEdition'
          writable: true
        },
        {
          name: 'mintAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121]
              },
            ]
          }
        },
        {
          name: 'collectionMint'
          writable: true
        },
        {
          name: 'collectionState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                ]
              },
              {
                kind: 'account'
                path: 'collectionMint'
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'tokenMetadataProgram'
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        },
      ]
      args: []
    },
    {
      name: 'verifyCollection'
      discriminator: [56, 113, 101, 253, 79, 55, 122, 169]
      accounts: [
        {
          name: 'authority'
          signer: true
        },
        {
          name: 'metadata'
          writable: true
        },
        {
          name: 'mint'
        },
        {
          name: 'mintAuthority'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121]
              },
            ]
          }
        },
        {
          name: 'collectionMint'
        },
        {
          name: 'collectionMetadata'
          writable: true
        },
        {
          name: 'collectionMasterEdition'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'sysvarInstruction'
          address: 'Sysvar1nstructions1111111111111111111111111'
        },
        {
          name: 'tokenMetadataProgram'
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'collectionState'
      discriminator: [228, 135, 148, 4, 244, 41, 118, 165]
    },
  ]
  types: [
    {
      name: 'collectionState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'collectionMint'
            type: 'pubkey'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'symbol'
            type: 'string'
          },
          {
            name: 'uriPrefix'
            type: 'string'
          },
          {
            name: 'collectionUri'
            type: 'string'
          },
          {
            name: 'counter'
            type: 'u64'
          },
          {
            name: 'price'
            type: 'u64'
          },
        ]
      }
    },
  ]
}
