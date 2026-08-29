# Build and Integrate the Complete EventOne Node.js Backend

## Project Context

You are working on **EventOne**, a complete event management ecosystem consisting of multiple frontend applications, mobile applications, backend services, and blockchain smart contracts.

Before writing or changing any code, thoroughly analyze the **existing repository structure**, existing frontend applications, API integrations, environment files, backend code, smart contracts, and documentation.

Do not blindly delete, replace, or break existing functionality.

The goal is to build a complete, working **Node.js backend with MongoDB** that supports the entire EventOne ecosystem and integrates properly with the existing applications.

The complete application flow is:

```text
Landing Page
      ↓
Browse Events
      ↓
Login / Sign Up
      ↓
Authentication
      ↓
Role-Based Dashboard
      ↓
────────────────────────────────────
│                │                 │
▼                ▼                 ▼
Participant      Organizer          Volunteer
App              Dashboard          App
│                │                 │
└────────────────┴─────────────────┘
                 ↓
          Node.js Backend
                 ↓
              MongoDB
                 ↓
       Socket.IO / Real-Time
                 ↓
      Blockchain Integration
```

The backend must support the complete lifecycle:

```text
Landing Page
→ Event Discovery
→ Authentication
→ User Dashboard
→ Event Registration
→ Ticket Generation
→ Dynamic QR Code
→ Volunteer Scanning
→ Secure Check-in
→ Live Organizer Updates
→ Participant Notification
→ Post-Event Credentials / POAP
→ Blockchain Verification
```

---

# 1. CURRENT MONOREPO STRUCTURE

The existing project follows this structure:

```text
EventOne/
│
├── client/
│   │
│   ├── dashboard/
│   │   └── Main web dashboard for users and organizers
│   │
│   └── landing_page/
│       └── Public-facing EventOne website
│
├── mobile/
│   │
│   ├── participant-app/
│   │   └── React Native application for event attendees
│   │
│   └── volunteer-app/
│       └── Kotlin Android application for volunteers and organizers
│
├── server/
│   └── Existing backend services and backend-related code
│
├── contracts/
│   ├── Ticket smart contracts
│   └── Credential / POAP smart contracts
│
├── docs/
│   └── Architecture, implementation, audit and technical documentation
│
└── scripts/
    └── Utility scripts
```

The backend implementation must respect this monorepo structure.

Do not move frontend applications unnecessarily.

The backend should be implemented inside the appropriate server/backend area.

Before implementation:

1. Inspect the existing `client/dashboard`.
2. Inspect the existing `client/landing_page`.
3. Inspect `mobile/participant-app`.
4. Inspect `mobile/volunteer-app`.
5. Inspect the current `server` directory.
6. Inspect existing environment variables.
7. Inspect existing API calls.
8. Inspect the `contracts` directory.
9. Inspect documentation inside `docs`.
10. Identify what already works and what is missing.

Do not duplicate existing APIs unnecessarily.

---

# 2. BACKEND ARCHITECTURE DECISION

The original architecture references multiple backend microservices such as:

```text
Auth Service
User Service
Event Service
Ticket Service
Checkin Service
Credential Service
Wallet Service
Blockchain Service
Verification Service
Realtime Service
API Gateway
Kafka
```

However, for the current implementation, build the backend as a **clean, scalable Node.js modular backend using MongoDB**.

Do not unnecessarily create ten separate Node.js deployments at this stage.

Instead, create a properly structured backend where each domain is isolated as a module:

```text
server/
│
└── node-backend/
    │
    ├── src/
    │
    ├── config/
    │
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── organizations/
    │   ├── events/
    │   ├── registrations/
    │   ├── tickets/
    │   ├── checkins/
    │   ├── volunteers/
    │   ├── organizer/
    │   ├── credentials/
    │   ├── wallet/
    │   ├── blockchain/
    │   ├── verification/
    │   ├── notifications/
    │   └── analytics/
    │
    ├── middleware/
    │
    ├── models/
    │
    ├── sockets/
    │
    ├── routes/
    │
    ├── utils/
    │
    ├── app.js
    │
    └── server.js
```

The architecture should follow:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model / Database
```

Controllers must remain thin.

Business logic belongs inside services.

The modules should be designed cleanly enough that they can later be extracted into separate microservices if EventOne scales.

---

# 3. TECHNOLOGY STACK

Use:

```text
Node.js
Express.js
MongoDB
Mongoose
Socket.IO
JWT
Refresh Tokens
bcryptjs
Zod or Joi
Cloudinary
Swagger / OpenAPI
dotenv
Helmet
CORS
Rate Limiting
MongoDB Transactions where required
```

For blockchain integration use:

```text
ethers.js
```

The blockchain implementation must be optional and controlled through feature flags.

---

# 4. FRONTEND CLIENTS THAT MUST CONNECT TO THE BACKEND

The backend must support all of the following applications.

## A. Landing Page

Location:

```text
client/landing_page/
```

This is the public EventOne website.

Users should be able to:

* Browse featured events
* Browse upcoming events
* Search events
* Filter events
* View event details
* Navigate to login/signup
* Register for events after authentication

Public event browsing should not require authentication.

---

## B. Dashboard

Location:

```text
client/dashboard/
```

This is the main web dashboard.

The dashboard must support role-based access.

The primary dashboard user types are:

```text
PARTICIPANT
ORGANIZER
SUPER_ADMIN
```

The Organizer should have complete access to their organization's event management functionality.

---

## C. Participant App

Location:

```text
mobile/participant-app/
```

Technology:

```text
React Native
```

The participant app must support:

* Authentication
* Event discovery
* Event registration
* My tickets
* Dynamic QR tickets
* Check-in confirmation
* Notifications
* Credentials / POAPs
* Profile management

---

## D. Volunteer App

Location:

```text
mobile/volunteer-app/
```

Technology:

```text
Kotlin Android
```

This application is used by:

```text
VOLUNTEER
ORGANIZER
```

The Volunteer App must support:

* Login
* Role verification
* Volunteer dashboard
* Organizer scanning access where appropriate
* Assigned events
* QR code scanning
* Ticket verification
* Check-in confirmation
* Scan history
* Total scans
* Reputation/performance statistics

Do not assume this application is React Native.

It is a Kotlin Android application, so inspect its existing networking/API implementation and integrate the Node.js backend accordingly.

---

# 5. USER ROLES

Implement Role-Based Access Control.

The system must support:

```text
SUPER_ADMIN
ORGANIZER
VOLUNTEER
PARTICIPANT
```

Create middleware such as:

```js
authenticate
authorize(...roles)
```

Every protected route must:

1. Verify JWT.
2. Load authenticated user.
3. Verify the user is active.
4. Validate the required role.
5. Validate organization ownership when applicable.

---

# 6. AUTHENTICATION FLOW

The authentication system should support:

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
GET  /api/v1/auth/me
```

All mobile and web clients should authenticate using:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Authentication flow:

```text
User
↓
Login / Signup
↓
Node.js Auth Module
↓
Validate Credentials
↓
Generate JWT Access Token
↓
Generate Refresh Token
↓
Return User + Role + Tokens
↓
Frontend redirects based on role
```

Role routing should work conceptually like:

```text
PARTICIPANT
→ Participant experience

ORGANIZER
→ Organizer Dashboard

VOLUNTEER
→ Volunteer App Dashboard

SUPER_ADMIN
→ Platform Admin Dashboard
```

JWT payload should include:

```json
{
  "userId": "USER_ID",
  "role": "USER_ROLE",
  "organizationId": "ORGANIZATION_ID"
}
```

---

# 7. USER AND WEB3 ONBOARDING

When a new user signs up:

```text
User Registration
↓
Create User
↓
Create Profile
↓
Generate / Link Wallet
↓
Save Wallet Address
↓
Return User Information
```

The wallet system must support both possibilities:

### Option 1

Automatically provision a wallet for the user.

### Option 2

Allow the user to connect/link an existing wallet.

The frontend must never directly receive sensitive private keys from the backend.

Store only the wallet address in the standard user profile unless a secure custodial wallet architecture is intentionally implemented.

Create a clean Wallet module.

---

# 8. USER MODEL

Create a User model containing:

```js
{
  name,

  email,

  password,

  phone,

  role: {
    enum: [
      "SUPER_ADMIN",
      "ORGANIZER",
      "VOLUNTEER",
      "PARTICIPANT"
    ]
  },

  organizationId,

  profileImage,

  walletAddress,

  isActive,

  refreshTokens,

  createdAt,

  updatedAt
}
```

Never return passwords or password hashes.

---

# 9. ORGANIZATION SYSTEM

Organizers should operate through organizations.

Organization model:

```js
{
  name,

  description,

  logo,

  website,

  ownerId,

  members: [
    {
      userId,
      role
    }
  ],

  isActive,

  createdAt,

  updatedAt
}
```

Important security rule:

```text
Organizer A must never be able to access
Organizer B's organization data or events.
```

Always validate ownership.

---

# 10. EVENT SYSTEM

Events are the core of EventOne.

Required public APIs:

```http
GET /api/v1/events
GET /api/v1/events/featured
GET /api/v1/events/upcoming
GET /api/v1/events/:id
```

Organizer APIs:

```http
POST   /api/v1/events
PUT    /api/v1/events/:id
DELETE /api/v1/events/:id

POST /api/v1/events/:id/publish

GET /api/v1/events/my-events
```

Event model:

```js
{
  title,

  description,

  shortDescription,

  coverImage,

  images: [],

  category,

  tags: [],

  organizerId,

  organizationId,

  venue: {
    name,
    address,
    city,
    state,
    country,
    latitude,
    longitude
  },

  startDate,

  endDate,

  registrationDeadline,

  capacity,

  registeredCount,

  status: {
    enum: [
      "DRAFT",
      "PUBLISHED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED"
    ]
  },

  isFeatured,

  ticketTypes: [],

  volunteers: [],

  createdAt,

  updatedAt
}
```

Support:

* Pagination
* Search
* Category filtering
* Date filtering
* Featured events
* Upcoming events

Example:

```http
GET /api/v1/events?search=hackathon&category=technology&page=1&limit=10
```

---

# 11. EVENT REGISTRATION AND TICKET ACQUISITION

The participant registration flow must work as follows:

```text
Participant
↓
Select Event
↓
Register
↓
Backend validates event
↓
Validate capacity
↓
Validate registration deadline
↓
Prevent duplicate registration
↓
Create Registration
↓
Create Ticket
↓
Ticket becomes ACTIVE
↓
Trigger blockchain minting asynchronously if enabled
```

Endpoint:

```http
POST /api/v1/events/:eventId/register
```

Registration model:

```js
{
  userId,

  eventId,

  ticketId,

  ticketTypeId,

  status: {
    enum: [
      "CONFIRMED",
      "CANCELLED",
      "WAITLIST"
    ]
  },

  registeredAt
}
```

---

# 12. TICKET SYSTEM

Create a complete Ticket module.

Ticket model:

```js
{
  ticketCode,

  userId,

  eventId,

  registrationId,

  ticketType,

  status: {
    enum: [
      "ACTIVE",
      "MINTING",
      "MINTED",
      "USED",
      "CANCELLED",
      "REVOKED"
    ]
  },

  qrSecret,

  checkedInAt,

  checkedInBy,

  blockchain: {
    enabled,
    tokenId,
    transactionHash,
    minted
  },

  createdAt,

  updatedAt
}
```

Required APIs:

```http
GET /api/v1/tickets/my-tickets

GET /api/v1/tickets/:id

GET /api/v1/tickets/:id/qr
```

Only the ticket owner should be able to access their ticket unless the requesting user has authorized organizer/admin permissions.

---

# 13. BLOCKCHAIN TICKET MINTING FLOW

The updated architecture includes blockchain ticket ownership.

The flow should be:

```text
User Registers
↓
Registration Created in MongoDB
↓
Ticket Created
↓
TicketCreated Event Triggered
↓
Blockchain Module Processes Event
↓
Call mint() on EVENTONE_TICKET_CONTRACT
↓
Blockchain Transaction Submitted
↓
Transaction Confirmed
↓
Save Transaction Hash
↓
Save Token ID
↓
Ticket Status → MINTED
```

The system should be architected to support asynchronous event processing.

For the first implementation, do not require Kafka unless the repository already has Kafka infrastructure configured.

Instead, create an internal event abstraction that can later be replaced with Kafka.

For example:

```text
TicketCreatedEvent
TicketRevokedEvent
CredentialIssuedEvent
```

Do not tightly couple the Ticket module directly to blockchain implementation.

The Blockchain module should own all smart contract interactions.

---

# 14. BLOCKCHAIN SERVICE ABSTRACTION

All blockchain operations must go through:

```text
modules/blockchain/
```

Create services such as:

```js
mintTicket()

verifyTicketOwnership()

revokeTicket()

mintCredential()

getWalletAssets()
```

Use:

```text
ethers.js
```

Configuration should include:

```env
BLOCKCHAIN_ENABLED=false

BLOCKCHAIN_RPC_URL=

EVENTONE_TICKET_CONTRACT=

EVENTONE_CREDENTIAL_CONTRACT=

BLOCKCHAIN_PRIVATE_KEY=
```

When blockchain is disabled:

* User registration must still work.
* Tickets must still work.
* QR scanning must still work.
* Check-in must still work.

Blockchain verification should be optional in development.

---

# 15. DYNAMIC QR CODE SYSTEM

The participant application displays a secure dynamic QR code.

Do not generate a QR code containing only:

```text
ticketId
```

The QR must contain a signed, temporary cryptographic payload.

The participant app requests:

```http
GET /api/v1/tickets/:ticketId/qr
```

The backend generates a secure token containing:

```json
{
  "ticketId": "TICKET_ID",
  "userId": "USER_ID",
  "eventId": "EVENT_ID",
  "type": "EVENTONE_CHECKIN_QR"
}
```

Sign the payload securely.

The token must expire quickly:

```text
30–60 seconds
```

The participant application should automatically request a new QR token before expiration.

The backend must never trust manually supplied ticket IDs without verification.

---

# 16. VOLUNTEER APP FLOW

The Kotlin Volunteer App flow:

```text
Volunteer Opens App
↓
Login
↓
JWT Authentication
↓
Verify Role
↓
Volunteer Dashboard
↓
Display Assigned Events
↓
Volunteer Selects Event
↓
Open QR Scanner
↓
Scan Participant QR
↓
Send QR Payload to Backend
↓
Backend Verification
↓
Success / Failure Result
```

The system should allow an authorized Organizer to use scanning functionality if required by the application design.

The backend must explicitly validate permissions.

---

# 17. VOLUNTEER MANAGEMENT

Organizers should manage volunteers assigned to their events.

Required APIs:

```http
POST /api/v1/events/:eventId/volunteers

GET /api/v1/events/:eventId/volunteers

DELETE /api/v1/events/:eventId/volunteers/:volunteerId
```

When assigning volunteers:

1. Verify organizer owns the event.
2. Verify volunteer exists.
3. Verify user role is VOLUNTEER.
4. Prevent duplicate assignment.

Volunteer APIs:

```http
GET /api/v1/volunteer/dashboard

GET /api/v1/volunteer/events

GET /api/v1/volunteer/scan-history
```

Dashboard should include:

```text
Total Scans
Today's Scans
Assigned Events
Recent Scan History
Performance / Reputation Score
```

---

# 18. QR SCANNING AND CHECK-IN

Create the primary endpoint:

```http
POST /api/v1/checkin/scan
```

Request:

```json
{
  "qrToken": "SIGNED_DYNAMIC_QR_TOKEN",
  "eventId": "EVENT_ID"
}
```

The Check-in module must perform:

```text
1. Authenticate Scanner

2. Verify scanner role:
   VOLUNTEER or authorized ORGANIZER

3. Verify scanner is assigned or authorized for event

4. Verify QR token signature

5. Verify QR token expiration

6. Extract Ticket ID

7. Find ticket

8. Verify ticket belongs to requested event

9. Verify ticket is active

10. Verify ticket has not already been used

11. Verify ticket is not revoked

12. Optionally verify blockchain ownership

13. Atomically create check-in

14. Update ticket status → USED

15. Save checkedInAt

16. Save checkedInBy

17. Emit real-time events

18. Return successful response
```

---

# 19. OPTIONAL BLOCKCHAIN VERIFICATION DURING CHECK-IN

When enabled, the Verification module should verify blockchain state.

Possible verification:

```text
ownerOf(tokenId)
```

The backend can verify:

* NFT still exists
* NFT has not been burned
* NFT ownership is valid
* Ticket has not been revoked

This should be controlled through configuration:

```env
BLOCKCHAIN_VERIFICATION_ENABLED=false
```

Local development must continue working when blockchain is unavailable.

---

# 20. DUPLICATE CHECK-IN PROTECTION

This is critical.

Multiple volunteers may scan the same QR code at the same time.

The backend must prevent duplicate check-ins at the database level.

Create a unique index:

```text
ticketId + eventId
```

Use atomic operations or MongoDB transactions.

Expected result:

```text
Volunteer A scans ticket
→ CHECK-IN SUCCESSFUL

Volunteer B scans same ticket
→ ALREADY_CHECKED_IN
```

Never rely only on frontend checks.

---

# 21. CHECK-IN MODEL

Create:

```js
{
  ticketId,

  eventId,

  participantId,

  volunteerId,

  checkedInAt,

  deviceInfo,

  location: {
    latitude,
    longitude
  }
}
```

This collection acts as a permanent audit trail.

---

# 22. REAL-TIME SERVICE

Implement real-time functionality using:

```text
Socket.IO
```

The system should support rooms:

```text
user:{userId}

event:{eventId}

organization:{organizationId}
```

When check-in succeeds:

```text
Volunteer App
↓
POST /checkin/scan
↓
MongoDB Updated
↓
Socket.IO Event
↓
────────────────────────────
│                          │
▼                          ▼
Organizer Dashboard     Participant App
Live Count Update       Entry Confirmation
```

Emit events such as:

```text
participant_checked_in

event_checkin_updated

ticket_checked_in

notification_created
```

The Participant App should receive immediate confirmation.

The Organizer Dashboard should update live without page refresh.

---

# 23. ORGANIZER DASHBOARD

The Organizer Dashboard should provide complete event management.

Required sections:

```text
Dashboard Overview

My Events

Create Event

Edit Event

Participants

Registrations

Tickets

Volunteers

Live Check-ins

Analytics

Credentials

Organization Settings
```

Required dashboard endpoint:

```http
GET /api/v1/organizer/dashboard
```

Return:

```text
Total Events

Published Events

Upcoming Events

Total Registrations

Total Participants

Total Check-ins

Recent Registrations

Recent Check-ins
```

---

# 24. ORGANIZER EVENT MANAGEMENT

Required APIs:

```http
GET /api/v1/events/my-events

GET /api/v1/events/:eventId/participants

GET /api/v1/events/:eventId/registrations

GET /api/v1/events/:eventId/checkins

GET /api/v1/events/:eventId/analytics
```

Every organizer operation must verify:

```text
Authenticated Organizer
        +
Event Organization
        +
Organizer Organization
```

The organizer must never access another organization's data.

---

# 25. ANALYTICS

Create analytics for organizers.

Each event should provide:

```text
Event Capacity

Total Registrations

Confirmed Registrations

Total Tickets

Active Tickets

Used Tickets

Cancelled Tickets

Total Check-ins

Check-in Percentage

Volunteer Performance

Recent Registration Trends

Recent Check-in Trends
```

Endpoint:

```http
GET /api/v1/events/:eventId/analytics
```

---

# 26. NOTIFICATION SYSTEM

Create a Notification model:

```js
{
  userId,

  title,

  message,

  type,

  isRead,

  metadata,

  createdAt
}
```

Required APIs:

```http
GET /api/v1/notifications

PUT /api/v1/notifications/:id/read

PUT /api/v1/notifications/read-all
```

Important notifications:

```text
Registration successful

Ticket generated

Ticket minted

Event reminder

Participant checked in successfully

New registration for organizer

Event updates
```

Use Socket.IO for immediate notifications.

---

# 27. POST-EVENT CREDENTIALS / POAP

The system must support post-event credentials.

Only participants who successfully checked in should be eligible.

Flow:

```text
Event Completed
↓
Find Successfully Checked-in Participants
↓
Credential Module
↓
Credential Created
↓
Blockchain Module
↓
mintCredential()
↓
Credential NFT Issued
↓
Transaction Stored
↓
Participant Dashboard Updated
```

Credential model:

```js
{
  userId,

  eventId,

  type,

  title,

  description,

  image,

  issuedAt,

  blockchain: {
    tokenId,
    transactionHash,
    minted
  }
}
```

Participant dashboard and mobile app should be able to retrieve credentials.

---

# 28. WALLET AND DASHBOARD DATA

After authentication, the user dashboard should be able to load:

```text
User Profile
↓
Active Registrations
↓
Tickets
↓
Past Events
↓
Credentials / POAPs
↓
Wallet Address
↓
NFT / Blockchain Assets
```

Create an endpoint or properly structured set of endpoints to support efficient dashboard loading.

For example:

```http
GET /api/v1/dashboard
```

The response can aggregate relevant user information efficiently.

Do not create unnecessary database calls from the frontend when a useful dashboard aggregation endpoint is appropriate.

---

# 29. API RESPONSE FORMAT

Use a consistent API response structure.

Success:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Pagination:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Errors:

```json
{
  "success": false,
  "message": "Ticket has already been checked in",
  "error": {
    "code": "ALREADY_CHECKED_IN"
  }
}
```

Use meaningful HTTP status codes.

---

# 30. DATABASE INDEXES

Create proper MongoDB indexes.

Important indexes:

```text
User.email → unique

Ticket.ticketCode → unique

Registration.userId + eventId → unique

Checkin.ticketId + eventId → unique

Event.organizationId

Event.status

Event.startDate

Ticket.userId

Ticket.eventId

Credential.userId

Notification.userId
```

Optimize the database for:

* Landing page event discovery
* Participant ticket loading
* QR ticket verification
* Volunteer check-ins
* Organizer analytics
* Dashboard aggregation

---

# 31. API GATEWAY COMPATIBILITY

The original architecture references:

```text
gateway-service
```

All frontend applications should use environment-based API configuration.

For example:

```env
NEXT_PUBLIC_API_URL=
API_BASE_URL=
```

The Node.js backend should expose a clean centralized API.

The architecture should remain compatible with introducing an API Gateway later.

Do not hardcode backend URLs inside frontend applications.

---

# 32. SECURITY REQUIREMENTS

Implement:

### Authentication

* JWT validation
* Refresh token support
* Password hashing
* Token expiration

### Authorization

* Role-based access
* Organization ownership validation
* Event ownership validation
* Volunteer assignment validation

### API Protection

* Helmet
* CORS
* Rate limiting
* Input validation
* Request sanitization
* Centralized error handling

### QR Security

* Signed payloads
* Short expiration
* Backend verification
* No trust in client-side ticket data

### Blockchain Security

* Never expose private keys
* Keep blockchain secrets in environment variables
* Use feature flags for development

---

# 33. ENVIRONMENT CONFIGURATION

Create a complete `.env.example`.

Include:

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

QR_TOKEN_SECRET=
QR_TOKEN_EXPIRES_IN=60s

CLIENT_URL=

LANDING_PAGE_URL=
DASHBOARD_URL=

PARTICIPANT_APP_API_URL=
VOLUNTEER_APP_API_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BLOCKCHAIN_ENABLED=false

BLOCKCHAIN_VERIFICATION_ENABLED=false

BLOCKCHAIN_RPC_URL=

EVENTONE_TICKET_CONTRACT=

EVENTONE_CREDENTIAL_CONTRACT=

BLOCKCHAIN_PRIVATE_KEY=
```

Never hardcode secrets.

---

# 34. FILE UPLOAD SYSTEM

Use Cloudinary or the existing project storage solution if one already exists.

Support:

```text
User Profile Images

Organization Logos

Event Cover Images

Event Gallery Images

Credential Images
```

Store URLs and metadata in MongoDB.

Do not store large image binaries directly inside MongoDB.

---

# 35. SWAGGER API DOCUMENTATION

Implement complete Swagger/OpenAPI documentation.

Expose:

```text
/api-docs
```

Document:

* Every endpoint
* Authentication requirements
* Required roles
* Request body
* Query parameters
* Response formats
* Error responses

This documentation must be useful for:

```text
Next.js Developers

React Native Developers

Kotlin Android Developers

Future Backend Developers
```

---

# 36. LOCAL BLOCKCHAIN DEVELOPMENT

The project architecture supports local blockchain testing.

Support an environment where:

```bash
docker compose up anvil -d
```

can run a local blockchain.

The contracts should be configurable through environment variables.

If local contracts are unavailable:

```text
BLOCKCHAIN_ENABLED=false
```

must allow the entire event platform to continue functioning normally.

---

# 37. IMPLEMENTATION ORDER

Implement in the following order.

## Phase 1 — Repository Analysis

First inspect:

```text
client/dashboard

client/landing_page

mobile/participant-app

mobile/volunteer-app

server

contracts

docs
```

Identify existing APIs and integration requirements.

---

## Phase 2 — Backend Foundation

Build:

* Node.js setup
* Express
* MongoDB
* Environment configuration
* Error handling
* API response utilities
* Authentication middleware
* Authorization middleware

---

## Phase 3 — Authentication and Users

Build:

* Register
* Login
* JWT
* Refresh token
* Logout
* User profile
* Role management

---

## Phase 4 — Organizations

Build:

* Organization model
* Organizer ownership
* Members

---

## Phase 5 — Events

Build:

* Event CRUD
* Public events
* Featured events
* Upcoming events
* Search
* Filtering

---

## Phase 6 — Registrations and Tickets

Build:

* Event registration
* Capacity validation
* Duplicate prevention
* Ticket creation
* Ticket retrieval

---

## Phase 7 — Dynamic QR

Build:

* Temporary signed QR tokens
* QR refresh support
* Secure backend verification

---

## Phase 8 — Volunteers

Build:

* Volunteer dashboard
* Event assignments
* Scan history
* Performance statistics

---

## Phase 9 — Check-in

Build:

* QR scan endpoint
* Ticket validation
* Duplicate prevention
* Atomic database operations
* Audit records

---

## Phase 10 — Real-Time

Build:

* Socket.IO
* Authentication
* User rooms
* Event rooms
* Organization rooms
* Live check-in updates

---

## Phase 11 — Analytics

Build:

* Organizer dashboard analytics
* Event analytics
* Volunteer performance

---

## Phase 12 — Notifications

Build:

* Notification storage
* Read/unread status
* Real-time delivery

---

## Phase 13 — Blockchain

Integrate:

* Ticket contract
* Credential contract
* Minting
* Revocation
* Ownership verification

Keep everything optional through feature flags.

---

## Phase 14 — Documentation and Testing

Complete:

* Swagger
* README
* `.env.example`
* Seed data
* API testing
* Integration testing

---

# 38. FINAL DEVELOPMENT RULES

Follow these rules strictly:

1. First analyze the existing monorepo before changing code.

2. Do not break the existing Landing Page.

3. Do not break the existing Dashboard.

4. Do not break the React Native Participant App.

5. Do not break the Kotlin Volunteer App.

6. Do not unnecessarily replace working frontend code.

7. Update API integration carefully.

8. Use environment variables for API URLs.

9. Do not create fake APIs or placeholder implementations.

10. Every endpoint must contain actual working logic.

11. Controllers must remain thin.

12. Business logic belongs in services.

13. Validate all user input.

14. Never trust frontend data blindly.

15. Enforce roles on every protected operation.

16. Enforce organization ownership.

17. Enforce volunteer event assignment.

18. Prevent duplicate registrations.

19. Prevent duplicate check-ins at the database level.

20. Keep blockchain logic isolated.

21. The system must work even when blockchain is disabled.

22. Socket.IO must provide real-time check-in updates.

23. Maintain clean and production-quality code.

24. Do not over-engineer into unnecessary microservices.

25. Keep modules structured so they can become microservices later.

---

# FINAL EXPECTED RESULT

The final result must be a **fully functional EventOne backend**, integrated with the existing monorepo.

The final ecosystem should work like this:

```text
                     EVENTONE

                PUBLIC LANDING PAGE
                         │
                         ▼
                   Browse Events
                         │
                         ▼
                   Login / Signup
                         │
                         ▼
                 AUTHENTICATION
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼

  PARTICIPANT        ORGANIZER         VOLUNTEER
  REACT NATIVE       WEB DASHBOARD     KOTLIN APP
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
              NODE.JS + EXPRESS BACKEND
                         │
                         ▼
                      MONGODB
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
          SOCKET.IO            BLOCKCHAIN
          REAL-TIME            ETHERS.JS
              │                     │
              ▼                     ▼
       Live Check-ins         NFT Tickets
       Notifications          Credentials
                              POAPs
```

The completed backend must support the complete EventOne journey:

```text
Landing Page
→ Browse Events
→ Login / Signup
→ User Dashboard
→ Register for Event
→ Ticket Created
→ NFT Minted (when enabled)
→ Dynamic QR Generated
→ Volunteer Scans QR
→ Backend Verifies Ticket
→ Check-in Successful
→ Ticket Marked USED
→ Organizer Dashboard Updates Live
→ Participant Receives Notification
→ Event Completes
→ Credential / POAP Issued
```

After implementation, provide:

1. Complete working backend source code.
2. MongoDB models.
3. All API routes.
4. Controllers and services.
5. Authentication and RBAC middleware.
6. Socket.IO implementation.
7. Blockchain integration layer.
8. Swagger documentation.
9. `.env.example`.
10. README with installation instructions.
11. Seed script with test users and events.
12. Instructions for connecting:

* Landing Page
* Dashboard
* React Native Participant App
* Kotlin Volunteer App

13. Clear documentation of all API endpoints.
14. Clear instructions for local MongoDB development.
15. Clear instructions for optional Anvil blockchain development.

The priority is to create a **real, working backend**, not just a project skeleton.

The backend must become the central system powering the complete EventOne ecosystem while maintaining compatibility with the existing monorepo and frontend applications.
