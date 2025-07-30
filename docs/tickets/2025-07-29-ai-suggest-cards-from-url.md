# Use AI to suggest cards based on a URL

- start: 2025.07.29
- end: ongoing

## Goal

Allow users to create cards of several types by giving a URL.

## User interaction

Users can add a new Card `AILink` to an Activity.
Clinking on a `AILink` Card takes you to a detailed view with AI created cards.

## Architecture

When an `AILink` card is created, a cloudflare workflow is triggered to process the card.
The job:
   - Uses Firecrawl to extract the page contents from the card URL
   - Calls an AI Agent with a prompt to suggest a list of cards that can be created from that content
   - add those cards to the link cards as children cards

## User flows

- [Create AILink Card](../flows/create-card-ailink.md): Creating the initial card in processing state

## Backend

- [ ] Trigger cloudflare workflow for processing of `AILink` cards [../guides/async-job-for-ailink-card.md](../guides/async-job-for-ailink-card.md)

## Prerequisites

- [Authentication](authentication.md)
- [Create Activity](create-activity.md) - User must be on an activity page