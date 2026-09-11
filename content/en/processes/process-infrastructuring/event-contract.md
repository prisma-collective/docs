---
sidebarTitle: Event Contract
---

# Event contract

This page is a short implementation plan for the **event contract**: the authoritative instrument that makes a federated network legible across heterogeneous environments. For a network's actors to keep local autonomy while coordinating as one whole, the network must reliably interpret diverse signals of participation. The event contract assembles that legibility specification — a temporary interpretation capacity for the purposes of the event — so the network can intelligently allocate capital to network edges without prescribing how those edges operate. Edges remain free to define what is locally relevant; the contract keeps the network legible and coherent as one coordinated whole.

## Fundamentals

The contract is not a parallel configuration universe. It is an **assembler** of infrastructure and app manifests. Each app owns its own **domain-specific resolution definitions** ([resolvers](/processes/process-infrastructuring/publishing/timelining/resolver-examples)). Those definitions include **adaptor configs**, which manifests make available for the contract to consume. Adaptors translate resolved nodes into the contract's accounting terms, enabling adaptive distribution pathways from the event contract to network edges (potentially via the network and hub layers, for integrity). Adaptor implementation is the outstanding detail for the first build (MVP) of the event contract.

**Indexing** is the interpretation interface scoped to a given hub organisational context: each hub maintains an index of all local teams' adaptor outputs. The hub owns adaptor integrations as an ongoing governance process.

The organising pattern and publishing stack are one fractal unit, repeating at multiple scales. That common patterning improves coordination across sovereign spaces and enables coherence and interpretation of data — the context in which manifests, resolvers, and adaptors compose into the contract.

The model has five layers: **capital partners → event contract → network → hubs → local teams**. From network down to teams, each layer is a **deployment surface** — operated by us as a service, or by participants via self-hosting. Each surface may host multiple apps that compose into the contract, and may span multiple distinct cloud environments. Local teams are also called **network edges**; that layer may be mobile-first and peer-centric, and may run pure p2p apps.

The event contract therefore defines the **compatibility requirements for federation** across this stack. Protocol and event contract are inseparable: protocol is the backbone for making organising data legible to other apps, including for aggregating heterogeneous value across the network (see [Protocol](/collaborators/pricing/protocol)).

![indexing](/indexing.png)

## Model
### Capital partners

Capital commits at the network scale through the event contract, while internal structure can restructure as edges adapt. Downstream liquidity is capital entering via the contract and being dynamically allocated toward local teams; upstream liquidity, where networks aim for return, is created through revenue-sharing toward contract redemptions. The contract is the simplified financial surface that contains the complexity of the whole network.

### Event contract

Due to the fractal unit of organising pattern plus publishing stack, which repeats at network, hub, and edge scales, each publishing stack is innately compatible with the event contract. The publishing stack is modular and composable; the apps documented elsewhere — docs, timelining, enact, enrol, evaluate — are **examples** of participation primitives that can compose into the contract, not a closed set. A marketplace of such apps is expected. This is an open protocol: other coordination apps can integrate if they register to the contract and publish signals that can be interpreted and adapted into the common, network-wide accounting substrate the contract specifies.

Assembly draws on concrete inputs already present in the publishing and propagate stack:

**Infrastructure manifests** ([Propagate](/processes/process-infrastructuring/propagate), [Manifests](/processes/process-infrastructuring/propagate/manifests)) describe event-scoped deployment intent. `stack.yaml` binds client, event dates, DNS `eventCode`, provider targets, and the app list. `values.yaml` holds capability secrets. `resolved.json` is the validated capability graph and deploy order. A planned `federation.yaml` will hold DID identity, parent-child relationships, and network policies — deferred in the current CLI, but part of the same manifest family the contract must eventually assemble.

**App manifests** (`app.manifest.yaml` at each app root) declare stable capability IDs: what an app `provides` and `requires`, plus `dependsOn` and deploy hooks. URLs follow `{appSlug}.{eventCode}.{hostName}`. Capability IDs are the cross-environment contracts; env var names are per-environment implementations.

**Resolution definitions** live in sovereign apps. As an example path: timelining's [`organising.config.ts`](/processes/process-infrastructuring/publishing/timelining/organising-config) maps Telegram topics to sibling domains and resolve paths; sibling resolvers own schema extraction and domain graph writes against a shared hub Neo4j ([resolver boundary](/processes/process-infrastructuring/publishing/timelining/resolver-examples)). Enrol, enact, and evaluate illustrate domain ownership — not the only possible primitives.

**Adaptor configs** sit inside those apps and are surfaced by manifests for the contract to consume. They translate resolved nodes into contract accounting terms so adaptive distribution pathways can allocate capital to network edges. Integrating adaptor outputs into allocation intelligence that leads to settlement is the **key validation** of the first build of the event contract.

### Network

The network is the federated deployment surface spanning multiple hubs. Compatibility lives here: shared capability IDs, host/DNS conventions, and (when implemented) federation identity and policy. Propagation can be managed as a service or self-hosted; both are valid surfaces under the same contract.

Scale is already demonstrated. During CATS, dozens of app deployments landed across roughly thirteen distinct cloud environments within a short window ([Case study](/patterns/case-study)) — the complexity the contract must make legible without collapsing hub sovereignty.

### Hubs

Hubs are place-scoped publishing stacks provisioned by propagate (Pulumi across GitHub, Vercel, Railway, and related providers). A hub stack shares infrastructure across apps (for example Neo4j across timelining and resolvers) and wires them through capabilities. After propagate, domains and resolve paths become hub-specific while structure stays stable. Through indexing, the hub owns ongoing governance of adaptor integrations for its local teams.

### Local teams (network edges)

Local teams are deployment surfaces downstream of hubs. They may host apps that compose into the event contract. This layer may be mobile-first and peer-centric, and may run pure p2p apps. The contract does not define how edges must operate: edges publish signals that are locally relevant; allocation and settlement return through the contract using each edge's own resolution definitions, with network and hub layers available as integrity-preserving hops.

## Scope and feasibility

The first build (MVP) of the event contract should compose what already works — stack and app manifests, capability resolution, organising-config routing, and resolver ownership — with **adaptor implementation** and hub-scoped **indexing**, so allocation intelligence can integrate adaptor outputs and lead to settlement. Success criteria: network edges receive settlement using their own resolution definitions, which requires protocol compatibility with the contract's accounting substrate.

Still out of scope for that first build: implementing `federation.yaml`, full capital-partner redemption mechanics beyond the settlement path under test, and prescribing edge or p2p stack architecture.

Feasibility rests on lower layers already being operable. Propagate validates and applies real stacks; organising config and resolvers already discretize free-form contributions into domain-owned graph nodes; protocol schemas already define shapes those resolvers extract against. The event contract is an assembly and compatibility layer over known artifacts, extended by adaptors and indexing into a common accounting substrate. The complexity is real — multi-app, multi-cloud, multi-hub, open primitives — but it is bounded by contracts that already exist. Building the MVP means wiring those contracts into one authoritative instrument and validating that adaptor-informed allocation settles at the edges.
