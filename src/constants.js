export const {
  REACT_APP_APIKEYSHTORM: apiKey,
  REACT_APP_URLCORDINATES: urlCordinates,
  REACT_APP_PROXYURL: proxyUrl,
  REACT_APP_URLDARK: urlDark,
  REACT_APP_APIKEYDARK: apiKeyDark,
  REACT_APP_URLSHTORM: urlStorm,
} = process.env;
process.env.CI = false;
export const DARKSKY = 'darksky';
