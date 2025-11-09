This page will take the reader from zero prior setup to your first recorded timelining contribution, with as few steps as possible. We'll start with 

1. the full stack, then 
2. go through the setup, step-by-step. 

Before that, however, let's quickly recap why any of this might be of interest. 
# Why
[Action-learning journeys](/patterns/action-learning%20journeys.md) (ALJs) are a space of radical and safe experimentation, with multiple levels of aligned stakeholder-systems. Organising an ALJ is the application of [social innovation](/glossary/Practice.md), to create systemic action. No matter the context, duration, or technology involved, participating means learning how to embody effective organisation. 

For the whole-organising and learning process to be seen fully, it must be visible from multiple perspectives. Timelining is one way to make contributing to the overall story as accessible as sending a voice note in a group chat. In this case, the group chat represents the organisational context - one group for each organisation (hub leads, teams, facilitators circle etc.).
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
	3. Data modelling (entity types)
5. Vectorisation script
6. Neo4j/ graph database

So far, the only front-end of this overall system is the Telegram group chat. The backend has simply stored 
# 
