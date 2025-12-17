---
title: Zeno Wallet
---

# Zeno Wallet

**Country:** Nigeria

---

## 👥 Team Members

- **Osazee Oghagbon** — Team Lead
- **Onunkwor Chidimma Bridget** — Team Member

---
## Project Links

- **Pitch Recording:** [View Pitch](https://www.loom.com/share/26bfa17970474828a7335af4028c730f)
- **Live Demo Recording:** [View Demo](https://www.loom.com/share/73de36fc4c4e4ab49c4aa57d862812b2)
- **Deployment Link:** [Launch App](https://zeno-gmrr.onrender.com)
- **GitHub Repository:** [View Code](https://github.com/osazeejedi/zeno)

## Pages

- 🎨 [Community Essence Map](/Teams/zeno-wallet/community-essence-map)
- 🗺️ [Stakeholder Map](/Teams/zeno-wallet/stakeholder-map)
- 💭 [Team Reflection Summary](/Teams/zeno-wallet/reflection-summary)

---

## Project Overview

### Problem Statement

Cardano offers secure, low-cost infrastructure for payments, staking, and DeFi, but everyday users struggle to access these capabilities in intuitive ways.

Existing Cardano wallets are technically sound yet poorly aligned with how users in emerging markets actually interact with digital tools. As a result, interest in Cardano's staking and DeFi ecosystem does not translate into sustained, real-world usage.

Communities already organize, learn, and coordinate financial activity through familiar messaging platforms, creating a gap between Cardano's capabilities and user behavior.

**There is an opportunity to expand Cardano adoption by rethinking wallet access as a behavior-layer problem, not a blockchain problem.**

### Solution Summary

**Zeno Wallet** is a Cardano-native Telegram wallet that brings blockchain functionality directly into the environment where users already live, learn, and transact.

Instead of requiring users to download separate applications, manage complex seed phrases through unfamiliar interfaces, or leave their primary communication platform, Zeno Wallet embeds full Cardano wallet capabilities—balance checks, transfers, staking, and DeFi interactions—directly into Telegram through an intuitive bot interface.

#### Core Features:

**Conversational Interface**  
Users interact with their Cardano wallet through simple text commands and button prompts within Telegram chat. Complex blockchain actions (send, stake, check balance) are translated into familiar, chat-based flows.

**Seamless Integration**  
The wallet lives where crypto conversations happen—no context switching, no separate app downloads, no unfamiliar UI patterns. Users can check balances, send ADA, and manage stakes without leaving their Telegram groups.

**Low-Friction Onboarding**  
New users can set up a Cardano wallet in seconds using familiar Telegram authentication. The bot guides users through secure setup with clear, simple language—no technical jargon required.

**Full Cardano Functionality**  
- Token balance queries (`/balance`)
- Peer-to-peer transfers (`/send`)
- Staking delegation (`/stake`)
- DeFi interactions (`/farm` - where applicable)
- Transaction history and notifications

**Community-Centric Design**  
Built for group dynamics—supports shared announcements, group payments, referral mechanics, and social proof within existing Telegram communities.

**Security Without Complexity**  
Two-factor authentication (2FA) by default, clear security indicators, transparent recovery mechanisms, and user-friendly guides for wallet backup and restoration.

---

## Technical Infrastructure

### Architecture

Zeno Wallet is built on a three-layer architecture:

**1. Telegram Layer (User Interface)**  
- Telegram Bot API for user interactions
- Conversational UI with command handlers
- Button-based prompts for confirmations

**2. Bot Server (Application Logic)**  
- Python/Node.js backend hosting bot handlers
- Business logic for transaction processing
- User session management and authentication

**3. Cardano Interaction Layer**  
- **Blockfrost API:** For reliable blockchain data querying (balances, transaction history)
- **Aiken Smart Contracts:** For managing on-chain logic (staking, farming)
- **MeshSDK:** For wallet operations and transaction building

**Visual Flow:**  
```
Telegram → Bot Server → Cardano (Blockfrost / Aiken)
```

---

## Core Command Flows

| Command | Description | User Experience |
|---------|-------------|-----------------|
| `/start` | Initial onboarding | Welcome message, wallet setup, main menu |
| `/balance` | Check token holdings | Instant display of current ADA and token balances |
| `/send` | Transfer tokens | Enter recipient, amount, confirm transaction |
| `/stake` | Delegate to staking pool | Select pool, confirm stake amount, success notification |
| `/farm` | Yield farming interactions | Deposit/withdraw liquidity, claim rewards |

---

## Strategic Value

**Behavior-Layer Solution**  
Zeno Wallet solves adoption not by improving blockchain technology but by meeting users where they already are—in their daily communication platform.

**Frictionless Access**  
Removes the primary barrier to Cardano adoption: the need to learn new interfaces, download unfamiliar apps, or change existing behaviors.

**Community-Driven Growth**  
Telegram communities are trust networks. When one member adopts Zeno Wallet, the entire group sees it in action—creating organic, social-proof-driven adoption.

**Emerging Market Optimization**  
Designed specifically for users in Nigeria and similar markets where:
- Telegram is the primary crypto coordination layer
- Mobile-first experiences are essential
- Trust in bot interfaces exceeds trust in standalone apps
- Group dynamics drive financial decisions

---

## Impact Vision

Zeno Wallet enables a future where:

- Cardano wallets are as easy to use as sending a message
- Staking and DeFi are accessible to non-technical users
- Telegram communities become Cardano onboarding channels
- Blockchain functionality integrates seamlessly into daily digital life
- Nigerian users lead Cardano adoption through familiar, trusted platforms

**The wallet should live where learning happens, not as a separate destination.**

---

## Project Links
- **Pitch Recording:** [View Pitch](https://www.loom.com/share/26bfa17970474828a7335af4028c730f)
- **Live Demo Recording:** [View Demo](https://www.loom.com/share/73de36fc4c4e4ab49c4aa57d862812b2)
- **Deployment Link:** [Launch App](https://zeno-gmrr.onrender.com)
- **GitHub Repository:** [View Code](https://github.com/osazeejedi/zeno)

