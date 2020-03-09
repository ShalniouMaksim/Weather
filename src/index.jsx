import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import reducer from './redusers';
/* {import App from './App';
import * as serviceWorker from './serviceWorker';} */
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
  weatherLoadingSuccess,
  weatherLoadingFailure,
  weatherLoadingStarted,
  geocoderLoadingSuccess,
  geocoderLoadingFailure,
  geocoderLoadingStarted,
  setCurrentApi,
  setCity,
  setСachedData,
} from './actions';
import {
  Select,
  BorderItem,
  LayoutItem,
  Container,
  Header,
  Footer,
  Button,
  Input,
} from './styled';
import { GlobalStyle } from './globalstyles';

const store = createStore(reducer);
class WeatherApi extends React.Component {
  componentDidMount() {
    store.dispatch(setCurrentApi('darksky'));
    Object.keys(localStorage).forEach((value) => {
      store.dispatch(setСachedData(value, {
        ...JSON.parse(localStorage.getItem(value)),
      }));
    });
    console.log(localStorage);
    navigator.geolocation.getCurrentPosition(
      this.successHandler,
      this.errorHandler,
    );
  }

  getClickHandler(key) {
    const { api } = store.getState();
    const {
      weatherState: { [key]: cachedWeather },
    } = store.getState();
    const { weatherState: stateWeather } = store.getState();
    if (Object.prototype.hasOwnProperty.call(stateWeather, key)) {
      const dateNow = new Date();
      const dateTime = new Date(cachedWeather.dateTime);
      dateTime.setMilliseconds(2 * 60 * 60 * 1000);
      if (dateTime.getTime() > dateNow.getTime()) {
        return cachedWeather;
      }
      if (api === DARKSKY) {
        this.getWeatherFromDarkSky();
      } else this.getWeatherFromStormglass();
    } else if (api === DARKSKY) {
      this.getWeatherFromDarkSky();
    } else this.getWeatherFromStormglass();
    return cachedWeather;
  }

  getCordinatesByCityName = async () => {
    store.dispatch(geocoderLoadingStarted());
    const { city } = store.getState();
    let json;
    const response = await fetch(
      `${proxyUrl}${urlCordinates}${city}?json=1`,
    );
    if (response.ok) {
      json = await response.json();
      store.dispatch(geocoderLoadingSuccess({
        lat: json.latt,
        lng: json.longt,
      }));
      console.log(json);
      if (json.error) alert('Вы точно ввели корректный город ?');
    } else {
      store.dispatch(geocoderLoadingFailure());
    }
  };

  successHandler = (position) => {
    store.dispatch(geocoderLoadingStarted());
    const { api } = store.getState();
    store.dispatch(geocoderLoadingSuccess({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }));
    if (api === DARKSKY) {
      this.getWeatherFromDarkSky();
    } else this.getWeatherFromStormglass();
  };

  errorHandler = (positionError) => {
    if (positionError.code === positionError.PERMISSION_DENIED) {
      store.dispatch(geocoderLoadingFailure());
    } else if (positionError.code === positionError.POSITION_UNAVAILABLE) {
      store.dispatch(geocoderLoadingFailure());
    } else if (positionError.code === positionError.TIMEOUT) {
      store.dispatch(geocoderLoadingFailure());
    }
  };

  checkInputValue = (event) => {
    event.preventDefault();
    store.dispatch(setCity(event.target.value));
  };

  checkInputCityValue = async (event) => {
    const { city } = store.getState();
    event.preventDefault();
    if (city === '') {
      navigator.geolocation.getCurrentPosition(
        this.successHandler,
        this.errorHandler,
      );
    } else {
      await this.getCordinatesByCityName();
    }
    if (await this.getClickHandler(city)) {
      const {
        weatherState: { [city]: cachedWeather },
      } = store.getState();
      store.dispatch(weatherLoadingSuccess({
        temperature: cachedWeather.temperature,
        summary: cachedWeather.summary,
        windSpeed: cachedWeather.windSpeed,
      }));
      this.setState(store.getState());
    }
    console.log(store.getState());
  };

  checkSelect = async (event) => {
    event.preventDefault();
    store.dispatch(setCurrentApi(event.target.value));
  };

  getWeatherFromDarkSky = async () => {
    store.dispatch(weatherLoadingStarted());
    const { city, lat, lng } = store.getState();
    let response;
    try {
      response = await fetch(
        `${proxyUrl}${urlDark}${apiKeyDark}${lat},${lng}?units=si`,
      );
      if (response.ok) {
        const answer = await response.json();
        store.dispatch(weatherLoadingSuccess({
          summary: answer.currently.summary,
          windSpeed: Math.round(answer.currently.windSpeed),
          temperature: Math.round(answer.currently.temperature),
        }));
        console.log(answer);
        store.dispatch(setСachedData(city, {
          temperature: Math.round(answer.currently.temperature),
          windSpeed: Math.round(answer.currently.windSpeed),
          summary: answer.currently.summary,
          dateTime: new Date(),
        }));
        const {
          weatherState: { [city]: cachedWeather },
        } = store.getState();
        console.log(store.getState());
        localStorage.setItem(city, JSON.stringify(cachedWeather));
        console.log(localStorage);
        this.setState({});
      } else throw new Error(response.statusText);
    } catch (err) {
      store.dispatch(weatherLoadingFailure());
    }
  };

  getWeatherFromStormglass = async () => {
    store.dispatch(weatherLoadingStarted());
    const {
      city, summary, lat, lng,
    } = store.getState();
    const date = new Date();
    const a = date.toISOString();
    let response;
    try {
      response = await fetch(
        `${proxyUrl}${urlStorm}lat=${lat}&lng=${lng}&start=${a}&end=${a}`,
        {
          headers: {
            Authorization: apiKey,
          },
        },
      );
      if (response.ok) {
        const json = await response.json();
        let summarryLet;
        if (
          json.hours[0].precipitation[0].value > 1.1
          && json.hours[0].airTemperature[0].value > 0
        ) {
          summarryLet = 'Heavy rain';
        } else if (
          json.hours[0].precipitation[0].value > 0
          && json.hours[0].precipitation[0].value <= 1.1
          && json.hours[0].airTemperature[0].value > 0
        ) {
          summarryLet = 'Light Rain';
        } else if (
          json.hours[0].precipitation[0].value > 0.8
          && json.hours[0].airTemperature[0].value < 0
        ) {
          summarryLet = 'Heavy snow';
        } else if (
          json.hours[0].precipitation[0].value > 0
          && json.hours[0].precipitation[0].value <= 0.8
          && json.hours[0].airTemperature[0].value < 0
        ) {
          summarryLet = 'Light snow';
        } else if (json.hours[0].cloudCover[0].value > 80) {
          summarryLet = 'cloudy';
        } else {
          summarryLet = 'Clear';
        }
        store.dispatch(weatherLoadingSuccess({
          summary: summarryLet,
          windSpeed: Math.round(json.hours[0].windSpeed[0].value),
          temperature: Math.round(json.hours[0].airTemperature[0].value),
        }));
        store.dispatch(setСachedData(city, {
          temperature: Math.round(json.hours[0].airTemperature[0].value),
          windSpeed: Math.round(json.hours[0].windSpeed[0].value),
          summary,
          dateTime: new Date(),
        }));
        const {
          weatherState: { [city]: cachedWeather },
        } = store.getState();
        localStorage.setItem(city, JSON.stringify(cachedWeather));
      } else throw new Error(response.statusText);
    } catch (err) {
      store.dispatch(weatherLoadingFailure());
    }
  };

  render() {
    console.log(store.getState());
    const {
      temperature, windSpeed, summary, loading,
    } = store.getState();
    return (
      <Container>
        <GlobalStyle />
        <Header>Welcome</Header>
        <LayoutItem>
          <BorderItem>
            <div>
              <div>
                <Input
                  placeholder="Input city"
                  type="text"
                  onChange={this.checkInputValue}
                />
              </div>
              <div>
                <Button
                  active={loading}
                  type="button"
                  onClick={this.checkInputCityValue}
                  disabled={loading}
                >
                  Weather
                </Button>
              </div>
              <Select onChange={this.checkSelect}>
                <option value="darksky">api.darsky.net</option>
                <option value="stormglass">api.stormglass.io</option>
              </Select>
            </div>
            <div>
              <p>
temperature :
                {temperature}
              </p>
              <p>
Wind Speed :
                {windSpeed}
              </p>
              <p>{summary}</p>
            </div>
          </BorderItem>
        </LayoutItem>
        <Footer>27.02.2020</Footer>
      </Container>
    );
  }
}
ReactDOM.render(<WeatherApi store={store} />, document.getElementById('root'));
export default connect()(WeatherApi);
