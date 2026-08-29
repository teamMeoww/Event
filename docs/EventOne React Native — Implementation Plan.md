# EventOne React Native — Implementation Plan

## Objective

Build a mobile-first attendee application.

The React Native app should NOT be a copy of the desktop website.

Its purpose is:

```text
Discover
Attend
Carry Tickets
Verify Identity
View Passport
Receive Credentials
```

---

# 1. Mobile Navigation

Use:

```text
Home
Discover
Tickets
Passport
Profile
```

Ticket and QR functionality should always be easy to access.

---

# 2. Phase 1 — React Native Foundation

Set up:

```text
React Native
Navigation
API client
Authentication
Secure token storage
Environment configuration
Error handling
Loading states
```

Connect to the existing backend APIs.

Do not create a separate backend.

---

# 3. Phase 2 — Authentication

Screens:

```text
Splash
Login
Register
Forgot Password
```

After authentication:

```text
Home
```

Persist authentication securely.

---

# 4. Phase 3 — Mobile Home

Home should show:

```text
Good evening, Anubhav 👋

Your next event

AI Hackathon
Tomorrow • 10:00 AM

[ OPEN TICKET ]

━━━━━━━━━━━━━━━━

EVENT PASSPORT

12 Verified Events
847 Reputation

━━━━━━━━━━━━━━━━

Recommended Events
```

---

# 5. Phase 4 — Discover

Build mobile event discovery.

Features:

```text
Search
Categories
Location
Date
Recommendations
```

AI search:

```text
"Find me a Web3 event this weekend."
```

Return actual EventOne events.

---

# 6. Phase 5 — Event Details

Display:

```text
Event image
Title
Date
Location
Organizer
Description
Availability
Reviews
```

CTA:

```text
REGISTER
```

After registration:

```text
VIEW TICKET
```

---

# 7. Phase 6 — Mobile Ticket

Ticket should be optimized for phone display.

```text
AI HACKATHON

Anubhav

AUG 30
10:00 AM

DELHI

[ QR CODE ]

✓ VERIFIED
```

Actions:

```text
Add to Apple Wallet
Share
View verification
```

---

# 8. Phase 7 — QR Check-In

The attendee should be able to open the QR code instantly.

Organizer scanning happens through the organizer experience.

After check-in:

```text
✓ CHECKED IN

Welcome to AI Hackathon!

Issuing your attendance
credential...
```

Then:

```text
🏆 CREDENTIAL ISSUED
```

---

# 9. Phase 8 — Event Passport

Mobile Passport:

```text
ANUBHAV

EVENT PASSPORT

12
Events

3
Contributions

2
Awards

847
Reputation
```

Credentials:

```text
🏆 AI Hackathon
✓ Verified

🎤 Developer Conference
✓ Verified

🥇 Web3 Challenge
✓ Winner
```

---

# 10. Phase 9 — Credential Details

Credential screen:

```text
Proof of Attendance

AI Hackathon 2026

✓ Verified

Issued:
August 30, 2026

EventOne

Blockchain:
Verified

[ VIEW PROOF ]
```

---

# 11. Phase 10 — Wallet

The wallet screen should remain simple.

```text
DIGITAL IDENTITY

✓ Active

Wallet
0x83...91A

Network
EventOne Network

Verified Events
12

Credentials
15
```

Advanced blockchain information should be hidden under:

```text
Blockchain Details
```

---

# 12. Phase 11 — Notifications

Implement notifications for:

```text
Registration confirmation
Event reminder
Event starting
Check-in
Credential issued
Event changes
```

---

# 13. Phase 12 — Offline Ticket

Important mobile feature.

Once a ticket is loaded, cache the minimum safe ticket information locally.

The QR should remain accessible even if network connectivity becomes weak.

Server-side verification remains authoritative.

---

# 14. Phase 13 — Apple Wallet Handoff

Provide:

```text
[ ADD TO APPLE WALLET ]
```

The React Native app should trigger the native iOS integration.

Do not implement Apple Wallet logic entirely inside React Native.

---

# 15. Phase 14 — Mobile Polish

Focus on:

```text
Smooth navigation
Skeleton loading
Pull to refresh
Haptic feedback
QR animation
Credential animations
Clean transitions
Accessible touch targets
```

Do not over-animate.

---

# 16. React Native Definition of Done

The mobile user can:

```text
Login
→ Discover event
→ Register
→ Receive ticket
→ Show QR
→ Check in
→ Receive credential
→ Open Event Passport
→ Verify credential
```

The mobile app should feel like a real consumer product, not a web page inside a mobile wrapper.