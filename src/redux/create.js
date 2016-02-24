import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { syncHistory } from 'react-router-redux';
import { fromJS } from 'immutable';

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = syncHistory(history);

  const middleware = [createMiddleware(client), reduxRouterMiddleware];

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const reducer = require('./modules/reducer');
  data = fromJS({});
  const store = finalCreateStore(reducer, data);

  reduxRouterMiddleware.listenForReplays(store, (state) => {
    return state.getIn(['route', 'location']).toJS();
  });

  // console.log(store.getState());

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
