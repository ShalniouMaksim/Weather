export function weatherLoadingSuccess() {
  return {
    type: 'WEATHER_LOADING_SUCCESS',
  };
}

export function setWeather({ temperature, windSpeed, summary }) {
  return {
    type: 'SET_WEATHER',
    payload: { temperature, windSpeed, summary },
  };
}

export function weatherLoadingFailure() {
  return {
    type: 'WEATHER_LOADING_FAILURE',
  };
}

export function setWeatherCached(weather) {
  return {
    type: 'SET_WEATHER_CACHED',
    weather,
  };
}

export function weatherLoadingStarted() {
  return {
    type: 'WEATHER_LOADING_STARTED',
  };
}

export function geocoderLoadingSuccess() {
  return {
    type: 'GEOCODER_LOADING_SUCCESS',
  };
}
export function setGeocoder({ lng, lat }) {
  return {
    type: 'SET_GEOCODER',
    payload: { lng, lat },
  };
}

export function getCoordinatesByName({ city, api }) {
  return {
    type: 'GET_CORDINATES_BY_CITY_NAME',
    city,
    api,
  };
}
export function getUserCoordinates() {
  return {
    type: 'GET_USER_COORDINATES',
  };
}

export function geocoderLoadingFailure() {
  return {
    type: 'GEOCODER_LOADING_FAILURE',
  };
}

export function geocoderLoadingStarted() {
  return {
    type: 'GEOCODER_LOADING_STARTED',
  };
}

export function setCurrentApi(api) {
  return {
    type: 'SET_CURRENT_API',
    api,
  };
}

export function setCity(city) {
  return {
    type: 'SET_CITY',
    city,
  };
}
export function checkInputCity({
  api, city, cachedWeather, stateWeather,
}) {
  return {
    type: 'CHECK_INPUT_CITY',
    api,
    city,
    cachedWeather,
    stateWeather,
  };
}
export function fetchWeatherFromDarkSky({ lat, lng, city }) {
  return {
    type: 'FETCH_WEATHER_FROM_DARKSKY',
    lat,
    lng,
    city,
  };
}
export function fetchWeatherFromStorm({ lat, lng, city }) {
  return {
    type: 'FETCH_WEATHER_FROM_SHTORM',
    lat,
    lng,
    city,
  };
}

export function setСachedData({
  city,
  temperature,
  windSpeed,
  summary,
  dateTime,
}) {
  return {
    type: 'SET_CACHED_DATA',
    payload: {
      city,
      temperature,
      windSpeed,
      summary,
      dateTime,
    },
  };
}
