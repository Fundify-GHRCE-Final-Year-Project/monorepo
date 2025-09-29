# Run this bash script to install all dependancies and build everything

#!/bin/sh
set -e  # Exit immediately if a command fails
# Optionally: set -u  # treat unset variables as error

echo "Installing npm packages..."
npm install

echo "Building all apps and packages..."
npm run build

echo "Installing contract dependencies..."
cd contract
forge install foundry-rs/forge-std --no-git \
  && forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-git \
  && forge install OpenZeppelin/openzeppelin-contracts --no-git
cd ..

echo "Building docker containers..."
docker compose build

echo "startup.sh: done"
