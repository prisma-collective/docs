---
sidebarTitle: Feedback Summary
---

# DIDs & VCs - Feedback Summary

This summary draws on **two feedback sources**: structured pilot observations from the `enrol` and `docs-secret` implementations (M3B Pilot Implementation Report), and ongoing submissions via the [community feedback form](/processes/enrolment/dids/community-feedback). A webhook notifies the enrolment channel in Prisma internal comms on every form submission, so new input can be reviewed and acted on quickly.

## Pilot implementation feedback

Testing on `register.prisma.events` and role-gated docs surfaced three recurring themes, each with a product response:

| Theme | Adaptation |
| ----- | ---------- |
| On-chain DID issuance blocked enrolment completion | DID preference is captured at enrolment; issuance is deferred and prompted later |
| Requiring a connected wallet before profile creation | Exploring a non-custodial wallet partnership for in-flow provisioning |
| Wallet-connect prompts on gated docs were unclear | Clearer unlock guidance and links to wallet tutorials |

## Community feedback

Recent form responses highlight UX and integration opportunities beyond the pilot scope:

- **In-app continuity:** Opening the DID dashboard in a separate tab and navigating back manually feels clunky; users should not need to leave the host app to complete identity tasks.
- **VC workflow integration:** Prisma VCs currently reads as a standalone app. DIDs are already embedded sensibly in registration; respondents want to see VCs used in the same way across other apps and workflows.

## Outlook

VC implementation is **in progress** and is required for contributor contract issuance in Prisma. As that use case goes live, we expect the community feedback form to yield additional responses in the coming days and weeks, complementing the pilot findings above and keeping the feedback picture current.
