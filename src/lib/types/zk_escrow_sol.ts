/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/zk_escrow_sol.json`.
 */
export type ZkEscrowSol = {
  address: '3EgB44qFrL2gZhi24oiw6kqV6YTdg1i8hdG9nNxHLUzK'
  metadata: {
    name: 'zkEscrowSol'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'ZK Escrow Solana Program'
  }
  instructions: [
    {
      name: 'initialize'
      docs: [
        'Initialize ZK verification program with payment validation config',
        'This creates the payment config PDA with expected payment details',
      ]
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'paymentConfig'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'recipientBankAccount'
          type: 'string'
        },
        {
          name: 'allowedAmount'
          type: 'u64'
        },
        {
          name: 'fiatCurrency'
          type: 'string'
        },
      ]
    },
    {
      name: 'mintWithVerifiedProof'
      docs: [
        'Two-Transaction Pattern: Step 2 - Mint NFT using verified proof result',
        'This transaction is small because it only checks PDA (no large proof data)',
        'The verification result PDA is reusable - can verify new proof and mint again',
      ]
      discriminator: [232, 160, 147, 32, 63, 0, 35, 226]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'verificationResult'
          docs: ['Verification result PDA (reusable for multiple mints)']
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  118,
                  101,
                  114,
                  105,
                  102,
                  105,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110,
                ]
              },
              {
                kind: 'account'
                path: 'signer'
              },
            ]
          }
        },
        {
          name: 'mint'
          docs: ['New NFT mint']
          writable: true
          signer: true
        },
        {
          name: 'destination'
          writable: true
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
        },
        {
          name: 'collectionMint'
          docs: ['Collection mint']
          writable: true
        },
        {
          name: 'collectionState'
          docs: ['Collection state (price 정보 포함)']
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
            program: {
              kind: 'account'
              path: 'splNftProgram'
            }
          }
        },
        {
          name: 'collectionMetadata'
          docs: ['Collection metadata (Metaplex)']
          writable: true
        },
        {
          name: 'collectionMasterEdition'
          docs: ['Collection master edition']
        },
        {
          name: 'sysvarInstruction'
          docs: ['Sysvar instruction account']
          address: 'Sysvar1nstructions1111111111111111111111111'
        },
        {
          name: 'splNftProgram'
          address: '2BrzdsjAbsuvHFcJZswEq6YBNBzuzy2AEXpMR6FLrwck'
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
        },
      ]
      args: []
    },
    {
      name: 'verifyProof'
      docs: [
        'Two-Transaction Pattern: Step 1 - Verify proof and store result in PDA',
        'This separates large proof verification from NFT minting to solve transaction size issues',
        'Each unique claim_identifier gets its own PDA, allowing multiple verifications per user',
      ]
      discriminator: [217, 211, 191, 110, 144, 13, 186, 98]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'verificationResult'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  118,
                  101,
                  114,
                  105,
                  102,
                  105,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110,
                ]
              },
              {
                kind: 'account'
                path: 'signer'
              },
            ]
          }
        },
        {
          name: 'paymentConfig'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ]
              },
            ]
          }
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'proof'
          type: {
            defined: {
              name: 'proof'
            }
          }
        },
        {
          name: 'expectedWitnesses'
          type: {
            vec: 'string'
          }
        },
        {
          name: 'requiredThreshold'
          type: 'u8'
        },
      ]
    },
    {
      name: 'verifyProofOnly'
      docs: ['This exposes the internal proof verification logic']
      discriminator: [91, 4, 171, 117, 80, 113, 185, 40]
      accounts: [
        {
          name: 'signer'
          signer: true
        },
      ]
      args: [
        {
          name: 'proof'
          type: {
            defined: {
              name: 'proof'
            }
          }
        },
        {
          name: 'expectedWitnesses'
          type: {
            vec: 'string'
          }
        },
        {
          name: 'requiredThreshold'
          type: 'u8'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'collectionState'
      discriminator: [228, 135, 148, 4, 244, 41, 118, 165]
    },
    {
      name: 'paymentConfig'
      discriminator: [252, 166, 185, 239, 186, 79, 212, 152]
    },
    {
      name: 'verificationResult'
      discriminator: [104, 111, 80, 172, 219, 191, 162, 38]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'invalidThreshold'
      msg: 'Invalid threshold'
    },
    {
      code: 6001
      name: 'invalidSignature'
      msg: 'Invalid signature format'
    },
    {
      code: 6002
      name: 'invalidRecoveryId'
      msg: 'Invalid recovery ID (must be 0 or 1)'
    },
    {
      code: 6003
      name: 'recoveryFailed'
      msg: 'Failed to recover signer address'
    },
    {
      code: 6004
      name: 'addressMismatch'
      msg: 'Recovered address does not match expected address'
    },
    {
      code: 6005
      name: 'identifierMismatch'
      msg: 'Claim identifier does not match expected value'
    },
    {
      code: 6006
      name: 'invalidHex'
      msg: 'Failed to decode hex string'
    },
    {
      code: 6007
      name: 'invalidBankAccount'
      msg: 'Invalid bank account'
    },
    {
      code: 6008
      name: 'invalidAmount'
      msg: 'Amount must be greater than zero'
    },
    {
      code: 6009
      name: 'invalidCurrency'
      msg: 'Invalid currency - only KRW supported'
    },
    {
      code: 6010
      name: 'recipientMismatch'
      msg: 'Recipient bank account mismatch'
    },
    {
      code: 6011
      name: 'amountMismatch'
      msg: 'Payment amount mismatch'
    },
    {
      code: 6012
      name: 'unauthorizedUser'
      msg: 'Unauthorized: user does not own this verification result'
    },
    {
      code: 6013
      name: 'alreadyUsed'
      msg: 'Verification result has already been used'
    },
    {
      code: 6014
      name: 'verificationExpired'
      msg: 'Verification has expired (older than 5 minutes)'
    },
    {
      code: 6015
      name: 'nullifierAlreadyUsed'
      msg: 'Nullifier has already been used (replay attack prevented)'
    },
  ]
  types: [
    {
      name: 'claimDataInput'
      docs: ['Complete claim data with identifier, owner, timestamp, and epoch']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'identifier'
            type: 'string'
          },
          {
            name: 'owner'
            type: 'string'
          },
          {
            name: 'timestampS'
            type: 'u32'
          },
          {
            name: 'epoch'
            type: 'u32'
          },
        ]
      }
    },
    {
      name: 'claimInfo'
      docs: ['Claim information containing provider, parameters, and context']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'provider'
            type: 'string'
          },
          {
            name: 'parameters'
            type: 'string'
          },
          {
            name: 'context'
            type: 'string'
          },
        ]
      }
    },
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
    {
      name: 'paymentConfig'
      docs: ['Payment validation configuration']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'recipientBankAccount'
            type: 'string'
          },
          {
            name: 'allowedAmount'
            type: 'u64'
          },
          {
            name: 'fiatCurrency'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'proof'
      docs: ['Complete proof structure (zk-escrow compatible)']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'claimInfo'
            type: {
              defined: {
                name: 'claimInfo'
              }
            }
          },
          {
            name: 'signedClaim'
            type: {
              defined: {
                name: 'signedClaim'
              }
            }
          },
        ]
      }
    },
    {
      name: 'signedClaim'
      docs: ['Signed claim containing claim data and signatures']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'claim'
            type: {
              defined: {
                name: 'claimDataInput'
              }
            }
          },
          {
            name: 'signatures'
            type: {
              vec: 'bytes'
            }
          },
        ]
      }
    },
    {
      name: 'verificationResult'
      docs: [
        'Verification result stored in PDA after successful proof verification',
        'This allows splitting large proof verification from NFT minting',
      ]
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'user'
            docs: ['User who verified the proof']
            type: 'pubkey'
          },
          {
            name: 'verifiedAt'
            docs: ['Timestamp when verification was completed']
            type: 'i64'
          },
          {
            name: 'claimIdentifier'
            docs: ['Claim identifier from the verified proof']
            type: 'string'
          },
          {
            name: 'isUsed'
            docs: ['Whether this verification has been used for minting']
            type: 'bool'
          },
        ]
      }
    },
  ]
}
