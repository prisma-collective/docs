---
sidebarTitle: Stakeholder Consent & Scripts
---

# Stakeholder Consent: Choices, Withdrawal and Read-Aloud Scripts

The people we interview are trusting us with their words. This page sets out how every interviewer across the three Regional Hubs (Lagos, Nairobi and Buenos Aires) explains the options, records consent before anything is recorded, and makes it easy for a participant to change their mind later.

---

## 1. Four rules for every interview

**Consent comes first, recording second.**
Explain the choices in plain language. Let the participant decide. Log the choice before you start the recorder or take structured notes. Inside the Hub Vault, every new recording starts as Private. A reviewer can keep the participant's choice or make it stricter. Making it more open needs fresh consent from the participant.

**Anything less than fully public stays in the vault.**
Records written to a public repository on [ATProto](/en/processes/process-infrastructuring/publishing/atproto) are copied across the network and can be read by anyone. So raw recordings, unredacted transcripts, contact details, and every Private or Research interview stay in the hub's encrypted vault. Even when a participant chooses a public option, the original audio and video never leave the vault.

**Every participant gets a withdrawal reference number.**
At the start of the interview, give the participant a short reference number, for example WA-LOS-REG-02. With it they can withdraw at any time, under any of the four choices, without giving their name again. Withdrawal removes their files from the vault and from server backups, and deletes any public record. All raw recordings and transcripts are deleted within 12 months of the project ending in any case.

**Redact other people too.**
If the participant mentions someone else by name, or gives a phone number or email, even in disguised form such as "john dot doe at...", it must be removed before the record can be approved as Research or Anonymous public. The vault will not allow an anonymous approval while anything it detected is still visible.

---

## 2. The four choices (with 1:1 Milestone 1 mapping), plus one separate question

We offer four clear consent choices and one separate yes-or-no question about external AI model training. The table below shows how the four choices map 1:1 to our Milestone 1 research design so the documentation, the Hub Vault review screen, and the codebase share one vocabulary:

| Choice | 1:1 Mapping to Milestone 1 Research Design | Is the person named? | Who can see it | What is shared | Where it lives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Private** (safe default) | **Vault-Only Safe Default** | Only inside the vault | The interviewing team and the hub's vault reviewer | Nothing leaves the hub. The recording and notes are used only to calibrate our scoring. | Hub Vault only (`apps/vault`) |
| **2. Research** | **Confidential Synthesis** | No | The Cardano Product Committee and authorised researchers | An edited, anonymous transcript and structured findings | Hub Vault only, read through an authenticated login |
| **3. Anonymous public** (recommended for field evidence) | **Role-Only Anonymised** | No | Anyone | Approved anonymous quotes and role-level findings (`consentScope: "anonymous"`) | The team's public repository. The recording and full transcript stay in the vault. |
| **4. Public named** | **Full Attribution** | Yes, with name, role and organisation | Anyone | Only the statements the participant approves (`consentScope: "public"`) | The team's public repository. The recording stays in the vault. |

**Publishing hold until the consent specification and pilot filter are locked.** While teams record each participant's consent choice before the interview begins, **all real interviews uploaded from 21 November onwards remain held strictly as `Private` inside the encrypted Hub Vault until the final consent specification (including the five privacy and redaction safeguards on withdrawal, backup purging, authorised researcher access, third-party redaction, and read-aloud scripts) and the pilot server filter step are formally locked**. Because any record published to an AT Protocol repository is permanent, no real interview is published out of the vault under provisional rules.

**The separate AI question.** We ask whether the participant's anonymised words may be used to train external AI models in future. The default answer is No. This is separate from the transcription and redaction our hub server does automatically, which runs locally and does not send anything to outside AI companies.

**Who counts as an authorised researcher under Research?**
Two groups only. First, the CPC and Intersect reviewers assessing this grant's deliverables. Second, named PRISMA synthesis researchers approved in writing by both the Project Lead, [Alfred Itodole](/en/collaborators/core/business-development/alfred), and the Hub Lead holding the record. No outside researcher ever has access to original audio or video.

**If a participant withdraws after choosing a public option**, we delete everything we hold from the Hub Vault and server backups, and publish a deletion notice to the repository. Copies or screenshots someone else made while the record was public cannot be recalled, and the read-aloud script says so.

---

## 3. Read-aloud scripts (under 60 seconds)

Read the opening and the four options before you start the recorder. Then log the choice and give the participant their reference number.

> **Opening**
> "Thank you for speaking with us for this regional technology and market study, commissioned by the Cardano Product Committee. Before we begin, you choose how your words are handled. We will give you a reference number, [reference number], so you can change your mind or ask us to delete your record at any time."

> **Option 1, Private (default)**
> "If you choose Private, your recording and notes stay locked in our hub's encrypted vault, for our small team's internal scoring only. Nothing you say is quoted or shared outside the hub."

> **Option 2, Research**
> "If you choose Research, we remove your name, contact details and anything that could identify you. We share only the edited, anonymous transcript with the Cardano Product Committee and authorised project researchers, from inside our secure vault. It is never put on the public internet."

> **Option 3, Anonymous public**
> "If you choose Anonymous public, we remove your name and every identifying detail, and publish only approved anonymous quotes and summary findings in the public research record."

> **Option 4, Public named**
> "If you choose Public named, we publish only the statements you approve, alongside your name, title and organisation."

> **AI question and withdrawal**
> "Our own server transcribes and redacts interviews privately, without training outside AI. Separately, may your responses be used to train AI models in future? Unless you say yes, we mark No. You can withdraw at any time with your reference number, and we will delete your files from our vault and backups. If you choose a public option, copies made by others while it was public cannot be recalled."

---

## 4. What we record at intake

**Kept only in the encrypted Hub Vault, never published:**

1. The withdrawal reference number
2. The participant's name, title, organisation and contact channel
3. The consent choice (`Private`, `Research`, `Anonymous public`, or `Public named`)
4. The AI training answer (No by default)
5. How the interview was captured (audio or video, notes only, or written questions plus a call) and the time consent was given

**Published only for Anonymous public (`consentScope: "anonymous"`) and Public named (`consentScope: "public"`), once the consent specification and pilot filter gates are locked:**

1. The withdrawal reference number, built from region, hub, question pack and sequence
2. The region and the hypothesis being tested
3. The respondent category and the person's role in the decision chain
4. Whether the organisation is independent of Cardano
5. The `consentScope` (`"anonymous"` or `"public"`) and the `media.sha256` fingerprint of the vault file, so the record can be checked against the original without exposing it
6. Redacted findings in `text`, the proposed adoption-signal tier, the regulatory certainty rating and the reviewer's wallet identifier (`authorDid`)

In `at-pds` and `at-tap` today, the working interview record structure is `events.prisma.evidence.interview` ([PRISMA Lexicons](https://github.com/prisma-collective/at-tap/tree/main/lexicons/events/prisma/evidence)). The final interview record Lexicon namespace is currently being finalised by the Infrastructure Lead (Tobias Fechner) to incorporate `eventId` directly into the namespace, and extended research analysis fields will follow in a dedicated Lexicon pull request once the core namespace is locked.
