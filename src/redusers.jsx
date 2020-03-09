export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'WEATHER_LOADING_STARTED':
      return {
        ...state,
        loading: true,
      };
    case 'WEATHER_LOADING_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'WEATHER_LOADING_SUCCESS':
      return {
        ...state,
        loading: false,
        temperature: action.payload.temperature,
        windSpeed: action.payload.windSpeed,
        summary: action.payload.summary,
      };
    case 'GEOCODER_LOADING_STARTED':
      return {
        ...state,
        loading: true,
      };
    case 'GEOCODER_LOADING_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'GEOCODER_LOADING_SUCCESS':
      return {
        ...state,
        loading: true,
        lng: action.payload.lng,
        lat: action.payload.lat,
      };
    case 'SET_CURRENT_API':
      return {
        ...state,
        api: action.api,
      };
    case 'SET_CITY':
      return {
        ...state,
        city: action.city,
      };
    case 'SET_CACHED_DATA':
      return {
        ...state,
        loading: false,
        weatherState: {
          ...state.weatherState,
          [action.city]: {
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
