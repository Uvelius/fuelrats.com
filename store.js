// Module imports
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Redux DevTools?
import { persistState } from 'redux-devtools'
import ReduxDevTools from './components/ReduxDevTools'





// Component imports
import actionTypes from './store/actionTypes'
import initialState from './store/initialState'
import reducer from './store/reducers/index'

/* actions */
import * as authenticationActions from './store/actions/authentication'
import * as blogsActions from './store/actions/blogs'
import * as dialogActions from './store/actions/dialog'
import * as paperworkActions from './store/actions/paperwork'
import * as ratsActions from './store/actions/rats'
import * as rescuesActions from './store/actions/rescues'
import * as rescuesByRatActions from './store/actions/rescuesByRat'
import * as rescuesBySystemActions from './store/actions/rescuesBySystem'
import * as rescuesOverTimeActions from './store/actions/rescuesOverTime'
import * as userActions from './store/actions/user'





export const actions = Object.assign(
  {},
  authenticationActions,
  blogsActions,
  dialogActions,
  paperworkActions,
  ratsActions,
  rescuesActions,
  rescuesByRatActions,
  rescuesBySystemActions,
  rescuesOverTimeActions,
  userActions,
)





export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, compose(
    applyMiddleware(thunkMiddleware),
    ReduxDevTools.instrument()
//    persistState(getDebugSessionKey())
  ))
}





function getDebugSessionKey () {
  if (window) {
    const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
    return (matches && matches.length > 0) ? matches[1] : null
  }

  return null
}
