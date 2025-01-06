---
aliases:
- potentialising
- potentializing
- grounding
- ground-potentialising
---

ground-potentialising is the process of developing the image, and articulation, communication etc, of a future event. this can be a simple event page. this can also be a wiki detailing a methodology to be trialled, as a kind of validation or for [[developmental evaluation|developmental]] purposes. events are suitable to any communities seeking to grow [[capacity-building|capacities]] for [[self-organising]] in response to changing environmental conditions.

# Potentialize

Potentialize refers to event creation, specifying the bot-array that will create the means for participation and the purposes of the different bots.

## **1. System Architecture Overview**

### Event Factory

- The event factory creates event configurations, and new event instances
- Event meta data are stored on a Prisma server, as well as on-chain
- Each event has a bot array, used for creating means for participation, defined in the event configuration

### Event Instance

- Each event is treated as a unique ecosystem with its own data flows and interactions.
- **Event Database**: A dedicated database instance is created for each event, storing its specific data and managing flow.
- Communities of Place that initiate the potential for a new event will be required to have their own local server on which the event instance can be deployed

### Bot Factory

- The central component responsible for creating bot arrays based on event configurations and templates.

### Bot Arrays

- These are a collection of verb-based bots, tailored for specific event needs, facilitating communication, contribution tracking, and other functionalities. Examples include but are not limited to:
  - Documenting
  - Appreciating
  - Storytelling

## **2. Components**

### **A. Bot Factory**

- **Responsibilities:**
  - Create and configure bot arrays based on event-specific templates.
  - Initiate and manage event-specific databases.
  - Each bot is associated with both a verb-based communication channel and its own table in the event database
- **Key Functions:**
  - `createEventBotArray(eventConfig)`: Generates a new bot array and database instance for an event.
  - `createBot(type, config)`: Instantiates individual bots based on their type and configuration.

### **B. Event Database**

- **Structure:**
  - Each event database contains tables specific to that event, such as:
    - **Bots Table**: Stores bot configurations and metadata.
    - **Contributions Table**: Tracks user contributions and interactions.
    - **Events Table**: Records event details and lifecycle stages.
- **Dynamic Creation**: Databases are created dynamically upon event initiation using APIs from the database service.

### **C. Bots**

- **Types of Bots:**
  - **Documentation Bot**: Facilitates documentation creation and management.
  - **Contribution Bot**: Tracks and records contributions from participants.
  - **Recognition Bot**: Acknowledges valuable contributions made by users.
- **Key Functions:**
  - Each bot interacts with its event-specific database to manage data flows relevant to its functionality.
  - Bots are designed to listen for real-time updates and respond accordingly.

## **3. Processes**

### **A. Event Setup Process**

1. **Event Configuration:**

   - Define event parameters and requirements (e.g., types of interactions, expected outcomes).

1. **Database and Bot Initialization:**

   - Trigger the Bot Factory to create a new event database and corresponding bot array.
   - Each bot in the array is instantiated and configured based on the event configuration.

1. **Deploy Bot Array:**

   - Deploy the bot array to the event's communication space (e.g., Telegram group).

### **B. Data Flow Management**

1. **Data Collection:**

   - As participants interact with bots, data is collected and stored in the event-specific database.
   - Bots handle user inputs, contributions, and other interactions in real-time.

1. **Real-Time Updates:**

   - Implement real-time event-driven processing, allowing bots to respond to new data or interactions immediately.

1. **Data Evaluation:**

   - Analyze data flows and interactions to gauge event engagement and performance.
   - Bots may generate reports or analytics based on the data collected during the event.
