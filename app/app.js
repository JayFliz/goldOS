/**
 *
 * app.js
 *
 * This is the entry file for the application, mostly just setup and boilerplate
 * code. Routes are configured at the end of this file!
 *
 */

import 'babel-polyfill';

// Load the manifest.json file and the .htaccess file
import 'file?name=[name].[ext]!./manifest.json';
import 'file?name=[name].[ext]!./.htaccess';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
// import FontFaceObserver from 'fontfaceobserver';
import { browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';
import { fromJS } from 'immutable';
import { compose } from 'ramda';
const reduxRouterMiddleware = syncHistory(browserHistory);

// Observer loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
import styles from './containers/App/styles.css';
// const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add the js-open-sans-loaded class to the body
// openSansObserver.check().then(() => {
//   document.body.classList.add(styles.jsOpenSansLoaded);
// }, () => {
//   document.body.classList.remove(styles.jsOpenSansLoaded);
// });


/*
*   Create the store with two middlewares :
*   1. redux-thunk : Allow us to asynchronous things in the actions
*   2. reduxRouterMiddleware : Sync dispatched route actions to the history
*/

import rootReducer from './rootReducer';
const createStoreWithMiddleware = compose(
  applyMiddleware(reduxRouterMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = createStoreWithMiddleware(rootReducer, fromJS({}));
reduxRouterMiddleware.listenForReplays(store, (state) => state.get('route').location);

// Make reducers hot reloadable, see http://mxs.is/googmo
if (module.hot) {
  module.hot.accept('./rootReducer', () => {
    const nextRootReducer = require('./rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}
import routes from './routes';

// Mostly boilerplate, except for the Routes. These are the pages you can go to,
// which are all wrapped in the App component, which contains the navigation etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the require.ensure code splitting business
ReactDOM.render(
  <Provider store={store}>
    <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
);