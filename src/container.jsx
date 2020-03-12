import { connect } from 'react-redux';
import {
  setCity, setCurrentApi, setGeocoder, geocoderLoadingFailure,
  getUserCoordinates, getCoordinatesByName, fetchWeatherFromDarkSky,
  geocoderLoadingStarted, geocoderLoadingSuccess, weatherLoadingStarted, checkInputCity,
  weatherLoadingSuccess, weatherLoadingFailure, setWeather, setСachedData,
  fetchWeatherFromStorm, dropErrorsState,
} from './actions';
import WeatherApi from './weather';

function mapStateToProps(state) {
  return {
    temperature: state.temperature,
    windSpeed: state.windSpeed,
    summary: state.summary,
    api: state.api,
    lng: state.lng,
    lat: state.lat,
    weatherState: state.weatherState,
    loadingWeather: state.loadingWeather,
    loadingGeocoder: state.loadingGeocoder,
    city: state.city,
    errorGeocoder: state.errorGeocoder,
    errorWeather: state.errorWeather,
  };
}

const mapDispatchToProps = (dispatch) => ({
  setCity: (city) => dispatch(setCity(city)),
  setCurrentApi: (api) => dispatch(setCurrentApi(api)),
  geocoderLoadingSuccess: () => dispatch(geocoderLoadingSuccess()),
  setGeocoder: (payload) => dispatch(setGeocoder(payload)),
  geocoderLoadingFailure: () => dispatch(geocoderLoadingFailure()),
  geocoderLoadingStarted: () => dispatch(geocoderLoadingStarted()),
  weatherLoadingSuccess: () => dispatch(weatherLoadingSuccess()),
  setWeather: (payload) => dispatch(setWeather(payload)),
  weatherLoadingStarted: () => dispatch(weatherLoadingStarted()),
  weatherLoadingFailure: () => dispatch(weatherLoadingFailure()),
  setСachedData: (payload) => dispatch(setСachedData(payload)),
  getUserCoordinates: () => dispatch(getUserCoordinates()),
  getCoordinatesByName: (object) => dispatch(getCoordinatesByName(object)),
  checkInputCity: (object) => dispatch(checkInputCity(object)),
  fetchWeatherFromDarkSky: (object) => dispatch(fetchWeatherFromDarkSky(object)),
  fetchWeatherFromStorm: (object) => dispatch(fetchWeatherFromStorm(object)),
  dropErrorsState: () => dispatch(dropErrorsState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherApi);
