import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/* {import App from './App';
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components';} */

const {
  REACT_APP_APIKEYSHTORM: apiKey,
  REACT_APP_URLCORDINATES: urlCordinates,
  REACT_APP_PROXYURL: proxyUrl,
  REACT_APP_URLDARK: urlDark,
  REACT_APP_APIKEYDARK: apiKeyDark,
  REACT_APP_URLSHTORM: urlStorm,
} = process.env;
process.env.CI = false;
const DARKSKY = 'darksky';
let buttonCheck = true;
class WeatherApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: '',
      api: DARKSKY,
      inputValue: '',
      lat: '',
      lng: '',
      windSpeed: '',
      summary: '',
      weatherState: {},
    };
  }

  componentDidMount() {
    Object.keys(localStorage).forEach((value) => {
      this.setState((state) => ({
        weatherState: {
          ...state.weatherState,
          [value]: {
            ...JSON.parse(localStorage.getItem(value)),
          },
        },
      }));
    });
    console.log(localStorage);
    console.log(this.state);
    navigator.geolocation.getCurrentPosition(
      this.successHandler,
      this.errorHandler,
    );
  }

  getClickHandler(key) {
    const { api } = this.state;
    const {
      weatherState: { [key]: cachedWeather },
    } = this.state;
    const { weatherState: stateWeather } = this.state;
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
    const { inputValue } = this.state;
    let json;
    const response = await fetch(`${proxyUrl}${urlCordinates}${inputValue}?json=1`);
    if (response.ok) {
      json = await response.json();
    } else {
      alert(`Ошибка HTTP: ${response.status}`);
    }
    this.setState({ lat: json.latt });
    this.setState({ lng: json.longt });
    console.log(json);
    if (json.error) alert('Вы точно ввели корректный город ?');
  };

  successHandler = (position) => {
    const { api } = this.state;
    this.setState({ lat: position.coords.latitude });
    this.setState({ lng: position.coords.longitude });
    if (api === DARKSKY) {
      this.getWeatherFromDarkSky();
    } else this.getWeatherFromStormglass();
  };

  // Error Handler
  errorHandler = (positionError) => {
    if (positionError.code === positionError.PERMISSION_DENIED) {
      alert('Error: Permission Denied!');
    } else if (positionError.code === positionError.POSITION_UNAVAILABLE) {
      alert('Error: Position Unavailable!');
    } else if (positionError.code === positionError.TIMEOUT) {
      alert('Error: Timeout!');
    }
  };

  checkInputValue = (event) => {
    event.preventDefault();
    this.setState({ inputValue: event.target.value });
  };

  checkInputCityValue = async (event) => {
    buttonCheck = false;
    const { inputValue } = this.state;
    event.preventDefault();
    if (inputValue === '') {
      navigator.geolocation.getCurrentPosition(
        this.successHandler,
        this.errorHandler,
      );
    } else {
      await this.getCordinatesByCityName();
    }
    buttonCheck = true;
    if (await this.getClickHandler(inputValue)) {
      const {
        weatherState: { [inputValue]: cachedWeather },
      } = this.state;
      this.setState({
        temperature: cachedWeather.temperature,
      });
      this.setState({
        summary: cachedWeather.summary,
      });
      this.setState({
        windSpeed: cachedWeather.windSpeed,
      });
    }
  };

  checkSelect = async (event) => {
    event.preventDefault();
    this.setState({ api: event.target.value });
  };

  getWeatherFromDarkSky = async () => {
    const { inputValue, lat, lng } = this.state;
    const response = await fetch(`${proxyUrl}${urlDark}${apiKeyDark}${lat},${lng}?units=si`);
    const answer = await response.json();
    this.setState({ summary: answer.currently.summary });
    this.setState({ windSpeed: Math.round(answer.currently.windSpeed) });
    this.setState({ temperature: Math.round(answer.currently.temperature) });
    console.log(answer);
    const now = new Date();
    this.setState((state) => ({
      weatherState: {
        ...state.weatherState,
        [inputValue]: {
          temperature: Math.round(answer.currently.temperature),
          windSpeed: Math.round(answer.currently.windSpeed),
          summary: answer.currently.summary,
          dateTime: now,
        },
      },
    }));
    const {
      weatherState: { [inputValue]: cachedWeather },
    } = this.state;
    console.log(this.state);
    localStorage.setItem(inputValue, JSON.stringify(cachedWeather));
  };

  getWeatherFromStormglass = async () => {
    const {
      inputValue, summary, lat, lng,
    } = this.state;
    const date = new Date();
    const a = date.toISOString();
    const response = await fetch(`${proxyUrl}${urlStorm}lat=${lat}&lng=${lng}&start=${a}&end=${a}`, {
      headers: {
        Authorization: apiKey,
      },
    });
    const json = await response.json();
    if (
      json.hours[0].precipitation[0].value > 1.1
      && json.hours[0].airTemperature[0].value > 0
    ) {
      this.setState({ summary: 'Heavy rain' });
    } else if (
      json.hours[0].precipitation[0].value > 0
      && json.hours[0].precipitation[0].value <= 1.1
      && json.hours[0].airTemperature[0].value > 0
    ) {
      this.setState({ summary: 'Light Rain' });
    } else if (
      json.hours[0].precipitation[0].value > 0.8
      && json.hours[0].airTemperature[0].value < 0
    ) {
      this.setState({ summary: 'Heavy snow' });
    } else if (
      json.hours[0].precipitation[0].value > 0
      && json.hours[0].precipitation[0].value <= 0.8
      && json.hours[0].airTemperature[0].value < 0
    ) {
      this.setState({ summary: 'Light snow' });
    } else if (json.hours[0].cloudCover[0].value > 80) {
      this.setState({ summary: 'cloudy' });
    } else {
      this.setState({ summary: 'Clear' });
    }

    this.setState({ windSpeed: Math.round(json.hours[0].windSpeed[0].value) });
    this.setState({
      temperature: Math.round(json.hours[0].airTemperature[0].value),
    });
    console.log(json);
    const now = new Date();

    this.setState((state) => ({
      weatherState: {
        ...state.weatherState,
        [inputValue]: {
          temperature: Math.round(json.hours[0].airTemperature[0].value),
          windSpeed: Math.round(json.hours[0].windSpeed[0].value),
          summary,
          dateTime: now,
        },
      },
    }));
    const {
      weatherState: { [inputValue]: cachedWeather },
    } = this.state;
    localStorage.setItem(inputValue, JSON.stringify(cachedWeather));
  };

  render() {
    const { temperature, windSpeed, summary } = this.state;
    return (
      <div className="roditel">
        <header>Welcome</header>
        <div className="container">
          <div className="divStyle">
            <div>
              <div>
                <input
                  className="inputClass"
                  placeholder="Input city"
                  type="text"
                  onChange={this.checkInputValue}
                />
              </div>
              <div>
                <button
                  type="button"
                  className={
                    buttonCheck ? 'buttonClick' : 'buttonDisabled'
                  }
                  onClick={this.checkInputCityValue}
                  disabled={!buttonCheck}
                >
                  Weather
                </button>
              </div>
              <select className="selectClass" onChange={this.checkSelect}>
                <option value="darksky">api.darsky.net</option>
                <option value="stormglass">api.stormglass.io</option>
              </select>
            </div>
            <div>
              <p className="pClass">
temperature :
                {temperature}
              </p>
              <p className="pClass">
Wind Speed :
                {windSpeed}
              </p>
              <p className="pClass">{summary}</p>
            </div>
          </div>
        </div>
        <footer>27.02.2020</footer>
      </div>
    );
  }
}
ReactDOM.render(<WeatherApi />, document.getElementById('root'));
