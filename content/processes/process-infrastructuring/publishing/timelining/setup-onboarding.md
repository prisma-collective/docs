# Setup and Onboarding
This page will take the reader from zero prior setup to your first recorded timelining contribution, with as few steps as possible. We'll start with 

1. the full stack, then 
2. go through the setup, step-by-step. 

Before that, however, let's quickly recap why any of this might be of interest. 
# Why
[Action-learning journeys](/patterns/action-learning%20journeys.md) (ALJs) are a space of radical and safe experimentation, with multiple levels of aligned stakeholder-systems. Organising an ALJ is the application of [social innovation](/glossary/Practice.md), to create systemic action. No matter the context, duration, or technology involved, participating means learning how to embody effective organisation. 

For the whole-organising and learning process to be seen fully, it must be visible from multiple perspectives. Timelining is one way to make contributing to the overall story as accessible as sending a voice note in a group chat. In this case, the group chat represents the organisational context - one group for each organisation (hub leads, participant teams, facilitators circle etc.). 

The [docs](/processes/process-infrastructuring/publishing/docs-setup) allows for multiple authors to collectively write the story of their groups' journey. Timelining does the same, but with the voice and 10X greater frequency of contributions. With LLMs and RAG, vectorising the voice note transcripts means you (and your [collaborators](/collaborators)) can chat to the process as a whole, inquiring into the [collective learning](/processes/process-infrastructuring/publishing/timelining) of a self-organising cohort. 
# Full Stack
To go from the user interface of a telegram group, to the backend, where you can model the data however you like, back to some kind of representation interface (a UI), the following systems are used, in the following order:

1. Telegram
	1. Telegram group
	2. Telegram bot, placed into the group with admin privileges 
	3. Webhook set for the given telegram bot
2. Timelining 
	1. Custom webhook API endpoint
3. Message queue (redis)
4. Worker script
	1. Triggered by another API endpoint
	2. Scheduled with Vercel cron jobs
	3. Data modelling (entity types) and storage
5. Neo4j/ graph database
6. Vectorisation script

So far, the only "front-end" is the Telegram group chat. Additional apps can be created to enable various [evaluation](/processes/evaluation) perspectives, inquiring into the data to surface insights, learnings and outcomes.
# Step-by-step Setup
Let's go through each step to get a minimum viable timelining system up and running.

Telegram:

1. Create a telegram bot and set the webhook URL: `[your deployment url]/api/webhook`
2. Create a telegram group, with topics enabled
3. Create a topic named `_botTimelining`
4. Add the telegram bot to the group with admin privileges
5. Test to make sure the bot is picking up messages

Timelining service:

1. In your Vercel, connect your message queue (Upstash Redis)
2. Fork and deploy the timelining project to your hub (using [propagate](/processes/process-infrastructuring/propagate))
	1. Pass your telegram bot token as an environment variable
	2. Pass your message queue (Upstash Redis) connection URL as an environment variable

(Optional) Data modelling:

1. Review the telegram object types in the bot API [reference](https://core.telegram.org/bots/api#message)
2. Define how you want to model your data
3. Connect your (graph) database
4. Turn on the worker script schedule

(Optional) Build an evaluation app:

1. Transcribe audio, chunk, and vectorise your voice notes
2. Implement GraphRAG