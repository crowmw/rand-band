import { combineReducers } from 'redux'
import * as types from '../actions/actionTypes'

export const initialState = {
  fetching: false,
  band: null,
  album: null,
  cover: null
}

export const fetching = (state = initialState.fetching, action) => {
  switch (action.type) {
    case types.FETCHING_STARTED:
      return true
    case types.FETCHING_ENDED:
      return false
    default:
      return state
  }
}

export const band = (state = initialState.band, action) => {
  switch (action.type) {
    case types.FETCHING_BAND_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export const album = (state = initialState.album, action) => {
  switch (action.type) {
    case types.FETCHING_ALBUM_NAME_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export const cover = (state = initialState.cover, action) => {
  switch (action.type) {
    case types.FETCHING_ALBUM_COVER_SUCCESS:
      return action.payload
    default:
      return state
  }
}

const rootReducer = combineReducers({
  fetching,
  band,
  album,
  cover
})

export default rootReducer
