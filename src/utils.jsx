export const getUserLocation = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (location) => resolve(location),
    (error) => reject(error),
  );
});

export const setToLocalStorage = function setToLocalStorage(city, temperature, windSpeed, summary) {
  localStorage.setItem(city, JSON.stringify({
    temperature: Math.round(temperature),
    windSpeed: Math.round(windSpeed),
    summary,
    dateTime: new Date(),
  }));
};

export const getToLocalStorage = function getToLocalStorage() {
  let localObject = {};
  Object.keys(localStorage).forEach((value) => {
    localObject = {
      ...localObject,
      [value]: JSON.parse(localStorage.getItem(value)),
    };
  });
  return localObject;
};

export const checkErrorFetch = function checkErrorFetch(errorWeather, errorGeocoder) {
  if (errorWeather) alert('Ошибка погоды');
  if (errorGeocoder) alert('Ошибка геокодера');
};
