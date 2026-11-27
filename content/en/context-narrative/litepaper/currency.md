---
private: false
access: participant
---

<iframe width="100%" height="515" src="https://www.youtube.com/embed/OLnig-WX2pY?si=uv0xyveQO76LJZZG&amp;start=168" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Value flows from external demand into the system, attributed via demand adaptors, weighted by participation, aggregated across hubs, and distributed as surplus to liquidity providers according to contribution and capital exposure.

## Addressing Value Plurality

Every team generates impact in different units trees planted, waste recycled, medicines delivered. Converting those into a common internal unit was the unsolvable problem.

The resolution: projects must generate real revenue in their environment. Financial capital is already the common denominator. The demand adaptor $A_{h,i}$ maps actual economic events payments, contracts, transactions — directly into a dollar-denominated demand signal. No conversion. No philosophical translation layer.

> Initial funding activates a local economy. As that economy grows, a fraction of surplus flows back to funders. The same machine runs across every project in the network.

## Currency units

Four units. Each is a structured, verifiable claim on a specific type of value. None are tokens. None are speculative.

| Unit | Name | What it measures | Source |
|------|------|-----------------|--------|
| **TU** | Trust Unit | Verified consistency over time | $A \cap B$ held across the validation graph — non-transferable, context-bound, time-decaying |
| **SU** | Signal Unit | Predictive pattern stability | Low variance in TU over a rolling window — gates capital access at individual, team, and hub level |
| **ET** | Engagement Token | Community-validated interaction | $A$ (participation) — daily users, breadth, repeat engagement, passive validation |
| **IC** | Impact Credit | Outcomes-based value | $B$ (outcomes) — community coherence first, independent verification for capital-grade claims |

$$
C_1 = f(\text{ET}, \text{IC}, \text{TU}) \quad \text{only if } SU \geq \theta
$$

Team DAO currency. Flows to $C_2$ (hub) and $C_3$ (network) only when the SU gate clears.

## Equations

### Participation and demand

$$
p_{h,i} \in \mathbb{R}^+
$$
Standardised participation level of team $i$ in hub $h$. The internal signal — what the team does inside the network.

$$
d_{h,i} = A_{h,i}(E_{h,i})
$$
Demand signal from adaptor $A_{h,i}$, mapping economic events $E_{h,i}$ — payments, contracts, transactions — into a dollar-denominated value. The external signal — what the project does in the world.

$$
c_{h,i} = p_{h,i} \cdot d_{h,i}
$$
Contribution signal. Participation without demand scores low. Demand without participation scores low. Both must be present.

### Hub aggregation

$$
w_{h,i} = \frac{c_{h,i}}{\sum_{j \in T_h} c_{h,j}}
$$
Normalised weight of team $i$ within hub $h$. Relative, not absolute — proportional to peers.

$$
\sum_{i \in T_h} w_{h,i} = 1
$$
All team weights within a hub sum to one.

$$
s_h = \sum_{i \in T_h} d_{h,i}
$$
Total economic magnitude of hub $h$. The hub's real-world footprint.

$$
\Delta_{h,i} = s_h \cdot w_{h,i}
$$
Scaled contribution of team $i$. A team with 30% weight in a hub generating \$10,000/month demand receives $Delta = \$ 3,000$ in attributed contribution.

### Network aggregation

$$
\Delta_{\text{total}} = \sum_{h \in H} \sum_{i \in T_h} \Delta_{h,i}
$$
Total network value — the sum of economic activity across all teams in all hubs.

$$
\Delta_{\text{total}} = \sum_{h \in H} \sum_{i \in T_h} \left( s_h \cdot w_{h,i} \right)
$$
Expanded form. Each term is traceable to a specific team in a specific hub.

### Surplus and distribution

$$
I = \sum \text{external payments}
$$
Total inflow from external sources — customers, users, markets.

$$
O = \sum \text{team payouts}
$$
Total outflow to teams, governed by $\Delta_{h,i}$ weights.

$$
S = I - O
$$
Network surplus. The pool from which liquidity providers receive dividends.

$$
S \geq 0
$$
Hard constraint. The system cannot distribute more than it receives.


$$
L_0 = \sum_{k \in K} L_k
$$
Total initial capital from all liquidity providers. Activates local economies before organic revenue exists.

$$
\lambda \in [0,1]
$$
Governance parameter. Fraction of surplus allocated to liquidity providers. Determines the RPC return profile.
$$
S_{LP} = \lambda \cdot S
$$
LP surplus share. Signal = dividend. This is what the Revenue Participation Certificate pays out.

$$
\sum \text{payouts} \leq I + L_0
$$
Solvency constraint. Total payouts cannot exceed available funds.


## Revenue Participation Certificate

The RPC is not equity. It is not a token. It is a structured claim on $\lambda \cdot S$ — a defined fraction of network surplus generated as projects activate and grow local economies.

Capital flows into the network as a whole, not into individual projects. A single financial instrument backed by the aggregate economic activity of every hub.

**What it is:**
- A claim on $\lambda \cdot S$ denominated in financial capital from day one
- Backed by real revenue from real projects in real markets
- Auditable and traceable to specific hub and team demand signals
- Signal = dividend — SU stability determines payout confidence

**What it is not:**
- Not equity or project ownership
- Not a speculative token
- Not a grant
- Not convertible from domain-specific measurements

## Validation protocol

PRISMA does not verify facts. It verifies coherence over time across relationships.

In contexts without central records or stable institutions, truth survives through consistency, witnesses, repetition, and consequence — not paperwork. The validation protocol encodes that.

**Temporal coherence.** A claim gains validity by persisting across time windows without contradiction. Claims that appear suddenly and vanish are penalised. Long memory is rewarded.

**Relational validation.** Confirmations from nodes with low graph proximity carry higher weight — this eliminates collusion and elite capture. Authority is contextual: health workers validate health, traders validate markets.

**Consequence validation.** If a claim predicts outcome $O$ and $O$ occurs within $\Delta t$, the claim receives a retroactive trust boost. Truth is validated after the fact, not upfront. Claims that are costly to make — reputationally, socially — are weighted higher.

**Context locking.** Claims are invalid outside their declared context: $\text{location} \in L$, $\text{time} \in T$, $\text{domain} \in D$. If the environment shifts — policy, climate, conflict stale claims are auto-invalidated.

**Collective coherence.** A claim must fit the local narrative graph. If it increases graph entropy, it is flagged. Silence without contradiction is passive validation — silence is data.

## Three mechanisms

**Ancestral Time Index.** Claims tied to long-standing generational patterns receive a trust multiplier. $\text{Trust} \propto \text{recurrence across generations}$. Enables historical legitimacy and long-memory capital.

**Truth without identity.** Claims can be anonymous but verifiable via graph coherence. Verification comes from structure, not identity — protecting whistleblowers and participants in conflict zones.

**Fractal verification.** Verification at micro, meso, and macro levels. Claims valid at one level do not auto-propagate upward. Prevents extractive narratives and capital misinterpretation.


## Value flow
Economic events at network edge
↓
Demand adaptor A(h,i) → d(h,i)
↓
Contribution signal c(h,i) = p(h,i) · d(h,i)
↓
Team weights w(h,i) → Hub magnitude s(h)
↓
Network total Δ_total
↓
Surplus S = I − O
↓
S_LP = λ · S → Revenue Participation Certificate

This is a trust infrastructure that converts contextualised graph data into verifiable financial signals.