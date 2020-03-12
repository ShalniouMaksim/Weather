import React from 'react';
import { createLogger } from 'redux-logger';
import ReactDOM from 'react-dom';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './redusers';
import Weather from './container';
import watchMessages from './sagas';


const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({ collapsed: true });
const store = createStore(reducer, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(watchMessages);


ReactDOM.render(
  <Provider store={store}>
    <Weather />
  </Provider>,
  document.getElementById('root'),
);
