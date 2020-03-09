
import React from 'react';
import { connect } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
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
  mapDispatchToProps,
  mapStateToProps,
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

const logger = createLogger({ collapsed: true });
export const store = createStore(reducer, applyMiddleware(logger));
class WeatherApi extends React.Component {
  componentDidMount() {
    const { setCurrentApi, setСachedData } = this.props;
    setCurrentApi(DARKSKY);
    Object.keys(localStorage).forEach((value) => {
      setСachedData(value, {
        ...JSON.parse(localStorage.getItem(value)),
      });
    });
    navigator.geolocation.getCurrentPosition(
      this.successHandler,
      this.errorHandler,
    );
  }

  getClickHandler(key) {
    const { api } = this.props;
    const {
      weatherState: { [key]: cachedWeather},
    } = this.props;
    const { weatherState: stateWeather } = this.props;
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
    const {
      geocoderLoadingStarted,
      geocoderLoadingSuccess,
      geocoderLoadingFailure,
    } = this.props;
    geocoderLoadingStarted();
    const { city } = this.props;
    let json;
    const response = await fetch(
      `${proxyUrl}${urlCordinates}${city}?json=1`,
    );
    if (response.ok) {
      json = await response.json();
      geocoderLoadingSuccess({
        lat: json.latt,
        lng: json.longt,
      });
      if (json.error) alert('Вы точно ввели корректный город ?');
    } else {
      geocoderLoadingFailure();
    }
  };

  successHandler = (position) => {
    const {
      geocoderLoadingStarted,
      geocoderLoadingSuccess,
    } = this.props;
    geocoderLoadingStarted();
    const { api } = this.props;
    geocoderLoadingSuccess({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    if (api === DARKSKY) {
      this.getWeatherFromDarkSky();
    } else this.getWeatherFromStormglass();
  };

  errorHandler = (positionError) => {
    const { geocoderLoadingFailure } = this.props;
    if (positionError.code === positionError.PERMISSION_DENIED) {
      geocoderLoadingFailure();
    } else if (positionError.code === positionError.POSITION_UNAVAILABLE) {
      geocoderLoadingFailure();
    } else if (positionError.code === positionError.TIMEOUT) {
      geocoderLoadingFailure();
    }
  };

  checkInputValue = (event) => {
    const { setCity } = this.props;
    event.preventDefault();
    setCity(event.target.value);
  };

  checkInputCityValue = async (event) => {
    const { weatherLoadingSuccess } = this.props;
    const { city } = this.props;
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
      } = this.props;
      weatherLoadingSuccess({
        temperature: cachedWeather.temperature,
        summary: cachedWeather.summary,
        windSpeed: cachedWeather.windSpeed,
      });
    }
  };

  checkSelect = async (event) => {
    const { setCurrentApi } = this.props;
    event.preventDefault();
    setCurrentApi(event.target.value);
  };

  getWeatherFromDarkSky = async () => {
    const {
      weatherLoadingStarted,
      weatherLoadingSuccess,
      weatherLoadingFailure,
      setСachedData,
    } = this.props;
    weatherLoadingStarted();
    const { city, lat, lng } = this.props;
    let response;
    try {
      response = await fetch(
        `${proxyUrl}${urlDark}${apiKeyDark}${lat},${lng}?units=si`,
      );
      if (response.ok) {
        const answer = await response.json();
        weatherLoadingSuccess({
          summary: answer.currently.summary,
          windSpeed: Math.round(answer.currently.windSpeed),
          temperature: Math.round(answer.currently.temperature),
        });
        setСachedData(city, {
          temperature: Math.round(answer.currently.temperature),
          windSpeed: Math.round(answer.currently.windSpeed),
          summary: answer.currently.summary,
          dateTime: new Date(),
        });
        const {
          weatherState: { [city]: cachedWeather },
        } = this.props;
        localStorage.setItem(city, JSON.stringify(cachedWeather));
      } else throw new Error(response.statusText);
    } catch (err) {
      weatherLoadingFailure();
    }
  };

  getWeatherFromStormglass = async () => {
    const {
      weatherLoadingStarted,
      weatherLoadingSuccess,
      weatherLoadingFailure,
      setСachedData,
    } = this.props;
    weatherLoadingStarted();
    const {
      city, summary, lat, lng,
    } = this.props;
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
        weatherLoadingSuccess({
          summary: summarryLet,
          windSpeed: Math.round(json.hours[0].windSpeed[0].value),
          temperature: Math.round(json.hours[0].airTemperature[0].value),
        });
        setСachedData(city, {
          temperature: Math.round(json.hours[0].airTemperature[0].value),
          windSpeed: Math.round(json.hours[0].windSpeed[0].value),
          summary,
          dateTime: new Date(),
        });
        const {
          weatherState: { [city]: cachedWeather },
        } = this.props;
        localStorage.setItem(city, JSON.stringify(cachedWeather));
      } else throw new Error(response.statusText);
    } catch (err) {
      weatherLoadingFailure();
    }
  };

  render() {
    const {
      temperature, windSpeed, summary, loading,
    } = this.props;
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

export const Weather = connect(mapStateToProps, mapDispatchToProps)(WeatherApi);
