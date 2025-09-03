#!/bin/bash
set -e

# Start local Anvil if not running by running command "anvil"
# If you installed foundry it will be available by default in your terminal

# Load environment variables from .env if it exists
if [ -f ".env.development" ]; then
  echo "Sourcing .env.development..."
  set -a
  source .env.development
  set +a
fi

USER1_PRIVATE_KEY='0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

# Deploy and create projects in one go
forge script testing.s.sol:DeployAndCreateFundify \
    --rpc-url http://localhost:8545 \
    --broadcast \
    --private-key $USER1_PRIVATE_KEY

