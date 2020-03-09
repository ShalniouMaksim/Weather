export function weatherLoadingSuccess({ temperature, windSpeed, summary }) {
  return {
    type: 'WEATHER_LOADING_SUCCESS',
    payload: { temperature, windSpeed, summary },
  };
}
export function weatherLoadingFailure() {
  return {
    type: 'WEATHER_LOADING_FAILURE',
  };
}
export function weatherLoadingStarted() {
  return {
    type: 'WEATHER_LOADING_STARTED',
  };
}
export function geocoderLoadingSuccess({ lng, lat }) {
  return {
    type: 'GEOCODER_LOADING_SUCCESS',
    payload: { lng, lat },
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
export function setСachedData(city, {
  temperature, windSpeed, summary, dateTime,
}) {
  return {
    type: 'SET_CACHED_DATA',
    payload: {
      temperature, windSpeed, summary, dateTime,
    },
    city,
  };
}
