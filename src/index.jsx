import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Weather, store } from './weather';


ReactDOM.render(
  <Provider store={store}>
    <Weather />
  </Provider>,
  document.getElementById('root'),
);
