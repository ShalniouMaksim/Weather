function weatherLoadingSuccess({ temperature, windSpeed, summary }) {
  return {
    type: 'WEATHER_LOADING_SUCCESS',
    payload: { temperature, windSpeed, summary },
  };
}

function weatherLoadingFailure() {
  return {
    type: 'WEATHER_LOADING_FAILURE',
  };
}

function weatherLoadingStarted() {
  return {
    type: 'WEATHER_LOADING_STARTED',
  };
}

function geocoderLoadingSuccess({ lng, lat }) {
  return {
    type: 'GEOCODER_LOADING_SUCCESS',
    payload: { lng, lat },
  };
}

function geocoderLoadingFailure() {
  return {
    type: 'GEOCODER_LOADING_FAILURE',
  };
}

function geocoderLoadingStarted() {
  return {
    type: 'GEOCODER_LOADING_STARTED',
  };
}

function setCurrentApi(api) {
  return {
    type: 'SET_CURRENT_API',
    api,
  };
}

function setCity(city) {
  return {
    type: 'SET_CITY',
    city,
  };
}

function setСachedData(city, {
  temperature, windSpeed, summary, dateTime,
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

const getTemperatureSelector = (state) => state.temperature;
const getWindSpeedSelector = (state) => state.windSpeed;
const getSummarySelector = (state) => state.summary;
const getApiSelector = (state) => state.api;
const getLngSelector = (state) => state.lng;
const getLatSelector = (state) => state.lat;
const getWeatherStateSelector = (state) => state.weatherState;
const getLoadingSelector = (state) => state.loading;
const getCitySelector = (state) => state.city;
export function mapStateToProps(state) {
  return {
    temperature: getTemperatureSelector(state),
    windSpeed: getWindSpeedSelector(state),
    summary: getSummarySelector(state),
    api: getApiSelector(state),
    lng: getLngSelector(state),
    lat: getLatSelector(state),
    weatherState: getWeatherStateSelector(state),
    loading: getLoadingSelector(state),
    city: getCitySelector(state),
  };
}

export const mapDispatchToProps = (dispatch) => ({
  setCity: (value) => dispatch(setCity(value)),
  setCurrentApi: (value) => dispatch(setCurrentApi(value)),
  geocoderLoadingSuccess: (value) => dispatch(geocoderLoadingSuccess(value)),
  geocoderLoadingFailure: () => dispatch(geocoderLoadingFailure()),
  geocoderLoadingStarted: () => dispatch(geocoderLoadingStarted()),
  weatherLoadingSuccess: (value) => dispatch(weatherLoadingSuccess(value)),
  weatherLoadingStarted: () => dispatch(weatherLoadingStarted()),
  weatherLoadingFailure: () => dispatch(weatherLoadingFailure()),
  setСachedData: (value, weather) => dispatch(setСachedData(value, weather)),
});
