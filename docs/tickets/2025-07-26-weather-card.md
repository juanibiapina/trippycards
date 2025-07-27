# Weather Card

## Goal

Implement a Weather Cards for displaying current weather for a location

## OpenWeather API example

```sh
curl "https://api.openweathermap.org/data/3.0/onecall?lat=52.4960965&lon=13.3693549&units=metric&exclude=minutely,hourly,daily&appid=<apikey>"
```

- Minimum time between response updates is 10 minutes

## Weather Card object

- Weather Card object contains data that serves as input to openweathermap API, but also the response data.

```js
{
  lat: "123",
  lon: "235",
  updatedAt: "2025-07-26T02:22:04",
  data: {

  }
```

## Prototype

### Part 1: Create Weather

- [x] create a weather card in loading state using https://github.com/farahat80/react-open-weather
- [x] allow users to create weather cards by writing lat and lon fields
- [x] hardcode test data in the weather card
- [x] check what it looks like

React open weather is a mess. I'd rather do my own UI or find an alternative.
