
import React from 'react';
import PropTypes from 'prop-types';


/* {import App from './App';
import * as serviceWorker from './serviceWorker';} */
import {
  DARKSKY,
} from './constants';

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

export default class WeatherApi extends React.Component {
  componentDidMount() {
    const { getUserCoordinates } = this.props;
    getUserCoordinates();
  }

  getCordinatesByCityName = () => {
    const {
      city, api, getCoordinatesByName,
    } = this.props;
    getCoordinatesByName({ city, api });
  };

  checkInputValue = (event) => {
    const { setCity } = this.props;
    setCity(event.target.value);
  };

  checkInputCityValue = () => {
    const {
      checkInputCity,
      weatherState: stateWeather,
      api, city, weatherState: { [city]: cachedWeather },
    } = this.props;
    checkInputCity({
      api, city, cachedWeather, stateWeather,
    });
  }

  checkSelect = (event) => {
    const { setCurrentApi } = this.props;
    setCurrentApi(event.target.value);
  };

  getWeatherFromDarkSky = () => {
    const {
      city, lat, lng, fetchWeatherFromDarkSky,
    } = this.props;
    fetchWeatherFromDarkSky({ lat, lng, city });
  };

  getWeatherFromStormglass = () => {
    const {
      city, lat, lng, fetchWeatherFromStorm,
    } = this.props;
    fetchWeatherFromStorm({ lat, lng, city });
  };

  render() {
    const {
      temperature, windSpeed, summary, loadingWeather, loadingGeocoder,
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
                  active={(loadingWeather || loadingGeocoder)}
                  type="button"
                  onClick={this.checkInputCityValue}
                  disabled={(loadingWeather || loadingGeocoder)}
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
Temperature :
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
WeatherApi.propTypes = {
  api: PropTypes.string,
  city: PropTypes.string,
  lat: PropTypes.string,
  lng: PropTypes.string,
  temperature: PropTypes.number,
  windSpeed: PropTypes.number,
  summary: PropTypes.string,
  loadingWeather: PropTypes.bool,
  loadingGeocoder: PropTypes.bool,
  fetchWeatherFromDarkSky: PropTypes.func,
  fetchWeatherFromStorm: PropTypes.func,
  checkInputCity: PropTypes.func,
  getCoordinatesByName: PropTypes.func,
  getUserCoordinates: PropTypes.func,
  setCity: PropTypes.func,
  setCurrentApi: PropTypes.func,
  weatherState: PropTypes.objectOf(PropTypes.shape()),
};
WeatherApi.defaultProps = {
  api: DARKSKY,
  city: '',
  lat: '',
  lng: '',
  temperature: null,
  windSpeed: null,
  summary: '',
  loadingWeather: true,
  loadingGeocoder: true,
  fetchWeatherFromDarkSky: () => {},
  fetchWeatherFromStorm: () => {},
  checkInputCity: () => {},
  getCoordinatesByName: () => {},
  getUserCoordinates: () => {},
  setCity: () => {},
  setCurrentApi: () => {},
  weatherState: {},
};
