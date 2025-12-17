---
title: MVP & Demo
sidebarTitle: MVP & Demo
---

## Problem
Cardano offers secure, low-cost infrastructure for payments, staking, and DeFi, but everyday users struggle to access these capabilities in intuitive ways. Existing Cardano wallets are technically sound yet poorly aligned with how users in emerging markets actually interact with digital tools. As a result, interest in Cardano's staking and DeFi ecosystem does not translate into sustained, real-world usage. Communities already organize, learn, and coordinate financial activity through familiar messaging platforms, creating a gap between Cardano's capabilities and user behavior. There is an opportunity to expand Cardano adoption by rethinking wallet access as a behavior-layer problem, not a blockchain problem—removing the primary barrier to adoption which is the need to learn new interfaces, download unfamiliar apps, or change existing behaviors.

## MVP

### Scope
Zeno Wallet is a Cardano-native Telegram wallet that brings blockchain functionality directly into the environment where users already live, learn, and transact, featuring:
- **Conversational Interface:** Users interact with Cardano wallet through simple text commands and button prompts within Telegram chat, translating complex blockchain actions (send, stake, check balance) into familiar chat-based flows
- **Seamless Integration:** Wallet lives where crypto conversations happen with no context switching, no separate app downloads, no unfamiliar UI patterns—users check balances, send ADA, and manage stakes without leaving Telegram groups
- **Low-Friction Onboarding:** New users set up Cardano wallet in seconds using familiar Telegram authentication with bot guiding through secure setup using clear simple language and no technical jargon
- **Full Cardano Functionality:** Token balance queries (`/balance`), peer-to-peer transfers (`/send`), staking delegation (`/stake`), DeFi interactions (`/farm`), transaction history and notifications
- **Community-Centric Design:** Built for group dynamics supporting shared announcements, group payments, referral mechanics, and social proof within existing Telegram communities
- **Security Without Complexity:** Two-factor authentication by default, clear security indicators, transparent recovery mechanisms, and user-friendly guides for wallet backup and restoration

### Cardano Integration
Zeno Wallet leverages three-layer architecture: Telegram Bot API for user interactions with conversational UI and command handlers, Python/Node.js backend hosting bot handlers for business logic and session management, and Cardano interaction layer using Blockfrost API for reliable blockchain data querying (balances, transaction history), Aiken Smart Contracts for managing on-chain logic (staking, farming), and MeshSDK for wallet operations and transaction building. This solves adoption not by improving blockchain technology but by meeting users where they already are—in their daily communication platform. Designed specifically for users in Nigeria and similar markets where Telegram is the primary crypto coordination layer, mobile-first experiences are essential, trust in bot interfaces exceeds trust in standalone apps, and group dynamics drive financial decisions. Telegram communities are trust networks—when one member adopts Zeno Wallet, the entire group sees it in action creating organic social-proof-driven adoption, enabling a future where Cardano wallets are as easy to use as sending a message, staking and DeFi are accessible to non-technical users, Telegram communities become Cardano onboarding channels, and blockchain functionality integrates seamlessly into daily digital life.

## 🎥 Pitch
<iframe
  src="https://www.loom.com/embed/26bfa17970474828a7335af4028c730f"
  width="100%"
  height="480"
  style={{ border: 0 }}
  allow="autoplay; fullscreen"
  allowFullScreen={true}
></iframe>

## 🎥 Demo
<iframe
  src="https://www.loom.com/embed/73de36fc4c4e4ab49c4aa57d862812b2"
  width="100%"
  height="480"
  style={{ border: 0 }}
  allow="autoplay; fullscreen"
  allowFullScreen={true}
></iframe>

## 🔗 Links
- **Deployment:** [Launch App](https://zeno-gmrr.onrender.com)
- **GitHub:** [View Code](https://github.com/osazeejedi/zeno)