export const abi = [
    {
      "type": "function",
      "name": "UPGRADE_INTERFACE_VERSION",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "createProject",
      "inputs": [
        { "name": "_goal", "type": "uint256", "internalType": "uint256" },
        { "name": "_milestones", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "fundProject",
      "inputs": [
        { "name": "_projectOwner", "type": "address", "internalType": "address" },
        { "name": "_projectIndex", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "investmentCount",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "investments",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "projectOwner", "type": "address", "internalType": "address" },
        { "name": "projectIndex", "type": "uint256", "internalType": "uint256" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "projectCount",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "projects",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "index", "type": "uint256", "internalType": "uint256" },
        { "name": "goal", "type": "uint256", "internalType": "uint256" },
        { "name": "milestones", "type": "uint256", "internalType": "uint256" },
        { "name": "funded", "type": "uint256", "internalType": "uint256" },
        { "name": "released", "type": "uint256", "internalType": "uint256" },
        { "name": "ended", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "proxiableUUID",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "releaseFunds",
      "inputs": [
        { "name": "_projectIndex", "type": "uint256", "internalType": "uint256" },
        { "name": "_amount", "type": "uint256", "internalType": "uint256" },
        { "name": "to", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "upgradeToAndCall",
      "inputs": [
        { "name": "newImplementation", "type": "address", "internalType": "address" },
        { "name": "data", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
  
      "type": "event",
      "name": "Initialized",
      "inputs": [
        {
          "name": "version",
          "type": "uint64",
          "indexed": false,
          "internalType": "uint64"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProjectCreated",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "index",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "goal",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "milestones",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProjectFunded",
      "inputs": [
        {
          "name": "funder",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "investmentIndex",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "projectOwner",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "projectIndex",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProjectFundsReleased",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "index",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Upgraded",
      "inputs": [
        {
          "name": "implementation",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "AddressEmptyCode",
      "inputs": [{ "name": "target", "type": "address", "internalType": "address" }]
    },
    { "type": "error", "name": "AmountExceedsProjectFund", "inputs": [] },
    { "type": "error", "name": "AmountExceedsProjectGoal", "inputs": [] },
    {
      "type": "error",
      "name": "ERC1967InvalidImplementation",
      "inputs": [
        { "name": "implementation", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "ERC1967NonPayable", "inputs": [] },
    { "type": "error", "name": "EthereumTransferFailed", "inputs": [] },
    { "type": "error", "name": "FailedCall", "inputs": [] },
    { "type": "error", "name": "InvalidAddressInput", "inputs": [] },
    { "type": "error", "name": "InvalidAmountInput", "inputs": [] },
    { "type": "error", "name": "InvalidFundingAmount", "inputs": [] },
    { "type": "error", "name": "InvalidGoalInput", "inputs": [] },
    { "type": "error", "name": "InvalidIndexInput", "inputs": [] },
    { "type": "error", "name": "InvalidInitialization", "inputs": [] },
    { "type": "error", "name": "InvalidMilestonesInput", "inputs": [] },
    { "type": "error", "name": "NotInitializing", "inputs": [] },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [{ "name": "account", "type": "address", "internalType": "address" }]
    },
    { "type": "error", "name": "ProjectEnded", "inputs": [] },
    { "type": "error", "name": "UUPSUnauthorizedCallContext", "inputs": [] },
    {
      "type": "error",
      "name": "UUPSUnsupportedProxiableUUID",
      "inputs": [{ "name": "slot", "type": "bytes32", "internalType": "bytes32" }]
    }
  ]