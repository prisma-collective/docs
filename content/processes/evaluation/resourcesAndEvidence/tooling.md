---
sidebarTitle: a. Tooling
---

# **Tooling: Our Tech Stack for Seeing Value**

Our evaluation methodology is powered by a carefully selected stack of technologies designed to make the complex process of tracking value flows accessible, efficient, and insightful. These are not just tools for data collection; they are instruments for seeing, sensing, and making meaning within living systems.

## **1. Data Capture: Telegram Bots**

**Purpose:** To lower the friction of real-time data entry, capturing both qualitative and structured data directly from participants in the flow of their work.

- **Voice & Text Journaling:** Participants can send voice notes (which are automatically transcribed) or text reflections at any moment. This allows for the capture of nuanced "warm data" that structured forms miss.
    
- **Structured Schemas:** We deploy custom schemas (e.g., for Social Relationality, Learning, Creativity, Productivity) that allow participants to log specific, high-value contributions using a simple, memorable format.
    
- **Peer Attributions:** Functionality that enables participants to directly acknowledge value received from others, creating a real-time map of social capital flow.
    

## **2. Data Aggregation: Centralized Repositories**

**Purpose:** To bring together diverse data streams into a single, queryable source of truth.

- **Graph Database (Neo4j):** At the core of our system is a graph database. This allows us to store data not as isolated entries, but as a network of relationships—connecting participants, contributions, timestamps, and themes. This is crucial for our relational indexing.
    
- **Version-Controlled Storage (GitHub):** For structured data, code submissions, and final documentation, we use repositories like GitHub to ensure transparency, versioning, and collaborative access.
    

## **3. Synthesis & Analysis: AI-Enabled Sense-Making**

**Purpose:** To process vast amounts of qualitative and quantitative data, surface non-obvious patterns, and make complexity legible.

- **Large Language Models (LLMs):** We use models like GPT-4o for a range of tasks, including:
    
    - **Semantic Tagging:** Automatically classifying unstructured reflections against our co-created capital and aspect frameworks.
        
    - **Thematic Synthesis:** Identifying emergent themes and narrative threads from hundreds of entries.
        
    - **Evolution Narratives:** Generating draft summaries of individual and group growth trajectories.
        
- **GraphRAG (Retrieval-Augmented Generation):** This technology allows us to query our graph database using natural language, enabling us to ask complex questions like, "Show me how the theme of 'collaboration' evolved in the second week and who was central to that shift."
    

This tech stack is designed to augment, not replace, human sense-making. It handles the heavy lifting of data processing so that communities can focus on the uniquely human work of interpretation, dialogue, and wise decision-making.

---

