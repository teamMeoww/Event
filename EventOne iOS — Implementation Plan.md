# EventOne iOS — Implementation Plan

## Objective

The native iOS/Xcode component exists to provide capabilities that should be handled by Apple's native platform rather than duplicating the React Native application.

React Native remains the main mobile application.

Native iOS provides:

```text
Apple Wallet
NFC
Native QR capabilities
Push Notifications
Secure Storage
Native Authentication
```

---

# 1. Architecture

```text
React Native
     |
     | Native Bridge
     v
iOS Native Modules
     |
     +---- Apple Wallet
     |
     +---- NFC
     |
     +---- Secure Storage
     |
     +---- Push Notifications
     |
     +---- Native QR
```

Do not build a completely separate iOS application.

---

# 2. Phase 1 — Xcode Project

Set up:

```text
iOS project
Bundle identifier
Signing configuration
Development team
Capabilities
Environment configuration
```

Verify the application builds successfully on a physical iPhone.

---

# 3. Phase 2 — React Native Bridge

Create native modules only where necessary.

Example conceptual interface:

```text
React Native
      |
      v
EventOneNative
      |
      +── addTicketToAppleWallet()
      +── startNFC()
      +── getDeviceCapabilities()
```

The JavaScript layer should call these functions.

---

# 4. Phase 3 — Apple Wallet

This is the highest-priority native iOS feature.

Flow:

```text
React Native Ticket
       ↓
Add to Apple Wallet
       ↓
Native iOS module
       ↓
Wallet pass
       ↓
Apple Wallet
```

The pass should contain:

```text
Event name
Attendee name
Date
Location
QR/barcode
EventOne branding
```

The pass should be generated securely by the backend.

Do not put private application secrets inside the iOS app.

---

# 5. Phase 4 — Native QR Capability

If native scanning is required:

```text
React Native
     ↓
Native scanner
     ↓
QR token
     ↓
React Native
     ↓
Backend verification
```

The native scanner should only capture the QR data.

Verification remains server-side.

---

# 6. Phase 5 — NFC

NFC is an optional enhancement.

Potential flow:

```text
User enters venue
      ↓
NFC detected
      ↓
EventOne opens
      ↓
Ticket identified
      ↓
Backend verifies
      ↓
Check-in
```

Do not prioritize NFC over the core QR experience.

---

# 7. Phase 6 — Push Notifications

Native iOS should support:

```text
Event reminder
Event starting
Venue changes
Check-in confirmation
Credential issued
```

Flow:

```text
Backend
   ↓
Push Notification Service
   ↓
iPhone
   ↓
EventOne
```

---

# 8. Phase 7 — Secure Storage

Sensitive local information should use iOS secure storage.

Do not store:

```text
Private keys
Authentication secrets
Sensitive credentials
```

in plain local storage.

Use appropriate iOS secure storage mechanisms.

---

# 9. Phase 8 — Native Authentication

If required, support:

```text
Face ID
Touch ID
Apple Sign In
```

These should complement the existing EventOne authentication system.

---

# 10. Phase 9 — Deep Links

Implement deep links such as:

```text
eventone://event/123
eventone://ticket/123
eventone://credential/123
eventone://verify/123
```

This allows:

```text
QR
Apple Wallet
Notification
Web page
```

to open the appropriate screen inside EventOne.

---

# 11. Phase 10 — Native UI Polish

Use native behavior for:

```text
Haptics
System sheets
Wallet presentation
Permissions
Push notification prompts
NFC prompts
```

React Native handles the majority of the UI.

---

# 12. iOS Definition of Done

The native iOS layer is complete when:

```text
React Native
      ↓
Open Ticket
      ↓
Add to Apple Wallet
      ↓
Apple Wallet displays ticket
      ↓
Native capability works
      ↓
React Native continues normal EventOne flow
```

Optional:

```text
NFC
Native QR
Push notifications
Face ID
```

The native layer should enhance the product rather than duplicate it.