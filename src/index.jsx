import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/* {import App from './App';
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components'} */

class WeatherApi extends React.Component {
  clickHandlers = {};

  constructor(props) {
    super(props);
    this.state = {
      temperature: '',
      api: 'darksky',
      inputValue: '',
      lat: '',
      lng: '',
      windSpeed: '',
      summary: '',
      buttonCheck: true,
      className: 'buttonClick',
    };
  }

  componentDidMount() {
    Object.keys(localStorage).forEach((value) => {
      this.clickHandlers[value] = JSON.parse(localStorage.getItem(value));
    });
    console.log(this.clickHandlers);
    navigator.geolocation.getCurrentPosition(
      this.successHandler,
      this.errorHandler,
    );
  }

  getClickHandler(key) {
    const { api } = this.state;
    if (Object.prototype.hasOwnProperty.call(this.clickHandlers, key)) {
      const dateNow = new Date();
      const dateTime = new Date(this.clickHandlers[key].dateTime);
      dateTime.setMilliseconds(2 * 60 * 60 * 1000);
      if (dateTime.getTime() > dateNow.getTime()) {
        return this.clickHandlers[key];
      }
      if (api === 'darksky') {
        this.getWeatherFromDarkSky();
      } else this.getWeatherFromStormglass();
    } else if (api === 'darksky') {
      this.getWeatherFromDarkSky();
    } else this.getWeatherFromStormglass();
    return this.clickHandlers[key];
  }

  getCordinatesByCityName = async () => {
    const { inputValue } = this.state;
    let json;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `https://geocode.xyz/${inputValue}?json=1`;
    const response = await fetch(proxyUrl + url);
    if (response.ok) {
      json = await response.json();
    } else {
      alert(`Ошибка HTTP: ${response.status}`);
    }
    this.setState({ lat: json.latt });
    this.setState({ lng: json.longt });
  };

  successHandler = (position) => {
    const { api } = this.state;
    this.setState({ lat: position.coords.latitude });
    this.setState({ lng: position.coords.longitude });
    if (api === 'darksky') {
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
    const { inputValue } = this.state;
    this.setState({ buttonCheck: false });
    this.setState({ className: 'buttonDisabled' });
    event.preventDefault();
    if (inputValue === '') {
      navigator.geolocation.getCurrentPosition(
        this.successHandler,
        this.errorHandler,
      );
    } else {
      await this.getCordinatesByCityName();
    }
    if (await this.getClickHandler(inputValue)) {
      this.setState({
        temperature: this.clickHandlers[inputValue].temperature,
      });
      this.setState({
        summary: this.clickHandlers[inputValue].summary,
      });
      this.setState({
        windSpeed: this.clickHandlers[inputValue].windSpeed,
      });
    }
    this.setState({ buttonCheck: true });
    this.setState({ className: 'buttonClick' });
  };

  checkSelect = async (event) => {
    event.preventDefault();
    this.setState({ api: event.target.value });
  };

  getWeatherFromDarkSky = async () => {
    const {
      inputValue,
      lat,
      lng,
    } = this.state;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `https://api.darksky.net/forecast/41978216b30014d67f247239f930b083/${lat},${lng}?units=si`;
    const response = await fetch(proxyUrl + url);
    const answer = await response.json();
    this.setState({ summary: answer.currently.summary });
    this.setState({ windSpeed: Math.round(answer.currently.windSpeed) });
    this.setState({ temperature: Math.round(answer.currently.temperature) });
    console.log(answer);
    const now = new Date();
    this.clickHandlers[inputValue] = {
      temperature: Math.round(answer.currently.temperature),
      windSpeed: Math.round(answer.currently.windSpeed),
      summary: answer.currently.summary,
      dateTime: now,
    };
    console.log(inputValue, this.clickHandlers[inputValue]);
    localStorage.setItem(
      inputValue,
      JSON.stringify(this.clickHandlers[inputValue]),
    );
  };

  getWeatherFromStormglass = async () => {
    const {
      inputValue,
      summary,
      lat,
      lng,
    } = this.state;
    const date = new Date();
    const a = date.toISOString();

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `https://api.stormglass.io/v1/weather/point?lat=${lat}&lng=${lng}&start=${a}&end=${a}`;
    const response = await fetch(proxyUrl + url, {
      headers: {
        Authorization:
          'e61f042a-5251-11ea-ac48-0242ac130007-e61f04f2-5251-11ea-ac48-0242ac130007',
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
    this.clickHandlers[inputValue] = {
      temperature: Math.round(json.hours[0].airTemperature[0].value),
      windSpeed: Math.round(json.hours[0].windSpeed[0].value),
      summary,
      dateTime: now,
    };
    localStorage.setItem(
      inputValue,
      JSON.stringify(this.clickHandlers[inputValue]),
    );
  };

  render() {
    const {
      temperature,
      windSpeed,
      summary,
      buttonCheck,
      className,
    } = this.state;
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
                  className={className}
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
