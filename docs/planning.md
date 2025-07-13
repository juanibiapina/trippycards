# Trippy Cards

An App to plan activities.

The first major milestone for this app is to organize our climbing trips, but later I also want to use it for any trips and perhaps other kinds of activities.

## Milestones

### Milestone 1 - Card creation and display (no fields, only card title)

- [x] build a react UI to create cards
- [x] send card to backend
- [x] handle cards (save to trip)
- [x] after refresh, other users can see the card
- [x] refactor: removing the old Trip functionality that has been replaced by Activity.

### E2E Testing

- [x] Figure out authentication during tests

### Milestone 2 - Collaboration

- Users should see actions from other users in realtime.

- [x] install party server
- [x] convert ActivityDO to a party server
- [x] use partysocket in the frontend
- [x] write integration test
- [x] fix issues
- [x] refactor
- [x] fix websocket issue
- [x] fix linking to trips

### Milestone 3 - Editing name and dates

User's can edit activity name and dates.

- [x] Edit activity name
- [x] edit activity date
- [x] edit activity optional end date
- [x] fix mobile firefox issues
- [x] improve activity name editing (add cancel button and fix layout on small screens)
- [x] improve date display (use default user's date format)
- [x] add option to set end date
- [x] refactor

### Milestone 4

Use the app to plan playing beach volleyball.

- [x] option to set a specific time
- [ ] hide questions feature
- [ ] going: yes, no, maybe
- [ ] shows who's going (with user pictures)
- [ ] add link to the place

### Milestone X - It can be used to plan a climbing trip

The app can be used to plan a climbing trip.

### Unrefined backlog

- [ ] google calendar integration
- [ ] maintenance: fix vitest unit tests timeout
- [ ] use an icon pack to replace AI drawn svgs
- [ ] Unify frontend and backend models using zod
- [ ] Choose color scheme with Tailwind
  - https://tailwindpalette.app/

## Disorganized Ideas

I'd like to include:
- Cars (driver, number of seats, ability for people to join a car)
- Gear (who's taking rope, quickdraws, inflatable boat, or any gear)
- Train (who's taking the train, and which train)
- Crags (with links to thecrag, descriptions)
- Polls (a question with a few options for answer)
  - Who's camping?
  - Who's staying in an air bnb?
- Link: camping place, airbnbs, crags

- Track Whatsapp channel for updates to a trip event, so people just chat about it and the app takes updates, these are passed as prompts (along with the context) for an LLM to create action cards when you visit the app
  - notifications for action cards showing up in the app
- Show total cost
- User can copy links from other websites and they get automatically integrated into the app
- Show public transport
  - Research public transport and tickets
- Map view always present
- Location from URLs is automatically added to categories
  - Airbnb: Acomodations
- Categories are shown in the map
- Places are grouped into categories:
  - Acomodations
  - Activities
- Routes are created that start at each possible accomodation
- Bands from the place you're visiting
- Timeline view with blocks for each "part" of the trip
- Day by day view on the map
- Reminders
  - don't forget you need a car
- Users can say what their preferences are
  - preferences can be suggested by the AI
  - preferences can be created by the trip organizer (or anyone)
- Users can say what they want to bring
- Cars can be organized
- Voting can happen
- Links to whatsapp groups
- Cards can be sponsored.
- Cards are saved to your trip deck.

## Resources

- render map with mapbox: https://docs.mapbox.com/mapbox-gl-js/guides/?utm_campaign=Email+2+Day+2+-+Render+a+Map&utm_content=2025+Mapbox+Onboarding&utm_medium=email&utm_source=customer.io
- add data to map with mapbox: https://docs.mapbox.com/help/getting-started/data-guide/?utm_campaign=Email+3+by+Day+3+-+Add+Data&utm_content=2025+Mapbox+Onboarding&utm_medium=email&utm_source=customer.io
