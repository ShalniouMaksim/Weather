import { call, put, takeEvery } from 'redux-saga/effects';
import {
  apiKey,
  urlCordinates,
  proxyUrl,
  urlDark,
  apiKeyDark,
  urlStorm,
  DARKSKY,
} from './constants';
import {
  setGeocoder, geocoderLoadingFailure, setWeatherCached,
  geocoderLoadingStarted, geocoderLoadingSuccess, weatherLoadingStarted,
  weatherLoadingSuccess, weatherLoadingFailure, setWeather, setСachedData,
} from './actions';

const fetchWeatherDarkSky = function* fetchWeatherDarkSky(action) {
  yield put(weatherLoadingStarted());
  try {
    const response = yield call(fetch, `${proxyUrl}${urlDark}${apiKeyDark}${action.lat},${action.lng}?units=si`);
    if (response.ok) {
      const answer = yield response.json();
      yield put(weatherLoadingSuccess());
      yield weatherLoadingSuccess();
      yield put(setWeather({
        summary: answer.currently.summary,
        windSpeed: Math.round(answer.currently.windSpeed),
        temperature: Math.round(answer.currently.temperature),
      }));
      yield put(setСachedData({
        city: action.city,
        temperature: Math.round(answer.currently.temperature),
        windSpeed: Math.round(answer.currently.windSpeed),
        summary: answer.currently.summary,
        dateTime: new Date(),
      }));

      yield localStorage.setItem(action.city, JSON.stringify({
        temperature: Math.round(answer.currently.temperature),
        windSpeed: Math.round(answer.currently.windSpeed),
        summary: answer.currently.summary,
        dateTime: new Date(),
      }));
    } else throw new Error(response.statusText);
  } catch (err) {
    weatherLoadingFailure();
  }
};
const fetchWeatherStormglass = function* fetchWeatherStormglass(action) {
  yield put(weatherLoadingStarted());
  const date = new Date();
  const dataStorm = date.toISOString();
  try {
    const response = yield call(fetch,
      `${proxyUrl}${urlStorm}lat=${action.lat}&lng=${action.lng}&start=${dataStorm}&end=${dataStorm}`,
      {
        headers: {
          Authorization: apiKey,
        },
      });
    if (response.ok) {
      const json = yield response.json();
      let summarryLet;
      switch (true) {
        case (json.hours[0].precipitation[0].value > 1.1
         && json.hours[0].airTemperature[0].value > 0):
          summarryLet = 'Heavy rain'; break;
        case (json.hours[0].precipitation[0].value > 0
         && json.hours[0].precipitation[0].value <= 1.1
        && json.hours[0].airTemperature[0].value > 0):
          summarryLet = 'Light Rain'; break;
        case (json.hours[0].precipitation[0].value > 0.8
         && json.hours[0].airTemperature[0].value < 0):
          summarryLet = 'Heavy snow'; break;
        case (json.hours[0].precipitation[0].value > 0
         && json.hours[0].precipitation[0].value <= 0.8
        && json.hours[0].airTemperature[0].value < 0):
          summarryLet = 'Light snow'; break;
        case (json.hours[0].cloudCover[0].value > 80):
          summarryLet = 'cloudy'; break;
        default:
          summarryLet = 'Clear'; break;
      }
      yield put(weatherLoadingSuccess());
      yield weatherLoadingSuccess();
      yield put(setWeather({
        summary: summarryLet,
        windSpeed: Math.round(json.hours[0].windSpeed[0].value),
        temperature: Math.round(json.hours[0].airTemperature[0].value),
      }));
      yield put(setСachedData({
        city: action.city,
        temperature: Math.round(json.hours[0].airTemperature[0].value),
        windSpeed: Math.round(json.hours[0].windSpeed[0].value),
        summary: summarryLet,
        dateTime: new Date(),
      }));

      yield localStorage.setItem(action.city, JSON.stringify({
        temperature: Math.round(json.hours[0].airTemperature[0].value),
        windSpeed: Math.round(json.hours[0].windSpeed[0].value),
        summary: summarryLet,
        dateTime: new Date(),
      }));
    } else throw new Error(response.statusText);
  } catch (err) {
    weatherLoadingFailure();
  }
};

const getCoordinates = function* getCoordinates(action) {
  yield put(geocoderLoadingStarted());
  let json;
  const response = yield call(fetch, `${proxyUrl}${urlCordinates}${action.city}?json=1`);
  if (response.ok) {
    json = yield response.json();
    if (json.error) {
      alert('Вы точно ввели корректный город ?');
      yield put(geocoderLoadingFailure());
    } else {
      yield put(geocoderLoadingSuccess());
      yield put(setGeocoder({
        lat: json.latt,
        lng: json.longt,
      }));
      if (action.api === DARKSKY) {
        yield fetchWeatherDarkSky({ lat: json.latt, lng: json.longt, city: action.city });
      } else yield fetchWeatherStormglass({ lat: json.latt, lng: json.longt, city: action.city });
    }
  } else {
    yield put(geocoderLoadingFailure());
  }
};
const checkInputCity = function* checkInputCity(action) {
  if (Object.prototype.hasOwnProperty.call(action.stateWeather, action.city)) {
    const dateNow = new Date();
    const dateTime = new Date(action.cachedWeather.dateTime);
    dateTime.setMilliseconds(2 * 60 * 60 * 1000);
    if (dateTime.getTime() > dateNow.getTime()) {
      yield put(setWeather({
        temperature: action.cachedWeather.temperature,
        summary: action.cachedWeather.summary,
        windSpeed: action.cachedWeather.windSpeed,
      }));
    } else {
      yield getCoordinates(({ city: action.city, api: action.api }));
    }
  } else {
    yield getCoordinates({ city: action.city, api: action.api });
  }
};
const getUserLocation = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (location) => resolve(location),
    (error) => reject(error),
  );
});

const getUserCoordinates = function* getUserCoordinates(action) {
  let localObject = {};
  yield Object.keys(localStorage).forEach((value) => {
    localObject = {
      ...localObject,
      [value]: JSON.parse(localStorage.getItem(value)),
    };
  });
  yield put(setWeatherCached(localObject));
  const location = yield call(getUserLocation);
  const { latitude: lat, longitude: lng } = location.coords;
  yield put(setGeocoder({ lat: String(lat), lng: String(lng) }));
  if (action.api === DARKSKY) {
    yield fetchWeatherDarkSky({ lat, lng, city: '' });
  } else yield fetchWeatherStormglass({ lat, lng, city: '' });
};
export default function* watchMessages() {
  yield takeEvery('FETCH_WEATHER_FROM_DARKSKY', fetchWeatherDarkSky);
  yield takeEvery('FETCH_WEATHER_FROM_SHTORM', fetchWeatherStormglass);
  yield takeEvery('GET_CORDINATES_BY_CITY_NAME', getCoordinates);
  yield takeEvery('CHECK_INPUT_CITY', checkInputCity);
  yield takeEvery('GET_USER_COORDINATES', getUserCoordinates);
}
