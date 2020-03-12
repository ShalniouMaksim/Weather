import { connect } from 'react-redux';
import {
  setCity, setCurrentApi, setGeocoder, geocoderLoadingFailure,
  getUserCoordinates, getCoordinatesByName, fetchWeatherFromDarkSky,
  geocoderLoadingStarted, geocoderLoadingSuccess, weatherLoadingStarted, checkInputCity,
  weatherLoadingSuccess, weatherLoadingFailure, setWeather, setСachedData,
  fetchWeatherFromStorm,
} from './actions';
import WeatherApi from './weather';

const getTemperatureSelector = (state) => state.temperature;
const getWindSpeedSelector = (state) => state.windSpeed;
const getSummarySelector = (state) => state.summary;
const getApiSelector = (state) => state.api;
const getLngSelector = (state) => state.lng;
const getLatSelector = (state) => state.lat;
const getWeatherStateSelector = (state) => state.weatherState;
const getLoadingWeatherSelector = (state) => state.loadingWeather;
const getLoadingGeocoderSelector = (state) => state.loadingGeocoder;
const getCitySelector = (state) => state.city;
const getErrorGeocoder = (state) => state.errorGeocoder;

function mapStateToProps(state) {
  return {
    temperature: getTemperatureSelector(state),
    windSpeed: getWindSpeedSelector(state),
    summary: getSummarySelector(state),
    api: getApiSelector(state),
    lng: getLngSelector(state),
    lat: getLatSelector(state),
    weatherState: getWeatherStateSelector(state),
    loadingWeather: getLoadingWeatherSelector(state),
    loadingGeocoder: getLoadingGeocoderSelector(state),
    city: getCitySelector(state),
    errorGeocoder: getErrorGeocoder(state),
  };
}

const mapDispatchToProps = (dispatch) => ({
  setCity: (value) => dispatch(setCity(value)),
  setCurrentApi: (value) => dispatch(setCurrentApi(value)),
  geocoderLoadingSuccess: () => dispatch(geocoderLoadingSuccess()),
  setGeocoder: (value) => dispatch(setGeocoder(value)),
  geocoderLoadingFailure: () => dispatch(geocoderLoadingFailure()),
  geocoderLoadingStarted: () => dispatch(geocoderLoadingStarted()),
  weatherLoadingSuccess: () => dispatch(weatherLoadingSuccess()),
  setWeather: (value) => dispatch(setWeather(value)),
  weatherLoadingStarted: () => dispatch(weatherLoadingStarted()),
  weatherLoadingFailure: () => dispatch(weatherLoadingFailure()),
  setСachedData: (value, weather) => dispatch(setСachedData(value, weather)),
  getUserCoordinates: () => dispatch(getUserCoordinates()),
  getCoordinatesByName: (value) => dispatch(getCoordinatesByName(value)),
  checkInputCity: (value) => dispatch(checkInputCity(value)),
  fetchWeatherFromDarkSky: (value) => dispatch(fetchWeatherFromDarkSky(value)),
  fetchWeatherFromStorm: (value) => dispatch(fetchWeatherFromStorm(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherApi);
