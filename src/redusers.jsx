export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'WEATHER_LOADING_STARTED':
      return {
        ...state,
        loadingWeather: true,
        errorWeather: false,
      };
    case 'WEATHER_LOADING_FAILURE':
      return {
        ...state,
        loadingWeather: false,
        errorWeather: true,
      };
    case 'WEATHER_LOADING_SUCCESS':
      return {
        ...state,
        loadingWeather: false,
        errorWeather: false,
      };
    case 'SET_WEATHER':
      return {
        ...state,
        temperature: action.payload.temperature,
        windSpeed: action.payload.windSpeed,
        summary: action.payload.summary,
      };
    case 'GEOCODER_LOADING_STARTED':
      return {
        ...state,
        loadingGeocoder: true,
      };
    case 'GEOCODER_LOADING_FAILURE':
      return {
        ...state,
        loadingGeocoder: false,
        errorGeocoder: true,
      };
    case 'GEOCODER_LOADING_SUCCESS':
      return {
        ...state,
        loadingGeocoder: false,
        errorGeocoder: false,
      };
    case 'SET_GEOCODER':
      return {
        ...state,
        lng: action.payload.lng,
        lat: action.payload.lat,
      };
    case 'SET_CURRENT_API':
      return {
        ...state,
        api: action.api,
      };
    case 'CHECK_INPUT_CITY':
      return {
        ...state,
        errorGeocoder: false,
        errorWeather: false,
      };
    case 'SET_CITY':
      return {
        ...state,
        city: action.city,
      };
    case 'SET_WEATHER_CACHED':
      return {
        ...state,
        weatherState: action.weather,
      };
    case 'SET_CACHED_DATA':
      return {
        ...state,
        loadingWeather: false,
        loadingGeocoder: false,
        weatherState: {
          ...state.weatherState,
          [action.payload.city]: {
            temperature: action.payload.temperature,
            windSpeed: action.payload.windSpeed,
            summary: action.payload.summary,
            dateTime: new Date(action.payload.dateTime),
          },
        },
      };
    default:
      return state;
  }
}
