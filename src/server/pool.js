export const poolConfig = {
  address: window.Twin_Token_Pool_Address,
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "contract Validator",
          name: "validator",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "originalERC20",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "privateERC20",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "axiomPay",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "paillierNN",
          type: "uint256",
        },
      ],
      name: "Register",
      type: "event",
    },
    {
      inputs: [],
      name: "_validator",
      outputs: [
        {
          internalType: "contract Validator",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "addressBook",
      outputs: [
        {
          internalType: "contract IAddressBook",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "getPublicKey",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "isPrivate",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IERC20Metadata",
          name: "originalERC20",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "paillierNN",
          type: "uint256",
        },
      ],
      name: "register",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "publicKey",
          type: "bytes",
        },
      ],
      name: "registerAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "showLists",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "axiomPay",
              type: "address",
            },
            {
              internalType: "string",
              name: "originalERC20Name",
              type: "string",
            },
            {
              internalType: "string",
              name: "privateERC20Name",
              type: "string",
            },
          ],
          internalType: "struct TwinTokenPool.PoolInfo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

// export const isPrivateContractConfig = {
//     address: window.ST_GOVERNANCE_COUNCIL_ADDRESS,
//     abi: [{
//         name: "isPrivate",
//         stateMutability: "view",
//         type: "function",
//         inputs: [{internalType: "address", name: "owner", type: "address"}],
//         outputs: [{internalType: "bool", name: "", type: "bool"}],
//     }],
//
// }
