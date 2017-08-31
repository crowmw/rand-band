import * as types from './actionTypes'
import axios from 'axios'
import { flickrKey } from '../config'

export const fetchRandomBandData = () => (dispatch, getState) => {
  let url = `https://en.wikipedia.org/w/api.php?`
  url += `format=json`
  url += `&origin=*`
  url += `&action=query`
  url += `&generator=random`
  url += `&grnnamespace=0`
  url += `&prop=revisions|images`
  url += `&rvprop=content`
  url += `&grnlimit=1`

  return axios
    .get(url)
    .then(res => {
      let response = res.data.query.pages[Object.keys(res.data.query.pages)[0]].title
      if (response.includes('(')) {
        return dispatch({
          type: types.FETCHING_BAND_SUCCESS,
          payload: { name: response.slice(0, response.indexOf('(')) }
        })
      }
      if (response.includes(',')) {
        return dispatch({
          type: types.FETCHING_BAND_SUCCESS,
          payload: { name: response.slice(0, response.indexOf(',')) }
        })
      }
      return dispatch({ type: types.FETCHING_BAND_SUCCESS, payload: { name: response } })
    })
    .catch(err => {
      console.error(err)
      return dispatch({
        type: types.FETCHING_BAND_ERROR,
        payload: err
      })
    })
}

export const fetchRandomAlbumTitle = () => (dispatch, getState) => {
  return axios
    .get(`https://talaikis.com/api/quotes/random/`)
    .then(res => {
      let splittedQuote = res.data.quote.split(' ')
      let wordsNumber = Math.floor(Math.random() * 5) + 1

      if (splittedQuote.length <= wordsNumber) {
        splittedQuote = splittedQuote[0].charAt(0).toUpperCase() + splittedQuote.slice(1)
        return dispatch({
          type: types.FETCHING_ALBUM_NAME_SUCCESS,
          payload: {
            title: splittedQuote.join(' ').replace('.', ''),
            quote: res.data.quote,
            author: res.data.author,
            wordsNumber
          }
        })
      } else {
        splittedQuote = splittedQuote.slice(splittedQuote.length - wordsNumber)
        splittedQuote[0] = splittedQuote[0].charAt(0).toUpperCase() + splittedQuote[0].slice(1)
        return dispatch({
          type: types.FETCHING_ALBUM_NAME_SUCCESS,
          payload: {
            title: splittedQuote.join(' ').replace('.', ''),
            quote: res.data.quote,
            author: res.data.author,
            wordsNumber
          }
        })
      }
    })
    .catch(err => {
      console.error(err)
      return dispatch({ type: types.FETCHING_ALBUM_NAME_ERROR, payload: err })
    })
}

export const fetchAlbumCover = () => (dispatch, getState) => {
  var url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent`
  url += `&format=json`
  url += `&nojsoncallback=1`
  url += `&per_page=50`
  url += `&page=${Math.floor(Math.random() * 100) + 1}`
  url += `&media=photos`
  url += `&license=1,2,3,4,5,6,7`
  url += `&extras=date_taken,date_upload,geo,license,owner_name,tags,url_o,url_l,url_c,url_z,url_n`
  url += `&sort=interestingness-desc`
  url += `&api_key=${flickrKey}`
  url += `&content_type=1`

  axios
    .get(url)
    .then(res => {
      let photos = []
      for (let photo of res.data.photos.photo) {
        photo.width_l === photo.height_l && photo.width_l >= 500 && photos.push(photo.url_l)
        photo.width_c === photo.height_c && photo.width_c >= 500 && photos.push(photo.url_c)
        photo.width_n === photo.height_n && photo.width_n >= 500 && photos.push(photo.url_n)
        photo.width_o === photo.height_o && photo.width_o >= 500 && photos.push(photo.url_o)
        photo.width_z === photo.height_z && photo.width_z >= 500 && photos.push(photo.url_z)
      }
      let imageUrl = photos[Math.floor(Math.random() * photos.length)]

      return dispatch({
        type: types.FETCHING_ALBUM_COVER_SUCCESS,
        payload: { url: imageUrl, data: 'dataURL' }
      })
    })
    .catch(err => {
      console.error(err)
      return dispatch({ type: types.FETCHING_ALBUM_COVER_ERROR, payload: err })
    })
}

export const startFetchingData = () => {
  return {
    type: types.FETCHING_STARTED
  }
}

export const endFetchingData = () => {
  return {
    type: types.FETCHING_ENDED
  }
}

export const randomize = () => (dispatch, getState) => {
  if (getState().fetching) {
    Promise.resolve()
  }

  startFetchingData()

  return Promise.all([
    dispatch(startFetchingData()),
    dispatch(fetchRandomBandData()),
    dispatch(fetchRandomAlbumTitle()),
    dispatch(fetchAlbumCover())
  ]).then(() => dispatch(endFetchingData()))
}
