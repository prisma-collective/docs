---
password: "hchfvz"
---

# Practice Currencies and HFvZ Testing Phase 2
Prisma is a distributed action-learning incubator enabling changemakers to harness experimental spaces, tools and resources to play with different forms of building products, systems and processes that improve the collective health of the communities they are in service to.

We do this through hosting action learning journeys (or hackathons) intended towards incubating teams that will work together on realising potential and compiling data-backed case studies of the entire process.

Through our experience organizing collective efforts, we have understood that journeys undertaken by groups that yield genuine evolution are ones where each stakeholder feels/is/has the power to step into their agency, authentically.

However, conventional ways of understanding the value contributed by individuals in a system, the roles required for a successful enterprise, and the weight of contributions that don’t align with tangible means like profit and productivity incentives consistently prevent people from showing up, claiming their agency, and participating in holistic ways.  

Even the best intentioned groups fall into repetition of the same patterns, power structures and outdated knowledge systems that perpetuate a maintenance of the hegemonic, extractive world order.

In the realm of decentralised information systems offering a way out of the entrenched hierarchies of existing centralized systems, Holochain’s unique approach to enabling peer-to-peer transactions via distributed hash tables aligns ever so cleanly with the capabilities we hope to equip each collective that we engage with.

What is this capability? That of giving voice to the diverse forms and flows of value that are actually generated, drawn upon and contribute greatly to the movement of any collective towards its vision.

There are four “process-axes” on which this endeavour moves and grows:  

1. Enrollment: aligning multiple levels of a system around a common purpose, by preparing participants to start viewing the world and their shared mission through a multi-perspectival lens towards value
2. Ground-Potentializing: navigating between what is and what could be, by mapping and envisioning potential for evolution
3. Enactment: activating self-organising emergence, by facilitating spaces, offering tools and encouraging processes that honour and evidence the power in individuals channeling various forms of value
4. Evaluation: communicating the application of practice on-the-ground and the learnings generated, by reading the signals and flows of value generated through these pluriversal forms of contribution and providing insights

Our aim with participating in the Unyt Hfvz Testing Phase 2 is to give form to some of the above potential for multi-dimensional value recognition, accounting and mapping. 
# Challenge Statement
Prisma’s action-learning journeys solicit various forms of value (or contributions) from participants. Some of these can be easily measured - such as developing code, securing partnerships and contributing funding, while others are more intangible  - such as holding relationships, facilitating safe spaces and mentorship. Seeing each of these, reflecting their flow, and ascribing weightage to them is essential to carrying out the purpose of Prisma, as shared above.  

While tangible contributions can be tracked through direct measurement, such as code commits to shared repositories, contracts agreed and sums of funding contributed, currently we do not have a system for tracking the flow of these values. 

On the other hand, intangible value flows between participants have little way of even being acknowledged outside of subjective reporting when solicited and feedback forms. There is a need for these flows to be acknowledged, and potentially even be exchangeable with tangible flows.
# Response: A Holochain-Based Multi-Unit Value Tracking System
Voice-interface is the primary UX that leads to digital traces of participating in an action-learning journey. This has been chosen to support collective flow during our in-person intensives, and to leverage the relatively unconstrained formability of voice as a medium of expression (not constrained to features available in a UI). In our work, we’re ultimately wanting to see the cultivation of essence. Therefore, in thinking about how to represent this computationally, we came upon the definition of essence as the emergence of coherence, structure, or meaningful complexity in an evolutionary vector dataset. This is one idea for a Base Unit, where the “prices” of services would be determined dynamically based on the result of the computation. However, this would not be suitable in all cases, such as conflict resolution proceedings, where a static price list may be more appropriate (as is given in the hfvz phase 2 docs). 

We wish to use HoloFuel’s multi-unit accounting model to track, validate, and exchange different types of contributions via a decentralized, peer-led approach.

Specifically:

1. The Base Unit is a measure of complexity in an evolutionary vector database - think each voice note contribution shifts the composition of the dataset. This measurement could entail:
	1. Entropy-based measurements
	2. Fractal and self-similarity analysis
	3. Graph theory
	4. Other measurements in the realm of information theory and indicators of adaptability (chaos vs. stability, predictive performance etc.)
2. The Service Units are a measure of a given practice, e.g. knowledge commoning, conflict resolution, fooding. Each RAVE encodes a reliable indicator of practice. Identifying an indicator that is both reliable and meaningful to the community is part of the work of an action-learning journey. For each, we’re likely to draw upon a hybrid of piecework accounting plus peer verification. 
3. The “price” of each Service, in this case, would be dynamically calculated each time, based on the content of the contribution.
4. Ideally, each hub in the network (nodal actors on-the-ground) creates its own pool.
	> QUESTION: Is this feasible? Could our app manage multiple pool admins? There would be an emphasis on ease of UX for specifying new Service Units as more practice-currencies are identified/ developed.
5. Different forms of practice contributions are categorized into different Service Units, enabling participants to accumulate evidence of the value they have generated
6. For all of the Service Units, we recognise the need for further security considerations

> SIDE NOTE: the source-chain, self-validation approach of Holochain could be suitable for verifying voice notes with a voice recognition model without the model needing to be made public, adding another validation layer to participation contributions.

# How It Works

## Defining Service Units
The base unit of value is the measure of change in a vector database, ideally run with each participation contribution. 

> QUESTION: Is there a risk in coupling base and service units like this?
  
The following service units would form an action-learning service library. Each are examples that address a given “sphere” of collaboration. These are chosen at the intersection of three lines of thinking:

- What are the ways in which the current participants are contributing value? 
- What is most needed by the specific nature of the group endeavour in order to proceed?
- What grows the capability of the system that the hub is evolving with this practice?

The service units are... 

1. Decision-Making (Systems sphere): One Decision Unit = 1 agreement schema, accepted by counter-party
2. Relationship Building (Social sphere): One Relational Unit = 1 contract of coordination signed
3. Knowledge Contribution (Cultural sphere): One Knowledge Unit = 1 page committed to the documentation repo
4. Space Holding (Ecological sphere): One Space Unit = 1 facilitated space created  
5. Resources of Utility (Economic sphere): One Resource Unit = 100 GBP equivalent of resources contributed  

Crucially, a similar process of service unit development would be facilitated during an action-learning journey, yielding one (or more) service units that are unique to that community. 

We recognise the need for distinguishing between services that are suitable for the vector-change Base Unit computation and those that aren’t. Facilitating conflict resolution, might not necessarily warrant writing the transcription to the database, or be ethical. Similarly, a somatic-based workshop with few words would also not be relevant. In these cases, a static price list is likely more appropriate.

There are many RAVEs that could be designed to carry out the work outlined above. For the purposes of phase 2 testing, we’d like to offer the following three custom use case and RAVE scenarios:

1. Knowledge Contribution
	- RAVE: peer-review of document (inc. transcripts/ audio)
2. Decision-making
	- RAVE: mutual signing of a document
3. Facilitation (workshop, space-holding)
	- RAVE: peer recognition of service
	- RAVE: peer-review of document (as in Knowledge Contribution)

## Knowledge Contribution Service Unit
In the service of generating knowledge, such as writing documentation or recording a generative discussion on a given topic, we envision the following provisioning flow. In this case, the document/ transcription is suitable for the dynamic Base Unit.

1. Service provider uploads to chat/ commits to repo 1 document/ transcription, equating to 1 knowledge contribution unit
2. Vector-change computation is run
3. Invoice is sent to reviewer, containing 
4. Document reference associated to 1 knowledge contribution, and 
5. The dynamically generated base unit “price”
6. Reviewer verifies the document
7. Service provider is credited 1 knowledge unit, and gets paid the calculated amount of base-unit

## Decision-making Service Unit
In the service of decision-making, the context of the decision is required along with the terms of agreement that get signed. Documenting this context is part of the process. We may review this, but we’ll say that for now the decision-making context makes this also suitable for the dynamic Base Unit. The document is iterated until all parties are happy to verify their consent to the terms.

1. A decision-making process begins. The context and terms are documented. A decision facilitator role is assigned.
2. The document undergoes iterative refinements through dialogue/ peer input.
3. The Service Provider (facilitator) commits the finalized context.
4. The decision’s context is validated by stakeholders.
5. Once all parties verify consent, the service provider is credited 1 decision-making unit and paid the (dynamically computed) Base-Unit

## Facilitation Service Unit
Provisioning a workshop or holding space could be accounted for with a facilitation RAVE. In this service, the facilitator essentially invoices all participants of the workshop/ space, and each participant pays the invoice. In doing so, there are multiple units of facilitation credited: one per member. There are two means by which a dynamic base unit price can be generated, which needs to be chosen prior to the facilitation. 

1. The facilitation is recorded. The transcription of the facilitation is used in the Knowledge Contribution Service Unit for the facilitator to get paid. 
2. The facilitator asks for reflections, like journaling, in response to the workshop/ space-holding. These reflections, in audio/ document form, are attributed to the facilitation service and their content is used to dynamically generate the base unit that gets paid to the facilitator. 

Here’s the provisioning flow…

1. Dynamic Base-Unit Pricing is chosen:
	- Option 1: Payment based on transcription analysis of the recorded facilitation.
	- Option 2: Payment based on reflections (journal/audio/doc contributions) from participants.
2. A facilitation event (workshop, space-holding) is initiated.
3. Facilitator makes 1 promise of facilitation per participant in attendance.
4. If option 1: Facilitation is recorded, generating a transcription. Facilitator uses this to send a promise of Knowledge Contribution Service Unit. Sent to participants for review.
	- Facilitation service units (-1 per participant)
	- Knowledge contribution service units (-1)
	- Base-Unit payment (+ dynamically computed amount)
5. If option 2: One invoice sent to each participant. Participants submit reflections (journaling, audio, documents). Reflections used to generate the base unit amount per invoice. Knowledge contribution service unit promised (one per reflection), credited to reflector balance. Base unit gets forwarded to facilitator account. 
	- Facilitation service units (-1 per participant)
	- Knowledge contribution service units (-1 per participant, credited to participant balance)
	- Base-Unit payment (+ dynamically computed amount, forwarded from participant to facilitator account).