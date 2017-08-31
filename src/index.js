import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import './index.css'
import Search from './components/search/search'
import registerServiceWorker from './registerServiceWorker'

import reducers from './reducers'
import thunk from 'redux-thunk'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Search />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
