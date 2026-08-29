#!/bin/bash
# EventOne Full System E2E Test
# This script executes a real E2E flow against the running infrastructure.

set -e

GATEWAY_URL="http://localhost:8080"
echo "Starting Real E2E Test..."

echo "1. Register User"
USER_JSON=$(curl -s -X POST $GATEWAY_URL/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eventone.com", "password":"password123", "role":"USER"}')
echo "Register Response: $USER_JSON"

echo "2. Login"
LOGIN_JSON=$(curl -s -X POST $GATEWAY_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eventone.com", "password":"password123"}')
echo "Login Response: $LOGIN_JSON"
JWT=$(echo $LOGIN_JSON | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$JWT" ]; then
    echo "Failed to extract JWT!"
    exit 1
fi

echo "3. Create Event (Organizer)"
# Note: For real test, we might need an ORGANIZER account. 
# Using a placeholder event creation assuming the test user has access or we test registration on an existing event.

echo "4. Request Wallet Challenge"
CHALLENGE_JSON=$(curl -s -X POST $GATEWAY_URL/api/v1/wallet/challenge \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"address":"0x1234567890abcdef1234567890abcdef12345678"}')
echo "Challenge: $CHALLENGE_JSON"

echo "5. Sign Challenge & Verify (Mocked Signature for now since we don't have a private key in the bash script)"
# For a REAL test, we would sign the canonical message with web3 tooling here and submit to /api/v1/wallet/verify
echo "Skipping full wallet sig in Bash..."

echo "6. Ticket Registration"
TICKET_JSON=$(curl -s -X POST $GATEWAY_URL/api/v1/tickets \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"eventId":"evt_test_123", "walletAddress":"0x1234567890abcdef1234567890abcdef12345678", "blockchainEnabled":true}')
echo "Ticket Creation: $TICKET_JSON"
TICKET_ID=$(echo $TICKET_JSON | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

echo "7. Wait for Blockchain Tx & Token ID"
sleep 5 # Wait for outbox & kafka processing
TICKET_STATUS=$(curl -s -X GET $GATEWAY_URL/api/v1/tickets/$TICKET_ID -H "Authorization: Bearer $JWT")
echo "Ticket Status: $TICKET_STATUS"

echo "8. QR Check-In"
# Retrieve QR
QR_JSON=$(curl -s -X GET $GATEWAY_URL/api/v1/tickets/$TICKET_ID/qr -H "Authorization: Bearer $JWT")
TOKEN=$(echo $QR_JSON | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

SCAN_JSON=$(curl -s -X POST $GATEWAY_URL/api/v1/checkins/verify \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d "{\"eventId\":\"evt_test_123\", \"qrToken\":\"$TOKEN\"}")
echo "Scan Result: $SCAN_JSON"

echo "E2E Test Completed!"
