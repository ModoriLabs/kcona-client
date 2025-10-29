/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nullifier_registry.json`.
 */
export type NullifierRegistry = {
  address: 'BvHdh8mMnXq9EnhrVD6Q1i1eR4SavuHnxZFXCCoCAuoZ'
  metadata: {
    name: 'nullifierRegistry'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Nullifier registry to prevent proof replay attacks'
  }
  instructions: [
    {
      name: 'checkNullifier'
      docs: [
        'Check if a nullifier has been used (read-only)',
        'This is called via CPI from other programs to prevent replay attacks',
        'Returns error if nullifier is already used',
      ]
      discriminator: [27, 96, 60, 156, 54, 225, 221, 73]
      accounts: [
        {
          name: 'nullifierRecord'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [110, 117, 108, 108, 105, 102, 105, 101, 114]
              },
              {
                kind: 'arg'
                path: 'nullifierHash'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'nullifierHash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
    {
      name: 'initialize'
      docs: ['Initialize the nullifier registry']
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'registry'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
      args: []
    },
    {
      name: 'markNullifier'
      docs: [
        'Mark a nullifier as used',
        'This prevents replay attacks by ensuring each proof can only be used once',
      ]
      discriminator: [84, 1, 121, 190, 181, 180, 1, 185]
      accounts: [
        {
          name: 'registry'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                ]
              },
            ]
          }
        },
        {
          name: 'nullifierRecord'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [110, 117, 108, 108, 105, 102, 105, 101, 114]
              },
              {
                kind: 'arg'
                path: 'nullifierHash'
              },
            ]
          }
        },
        {
          name: 'user'
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
          name: 'nullifierHash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'nullifierRecord'
      discriminator: [56, 18, 57, 175, 69, 202, 189, 70]
    },
    {
      name: 'nullifierRegistry'
      discriminator: [100, 229, 171, 224, 85, 171, 147, 206]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'invalidNullifier'
      msg: 'Nullifier hash cannot be empty'
    },
    {
      code: 6001
      name: 'nullifierAlreadyUsed'
      msg: 'Nullifier has already been used'
    },
    {
      code: 6002
      name: 'nullifierHashMismatch'
      msg: 'Nullifier hash mismatch'
    },
  ]
  types: [
    {
      name: 'nullifierRecord'
      docs: ['Individual nullifier record']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'nullifierHash'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'usedAt'
            type: 'i64'
          },
          {
            name: 'usedBy'
            type: 'pubkey'
          },
        ]
      }
    },
    {
      name: 'nullifierRegistry'
      docs: ['Global nullifier registry']
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'pubkey'
          },
          {
            name: 'nullifierCount'
            type: 'u64'
          },
        ]
      }
    },
  ]
}
