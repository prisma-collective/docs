<iframe width="100%" height="515" src="https://www.youtube.com/embed/w86RPFpbwPM?si=jM0inwqCdp0IS9Av" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# Prisma DIDs & Prisma VCs User Guide

**Creating and managing decentralized identities and verifiable contributions**  
Version 1.0 — Prototype user guide

## About this guide

This guide explains how to use Prisma DIDs and Prisma VCs together. Prisma DIDs enables users to create and manage a wallet-linked decentralized identifier (DID). Prisma VCs enables organisations and individuals to create, review, approve, reject, share, and verify verifiable contribution credentials linked to those identities.

> **Important:** This guide describes the documented Prisma prototype flow. DID revocation is permanent for the associated wallet. Use testnet tokens and do not enter sensitive information into prototype credentials.

---

## 1. About Prisma

Prisma DIDs and Prisma VCs are connected applications for decentralized identity and verifiable contributions. A DID provides the identity layer; a verifiable credential records a specific action, contribution, or achievement associated with that identity.

Prisma DIDs uses an indexer to filter and identify decentralized IDs created for different applications and use cases. Prisma VCs uses DIDs to identify the issuer of a credential and its holder.

The documented prototype operates in the Cardano pre-production/testnet environment. Use testnet tokens only and do not use sensitive real-world information in prototype credentials.

---

## 2. Key concepts

- **Decentralized identifier (DID):** A wallet-linked identifier that can be created and managed in Prisma DIDs.
- **Issuer:** The person or organisation that creates and issues a verifiable contribution.
- **Holder:** The person to whom a verifiable contribution is issued.
- **Verifiable contribution / credential:** A record of an action, contribution, or achievement, such as work completed for an organisation.
- **Selective disclosure:** The ability to choose which credential information is included when sharing a credential.
- **Indexer:** The system that filters and identifies DIDs for applications and use cases.
- **TxHash:** The transaction hash for a Cardano transaction. Selecting it opens the corresponding blockchain transaction.
- **IPFS / PFS metadata storage:** Storage used for DID and credential metadata.

---

## 3. Before you begin

1. Open the Prisma DIDs or Prisma VCs application in a supported browser.
2. Install and set up a supported Cardano wallet. The demonstrations use Typhon and Eternal; the interface detects supported wallets available in the browser.
3. Ensure that you are using the intended Cardano pre-production/testnet environment and that the wallet has the required testnet tokens for the prototype flow.
4. Have the information needed for any contribution ready: the holder DID, contribution description, hours or other quantity, and an evidence URL where relevant.

---

## 4. Create and manage a DID

1. Open the Prisma DIDs application.
2. Choose the option to connect a wallet, then select a supported wallet and approve the connection request in the wallet.
3. If the connected wallet already has a Prisma DID, the interface detects it through the Prisma indexer and displays the associated identity.
4. If the wallet does not yet have a DID, follow the interface flow to generate and register one. Review and approve the wallet request required by the application.
5. After creation or connection, review the DID details displayed in the interface. The view may include:
   - DID
   - Current status
   - Indexer version
   - Last action
   - Metadata storage reference
   - Indexer endpoint
   - Latest TxHash
6. Select the TxHash to open the corresponding Cardano transaction.

---

## 5. Update or revoke a DID

### Update a DID

Prisma DIDs provides an advanced option for changing the indexer associated with an identity. This may be relevant when an organisation forks the system or runs its own indexer for a specific service or use case.

Verify the new configuration before approving the update.

### Revoke a DID

> **Warning:** DID revocation is permanent.

Revocation permanently destroys the identity associated with the connected wallet. After revocation, another Prisma DID cannot be created with that same wallet. A different wallet is required to create a new identity.

Do not revoke a DID unless you understand and intend this permanent outcome.

---

## 6. View credentials

1. Open the Prisma VCs application and select **My Credentials**.
2. Connect a supported wallet and approve the connection request.
3. The application displays credentials that have already been issued to the connected wallet.
4. Open a credential to review its available details. These can include:
   - Contribution description
   - Completed hours
   - Evidence URL
   - Cardanoscan transaction link
   - IPFS metadata information
   - Issuer DID
   - Holder DID

The **issuer** is the party that created the credential. The **holder** is the party to whom it was issued.

---

## 7. Issue a credential

1. Open the credential-issuance flow in Prisma VCs.
2. Select the DID to associate with the credential and identify the intended holder DID.
3. Enter the contribution details.

For example:

> John worked 15 hours for Organisation Y on a code contribution.

4. Add evidence, such as a URL supporting the contribution, when available.
5. Choose which information should be available for disclosure. By default, credential information is stored on IPFS and can remain hidden until selected for disclosure.
6. Submit the credential for issuance.
7. Approve the IPFS pinning signature request in the wallet.
8. Approve the Cardano transaction-signature request to submit the credential transaction.
9. Record the TxHash provided by the application. Return to **My Credentials** to locate the new contribution.

---

## 8. Holder approval or rejection

When an organisation issues a contribution to another person, the holder receives a request in their connected wallet.

1. The holder reviews the issuer, work description, reported hours or achievement details, organisation information, and any linked evidence.
2. If the information is correct, the holder signs the wallet request to approve the contribution.
3. If any information is false, incomplete, or inaccurate, the holder rejects the signature request.

This consent-based flow helps ensure that a contribution is not holder-approved unless the person named in the record has reviewed and accepted it.

---

## 9. Privacy and selective disclosure

1. Open the relevant credential and select the information that should be disclosed.
2. Use selective disclosure to avoid revealing information that is not needed for the intended verifier.
3. Review the selected information before generating a sharing link.

For example, a holder may share contribution details while withholding the organisation name or other sensitive fields.

---

## 10. Share and verify credentials

### Share a credential

1. Open the credential.
2. Select the fields to disclose.
3. Generate a share URL.
4. Send the URL to the intended recipient.

### Verify a credential

When a recipient opens the share URL, they are taken to the Prisma VCs application, where the credential can be independently verified.

The verification view checks:

- Credential format
- Credential signature
- On-chain status
- Revocation status
- Whether the credential is active

In the Cardano pre-production environment, a newly issued credential can remain pending while the transaction is being confirmed. The credential may be created before its on-chain status is available.

After confirmation, a valid credential should show a valid format and signature, a valid on-chain status, no revocation, and an active state.

---

## 11. Troubleshooting and safe use

### Wallet does not appear

Confirm that a supported Cardano wallet extension is installed, enabled, and unlocked, then refresh the application.

### DID is not detected

Confirm that the correct wallet is connected and allow time for the indexer to detect the DID.

### Transaction or signature request is not visible

Check the connected wallet for a pending request. Do not submit duplicate requests while waiting.

### Credential is pending verification

Wait for the Cardano pre-production transaction to be confirmed, then refresh the credential status.

### Credential information is incorrect

Reject the holder signature request rather than approving inaccurate information.

### Permanent DID revocation

Do not revoke a DID as a troubleshooting step. Revocation is permanent for that wallet.

### Prototype notice

The applications described here are a prototype. Use testnet tokens and avoid sensitive or personally identifying real-world information unless the project’s privacy process specifically permits it.

---

## 12. Feedback and support

Use the project’s designated community feedback channel to report issues, suggest improvements, or share onboarding feedback.

When reporting an issue, include:

- The relevant application: Prisma DIDs or Prisma VCs
- The action being attempted
- The wallet used
- The TxHash, when available
- A clear description of the result

Project administrators should moderate feedback channels and incorporate relevant findings into future refinements.

## Suggested screenshots

Add screenshots for the following steps before publishing the guide:

- Wallet-selection screen
- DID creation and DID-details screen
- Indexer-update screen
- DID-revocation confirmation warning
- **My Credentials** list
- Credential-details screen
- Credential-issuance form
- Selective-disclosure controls
- IPFS pinning and Cardano-signature requests
- Share-URL generation
- Credential-verification status screen

## Project links

- Prisma DIDs dashboard: https://dids-dashboard-production.up.railway.app/
- Prisma VCs dashboard: https://vcs-dashboard-production.up.railway.app/
- Source repository: https://github.com/prisma-collective/Dids
