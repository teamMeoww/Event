# EventOne Application & Integration Flow

This document provides a comprehensive overview of the application flow and the architecture of the EventOne ecosystem. It is intended for backend engineers to understand how the Participant App, Volunteer App, Website, and Smart Contracts integrate with the backend microservices.

## 1. App Flow: Landing Page to Dashboard

This flow applies to both the Web platform and the Participant App.

1.  **Landing Page (Web/App)**:
    *   Users land on the home page viewing featured events. This data is fetched from the **Event Service** (public endpoints).
2.  **Authentication & Onboarding**:
    *   User clicks "Login/Sign Up".
    *   The frontend communicates with the **Auth Service** to authenticate the user (e.g., via OAuth or email/password).
    *   Upon successful login, the Auth Service issues a JWT token.
    *   If the user is new, their profile is created in the **User Service**.
    *   *Web3 Onboarding*: The **Wallet Service** automatically provisions or links a blockchain wallet address to the user's account for holding NFTs.
3.  **Dashboard**:
    *   The user is redirected to their Dashboard.
    *   **User Service**: Fetches user profile details.
    *   **Ticket Service**: Fetches the user's active event registrations and tickets.
    *   **Credential Service**: Fetches any earned POAPs or credentials from past events.
    *   **Wallet/Blockchain Service**: Syncs the on-chain balance and NFT assets to display to the user.

## 2. Participant App to Volunteer App (Event Day Flow)

This is the core flow that connects the Participant (Attendee) with the Volunteer (Organizer/Scanner) on the day of the event.

1.  **Ticket Acquisition (Participant)**:
    *   The participant registers for an event via the app or website.
    *   **Ticket Service** processes the registration.
    *   **Blockchain Service** is triggered asynchronously (e.g., via Kafka) to mint a unique NFT ticket on the blockchain (via the Ticket Smart Contract).
2.  **QR Code Generation (Participant App)**:
    *   The Participant App displays a dynamic QR code for the ticket.
    *   This QR code contains the ticket ID, user ID, and a secure cryptographic payload to prevent screenshot spoofing.
3.  **Volunteer Login (Volunteer App)**:
    *   The volunteer opens the Volunteer App and logs in (via **Auth Service**).
    *   The backend verifies they have the appropriate roles (`ORGANIZER` or `VOLUNTEER`).
    *   The app lands on the Volunteer Dashboard, displaying their total scans (reputation score) and active events.
4.  **Ticket Scanning (Volunteer App)**:
    *   The volunteer clicks "Scan QR" and scans the participant's phone.
    *   The Volunteer App sends a POST request to the **Checkin Service** (`/api/v1/checkin/scan` or similar) containing the QR payload.
5.  **Verification & Check-in (Backend)**:
    *   **Checkin Service** receives the request.
    *   It communicates with the **Ticket Service** and **Verification Service** to ensure:
        *   The ticket is valid and belongs to the event.
        *   The ticket has not already been used (not checked in).
        *   The ticket status is active (not `REVOKED`).
    *   It optionally verifies the on-chain state via the **Blockchain Service** to ensure the NFT hasn't been transferred or burned.
6.  **Confirmation**:
    *   If valid, the **Checkin Service** marks the ticket as `USED`.
    *   A success response is sent back to the Volunteer App ("Check-in Successful").
    *   The **Realtime Service** pushes a notification to the Participant App confirming their entry.

## 3. Smart Contract & Blockchain Integration

The EventOne ecosystem uses blockchain to provide verifiable ownership of tickets and post-event credentials (POAPs).

### Smart Contracts Overview
There are two primary contracts:
1.  **Ticket Contract (`EVENTONE_TICKET_CONTRACT`)**: An ERC-721 or ERC-1155 contract representing event tickets.
2.  **Credential Contract (`EVENTONE_CREDENTIAL_CONTRACT`)**: An ERC-721 or ERC-1155 contract representing post-event credentials, certificates, or POAPs.

### Backend to Blockchain Flow
The backend abstracts the blockchain complexity from the frontend apps. All blockchain interactions go through the **Blockchain Service**.

*   **Minting a Ticket**:
    1.  User registers -> **Ticket Service** saves to DB -> Publishes `TicketCreatedEvent` to Kafka.
    2.  **Blockchain Service** listens to the event -> Calls the `mint()` function on the **Ticket Contract**.
    3.  Transaction hash is saved and the ticket status is updated to `MINTED`.
*   **Checking On-Chain State**:
    *   The **Verification Service** can query the **Blockchain Service** to read the smart contract state (e.g., `ownerOf(tokenId)`) to verify a user actually holds the ticket in their wallet before allowing entry.
*   **Revoking a Ticket**:
    *   If a ticket is cancelled or refunded, the backend calls the smart contract to burn or revoke the token, updating the DB status to `REVOKED`.
*   **Post-Event Credentials (POAPs)**:
    *   After an event, the **Credential Service** can issue attendance NFTs. It sends a request to the **Blockchain Service** to mint a token on the **Credential Contract** for users who were successfully checked in.

## 4. Developer Action Items for Integration

For backend engineers connecting the apps:
*   **API Gateway**: Ensure all frontend apps route requests through the API Gateway (`gateway-service`) which handles rate limiting and routing.
*   **Authentication**: Both Participant and Volunteer apps must attach the JWT token as a `Bearer` token in the `Authorization` header for all protected requests.
*   **Mocking On-Chain Data**: For local testing without a live testnet, ensure the local `anvil` node is running (`docker compose up anvil -d`) and contracts are deployed locally, or use feature flags to bypass on-chain verification in dev environments.
*   **WebSockets**: Connect the apps to the `realtime-service` to listen for immediate check-in confirmations and notifications.

## 5. Current Folder Structure

The project follows a standard monorepo architecture:

*   **`client/`**: Contains the web interfaces.
    *   `dashboard/`: The main web dashboard for users and organizers.
    *   `landing_page/`: The public-facing website.
*   **`mobile/`**: Contains mobile applications.
    *   `participant-app/`: The React Native app for event attendees.
    *   `volunteer-app/`: The Kotlin Android app for volunteers and organizers to scan tickets.
*   **`server/`**: Contains the Spring Boot backend microservices (`auth-service`, `ticket-service`, `blockchain-service`, etc.).
*   **`docs/`**: Contains all architectural, implementation, and audit documentation.
*   **`contracts/`**: Contains the smart contracts (Solidity) for tickets and credentials.
*   **`scripts/`**: Contains utility scripts for design mocks, avatars, and fixing assets.
