# workflow-builder-usecase

## Description
This repo provides an example of a workflow builder product with steps that perform actions in 3rd-party integration providers. 
Examples include:
- Sending a Slack message
- Querying from Salesforce
- Sending an email via Gmail
- Getting a Notion page
This demo uses Paragon for all integration-related functionality including authentication, credential management, and 3rd-party 
APIs powered by ActionKit

## Tools Used
- [ReactFlow](https://reactflow.dev/) for its node.js library in building a drag and drop workflow UI
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) for state management
- [NextJS](https://nextjs.org/) for fullstack framework of this demo
- [Paragon](https://www.useparagon.com/) for integrations and 3rd-party actions

## Running Locally
1) Fill out the `.env` file template with your credentials from Paragon and Google/Github
    1) The Paragon project ID and signing key can be obtained with a free [trial](https://dashboard.useparagon.com/signup)
    2) The Google or Github API credentials are used for authenticating users
2) Run `npm run dev` to start the development server
