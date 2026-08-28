#!/bin/bash
set -e

echo "Starting local Anvil node..."
# Start anvil in the background if it's not already running
if ! curl -s http://localhost:8545 > /dev/null; then
    ~/.foundry/bin/anvil --host 0.0.0.0 --chain-id 31337 > anvil.log 2>&1 &
    ANVIL_PID=$!
    sleep 3
else
    echo "Anvil is already running on port 8545"
fi

echo "Deploying EventOne Contracts..."

# We use the standard Foundry test account 0
# Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# PK: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export ISSUER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

~/.foundry/bin/forge script script/DeployEventOne.s.sol:DeployEventOne \
    --rpc-url http://localhost:8545 \
    --broadcast

echo ""
echo "Extracting deployed addresses from run-latest.json..."

# Extract the addresses using jq
TICKET_ADDR=$(jq -r '.transactions[] | select(.contractName == "EventOneTicket") | .contractAddress' broadcast/DeployEventOne.s.sol/31337/run-latest.json | head -n 1)
CREDENTIAL_ADDR=$(jq -r '.transactions[] | select(.contractName == "EventOneCredential") | .contractAddress' broadcast/DeployEventOne.s.sol/31337/run-latest.json | head -n 1)
TX_HASHES=$(jq -r '.transactions[] | .hash' broadcast/DeployEventOne.s.sol/31337/run-latest.json | paste -sd, -)

echo ""
echo "=========================================="
echo "Deployment Successful!"
echo "Network: Local Anvil"
echo "Chain ID: 31337"
echo "Deployer/Issuer Address: $ISSUER_ADDRESS"
echo "Ticket Contract Address: $TICKET_ADDR"
echo "Credential Contract Address: $CREDENTIAL_ADDR"
echo "Deployment Tx Hashes: $TX_HASHES"
echo "=========================================="

echo ""
echo "Updating root .env file..."
cat << EOF > ../.env
EVENTONE_TICKET_CONTRACT=$TICKET_ADDR
EVENTONE_CREDENTIAL_CONTRACT=$CREDENTIAL_ADDR
EVENTONE_BLOCKCHAIN_RPCURL=http://localhost:8545
EVENTONE_BLOCKCHAIN_CHAINID=31337
EVENTONE_BLOCKCHAIN_PRIVATEKEY=$PRIVATE_KEY
EOF

echo ".env file updated successfully."

if [ ! -z "$ANVIL_PID" ]; then
    echo "Leaving Anvil running in background with PID $ANVIL_PID for testing..."
fi
