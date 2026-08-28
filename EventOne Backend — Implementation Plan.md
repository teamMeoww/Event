# EventOne Backend — Implementation Plan

## Objective

Upgrade the existing Node.js/Express backend into the central API and orchestration layer for:

- Event management
- User authentication
- Tickets
- QR verification
- Real-time check-in
- Web3 wallets
- Blockchain tickets
- Proof-of-attendance credentials
- Event Passport
- AI event discovery
- React web application
- React Native application
- Native iOS integrations

The backend remains the application's primary source of truth.

MongoDB manages application data.

Blockchain manages verifiable ownership and credentials.

---

# 1. Preserve Existing Backend

Do not rewrite the existing backend architecture.

Existing:

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
Socket.IO
```

Keep the existing:

```text
controllers/
models/
routes/
middleware/
socket/
```

Add a proper service layer for the new functionality.

---

# 2. Target Backend Structure

```text
backend/
└── src/
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   └── blockchain.js
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── event.controller.js
    │   ├── ticket.controller.js
    │   ├── checkin.controller.js
    │   ├── wallet.controller.js
    │   ├── credential.controller.js
    │   ├── passport.controller.js
    │   ├── verification.controller.js
    │   └── ai.controller.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Event.js
    │   ├── Ticket.js
    │   ├── CheckIn.js
    │   ├── Wallet.js
    │   ├── Credential.js
    │   ├── Achievement.js
    │   └── Review.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   ├── event.routes.js
    │   ├── ticket.routes.js
    │   ├── checkin.routes.js
    │   ├── wallet.routes.js
    │   ├── credential.routes.js
    │   ├── passport.routes.js
    │   ├── verification.routes.js
    │   └── ai.routes.js
    │
    ├── services/
    │   ├── ticket.service.js
    │   ├── checkin.service.js
    │   ├── wallet.service.js
    │   ├── blockchain.service.js
    │   ├── credential.service.js
    │   ├── passport.service.js
    │   └── ai.service.js
    │
    ├── middleware/
    │   ├── auth.js
    │   ├── role.js
    │   ├── validation.js
    │   └── errorHandler.js
    │
    ├── socket/
    │   └── checkin.socket.js
    │
    └── index.js
```

---

# 3. Phase 1 — Existing System Stabilization

Before adding Web3:

- Fix existing authentication
- Verify event creation
- Verify event registration
- Verify ticket creation
- Verify QR generation
- Verify QR check-in
- Verify Socket.IO
- Verify organizer dashboard APIs
- Verify admin APIs
- Standardize API error responses
- Add request validation
- Remove unnecessary duplicated logic

Do not start Web3 until the existing flow is stable.

---

# 4. Phase 2 — Database Changes

## User

Add:

```text
walletAddress
walletType
walletVerified
reputationScore
```

## Event

Add:

```text
blockchainEnabled
blockchainEventId
contractAddress
metadataURI
```

## Ticket

Add:

```text
walletAddress
blockchainTicketId
transactionHash
blockchainStatus
```

## CheckIn

Add:

```text
verificationMethod
verificationStatus
blockchainStatus
credentialId
```

## Credential

Create:

```text
Credential
```

Fields:

```text
userId
eventId
ticketId
type
title
metadataURI
contractAddress
tokenId
transactionHash
status
issuedAt
```

## Wallet

Create:

```text
Wallet
```

Fields:

```text
userId
address
chain
walletType
verified
createdAt
```

---

# 5. Phase 3 — Wallet Service

Create:

```text
wallet.service.js
```

Responsibilities:

- Create wallet/smart account
- Associate wallet with user
- Verify wallet ownership
- Return wallet status
- Handle blockchain identity

The frontend should never directly modify the user's wallet address in the database.

---

# 6. Phase 4 — Blockchain Service

Create:

```text
blockchain.service.js
```

Responsibilities:

```text
createEvent()
issueTicket()
verifyTicket()
revokeTicket()
issueCredential()
verifyCredential()
getTransaction()
```

All blockchain communication should go through this service.

Controllers must not directly call blockchain RPC methods.

---

# 7. Phase 5 — Ticket System

Current flow:

```text
Registration
→ Ticket
→ QR
```

New flow:

```text
Registration
→ Ticket
→ Blockchain Ticket ID
→ QR
```

Ticket service must:

1. Validate registration.
2. Create application ticket.
3. Generate secure QR token.
4. Issue blockchain ticket if Web3 is enabled.
5. Store transaction details.
6. Return ticket to client.

---

# 8. Phase 6 — QR Verification

Create:

```text
POST /api/checkins/verify
```

Input:

```text
qrToken
eventId
```

Backend verifies:

```text
Token exists
Token signature valid
Token not expired
Ticket exists
Event matches
Ticket belongs to attendee
Ticket not cancelled
Ticket not already checked in
```

Return:

```text
VALID
INVALID
ALREADY_USED
CANCELLED
WRONG_EVENT
```

Never trust ticket status supplied by the client.

---

# 9. Phase 7 — Check-In

Create:

```text
POST /api/checkins
```

Flow:

```text
QR
 ↓
Verify ticket
 ↓
Create check-in
 ↓
Update ticket
 ↓
Emit Socket.IO event
 ↓
Issue credential
```

Socket events:

```text
ticket:checked-in
attendance:updated
credential:issued
verification:failed
```

---

# 10. Phase 8 — Proof of Attendance

After successful check-in:

```text
Check-in
   ↓
Credential creation
   ↓
Blockchain transaction
   ↓
Store transaction hash
   ↓
Credential status = VERIFIED
```

If blockchain fails:

```text
Credential status = PENDING
```

and retry asynchronously.

The attendee should still be checked in.

---

# 11. Phase 9 — Event Passport API

Create:

```text
GET /api/passport/me
GET /api/passport/:userId
```

Response:

```text
{
  verifiedEvents,
  contributions,
  awards,
  reputation,
  credentials
}
```

Passport data should combine:

```text
MongoDB application records
+
Blockchain verification
```

---

# 12. Phase 10 — Public Verification

Create:

```text
GET /api/verification/ticket/:ticketId
GET /api/verification/credential/:credentialId
```

These endpoints should return publicly safe verification information.

Example:

```text
Credential
✓ VERIFIED

Event
AI Hackathon 2026

Type
ATTENDANCE

Issued
August 30, 2026

Transaction
0x81c9...
```

Do not expose:

```text
email
phone
password
private user data
```

---

# 13. Phase 11 — AI Service

Create:

```text
ai.service.js
```

Responsibilities:

- Parse natural-language event requests
- Find matching events
- Rank events
- Generate recommendations
- Generate event itineraries

AI should never invent events.

All recommended events must come from EventOne's event database.

---

# 14. Phase 12 — API Contract

Core endpoints:

```text
POST /api/auth/register
POST /api/auth/login

GET /api/events
GET /api/events/:id
POST /api/events/:id/register

GET /api/tickets
GET /api/tickets/:id

POST /api/checkins/verify
POST /api/checkins

GET /api/passport/me
GET /api/credentials
GET /api/credentials/:id

GET /api/verification/ticket/:id
GET /api/verification/credential/:id

GET /api/wallet
POST /api/wallet/connect

POST /api/ai/recommend
POST /api/ai/itinerary
```

---

# 15. Backend Security

Implement:

- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- QR token expiration
- QR signature verification
- Wallet verification
- Organizer ownership verification
- Blockchain transaction verification
- Secure environment variables

Never expose private blockchain keys through APIs.

---

# 16. Backend Testing

Critical tests:

```text
Registration
Ticket creation
QR validation
Duplicate check-in
Wrong-event QR
Cancelled ticket
Credential issuance
Blockchain failure
Passport generation
AI recommendation
Socket.IO check-in
```

The most important automated test:

```text
Same ticket scanned twice
→ second scan MUST fail
```

---

# 17. Backend Definition of Done

Backend is complete when:

- Existing EventOne functionality still works.
- Web3 ticket issuance works.
- QR verification works.
- Duplicate tickets are rejected.
- Check-in is broadcast in real time.
- Attendance credential is issued.
- Blockchain transaction can be verified.
- Event Passport is generated.
- Public verification works.
- React frontend can consume all APIs.
- React Native can consume all APIs.
- iOS integration can consume required APIs.